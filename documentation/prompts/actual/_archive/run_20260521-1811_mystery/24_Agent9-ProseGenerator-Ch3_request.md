# Actual Prompt Record

- Run ID: `mystery-1779387078390`
- Project ID: ``
- Timestamp: `2026-05-21T18:19:07.186Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `0bc8b829e0b31feb`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desire for justice after a loved one's betrayal, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1931-04
In April 1931, the economic repercussions of the Great Depression are palpable, creating a landscape filled with uncertainty and social strain. Families are grappling with financial instability, and the specter of unemployment looms large. Men are expected to provide for their families, while women navigate the constraints of traditional roles, often feeling the pressure to maintain appearances amidst economic hardships. Social gatherings, like those at Little Middleton Manor, reflect both the opulence of the wealthy and the desperation of those struggling to keep up appearances. The air is filled with whispers of financial ruin, and the tension is thick as class divides become more pronounced, affecting relationships and social dynamics.
Emotional register: The collective emotional state is one of anxiety and tension as individuals struggle to navigate their changing realities.
Physical constraints: Limited access to transportation due to economic conditions. | Rationing affecting social gatherings and availability of resources. | Communication often reliant on outdated technology like typewriters and telegraphs.
Current tensions (weave into background texture): Rising unemployment rates affecting traditional family structures. | Social unrest due to economic disparities between classes. | Political instability as the Labour Party gains momentum.
Wartime context — Many young men are returning from service, adding to the unemployment crisis and straining family dynamics.: The presence of veterans creates a complex social dynamic where respect is often countered by the reality of their struggles. Absence effect: The absence of servicemen in stable roles contributes to the overall anxiety within families and communities.

## Story Theme
The story explores how desperation can drive individuals to betray their closest relationships in the pursuit of financial security and social status, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional landscape is charged with tension and urgency, reflective of the characters' desperate circumstances.

Arc:
The story opens in the grand drawing room of Little Middleton Manor, where the air is thick with tension following the discovery of Eleanor Voss’s body. The opulent setting belies the sinister undercurrents, as whispers of financial ruin and social expectations fill the space. As the investigation begins, Detective Beatrice Quill navigates a labyrinth of deceit, uncovering clues that lead her deeper into a web of ambition and betrayal. Early on, the mechanical clock becomes a focal point, its tampering creating a false timeline that heightens the stakes. The emotional cost of each revelation weighs heavily on the characters, revealing their hidden motives and fears.

A pivotal moment emerges when Beatrice discovers the faint scratch on the clock, redirecting her suspicions and intensifying the pressure on Dr. Mallory Finch. As the investigation escalates, tensions rise between the suspects, leading to a confrontation that unearths buried secrets. The climax reveals the true cost of ambition, as characters are forced to confront their choices and the damage caused by their actions. In the resolution, the emotional fallout is palpable; Eleanor’s legacy hangs in the balance, and the characters are left grappling with the consequences of their desperate decisions, forcing them to reckon with the fragility of their social standings.

## Emotional register at this point in the story
Initial clues create a sense of urgency as the investigation begins, heightening the stakes.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of 1931, where social expectations clash with personal desperation. As a socialite, she is caught between maintaining her public persona and the reality of her financial struggles, reflecting the plight of many women of her time who navigated societal pressures while facing economic instability. Her fear of losing her family's estate underscores the desperation that many felt during this era.
Era intersection: Eleanor's precarious financial situation illustrates the broader economic struggles faced by families during the Great Depression.

### Dr. Mallory Finch
Dr. Mallory Finch represents the professional women of the 1930s, navigating ambition within a male-dominated field while grappling with the fear of financial ruin. Her deep-seated resentment towards the victim highlights the competitive nature of the medical profession amid economic strain. She embodies the internal conflict experienced by women striving for recognition and stability during a turbulent time.
Era intersection: Dr. Finch's struggles with debt and ambition reflect the challenges faced by women trying to succeed professionally in a society marked by traditional gender roles.

### Beatrice Quill
Beatrice Quill epitomizes the unseen labor force that keeps households running smoothly. As a housekeeper, her diligent work often goes unrecognized, yet she holds vital knowledge that could shift the power dynamics within the household. Her internal conflict reflects the broader societal struggle of working-class individuals navigating their roles amidst rising class tensions.
Era intersection: Beatrice's awareness of the household's secrets highlights the often-overlooked perspectives of domestic workers during a time of economic hardship.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a melodic quality, often layered with subtle sarcasm, reflecting her polished social facade.
[comfortable] Oh darling, isn't it simply delightful to see everyone gathered here?
[evasive] Well, one never knows what goes on behind closed doors, do they?
[stressed] I simply cannot afford to disappoint my uncle or the entire charity could fall apart!
Humour: Eleanor employs polite savagery, using charm to mask her true feelings.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's tone is measured and precise, often laced with dry wit, revealing her frustration beneath a calm exterior.
[comfortable] It's a pleasure to work alongside such dedicated colleagues.
[evasive] I assure you, my time at the conference was quite productive, thank you.
[stressed] If only people took my concerns seriously, perhaps we wouldn't be in this predicament.
Humour: Her dry wit often surfaces when she feels cornered, providing a glimpse of her frustration.

### Beatrice Quill (she/her/her)
Beatrice's voice is straightforward and often blunt, reflecting her no-nonsense approach to her work.
[comfortable] Everything is in order, as usual.
[evasive] I wouldn't want to speak out of turn, but...
[stressed] Secrets have a way of surfacing, whether we like it or not.
Humour: Her dry humor can catch others off guard, adding depth to her character.

## Location Registers (scene framing guides)

Drawing Room: In the drawing room, the air is thick with unspoken tension and hidden agendas. The lavish decor contrasts sharply with the underlying anxieties of the guests, creating a sense of unease that permeates the space. Here, laughter feels forced, and every conversation is laced with a current of suspicion, as if the walls themselves are privy to the secrets being kept.. Camera angle: Entering this space, the writer should focus on the contrast between the grandiosity of the setting and the emotional turmoil of its occupants.. Era: The opulence of the drawing room is overshadowed by the economic realities of the 1930s.

Library: The library is a sanctuary of knowledge, yet it carries an air of suspense. Dust motes drift lazily in the shafts of light, but the ticking clock serves as a reminder that time is running out. The silence is heavy, filled with the weight of secrets and the potential for revelation, making each creak of the shelves feel amplified in this tranquil space.. Camera angle: This space invites the writer to delve into the quiet tension, emphasizing the contrast between the stillness of the books and the turmoil brewing outside.. Era: The presence of outdated technology in the library reflects the limitations of communication in the 1930s.

Garden: In the garden, nature's beauty is marred by decay and neglect. Overgrown hedges and a crumbling fountain symbolize the deterioration of social standings amidst economic strain. The rustling leaves and distant thunder create an atmosphere ripe with foreboding, as secrets lie hidden among the flowers, waiting to be unearthed.. Camera angle: As the writer approaches, the focus should be on the contrast between the garden's former beauty and its current disarray, mirroring the characters' lives.. Era: The garden's state reflects the economic hardships faced by families during the Great Depression.

Grand Staircase: The grand staircase serves as a symbol of status and privilege, yet it also echoes with the footsteps of those caught in a web of secrets. Each step taken feels heavy with the weight of history and unspoken words, transforming this transitional space into a threshold between past glories and present tensions.. Camera angle: The writer should emphasize the grandeur of the staircase while hinting at the emotional burdens carried by those who traverse it.. Era: The staircase's ornate design reflects the opulence of the 1930s while contrasting with the realities of a changing world.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The gravity of the investigation precludes any light-heartedness.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Beatrice discovers the scratch on the clock reveals Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's motive, reframing earlier interactions between them". Do not explain significance yet.
- Plant one subtle observable beat related to: "The tension during the second interview highlights the stakes as characters confront their fears". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred at the time indicated on the clock.
- Hidden truth to progressively expose: The clock was deliberately tampered with to create a false timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The mechanical clock in the study shows the hands stuck at ten minutes past eleven. | corr: This indicates tampering since it should have been wound down earlier. | effect: Narrows opportunity to Dr. Mallory Finch.
  - Step 2: obs: A faint scratch is found on the clock's casing. | corr: This scratch suggests recent tampering was done to alter the time. | effect: Eliminates Captain Ivor Hale as he had no access to the clock.
  - Step 3: obs: Witness statements report hearing the clock strike at 7:15 PM. | corr: This contradicts the clock's showing of 7:30 PM. | effect: Eliminates Dr. Mallory Finch, as he could not have been in the study at 7:30 PM if the clock was tampered.
- Discriminating test method: constraint_proof
- Discriminating test design constraint: Comparing witness accounts of the clock's striking time against the altered time reveals the inconsistency in Dr. Mallory Finch's alibi.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_6, clue_4
- Fair-play rationale: Step 1: The clock's stuck hands (early) and witness accounts (mid) allow the reader to deduce time tampering. Step 2: The scratch on the clock (mid) and alibi of Dr. Finch (late) eliminate him. Step 3: The contradicting witness statements during the test reveal his guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an almost musical lilt, her words carefully chosen to charm and disarm
She often uses subtle sarcasm to convey her true feelings, wrapping barbs in layers of sweetness, and her laughter is infectious, though it sometimes hides her inner turmoil.
Eleanor battles a profound fear of exposure; the thought of her financial ruin being laid bare is a constant source of anxiety. As she navigates the treacherous waters of high society, she grapples with the morality of her actions, torn between survival and honesty.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a measured cadence, her words often laced with clinical precision
She has a tendency to employ sarcasm to mask her frustration, delivering her observations with a wry smile that belies the tension beneath.
Dr. Finch wrestles with her ambition and the ethical implications of her actions. The thought of resorting to underhanded tactics to secure her position weighs heavily on her conscience, creating a conflict between her professional integrity and her desire for recognition.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks in a straightforward manner, often using short, clipped sentences
Her observations are delivered with a dry wit that can catch others off guard, yet her demeanor remains professional and reserved.
Beatrice wrestles with her desire to remain invisible while grappling with the weight of the secrets she carries. She feels the tug of loyalty to the household and the urge to assert her voice in a world that often overlooks her.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an almost musical lilt, her words carefully chosen to charm and disarm. She often uses subtle sarcasm to convey her true feelings, wrapping barbs in layers of sweetness, and her laughter is infectious, though it sometimes hides her inner turmoil.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, isn't it simply delightful to see everyone gathered here?"
  [evasive] "Well, one never knows what goes on behind closed doors, do they?"
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's desperation to secure her uncle's inheritance drives her actions. Without the victim's backing, her plans for the charity—and her financial future—are in jeopardy, leaving her willing to do anything to maintain her precarious position." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a measured cadence, her words often laced with clinical precision. She has a tendency to employ sarcasm to mask her frustration, delivering her observations with a wry smile that belies the tension beneath.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's a pleasure to work alongside such dedicated colleagues."
  [evasive] "I assure you, my time at the conference was quite productive, thank you."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch was on the verge of exposing the victim's malpractice in a recent case, a move that would have secured her professional standing but now risks her entire career." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks in a straightforward manner, often using short, clipped sentences. Her observations are delivered with a dry wit that can catch others off guard, yet her demeanor remains professional and reserved.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Everything is in order, as usual."
  [evasive] "I wouldn't want to speak out of turn, but..."
Humour: deadpan — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Having uncovered the victim's affair, Beatrice feels a sense of betrayal and is determined to protect her position within the household, even if it means taking drastic measures." — do not surface in Act I.



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
A stately manor shrouded in mystery, surrounded by expansive gardens and dark woodlands, where secrets linger in every shadow.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Garden (exterior): Clue discovery, isolation
- Grand Staircase (transitional): Access point, transition area

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, reflecting the underlying social pressures of the time and the isolation of the estate.
Weather: Overcast with occasional rain, typical for the season, creating a somber mood.

Era markers: Domestic telephones with party lines | Typewriters for correspondence | Antique radios for news and entertainment

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
  - Visual: opulent velvet drapes, flickering candlelight, portraits in gilded frames
  - Sounds: clinking china, soft laughter, crackling fire
  - Scents: freshly polished wood, candle wax, damp wool
  - Touch: soft velvet upholstery, cool marble mantel

Library (interior):
  - Visual: tall bookshelves, dust motes in sunlight, a large oak desk
  - Sounds: pages turning, the tick of a clock, distant thunder
  - Scents: musty pages, old leather, polished wood
  - Touch: smooth book spines, cool marble desk surface

Garden (exterior):
  - Visual: overgrown hedges, winding gravel paths, crumbling stone fountain
  - Sounds: rustling leaves, chirping birds, distant thunder
  - Scents: freshly turned soil, wet grass, faint floral notes
  - Touch: rough stone of the fountain, cool damp earth

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

- In April 1931, the economic repercussions of the Great Depression are palpable, creating a landscape filled with uncertainty and social strain
- Families are grappling with financial instability, and the specter of unemployment looms large
- Men are expected to provide for their families, while women navigate the constraints of traditional roles, often feeling the pressure to maintain appearances amidst economic hardships
- Social gatherings, like those at Little Middleton Manor, reflect both the opulence of the wealthy and the desperation of those struggling to keep up appearances
- The air is filled with whispers of financial ruin, and the tension is thick as class divides become more pronounced, affecting relationships and social dynamics.

TEMPORAL CONTEXT:

This story takes place in April 1931 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, chilly winds, damp grounds
- Daylight: Days are becoming longer, with daylight stretching to around 7:30 PM, though clouds often obscure the sun.
- Seasonal activities: spring cleaning in the estate, preparation for Easter celebrations, garden planning and planting
- Seasonal occasions: Easter (April 20, 1931)
- Season: spring

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with a waistcoat, tweed blazer for informal occasions, bowler hat
- Men casual: knit polo shirt, corduroy trousers, comfortable leather shoes
- Men accessories: pocket watch, silk tie, cufflinks
- Women formal: tea-length dress with a drop waist, tailored jacket with shoulder pads, cloche hat
- Women casual: lightweight cotton blouse, A-line skirt, knitted cardigan
- Women accessories: pearl necklace, embroidered handbag, stockings with seam

Cultural Context (reference naturally):
- Music/entertainment: Louis Armstrong's jazz classics, The Charleston by its various artists, popular dance bands playing at local halls; Films: Frankenstein (1931), City Lights (Charlie Chaplin); Theatre: The Royal Family, The Front Page; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Pound of butter: one shilling and sixpence
- Current events: Unemployment in the UK reaches a staggering 2.5 million; Cabinet instability in Britain as the government grapples with the economic downturn
- Literature: Murder in the Cathedral by T.S. Eliot | The Maltese Falcon by Dashiell Hammett | Of Mice and Men by John Steinbeck | [mystery and detective fiction] | [social realism] | [jazz age literature]
- Technology: the first electronic refrigerator | improvements in radio technology | the introduction of the first commercially available electric vacuum cleaner | domestic telephones | typewriters | radio sets for news and entertainment
- Daily life: attending social dances, gardening and tending to spring flowers, visiting local markets
- Social rituals: afternoon tea gatherings, weekly church services, family dinners on Sunday

Atmospheric Details:
The scent of damp earth and blooming flowers fills the air, as the estate prepares for the Easter season. A heavy silence blankets the grand halls, broken only by the distant sound of raindrops against the windows, underscoring the tension within the estate. The flickering glow of gas lamps casts long shadows, lending an air of mystery and foreboding as the evening deepens.

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
- Class indicators: Aristocrats discuss opera, servan
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

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The mechanical clock in the study shows the hands stuck at ten minutes past eleven. | This indicates tampering since it should have been wound down earlier.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The rain continued to fall outside, a steady backdrop to the rising tension within the study. Beatrice felt a sense of urgency wash over her. Time was of the essence, and every moment spent in uncertainty only deepened the mystery surrounding Eleanor's uncle's..."
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
study, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light filtered through the heavy drapes of the study, casting a muted glow over the room.
Chapter 2: Chapter 2: Initial Reactions
  Events: The rain drummed steadily against the windowpanes, a soft yet persistent reminder of the turmoil outside.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time established in earlier chapters: **"ten minutes past eleven"**
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Garden, Grand Staircase, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Garden", "Grand Staircase", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 90/100):
  Quality gaps noted: word density below preferred target (790/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 89/100):
  Quality gaps noted: word density below preferred target (761/1000); scene grounding weakness
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
   WRONG: \"I have no alibi,\" Voss said. He turned away. (if Voss is femal
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7658; context=10869; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic telephones with party lines | typewriters for correspondence | radio sets for news and entertainment | telegrams for rapid communication | aerial mail services for distant correspondence | letters delivered via local postal services.
5. Respect setting movement/access constraints in scene action and alibis: grand staircases and narrow corridors limiting movement | locked rooms or private areas restricting access | weather conditions affecting outdoor evidence visibility | restricted areas for staff and guests | daily routines dictating access to certain rooms.
6. Sustain social coherence with this backdrop pressure: A family gathering for a contentious inheritance dispute forces heirs and staff into a tense atmosphere, exacerbated by the economic strain of the Great Depression and rigid social hierarchies.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same temporal focus and crime type).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.85 with 'The Mysterious Affair at Styles' (similar method involving clock manipulation).
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure).
11. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proven access was limited and alibi consistent.
  Clues: clock evidence, witness statements
- Eleanor Voss (Act 3, Scene 5): Confirmed she was the victim.
  Clues: Eleanor's body found in the study

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The rain continued to fall outside, a steady backdrop to the rising tension within the study. Beatrice felt a sense of urgency wash over her. Time was of the essence, and every moment spent in uncertainty only deepened t...".
  - Clue obligations: none for this chapter.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "6:30 PM to 8:00 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Eleanor Voss's last seen time at 7:15 PM
- Established timeline fact: Dr. Mallory Finch's alibi of being in the study at 7:30 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered through the heavy drapes of the study, casting a muted glow over the room. Outside, the rain drizzled against the windowpanes, creating a soft, rhythmic patter that echoed the tension within. Beatrice Quill stepped cautiously into the room, her heart racing as she took in the scene before her. The air was thick with the scent of damp wood and polished furniture, a stark contrast to the gravity of what lay ahead. She had been summoned to investigate a death, but the weight of the moment pressed upon her like the oppressive clouds looming outside.

As Beatrice approached the large oak desk, her gaze fell upon the mechanical clock, its hands stuck at ten minutes past eleven. The stillness of the timepiece felt ominous, as if it had frozen in time to mark a moment of tragedy. She leaned closer, her breath catching in her throat as she noted the dust that had settled around the clock, suggesting it had not been disturbed for some time. This was no ordinary malfunction; the clock's stillness seemed to mock the urgency of the situation unfolding around her.

The implications of the clock's condition struck Beatrice with a chilling clarity. If the time was indeed accurate, then the victim had died no later than ten minutes past eleven, a critical detail that would shape the investigation. She felt the weight of this realization settle heavily on her shoulders, knowing that every second counted in unraveling the truth. The knowledge that the clock had been tampered with hinted at a deliberate attempt to obscure the timeline, raising questions about who had the opportunity and motive to do so.

Eleanor Voss lingered at the door, her expression a mask of grief that barely concealed the turmoil beneath. Beatrice could see the tension in Eleanor's posture, the way her hands clutched the edge of her dress as if seeking solace in the fabric. 'I cannot believe this has happened,' Eleanor murmured, her voice trembling slightly. 'Uncle Harold was the last person I expected to find like this.'

the doctor Finch stood nearby, her demeanor composed yet strained. 'It’s a shock, indeed,' she replied, her voice steady but lacking warmth. 'But we must remain focused. The circumstances surrounding his death are... troubling.' Beatrice noted the way Dr. Finch avoided direct eye contact with Eleanor, a subtle indication of the tension between them. The doctor’s professional facade seemed to crack ever so slightly, revealing the strain of the moment.

Beatrice turned her attention back to the clock, her mind racing with possibilities. The mechanical clock in the study was not just a timekeeper; it was a silent witness to the events that had transpired. If it had indeed been tampered with, then the timeline of the murder could be manipulated to fit someone’s narrative. Who had the most to gain from such an act? The questions loomed large, but the answers remained frustratingly out of reach.

As she surveyed the room, Beatrice’s gaze fell upon the scattered papers on the desk, their edges curling slightly as if hastily abandoned. She stepped closer, her fingers brushing against the cool surface of the desk. 'What was he working on?' she wondered aloud, not expecting an answer. The room felt heavy with secrets, each object a potential clue waiting to be uncovered. The atmosphere was charged with an unspoken tension, as if the very walls were holding their breath, waiting for the truth to emerge.

Eleanor took a step forward, her voice barely above a whisper. 'He was involved in some... delicate matters. I don’t know if it’s relevant, but he had been receiving threats lately.' Beatrice’s interest piqued at this revelation. Threats could provide motive, and the delicate nature of the uncle's affairs might have drawn unwanted attention. 'What kind of threats?' she asked, her tone encouraging yet measured.

Dr. Finch interjected, her voice firm. 'Eleanor, we should not speculate without evidence. We need to focus on what we know for certain.' Beatrice observed the dynamic between the two women, noting the tension that simmered just beneath the surface. It was clear that both had their own stakes in this investigation, and the complexities of their relationships would undoubtedly complicate matters further.

As the rain continued to fall outside, Beatrice felt a sense of urgency wash over her. Time was of the essence, and every moment spent in uncertainty only deepened the mystery surrounding the death of Eleanor's uncle. She would need to act swiftly, to sift through the layers of deception and uncover the truth hidden within this web of relationships. With a deep breath, she steeled herself for the task ahead, determined to bring clarity to the chaos that had enveloped Little Middleton Manor.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
The rain drummed steadily against the windowpanes, a soft yet persistent reminder of the turmoil outside. Beatrice Quill stood in the study, her heart racing as she glanced at the mechanical clock on the desk, its hands stubbornly frozen at ten minutes past eleven. The air was thick with a sense of dread, the scent of damp wood mingling with the faint aroma of polished furniture. She took a moment to breathe deeply, trying to steady her racing heart. Time was of the essence, and every second felt like a heavy weight pressing down on her shoulders.

Eleanor Voss fidgeted beside her, her fingers twisting nervously around the fabric of her dress. Beatrice could see the tension in Eleanor's posture, the way her eyes darted toward the clock as if willing it to move. 'I simply cannot believe this has happened,' Eleanor murmured, her voice trembling slightly. 'Uncle Harold was the last person I expected to find like this.' The sincerity in her tone was palpable, yet there was an undercurrent of anxiety that Beatrice couldn't ignore. The clock's peculiar time seemed to gnaw at Eleanor, hinting at deeper involvement.

the doctor Finch stood nearby, her demeanor composed and professional, yet Beatrice noted the slight strain in her voice. 'It’s a shock, indeed,' Dr. Finch replied, her gaze flickering between Eleanor and the clock. 'But we must remain focused. The circumstances surrounding his death are... troubling.' Beatrice observed the dynamic between the two women, the tension simmering just beneath the surface. Dr. Finch's calmness contrasted sharply with Eleanor's anxious demeanor, suggesting that each woman bore her own burdens in this unfolding tragedy.

As Beatrice turned her attention back to the clock, she noted the dust that had settled around it, suggesting it had not been disturbed for some time. This was no ordinary malfunction; the clock's stillness felt ominous, as if it had frozen in time to mark a moment of tragedy. 'This indicates tampering since it should have been wound down earlier,' Beatrice thought, her mind racing with implications. If the clock had indeed been manipulated, it could alter the entire timeline of events surrounding the murder. Who would benefit from such a deception?

The implications of the clock's condition struck Beatrice with chilling clarity. If the time was accurate, then Eleanor's uncle had died no later than ten minutes past eleven, a critical detail that would shape the investigation. Beatrice felt the weight of this realization settle heavily on her shoulders, knowing that every second counted in unraveling the truth. The knowledge that the clock had been tampered with hinted at a deliberate attempt to obscure the timeline, raising questions about who had the opportunity and motive to do so.

Eleanor's anxious fidgeting as she glanced at the clock did not go unnoticed by Beatrice. It was as if the clock's frozen hands were a mirror reflecting Eleanor's own internal turmoil. 'What was he working on?' Beatrice wondered aloud, her gaze sweeping over the scattered papers on the desk. Each object felt like a potential clue waiting to be uncovered, yet the atmosphere was charged with an unspoken tension, as if the very walls were holding their breath.

'He was involved in some... delicate matters,' Eleanor replied, her voice barely above a whisper. 'I don’t know if it’s relevant, but he had been receiving threats lately.' Beatrice's interest piqued at this revelation. Threats could provide motive, and the delicate nature of Eleanor's uncle's affairs might have drawn unwanted attention. 'What kind of threats?' she asked, her tone encouraging yet measured.

Dr. Finch interjected, her voice firm. 'Eleanor, we should not speculate without evidence. We need to focus on what we know for certain.' Beatrice noted the way Dr. Finch avoided direct eye contact with Eleanor, a subtle indication of the tension between them. The doctor’s professional facade seemed to crack ever so slightly, revealing the strain of the moment. Beatrice recognized that both women had their own stakes in this investigation, and the complexities of their relationships would undoubtedly complicate matters further.

The rain continued to fall outside, a steady backdrop to the rising tension within the study. Beatrice felt a sense of urgency wash over her. Time was of the essence, and every moment spent in uncertainty only deepened the mystery surrounding Eleanor's uncle's death. With a deep breath, she steeled herself for the task ahead, determined to bring clarity to the chaos that had enveloped Little Middleton Manor. The clock's frozen hands loomed large in her mind, a silent witness to the secrets waiting to be uncovered.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's resolve to pursue the truth despite skepticism."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Beatrice commits to investigating the circumstances surrounding the death, heightening the stakes."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time indicated on the clock.
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
    "sceneNumber": 3,
    "act": 1,
    "title": "Investigation Begins",
    "setting": {
      "location": "the study",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Determined and focused"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Introduce Beatrice's commitment to the investigation",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Beatrice faces skepticism from Eleanor and Finch.",
      "tension": "Eleanor and Finch's contrasting reactions heighten suspicion.",
      "microMomentBeats": [
        "Beatrice clenches her fists, feeling the weight of their doubt."
      ]
    },
    "summary": "Beatrice, determined to uncover the truth, begins her investigation, facing skepticism from Eleanor and Finch. Their contrasting reactions to the tragedy deepen the mystery surrounding the victim's death.",
    "estimatedWordCount": 1250,
    "pivotElement": "Beatrice's resolve to pursue the truth despite skepticism.",
    "factEstablished": "Beatrice commits to investigating the circumstances surrounding the death, heightening the stakes.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial clues create a sense of urgency as the investigation begins, heightening the stakes.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a melodic quality, often layered with subtle sarcasm, reflecting her polished social facade."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to transportation due to economic conditions.; Rationing affecting social gatherings and availability of resources.; Communication often reliant on outdated technology like typewriters and telegraphs.",
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

## Message 4 (role=user)

```text
Attempt 5/6 — chapters 3 — 1 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE DETECTED ═══
• Your prose closely matches or repeats a paragraph from a prior chapter.
  Every paragraph must be original prose unique to this chapter's scene.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"as beatrice turned her attention back ... would benefit from such a deception"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"the rain continued to fall outside ... the secrets waiting to be uncovered"

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"eleanor voss fidgeted beside her her ... at eleanor hinting at deeper involvement"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 19 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "The morning light filtered through the ... a muted glow over the room."
  • "As Beatrice approached the large oak ... stuck at ten minutes past eleven."
  • "The implications of the clock's condition struck Beatrice with a chilling clarity."
  • "Eleanor Voss lingered at the door, ... that barely concealed the turmoil beneath."
  • "the doctor Finch stood nearby, her demeanor composed yet strained."
  • "Beatrice turned her attention back to ... clock, her mind racing with possibilities."
  • "As she surveyed the room, Beatrice’s ... curling slightly as if hastily abandoned."
  • "Eleanor took a step forward, her voice barely above a whisper."
  • "Dr."
  • "As the rain continued to fall ... sense of urgency wash over her."
  • "The rain drummed steadily against the ... persistent reminder of the turmoil outside."
  • "Eleanor Voss fidgeted beside her, her ... around the fabric of her dress."
  • "the doctor Finch stood nearby, her ... the slight strain in her voice."
  • "As Beatrice turned her attention back ... not been disturbed for some time."
  • "The implications of the clock's condition struck Beatrice with chilling clarity."
  • "Eleanor's anxious fidgeting as she glanced ... did not go unnoticed by Beatrice."
  • "'He was involved in some."
  • "Dr."
  • "The rain continued to fall outside, ... the rising tension within the study."

Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.

═══ OTHER ERRORS (1) ═══
• [object Object]

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 3/6
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: opening-style entropy too low (0.00 < 0.62). Vary chapter openings and avoid repeated style buckets.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.90 >= 0.65). Rephrase this passage to avoid template leakage.
```
