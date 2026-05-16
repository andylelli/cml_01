# Actual Prompt Record

- Run ID: `mystery-1778784318561`
- Project ID: ``
- Timestamp: `2026-05-14T18:50:44.136Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `17c5f83d4708dcb2`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit was attempting to protect a loved one, raising questions about the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1930-06
In June 1930, the Great Depression casts a heavy shadow over society, creating a climate of anxiety and uncertainty. People navigate long days filled with the threat of unemployment and the struggle to maintain their livelihoods. Social gatherings, once filled with laughter and joy, now echo with the undercurrents of tension as class disparities become increasingly evident. The air hangs thick with the scent of rain-soaked earth, mingling with the distant rumble of thunder that seems to mirror the tumultuous state of society. Amidst the opulence of estates like Little Middleton Manor, the stark contrasts of wealth and poverty breed resentment and suspicion, making every interaction fraught with hidden motives and unspoken fears.
Emotional register: Collectively, society grapples with a pervasive sense of foreboding and disillusionment, as dreams of prosperity fade into uncertainty.
Physical constraints: Limited access to transportation due to economic hardship | Communication slow and often unreliable, relying on telegrams and letters | Social gatherings dictated by strict class structures and etiquette
Current tensions (weave into background texture): Widespread labor strikes threatening the stability of the workforce | Increased tensions in Europe with the rise of fascism | The impact of the Great Depression on American and British economies
Wartime context — Many men returning from World War I struggle to reintegrate into civilian life, facing mental and emotional scars.: Communities remain divided, with class and gender roles being scrutinized and challenged amidst economic despair. Absence effect: The absence of many men from the workforce exacerbates existing economic struggles and creates tension in family dynamics.

## Story Theme
The story explores how the pursuit of truth can uncover hidden secrets, revealing the fragility of human connections amidst the weight of societal expectations, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Tense and foreboding, with an undercurrent of desperation and ambition.

Arc:
The story begins in the oppressive atmosphere of Little Middleton Manor, where the weight of recent social unrest looms over the residents. As Eleanor Voss discovers the victim's body, a ripple of shock spreads through the gathering, igniting a fierce determination within her to uncover the truth. Tension mounts as Eleanor delves into the investigation, collecting first clues that lead her down twisting paths of deception. The emotional cost of pursuing the truth weighs heavily on her, revealing the personal stakes tied to her family's reputation amidst the chaos of the Great Depression.

Midway through the story, a significant pivot occurs when the investigation uncovers evidence of clock tampering, changing the direction of the inquiry and casting doubt on the alibis of those involved. This revelation forces Eleanor to confront hidden motives and the moral complexities surrounding the suspects. As the narrative progresses, further revelations color earlier events, highlighting the interconnectedness of each character's desires and fears.

The pressure culminates in a tense climax where secrets are laid bare, and confrontations arise as Eleanor faces Dr. Mallory Finch, the prime suspect. The emotional stakes reach a boiling point as the truth emerges, forcing each character to grapple with the consequences of their actions. Ultimately, the resolution carries a heavy emotional weight for all involved, with Eleanor reclaiming her agency but at the cost of exposing painful family secrets. The aftermath leaves her contemplating the true price of truth, while Dr. Finch must confront the fallout of his desperation.

## Emotional register at this point in the story
The atmosphere is thick with tension, foreshadowing the tragedy that will unfold.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss is a resilient journalist navigating the turbulent waters of the 1930s, where the weight of societal expectations clashes with her desire for truth. Her family's financial struggles amplify her determination to expose corruption, making her a symbol of the fight against class disparities. As she ventures into the investigation, Eleanor embodies the spirit of those confronting the harsh realities of the Great Depression, driven by a need to reclaim her agency.
Era intersection: Eleanor's private struggle with her family's financial troubles mirrors the broader economic despair of the era, making her pursuit of truth both a personal and societal endeavor.

### Dr. Mallory Finch
Dr. Mallory Finch represents the moral complexity of the 1930s, where societal pressures and personal demons collide. As a physician battling a gambling addiction, he embodies the fragility of reputation in a time when economic stability is precarious. Mallory's desperation for financial security reflects the broader anxieties faced by many during the Great Depression, where the pursuit of survival often leads to ethical dilemmas.
Era intersection: His struggle with gambling addiction highlights the societal pressures of the Great Depression, showcasing how personal failings can become intertwined with economic survival.

### Captain Ivor Hale
Captain Ivor Hale is a retired military officer grappling with the loss of his family's former glory amidst the evolving social landscape of the 1930s. His ambition to reclaim wealth and status reflects the societal obsession with class and reputation, while his internal conflict reveals the moral ambiguity of pursuing wealth at any cost. Ivor's character serves as a lens through which to examine the desperation of those striving for relevance in a changing world.
Era intersection: His desire to restore his family's fortune embodies the collective aspiration of many during the Great Depression, as individuals grapple with their identities in a society increasingly defined by wealth and class.

### Beatrice Quill
Beatrice Quill is a passionate art student, embodying the voice of a generation challenging class norms in the face of overwhelming privilege. Her resentment towards the wealthy elite underscores the societal tensions of the 1930s, where art becomes a tool for social critique. Beatrice's character reflects the struggles of those marginalized by a system that values wealth over talent, making her journey poignant in a time of upheaval.
Era intersection: Her struggle for recognition mirrors the broader fight for women's rights and social equality, as the 1930s see a burgeoning awareness of class disparities.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a brisk, assertive rhythm, her words often laced with dry wit that challenges her audience's assumptions.
[comfortable] I suppose the truth is a bit like this rain; it creeps in unexpectedly, doesn’t it?
[evasive] Oh, I wouldn't want to speculate on that. Speculation leads only to trouble.
[stressed] Time is running out, and every moment wasted is another chance for the truth to slip away.
Humour: Her dry wit often provides a sharp contrast to the tension of the investigation.

### Dr. Mallory Finch (he/him/his)
Mallory speaks in a calm, measured tone, often punctuating his sentences with soft chuckles that add a layer of self-deprecation.
[comfortable] Ah, the joys of medicine; it seems I’m always in need of a remedy myself!
[evasive] I really wouldn’t want to draw conclusions too hastily; let’s not be hasty.
[stressed] I can't afford another mistake; it could cost me everything I've worked for.
Humour: Mallory's self-deprecating humor often masks his deeper anxieties.

### Captain Ivor Hale (he/him/his)
Ivor's commanding voice is often laced with sarcasm, reflecting his social ambitions and underlying frustrations.
[comfortable] Ah, the grandeur of this estate; it’s a fine reminder of what we’ve lost.
[evasive] I’d rather not discuss my past; it’s quite behind me now, isn’t it?
[stressed] The stakes are high, and I refuse to let a mere trifle ruin my plans.
Humour: His polite savagery often serves as a mask for his deeper ambitions.

### Beatrice Quill (she/her/her)
Beatrice speaks with an animated cadence, her words rich with imagery and sharp observations that challenge societal norms.
[comfortable] Art is the voice of the unheard; it speaks where words often fail.
[evasive] I’d rather not dwell on the past; let’s focus on the beauty around us.
[stressed] Every brushstroke is a battle; I can’t afford to lose this one.
Humour: Her sardonic wit often provides a sharp critique of the elite she resents.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets and unspoken words, its dim light casting shadows that seem to whisper the truth. As guests gather, the air is thick with tension, each creak of the floorboards amplifying the sense of unease. The rich aroma of aged books mingles with the metallic tang of anxiety, creating an atmosphere ripe for revelation and deception.. Camera angle: Entering the library, the writer should adopt a tone of foreboding curiosity, as if every detail holds the key to unraveling the mystery.. Era: The weight of the Great Depression hangs over this once-grand space, making its opulence feel like a mockery of the times.

The Drawing Room: The drawing room serves as a stage for both social interaction and underlying tension. Its opulent decor belies the unease that simmers beneath the surface, with laughter echoing against the backdrop of recent turmoil. The sweet scent of fresh flowers contrasts with the heavy atmosphere, making it a space where appearances are carefully maintained, yet truths are perilously close to the surface.. Camera angle: As a writer enters the drawing room, the emotional stance should be one of cautious observation, aware of the fragility of the social fabric.. Era: The societal pressures of the 1930s create a palpable tension, where every interaction is laden with unspoken expectations.

The Study: The study is a sanctuary of thought, cloaked in shadows and secrets. Here, the tension of the investigation hangs thick in the air, each tick of the clock echoing the urgency of the unfolding drama. The sharp scent of ink mingles with the musty aroma of old books, creating a space that feels both inviting and oppressive, urging the investigator to uncover the truth.. Camera angle: Entering the study, the writer should feel the weight of introspection and urgency, as if every detail could lead to a breakthrough.. Era: The isolation of the study reflects the broader disconnection of individuals struggling against societal expectations during the Great Depression.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene sets a serious tone with the discovery of the body, making humor inappropriate.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time of death aligns with the victim's last known movements.
- Hidden truth to progressively expose: The clock was deliberately tampered with to mislead investigators.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock showed ten minutes past eleven when first checked. | corr: This indicates that something is wrong with the clock's timing. | effect: Narrows the time of death to before eleven.
  - Step 2: obs: Witnesses recall hearing the clock chime at the hour. | corr: If the clock chimed correctly, it should not have been tampered with. | effect: Eliminates the possibility of an accurate time of death being established.
  - Step 3: obs: Footprints in the garden appear to match Dr. Finch's shoes. | corr: This suggests Dr. Finch was near the study around the time of death. | effect: Narrows suspect access windows.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, minut, and eleven against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_mechanism_visibility_core, clue_6
- Fair-play rationale: Step 1: The clock's time discrepancy and witness accounts (early) expose the tampering. Step 2: Footprints lead to Dr. Finch (mid) confirming his presence. Step 3: The trap reveals the clock as the critical false alibi, identifying Finch as the culprit.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a brisk, assertive rhythm, often punctuating her points with sardonic comments
She has a tendency to use rhetorical questions that challenge her audience's assumptions.
Eleanor grapples with the fear that exposing her family's dark past may lead to personal ruin, as she clings to the hope of redemption both for herself and the society she critiques.

### Dr. Mallory Finch
Mallory speaks with a calm, measured tone, often punctuating his sentences with soft chuckles at his own misfortunes
He has a tendency to downplay his achievements, making light of his situation with a wry smile.
Mallory is caught in a moral quandary, torn between his professional ethics and the desperation of his financial situation, fearing that one misstep could cost him everything.

### Captain Ivor Hale
Ivor speaks in a commanding voice, laced with a hint of sarcasm
He employs grand gestures and formal language, often punctuating his statements with a knowing smile that hints at his deeper ambitions.
Ivor is torn between his ambition to reclaim his family's legacy and the ethical implications of his actions, fearing that his desperation might lead him to unspeakable lengths.

### Beatrice Quill
Beatrice speaks with a lively, animated cadence, often punctuating her thoughts with sharp, sardonic observations
Her language is rich with imagery, reflecting her artistic background.
Beatrice wrestles with feelings of inadequacy and the impulse to reject societal norms, struggling to find her place in a world that seems rigged against her.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a brisk, assertive rhythm, often punctuating her points with sardonic comments. She has a tendency to use rhetorical questions that challenge her audience's assumptions.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I suppose the truth is a bit like this rain; it creeps in unexpectedly, doesn’t it?"
  [evasive] "Oh, I wouldn't want to speculate on that. Speculation leads only to trouble."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor seeks to uncover the truth behind the Voss family's wealth and their ties to a corrupt business deal." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Mallory speaks with a calm, measured tone, often punctuating his sentences with soft chuckles at his own misfortunes. He has a tendency to downplay his achievements, making light of his situation with a wry smile.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the joys of medicine; it seems I’m always in need of a remedy myself!"
  [evasive] "I really wouldn’t want to draw conclusions too hastily; let’s not be hasty."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory would benefit from inheriting a substantial amount of money from the victim to settle his growing debts." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks in a commanding voice, laced with a hint of sarcasm. He employs grand gestures and formal language, often punctuating his statements with a knowing smile that hints at his deeper ambitions.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the grandeur of this estate; it’s a fine reminder of what we’ve lost."
  [evasive] "I’d rather not discuss my past; it’s quite behind me now, isn’t it?"
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor wants to ensure that the victim's death secures him a larger inheritance from the family estate." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a lively, animated cadence, often punctuating her thoughts with sharp, sardonic observations. Her language is rich with imagery, reflecting her artistic background.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is the voice of the unheard; it speaks where words often fail."
  [evasive] "I’d rather not dwell on the past; let’s focus on the beauty around us."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice feels that the victim's family embodies everything wrong with society and may have acted out of anger." — do not surface in Act I.



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
Little Middleton Manor stands as a grand, yet foreboding estate, isolated amidst sprawling grounds and encroaching woodlands, a remnant of a bygone era.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Private investigation space

Atmosphere: Tense and foreboding due to recent social unrest
Weather: Overcast with intermittent rain, typical for the season

Era markers: Petrol-driven automobiles parked in the gravel driveway | A domestic telephone resting on an oak side table in the drawing room | The rhythmic clatter of a typewriter echoing from the study

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
  - Visual: Rich, dark wood paneling envelops the room, while the dim light casts a warm glow on the spines of countless books, their titles obscured by layers of dust., An antique globe stands in the corner, its surface faded and cracked, a testament to the passage of time and forgotten journeys.
  - Sounds: The soft rustle of pages turning breaks the silence, punctuated by the occasional crackle from the fireplace as embers shift in their bed., The distant sound of rain tapping against the window creates a rhythmic backdrop, adding to the library's quiet, contemplative atmosphere.
  - Scents: The air is thick with the scent of aged paper, mingling with the rich aroma of polished wood and the faint hint of tobacco smoke lingering from past visitors., A subtle whiff of dampness from the rain outside adds an earthy quality, grounding the space in the present moment.
  - Touch: The leather-bound books feel cool and smooth to the touch, their spines well-worn from years of use, inviting exploration., The heavy, textured fabric of the armchairs offers a comforting embrace, providing a stark contrast to the cold marble floor beneath.

The Drawing Room (interior):
  - Visual: Richly patterned wallpaper in muted hues envelops the walls, while plush, overstuffed sofas invite guests to relax and converse., A large, ornate rug covers the wooden floor, its vibrant colors muted by the dim light, providing a sense of warmth and comfort.
  - Sounds: The soft murmur of conversation fills the air, punctuated by the occasional clink of glassware from a nearby side table, hinting at the presence of refreshments., The gentle playing of the piano creates a melodic backdrop, weaving through the conversations like a delicate thread.
  - Scents: The sweet scent of fresh flowers from a crystal vase on the mantelpiece mingles with the rich aroma of aged spirits, creating a heady combination., A faint hint of tobacco smoke lingers in the air, a reminder of the evening's earlier discussions.
  - Touch: The plush fabric of the sofas feels inviting and warm against the skin, offering a comforting embrace to those who take a seat., The coolness of the marble fireplace contrasts sharply with
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In June 1930, the Great Depression casts a heavy shadow over society, creating a climate of anxiety and uncertainty
- People navigate long days filled with the threat of unemployment and the struggle to maintain their livelihoods
- Social gatherings, once filled with laughter and joy, now echo with the undercurrents of tension as class disparities become increasingly evident
- The air hangs thick with the scent of rain-soaked earth, mingling with the distant rumble of thunder that seems to mirror the tumultuous state of society
- Amidst the opulence of estates like Little Middleton Manor, the stark contrasts of wealth and poverty breed resentment and suspicion, making every interaction fraught with hidden motives and unspoken fears.

TEMPORAL CONTEXT:

This story takes place in June 1930 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool breezes
- Daylight: Days are long, with twilight stretching into the late evening, creating an eerie atmosphere as shadows deepen.
- Seasonal activities: garden parties, afternoon teas, short walks in the countryside
- Seasonal occasions: Father's Day (June 15)
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits, fedoras, polished leather shoes
- Men casual: lightweight linen trousers, button-up shirts with rolled sleeves, cotton vests
- Men accessories: pocket watches, silk ties, cufflinks
- Women formal: elegant tea dresses with floral patterns, cloche hats, beaded handbags
- Women casual: light cotton blouses, swing skirts, sandals or low-heeled shoes
- Women accessories: string pearls, wide-brimmed hats, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'Happy Days Are Here Again' by Milton Ager, 'Puttin' on the Ritz' by Irving Berlin; Films: 'The Jazz Singer' (1927), 'All Quiet on the Western Front' (1930); Theatre: 'The Front Page' (1928), 'The Royal Family' (1927); Radio: 'Amos 'n' Andy', 'The Shadow'
- Typical prices: loaf of bread: four pence, a dozen eggs: one shilling, newspaper: three halfpence
- Current events: widespread labor strikes in the UK; increased tensions in Europe with the rise of fascism
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [mystery] | [social commentary] | [speculative fiction]
- Technology: the radio | the electric refrigerator | the typewriter | domestic telephones | petrol-driven cars | motion picture cameras
- Daily life: visiting local parks, attending community events, participating in summer fairs
- Social rituals: afternoon tea gatherings, weekly church services, evening family dinners

Atmospheric Details:
The scent of rain-soaked earth mingles with the faint aroma of blooming roses from the estate's gardens. The sound of distant thunder rumbles ominously, adding to the palpable tension in the air as the evening approaches. The flickering light of oil lamps casts long shadows in the dimly lit rooms, creating an unsettling ambiance as secrets linger in the corners.

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
1. Date references: Mention month/season at least once early in story
2. Fashion descriptions: Every c
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

• [clue_mechanism_visibility_core] The clock showed ten minutes past eleven when first checked.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This establishes a timeline for the events leading to the murder.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, the study of the Finch residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "the study of the Finch residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study of the Finch residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5352; context=9963; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-driven automobiles | domestic telephones | typewriters | telephone communication | telegram services | airmail.
9. Respect setting movement/access constraints in scene action and alibis: layout restricts movement to main corridors | formal rooms are off-limits to staff | weather can impede outdoor access | restricted access to the upper floors | staff only allowed in service areas.
10. Sustain social coherence with this backdrop pressure: A gathering at the isolated manor for a family meeting amid economic despair intensifies tensions among the socially diverse guests, each grappling with their precarious status in a changing world.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same crime method of poisoning).
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.85 with 'The Mysterious Affair at Styles' (same false assumption about time of death).
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure with a doctor character).
15. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
16. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Her alibi is confirmed by other guests.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): His whereabouts were accounted for by multiple witnesses.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
  - Location anchor: the study of the Finch residence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock showed ten minutes past eleven when first checked. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This establishes a timeline for the events leading to the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The room is cloaked in a soft, grey light as rain streaks down the window, blurring the view of the gardens outside., Papers on the desk are slightly damp from the humidity, their edges curling as if echoing the weather's dreariness. | The steady patter of rain against the glass creates a soothing, yet melancholic rhythm that fills the space., Occasional thunder rumbles in the distance, adding an ominous undertone to the otherwise quiet atmosphere. | The scent of wet earth wafts in through the slightly open window, mingling with the musty aroma of the books lining the shelves.. Mood: oppressive.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Clock time at ten minutes past eleven
- Established timeline fact: Witness accounts of clock chiming
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock found on the mantelpiece — showing ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim died no later than eleven past eleven, contradicting three suspects' alibis."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions the victim's last sighting at the dinner party, suggesting a timeline conflict.

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
False assumption: The time of death aligns with the victim's last known movements.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study of the Finch residence",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor gazes at the clock, its hands frozen, a chill running through her."
      ]
    },
    "summary": "In the dim light of the Finch study, Eleanor Voss stumbles upon a chilling scene: the doctor Finch stands over the lifeless body of his relative, the clock ominously showing ten minutes past eleven. The atmosphere is thick with shock as the captain Hale and Beatrice Quill arrive, their expressions a mixture of grief and confusion.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock found on the mantelpiece — showing ten minutes past eleven.",
    "factEstablished": "Establishes that the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions the victim's last sighting at the dinner party, suggesting a timeline conflict."
    },
    "emotionalRegister": "The atmosphere is thick with tension, foreshadowing the tragedy that will unfold.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a brisk, assertive rhythm, her words often laced with dry wit that challenges her audience's assumptions."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to transportation due to economic hardship; Communication slow and often unreliable, relying on telegrams and letters; Social gatherings dictated by strict class structures and etiquette",
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
□ Chapter 1: "The clock showed ten minutes past eleven when first checked." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 3/6 — chapters 1 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 1 marked non-convergent after attempt 2/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Character "Beatrice Quill" has incorrect pronouns. Should use she/her/her but found: he, his
MITIGATION MODE: tighten_obligation
```
