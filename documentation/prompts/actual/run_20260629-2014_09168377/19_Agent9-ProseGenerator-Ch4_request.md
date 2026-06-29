# Actual Prompt Record

- Run ID: `run_09168377-8a7c-483c-b498-af9745492070`
- Project ID: `proj_b81c20c5-117d-447a-9663-b6dd7554ca0d`
- Timestamp: `2026-06-29T20:23:04.317Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1d8c277fdb5d6b4b`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Arthur Langley[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Arthur Langley. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Edith Marwood (woman) — DECEASED, past-tense only, Arthur Langley (man), Beatrice Hargrave (woman), Charles Whitmore (man), Daphne Sinclair (woman), Edward Marwood (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Edith Marwood, Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood?" If not, remove them.
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
- ⛔ ANTI-EXPOSITORY DIALOGUE (ROADMAP_TO_80 M3 — HIGH PRIORITY): No character may state evidence, an alibi, a timeline, or a clearance as a flat report. Dialogue must carry SUBTEXT — characters deflect, evade, hedge, imply, or push back; the investigator INFERS what is not said. A line that exists only to relay a fact the reader needs is forbidden: route that fact to narration or have a character resist/qualify it. Each speaking character must sound distinct (diction, rhythm, what they avoid) — a reader should attribute a line without its tag. Replace "I was in the kitchen at eleven, the cook will confirm" with evasion under pressure that the inspector must read.
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted to prevent the victim from revealing a devastating family secret that would ruin innocent relatives, blurring justice and protection." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- VICTIM IDENTITY: Edith Marwood is the murder victim, already dead before this chapter. Refer to them ONLY in past tense (memory, testimony, physical evidence). They do not speak, enter rooms, react, or gesture. Never write them as present or alive in any scene.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Edith Marwood (DECEASED), Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Edith Marwood: victim (DECEASED — does not appear in any scene, past tense only)
   - Arthur Langley: Private Investigator / Inquiry Agent
   - Beatrice Hargrave: Ambitious Socialite
   - Charles Whitmore: Legal Advisor
   - Daphne Sinclair: Loyal Servant with a Hidden Past
   - Edward Marwood: Disgruntled Heir
   - Never place characters in locations inconsistent with their role

## POST-CHAPTER-1 CHARACTER PRESSURE CONTRACT (MANDATORY)
After Chapter 1, character content must not read as biography or static profile recap.
Character beats must carry pressure and case movement.
Apply this contract to every chapter in this batch.

For each chapter after Chapter 1, reveal at least one NEW character truth about one of:
- fear
- motive
- lie/deception
- loyalty conflict
- relationship to the victim

That character development must do at least one of the following:
- make someone more suspicious
- make someone less suspicious
- explain why someone lied
- reveal motive
- deepen the emotional cost of the crime
- change the investigator's understanding of the case

Hard constraints:
- No character paragraph that only restates occupation/role/persona without investigative consequence.
- No static biography dumps after Chapter 1.
- The investigator must register the pressure shift in-scene (through observation, questioning, or revised theory).

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1937 January
January 1937 in rural England is marked by short, cold winter days with intermittent misty rain and frequent overcast skies that create a muted and introspective atmosphere. The manor's interior is warmed by peat fires and dim gas lamps, while outside, the sodden grounds invite brisk but solitary walks. Social routines remain rigid, with formal dinners and strict class separations underscoring daily life. The ambient sounds of distant train whistles and crackling wireless broadcasts blend with the scent of damp earth and aged wood, evoking a world caught between fading traditions and looming uncertainties. Fashion reflects a cautious elegance, favoring tailored wool garments and modest accessories that denote social standing. Radio dramas and detective stories captivate listeners, providing an escape from the political anxieties of a Europe edging towards conflict. The household operates under strict protocols, with servants and family members bound by etiquette, even as economic pressures and social tensions simmer beneath the surface.
Emotional register: A pervasive undercurrent of cautious anxiety and restrained tension colors daily life, as traditions are challenged by external and internal uncertainties.
Physical constraints: Communication limited to domestic telephones on party lines and telegrams | Transportation mostly by petrol-powered automobiles and limited passenger trains | Manor estate access tightly controlled with strict visitor logs and locked areas | Manual typewriters and handwritten correspondence remain primary record-keeping methods
Current tensions (weave into background texture): King George VI’s coronation preparations following Edward VIII’s abdication create political uncertainty | Rising threat of Nazi Germany’s militarization stirs national unease | Economic recovery from the Great Depression remains slow and fragile
Wartime context — Britain is not yet at war, but military rearmament is underway amidst growing international tensions.: Communities remain structured around class and duty, with military service starting to influence family expectations and social roles. Absence effect: The looming threat of conflict casts a shadow over personal ambitions and heightens the stakes of loyalty and betrayal within households.

## Season Lock (mandatory — derived from 1937 January)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
This story explores how the veneer of social order and tradition can mask deep personal ambitions and betrayals, revealing that truth often demands dismantling carefully maintained facades within a rigid class system.

## Story Emotional Register
Dominant: The story’s emotional tone is a steadily mounting tension punctuated by restrained revelations and undercurrents of betrayal beneath a veneer of social order.

Arc:
The narrative opens amid the oppressive quiet of Marwood Manor, where the discovery of Edith Marwood’s stabbing casts a long, chilling shadow over the estate. The initial atmosphere is heavy with grief and confusion, permeated by the cold dampness of the winter day and the rigid social protocols that govern the household. The weight of tradition and expectation presses on every character, setting a somber and reflective mood.

As Arthur Langley begins his investigation, subtle inconsistencies emerge—contradictory servant testimonies, the enigmatic sundial shadow on Edith’s stopped watch, and the discreet but palpable tensions among the staff and family. These early clues foster a rising unease, as trust fractures and suspicion spreads. False leads, such as the misdirected focus on Charles Whitmore, heighten the emotional stakes, drawing Arthur deeper into a maze of social facades and hidden motives.

Midway, a pivotal revelation shifts the investigation’s direction: the sundial’s shadow and ledger inconsistencies expose a manipulated timeline. This turning point reframes previous assumptions, forcing Arthur and the household to confront the unreliability of testimonies and the hidden machinations within the family. The emotional tenor shifts from uncertainty to a cautious determination, mingled with growing dread.

A second turn arrives as the implications of the falsified timeline emerge, revealing Edward Marwood’s exclusive access and motive. This revelation colors earlier events with betrayal and premeditation, intensifying the psychological pressure within the manor. The genteel surface cracks further, exposing the ruthless ambition beneath.

The pre-climax builds with mounting tension and a sense of impending confrontation, culminating in the sundial shadow experiment that physically disproves Edward’s alibi. The climax is a charged moment of exposure and accusation, where cold, objective evidence shatters the carefully constructed social order. The emotional intensity peaks as authority is challenged and truth triumphs over deception.

In resolution, the manor grapples with.

## Emotional register at this point in the story
The sundial shadow evidence and ledger discrepancies force a reassessment of the murder timeline.

## Character Portraits (appearance & era)

### Arthur Langley
Arthur's disciplined, military-influenced demeanor fits the 1937 context of a nation preparing for potential conflict. His role as an investigator within a rigid social hierarchy highlights the era’s clash between old-world privilege and emerging demands for justice. His personal resentment toward aristocracy echoes wider societal questioning of established structures, while his measured approach reflects the period’s emphasis on decorum despite underlying unrest.
Era intersection: His quest for truth amid the estate’s secrets embodies the era’s tension between tradition and the need for accountability.

### Beatrice Hargrave
Beatrice is emblematic of the 1930s social climber navigating the strict class distinctions of the time. Her polished charm and underlying desperation illustrate the precariousness faced by those seeking upward mobility during economic uncertainty. Her fear of exposure resonates with the era’s rigid social expectations and the harsh consequences of scandal, particularly for women attempting to secure their place in a stratified society.
Era intersection: Her ambitions and vulnerabilities reflect the limited but shifting opportunities for women within the social fabric of 1937 England.

### Charles Whitmore
Charles represents the steadfast yet ethically compromised professional caught in the pressures of 1930s financial and social instability. His loyalty to the family contrasts with his personal failings, mirroring the era’s complex intersections of duty and survival. His formal, controlled demeanor is a product of a period valuing legal propriety and social hierarchy, even as these structures are strained by individual crises.
Era intersection: His concealed debts and forged documents highlight the economic hardships and moral compromises prevalent in the period.

### Daphne Sinclair
Daphne embodies the loyal yet vulnerable servant class of the 1930s, whose position depends on discretion and adherence to strict social codes. Her guarded past and fear of exposure underscore the limited agency and harsh judgment faced by women in domestic service. Her measured Yorkshire accent and understated humour reflect the regional and class identities that shape daily life in rural England during this time.
Era intersection: Her struggle to maintain status amidst personal secrets parallels the era's rigid social stratification and the precariousness of servant life.

### Edward Marwood
Edward is a figure of restless ambition constrained by 1937’s entrenched family and class structures. His impatience and covert deals symbolize the tensions between traditional estate stewardship and modern financial pressures. His sardonic tone and assertive manner express the impatience of a younger generation facing economic uncertainty and social expectations, embodying the era’s undercurrents of change and conflict within landed gentry families.
Era intersection: His secret negotiations and desire for control reflect the economic and social challenges confronting British aristocracy in the late 1930s.

## Character Voices

### Arthur Langley (he/him/his)
Arthur’s speech is clipped and precise, with a dry wit that punctuates his observations economically.
[comfortable] Let’s not jump to conclusions, shall we? Every detail deserves a measured eye.
[evasive] I’m afraid that line of inquiry may lead us astray—best to focus on what truly matters.
[stressed] The pieces aren’t fitting as neatly as one would hope; patience is wearing thin.
Humour: His humour is dry and understated, often serving to defuse tension or highlight absurdities.

### Beatrice Hargrave (she/her/her)
Beatrice’s voice is polished and articulate, laced with subtle barbs and coquettish charm.
[comfortable] Darling, one must always keep one’s options open. It’s the only way to survive in these circles.
[evasive] I was merely attending to some trivial matters—nothing worthy of your concern, I assure you.
[stressed] One can only do so much to maintain appearances when the shadows grow long.
Humour: Her humour is sharp and socially savvy, using polite savagery to mask vulnerability.

### Charles Whitmore (he/him/his)
Charles speaks with formal precision and a flat tone, rarely showing emotion but occasionally dry humour.
[comfortable] The law is, regrettably, indifferent to sentiment. One must abide by its dictates.
[evasive] I cannot comment on matters outside my purview; some things are best left unexplored.
[stressed] Circumstances have a way of complicating even the most straightforward affairs.
Humour: His humour is minimal and deadpan, typically underscoring the gravity of situations.

### Daphne Sinclair (she/her/her)
Daphne’s speech carries a measured Yorkshire accent, blending warmth with self-deprecating humour.
[comfortable] Well, you can’t please everyone, can you? But one does their best all the same.
[evasive] I was simply making sure the kitchen ran smoothly—nothing more, nothing less.
[stressed] Secrets have a way of creeping out when you least expect it, don’t they?
Humour: Her humour is modest and self-effacing, offering a gentle contrast to the manor’s formality.

### Edward Marwood (he/him/his)
Edward’s tone is brisk and clipped, often punctuated by sardonic remarks and pointed challenges.
[comfortable] If you ask me, that’s a waste of good time. We should focus on what matters.
[evasive] I was exactly where I said I’d be. Anything else is speculation without proof.
[stressed] You think I’m the villain? Perhaps—but the estate’s future is not so simple.
Humour: His humour is sardonic, using sharp retorts to mask frustration and impatience.

## Location Registers (scene framing guides)

The Sundial Terrace: The terrace exudes a cold, isolating stillness, where the damp air and shifting shadows create a palpable tension, underscored by the silent witness of the sundial and the stark reality of the crime. It is both a place of natural beauty and concealed menace, reflecting the manor’s duality of genteel surface and hidden turmoil.. Camera angle: Approach with an eye for contrasts between light and shadow, capturing the oppressive quiet that belies the violent act.. Era: Access to the terrace is strictly controlled during daylight, with the sundial’s shadow providing a crucial temporal anchor.

Marwood Manor Library: The library feels like a sanctuary of fading knowledge and whispered secrets, where the scent of old books mingles with the quiet urgency of discovery. It offers a refuge for reflection but also a stage for uncovering uncomfortable truths beneath its orderly surface.. Camera angle: Focus on the interplay of shadows and warm lamplight, evoking both comfort and the weight of concealed information.. Era: Access is restricted to family and trusted staff, emphasizing the exclusivity of knowledge in this era.

Servants' Hall: This modest room carries the worn energy of daily toil and private camaraderie, a stark contrast to the manor’s grandeur. It hums with subdued conversations and the scent of hard work, embodying the social separation and quiet resilience of the staff.. Camera angle: Capture the cozy yet utilitarian ambiance, highlighting the human warmth beneath the rigid social structure.. Era: Strictly off-limits to family members, reinforcing class distinctions and controlled interactions.

Family Study: The study radiates a tense intimacy, where rich furnishings and personal artifacts mask the undercurrents of power struggles and guarded conversations. It is a crucible for secrets and strategic plotting, steeped in tradition yet fraught with conflict.. Camera angle: Frame the room to emphasize the contrast between warmth of the fireplace and the cold calculations made within.. Era: Entry is tightly controlled, underscoring the sanctity of private family matters in this era.

## Humour guidance for this story position (first_turn)
Permission: conditional — condition: Allowed only if delivered by a character with humourLevel > 0.7 and no direct threat or violence present.
Characters who may be funny: Beatrice Hargrave
Permitted forms: polite_savagery
Rationale: Tension scenes are generally serious, but a well-timed sharp remark can heighten rather than relieve tension if carefully executed.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "The sundial shadow experiment, earlier seen as a curious temporal detail, now becomes the linchpin disproving alibis and challenging authority structures within the manor". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, Edward Marwood’s carefully crafted alibi, previously accepted due to his status and control, is shattered, highlighting how power and deception intertwine to manipulate justice, reshaping the reader’s understanding of motive and opportunity". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was murdered shortly before sunset as all household servants consistently testified.
- Hidden truth to progressively expose (compose in your own words from these elements): hides, fact, murder, occurred, servants, claimed, presence, timeline, manipulated, false, testimonies, physical
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: edith, marwood, watch, stopped, garden, shows, clear, shadow, face, cast, sundial, gnomon | corr: shadow, length, direction, correspond, time, servants, claimed, death, based, solar, geometry, little | effect: narrows, murder, time, window, servants, last, reported, sighting, invalidating, timeline
  - Step 2: obs: household, ledger, pages, show, financial, entries, dated, servants, claimed, time, death, inconsistencies | corr: since, edith, confronted, edward, ledger, falsifications, timing, proves, murder, happened, servants, supposed | effect: eliminates, suspects, claiming, presence, before, ledger, entries, implicates, motive, hide, fraudulent, finances
  - Step 3: obs: edward, marwood, study, logs, housekeeper, testimony, conflict, claims, presence, four, independent, confirmation | corr: given, adjusted, murder, time, sundial, ledger, edward, alibi, overlaps, window, making, claimed | effect: eliminates, edward, alibi, narrows, culpability
  - Step 4: obs: edward, authority, unmonitored, access, manipulate, watch, position, garden, cast, misleading, sundial, shadow | corr: exclusive, access, knowledge, prove, premeditation, ability, stage, false, timeline | effect: uniquely, identifies, edward, marwood, culprit
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): sundial, shadow, experiment, conducted, placing, identical, watch, face, sunlight, conditions, various, times
- Test must rely on already-shown clue IDs: clue_12, clue_2, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The sundial shadow on Edith’s watch and weather logs (early clues) establish the murder time contradicting servant statements. Step 2: Ledger ink inconsistencies and financial entries dated after servants’ timeline narrow suspects and reveal Edward’s motive. Step 3: Edward’s alibi conflicts with the revised timeline, eliminating his claimed innocence. Step 4: Only Edward’s exclusive access to the garden and watch placement proves premeditation. The discriminating test uses these clues to definitively prove the false timeline and Edward’s guilt.

## Character Reference

### Arthur Langley (he/him — NEVER she/her)
Speaks with clipped precision and economy of words, often punctuating observations with dry, understated humour
His tone is measured, occasionally slipping into military jargon or metaphors, reflecting a mind trained to assess and adapt.
Battles a simmering distrust of the upper class he investigates, alongside a personal desire to prove his worth beyond the scars of past betrayals.
Voice colour: Arthur Langley uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Hargrave (she/her — NEVER he/him)
Articulate and fluid, Beatrice’s speech is laced with subtle barbs and double entendres
She wields wit as a weapon, often cloaking sharp observations beneath a veneer of coquettish charm and practiced civility.
Torn between the desire to ascend socially and the fear of exposure that could obliterate her carefully constructed identity.
Voice colour: Beatrice Hargrave uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Charles Whitmore (he/him — NEVER she/her)
His speech is precise and formal, often delivered in a flat, unemotional tone
He rarely indulges in humour, but when he does, it is dry and understated, revealing a mind accustomed to control and calculation.
Struggles with guilt over betraying a family he ostensibly serves and fears the collapse of his carefully maintained life.

### Daphne Sinclair (she/her — NEVER he/him)
Speaks with a measured Yorkshire accent, often using understated humour and self-effacing remarks
Her tone is warm but firm, blending practicality with an occasional dry quip that reveals a sharp intellect beneath her domestic role.
Battles the fear that her past indiscretions will destroy the life she has painstakingly built, while striving to remain the loyal custodian of the household.

### Edward Marwood (he/him — NEVER she/her)
Speaks with a brisk, clipped tone, often punctuated by sardonic remarks and a tendency to challenge others with pointed questions
His speech is direct, occasionally abrasive, revealing impatience and a sharp intellect.
Struggles between loyalty to family legacy and his desire to assert control and independence, haunted by the fear that his ambitions might destroy what he claims to protect.
Voice colour: Edward Marwood uses sardonic humour — let it surface in their dialogue where natural, not in every line.



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

TEMPORAL CONTEXT:

This story takes place in January 1937 during winter.

Seasonal Atmosphere:
- Weather patterns: chill dampness with frequent overcast skies, occasional light frost overnight, intermittent misty rain typical of English countryside winters
- Daylight: short winter days with sunset around 4:15 PM, dusk falling rapidly thereafter
- Seasonal activities: taking brisk country walks on estate grounds despite the cold, indoor card and board games by the fireside, preparations for the upcoming Burns Night celebrations
- Seasonal occasions: New Year’s Day, Epiphany (January 6th)
- Season: winter

Period Fashion (describe naturally):
- Men formal: three-piece wool flannel suits in dark greys or browns, double-breasted overcoats with wide lapels, silk cravats or narrow ties with subtle patterns
- Men casual: knitted argyle sweaters worn over collared shirts, tweed sports jackets paired with corduroy trousers, leather brogue shoes, polished but showing wear
- Men accessories: felt homburg or trilby hats, leather gloves lined with wool, pocket watches on chains
- Women formal: wool crepe day dresses with padded shoulders and narrow waists, fur-trimmed coats with large collars, felt hats adorned with small veils or feathers
- Women casual: knitted cardigans layered over silk blouses, mid-calf length skirts in tweed or wool blends, leather lace-up ankle boots
- Women accessories: silk scarves tied at the neck, leather handbags with metal clasps, long gloves for outdoor wear

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby’s crooning hits, Duke Ellington’s jazz orchestras gaining UK popularity, British dance bands like Jack Hylton’s ensemble; Films: ‘The Awful Truth’ starring Cary Grant, ‘Snow White and the Seven Dwarfs’ previewing in Europe; Theatre: West End productions of Noël Coward plays, revues featuring music hall favorites; Radio: BBC Home Service broadcasting popular variety shows, news bulletins providing updates on European tensions
- Typical prices: loaf of bread: fourpence, coal scuttle refill: one shilling sixpence, taxi ride across town: two shillings
- Current events: King George VI’s recent coronation preparations following Edward VIII’s abdication in late 1936; continuing tensions in Europe with Nazi Germany’s increasing militarization
- Literature: Agatha Christie’s ‘Dumb Witness’ published in late 1936 | John Steinbeck’s ‘In Dubious Battle’ gaining attention | Virginia Woolf’s essays and diaries continued circulation | [mystery and detective fiction] | [modernist literature] | [social realism novels]
- Technology: improved radio receivers with better sound fidelity | introduction of early automatic washing machines for affluent homes | advances in automotive engineering with more reliable engines | domestic telephones connected by party lines | manual typewriters for correspondence | battery-powered flashlights used by estate staff
- Daily life: morning chores and correspondence before breakfast, afternoon tea and social calls within local gentry, evening billiards or card games in the manor’s smoking room
- Social rituals: formal dinner served promptly at 7 PM with multiple courses, staff and family separation maintained during meals

Atmospheric Details:
The faint scent of coal smoke mixes with damp earth and wood polish inside the manor. Heavy velvet curtains are
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The actual time when the sundial’s shadow length indicates the murder must have occurred: "twenty minutes past four in the afternoon"
  - Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline: "half past three in the afternoon"
  - Weather condition recorded in the estate’s log confirming shadow visibility: "clear skies"
  - Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation: "forty-five degrees"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_14] observable, edward, marwood, premeditation, includes, nervous, behavior, secretive, notes, referencing, fear, scandal
  Category: behavioral | Criticality: essential | Supports inference step 4
  Points to: scandal, exposure

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The actual time when the sundial’s shadow length indicates the murder must have occurred: "twenty minutes past four in the afternoon"
  • Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline: "half past three in the afternoon"
  • Weather condition recorded in the estate’s log confirming shadow visibility: "clear skies"
  • Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation: "forty-five degrees"

CHARACTER PRONOUNS — never deviate from these:
  • Edith Marwood: she/her/her
  • Arthur Langley: he/him/his
  • Beatrice Hargrave: she/her/her
  • Charles Whitmore: he/him/his
  • Daphne Sinclair: she/her/her
  • Edward Marwood: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_3, clue_4, clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): edith, marwood, watch | shadow, length, direction | household, ledger, pages | since, edith, confronted | murder, concealed, manipulating
• Suspects still unresolved: Beatrice Hargrave[SHE], Charles Whitmore[HE], Daphne Sinclair[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "A faint, ironic relief touched Arthur as he closed the ledger. Even in the labyrinth of Marwood Manor, with its rituals and routines, the truth had a way of seeping through the cracks. He would follow the shadow, the ink, the silence—whatever it took. For now,..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Edith Marwood: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Edith Marwood crossed the room" / "Edith Marwood sat on the sofa" / "Edith Marwood nodded"
  - WRONG: "Edith Marwood gave testimony" / "Edith Marwood asked what had happened"
  - CORRECT: "Edith Marwood had often said..." / "Edith Marwood's effects were found" / "witnesses recalled Edith Marwood's habit of..."
═══════════════════════════════════════════════════════

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
Known location profile anchors: Marwood Manor, The Sundial Terrace, Marwood Manor Library, Servants' Hall, Family Study, Library and drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Marwood Manor", "The Sundial Terrace", "Marwood Manor Library", "Servants' Hall", "Family Study", "Library and drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "Library and drawing room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "the weather condition recorded in the estate", "weather condition recorded in the estate s", "condition recorded in the estate s log", "recorded in the estate s log confirming", "in the estate s log confirming shadow", "the estate s log confirming shadow visibility".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Edith Marwood: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Arthur Langley: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Hargrave: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Whitmore: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Daphne Sinclair: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Marwood: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Edith watched Langley; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Edith watched Langley; Langley crossed the room and Edith frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13564; context=10169; dropped=[humour_guide, location_profiles, texture_pool, continuity_context]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 4 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio receivers common in drawing rooms | domestic telephones connected via party-line exchanges | manual typewriters used for correspondence and record-keeping | telephone calls subject to party-line privacy limitations | telegrams dispatched from nearest town post office | postal mail and airmail for longer-distance correspondence.
5. Respect setting movement/access constraints in scene action and alibis: main entrances guarded by estate staff controlling visitor access | restricted areas such as private family quarters and staff-only zones | estate layout includes natural barriers like hedges and gated driveways limiting movement | weather conditions such as frequent rain can affect outdoor evidence and timing | entry to manor strictly monitored by staff with visitor logs maintained.
6. Sustain social coherence with this backdrop pressure: Amidst the strict social hierarchy and regimented routines of an isolated 1930s English manor, the Marwood family and their close associates navigate economic anxieties and guarded interactions while confined by estate protocols and rising external tensions.
7. Maintain continuity around these socially central cast anchors where relevant: Edith Marwood, Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the sundial shadow experiment demonstrating time contradiction, Observe Edward Marwood’s reaction to the invalidation of his alibi, Draw conclusion about Edward’s guilt based on physical evidence
Test type: trap

**Suspect Clearance Scenes:**
- Beatrice Hargrave (Act 3, Scene 5): Proof of kitchen presence and ledger corrections unrelated to murder
  Clues: Kitchen access logs, Ledger pagination and ink analysis
- Charles Whitmore (Act 3, Scene 5): Servants’ testimonies and location in main hall during murder time
  Clues: Household schedules, Witness accounts
- Daphne Sinclair (Act 3, Scene 5): Alibi verified by guest logs and Arthur Langley’s confirmation
  Clues: Guest arrival and movement logs, Arthur’s testimony

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with sundial shadow evidence, ledger analysis, and authority channel breach

**Clue Placement for These Chapters:**
- clue_5 must appear in Act 2, Scene 1 via Witness statement

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Suspect Pressure.
Mode required outcomes:
- Reveal fear, motive, lie, loyalty conflict, or secret.
- Suspicion state changes by chapter end.
Forbidden at this stage:
- No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Pressure: 45-55%
- Evidence Or Alibi Testing: 35-45%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1930s): NEVER use these anachronistic terms: "computer", "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth", "jet plane". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Library and drawing room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Arthur" or "Arthur's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Arthur" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "A faint, ironic relief touched Arthur as he closed the ledger. Even in the labyrinth of Marwood Manor, with its rituals and routines, the truth had a way of seeping through the cracks. He would follow the shadow, the ink...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • study, logs, show, edward, claimed, presence, housekeeper, testifies, seeing, away, period [clue_5]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • edward, seen, nervously, writing, notes, potential, scandal, edith, confrontation [clue_14]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • observable evidence relevant to the investigation [rh_1]
      Points to: what this observation reveals about the time or circumstances of the crime.
    • observable evidence relevant to the investigation [rh_2]
      Points to: what this observation reveals about the time or circumstances of the crime.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Edward Marwood's established alibi is "Says he was in his study from one to four". Do NOT place Edward Marwood at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Edward Marwood has already made statements in earlier chapters. Any time, location, or claim attributed to Edward Marwood in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: grey light through rain-streaked windows, soft shadows from gas lamps | steady rain tapping on windowpanes, soft scratching of pen on paper | damp stone faintly seeping in. Mood: contemplative and subdued.

- Tonal contrast required: the previous chapter was high-tension. Beatrice Hargrave may use polite_savagery to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions The actual time when the sundial’s shadow length indicates the murder must have occurred, write exactly: "twenty minutes past four in the afternoon".
  - If this batch mentions Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, write exactly: "half past three in the afternoon".
  - If this batch mentions Weather condition recorded in the estate’s log confirming shadow visibility, write exactly: "clear skies".
  - If this batch mentions Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation, write exactly: "forty-five degrees".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Edith Marwood: she/her/her
    Arthur Langley: he/him/his
    Beatrice Hargrave: she/her/her
    Charles Whitmore: he/him/his
    Daphne Sinclair: she/her/her
    Edward Marwood: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Servant testimonies placing Edith alive before sunset
- Established timeline fact: Sun position and shadow length on the sundial
- Established timeline fact: Household meal schedule starting at half past six
- Established timeline fact: Edward's study occupancy from one to four in the afternoon
- If referenced, use exact phrase: "twenty minutes past four in the afternoon" (The actual time when the sundial’s shadow length indicates the murder must have occurred).
- If referenced, use exact phrase: "half past three in the afternoon" (Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline).
- If referenced, use exact phrase: "clear skies" (Weather condition recorded in the estate’s log confirming shadow visibility).
- If referenced, use exact phrase: "forty-five degrees" (Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Sundial's Witness
Arthur Langley stepped onto the frost-laced flagstones of the Garden of Marwood Manor, the cold morning air prickling the skin beneath his woolen gloves. A hush had settled over the estate, broken only by the distant echo of a train whistle and the soft patter of last night’s rain dripping from the box hedges. The sky, a muted grey, pressed low upon the winter landscape. Ahead, beneath the pale shadow cast by the ancient sundial, Edith Marwood lay motionless, her form half-shrouded by the trailing edge of her fur-trimmed coat. The faint scent of damp earth mingled with something sharper—metallic, unmistakable. Arthur paused, the breath clouding before him, and knelt at Edith’s side, his gaze drawn immediately to her left wrist. There, her watch had stopped, its face catching the slender shadow of the sundial’s gnomon, perfectly aligned and sharply defined in the morning’s wintry light.

He studied the watch, noting the clarity of the shadow across its glass. The angle and length of the sundial’s shadow, combined with the position of the stopped hands, struck him as oddly precise—too precise, perhaps, for a death that the household claimed had occurred before sunset. The servants’ statements, gathered in hurried whispers since dawn, insisted on a timeline that did not match the evidence before him. Arthur’s mind catalogued the contradiction: the sundial’s shadow, unwavering and distinct, suggested a time at odds with the household’s recollections. The watch, marked by the unmistakable imprint of the sundial’s shadow, seemed to point to a different hour altogether. It was a detail that demanded explanation, and Arthur felt the first stirrings of unease—a sense that the truth here would not yield easily.

He rose, brushing the moisture from his knees, and surveyed the scene. The Garden of Marwood Manor, usually a place of quiet order, was now unsettled by the presence of death. The moss-covered flagstones felt rough beneath his boots, and the air carried the chill dampness of a Yorkshire winter. Beyond the sundial, the manor’s windows glimmered dully, their curtains drawn but not quite concealing the movement within. Arthur’s gaze lingered on the sundial itself, its weathered stone base and the gnomon set at precisely forty-five degrees from the horizontal—a detail he filed away, knowing the geometry of shadow and time would matter before the day was done.

A cluster of figures gathered at the edge of the terrace, their faces taut with shock and something more guarded. Beatrice Hargrave stood nearest, her gloved hands clasped tightly around a silk handkerchief. She was the very image of composure, yet her gaze flickered anxiously between Arthur and the watch on Edith’s wrist. Beatrice’s reputation as an ambitious socialite preceded her—her ascent through the ranks of local society had been swift, and not without its share of whispered scandals. Edith Marwood’s recent discovery of a forged letter had placed Beatrice under a cloud she could not easily dispel. Now, as Arthur watched, Beatrice’s posture betrayed a nervous tension, her shoulders rigid beneath her tailored coat. He noted the way she avoided meeting his eyes, focusing instead on the sundial as if it might absolve her of any involvement.

Charles Whitmore, the family solicitor, stood a pace behind, his expression unreadable beneath the brim of his felt hat. Charles’s presence at Marwood Manor was a fixture—his loyalty to the family unquestioned, though not, perhaps, untainted by self-interest. Edith had confronted him only days before about discrepancies in the estate’s will, and Arthur wondered now if those secrets had played any part in the night’s violence. Charles’s hands were folded behind his back, but Arthur caught the briefest tightening of his grip on his leather portfolio, a gesture that suggested more than professional anxiety. When Arthur’s gaze met his, Charles offered a curt nod, his voice flat as he spoke. “You’ll want to see the guest logs, I presume. The law is, regrettably, indifferent to sentiment.” The words were correct, but the tone was brittle, and Arthur marked it as a sign of pressure.

Daphne Sinclair, the head housekeeper, hovered near the servants’ entrance, her posture both attentive and wary. Daphne’s Yorkshire accent surfaced as she murmured instructions to a junior maid, her tone brisk yet not unkind. She had served the Marwoods for over a decade, her loyalty forged in the quiet crucible of domestic routine. Yet Edith’s knowledge of Daphne’s past—her affair with Edith’s late husband—had always been a silent threat. Today, Daphne’s composure seemed to fray at the edges. She smoothed her apron with deliberate care, but her eyes darted to Arthur, then to the sundial, then back again. “If you’ll be needing the kitchen records, sir, I’ve them ready,” she said, but the words came out thinner than usual, betraying an undercurrent of dread.

Edward Marwood, the heir, arrived last, his stride brisk and his jaw set in a line of impatience. He wore a dark overcoat, the collar turned up against the cold, and his gloved hands were thrust deep into his pockets. Edward’s reputation as the estate’s restless moderniser was well known; he had little patience for tradition and even less for the constraints of family expectation. Now, his eyes swept the scene with a mixture of irritation and something sharper—fear, perhaps, or guilt. “I trust you’ll be thorough, Mr. Langley,” he said, his tone clipped. “We can’t afford delays. The estate’s affairs are complicated enough without this.” Arthur noted the way Edward’s gaze lingered on the sundial and the watch, then flicked away. It was not the look of a man at ease with circumstance.

Arthur turned back to Edith Marwood, careful not to disturb the scene more than necessary. The silence grew heavier, punctuated only by the distant caw of a rook and the soft rustle of Daphne’s skirts as she withdrew. The cold seemed to intensify, seeping through Arthur’s coat and settling in his bones. He glanced once more at the watch, the sundial’s shadow still perfectly aligned across its face. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, was unmistakable: half past three in the afternoon. Yet every servant’s account insisted that Edith had been seen alive well before then. The contradiction was stark, and Arthur felt its weight.

He straightened, drawing a slow breath, and turned to the assembled household. “I am Arthur Langley. I have been engaged to investigate Mrs. Marwood’s death. Until I am satisfied, no one is to leave the premises or alter anything in this garden.” His voice carried across the terrace, firm but not unkind. He saw Beatrice’s lips part as if to protest, but she only nodded, her eyes fixed on the ground. Charles’s jaw worked, but he said nothing. Daphne gathered her courage and met Arthur’s gaze, her hands twisting in her apron. Edward merely shrugged, but his stance grew more rigid, a man bracing himself for a storm.

Arthur’s mind worked methodically through the details. The stopped watch, the sundial’s shadow, the precise geometry of the gnomon at forty-five degrees—each pointed to a timeline that refused to align with the household’s narrative. The weather condition recorded in the estate’s log confirming shadow visibility was clear skies, a fact that left no room for ambiguity. If the sundial’s shadow was so distinct, then the time it marked could not be dismissed as coincidence. Yet the servants’ testimonies, delivered with the anxious precision of the well-drilled, all agreed on a different hour. The contradiction was not merely academic; it was the fulcrum upon which the entire case would turn.

He allowed himself a single, silent moment of relief—a brief, ironic recognition that even in death, Edith Marwood had managed to disrupt the careful choreography of Marwood Manor. The household, for all its rituals and routines, was now suspended in uncertainty. Arthur glanced once more at the sundial, its shadow stretching across the cold stone, and knew that the answers he sought would not come easily. The winter day was only just beginning, and already the shadows had grown long.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Conflicting Clocks
"You’ll forgive me, but I must ask again—precisely when did you last see Mrs. Marwood alive?" Arthur’s voice cut through the hush of the manor hallway, its echo mingling with the faint creak of floorboards beneath his polished shoes. The air was thick with the scent of damp wool and the lingering chill from the garden, where the morning’s drizzle still streaked the leaded windows. Outside, the pale daylight struggled through overcast skies, casting a wan glow across the tiled floor and the cluster of uneasy faces before him. The household stood arrayed in uneasy formation: Beatrice Hargrave closest, her gloved hands twisting a handkerchief; Charles Whitmore, his gaze fixed on the grandfather clock; Daphne Sinclair, half-shadowed near the entrance; and Edward Marwood, arms folded, jaw clenched, eyes darting between Arthur and the garden beyond.

Arthur’s mind lingered on the contradiction that had unsettled him in the garden: the sundial’s shadow, sharp and unwavering, had lain across Edith Marwood’s stopped watch at an angle that could not be mistaken. The length and direction of that shadow, matched against the face of the watch, told a story at odds with every account he had gathered so far. The servants had insisted, with the precision of the well-drilled, that Edith had been seen alive shortly before sunset. Yet the evidence—cold, impartial—spoke otherwise. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, was unmistakable: half past three in the afternoon. Arthur felt the weight of this detail pressing against the neat edifice of their testimonies.

He allowed the silence to stretch, watching as discomfort flickered across the faces before him. The contradiction was not a matter of idle curiosity; it was a wedge, prying at the carefully synchronized accounts. If the sundial’s shadow and the stopped watch both pointed to half past three in the afternoon, then the entire household’s narrative—insisting on a death near sunset—was suddenly suspect. Either the evidence was misleading, or someone was lying with remarkable discipline. Arthur’s suspicion deepened: the alignment of the sundial’s shadow was not a detail easily forged, especially given the weather condition recorded in the estate’s log confirming shadow visibility as clear skies. He resolved to test the household’s unity of recollection, one voice at a time.

"It was just before dusk, I’m certain," Beatrice said, her voice pitched low, eyes averted. "I’d gone to fetch a wrap from the cloakroom—Edith was still out on the terrace. The light was fading, you see." She dabbed at her cheek, but Arthur noted the absence of tears. Her composure was brittle, the performance too studied. He wondered if it was fear or calculation that stiffened her posture. Beatrice’s reputation for ambition was well known, but her relationship with Edith had been fraught of late. If she was lying, it was not for lack of practice.

Charles Whitmore cleared his throat, the sound abrupt in the hush. "I was in the library, reviewing the estate ledgers. The household schedule is quite fixed—tea at four, dinner at half past six. Edith was always prompt. I recall glancing at the clock as the gas lamps were lit—just after four, I believe. She had not yet returned." His tone was flat, almost bored, but his eyes flicked to Arthur as if searching for approval. The solicitor’s loyalty to the family was a matter of record, but Arthur sensed a deeper anxiety beneath the veneer of professionalism. Charles’s grip on his portfolio tightened imperceptibly, betraying a man under pressure.

"I was in the kitchen, sir," Daphne offered, her accent softening the edges of her words. "Preparing for supper. Mrs. Marwood came by for a word about the silver, then left for the terrace. I saw her through the window, plain as day. It were just before the sun dipped behind the hedge." Her hands twisted the hem of her apron, knuckles white. Daphne’s loyalty was legendary, yet Arthur recalled Edith’s knowledge of her past—a secret that could shatter her position. Was Daphne protecting herself, or someone else?

Edward Marwood’s response was brisk, almost impatient. "I was in my study from one until four. I’ve said as much already. If you’re looking for inconsistencies, you’ll find none with me." His tone was clipped, the words edged with irritation. Yet Arthur noted the way Edward’s gaze lingered on the garden, then flicked away. The heir’s restlessness was palpable, a man accustomed to command but now corralled by suspicion and circumstance. If Edward felt the walls closing in, he masked it with bluster.

Arthur let their statements settle, then stepped toward the window overlooking the garden. The wintry light was thin, the terrace slick with rain. He replayed the morning’s discovery: the sundial’s gnomon set at forty-five degrees, the shadow slicing across the watch face, the time fixed in silent accusation. If the servants’ accounts were true, the shadow should have been longer, the angle altered by the lowering sun. Instead, the evidence pointed to a moment well before sunset—half past three in the afternoon—when the sky was still bright and the shadow crisp. The contradiction was not merely technical; it was foundational. Someone had orchestrated a story, and the household had rehearsed it well.

He turned back to the group, his expression unreadable. "The details matter," Arthur said, voice measured. "Shadows do not lie, though people sometimes do—intentionally or otherwise. I will need to speak with each of you again." His words landed with a quiet finality, and he watched as Beatrice’s gaze darted to Charles, then to Daphne. The unity of their testimonies now seemed less like solidarity and more like a pact. The first fissures of doubt had begun to show.

As the household dispersed, Arthur lingered in the hallway, the cold seeping through the stone beneath his feet. He replayed each account, weighing tone against detail, posture against word. The contradiction between the sundial’s evidence and the servants’ timeline was no longer a curiosity—it was a lever. The original meaning of the clue had been simple: a time of death, a fixed point. Now, its revised meaning was more sinister: a deliberate distortion, a coordinated deception. The investigation had shifted. The question was no longer when Edith had died, but why so many were invested in obscuring the true hour.

A faint, ironic relief touched Arthur as he watched the household retreat to their separate routines. Even in death, Edith Marwood had managed to upend the choreography of Marwood Manor. The winter day pressed on, the air heavy with secrets, and Arthur knew the next conversation would matter more than any clock or shadow.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Ledger and Shadow
By the time the pale winter afternoon pressed its chill against the tall windows of the study, Arthur Langley found himself alone amid the hush and faint crackle of the fire. The air carried the scent of old paper and a trace of peat smoke, mingling with the sharper tang of ink. A ledger—its spine creased, pages thick with entries—lay open on the desk, the faint glow of lamplight casting long shadows across the columns of figures. Outside, the garden was a blur of grey and damp, the terrace slick with rain and the sundial standing sentinel beneath the overcast sky. Arthur’s fingers, cold despite his gloves, turned a page and paused: the ink on several entries shimmered differently, some lines still glistening faintly, others faded to a dull brown. The dates—carefully penned—marched past the hour the servants had so insistently claimed for Edith Marwood’s death.

He leaned closer, tracing the sequence of numbers with the tip of his pencil. The financial entries, supposedly recorded before Edith Marwood’s death, bore dates and times that extended well into the disputed window. Here was a payment for coal, noted at 'four fifteen', and there, a notation for a telegram dispatched at 'half past four'. The ink, too, betrayed a hurried hand: some lines bled into the paper as if written in haste, while others bore the crispness of a practiced scribe. The inconsistency was unmistakable. If the household’s narrative were to be believed, these entries could not exist. The ledger, it seemed, was quietly at war with the testimonies.

Arthur’s mind worked methodically through the implications. If the ledger was accurate, then the servants’ timeline—so tidily recited—was fatally compromised. Either the entries had been fabricated after the fact, or the household had rehearsed a fiction to shield someone from scrutiny. The presence of fresh ink among older, settled lines suggested more than mere clerical error. It was a silent accusation, one that pointed to deliberate manipulation. He felt a prickle of unease: the ledger did not merely contradict; it accused.

A memory surfaced—Edith Marwood’s voice, measured and low, recounting her confrontation with Edward Marwood only days before her death. She had spoken of ledger falsifications, of her determination to bring the estate’s affairs into order. Arthur recalled the way her eyes had flashed with a mixture of fear and resolve as she described Edward’s reaction: a brittle composure, a refusal to meet her gaze, the clipped retort that the estate’s future was not her concern. The confrontation, documented in her own hand on a slip of notepaper now tucked within the ledger’s cover, was dated the day before she died.

He drew the note from its place and read Edith’s careful script: 'Confronted Edward regarding discrepancies—denied knowledge, became agitated. Insisted all was in order. Will review entries myself.' The words were precise, the hand steady. Yet Arthur could almost hear the tension beneath the surface, the effort to maintain control in the face of mounting anxiety. Edith had not been a woman easily rattled, but the prospect of betrayal from within her own household had clearly unsettled her.

Arthur set the note aside and returned to the ledger, cross-referencing the entries against the household’s daily schedule. The contradictions multiplied. If Edith had died when the servants claimed, the coal delivery and telegram could not have been recorded in her hand. If, instead, the ledger told the truth, then the entire household had colluded—wittingly or not—in obscuring the true hour of her death. The evidence was damning in its quiet way, a ledger’s worth of numbers undermining the facade of order.

A soft knock broke the silence. Edward Marwood entered, his silhouette framed by the dim afternoon light. He wore his impatience like a second coat, shoulders tense, jaw set. 'Still at the books, Mr. Langley?' he asked, voice brisk. 'If you’re hoping to find a fortune hidden in those pages, you’ll be disappointed. The estate’s finances are as dull as the weather.'

Arthur did not look up at once. 'Dullness has its own charms. Though these entries—' he tapped the page with his pencil—'seem unusually lively for a winter’s afternoon. Coal delivered at four fifteen, a telegram at half past four. Yet I was told Mrs. Marwood was already dead by then. Curious, don’t you think?'

Edward’s eyes narrowed, a flicker of something—annoyance, or perhaps alarm—passing over his features. 'The staff aren’t accountants, Langley. They muddle times, forget details. I doubt Edith would have bothered herself with the ledgers so late in the day.' He crossed to the window, gaze fixed on the sodden terrace. 'If you’re suggesting I had a hand in any of this, you’ll need more than smudged ink and idle speculation.'

Arthur allowed a small, dry smile. 'Idle speculation can be surprisingly productive. Especially when the facts refuse to cooperate.' He closed the ledger with a deliberate motion, the thud echoing in the quiet. 'Tell me, Mr. Marwood—where were you at four o’clock yesterday?'

Edward’s reply was immediate, almost rehearsed. 'In my study. As I’ve said. The estate’s correspondence doesn’t write itself.' His tone was clipped, but a muscle twitched along his jaw. 'If you’re quite finished, I have business to attend to.'

Arthur regarded him for a long moment, weighing the performance. Edward’s confidence was brittle, the veneer of control thinning at the edges. The confrontation with Edith, the ledger’s silent testimony, the staff’s rehearsed timeline—all pointed to a pressure mounting beneath the surface. Arthur sensed that Edward’s fear was not merely of accusation, but of exposure: the possibility that the careful order he had imposed upon the estate might unravel under scrutiny.

He let the silence stretch, then spoke quietly. 'One last thing, Mr. Marwood. The sundial in the garden—its shadow was remarkably precise yesterday. The watch on Mrs. Marwood’s wrist, stopped at half past three in the afternoon, bore the mark of that shadow. Yet the weather condition recorded in the estate’s log confirming shadow visibility was clear skies. The angle of the sundial’s gnomon, as you know, is forty-five degrees. The evidence, in short, is uncooperative.'

Edward’s expression tightened. 'Shadows are for poets and gardeners, Langley. I prefer facts.' He moved to the door, pausing with his hand on the knob. 'If you find any, do let me know.' The door closed behind him with a muted click, leaving Arthur alone with the ledger and the growing sense that the truth, like the winter light, was slipping away by degrees.

Arthur returned to the window, watching as the garden faded into the gathering dusk. The sundial stood mute amid the damp flagstones, its shadow lengthening as the day waned. He considered the contradiction: the servants’ testimonies, the ledger’s stubborn entries, the sundial’s silent accusation. Each piece fit uneasily with the others, as if someone had taken pains to arrange a tableau that would not withstand close inspection.

He jotted a final note in his pocketbook, the scratch of his pen loud in the quiet. The investigation had shifted: the question was no longer simply who had killed Edith Marwood, but how so many could have conspired—by intent or omission—to obscure the truth. The ledger’s inconsistencies, the confrontation Edith had recorded, the sundial’s shadow all pointed to a deliberate manipulation of time and memory. Yet the method remained elusive, a mechanism glimpsed only in the corner of the eye.

A faint, ironic relief touched Arthur as he closed the ledger. Even in the labyrinth of Marwood Manor, with its rituals and routines, the truth had a way of seeping through the cracks. He would follow the shadow, the ink, the silence—whatever it took. For now, the winter afternoon pressed on, the study dimming, the garden beyond shrouded in uncertainty.
--- END PRIOR CHAPTER 3 ---

# Case Overview
Title: The Sundial Shadow Conspiracy
Era: 1930s
Setting: Marwood Manor, Little Middleton, Yorkshire
Crime: murder (stabbing)
Culprit: Edward Marwood
Victim: Edith Marwood
False assumption: The victim was murdered shortly before sunset as all household servants consistently testified.
Cast: Edith Marwood (she/her), Arthur Langley (he/him), Beatrice Hargrave (she/her), Charles Whitmore (he/him), Daphne Sinclair (she/her), Edward Marwood (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Marwood Manor, Little Middleton, Yorkshire). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Marwood Manor, Little Middleton, Yorkshire" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Edith Marwood — she/her/her (NEVER he/him)
• Arthur Langley — he/him/his (NEVER she/her)
• Beatrice Hargrave — she/her/her (NEVER he/him)
• Charles Whitmore — he/him/his (NEVER she/her)
• Daphne Sinclair — she/her/her (NEVER he/him)
• Edward Marwood — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Motives Surface",
    "setting": {
      "location": "Library and drawing room",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Understated tension with veiled hostility"
    },
    "characters": [
      "Arthur Langley",
      "Beatrice Hargrave",
      "Charles Whitmore",
      "Daphne Sinclair",
      "Edward Marwood"
    ],
    "purpose": "Reveal multiple plausible motives and introduce a misleading clue",
    "cluesRevealed": [
      "clue_14",
      "rh_1",
      "rh_2"
    ],
    "dramaticElements": {
      "conflict": "Edward’s nervous behavior contrasts with others’ calm",
      "tension": "Red herrings support the false assumption of sunset murder",
      "microMomentBeats": [
        "Beatrice Hargrave quietly observes Edward’s agitation, her own fears concealed"
      ]
    },
    "summary": "Langley interviews suspects revealing Edward Marwood’s secretive notes hinting at fear of scandal and premeditation. Red herrings arise as servants and household schedules support the sunset murder timeline. Multiple motives emerge but the detective remains cautious, sensing deception beneath the surface.",
    "beat": "motives",
    "estimatedWordCount": 2200,
    "emotionalRegister": "The sundial shadow evidence and ledger discrepancies force a reassessment of the murder timeline.",
    "dominantCharacterNote": {
      "name": "Arthur Langley",
      "voiceRegister": "Arthur’s speech is clipped and precise, with a dry wit that punctuates his observations economically."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Arthur Langley",
      "form": "dry_wit",
      "condition": "Humour only when it serves to highlight irony or social tension without downplaying seriousness."
    },
    "eraTextureNote": "Communication limited to domestic telephones on party lines and telegrams; Transportation mostly by petrol-powered automobiles and limited passenger trains; Manor estate access tightly controlled with strict visitor logs and locked areas; Manual typewriters and handwritten correspondence remain primary record-keeping methods; Short winter daylight hours restrict outdoor activity and investigation timing; Household schedules and social protocols constrain movement and interactions",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Edith Marwood        | she/her/her/herself       | [fill in]     | [yes/no]
  Arthur Langley       | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Hargrave    | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Whitmore     | he/him/his/himself        | [fill in]     | [yes/no]
  Daphne Sinclair      | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Marwood       | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
