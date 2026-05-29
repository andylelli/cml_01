# Actual Prompt Record

- Run ID: `mystery-1779993526746`
- Project ID: ``
- Timestamp: `2026-05-28T18:46:40.618Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `2d6b22d6f19196f8`

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
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit’s motive stems from desperate protection of a family secret, blurring lines between justice and self-preservation." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Professional Rival / Suspect
   - Captain Ivor Hale: Powerful Patriarch Rival / Suspect
   - Beatrice Quill: Loyal Staff with Hidden Ambitions / Suspect
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1935-02
In February 1935, life at an isolated Yorkshire manor unfolds beneath pervasive dampness and chill air typical of winter in rural England. The estate is enveloped by overcast skies and intermittent drizzle, with short days that fade swiftly into dusk by mid-afternoon. Within the manor’s heavy stone walls, gas lamps and crackling fireplaces provide scarce warmth and light, casting flickering shadows that mirror the quiet tensions simmering beneath the surface. Social rituals and strict hierarchies govern movement and interaction, while the family and staff alike navigate the pressures of economic austerity and looming international unrest. Men wear formal wool suits and polished shoes, women favor modest yet elegant wool dresses and accessories, and all adhere to decorum that balances tradition with an uneasy awareness of changing times. News from afar, including the Abyssinian Crisis and rising fascism, filters into the manor via battery-powered radios, coloring conversations and anxieties. Daily life is structured and disciplined, with servants bound by strict schedules and the landed gentry maintaining distance and authority. The manor feels like a microcosm of a world in flux—where old order confronts modern uncertainties, and every shadow may conceal secrets waiting to surface.
Emotional register: A pervasive atmosphere of restrained anxiety and watchfulness shadows daily life.
Physical constraints: Reliance on mechanical clocks and sundials for timekeeping | Limited telephony with rotary dial and party line exchanges | Restricted access to remote rural estates via muddy country lanes | Staff movements tightly controlled within the manor to preserve hierarchy
Current tensions (weave into background texture): Economic hardship from the Great Depression straining landed estates | Growing international tensions due to the Abyssinian Crisis and fascist expansion | Domestic political debates over unemployment relief and rearmament funding
Wartime context — Britain remains at peace but is increasingly alert to looming global conflicts.: Traditional class and gender roles dominate, though subtle shifts hint at forthcoming change. Absence effect: Many men have not yet been called to military service, but the threat of war looms quietly.

## Story Theme
This mystery explores how rigid social conventions and mechanical ingenuity intertwine to conceal truth within a closed, hierarchical society, revealing that appearances and accepted timelines can be deliberately manipulated to mask culpability.

## Story Emotional Register
Dominant: A steadily intensifying atmosphere of tense scrutiny and psychological unease, marked by subtle shifts from calm order to charged confrontation.

Arc:
The story opens enveloped in the heavy stillness of Wychwood Manor, where the discovery of the lord's murder casts a long, oppressive shadow over the estate. The atmosphere is thick with quiet shock, underscored by the damp, muted winter surroundings and the manor’s rigid social order, setting a tone of somber gravity and measured restraint. This initial weight draws the characters inward, each grappling with the implications of the crime within their constrained roles.

As Eleanor Voss begins her investigation, an undercurrent of rising unease permeates the narrative. Early clues—reversed dust patterns on the pendulum bob and the open clockmaker’s manual—introduce subtle contradictions that unsettle accepted truths. The tension mounts not only through facts but through the emotional toll on the household; suspicion weaves quietly among the staff and family, and trust frays under the strain. The investigative process is meticulous, marked by careful questioning and guarded revelations, mirroring the manor’s slow, watchful pulse.

Midway, a pivotal turn emerges when the detective grasps the full significance of the clock tampering. This revelation forces a reevaluation of all prior assumptions, shifting the emotional tone from tentative inquiry to focused determination. The deliberate manipulation of time unsettles the household’s fragile order, exposing vulnerabilities and hidden motives. This shift reorients the story’s emotional energy, as the characters confront not just a physical crime but an assault on their perception of reality.

The second pivot intensifies the narrative as new evidence ties Captain Ivor Hale’s presence and motives directly to the clock’s reversal, casting a sharper light on his desperation and duplicity. The emotional register deepens into tension and unease, with mounting pressure on the detective to unravel the complex deception. The manor’s atmosphere thickens with suspicion, and the characters’ facades begin to crack under the weight of impending confrontation.

Approaching the climax, the.

## Emotional register at this point in the story
A heavy, somber atmosphere envelops the manor following the shocking discovery of the lord’s murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the steadfast guardian of tradition within the manor, her composed demeanor a bulwark against the uncertainties of the 1930s. Her unwavering commitment to preserving the estate’s order reflects the landed gentry’s struggle to maintain social hierarchy amid economic strain and societal shifts. Her subtle resentment of the younger generation’s changing values highlights the tension between old customs and emerging modern attitudes. Eleanor’s role as detective and matriarchal figure situates her at the crossroads of tradition and transformation, navigating a world where the established order is both a source of strength and vulnerability.
Era intersection: Her dedication to order and tradition collides with the era’s social upheavals, fueling her personal conflict and shaping her investigative resolve.

### Dr. Mallory Finch
Mallory Finch represents the rising professional woman of the 1930s, eager to assert modern medical practices within a conservative rural community. Her ambition and unorthodoxy place her at odds with traditional expectations, and her guarded disposition reflects the precarious position of women pushing boundaries in a male-dominated society. Mallory’s internal struggle between ideals and ethical compromises mirrors wider tensions surrounding progress and conformity during this period. Her presence in the manor underscores the friction between innovation and established norms amid economic and social pressures.
Era intersection: Her career ambitions and ethical dilemmas embody the challenges faced by women seeking independence and respect in a transforming but still restrictive society.

### Captain Ivor Hale
Captain Ivor Hale is the embodiment of a fading aristocratic ideal, his military discipline and stoic demeanor masking desperate financial straits that threaten his family’s legacy. His rigid adherence to tradition and authority reflects the landed gentry’s struggle against economic decline in the 1930s. Hale’s covert debts and mounting pressures reveal the fragility underlying his public façade. His internal conflict between pride and survival encapsulates the era’s uncertainties for the upper classes. His presence in the manor is a reminder of both the endurance and vulnerability of established power during a time of societal and political upheaval.
Era intersection: His personal desperation and social standing intertwine with the era’s economic austerity and shifting class dynamics, driving his drastic actions.

### Beatrice Quill
Beatrice Quill personifies the loyal yet ambitious servant navigating the rigid hierarchies of 1930s country house life. Her strict discipline and sharp wit mask anxieties about job security amid economic pressures and changing household structures. Beatrice’s simmering resentment and fear of displacement highlight the precarious position of domestic staff during the Great Depression. Her role reflects the tension between loyalty to tradition and the drive for personal survival within a tightly controlled social order. Her presence underscores the complexities of class relations and the subtle power struggles beneath the surface of manor life.
Era intersection: Her ambitions and insecurities are shaped by the era’s economic hardships and the evolving social roles of domestic workers in a declining aristocratic world.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with measured precision and calm authority, her voice steady and formal, occasionally laced with dry, understated wit.
[comfortable] It is essential we maintain order; chaos serves no one here. One must observe closely and think beyond what is immediately apparent.
[evasive] I prefer not to speculate without all the facts at hand. Rumours do little good in a matter so delicate.
[stressed] Despite all my efforts, the threads of this mystery seem to twist ever tighter. We must not allow the truth to slip away.
Humour: Eleanor’s dry wit surfaces as subtle irony and wry remarks, revealing a sharp mind beneath her composed exterior.

### Dr. Mallory Finch (she/her/her)
Mallory’s tone is clipped and brisk, often edged with sardonic sarcasm and rhetorical sharpness, reflecting impatience and intelligence.
[comfortable] Progress demands we question old methods; clinging to tradition has its limits, as I trust you understand.
[evasive] I was fully occupied elsewhere; the timing is unfortunate but beyond my control, I assure you.
[stressed] You suggest I had motive? Such accusations are as damaging as they are unfounded; consider the consequences carefully.
Humour: Her humour is sharp and sardonic, a defensive shield against the rigid world she challenges.

### Captain Ivor Hale (he/him/his)
Hale’s speech is clipped and formal, with military precision and occasional dry, self-deprecating remarks that hint at underlying vulnerability.
[comfortable] Discipline and order are the cornerstones of any well-run household—and life, I dare say.
[evasive] I was alone in the billiard room, as always at that hour. No need for unnecessary speculation.
[stressed] This situation tests even the most steadfast of men. I assure you, I bear no ill will nor guilt.
Humour: Hale’s sparse humour is dry and self-effacing, softening his stern public image.

### Beatrice Quill (she/her/her)
Beatrice’s voice is clipped, formal, and precise, often wielding polite but cutting remarks that veil sharp insight.
[comfortable] The household runs smoothly when every cog does its part; it is not a place for slackers or sentimentalism.
[evasive] I was engaged with preparations and duties, as any good housekeeper would be; I see no reason to dwell on idle conjecture.
[stressed] Rumours and whispers serve no one here; the truth will out, whether we like it or not.
Humour: Her humour is polite savagery, veiled in courteous language that subtly undermines and challenges.

## Location Registers (scene framing guides)

The Library: The library feels like the guarded heart of the manor, where the weight of tradition and secrecy press heavily. The dim light, scent of beeswax polish, and shadowed corners create an atmosphere thick with unspoken tension and the lingering presence of the victim’s final moments. It is a place of intellectual refuge turned crime scene, where every detail is scrutinized and the quiet is almost reverent yet charged with suspicion.. Camera angle: Approach with a sense of solemn respect and heightened scrutiny, aware that every shadow and object holds potential secrets.. Era: Access is strictly controlled to preserve privacy and evidence integrity, reflecting the social hierarchy and investigative caution of the era.

The Family Wing: The family wing exudes a restrained, intimate tension, where ancestral weight and social expectations confine its occupants. The soft firelight and heavy drapes offer warmth yet also emphasize the isolation and guarded nature of family life. Secrets and private conversations linger behind closed doors, creating an atmosphere thick with quiet unease and the pressure of unspoken truths.. Camera angle: Observe with an air of distance and careful attention, sensing the layers of formality and repression beneath the surface.. Era: Strictly limited access preserves social boundaries and privacy, underscoring the rigid class distinctions of the time.

Servants’ Quarters: The servants’ quarters feel utilitarian and subdued, reflecting the constrained lives and unacknowledged labors of the household staff. The dim lighting, simple furnishings, and mingled scents of soap and cooking create a backdrop of quiet endurance. The space is both refuge and cage, marked by strict routines and limited freedom, where loyalty and ambition simmer beneath the surface.. Camera angle: Enter with empathy and awareness of the social tensions and unspoken dynamics that shape daily life here.. Era: Staff movements are closely monitored and controlled to maintain order and social hierarchy.

The Formal Gardens: The formal gardens present a serene yet somewhat melancholic space, where the order of clipped hedges and weathered statues contrasts with the damp, muted autumnal atmosphere. The gardens offer a fleeting sense of freedom and contemplation, yet the enclosing stone walls and fog lend an air of isolation and subtle foreboding, mirroring the tensions within the manor.. Camera angle: View with reflective melancholy, capturing both the beauty and the underlying sense of confinement.. Era: Access is restricted after dusk, reflecting concerns for security and propriety.

## Humour guidance for this story position (opening)
Permission: conditional — condition: Only subtle, dry wit from Eleanor Voss to relieve tension without diminishing gravity.
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: The opening sets a serious tone, so humour is limited to understated remarks from a composed character to maintain atmosphere.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The manor’s grand clock displays the accurate time of the victim’s death and thus can be trusted to establish the murder timeline.
- Hidden truth to progressively expose: That the clock was deliberately tampered with to display a time forty minutes earlier than actual, creating a false alibi and misleading all temporal evidence.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern. | corr: The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward. | effect: Narrows timing constraint by invalidating the displayed clock time as accurate for alibis.
  - Step 2: obs: A clockmaker's manual found open near the clock tower details the effects of reversing pendulum swing and winding direction on time display. | corr: The presence and position of this manual imply premeditated use of the reversed pendulum principle to alter clock time. | effect: Eliminates accidental tampering; implies deliberate manipulation, focusing suspicion on those with access and knowledge.
  - Step 3: obs: The winding key found in the servants’ quarters has fresh oil residue matching the clock’s interior, inconsistent with scheduled maintenance records. | corr: Someone recently used the winding key to manipulate the clock, contradicting official maintenance timing. | effect: Narrows suspects to those with access to servants’ quarters and clock winding key during the murder window, eliminating Dr. Finch due to distance.
  - Step 4: obs: Gardener's testimony places Captain Ivor Hale near the clock tower around quarter past three, the time the clock showed but not the true time of death. | corr: Captain Hale had opportunity to access and manipulate the clock, exploiting the false clock time for his alibi. | effect: Focuses suspicion on Captain Hale as the only suspect with both motive and opportunity.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled demonstration comparing the pendulum bob’s dust wear and the clock’s mechanical reaction to forward and backward winding is conducted, exposing the reversed swing and the clock’s backward time display. The test also reveals the timing mismatch between the clock’s displayed time and actual elapsed time during the demonstration, proving the deliberate clock tampering by Captain Ivor Hale.
- Test must rely on already-shown clue IDs: clue_11, clue_mechanism_visibility_core, clue_1
- Fair-play rationale: Step 1: The reversed dust pattern on the pendulum bob (early clue) contradicts the assumed forward swing, exposing tampering. Step 2: The open clockmaker’s manual (mid clue) reveals the reversed pendulum principle, indicating deliberate manipulation. Step 3: The fresh oil residue on the winding key from the servants’ quarters (mid clue) ties recent clock access to someone with access there. Step 4: The gardener’s testimony (late clue) places Captain Hale near the clock tower at the critical time, linking opportunity with motive. The discriminating test synthesizes these facts by physically demonstrating the clock’s backward time display, defini
[truncated for prompt budget]

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with measured precision, favoring formal phrasing and a calm, steady cadence
Occasionally lets slip a wry remark, delivered with subtle irony and a knowing glance, revealing a sharp mind beneath her composed facade.
Eleanor wrestles with a guilt-laden fear that her rigid adherence to tradition may blind her to changing realities, potentially alienating those she wishes to protect. She is torn between loyalty to the past and the necessity for adaptation.

### Dr. Mallory Finch (she/her — NEVER he/him)
Speaks quickly and with a clipped tone, often lacing her words with sharp, sardonic wit
She has a habit of punctuating tense moments with biting remarks and rhetorical questions, revealing impatience with what she views as outdated thinking.
Mallory battles the fear that her ambition and unorthodox methods will forever estrange her from the community she wishes to serve. She struggles with guilt over her ethical lapses, even as she rationalizes them as necessary for progress.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a clipped, formal manner reminiscent of military precision, often punctuating statements with dry, self-deprecating remarks that belie a hidden vulnerability
Uses measured pauses and avoids unnecessary elaboration.
Captain Hale is tormented by the fear that his financial failings will irrevocably tarnish the family name he has fought to uphold. His pride clashes with desperation, creating a psychological battleground where honor and survival collide.

### Beatrice Quill (she/her — NEVER he/him)
Speaks with clipped precision and a formal tone, often employing polite yet cutting remarks that subtly undermine others
Her humour is sharp but veiled in courteous language, making her barbs all the more effective.
Beatrice struggles with loyalty to the family and her personal ambition, caught between preserving tradition and adapting to economic pressures. She fears losing not only her job but the respect she commands among the staff.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with measured precision, favoring formal phrasing and a calm, steady cadence. Occasionally lets slip a wry remark, delivered with subtle irony and a knowing glance, revealing a sharp mind beneath her composed facade.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It is essential we maintain order; chaos serves no one here. One must observe closely and think beyond what is immediately apparent."
  [evasive] "I prefer not to speculate without all the facts at hand. Rumours do little good in a matter so delicate."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A - Detective, no motive for murder." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Speaks quickly and with a clipped tone, often lacing her words with sharp, sardonic wit. She has a habit of punctuating tense moments with biting remarks and rhetorical questions, revealing impatience with what she views as outdated thinking.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Progress demands we question old methods; clinging to tradition has its limits, as I trust you understand."
  [evasive] "I was fully occupied elsewhere; the timing is unfortunate but beyond my control, I assure you."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Stood to lose her medical license after the victim threatened to report her unethical prescription practices to the medical board; murder was seen as the only way to prevent exposure and career destruction." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a clipped, formal manner reminiscent of military precision, often punctuating statements with dry, self-deprecating remarks that belie a hidden vulnerability. Uses measured pauses and avoids unnecessary elaboration.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Discipline and order are the cornerstones of any well-run household—and life, I dare say."
  [evasive] "I was alone in the billiard room, as always at that hour. No need for unnecessary speculation."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Feared the victim would expose his secret debts to the estate trustees, which would force him to sell family lands and lose status; murder was his desperate way to silence the threat." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks with clipped precision and a formal tone, often employing polite yet cutting remarks that subtly undermine others. Her humour is sharp but veiled in courteous language, making her barbs all the more effective.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The household runs smoothly when every cog does its part; it is not a place for slackers or sentimentalism."
  [evasive] "I was engaged with preparations and duties, as any good housekeeper would be; I see no reason to dwell on idle conjecture."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Faced imminent dismissal and loss of livelihood as the victim planned to downsize staff; saw murder as a final act of desperation to protect her position and influence in the household." — do not surface in Act I.



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

Primary Location: Wychwood Manor (Wychwood Heath, England)
An imposing traditional English manor set deep in the rural isolation of the Cotswold Hills, Wychwood Manor is surrounded by meticulously kept formal gardens and dense woodland, embodying a world of rigid social hierarchy and secretive family affairs.

Key Locations Available:
- The Library (interior): Crime scene
- The Family Wing (interior): Restricted family living quarters and private meeting space
- Servants’ Quarters (interior): Staff living and working space
- The Formal Gardens (exterior): Outdoor gathering space and route between manor and estate grounds

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, reflecting social unease during the Great Depression and rising political unrest in Europe
Weather: damp, overcast skies with intermittent drizzle typical of English countryside in autumn

Era markers: domestic rotary dial telephones with party-line exchanges | mechanical typewriters common in offices and households | battery-powered portable radios for news and entertainment

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Wychwood Heath, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
The Library (interior):
  - Visual: candlelight flickering on dark oak, rain-streaked mullioned window panes, stacked leather-bound books
  - Sounds: soft crackle of dying fire, distant ticking of mantel clock, rustling of heavy curtains
  - Scents: beeswax and cold ash, old leather bindings, faint woodsmoke from hearth
  - Touch: smooth polished oak desk, velvet curtain folds

The Family Wing (interior):
  - Visual: antique oil portraits in gilded frames, softly patterned wallpaper, polished hardwood floors
  - Sounds: muffled footsteps on polished floors, quiet murmurs behind closed doors, gentle crackle of fires
  - Scents: lavender sachets in drawers, warm beeswax polish, smoke from burning coal
  - Touch: smooth silk upholstery, cool polished wood banisters

Servants’ Quarters (interior):
  - Visual: faded paint on walls, simple wooden bedframes, linen folded on shelves
  - Sounds: clatter of pots and pans, footsteps on stone floors, low murmurs of staff
  - Scents: soap and damp cotton, cooking stew aromas, wet earth from garden
  - Touch: rough cotton sheets, cool stone floor

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
-
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In February 1935, life at an isolated Yorkshire manor unfolds beneath pervasive dampness and chill air typical of winter in rural England
- The estate is enveloped by overcast skies and intermittent drizzle, with short days that fade swiftly into dusk by mid-afternoon
- Within the manor’s heavy stone walls, gas lamps and crackling fireplaces provide scarce warmth and light, casting flickering shadows that mirror the quiet tensions simmering beneath the surface
- Social rituals and strict hierarchies govern movement and interaction, while the family and staff alike navigate the pressures of economic austerity and looming international unrest
- Men wear formal wool suits and polished shoes, women favor modest yet elegant wool dresses and accessories, and all adhere to decorum that balances tradition with an uneasy awareness of changing times

TEMPORAL CONTEXT:

This story takes place in February 1935 during winter.

Seasonal Atmosphere:
- Weather patterns: damp, chill air with pervasive overcast skies, frequent light drizzle and mist enveloping the countryside, muddy grounds and frost patches during early mornings
- Daylight: short winter days with daylight from about 8:15 AM to 5:15 PM, dusk falling swiftly by mid-afternoon
- Seasonal activities: engaging in indoor card and parlour games by the fire, attending or hosting formal dinner parties to break winter monotony, walking the estate grounds in damp weather with heavy coats and waterproof boots
- Seasonal occasions: St. Valentine's Day (February 14th)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits in charcoal or navy with wide lapels, silk cravats or narrow ties with subtle patterns, stiff detachable collars paired with polished oxford shoes
- Men casual: tweed sports jackets with patch pockets and elbow patches, knitted wool vests layered under overcoats, plus-fours or knickerbockers worn with heavy wool socks
- Men accessories: fedoras or homburg hats in felt, leather gloves lined with cashmere, pocket watches with chain attached to waistcoat buttonholes
- Women formal: bias-cut silk evening gowns with modest necklines and long sleeves, fur-trimmed evening coats and stoles, lace gloves and cloche hats adorned with subtle feathers
- Women casual: wool jersey day dresses with pleated skirts and simple belts, knitted twinsets paired with mid-calf skirts, heavy wool stockings and sturdy leather shoes suitable for damp conditions
- Women accessories: small leather handbags with metal clasps, brooches featuring Art Deco geometric designs, silk scarves tied under the chin or around the neck

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby’s crooning hits gaining popularity in Britain, Duke Ellington jazz records imported and appreciated by upper-class youth, British dance bands like Jack Hylton Orchestra dominating dance halls; Films: The 39 Steps (Alfred Hitchcock, 1935) thrilling audiences with suspense, Mutiny on the Bounty (1935) epic adventure captivating cinema-goers; Theatre: Noël Coward’s light comedies remain popular in London’s West End, revivals of Shakespearean plays in regional theaters; Radio: BBC’s 'In Town Tonight' engaging listeners with celebrity interviews, News bulletins increasingly relied upon for up-to-date world events
- Typical prices: loaf of bread: 4 pence, pint of milk: 1 penny, daily newspaper: 1 penny
- Current events: British government under Ramsay MacDonald navigating economic challenges amid the Great Depression; ongoing Abyssinian Crisis as Italy prepares to invade Ethiopia, stirring international tensions
- Literature: Agatha Christie’s 'Murder on the Orient Express' (1934) still widely read | T.E. Lawrence’s posthumously published 'Seven Pillars of Wisdom' attracting interest | George Orwell’s early essays beginning to appear in literary magazines | [detective and mystery fiction flourishing] | [modernist novels exploring social change] | [historical fiction with romanticized English settings]
- Technology: improvements in portable battery-powered radios making news accessible in rural homes | advances in fingerprint analysis techniques used by police | development of more reliable automatic
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

• [clue_1] Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The pendulum swing direction was reversed, indicating tampering with the clock mechanism.

• [clue_2] The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Overturns the assumption that the clock ran normally; it was manipulated to run in reverse.

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

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE]
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
Known location profile anchors: Wychwood Manor, The Library, The Family Wing, Servants’ Quarters, The Formal Gardens, Manor's Grand Hall
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Wychwood Manor", "The Library", "The Family Wing", "Servants’ Quarters", "The Formal Gardens", "Manor's Grand Hall"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Manor's Grand Hall". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6158; context=12179; dropped=[none]; truncated=[fair_play_contract, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic rotary dial telephones with party-line exchanges | mechanical typewriters common in offices and households | battery-powered portable radios for news and entertainment | telegrams sent via nearest town telegraph office with hours delay | telephone calls reliant on manual switchboard operators | postal mail with next-day delivery in urban areas, slower in rural.
5. Respect setting movement/access constraints in scene action and alibis: estate grounds enclosed by stone walls and wrought iron gates limiting access | manor layout includes private family wing, servant quarters, and common rooms | weather prone to fog and rain affecting visibility and outdoor evidence | estate roads and paths restrict movement to defined routes | limited vehicular access with single carriageway entrance.
6. Sustain social coherence with this backdrop pressure: Amidst the financial strains of the Great Depression, the landed gentry and their staff are confined within an isolated English manor where rigid social hierarchies and formal routines heighten tensions and suspicion after a mechanical clock-tampering murder disrupts their fragile order.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the pendulum swing and winding direction demonstration, Show dust wear pattern on pendulum bob matching reversed swing, Reveal timing mismatch between clock time and actual elapsed time, Conclude Captain Hale’s tampering and guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Verified alibi from village patient and lack of clock access
  Clues: Dr. Finch's claimed absence from manor, Scheduled maintenance records conflicting with winding key usage
- Beatrice Quill (Act 3, Scene 5): Confirmed presence in servants’ quarters with no access to clock tower
  Clues: Beatrice Quill’s servants’ quarters activity, Winding key location and access permissions
- Eleanor Voss (Act 3, Scene 5): Detective role and constant presence in public manor areas
  Clues: Eleanor Voss’s alibi window, No motive or opportunity

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with physical evidence of reversed pendulum wear, winding key residue, and timing demonstration

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation

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
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Manor's Grand Hall — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The pendulum swing direction was reversed, indicating tampering with the clock mechanism.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Overturns the assumption that the clock ran normally; it was manipulated to run in reverse.
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "Claims gardening in formal gardens during murder window". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Victim's body estimated time of death between quarter past three and half past three in the afternoon
- Established timeline fact: Grand clock showed time at quarter past three when body was discovered
- Established timeline fact: Witnesses reference clock time for their alibis
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Dust on the grand clock's pendulum bob showing reversed wear marks"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "The pendulum bob's dust wear suggests the clock's pendulum swing was reversed, casting doubt on the clock's reliability"
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Beatrice Quill mentions the grand clock face was pristine and showed quarter past three when the body was discovered — seeds false confidence in the clock's accuracy

# Case Overview
Title: The Reversed Pendulum Enigma
Era: 1930s
Setting: Isolated manor house on rural estate
Crime: murder (clock-tampering assisted temporal misdirection)
Culprit: Captain Ivor Hale
False assumption: The manor’s grand clock displays the accurate time of the victim’s death and thus can be trusted to establish the murder timeline.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Isolated manor house on rural estate). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Isolated manor house on rural estate" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "Manor's Grand Hall",
      "timeOfDay": "Afternoon, shortly after the body is found",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective; establish initial timeline",
    "cluesRevealed": [
      "clue_1",
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Tension as suspects react to the victim's death and clock time",
      "tension": "Suspects’ alibis tied to the grand clock’s displayed time",
      "microMomentBeats": [
        "Eleanor Voss quietly observes the room, masking a flicker of unease"
      ]
    },
    "summary": "Eleanor Voss, a visiting guest at the manor, arrives to find the victim dead in the Grand Hall. The grand clock shows quarter past three, the time everyone believes the murder occurred. Eleanor notices the dust on the pendulum bob shows unusual wear inconsistent with a normal swing.",
    "estimatedWordCount": 2000,
    "pivotElement": "Dust on the grand clock's pendulum bob showing reversed wear marks",
    "factEstablished": "The pendulum bob's dust wear suggests the clock's pendulum swing was reversed, casting doubt on the clock's reliability",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Beatrice Quill mentions the grand clock face was pristine and showed quarter past three when the body was discovered — seeds false confidence in the clock's accuracy"
    },
    "emotionalRegister": "A heavy, somber atmosphere envelops the manor following the shocking discovery of the lord’s murder.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with measured precision and calm authority, her voice steady and formal, occasionally laced with dry, understated wit."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "dry_wit",
      "condition": "Only subtle, dry wit from Eleanor Voss to relieve tension without diminishing gravity."
    },
    "eraTextureNote": "Reliance on mechanical clocks and sundials for timekeeping; Limited telephony with rotary dial and party line exchanges; Restricted access to remote rural estates via muddy country lanes; Staff movements tightly controlled within the manor to preserve hierarchy; Communication delays due to distance from nearby village centers",
    "locationRegisterNote": ""
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
□ Chapter 1: "Dust on the grand clock's pendulum bob shows reversed wear marks inconsistent with the normal forward swing pattern." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The pendulum swing direction was reversed, indicating the clock mechanism was tampered with to run backward." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
