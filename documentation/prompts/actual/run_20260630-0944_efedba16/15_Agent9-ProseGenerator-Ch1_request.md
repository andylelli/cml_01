# Actual Prompt Record

- Run ID: `run_efedba16-9baf-44a2-9d3a-254029d53cd9`
- Project ID: `proj_aa8a2295-c4b0-4827-a98f-2565d70fe160`
- Timestamp: `2026-06-30T09:54:42.607Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `266ac7dad4f5f422`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Evelyn Harcourt[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Evelyn Harcourt. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Evelyn Harcourt (woman), Lord Charles Harcourt (man) — DECEASED, past-tense only, Beatrice Langley (woman), James Harcourt (man), Agnes Wilkes (woman), Edward Mallory (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Evelyn Harcourt, Lord Charles Harcourt, Beatrice Langley, James Harcourt, Agnes Wilkes, Edward Mallory?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted out of desperation to prevent a scandal that would ruin an innocent life, blurring justice with mercy." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- ⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud), but the established setting is "cool, damp autumn with intermittent fog typical of English countryside · early evening with fading natural light and gas lamps beginning to glow inside the manor" (note "fog"). At the clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in the prevailing conditions (e.g. "a brief clearing in the fog") — so the mechanism can operate WITHOUT contradicting the established weather. Do not silently ignore the fog, and do not present the mechanism as if the conditions were always favourable.
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Lord Charles Harcourt. Name them — Lord Charles Harcourt — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Evelyn Harcourt, Lord Charles Harcourt (DECEASED), Beatrice Langley, James Harcourt, Agnes Wilkes, Edward Mallory
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Evelyn Harcourt: Private Investigator / Inquiry Agent
   - Lord Charles Harcourt: victim (DECEASED — does not appear in any scene, past tense only)
   - Beatrice Langley: Social Climber
   - James Harcourt: Troubled Heir
   - Agnes Wilkes: Loyal Servant
   - Edward Mallory: Upstart Entrepreneur
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

- James Harcourt
  Public identity anchor: Heir and Amateur Historian; suspect 
  Connection to victim: Son of Lord Charles Harcourt.
  Investigation relevance: access plausibility: medium | alibi window: Late morning around the time of death | opportunity channel: Access to manor house and gardens.
  Suspicion/pressure cue seed: Nervous when asked about whereabouts.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Langley
  Public identity anchor: Socialite and Charitable Organizer; suspect 
  Connection to victim: Lord Charles Harcourt had a secret romantic and financial arrangement with Beatrice Langley, which he intended to end.; Lord Charles Harcourt and Beatrice Langley’s affair was well-hidden until recently, with plans to cut Beatrice off financially causing conflict..
  Investigation relevance: access plausibility: high | alibi window: Mid-morning to just after noon | opportunity channel: Access to kitchen, ice trays, and servants’ quarters.
  Suspicion/pressure cue seed: Defensive when questioned about ice tray.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Agnes Wilkes
  Public identity anchor: Head Housekeeper; suspect 
  Connection to victim: Agnes Wilkes served Lord Charles Harcourt loyally for decades and shared a protective, if unspoken, bond.; Agnes Wilkes and Lord Charles Harcourt developed a trust over many years, with Agnes aware of his plans for the estate but opposed to their consequences..
  Investigation relevance: access plausibility: medium | alibi window: Morning to early afternoon | opportunity chan
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1934 October
October 1934 in rural England brings a crisp, damp autumn atmosphere where fog frequently rolls across ancient woodlands and estate grounds, muting sounds and blurring vision in the early mornings. The shortening daylight hours impose a deliberate rhythm on estate life, with formal dinners and fireside gatherings punctuating evenings. The Great Depression's shadow weighs heavily, manifesting in reduced staff and careful management of dwindling resources. Social hierarchies remain entrenched, but economic hardship and growing political unrest stir unease beneath the veneer of aristocratic civility. Men in tweed suits and women in modest silk blouses and bias-cut skirts observe strict dress codes, reflecting their social roles amid uncertain times. The estate’s isolation, enforced by miles of farmland and dense hedgerows, both protects and imprisons its inhabitants, whose lives unfold within rigid schedules and whispered secrets. Radio broadcasts and early telephones hint at modernity but do little to dispel the pervasive tension, as tradition confronts change and ambition contends with loyalty.
Emotional register: A collective mood marked by reserved tension, anxiety over social decline, and cautious adherence to tradition.
Physical constraints: Limited and unreliable road transport with early petrol touring cars | No modern electronics; reliance on manual typewriters and party-line telephones | Isolation of estates by natural barriers and social gatekeeping | Forensic methods limited to fingerprinting, basic toxicology, and emerging ballistics
Current tensions (weave into background texture): Economic strain on rural estates due to the Great Depression | Political unease amid rising fascism in Europe and domestic austerity | Social unrest with growing class tensions and servant employment insecurity
Wartime context — Pre-World War II; military service not yet widespread but looming on the horizon: Society remains structured around peacetime hierarchy, with growing awareness of global instability Absence effect: No direct wartime absence yet, but latent fears and anticipations subtly influence personal and social interactions

## Season Lock (mandatory — derived from 1934 October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
This mystery explores how the fragile social order and rigid class distinctions of a 1930s English manor conceal deeper tensions and deceptions, revealing that truth often lurks behind manipulated perceptions of time and loyalty.

## Story Emotional Register
Dominant: A steadily mounting tension that shifts from reserved suspicion to intense revelation, culminating in a bittersweet resolution of justice tempered by social cost.

Arc:
The story opens enveloped in the foggy, cool atmosphere of a 1930s English manor estate, where the discovery of Lord Charles Harcourt’s poisoned body casts a pall of shock and unease. The initial calm is deceptive, with the sundial’s shadow seemingly marking the time of death, embedding a false certainty that cloaks the estate in silent suspicion.

As the investigation begins, Evelyn Harcourt’s sharp mind peels back layers of servant testimonies and physical clues, but contradictory evidence and forged documents lead to confusion and tentative accusations. The emotional strain grows as loyalty and trust are tested, and false leads momentarily threaten to derail the pursuit of truth, deepening the story’s undercurrent of tension and guarded fear.

Midway, Evelyn’s discovery of the sundial’s thermal expansion effect pivots the investigation, transforming the perceived timeline and forcing a reevaluation of all prior assumptions. This revelation injects fresh urgency and a sense of cautious hope, marking a turning point where the mystery’s core begins to unravel.

Following this, the narrative reinterprets previous contradictions—the forged ledger, contradictory servant testimonies, and the peculiar delayed poison delivery—casting a new light on the suspects’ motives and alibis. The emotional tone sharpens, with suspicion focusing increasingly on James Harcourt, whose desperation and opportunity emerge starkly against the backdrop of manipulated time.

Approaching climax, mounting pressure culminates in a tense confrontation where the sundial’s shadow delay is demonstrated and ledger discrepancies exposed, forcing the culprit into the open. This sequence carries a charged mix of revelation and reckoning, where justice is both achieved and shadowed by the costs of deceit and fractured family ties.

In resolution, the emotional register softens to one of somber reflection. The estate’s social order is disturbed irrevocably, and characters grapple with personal losses and the consequences of exposed truths. Evelyn’s victory is tempered by the.

## Emotional register at this point in the story
A haunting stillness and shock settle over the manor with the discovery of the poisoned patriarch.

## Character Portraits (appearance & era)

### Beatrice Langley
Beatrice’s polished social charm masks the desperation wrought by the Great Depression’s impact on personal fortunes and social standing. Her secret affair and financial precariousness highlight the tenuous positions women of her class occupied, balancing ambition with societal expectations in a conservative yet unstable era.
Era intersection: Her social climbing and vulnerability underscore the tightening grip of economic hardship on upper-class women reliant on male patronage.

### James Harcourt
James, the charming yet reckless heir, embodies the restless youth of the 1930s aristocracy caught between entitlement and impending ruin. His mounting debts and strained family ties reflect the era’s generational conflicts and the fragility of inherited privilege amid financial crisis.
Era intersection: His desperation to secure inheritance mirrors the broader anxiety among heirs facing the erosion of traditional wealth and status.

### Agnes Wilkes
Agnes, the steadfast housekeeper, represents the loyal servant caught between duty and disillusionment in a declining class system. Her protective affection for the patriarch and resentment toward the family’s neglect reflect the era’s growing class tensions and the uncertain future of domestic service.
Era intersection: Her role highlights the shifting social dynamics as servants face job insecurity and evolving expectations in 1930s England.

### Edward Mallory
Edward’s ambition to ascend the social ladder through business and advantageous connections illustrates the rising influence of commerce amid the waning aristocracy. His polished demeanor and opportunistic dealings reflect the 1930s’ evolving social fabric, where new money challenges old privilege.
Era intersection: His aspirations and frustrations capture the era’s tension between traditional landed power and emerging economic forces reshaping society.

## Character Voices

### Beatrice Langley (she/her/her)
Beatrice’s speech is florid and deliberate, laced with genteel sarcasm and barbed compliments, masking sharp calculation.
[comfortable] Isn’t society simply a dance of masks and whispers? One must learn the steps to survive.
[evasive] I assure you, my presence at the village hall was quite beyond reproach, as several can attest.
[stressed] Financial matters are rarely as simple as they appear; one must navigate carefully, lest the floor gives way beneath one’s feet.
Humour: Her humour is a polished polite savagery, using wit as social armour.

### James Harcourt (he/him/his)
James speaks bluntly and directly, often clipped and impatient, revealing his frustration and nervousness.
[comfortable] Look, I’m not one for beating around the bush. What’s done is done, and we must deal with it.
[evasive] I was in the stables, tending to the horses. That’s all there is to it — no more, no less.
[stressed] You think I’d risk everything? You don’t know what’s at stake here. I’m running out of options.
Humour: James’s humour is minimal and blunt, reflecting his straightforward, pressured nature.

### Agnes Wilkes (she/her/her)
Agnes speaks in a steady, unembellished tone with a dry, deadpan delivery revealing quiet intelligence and patience.
[comfortable] Well, that’s the way of things, isn’t it? You take your duties as they come and keep your head down.
[evasive] I was occupied with the evening servants’ routines. There’s little time for anything else in this house.
[stressed] These walls have ears, and sometimes they hear things best left unspoken.
Humour: Agnes’s humour is subtle, expressed through ironic understatement rather than overt jokes.

### Edward Mallory (he/him/his)
Edward’s voice is smooth and confident, peppered with sharp social observations and persuasive rhetoric.
[comfortable] Opportunity, my friend, is a most persuasive companion. One must seize it when it appears.
[evasive] I was at the village pub, among friends. There’s no reason to doubt their witness.
[stressed] The ledger entries? I assure you, any discrepancies are mere clerical errors, nothing more.
Humour: Edward uses observational humour to charm and assert control.

## Location Registers (scene framing guides)

The Library at Harcourt Manor: The library exudes a solemn, almost sacred stillness, where the weight of knowledge and secrets presses heavily. It is a place where the past lingers palpably, and the recent violence fractures the quiet, leaving an oppressive tension in the air.. Camera angle: Enter with a sense of reverence and unease, as if stepping into a fragile repository of truth and lies alike.. Era: Access is tightly controlled, reflecting 1930s estate privacy norms and restricted movement.

Servants’ Quarters: The quarters feel cramped and subdued, a stark contrast to the manor’s grandeur, where whispered confidences and shared anxieties simmer beneath routine duties, reflecting the social divide and pressures of servitude.. Camera angle: Observe with quiet empathy, capturing the tension between duty and personal survival.. Era: Strict access control enforces social separation typical of the period.

Formal Gardens and Sundial: The gardens radiate an air of serene order, yet the sundial at its heart embodies time’s relentless and deceptive influence, underscoring the story’s themes of hidden truths and manipulated realities.. Camera angle: Frame the sundial as both a symbol of permanence and a subtle trickster of time.. Era: Open only during daylight under staff supervision, emphasizing controlled access.

Stable Yard and Coach House: A hub of steady, practical activity, the stable yard carries the scent and sounds of tradition, yet also the undercurrent of tension from the estate’s mounting pressures and secrets.. Camera angle: Capture the interplay of routine and underlying unrest permeating this working space.. Era: Access limited to authorized staff, reflecting hierarchical estate control.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of discovering a murder victim demands a solemn tone; humour would undermine the emotional impact.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Lord Charles Harcourt died exactly at solar noon, as indicated by the sundial’s shadow.
- Hidden truth to progressively expose (compose in your own words from these elements): sundial, shadow, delayed, thermal, expansion, brass, gnomon, causing, victim, died, earlier, allowing
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: garden, thermometer, next, sundial, shows, temperature, well, above, seventy, five, degrees, fahrenheit | corr: high, temperature, cause, thermal, expansion, brass, gnomon, delaying, sundial, shadow, alignment, approximately | effect: narrows, time, death, window, minutes, before, solar, noon, contradicting, witness, assumptions
  - Step 2: obs: ledger, book, shows, seven, shilling, mismatch, total, sums, shades, differ, entries, supposedly | corr: ledger, entries, forged, altered, invalidating, timeline, victim, presence, conversations, morning | effect: eliminates, edward, mallory, claim, accurate, record, keeping, narrows, suspect, pool, access, motive
  - Step 3: obs: servants, report, hearing, victim, footsteps, stable, yard, twice, once, quarter, past, nearly | corr: wind, direction, stable, door, acoustics, caused, echoes, sound, refraction, creating, auditory, illusions | effect: eliminates, suspicion, double, presence, secret, movement, narrowing, timeline, suspect, alibis
  - Step 4: obs: tray, hollowed, cubes, servants, testify, victim, demeanor, unchanged, immediately, drinking, iced, water | corr: poison, concealed, hollow, cubes, releasing, toxin, slowly, causing, delayed, poisoning, effect, ingestion | effect: narrows, poison, administration, early, before, solar, noon, implicates, access, kitchen, tray
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): demonstration, measures, sundial, shadow, delay, similar, temperature, conditions, confirming, approximately, minute, caused
- Test must rely on already-shown clue IDs: clue_13, clue_core_contradiction_chain, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The garden thermometer and visible gnomon expansion gap (early clues) reveal the sundial shadow delay correcting the assumed time of death. Step 2: Ledger discrepancies with ink differences and receipt dates (mid clues) expose a forged timeline invalidating Edward Mallory’s accounting. Step 3: Footprint evidence and wind data (mid clues) clarify servant testimony contradictions about footsteps, eliminating double presence theories. Step 4: Hollow ice cubes and servant testimonies (mid to late clues) establish the delayed poisoning method. Step 5: James Harcourt’s suspicious behavior, access, and motive (late clues) focus guilt. The discriminating test applies these known facts to prove the false assumption and identify the culprit.

## Character Reference

### Beatrice Langley (she/her — NEVER he/him)
Beatrice’s speech is florid and deliberate, peppered with genteel sarcasm and barbed compliments
She enjoys weaving social niceties with subtle jabs, her tone often masking sharp calculation beneath a veneer of warmth
Her laughter is light but sometimes tinged with a knowing edge.
She battles the fear of exposure and the shame of her financial desperation, caught between ambition and the moral compromises she has made along the way.
Voice colour: Beatrice Langley uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### James Harcourt (he/him — NEVER she/her)
James speaks in a straightforward, sometimes brusque manner, lacking pretense or artifice
His words are often clipped, and he tends to avoid unnecessary embellishment, reflecting his impatience and frustration
When nervous, he fidgets or interrupts himself.
He is torn between his entitlement as heir and the fear of losing everything, battling guilt over his reckless behaviors and resentment toward his father’s decisions.

### Agnes Wilkes (she/her — NEVER he/him)
Agnes speaks in a steady, unembellished tone, often with a dry, deadpan delivery that conveys both patience and quiet exasperation
She uses few words but when she does, they carry weight
Her humour is subtle, often expressed through ironic understatement rather than overt jokes.
She wrestles with her loyalty to the family and growing disillusionment as class tensions rise and the estate’s future becomes uncertain.

### Edward Mallory (he/him — NEVER she/her)
Edward speaks with a smooth, confident cadence, often punctuated by sharp observations about social dynamics and human nature
His tone is polished, occasionally slipping into persuasive rhetoric, reflecting his business mindset
He uses humour to disarm and to assert control.
He grapples with the limits of his ambition, aware that his social climbing may alienate those he wishes to impress and that some barriers may be insurmountable.
Voice colour: Edward Mallory uses observational humour — let it surface in their dialogue where natural, not in every line.



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

Primary Location: Harcourt Manor Estate (Wychwood Heath, England)
An imposing 1930s country manor nestled amidst rolling parkland and ancient woodlands, Harcourt Manor Estate exudes old-world grandeur and rigid social order, isolated from the nearby village of Wychwood Heath by miles of farmland and dense hedgerows.

Key Locations Available:
- The Library at Harcourt Manor (interior): Crime scene
- Servants’ Quarters (interior): Staff residence and work hub
- Formal Gardens and Sundial (exterior): Gathering space and symbolic landmark
- Stable Yard and Coach House (exterior): Work area and transport hub

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): reserved and tense under polite surface, reflecting social pressures and economic uncertainty
Weather: cool, damp autumn with intermittent fog typical of English countryside

Era markers: petrol touring cars on country roads | domestic telephones on party-line exchanges | manual typewriters for correspondence and record keeping

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Wychwood Heath, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Library at Harcourt Manor (interior):
  - Visual: leather-bound spines on bookcases, green-shaded banker’s lamp glow, velvet drapes drawn over window
  - Sounds: soft rustling of heavy pages, distant ticking of brass clock, quiet scratching of pen on paper
  - Scents: aged leather and parchment, faint pipe tobacco smoke, beeswax polish on wood
  - Touch: smooth leather chair armrest, cool brass of lamp base

Servants’ Quarters (interior):
  - Visual: plain whitewashed walls, faded linen curtains, scuffed wooden floorboards
  - Sounds: clinking of enamel dishes, low murmur of whispered conversations, scraping of chairs on floor
  - Scents: stale soap and liniment, warm bread baking nearby, sour sweat and damp wool
  - Touch: rough woolen uniforms, cool iron bed frames

Formal Gardens and Sundial (exterior):
  - Visual: vibrant autumn foliage, gleaming sundial face, clipped box hedges
  - Sounds: rustling dry leaves, distant birdcalls, soft crunch of gravel
  - Scents: earthy damp soil, faint scent of chrysanthemums, crisp autumn air
  - Touch: rough stone sundial surface, crisp fallen leaves underfoot

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- October 1934 in rural England brings a crisp, damp autumn atmosphere where fog frequently rolls across ancient woodlands and estate grounds, muting sounds and blurring vision in the early mornings
- The shortening daylight hours impose a deliberate rhythm on estate life, with formal dinners and fireside gatherings punctuating evenings
- The Great Depression's shadow weighs heavily, manifesting in reduced staff and careful management of dwindling resources
- Social hierarchies remain entrenched, but economic hardship and growing political unrest stir unease beneath the veneer of aristocratic civility
- Men in tweed suits and women in modest silk blouses and bias-cut skirts observe strict dress codes, reflecting their social roles amid uncertain times

TEMPORAL CONTEXT:

This story takes place in October 1934 during N/A.

Seasonal Atmosphere:
- Weather patterns: cool temperatures averaging 8-12°C (46-54°F), damp mornings with intermittent fog rolling in from nearby woodlands and fields, occasional chilly drizzle and overcast skies typical of English countryside autumn
- Daylight: shortening daylight hours with sunset around 6pm, dusk falling early, and morning fog delaying sunrise clarity
- Seasonal activities: fox hunting meets on crisp autumn mornings, harvesting and cider pressing on estate grounds, evening fireside gatherings with storytelling and radio listening
- Seasonal occasions: Harvest Festival celebrations in local villages earlier in the month, All Saints’ Day preparations on November 1st, influencing late October church services and floral decorations
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool tweed suits in earth tones with waistcoats, stiff detachable collars paired with silk ties, brogue leather Oxford shoes polished to a shine
- Men casual: knitted argyle sweaters worn under tweed shooting jackets, flat caps or homburg hats, corduroy trousers with turn-ups
- Men accessories: silver pocket watches with chain fob, leather driving gloves, silk scarves in muted plaids
- Women formal: long-sleeved silk blouses with lace collars paired with bias-cut wool skirts, cloche hats decorated with feathers or ribbons, suede pumps with modest heels
- Women casual: knitted twinsets or cardigan sweaters over shirtwaist dresses, wool berets or felt hats, long gloves for outdoor excursions
- Women accessories: beaded handbags, pearl necklaces and brooches, silk scarves tied at the neck

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby’s crooning gaining popularity on radio, Duke Ellington’s jazz orchestras touring Europe, British dance bands like Jack Hylton’s Orchestra; Films: British film 'The Private Life of Henry VIII' (1933) still drawing audiences, American gangster films such as 'The Thin Man' (1934); Theatre: West End productions of Noël Coward’s plays, revivals of Shakespearean dramas in country houses; Radio: BBC Home Service broadcasts including news, radio plays, and music programs, radio detective dramas beginning to gain listenership
- Typical prices: loaf of bread: 3 pence, a pint of milk: 1.5 pence, servant’s weekly wage: approximately 3-5 shillings
- Current events: Labour Party under Ramsay MacDonald governs a National Government coalition amidst economic difficulties; ongoing debates over tariffs and trade policy to combat Great Depression impacts
- Literature: Agatha Christie’s 'Murder on the Orient Express' (1934) gaining acclaim | Daphne du Maurier’s early short stories appearing in literary magazines | T.S. Eliot’s 'Murder in the Cathedral' first performed in 1935 but in preparation | [mystery and detective fiction] | [modernist poetry and drama] | [social realist novels addressing class and economic hardship]
- Technology: improvements in radio receiver designs making home radios more accessible | advances in automobile engineering improving touring car reliability | refinements in typewriter mechanisms increasing typing speed | manual typewriters for correspondence and record keeping | party-line domestic telephones with limited privacy | battery-powered portable radios for
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Delay caused by thermal expansion of sundial’s gnomon at midday.: "ten minutes"
  - Temperature recorded near sundial at time of death.: "eighty degrees Fahrenheit"
  - Victim’s actual time of death based on corrected sundial timing.: "half past eleven"
    ⛔ FORBIDDEN alternatives: "11:30", "11.30", "eleven thirty", "eleven-thirty", "eleven past thirty", "quarter past eleven" — the ONLY acceptable form is "half past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] garden, thermometer, next, sundial, shows, temperature, well, above, seventy, five, degrees, fahrenheit
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: high, garden, temperature, near, sundial

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Delay caused by thermal expansion of sundial’s gnomon at midday.: "ten minutes"
  • Temperature recorded near sundial at time of death.: "eighty degrees Fahrenheit"
  • Victim’s actual time of death based on corrected sundial timing.: "half past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Evelyn Harcourt: she/her/her
  • Lord Charles Harcourt: he/him/his
  • Beatrice Langley: she/her/her
  • James Harcourt: he/him/his
  • Agnes Wilkes: she/her/her
  • Edward Mallory: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Beatrice Langley[SHE], Agnes Wilkes[SHE], Edward Mallory[HE]
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
Known location profile anchors: Harcourt Manor Estate, The Library at Harcourt Manor, Servants’ Quarters, Formal Gardens and Sundial, Stable Yard and Coach House, Harcourt Manor Garden near the Sundial
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Harcourt Manor Estate", "The Library at Harcourt Manor", "Servants’ Quarters", "Formal Gardens and Sundial", "Stable Yard and Coach House", "Harcourt Manor Garden near the Sundial"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Harcourt Manor Garden near the Sundial". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Evelyn Harcourt: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Lord Charles Harcourt: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Langley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • James Harcourt: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Agnes Wilkes: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Mallory: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Evelyn watched Harcourt; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Evelyn watched Harcourt; Harcourt crossed the room and Evelyn frowned." (explicit)
9. In dialogue attribution, the pronoun refe
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7557; context=11157; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | domestic telephones often on party-line exchanges | manual typewriters for correspondence and record keeping | battery-powered portable radios for news | telegrams sent via nearest town post office | telephone calls routed through manual exchanges with possible delays.
5. Respect setting movement/access constraints in scene action and alibis: main house with locked private rooms accessible only to family and select staff | servants' quarters separated and with distinct access points | estate grounds enclosed by gates and natural barriers like hedges and woods | limited road access with one main driveway | weather conditions such as fog or rain can delay movement and obscure visibility.
6. Sustain social coherence with this backdrop pressure: The Harcourt family and their close associates are confined within the isolated manor estate during a tense autumn, where rigid class roles and economic strain heighten the pressure to maintain appearances amid growing suspicion.
7. Maintain continuity around these socially central cast anchors where relevant: Evelyn Harcourt, Lord Charles Harcourt, Beatrice Langley, James Harcourt, Agnes Wilkes, Edward Mallory.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the sundial shadow delay measurement and ledger checksum demonstration, Observe the hollow ice cubes and relate poison timing, Draw firm conclusion about the false temporal assumption and culprit identity
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Beatrice Langley (Act 3, Scene 5): Multiple servant alibis and timing contradictions disprove opportunity
  Clues: Servants’ consistent testimony on Beatrice’s whereabouts, Timing of ledger forgery excludes her access
- Agnes Wilkes (Act 3, Scene 5): Acoustic explanation of footsteps clears suspicion of secret movement
  Clues: Weather vane and footprint pattern data, Agnes’s observed duties and presence
- Edward Mallory (Act 3, Scene 5): Unaware of forged ledger entries and no motive for poisoning
  Clues: Ledger ink shade and checksum errors link to forgery, Edward’s known record-keeping habits

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with sundial physical test, ledger forgery proof, and ice tray evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Witness statement

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
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): James Harcourt, Beatrice Langley, Agnes Wilkes, Edward Mallory
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
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Lord Charles Harcourt" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Lord Charles Harcourt in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Harcourt Manor Garden near the Sundial — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Evelyn" or "Evelyn's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Evelyn" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Evelyn Harcourt must claim or be recognised as the investigator in this chapter. Establish Evelyn Harcourt as the detective-in-charge within the first two paragraphs — Evelyn Harcourt IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Evelyn Harcourt begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • garden, thermometer, placed, beside, sundial, reads, temperature, exceeding, seventy, five, degrees, fahrenheit [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: high, garden, temperature, near, sundial
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
  - ALIBI LOCK: James Harcourt's established alibi is "Late morning around the time of death". Do NOT place James Harcourt at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions Delay caused by thermal expansion of sundial’s gnomon at midday., write exactly: "ten minutes".
  - If this batch mentions Temperature recorded near sundial at time of death., write exactly: "eighty degrees Fahrenheit".
  - If this batch mentions Victim’s actual time of death based on corrected sundial timing., write exactly: "half past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Evelyn Harcourt: she/her/her
    Lord Charles Harcourt: he/him/his
    Beatrice Langley: she/her/her
    James Harcourt: he/him/his
    Agnes Wilkes: she/her/her
    Edward Mallory: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): James Harcourt, Beatrice Langley, Agnes Wilkes, Edward Mallory
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Sundial shadow at solar noon
- Established timeline fact: Servants’ testimonies about footsteps at quarter past ten and nearly eleven
- Established timeline fact: Ledger entries timestamped mid-morning
- If referenced, use exact phrase: "ten minutes" (Delay caused by thermal expansion of sundial’s gnomon at midday.).
- If referenced, use exact phrase: "eighty degrees Fahrenheit" (Temperature recorded near sundial at time of death.).
- If referenced, use exact phrase: "half past eleven" (Victim’s actual time of death based on corrected sundial timing.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Sundial’s Silent Verdict
Era: 1930s
Setting: Harcourt Manor Estate
Crime: murder (poisoning with delayed effect)
Culprit: James Harcourt
Victim: Lord Charles Harcourt
False assumption: Lord Charles Harcourt died exactly at solar noon, as indicated by the sundial’s shadow.
Cast: Evelyn Harcourt (she/her), Lord Charles Harcourt (he/him), Beatrice Langley (she/her), James Harcourt (he/him), Agnes Wilkes (she/her), Edward Mallory (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Harcourt Manor Estate). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Harcourt Manor Estate" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Evelyn Harcourt — she/her/her (NEVER he/him)
• Lord Charles Harcourt — he/him/his (NEVER she/her)
• Beatrice Langley — she/her/her (NEVER he/him)
• James Harcourt — he/him/his (NEVER she/her)
• Agnes Wilkes — she/her/her (NEVER he/him)
• Edward Mallory — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "Harcourt Manor Garden near the Sundial",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Lord Charles Harcourt",
      "James Harcourt",
      "Beatrice Langley",
      "Agnes Wilkes",
      "Edward Mallory"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Tension arises as the exact time of death is uncertain",
      "tension": "Discrepancy between sundial time and witness statements",
      "microMomentBeats": [
        "Agnes Wilkes pauses silently by the doorway, mourning quietly"
      ]
    },
    "summary": "The body of Lord Charles Harcourt is discovered beside the sundial in the manor garden. The household is in shock, and Detective Evelyn Harcourt is engaged by James Harcourt to discreetly investigate. Early observations note the garden thermometer reads an unusually high temperature, casting doubt on the sundial's accuracy.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "emotionalRegister": "A haunting stillness and shock settle over the manor with the discovery of the poisoned patriarch.",
    "dominantCharacterNote": {
      "name": "Lord Charles Harcourt",
      "voiceRegister": "Lord Charles’s voice is austere and clipped, each word deliberate with a tone of firm authority and restrained gravity."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited and unreliable road transport with early petrol touring cars; No modern electronics; reliance on manual typewriters and party-line telephones; Isolation of estates by natural barriers and social gatekeeping; Forensic methods limited to fingerprinting, basic toxicology, and emerging ballistics; Restricted movement of servants and estate members governed by strict routines",
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
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 1: the clue [clue_1] (garden, thermometer, next, sundial, shows, temperature, well, above, seventy, five, degrees, fahrenheit) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Evelyn Harcourt      | she/her/her/herself       | [fill in]     | [yes/no]
  Lord Charles Harcourt | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Langley     | she/her/her/herself       | [fill in]     | [yes/no]
  James Harcourt       | he/him/his/himself        | [fill in]     | [yes/no]
  Agnes Wilkes         | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Mallory       | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
