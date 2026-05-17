# Actual Prompt Record

- Run ID: `mystery-1778782153600`
- Project ID: ``
- Timestamp: `2026-05-14T18:14:20.608Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `0b110f6459a325b7`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice, believing they were protecting an innocent party from the victim's malicious past." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1931-08
In August 1931, life in England is overshadowed by the Great Depression, a time marked by economic despair and mounting class tensions. The streets of Little Middleton, once bustling with social activities, echo with the whispers of discontent. The manor house, a symbol of status, stands firm against the backdrop of overcast skies, where even the wealthy feel the strain of financial uncertainty. Daily life is characterized by strict budgets, as families navigate the rising costs of living amidst high unemployment rates. Social gatherings are tinged with an underlying anxiety, as communities grapple with both the desire for connection and the reality of their diminished means. The air is thick with the scent of damp earth and rain-soaked grass, a reminder of the harsh summer weather that mirrors the emotional weight of the period.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, as individuals navigate a world that feels increasingly unstable.
Physical constraints: Limited mobility due to economic hardship, affecting travel and social activities. | Communication barriers caused by the reliance on outdated technology like typewriters and party-line telephones. | The oppressive weather, with overcast skies and rain, restricting outdoor interactions. | Rationing leading to constrained access to goods and services.
Current tensions (weave into background texture): Economic despair due to rising unemployment rates. | Class struggles heightening tensions between estate workers and landowners. | Political unrest and growing radicalism among the working class.
Wartime context — Many men are returning from service, struggling to reintegrate into civilian life as jobs are scarce.: The absence of fathers and husbands creates a palpable void in families, exacerbating feelings of loss and discontent. Absence effect: Communities are strained, as the burden of maintaining households falls primarily on women, leading to a shift in traditional roles.

## Story Theme
The Clockwork Conspiracy explores how hidden ambitions and past secrets can lead to dire consequences, revealing the fragility of human relationships in times of social upheaval.

## Story Emotional Register
Dominant: The emotional journey of the story is one of tension, revelation, and resolution, tracing the complexities of human relationships amidst a backdrop of despair and societal upheaval.

Arc:
The story opens in the grand halls of Little Middleton Manor, where the atmosphere is thick with tension and unease following the shocking murder of Eleanor Voss. As the investigation begins, the characters grapple with their hidden motives and the emotional cost of the crime, setting the stage for rising unease. Eleanor, driven by her personal stakes, delves into the secrets of those around her, uncovering first clues and false leads that complicate her investigation. The emotional turmoil heightens as she navigates her feelings for the victim while trying to maintain her reputation.

A pivotal moment occurs when discrepancies in the clock's time reveal tampering, shifting the focus of the investigation and leading to a mid-story revelation that recolors earlier events. The pressure mounts as the truth comes to light, culminating in a tense confrontation that forces the characters to face their own demons. In the resolution, the emotional toll of the truth weighs heavily on each character, leaving them to confront the consequences of their actions and the fragility of their relationships in this time of social upheaval. Each character emerges changed, carrying the scars of their choices, as the manor stands silent, a witness to the unraveling of human connections.

## Emotional register at this point in the story
The atmosphere is thick with tension and despair following Eleanor's murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the plight of many women in the 1930s, caught between societal expectations and personal aspirations. As a socialite and estate owner, she feels the pressure of maintaining her family's reputation while grappling with financial struggles due to the Great Depression. Her hidden relationship with the victim complicates her already precarious position, reflecting the broader struggles of women navigating personal and professional realms during this turbulent era.
Era intersection: Her financial desperation is a direct consequence of the economic turmoil, which threatens her reputation and career.

### Dr. Mallory Finch
Dr. Mallory Finch represents the struggles of women in professional roles during the 1930s, where societal expectations often clash with personal ambition. As a respected physician, she grapples with jealousy and insecurity, feeling overshadowed by Eleanor's success. The Great Depression exacerbates her feelings of inadequacy, as the pressure to maintain her professional status mounts amidst the economic collapse. Her actions reflect the darker side of ambition in a time of scarcity.
Era intersection: Her jealousy of Eleanor's position is intensified by the competitive climate created by the economic downturn.

### Captain Ivor Hale
Captain Ivor Hale embodies the archetype of the proud yet flawed man struggling to maintain dignity in the face of financial ruin. The 1930s economic climate weighs heavily on his past as a naval officer, leaving him vulnerable to the consequences of his previous business dealings. His financial stakes in the victim's controversial findings mirror the larger anxieties of men during this period, who grappled with their changing roles in society as the Great Depression deepened.
Era intersection: His desperation to protect his financial interests reflects the broader struggles of men facing job insecurity and societal pressure.

### Beatrice Quill
Beatrice Quill is a representation of the working-class women navigating the complexities of class and social mobility during the Great Depression. Her bubbly demeanor hides a fear of losing her job, reflecting the precarious position of many staff members in aristocratic households. The economic strain makes her long for a better life, showcasing the aspirations of lower-class individuals striving for advancement amidst rising class tensions.
Era intersection: Her ambition to rise above her current station is hindered by the economic realities of the time, highlighting the struggles of the working class.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a measured tone, reflecting her thoughtful nature and charm.
[comfortable] You see, history has a peculiar way of repeating itself, much like the whispers in this very manor.
[evasive] Oh, I was merely attending to some research, nothing that warrants further inquiry, really.
[stressed] I never anticipated my past would come back to haunt me like this. How could they possibly understand?
Humour: Eleanor often employs dry wit, using humor to navigate tense situations.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks in a clipped, precise manner, often lacing her words with sharp undertones.
[comfortable] It's rather fascinating how the human body can endure such stresses, wouldn't you agree?
[evasive] I simply lost track of time while examining my notes; it can happen to the best of us.
[stressed] I can't afford to be seen as anything less than competent; the stakes are simply too high.
Humour: Her polite savagery often masks deeper insecurities, providing a contrast to her professional demeanor.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice commands attention, resonating with authority and a hint of self-deprecation.
[comfortable] Navigating the waters of life is never easy, but I've weathered many storms.
[evasive] I’d rather not discuss my past ventures; the sea is a fickle mistress, after all.
[stressed] The weight of my past dealings is a burden I never anticipated carrying into my retirement.
Humour: He often uses self-deprecating humor to soften the impact of his pride.

### Beatrice Quill (she/her/her)
Beatrice's lively tone embodies her cheerful yet anxious demeanor.
[comfortable] Oh, isn’t it just delightful how secrets seem to sprout like weeds in this house?
[evasive] I wouldn't know anything about that; I was just busy tidying up, you see.
[stressed] I just... I can’t afford to lose this job; it’s the only thing keeping me afloat.
Humour: Her sardonic humor often serves as a defense against her anxiety.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets, its dusty shelves holding untold stories. The air is thick with tension, and the faint scent of old paper mingles with the dampness from the rain outside, creating an oppressive atmosphere where every creak of the floorboards seems to echo the weight of the investigation.. Camera angle: Entering the library feels like stepping into the heart of the manor's mysteries, where every shadow might hide a clue.. Era: The musty scent of old books and polished wood reflects the economic realities of maintaining a grand estate during the Great Depression.

The Drawing Room: The drawing room is a stage for social interactions, yet the laughter feels strained, and the air is thick with unspoken suspicions. The rich decor contrasts sharply with the underlying tension, as whispers of betrayal linger in the flickering candlelight, making every gathering feel like a façade.. Camera angle: Entering the drawing room evokes a sense of grandeur, yet the atmosphere is fraught with unease, inviting scrutiny of every interaction.. Era: The opulence of the drawing room stands in stark contrast to the economic struggles faced by the household and its staff.

The Servants' Quarters: The Servants' Quarters feel confined and weary, echoing with the hum of daily life amidst the backdrop of a struggling household. The laughter shared here is a fleeting moment of joy against the constant pressure of their surroundings, highlighting the stark class divide within the manor.. Camera angle: Stepping into the Servants' Quarters feels like entering a world apart, where the burdens of the estate are shared among those who often go unnoticed.. Era: The peeling wallpaper and modest furnishings reflect the economic challenges faced by those who serve in the manor.

## Humour guidance for this story position (opening)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can lighten the tension as the story begins.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time of death must align with when the clock shows.
- Hidden truth to progressively expose: The clock has been tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in Eleanor's study shows a time of quarter to ten. | corr: This indicates a discrepancy between the clock's time and the witness accounts. | effect: Narrows the time of death window to between quarter past nine and quarter to ten, eliminating Beatrice.
  - Step 2: obs: Scratches are found on the clock casing. | corr: These scratches indicate that the clock has been tampered with. | effect: Narrows the suspect pool to Dr. Finch and Captain Hale, as they had access to the study.
  - Step 3: obs: Dr. Finch's alibi claims he was in town until ten PM. | corr: This suggests that he could not have tampered with the clock or been present at the time of death. | effect: Eliminates Dr. Finch as a suspect.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the clock to a standard timepiece reveals that the clock was wound back, proving that Captain Hale tampered with it to create a false alibi.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core, clue_fp_contradiction_step_3
- Fair-play rationale: Step 1: The clock in Eleanor's study (early) and witness accounts (mid) help the reader understand the time discrepancy. Step 2: Scratches on the clock (mid) and Beatrice's testimony clarify tampering. Step 3: Dr. Finch's alibi (late) eliminates him and points to Captain Hale.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a measured cadence, often punctuating her sentences with thoughtful pauses
She has a tendency to sprinkle her dialogue with historical references and occasionally leans into irony when discussing her circumstances.
Eleanor wrestles with the profound guilt of her concealed relationship with the victim, fearing that exposing the truth will not only destroy her credibility but also reveal the depths of her feelings.

### Dr. Mallory Finch
Finch speaks in a clipped, precise manner, often punctuating her sentences with a slight edge
She has a penchant for using medical jargon to assert her authority, but when pressed, her words become laced with a biting sarcasm that reveals her true feelings.
Mallory's jealousy and the lengths she has gone to undermine Eleanor create a moral struggle within her. As the investigation unfolds, she must confront the consequences of her actions and the possibility of losing everything she has worked for.

### Captain Ivor Hale
Captain Hale speaks with a commanding presence, his voice resonating with authority
He often employs nautical metaphors and a bit of dry humor, using self-deprecation to soften his bravado.
Hale's involvement in the failed business venture haunts him, creating a moral tension as he grapples with the consequences of his past decisions while trying to maintain his dignity.

### Beatrice Quill
Beatrice speaks with a lively rhythm, her words tumbling out in a cheerful cascade
She often employs playful sarcasm, using humor as a defense mechanism to navigate the tension around her.
Beatrice's desire for advancement clashes with her fear of the consequences of sharing what she knows. Her internal struggle creates a tension that threatens to paralyze her.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her sentences with thoughtful pauses. She has a tendency to sprinkle her dialogue with historical references and occasionally leans into irony when discussing her circumstances.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You see, history has a peculiar way of repeating itself, much like the whispers in this very manor."
  [evasive] "Oh, I was merely attending to some research, nothing that warrants further inquiry, really."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor fears her research grants may be jeopardized if the victim's controversial findings are made public. The thought of losing funding for her projects sends shivers down her spine, igniting a fierce determination to protect her work." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks in a clipped, precise manner, often punctuating her sentences with a slight edge. She has a penchant for using medical jargon to assert her authority, but when pressed, her words become laced with a biting sarcasm that reveals her true feelings.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's rather fascinating how the human body can endure such stresses, wouldn't you agree?"
  [evasive] "I simply lost track of time while examining my notes; it can happen to the best of us."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch believes Eleanor's work undermines her own reputation in the medical community. The thought of being overshadowed by a local historian gnaws at her, fueling a simmering resentment that threatens to boil over." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a commanding presence, his voice resonating with authority. He often employs nautical metaphors and a bit of dry humor, using self-deprecation to soften his bravado.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Navigating the waters of life is never easy, but I've weathered many storms."
  [evasive] "I’d rather not discuss my past ventures; the sea is a fickle mistress, after all."
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hale stands to lose significant money if the victim's potentially damaging information becomes public. The thought of financial ruin is a specter that looms large in his mind." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a lively rhythm, her words tumbling out in a cheerful cascade. She often employs playful sarcasm, using humor as a defense mechanism to navigate the tension around her.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, isn’t it just delightful how secrets seem to sprout like weeds in this house?"
  [evasive] "I wouldn't know anything about that; I was just busy tidying up, you see."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice hopes to secure a better position in a different household and views the turmoil as an opportunity. The chaos surrounding the investigation presents a chance for her to elevate her status." — do not surface in Act I.



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
A grand manor house steeped in mystery, where secrets linger in the shadows of its opulent rooms and sprawling grounds.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Social gathering space
- The Servants' Quarters (interior): Living space for staff

Atmosphere: Tension-filled due to recent events and the underlying class struggles exacerbated by the Great Depression.
Weather: Overcast with intermittent rain, typical for a rural estate in the 1930s, affecting outdoor activities.

Era markers: Petrol touring cars parked in the gravel drive, their paint glistening with raindrops. | Typewriters clattering in the study, composing urgent correspondence. | Old-fashioned telephones with party-line connections, ringing sporadically with news from the outside world.

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
  - Visual: Flickering candlelight casts elongated shadows across the rich, dark wood of the shelves, illuminating the dust motes that float lazily in the air., A large bay window overlooks the garden, its glass streaked with rain, blurring the view of the once-vibrant flowers.
  - Sounds: The soft rustle of pages turning, interrupted by the distant sound of thunder rolling outside, echoing the tension in the room., The creak of the wooden floorboards as one approaches the desk, a reminder of the weight of the secrets held within.
  - Scents: The musty scent of old paper mingles with the faint aroma of smoke from the fireplace, creating an atmosphere of antiquity., A lingering hint of damp earth wafts in from the open window, a reminder of the relentless rain outside.
  - Touch: The smooth, cool surface of the desk contrasts sharply with the rough texture of the leather-bound books that line the shelves., A chill hangs in the air, seeping through the walls, as if the room itself is holding its breath, waiting for the truth to be revealed.

The Drawing Room (interior):
  - Visual: Richly upholstered furniture in deep burgundy and gold accents creates an inviting yet opulent atmosphere., Portraits of stern ancestors gaze down from the walls, their eyes seeming to follow visitors as they move about the room.
  - Sounds: The soft crackle of the fire provides a comforting backdrop to the murmurs of conversation that often fill the room., Occasional laughter rings out, but it carries an edge of tension, a reminder of the underlying discord among the guests.
  - Scents: The warm scent of burning wood mingles with the faint aroma of fresh flowers arranged on the mantel., A hint of expensive perfume lingers in the air, a remnant of the last gathering held in this space.
  - Touch: The plush fabric of the armchairs invites weary bodies to sink in, providing a false sense of comfort amid the brewing storm outside., The coolness of the marble fireplace contrasts with the warmth radiating from the flames, cr
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1931, life in England is overshadowed by the Great Depression, a time marked by economic despair and mounting class tensions
- The streets of Little Middleton, once bustling with social activities, echo with the whispers of discontent
- The manor house, a symbol of status, stands firm against the backdrop of overcast skies, where even the wealthy feel the strain of financial uncertainty
- Daily life is characterized by strict budgets, as families navigate the rising costs of living amidst high unemployment rates
- Social gatherings are tinged with an underlying anxiety, as communities grapple with both the desire for connection and the reality of their diminished means

TEMPORAL CONTEXT:

This story takes place in August 1931 during summer.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with occasional rain showers, Humidity lingering in the air, Cool breezes from the nearby woods
- Daylight: Daylight hours stretch into the evening, with sunset occurring just after eight o'clock, casting a dim light in the late hours.
- Seasonal activities: Garden parties in the estate grounds, Attending local fairs showcasing farm produce, Evenings spent playing lawn games like croquet
- Seasonal occasions: No significant holidays this month, but preparations for Harvest Festival begin towards the end.
- Season: summer

Period Fashion (describe naturally):
- Men formal: Three-piece wool suit in dark gray, White dress shirt with a stiff collar, Bow tie or narrow necktie
- Men casual: Lightweight linen trousers, Short-sleeved cotton shirt, Panama hat for outdoor wear
- Men accessories: Pocket watch with chain, Leather gloves, Classic brogues
- Women formal: Tea-length dress with floral patterns, Lightweight cardigan or bolero jacket, Cloche hat adorned with a ribbon
- Women casual: Cotton blouse with puffed sleeves, Pleated skirt reaching mid-calf, Straw hat with wide brim
- Women accessories: Beaded handbag, Silk scarf tied at the neck, Simple pearl earrings

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Ray Henderson, 'Happy Days Are Here Again' by Milton Ager; Films: 'City Lights' directed by Charlie Chaplin, 'Frankenstein' directed by James Whale; Theatre: 'The Front Page' by Ben Hecht and Charles MacArthur, 'Porgy and Bess' by George Gershwin; Radio: The BBC News, Variety shows featuring music and comedy
- Typical prices: Loaf of bread: 4 pence, Cinema ticket: 1 shilling, A pint of milk: 3 pence
- Current events: Unemployment rates peak in the UK at around 25%; The British government introduces further austerity measures
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'A Passage to India' by E.M. Forster | [Mystery and detective fiction] | [Social realism reflecting the struggles of the time] | [Fantasy and escapist literature]
- Technology: The electric refrigerator becomes more common in households | Development of the first practical radio receiver circuits | Advancements in automotive engineering for better fuel efficiency | Typewriters for business correspondence | Gramophones for music playback | Early motion picture cameras
- Daily life: Social gatherings in parlors or gardens, Listening to radio broadcasts in the evenings, Participating in local dances or fairs
- Social rituals: Sunday family dinners with a roast, Seasonal picnics in the countryside, Weekly church services or gatherings

Atmospheric Details:
The scent of damp earth and rain-soaked grass permeates the air, mingling with the faint aroma of blooming late summer flowers. The distant sound of thunder rumbles as dark clouds loom overhead, casting an ominous shadow over the once-vibrant gardens. An undercurrent of tension fills the manor, palpable in hushed conversations and wary glances exchanged behind closed doors.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Ti
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

• [clue_mechanism_visibility_core] A mechanical clock was tampered with to show a false time, misleading the investigation into the time of death.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals the core mechanism of the tampering.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Quarters, the study in Eleanor's home
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Quarters", "the study in Eleanor's home"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study in Eleanor's home". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5164; context=10093; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | domestic wiring with frequent outages | typewriters in use for correspondence | party-line telephone exchanges common | telegrams via local postal offices | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: geography allows for discreet movement around the estate | the architecture creates natural access restrictions to certain areas | weather can affect outdoor investigation timing and evidence visibility | restricted areas such as the library and the cellar | permissions required to access the servants' quarters.
10. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident at the manor draws together the estate's owners and staff amid rising class tensions and the shadow of the Great Depression.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal focus and manipulation of time-related evidence)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time compared to a standard timepiece, Draw conclusion about Captain Hale's guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Alibi confirmed by multiple witnesses
  Clues: Dr. Finch's alibi, Witness statements
- Beatrice Quill (Act 3, Scene 5): Confirmed she did not touch the clock
  Clues: Testimony from Beatrice, Scratches on the clock

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the clock tampering

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the study in Eleanor's home.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A mechanical clock was tampered with to show a false time, misleading the investigation into the time of death. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the core mechanism of the tampering.
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
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Eleanor was last seen alive at quarter past nine.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock showing ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting the suspects' alibis."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions hearing a noise at ten past nine, suggesting the time of death must align with the clock.

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Captain Ivor Hale
False assumption: The time of death must align with when the clock shows.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study in Eleanor's home",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense, filled with a sense of dread"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "The group grapples with the shock of the murder.",
      "tension": "Suspicion begins to rise among the characters.",
      "microMomentBeats": [
        "Eleanor glances at the clock, a sense of foreboding washing over her."
      ]
    },
    "summary": "In the dim light of the study, Eleanor discovers the victim's lifeless body, a clock stopped at ten minutes past eleven, igniting panic among the guests. Captain Hale and Dr. Finch exchange anxious glances, while Beatrice's eyes dart nervously around the room.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock showing ten minutes past eleven.",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting the suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; no guilt signals"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; no guilt signals"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; no guilt signals"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions hearing a noise at ten past nine, suggesting the time of death must align with the clock."
    },
    "emotionalRegister": "The atmosphere is thick with tension and despair following Eleanor's murder.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a measured tone, reflecting her thoughtful nature and charm."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited mobility due to economic hardship, affecting travel and social activities.; Communication barriers caused by the reliance on outdated technology like typewriters and party-line telephones.; The oppressive weather, with overcast skies and rain, restricting outdoor interactions.; Rationing leading to constrained access to goods and services.; Frequent strikes affecting local industries and transport.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 1: "A mechanical clock was tampered with to show a false time, misleading the investigation into the time of death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
