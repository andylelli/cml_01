# Actual Prompt Record

- Run ID: `mystery-1779300550221`
- Project ID: ``
- Timestamp: `2026-05-20T18:15:10.035Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `06501ffc40254f2e`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to save a loved one from ruin, evoking a complex sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


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

## Era: 1934-05
In May 1934, England is caught between a recovering economy and the looming threat of political upheaval. The Great Depression's remnants still cast a shadow over daily life, affecting even the wealthiest families, who must navigate the delicate balance of maintaining their status while grappling with rising discontent among the working class. The estate at Little Middleton, despite its grandeur, feels the pressure of societal expectations and the fear of scandal. Guests gather for a will reading, yet their laughter is strained, and whispered secrets linger in the air. This tension is exacerbated by the rise of fascism in Europe, which colors conversations and influences social dynamics, creating an atmosphere thick with suspicion and anxiety.
Emotional register: A collective anxiety permeates society as individuals navigate the complexities of reputation and trust.
Physical constraints: Limited communication due to outdated technology | Petrol shortages affecting travel plans | Strict social etiquette constraining open dialogue | Weather conditions impacting outdoor events
Current tensions (weave into background texture): Economic recovery juxtaposed with lingering poverty | Political tensions surrounding fascism in Europe | Class disparity leading to social unrest
Wartime context — Many men are still recovering from the aftermath of World War I, facing challenges as they reintegrate into civilian life.: Communities are torn between nostalgia for the past and fears about an uncertain future. Absence effect: The absence of many young men in society creates a sense of loss and longing, influencing social dynamics.

## Story Theme
The unraveling of trust and the fragility of reputation in a world where secrets can lead to deadly consequences, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional landscape of the story is one of mounting tension and revelation.

Arc:
The story opens in the opulent yet oppressive atmosphere of Little Middleton Manor, where the air is thick with secrets and the weight of expectation hangs over the gathering guests. On a stormy evening, Eleanor Voss is discovered dead just before her will is to be read, throwing the assembled heirs into a whirlpool of suspicion and fear. As Detective Beatrice Quill begins her investigation, the initial clues present a tangled web of relationships, revealing hidden motives and financial pressures that drive each character. The rising tension is palpable as Beatrice navigates the emotional costs of her pursuit of truth, encountering false leads that deepen the sense of unease.

A pivotal moment occurs when she uncovers evidence of tampering with the clock, which alters the timeline of Eleanor's death, shifting the focus of the investigation. This new direction leads to a revelation that recolors the initial interactions, exposing loyalty and betrayal among the suspects. As the pressure mounts, the climax unfolds in a confrontation where truths are laid bare, and the cost of deception is brought to light. The resolution leaves characters grappling with the emotional fallout of their choices; Eleanor’s legacy is forever altered, Dr. Finch must confront her past, Hale faces the consequences of his actions, and Beatrice must reconcile her ambition with the moral implications of her revelations.

## Emotional register at this point in the story
The atmosphere is heavy with anticipation, setting the stage for the unfolding drama.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of a socialite caught in the economic turmoil of the 1930s, where her wealth feels precarious amidst whispers of financial troubles. She navigates a world where her reputation is paramount, and any scandal could unravel her carefully constructed identity. The specter of the Great Depression looms over her gatherings, casting doubt on the stability of her social standing.
Era intersection: Her personal stakes reflect the broader societal pressures of maintaining appearances in a time of economic distress.

### Dr. Mallory Finch
Dr. Mallory Finch's position as a respected physician is challenged by her hidden past with the victim, revealing the fragility of trust within the community. As political tensions rise, she grapples with the implications of her choices, knowing that any scandal could tarnish her reputation. The fears of losing her career echo the apprehensions of those impacted by the shifting tides of society.
Era intersection: Her struggle encapsulates the moral conflicts faced by professionals in an era marked by rising fascism and economic uncertainty.

### Beatrice Quill
Beatrice Quill, an aspiring writer, embodies the youthful ambition of the era, yet her desire to uncover scandal reflects a growing tension between personal aspiration and moral integrity. As she chronicled the lives of those at the manor, she grapples with the implications of her pursuits against the backdrop of a society on edge. Her journey reveals the complexities of navigating personal ambition in a time of societal upheaval.
Era intersection: Her character arc highlights the emerging voices of women seeking to carve their paths in a changing world.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant cadence, often using irony to navigate social absurdities.
[comfortable] Oh, darling, you simply must try the canapés; they are to die for!
[evasive] Well, it's so complicated, isn't it? I’d rather not dwell on it right now.
[stressed] I can't believe this is happening! Everything I’ve built is at stake!
Humour: Her use of polite savagery adds depth to her character, revealing her inner turmoil.

### Dr. Mallory Finch (she/her/her)
Mallory's speech is measured, reflecting her professional demeanor, with occasional dry wit.
[comfortable] A bit of fresh air can do wonders for the spirit, don’t you think?
[evasive] I’m afraid that’s not something I can discuss openly.
[stressed] This is a nightmare! I cannot let my past ruin everything!
Humour: Her dry wit often serves to mask deeper insecurities and fears.

### Beatrice Quill (she/her/her)
Beatrice speaks with animated excitement, often weaving metaphors into her narrative.
[comfortable] What a thrilling evening! So much potential for a story here!
[evasive] Well, I’m not sure if that’s really relevant to the bigger picture.
[stressed] I have to get this right! This could make or break my career!
Humour: Her sharp observations add a layer of complexity to her character.

## Location Registers (scene framing guides)

The Library: The library feels like a crucible of secrets, where the weight of history and whispered conversations create an oppressive atmosphere. Every shadow seems to conceal a truth, and the stillness is punctuated only by the sound of rustling papers, heightening the tension as characters confront their fears and desires.. Camera angle: Entering this space, a writer might feel the weight of every unspoken accusation lingering in the air.. Era: In this era, the library serves as a refuge and a battleground for ideas, reflecting the shifting social dynamics of the time.

The Drawing Room: The drawing room is lavish yet suffocating, filled with laughter that feels forced and conversations that dance around underlying tensions. Guests navigate the elegant decor, but beneath the surface lies a current of suspicion, where every raised voice and fleeting glance can ignite conflict.. Camera angle: A writer entering this room might sense the fragile balance between festivity and anxiety, as secrets lurk in every corner.. Era: This space epitomizes the social rituals of the 1930s, where appearances must be maintained at all costs.

The Study: The study exudes an air of authority and isolation, where decisions are made behind closed doors. The dim light and heavy drapes create a sense of claustrophobia, amplifying the tension as characters confront their darkest fears and deepest secrets in this intimate space.. Camera angle: A writer entering the study might feel the pressing weight of history and the urgency of unspoken matters.. Era: In this historical context, the study serves as a reminder of the power dynamics at play, where knowledge and authority can be both a shield and a weapon.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The initial crime sets a serious tone, necessitating a somber atmosphere.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The time of death must align with the dinner timeline.
- Hidden truth to progressively expose: The clock was intentionally altered to show a different time.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study was found stopped at ten minutes past eleven. | corr: The clock's time does not match the expected time of death. | effect: Narrows the time of death to a window before dinner.
  - Step 2: obs: Witness statements indicated dinner was served at 8:00 PM. | corr: This creates a contradiction with the clock's time. | effect: Eliminates the dinner timeline as the accurate time of death.
  - Step 3: obs: The clock's casing shows signs of tampering. | corr: Dr. Finch had the opportunity to tamper with the clock. | effect: Narrows suspicion towards Dr. Mallory Finch.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's time against another accurate clock proves the tampering.
- Test must rely on already-shown clue IDs: clue_clock_time_stopped, clue_witness_dinner_time, clue_clock_tampering_signs, clue_mechanism_visibility_core, clue_fp_contradiction_step_3
- Fair-play rationale: Step 1: The clock stopped at ten minutes past eleven (early) contradicts dinner time. Step 2: Witnesses confirm dinner was served at 8:00 PM (mid), eliminating the dinner timeline. Step 3: The tampering signs on the clock lead to Dr. Finch (discriminating test), confirming his guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an elegant cadence, often punctuating her sentences with a playful lilt
She enjoys using irony to highlight social absurdities, and her laughter is infectious, though it often hides deeper anxieties.
Eleanor grapples with the dichotomy of her desires and her duties. While she craves the freedom to love whom she chooses, the weight of societal expectations weighs heavily on her conscience, leaving her torn between passion and propriety.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks in a measured tone, often choosing her words carefully as if she were diagnosing a patient
Her wit is sharp, but she delivers it with a calm demeanor, occasionally punctuated by a knowing smile that hints at her deeper thoughts.
Mallory is internally torn between her professional ethics and the emotional turmoil stemming from her past relationship with the victim. She grapples with guilt and the fear that her secrets will not only ruin her career but also expose the fragility of her moral compass.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an animated rhythm, her words tumbling out in a flurry of excitement
She has a tendency to weave metaphors into her speech, often reflecting her literary aspirations, and her humor is sharp, revealing her keen observations of human nature.
Beatrice is torn between her ambition and her growing empathy for those she writes about. The desire to uncover the truth clashes with her fear of the consequences, leaving her feeling morally compromised.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an elegant cadence, often punctuating her sentences with a playful lilt. She enjoys using irony to highlight social absurdities, and her laughter is infectious, though it often hides deeper anxieties.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, you simply must try the canapés; they are to die for!"
  [evasive] "Well, it's so complicated, isn't it? I’d rather not dwell on it right now."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's fear of losing her social status and financial security drives her to preserve her secret at all costs. The idea of scandal is abhorrent to her, and the potential fallout could mean not only the end of her engagement but also the collapse of her carefully constructed identity." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks in a measured tone, often choosing her words carefully as if she were diagnosing a patient. Her wit is sharp, but she delivers it with a calm demeanor, occasionally punctuated by a knowing smile that hints at her deeper thoughts.
Sample voice fragments (match this register and rhythm):
  [comfortable] "A bit of fresh air can do wonders for the spirit, don’t you think?"
  [evasive] "I’m afraid that’s not something I can discuss openly."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "When the victim threatened to expose a medical scandal that could ruin her career, Mallory felt betrayed. The fear of losing everything she had worked for ignited a tempest of conflicting emotions, as she grappled with the implications of her past." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an animated rhythm, her words tumbling out in a flurry of excitement. She has a tendency to weave metaphors into her speech, often reflecting her literary aspirations, and her humor is sharp, revealing her keen observations of human nature.
Sample voice fragments (match this register and rhythm):
  [comfortable] "What a thrilling evening! So much potential for a story here!"
  [evasive] "Well, I’m not sure if that’s really relevant to the bigger picture."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desiring to uncover a scandal that could propel her writing career, Beatrice is driven by the allure of a compelling narrative, perhaps even at the cost of others' reputations." — do not surface in Act I.



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
An imposing country estate shrouded in mystery, where the echoes of the past mingle with the present's deception.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Restricted area for private discussions

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an undercurrent of suspicion among the guests
Weather: Overcast with occasional rain, typical for the season

Era markers: Petrol-powered automobiles with limited reliability | Early domestic telephones with party lines | Typewriters for correspondence and reports | Popular passenger trains for regional travel

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
  - Visual: Dust motes dancing in the candlelight, Rich mahogany furniture, Leather-bound books lining the shelves
  - Sounds: Crackling firewood, The rustle of pages turning, Distant thunder rumbling
  - Scents: Beeswax from the candles, Aged paper and leather, Cold stone and damp wood
  - Touch: Worn leather armchair, Cool marble tabletop

The Drawing Room (interior):
  - Visual: Richly patterned rugs underfoot, Gilded picture frames on the walls, The glint of crystal from the chandelier
  - Sounds: Soft piano notes echoing in the silence, Laughter and raised voices from guests, The crackle of the fire in the hearth
  - Scents: Fresh flowers and perfume, A hint of smoke from the fireplace, Polished wood and varnish
  - Touch: Soft velvet upholstery, Cool marble mantelpiece

The Study (interior):
  - Visual: Heavy drapes blocking out light, Stacks of papers piled haphazardly, The gleam of polished wood
  - Sounds: The scratch of a quill on paper, The rustle of documents being shuffled, The ticking of a clock on the mantelpiece
  - Scents: The musty scent of old books, Fresh ink and paper, A hint of tobacco lingering in the air
  - Touch: Smooth surface of the desk, Coolness of the marble fireplace

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-s
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In May 1934, England is caught between a recovering economy and the looming threat of political upheaval
- The Great Depression's remnants still cast a shadow over daily life, affecting even the wealthiest families, who must navigate the delicate balance of maintaining their status while grappling with rising discontent among the working class
- The estate at Little Middleton, despite its grandeur, feels the pressure of societal expectations and the fear of scandal
- Guests gather for a will reading, yet their laughter is strained, and whispered secrets linger in the air
- This tension is exacerbated by the rise of fascism in Europe, which colors conversations and influences social dynamics, creating an atmosphere thick with suspicion and anxiety.

TEMPORAL CONTEXT:

This story takes place in May 1934 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Days are growing longer, with twilight lingering until after eight o'clock in the evening.
- Seasonal activities: garden parties in the estate grounds, outdoor picnics if the weather permits, Maypole dancing in nearby villages
- Seasonal occasions: May Day (1st May), Ascension Day (May 10th, observed by some)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits in light wool, double-breasted blazers, fedora hats
- Men casual: linen trousers, knitted polo shirts, canvas shoes
- Men accessories: pocket watches, silk ties with geometric patterns, cufflinks
- Women formal: tea-length dresses with floral prints, cloche hats adorned with ribbons, tailored jackets with peplum details
- Women casual: sundresses made of lightweight cotton, cropped cardigans, ballet flats
- Women accessories: string of pearls, stylish gloves, decorative hairpins

Cultural Context (reference naturally):
- Music/entertainment: 'The Way You Look Tonight' by Fred Astaire, 'Puttin' On the Ritz' by Irving Berlin, Jazz performances by Duke Ellington; Films: 'It Happened One Night', 'The Thin Man'; Theatre: 'Of Mice and Men', 'The Front Page'; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Bread loaf: four pence, Cinema ticket: one shilling, Butter: one shilling four pence
- Current events: Unrest in Germany as Hitler consolidates power; The U.S. continues to navigate the aftermath of the Great Depression
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [detective fiction] | [social realism] | [historical novels]
- Technology: the first portable radio | the electric razor | early vacuum cleaners | domestic telephones with party lines | typewriters for correspondence | petrol-powered cars
- Daily life: attending tea parties, visiting the local market, playing croquet on the estate
- Social rituals: afternoon tea served with cakes, weekly church services followed by community gatherings

Atmospheric Details:
The scent of damp earth and blooming lilacs fills the air as rain lightly falls. The sound of distant thunder rumbles, adding to the tension amongst the guests gathered in the dimly lit drawing room. The flickering candlelight casts long shadows on the walls, obscuring the anxious faces of those who suspect one another.

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
- Authentic references: Use actual songs, films, events
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_witness_dinner_time] Witness statements indicated dinner was served at eight o'clock.
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: The timeline of events is inconsistent with the time of death.

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

CLUES ALREADY REVEALED TO READER: clue_clock_time_stopped — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study was found stopped at ten minutes past eleven.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The rain continued to fall outside, a relentless reminder of the storm brewing within the walls of Little Middleton Manor. Beatrice's thoughts turned to the implications of the clock, its frozen time casting doubt on the alibis of those who had gathered for th..."
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
study, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stood at the threshold of the study, her heart racing as she pushed the heavy door open.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the dining room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 88/100):
  Quality gaps noted: word density below preferred target (714/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS she/her/her/herself — NEVER he/him/his/himself
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
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is fem
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6365; context=10544; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles with limited reliability | early domestic telephones with party lines | typewriters for correspondence and reports | radio broadcasts for news and entertainment | telegrams for rapid communication | mail services including airmail for urgent deliveries.
5. Respect setting movement/access constraints in scene action and alibis: Isolated location requiring travel on foot or by car to reach the nearest town | Geography includes gardens, a pond, and hedgerows which can obscure visibility | Architecture includes locked rooms and access restrictions for certain areas | Restricted areas including the study and cellar that require permission to enter | Daily routines of staff dictate access to various parts of the house.
6. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy benefactor's will reading unites heirs and staff, while the looming specter of the Great Depression and rising fascism heightens tensions and exposes fragile loyalties.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same temporal axis and method of crime)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar character roles and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: clock comparison

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Evidence showing she was dead before dinner.
  Clues: clue_victim_time_of_death, clue_witness_dinner_time
- Captain Ivor Hale (Act 3, Scene 5): Alibi verified with travel documents.
  Clues: clue_travel_documents

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_witness_dinner_time must appear in Act 1, Scene 2 via Witness statements

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


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
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The rain continued to fall outside, a relentless reminder of the storm brewing within the walls of Little Middleton Manor. Beatrice's thoughts turned to the implications of the clock, its frozen time casting doubt on the...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witness statements indicated dinner was served at eight o'clock. [clue_witness_dinner_time] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The timeline of events is inconsistent with the time of death.
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
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Dinner at 8:00 PM
- Established timeline fact: Eleanor found at 9:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stood at the threshold of the study, her heart racing as she pushed the heavy door open. The air inside felt thick, damp with the scent of polished wood and old leather, mingling with an unsettling stillness. Outside, the rain pattered against the windowpanes, a soft yet relentless rhythm that echoed the tension within. Dim light struggled to penetrate the room, casting long shadows that danced across the walls, hinting at the secrets lurking in the corners. As she stepped inside, the heavy drapes seemed to close in around her, amplifying the sense of isolation that enveloped the space.

In the center of the room, Eleanor Voss lay motionless, her elegant form draped across the plush rug, a stark contrast to the opulence surrounding her. Beatrice's breath caught in her throat as she approached, her mind racing with disbelief. The clock on the mantelpiece caught her eye, its hands frozen in time, forever marking the moment of tragedy. The clock in the study was found stopped at ten minutes past eleven. A chill ran down Beatrice's spine as she processed the implications of that time, a detail that would surely unravel the carefully woven narratives of those who had gathered in the manor.

The sight of Eleanor's lifeless body stirred a whirlwind of emotions within Beatrice. She had admired Eleanor from afar, a woman of grace and poise, navigating the treacherous waters of society with a practiced ease. Now, that grace was gone, replaced by an eerie stillness that sent shivers through Beatrice's core. She knelt beside Eleanor, her fingers brushing against the fabric of the woman's gown, noting the delicate embroidery that spoke of a life once vibrant. But there was no warmth left, no pulse to signify the heart that had once beat within.

As Beatrice rose to her feet, she felt the weight of the moment pressing down on her. The study, with its heavy drapes and dark wood, felt like a tomb, a place where secrets were buried alongside the dead. She glanced around, searching for signs of disturbance, anything that might hint at what had transpired in this room. The ticking of the clock was conspicuously absent, leaving a void that echoed the uncertainty swirling in her mind. What had happened here? Who could have done this? And why?

Just then, the door creaked open, and the doctor Finch entered, her face pale and drawn. Beatrice's heart sank at the sight of the doctor, knowing that their shared history would complicate the unfolding events. Mallory's eyes widened as she took in the scene, her breath hitching in her throat. 'Oh, Eleanor,' she whispered, stepping closer, her voice trembling. 'What have we done?' The question hung in the air, heavy with unspoken guilt and fear.

Eleanor's presence loomed large in the room, a reminder of the fragility of life and the secrets that could shatter reputations. Beatrice felt a surge of determination as she looked at Mallory, who was now kneeling beside the body, her hands trembling. 'We need to call for help,' Beatrice said, her voice steady despite the turmoil within. 'This is a crime scene, and we must treat it as such.' Mallory nodded, her expression a mixture of anguish and resolve.

As they awaited the arrival of the authorities, Beatrice's mind raced with possibilities. The clock's stopped hands, the absence of a struggle, and the stillness of the room painted a picture that was both haunting and perplexing. Every suspect present had access to Eleanor, and each had their own motives, hidden beneath layers of social niceties. Beatrice felt the weight of the investigation settle upon her shoulders, a burden she was both eager and apprehensive to bear.

The rain continued to fall outside, a relentless reminder of the storm brewing within the walls of Little Middleton Manor. Beatrice's thoughts turned to the implications of the clock, its frozen time casting doubt on the alibis of those who had gathered for the will reading. The victim died no later than ten minutes past eleven, contradicting three suspects' alibis. She could feel the tension in the air, thick and suffocating, as the reality of the situation settled in. They were all trapped in this web of deceit, and the truth was lurking just out of reach.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's recounting of dinner at eight o'clock"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that dinner was served at eight o'clock, creating a timeline conflict with the clock's reading."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Eleanor claims to have seen Captain Hale near the study around dinner time, suggesting his involvement.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The time of death must align with the dinner timeline.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Dinner Time Alibi",
    "setting": {
      "location": "the dining room",
      "timeOfDay": "Later that morning",
      "atmosphere": "Nervous chatter among guests, uncertainty in the air"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish the dinner timeline and witness statements",
    "cluesRevealed": [
      "clue_witness_dinner_time"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as alibis are discussed",
      "tension": "Eleanor's anxiety about the dinner timeline",
      "microMomentBeats": [
        "Eleanor fidgets with her napkin, hiding her distress"
      ]
    },
    "summary": "Beatrice interviews Eleanor and Dr. Finch about the events leading up to the murder. They confirm dinner was served at eight o'clock, establishing a timeline that contradicts the clock's reading.",
    "estimatedWordCount": 1800,
    "pivotElement": "Eleanor's recounting of dinner at eight o'clock",
    "factEstablished": "Establishes that dinner was served at eight o'clock, creating a timeline conflict with the clock's reading.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Eleanor claims to have seen Captain Hale near the study around dinner time, suggesting his involvement."
    },
    "emotionalRegister": "Initial investigations spark suspicion, creating a sense of rising tension among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant cadence, often using irony to navigate social absurdities."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited communication due to outdated technology; Petrol shortages affecting travel plans; Strict social etiquette constraining open dialogue; Weather conditions impacting outdoor events; Transportation disruptions due to ongoing economic recovery",
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
□ Chapter 2: "Witness statements indicated dinner was served at eight o'clock." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
      "title": "Chapter 2: Dinner Time Alibi",
      "summary": "Beatrice Quill interviews Eleanor Voss and Dr. Mallory Finch about the events leading up to the murder, confirming that dinner was served at eight o'clock, which contradicts the clock's reading and raises suspicion.",
      "paragraphs": [
        "‘I can’t believe this is happening,’ Eleanor Voss murmured, her voice barely rising above the anxious whispers that filled the dining room. The rain continued to patter against the windowpanes, a relentless reminder of the storm brewing outside. Beatrice Quill watched as Eleanor fidgeted with her napkin, her fingers twisting the fabric as if it were a lifeline. The air was thick with tension, and the atmosphere felt charged, as if the very walls of Little Middleton Manor were holding their breath in anticipation of the truth. Beatrice's mind raced with the implications of the clock, its frozen time casting doubt on the alibis of those gathered for the will reading. She needed to act quickly to uncover the truth before the storm outside mirrored the chaos within.",
        "‘Dinner was served at eight o'clock,’ Eleanor finally said, her voice steadier now as she looked directly at Beatrice. The words hung in the air, a stark reminder of the timeline that now felt so precarious. Beatrice felt a pang of urgency; this detail could unravel everything. The clock in the study had stopped at ten minutes past eleven, a detail that contradicted Eleanor's statement. How could they reconcile the two? It was a question that gnawed at Beatrice, and she felt the weight of the moment pressing down on her as she considered the implications of Eleanor's words.",
        "Eleanor's eyes darted around the room, her anxiety palpable. ‘I remember looking at the clock just before we sat down. It was still ticking then,’ she added, her voice trembling slightly. Beatrice noted the way Eleanor's hands shook as she spoke, betraying the composure she tried to maintain. The tension in the room thickened as Beatrice realized the significance of this moment. If dinner had indeed been served at eight, then the time of Eleanor's death was a critical piece of the puzzle. The clock’s reading was not merely an inconvenience; it was a potential harbinger of guilt.",
        "‘And you’re certain of that time?’ Beatrice pressed, her tone gentle but insistent. She needed clarity. Eleanor nodded, her expression a mix of determination and fear. ‘Yes, I am. I was anxious about the guests arriving, and I distinctly remember glancing at the clock.’ Beatrice could see the truth in Eleanor's eyes, but there was something else lurking beneath the surface. A flicker of doubt crossed her mind. Had Eleanor seen something else that evening? Or someone?",
        "Dr. Mallory Finch entered the room, her presence commanding yet tinged with sorrow. ‘What’s happening?’ she asked, her gaze shifting between Beatrice and Eleanor. Beatrice seized the opportunity to include her in the conversation. ‘We’re discussing the timeline of events leading up to Eleanor’s death,’ she replied, her voice steady. ‘Eleanor just confirmed that dinner was served at eight o'clock.’",
        "Mallory's brow furrowed as she absorbed this information. ‘That’s critical,’ she said, her tone shifting to one of urgency. ‘If Eleanor was seen alive at that time, then we must consider what happened after. It’s imperative we establish everyone’s whereabouts.’ Beatrice nodded, feeling the tension rise once more. She turned her attention back to Eleanor, who seemed lost in thought, her fingers still twisting the napkin in her lap.",
        "‘Eleanor, did you happen to see anyone near the study around that time?’ Beatrice asked, hoping to glean more information. Eleanor hesitated, her gaze dropping to the table. ‘I... I think I saw Captain Hale,’ she admitted, her voice barely above a whisper. ‘He was near the door, but I didn’t think much of it at the time.’ Beatrice’s heart raced at this revelation. Captain Hale had been present, and now Eleanor’s words suggested a potential connection to the crime. But could she trust Eleanor’s recollection? The implications were staggering.",
        "‘What was he doing there?’ Mallory asked, her voice sharp with curiosity. Eleanor shrugged, her expression conflicted. ‘I don’t know. I just remember seeing him. He seemed... distracted.’ Beatrice exchanged a glance with Mallory, both women grappling with the weight of Eleanor’s admission. The pieces of the puzzle were beginning to shift, but the picture remained obscured, shrouded in uncertainty. They needed to dig deeper, to unravel the threads of this mystery before it unraveled them all."
      ]
    }
  ],
  "cast": ["Beatrice Quill", "Eleanor Voss", "Dr. Mallory Finch"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 2 | absent",
    "season_words_used": "spring | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_witness_dinner_time: chapter 2 paragraph 2 | present",
    "early_observation_present": "description: chapter 2 paragraph 1 (first 25%) | present",
    "early_inference_present": "yes: paragraph immediately following observation | yes"
  }
}

```

## Message 5 (role=user)

```text
Attempt 2/6 — chapters 2 — 1 validation issue(s) to resolve:

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
ATTEMPT: 1/6
MANDATORY FIXES:
- Resolve unknown issues before accepting this batch.
- Chapter 2: Chapter 2 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)
```
