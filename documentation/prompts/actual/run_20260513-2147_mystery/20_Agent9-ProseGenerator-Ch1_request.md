# Actual Prompt Record

- Run ID: `mystery-1778708826041`
- Project ID: ``
- Timestamp: `2026-05-13T21:51:53.261Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `542098c47e9c5dc9`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, leading to a morally gray justification for their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: January 1937
Living through January 1937 in England means navigating the damp chill of winter, where overcast skies threaten light rain, and days grow shorter, casting long shadows over social gatherings. The Great Depression's grip tightens, with economic struggles palpable in conversations and social interactions. Class distinctions become stark, as the aristocracy clings to social status while the working class faces the bite of poverty. In this charged atmosphere, the specter of fascism looms over Europe, fueling fears and anxieties about the future, while whispers of discontent and class tensions simmer just beneath the surface.
Emotional register: A sense of unease and foreboding permeates society as economic struggles and political instability loom large.
Physical constraints: Limited movement due to harsh winter weather | Communication difficulties stemming from reliance on outdated technologies | Restricted access to urban centers for rural residents | Short daylight hours affecting social gatherings
Current tensions (weave into background texture): Rising tensions in Europe due to fascist movements | Debates in Parliament over unemployment assistance | The abdication crisis in Spain affecting international relations
Wartime context — Many families have members who served in World War I, creating a lingering sense of loss and honor.: The social fabric is frayed, with class divisions becoming increasingly pronounced in the face of economic hardship. Absence effect: Absent veterans are often idealized, creating a gap between the past glories and present struggles.

## Season Lock (mandatory — derived from January 1937)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world where ambition and desperation intertwine, the quest for inheritance leads to betrayal and the unraveling of carefully maintained facades, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Tense and foreboding, reflecting the underlying class tensions and personal ambitions.

Arc:
The story begins in the grand but oppressive atmosphere of Little Middleton Manor, where a family gathering for a will reading sets the stage for a tense evening. As the clock ticks steadily towards the hour of the crime, the facade of grace and charm masks the brewing storm of emotions among the guests. The initial crime — the mysterious murder of an unknown male — sends shockwaves through the gathering, revealing buried secrets and igniting fears of exposure. The investigation begins with Beatrice Quill, the sharp-minded detective, who navigates a web of lies, uncovering the first clues that hint at deeper motivations and connections among the characters. As she delves into the lives of Eleanor, Mallory, and Ivor, the emotional cost of the investigation becomes evident, with each character's desperation and ambition intertwining.

A pivotal moment occurs when Beatrice discovers evidence suggesting the clock was tampered with, altering the timeline of the murder and shifting her focus towards Eleanor. This revelation colors the earlier events, as suspicion mounts and alliances shift. As the pressure builds, the climax unfolds in a tense confrontation where Eleanor's motives are laid bare, revealing the extent of her ambition and the lengths she would go to protect her secrets. The resolution sees the characters grappling with the aftermath of the revelations; Eleanor faces the consequences of her actions, while Beatrice reflects on the moral complexities of ambition and betrayal. Each character is left changed, their emotional burdens heavier as they navigate the fallout from the crime.

## Emotional register at this point in the story
The atmosphere is tense, filled with unspoken anxieties and the weight of societal expectations.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of the upper class in 1937, as her lavish parties mask her financial troubles. Her ambition for status and wealth intertwines with desperation, making her a reflection of society's decay amidst the façade of elegance. The Great Depression has tightened its grip on her life, forcing her to consider drastic actions to maintain her social standing.
Era intersection: Eleanor's financial plight is emblematic of the wider struggles faced by the upper class, who grapple with diminishing wealth while desperately clinging to their societal status.

### Dr. Mallory Finch
Dr. Mallory Finch represents the shift towards modernity in medicine, yet she faces backlash from traditionalists. Her struggle against societal norms mirrors the broader fight for women's rights during this era. As the Great Depression casts long shadows over her career, her resentment towards the victim underscores the personal stakes involved in her professional world.
Era intersection: Mallory's challenges as a woman in medicine during the 1930s reflect the societal pressures and limitations faced by women seeking independence in a patriarchal system.

### Captain Ivor Hale
Captain Ivor Hale, a war hero turned social outcast, grapples with feelings of betrayal and irrelevance in a changing world. His struggles for dignity in an era that favors the young and wealthy reveal the emotional toll of societal transitions. As he navigates his past glories and present failures, he embodies the disillusionment of a generation.
Era intersection: Ivor's sense of betrayal by the victim speaks to the larger theme of lost honor and status in a society reshaped by economic decline.

### Beatrice Quill
Beatrice Quill, an aspiring writer, navigates the complexities of ambition and exposure in a society rife with secrets. Her desire to document the lives around her reflects the era's fascination with storytelling and truth. As she juggles her own hidden truths, she becomes a symbol of the struggle for identity amidst societal expectations.
Era intersection: Beatrice's fixation on the secrets of others highlights the era's obsession with scandal and the consequences of unearthing hidden truths in a world fraught with class tension.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a melodic cadence, her words often laced with playful sarcasm.
[comfortable] Oh, darling, isn't this evening just divine? I do hope the rain holds off for our guests.
[evasive] Oh, you know how it is. One must keep up appearances, even amidst the chaos.
[stressed] I can't afford any more scandals; my reputation is all I have left!
Humour: Eleanor employs a polite savagery in her humor, often masking her true feelings behind a charming façade.

### Dr. Mallory Finch (she/her/her)
Mallory's speech is precise and often punctuated with dry wit, revealing her sharp intellect.
[comfortable] Ah, medicine is a delicate dance; one must be light on their feet.
[evasive] Well, let's not dwell on the past; the future is far more interesting.
[stressed] I will not let one woman's words destroy everything I've built!
Humour: Her dry wit often emerges in discussions about her detractors, showcasing her resilience.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, often softened by a self-deprecating edge.
[comfortable] You know, they say old soldiers never die; they just fade away.
[evasive] Perhaps my past isn’t as glorious as it seems, but I did my best.
[stressed] I won't be reduced to a mere shadow of my former self!
Humour: Ivor's self-deprecating humor often masks deeper insecurities about his relevance.

### Beatrice Quill (she/her/her)
Beatrice's voice is lively and quick, filled with sardonic commentary.
[comfortable] Life is far more interesting when you’re writing about it!
[evasive] Oh, I wouldn’t want to pry into anyone’s private affairs... or would I?
[stressed] What if my secrets come to light? I can't let that happen!
Humour: Her sardonic humor often highlights her intelligence and keen observations.

## Location Registers (scene framing guides)

The Library: The library feels oppressive, a space filled with secrets and shadows. The sense of tension hangs heavy in the air, as if the very books themselves are witnesses to the unfolding drama. Each creak of the floorboards and rustle of pages serves as a reminder of the hidden truths waiting to be uncovered.. Camera angle: As a writer enters this space, they should feel the weight of history pressing down, urging them to unveil the truths hidden within.. Era: The library's atmosphere is intensified by the era's focus on decorum and hidden agendas, making it a microcosm of the societal pressures of the 1930s.

The Drawing Room: In the drawing room, the atmosphere is thick with unspoken words and strained smiles. The lavish furnishings are juxtaposed with the underlying tension, creating a space that feels both inviting and suffocating. Guests navigate polite conversations, but the air crackles with the anticipation of revelation and conflict.. Camera angle: A writer should capture the duality of warmth and unease, portraying a space that is alive with social interaction yet fraught with hidden agendas.. Era: The drawing room's opulence starkly contrasts with the economic struggles of the time, highlighting the class divide that permeates society.

The Servants' Hall: The servants' hall is filled with camaraderie amidst the weariness of labor. The atmosphere is both warm and charged with tension, as staff members share whispers and glances that reveal their awareness of the divide between them and their employers. Here, behind closed doors, the weight of duty and loyalty hangs heavy.. Camera angle: A writer entering this space should feel the palpable tension and the sense of unity among the staff, contrasted with their subservient roles.. Era: The hall reflects the era's strict social hierarchy, where the struggles of the staff contrast sharply with the lives of the wealthy they serve.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes a tense atmosphere that doesn't permit humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred at the time indicated by the stopped clock.
- Hidden truth to progressively expose: The clock was deliberately tampered with to mislead investigators.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: Since the clock was tampered with, the timing is false. | effect: Narrows the timeline of death.
  - Step 2: obs: Witnesses recall the clock striking a different hour before the murder. | corr: The clock’s hands do not accurately reflect reality. | effect: Eliminates the reliability of the clock as a timekeeper.
  - Step 3: obs: Eleanor was seen near the clock shortly before the murder. | corr: Eleanor had the opportunity to tamper with the clock. | effect: Narrows the suspect pool to Eleanor Voss.
- Discriminating test method: trap
- Discriminating test design constraint: A staged confrontation reveals the discrepancies in the timing of the clock and the victim's last known movements.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_culprit_direct_eleanor_voss
- Fair-play rationale: Step 1: The clock's position and dust indicate tampering. Step 2: Witnesses' accounts contradict the clock. Step 3: Eleanor's proximity to the clock at the time of death proves her involvement.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a melodic cadence, often punctuating her sentences with playful sarcasm
She has a penchant for elegant phrases but can shift to sharp retorts when feeling threatened.
Eleanor grapples with the guilt of her deceitful lifestyle, torn between her ambition and a growing awareness of her moral decay. She fears that her relentless pursuit of status may ultimately cost her everything.

### Dr. Mallory Finch
Mallory speaks with precision, often employing medical jargon that softens into plain language when engaging with patients
Her wit is dry, with an undercurrent of sarcasm that emerges when discussing her detractors.
Mallory battles feelings of inadequacy and insecurity, questioning whether her progressive ideals can withstand the scrutiny of her peers. This conflict is compounded by her desire for recognition and validation.

### Captain Ivor Hale
Ivor speaks with a commanding presence, often punctuating his words with a self-deprecating edge
His sentences are clipped but carry an unmistakable weight, revealing a man who has seen much and lost more.
Ivor wrestles with his pride and the realization that his past may not define his future. The betrayal he feels is compounded by a fear of irrelevance in a world that has moved on without him.

### Beatrice Quill
Beatrice speaks with a quick, lively rhythm, often interjecting her sentences with sardonic comments
Her playful banter often belies a deeper intelligence and insight.
Beatrice struggles with the tension between her ambition and the fear of exposure; her desire for success clashes with the risk of revealing her own secrets.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a melodic cadence, often punctuating her sentences with playful sarcasm. She has a penchant for elegant phrases but can shift to sharp retorts when feeling threatened.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't this evening just divine? I do hope the rain holds off for our guests."
  [evasive] "Oh, you know how it is. One must keep up appearances, even amidst the chaos."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor views the victim as a direct threat to her aspirations of climbing the social ladder. Eliminating this rival would not only secure her position but also alleviate her financial burdens." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Mallory speaks with precision, often employing medical jargon that softens into plain language when engaging with patients. Her wit is dry, with an undercurrent of sarcasm that emerges when discussing her detractors.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, medicine is a delicate dance; one must be light on their feet."
  [evasive] "Well, let's not dwell on the past; the future is far more interesting."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "In Mallory's eyes, the victim is not just a rival but a conspirator intent on discrediting her work. This personal affront ignites her desire for vengeance, as her livelihood hangs in the balance." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a commanding presence, often punctuating his words with a self-deprecating edge. His sentences are clipped but carry an unmistakable weight, revealing a man who has seen much and lost more.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, they say old soldiers never die; they just fade away."
  [evasive] "Perhaps my past isn’t as glorious as it seems, but I did my best."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's actions have ignited a personal vendetta within Ivor, driving him to seek retribution for what he perceives as a grave injustice." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a quick, lively rhythm, often interjecting her sentences with sardonic comments. Her playful banter often belies a deeper intelligence and insight.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life is far more interesting when you’re writing about it!"
  [evasive] "Oh, I wouldn’t want to pry into anyone’s private affairs... or would I?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's curiosity about the crime is fueled by her desire to write a sensational story, yet she also fears that her own secrets may come to light." — do not surface in Act I.



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
A sprawling manor house, steeped in history, stands isolated in the English countryside, surrounded by manicured gardens that hide secrets and whispers of betrayal.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere: Tense and foreboding, reflecting underlying class tensions and recent political unrest.
Weather: Overcast with occasional rain, typical for the English countryside in spring.

Era markers: A radio crackles in the background, broadcasting news of political unrest and economic struggles. | Typewriters clatter in the study, echoing the urgency of correspondence amidst growing crises. | Guests arrive in petrol-driven automobiles, their engines rumbling like distant thunder as they approach the estate.

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
  - Visual: Rich oak paneling absorbs light, creating a warm yet shadowy atmosphere that feels both inviting and claustrophobic., A grand fireplace stands at one end, its mantle adorned with family portraits, their eyes seemingly watching the proceedings with silent judgment.
  - Sounds: The muffled sound of rain pattering against the leaded windows creates a rhythmic backdrop, occasionally broken by the rustle of pages turning., A distant clock ticks steadily, marking time in this suspended moment of tension, each tick echoing the urgency of the unfolding drama.
  - Scents: The rich scent of old paper and leather mingles with the faint, acrid odor of spilled ink, filling the air with a sense of history and loss., A hint of woodsmoke from the fireplace adds warmth to the otherwise cool room, creating an atmosphere ripe for confrontation.
  - Touch: The coolness of the polished wood table contrasts sharply with the warmth of the fire, offering a juxtaposition of comfort and unease., The rough texture of the carpet underfoot absorbs sound, enhancing the sense of secrecy as footsteps are muffled in this hidden corner of the manor.

The Drawing Room (interior):
  - Visual: The room is adorned with heavy drapery that blocks out the late afternoon light, creating a cozy yet oppressive atmosphere., A large, intricately woven rug covers the floor, its patterns swirling like secrets waiting to be uncovered.
  - Sounds: Laughter and conversation filter through the air, yet the underlying tension is palpable, as if the walls themselves are eavesdropping., The soft clink of glasses and cutlery from a nearby tea service punctuates the conversations, masking the true emotions brewing beneath the surface.
  - Scents: The sweet scent of freshly brewed tea mingles with the floral perfumes of the guests, creating an intoxicating blend that masks the tension in the room., A faint hint of dust clings to the air, reminding all present of the manor's age and the stories it has witne
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through January 1937 in England means navigating the damp chill of winter, where overcast skies threaten light rain, and days grow shorter, casting long shadows over social gatherings
- The Great Depression's grip tightens, with economic struggles palpable in conversations and social interactions
- Class distinctions become stark, as the aristocracy clings to social status while the working class faces the bite of poverty
- In this charged atmosphere, the specter of fascism looms over Europe, fueling fears and anxieties about the future, while whispers of discontent and class tensions simmer just beneath the surface.

TEMPORAL CONTEXT:

This story takes place in January 1937 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional light rain, chilly breezes
- Daylight: Short days with twilight settling in by four o'clock in the afternoon; limited sunlight breaking through the clouds.
- Seasonal activities: hunting parties in the countryside, indoor games like bridge and chess, preparing for the spring planting season
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored evening suit with a bow tie, frock coat with waistcoat, cravat with a morning suit
- Men casual: tweed jacket with wool trousers, corduroy trousers with woolen sweater, flannel shirt with a flat cap
- Men accessories: silver cufflinks, walking cane, pocket watch
- Women formal: beaded evening gown with long sleeves, tea-length dress with a fitted waist, cocktail dress adorned with sequins
- Women casual: tweed skirt with a knitted sweater, blouse with a Peter Pan collar, swing coat made of wool
- Women accessories: clutch purse, string of pearls, feathered headband

Cultural Context (reference naturally):
- Music/entertainment: 'The Way You Look Tonight' by Fred Astaire, 'I Can't Give You Anything But Love' by Louis Armstrong, swing music gaining popularity; Films: 'The Great Ziegfeld', 'A Star Is Born'; Theatre: 'The Royal Family', 'The Show Must Go On'; Radio: BBC radio dramas are popular, news broadcasts covering international affairs
- Typical prices: Loaf of bread: four pence, Bottle of milk: three pence, Train ticket to London: two shillings
- Current events: rising tensions in Europe due to fascist movements; debates in Parliament over unemployment assistance
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Of Mice and Men' by John Steinbeck | 'The Glass Key' by Dashiell Hammett | [detective fiction] | [social realism] | [romantic novels]
- Technology: the electric refrigerator becoming common | advancements in radio technology | development of early automatic telephones | radio receivers in most homes | typewriters in offices | early models of electric washing machines
- Daily life: attending social gatherings or balls, visiting the local market, reading newspapers for news and entertainment
- Social rituals: afternoon tea with family and friends, weekly church services, formal dining etiquette during meals

Atmospheric Details:
Damp air fills the estate, carrying the scent of wet earth and decaying leaves underfoot. The flickering candles cast long shadows across the drawing room, heightening the sense of unease that lingers in the atmosphere. Outside, the distant sound of hounds on a hunt echoes faintly through the trees, a reminder of the estate's social obligations amid rising tensions.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Backgr
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

• [clue_1] The clock in the study shows ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time displayed on the clock at the time of the murder.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the study of the victim's home
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the study of the victim's home"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study of the victim's home". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5048; context=9897; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting for news and entertainment | early telephones in homes with party-line systems | typewriters standard in offices | telephone for local communication and news | telegrams for urgent messages | airmail services for faster delivery of letters.
9. Respect setting movement/access constraints in scene action and alibis: manor layout creates limited visibility in certain areas | gardens and hedges restrict movement and conceal evidence | weather can affect outdoor investigations and evidence preservation | certain rooms are off-limits to staff and guests without permission | daily routines dictate access to different areas at specific times.
10. Sustain social coherence with this backdrop pressure: A family gathering for a will reading amidst the Great Depression forces heirs and staff into a tense atmosphere, where class tensions and political unrest create a breeding ground for secrets and betrayal.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal focus and murder theme)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (similar era and murder context)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Medical alibi confirmed through other witnesses
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Presence in the garden confirmed by multiple witnesses
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the study of the victim's home.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study shows ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time displayed on the clock at the time of the murder.
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
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: victim's last known appearance at 10:00 PM
- Established timeline fact: clock showing ten minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock found in the victim's hand — still showing ten past eleven"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis"
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions the clock ran at dinner — seeds timing doubt.

# Case Overview
Title: The Timed Betrayal
Era: 1930s
Setting: Little Middleton
Crime: murder (unknown male)
Culprit: Eleanor Voss
False assumption: The murder must have occurred at the time indicated by the stopped clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study of the victim's home",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor lingers at the door, her expression a mix of grief and fear."
      ]
    },
    "summary": "In the study, the body of an unknown male lies sprawled on the floor, a stopped clock showing ten minutes past eleven clutched in his hand. Beatrice Quill, a local journalist, is present as the household grapples with the shocking discovery.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock found in the victim's hand — still showing ten past eleven",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis",
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
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions the clock ran at dinner — seeds timing doubt."
    },
    "emotionalRegister": "The atmosphere is tense, filled with unspoken anxieties and the weight of societal expectations.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a melodic cadence, her words often laced with playful sarcasm."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited movement due to harsh winter weather; Communication difficulties stemming from reliance on outdated technologies; Restricted access to urban centers for rural residents; Short daylight hours affecting social gatherings",
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
□ Chapter 1: "The clock in the study shows ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
      "title": "Chapter 1: Discovery",
      "summary": "In the study, the body of an unknown male lies sprawled on the floor, a stopped clock showing ten minutes past eleven clutched in his hand. Beatrice Quill, a local journalist, is present as the household grapples with the shocking discovery.",
      "paragraphs": [
        "The morning light struggled to break through the overcast sky, casting a muted glow in the study of the victim's home. The air was thick with tension, and the faint scent of damp wood lingered, a reminder of the winter rain that had fallen through the night. Beatrice Quill stood at the threshold, her heart racing as she took in the scene before her. The body of an unknown male lay sprawled on the floor, a stopped clock showing ten minutes past eleven clutched in his hand. The stillness of the room was punctuated only by the distant sound of raindrops tapping against the window, a morose accompaniment to the grim discovery.",
        "Beatrice stepped closer, her eyes drawn to the clock. It was an ornate piece, its hands frozen in time, a cruel reminder of the moment life had slipped away. \"Ten minutes past eleven,\" she murmured, her voice barely above a whisper. The implications of that time weighed heavily on her mind; it suggested the victim had died no later than that moment, contradicting the alibis of those who had been present. She glanced around the room, her gaze landing on Eleanor Voss, who lingered at the door, her expression a mix of grief and fear. Beatrice could sense the unspoken questions hanging in the air, each suspect aware that they were now entangled in a web of suspicion.",
        "Dr. Mallory Finch stood near the window, her hands clasped tightly in front of her. The doctor’s usually composed demeanor was marred by the shock of the situation. \"This is dreadful,\" she said, her voice trembling slightly. \"We must call the authorities at once. There’s no telling how long he’s been here.\" Beatrice nodded, her mind racing with thoughts of the implications. The victim's identity was unknown, but the circumstances of his death were already beginning to unfold like a dark tapestry. Each thread pulled tighter as they awaited the detective's arrival.",
        "Captain Ivor Hale, who had been pacing near the fireplace, turned abruptly. \"I saw the clock running just before dinner,\" he said, his brow furrowed in confusion. \"It was working fine then. How could it have stopped?\" Beatrice noted the uncertainty in his voice, a hint of doubt creeping into his expression. The captain's words added another layer of complexity to the situation, and she felt a flicker of unease. If the clock had indeed been running, it would shift the timeline of the murder, complicating their understanding of the events that had transpired.",
        "As the minutes ticked by, the tension in the room mounted. Beatrice felt the weight of the moment pressing down on her. She stepped closer to the body, her journalist instincts kicking in. The stopped clock found in the victim's hand — still showing ten minutes past eleven — was a crucial piece of evidence. It established a timeline that could potentially contradict the alibis of Eleanor, Mallory, and Ivor. Each of them had been present during the dinner, but how could they account for their whereabouts at the time of death? The questions swirled in her mind like the autumn leaves outside, caught in a tempest of uncertainty.",
        "Eleanor's voice broke the silence again, her melodic cadence a stark contrast to the grim reality. \"We must remain calm, my dear friends. Panic will not serve us here. We need to think clearly about what has happened and how we can assist in the investigation.\" Her words, though meant to reassure, only seemed to heighten the tension. Beatrice could see the fear lurking in Eleanor's eyes, a fear that hinted at deeper secrets. What was Eleanor hiding? What was at stake for her in this unfolding drama?",
        "Dr. Mallory stepped forward, her medical training kicking in. \"We should examine the body, see if there are any signs of struggle or foul play. It might give us some insight into what happened here.\" Beatrice nodded in agreement, her journalistic instincts urging her to document every detail. The atmosphere in the room was thick with unspoken anxieties, and she could feel the weight of societal expectations pressing down on them all. They were not just witnesses to a crime; they were potential suspects in a murder that had shattered the fragile peace of their lives.",
        "As they gathered around the body, Beatrice felt a sense of foreboding settle over her. The clock, the body, the secrets — they were all intertwined in a complex web of lies and ambition. She could sense that this was just the beginning of a dark journey, one that would lead them down paths they had never anticipated. The study, once a place of comfort, had transformed into a chamber of horrors, and the truth lay hidden beneath layers of deception."
      ]
    }
  ],
  "cast": ["Eleanor Voss", "Dr. Mallory Finch", "Captain Ivor Hale", "Beatrice Quill"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1 | absent",
    "season_words_used": "winter | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_1: chapter 1 paragraph 2 | absent",
    "early_observation_present": "description: chapter 1 paragraph 1 (first 25%) | present",
    "early_inference_present": "no"
  }
}
```

## Message 5 (role=user)

```text
Attempt 2/4 — chapters 1 — 1 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Chapter 1: Chapter 1 presents an anonymous victim ("body of an unknown person"). The murder victim must have a name and identity established for the reader. (Replace anonymous victim language with the victim's proper name and a brief characterisation so the reader mourns a real person.)

✓ SOLUTION: The ONLY characters who exist are: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: unknown
ATTEMPT: 1/4
MANDATORY FIXES:
- Resolve unknown issues before accepting this batch.
- Chapter 1: Chapter 1 presents an anonymous victim ("body of an unknown person"). The murder victim must have a name and identity established for the reader. (Replace anonymous victim language with the victim's proper name and a brief characterisation so the reader mourns a real person.)
```
