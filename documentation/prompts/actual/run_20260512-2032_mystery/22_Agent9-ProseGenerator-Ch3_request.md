# Actual Prompt Record

- Run ID: `mystery-1778617941534`
- Project ID: ``
- Timestamp: `2026-05-12T20:37:59.392Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `f1387034767634b9`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, complicating the judgment of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: September 1935
In September 1935, as the leaves begin to turn and the chill of autumn settles over England, the atmosphere is heavy with the weight of the Great Depression. The overcast skies and intermittent rain cast a pall over daily life, echoing the uncertainties faced by both the affluent and the struggling working class. The air is filled with the scent of damp earth, mingling with the remnants of summer, as families gather for evening tea in homes that once brimmed with laughter, now overshadowed by whispers of discontent. In the upper echelons of society, the pressure to maintain appearances is palpable; the looming Harvest Festival serves as a bittersweet reminder of abundance while many suffer from unemployment and economic hardship. Class distinctions remain stark, with the upper class grappling to sustain their status amidst dwindling fortunes. The fabric of everyday life is woven with rituals of politeness and decorum, yet beneath the surface lie tensions that threaten to unravel the social order. As political discourse grows charged with the rise of fascism abroad, the community in Little Middleton reflects a microcosm of larger societal anxieties, where the past holds a tight grip on the present, and the future remains uncertain.
Emotional register: A collective anxiety permeates society, with individuals caught between the desire for stability and the fear of losing their social standing.
Physical constraints: Limited access to transportation due to economic strain, making travel difficult. | Reliance on typewriters and telephones for communication, slowing down information exchange. | The isolated location of Little Middleton Manor restricts outside influence and support. | The weather conditions of autumn bring frequent rain, making movement outdoors cumbersome.
Current tensions (weave into background texture): The Nazi Party consolidates power in Germany, raising fears of fascism. | Economic challenges from the Great Depression affect social mobility and stability. | Class tensions escalate as the affluent become increasingly disconnected from the working class.
Wartime context — The absence of many young men who served in World War I still resonates, shaping societal attitudes towards honor and duty.: The community's fabric is woven tightly with shared experiences of loss and resilience, yet the shadows of past conflicts linger. Absence effect: Families are often defined by the absence of their loved ones, creating a sense of longing and unresolved grief.

## Season Lock (mandatory — derived from September 1935)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The story explores how the pressures of inheritance and hidden secrets can lead individuals to desperate actions, ultimately revealing the fragility of human relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story’s overall emotional character is one of tension and revelation.

Arc:
The narrative opens in the serene yet foreboding atmosphere of Little Middleton Manor, where the lush gardens and ivy-clad walls are juxtaposed with the underlying tensions between the characters. As Eleanor Voss is found dead, the initial shock reverberates through the household, setting the stage for a complex exploration of secrets and motives. The rising tension is palpable as each character wrestles with their own demons and the implications of their past actions. Dr. Mallory Finch and Captain Ivor Hale, both grappling with their own ethical dilemmas, navigate the investigation, while Beatrice Quill’s envy and aspirations add another layer of complexity to the unfolding drama. The first turning point occurs with the revelation of the tampered clock, which not only hints at malicious intent but also introduces doubt among the suspects. This moment shifts the narrative from a simple murder mystery into a web of deceit and betrayal.

As the investigation intensifies, the stakes become increasingly personal, with each character's vulnerabilities laid bare. Their interactions are charged with suspicion, revealing hidden alliances and rivalries that threaten to unravel their carefully constructed lives. The second turning point occurs when the evidence begins to point toward Captain Hale, forcing him to confront his own financial desperation and the lengths he would go to secure his future. The tension peaks as the characters grapple with the moral implications of their choices, leading to a climactic confrontation where secrets are exposed, and true motives come to light.

In the resolution, the emotional weight of the narrative culminates in a poignant reflection on the fragility of trust and the consequences of unchecked ambition. As the dust settles, the characters are left to reckon with their choices, and the manor itself stands as a testament to the secrets it has harbored. The emotional register shifts from one of tension and conflict to a somber understanding of the human condition, leaving the reader to ponder the cost of inheritance and the burden of legacy.

## Emotional register at this point in the story
The discovery of the murder introduces a sense of urgency and fear.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of women in the 1930s, caught between societal expectations and personal desires. As a wealthy heiress, her position is precarious; she must navigate her family's legacy while grappling with the shadows of her past. With the threat of exposure looming, Eleanor's inner turmoil reflects the broader tensions faced by women of the era, who often had to sacrifice their autonomy for the sake of family honor.
Era intersection: Eleanor's internal conflict resonates with the societal pressures of the time, where women's roles were often defined by their relationships rather than their individual pursuits.

### Dr. Mallory Finch
Dr. Mallory Finch represents the moral complexities faced by professionals in the 1930s, particularly as the Great Depression forces ethical compromises. As a physician, their dedication is tested by the economic realities that threaten their livelihood. Dr. Finch's internal struggles mirror the larger societal dilemmas of maintaining integrity in a world increasingly driven by desperation and self-preservation.
Era intersection: Their hidden past with the victim highlights the intersection of personal and professional ethics during a time of upheaval.

### Captain Ivor Hale
Captain Ivor Hale exemplifies the disillusionment of a generation that served in the Great War, now facing the harsh reality of financial ruin. His struggle with gambling addiction and the threat of losing support from the victim reflect the pressures faced by many ex-servicemen, highlighting the fragility of honor amidst economic despair. Hale's character navigates the tension between past glory and present shame, embodying the emotional scars left by war.
Era intersection: His desperation to reclaim his dignity speaks to the broader societal struggle of maintaining one's status in a rapidly changing world.

### Beatrice Quill
Beatrice Quill captures the ambitions and insecurities of young women in the 1930s, as she grapples with envy and the desire for social elevation. Her charm and vivacity mask a simmering resentment towards those who overshadow her aspirations. Beatrice's character navigates the complexities of social standing, reflecting the era's rigid class structures and the lengths to which individuals will go to attain recognition.
Era intersection: Her motivations reveal the societal pressures on women to conform to expectations of beauty and success, often at the cost of their morality.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice flows like a gentle stream, often punctuated by thoughtful pauses that reflect her introspective nature.
[comfortable] The garden is bursting with life, isn't it? Nature has a way of healing, much like the love we nurture.
[evasive] Oh, that? It's just another flower bed I've been tending to. Nothing to worry about, really.
[stressed] I can't bear the thought of my past being unearthed. It's like a weed choking the life out of my garden.
Humour: Eleanor's dry wit emerges subtly, especially when discussing her garden and the absurdities of life.

### Dr. Mallory Finch (they/them/their)
Dr. Finch speaks with a measured tone, often infused with self-deprecating humor that reveals their insecurities.
[comfortable] It's reassuring to know that even the smallest ailments can lead to the greatest revelations.
[evasive] I’d rather not discuss my past choices; let's focus on your health instead, shall we?
[stressed] The weight of my decisions feels heavier than any medical textbook I've ever read!
Humour: Their self-deprecating humor often serves as a mask for their inner turmoil.

### Captain Ivor Hale (he/him/his)
Hale's speech is direct and commanding, with a bluntness that reflects his military background.
[comfortable] In my day, honor was worth more than gold. Those were the days!
[evasive] What happened in the past is irrelevant; we must focus on the present.
[stressed] I am not a coward! I've seen battle, and I won't be brought down by mere debts!
Humour: His bluntness is often mistaken for humor, though it masks deeper vulnerability.

### Beatrice Quill (she/her/her)
Beatrice speaks with a lively rhythm, her words often laced with sardonic undertones that hint at her insecurities.
[comfortable] Oh, darling, every party needs a little drama to keep things interesting!
[evasive] Why discuss the past when the present is so much more thrilling?
[stressed] If only they'd notice me for my charm instead of just my appearance!
Humour: Her sardonic humor often serves to deflect from her deeper feelings of envy.

## Location Registers (scene framing guides)

The Library: The library feels dense with secrets, where the air is thick with the scent of old books and the weight of hidden truths. Shadows linger in the corners, echoing the unspoken tensions among the characters. As the investigation unfolds, this space becomes a battleground of intellect and deceit, where every whispered conversation carries the potential to alter destinies.. Camera angle: A writer entering this space should feel the tension simmering just beneath the surface, with every detail hinting at the unraveling mystery.. Era: The isolation of the library contrasts sharply with the social expectations of the 1930s, where public personas often mask inner turmoil.

The Drawing Room: The drawing room serves as a façade of civility amidst the brewing storm, where laughter feels forced and conversations carry an undercurrent of anxiety. The opulent furnishings contrast with the palpable tension that hangs in the air, creating an atmosphere where hidden motives threaten to disrupt the fragile peace.. Camera angle: A writer should capture the contrast between beauty and dread, highlighting the fragility of relationships within this gilded space.. Era: The drawing room's elegance belies the societal pressures of the 1930s, reflecting the characters' attempts to maintain appearances.

The Study: The study encapsulates the weight of secrets and the urgency of the investigation. The cluttered desk and dim lighting create an intimate yet oppressive atmosphere, where every document holds the potential for revelation. As the characters confront their truths, the study becomes a crucible for their decisions, a space where the past collides with the present.. Camera angle: A writer should focus on the tension within this confined space, emphasizing the characters' internal struggles as they navigate the unfolding mystery.. Era: The study's isolation reflects the constraints of the era, where private thoughts are often at odds with societal expectations.

## Humour guidance for this story position (early)
Permission: conditional — condition: Eleanor may inject dry wit as she reflects on the absurdity of the situation.
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's character allows for moments of understated humor amidst tension.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's initial discovery reveals her as a victim of circumstance, foreshadowing the unraveling of her past". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's nervousness during the investigation hints at deeper secrets, complicating their relationship with the victim". Do not explain significance yet.
- Plant one subtle observable beat related to: "Captain Hale's financial desperation becomes more apparent as the investigation unfolds, highlighting the lengths individuals will go to protect their interests". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock's time indicated Eleanor Voss died when no one was near her.
- Hidden truth to progressively expose: The actual time of death was manipulated to create an alibi.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock's hands are stuck at precisely the time of the murder. | corr: The clock's position indicates it was tampered with to stop at a specific time. | effect: Narrows the time of death to when the clock was manipulated.
  - Step 2: obs: Witnesses claim they saw Eleanor alive just before the clock stopped. | corr: This contradicts the time indicated by the tampered clock. | effect: Eliminates the possibility that Eleanor died at the clock's last time.
  - Step 3: obs: The clock's dust pattern indicates it was recently disturbed. | corr: The clock was handled shortly before the murder. | effect: Narrows the opportunity for suspects who could have tampered with it.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and stuck against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_11, clue_6, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's scratches and witness timing (early) let the reader identify tampering. Step 2: Witnesses' timing eliminates the possibility of Eleanor's death at last chime (mid). Step 3: The dust pattern indicates recent handling, which points to Captain Hale (discriminating test).
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor's speech flows like a gentle stream, often punctuated by thoughtful pauses
She has a tendency to use garden metaphors, infusing her dialogue with a poetic quality
When pressed, her wit emerges subtly, revealing a sharp mind beneath her nurturing exterior.
Eleanor grapples with guilt over her past decisions, fearing that the truth of her affair with the victim will not only destroy her reputation but also tarnish the memories of the love she once experienced. She is torn between the desire to maintain her image and the need for honesty.

### Dr. Mallory Finch
Finch speaks with a measured tone, often punctuating their sentences with self-deprecating humor
They tend to over-explain medical terms in a way that feels both earnest and slightly anxious, revealing a deep-seated insecurity about their choices.
Dr. Finch is torn between the desire to maintain their lifestyle and the moral implications of their actions. The constant fear of exposure gnaws at them, forcing a reckoning with their choices and the person they have become.

### Captain Ivor Hale
Hale's speech is direct and often devoid of embellishment
He tends to speak in short sentences, with a commanding presence that leaves little room for debate
His bluntness can come off as abrasive, but it hides a vulnerability that he rarely allows to surface.
Hale is caught in a struggle between the honor he once embodied and the shame of his current circumstances. The gulf between who he was and who he has become is a source of deep internal conflict.

### Beatrice Quill
Beatrice speaks with a quick, lively rhythm, her words often laced with sardonic undertones
She has a tendency to use witty quips to mask her insecurities, and her dialogue is peppered with references to social events and the latest fashions.
Beatrice struggles with her envy, torn between her desire for social ascendance and the realization that her ambitions may lead her down a dark path. The fear of being overshadowed fuels her actions, creating a rift between her aspirations and her morality.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor's speech flows like a gentle stream, often punctuated by thoughtful pauses. She has a tendency to use garden metaphors, infusing her dialogue with a poetic quality. When pressed, her wit emerges subtly, revealing a sharp mind beneath her nurturing exterior.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The garden is bursting with life, isn't it? Nature has a way of healing, much like the love we nurture."
  [evasive] "Oh, that? It's just another flower bed I've been tending to. Nothing to worry about, really."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her desire to protect her reputation intertwines with the need to shield herself from the repercussions of her past, as the specter of the affair looms ever larger in the wake of the victim's untimely demise." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a measured tone, often punctuating their sentences with self-deprecating humor. They tend to over-explain medical terms in a way that feels both earnest and slightly anxious, revealing a deep-seated insecurity about their choices.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's reassuring to know that even the smallest ailments can lead to the greatest revelations."
  [evasive] "I’d rather not discuss my past choices; let's focus on your health instead, shall we?"
Humour: self deprecating — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The threat of exposure by the victim has driven Dr. Finch to desperate measures, as they grapple with the possibility of losing their medical license and the respect of the community." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Hale's speech is direct and often devoid of embellishment. He tends to speak in short sentences, with a commanding presence that leaves little room for debate. His bluntness can come off as abrasive, but it hides a vulnerability that he rarely allows to surface.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, honor was worth more than gold. Those were the days!"
  [evasive] "What happened in the past is irrelevant; we must focus on the present."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate to secure money and status, Hale feels cornered by the victim's intentions to withdraw support, which drives him to consider drastic measures." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a quick, lively rhythm, her words often laced with sardonic undertones. She has a tendency to use witty quips to mask her insecurities, and her dialogue is peppered with references to social events and the latest fashions.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, every party needs a little drama to keep things interesting!"
  [evasive] "Why discuss the past when the present is so much more thrilling?"
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her jealousy over the victim's social standing drives Beatrice to consider extreme measures, as the specter of inadequacy looms large in her life." — do not surface in Act I.



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
Little Middleton Manor, a sprawling estate surrounded by lush gardens and ancient trees, serves as the backdrop for a tense inheritance dispute steeped in secrets.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Restricted access area

Atmosphere: Tense and foreboding, reflecting underlying class tensions and personal secrets among residents
Weather: Overcast with occasional rain, typical of an English countryside in autumn

Era markers: Reliance on typewriters for correspondence and record-keeping | Petrol automobiles parked in the manor's courtyard | Early home telephones in each room for communication

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
  - Visual: Dust motes dance in the beams of light filtering through the tall windows, illuminating forgotten corners of the room., An ornate globe stands in one corner, its surface marked by the passage of time and the maps of distant lands.
  - Sounds: The soft rustle of pages turning echoes in the stillness, punctuated by the occasional creak of the floorboards beneath heavy footsteps., Outside, the rain taps against the window, a constant reminder of the world beyond these walls.
  - Scents: The musty scent of old books mingles with the faint aroma of polished wood and the lingering trace of spilled ink., A hint of dampness pervades the air, a result of the recent rains that have seeped into the manor.
  - Touch: The surfaces of the desk are smooth yet cool to the touch, layered with a thin film of dust that speaks of neglect., The leather of the armchair, cracked and worn, yields slightly under pressure, inviting one to sink into its embrace.

The Drawing Room (interior):
  - Visual: Gleaming chandeliers hang from the ceiling, their crystals catching the dim light and scattering it across the room., A large portrait of the manor's matriarch hangs above the fireplace, her gaze seeming to follow visitors with a knowing expression.
  - Sounds: The soft murmur of conversation fills the air, punctuated by the occasional laughter that feels forced and hollow., The distant sound of piano keys being played occasionally breaks the tension, though the notes seem melancholic and unresolved.
  - Scents: The rich scent of polished mahogany mingles with the faint whiff of fresh flowers that have begun to wilt., A hint of tobacco smoke lingers in the air, a remnant of the previous evening's gathering.
  - Touch: The upholstery of the sofas is soft yet slightly frayed, a sign of both luxury and neglect., The coolness of the marble fireplace contrasts sharply with the warmth of the surrounding textiles.

The Study (interior):
  - Visual: Stacks of papers are piled high on the desk, some teetering precariously as if they might collapse at any moment., The walls are lined with dark wood paneling, giving the room a somber, s
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1935, as the leaves begin to turn and the chill of autumn settles over England, the atmosphere is heavy with the weight of the Great Depression
- The overcast skies and intermittent rain cast a pall over daily life, echoing the uncertainties faced by both the affluent and the struggling working class
- The air is filled with the scent of damp earth, mingling with the remnants of summer, as families gather for evening tea in homes that once brimmed with laughter, now overshadowed by whispers of discontent
- In the upper echelons of society, the pressure to maintain appearances is palpable; the looming Harvest Festival serves as a bittersweet reminder of abundance while many suffer from unemployment and economic hardship
- Class distinctions remain stark, with the upper class grappling to sustain their status amidst dwindling fortunes

TEMPORAL CONTEXT:

This story takes place in September 1935 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool, brisk air
- Daylight: Daylight begins to wane, with sunset around 7:15 PM, making evenings darker and more intimate.
- Seasonal activities: apple picking in local orchards, attending local harvest fairs, gathering for evening tea in cozy parlors
- Seasonal occasions: Harvest Festival (celebrated late September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits with double-breasted jackets, crisp white dress shirts, silk ties in muted colors
- Men casual: tweed caps, wool vests, corduroy trousers
- Men accessories: leather gloves, pocket watches, walking canes
- Women formal: tea-length dresses in floral prints, tailored blazers with shoulder pads, cloche hats adorned with feathers
- Women casual: knitted sweaters, A-line skirts, cotton blouses with puffed sleeves
- Women accessories: string pearls, leather handbags, silk scarves

Cultural Context (reference naturally):
- Music/entertainment: 'Begin the Beguine' by Artie Shaw, 'The Way You Look Tonight' by Fred Astaire, various jazz compositions; Films: 'The 39 Steps', 'Top Hat'; Theatre: 'The Royal Family', 'Pygmalion'; Radio: The BBC Home Service broadcasts news and entertainment, popular comedies and dramas are aired regularly
- Typical prices: loaf of bread: four pence, a pint of milk: three pence, a ticket to the cinema: one shilling
- Current events: Nazi Party consolidates power in Germany; increased tensions in Europe over fascism and communism
- Literature: 'Brave New World' by Aldous Huxley | 'Murder in the Cathedral' by T.S. Eliot | 'The Grapes of Wrath' by John Steinbeck | [mystery novels] | [social realism] | [political satire]
- Technology: the first practical television sets | more advanced home radios | early electric kitchen appliances | typewriters for correspondence | home telephones becoming commonplace | reliable petrol automobiles
- Daily life: gathering for tea in the afternoon, attending community events, participating in local church services
- Social rituals: fancy dress balls, afternoon tea gatherings, formal dinner parties among the upper class

Atmospheric Details:
The scent of damp earth and falling leaves mingles with the aroma of woodsmoke from chimneys, suggesting the transition of seasons. The sound of distant thunder rumbles softly, while the occasional raindrop patters against the window panes of the manor house. A sense of unease permeates the air, heightened by the flickering lights of the drawing room as shadows dance across the walls, reflecting the secrets held within.

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
- Social commentary: Characters discuss cu
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The true time of the victim's death as established by other evidence: "a quarter past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock's hands are stuck at precisely the time of the murder.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This provides a specific time reference for the murder.

• [clue_12] The clock's hands show ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This indicates the time when the clock stopped.

• [clue_fp_contradiction_step_1] The clock's hands are stuck at precisely the time of the murder.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's position indicates it was tampered with to stop at a specific time.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The true time of the victim's death as established by other evidence: "a quarter past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Dr. Finch's mind raced as they recalled the moment they had seen Eleanor alive at a quarter past ten, just before the clock had stopped. They felt a surge of urgency to share this detail, to dispel the growing suspicion that surrounded them. 'I saw her,' they..."
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
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss lay lifeless on the floor, her once vibrant presence now reduced to a haunting stillness.
Chapter 2: Chapter 2: Initial Reactions
  Events: “We must face the truth, no matter how painful,” the doctor Finch said, their voice steady yet laced with an undercurrent of anxiety.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, the Voss residence, study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "the Voss residence, study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the Voss residence, study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 86/100):
  Quality gaps noted: word density below preferred target (670/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 97/100):
  Quality gaps noted: word density below preferred target (961/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8257; context=11938; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: reliable petrol automobiles | early home telephones | typewriters for correspondence | telephone communication becoming more common | telegram services available for urgent messages | airmail services for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: large estate grounds create distinct movement patterns | numerous rooms with varying access restrictions | architectural features like high walls and hedges limit visibility | Restricted areas such as the study and cellar | Scheduled routines for staff and residents.
10. Sustain social coherence with this backdrop pressure: A looming inheritance dispute amidst the economic strain of the Great Depression forces the wealthy heirs and their associates into the isolated manor, where class tensions and personal secrets threaten to unravel.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same inheritance dispute theme and victim dynamics)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Mysterious Affair at Styles' (mirrored roles of heirs and detectives)
14. RETRY MITIGATION: Refresh texture usage. Rephrase observations with different lexical framing while preserving all clue obligations and chronology.
15. FINAL ATTEMPT ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi from medical records
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): No evidence of tampering found with her access.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Eleanor Voss
- Before Act 3: refer as "the heiress"
- From Act 3 onward: refer as "Eleanor"

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_12 must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction

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
  - Location anchor: the Voss residence, study.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Dr. Finch's mind raced as they recalled the moment they had seen Eleanor alive at a quarter past ten, just before the clock had stopped. They felt a surge of urgency to share this detail, to dispel the growing suspicion...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock's hands are stuck at precisely the time of the murder. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This provides a specific time reference for the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock's hands show ten minutes past eleven. [clue_12] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates the time when the clock stopped.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock's hands are stuck at precisely the time of the murder. [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's position indicates it was tampered with to stop at a specific time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The glow from the desk lamp casts a warm halo around the workspace, creating an oasis of light amidst the encroaching darkness., The shadows lengthen, creeping along the walls, as if alive with the secrets they harbor. | The soft scratching of a pen on paper creates an intimate atmosphere, each stroke resonating with purpose., The distant sound of laughter from the drawing room feels like an intrusion, a stark contrast to the solitude of the study. | The scent of freshly inked pages mixes with the earthy aroma of leather, creating a rich tapestry of sensory experiences.. Mood: tense anticipation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The true time of the victim's death as established by other evidence, write exactly: "a quarter past ten".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor's last known movement at the clock's stopping time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past ten" (The true time of the victim's death as established by other evidence).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder, the air in the Voss residence, study was thick with tension, punctuated only by the soft patter of rain against the window. The dim light from the desk lamp cast elongated shadows, highlighting the dust motes floating in the air. Beatrice Quill stood in the doorway, her eyes red from crying, a stark contrast to the elegant surroundings that felt suddenly oppressive. The room was filled with an uneasy silence, as if the very walls were holding their breath, waiting for the inevitable arrival of the detective.

Eleanor Voss lay lifeless on the floor, her once vibrant presence now reduced to a haunting stillness. The clock on the wall, its hands frozen at ten minutes past eleven, seemed to mock the tragedy that had unfolded. the doctor Finch moved closer to the clock, their heart racing as they examined its position. The clock was wound back to create a false timeline, indicating Eleanor was alive when she was actually dead. The implications of this discovery sent a shiver down their spine, for it suggested that someone in this very room had tampered with time itself to hide the truth.

As Dr. Finch stepped back, they felt the weight of the moment settle heavily upon them. The clock's tampering indicated a calculated effort to mislead, to create an alibi for the murderer. Who among them could have done such a thing? The thought lingered in the air, thickening the already tense atmosphere. Each person present had access to Eleanor, each could have been the one to manipulate the clock, but who had the motive to do so? The question gnawed at Dr. Finch, their mind racing with possibilities.

the captain Hale stood near the window, his expression a mask of shock and disbelief. She had known Eleanor for years, and the thought that someone could harm her was unfathomable. Yet, as she glanced at the clock, the reality of the situation struck her like a cold wave. The evidence was there, and it pointed to a chilling conclusion. She cleared her throat, attempting to dispel the knot of anxiety tightening in her chest. 'We must wait for the detective to arrive,' she said, her voice steady but lacking its usual confidence. 'They will know how to handle this.'

Beatrice shifted her weight from one foot to the other, her hands clasped tightly in front of her. 'What if they suspect one of us?' she whispered, her voice barely above a breath. 'What if they think we had something to do with this?' His eyes darted between Hale and Finch, searching for reassurance. The fear of being implicated loomed large, and the weight of unspoken secrets hung heavily in the air, threatening to suffocate them all.

Dr. Finch turned to Beatrice, their expression softening. 'We are all in this together, Beatrice. We must remain calm and collected. The truth will come out, and we must be prepared for whatever the detective uncovers.' They hoped their words would provide some comfort, but the unease in the room was palpable. The rain continued to fall, a steady rhythm that mirrored the anxiety building within them.

As the minutes ticked by, the atmosphere remained charged with uncertainty. The clock's frozen hands served as a cruel reminder of the life that had been extinguished, and the questions that now swirled like leaves caught in a storm. Each person present was a suspect, and the knowledge weighed heavily on their hearts. They exchanged glances, each one aware of the other's secrets, but none willing to voice the suspicions that danced just beneath the surface.

Finally, the sound of footsteps echoed from the hallway, breaking the oppressive silence. The detective was here, and with them, the promise of answers. But as they prepared to face the truth, a shared understanding settled among the group: the clock had not only stopped for Eleanor but had also begun a countdown for each of them. The game was afoot, and the stakes had never been higher.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
“We must face the truth, no matter how painful,” the doctor Finch said, their voice steady yet laced with an undercurrent of anxiety. The morning after the murder, the Voss residence, study felt stifling, with the soft patter of rain against the window creating a dissonant rhythm. Shadows danced under the dim light of the desk lamp, illuminating dust motes that floated aimlessly in the air. Beatrice Quill stood near the door, her tear-streaked face a stark contrast to the elegant surroundings that now felt oppressive. The silence in the room was heavy, as if the very walls were bracing themselves for the arrival of the detective. Eleanor Voss lay lifeless on the floor, her vibrant spirit extinguished, leaving behind an unsettling stillness. The clock on the wall, its hands frozen at ten minutes past eleven, seemed to taunt the tragedy that had unfolded.

Dr. Finch approached the clock, their heart racing as they scrutinized its position. The clock had been wound back, creating a false timeline that suggested Eleanor was alive when she was actually dead. Witnesses claim they saw Eleanor alive just before the clock stopped. The implications of this revelation sent a shiver down their spine, for it indicated that someone in this very room had manipulated time to conceal the truth. The thought lingered in the air, thickening the already tense atmosphere. Each person present had access to Eleanor; each could have been the one to tamper with the clock, but who had the motive to do so? The question gnawed at Dr. Finch, their mind racing with possibilities.

the captain Hale leaned against the window frame, his expression a mask of shock and disbelief. She had known Eleanor for years, and the idea that someone could harm her was unfathomable. Yet, as she glanced at the clock, the reality of the situation struck her like a cold wave. The evidence was there, and it pointed to a chilling conclusion. Clearing her throat, she attempted to dispel the knot of anxiety tightening in her chest. 'We must wait for the detective to arrive,' she said, her voice steady but lacking its usual confidence. 'They will know how to handle this.'

Beatrice shifted her weight from one foot to the other, her hands clasped tightly in front of her. 'What if they suspect one of us?' she whispered, her voice barely above a breath. 'What if they think we had something to do with this?' His eyes darted between Hale and Finch, searching for reassurance. The fear of being implicated loomed large, and the weight of unspoken secrets hung heavily in the air, threatening to suffocate them all. Dr. Finch turned to Beatrice, their expression softening. 'We are all in this together, Beatrice. We must remain calm and collected. The truth will come out, and we must be prepared for whatever the detective uncovers.' They hoped their words would provide some comfort, but the unease in the room was palpable.

As the minutes ticked by, the atmosphere remained charged with uncertainty. The clock's frozen hands served as a cruel reminder of the life that had been extinguished, and the questions that now swirled like leaves caught in a storm. Each person present was a suspect, and the knowledge weighed heavily on their hearts. They exchanged glances, each one aware of the other's secrets, but none willing to voice the suspicions that danced just beneath the surface. Hale’s hands trembled as he adjusted his collar, betraying his nerves. The air was thick with the scent of old paper and ink, a testament to the countless hours spent in contemplation.

Finally, the sound of footsteps echoed from the hallway, breaking the oppressive silence. The detective was here, and with them, the promise of answers. But as they prepared to face the truth, a shared understanding settled among the group: the clock had not only stopped for Eleanor but had also begun a countdown for each of them. The game was afoot, and the stakes had never been higher. The arrival of the detective brought a momentary sense of relief, a flicker of hope amid the chaos. Perhaps they would uncover the truth and restore some semblance of order to their shattered lives. Yet, the weight of uncertainty still loomed large, casting a shadow over their fragile peace.

As the detective entered the room, the tension was palpable. Dr. Finch felt their heart race as they prepared to speak, the words caught in their throat. They exchanged glances with Beatrice and Hale, each silently questioning the other's resolve. The detective's keen gaze swept over the room, taking in the scene with an air of authority. 'I trust you have all been forthcoming with your accounts?' they asked, their tone even but firm. The question hung in the air, heavy with implication. Each of them knew that the truth was a fragile thing, easily shattered by the weight of their secrets. 'We must begin with the last known movements of Eleanor,' the detective continued, their eyes narrowing as they focused on the clock.

Dr. Finch's mind raced as they recalled the moment they had seen Eleanor alive at a quarter past ten, just before the clock had stopped. They felt a surge of urgency to share this detail, to dispel the growing suspicion that surrounded them. 'I saw her,' they said, their voice steady despite the turmoil within. 'She was alive at a quarter past ten, just before the clock stopped.' The detective's expression shifted, a flicker of interest igniting in their eyes. 'Interesting,' they replied, their tone thoughtful. 'This contradicts the time indicated by the tampered clock. We must explore this further.' The tension in the room thickened once more, each person acutely aware of the implications of Dr. Finch's revelation.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Ticking Clock of Inheritance
Era: 1930s
Setting: Little Middleton
Crime: murder (inheritance dispute)
Culprit: Captain Ivor Hale
False assumption: The clock's time indicated Eleanor Voss died when no one was near her.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (they/them), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

⚠ PRONOUN REMINDER: Dr. Mallory Finch use they/them/their (singular). Never write she/her or he/him for these characters.

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Role",
    "setting": {
      "location": "the Voss residence, study",
      "timeOfDay": "Late morning after the murder",
      "atmosphere": "Increasingly tense as the detective arrives"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the clock's significance and support false assumptions",
    "cluesRevealed": [
      "clue_1",
      "clue_12",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "The clock serves as a focal point for the investigation",
      "tension": "The group grows anxious as the detective arrives",
      "microMomentBeats": [
        "Hale stares at the clock, as if willing it to reveal its secrets."
      ]
    },
    "summary": "The detective arrives and examines the clock, noting its hands are stuck at ten minutes past eleven. As the witnesses recount their last moments with Eleanor, the tension escalates, and the clock becomes a crucial piece of the puzzle.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The discovery of the murder introduces a sense of urgency and fear.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice flows like a gentle stream, often punctuated by thoughtful pauses that reflect her introspective nature."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to transportation due to economic strain, making travel difficult.; Reliance on typewriters and telephones for communication, slowing down information exchange.; The isolated location of Little Middleton Manor restricts outside influence and support.; The weather conditions of autumn bring frequent rain, making movement outdoors cumbersome.; Increased scrutiny on social gatherings limits the freedom to host large events.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 3: "The clock's hands are stuck at precisely the time of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock's hands show ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock's hands are stuck at precisely the time of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
Attempt 4/4 — chapters 3 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 3 marked non-convergent after attempt 3/4: template

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ FINAL ATTEMPT — COMPLETE REBUILD REQUIRED ═══
This is attempt 4/4. All prior attempts failed. Do NOT reference or preserve any text from previous responses.
Write chapters 3 completely from scratch. Satisfy EVERY constraint listed above in a single pass.
CRITICAL — SENSORY GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST contain at least 2 words from this EXACT list — synonyms are NOT counted:
  smell / scent / odor / fragrance / sound / echo / silence / whisper / creak / cold / warm / damp / rough / smooth / glow / shadow / flicker / dim
  Example: "The cold of the hallway pressed against her cheeks. A whisper of candlelight flickered across the clock face."
  Two sensory words from the list above must appear within the first two paragraphs. Do NOT use synonyms (e.g. 'chill', 'murmur') — they are not counted.
CRITICAL — ATMOSPHERE/TIME GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST also contain at least 1 word from this EXACT list:
  rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / grey / gray / dark / light / season
  Example: "Morning light filtered through the fog-draped windows." or "The night air carried the scent of damp earth."
  One word from this list must appear in paragraph 1 or paragraph 2. Synonyms (e.g. 'dusk-like', 'nighttime') are NOT counted.
Submit the full chapter JSON — do not return partial content or indicate you are continuing.


RETRY CLASS: template
ATTEMPT: 3/4
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (1.00 >= 0.80). Rephrase this passage to avoid template leakage.
MITIGATION MODE: freshen_atoms
```
