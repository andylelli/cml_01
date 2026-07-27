# Actual Prompt Record

- Run ID: `run_6dc1ee3a-ae3c-453e-9644-090754bf4ca3`
- Project ID: `proj_592321de-fd84-4beb-9236-95406b91b4b1`
- Timestamp: `2026-07-24T16:41:49.113Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `d013a167c79a7344`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Inspector Gerald Havers[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Inspector Gerald Havers. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Gerald Havers (man), Lady Beatrice Langley (woman) — DECEASED, past-tense only, Charles Langley (man), Margaret Langley (woman), Edward Barnes (man), Agnes Crowley (woman), Thomas Radcliffe (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Gerald Havers, Lady Beatrice Langley, Charles Langley, Margaret Langley, Edward Barnes, Agnes Crowley, Thomas Radcliffe?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer exploited an architectural quirk to mask the time of death, raising questions about using the house’s own heritage as a weapon." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Lady Beatrice Langley. Name them — Lady Beatrice Langley — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Gerald Havers, Lady Beatrice Langley (DECEASED), Charles Langley, Margaret Langley, Edward Barnes, Agnes Crowley, Thomas Radcliffe
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Gerald Havers: Police Detective / Inspector
   - Lady Beatrice Langley: victim (DECEASED — does not appear in any scene, past tense only)
   - Charles Langley: Disgraced Heir
   - Margaret Langley: Social Climber
   - Edward Barnes: Trusted Confidant
   - Agnes Crowley: Household Enforcer
   - Thomas Radcliffe: Social Climber / Opportunist
   - Never place characters in locations inconsistent with their role

## FIRST-APPEARANCE SUSPECT INTRO CONTRACT (MANDATORY)
When a character below appears for the first time in this batch, their first beat must establish all of the following in natural prose:
1. Public identity (who they are in this household/social world)
2. Connection to the victim
3. Why they matter to the investigation now
4. Surface behaviour plus one subtle suspicious/emotional tell
5. The investigator's immediate read of that behaviour (provisional, not a verdict)
Bad (too thin): "Captain Hale stood nearby."
Good pattern: "Captain Hale, the household steward and the victim's trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain."
Use subtle pressure cues only. Do not write confessions or explicit guilt declarations in first appearances.

- Inspector Gerald Havers
  Public identity anchor: Police Detective Inspector; detective 
  Connection to victim: directly affected by Lady Beatrice Langley's death and its fallout.
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Calm under pressure.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Charles Langley
  Public identity anchor: Disinherited Eldest Son; suspect 
  Connection to victim: Husband to Lady Beatrice Langley.
  Investigation relevance: access plausibility: high | alibi window: Between quarter past and half past seven | opportunity channel: Access to bell tower and victim's chambers.
  Suspicion/pressure cue seed: Irritated during evening prayers.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Margaret Langley
  Public identity anchor: Socialite and Younger Daughter; suspect 
  Connection to victim: Lady Beatrice favored Margaret Langley, who sought to maintain her social standing through family wealth.; Lady Beatrice and Margaret Langley shared a complex mother-daughter dynamic, with Margaret's ambitions sometimes clashing with her mother's strict expectations..
  Investigation relevance: access plausibility: medium | alibi window: At dinner between quarter to and quarter past eight | opportunity channel: Access to servants' wing and gardens.
  Suspicion/pressure cue seed: Nervous when questioned.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1932-04
April 1932 in rural England is a time of delicate balance between lingering spring optimism and the harsh realities of economic hardship. On estates like Langley Manor, daily life is governed by strict social hierarchies and formal rituals, with servants and family alike bound by codes of discretion and duty. The air is often cool and damp, with intermittent fogs drifting through woodlands, lending a muted hush to the countryside. Technology such as party-line telephones and early radios connect these isolated estates tenuously to the wider world, while domestic electric lighting flickers against the encroaching dusk. Clothing reflects a blend of Art Deco influence and traditional modesty, emphasizing refinement despite austerity. The pervasive economic depression weighs heavily on landed gentry, who face financial pressures and social uncertainty, even as political tensions escalate in Europe. Social interactions are underscored by unspoken alliances and cautious deference, setting a tense but restrained stage for personal and familial dramas to unfold.
Emotional register: A prevailing mood of cautious reserve, tinged with anxiety over the future and the pressures of maintaining tradition amid upheaval.
Physical constraints: Reliance on manual typewriters and party-line telephones limiting rapid communication | Limited automobile use on unpaved estate roads slowing travel | Domestic electric lighting prone to flicker and occasional outages | Restricted access to information and news via scheduled radio broadcasts
Current tensions (weave into background texture): Britain’s National Government grappling with unemployment and austerity measures | Labour unrest marked by miners’ strikes increasing social instability | Rising influence of Adolf Hitler’s Nazi Party in Germany raising international anxiety
Wartime context — Britain is at peace in 1932, with no active wartime mobilization.: Military service is not a dominant social factor, but memories of the Great War still shape attitudes and class relations. Absence effect: Absent wartime pressures allow social tensions to simmer beneath the surface, manifesting in economic and political uncertainties.

## Story Theme
This mystery explores how appearances and social conventions can mask deeper truths, revealing that justice requires discerning beyond surface impressions and confronting uncomfortable realities within rigid class structures.

## Story Emotional Register
Dominant: The story's emotional tone is a slow-building tension woven with undercurrents of suspicion, social pressure, and the haunting weight of hidden truths.

Arc:
From the outset, the atmosphere is heavy with the shock of Lady Beatrice Langley’s death, casting a pall of solemnity and uncertainty over the grand but shadowed Langley Manor. The quiet autumnal setting, with its creeping fog and flickering lights, underlines the isolation and fragility of a family and staff caught in the web of a violent act. This opening mood invites the reader into a world where appearances conceal deeper fractures.

As Inspector Havers begins his investigation, subtle contradictions arise: inconsistent witness accounts of the bell’s chime, physical evidence that defies the accepted timeline, and the first hints of secret resentments among family and servants. The growing unease draws the reader deeper into a maze of social facades and half-truths, each clue sharpening the emotional stakes as suspicion ripples through the household.

Midway through the narrative, the investigation pivots dramatically with the revelation of the acoustic manipulation of the choir bell. This discovery reframes all prior assumptions, casting doubt on the reliability of witness testimony and the very timeline of the murder. The emotional impact is profound, as the neat order of events dissolves into a complex puzzle where sound and silence intertwine to deceive.

This second turn challenges both Havers and the reader to reconsider motives and opportunities, exposing the vulnerabilities and hidden agendas beneath the manor’s polished veneer. The tension escalates as the inspector narrows his focus on Charles Langley, whose desperate circumstances and access to the bell tower place him under intense scrutiny.

In the pre-climax and climax, mounting pressure culminates in the controlled choir bell ringing test, a tense and methodical confrontation with acoustic evidence that unmasks the culprit’s deception. The emotional intensity peaks as truth confronts denial, and the social order trembles under the weight of exposed betrayal.

Finally, the resolution carries a somber,.

## Emotional register at this point in the story
A somber and heavy mood settles with the shocking discovery of Lady Beatrice’s death, casting a shadow over the manor.

## Character Portraits (appearance & era)

### Inspector Gerald Havers
Inspector Havers embodies the tension of a professional man navigating the rigid class divides of 1930s England. Amidst widespread economic hardship, he serves as the impartial arbiter of justice within a world steeped in tradition and privilege. His methodical nature and dry wit reflect a mind sharpened by experience, yet he carries a personal burden from his own family's decline, giving him empathy for those constrained by social expectations. Havers's investigations are as much about uncovering social facades as solving crimes, positioning him uniquely at the crossroads of justice and societal change.
Era intersection: Havers’s personal struggles with class decline and justice mirror broader societal uncertainties in interwar Britain.

### Charles Langley
Charles Langley stands as a poignant symbol of the fading aristocracy, caught between inherited privilege and personal failure. His financial recklessness and desperation are intensified by the economic hardships of the era, which exacerbate his social precariousness. His blunt manner and fracturing family relationships highlight the pressures faced by many in the landed gentry struggling to maintain status during the Depression. Charles’s story reflects the era’s harsh realities where old wealth and influence are no longer guarantees of security.
Era intersection: His mounting debts and threatened disinheritance reflect the era’s economic instability impacting traditional elites.

### Margaret Langley
Margaret Langley epitomizes the 1930s debutante balancing social ambition with the constraints of family scandal and economic uncertainty. Her polished charm and keen social instincts are tempered by private fears of disinheritance and exposure, reflecting the era’s complex interplay of gender roles and class expectations. Her careful navigation of social circles and secret engagements underscore how women of her class managed personal agency within a rigid societal framework during this period.
Era intersection: Her secret engagement and social maneuvers illustrate the limited but evolving roles for women amid interwar social conservatism.

### Edward Barnes
Edward Barnes, the trusted family legal advisor, operates within the interwar period’s heightened emphasis on discretion and social order. His professional facade masks personal ambition and moral ambiguity, resonating with the era’s undercurrents of shifting power and corruption behind genteel appearances. His calm, measured speech and subtle ironies reflect the cautious, often duplicitous nature of maintaining status and influence amid growing economic and social pressures.
Era intersection: His secret forgeries and fear of exposure exemplify the fragile veneer of respectability in 1930s upper-class institutions.

### Agnes Crowley
Agnes Crowley represents the stoic servant class that upheld the traditions and daily functioning of great estates during the 1930s. Her stern demeanor and blunt speech mirror the era’s strict class distinctions and the limited agency afforded to domestic staff. Her resentment toward younger generations and fear of losing position reflect the social tensions and anxieties permeating servant-master relationships as economic and social changes threatened established hierarchies.
Era intersection: Her loyalty and frustrations embody the servant class’s precarious position amid evolving social dynamics in interwar England.

### Thomas Radcliffe
Thomas Radcliffe is emblematic of the emerging professional outsider seeking advancement within established aristocratic domains during the 1930s. His ambition and financial misconduct highlight the pressures and opportunities created by economic hardship and modernization efforts. His sardonic wit and sharp speech reveal a man both confident and insecure, navigating a world where old money meets new money tensions define social interaction.
Era intersection: His embezzlement and social aspirations reflect the challenges faced by new professionals in a declining landed gentry environment.

## Character Voices

### Inspector Gerald Havers (he/him/his)
Measured and precise, Havers's speech carries subtle irony and deliberate cadence, reflecting a seasoned detective's calm skepticism.
[comfortable] One mustn't jump to conclusions, now, must we? The facts, after all, are our only true guide.
[evasive] I’m afraid I can’t comment on that just yet; the investigation is ongoing, and I prefer to keep an open mind.
[stressed] No, no, that simply doesn’t add up—something here is being overlooked, and it’s vital we uncover it.
Humour: Havers employs dry wit sparingly, often to puncture pretensions or highlight contradictions with understated irony.

### Charles Langley (he/him/his)
Frank and brusque, Charles speaks with clipped phrases often edged with impatience and frustration.
[comfortable] Look, I’m not here to play games. The truth’s plain enough if you’re willing to see it.
[evasive] I was where I needed to be; the rest is conjecture and idle gossip.
[stressed] Do you think I want this mess any more than you? I’m damned if I’ll go down without a fight.
Humour: Charles’s blunt manner occasionally yields clipped, sardonic remarks that cut through pretense.

### Margaret Langley (she/her/her)
Polished and genteel, Margaret’s speech is elegant with a subtle edge of polite savagery beneath refined surface.
[comfortable] Isn’t it simply delightful when things fall into place? One must appreciate the finer moments.
[evasive] I’m afraid I cannot recall precisely; the evening was rather a blur of conversation and laughter.
[stressed] I assure you, I had nothing to do with such... unfortunate events.
Humour: Margaret wields social niceties as veiled barbs, blending charm with sharp irony.

### Edward Barnes (he/him/his)
Calm and measured, Edward speaks formally with a subtle undercurrent of dry, observational irony.
[comfortable] It’s all quite elementary, if one cares to look closely. Human nature rarely surprises.
[evasive] My whereabouts? I was engaged in essential paperwork; no interruptions, I’m afraid.
[stressed] I find these accusations most unsettling, yet I remain confident the truth will prevail.
Humour: Edward’s humour is understated, delivered through wry commentary on human folly.

### Agnes Crowley (she/her/her)
Plainspoken and blunt, Agnes’s tone is often dry and tinged with weary sarcasm, rarely indulging in emotion.
[comfortable] If it isn’t one thing, it’s another. Keeps the house running, that’s all I’m saying.
[evasive] I was attending to my duties; the rest is gossip and nonsense best left alone.
[stressed] I don’t take kindly to accusations, especially when my hands are clean and busy.
Humour: Her humor surfaces as dry bluntness or sarcastic remarks born of frustration.

### Thomas Radcliffe (he/him/his)
Sharp and quick, Thomas’s speech carries a sardonic edge and confident tone, often laced with biting irony.
[comfortable] Well, isn’t that just rich? One learns quickly who holds the real power around here.
[evasive] I was where I said—no need to question every idle whisper about my movements.
[stressed] You think me naïve? I assure you, I know exactly the risks I’m running.
Humour: Thomas employs sardonic humor to mask insecurity and challenge social pretenses.

## Location Registers (scene framing guides)

Langley Manor Library: The library feels like a solemn chamber of secrets, where knowledge and power intertwine with grief and suspicion. Its heavy curtains and muted lighting create an intimate yet oppressive atmosphere, heightening the sense that hidden truths lurk in shadows and worn pages alike.. Camera angle: Approach the library with reverence and caution, attuned to the weight of legacy and concealed tensions within its walls.. Era: In this 1930s manor, the library’s locked doors and restricted access reflect strict social and familial controls over information.

East Garden Gravel Path: This narrow, winding path exudes quiet secrecy and latent unease, where autumn leaves and shadows cloak whispered meetings and furtive movements. The scent of damp earth and decaying fruit mingles with the crisp air, suggesting both natural beauty and the decay of hidden intentions.. Camera angle: View the garden path as a place of concealed encounters, its twists and textures mirroring the story’s subtle deceptions.. Era: Access is restricted after dusk, emphasizing the path’s role as a liminal space between public appearances and private schemes.

Servants' Hall: The servants’ hall feels utilitarian and worn, a refuge where the staff’s weary camaraderie contrasts with the manor’s grandeur above. Its smells of smoke and damp wool, combined with the low murmur of gossip, hint at undercurrents of loyalty and resentment simmering beneath the surface.. Camera angle: Enter with an ear for whispered truths and a sense of the hidden lives sustaining the manor’s facade.. Era: Strict access and logging by the housekeeper enforce the rigid social order and surveillance typical of 1930s country estates.

Main Gatehouse: The gatehouse stands as a vigilant threshold between isolation and intrusion, its stone walls and iron gates embodying control and guarded secrets. The flickering lantern light and crisp night air evoke a sense of watchfulness and quiet tension, underscoring the manor's seclusion.. Camera angle: Approach the gatehouse as a sentinel’s domain, where every arrival and departure carries weight and consequence.. Era: Strictly monitored entry reflects the era’s emphasis on privacy and social exclusivity for country estates.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The discovery of the victim’s body and the initial shock demand a solemn and respectful tone without humour.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The manor’s choir bell chimed immediately upon being struck, so the time it was heard corresponds exactly to the time of the bell strike and thus the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): hides, fact, bell, sound, artificially, delayed, muffling, acoustic, echo, chamber, creating, false
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: loose, muffling, leather, near, choir, bell, clapper, tower | corr: presence, muffling, indicates, bell, sound, deliberately, dampened, causing, delay, chimed, reaching, listeners | effect: narrows, timeline, constraint, invalidating, assumption, bell, sound, immediate
  - Step 2: obs: bell, tower, clock, stopped, half, past, seven, servants, report, hearing, chime, times | corr: stopped, clock, reliable, timing, bell, strike, delayed, chime, heard, proving, acoustic, delay | effect: eliminates, timeline, interpretations, based, auditory, witness, memory, alone
  - Step 3: obs: charles, langley, bell, tower, briefly, recorded, agnes, crowley, motive, manipulate, timeline | corr: charles, uniquely, capable, inserting, muffling, exploiting, bell, tower, echo, create, false, timeline | effect: identifies, charles, langley, exclusive, means, motive, narrowing, suspect, pool
  - Step 4: obs: medical, examination, lady, beatrice, died, before, earliest, bell, chime, reported, servants | corr: acoustic, delay, witnesses, falsely, recall, timing, murder, bell, chimed | effect: temporal, false, assumption, supports, elimination, suspects, alibis, bell, chime
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): ringing, choir, bell, staged, presence, witnesses, prior, measurement, echo, chamber, acoustic, delay
- Test must rely on already-shown clue IDs: clue_12, clue_9, clue_4
- Fair-play rationale: Step 1: The muffling leather pad and bell tower sketch provide visible physical evidence of sound delay, challenging the initial timeline. Step 2: The stopped bell tower clock and servants’ inconsistent witness statements establish the temporal contradiction. Step 3: Agnes Crowley’s log and Charles Langley’s motive and access narrow suspicion to one culprit. Step 4: The medical report confirms victim’s time of death before the earliest perceived bell chime. The discriminating test recreates the acoustic delay to definitively prove the false timeline and implicate Charles Langley.

## Character Reference

### Inspector Gerald Havers (he/him — NEVER she/her)
Havers speaks with measured clarity and a calm precision, often punctuating his observations with sharp, dry remarks
His tone carries a subtle irony, reflecting his experienced skepticism, and he habitually frames questions with a deliberate, almost rhetorical cadence.
Havers struggles with his role enforcing a justice system that seems skewed by class privilege, fearing that uncovering the truth might expose uncomfortable social realities or deepen his own disillusionment.
Voice colour: Inspector Gerald Havers uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Charles Langley (he/him — NEVER she/her)
Charles speaks with a frank, often brusque manner, his words clipped and sometimes edged with frustration or impatience
He avoids pretense, and when pressed, his tone hardens, revealing a man accustomed to confrontation and accustomed to masking vulnerability with bravado.
Charles is torn between his pride and the overwhelming pressure of his debts and disgrace, battling the fear that his worst impulses may destroy what remains of his family ties.

### Margaret Langley (she/her — NEVER he/him)
Margaret’s speech is polished and genteel, imbued with a subtle sharpness that cuts beneath pleasantries
She wields social niceties as weapons, her tone often laced with veiled barbs and ironic observations that reveal her shrewd mind.
Margaret wrestles with the cost of her ambition, caught between the desire for social elevation and the fear that her secrets might destroy all she has built.
Voice colour: Margaret Langley uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Edward Barnes (he/him — NEVER she/her)
Edward speaks with careful enunciation and a calm, measured tone, often punctuating his statements with dry observations about human nature and the folly of ambition
His language is formal but carries an undercurrent of subtle irony.
He is tormented by the fear of losing everything he’s built and the moral compromises that have led him to a dangerous precipice.
Voice colour: Edward Barnes uses observational humour — let it surface in their dialogue where natural, not in every line.

### Agnes Crowley (she/her — NEVER he/him)
Agnes speaks plainly and without flourish, her tone flat and often tinged with weary sarcasm
She favors succinct statements and seldom indulges in emotion, delivering observations with a dry, matter-of-fact bluntness.
Agnes wrestles with loyalty to the family and frustration over being sidelined by changing times and younger, less respectful generations.

### Thomas Radcliffe (he/him — NEVER she/her)
Thomas’s speech is sharp and quick, often laced with sardonic humor and a biting edge
He uses sarcasm as a shield and weapon, speaking with confidence that sometimes borders on arrogance, revealing both his ambition and insecurity.
He battles the fear of exposure and ruin against his desire for advancement, pushing him toward increasingly reckless choices.
Voice colour: Thomas Radcliffe uses sardonic humour — let it surface in their dialogue where natural, not in every line.



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

Primary Location: Langley Manor (Cotswold Hills, England)
An imposing 18th-century Georgian manor set deep within the Cotswold Hills, Langley Manor is surrounded by extensive gardens and ancient woodlands, embodying the quiet grandeur and social hierarchies of rural England in the 1930s.

Key Locations Available:
- Langley Manor Library (interior): Crime scene
- East Garden Gravel Path (exterior): Clue discovery and secret meetings
- Servants' Hall (interior): Gathering space for staff and potential overhearing of gossip
- Main Gatehouse (transitional): Access control and visitor reception

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): a quiet, intimate tension underscored by the era’s economic uncertainty and the shadow of rising European political unrest
Weather: cool autumn evening with intermittent fog rolling in from surrounding woodlands

Era markers: domestic electric lighting with occasional outages | manual typewriters for correspondence and record keeping | party-line telephone exchange connecting manor to nearby village | petrol-powered automobiles on unpaved estate roads | horse-drawn carriages retained for estate use | passenger trains connecting the nearest town to regional centers

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Cotswold Hills, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
Langley Manor Library (interior):
  - Visual: flickering firelight on dark oak shelves, dust motes in waning twilight, faded leather spines with gilt lettering
  - Sounds: crackling hearth-fire, soft rustle of turning pages, distant ticking of an old clock
  - Scents: old leather and polished wood, faint scent of pipe tobacco smoke, cold beeswax and ash
  - Touch: rough grain of oak desk surface, velvet drapes soft to the touch

East Garden Gravel Path (exterior):
  - Visual: fading amber leaves on gravel, shimmer of damp moss on stone edging, twilight filtered through bare branches
  - Sounds: crunch of gravel underfoot, rustle of dry leaves in breeze, distant call of an owl
  - Scents: earthy dampness of fallen leaves, crisp scent of decaying fruit, fresh pine and woodland resin
  - Touch: rough gravel crunching beneath shoes, cool metal of wrought iron bench

Servants' Hall (interior):
  - Visual: flickering stove firelight, scuffed wooden floorboards, simple crockery on tables
  - Sounds: clatter of metal cutlery, murmurs of quiet conversation, creak of wooden benches
  - Scents: stale cooking grease, sweat and damp wool uniforms, smoke fro
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- April 1932 in rural England is a time of delicate balance between lingering spring optimism and the harsh realities of economic hardship
- On estates like Langley Manor, daily life is governed by strict social hierarchies and formal rituals, with servants and family alike bound by codes of discretion and duty
- The air is often cool and damp, with intermittent fogs drifting through woodlands, lending a muted hush to the countryside
- Technology such as party-line telephones and early radios connect these isolated estates tenuously to the wider world, while domestic electric lighting flickers against the encroaching dusk
- Clothing reflects a blend of Art Deco influence and traditional modesty, emphasizing refinement despite austerity

TEMPORAL CONTEXT:

This story takes place in April 1932 during spring.

Seasonal Atmosphere:
- Weather patterns: cool temperatures ranging from 45 to 60°F (7 to 15°C), frequent overcast skies with intermittent light rain showers, early morning and late evening fog drifting from surrounding woodlands
- Daylight: Increasing daylight with sunsets around 7:30 PM; mornings bright by 6 AM but often misty
- Seasonal activities: Spring planting and garden maintenance in estate grounds, Afternoon tea parties in sunrooms or garden terraces, Early season country walks and bird watching in wooded areas
- Seasonal occasions: Easter Sunday (April 17, 1932), April Fools' Day (April 1), May Day preparations beginning late April
- Season: spring

Period Fashion (describe naturally):
- Men formal: Single-breasted wool suits in muted greys and browns, Starched white shirts with detachable collars, Silk ties with geometric Art Deco patterns
- Men casual: Knitted vests worn over shirts, Tweed sports jackets with elbow patches, Knickerbockers paired with long socks for country walking
- Men accessories: Homburg hats or flat caps, Pocket watches with chain fobs, Leather brogues polished to a shine
- Women formal: Day dresses with dropped waists and pleated skirts ending just below the knee, Lightweight silk blouses with Peter Pan collars, Tailored coats in pastel shades for outings
- Women casual: Knitted cardigans paired with calf-length skirts, Cloche hats worn tightly over waved hair, Practical leather Oxford shoes for estate grounds
- Women accessories: Long pearl necklaces and delicate brooches, Gloves made of kid leather or fine cotton, Small structured handbags with metal frames

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington’s orchestral jazz recordings gaining UK popularity, Gracie Fields’ music hall hits, Dance band tunes by Ambrose and his Orchestra; Films: Dr. Jekyll and Mr. Hyde (1931) still screening in cinemas, Grand Hotel (1932) acclaimed in London theaters; Theatre: Noël Coward’s plays such as 'Design for Living' performed in West End, Operettas at local theaters providing escapist entertainment; Radio: BBC’s 'In Town Tonight' variety program, News bulletins at 9 PM providing updates on domestic and international affairs
- Typical prices: Loaf of bread: 3 pence, A pint of milk: 1 penny, Taxi ride across town: 1 shilling 6 pence
- Current events: Britain’s National Government faces rising unemployment and austerity debates amid Great Depression; Labour unrest increasing with miners’ strikes in coal regions
- Literature: Agatha Christie’s 'Peril at End House' (1932) freshly released | Virginia Woolf’s 'The Waves' (1931) circulating in literary circles | John Steinbeck’s 'The Pastures of Heaven' (1932) noted in US literary reviews | [Mystery and detective fiction] | [Modernist experimental literature] | [Social realism addressing economic inequality]
- Technology: Improvements in domestic electric lighting efficiency | Development of portable battery-powered radios | Advances in forensic fingerprint dusting powders | Manual typewriters for correspondence | Party-line telephones connecting country estates to villages | Wireless radios used for news and entertainment
- Daily life: Daily prayers and formal meals in estate dining rooms, Afternoon tea served with delicate biscuits, Country walks
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Exact time the bell was mechanically struck: "twenty minutes past seven"
    ⛔ FORBIDDEN alternatives: "7:20", "7.20", "seven twenty", "seven-twenty", "seven past twenty", "quarter past seven", "half past seven" — the ONLY acceptable form is "twenty minutes past seven"
  - Time of victim’s death as per medical exam: "ten minutes past seven"
    ⛔ FORBIDDEN alternatives: "7:10", "7.10", "seven ten", "seven-ten", "seven past ten", "quarter past seven", "half past seven" — the ONLY acceptable form is "ten minutes past seven"
  - Time at which the bell tower clock stopped: "half past seven"
    ⛔ FORBIDDEN alternatives: "7:30", "7.30", "seven thirty", "seven-thirty", "seven past thirty", "quarter past seven" — the ONLY acceptable form is "half past seven"
  - Depth of the echo chamber causing sound delay: "six feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] loose, muffling, leather, near, choir, bell, clapper, tower
  Category: physical | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): direct, muffling, presence, near, bell, clapper

• [clue_mechanism_visibility_core] murderer, manipulated, choir, bell, mechanism, inserting, muffling, leather, clapper, exploiting, tower, echo
  Category: temporal | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): core, mechanism, muffling, echo, manipulation, murderer

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Exact time the bell was mechanically struck: "twenty minutes past seven"
  • Time of victim’s death as per medical exam: "ten minutes past seven"
  • Time at which the bell tower clock stopped: "half past seven"
  • Depth of the echo chamber causing sound delay: "six feet"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Gerald Havers: he/him/his
  • Lady Beatrice Langley: she/her/her
  • Charles Langley: he/him/his
  • Margaret Langley: she/her/her
  • Edward Barnes: he/him/his
  • Agnes Crowley: she/her/her
  • Thomas Radcliffe: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Margaret Langley[SHE], Edward Barnes[HE], Agnes Crowley[SHE], Thomas Radcliffe[HE]
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
Known location profile anchors: Langley Manor, Langley Manor Library, East Garden Gravel Path, Servants' Hall, Main Gatehouse, Bell Tower, Langley Manor
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Langley Manor", "Langley Manor Library", "East Garden Gravel Path", "Servants' Hall", "Main Gatehouse", "Bell Tower, Langley Manor"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Bell Tower, Langley Manor". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Gerald Havers: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Lady Beatrice Langley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Langley: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margaret Langley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Barnes: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Agnes Crowley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Thomas Radcliffe: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Lady watched Havers; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Lady watched Havers; Havers crossed the room and L
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=8197; context=12389; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic electric lighting with occasional outages | manual typewriters for correspondence and record keeping | party-line telephone exchange connecting manor to nearby village | battery-powered portable radios for news broadcasts | telegram service via nearest town post office | party-line telephone calls subject to eavesdropping.
5. Respect setting movement/access constraints in scene action and alibis: estate bounded by wrought iron gates and high stone walls limiting access | main house layout includes locked private family quarters and restricted servant areas | narrow gravel paths and dense trees create natural movement funnels | weather conditions such as autumn fog and rain impact visibility and ground conditions | visitors must be announced and admitted through the main gatehouse.
6. Sustain social coherence with this backdrop pressure: Amidst the seclusion of a grand Georgian manor during the 1930s, the Langley family, their guests, and devoted staff are bound by strict social hierarchies and formal routines, all under the shadow of economic hardship and rising political unease, creating a tense atmosphere where discretion and loyalty are paramount.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Gerald Havers, Lady Beatrice Langley, Charles Langley, Margaret Langley, Edward Barnes, Agnes Crowley.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the controlled choir bell ringing test, Measure echo chamber acoustic delay, Observe servants’ witness reaction and timing discrepancy, Draw conclusion about the false timeline and guilt
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Margaret Langley (Act 3, Scene 5): Public dinner alibi verified by guests
  Clues: Letters found in Margaret’s room, Dinner guests’ testimony
- Edward Barnes (Act 3, Scene 5): Witnesses place him away from bell tower at critical time
  Clues: Correspondence intercepts, Witness statements of Edward's location
- Agnes Crowley (Act 3, Scene 5): Bell tower key log shows no unauthorized access
  Clues: Bell tower key log, Servants’ statements
- Thomas Radcliffe (Act 3, Scene 5): Gardener’s log and fountain inspection confirm location and absence of opportunity
  Clues: Gardener's log book, Water basin inspection

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with acoustic evidence and key logs

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Discovery Opening.
Mode required outcomes:
- Victim is named explicitly and the body is encountered within the first two paragraphs.
- Major suspects are introduced with relevance and tension.
- First clue is planted without full mechanism explanation.
Forbidden at this stage:
- No culprit reveal.
- No full murder mechanism explanation.
- Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.
Mode-specific narrative balance targets:
- Setting: 15-20%
- Character Introductions: 35-40%
- Discovery Reactions: 25-30%
- First Clue: 10-15%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Charles Langley, Margaret Langley, Edward Barnes, Agnes Crowley, Thomas Radcliffe
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

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
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Lady Beatrice Langley" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Lady Beatrice Langley in the same paragraph.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Bell Tower, Langley Manor — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Inspector Gerald Havers must claim or be recognised as the investigator in this chapter. Establish Inspector Gerald Havers as the detective-in-charge within the first two paragraphs — Inspector Gerald Havers IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Inspector Gerald Havers begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • leather, fixed, lying, close, choir, bell, clapper, inside, tower [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
    • observation, muffling, near, clapper, knowledge, bell, tower, echo, chamber [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • stopped, clock, shows, half, past, seven, servants, recall, hearing, bell, chime, time [plant:clue_3]
    • clock, stopped, half, past, seven, consistent, reliable, bell, chime, heard, time [plant:clue_4]
    • letter, threatening, charles, langley, exposure, personal, effects [plant:clue_18]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):
      · Inspector Gerald Havers claims: Entire investigation period
      · Charles Langley claims: Between quarter past and half past seven
      · Margaret Langley claims: At dinner between quarter to and quarter past eight
      · Edward Barnes claims: Between six and eight in the evening
      · Agnes Crowley claims: Between seven and eight in the evening
      · Thomas Radcliffe claims: At fountain between six forty-five and seven twenty
  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Charles Langley's established alibi is "Between quarter past and half past seven". Do NOT place Charles Langley at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions Exact time the bell was mechanically struck, write exactly: "twenty minutes past seven".
  - If this batch mentions Time of victim’s death as per medical exam, write exactly: "ten minutes past seven".
  - If this batch mentions Time at which the bell tower clock stopped, write exactly: "half past seven".
  - If this batch mentions Depth of the echo chamber causing sound delay, write exactly: "six feet".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Gerald Havers: he/him/his
    Lady Beatrice Langley: she/her/her
    Charles Langley: he/him/his
    Margaret Langley: she/her/her
    Edward Barnes: he/him/his
    Agnes Crowley: she/her/her
    Thomas Radcliffe: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Charles Langley, Margaret Langley, Edward Barnes, Agnes Crowley, Thomas Radcliffe
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Bell tower clock stopped at half past seven
- Established timeline fact: Dinner served at quarter past seven
- Established timeline fact: Gardener's fountain pump failure logged at seven twenty
- If referenced, use exact phrase: "twenty minutes past seven" (Exact time the bell was mechanically struck).
- If referenced, use exact phrase: "ten minutes past seven" (Time of victim’s death as per medical exam).
- If referenced, use exact phrase: "half past seven" (Time at which the bell tower clock stopped).
- If referenced, use exact phrase: "six feet" (Depth of the echo chamber causing sound delay).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Bell Tower's Last Chime
Era: 1930s
Setting: Langley Manor
Crime: murder (delayed acoustic timeline murder)
Culprit: Charles Langley
Victim: Lady Beatrice Langley
False assumption: The manor’s choir bell chimed immediately upon being struck, so the time it was heard corresponds exactly to the time of the bell strike and thus the murder.
Cast: Inspector Gerald Havers (he/him), Lady Beatrice Langley (she/her), Charles Langley (he/him), Margaret Langley (she/her), Edward Barnes (he/him), Agnes Crowley (she/her), Thomas Radcliffe (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Langley Manor). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Langley Manor" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Gerald Havers — he/him/his (NEVER she/her)
• Lady Beatrice Langley — she/her/her (NEVER he/him)
• Charles Langley — he/him/his (NEVER she/her)
• Margaret Langley — she/her/her (NEVER he/him)
• Edward Barnes — he/him/his (NEVER she/her)
• Agnes Crowley — she/her/her (NEVER he/him)
• Thomas Radcliffe — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "Bell Tower, Langley Manor",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Inspector Gerald Havers",
      "Lady Beatrice Langley",
      "Charles Langley",
      "Margaret Langley",
      "Edward Barnes",
      "Agnes Crowley",
      "Thomas Radcliffe"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Agnes Crowley hesitates before revealing the body’s discovery"
      ]
    },
    "summary": "Inspector Gerald Havers arrives at Langley Manor and is led to the choir bell tower where the body of Lady Beatrice Langley is found with a heavy brass bell clapper nearby. The inspector notes the unusual presence of a loose muffling leather pad near the bell clapper. The suspects are gathered and tensions rise as the inspector begins his inquiry.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "emotionalRegister": "A somber and heavy mood settles with the shocking discovery of Lady Beatrice’s death, casting a shadow over the manor.",
    "dominantCharacterNote": {
      "name": "Inspector Gerald Havers",
      "voiceRegister": "Measured and precise, Havers's speech carries subtle irony and deliberate cadence, reflecting a seasoned detective's calm skepticism."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Reliance on manual typewriters and party-line telephones limiting rapid communication; Limited automobile use on unpaved estate roads slowing travel; Domestic electric lighting prone to flicker and occasional outages; Restricted access to information and news via scheduled radio broadcasts; Isolation of country estates with guarded gates and monitored entrances; Absence of advanced forensic technology beyond basic fingerprinting and toxicology",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_3",
      "clue_4",
      "clue_18"
    ]
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
□ Chapter 1: the clue [clue_1] (loose, muffling, leather, near, choir, bell, clapper, tower) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_mechanism_visibility_core] (murderer, manipulated, choir, bell, mechanism, inserting, muffling, leather, clapper, exploiting, tower, echo) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Gerald Havers | he/him/his/himself        | [fill in]     | [yes/no]
  Lady Beatrice Langley | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Langley      | he/him/his/himself        | [fill in]     | [yes/no]
  Margaret Langley     | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Barnes        | he/him/his/himself        | [fill in]     | [yes/no]
  Agnes Crowley        | she/her/her/herself       | [fill in]     | [yes/no]
  Thomas Radcliffe     | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
