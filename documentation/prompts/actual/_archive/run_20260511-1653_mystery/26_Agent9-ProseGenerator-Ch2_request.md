# Actual Prompt Record

- Run ID: `mystery-1778518410355`
- Project ID: ``
- Timestamp: `2026-05-11T17:01:18.580Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `cdf4febaeb62240a`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's actions stem from a desperate need to protect a beloved family member, complicating the morality of their choice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: December 1935
In December 1935, the rural landscape of England is cloaked in the chill of winter, with overcast skies and frequent rainfall reflecting the somber mood of a nation grappling with the aftermath of the Great Depression. The short days lead to early darkness, forcing families indoors where the warmth of the hearth contrasts sharply with the economic struggles outside. As Christmas approaches, the festivities of the holiday season are overshadowed by a sense of tension; social gatherings are tinged with anxiety as the privileged navigate their declining fortunes while trying to maintain appearances. Traditional values and class divisions remain deeply entrenched, and the looming threat of fascism in Europe adds an unsettling layer to the already fraught atmosphere. In this time of uncertainty, communities come together for charity and support, yet whispers of financial ruin and betrayal echo through the halls of the manor, where secrets linger like shadows in the flickering candlelight.
Emotional register: A collective sense of foreboding and anxiety looms over society as individuals strive to maintain their status in an increasingly unstable world.
Physical constraints: short daylight hours leading to limited outdoor activity | intermittent rain making travel treacherous | reliance on domestic telephones for communication | the need to navigate social events carefully due to class expectations
Current tensions (weave into background texture): rising unemployment due to the Great Depression | growing fascist movements across Europe | social unrest and increasing class tensions
Wartime context — Many men are struggling with the psychological effects of their wartime experiences, having returned to a society that still honors their service but often forgets their sacrifices.: The war has left a lasting impact on families, creating a divide between those who served and those who have only heard tales of valor. Absence effect: The absence of those still serving or lost in battle creates a sense of longing and unresolved grief within communities.

## Season Lock (mandatory — derived from December 1935)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world where social status and financial desperation collide, the struggle for survival reveals the darker sides of ambition and the lengths individuals will go to protect their secrets.

## Story Emotional Register
Dominant: The story unfolds with a mix of suspense and underlying anxiety, culminating in a revelation that forces characters to confront their deepest fears.

Arc:
The story begins on a stormy evening at Holloway Manor, where tension is palpable among the guests gathered for a holiday celebration. As Eleanor Voss's lifeless body is discovered in the library, the atmosphere shifts from festive anticipation to dread, setting the stage for a gripping mystery. Detective Beatrice Quill steps into the fray, determined to uncover the truth behind the murder while navigating the complex relationships and hidden motives of the guests. The rising tension escalates as secrets are revealed, and suspicions mount against Captain Ivor Hale and Dr. Mallory Finch, each with their own reasons to want Eleanor silenced.

The first turn occurs when the clock's tampering is uncovered, leading Beatrice to question the reliability of the timeline and the alibis presented. Midway through, the investigation takes on a darker tone as it becomes clear that the stakes are higher than anyone anticipated, with emotions running high and truths threatening to surface. In the second turn, Beatrice confronts the emotional weight of her findings, realizing that the murder is intertwined with the characters' struggles for power and recognition. The climax arrives as the evidence points decisively towards Hale, forcing the characters to confront their actions and the consequences of their ambition. In the resolution, the truth is revealed, but not without leaving scars on those involved, highlighting the moral complexities and emotional turmoil that linger long after the final curtain has fallen.

## Emotional register at this point in the story
The atmosphere is festive yet tense, with unspoken anxieties simmering beneath the surface.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension between social grace and financial desperation, navigating a society where appearances are paramount. Her charm masks her fear of exposure in a world that values wealth above all else, making her a reflection of the pressures faced by the privileged during this tumultuous time.
Era intersection: Eleanor's fear of losing her social standing due to her financial troubles is amplified by the societal expectations of the 1930s, where reputation is everything.

### Captain Ivor Hale
Captain Ivor Hale's character is steeped in the complexities of post-war trauma, battling his PTSD while trying to reclaim his honor within a society that once celebrated him. His struggle with guilt and fear of exposure illustrates the emotional toll of war on individuals trying to reintegrate into everyday life.
Era intersection: Hale's haunted past and the threat of exposure tie into the societal pressures of the 1930s, where maintaining one's reputation is critical in a shifting world.

### Beatrice Quill
Beatrice Quill's ambition clashes with her personal loyalties, highlighting the complexities of navigating class distinctions during the Great Depression. Her role as a secretary positions her within the power dynamics of the manor, reflecting the struggles of those trying to rise above their social standing.
Era intersection: Beatrice's balancing act between ambition and personal relationships captures the essence of a society in flux, where traditional hierarchies are being challenged.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an airy elegance, often punctuating her sentences with subtle sarcasm that reveals her sharp wit.
[comfortable] Oh, darling, how lovely to see you! Did you enjoy the last soirée? It was quite the affair, wasn't it?
[evasive] Well, you know how it is in high society; one must always keep up appearances, regardless of the truth.
[stressed] I simply cannot afford any more setbacks; it would ruin everything I've worked so hard to maintain!
Humour: Eleanor's polite savagery often surfaces in her interactions, showcasing her ability to navigate social conversations with wit.

### Captain Ivor Hale (he/him/his)
Hale's speech reflects his military background, often punctuated with self-deprecating humor that masks deeper turmoil.
[comfortable] Ah, the glories of war! It's all fun and games until you find yourself wondering where it all went wrong.
[evasive] I wouldn't say I'm haunted; just... reminiscing about the past, you know?
[stressed] If anyone finds out about my past, it'll be the end for me—I'd rather face the battlefield again!
Humour: Hale's self-deprecating humor serves as a shield against the judgment of others.

### Beatrice Quill (she/her/her)
Beatrice's casual, friendly tone is often laced with sardonic humor, revealing her sharp tongue.
[comfortable] Honestly, if we could just turn this place into a cozy café, I think we'd have far fewer problems!
[evasive] Oh, I don't know what you're talking about; I'm just here to help, nothing more.
[stressed] Every time I think I'm making progress, she has to come along and ruin it all!
Humour: Beatrice's sharp wit allows her to navigate the complexities of her workplace with a lighthearted touch.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room, once a lively gathering space, now feels heavy with secrets and unspoken tensions, where the air is thick with foreboding.. Camera angle: As a writer enters this space, the atmosphere should evoke a sense of impending doom, where every shadow seems to harbor a secret.. Era: The opulence of the 1930s contrasts sharply with the underlying anxiety of the Great Depression.

The Library: The library, with its towering shelves of books, offers a sanctuary of knowledge amidst the growing tensions of the manor, yet it too feels burdened by the weight of hidden truths.. Camera angle: Entering the library should evoke a sense of discovery, where the search for truth is fraught with peril.. Era: The quietude of the 1930s is interrupted by the ticking clock, a constant reminder of time running out.

The Servants' Hall: The servants' hall buzzes with camaraderie, a stark contrast to the tension in the main house, where the staff seeks solace in shared meals and laughter.. Camera angle: As a writer approaches this vibrant space, it should feel like a refuge from the overarching drama of the manor.. Era: The practical nature of the 1930s economy is reflected in the simplicity of the hall's furnishings.

The Overgrown Garden: The overgrown garden feels like a wild maze of secrets, where beauty clashes with neglect, evoking a sense of both wonder and foreboding.. Camera angle: Writing about the garden should invoke a sense of exploration, where every corner hides a potential revelation.. Era: The garden's wildness mirrors the chaotic social landscape of the 1930s.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: The festive atmosphere allows for light-hearted banter among the guests.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time shown on the clock.
- Hidden truth to progressively expose: The clock was deliberately reset to mislead witnesses and investigators.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows the time as nine-thirty. | corr: The clock was stopped and tampered with to mislead. | effect: Eliminates the reliability of the clock as a time source.
  - Step 2: obs: Witnesses report seeing Captain Hale in the garden at nine-forty-five. | corr: The timeline shows he could not have been in the library at the time of death. | effect: Narrows the timeline of opportunity to Dr. Mallory Finch.
  - Step 3: obs: The clock's time conflicts with the witness statements. | corr: The tampering of the clock indicates premeditated deceit. | effect: Narrows suspects to Captain Hale and Dr. Finch.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, account, and library against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4, clue_fp_contradiction_step_3_2
- Fair-play rationale: Step 1: The tampered clock evidence (early) and the witness's conflicting testimony (mid) lead the reader to question the clock's reliability. Step 2: The witness accounts and Eleanor's diary clarify the timeline of events, eliminating Hale's alibi. Step 3: The clock's discrepancies become the focus during the trap test, conclusively proving Hale's guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with an airy elegance, often punctuating her sentences with a subtle sarcasm that reveals her sharp wit
She has a tendency to overemphasize her charm, using flowery language that can turn pointed when discussing her rivals.
Eleanor grapples with the fear of losing her social stature and the façade she has built around her life, knowing that the truth could unravel everything.

### Captain Ivor Hale
Hale speaks with a gravitas that reflects his military background, often punctuating his sentences with self-deprecating humor
He has a tendency to ramble when discussing his past, revealing his inner turmoil and regrets.
Hale is plagued by guilt over his past actions and the fear of being exposed, struggling to reconcile his former heroism with the man he has become.

### Beatrice Quill
Beatrice speaks with a casual, friendly tone, often laced with sardonic humor
She has a tendency to drop playful jabs at her colleagues, revealing her sharp tongue and quick wit.
Beatrice experiences a tug-of-war between her ambition and her feelings for the victim's ex-partner, leading to a crisis of loyalty.



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

Primary Location: Holloway Manor (Little Middleton, England)
Holloway Manor stands as a grand relic of a more prosperous time, its opulent halls now steeped in tension and whispers of discontent.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- The Servants' Hall (interior): Gathering space
- The Overgrown Garden (exterior): Clue discovery and exploration

Atmosphere: Tense and foreboding, heightened by recent economic struggles and political unrest.
Weather: Overcast with intermittent rain, typical for a rural estate in the fall.

Era markers: Domestic telephones in the drawing room and study, ringing with urgent messages. | A vintage typewriter in the library, its keys clicking away as letters are composed. | A radio receiver in the corner of the drawing room, broadcasting news of the outside world.

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
  - Visual: The drawing room is dominated by a large bay window, its glass streaked with rain, offering a view of the overgrown gardens beyond., Richly patterned wallpaper, tarnished with age, frames the room, while the flickering light from the fireplace casts dancing shadows on the walls.
  - Sounds: The rain taps rhythmically against the window, a soft, persistent reminder of the storm outside., Occasional creaks from the floorboards echo through the room, as if the manor itself is sighing under the weight of its secrets.
  - Scents: The musty scent of damp fabric mingles with the faint aroma of polished wood, remnants of a once-inviting atmosphere now steeped in unease., A hint of burnt tobacco lingers in the air, a ghostly reminder of the heated discussions that have taken place within these walls.
  - Touch: The plush carpet feels thick and warm underfoot, contrasting with the chill in the air from the open window., The smooth surface of the chess pieces is cool to the touch, their glossy finish reflecting the dim light of the room.

The Library (interior):
  - Visual: Dust motes float lazily in the air, illuminated by the soft glow of a brass lamp perched on the table., The rich mahogany shelves, lined with an array of leather-bound books, create an imposing backdrop that speaks to the wealth of knowledge contained within.
  - Sounds: The soft rustle of pages turning is almost reverent, a sound that echoes in the vastness of the room., The occasional drip of water from a leaky pipe above adds a rhythmic, albeit unwelcome, soundtrack to the otherwise serene atmosphere.
  - Scents: The musty scent of old paper and leather fills the air, a comforting aroma that speaks of stories long forgotten., A faint whiff of tobacco lingers, hinting at the late-night reading sessions that have taken place in this sanctuary.
  - Touch: The smooth surface of the oak table feels cool to the touch, its grain rich and inviting, while scattered papers crinkle under gentle fingers., The leather bindings of the book
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In December 1935, the rural landscape of England is cloaked in the chill of winter, with overcast skies and frequent rainfall reflecting the somber mood of a nation grappling with the aftermath of the Great Depression
- The short days lead to early darkness, forcing families indoors where the warmth of the hearth contrasts sharply with the economic struggles outside
- As Christmas approaches, the festivities of the holiday season are overshadowed by a sense of tension; social gatherings are tinged with anxiety as the privileged navigate their declining fortunes while trying to maintain appearances
- Traditional values and class divisions remain deeply entrenched, and the looming threat of fascism in Europe adds an unsettling layer to the already fraught atmosphere
- In this time of uncertainty, communities come together for charity and support, yet whispers of financial ruin and betrayal echo through the halls of the manor, where secrets linger like shadows in the flickering candlelight.

TEMPORAL CONTEXT:

This story takes place in December 1935 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short days with early dusk; daylight fades around 4 PM.
- Seasonal activities: decorating the Christmas tree, attending local church services, holiday gatherings with family
- Seasonal occasions: Christmas
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool suit, double-breasted overcoat, cravat or silk tie
- Men casual: corduroy trousers, herringbone patterned jacket, knitted sweater
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: elegant evening gown with a cinched waist, fur coat, beaded clutch purse
- Women casual: tea-length dress, cardigan with a shawl collar, high-waisted skirt
- Women accessories: cloche hat, string of pearls, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman, Duke Ellington, Ella Fitzgerald; Films: The 39 Steps, Mutiny on the Bounty; Theatre: Porgy and Bess, The Front Page; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Pound of butter: one shilling, Movie ticket: six pence
- Current events: growing tensions in Europe with the rise of fascism; increased unemployment rates as the Great Depression continues
- Literature: Brave New World by Aldous Huxley | Murder in the Cathedral by T.S. Eliot | The Maltese Falcon by Dashiell Hammett | [mystery] | [social realism] | [science fiction]
- Technology: the television prototype | the electric refrigerator | the automatic washing machine | domestic telephones | typewriters | radio receivers
- Daily life: family gatherings during the holiday season, visiting local markets, attending church services
- Social rituals: Christmas dinners with extended family, charity drives for the less fortunate, New Year's Eve celebrations

Atmospheric Details:
The air is thick with the scent of damp earth and wood smoke, a hallmark of the chilly December nights. The sound of rain pattering against the window panes creates a tense backdrop as shadows loom in the flickering candlelight. The manor's grand halls, adorned with holly and mistletoe, echo with hushed whispers and unease, hinting at secrets waiting to be uncovered.

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
2. Fashion descriptions: Every character gets fashion description on first appearance
3. Cultural touchstones: Reference
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time displayed on a guest's watch, conflicting with the clock: "twenty minutes past eleven"
  - The approximate time of death based on the coroner's estimation: "a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The clock was stopped and tampered with to mislead.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Contradicts the assumption that the clock's time is accurate.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time displayed on a guest's watch, conflicting with the clock: "twenty minutes past eleven"
  • The approximate time of death based on the coroner's estimation: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The library, once a sanctuary of knowledge, had transformed into a stage for tragedy. Beatrice glanced around, taking in the scattered books and the disarray that seemed to mirror the chaos of their lives. The air was thick with the scent of damp earth and the..."
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
library, garden

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning after the murder dawned cold and gray, the overcast sky casting a pall over the library of the Hale residence.

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
Known location profile anchors: Holloway Manor, The Drawing Room, The Library, The Servants' Hall, The Overgrown Garden, the library of the Hale residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Holloway Manor", "The Drawing Room", "The Library", "The Servants' Hall", "The Overgrown Garden", "the library of the Hale residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the library of the Hale residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 91/100):
  Quality gaps noted: word density below preferred target (803/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6417; context=9472; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic telephones in homes | typewriters | radio receivers | telephone communications | telegrams | airmail.
9. Respect setting movement/access constraints in scene action and alibis: geography restricts movement to main halls and gardens | architecture creates access limitations to private areas | weather can affect outdoor investigation opportunities | restricted access to private areas for unauthorized personnel | daily routines dictate movement patterns.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin and political unrest draws a disparate group to the manor for a tense gathering, where secrets and class tensions simmer beneath the surface.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Fair-play repair requirement: Add a clue that directly ties the tampering of the clock to Captain Hale before the test.
13. Fair-play repair requirement: Reveal all critical information about the clock's tampering to the reader before the detective's deductions.
14. Fair-play repair requirement: Add necessary clues that clarify the timeline discrepancies caused by the clock's tampering.
15. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same murder method and timing assumption)
16. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time against a reliable source, Draw conclusion about Hale's guilt
Test type: timing test

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Her medical report time shows she was attending to Eleanor.
- Eleanor Voss (Act 3, Scene 5): Eleanor is the victim.

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of the tampered clock.

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
  - Location anchor: the library of the Hale residence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The library, once a sanctuary of knowledge, had transformed into a stage for tragedy. Beatrice glanced around, taking in the scattered books and the disarray that seemed to mirror the chaos of their lives. The air was th...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock was stopped and tampered with to mislead. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contradicts the assumption that the clock's time is accurate.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The room is bathed in a grey light, shadows deepening in the corners, creating an air of mystery., Bookshelves loom like sentinels, their contents obscured in the dimness. | The quiet rustling of pages turning fills the silence, as if the books themselves are whispering secrets., The faint ticking of a clock in the corner reminds all of the passage of time. | The rich aroma of aged leather and paper fills the air, a comforting yet haunting reminder of the knowledge contained within.. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time displayed on a guest's watch, conflicting with the clock, write exactly: "twenty minutes past eleven".
  - If this batch mentions The approximate time of death based on the coroner's estimation, write exactly: "a quarter past eleven".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: The clock stopped just before Eleanor's body was found.
- Established timeline fact: Witnesses claim to have seen Captain Hale in the garden.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past eleven" (The time displayed on a guest's watch, conflicting with the clock).
- If referenced, use exact time phrase: "a quarter past eleven" (The approximate time of death based on the coroner's estimation).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder dawned cold and gray, the overcast sky casting a pall over the library of the Hale residence. Raindrops trickled down the windowpanes, creating a rhythmic pattern that added to the library's ambiance. Inside, the dim light struggled to penetrate the cloud cover, casting the room in a soft, muted glow. Beatrice Quill stood at the threshold, her heart racing as she took in the scene before her. Eleanor Voss lay sprawled on the floor, her elegant dress now a stark contrast to the dark wood beneath her. The air felt heavy with unspoken dread, as if the very walls were holding their breath, waiting for the truth to emerge from the shadows.

Beatrice stepped forward, her gaze drawn to the stopped clock on the mantelpiece. It showed the time as "ten minutes past eleven," a detail that seemed ominous in the wake of Eleanor's lifeless form. The mechanism relied on the clock's tampering to mislead the timeline of events. There was something unsettling about the way the hands were frozen in time, as if they were deliberately set to mislead anyone who might question the circumstances of Eleanor's death. Beatrice's mind raced, piecing together the fragments of the morning's events as she observed the scene with a detective's keen eye.

As she knelt beside Eleanor, Beatrice noticed the faint scent of damp paper mingling with the mustiness of the room, a unique olfactory signature that spoke of neglected books and forgotten stories. The steady patter of rain against the roof created a soothing backdrop, lulling her into a contemplative state, but the sight before her was anything but peaceful. Eleanor's pale face was framed by dark hair, and her eyes, once so vibrant, now stared blankly into the void. Beatrice felt a pang of sorrow for the woman who had been so full of life just hours before.

the captain Hale stood nearby, his expression a mask of shock and disbelief. He clutched a handkerchief, his knuckles white against the fabric as he struggled to maintain his composure. "I can’t believe this has happened," he murmured, his voice trembling slightly. "Eleanor was... she was everything to me." Beatrice studied her closely, noting the way her eyes darted around the room, as if searching for answers in the shadows. There was a tension in the air, a palpable sense of suspicion that hung between them like a thick fog.

Beatrice rose to her feet, her resolve hardening. He needed to understand what had transpired in this room, to unravel the threads of deceit that seemed to weave through the very fabric of the Hale residence. "Captain Hale," he began, his tone steady but probing, "can you tell me what you were doing last night? Where were you when Eleanor... when this happened?" She hesitated, her gaze dropping to the floor as if the weight of her memories was too much to bear. The silence stretched between them, heavy with unspoken truths and the burden of grief.

"I was in the garden, tending to the roses," he finally replied, his voice barely above a whisper. "I thought I heard her call for me, but I... I didn’t want to intrude. I thought she needed some time alone." Beatrice raised an eyebrow, her instincts telling her that her alibi was shaky at best. The witnesses had seen her in the garden at nine-forty-five, but that left a window of opportunity that could not be ignored. What had she done in that time? And why had she not gone to her sooner?

As she continued to question her, Beatrice felt the tension in the room rise. Eleanor's lifeless body was a stark reminder of the fragility of life, and the shadows of suspicion loomed large over Captain Hale. Beatrice's mind raced with possibilities, each more troubling than the last. The clock's tampering, the conflicting timelines, and the emotional turmoil of those left behind all pointed to a web of deceit that she would need to untangle. She could feel the weight of the investigation pressing down on her, but she was determined to uncover the truth, no matter the cost.

The library, once a sanctuary of knowledge, had transformed into a stage for tragedy. Beatrice glanced around, taking in the scattered books and the disarray that seemed to mirror the chaos of their lives. The air was thick with the scent of damp earth and the lingering aroma of polished wood, a reminder of the beauty that had once thrived in this space. Now, it felt like a tomb, holding secrets that begged to be uncovered. As she prepared to delve deeper into the mystery, Beatrice steeled herself for the challenges ahead. The truth was out there, waiting to be revealed, and she would not rest until it was brought to light.
--- END PRIOR CHAPTER 1 ---

# Case Overview
Title: The Clock Strikes Murder
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock tampering)
Culprit: Captain Ivor Hale
False assumption: The murder occurred at the time shown on the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Statements",
    "setting": {
      "location": "the library of the Hale residence",
      "timeOfDay": "Late morning",
      "atmosphere": "An air of disbelief and anxiety"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Gather initial witness statements and establish alibis",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Captain Hale insists on his innocence, while Eleanor's shaky testimony raises doubts.",
      "tension": "The clock's stopped time becomes a focal point of contention.",
      "microMomentBeats": [
        "Captain Hale's voice trembles as he recalls the events of the previous night."
      ]
    },
    "summary": "Beatrice Quill interviews Captain Hale and Eleanor Voss, collecting their statements about the night of the murder. The discrepancies in their accounts hint at deeper secrets as the clock's time becomes a point of contention.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The discovery of Eleanor's body shifts the mood from celebration to horror.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an airy elegance, often punctuating her sentences with subtle sarcasm that reveals her sharp wit."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "short daylight hours leading to limited outdoor activity; intermittent rain making travel treacherous; reliance on domestic telephones for communication; the need to navigate social events carefully due to class expectations; limited access to goods due to economic hardship",
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
□ Chapter 2: "The clock was stopped and tampered with to mislead." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
