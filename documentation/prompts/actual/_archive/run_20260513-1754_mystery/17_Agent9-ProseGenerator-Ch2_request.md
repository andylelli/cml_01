# Actual Prompt Record

- Run ID: `mystery-1778694870982`
- Project ID: ``
- Timestamp: `2026-05-13T17:59:35.919Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `23f3f2082affa764`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, leading to a morally complex situation where the reader may sympathize despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: June 1932
Living in June 1932 is marked by a pervasive tension as the Great Depression continues to grip England, casting a long shadow over the lives of the wealthy and the impoverished alike. The air is thick with the scent of damp earth from the intermittent rains, mingling with the fragrances of blooming flowers in the gardens of country estates. Social gatherings still occur, but they are tinged with a sense of unease, as the wealthy cling to their privilege while the lower classes struggle. Amidst declining fortunes, whispers of unrest echo through society, fueled by rising fascist sentiments and labor strikes, making it clear that the old social order is under threat. Long summer days stretch into twilight, but the glow of these evenings is often eclipsed by worries about tomorrow, as families grapple with expectations of propriety and the weight of their secrets. The King's Birthday celebrations, once a time of joy, feel muted and overshadowed by economic hardship, reflecting the changing world and highlighting the chasms between classes.
Emotional register: A collective sense of anxiety and foreboding prevails as economic struggles intensify.
Physical constraints: Limited access to resources due to economic hardship. | Travel restrictions and reduced transportation options. | Communication often hindered by the lack of modern technology.
Current tensions (weave into background texture): Escalating social unrest in mining communities due to wage cuts. | Political polarization with the rise of the British Union of Fascists. | Ongoing discussions about unemployment benefits in Parliament.
Wartime context — Many families are still feeling the aftereffects of World War I service.: The strain between traditional values and modern struggles creates an underlying tension in social interactions. Absence effect: The absence of those who served, combined with lost fortunes, contributes to a sense of dislocation in society.

## Season Lock (mandatory — derived from June 1932)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
In an era of economic despair and class divide, the pursuit of truth reveals the fragility of human relationships and the depths of deception lurking beneath societal façades.

## Story Emotional Register
Dominant: The story unfolds with an underlying tension marked by emotional turmoil and societal strife.

Arc:
The emotional journey begins in the drawing room of Little Middleton Manor, where the guests gather for a seemingly joyous occasion, but an air of unease lingers. Eleanor Voss, the esteemed hostess, masks her financial desperation with charm, while her hidden jealousy for Captain Hale complicates her interactions. As the night progresses, the tension rises, culminating in the shocking discovery of Eleanor's murder. This pivotal moment shifts the guests from a festive atmosphere to one of fear and suspicion, as they realize the danger lurking within their midst. The investigation unfolds, revealing the characters' secrets and motives, each grappling with their own internal conflicts as they navigate the treacherous waters of accusation and denial.

The second turning point occurs when Dr. Mallory Finch's nervousness becomes apparent, hinting at his involvement in the clock tampering. As the climax approaches, the characters confront their fears and the truth reveals itself, leading to a dramatic confrontation where Finch’s guilt is exposed. The resolution brings a bittersweet sense of closure, as the remaining characters reflect on the fragility of trust and the cost of their secrets. The emotional register closes with a sense of haunting reflection, emphasizing the profound impact of deception on human relationships.

## Emotional register at this point in the story
An air of anticipation mixed with underlying tension fills the drawing room.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the tumultuous waters of June 1932 as a talented artist and socialite, feeling the pressures of both her personal struggles and the societal changes around her. Her financial desperation intertwines with her desire to maintain her status among the affluent, illustrating the harsh realities faced by many during this economic downturn.
Era intersection: Her unrequited love for Captain Hale and the recent murder of her patron intensify her emotional turmoil, reflecting the broader societal tensions.

### Dr. Mallory Finch
Dr. Mallory Finch is caught in the throes of financial instability amidst the Great Depression, grappling with ethical dilemmas that threaten to unravel his professional reputation. His polished exterior masks a growing desperation, highlighting the precarious position of many in his profession during this challenging time.
Era intersection: Finch's struggles resonate with the collective anxiety of the era, as societal expectations clash with personal survival.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor Voss speaks with a melodic cadence, her tone often reflecting her dry wit and insightful observations.
[comfortable] Isn't it amusing how art often imitates life, and yet here we are, tangled in our own drama?
[evasive] Oh, I was simply lost in thought, pondering the complexities of color theory.
[stressed] This chaos is unbearable! How can one find clarity amid such confusion?
Humour: Her dry wit adds an intriguing layer to her interactions.

### Dr. Mallory Finch (they/them/their)
Dr. Finch's voice is measured and articulate, often punctuated by medical jargon that reflects his profession.
[comfortable] Ah, the human body is a marvel, truly, but it does come with its complications.
[evasive] You see, the matter is rather delicate and requires careful handling.
[stressed] I assure you, my intentions are purely professional, amidst all this turmoil!
Humour: His observational humor lends a touch of levity to serious discussions.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room radiates both comfort and tension, where laughter mingles with unspoken secrets, creating an atmosphere thick with anticipation. The plush furnishings invite guests to relax, yet the air crackles with the weight of hidden agendas.. Camera angle: A writer entering this space should feel the conflicting emotions of ease and unease, capturing the underlying tension that pulses through the room.. Era: The opulence of the drawing room contrasts sharply with the economic struggles of the era, highlighting the stark divide between privilege and poverty.

The Library: The library is a sanctuary of knowledge and secrets, where the scent of old books and the warmth of the fireplace create an inviting yet foreboding atmosphere. It serves as a backdrop for discoveries that could change the course of the investigation.. Camera angle: The writer should evoke a sense of intimacy and discovery, inviting exploration of the hidden truths within these walls.. Era: The presence of classic literature reflects the era's intellectual pursuits, even as society grapples with pressing issues of class and privilege.

The Gardens: The gardens are a vibrant tapestry of color, offering a deceptive sense of peace amidst the turmoil within the manor. The fragrant blooms and rustling leaves create an illusion of tranquility, concealing the tension brewing in the shadows.. Camera angle: A writer should capture the enchanting yet unsettling ambiance, highlighting the duality of beauty and danger.. Era: The beauty of the gardens starkly contrasts with the economic struggles outside the estate, symbolizing the facade of privilege.

## Humour guidance for this story position (opening)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can lighten the mood amidst the tension.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder took place at the time indicated by the clock.
- Hidden truth to progressively expose: The actual time of death was later than indicated, allowing the murderer to escape suspicion.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: Witnesses reported hearing the clock strike a different hour at the time of death. | corr: The clock cannot be trusted as an accurate measure of time since it has been tampered. | effect: Eliminates the assumption that the murder occurred at the time indicated by the clock.
  - Step 2: obs: A note in Eleanor's handwriting indicated she was to meet someone at a quarter to midnight. | corr: The meeting time contradicts the clock's indication, suggesting the clock was adjusted. | effect: Narrows down the timeline of events leading to her death.
  - Step 3: obs: Dr. Mallory Finch has access to the study and was the last person seen near the clock. | corr: Finch had the opportunity and motive to tamper with the clock to mislead the investigation. | effect: Eliminates Finch's alibi during the critical time window.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and witness against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_10
- Fair-play rationale: Step 1: Witness statements about the clock striking (early) let the reader suspect tampering. Step 2: The note found (mid) confirms the discrepancy in time. Step 3: Dr. Finch's access and motive (discriminating test) link him directly to the crime.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a melodic cadence, her sentences often punctuated by insightful observations
She has a penchant for irony, occasionally merging her dry wit with heartfelt sincerity, especially when discussing art or her feelings for Hale.
Eleanor wrestles with her jealousy and longing for Captain Hale, which complicates her quest for truth. The fear that her emotions might cloud her judgment adds to her internal turmoil, as she grapples with the boundaries between personal feelings and her investigative instincts.

### Dr. Mallory Finch
Finch speaks with a measured, articulate tone, often peppering his conversations with medical jargon
He has a habit of observing the nuances of human behavior, using dry humor to diffuse tension, though he remains careful to maintain an air of professionalism.
Dr. Finch is torn between the ethical standards he once upheld and the financial pressures that now threaten to engulf him. This conflict breeds guilt and shame, as he grapples with the potential consequences of his actions on both his career and his moral compass.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a melodic cadence, her sentences often punctuated by insightful observations. She has a penchant for irony, occasionally merging her dry wit with heartfelt sincerity, especially when discussing art or her feelings for Hale.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it amusing how art often imitates life, and yet here we are, tangled in our own drama?"
  [evasive] "Oh, I was simply lost in thought, pondering the complexities of color theory."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her attachment to the victim, a patron who supported her art, drives her curiosity and desire to uncover the truth behind the murder, as it threatens not only her artistic integrity but also the very fabric of her social life." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a measured, articulate tone, often peppering his conversations with medical jargon. He has a habit of observing the nuances of human behavior, using dry humor to diffuse tension, though he remains careful to maintain an air of professionalism.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the human body is a marvel, truly, but it does come with its complications."
  [evasive] "You see, the matter is rather delicate and requires careful handling."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The recent scandal involving the victim's health has left Dr. Finch vulnerable, as the victim had been a prominent figure in the community. This connection adds a layer of desperation to his actions, fueling his need to protect his reputation amidst whispers of scandal." — do not surface in Act I.



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
An expansive country estate shrouded in mystery, where secrets linger in the shadows of its grand architecture and sprawling grounds.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery
- The Gardens (exterior): Clue discovery
- The Servants' Hall (interior): Clue discovery

Atmosphere: tense and foreboding due to recent social unrest and economic struggles
Weather: overcast with occasional rain, typical of the English countryside

Era markers: Gas lamps flicker in the hallways, casting a warm yet eerie glow. | A vintage radio crackles with news of political unrest and economic despair. | The distant sound of a steam train whistle echoes, linking the estate to the outside world.

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
The Drawing Room (interior):
  - Visual: The flickering gas lights create dancing shadows that play across the walls, illuminating the rich hues of the velvet upholstery., A grand piano sits in the corner, its surface dusted with a fine layer of neglect, hinting at the music once played here.
  - Sounds: The soft crackle of the fire provides a comforting backdrop, punctuated by the occasional creak of the floorboards as guests shift in their seats., Outside, the rain patters rhythmically against the glass, a constant reminder of the storm brewing both inside and out.
  - Scents: The air is thick with the scent of polished wood, mingling with the faint aroma of tobacco smoke lingering from the last gathering., A hint of lavender from the fresh flowers on the mantelpiece adds a touch of sweetness to the otherwise somber atmosphere.
  - Touch: The plush fabric of the armchairs invites guests to sink in, providing a temporary respite from the tension that fills the room., The coolness of the marble fireplace contrasts sharply with the warmth of the fire, creating a sense of comfort amid the underlying unease.

The Library (interior):
  - Visual: Sunlight filters through the tall windows, casting a warm glow upon the rich mahogany of the furniture, illuminating the dust motes that float lazily in the air., The spines of the books, in various shades of brown and burgundy, create a tapestry of history, inviting exploration and discovery.
  - Sounds: The soft rustle of pages turning fills the silence, as if the very books are whispering their secrets to those who dare to read them., The crackle of the fire provides a comforting backdrop, its warmth contrasting with the chill that seeps through the stone walls.
  - Scents: The scent of old paper and leather envelops the room, evoking a sense of nostalgia and the passage of time., A hint of smoke from the fireplace adds a layer of warmth, mingling with the musty aroma of the books.
  - Touch: The smooth, cool surface of the oak table invites one to linger, its polished finish a testament to the care taken in maintaining this sanctuary., The ro
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in June 1932 is marked by a pervasive tension as the Great Depression continues to grip England, casting a long shadow over the lives of the wealthy and the impoverished alike
- The air is thick with the scent of damp earth from the intermittent rains, mingling with the fragrances of blooming flowers in the gardens of country estates
- Social gatherings still occur, but they are tinged with a sense of unease, as the wealthy cling to their privilege while the lower classes struggle
- Amidst declining fortunes, whispers of unrest echo through society, fueled by rising fascist sentiments and labor strikes, making it clear that the old social order is under threat
- Long summer days stretch into twilight, but the glow of these evenings is often eclipsed by worries about tomorrow, as families grapple with expectations of propriety and the weight of their secrets

TEMPORAL CONTEXT:

This story takes place in June 1932 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies with intermittent rain, cool breezes typical of the English countryside, occasional bursts of sunlight breaking through clouds
- Daylight: Long summer days with daylight lasting until nearly ten o'clock, providing an eerie glow during twilight hours
- Seasonal activities: garden parties at country estates, cricket matches in the village green, evening strolls to enjoy the mild weather
- Seasonal occasions: King's Birthday on June 3rd, celebrated with local events but muted due to economic hardship
- Season: summer

Period Fashion (describe naturally):
- Men formal: three-piece wool suits with high-waisted trousers, white linen shirts with stiff collars, tweed blazers for less formal occasions
- Men casual: cotton trousers for garden parties, short-sleeved shirts in pastel colors, suspenders as a common accessory
- Men accessories: fedoras or flat caps, silk pocket squares, classic leather shoes polished to a high sheen
- Women formal: tea-length dresses with floral patterns, tailored jackets with padded shoulders, cloche hats adorned with ribbons
- Women casual: lightweight blouses with short sleeves, calf-length skirts in breezy fabrics, comfortable sensible shoes
- Women accessories: string pearls, embroidered handkerchiefs, wide-brimmed sun hats

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Best Things in Life Are Free' by Ray Henderson, 'My Heart Stood Still' by Richard Rodgers; Films: 'The Front Page', 'The Smiling Lieutenant'; Theatre: 'The Royal Family', 'The Front Page'; Radio: BBC News at Six, 'The Savoy Orpheans' program
- Typical prices: Loaf of bread: four pence, Pint of milk: two pence, Cinema ticket: one shilling
- Current events: unrest in mining communities due to wage cuts; rise of the British Union of Fascists led by Oswald Mosley
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Murder in the Mews' by Agatha Christie | 'Brave New World' by Aldous Huxley | [mystery and detective fiction] | [social commentary novels] | [escapist romance]
- Technology: the first commercially available radio sets | early forms of electric washing machines | advancements in motion picture technology | cylinder phonographs for music | manual typewriters in offices | basic telephones in homes
- Daily life: afternoon tea served in gardens, participation in local fairs and events, visiting the village pub for socializing
- Social rituals: Sunday church services followed by family gatherings, ladies' knitting circles in the afternoon, men playing cards or lawn bowls at the local club

Atmospheric Details:
The scent of damp earth and blooming flowers fills the air, matching the oppressive overcast sky. The distant sound of raindrops tapping against the windows harmonizes with the soft rustling of leaves, creating an unsettling ambiance. A sense of unease pervades the estate, as whispers of social unrest mingle with the laughter of garden parties, casting a shadow over the otherwise picturesque setting.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Char
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The true time of the victim's death: "a quarter to midnight"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] The clock cannot be trusted as an accurate measure of time since it has been tampered.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Suggests the clock's time is unreliable.

• [clue_culprit_direct_dr_mallory_finch] Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The true time of the victim's death: "a quarter to midnight"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Dr. Finch cleared his throat, breaking the silence that had settled over the room. "We must remain calm and collected. Panic will not serve us here. We need to gather our thoughts and piece together what we know." Her attempt at reassurance fell flat, and Elea..."
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
drawing room, manor, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light filtered weakly through the overcast skies, casting a muted glow over Little Middleton Manor.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Gardens, The Servants' Hall, the victim's study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Gardens", "The Servants' Hall", "the victim's study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the victim's study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 89/100):
  Quality gaps noted: word density below preferred target (676/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6428; context=9744; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio for news and entertainment | early telephones in homes | typewriters standard in offices | common household telephone usage | telegram services for urgent messages | airmail for long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: large estate layout allows for secluded areas and hidden pathways | manor architecture includes locked rooms and restricted access areas | weather can affect movement and evidence visibility | permissions required for entry to private areas of the estate | daily routines of staff and family dictate access to various locations.
10. Sustain social coherence with this backdrop pressure: A wealthy family gathers at their isolated estate for a tense weekend, where economic pressures and class distinctions heighten suspicions amidst a backdrop of social unrest.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (same method of deception involving timing)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (both involve murder with unknown motives and temporal elements)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time comparison
Test type: timing discrepancy

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Clear evidence of her whereabouts during the time of death.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Note found in the victim's belongings

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
  - Location anchor: the victim's study.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Dr. Finch cleared his throat, breaking the silence that had settled over the room. "We must remain calm and collected. Panic will not serve us here. We need to gather our thoughts and piece together what we know." Her at...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock cannot be trusted as an accurate measure of time since it has been tampered. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Suggests the clock's time is unreliable.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test. [clue_culprit_direct_dr_mallory_finch] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The true time of the victim's death, write exactly: "a quarter to midnight".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Clock in the study
- Established timeline fact: Victim's last known movements
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "a quarter to midnight" (The true time of the victim's death).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered weakly through the overcast skies, casting a muted glow over Little Middleton Manor. In the drawing room, the air was thick with tension, punctuated only by the distant sound of rain tapping against the windows. Eleanor Voss stood frozen, her gaze fixed on the clock that hung ominously on the wall, its hands forever frozen at ten minutes past eleven. The clock's stillness seemed to mock the chaos that had erupted in the household, a stark reminder of the night that had shattered their world. Her heart raced as she recalled the events that had transpired, the laughter that had filled the room now replaced by an unsettling silence. The scent of damp earth from the gardens mingled with the lingering aroma of coffee, creating a dissonance that mirrored her own turmoil.

As Eleanor approached the clock, she could feel the weight of its presence pressing down on her. It was a relic of a time when life flowed with certainty, unlike the current state of confusion surrounding the recent murder. Witnesses had reported hearing the clock strike a different hour at the time of death, a detail that gnawed at her mind. What did it mean? The implications were staggering, casting doubt on the alibis of everyone present that night. He glanced around the room, his eyes landing on the captain Hale, who stood with a furrowed brow, his expression a mixture of shock and disbelief. Had he heard the clock too? Was he hiding something?

The clock was reset to show ten minutes past eleven, obscuring the actual time of death, which was a quarter to midnight. The realization sent a shiver down Eleanor's spine. How could someone have tampered with the clock? The thought of betrayal within their circle was almost too much to bear. She turned her attention to the doctor Finch, who had just entered the room, her face pale and drawn. The doctor’s presence was unsettling; she had been the last person to see the victim alive, and now her nervous demeanor only fueled her suspicions. What secrets did she carry? Did she know more than she was letting on?

Beatrice Quill stood by the window, her arms crossed tightly over her chest, her expression unreadable. Eleanor felt a pang of sympathy for her friend, but the weight of the situation made it difficult to extend comfort. Beatrice's relationship with the victim had always been complicated, and now, with the specter of murder looming over them, Eleanor wondered if she could trust her. The tension in the room was palpable, each person grappling with their own fears and uncertainties. As the rain continued to summer outside, Eleanor felt a sense of urgency. They needed answers, and they needed them quickly. Who among them could be trusted, and who was hiding a dark secret?

Eleanor's thoughts were interrupted as Captain Hale spoke, his voice steady but laced with an undercurrent of frustration. "The clock was running fine during dinner last night. I distinctly remember it striking the hour. This is all very peculiar, isn't it?" His words hung in the air, a red herring that only deepened the mystery. If the clock had been functioning properly, how could it now show a different time? Eleanor's mind raced with possibilities, each more troubling than the last. They were all trapped in this web of suspicion, and the truth felt as elusive as the sunlight hidden behind the clouds.

Dr. Finch cleared his throat, breaking the silence that had settled over the room. "We must remain calm and collected. Panic will not serve us here. We need to gather our thoughts and piece together what we know." Her attempt at reassurance fell flat, and Eleanor could see the tension in her shoulders. What had she seen that night? What had she done? As the morning dragged on, Eleanor felt the weight of the situation pressing down on her. The truth was out there, lurking just beyond their reach, and she was determined to uncover it, no matter the cost.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The note indicating a meeting at a quarter to midnight"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Eleanor had a planned meeting that contradicts the clock's reading"

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder took place at the time indicated by the clock.
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
      "location": "the victim's study",
      "timeOfDay": "Later that morning",
      "atmosphere": "Somber and reflective"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Reveal important evidence and establish the victim's last actions",
    "cluesRevealed": [
      "clue_2",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "dramaticElements": {
      "conflict": "Tension between characters as suspicions rise",
      "tension": "Eleanor's determination clashes with Finch's evasiveness",
      "microMomentBeats": [
        "Eleanor's fingers tremble as she unfolds the note, revealing her meeting plans."
      ]
    },
    "summary": "In the study, Eleanor finds a note in the victim's belongings, written in her own hand, indicating a meeting at a quarter to midnight. Dr. Finch enters, his demeanor shifting from grief to concern as he reads the note.",
    "estimatedWordCount": 1500,
    "pivotElement": "The note indicating a meeting at a quarter to midnight",
    "factEstablished": "Establishes that Eleanor had a planned meeting that contradicts the clock's reading",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere shifts from festive to foreboding as Eleanor's murder is discovered.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor Voss speaks with a melodic cadence, her tone often reflecting her dry wit and insightful observations."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch",
      "form": "observational"
    },
    "eraTextureNote": "Limited access to resources due to economic hardship.; Travel restrictions and reduced transportation options.; Communication often hindered by the lack of modern technology.",
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
□ Chapter 2: "The clock cannot be trusted as an accurate measure of time since it has been tampered." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
