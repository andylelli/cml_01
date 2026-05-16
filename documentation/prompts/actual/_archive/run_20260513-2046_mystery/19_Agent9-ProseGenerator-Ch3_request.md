# Actual Prompt Record

- Run ID: `mystery-1778705183030`
- Project ID: ``
- Timestamp: `2026-05-13T20:51:17.878Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `91023106b0890e68`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice for a perceived wrong done to them by the victim." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1930-07
In July 1930, the atmosphere in England is marked by the Great Depression's lingering shadows, with communities grappling with financial hardship and social unrest. The affluent are under increasing scrutiny, their wealth contrasted sharply with the struggles of the working class. Daily life is punctuated by community fairs and social gatherings that provide brief escapes from reality, yet the specter of economic despair looms large. The social fabric is fraying as class divisions deepen, and whispers of political change ripple through the air, hinting at a future that is uncertain.
Emotional register: The dominant emotional state is one of anxiety and tension, as individuals navigate the uncertainties of their social standings amid economic despair.
Physical constraints: Limited transportation options due to economic conditions | Social gatherings tightly controlled by class hierarchies | Restricted access to resources for the lower class | Lengthy travel times between the manor and village
Current tensions (weave into background texture): Economic hardship due to the Great Depression | Growing resentment towards the wealthy | Political unrest related to fascism in Europe
Wartime context — The community is still feeling the effects of the recent war, with many veterans grappling with their post-war identities.: The societal structure is rigid, with veterans often viewed with a mix of respect and pity. Absence effect: The absence of those lost in the war adds a layer of grief to the community's gatherings and interactions.

## Story Theme
The story explores the intricate dynamics of class and personal ambition, revealing how the pursuit of legacy can lead to moral compromises and unforeseen consequences.

## Story Emotional Register
Dominant: The story conveys a sense of mounting tension and emotional conflict.

Arc:
The story begins in the grand manor of Little Middleton, where the atmosphere is thick with unease following the murder of a prominent guest. As Eleanor Voss steps into the investigation, the initial shock of the crime weighs heavily on her, setting the stage for a spiral into deeper intrigue. As she delves into the lives of the other residents, the rising investigation reveals first clues and false leads, each one taking a toll on her confidence and stirring doubts about her abilities as an investigator. The emotional cost grows as she confronts her own fears and aspirations, struggling with her desire to prove herself amidst the chaos.

Midway through the investigation, a pivotal moment occurs when Eleanor discovers evidence that drastically shifts her perspective. This revelation forces her to reassess her assumptions and the relationships surrounding her, prompting a deeper exploration of motives and personal stakes. As the plot thickens, the second turn brings forth a crucial revelation that recolors earlier events, unveiling hidden connections that intertwine the characters’ lives.

As the climax approaches, the pressure mounts for Eleanor, culminating in a confrontation with the evidence that forces her to reckon with her own motivations and the consequences of her discoveries. The tension reaches a breaking point as the truth is revealed, leading to an explosive climax where the stakes are not just about solving the murder but about confronting one’s own legacy.

In the resolution, the emotional toll of the investigation becomes evident for each character. For Eleanor, the journey has been one of self-discovery, forcing her to confront her family's legacy and her own ambitions. The aftermath leaves her with a newfound understanding of what it means to carry the weight of history, while the others grapple with their own costs, revealing the lasting impact of the events that transpired in the manor. The story ends not with closure but with the acknowledgment that the past will always echo in the present.

## Emotional register at this point in the story
Initial investigations reveal first clues, but they come with emotional strain as Eleanor wrestles with self-doubt.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, as a local historian, embodies the conflict between ambition and legacy in a time marked by economic hardship. Her pursuit of her family's history serves as both a reflection of the past and a struggle against the present societal pressures.
Era intersection: Her private quest to reclaim her family's legacy is intensified by the economic challenges of the 1930s, pushing her to confront uncomfortable truths.

### Dr. Mallory Finch
Dr. Mallory Finch represents the precarious balance of professional reputation and personal desire during a time of economic uncertainty. Her secret relationship with the victim adds to her internal struggles, reflecting the societal pressures on women's roles in the 1930s.
Era intersection: Her fear of losing her hard-earned reputation amidst the economic climate accentuates her desperation, making her decisions more consequential.

### Captain Ivor Hale
Captain Ivor Hale's battle with financial ruin amidst the backdrop of the Great Depression illustrates the stark contrast between honor and desperation. His past as a military officer conflicts with his current state, revealing the fragility of social status.
Era intersection: His secret gambling debts highlight the economic pressures faced by many men of honor, pushing him toward morally dubious choices.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often punctuating her points with historical anecdotes that reveal her deep knowledge.
[comfortable] In the library, I often find solace among the stories of my ancestors. Their lives echo in every book, reminding me of the legacy we carry.
[evasive] I suppose some secrets are best left buried. After all, history can be quite unflattering.
[stressed] What if uncovering the truth only brings more shame? I can't let my family's story end in disgrace.
Humour: Her dry wit often surfaces during tense moments, offering levity despite the seriousness of the situation.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's warm, soothing tone reflects her compassionate nature, yet her nervousness surfaces when discussing her personal life.
[comfortable] We all have our burdens to bear. I suppose mine just happen to be a bit more... complicated.
[evasive] Well, I can't say I've always made the best choices, but who among us has?
[stressed] I fear that if the truth comes out, it will not only ruin me, but also those I care about.
Humour: Her self-deprecating humor adds depth to her character, revealing her vulnerabilities.

### Captain Ivor Hale (he/him/his)
Hale's direct speech reflects his military background, often cutting to the chase with blunt honesty.
[comfortable] Life's a gamble, and I seem to have drawn the short straw. But I won't let it break me.
[evasive] I was in the garden, tending to my thoughts. Gardens can be quite... meditative.
[stressed] It's not just my honor at stake; it's everything I've fought for. I can't let it slip away.
Humour: His bluntness can sometimes mask deeper feelings, but when he jokes, it’s often laced with a sardonic edge.

## Location Registers (scene framing guides)

Grand Entrance Hall: Stepping into the grand entrance hall feels like entering a world of secrets, where every shadow seems to hold a whispered tale. The weight of history presses down, creating an atmosphere thick with tension and untold stories.. Camera angle: A writer should approach this space with a sense of foreboding, capturing the tension that simmers just beneath the surface.. Era: The hall's opulence stands in stark contrast to the economic struggles of the era, amplifying the sense of unease.

Library: The library feels both inviting and claustrophobic, filled with the scent of old books and hidden truths. It’s a sanctuary for knowledge, yet the darkness of its corners suggests that not all secrets are meant to be discovered.. Camera angle: As a writer, one should highlight the contrast between the warmth of the light and the shadows lurking within.. Era: In this era of information, the library represents both a refuge and a battleground for truth.

Drawing Room: The drawing room exudes elegance, yet the air is thick with unspoken tensions. It is a space for socializing, but the laughter feels forced, masking the underlying anxiety that permeates the interactions.. Camera angle: Writers should capture the interplay of light and shadow, emphasizing the duality of comfort and discomfort.. Era: The decor reveals the wealth of its occupants, yet the atmosphere reflects the strain of societal expectations.

Cellar: The cellar is a dark and damp space that evokes a sense of foreboding. It is filled with the weight of forgotten stories and the chill of isolation, making it a fitting backdrop for the secrets waiting to be revealed.. Camera angle: A writer should evoke a sense of claustrophobia, highlighting the darkness that envelops this space.. Era: As a remnant of the past, the cellar symbolizes the hidden truths that society often neglects to confront.

## Humour guidance for this story position (early)
Permission: conditional
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can provide a necessary contrast to the seriousness of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Earlier moments in the story take on new significance following the hidden-truth of the hidden-truth". Do not explain significance yet.
- Plant one subtle observable beat related to: "For instance, Eleanor's initial doubts about her investigative skills become poignant as she realizes the lengths to which individuals will go to protect their secrets". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's evasiveness during interviews reflects her inner turmoil, which is now understood in the context of her relationship with the victim". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred just after the clock struck eleven.
- Hidden truth to progressively expose: The clock was tampered with to misrepresent the actual time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The mechanical clock in the grand entrance hall shows ten minutes past eleven. | corr: This indicates the time of the murder was misrepresented. | effect: Narrows the timeline of events.
  - Step 2: obs: A faint scratch is visible on the clock face. | corr: The scratch suggests tampering with the clock mechanism. | effect: Eliminates the possibility of the clock being accurate.
  - Step 3: obs: Dr. Mallory Finch claims to have been with the victim at the time of death. | corr: The timeline shows this cannot be true if the clock was tampered with. | effect: Narrows the suspect pool to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: Conduct a controlled comparison of the clock's mechanism and the victim's watch to reveal the discrepancy.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5
- Fair-play rationale: Step 1: The clock's displayed time and the victim's watch create a contradiction. Step 2: The scratch on the clock face indicates tampering. Step 3: Dr. Mallory Finch's alibi contradicts the established timeline, leading to the discovery of the clock's manipulation.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a measured cadence, often punctuating her points with historical anecdotes
She has a tendency to raise an eyebrow when challenged, and her humor, while subtle, often reveals a sharp intellect.
Eleanor is torn between her loyalty to her family's legacy and the fear that uncovering the truth may lead to uncomfortable revelations about her ancestors that could tarnish her family's name.

### Dr. Mallory Finch
Finch speaks with a warm, soothing tone, often punctuating her conversations with self-deprecating humor
She has a habit of nervously adjusting her spectacles when discussing sensitive topics, revealing her underlying tension.
Dr. Finch grapples with the moral implications of her affair, torn between her feelings for the victim and her professional ethics. The fear of exposure threatens to unravel her carefully constructed life.

### Captain Ivor Hale
Hale speaks with a directness that reflects his military background, often cutting to the chase without much embellishment
He has a tendency to use short, clipped sentences, especially when discussing uncomfortable topics.
Captain Hale struggles between the honor he once upheld in service and the dishonor he now faces due to his financial troubles. He fears that his past ideals may be compromised in pursuit of a solution to his current plight.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her points with historical anecdotes. She has a tendency to raise an eyebrow when challenged, and her humor, while subtle, often reveals a sharp intellect.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the library, I often find solace among the stories of my ancestors. Their lives echo in every book, reminding me of the legacy we carry."
  [evasive] "I suppose some secrets are best left buried. After all, history can be quite unflattering."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor believes that reclaiming her family's legacy is not just a matter of personal pride but a chance to secure a future for her kin. The thought of her ancestors' contributions to the manor's history fuels her determination." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a warm, soothing tone, often punctuating her conversations with self-deprecating humor. She has a habit of nervously adjusting her spectacles when discussing sensitive topics, revealing her underlying tension.
Sample voice fragments (match this register and rhythm):
  [comfortable] "We all have our burdens to bear. I suppose mine just happen to be a bit more... complicated."
  [evasive] "Well, I can't say I've always made the best choices, but who among us has?"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch's fear of losing everything she has worked for looms large, compelling her to protect her secret at all costs. The thought of social scrutiny and professional disgrace drives her to consider desperate measures." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Hale speaks with a directness that reflects his military background, often cutting to the chase without much embellishment. He has a tendency to use short, clipped sentences, especially when discussing uncomfortable topics.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life's a gamble, and I seem to have drawn the short straw. But I won't let it break me."
  [evasive] "I was in the garden, tending to my thoughts. Gardens can be quite... meditative."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Captain Hale's desire to secure a substantial inheritance to pay off his debts has become an obsession, pushing him to consider actions that betray his core values." — do not surface in Act I.



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
Little Middleton Manor is an expansive and opulent estate nestled in the heart of the English countryside, surrounded by dense woodlands that create an aura of seclusion and mystery. Its grand entrance hall and formal gardens serve as a backdrop for the unfolding intrigue among its affluent inhabitants.

Key Locations Available:
- Grand Entrance Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gathering and tension
- Cellar (interior): Crime scene

Atmosphere: Tense and foreboding, reflecting underlying class tensions and personal conflicts among the residents
Weather: Overcast with occasional rain, typical of a cool autumn day

Era markers: Petrol automobiles parked in the gravel drive, their engines humming softly | Typewriters clacking in the study, the sound mingling with the distant crackle of a battery-operated radio | Party-line telephones ringing intermittently, their shrill tones cutting through the heavy air

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
  - Visual: The polished marble floor reflects the soft glow of gas lamps, illuminating the ornate details of the ceiling above., Heavy wooden doors, intricately carved, stand ajar, revealing the dimly lit corridors beyond.
  - Sounds: The echo of footsteps reverberates through the hall, mingling with the distant sound of rain tapping against the windows., Occasionally, the creak of the old floorboards announces the presence of unseen guests, heightening the sense of unease.
  - Scents: The musty scent of old wood and leather-bound books fills the air, mingling with the faint aroma of beeswax polish., A cold draft carries the smell of damp earth from outside, a reminder of the encroaching autumn.
  - Touch: The cool marble beneathfoot contrasts with the warmth of the surrounding air, creating an unsettling sensation as one moves through the space., The smoothness of the polished banister invites touch, yet the chill of the wood hints at the secrets it has witnessed.

Library (interior):
  - Visual: Dust motes dance in the slanted light, swirling above the worn leather armchairs that invite contemplation., The walls are adorned with framed prints of literary greats, their eyes seemingly watching over the secrets held within the tomes.
  - Sounds: The soft rustle of pages turning breaks the silence, interrupted only by the distant sound of rain pattering against the window panes., Occasionally, the creak of the floorboards announces the approach of a visitor, heightening the sense of isolation.
  - Scents: The musty odor of old paper and leather fills the air, mingling with the faint scent of polished wood., A hint of tobacco smoke lingers, a reminder of past conversations held within these walls.
  - Touch: The rough texture of the book spines contrasts with the smoothness of the polished table where notes and papers are
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1930, the atmosphere in England is marked by the Great Depression's lingering shadows, with communities grappling with financial hardship and social unrest
- The affluent are under increasing scrutiny, their wealth contrasted sharply with the struggles of the working class
- Daily life is punctuated by community fairs and social gatherings that provide brief escapes from reality, yet the specter of economic despair looms large
- The social fabric is fraying as class divisions deepen, and whispers of political change ripple through the air, hinting at a future that is uncertain.

TEMPORAL CONTEXT:

This story takes place in July 1930 during summer.

Seasonal Atmosphere:
- Weather patterns: warm temperatures averaging 70°F, occasional thunderstorms, high humidity
- Daylight: Long summer evenings, with the sun setting around eight-thirty, allowing for outdoor activities well into the night.
- Seasonal activities: garden parties on the estate grounds, evening strolls along tree-lined paths, attending local fairs featuring agricultural displays
- Seasonal occasions: Independence Day (July 4) celebrations, albeit subdued due to the economic climate
- Season: summer

Period Fashion (describe naturally):
- Men formal: lightweight linen suits, crisp white dress shirts, wide-brimmed straw hats
- Men casual: cotton trousers, short-sleeved patterned shirts, canvas loafers
- Men accessories: silk ties, leather belts, pocket squares
- Women formal: sleeveless floral dresses, tailored blouses with full skirts, pearl necklaces
- Women casual: cotton sundresses, wide-brimmed sun hats, light cardigans
- Women accessories: beaded handbags, straw clutches, decorative hairpins

Cultural Context (reference naturally):
- Music/entertainment: 'My Blue Heaven' by Gene Austin, 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Ray Henderson; Films: 'All Quiet on the Western Front', 'The Love Parade'; Theatre: 'The Front Page', 'Anything Goes'; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: 4 pence, Cinema ticket: 1 shilling, Taxi fare across town: 2 shillings
- Current events: ongoing effects of the Great Depression influencing social dynamics; increased tensions in Europe regarding fascism
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [mystery novels] | [social critiques] | [romantic comedies]
- Technology: commercial radio broadcasts becoming widespread | the introduction of the first electric refrigerators | advancements in film technology for sound movies | battery-operated radios | typewriters in offices | manual adding machines
- Daily life: visiting local markets, attending community fairs, participating in sports such as tennis and cricket
- Social rituals: afternoon tea served with pastries, evening gatherings for card games, formal dinner parties with multi-course meals

Atmospheric Details:
The scent of blooming roses mingles with the damp earth after an afternoon rain, creating a heavy yet refreshing ambiance. The sound of distant thunder rumbles, echoing through the estate, a reminder of the stormy weather looming and the tensions simmering among the guests. Flickering candlelight casts long shadows in the dining room, where uneasy conversations unfold, punctuated by the occasional laughter that feels forced.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background detail
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

• [clue_1] A faint scratch is visible on the clock face.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Suggests possible tampering with the clock.

• [clue_2] The scratch suggests tampering with the clock mechanism.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates that the clock may not be reliable.

• [clue_5] The victim's watch shows twenty minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Contrasts the clock's time, suggesting a discrepancy.

• [clue_6] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • ""I was in the garden for a time, tending to my thoughts," Hale continued, his expression serious. "But I returned to the drawing room shortly before the clock stopped. I remember hearing the chime, and I thought it was odd that the clock had stopped at such a..."
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
manor, drawing room, garden

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor took a tentative step closer to the clock, her heart racing as she reached out to touch its cold surface.
Chapter 2: Chapter 2: Contradictions Unveiled
  Events: The late morning at Voss Manor was heavy with unspoken tension, the air thickened by the scent of damp earth as rain continued to summer outside.

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
Known location profile anchors: Little Middleton Manor, Grand Entrance Hall, Library, Drawing Room, Cellar, the grand entrance hall of Voss Manor
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Entrance Hall", "Library", "Drawing Room", "Cellar", "the grand entrance hall of Voss Manor"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the grand entrance hall of Voss Manor". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 92/100):
  Quality gaps noted: word density below preferred target (767/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 93/100):
  Quality gaps noted: word density below preferred target (849/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8412; context=10517; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol automobiles on gravel drives | typewriters in offices | battery-operated radios | party-line telephones in use | telegram services available | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: narrow corridors limiting movement | locked rooms during certain hours | grounds with hedges obscuring visibility | restricted areas such as the cellar and staff quarters | permission required for entry to private study.
10. Sustain social coherence with this backdrop pressure: A tense inheritance dispute amidst the Great Depression draws heirs and their associates to the manor, where class tensions and personal grievances intertwine under the watchful eye of a mechanical clock that may hold deadly secrets.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and murder method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.65 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Medical records confirm his whereabouts.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her duties provide an alibi.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_2 must appear in Act 1, Scene 3 via Direct observation
- clue_5 must appear in Act 1, Scene 3 via Direct observation
- clue_6 must appear in Act 1, Scene 3 via Direct observation

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
- Chapter 3:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the grand entrance hall of Voss Manor.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: ""I was in the garden for a time, tending to my thoughts," Hale continued, his expression serious. "But I returned to the drawing room shortly before the clock stopped. I remember hearing the chime, and I thought it was o...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A faint scratch is visible on the clock face. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Suggests possible tampering with the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The scratch suggests tampering with the clock mechanism. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates that the clock may not be reliable.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The victim's watch shows twenty minutes past eleven. [clue_5] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contrasts the clock's time, suggesting a discrepancy.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock was tampered with to present a false timeline of events surrounding the murder. [clue_6] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates a deliberate alteration of time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: the golden glow of candlelight reflecting off polished furniture, the last light of day fading through the windows | the crackling of the fire in the hearth, the soft murmur of conversation from the drawing room | the rich scent of burning wood. Mood: tense anticipation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: The clock shows ten minutes past eleven
- Established timeline fact: Victim's watch shows twenty minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The summer morning at Little Middleton was thick with tension, the air heavy with the scent of damp earth and the steady drumming of rain on the roof. In the grand entrance hall of the Voss Manor, the polished marble floor glistened under the dim light of gas lamps, reflecting the ornate details of the ceiling above. Eleanor Voss stood frozen, her gaze fixed on the mechanical clock that loomed above the fireplace, its hands stubbornly frozen at ten minutes past eleven. The sound of distant thunder rumbled, echoing the turmoil within her heart as she grappled with the reality of the situation. The clock, a relic of her family's history, now bore witness to a tragedy that threatened to unravel everything she held dear.

Eleanor took a tentative step closer to the clock, her heart racing as she reached out to touch its cold surface. The mechanical clock in the grand entrance hall shows ten minutes past eleven. The implications of that time weighed heavily on her mind. If the clock was accurate, it meant the victim had died shortly before the hour, a detail that could shatter the carefully constructed facade of their lives. She felt a chill run down her spine, knowing that every moment counted in this unfolding nightmare. The thought of the victim's last moments haunted her, and she could hardly breathe as she turned to face the others gathered in the hall.

the captain Hale stood with his arms crossed, his expression a mixture of concern and determination. She had been a soldier, trained to face the worst of humanity, yet the sight of Eleanor's distress tugged at her heartstrings. "We need to understand what happened here, Eleanor. The clock's time suggests the murder occurred just before eleven, but we must confirm the details. We can't afford to jump to conclusions without evidence," she said, her voice steady despite the chaos swirling around them.

the doctor Finch, her brow furrowed with worry, adjusted her spectacles nervously. "I was with the victim just before the clock stopped. I can vouch for my whereabouts, but I fear that the truth may be more complicated than we realize. If the clock was tampered with, it could change everything we thought we knew about the timeline of events," she replied, her voice wavering slightly as she spoke. The weight of her secret hung heavily in the air, threatening to suffocate her under its pressure.

Beatrice Quill, ever the journalist, leaned forward, her eyes bright with a mix of curiosity and apprehension. "Several witnesses claim to have heard the struck chime just after eleven. If that's true, it means someone may have manipulated the clock to cover their tracks. We need to dig deeper into this. Everyone here had access to the victim, and any one of us could be a suspect," she urged, her tone urgent as she glanced between the others, searching for signs of guilt or innocence.

Eleanor's heart raced as she listened to the conversation unfold. The tension in the room was palpable, each word hanging in the air like the storm clouds gathering outside. She felt a surge of disbelief wash over her as she considered the implications of Beatrice's words. If the clock had been tampered with, it would mean that someone among them had not only committed murder but also had the audacity to manipulate time itself to evade justice. Eleanor's mind raced, piecing together the fragments of the night before, desperately searching for any clue that might lead her to the truth.

As the rain continued to summer, the atmosphere in the grand entrance hall grew heavier, the shadows creeping in from the corners as if they were alive, hiding secrets that begged to be uncovered. Eleanor stepped back from the clock, her mind swirling with questions. Who could have done this? And why? The answers felt just out of reach, like the fading echoes of the thunder outside. She knew they had to act quickly, or the truth might slip away forever.

The four of them stood together, a fragile alliance forged in the face of horror. Each was grappling with their own fears and suspicions, the weight of the clock's time pressing down on them like a shroud. Eleanor took a deep breath, steeling herself for the investigation ahead. They would need to confront their own demons as they sought the truth, and she would not allow the legacy of her family to be tarnished by this tragedy. With a determined nod, he turned to Captain Hale, ready to take the first step into the unknown.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradictions Unveiled
The late morning at Voss Manor was heavy with unspoken tension, the air thickened by the scent of damp earth as rain continued to summer outside. In the drawing room, the muted palette of greys cast shadows in the corners, gathering like the doubts swirling in Eleanor Voss's mind. The ticking of a grandfather clock punctuated the silence, each tick a reminder of the time slipping away as they faced the aftermath of the tragedy. Eleanor's heart raced as she recalled the events of the previous night, the weight of the clock's time pressing down on her like a shroud. She stood at the center of the room, her hands trembling as she clutched a handkerchief, masking her anxiety while trying to maintain a façade of composure.

the captain Hale leaned against the mantelpiece, his arms crossed, a frown etched on his face. "We need to clarify our accounts from last night, Eleanor. The clock's time suggests the murder occurred just before eleven, but we must confirm the details. We can't afford to jump to conclusions without evidence," she said, her voice steady despite the chaos swirling around them. Eleanor nodded, her mind racing as she considered the implications of Hale's words. If the clock was accurate, it meant the victim had died shortly before the hour, a detail that could shatter the carefully constructed façade of their lives.

the doctor Finch stood nearby, her brow furrowed with worry as she adjusted her spectacles nervously. "I was with the victim just before the clock stopped. I can vouch for my whereabouts, but I fear that the truth may be more complicated than we realize. If the clock was tampered with, it could change everything we thought we knew about the timeline of events," she replied, her voice wavering slightly as she spoke. The weight of her secret hung heavily in the air, threatening to suffocate her under its pressure. Eleanor's heart sank at the thought; if the clock had been manipulated, it would mean that someone among them had not only committed murder but also had the audacity to manipulate time itself to evade justice.

Beatrice Quill, ever the journalist, leaned forward, her eyes bright with a mix of curiosity and apprehension. "Several witnesses claim to have heard the struck chime just after eleven. If that's true, it means someone may have manipulated the clock to cover their tracks. We need to dig deeper into this. Everyone here had access to the victim, and any one of us could be a suspect," she urged, her tone urgent as she glanced between the others, searching for signs of guilt or innocence. Eleanor felt a surge of disbelief wash over her as she considered the implications of Beatrice's words. The conflicting accounts of the time of death from the witnesses only added to the mounting tension in the room.

Eleanor took a deep breath, steeling herself for the investigation ahead. "If the clock shows ten minutes past eleven, and the victim's watch shows twenty minutes past eleven, then the timeline of events surrounding the murder is misrepresented by the witnesses. We must determine how and why this happened," she said, her voice firm despite the uncertainty that gnawed at her. The others nodded, their expressions a mixture of concern and determination. The stakes were higher than ever, and Eleanor knew they had to act quickly, or the truth might slip away forever.

As the rain continued to summer, the atmosphere in the drawing room grew heavier, the shadows creeping in from the corners as if they were alive, hiding secrets that begged to be uncovered. Eleanor stepped back, her mind swirling with questions. Who could have done this? And why? The answers felt just out of reach, like the fading echoes of the thunder outside. She knew they had to confront their own demons as they sought the truth, and she would not allow the legacy of her family to be tarnished by this tragedy.

Captain Hale broke the silence, his voice cutting through the tension. "We need to establish a timeline of our own. Everyone here was present at the party, and we all have our own stories to tell. If we can piece together the events leading up to the murder, we might find the key to unraveling this mystery." His eyes scanned the room, landing on each of them in turn, as if daring them to speak up. Eleanor felt a flicker of hope; perhaps they could find a way to navigate through the chaos together.

"I was in the garden for a time, tending to my thoughts," Hale continued, his expression serious. "But I returned to the drawing room shortly before the clock stopped. I remember hearing the chime, and I thought it was odd that the clock had stopped at such a crucial moment. It felt almost... deliberate." His words hung in the air, a heavy accusation that seemed to linger between them. Beatrice raised an eyebrow, her interest piqued. "Deliberate? You think someone wanted the clock to stop?" she asked, her tone skeptical yet intrigued.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The faint scratch visible on the clock face."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Indicates that the clock was tampered with, suggesting a false timeline of events surrounding the murder."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Eleanor Voss
False assumption: The murder occurred just after the clock struck eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Secret",
    "setting": {
      "location": "the grand entrance hall of Voss Manor",
      "timeOfDay": "Midday",
      "atmosphere": "Curiously charged with anticipation as secrets linger"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Reveal the first physical clues that suggest tampering.",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_5"
    ],
    "dramaticElements": {
      "conflict": "The tension mounts as the true nature of the clock is revealed.",
      "tension": "Suspicion falls on the clock as the source of the mystery.",
      "microMomentBeats": [
        "Eleanor brushes her fingers over the clock face, lost in thought."
      ]
    },
    "summary": "Eleanor inspects the clock closely and discovers a faint scratch on the clock face. The group gathers around as she reveals that the victim's watch shows twenty minutes past eleven, creating a contradiction that hints at foul play.",
    "estimatedWordCount": 1800,
    "pivotElement": "The faint scratch visible on the clock face.",
    "factEstablished": "Indicates that the clock was tampered with, suggesting a false timeline of events surrounding the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial investigations reveal first clues, but they come with emotional strain as Eleanor wrestles with self-doubt.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often punctuating her points with historical anecdotes that reveal her deep knowledge."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited transportation options due to economic conditions; Social gatherings tightly controlled by class hierarchies; Restricted access to resources for the lower class; Lengthy travel times between the manor and village; Communication largely reliant on party lines and letters",
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
□ Chapter 3: "A faint scratch is visible on the clock face." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The scratch suggests tampering with the clock mechanism." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The victim's watch shows twenty minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock was tampered with to present a false timeline of events surrounding the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
