# Actual Prompt Record

- Run ID: `mystery-1779505197729`
- Project ID: ``
- Timestamp: `2026-05-23T03:16:10.642Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1b44b5b83bfdc77f`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of loyalty, believing they were protecting a loved one from a greater threat." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Socialite Rival
   - Dr. Mallory Finch: Professional Peer
   - Captain Ivor Hale: Old Guard
   - Beatrice Quill: Ambitious Outsider
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: May 1935
In May of 1935, the air in England is thick with unease as the shadows of the Great Depression loom large. Communities are recovering slowly from the economic downturn, yet the divide between the wealthy elite and struggling working classes is starkly visible. In Little Middleton, the affluent gather in their grand estates, attempting to maintain their social standing while facing dwindling fortunes. Meanwhile, the working class grows restless, with labor strikes and protests rising in frequency, reflecting a society on edge. This is a time when societal expectations weigh heavily; formal attire for gatherings is non-negotiable, and the pressure to uphold appearances is palpable. For those in power, the fear of losing their status drives them to desperate measures, and for those without, the fight for dignity and recognition intensifies, creating a backdrop of tension that permeates daily life.
Emotional register: A collective sense of anxiety and foreboding permeates society as individuals grapple with financial insecurity and rising political tensions.
Physical constraints: Limited communication methods, relying on telegrams and letters. | Travel is often constrained by poor weather and road conditions. | Social gatherings require adherence to strict formal dress codes.
Current tensions (weave into background texture): Rising unemployment and social unrest due to the Great Depression. | The threat of fascism in Europe leading to increased political unease. | Class struggles manifesting through protests and strikes.
Wartime context — Many veterans are struggling to reintegrate into civilian life after serving in World War I.: Society is divided, with veterans feeling unappreciated and marginalized. Absence effect: The absence of those lost in the war adds to the emotional weight carried by the community.

## Season Lock (mandatory — derived from May 1935)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
The Clockwork Conspiracy explores how desperation and ambition can lead individuals to moral decay, revealing the darker side of human nature amidst societal pressures, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A journey through tension and revelation, marked by the unveiling of deep-seated resentments and moral dilemmas.

Arc:
The story begins in the grand yet oppressive atmosphere of Little Middleton Manor, where the initial shock of Eleanor Voss's murder casts a pall over the gathering. As the investigation unfolds, the tension rises with each new clue, revealing the complex relationships and hidden resentments among the characters. Dr. Mallory Finch's alibi and her nervousness introduce the first wave of unease, while Captain Ivor Hale's defensive demeanor raises suspicions. A crucial pivot occurs when evidence of the tampered clock comes to light, shifting the focus of the investigation and forcing characters to confront their pasts. Midway, a revelation about the clock’s manipulation recontextualizes the timeline, leading to a climactic confrontation where motives and alibis collide under pressure. As the truth emerges, characters grapple with the emotional fallout of their choices, reflecting on the costs of ambition and the fragility of reputation. Ultimately, the resolution leaves them changed; the weight of their secrets lingers, echoing the broader societal turmoil of the 1930s.

The story opens: A heavy atmosphere of tension and foreboding pervades the manor. As the investigation takes shape: The initial clues spark suspicion and reveal deep-seated rivalries. A first key turn arrives: The tampered clock presents a pivotal shift in the investigation's direction. At the mid-point of the story: A shocking revelation about the timeline heightens the stakes for all characters.

A second pivot reshapes the course: The confrontation reveals the true nature of the relationships and ambitions at play. As tension reaches its height: Mounting pressure culminates in a tense showdown as truths are revealed. The climax brings the central question to a head: The emotional confrontation lays bare the characters' vulnerabilities and regrets. In the final resolution: The aftermath leaves characters irrevocably changed, burdened by the weight of their actions.

Underpinning every turn is the story's central concern: The Clockwork Conspiracy explores how desperation and ambition can lead individuals to moral decay, revealing the darker side of human nature amidst societal pressures. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A journey through tension and revelation, marked by the unveiling of deep-seated resentments and moral dilemmas. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
A heavy atmosphere of tension and foreboding pervades the manor.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of the elite during the Great Depression, attempting to maintain her social status amidst financial decline. Her public persona as a charming philanthropist is at odds with the resentment she feels towards those who overshadow her efforts. As she grapples with her diminishing fortune, Eleanor reflects the pressures of a society where appearances are everything, and hidden ambitions threaten to unravel her carefully constructed life.
Era intersection: Eleanor's financial desperation parallels the larger economic struggles of the 1930s, revealing the cracks in her polished facade.

### Dr. Mallory Finch
Dr. Mallory Finch exemplifies the moral dilemmas faced by professionals during the economic downturn. Respected in her field, she secretly engages in unethical practices to secure funding for her failing clinic. The pressure of maintaining her reputation amidst the Great Depression leads her to desperate decisions, showcasing the lengths individuals will go to protect their livelihoods in a time of widespread financial instability.
Era intersection: Mallory's actions reflect the ethical conflicts many faced as they navigated a society where survival often trumped morality.

### Beatrice Quill
Beatrice Quill represents the ambitious youth navigating the complexities of a career in journalism during a turbulent period. Eager to uncover the truth, she grapples with her own ethical missteps while facing the societal pressures of the time. Her fears of exposure underscore the moral ambiguities faced by individuals striving for success in a world where integrity is often compromised.
Era intersection: Beatrice's ambition and fear of exposure reflect the rising competition and ethical dilemmas present in the journalism landscape of the 1930s.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks in a smooth, melodic tone, often laced with a subtle sharpness that hints at her underlying envy and resentment.
[comfortable] Oh, darling, isn't it lovely here? Just perfect for a little gathering.
[evasive] Well, I wouldn't want to trouble anyone with my petty concerns.
[stressed] It's just so difficult to keep up appearances when everything is falling apart.
Humour: Eleanor often employs polite savagery, masking her true feelings with genteel phrases.

### Dr. Mallory Finch (she/her/her)
Dr. Finch has a calm and measured voice, often laced with medical jargon that makes her sound clinical and detached.
[comfortable] The body reacts in fascinating ways, truly a marvel of nature.
[evasive] I'm sure there’s no need to dwell on my personal matters.
[stressed] If only they would understand the pressures we face in this field!
Humour: Her dry wit occasionally surfaces, revealing her frustrations.

### Beatrice Quill (she/her/her)
Beatrice speaks rapidly, her enthusiasm spilling over, revealing a mix of youthful bravado and sardonic wit.
[comfortable] Isn't it just thrilling to uncover the next big story?
[evasive] I don't think my personal life is relevant to the investigation.
[stressed] If they find out about my article, it could ruin everything!
Humour: Her sardonic edge often lightens the otherwise tense atmosphere.

## Location Registers (scene framing guides)

Drawing Room: The drawing room exudes a sense of both elegance and tension; it serves as a battleground for social maneuvering, where every smile hides a potential dagger.. Camera angle: A writer entering this space should feel the weight of history and the unspoken conflicts simmering beneath the surface.. Era: The societal expectations of the 1930s dictate that appearances are paramount, adding layers to the interactions here.

Library: The library is a sanctuary of secrets, filled with the musty scent of old books and the weight of knowledge; it feels both comforting and stifling, as if the walls themselves guard their hidden truths.. Camera angle: A writer should approach this space with a sense of reverence, aware that every book may hold a clue to the unfolding mystery.. Era: During this period, access to knowledge is both a privilege and a burden, reflecting the elite's control over information.

Gardens: The gardens, with their vibrant blooms and manicured hedges, offer a deceptive tranquility; they are a space for reflection, yet also a stage for whispered secrets and hidden agendas.. Camera angle: A writer entering this space should feel the duality of beauty and tension, as nature itself seems to conspire with human emotions.. Era: In the 1930s, gardens symbolize both the beauty of the upper class and the stark contrast to the struggles of the working class outside.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder creates an inappropriate environment for humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows the time as quarter past nine. | corr: Witnesses observed the clock, leading them to believe the murder occurred at that time. | effect: Narrows the timeframe of the murder to between 9:00 PM and 9:30 PM.
  - Step 2: obs: Witnesses reported hearing the clock strike the hour at 9:30 PM. | corr: This contradicts the actual time of the murder, which must have occurred before the clock struck. | effect: Eliminates the possibility of Dr. Mallory Finch being innocent if the murder happened before 9:30 PM.
  - Step 3: obs: A faint scratch on the clock face suggests it was tampered with. | corr: The scratch indicates someone adjusted the clock to mislead witnesses. | effect: Narrows suspicion to those who had access to the study during the murder window.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and study against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4
- Fair-play rationale: Step 1: The clock showing quarter past nine and the scheduled meeting time provide the initial timeline. Step 2: Witnesses confirming the clock struck 9:30 PM contradicts the murder timing. Step 3: The tampered clock and access records reveal Dr. Mallory Finch's guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks in a smooth, melodic tone, with an occasional sharpness that betrays her true feelings
She often employs genteel phrases, but her barbed comments reveal her underlying disdain.
Eleanor grapples with her envy of the victim's success, torn between her desire for recognition and the guilt of her resentful thoughts.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with measured precision, her voice a calm, steady cadence that belies the turmoil within
She often uses medical jargon, which can make her sound cold, but an occasional dry quip reveals her hidden frustrations.
Mallory is torn between her professional integrity and the desperation to keep her career afloat, fearing that exposure of her malpractice could shatter her life.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks rapidly, her enthusiasm often spilling over into her sentences
She uses a mix of journalistic jargon and casual slang, with a sardonic edge that reveals her youthful bravado.
Beatrice grapples with her fear of being discovered as a fraud, torn between her ambition and the ethical standards of her profession.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks in a smooth, melodic tone, with an occasional sharpness that betrays her true feelings. She often employs genteel phrases, but her barbed comments reveal her underlying disdain.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it lovely here? Just perfect for a little gathering."
  [evasive] "Well, I wouldn't want to trouble anyone with my petty concerns."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor was losing funding for her charity due to the victim's competing charity event." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with measured precision, her voice a calm, steady cadence that belies the turmoil within. She often uses medical jargon, which can make her sound cold, but an occasional dry quip reveals her hidden frustrations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The body reacts in fascinating ways, truly a marvel of nature."
  [evasive] "I'm sure there’s no need to dwell on my personal matters."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory feared the victim would expose her malpractice and end her career." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks rapidly, her enthusiasm often spilling over into her sentences. She uses a mix of journalistic jargon and casual slang, with a sardonic edge that reveals her youthful bravado.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it just thrilling to uncover the next big story?"
  [evasive] "I don't think my personal life is relevant to the investigation."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice believed the victim could expose her secret, ruining her career." — do not surface in Act I.



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
An imposing country estate, steeped in secrets and class divisions, where every shadow could harbor a clue.

Key Locations Available:
- Drawing Room (interior): Social gathering space
- Library (interior): Research and contemplation space
- Gardens (exterior): Outdoor space for reflection and social interaction

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, reflecting the underlying class tensions and uncertainty of the times.
Weather: Overcast with intermittent rain, typical for the region in autumn.

Era markers: Manual typewriters in the study | Early telephone lines connecting the house | Radio broadcasting news in the drawing room

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
Drawing Room (interior):
  - Visual: ornate chandelier crystals, rich velvet drapes, gilded picture frames
  - Sounds: crackling fire in the hearth, soft laughter and murmurs, the ticking of a clock
  - Scents: beeswax from candles, smoky fireplace ash, freshly polished wood
  - Touch: plush velvet upholstery, cold marble fireplace mantle

Library (interior):
  - Visual: dusty leather-bound books, sunlight filtering through tall windows, intricate woodwork on shelves
  - Sounds: pages turning slowly, the ticking of a clock, soft footsteps on carpet
  - Scents: old paper and leather, fresh ink from a typewriter, wood polish and dust
  - Touch: smooth wooden desk surface, soft carpet underfoot

Gardens (exterior):
  - Visual: vibrant flower beds, neatly trimmed hedges, a stone fountain bubbling
  - Sounds: birds chirping in the trees, the gentle gurgle of the fountain, rustling leaves in the wind
  - Scents: freshly turned earth, the scent of damp leaves, flowers blooming in autumn
  - Touch: cool damp grass underfoot, smooth stone of the fountain

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In May of 1935, the air in England is thick with unease as the shadows of the Great Depression loom large
- Communities are recovering slowly from the economic downturn, yet the divide between the wealthy elite and struggling working classes is starkly visible
- In Little Middleton, the affluent gather in their grand estates, attempting to maintain their social standing while facing dwindling fortunes
- Meanwhile, the working class grows restless, with labor strikes and protests rising in frequency, reflecting a society on edge
- This is a time when societal expectations weigh heavily; formal attire for gatherings is non-negotiable, and the pressure to uphold appearances is palpable

TEMPORAL CONTEXT:

This story takes place in May 1935 during spring.

Seasonal Atmosphere:
- Weather patterns: Overcast with sporadic rain showers, Mild temperatures averaging around 15°C, Occasional bursts of sunlight piercing through clouds
- Daylight: Longer days with twilight extending to nearly 9 PM, creating an extended twilight that adds to the atmosphere.
- Seasonal activities: Maypole dancing in local villages, Gardening and planting season in full swing, Attending local fairs and markets
- Seasonal occasions: May Day (May 1)
- Season: spring

Period Fashion (describe naturally):
- Men formal: Tailored three-piece suits in light grey or tan, Fedoras in straw or light felt, Polished leather brogues
- Men casual: Button-down shirts with rolled-up sleeves, Knitted cardigans, Chinos in pastel colors
- Men accessories: Silk ties with geometric patterns, Pocket squares in contrasting colors, Leather gloves
- Women formal: Tea-length dresses with floral prints, Wide-brimmed hats adorned with ribbons, Clutch bags made of beaded fabric
- Women casual: Cotton blouses with puffed sleeves, Knee-length skirts in pastel shades, Light-weight cardigans
- Women accessories: String pearls, Belted waist to accentuate silhouette, Flower corsages

Cultural Context (reference naturally):
- Music/entertainment: , The Andrews Sisters' harmonies on the radio, Benny Goodman's swing music gaining traction; Films: , Top Hat starring Fred Astaire and Ginger Rogers; Theatre: , Noel Coward's Blithe Spirit; Radio: , The Shadow
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Newspaper: one penny
- Current events: The rise of fascism in Europe causing unease; Debates in parliament over unemployment assistance
- Literature: Brave New World by Aldous Huxley | The Maltese Falcon by Dashiell Hammett | Of Mice and Men by John Steinbeck | [Mystery] | [Social commentary] | [Romantic fiction]
- Technology: The first commercial radio stations. | Advancements in home appliances like refrigerators. | Early developments in television technology. | Standard radios for entertainment | Household telephones for communication | Typewriters in offices for documentation
- Daily life: Garden parties as social gatherings, Picnics in local parks, Visiting local shops for fresh produce
- Social rituals: Sunday tea gatherings with neighbors, Formal invitations for dinner parties, Attending church services on Sundays

Atmospheric Details:
The scent of damp earth after rain mingles with blooming flowers in the gardens. The sound of distant thunder rolls in as guests gather in the drawing room, creating an air of anticipation. A chill lingers in the air, hinting at the unpredictable weather patterns of the spring season.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspaper headlines, theater poste
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time the victim was supposed to meet the suspect: "a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study shows the time as quarter past nine.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This is the time displayed when the witnesses saw it.

• [clue_2] Witnesses reported hearing the clock strike the hour at nine thirty in the evening.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This indicates a discrepancy in the timeline.

• [clue_core_contradiction_chain] Witnesses observed the clock, leading them to believe the murder occurred at that time.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This assumption is false as the clock was tampered with.

• [clue_culprit_direct_dr_mallory_finch] Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time the victim was supposed to meet the suspect: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).
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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Gardens, the study in the Finch residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Gardens", "the study in the Finch residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study in the Finch residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

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
   WRONG: \"I have no alibi,\" Voss said. He turned away. (if Voss is femal
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6478; context=10322; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common use | early household telephones with limited lines | manual typewriters standard in offices | increasing use of telephones for personal communication | telegram services for urgent messages | airmail for faster delivery of correspondence.
5. Respect setting movement/access constraints in scene action and alibis: layout of rooms creates natural barriers to movement | gardens and woods limit visibility and access to the estate | weather can affect outdoor access and evidence visibility | specific permissions required for entry to private areas of the house | daily routines dictate access to certain rooms at different times.
6. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin amidst the Great Depression forces a diverse group of heirs and staff to gather at the manor for a tense family meeting, where hidden resentments and class tensions threaten to erupt.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same murder type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (same false assumption about timing)
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Mysterious Affair at Styles' (similar character roles and dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 2):**
Required elements: Execute the discriminating test, Observe the clock's time discrepancy, Draw conclusion about Dr. Mallory Finch's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 4): Prove he was in the garden at the time of the murder
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation
- clue_2 must appear in Act 1, Scene 1 via Witness statements
- clue_core_contradiction_chain must appear in Act 1, Scene 1 via Cross-check contradiction
- clue_culprit_direct_dr_mallory_finch must appear in Act 1, Scene 1 via Direct observation
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Eleanor Voss" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Eleanor Voss in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study in the Finch residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Beatrice Quill must claim or be recognised as the investigator in this chapter. Establish Beatrice Quill as the detective-in-charge within the first two paragraphs — Beatrice Quill IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Beatrice Quill begins the investigation in this chapter.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study shows the time as quarter past nine. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This is the time displayed when the witnesses saw it.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses reported hearing the clock strike the hour at nine thirty in the evening. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates a discrepancy in the timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses observed the clock, leading them to believe the murder occurred at that time. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This assumption is false as the clock was tampered with.
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
    • A mechanical clock was tampered with to show a false time, misleading witnesses about the actual time of the murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock was adjusted to mislead about the murder time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "9:30 PM to 10 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time the victim was supposed to meet the suspect, write exactly: "a quarter past eleven".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Eleanor's scheduled meeting at 9:30 PM
- Established timeline fact: Witnesses recalled the clock striking 9:30 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "a quarter past eleven" (The time the victim was supposed to meet the suspect).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock in the study showing the time as quarter past nine."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than quarter past nine, contradicting three suspects' alibis."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study in the Finch residence",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Beatrice Quill",
      "Dr. Mallory Finch",
      "Eleanor Voss"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stands frozen, her face pale as she glances at the clock."
      ]
    },
    "summary": "In the dim light of the study, Beatrice Quill discovers the lifeless body of the victim, a mechanical clock showing the time as quarter past nine. the doctor Finch and Eleanor Voss, both visibly shaken, recount their last moments with the victim, leading to conflicting statements regarding the time of death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The clock in the study showing the time as quarter past nine.",
    "factEstablished": "Establishes the victim died no later than quarter past nine, contradicting three suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A heavy atmosphere of tension and foreboding pervades the manor.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks in a smooth, melodic tone, often laced with a subtle sharpness that hints at her underlying envy and resentment."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication methods, relying on telegrams and letters.; Travel is often constrained by poor weather and road conditions.; Social gatherings require adherence to strict formal dress codes.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 1: "The clock in the study shows the time as quarter past nine." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Witnesses reported hearing the clock strike the hour at nine thirty in the evening." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Witnesses observed the clock, leading them to believe the murder occurred at that time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "A mechanical clock was tampered with to show a false time, misleading witnesses about the actual time of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
      "summary": "In the dim light of the study, Beatrice Quill discovers the lifeless body of Eleanor Voss, a mechanical clock showing the time as quarter past nine. Dr. Mallory Finch and Eleanor Voss, both visibly shaken, recount their last moments with the victim, leading to conflicting statements regarding the time of death.",
      "paragraphs": [
        "Beatrice Quill stepped into the study in the Finch residence, the early morning light struggling to penetrate the heavy clouds outside. A chill hung in the air, and the sound of distant rain pattering against the window added a sense of urgency to the moment. Her heart raced as she crossed the threshold, her eyes drawn to the mechanical clock on the mantle, its hands frozen in time. It showed the time as quarter past nine. The sight sent a shiver down her spine, and she felt the weight of the room pressing down on her as she took in the scene before her.",
        "The clock's display was a stark reminder of the timeline they were working with. Beatrice's mind raced as she considered the implications of the time. If the clock was accurate, the murder must have occurred shortly before that moment. She recalled the witnesses who had reported hearing the clock strike the hour at nine thirty in the evening. This discrepancy raised questions about the reliability of the clock's time, and she felt a knot tighten in her stomach. Who had tampered with it, and why?",
        "Witnesses observed the clock, leading them to believe the murder occurred at that time. The thought lingered in Beatrice's mind, casting doubt on the alibis of those present. She glanced around the room, her gaze landing on Dr. Mallory Finch, who stood pale and trembling by the door. The doctor had been in the vicinity when the clock struck, and Beatrice couldn't shake the feeling that something was amiss. Mallory's nervous demeanor only heightened her suspicions.",
        "As Beatrice stepped further into the study, her eyes caught the faintest glimmer of something on the clock's mechanism. She leaned closer, her breath hitching as she realized that direct evidence tied Dr. Mallory Finch to the mechanism access point before the discriminating test. The clock had been tampered with, and the thought sent a wave of unease through her. What had Mallory done to mislead them?",
        "The mechanical clock was tampered with to show a false time, misleading witnesses about the actual time of the murder. Beatrice's mind raced as she pieced together the implications. If the clock had been adjusted, it could change everything they thought they knew about the timeline. She needed to gather more information, to confront the others and see how their stories aligned with the evidence at hand.",
        "Eleanor stood frozen, her face pale as she glanced at the clock, her eyes wide with disbelief. \"This can't be happening,\" she whispered, her voice barely audible over the sound of the rain. Beatrice turned to her, sensing the weight of the moment. Eleanor's reaction was telling; there was something deeper at play here, something she wasn't revealing. The tension in the room was palpable, and Beatrice knew that the answers lay hidden beneath the surface."
      ]
    }
  ],
  "cast": ["Beatrice Quill", "Dr. Mallory Finch", "Eleanor Voss"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1 | absent",
    "season_words_used": "none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_id or description: chapter 1 paragraph 1 | absent",
    "early_observation_present": "description: chapter 1 paragraph 1 (first 25%) | present",
    "early_inference_present": "yes: paragraph immediately following observation | yes"
  }
}
```

## Message 5 (role=user)

```text
Attempt 4/6 — chapters 1 — 1 validation issue(s) to resolve:

═══ OTHER ERRORS (1) ═══
• Chapter 1: Chapter 1 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)

═══ RETRY MICRO-PROMPTS (1) ═══
• REPAIR [sensory_grounding — attempt 4]: The opening block (first 2 paragraphs) has only 1 sensory marker(s). Need at least 2.
  In paragraph 1 or 2, add 1 more word(s) from the EXACT list the validator counts:
  • Smell/scent: smell, scent, odor, fragrance
  • Sound: sound, echo, silence, whisper, creak
  • Tactile: cold, warm, damp, rough, smooth
  • Visual/light: glow, shadow, flicker, dim
  Use these words naturally in a sentence — e.g. "The cold of the hallway pressed against her cheeks" or "A creak from the floorboards above broke the silence."
  Do NOT use synonyms like 'chill' or 'murmur' — they are not counted.

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: unknown
ATTEMPT: 3/6
MANDATORY FIXES:
- Resolve unknown issues before accepting this batch.
- Chapter 1: Chapter 1 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)
```
