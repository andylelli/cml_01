# Actual Prompt Record

- Run ID: `mystery-1778526913773`
- Project ID: ``
- Timestamp: `2026-05-11T19:21:19.876Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `af66751f14c9e253`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's actions stem from a desperate need to protect a loved one, blurring the lines of right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: October 1930
In October 1930, life in England is marked by the shadows of the Great Depression, with economic despair pressing down on even the wealthiest families. The air is thick with the scent of damp earth and the sound of rain, echoing the unease that permeates society. The overcast skies seem to reflect the collective anxiety, as shorter days lead to early darkness, fostering a sense of isolation. As Halloween approaches, the usual festivities feel overshadowed by the looming specter of poverty and the threat of political unrest. Families gather for formal dinners, yet beneath the surface, tensions simmer regarding class struggles and personal ambitions. The rigid class hierarchy is becoming increasingly strained, with the wealthy grappling with the reality of unemployment affecting their servants and social expectations weighing heavy on their shoulders. The whispers of fascism rising in Europe add to the atmosphere of uncertainty, as families cling to their status while grappling with their hidden secrets and desires for recognition. Time feels like it is slipping away, with each tick of the clock marking both the passing of time and the urgency of unspoken truths that threaten to unravel the fabric of their lives.
Emotional register: Society is gripped by anxiety and tension, as individuals grapple with their hidden ambitions and the very real fear of economic collapse.
Physical constraints: Shorter daylight hours leading to early darkness | Overcast weather affecting visibility and mood | Communication limited by the use of domestic telephones
Current tensions (weave into background texture): The onset of the Great Depression affecting the British economy | Political unrest in Europe with the rise of fascism | Debates in Parliament about unemployment and social welfare
Wartime context — Many veterans are struggling to find their place in a society that has changed drastically.: The camaraderie forged in wartime is now tested by economic hardship and societal expectations. Absence effect: The absence of loved ones who served creates an emotional void, amplifying feelings of loss and resentment.

## Season Lock (mandatory — derived from October 1930)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The story explores how hidden familial tensions and personal ambitions can lead to tragic outcomes, revealing the darker sides of human nature when faced with loss and betrayal.

## Story Emotional Register
Dominant: The story unfolds with a palpable tension that crescendos into emotional turmoil.

Arc:
The narrative opens with Eleanor Voss preparing for a family reunion at Little Middleton Manor, where the air is thick with unspoken tensions and familial expectations. As the guests arrive, the atmosphere is deceptively cheerful, cloaked in the laughter of a bygone era. However, beneath the surface, Eleanor grapples with her fears of losing her family legacy, a sentiment that resonates with the backdrop of societal instability due to the Great Depression. The emotional journey intensifies when Eleanor is found murdered, and the clock in the manor becomes a symbol of manipulated time. Each character's internal struggles are laid bare as they navigate their conflicting motives, leading to a series of investigations that raise the stakes further. Captain Hale's resentment over his family's favoritism and Dr.

Finch's secret romance come to light, adding layers of complexity to the narrative. The first turn occurs as suspicions mount, and the clock's tampering reveals a deeper conspiracy, heightening the tension among the characters. As the investigation reaches its mid-point, the emotional stakes escalate, forcing each character to confront their pasts and the choices they’ve made. The second turn brings a confrontation that exposes the interplay of ambition and betrayal, culminating in a dramatic climax where the truth about Eleanor's murder is revealed through the clock's manipulation. Finally, the resolution sees the surviving characters grappling with the aftermath of the tragedy, forever changed by the events that unfolded. The emotional register shifts from tension and uncertainty to a bittersweet acceptance of the consequences of their actions, leaving the reader with a lingering sense of loss and reflection on human nature.

## Emotional register at this point in the story
The arrival of guests heightens the sense of impending conflict.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of maintaining family honor amidst societal pressures. Her commitment to her estate reflects the weight of her family's expectations, which clash with her desire for independence. In this time of economic tumult, her fears about losing her ancestral home grow more pronounced, intertwining with the ever-present tension of her family's legacy.
Era intersection: Eleanor's internal conflict mirrors the societal pressures of the 1930s, as she grapples with the expectations of her family while navigating the uncertainties of a post-war world.

### Dr. Mallory Finch
Dr. Mallory Finch represents the precarious balance of ambition and morality. Their progressive views and compassionate care are overshadowed by the fear of scandal and the potential fallout from their secret relationship. As economic instability looms, the stakes of their personal desires grow more urgent, forcing them to confront the consequences of their actions.
Era intersection: Finch's secret romance reflects the changing social norms of the 1930s, revealing the complexities of love and ambition amidst a backdrop of economic hardship.

### Beatrice Quill
Beatrice Quill embodies ambition and deception, using charm to secure her place within the elite. Her desire to marry into the Voss family drives her actions, yet the murder casts a shadow over her aspirations. As she maneuvers through social dynamics, her character reveals the lengths to which individuals will go to achieve their goals in a time of uncertainty.
Era intersection: Beatrice's social climbing reflects the evolving roles of women in the 1930s, as they navigate ambition and societal expectations amid growing class tensions.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured tone, often infused with dry wit and literary references.
[comfortable] Ah, the library—a sanctuary where the past whispers its secrets among the pages.
[evasive] I believe the truth often lies in the shadows, don't you think?
[stressed] This estate is not just bricks and mortar; it is our legacy, our very identity!
Humour: Eleanor's dry wit adds depth to her character, revealing her intelligence and complexity.

### Dr. Mallory Finch (they/them/their)
Dr. Finch speaks calmly, often using medical metaphors that reflect their thoughtful nature.
[comfortable] Life, much like medicine, requires careful diagnosis and treatment.
[evasive] Well, one’s past is sometimes best left unexamined, wouldn’t you agree?
[stressed] The stakes here are higher than any surgery I've ever performed!
Humour: Dr. Finch's observational humor often highlights the absurdities of their situation.

### Beatrice Quill (she/her/her)
Beatrice speaks with airy confidence, often masking her sharp wit with compliments.
[comfortable] Isn’t it delightful how the garden flourishes, much like our social prospects?
[evasive] Oh, darling, who wouldn’t want to be seen at the Voss estate?
[stressed] This chaos could ruin everything I've worked for—how utterly dreadful!
Humour: Beatrice's polite savagery reflects her ambition and the complexities of her character.

## Location Registers (scene framing guides)

The Library: The library feels ominous, a space where knowledge intertwines with secrets. Dust motes dance in the muted light, and the atmosphere is thick with tension as whispers of the past cling to the air. It is here that the interplay of history and tragedy unfolds, and the weight of unspoken truths hangs heavily in the silence.. Camera angle: A writer entering this space should capture the sense of foreboding, as if the very walls are witnesses to the dark events that have transpired.. Era: The library, filled with the scent of aged books, reflects the somber mood of the 1930s, a time when the past looms large.

## Humour guidance for this story position (early)
Permission: conditional — condition: Eleanor may inject dry humour as she observes the unfolding chaos.
Rationale: A moment of levity can provide contrast to the investigation's seriousness.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the clock's tampering retroactively colors earlier scenes, particularly the moment when Eleanor was last seen alive in the library, suggesting her fate was sealed much later than initially believed". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the tension during the dinner party takes on new meaning, as the characters’ interactions are now seen through the lens of their hidden motives". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's nervous demeanor during the investigation can also be understood as a reflection of his fear of exposure rather than mere anxiety". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred while the clock displayed the wrong time.
- Hidden truth to progressively expose: The actual time of death was much later due to tampering.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven at the time of Eleanor's discovery. | corr: This suggests the clock was tampered with before the murder. | effect: Narrows timeline of murder attempt, indicating foul play.
  - Step 2: obs: Witnesses recall Eleanor was last seen in the library at nine PM. | corr: If the clock was tampered, she could have been alive much later. | effect: Eliminates the assumption that she was killed before nine PM.
  - Step 3: obs: The mechanical workings of the clock exhibit signs of recent tampering. | corr: This indicates intentional manipulation of the time. | effect: Narrows suspicion to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled confrontation is set where Captain Hale must explain the discrepancies between the clock's time and the actual timeline of Eleanor's presence in the library.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The stopped clock and witness statements reveal the tampering. Step 2: The last seen testimony contradicts the initial timeline. Step 3: The mechanical evidence leads to the confrontation with Hale.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks in measured tones, often employing a hint of irony in her observations
She has a penchant for employing literary references, which she delivers with a knowing smile.
Eleanor's internal battle revolves around her desire for autonomy against the backdrop of her family's expectations. Guilt and resentment intertwine as she grapples with the notion of her own happiness versus duty.

### Dr. Mallory Finch
Finch speaks with a calm, measured cadence, often punctuating their observations with a dry, self-aware humor
They have a tendency to use medical metaphors, which can sometimes confuse their listeners.
Dr. Finch struggles with the fear of exposure and the potential fallout from their secret relationship. The weight of their feelings for Eleanor's daughter clashes with their professional integrity.

### Beatrice Quill
Beatrice speaks with an airy confidence, often using flowery language that belies her sharp wit
She has a tendency to drop veiled insults cloaked in compliments, leaving her listeners both charmed and wary.
Beatrice battles with the cost of her ambition; the fear of being exposed for her manipulations looms large, threatening to unravel her carefully constructed image.



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
Little Middleton Manor stands as a grand testament to the opulence of a bygone era, set within sprawling gardens and shadowy woodlands, holding secrets within its walls.

Key Locations Available:
- The Library (interior): Crime scene
- The Study (interior): Clue discovery
- The Servants' Hall (interior): Gathering space

Atmosphere: Tense and foreboding, reflecting underlying social tensions and personal secrets.
Weather: Overcast with occasional rain, typical of the English countryside in the fall.

Era markers: Petrol touring cars parked in front of the manor, their chrome glinting dully in the grey light. | A domestic telephone with a party line ringing occasionally, its sound echoing through the halls. | Typewriters clicking away in the study, the rhythmic tapping underscoring the urgency of the unfolding drama.

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
  - Visual: Dust motes dance in the muted light filtering through tall windows, casting a soft glow over the rich mahogany surfaces., The worn carpet, patterned with intricate designs, muffles footsteps, adding to the room's aura of secrecy.
  - Sounds: The soft rustling of pages turning echoes in the stillness, accompanied by the faint crackle of the fireplace that hints at warmth long extinguished., Outside, the distant sound of rain tapping against the window creates a rhythmic backdrop, heightening the tension in the air.
  - Scents: The musty aroma of old books hangs heavily in the air, mingling with the faint scent of polished wood and leather., A hint of dampness creeps in from the outside, a reminder of the rain-soaked world beyond the sanctuary of the library.
  - Touch: The surface of the table is cool and smooth under the fingertips, its polished finish reflecting the dim light of the room., The upholstery of the armchairs, rich and velvety, feels inviting yet ominous, as if they hold the weight of countless secrets whispered in the shadows.

The Study (interior):
  - Visual: The dim light from a single desk lamp casts a warm glow over the cluttered desk, illuminating the dust motes that dance in the air., Heavy drapes frame the window, their rich fabric a stark contrast to the stark white of the paper scattered across the desk.
  - Sounds: The rhythmic clacking of the typewriter punctuates the stillness, each keystroke a reminder of the urgency that hangs in the air., Occasional creaks from the old floorboards add to the atmosphere, as if the room itself is alive and aware of the secrets it holds.
  - Scents: The sharp scent of ink and paper fills the air, mingling with the rich aroma of whiskey that lingers in the space., A faint whiff of leather from the bound books on the shelves adds a layer of sophistication to the otherwise tense atmosphere.
  - Touch: The surface of the desk is cool and slightly sticky from spilled drinks, a reminder of late nights spent in contemp
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1930, life in England is marked by the shadows of the Great Depression, with economic despair pressing down on even the wealthiest families
- The air is thick with the scent of damp earth and the sound of rain, echoing the unease that permeates society
- The overcast skies seem to reflect the collective anxiety, as shorter days lead to early darkness, fostering a sense of isolation
- As Halloween approaches, the usual festivities feel overshadowed by the looming specter of poverty and the threat of political unrest
- Families gather for formal dinners, yet beneath the surface, tensions simmer regarding class struggles and personal ambitions

TEMPORAL CONTEXT:

This story takes place in October 1930 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, cool breezes
- Daylight: Shorter days with twilight beginning around five o'clock in the evening, leaving the countryside shrouded in early darkness.
- Seasonal activities: harvesting crops, apple picking, preparing for winter festivities
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with waistcoat, tweed jacket, dress shirt with a stiff collar
- Men casual: corduroy trousers, knit pullover, flannel shirt
- Men accessories: pocket watch, felt hat, leather gloves
- Women formal: tea-length dress with a fitted bodice, silk blouse with a dropped waist, tailored coat
- Women casual: tweed skirt with a matching cardigan, cotton blouse, sensible ankle boots
- Women accessories: cloche hat, string of pearls, handbag with beaded details

Cultural Context (reference naturally):
- Music/entertainment: 'Puttin' on the Ritz' by Irving Berlin, Louis Armstrong's hot jazz, the popular tunes of the Savoy Orpheans; Films: 'The Love Parade' featuring Maurice Chevalier, the silent film 'The Last of Mrs. Cheyney'; Theatre: 'The Front Page' by Ben Hecht, musicals gaining popularity in West End; Radio: BBC Radio's variety shows, news broadcasts covering political events
- Typical prices: Loaf of bread: four pence, Bottle of milk: two pence, Movie ticket: one shilling
- Current events: The onset of the Great Depression affecting the British economy; Political unrest in Europe with the rise of fascism
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [detective fiction] | [social realism] | [modernist literature]
- Technology: motion pictures with sound | the motor car becoming commonplace | advancements in radio technology | domestic telephones with party lines | typewriters for offices | manual cameras for photography
- Daily life: going to the cinema, attending local fairs and markets, participating in community harvest festivals
- Social rituals: afternoon tea with neighbors, formal dinners to showcase family status, community gatherings for harvest celebrations

Atmospheric Details:
The crisp air carries the scent of damp earth and falling leaves, tinged with the faint aroma of wood smoke from chimneys. A persistent drizzle mists the landscape, blurring the edges of the sprawling estate's manicured gardens, casting an ominous mood. The distant sound of thunder rumbles, mirroring the underlying tensions within the household as secrets linger in the shadows.

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
- Social commentary: Characters discuss current ev
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time witnessed by others before the clock was found: "a quarter past eleven"
  - The actual time of the murder when cross-referenced with other evidence: "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] Witnesses recall Eleanor was last seen in the library at nine PM.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: Establishes Eleanor's last known location.

• [clue_2] If the clock was tampered, she could have been alive much later.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Suggests Eleanor's potential survival beyond the displayed time.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time witnessed by others before the clock was found: "a quarter past eleven"
  • The actual time of the murder when cross-referenced with other evidence: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they moved to leave the library, Eleanor couldn't shake the feeling that they were stepping into a web of deceit. The walls of Little Middleton Manor seemed to close in around her, the shadows lurking in the corners whispering secrets that had long been bur..."
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
library, study, garden, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light struggled to penetrate the overcast skies, casting a dim glow over the library of the Hale residence.
Chapter 2: Chapter 2: Contradictions
  Events: The overcast morning continued to cast a pall over Little Middleton Manor, the rain pattering softly against the tall windows of the library.

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
Known location profile anchors: Little Middleton Manor, The Library, The Study, The Servants' Hall, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Study", "The Servants' Hall", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the dining room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 85/100):
  Quality gaps noted: word density below preferred target (674/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7840; context=9590; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | domestic telephones with party lines | typewriters in offices | telegrams sent from local offices | aerial mail services for urgent deliveries | telephone communication increasingly common.
9. Respect setting movement/access constraints in scene action and alibis: large grounds create natural barriers | manor architecture provides restricted access areas | weather conditions can impede outdoor movement | restricted areas such as the study and cellar | daily schedules dictate access to certain rooms.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a family reunion amidst the Great Depression forces the socially elite and their servants to confront hidden tensions and personal secrets under the watchful eye of a mechanical clock that may hold the key to a looming tragedy.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same premeditated murder and locked room scenario).
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.85 with 'The Mysterious Affair at Styles' (similar false assumption regarding timing of the murder).
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure and dynamics).
15. RETRY MITIGATION: Refresh texture usage. Rephrase observations with different lexical framing while preserving all clue obligations and chronology.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): His alibi is confirmed as he was attending to a patient at the time of the murder.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): Her whereabouts were confirmed by multiple witnesses during the time of death.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_2 must appear in Act 1, Scene 3 via Witness testimony

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
  - Location anchor: the dining room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they moved to leave the library, Eleanor couldn't shake the feeling that they were stepping into a web of deceit. The walls of Little Middleton Manor seemed to close in around her, the shadows lurking in the corners w...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses recall Eleanor was last seen in the library at nine PM. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Establishes Eleanor's last known location.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • If the clock was tampered, she could have been alive much later. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Suggests Eleanor's potential survival beyond the displayed time.
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
  - If this batch mentions The time witnessed by others before the clock was found, write exactly: "a quarter past eleven".
  - If this batch mentions The actual time of the murder when cross-referenced with other evidence, write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: clock time
- Established timeline fact: last seen times
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past eleven" (The time witnessed by others before the clock was found).
- If referenced, use exact time phrase: "twenty minutes past ten" (The actual time of the murder when cross-referenced with other evidence).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light struggled to penetrate the overcast skies, casting a dim glow over the library of the Hale residence. Rain streaked the tall windows, blurring the view of the gardens outside, where droplets clung to petals like pearls. Inside, the atmosphere was thick with tension, the air heavy with the scent of damp earth mingling with the musty aroma of old books. Eleanor Voss crossed the threshold, her heart racing as she took in the disarray that greeted her. The once-inviting space now felt foreboding, shadows lurking in the corners as if the very walls were witnesses to the secrets that lay hidden within them.

As Eleanor stepped further into the room, her gaze was drawn to the clock on the mantelpiece. Its hands were frozen at ten minutes past eleven, a stark contrast to the chaos surrounding her. She felt a chill run down her spine, the implications of that stillness weighing heavily on her mind. It was as if time itself had stopped in that moment, trapping the truth within its mechanical grasp. The clock's frozen state hinted at a disruption, a moment when life had irrevocably changed. What had transpired here? The question echoed in her thoughts as she moved deeper into the library.

the captain Hale stood by the fireplace, his face pale and drawn, a stark reflection of the turmoil that had unfolded. His eyes darted nervously, betraying the calm facade he attempted to project. "Eleanor, I—" she began, her voice trembling, but the words faltered on her lips. The tension in the room was palpable, each breath heavy with unspoken fears. Eleanor's heart raced as she approached her, her instincts urging her to uncover the truth behind her distress.

"What happened, Ivor?" she asked, her voice steady despite the chaos swirling around them. "You look as though you've seen a ghost." The irony of her words hung in the air, a cruel reminder of the reality they faced. She glanced around the room, searching for clues amidst the disarray, her mind racing with possibilities. The library, once a sanctuary of knowledge, now felt like a tomb, the silence deafening as they awaited the arrival of the detective.

Ivor swallowed hard, his gaze shifting to the floor. "It's Eleanor... she's... she's dead." The words hung in the air, heavy and suffocating. Eleanor felt her heart drop as she processed the shocking revelation. The very person they had gathered to celebrate was now lifeless, a victim of some unseen horror. The gravity of the situation settled over them like a shroud, and the clock's frozen hands seemed to mock their disbelief.

Eleanor's mind raced, trying to piece together the fragments of information. The last time she had seen Eleanor Voss, her cousin, had been just hours before, full of laughter and plans for the reunion. How could it have come to this? The clock's time echoed in her mind, a reminder that something was terribly amiss. If it was ten minutes past eleven now, what had happened in the moments leading up to this tragedy? Her thoughts swirled like the rain outside, each drop a reminder of the chaos that had invaded their lives.

As the reality of the situation set in, Eleanor felt a surge of determination. She would not allow her cousin's death to go unanswered. The household was in disarray, but she could sense the hidden tensions among them. Each character's demeanor hinted at secrets, unspoken truths that needed to be uncovered. She turned her attention back to Ivor, whose expression was a mixture of grief and guilt. "We need to find out what happened, Ivor. We can't let this go unsolved."

Ivor nodded, his eyes filled with a mix of fear and resolve. "You're right. We must gather everyone and piece together the events of the evening. There must be something—some clue that can help us understand what transpired. The clock shows ten minutes past eleven, but we need to know what happened before that time. We need to find the truth, for Eleanor's sake."
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradictions
The overcast morning continued to cast a pall over Little Middleton Manor, the rain pattering softly against the tall windows of the library. Inside, the atmosphere was thick with an uneasy stillness, shadows stretching across the floor as if they were reluctant to reveal the secrets held within the room. Eleanor Voss stood at the mantelpiece, her gaze fixed on the clock, its hands frozen at ten minutes past eleven. Ivor's words echoed in her mind, a haunting reminder of the urgency to uncover the truth. "We must gather everyone and piece together the events of the evening," she had said, and now that task lay heavily upon her shoulders. She felt the weight of expectation pressing down as she turned to face the others who had gathered in the library, their expressions a mixture of apprehension and curiosity. The clock's stillness seemed to mock them, a cruel reminder of the life that had been snuffed out so abruptly.

As she stepped further into the room, Eleanor's eyes flickered to the captain Hale, who stood nervously by the fireplace, his fingers fidgeting with the cuff of his sleeve. The tension in the air was palpable, and she couldn't help but notice how his gaze darted around the room, avoiding direct contact with anyone. "Ivor, we need to talk about what happened last night," she said, her voice steady despite the turmoil swirling within her. Before he could respond, the doctor Finch entered the library, their expression grave as they took in the scene. The silence was broken only by the distant ticking of the clock, each tick echoing like a heartbeat in the stillness. Eleanor felt a shiver run down her spine, the implications of that frozen time weighing heavily on her mind.

Dr. Finch approached Eleanor, their brow furrowed in concern. "Eleanor, we must get to the bottom of this. The last time I saw her, Eleanor was in the library, but I can't recall the exact time," they said, their voice calm yet tinged with urgency. Eleanor nodded, her mind racing as she recalled the last moments she had spent with her cousin. "What time did you see her, Dr. Finch?" she pressed, her heart pounding in her chest. Finch hesitated, their eyes flickering to Ivor before returning to Eleanor. "It must have been around nine o'clock, perhaps a bit later. I was in the study attending to some paperwork and lost track of time. But I distinctly remember her laughter echoing through the halls," they replied, their tone measured but lacking certainty.

Eleanor's gaze shifted to Beatrice Quill, who had been standing quietly in the corner, her arms crossed tightly over her chest. "Beatrice, you were with Eleanor earlier in the evening. What can you tell us about her last movements?" Eleanor asked, trying to draw her into the conversation. Beatrice straightened, a flicker of annoyance crossing her features. "I was in the garden, enjoying the fresh air. I saw Eleanor head back inside around half-past nine. She seemed cheerful enough, but I didn't follow her in," she said, her voice laced with a hint of defensiveness. Eleanor noted the slight tremor in Beatrice's hands, the way her gaze darted away as she spoke. It was clear that there was more to her story than she was willing to reveal.

As the three of them exchanged fragmented accounts, Eleanor felt the tension in the room mount. Each witness seemed to contradict the others, and the uncertainty of the timeline raised suspicions that gnawed at her insides. Ivor's nervous fidgeting, Finch's evasiveness, and Beatrice's defensiveness all pointed to a deeper truth lurking beneath the surface. The clock on the mantelpiece, frozen at ten minutes past eleven, suggested the clock was tampered with before the murder. This revelation sent a chill through Eleanor; it meant the time of death could not be accurately determined. If the clock had been manipulated, who had the motive to alter the time, and why? The implications were staggering, and she felt the urgency to act before the truth slipped further away.

Eleanor's mind raced as she pieced together the conflicting stories. If the clock had indeed been tampered with, it could mean that Eleanor was alive much later than initially believed. The last time she had been seen was around nine o'clock, but if the clock had been wound back forty minutes, that would place her death at twenty minutes past ten. The thought sent a shiver down her spine. Who could have had access to the clock? Ivor, Finch, and Beatrice were all present, but the question remained: who among them had the most to gain from Eleanor's demise? The tension in the room was thick enough to cut with a knife, and Eleanor could feel her heart racing as she contemplated the gravity of the situation.

Eleanor took a deep breath, trying to steady her nerves. "We need to clarify the timeline and see if anyone can corroborate these accounts. I suggest we gather everyone else and compare notes. There must be something that ties these stories together, something that could lead us to the truth," she said, her voice firm. Ivor nodded, her expression shifting from fear to a determination that mirrored her own. "You're right. We can't let this go unsolved. For Eleanor's sake, we must find out what truly happened," she replied, her resolve solidifying as she glanced at Finch and Beatrice. The three of them exchanged glances, a silent agreement forming among them as they prepared to confront the others.

As they moved to leave the library, Eleanor couldn't shake the feeling that they were stepping into a web of deceit. The walls of Little Middleton Manor seemed to close in around her, the shadows lurking in the corners whispering secrets that had long been buried. The clock's frozen hands were a constant reminder of the urgency to uncover the truth before it slipped away completely. With each step, she felt the weight of her family's legacy pressing down on her, a burden she was determined to bear. They would find the truth, no matter how deep they had to dig.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (premeditated)
Culprit: Captain Ivor Hale
False assumption: The murder must have occurred while the clock displayed the wrong time.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (they/them), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

⚠ PRONOUN REMINDER: Dr. Mallory Finch use they/them/their (singular). Never write she/her or he/him for these characters.

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "Alibis",
    "setting": {
      "location": "the dining room",
      "timeOfDay": "Midday",
      "atmosphere": "Heightened suspicion and tension"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Gather alibis and establish character relationships.",
    "cluesRevealed": [
      "clue_1",
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Alibis are tested against the timeline.",
      "tension": "The stakes rise as Eleanor realizes she cannot trust everyone.",
      "microMomentBeats": [
        "Beatrice's voice trembles as she recounts her whereabouts, revealing her fear."
      ]
    },
    "summary": "Eleanor questions the doctor Finch and Beatrice Quill about their whereabouts during the time of the murder. Their alibis appear solid, but Eleanor senses hidden truths beneath their words. The tension rises as the group grapples with the implications of the conflicting timelines.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The arrival of guests heightens the sense of impending conflict.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured tone, often infused with dry wit and literary references."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Shorter daylight hours leading to early darkness; Overcast weather affecting visibility and mood; Communication limited by the use of domestic telephones",
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
□ Chapter 3: "Witnesses recall Eleanor was last seen in the library at nine PM." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "If the clock was tampered, she could have been alive much later." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 3/4 — chapters 3 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 3 marked non-convergent after attempt 2/4: template

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 2/4
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: high n-gram overlap detected (0.74 >= 0.70). Rephrase this passage to avoid template leakage.
MITIGATION MODE: freshen_atoms
```
