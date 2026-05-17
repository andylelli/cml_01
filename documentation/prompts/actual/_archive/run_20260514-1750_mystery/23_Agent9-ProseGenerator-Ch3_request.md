# Actual Prompt Record

- Run ID: `mystery-1778781007262`
- Project ID: ``
- Timestamp: `2026-05-14T17:55:48.839Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e717efd137b0367b`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a family secret, raising questions about loyalty versus justice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1930-03
In March 1930, the world is slowly shaking off the remnants of winter, though the air remains cool and damp, a typical early spring in the English countryside. Overcast skies loom overhead, and intermittent showers patter softly on the estate windows, creating a tense atmosphere within the grand country house. Guests, gathered for a weekend of leisure and camaraderie, find themselves enveloped in a sense of foreboding, as discussions turn to the economic strains of the Great Depression and the unsettling political climate sweeping across Europe. With St. Patrick's Day just around the corner, the estate staff prepares for an evening of celebration, unaware of the dark events that will soon unfold among the guests. Fashion during this time reflects both elegance and practicality. Men don tailored wool suits, often accompanied by crisp dress shirts and bow ties, while casual wear includes tweed jackets and knitted vests, perfect for the unpredictable weather. Women, on the other hand, embrace the trend of dropping waistlines in their satin evening gowns and cloche hats, accessorized with pearls and beaded handbags. The Art Deco influence permeates their attire, echoing the glamorous films of the day. As the guests navigate the social rituals of afternoon tea and evening card games, the tension is palpable, and the sharpness of their attire contrasts with the somber discussions about the state of the world.
Emotional register: A collective sense of unease and anxiety permeates society, as people grapple with the uncertainty of their future.
Physical constraints: Travel limited by fuel shortages and economic constraints | Communication hampered by reliance on landlines and postal services | Social gatherings restricted by class divisions and the need for decorum
Current tensions (weave into background texture): Economic pressures from the Great Depression | Discussions of unemployment relief measures in Parliament | Growing interest in fascist movements across Europe
Wartime context — Limited military engagement, with many men returning from service seeking work.: A growing divide between the upper and working classes is evident, with the latter facing increasing desperation. Absence effect: The absence of men in the workforce due to economic downturns creates a sense of instability and vulnerability.

## Story Theme
The intricate dance of social ambition and desperation leads to betrayal, revealing how the pursuit of status can cloud morality and unravel lives, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A deepening sense of foreboding and tension permeates the narrative.

Arc:
The story opens against the backdrop of a lavish gathering at Little Middleton Manor, where the air feels heavy with secrets and societal pressures. The murder of Eleanor Voss shatters the superficial charm of the evening, plunging the guests into chaos and suspicion. As the investigation unfolds, the initial clues surface, revealing discrepancies that raise more questions than answers. Each character grapples with their own motivations and fears, leading to a growing emotional cost as the stakes escalate. Midway through, a pivotal moment shifts the focus of the investigation, as characters confront their hidden truths and past grievances come to light. The atmosphere thickens with tension as alliances shift and suspicions deepen, culminating in a climactic confrontation that forces the characters to face the consequences of their choices. In the resolution, the emotional toll becomes apparent, leaving each character altered by the revelations and the darkness that lurks beneath their polished façades. The ending carries a poignant weight, as the characters are left to reckon with the aftermath of their ambitions and the fragility of their social standings.

The story opens: A sense of opulence mingles with an underlying tension, hinting at deeper issues. As the investigation takes shape: The shock of murder disrupts the facade, igniting suspicion and fear. A first key turn arrives: Initial investigations reveal conflicting accounts, heightening anxiety among guests. At the mid-point of the story: A critical revelation shifts focus, forcing characters to confront their pasts.

A second pivot reshapes the course: The mounting pressure leads to a confrontation filled with emotional stakes. As tension reaches its height: Tensions reach a fever pitch as truths and lies intertwine. The climax brings the central question to a head: The culmination of secrets unfolds in a dramatic confrontation. In the final resolution: The aftermath leaves characters grappling with the weight of their choices.

Underpinning every turn is the story's central concern: The intricate dance of social ambition and desperation leads to betrayal, revealing how the pursuit of status can cloud morality and unravel lives. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A deepening sense of foreboding and tension permeates the narrative. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The shock of murder disrupts the facade, igniting suspicion and fear.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of her time as she navigates the social elite's expectations while grappling with her family's financial decline. Her charm masks a growing desperation, reflecting the broader societal struggles of the Great Depression where maintaining appearances often comes at a steep personal cost.
Era intersection: Eleanor's financial struggles highlight the economic pressures faced by many in her class, forcing her to confront moral dilemmas in her pursuit of social stability.

### Dr. Mallory Finch
Dr. Mallory Finch represents the tension between professional integrity and personal emotions, caught in a web of unrequited love while navigating the expectations of a respected physician. His inner turmoil reflects the broader societal pressures of maintaining one’s reputation amidst the chaos of the Great Depression.
Era intersection: Finch’s emotional struggles mirror the societal changes where personal ambitions often conflict with professional responsibilities, echoing the shifting dynamics of gender and class.

### Beatrice Quill
Beatrice Quill is a spirited housemaid whose rebellious nature clashes with her desire for respect. Her unrequited love for Captain Hale complicates her emotions, placing her in a subservient position while yearning for recognition, mirroring the struggles of many women in her class during the 1930s.
Era intersection: Beatrice's aspirations reflect the growing independence of women in the workforce, showcasing the class struggles that define her reality.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's speech is polished and eloquent, laced with sarcasm and a hint of superiority.
[comfortable] Oh darling, if only you knew how hard it is to maintain such a façade.
[evasive] Well, I believe the truth is often more complicated than it appears.
[stressed] I simply can't afford another scandal; it would ruin everything!
Humour: Eleanor often employs polite savagery to mask her deeper anxieties.

### Dr. Mallory Finch (he/him/his)
Dr. Finch speaks with a measured and calm cadence, often punctuating his observations with dry wit.
[comfortable] Medicine, unlike love, is often predictable.
[evasive] It's best not to dwell on the past; the future is what matters.
[stressed] This situation is more complicated than any surgery I've ever performed!
Humour: His dry wit often surfaces in moments of tension.

### Beatrice Quill (she/her/her)
Beatrice's voice is sharp and sardonic, often reflecting her rebellious spirit.
[comfortable] Honestly, who needs a prince when a good job will do?
[evasive] Well, I wouldn't say all rules are worth following.
[stressed] I can't keep pretending I'm invisible forever!
Humour: Beatrice's sardonic wit often reveals her frustrations.

## Location Registers (scene framing guides)

The Library: The library is a cavernous space filled with shadows and secrets, where the air is thick with tension and the weight of unspoken words. It feels suffocating, a place where every whisper echoes the gravity of betrayal and loss.. Camera angle: As a writer enters this space, they should feel the oppressive atmosphere that hints at the dark history contained within these walls.. Era: The library, with its heavy drapes and flickering candlelight, captures the somber mood of the 1930s, where the economic strain is felt even in the opulent settings of the elite.

The Drawing Room: In the drawing room, the opulence of the furnishings contrasts sharply with the tension among guests, who navigate their interactions with a mix of forced laughter and unspoken suspicion. It’s a space filled with elegance yet shadowed by the underlying threat of betrayal.. Camera angle: The writer should approach this space with a sense of foreboding, aware that beneath the surface decorum lies a web of deceit.. Era: The opulence of the drawing room reflects the class divisions of the 1930s, where wealth is juxtaposed against the struggles of the working class.

The Servants' Hall: The servants' hall is a refuge filled with camaraderie, yet it buzzes with unease. Here, the staff share whispers and secrets, their laughter mingling with the aroma of simmering stew — a stark contrast to the tensions above.. Camera angle: As a writer enters, they should feel the warmth of the hall but also the underlying tension that defines the lives of those who serve.. Era: This space reflects the rigid class structure of the 1930s, where the divide between staff and guests is palpable, even in shared moments.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's charm can add a light touch amidst the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's earlier arguments about money take on a new light, revealing her desperation as a motive". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's jealousy his concern for Eleanor, showing a darker side of his affections". Do not explain significance yet.
- Plant one subtle observable beat related to: "Captain Hale's protectiveness, once viewed as noble, now appears possessive, complicating his role in the narrative". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor must have died before her last seen time of a quarter past eleven due to the clock's indication.
- Hidden truth to progressively expose: The actual time of death was later, due to intentional tampering.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock was found stopped at ten minutes past eleven. | corr: This suggests a deliberate tampering to mislead about the time of death. | effect: Narrows the time of death to after quarter past eleven.
  - Step 2: obs: The ashes in the fireplace suggest a recent fire. | corr: If the fire was warm, it contradicts the idea that Eleanor died before she was last seen. | effect: Eliminates the idea that she died before quarter past eleven.
  - Step 3: obs: Multiple witnesses confirm that the clock chimed at eleven. | corr: This indicates that the tampering led to a false timeline. | effect: Narrows suspicion to Eleanor for manipulating the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, witness, and stopp against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_3_2, clue_core_contradiction_chain, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The clock stopped at ten minutes past eleven and witnesses last saw Eleanor alive at quarter past eleven, indicating a timeline manipulation. Step 2: Warm ashes in the fireplace contradict the idea of an earlier death, as they suggest Eleanor was alive longer. Step 3: Witnesses heard the clock chime at eleven, confirming Eleanor's involvement in tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a polished eloquence, often peppering her conversation with wry observations about her peers
She has a tendency to lean into sarcasm when addressing social faux pas, which she views as an opportunity to assert her superiority.
Eleanor's ambition clashes with her compassion for the victim, leading her to question whether her desire for social elevation is worth the potential harm to others.

### Dr. Mallory Finch
Finch speaks with a measured cadence, often employing medical jargon that he softens with a dry sense of humor
He has a habit of raising an eyebrow when making a particularly astute observation, lending an air of intellectuality to his dialogue.
Dr. Finch is torn between the love he feels for the victim and the professional boundaries he must maintain, leading to a deep sense of internal strife as he navigates the investigation.

### Beatrice Quill
Beatrice speaks with a quick wit and a sharp tongue, her sentences often laced with sarcasm
She employs a casual, almost irreverent tone, and is known for her tendency to turn a phrase on its head when she feels particularly indignant.
Beatrice's feelings for Captain Hale clash with her disdain for the victim, creating a tumultuous internal struggle as she navigates her emotions and ambitions.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a polished eloquence, often peppering her conversation with wry observations about her peers. She has a tendency to lean into sarcasm when addressing social faux pas, which she views as an opportunity to assert her superiority.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, if only you knew how hard it is to maintain such a façade."
  [evasive] "Well, I believe the truth is often more complicated than it appears."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The recent murder of a prominent figure in her social circle has left Eleanor anxious about the victim's influence, which she believes could threaten her daughter's future prospects." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a measured cadence, often employing medical jargon that he softens with a dry sense of humor. He has a habit of raising an eyebrow when making a particularly astute observation, lending an air of intellectuality to his dialogue.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Medicine, unlike love, is often predictable."
  [evasive] "It's best not to dwell on the past; the future is what matters."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The emergence of the victim's new romantic interest has ignited a simmering jealousy within Dr. Finch, leaving him fearful of losing both his professional reputation and the loyalty of his patients." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a quick wit and a sharp tongue, her sentences often laced with sarcasm. She employs a casual, almost irreverent tone, and is known for her tendency to turn a phrase on its head when she feels particularly indignant.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honestly, who needs a prince when a good job will do?"
  [evasive] "Well, I wouldn't say all rules are worth following."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "After a public confrontation with the victim left her feeling humiliated, Beatrice's resentment simmered, clouding her judgment and complicating her emotions." — do not surface in Act I.



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
Little Middleton Manor stands as a relic of grandeur, its sprawling grounds and formal gardens shrouded in an air of mystery and suspicion.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere: tension-filled, with an undercurrent of suspicion among guests
Weather: overcast with intermittent rain, typical of early autumn

Era markers: Petrol touring cars parked in the gravel driveway, hinting at the wealth of the guests. | Early telephones in the drawing room, their cords snaking elegantly across the polished surfaces. | Typewriters clacking in the study, a stark reminder of the work that continues despite the unfolding mystery.

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
  - Visual: The flickering light from the fireplace casts ominous shadows across the room, illuminating the dust motes that float lazily in the air., Heavy velvet drapes frame tall windows, their edges frayed, allowing only the faintest light to filter through, creating a somber ambiance.
  - Sounds: The crackling of the fire is punctuated by the soft rustle of pages turning, an eerie reminder of the secrets held within the books., Occasionally, the distant sound of thunder rumbles outside, echoing the tension that has enveloped the manor.
  - Scents: The musty odor of aged paper and leather fills the air, mingling with the faint scent of smoke from the fireplace., A hint of dampness lingers, a reminder of the rain-soaked grounds just outside the windows.
  - Touch: The coolness of the marble floor contrasts sharply with the warmth radiating from the fireplace, creating a disconcerting sensation as one moves through the space., The rough texture of the leather-bound books adds an element of antiquity, each one a potential vessel for hidden truths.

The Drawing Room (interior):
  - Visual: Rich tapestries hang from the walls, their intricate designs telling stories of the manor's history, while the heavy drapes frame the windows, blocking out the dreary light of the outside world., The gleam of polished silverware on the sideboard catches the eye, hinting at the lavish gatherings that often take place here.
  - Sounds: The gentle hum of conversation fills the air, punctuated by the occasional laughter that feels forced, as if the guests are trying to maintain appearances., The soft notes of a piano being played in the corner add a layer of elegance, yet the music feels strained, echoing the tension in the room.
  - Scents: The aroma of fresh flowers in a vase mingles with the scent of polished wood, creating an inviting yet suffocating atmosphere., Hints of perfume linger in the air, mixing with the faint odor of smoke from the fireplace, evoking a sense of nostalgia.
  - Touch: The plush upholstery of the sofas invites guests to sink in, yet th
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In March 1930, the world is slowly shaking off the remnants of winter, though the air remains cool and damp, a typical early spring in the English countryside
- Overcast skies loom overhead, and intermittent showers patter softly on the estate windows, creating a tense atmosphere within the grand country house
- Guests, gathered for a weekend of leisure and camaraderie, find themselves enveloped in a sense of foreboding, as discussions turn to the economic strains of the Great Depression and the unsettling political climate sweeping across Europe
- Patrick's Day just around the corner, the estate staff prepares for an evening of celebration, unaware of the dark events that will soon unfold among the guests
- Fashion during this time reflects both elegance and practicality

TEMPORAL CONTEXT:

This story takes place in March 1930 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool winds
- Daylight: Days are gradually lengthening, with daylight extending into the evening, and the sun setting around 6:30 PM.
- Seasonal activities: spring cleaning in homes, visiting local gardens as flowers bloom, attending early spring fairs
- Seasonal occasions: St. Patrick's Day (March 17)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tailored wool suits, crisp white dress shirts, bow ties or narrow ties
- Men casual: tweed jackets, knitted vests, corduroy trousers
- Men accessories: felt hats, pocket watches, cane umbrellas
- Women formal: satin evening gowns with dropped waistlines, embroidered shawls, cloche hats
- Women casual: printed tea dresses, cardigans, ankle-length skirts
- Women accessories: beaded handbags, long gloves, pearls

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'My Heart Stood Still' by Richard Rodgers, 'The Birth of the Blues' by Ray Henderson; Films: 'The Love Parade', 'The Big House'; Theatre: 'The Front Page', 'The Royal Family'; Radio: 'Amos 'n' Andy', news broadcasts on the economic situation
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Pair of shoes: ten shillings
- Current events: economic pressures from the Great Depression; debate over unemployment relief measures in Parliament
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [mystery] | [social commentary] | [romantic fiction]
- Technology: electric refrigerators becoming common | early models of home radios | advancements in automotive technology | typewriters in offices | telephones in homes | petrol cars for travel
- Daily life: attending local fairs and markets, evening gatherings for bridge or whist, visiting tea rooms for socializing
- Social rituals: afternoon tea gatherings, community church services on Sundays

Atmospheric Details:
The air carries the fresh scent of rain mixed with the earthy aroma of awakening soil. Inside the estate, whispers echo against the walls, and the flickering candlelight casts long shadows across the polished wood floors. Outside, the early spring blooms struggle to emerge, symbolizing hope amid the pervasive gloom of a world grappling with uncertainty.

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
- Authentic references: Use actual songs, films, events from the specific date

USAGE REQUIREMENTS:
1. Date references: Mention mont
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

• [clue_2] A neighbor heard an argument just before eleven.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This could involve Eleanor and any of the suspects, hinting at tension.

• [clue_4] Multiple witnesses confirm that the clock chimed at eleven.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: This indicates that the clock was functioning at that time.

• [clue_8] Eleanor Voss had been seen acting nervously in the days leading up to her death.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: This could indicate her state of mind and possible motive.

• [clue_1] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_3] Physical evidence from the fireplace
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_7] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_culprit_direct_eleanor_voss] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_1] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_1_2] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_3, clue_7, clue_fp_contradiction_step_1, clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_culprit_direct_eleanor_voss, clue_fp_contradiction_step_1_2 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Hale continued to question the constable, Eleanor's thoughts turned inward. She recalled the last moments she had spent with the victim, the heated argument that had spiraled out of control. 'We were discussing money, yes, but it was nothing more than a dis..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor stepped closer to the clock, her fingers brushing against the polished wood of its casing.
Chapter 2: Chapter 2: The Initial Investigation
  Events: the captain Hale entered the room, his presence commanding attention as he surveyed the scene.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the living room of Eleanor's home
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the living room of Eleanor's home"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the living room of Eleanor's home". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 92/100):
  Quality gaps noted: word density below preferred target (766/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 93/100):
  Quality gaps noted: word density below preferred target (802/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8970; context=10903; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early telephones in homes | typewriters standard in offices | party-line telephone exchange usage | telegram services available in towns | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: layout restricts movement between floors without using the main staircase | gardens provide secluded areas for private meetings | walled perimeter limits unauthorized access | restricted areas include private offices and the master bedroom | daily routines dictate access times to various parts of the house.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy heir's reading of the will intensifies class tensions and suspicions amidst the economic strain of the Great Depression.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal focus and unknown motive)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar character roles and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's behavior during the reenactment, Draw conclusion about Eleanor's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Dr. Finch's confirmed alibi tightens timeline evidence.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Witnesses affirm Hale's presence elsewhere when death occurred.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Beatrice's access to the clock is confirmed but not the motive.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with clock evidence and witness testimonies.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_3 must appear in Act 1, Scene 3 via Physical evidence from the fireplace
- clue_7 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_eleanor_voss must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_fp_contradiction_step_1_2 must appear in Act 1, Scene 3 via Cross-check contradiction

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
- Chapter 3:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the living room of Eleanor's home.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Hale continued to question the constable, Eleanor's thoughts turned inward. She recalled the last moments she had spent with the victim, the heated argument that had spiraled out of control. 'We were discussing money,...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eleanor was seen arguing about money days before her death. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests a motive related to financial desperation.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The ashes in the fireplace suggest a recent fire. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates activity in the house shortly before the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock was found stopped at ten minutes past eleven. [clue_7] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This raises questions about the timing of Eleanor's death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test. [clue_culprit_direct_eleanor_voss] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses saw Eleanor alive after the clock stopped. [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the assumption that Eleanor died before a quarter past eleven.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock was found stopped at ten minutes past eleven. [clue_fp_contradiction_step_1_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests a deliberate tampering to mislead about the time of death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A neighbor heard an argument just before eleven. [clue_2]
      Points to: This could involve Eleanor and any of the suspects, hinting at tension.
    • Multiple witnesses confirm that the clock chimed at eleven. [clue_4]
      Points to: This indicates that the clock was functioning at that time.
    • Eleanor Voss had been seen acting nervously in the days leading up to her death. [clue_8]
      Points to: This could indicate her state of mind and possible motive.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: March (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: quarter past eleven
- Established timeline fact: ten minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder dawned over Little Middleton, the air thick with tension as rain pattered softly against the windows of the living room of Eleanor's home. The scent of damp earth mingled with the faint aroma of smoke still lingering from the fireplace, where embers glowed faintly, casting flickering shadows across the room. Eleanor Voss stood transfixed, her gaze locked on the clock, which ominously displayed the time as ten minutes past eleven. The stillness of the room was palpable, interrupted only by the distant rumble of thunder, a reminder of the storm brewing outside, mirroring the turmoil within her heart. The ashes in the fireplace suggest a recent fire, hinting at activity in the house shortly before the murder.

Eleanor stepped closer to the clock, her fingers brushing against the polished wood of its casing. The minute hand remained stubbornly fixed, a testament to the chaos that had unfolded the previous night. She felt a chill run down her spine as she recalled the last argument she had with the victim, a confrontation that now seemed to echo in the silence of the room. The clock was found stopped at ten minutes past eleven, raising questions about the timing of Eleanor's death. How could it be that she was seen alive after this time? It was a question that gnawed at her, as the implications of the clock's condition began to unfold in her mind. The mechanism relied on the clock's minute hand and stoppage to expose the false timing. If the clock had been tampered with, it could mislead the investigation entirely, casting doubt on the very timeline that everyone relied upon.

Beatrice Quill stood nearby, her arms crossed tightly, as if to shield herself from the weight of the unfolding tragedy. She glanced at Eleanor, noting the pallor of her skin and the frantic look in her eyes. 'You know, Eleanor, we all heard you arguing about money just days before this happened,' Beatrice remarked, her voice edged with a mix of sympathy and accusation. The memory of that heated exchange flashed in Eleanor's mind, a reminder of the financial strain that had begun to suffocate her family. The argument had been about more than just money; it had been about desperation, the kind that could drive a person to the brink. Beatrice's words hung in the air, heavy with implication, suggesting a motive that could not be ignored.

the doctor Finch, who had been observing the scene with a furrowed brow, finally broke the silence. 'If this fire was lit shortly before the murder, it indicates that someone was here, actively engaging with the space. It raises the question of who had access to this room and when.' She glanced at Eleanor, her expression a mixture of concern and curiosity. The ashes were still warm, hinting at activity that had occurred just before the chaos erupted. This detail could prove crucial in piecing together the timeline of events.

the captain Hale, who had been pacing near the window, turned to join the conversation. 'I remember the clock chiming at dinner,' he said, his voice steady yet laced with uncertainty. 'It was functioning then, which means it stopped after that. But if Eleanor was seen alive after the clock stopped, it contradicts the assumption that she died before a quarter past eleven.' Her words hung in the air, a thread of doubt weaving through the fabric of their understanding. Each of them had access to Eleanor, and the implications of their alibis began to unravel in the tense atmosphere of the room.

Eleanor felt her heart race as she processed the mounting evidence. The clock's stoppage, the ashes in the fireplace, and the argument about money all converged into a singular thought: the truth was far more complicated than any of them had anticipated. She could sense the suspicion brewing among them, the unspoken accusations that lingered in the air. 'We need to be careful,' she finally said, her voice barely above a whisper. 'If we start pointing fingers, we might just end up losing sight of the real danger lurking in the shadows.'

The room fell silent as they absorbed her words, the weight of their shared predicament pressing down upon them. Outside, the rain continued to spring, a steady reminder of the storm that raged within and without. Each of them was caught in a web of suspicion, their lives intertwined with the tragic fate of Eleanor Voss. As they stood there, the clock's face stared down at them, a silent witness to the chaos that would soon unfold.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Initial Investigation
The late morning light struggled to penetrate the thick clouds that loomed over Little Middleton, casting a pallor over the living room of Eleanor's home. Outside, the rain continued its relentless patter against the windowpanes, a constant reminder of the storm that raged within the hearts of those gathered. The scent of damp earth mingled with the faint aroma of smoke still lingering from the fireplace, where embers glowed faintly, casting flickering shadows across the room. Eleanor Voss stood at the center of the room, her fingers trembling as they brushed against the ornate clock, which now stood as a silent sentinel to the chaos that had unfolded. The clock was found stopped at ten minutes past eleven, a detail that seemed to mock her as she recalled the last moments she had shared with the victim. She had been arguing with her just before the clock stopped, and now, the implications of that argument weighed heavily on her mind. The ashes in the fireplace suggested a recent fire, hinting at activity in the house shortly before the murder, and she felt a chill run down her spine as she considered what that might mean.

the captain Hale entered the room, his presence commanding attention as he surveyed the scene. 'Eleanor,' she began, her voice steady yet probing, 'you were seen alive after the clock stopped. This contradicts the assumption that you died before a quarter past eleven.' Her words hung in the air, a thread of doubt weaving through the fabric of their understanding. The weight of suspicion settled heavily on Eleanor, and she clenched her fists, trying to hold back tears as Hale continued, 'If the clock was tampered with, it could mislead the investigation entirely.'

Eleanor's heart raced as she processed the mounting evidence. 'I was with her just before the clock stopped,' she insisted, her voice wavering. 'We were discussing financial matters. I would never harm her!' But Hale's gaze remained unyielding, and she could feel the scrutiny of Beatrice Quill and the doctor Finch, who stood nearby, their expressions a mix of concern and suspicion. The tension in the room was palpable, each unspoken accusation adding to the suffocating atmosphere.

Dr. Finch, who had been observing the scene with a furrowed brow, finally broke the silence. 'If this fire was lit shortly before the murder, it indicates that someone was here, actively engaging with the space. It raises the question of who had access to this room and when.' She glanced at Eleanor, her expression a mixture of concern and curiosity. The ashes were still warm, hinting at activity that had occurred just before the chaos erupted. 'We need to consider all possibilities,' she added, her voice calm yet firm.

Eleanor felt the weight of their scrutiny, the air thick with unspoken accusations. 'I didn't kill her,' she said, her voice barely above a whisper. 'I loved her!' But her words seemed to spring flat in the face of the evidence mounting against her. Hale's insistence on the timeline of events left his feeling cornered, as if the walls were closing in. He could sense the doubt in their eyes, the way they exchanged glances that spoke volumes about their suspicions.

As the local constable arrived, the atmosphere shifted slightly. The sound of footsteps echoed in the hallway, a reminder that the outside world was encroaching upon their private tragedy. Hale turned to the constable, a man of sturdy build and stern demeanor, and began to outline the situation. 'We have a potential timeline issue here,' he said, gesturing toward the clock. 'It was found stopped at ten minutes past eleven, yet witnesses saw Eleanor alive after that time.' The constable nodded, taking notes as she listened intently.

Eleanor's mind raced. How could she prove her innocence when the very clock she had relied upon now seemed to betray her? The mechanism relied on the clock's minute hand and stoppage to expose the false timing. If someone had tampered with it, they could manipulate the timeline entirely. She felt a surge of desperation as she considered the implications. Who among them could have done such a thing? The thought sent chills down her spine.

As Hale continued to question the constable, Eleanor's thoughts turned inward. She recalled the last moments she had spent with the victim, the heated argument that had spiraled out of control. 'We were discussing money, yes, but it was nothing more than a disagreement,' she insisted, her voice rising slightly. 'I would never harm him!' But as he spoke, he could see the doubt etched on Hale's face, and it only fueled his anxiety. The clock's condition, the ashes in the fireplace, and the argument all converged into a singular thought: the truth was far more complicated than any of them had anticipated.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The smoldering ashes in the fireplace"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the fire was recently lit, contradicting the idea that Eleanor died before she was last seen."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock-tampering)
Culprit: Eleanor Voss
False assumption: Eleanor must have died before her last seen time of a quarter past eleven due to the clock's indication.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Ashes and the Argument",
    "setting": {
      "location": "the living room of Eleanor's home",
      "timeOfDay": "Late morning",
      "atmosphere": "Intense scrutiny as details unfold"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill",
      "Dr. Mallory Finch"
    ],
    "purpose": "Reveal more clues about the crime and establish motives",
    "cluesRevealed": [
      "clue_2",
      "clue_4",
      "clue_8"
    ],
    "dramaticElements": {
      "conflict": "Underlying tensions surface as motives are hinted at",
      "tension": "Eleanor's defensiveness raises suspicion",
      "microMomentBeats": [
        "Beatrice glances at Eleanor, her expression a mixture of sympathy and suspicion."
      ]
    },
    "summary": "As the investigation continues, Eleanor's nervousness becomes apparent. Beatrice recalls an argument she overheard between Eleanor and the victim just before eleven, while Dr. Finch notes the ashes in the fireplace suggest a recent fire, contradicting the timeline of Eleanor's last sighting.",
    "estimatedWordCount": 1800,
    "pivotElement": "The smoldering ashes in the fireplace",
    "factEstablished": "Establishes that the fire was recently lit, contradicting the idea that Eleanor died before she was last seen.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The shock of murder disrupts the facade, igniting suspicion and fear.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's speech is polished and eloquent, laced with sarcasm and a hint of superiority."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "sardonic"
    },
    "eraTextureNote": "Travel limited by fuel shortages and economic constraints; Communication hampered by reliance on landlines and postal services; Social gatherings restricted by class divisions and the need for decorum",
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
□ Chapter 3: "Eleanor was seen arguing about money days before her death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The ashes in the fireplace suggest a recent fire." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock was found stopped at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Witnesses saw Eleanor alive after the clock stopped." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock was found stopped at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
