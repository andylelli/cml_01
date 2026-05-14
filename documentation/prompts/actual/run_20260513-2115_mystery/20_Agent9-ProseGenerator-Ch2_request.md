# Actual Prompt Record

- Run ID: `mystery-1778706926946`
- Project ID: ``
- Timestamp: `2026-05-13T21:20:44.165Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `3c29cd8ba60e7100`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a deep-seated desire to protect a loved one, complicating the moral judgment of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1932 July
In July 1932, the British countryside is marked by overcast skies and intermittent rain, creating a heavy atmosphere that mirrors the growing tension among the guests at the manor house. As twilight lingers into the evening, the oppressive humidity adds to the unease, with the soft patter of raindrops occasionally punctuating the air. The social elite find themselves confined within the elegant yet stifling walls, where whispered conversations and sidelong glances betray a deep undercurrent of suspicion, fueled by recent unsettling events in their lives. Fashion reflects the era's Art Deco influences, with men donning tailored suits and women in tea-length dresses, each outfit a statement of social standing amidst economic uncertainty. Daily life is punctuated by the rituals of the upper class, who indulge in afternoon tea gatherings and formal dinners while grappling with the harsh realities of the Great Depression that loom over their privileged existence.
Emotional register: The dominant emotional state is one of tension and distrust amid the facade of genteel hospitality.
Physical constraints: Travel is limited due to fuel rationing and economic hardship. | Communication relies on slow postal services and landlines. | Social gatherings are constrained by strict etiquette and class expectations.
Current tensions (weave into background texture): The ongoing impact of the Great Depression heightens social anxieties. | Concerns about rising fascism in Europe create political unease. | The economic divide fosters tension between classes.
Wartime context — Many men are returning from service in WWI, bringing with them emotional scars and complexities.: Communities are grappling with the absence of those lost to the war, creating a palpable sense of grief. Absence effect: The absence of loved ones magnifies feelings of isolation among those left behind.

## Season Lock (mandatory — derived from 1932 July)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
The story explores how secrets, when intertwined with ambition and jealousy, can lead to tragic outcomes and expose the fragility of human relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story conveys a pervasive sense of tension and distrust as secrets unravel.

Arc:
The story begins with an atmosphere thick with foreboding as a storm rages outside Little Middleton Manor, mirroring the turmoil within. The discovery of Captain Ivor Hale's body under suspicious circumstances sets off a chain reaction of unease among the gathered guests. Eleanor Voss, the sharp-witted amateur detective, is drawn into the investigation, her curiosity piqued by the dark history she shares with the victim. As she navigates the initial clues, the weight of her own secrets compounds the emotional cost of the investigation, creating a complex dynamic as she questions those around her.

Midway through the story, a pivotal moment shifts the investigation's direction when discrepancies in the grandfather clock's time are revealed, suggesting foul play. This revelation compels Eleanor to confront her past with Hale while also reevaluating her trust in others, heightening the stakes. As the investigation deepens, tensions rise, and hidden motives come to light, leading to a second turn when Beatrice Quill's unacknowledged feelings for Hale complicate the narrative further.

As the climax approaches, the pressure mounts, culminating in a confrontation where Eleanor must face not only the truth about Hale's death but also the ghosts of her past. The emotional weight of the resolution carries significant costs for each character; Eleanor's quest for truth threatens her reputation, while Dr. Finch's moral failings come to light, jeopardizing his career. Ultimately, the unraveling of secrets leaves the characters transformed, with the emotional register shifting to one of reflection and the fragile nature of trust ultimately exposed.

## Emotional register at this point in the story
The opening sets a tense atmosphere filled with foreboding.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a sharp-witted amateur detective, navigates the rigid class system of the 1930s with a deep-seated ambition to expose the truth. Her past connection with the victim complicates her role, as her hidden history threatens her credibility in a society that values propriety. As a journalist, she feels the weight of societal expectations while grappling with her own moral dilemmas, making her a complex figure in this turbulent time.
Era intersection: Eleanor's ambition and secrets reflect the societal pressures of the 1930s, where reputation and class significantly impact personal lives.

### Dr. Mallory Finch
Dr. Mallory Finch, a respected physician, is caught in a moral quagmire exacerbated by the economic strain of the Great Depression. His desperation leads him to ethical compromises that clash with the societal expectations of his profession. As a figure representing both care and ambiguity, his character embodies the struggle between professional integrity and personal survival in a time of economic uncertainty.
Era intersection: His financial troubles highlight the economic struggles of the 1930s, pushing him to the edge of moral compromise in a society that demands respectability.

### Captain Ivor Hale
Captain Ivor Hale, a charming ex-military officer, grapples with unrequited love and jealousy that complicate his relationships. His charismatic persona masks deep emotional scars, reflecting the societal expectations of masculinity in the 1930s. Caught between his feelings for Eleanor and the need to maintain his honor, Hale embodies the internal conflicts faced by men of his time, navigating a world shaped by war and shifting social dynamics.
Era intersection: His character reflects the societal norms of the 1930s, where emotional vulnerability is often masked by bravado.

### Beatrice Quill
Beatrice Quill, a devoted governess, struggles with her loyalty to the family she serves while harboring feelings for Captain Hale. Her quiet strength contrasts with the tumultuous emotions around her, embodying the internal conflicts faced by women in the 1930s. Beatrice represents the complexities of femininity in a time when women's roles were often limited, yet their desires and aspirations remained unspoken.
Era intersection: Her character illustrates the challenges women faced in the 1930s, where loyalty and desire often collided in a society that expected women to be subservient.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an articulate precision, often punctuating her sentences with a wry observation or sardonic remark.
[comfortable] You know, in a world of chaos, it’s the little truths that keep us grounded.
[evasive] I was merely observing the storm; it was quite captivating, wasn't it?
[stressed] The truth is a slippery thing, and I fear it may slip right through my fingers.
Humour: Her dry wit often surfaces in tense moments, providing a glimpse of her inner strength.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks in a soothing, melodic tone, often punctuated by self-deprecating remarks.
[comfortable] Ah, the joys of medicine, where every day is a new puzzle!
[evasive] I suppose one could say I was... elsewhere when the incident occurred.
[stressed] It’s quite overwhelming, really, trying to balance ethics and survival.
Humour: His self-deprecating humor often masks his deeper anxieties about his choices.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a confident, theatrical flair, often using dry humor to mask his vulnerability.
[comfortable] One must always find the humor in life’s little tragedies, wouldn’t you agree?
[evasive] I was merely enjoying the company; time slipped away from me.
[stressed] What a tangled web we weave when we’re trying to win back lost affection!
Humour: His sardonic wit adds depth to his character, revealing his inner turmoil.

### Beatrice Quill (she/her/her)
Beatrice speaks with a soft, nurturing tone, often using gentle humor to diffuse tension.
[comfortable] The children are a joy; they truly light up this gloomy place.
[evasive] I was just tending to the little ones; they keep me busy.
[stressed] It’s hard to focus on my duties with so much tension in the air.
Humour: Her gentle humor often serves to soften the harsh realities around her.

## Location Registers (scene framing guides)

The Library: The library feels like a sanctuary of knowledge, yet it is now tainted by the shadows of suspicion. Dust motes dance in the dim light, hinting at the secrets hidden within its walls. The air is thick with tension as guests attempt to discern truth from deception amidst the lingering scent of old books.. Camera angle: Entering this space, the writer should feel the weight of history and the urgency of uncovering hidden truths.. Era: The library's atmosphere reflects the 1930s' tension, where knowledge can both enlighten and ensnare.

The Drawing Room: The drawing room exudes an air of opulence yet is fraught with unease. Laughter echoes off the walls, but it feels strained, as if every gesture is scrutinized. The scent of roses mingles with tea, creating a deceptive comfort that belies the underlying tension among the guests.. Camera angle: The writer should capture the contrasts between elegance and tension, highlighting the characters' hidden agendas.. Era: Reflecting the 1930s, this room serves as a stage for the performance of social propriety, masking deeper conflicts.

The Kitchen: The kitchen is a bustling hub of activity, filled with warmth and the rich aromas of cooking. Yet, beneath the surface, whispers of unease ripple through the staff, who exchange worried glances as they prepare meals for the guests. The comforting chaos is tinged with anxiety, as the looming investigation casts a shadow over their work.. Camera angle: Writers should feel the contrast between the warmth of the kitchen and the tension of the unfolding drama.. Era: The kitchen reflects the 1930s' challenges, where class divides are palpable even in the heart of domestic life.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The serious nature of the crime and the tense atmosphere do not allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock shows the correct time of death.
- Hidden truth to progressively expose: The clock was tampered with to create a false timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The grandfather clock shows 9:15 PM when witnesses claim they heard a scream at 8:45 PM. | corr: The clock's time is inconsistent with witness testimony, indicating tampering. | effect: Narrows the timeline of the murder.
  - Step 2: obs: The clock's pendulum is swinging irregularly. | corr: The irregular movement suggests recent tampering, likely to alter the time. | effect: Eliminates the possibility that the clock is functioning correctly.
  - Step 3: obs: Footprints in the garden lead away from the dining room, but the path is obscured. | corr: The footprints could mislead the investigation regarding the real escape route. | effect: Narrows suspect access to the dining room.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled examination of the grandfather clock and comparison with witness statements reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_5, clue_core_contradiction_chain
- Fair-play rationale: Step 1: The clock shows 9:15 PM while witnesses heard a scream at 8:45 PM. Step 2: The pendulum's irregularity indicates tampering. Step 3: Footprints suggest misleading paths leading to Captain Hale's implication.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with an articulate precision, often punctuating her sentences with a wry observation or a sardonic remark
She has a tendency to lean in slightly when she speaks, as if sharing a delicious secret with her audience, drawing them into her narrative.
Eleanor grapples with guilt over her past, torn between her ambition and the moral implications of her relationship with the victim. She fears that uncovering the truth may not only ruin her career but also expose her vulnerabilities.

### Dr. Mallory Finch
Finch has a habit of speaking in a soothing, almost melodic tone, punctuated by self-deprecating remarks about the challenges of his profession
He often leans forward, as if confiding a secret, and tends to run his fingers through his hair when anxious.
Dr. Finch is torn between his desperation for money and his ethical obligations as a physician. The weight of his choices gnaws at him, leaving him feeling like a fraud in his own profession.

### Captain Ivor Hale
Captain Hale speaks with a confident, almost theatrical flair, his words flowing smoothly as he engages others
He often employs dry humor, using sarcasm to mask his vulnerability, and has a penchant for quoting poetry when emotions run high.
Captain Hale is torn between his love for Eleanor and his resentment towards her choice, wrestling with feelings of inadequacy and a desperate need for validation.

### Beatrice Quill
Beatrice speaks with a soft, nurturing tone, often using gentle humor to diffuse tension
She has a habit of pausing thoughtfully before responding, her expressions revealing her empathetic nature as she carefully chooses her words.
Beatrice struggles with her loyalty to the family and her burgeoning feelings for Captain Hale, feeling torn between her duty and her heart, leading to a sense of isolation.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with an articulate precision, often punctuating her sentences with a wry observation or a sardonic remark. She has a tendency to lean in slightly when she speaks, as if sharing a delicious secret with her audience, drawing them into her narrative.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, in a world of chaos, it’s the little truths that keep us grounded."
  [evasive] "I was merely observing the storm; it was quite captivating, wasn't it?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor was investigating the victim's family's financial troubles, fearing that exposure of their secrets would also reveal her past affair, jeopardizing her career and reputation." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch has a habit of speaking in a soothing, almost melodic tone, punctuated by self-deprecating remarks about the challenges of his profession. He often leans forward, as if confiding a secret, and tends to run his fingers through his hair when anxious.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the joys of medicine, where every day is a new puzzle!"
  [evasive] "I suppose one could say I was... elsewhere when the incident occurred."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Facing financial ruin, Dr. Finch stood to gain significantly from the victim's untimely demise, a motive that complicates his otherwise respectable facade." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a confident, almost theatrical flair, his words flowing smoothly as he engages others. He often employs dry humor, using sarcasm to mask his vulnerability, and has a penchant for quoting poetry when emotions run high.
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must always find the humor in life’s little tragedies, wouldn’t you agree?"
  [evasive] "I was merely enjoying the company; time slipped away from me."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The betrayal he feels from Eleanor's choice to be with another man has ignited a desire for revenge, clouding his judgment and leading him down a dark path." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a soft, nurturing tone, often using gentle humor to diffuse tension. She has a habit of pausing thoughtfully before responding, her expressions revealing her empathetic nature as she carefully chooses her words.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The children are a joy; they truly light up this gloomy place."
  [evasive] "I was just tending to the little ones; they keep me busy."
Humour: observational — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice may have felt compelled to act out of jealousy towards Eleanor's relationship with the victim, her emotions creating a potential motive that complicates her innocent facade." — do not surface in Act I.



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
A sprawling country estate marked by its grand architecture and extensive gardens, now shrouded in tension as secrets unfold among its guests.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Kitchen (interior): Clue discovery

Atmosphere: Tense, with an undercurrent of suspicion among the guests due to recent events.
Weather: Overcast with occasional rain, typical for a British countryside in the 1930s

Era markers: Petrol touring cars parked in the gravel driveway, their gleaming chrome contrasting with the damp morning. | An early home telephone system sits in the hallway, its bell ringing occasionally as messages are relayed. | Typewriters clatter in the study, echoing the urgency of correspondence amidst the brewing storm.

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
  - Visual: Dust motes dance in the dim light filtering through the heavy drapes, creating an ethereal quality in the otherwise shadowy room., The faint outlines of portraits hang on the walls, their eyes seeming to follow any movement, adding an unsettling presence to the atmosphere.
  - Sounds: The soft rustle of pages turning echoes in the stillness, a reminder of the knowledge contained within these walls., Occasional creaks of the old floorboards beneath one's feet add to the room's air of mystery, as if the very house is watching.
  - Scents: The musty scent of old books fills the air, combined with the faint aroma of polished wood and leather., A hint of dampness lingers in the corners, reminiscent of the rain-soaked earth outside, adding an oppressive weight to the atmosphere.
  - Touch: The coolness of the marble fireplace contrasts with the warm, worn texture of the leather armchairs, inviting yet foreboding., As one brushes their hand across the desk, the smooth surface is marred by scattered papers, a tactile reminder of the recent chaos.

The Drawing Room (interior):
  - Visual: Delicate porcelain figurines adorn the mantelpiece, glistening under the soft glow of gas lamps that illuminate the room with a warm, inviting light., The intricate patterns of the Persian rug beneath the guests' feet provide a vibrant contrast to the polished wooden floor, adding to the room's elegance.
  - Sounds: The murmur of voices fills the air, punctuated by the occasional clink of teacups and the rustle of silk dresses., A distant piano plays a soft melody, blending with the laughter and creating a comforting yet unsettling atmosphere.
  - Scents: The rich scent of freshly brewed tea mingles with the faint aroma of roses from the garden, creating a warm and inviting atmosphere., A hint of polished wood and leather from the furniture adds to the opulence, while the underlying scent of dampness reminds guests of the rainy weather outside.
  - Touch: The plush velvet upholstery of the armchairs invites guests to
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1932, the British countryside is marked by overcast skies and intermittent rain, creating a heavy atmosphere that mirrors the growing tension among the guests at the manor house
- As twilight lingers into the evening, the oppressive humidity adds to the unease, with the soft patter of raindrops occasionally punctuating the air
- The social elite find themselves confined within the elegant yet stifling walls, where whispered conversations and sidelong glances betray a deep undercurrent of suspicion, fueled by recent unsettling events in their lives
- Fashion reflects the era's Art Deco influences, with men donning tailored suits and women in tea-length dresses, each outfit a statement of social standing amidst economic uncertainty
- Daily life is punctuated by the rituals of the upper class, who indulge in afternoon tea gatherings and formal dinners while grappling with the harsh realities of the Great Depression that loom over their privileged existence.

TEMPORAL CONTEXT:

This story takes place in July 1932 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, muggy humidity
- Daylight: Long, dim summer days with twilight extending into the late evening, creating a tense atmosphere under the cloud cover.
- Seasonal activities: garden parties in the manor's expansive grounds, picking summer fruits such as strawberries, evening walks along the misty country lanes
- Seasonal occasions: none specific to this month
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits in light fabrics, crisp white shirts with detachable collars, bow ties or silk cravats
- Men casual: tweed trousers with a patterned waistcoat, linen shirts with rolled-up sleeves, soft loafers
- Men accessories: Homburg hats, pocket watches, handkerchiefs
- Women formal: tea-length dresses with fitted bodices and flared skirts, cloche hats adorned with ribbon or flowers, string of pearls or drop earrings
- Women casual: lightweight cotton blouses and skirts, sundresses in floral prints, broad-brimmed sun hats
- Women accessories: beaded handbags, silk scarves, fashionable gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Ray Henderson, Duke Ellington's jazz pieces; Films: 'Scarface' directed by Howard Hawks, 'Shanghai Express' starring Marlene Dietrich; Theatre: 'The Royal Family' by George S. Kaufman and Edna Ferber, 'Rope' by Patrick Hamilton; Radio: 'The Shadow' gripping listeners with its suspense, 'Amos 'n' Andy' providing comedic relief
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, A newspaper: three halfpence
- Current events: growing unrest due to the rise of fascism in Europe; discussions surrounding the British economy amidst the Great Depression
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Good Soldier' by Ford Madox Ford | 'The Glass Key' by Dashiell Hammett | [mystery and crime fiction] | [social realism] | [thrillers reflecting societal tensions]
- Technology: the radio gaining widespread use in households | advancements in sound technology for films | the introduction of the first commercial flight services | home telephones becoming standard | typewriters prevalent in offices and homes | early electric refrigerators replacing iceboxes
- Daily life: social tea gatherings among women, weekend outings to the countryside, attending cricket matches
- Social rituals: afternoon tea served with cakes and biscuits, formal dinner parties with a set dress code, Sunday church services followed by family gatherings

Atmospheric Details:
The damp scent of rain-soaked earth mingles with the floral fragrances of the manor's gardens. A pervasive tension hangs in the air, punctuated by the hushed whispers of guests discussing recent unsettling events. The flickering glow of gas lamps casts long shadows, enhancing the feeling of secrecy and suspicion within the opulent yet oppressive manor.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time several witnesses claim to have seen the victim alive: "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The grandfather clock shows a quarter past nine when witnesses claim they heard a scream at eight forty-five.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This contradiction indicates that the clock's time is not reliable.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time several witnesses claim to have seen the victim alive: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to tap against the windows, Eleanor felt a sense of urgency. The clock was not merely a timepiece; it was a potential witness to the events that had unfolded. The more she examined the room, the more she realized that every detail mattere..."
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
drawing room, manor, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light struggled to penetrate the heavy clouds that loomed over Little Middleton Manor, casting a dim pallor across the estate.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Kitchen, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Kitchen", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the dining room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: word density below preferred target (942/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6925; context=10851; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early home telephone systems | typewriters in use for correspondence | party-line telephone exchanges | telegram services for urgent messages | airmail available for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: geographic layout allows for specific movement patterns among staff and guests | architecture includes locked rooms and restricted areas | weather can impact evidence visibility and outdoor movement | restricted areas such as the library and family quarters | daily schedules dictate movement through public spaces.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a wealthy family's annual meeting becomes a pressure cooker of suspicion and social tension amid the backdrop of the Great Depression and rising political unrest.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same mechanical tampering method and similar crime structure)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Mysterious Affair at Styles' (similar cast structure with military and medical roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about Captain Hale's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Financial records show no motive and an alibi during the murder.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): Witness testimony confirms her location away from the dining room.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
  - Location anchor: the dining room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to tap against the windows, Eleanor felt a sense of urgency. The clock was not merely a timepiece; it was a potential witness to the events that had unfolded. The more she examined the room, the mor...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The grandfather clock shows a quarter past nine when witnesses claim they heard a scream at eight forty-five. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradiction indicates that the clock's time is not reliable.
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
  - If this batch mentions The time several witnesses claim to have seen the victim alive, write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: 8 PM
- Established timeline fact: 9 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past ten" (The time several witnesses claim to have seen the victim alive).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light struggled to penetrate the heavy clouds that loomed over Little Middleton Manor, casting a dim pallor across the estate. Inside, the air was thick with tension, punctuated only by the soft patter of rain against the windows. Eleanor Voss stood at the threshold of the drawing room, her heart racing as she took in the scene before her. The room was a chaotic blend of elegance and despair, the remnants of a lavish dinner now overshadowed by the grim reality of the previous night’s events. He could see the captain Hale pacing near the fireplace, his brow furrowed and hands shoved deep into the pockets of his tailored suit. Beatrice Quill hovered nearby, her expression a mixture of concern and confusion, while the doctor Finch leaned against the mantel, her face pale and drawn. Each of them seemed lost in their thoughts, grappling with the weight of the murder that had shattered their world.

Eleanor’s gaze fell upon the grandfather clock that stood against the wall, its polished wood gleaming dully in the muted light. The clock’s mechanism was partially exposed, revealing a hidden mechanism that suggested tampering. The pendulum swung with an irregular rhythm, as if it had been forcibly adjusted. She stepped closer, her fingers brushing against the cool surface of the clock, and noted the time displayed on its face: "ten minutes past eleven." The revelation sent a chill down her spine. How could the clock show such a time when witnesses had claimed to see Captain Hale alive at "twenty minutes past ten"? The possibility of foul play loomed large, and Eleanor felt a surge of determination to uncover the truth.

The implications of the clock’s condition were troubling. If someone had indeed tampered with it, it could mean that the time of death had been manipulated to create an alibi. Eleanor's mind raced with the possibilities. Who among them could have had the motive and opportunity to interfere with the clock? The thought that Captain Hale might have orchestrated such a deception gnawed at him, but he quickly dismissed it. He had seemed genuinely distraught over the loss, yet the evidence was undeniable. The clock’s mechanism was accessible, hinting at potential interference with timekeeping. He had to tread carefully; every suspect had access to the victim, and any misstep could lead his astray.

As she turned to face the others, Eleanor noticed Captain Hale’s intense gaze fixed on her, a mixture of hope and fear in his eyes. "You’re here to find out what happened, aren’t you?" he asked, his voice strained. She nodded, her heart heavy with the weight of the task ahead. "I intend to get to the bottom of this, Captain. We owe it to him to uncover the truth." Beatrice stepped forward, her hands clasped tightly in front of her. "What do you think happened, Eleanor? Do you believe it was murder?" The question hung in the air, heavy with unspoken fears. Eleanor hesitated, the gravity of the situation pressing down on her. "I can’t say for certain yet, but there are too many unanswered questions. We must examine everything closely, including the clock. It might hold the key to understanding what transpired last night."

Dr. Finch cleared her throat, her voice barely above a whisper. "The clock was running just fine during dinner, I assure you. I remember glancing at it while we were eating. It was quite punctual, as clocks go." Her attempt to assert the clock’s reliability only deepened Eleanor’s suspicion. Had she been trying to deflect attention away from the possibility of tampering? She studied her face, searching for any hint of deceit, but found only the weariness of a man burdened by grief. Captain Hale's expression shifted, a flicker of annoyance crossing his features. "It’s possible it was wound back after dinner, Dr. Finch. We all know how these things can be manipulated when emotions run high." The tension in the room thickened, each word hanging like a heavy fog, obscuring the truth.

Eleanor felt the weight of their scrutiny as she began to piece together the events leading to the murder. "We need to reconstruct the timeline of last night’s events. If we can determine exactly when the clock was tampered with, we might find the answers we seek. Each of you must be honest about your whereabouts during the evening. Any discrepancies could lead us to the truth." Beatrice nodded, her eyes wide with apprehension. "I was in the nursery with the children for most of the evening. I only came down for a short while to join you all for dinner." Captain Hale shifted uncomfortably, and Eleanor could sense the tension in his posture. "I was here, in the drawing room, entertaining our guests. I assure you, I had no reason to leave." Her voice was steady, but Eleanor detected a slight tremor beneath the surface.

As the rain continued to tap against the windows, Eleanor felt a sense of urgency. The clock was not merely a timepiece; it was a potential witness to the events that had unfolded. The more she examined the room, the more she realized that every detail mattered. She glanced around the drawing room, taking in the elegant decor, the scattered remnants of their last meal, and the lingering scent of damp wood. Each element painted a picture of the evening’s chaos, and she was determined to uncover the truth hidden within its walls. With a deep breath, Eleanor steeled herself for the investigation ahead. The clock’s mechanism, the conflicting accounts, and the emotions swirling around her were all pieces of a puzzle waiting to be solved.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The grandfather clock showing ten minutes past eleven, contradicting the scream's timing."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that there is a significant contradiction between the clock's time and witness testimonies."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Hale insists the clock has been reliable, misleading everyone into trusting it.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: The clock shows the correct time of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Contradicting Accounts",
    "setting": {
      "location": "the dining room",
      "timeOfDay": "Later that morning",
      "atmosphere": "Tension hangs in the air as everyone recounts their evening."
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish conflicting witness accounts regarding the time of the scream.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Witnesses provide contradictory testimonies.",
      "tension": "Each character's alibi starts to unravel.",
      "microMomentBeats": [
        "Eleanor's heart races as she hears Hale's version of events, sensing a lie."
      ]
    },
    "summary": "In the dining room, each character recounts their evening, but their accounts clash. Eleanor notes that the grandfather clock shows ten minutes past eleven, while witnesses claim they heard a scream at twenty minutes past ten. Tension rises as suspicions begin to surface.",
    "estimatedWordCount": 1800,
    "pivotElement": "The grandfather clock showing ten minutes past eleven, contradicting the scream's timing.",
    "factEstablished": "Establishes that there is a significant contradiction between the clock's time and witness testimonies.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Hale insists the clock has been reliable, misleading everyone into trusting it."
    },
    "emotionalRegister": "The initial investigation raises more questions than answers, deepening the sense of unease.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an articulate precision, often punctuating her sentences with a wry observation or sardonic remark."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Travel is limited due to fuel rationing and economic hardship.; Communication relies on slow postal services and landlines.; Social gatherings are constrained by strict etiquette and class expectations.",
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
□ Chapter 2: "The grandfather clock shows a quarter past nine when witnesses claim they heard a scream at eight forty-five." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 2: Contradicting Accounts",
      "summary": "In the dining room, each character recounts their evening, but their accounts clash. Eleanor notes that the grandfather clock shows ten minutes past eleven, while witnesses claim they heard a scream at twenty minutes past ten. Tension rises as suspicions begin to surface.",
      "paragraphs": [
        "The rain continued its relentless tapping against the windows, a rhythmic reminder of the storm that had enveloped Little Middleton Manor. In the dining room, the air was thick with tension as Eleanor Voss stood near the grandfather clock, her heart racing. The polished wood of the clock gleamed dully under the soft glow of the gas lamps, but its face revealed a troubling truth: it showed 'ten minutes past eleven.' How could this be, when witnesses had claimed to hear a scream at 'twenty minutes past ten'? The very thought sent a chill down her spine, amplifying her sense of urgency. She had to uncover the truth behind this contradiction, for it could hold the key to unraveling the mystery of Captain Ivor Hale's death.",
        "Eleanor stepped closer, her fingers brushing against the cool surface of the clock. The pendulum swung irregularly, a sign of tampering that suggested someone had deliberately altered the time. She felt a wave of frustration wash over her as she recalled the conflicting accounts from the others. How could they trust a clock that had been manipulated? The implications were staggering. If the clock had indeed been tampered with, it could mean that the time of death had been altered to create an alibi. Who among them had the motive and opportunity to interfere with the clock? A sense of dread settled over her as she considered Captain Hale, who had seemed genuinely distraught but might have orchestrated such a deception. Yet, the evidence was undeniable, and she had to tread carefully; every suspect had access to the victim, and any misstep could lead her astray.",
        "As the others gathered around the dining table, Eleanor's gaze shifted to Captain Hale, who was leaning against the mantel with an air of defiance. His brow was furrowed, and his hands were shoved deep into the pockets of his tailored suit. \"I assure you, the clock has been reliable,\" Hale insisted, his voice steady yet strained. \"It was working perfectly during dinner. I glanced at it several times, and it never faltered.\" His insistence struck Eleanor as odd, raising the hairs on the back of her neck. Why was he so eager to defend the clock? It was as if he feared the implications of its condition, and she couldn't shake the feeling that he was hiding something.",
        "Beatrice Quill stood nearby, her expression a mixture of concern and confusion. \"I was in the nursery with the children for most of the evening,\" she said, her voice trembling slightly. \"I only came down for a short while to join you all for dinner.\" Her alibi seemed plausible, but Eleanor couldn't help but wonder if there was more to Beatrice's story. Could she have left the nursery unnoticed? As she considered this, Dr. Mallory Finch leaned against the table, her face pale and drawn. \"I remember the clock being quite punctual, as clocks go,\" she said, her tone almost defensive. \"It was running just fine during dinner, I assure you.\"",
        "Eleanor's heart raced as she listened to Hale's version of events, sensing a lie hidden beneath his confident facade. The tension in the room thickened, each word hanging like a heavy fog. \"We need to reconstruct the timeline of last night’s events,\" Eleanor declared, her voice firm. \"If we can determine exactly when the clock was tampered with, we might find the answers we seek. Each of you must be honest about your whereabouts during the evening. Any discrepancies could lead us to the truth.\" The gravity of her words settled over the group, and she could see the apprehension in their eyes.",
        "Captain Hale shifted uncomfortably, his expression darkening. \"I was here, in the dining room, entertaining our guests. I assure you, I had no reason to leave.\" His voice was steady, but Eleanor detected a slight tremor beneath the surface. The conflicting accounts were unraveling before her eyes, and she had to remain vigilant. Beatrice nodded, her eyes wide with apprehension. \"I only left the nursery for dinner, I swear it. I wouldn't lie about that.\" The sincerity in her voice was palpable, yet Eleanor couldn't shake the feeling that everyone was hiding something.",
        "As the rain continued to patter against the windows, Eleanor felt a sense of urgency. The clock was not merely a timepiece; it was a potential witness to the events that had unfolded. The more she examined the room, the more she realized that every detail mattered. She glanced around the dining room, taking in the elegant decor, the remnants of their last meal, and the lingering scent of damp wood. Each element painted a picture of the evening’s chaos, and she was determined to uncover the truth hidden within its walls. With a deep breath, Eleanor steeled herself for the investigation ahead. The clock’s mechanism, the conflicting accounts, and the emotions swirling around her were all pieces of a puzzle waiting to be solved.",
        "Dr. Finch cleared her throat, her voice barely above a whisper. \"I suppose one could say I was... elsewhere when the incident occurred,\" she admitted, her gaze darting away from Eleanor's. Eleanor noted the hesitation in her tone, a subtle indication that perhaps Dr. Finch was not as innocent as she appeared. The doctor’s financial troubles had been the talk of the town, and Eleanor couldn't help but wonder if desperation had driven her to act in ways she would never admit. The stakes were rising, and the tension in the room was palpable. Each character's alibi began to unravel, revealing cracks in their carefully constructed facades.",
        "Eleanor looked at Hale, who was now watching her intently, his expression a mixture of hope and fear. \"You’re here to find out what happened, aren’t you?\" he asked, his voice strained. She nodded, her heart heavy with the weight of the task ahead. \"I intend to get to the bottom of this, Captain. We owe it to him to uncover the truth.\" The words hung in the air, a promise that she would not rest until the mystery was solved. But as she glanced back at the clock, the implications of its tampering loomed large. The truth was buried beneath layers of deception, and she was determined to peel them away, one by one."
      ]
    }
  ],
  "cast": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 2 | absent",
    "season_words_used": "summer | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_core_contradiction_chain: chapter 2 paragraph 1 | present",
    "early_observation_present": "description: chapter 2 paragraph 1 | present",
    "early_inference_present": "yes: paragraph immediately following observation | yes"
  }
}
```

## Message 5 (role=user)

```text
Attempt 2/4 — chapters 2 — 1 validation issue(s) to resolve:

═══ OTHER ERRORS (1) ═══
• Chapter 2: Chapter 2 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)

═══ RETRY MICRO-PROMPTS (1) ═══
• REPAIR [sensory_grounding — attempt 2]: The opening block (first 2 paragraphs) has only 1 sensory marker(s). Need at least 2.
  In paragraph 1 or 2, add 1 more word(s) from the EXACT list the validator counts:
  • Smell/scent: smell, scent, odor, fragrance
  • Sound: sound, echo, silence, whisper, creak
  • Tactile: cold, warm, damp, rough, smooth
  • Visual/light: glow, shadow, flicker, dim
  Use these words naturally in a sentence — e.g. "The cold of the hallway pressed against her cheeks" or "A creak from the floorboards above broke the silence."
  Do NOT use synonyms like 'chill' or 'murmur' — they are not counted.

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: unknown
ATTEMPT: 1/4
MANDATORY FIXES:
- Resolve unknown issues before accepting this batch.
- Chapter 2: Chapter 2 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)
```
