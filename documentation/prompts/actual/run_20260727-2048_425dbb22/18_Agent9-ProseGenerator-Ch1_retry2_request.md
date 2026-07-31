# Actual Prompt Record

- Run ID: `run_425dbb22-2e5e-4f39-86a6-7935a3c3830b`
- Project ID: `proj_8d84e7a9-9798-4656-8c29-73c856049d93`
- Timestamp: `2026-07-27T20:58:27.451Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `b21e5e1f4ea21282`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Inspector Helen Marwood[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Inspector Helen Marwood. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Helen Marwood (woman), Lady Beatrice Winthrope (woman) — DECEASED, past-tense only, Charles Montague (man), Margaret Hensley (woman), Edward Winthrope (man), Clara Simmons (woman), James Fletcher (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Helen Marwood, Lady Beatrice Winthrope, Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons, James Fletcher?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit used a natural phenomenon to mask the crime time, intending to protect a fragile family secret rather than personal gain." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Lady Beatrice Winthrope. Name them — Lady Beatrice Winthrope — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Helen Marwood, Lady Beatrice Winthrope (DECEASED), Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons, James Fletcher
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Helen Marwood: Police Detective / Inspector
   - Lady Beatrice Winthrope: victim (DECEASED — does not appear in any scene, past tense only)
   - Charles Montague: Social Climber
   - Margaret Hensley: Jealous Lover
   - Edward Winthrope: Protective Aristocrat
   - Clara Simmons: Pragmatic Confidante
   - James Fletcher: Ambitious Legal Advisor
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

- Inspector Helen Marwood
  Public identity anchor: Detective Inspector, Scotland Yard; detective 
  Connection to victim: directly affected by Lady Beatrice Winthrope's death and its fallout.
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Calm under pressure.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Charles Montague
  Public identity anchor: Estate Manager; suspect 
  Connection to victim: Lady Beatrice was secretly involved romantically with Charles Montague, hoping to elevate him socially.; Lady Beatrice and Charles Montague maintained a secret affair despite social prohibitions and estate gossip..
  Investigation relevance: access plausibility: high | alibi window: Between quarter past six and half past six | opportunity channel: Access to study and hourglass.
  Suspicion/pressure cue seed: Nervous glances.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Margaret Hensley
  Public identity anchor: Lady’s Maid; suspect 
  Connection to victim: Margaret Hensley served as Lady Beatrice’s maid and secretly loved her, resenting Charles Montague’s presence.; Margaret Hensley’s unreciprocated feelings caused growing jealousy toward Lady Beatrice and Charles Montague..
  Investigation relevance: access plausibility: medium | alibi window: Between quarter past five and six | opportunity channel: Access to victim’s chambers.
  Suspicion/pressure cue seed: Tense around Charles Montague.
  Investigator read: include one immediate observational inference (gestu
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1938 December
December 1938 in rural England is a time wrapped in both tradition and tension. The short winter days quickly give way to dusk, with cold air carrying the scent of damp stone and wood smoke around the manor’s aged walls. Inside, gas lamps flicker and manual typewriters clatter softly, while the wireless broadcasts news of uneasy peace and distant conflict. The estate’s inhabitants move through formal routines amid subdued Christmas preparations, their carefully tailored clothes and fur-trimmed coats reflecting a world striving for control despite economic uncertainty. Outside, intermittent drizzle and fog blur the edges of the grounds, deepening isolation and sharpening senses. Conversations remain polite but guarded, as families and staff alike wrestle with the looming threat of war and the pressures of maintaining appearances in an era of social and financial strain.
Emotional register: A pervasive undercurrent of guarded anxiety and restrained resilience colors daily life, as tradition and apprehension coexist uneasily.
Physical constraints: Reliance on wired party-line telephones compromising privacy and communication speed | Limited personal transport with rare petrol touring cars and distant steam train stations | Manual typewriters and telegrams as primary means of urgent written communication | Short daylight hours restricting outdoor activity and travel during winter
Current tensions (weave into background texture): Anxiety over the Munich Agreement and the fragility of peace in Europe | Economic strain on landed estates caused by lingering effects of the Great Depression | Heightened class tensions underpinned by financial uncertainty and social expectations
Wartime context — The story precedes Britain’s entry into World War II, with many men still in civilian life but aware of looming conflict.: Communities are marked by a mix of patriotic duty and cautious fear, with social roles still largely traditional but beginning to strain under modern pressures. Absence effect: Although active conscription has not yet begun, the fear of impending war casts a shadow over families and institutions, influencing behavior and decision-making.

## Season Lock (mandatory — derived from 1938 December)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
This mystery explores how rigid social hierarchies and economic pressures in a closed English estate community can distort truth and justice, revealing the fragility beneath genteel facades.

## Story Emotional Register
Dominant: A steadily intensifying atmosphere of tension, subtle distrust, and intellectual rigor underscored by social restraint and personal stakes.

Arc:
The story opens with a chilling discovery: Lady Beatrice’s death in the stately, shadowed library casts a somber pall over the manor. The initial atmosphere is one of shock and restrained grief, where the grand estate’s quiet order is shattered by an unthinkable act. The heavy antique paperweight and the hourglass timer introduce an almost poetic symbol of time's fragility, immediately setting an ominous, contemplative tone.

As Inspector Marwood begins her methodical investigation, the mood shifts to one of cautious inquiry and rising unease. Early clues—the frost on the hourglass, contradictory servant testimonies, and strange environmental details—create a labyrinth of conflicting evidence. False leads, such as the suspicion cast on James Fletcher, add layers of tension and emotional strain, both for the characters and the reader. Helen’s internal conflict deepens as she navigates the rigid social codes and veiled hostilities within the manor.

Midway, a pivotal moment occurs when the inspector’s attention to the physical evidence of frozen condensation inside the hourglass forces a radical reassessment of the timeline. This revelation reframes the entire investigation, casting doubt on earlier assumptions and exposing the subtle manipulation of time and perception. The emotional atmosphere thickens with the dawning realization that appearances have been deliberately distorted.

The second pivot comes as the corrected timeline aligns with new witness accounts and physical clues, shifting suspicion decisively toward Charles Montague. This revelation colors all prior interactions with fresh suspicion, highlighting the fragility of trust and the weight of hidden motives. The inspector’s resolve hardens, and the manor’s genteel façade begins to crack under mounting pressure.

In the pre-climax and climax, tension reaches a crescendo. The controlled temperature test on the hourglass delivers irrefutable proof of temporal deception, and the confrontation with Charles Montague becomes an emotional crucible. The stakes are personal and professional for Helen,.

## Emotional register at this point in the story
A heavy, somber mood envelops the manor at the shock of Lady Beatrice’s death.

## Character Portraits (appearance & era)

### Inspector Helen Marwood
Inspector Helen Marwood embodies the determined professional standing at the intersection of law enforcement and aristocratic privilege in late 1930s England. Her methodical nature contrasts with the rigid social codes she must navigate within the manor, where class divides and subtle political pressures challenge her pursuit of truth. Her presence in the investigation highlights the tensions between justice and social order in a society increasingly aware of its fragility.
Era intersection: Helen’s resolve to pursue justice despite covert pressures from superiors reflects the era’s conflicts between traditional power structures and emerging calls for impartiality.

### Charles Montague
Charles Montague is a man caught between ambition and desperation, his polished exterior masking deep financial and social anxieties common in the 1930s. As estate manager, he wields influence yet remains vulnerable to exposure and ruin, embodying the era’s social mobility struggles and the costs of climbing the class ladder. His actions reveal the pressures faced by those outside the traditional gentry seeking advancement during economic hardship.
Era intersection: Charles’s manipulation of physical and social environments reflects the era’s complex interplay of personal ambition and rigid class structures.

### Margaret Hensley
Margaret Hensley is emblematic of the devoted servant caught in emotional turmoil, navigating the strict hierarchies and personal sacrifices demanded by 1930s estate life. Her quiet nervousness and hidden jealousies underscore the limited agency and emotional suppression expected of women in her station during this period.
Era intersection: Margaret’s conflicted loyalties and unspoken desires illustrate the era’s constrained social roles for women and servants.

### Edward Winthrope
Edward Winthrope stands as the stern guardian of tradition and family honor, his military background and clipped speech reflecting the era’s valorization of discipline and social hierarchy. His resistance to change and disdain for perceived social climbers capture the anxieties of an older generation confronting the erosion of aristocratic privilege.
Era intersection: His struggle to preserve legacy amid financial and social pressures mirrors the broader societal tensions of late 1930s Britain.

### Clara Simmons
Clara Simmons is the pragmatic housekeeper whose steady presence and guarded knowledge of secrets epitomize the stabilizing role of senior servants within the rigid estate system. Her calm demeanor and dry wit reflect an adaptation to the era’s social complexities, balancing loyalty with self-preservation.
Era intersection: Clara’s position as confidante and gatekeeper of discretion underscores the silent power wielded by staff within class-conscious households of the 1930s.

### James Fletcher
James Fletcher, the earnest young lawyer, embodies the emerging professional class navigating aristocratic intrigues and ethical dilemmas. His youthful energy and nervousness highlight the pressures of ambition in a time when social mobility is possible but fraught with risk.
Era intersection: James’s discovery of forged documents and his precarious position reflect the era’s growing emphasis on legal propriety and the challenges faced by newcomers to established social orders.

## Character Voices

### Inspector Helen Marwood (she/her/her)
Helen speaks with measured precision and clipped clarity, her tone calm yet incisive, cutting through pretense with dry wit and subtle irony.
[comfortable] Let’s be clear, the facts do not bend to social niceties. We must follow the evidence where it leads.
[evasive] I’m not suggesting anything, merely observing the inconsistencies in the timeline as presented.
[stressed] This investigation is more than a matter of procedure; it tests the very principles I stand for.
Humour: Helen’s humour is dry and understated, often deployed as a subtle tool to expose contradictions or defuse tension.

### Charles Montague (he/him/his)
Charles’s voice is polished and urbane, with smooth tones masking veiled barbs and genteel irony delivered with a courteous smile.
[comfortable] Naturally, one must maintain appearances; the alternative is simply unthinkable.
[evasive] I assure you, any suggestion of impropriety is quite misplaced, though I see how it might appear so.
[stressed] The pressures of managing such an estate are not as simple as they seem; one must be resourceful.
Humour: Charles’s humour leans toward polite savagery, using irony and subtle sarcasm to mask his true intentions.

### Margaret Hensley (she/her/her)
Margaret’s voice is hesitant and modest, often punctuated with nervous laughter and soft fillers, betraying her inner turmoil.
[comfortable] I mean, it’s just that… I was attending to my duties when the evening unfolded as it did.
[evasive] Well, I can’t say for certain, but perhaps there might be another explanation.
[stressed] I wasn’t trying to hide anything, really… it’s just difficult to say what I might have seen.
Humour: Margaret’s humour is self-deprecating, lightly used to mask discomfort and nervousness.

### Edward Winthrope (he/him/his)
Edward’s speech is terse, authoritative, and blunt, reflecting military discipline and a no-nonsense attitude.
[comfortable] That’s non-negotiable; the estate’s honor must be upheld above all else.
[evasive] I have little patience for speculation; facts are what matter, not idle gossip.
[stressed] The situation is intolerable, but I will not allow it to disrupt the family’s legacy.
Humour: Edward’s humour is blunt and sparse, often unintentionally harsh rather than deliberately humorous.

### Clara Simmons (she/her/her)
Clara speaks plainly and pragmatically, with a calm steadiness and occasional dry observations that lighten tense moments.
[comfortable] Well, you see, these things have a way of coming to light when least expected.
[evasive] I can’t say much beyond what’s necessary; discretion is the key to keeping order.
[stressed] It’s not my place to judge, but these troubles have unsettled the household considerably.
Humour: Clara’s humour is observational, sparingly employed to punctuate her practical outlook.

### James Fletcher (he/him/his)
James speaks with youthful energy and legal formality, occasionally stumbling when nervous but eager to impress.
[comfortable] If I may say so, the documents in question raise serious concerns about the estate’s future.
[evasive] Well, I was occupied with paperwork and might not recall all details precisely.
[stressed] I assure you, my intentions are honorable, though I understand the suspicion.
Humour: James’s humour is observational, often witty remarks about social pretensions.

## Location Registers (scene framing guides)

Winthrope Manor Library: The library feels like a sanctuary of secrets and interrupted thoughts, where the heavy atmosphere of grief and suspicion hangs thick amid the scent of old leather and smoldering embers. Every shadow and scattered manuscript hints at concealed truths and the weight of unspoken histories.. Camera angle: Approach with a sense of solemnity and scrutiny, as if stepping into a vault of hidden motives and fragile alibis.. Era: Access is tightly controlled and recorded, reflecting 1930s estate protocols limiting movement and preserving privacy.

Servants’ Quarters: The quarters exude weary quiet and functional austerity, a stark contrast to the manor’s grandeur. The air is thick with exhaustion and whispered anxieties, where the lines between loyalty and fear blur in cramped, dimly lit spaces.. Camera angle: Observe with a respectful yet probing gaze, capturing the tension beneath the surface of dutiful labor.. Era: Restricted staff-only area enforcing strict social boundaries characteristic of the period.

Winthrope Manor Gardens: The gardens offer a bittersweet refuge of fading beauty, their autumnal silence punctuated by rustling leaves and distant calls. Here, isolation and reflection mingle, underscored by the cold touch of early winter and the weight of unseen eyes.. Camera angle: Frame with quiet contemplation, emphasizing the contrast between natural decay and human intrigue.. Era: Locked gates and patrols limit access after dusk, preserving the estate’s controlled social environment.

Estate Gatehouse: The gatehouse stands as a gatekeeper between worlds, its cramped interior filled with the sounds of creaking iron and ringing telephones underscored by watchful vigilance and the faint scent of damp stone. It embodies the boundary of isolation and the thin veil between safety and intrusion.. Camera angle: Capture a sense of guarded tension and the ever-present scrutiny that defines estate security.. Era: Manually logged visitor records and party-line telephones reflect communication limits of the era.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of discovering the murder victim demands a respectful tone without levity.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The hourglass on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six.
- Hidden truth to progressively expose (compose in your own words from these elements): hourglass, sand, flow, delayed, frozen, condensation, caused, room, temperature, producing, false, earlier
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: hourglass, study, mantelpiece, contains, minute, frost, crystals, visible, inner, glass, surface | corr: presence, frost, crystals, indicates, condensation, froze, inside, hourglass, causing, temporary, blockage, sand | effect: narrows, possible, time, death, hourglass, stopped, flowing, eliminates, assumptions, normal, timing
  - Step 2: obs: faint, scratch, study, room, window, latch, indicates, left, slightly, ajar, evening | corr: slightly, open, window, allowed, cold, lowering, room, temperature, enough, freeze, moisture, inside | effect: narrows, access, opportunity, suspects, study, room, knowledge, eliminates
  - Step 3: obs: witnesses, agree, garden, gate, latched, half, past, wind, direction, logs, show, shift | corr: auditory, perception, gate, latch, time, misjudged, environmental, acoustics, invalidating, timeline, based, sounds | effect: eliminates, james, fletcher, suspect, pool, based, faulty, timing, assumptions
  - Step 4: obs: charles, montague, observed, near, study, shortly, before, half, past, seven, motive, blackmail | corr: charles, motive, opportunity, within, corrected, timeline, murder, hourglass, stopped, flowing | effect: identifies, charles, montague, narrowed, prime, suspect
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): temperature, conducted, placing, sealed, hourglass, identical, manor, cold, room, forty, four, degrees
- Test must rely on already-shown clue IDs: clue_12, clue_mechanism_visibility_core, clue_1
- Fair-play rationale: Step 1: The frost crystals and low room temperature (early clues) reveal the physical cause for the hourglass delay. Step 2: The scratched window latch and documented room temperature (mid clues) link the suspect’s access and opportunity. Step 3: Wind direction logs and servant notes (mid clues) correct the auditory timeline, clearing James Fletcher. Step 4: Charles Montague’s presence and motive (late clues) focus suspicion. The discriminating test recreates the hourglass delay, confirming the false timeline and identifying Charles as culprit.

## Character Reference

### Inspector Helen Marwood (she/her — NEVER he/him)
Speaks in measured, economical sentences with a sharpness that cuts through obfuscation
Employs subtle irony and dry observations, often delivering pointed remarks that reveal more than they say
Avoids unnecessary embellishment, preferring clarity and precision.
Helen struggles with the tension between her commitment to impartial justice and the covert political pressures to protect the aristocracy, fearing that yielding would betray her own principles and the victim’s memory.
Voice colour: Inspector Helen Marwood uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Charles Montague (he/him — NEVER she/her)
His tone is smooth and urbane, with a penchant for veiled barbs and subtle sarcasm delivered with a courteous smile
He often employs genteel irony, masking sharp observations beneath polite conversation.
Charles grapples with the tension between genuine affection for Lady Beatrice and the ruthless calculation required to secure his place among the elite, fearing exposure will undo all he has worked for.
Voice colour: Charles Montague uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Margaret Hensley (she/her — NEVER he/him)
Margaret’s speech is hesitant, often punctuated by little laughs to mask discomfort
She uses fillers and repeats herself when nervous, with a tendency to downplay her own feelings through modesty and self-effacement.
Margaret is torn between loyalty to her mistress and the corrosive jealousy that clouds her judgment, fearing the loss of both love and livelihood.

### Edward Winthrope (he/him — NEVER she/her)
Edward’s speech is terse and direct, often cutting to the heart of matters without ornament
He uses military jargon occasionally and can come across as intimidating
His humor is sparse and blunt, sometimes unintentionally harsh.
He battles the fear that the family’s legacy will be irreparably damaged by change, struggling to reconcile love for his sister with his rigid principles.

### Clara Simmons (she/her — NEVER he/him)
Clara’s speech is plainspoken and pragmatic, often punctuated by dry observations about human nature and the quirks of aristocratic life
She uses humour sparingly but effectively to lighten tense moments.
She balances loyalty to the family with the need to protect herself, often questioning how far complicity can be tolerated before survival demands sacrifice.
Voice colour: Clara Simmons uses observational humour — let it surface in their dialogue where natural, not in every line.

### James Fletcher (he/him — NEVER she/her)
James speaks with youthful energy, often using legal jargon and formal phrases
He occasionally stumbles over words when nervous, and his enthusiasm can verge on over-eagerness
His humour surfaces as witty observations about social pretensions.
James wrestles with the ethical dilemma of exposing corruption versus protecting his career, fearing the consequences of either path.
Voice colour: James Fletcher uses observational humour — let it surface in their dialogue where natural, not in every line.



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

Primary Location: Winthrope Manor Estate (Ashcombe Vale, England)
An imposing 1930s country manor nestled in the remote Ashcombe Vale, surrounded by farmland and dense woodland, where rigid social order and isolation converge beneath autumn mists.

Key Locations Available:
- Winthrope Manor Library (interior): Crime scene
- Servants’ Quarters (interior): Staff living and working area
- Winthrope Manor Gardens (exterior): Outdoor gathering and clue discovery
- Estate Gatehouse (transitional): Entry control and visitor reception

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): quiet, tense undercurrent beneath genteel social interactions, reflecting economic uncertainty and subtle class anxiety
Weather: cool autumn evening with intermittent drizzle typical of English countryside

Era markers: domestic wired telephones with party-line exchanges | manual typewriters for correspondence and record-keeping | battery-powered portable radios for news and entertainment | petrol touring cars on estate and country roads | passenger steam trains connecting nearest town and city hubs | telegrams sent via nearest post office with typical delays

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Ashcombe Vale, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
Winthrope Manor Library (interior):
  - Visual: flickering brass lamp glow, shadowed bookshelves and spines, rain-streaked leaded glass windows
  - Sounds: soft patter of rain outside, quiet rustle of paper, occasional creak of settling wood
  - Scents: musty leather bindings, old polished wood, faint ink and paper
  - Touch: smooth cool brass lamp base, rough leather book covers

Servants’ Quarters (interior):
  - Visual: faded floral wallpaper, scuffed wooden floorboards, dim gaslight flickering
  - Sounds: clinking of metal utensils, low murmurs and hushed footsteps, creaking bedframes
  - Scents: stale soap and damp linen, boiling stew and frying fat, smoky kitchen hearth
  - Touch: rough cotton bedcovers, cool iron bedframes

Winthrope Manor Gardens (exterior):
  - Visual: rust-red and gold foliage, glossy wet gravel paths, stone statues moss-covered
  - Sounds: whispering wind through leaves, soft crunch of gravel underfoot, distant call of a thrush
  - Scents: earthy damp soil, decaying leaves, faint scent of late roses
  - Touch: rough bark of ancient trees, cold smooth stone statues

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- December 1938 in rural England is a time wrapped in both tradition and tension
- The short winter days quickly give way to dusk, with cold air carrying the scent of damp stone and wood smoke around the manor’s aged walls
- Inside, gas lamps flicker and manual typewriters clatter softly, while the wireless broadcasts news of uneasy peace and distant conflict
- The estate’s inhabitants move through formal routines amid subdued Christmas preparations, their carefully tailored clothes and fur-trimmed coats reflecting a world striving for control despite economic uncertainty
- Outside, intermittent drizzle and fog blur the edges of the grounds, deepening isolation and sharpening senses

TEMPORAL CONTEXT:

This story takes place in December 1938 during winter.

Seasonal Atmosphere:
- Weather patterns: Chill air with frequent intermittent drizzle typical of the English countryside, Foggy mornings with low visibility over frost-hardened grass, Overcast skies with brief pale winter sunlight
- Daylight: Short winter days with daylight from about 8:15 AM to 4:00 PM, dusk settling by late afternoon
- Seasonal activities: Trimming the manor’s Christmas tree with handmade and imported glass ornaments, Gathering indoors for fireside storytelling and card games after dark, Attending or hosting formal Christmas dinners and charity balls within the local gentry
- Seasonal occasions: Christmas Day, December 25th, Boxing Day, December 26th, St. Nicholas Day, December 6th (less commonly celebrated in England but recognized by some families)
- Season: winter

Period Fashion (describe naturally):
- Men formal: Dark single-breasted suits in worsted wool with peaked lapels, Starched white detachable collars paired with silk cravats or conservative ties, Polished leather Oxford shoes with spats for outdoor wear
- Men casual: Tweed sports jackets with elbow patches for estate walks, Knitted wool argyle socks paired with sturdy brogues, Heavy wool overcoats with velvet collars for cold weather
- Men accessories: Pocket watches with engraved silver cases, Felt trilby hats or homburgs, Leather gloves lined with cashmere
- Women formal: Long-sleeved evening gowns in deep jewel tones with modest shoulder pads, Fur-trimmed coats made of mink or fox for travel and outdoor events, Beaded clutch purses and silk stockings with seams
- Women casual: Wool jersey day dresses with pleated skirts and Peter Pan collars, Knitted wool cardigans and scarves in muted colors, Sturdy leather ankle boots with low heels
- Women accessories: Cloche hats decorated with velvet ribbons or feathers, Pearl necklaces and brooches featuring Art Deco motifs, Long leather gloves for formal outings

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby – 'Small Fry', Glenn Miller Orchestra – 'Pennsylvania 6-5000', Vera Lynn – early recordings gaining popularity; Films: The Adventures of Robin Hood (starring Errol Flynn), Bringing Up Baby (Katharine Hepburn and Cary Grant comedy); Theatre: Noël Coward’s plays continuing to draw London audiences, West End productions of light musical comedies and revues; Radio: BBC Home Service’s 'Monday Night at Seven' variety program, Children’s Hour featuring storytelling and educational content
- Typical prices: Loaf of bread: 4 pence, Coal scuttle refill: 1 shilling 6 pence, Taxi ride across town: 2 shillings
- Current events: Munich Agreement signed in late September 1938, heightening anxiety over European peace; Growing debate in Britain over rearmament and military preparedness
- Literature: Agatha Christie’s 'Appointment with Death' (1938) | George Orwell’s 'Homage to Catalonia' (published 1938) | Daphne du Maurier’s 'Rebecca' nearing completion, to be published 1938/39 | [Mystery and detective fiction] | [Social realist novels addressing contemporary issues] | [Romantic fiction with escapist themes]
- Technology: Early development of jet engine prototypes | Advancements in radio transmission clarity and portable sets | Improvements in domestic electric appliances like toasters and irons |
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Ambient temperature at the time the hourglass was found.: "forty-four degrees Fahrenheit"
  - The true time of death revealed after correcting the hourglass delay.: "twenty minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:20", "10.20", "ten twenty", "ten-twenty", "ten past twenty", "quarter past ten", "half past ten" — the ONLY acceptable form is "twenty minutes past ten"
  - The false death time indicated by the hourglass sand level.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - Thickness of frost layers inside the hourglass glass.: one sixteenth of an inch

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "twenty minutes past ten" and "ten minutes past nine" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_11] body, discovery, scene, victim, fresh, bloodied, head, wound, consistent, being, struck, heavy
  Category: physical | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): struck, heavy, antique, blunt, wound, manner, death

• [clue_1] hourglass, study, mantelpiece, contains, minute, frost, crystals, visible, inner, glass, surface
  Category: temporal | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): hourglass, frost, crystals, temporal, anomaly

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Ambient temperature at the time the hourglass was found.: "forty-four degrees Fahrenheit"
  • Thickness of frost layers inside the hourglass glass.: "one sixteenth of an inch"
  • The true time of death revealed after correcting the hourglass delay.: "twenty minutes past ten"
  • The false death time indicated by the hourglass sand level.: "ten minutes past nine"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Helen Marwood: she/her/her
  • Lady Beatrice Winthrope: she/her/her
  • Charles Montague: he/him/his
  • Margaret Hensley: she/her/her
  • Edward Winthrope: he/him/his
  • Clara Simmons: she/her/her
  • James Fletcher: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Margaret Hensley[SHE], Edward Winthrope[HE], Clara Simmons[SHE], James Fletcher[HE]
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
Known location profile anchors: Winthrope Manor Estate, Winthrope Manor Library, Servants’ Quarters, Winthrope Manor Gardens, Estate Gatehouse, Study room, Winthrope Manor Estate
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Winthrope Manor Estate", "Winthrope Manor Library", "Servants’ Quarters", "Winthrope Manor Gardens", "Estate Gatehouse", "Study room, Winthrope Manor Estate"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Study room, Winthrope Manor Estate". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Helen Marwood: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Lady Beatrice Winthrope: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Montague: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margaret Hensley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Winthrope: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Clara Simmons: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • James Fletcher: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Inspector watched Montague; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Inspector watched Montague; Montagu
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=8046; context=12560; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic wired telephones with party-line exchanges | manual typewriters for correspondence and record-keeping | battery-powered portable radios for news and entertainment | telegrams sent via nearest post office with typical delays | telephone calls subject to party-line privacy limitations | written correspondence through postal service with multi-day transit.
5. Respect setting movement/access constraints in scene action and alibis: estate roads and pathways restrict movement to defined routes | manor architecture includes locked private rooms and servant passages | estate isolation limits quick external assistance, especially after dusk | entry to manor controlled by gatehouse with visitor log | staff and residents have designated areas; unauthorized access discouraged and monitored.
6. Sustain social coherence with this backdrop pressure: Amid economic strain and rigid class divides, the residents and staff of an isolated 1930s English manor are bound by strict social codes and estate routines that heighten tensions when a murder disrupts their fragile order.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Helen Marwood, Lady Beatrice Winthrope, Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons.
8. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
9. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the controlled temperature hourglass test, Observe the delayed sand flow caused by frozen condensation, Draw conclusion about the false elapsed time reading, Link test results to Charles Montague’s manipulation
Test type: constraint_proof

**Suspect Clearance Scenes:**
- James Fletcher (Act 3, Scene 5): Invalidation of auditory timeline by wind and echo analysis
  Clues: Wind direction logs showing shift during evening, Servant testimony on gate latch confusion
- Margaret Hensley (Act 3, Scene 5): Alibi matching servants' shift overlapping and personal attestations
  Clues: Servants’ shift logs, Margaret’s testimony and demeanor analysis
- Edward Winthrope (Act 3, Scene 5): Alibi confirmation via formal scheduled meetings
  Clues: Estate meeting logs, Witness statements confirming Edward’s presence
- Clara Simmons (Act 3, Scene 5): Kitchen attendance records and lack of study access
  Clues: Kitchen logs, Access permissions

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with physical evidence and temporal contradiction exposed by hourglass test

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
Suspect pressure target(s): Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons, James Fletcher
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Lady Beatrice Winthrope" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Lady Beatrice Winthrope in the same paragraph.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Study room, Winthrope Manor Estate — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Inspector Helen Marwood must claim or be recognised as the investigator in this chapter. Establish Inspector Helen Marwood as the detective-in-charge within the first two paragraphs — Inspector Helen Marwood IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Inspector Helen Marwood begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • minute, frost, crystals, visible, inside, glass, hourglass, resting, study, mantelpiece [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
    • victim, head, shows, large, bruise, blood, blunt, force, wound, heavy, antique, paperweight [clue_11] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • faint, scratch, visible, latch, study, room, window [plant:clue_3]
    • study, window, latch, showing, signs, slight, opening [plant:clue_4]
    • testimony, access, logs, confirm, charles, montague, required, skills, opportunity, manipulate, hourglass [plant:clue_14]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Charles Montague's established alibi is "Between quarter past six and half past six". Do NOT place Charles Montague at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions Ambient temperature at the time the hourglass was found., write exactly: "forty-four degrees Fahrenheit".
  - If this batch mentions Thickness of frost layers inside the hourglass glass., write exactly: "one sixteenth of an inch".
  - If this batch mentions The true time of death revealed after correcting the hourglass delay., write exactly: "twenty minutes past ten".
  - If this batch mentions The false death time indicated by the hourglass sand level., write exactly: "ten minutes past nine".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Helen Marwood: she/her/her
    Lady Beatrice Winthrope: she/her/her
    Charles Montague: he/him/his
    Margaret Hensley: she/her/her
    Edward Winthrope: he/him/his
    Clara Simmons: she/her/her
    James Fletcher: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons, James Fletcher
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Half past six: Hourglass indicates death time
- Established timeline fact: Half past seven: Body discovered
- Established timeline fact: Quarter past six: Margaret Hensley last saw Lady Beatrice alive
- Established timeline fact: Half past six: Garden gate latch sound heard
- If referenced, use exact phrase: "forty-four degrees Fahrenheit" (Ambient temperature at the time the hourglass was found.).
- If referenced, use exact phrase: "one sixteenth of an inch" (Thickness of frost layers inside the hourglass glass.).
- If referenced, use exact phrase: "twenty minutes past ten" (The true time of death revealed after correcting the hourglass delay.).
- If referenced, use exact phrase: "ten minutes past nine" (The false death time indicated by the hourglass sand level.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Frosted Hourglass Mystery
Era: 1930s
Setting: Winthrope Manor Estate
Crime: murder (blunt force trauma with a heavy antique paperweight)
Culprit: Charles Montague
Victim: Lady Beatrice Winthrope
False assumption: The hourglass on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six.
Cast: Inspector Helen Marwood (she/her), Lady Beatrice Winthrope (she/her), Charles Montague (he/him), Margaret Hensley (she/her), Edward Winthrope (he/him), Clara Simmons (she/her), James Fletcher (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Winthrope Manor Estate). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Winthrope Manor Estate" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Helen Marwood — she/her/her (NEVER he/him)
• Lady Beatrice Winthrope — she/her/her (NEVER he/him)
• Charles Montague — he/him/his (NEVER she/her)
• Margaret Hensley — she/her/her (NEVER he/him)
• Edward Winthrope — he/him/his (NEVER she/her)
• Clara Simmons — she/her/her (NEVER he/him)
• James Fletcher — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "Study room, Winthrope Manor Estate",
      "timeOfDay": "Early morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Inspector Helen Marwood",
      "Lady Beatrice Winthrope",
      "Charles Montague",
      "Margaret Hensley",
      "Edward Winthrope",
      "Clara Simmons",
      "James Fletcher"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_11",
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Margaret Hensley lingers at the door — unguarded grief"
      ]
    },
    "summary": "Inspector Helen Marwood arrives at the study where Lady Beatrice Winthrope’s body is discovered with a fresh, bloodied head wound consistent with a heavy antique paperweight. The suspects are gathered, and Helen notices frost crystals on the hourglass on the mantelpiece, hinting at something unusual about the time of death.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "emotionalRegister": "A heavy, somber mood envelops the manor at the shock of Lady Beatrice’s death.",
    "dominantCharacterNote": {
      "name": "Inspector Helen Marwood",
      "voiceRegister": "Helen speaks with measured precision and clipped clarity, her tone calm yet incisive, cutting through pretense with dry wit and subtle irony."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Reliance on wired party-line telephones compromising privacy and communication speed; Limited personal transport with rare petrol touring cars and distant steam train stations; Manual typewriters and telegrams as primary means of urgent written communication; Short daylight hours restricting outdoor activity and travel during winter; Estate isolation with locked gates and monitored access limiting movement; Environmental effects like cold temperatures causing physical phenomena impacting objects",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_3",
      "clue_4",
      "clue_14"
    ]
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
□ Chapter 1: the clue [clue_1] (hourglass, study, mantelpiece, contains, minute, frost, crystals, visible, inner, glass, surface) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_11] (body, discovery, scene, victim, fresh, bloodied, head, wound, consistent, being, struck, heavy) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Helen Marwood | she/her/her/herself       | [fill in]     | [yes/no]
  Lady Beatrice Winthrope | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Montague     | he/him/his/himself        | [fill in]     | [yes/no]
  Margaret Hensley     | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Winthrope     | he/him/his/himself        | [fill in]     | [yes/no]
  Clara Simmons        | she/her/her/herself       | [fill in]     | [yes/no]
  James Fletcher       | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 1 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play | subcode: stage_mode_outcome.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.
- Rewrite the chapter outcome so it matches the required story stage: if pressure mode is active, end with unresolved pressure; if reveal mode is active, include the full proof chain rather than accusation only.
- Do not accidentally resolve the case while fixing clue or setting issues; preserve unresolved pressure unless this chapter is explicitly the final reveal.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- The chapter outcome now matches the required story stage and does not drift into the wrong resolution mode.
- Primary failure class cleared: fair_play / stage_mode_outcome.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 1 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 1
Attempt: 3/3 | class: fair_play | subcode: stage_mode_outcome
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

PACKET MUST-FIX ITEMS
- Resolve fair_play issues before accepting this batch.
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: fair_play
RETRY SUBCODE: stage_mode_outcome
ATTEMPT: 2/3
OFFENDING TEXT: chapter must not contain confession/arrest/solution language.
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.
- Do not resolve the culprit in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language.
- End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
MITIGATION MODE: tighten_obligation
```
