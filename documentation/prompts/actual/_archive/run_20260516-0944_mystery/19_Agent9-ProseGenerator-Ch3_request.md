# Actual Prompt Record

- Run ID: `mystery-1778924663315`
- Project ID: ``
- Timestamp: `2026-05-16T09:48:55.138Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `ecda11bb0888d241`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit believed they were protecting a loved one from the victim's abusive behavior, complicating their moral standing." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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
8. When multiple characters of different genders appear in the same sentence, use the character's
   name instead of a pronoun to eliminate ambiguity:
   WRONG: "Eleanor watched Hale; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Eleanor watched Hale; Hale crossed the room and Eleanor frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speech:
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is female,
[truncated for prompt budget]


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

## Era: 1938-04
In April 1938, England is marked by an undercurrent of unease as the specter of impending war looms over Europe. The economic recovery from the Great Depression is uneven, with urban areas showing signs of life whereas rural communities still grapple with poverty. Amidst this backdrop, social gatherings at grand estates like Little Middleton Manor become both a refuge and a stage for hidden tensions to unfold. The increasing political tensions, particularly in relation to the rise of fascism and the recent annexation of Austria by Germany, create a charged atmosphere where guests must navigate social hierarchies while confronting their own personal demons. The fashion of the day reflects both the lingering effects of hardship and the influence of Hollywood glamour, leading to a complex interplay of appearances and reality in social interactions. Daily life is punctuated by formal dinner parties, afternoon teas, and the constant reminder of class divisions, as the guests at the manor grapple with their own desires and ambitions amid the societal pressures of the time.
Emotional register: A pervasive sense of tension and apprehension as guests confront personal and social conflicts.
Physical constraints: Limited communication methods due to reliance on telegrams and telephones. | Transportation difficulties with the aftermath of the Great Depression. | Weather conditions affecting travel plans and social engagements. | Social etiquette demanding formal behavior in public settings.
Current tensions (weave into background texture): Political tensions rising in Europe with the Munich Agreement looming. | The U.S. economy shows signs of recovery from the Great Depression. | Nazi Germany continues its territorial expansion.
Wartime context — None currently, but the looming threat of war is felt.: Communities are tightening their bonds, sharing resources and strategies to cope with uncertainty. Absence effect: The absence of men at war raises questions and fears about the future.

## Story Theme
In a world fraught with societal expectations and hidden motives, the pursuit of truth reveals the delicate balance between love, jealousy, and betrayal, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey is one of tension and revelation amidst the backdrop of love and betrayal.

Arc:
The atmosphere at Little Middleton Manor begins steeped in opulence, but a sense of unease permeates the air as guests gather for a family reunion. The initial crime—a seemingly accidental death—casts a shadow over the festivities, igniting curiosity and suspicion among the attendees. As Eleanor Voss steps into the role of investigator, her keen observations lead her to uncover the first clues, each revealing more about the tangled relationships and hidden motives that fuel the tension within the manor. Yet, with each revelation, the emotional cost rises; the lines between friendship and rivalry blur, and Eleanor finds herself grappling with her feelings for Captain Hale, whose own secrets complicate the investigation.

A mid-story pivot occurs when Eleanor discovers evidence of tampering, shifting her focus to the mechanics behind the murder. This revelation changes the trajectory of her investigation, pushing her to confront not only the truth of the crime but also her feelings of inadequacy. As the stakes escalate, the pressure mounts, leading to a climactic confrontation where relationships are tested, and hidden desires come to light. In the aftermath, the resolution brings both closure and heartache; Eleanor must reconcile her emotions with the outcome of the case, while the other characters confront the consequences of their actions, leaving them forever changed. The ending carries a bittersweet weight, highlighting the fragility of trust and the complexity of human connections.

## Emotional register at this point in the story
The investigation begins, revealing hidden tensions and emotions.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss is caught in the turmoil of the late 1930s, where her literary aspirations collide with her unrequited love for Captain Hale. Living through an era of social expectations and rising political tensions, she grapples with her emotional struggles while seeking truth in a world overshadowed by uncertainty. Her position as a detective allows her to engage with the hidden narratives of those around her, reflecting the broader societal conflicts of the time.
Era intersection: Her quest for truth mirrors the collective search for stability in a world on the brink of chaos.

### Dr. Mallory Finch
Dr. Mallory Finch navigates the complexities of personal desire against the backdrop of a society grappling with economic recovery and political upheaval. As a respected physician, he embodies the tension between ambition and disillusionment, with the pressures of his past relationship with Beatrice Quill weighing heavily on him. This era of uncertainty forces him to confront not only his feelings but also the societal changes that challenge his worldview.
Era intersection: His internal conflict reflects the broader societal struggles between ambition and the harsh realities of the world.

### Captain Ivor Hale
Captain Ivor Hale embodies the charm and complexity of the era, straddling the line between romantic aspirations and societal expectations. As a military officer, he is both admired and scrutinized, with his personal entanglements complicating his standing in a society facing the threat of war. His internal conflict regarding love and loyalty is intensified by the political climate, making his journey through this investigation poignant and reflective of the time's anxieties.
Era intersection: His charm masks deeper anxieties about loyalty and the shifting landscape of relationships amid rising tensions.

### Beatrice Quill
Beatrice Quill is the epitome of elegance and societal expectation, yet her hidden desires challenge the norms of her time. Engaged but yearning for freedom, she navigates the complexities of love against the backdrop of a society grappling with economic hardship and rising political tensions. Her actions during the investigation reveal the lengths to which one might go when trapped by societal expectations, reflecting the broader struggles of women in the late 1930s.
Era intersection: Her internal battle signifies the tension between societal roles and individual desires during a time of upheaval.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is resonant and articulate, often laced with a dry wit that draws listeners in.
[comfortable] It's fascinating how a simple clock can play such a pivotal role in our lives, isn't it?
[evasive] Oh, I wouldn’t know much about that; I’m just here to observe, after all.
[stressed] This is all so much more complicated than I ever imagined. We need to find the truth, and quickly!
Humour: Her dry wit often provides a counterbalance to the tension surrounding her.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's voice carries a sharp, clipped quality, underscored by a dry sense of humor that reveals his cynicism.
[comfortable] Ah, the human condition—always a perplexing puzzle, isn’t it?
[evasive] I’m afraid I can’t comment on matters beyond my medical expertise.
[stressed] We can't let emotions cloud our judgment; we need to stick to the facts.
Humour: His humor serves as a defense against the emotional turmoil he feels.

### Captain Ivor Hale (he/him/his)
Ivor's voice is charismatic and playful, often filled with a roguish charm that captivates those around him.
[comfortable] You know, I’m more than just a soldier; I’m quite the romantic at heart.
[evasive] Let’s not dwell on the past; the future is much more interesting.
[stressed] This isn't just about me; lives are at stake, and we need to act!
Humour: His playful banter often masks deeper insecurities and conflicts.

### Beatrice Quill (she/her/her)
Beatrice speaks with a refined elegance, her words flowing smoothly, often tinged with playful sarcasm.
[comfortable] Isn't it delightful how the rain enhances the beauty of our gathering?
[evasive] Oh, I wouldn’t presume to know what others think; I prefer to keep my thoughts to myself.
[stressed] Everything is unraveling, and I fear what will come of it all!
Humour: Her playful sarcasm adds complexity to her character, often revealing her inner turmoil.

## Location Registers (scene framing guides)

The Library: The library is a sanctuary of secrets, its air thick with the weight of knowledge and the tension of hidden narratives. Here, the flickering shadows and the smell of old paper create an atmosphere that is both inviting and foreboding, where every creak of the floorboards seems to echo with the ghosts of its past.. Camera angle: As a writer entering this space, you should feel the tension simmering beneath the surface, ready to unveil the truths that lie hidden within.. Era: In this era of uncertainty, the library serves as a refuge for introspection amidst the chaos of social expectations.

The Drawing Room: The drawing room is alive with the laughter and chatter of guests, yet beneath the surface lies an undercurrent of suspicion and tension. The plush furnishings and elegant decor create an inviting yet charged atmosphere, where every conversation carries the weight of hidden agendas.. Camera angle: Entering this space, writers should focus on the interplay of light and shadow, capturing the dichotomy of warmth and unease.. Era: During this time, social gatherings serve as both a display of wealth and an opportunity for masked intentions to unfold.

The Study: The study is an intimate space filled with the scent of old books and the sharp aroma of ink. Here, every detail is amplified, and the air hums with the urgency of discovery. It is a place of contemplation and revelation, where secrets may be unearthed amidst the clutter of thoughts.. Camera angle: As you navigate this space, feel the tension of discovery and the weight of unspoken truths, inviting readers to explore the depths of the investigation.. Era: In this era, the study serves as a sanctuary for those seeking clarity in a world clouded by uncertainty.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Dr. Mallory Finch
Permitted forms: dry_wit
Rationale: Dr. Finch's humor provides a counterpoint to the seriousness of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of Eleanor's body sets the stage for the unfolding investigation, forcing characters to confront their motivations". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's interactions with Beatrice hidden-truth the layers of resentment and longing that complicate their relationship". Do not explain significance yet.
- Plant one subtle observable beat related to: "The evidence of tampering shifts the focus of the investigation, exposing the underlying tensions that drive the characters towards their eventual confrontations". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor was killed by an accidental chandelier fall during the party.
- Hidden truth to progressively expose: The clock was deliberately tampered with to conceal the timing of the murder.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The chandelier was rigged with a thin wire that was found nearby. | corr: This indicates premeditated tampering rather than an accident. | effect: Eliminates the assumption that the chandelier fell accidentally.
  - Step 2: obs: The clock in the main hall shows ten minutes past eleven, not eleven. | corr: This suggests that the clock was tampered with to create a false timeline. | effect: Narrows the timeline of the murder to before the chandelier fell.
  - Step 3: obs: Gears were found scattered near the clock. | corr: This implies that someone manipulated the clock to confuse witnesses. | effect: Eliminates Dr. Mallory Finch by proving he had no access to the clock mechanism.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the rigged clock with the witness statements about the chandelier fall proves that the clock was tampered with to create an alibi for Beatrice.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_10, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The wire found near the chandelier and witness statements show the chandelier was rigged. Step 2: The clock showing ten minutes past eleven contradicts the time of the chandelier fall, revealing tampering. Step 3: The scattered gears indicate manipulation of the clock mechanism, eliminating Dr. Finch.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a rhythmic cadence, often punctuating her sentences with clever observations
She has a tendency to use literary references in conversation, which endears her to her peers but may perplex those less acquainted with her work.
Eleanor grapples with feelings of inadequacy and jealousy, fearing that her emotional turmoil could compromise her ability to write. The thought of Hale's affections for another woman creates a storm of conflict within her, as she questions her worthiness of love.

### Dr. Mallory Finch (he/him — NEVER she/her)
Finch speaks with a clipped, precise manner, often punctuating his observations with dry humor
He has a habit of raising an eyebrow at the absurdities of life, and his sarcasm often surfaces in unexpected moments, revealing his hidden depths.
Dr. Finch is torn between his resentment towards the victim and his lingering affection for Beatrice. He grapples with feelings of inadequacy and the fear of being vulnerable again, struggling to reconcile his cynicism with the desire for genuine connection.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a confident, almost theatrical flair, often punctuating his statements with a roguish grin
His dialogue is peppered with playful banter, and he has a tendency to raise an eyebrow at the absurdities of life, adding a layer of charm to his wit.
Ivor is torn between his feelings for Eleanor and his attraction to Beatrice, leading to a moral quandary that tests his loyalties. He fears that his actions may have consequences beyond his control, threatening the relationships he values most.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a refined elegance, her words flowing smoothly with a hint of playful sarcasm
She has a knack for turning a compliment into a subtle jab, revealing her sharp wit while maintaining a veneer of charm.
Beatrice is torn between her desire for independence and the societal expectations that bind her. She struggles with the fear of losing her social standing and the potential repercussions of her affair, creating a tension that simmers beneath her polished exterior.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a rhythmic cadence, often punctuating her sentences with clever observations. She has a tendency to use literary references in conversation, which endears her to her peers but may perplex those less acquainted with her work.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's fascinating how a simple clock can play such a pivotal role in our lives, isn't it?"
  [evasive] "Oh, I wouldn’t know much about that; I’m just here to observe, after all."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her fear of losing both her muse and her emotional grounding if Hale pursues a relationship with Beatrice drives her to investigate the murder, as she believes it may help her reclaim her own narrative." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a clipped, precise manner, often punctuating his observations with dry humor. He has a habit of raising an eyebrow at the absurdities of life, and his sarcasm often surfaces in unexpected moments, revealing his hidden depths.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the human condition—always a perplexing puzzle, isn’t it?"
  [evasive] "I’m afraid I can’t comment on matters beyond my medical expertise."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch resents the victim for rekindling Beatrice's affections, which he had hoped to win back, igniting a fierce desire for revenge that he struggles to suppress." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a confident, almost theatrical flair, often punctuating his statements with a roguish grin. His dialogue is peppered with playful banter, and he has a tendency to raise an eyebrow at the absurdities of life, adding a layer of charm to his wit.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, I’m more than just a soldier; I’m quite the romantic at heart."
  [evasive] "Let’s not dwell on the past; the future is much more interesting."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential benefit of the victim's death as a means to clear the path for his romantic pursuits adds an unsettling layer to his character, as he grapples with the morality of such thoughts." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a refined elegance, her words flowing smoothly with a hint of playful sarcasm. She has a knack for turning a compliment into a subtle jab, revealing her sharp wit while maintaining a veneer of charm.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it delightful how the rain enhances the beauty of our gathering?"
  [evasive] "Oh, I wouldn’t presume to know what others think; I prefer to keep my thoughts to myself."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her desire for freedom from her engagement and the fear of being exposed for her affair with Hale drive her actions, creating a potent mix of desperation and determination." — do not surface in Act I.



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
Nestled deep within the English countryside, Little Middleton Manor stands as an imposing testament to a bygone era, where elegance meets enigma beneath its grand ceilings.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Clue discovery

Atmosphere: Tense and foreboding, with an underlying sense of unease among the guests.
Weather: Overcast with occasional rain, typical for a late autumn day.

Era markers: Domestic telephones with party-line systems connecting guests and staff. | Typewriters clattering in the study, composing letters and telegrams. | A radio broadcasting news of political turmoil and jazz music in the drawing room.

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
  - Visual: Rows of dusty books create a labyrinthine effect, their spines faded and titles obscured by time, while the flickering light from the fireplace casts dancing shadows across the room., A large, ornate globe sits in one corner, its surface marred by age, hinting at distant lands and forgotten adventures, while a plush armchair, worn from years of use, beckons from the hearth.
  - Sounds: The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets., A distant clock ticks steadily, its sound echoing in the stillness, marking the passage of time as tension mounts in the heavy air.
  - Scents: The rich scent of old paper and polished wood fills the air, mingling with the faint aroma of tobacco smoke that lingers from a recent visitor., A hint of dampness pervades, suggesting the presence of hidden corners where secrets may lie, while the faintest trace of lavender from a long-forgotten sachet adds an unexpected touch of nostalgia.
  - Touch: The leather of the armchair is cool to the touch, its texture cracked and worn, a testament to the many hours spent in contemplation or conversation., The smooth surface of the globe is almost icy against the fingertips, contrasting sharply with the warmth radiating from the fire, creating an unsettling juxtaposition.

The Drawing Room (interior):
  - Visual: Richly patterned wallpaper envelops the room, creating an atmosphere of warmth and intimacy, while the large bay windows frame views of the gardens beyond, now shrouded in mist., A crystal chandelier hangs from the ceiling, its prisms catching the light from the gas lamps and casting colorful reflections on the walls.
  - Sounds: The soft sound of laughter and clinking glasses fills the air, blending with the occasional crackle of the fireplace as logs shift and pop., The distant hum of a radio broadcasts a popular jazz tune, its lively rhythm providing a stark contrast to the tension simmering beneath the surface.
  - Scents: The fragrant aroma of fresh flowers from a nearby vase mingl
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In April 1938, England is marked by an undercurrent of unease as the specter of impending war looms over Europe
- The economic recovery from the Great Depression is uneven, with urban areas showing signs of life whereas rural communities still grapple with poverty
- Amidst this backdrop, social gatherings at grand estates like Little Middleton Manor become both a refuge and a stage for hidden tensions to unfold
- The increasing political tensions, particularly in relation to the rise of fascism and the recent annexation of Austria by Germany, create a charged atmosphere where guests must navigate social hierarchies while confronting their own personal demons
- The fashion of the day reflects both the lingering effects of hardship and the influence of Hollywood glamour, leading to a complex interplay of appearances and reality in social interactions

TEMPORAL CONTEXT:

This story takes place in April 1938 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool temperatures around 50°F
- Daylight: Days lengthen as spring settles in, with the sun rising around 5:45 AM and setting near 7:45 PM, though clouds often obscure the light.
- Seasonal activities: spring gardening and planting, attending local fairs or markets, taking leisurely walks in the countryside
- Seasonal occasions: Easter (April 10, 1938)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tweed suit with a vest, tailored dress shirt with a stiff collar, silk tie with geometric patterns
- Men casual: lightweight cotton trousers, short-sleeved polo shirts, bomber jackets for outdoor wear
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: tea-length dress with a cinched waist, delicate floral print blouse, tailored blazer with shoulder pads
- Women casual: swing skirts paired with blouses, knitted cardigans, lightweight cotton dresses
- Women accessories: straw cloche hat, beaded handbag, pearls or simple gold jewelry

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman - 'Sing, Sing, Sing', Glenn Miller - 'In the Mood', Duke Ellington - 'Mood Indigo'; Films: The Adventures of Robin Hood, Bringing Up Baby; Theatre: The Boys from Syracuse, I Remember Mama; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Pound of butter: one shilling sixpence
- Current events: Political tensions rise in Europe with the Munich Agreement looming on the horizon; U.S. economy shows signs of recovery from the Great Depression
- Literature: The Maltese Falcon by Dashiell Hammett | Gone with the Wind by Margaret Mitchell | The Grapes of Wrath by John Steinbeck | [mystery and detective fiction] | [social realism] | [historical romance]
- Technology: the first electronic computer prototypes | advancements in aviation technology | development of synthetic materials like nylon | domestic telephones with party-line systems | typewriters for correspondence | early radio sets for entertainment
- Daily life: hosting tea parties, engaging in community events or fairs, playing cards or board games in the evenings
- Social rituals: formal dinner parties with multiple courses, afternoon teas served with pastries, evening gatherings for music and conversation

Atmospheric Details:
The scent of fresh spring rain mingles with the earthy aroma of damp soil, as flowers begin to bloom in the manor's gardens. The faint sound of a distant train whistle echoes through the cool air, adding to the sense of isolation that envelops the grand house. Inside, the soft crackle of vinyl records plays in the background, juxtaposed against the tense silence of the guests, each one acutely aware of the underlying tension.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual c
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The weight of the chandelier that fell: "two hundred pounds"
  - The distance the chandelier fell before hitting the floor: "twelve feet"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the main hall shows ten minutes past eleven, not eleven.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This indicates a discrepancy in the timeline of events.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The weight of the chandelier that fell: "two hundred pounds"
  • The distance the chandelier fell before hitting the floor: "twelve feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: A mechanical clock was tampered with to create an alibi for the murder, causing a chandelier to fall at a precisely timed moment. | This indicates premeditated tampering rather than an accident.
• Suspects still unresolved: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The clock continued to tick, each sound echoing in the silence. Eleanor's mind raced as she considered the implications of their conflicting stories. She needed to confront the truth, to unravel the threads of deception that wove through the room. The stakes w..."
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
estate, drawing room, library

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning after the party dawned with a muted light, the sky heavy with clouds, promising rain.
Chapter 2: Chapter 2: Initial Reactions
  Events: The morning had turned into a tense late morning, the rain pattering softly against the windows of the drawing room of the Quill estate.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, the grand hall of the Quill estate
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "the grand hall of the Quill estate"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the grand hall of the Quill estate". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 91/100):
  Quality gaps noted: word density below preferred target (785/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 90/100):
  Quality gaps noted: word density below preferred target (770/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8149; context=11655; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic telephones with party-line systems | typewriters for correspondence | radio broadcasting for news and entertainment | telegram services available through local offices | aerial mail for urgent correspondence | newspaper print for local news dissemination.
9. Respect setting movement/access constraints in scene action and alibis: manor layout with restricted access to certain areas like the library and cellar | weather conditions affecting movement and outdoor evidence visibility | social customs dictating interaction and movement patterns among guests | permissions required to enter private rooms and offices | daily routines of staff and residents creating predictable movement patterns.
10. Sustain social coherence with this backdrop pressure: A gathering at a grand country estate for a family reunion is overshadowed by the economic strains of the Great Depression and rising political tensions, forcing guests to confront their hidden agendas amidst strict social hierarchies.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical tampering method and unknown victim)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure with a doctor and a female lead)
14. RETRY MITIGATION: Structural pivot mode is active — paragraph fingerprint has now failed twice for this chapter.
15. FORBIDDEN OPENING STRUCTURE: Do NOT begin this chapter with: "At midday, the rain continued to patter against the windows of the grand hall of the Quill estate, each drop a reminder of the turmoil that had unfolded just hours before."
16.   You MUST choose a structurally different opening from one of these three alternatives:
17.   (a) MID-DIALOGUE — the very first word of the chapter is spoken by a character (open quote, then speech).
18.   (b) PHYSICAL ACTION — the first sentence describes a character performing a concrete physical action they have not yet performed in any prior chapter (rising, moving, picking up an object, leaving a room).
19.   (c) SENSORY INTRUSION — the first sentence is an external sensory event interrupting the scene (a sound from outside, a knock, a clock ticking, a door slamming).
20. POSITIONAL FREEZE: The first three paragraphs must NOT position any character "near the clock", "before the clock", "approached the clock", "gestured toward the clock", or any synonymous phrase. The clock may be referenced in dialogue only within the first three paragraphs.
21. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time in relation to the chandelier fall, Draw conclusion about Beatrice's guilt
Test type: comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proving he had no access to the clock during the tampering.
  Clues: gears found near the clock, his alibi during the clock's tampering
- Captain Ivor Hale (Act 3, Scene 5): Witness statements confirming his location away from the clock.
  Clues: Captain Hale's alibi, clock tampering timeline

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of Beatrice's tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation

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
  - Scene setting: the grand hall of the Quill estate — do NOT open with the location name or a location-description phrase. Ground the setting through character action or sensory detail, not a location-first sentence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The clock continued to tick, each sound echoing in the silence. Eleanor's mind raced as she considered the implications of their conflicting stories. She needed to confront the truth, to unravel the threads of deception...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the main hall shows ten minutes past eleven, not eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates a discrepancy in the timeline of events.
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
  - If this batch mentions The weight of the chandelier that fell, write exactly: "two hundred pounds".
  - If this batch mentions The distance the chandelier fell before hitting the floor, write exactly: "twelve feet".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Clock striking ten minutes past eleven
- Established timeline fact: Chandelier falling at eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the party dawned with a muted light, the sky heavy with clouds, promising rain. Eleanor Voss stepped into the grand hall of the Quill estate, her shoes clicking softly against the polished floor. The air was thick with an unsettling quiet, broken only by the distant sound of a clock ticking, each tick echoing like a heartbeat in the stillness. A chill ran down her spine as she glanced around, taking in the remnants of last night's revelry: scattered chairs, a half-empty glass of sherry on the side table, and the oppressive weight of something unsaid hanging in the air.

As she moved deeper into the hall, Eleanor's gaze was drawn to the center of the room, where the chandelier lay shattered on the floor, its crystal pieces glinting ominously in the dim light. Nearby, a thin wire lay coiled, its presence a stark reminder that this was no mere accident. The sight sent a shiver through her; the chandelier had fallen at precisely the moment when the clock had struck ten minutes past eleven. The mechanical clock had been tampered with to create an alibi for the murder, causing a chandelier to spring at a precisely timed moment. This revelation ignited a flicker of suspicion in Eleanor's mind, suggesting that the tragedy was orchestrated rather than accidental, and she couldn't shake the feeling that someone had intended to silence the victim under the guise of calamity.

Dr. Finch stood nearby, his expression a mask of concern as he observed the scene. "It’s dreadful, isn’t it?" he murmured, his voice low and steady. "To think something like this could happen here, in our midst." Her brow furrowed as she looked from the wreckage to Eleanor, and she could sense the tension in her posture, the way her hands clenched at her sides. It was as if she were grappling with more than just the horror of the moment; there was a depth to her worry that hinted at unspoken fears.

Captain Hale entered the hall just then, his presence commanding yet tinged with unease. She glanced at the chandelier, then at Eleanor, her blue eyes searching her face for answers. "What do you make of it, Eleanor?" she asked, her tone light but her expression serious. "An unfortunate accident, or something more sinister?" The question hung in the air, heavy with implication. Eleanor felt the weight of her gaze, the unspoken bond between them deepening in this moment of crisis.

Beatrice Quill appeared next, her face pale and drawn, as though the night’s events had drained the color from her cheeks. She stepped closer to the wreckage, her eyes wide with shock. "I can’t believe this happened. It’s all so surreal," she whispered, her voice trembling. Eleanor noted the way Beatrice's hands fidgeted with the pearls around her neck, a habitual gesture that spoke volumes of her distress. The tension in the room was palpable, each character’s nervousness suggesting they might be hiding something beneath their polished exteriors.

As the four of them stood in the grand hall, the atmosphere thickened with unspoken accusations and buried secrets. Eleanor felt a chill, not just from the remnants of the chandelier’s spring, but from the realization that each of them might have a reason to conceal the truth. She took a deep breath, steeling herself for the investigation ahead. The clock continued to tick, each sound a reminder that time was slipping away, and with it, the chance to uncover the truth behind the tragedy that had unfolded.

Eleanor turned her attention back to the shattered chandelier, her mind racing. The thin wire nearby was a crucial piece of evidence, a thread that could unravel the entire mystery if pulled correctly. She knelt to examine it closely, her fingers brushing against the cool surface of the wire. It felt too deliberate, too calculated for a mere accident. Someone had wanted this to happen, and that thought sent a jolt of adrenaline through her veins. Who among them could have orchestrated such a cruel act? As she pondered this, the distant sound of rain began to patter against the windows, a fitting backdrop to the storm brewing within the walls of the Quill estate.

Dr. Finch cleared his throat, drawing Eleanor's attention back to him. "We should consider the timeline of events leading up to the chandelier's spring. If we can establish when the clock was tampered with, it may lead us to the perpetrator." Her voice was steady, but Eleanor could see the flicker of anxiety in her eyes. She nodded, her resolve hardening. They needed to act quickly, to piece together the fragments of the night before they were lost to the shadows.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
The morning had turned into a tense late morning, the rain pattering softly against the windows of the drawing room of the Quill estate. Shadows stretched across the floor, creating an unsettling atmosphere where every corner seemed to hide a secret. Eleanor Voss stood near the fireplace, her gaze fixed on the broken clock on the mantle, its hands stuck at ten minutes past eleven. The silence was occasionally broken by the sound of a clock ticking, a reminder of the time slipping away as tensions rose. She could feel the weight of the previous night’s events pressing down on her, a palpable tension that seemed to cling to the air like the scent of damp wood and polished furniture. The atmosphere was thick with unspoken fears, and Eleanor's heart raced as she prepared to confront the truth.

Dr. Finch cleared his throat, drawing Eleanor's attention back to him. "We should consider the timeline of events leading up to the chandelier's spring. If we can establish when the clock was tampered with, it may lead us to the perpetrator." Her voice was steady, but Eleanor could sense the underlying anxiety in her tone. She nodded, her resolve hardening. The clock’s position was crucial; it indicated that something was amiss. The chandelier had fallen at a precisely timed moment, and the evidence suggested a deliberate act. This indicated premeditated tampering rather than an accident. The thought sent a shiver down her spine as she realized the implications of such a revelation.

Eleanor's eyes flicked to Beatrice Quill, who stood nearby, her face pale and drawn. "What do you think, Beatrice?" Eleanor asked, trying to gauge her reaction. Beatrice's hands trembled slightly as she clasped them together, the pearls around her neck glinting in the dim light. "I—I don't know, Eleanor. It all seems so surreal. How could something like this happen?" Her voice quivered, and Eleanor noted the way Beatrice's eyes darted around the room, as if searching for answers hidden in the shadows. It was a sign of hidden distress, and Eleanor felt a pang of sympathy for her friend, even as suspicion began to creep into her thoughts.

Captain Hale, leaning casually against the doorframe, raised an eyebrow at the two women. "Surely, it was just a tragic accident?" he interjected, his tone light but his eyes betraying a seriousness that belied his casual demeanor. "We can't jump to conclusions without evidence, can we?" Her protective nature shone through, but Eleanor sensed a flicker of uncertainty in her stance. The way she spoke suggested she was trying to shield them from the harsh reality of the situation, but Eleanor couldn't shake the feeling that she was hiding something.

As the conversation continued, each character recounted their alibis from the previous night, but inconsistencies began to surface. Dr. Finch's account of his whereabouts during the chandelier's spring seemed to conflict with Beatrice's recollections. "I was in the library, looking for a book, when I heard the crash," he stated, his voice steady. Yet, Eleanor recalled seeing her near the drawing room just moments before the incident. The tension in the room thickened as Eleanor pieced together the fragments of their stories, each revelation raising more questions than answers. The air was charged with unspoken accusations, and Eleanor felt the weight of scrutiny pressing down on her.

Eleanor interjected, her voice firm. "But if you were in the library, Dr. Finch, how could you have heard the crash? The drawing room is quite a distance from there. Wouldn’t you have needed to be closer to witness it?" The question hung in the air, and he could see the flicker of surprise in his eyes. He opened his mouth to respond but hesitated, the moment stretching uncomfortably. Beatrice's gaze shifted between them, her expression a mixture of concern and confusion. It was clear that the tension was building, and Eleanor felt a sense of urgency to uncover the truth before it slipped away like the rain outside.

The clock continued to tick, each sound echoing in the silence. Eleanor's mind raced as she considered the implications of their conflicting stories. She needed to confront the truth, to unravel the threads of deception that wove through the room. The stakes were high, and with every passing moment, the possibility of foul play loomed larger. As she glanced at the others, she could see the weight of their secrets pressing down on them, and she knew that the investigation had only just begun. This was a tangled web of motives and alibis, and she was determined to uncover the truth, no matter the cost.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's notebook, ready to record her findings."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Eleanor's role as the investigator, setting the stage for her inquiries."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Beatrice Quill
False assumption: Eleanor was killed by an accidental chandelier fall during the party.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Detective's Arrival",
    "setting": {
      "location": "the grand hall of the Quill estate",
      "timeOfDay": "Midday",
      "atmosphere": "A mix of anxiety and anticipation"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Introduce Eleanor Voss as the amateur investigator and establish her determination to uncover the truth.",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's determination clashes with the others' reluctance to cooperate.",
      "tension": "The atmosphere thickens as suspicions mount.",
      "microMomentBeats": [
        "Eleanor takes a deep breath, steeling herself for the investigation ahead."
      ]
    },
    "summary": "Eleanor Voss, determined to investigate the chandelier incident, arrives at the estate. She confronts the remaining guests, revealing her intent to uncover the truth behind the tragedy, despite their apprehensions.",
    "estimatedWordCount": 1800,
    "pivotElement": "Eleanor's notebook, ready to record her findings.",
    "factEstablished": "Establishes Eleanor's role as the investigator, setting the stage for her inquiries.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "displays shock; no guilt-tells in Act I"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "shows concern; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "acts protective; no guilt-tells in Act I"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins, revealing hidden tensions and emotions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is resonant and articulate, often laced with a dry wit that draws listeners in."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Captain Ivor Hale",
      "form": "sardonic"
    },
    "eraTextureNote": "Limited communication methods due to reliance on telegrams and telephones.; Transportation difficulties with the aftermath of the Great Depression.; Weather conditions affecting travel plans and social engagements.; Social etiquette demanding formal behavior in public settings.; Class divisions restricting interaction across different social strata.",
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
□ Chapter 3: "The clock in the main hall shows ten minutes past eleven, not eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 3/6 — chapters 3 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 3 marked non-convergent after attempt 2/6: template

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ TEMPLATE LEAKAGE DETECTED ═══
• Your prose closely matches or repeats a paragraph from a prior chapter.
  Every paragraph must be original prose unique to this chapter's scene.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"eleanor interjected her voice firm but if you were in the library dr finch how could you have heard the crash the drawing room is quite a distance from there wouldn t you have needed to be closer to witness it the question hung in the air and he could see the flicker of surprise in his eyes he opened his mouth to respond but hesitated the moment stretching uncomfortably beatrice s gaze shifted between them her expression a mixture of concern and confusion it was clear that the tension was building and eleanor felt a sense of urgency to uncover the truth before it slipped away like the rain outside"

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"the clock continued to tick each sound echoing in the silence eleanor s mind raced as she considered the implications of their conflicting stories she needed to confront the truth to unravel the threads of deception that wove through the room the stakes were high and with every passing moment the possibility of foul play loomed larger as she glanced at the others she could see the weight of their secrets pressing down on them and she knew that the investigation had only just begun this was a tangled web of motives and alibis and she was determined to uncover the truth no matter the cost"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"eleanor turned her attention back to the shattered chandelier her mind racing the thin wire nearby was a crucial piece of evidence a thread that could unravel the entire mystery if pulled correctly she knelt to examine it closely her fingers brushing against the cool surface of the wire it felt too deliberate too calculated for a mere accident someone had wanted this to happen and that thought sent a jolt of adrenaline through her veins who among them could have orchestrated such a cruel act as she pondered this the distant sound of rain began to patter against the windows a fitting backdrop to the storm brewing within the walls of the quill estate"

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"dr finch cleared his throat drawing eleanor s attention back to him we should consider the timeline of events leading up to the chandelier s spring if we can establish when the clock was tampered with it may lead us to the perpetrator her voice was steady but eleanor could see the flicker of anxiety in her eyes she nodded her resolve hardening they needed to act quickly to piece together the fragments of the night before they were lost to the shadows"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 15 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "The morning after the party dawned with a muted light, the sky heavy with clouds, promising rain."
  • "As she moved deeper into the hall, Eleanor's gaze was drawn to the center of the room, where the chandelier lay shattered on the floor, its crystal pieces glinting ominously in the dim light."
  • "Dr."
  • "Captain Hale entered the hall just then, his presence commanding yet tinged with unease."
  • "Beatrice Quill appeared next, her face pale and drawn, as though the night’s events had drained the color from her cheeks."
  • "As the four of them stood in the grand hall, the atmosphere thickened with unspoken accusations and buried secrets."
  • "Eleanor turned her attention back to the shattered chandelier, her mind racing."
  • "Dr."
  • "The morning had turned into a tense late morning, the rain pattering softly against the windows of the drawing room of the Quill estate."
  • "Dr."
  • "Eleanor's eyes flicked to Beatrice Quill, who stood nearby, her face pale and drawn."
  • "Captain Hale, leaning casually against the doorframe, raised an eyebrow at the two women."
  • "As the conversation continued, each character recounted their alibis from the previous night, but inconsistencies began to surface."
  • "Eleanor interjected, her voice firm."
  • "The clock continued to tick, each sound echoing in the silence."

Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.81 >= 0.80). Rephrase this passage to avoid template leakage.
MITIGATION MODE: structural_pivot
```
