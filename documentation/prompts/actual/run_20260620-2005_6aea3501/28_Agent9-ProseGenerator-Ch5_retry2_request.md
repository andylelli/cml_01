# Actual Prompt Record

- Run ID: `run_6aea3501-f039-4b40-bc33-78b25107ce8b`
- Project ID: `proj_5f4e668b-257b-4fed-87e4-90607f127ab3`
- Timestamp: `2026-06-20T20:13:22.222Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.62`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `6c7af1b4b8351597`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Harold Finch (man), Margaret Langley (woman), Edward Langley (man), Clara Mitchell (woman), John Avery (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Harold Finch, Margaret Langley, Edward Langley, Clara Mitchell, John Avery?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit’s motive arose from a desperate attempt to prevent a ruinous inheritance dispute that would have destroyed the estate and left innocent servants destitute." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.



CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Harold Finch, Margaret Langley, Edward Langley, Clara Mitchell, John Avery
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Harold Finch: Police Detective / Inspector
   - Margaret Langley: Heiress / Matriarch
   - Edward Langley: Rebellious Scion
   - Clara Mitchell: Confidante / Gatekeeper
   - John Avery: Old Guard Traditionalist
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

## Era: 1931 April
April 1931 in the English countryside is a time of cautious renewal tempered by economic hardship and social tension. The Langley Manor estate, shrouded in mist and frequent drizzle, reflects the lingering grip of tradition amid subtle signs of change. Manor life unfolds with formal rituals and strict class boundaries, where servants move silently behind locked doors and the family maintains appearances despite financial strain. Radios hum quietly in drawing rooms, bringing news of political coalitions forming in Britain and fascist regimes rising in Europe. Fashion blends conservative earth tones with emerging softer styles, while social rituals such as afternoon tea and formal dinners uphold a fragile civility. The persistent dampness and muted light color every interaction with a blend of melancholy and stoic endurance, as the residents navigate personal ambition, loyalty, and fear in a world on the cusp of upheaval.
Emotional register: A pervasive sense of cautious endurance and underlying anxiety colors daily life in April 1931.
Physical constraints: Communication relies on rotary telephones with manual exchanges and telegrams via village offices | Travel is primarily by passenger train or reliable automobiles, limiting rapid external contact | Estate grounds are physically isolated by stone walls and social protocol restricting outsider access | Information dissemination depends on radio broadcasts and newspapers, delaying news flow
Current tensions (weave into background texture): The economic fallout of the Great Depression stresses estate finances and employment stability | Political instability in Britain with the Labour Party forming a National Government coalition | Rising fascist powers in Europe create an atmosphere of unease and guarded vigilance
Wartime context — Britain is in peacetime but watches warily as global tensions rise.: Retired military officers like John Avery embody traditional values and social order amidst uncertain times. Absence effect: No active conscription means families remain intact, but fear of future conflict weighs on the community.

## Season Lock (mandatory — derived from 1931 April)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
The story explores how rigid social structures and hidden personal motives in a fading aristocratic world can distort truth, revealing that justice often requires piercing through facades and false timelines to uncover deeper betrayals.

## Story Emotional Register
Dominant: A gradual unveiling of tension beneath composed facades, building to a moral reckoning that challenges loyalties and exposes hidden fractures.

Arc:
The story opens with an atmosphere thick with quiet tension and the heavy weight of aristocratic decorum shattered by the discovery of a stabbing in the family drawing room. The initial shock is compounded by the manor’s rigid social order, where each character’s restrained reactions hint at deeper secrets. As Inspector Finch begins his methodical investigation, subtle clues emerge — odd clock scratches, contradictory alibis, and nervous behaviors — creating a mounting unease that unsettles the household. False leads, such as Edward Langley’s financial desperation and elusive alibi, add layers of suspicion, while Margaret's guarded demeanor and Clara’s evasions deepen the emotional complexity. Midway, the revelation that the manor clock was deliberately wound backward shifts the narrative, forcing Finch to reassess the timeline and cast doubt on all previously accepted testimonies.

This pivot reshapes the emotional landscape from uncertainty to focused suspicion, increasing the psychological pressure on all involved. A second turn comes with the uncovering of physical evidence linking the butler, John Avery, to the clock tampering, forcing a confrontation that exposes long-hidden motives tied to loyalty, tradition, and fear of scandal. The tension culminates in a charged climax where Avery’s duplicity is laid bare, and the fragile social order fractures under the weight of truth. The resolution carries a bittersweet emotional tone: justice is served, but at the cost of shattered trust and the irreversible loss of innocence for the Langley family and their servants. Each character must reckon with the consequences of secrets and betrayals, highlighting the story’s core exploration of appearances versus reality.

## Emotional register at this point in the story
The discovery that the manor clock was wound backward forces a reevaluation of the timeline, shifting the mood from confusion to focused suspicion.

## Character Portraits (appearance & era)

### Inspector Harold Finch
Inspector Finch embodies the era's emerging professional detective, navigating the complexities of class and justice in a time when political pressure threatens to corrupt the rule of law. His meticulous nature and dry wit reflect a growing modernity contrasted against the decaying aristocratic world he investigates. Finch's internal struggle with external demands highlights the tensions between duty and expediency prevalent in 1931 Britain.
Era intersection: His commitment to impartial justice clashes with political expediency, mirroring societal struggles to maintain order amid economic and social upheaval.

### Edward Langley
Edward represents the restless younger generation challenging tradition, his fiery rhetoric and political activism sharply contrasting with the manor’s rigid decorum. His sardonic wit and rebellious spirit are shaped by the era’s growing social tensions and economic uncertainty. Edward’s personal vendetta and financial desperation underscore the fracturing of family bonds amid shifting class dynamics in 1930s England.
Era intersection: His conflicted loyalties and ambitions reflect the era's ideological battles between old privilege and emerging radicalism.

### Clara Mitchell
Clara embodies the precarious position of servants in a declining aristocratic household, balancing loyalty with self-preservation in uncertain times. Her polite manner and subtle sarcasm hint at a sharp mind navigating a world of strict social hierarchies and economic vulnerability. In 1931, her role as gatekeeper of secrets and forgeries positions her at the intersection of fading deference and rising individual survival instincts.
Era intersection: Her concealed financial manipulations and fear of exposure mirror the economic pressures on lower classes during the Great Depression.

### John Avery
John Avery epitomizes the steadfast traditionalist clinging to honor and social order amid a world in flux. His military bearing and formal speech reflect his commitment to preserving the old ways, even as he confronts moral compromises and looming change. In 1931, Avery’s role as estate manager and secret keeper places him at the heart of the estate’s tensions, embodying the struggle between loyalty to tradition and personal survival.
Era intersection: His fear of social upheaval and exposure of secrets highlights the era’s anxiety about the erosion of established hierarchies.

## Character Voices

### Inspector Harold Finch (he/him/his)
Speaks with deliberate clarity and measured cadence, using precise language and dry undertones.
[comfortable] It is crucial we examine every detail without bias; the truth often hides in plain sight.
[evasive] I must withhold judgment until all evidence is before us; premature conclusions serve no one.
[stressed] Time is running short, and pressures mount to close this case quickly, but justice cannot be rushed.
Humour: Finch’s humour is subtle and dry, used sparingly to defuse tension or highlight irony.

### Edward Langley (he/him/his)
Speaks rapidly with sharp sarcasm and biting rhetoric, often challenging social norms.
[comfortable] The old order is crumbling, whether they admit it or not; change is inevitable.
[evasive] I was where I said I was; if that’s not sufficient, perhaps the truth isn’t what they want to hear.
[stressed] You think I have no reason? Try living under their shadow and see how long you last.
Humour: His humour is sardonic and sharp, often used to unsettle or provoke.

### Clara Mitchell (she/her/her)
Soft-spoken with measured politeness, layering subtle sarcasm beneath courteous language.
[comfortable] I do my duties faithfully, as any loyal servant would, without seeking attention.
[evasive] I cannot recall hearing anything unusual; the house is often filled with many sounds.
[stressed] I assure you, I had no reason nor opportunity to be elsewhere at that time.
Humour: Her humour is polite savagery, subtle and used to deflect or control conversations quietly.

### John Avery (he/him/his)
Formal and measured, with occasional dry self-deprecating remarks reflecting military discipline.
[comfortable] Duty calls for steady hands and clear minds; distractions serve no purpose here.
[evasive] My whereabouts are well accounted for; any suggestion otherwise is unfounded.
[stressed] The weight of responsibility is not light, but it must be borne with honour.
Humour: His humour is sparse and self-deprecating, surfacing rarely to humanize his formality.

## Location Registers (scene framing guides)

The Family Drawing Room: This room feels heavy with legacy and unspoken tensions; its dim lighting and muted scents echo the weight of secrets and the sudden rupture of violence within its walls.. Camera angle: Approach with a sense of reverence and unease, observing how the decay of tradition contrasts with the fresh disturbance of death.. Era: Access is tightly controlled after dark, reflecting social hierarchies and restricted movement within the manor.

The Manor Library: The library exudes quiet contemplation and hidden knowledge; the scent of old books and polished wood invites reflection yet conceals the undercurrents of deceit that permeate the estate.. Camera angle: Enter as if stepping into a sanctuary of intellect, but remain alert to the shadows where secrets might lurk.. Era: Only accessible during daylight hours, emphasizing the manor’s regimented control of space and information.

Servants’ Hall: This space pulses with the subdued warmth of camaraderie and labor, yet it also marks the social boundaries that confine its occupants, highlighting the divide between service and privilege.. Camera angle: Observe with a respectful distance, noting the quiet resilience and unspoken frustrations of those who dwell here.. Era: Locked during family events to maintain strict separation of social spheres.

Estate Gatehouse: The gatehouse stands as a sentinel of order and control, its stone walls and flickering lanterns symbolizing the fragile barrier between the estate’s insular world and the outside uncertainties.. Camera angle: Approach with a feeling of guarded vigilance, sensing the weight of protocol and the slow drip of time.. Era: Staffed continuously, underscoring the manor’s isolation and the importance of surveillance.

## Humour guidance for this story position (first_turn)
Permission: conditional — condition: Allowed only if a character with humourLevel > 0.7 is present and no direct threat or violence occurs
Rationale: Tension scenes usually forbid humour to maintain suspense, but conditional allowance ensures tone is appropriate.

## Character Pressure
Clara Mitchell is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "It also reinterprets the servant’s testimony about the clock ticking oddly backward, transforming a dismissed oddity into a pivotal clue". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, Edward Langley’s alibi, initially a point of suspicion due to its reliance on the manipulated clock time, is definitively disproved by the stable logbook, clearing him and sharpening focus on the butler's deception". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The stopped manor clock’s displayed time accurately indicates the time of the murder.
- Hidden truth to progressively expose: The clock was deliberately wound backward, shifting the timeline by forty minutes and enabling the murderer to commit the crime earlier without suspicion.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear. | corr: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. | effect: Narrows suspect pool to those with access to clock mechanism, notably John Avery.
  - Step 2: obs: A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped at ten minutes past eleven. | corr: The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating all alibis based on the stopped clock time. | effect: Eliminates alibis dependent on clock time, focusing suspicion on those who could manipulate the clock.
  - Step 3: obs: The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the true time of death inferred from clock tampering. | corr: Edward’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer. | effect: Eliminates Edward Langley as suspect.
  - Step 4: obs: Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, and he was responsible for winding clocks on the evening of the murder. | corr: John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window to commit the murder. | effect: Identifies John Avery as the only suspect with motive, access, and opportunity.
- Discriminating test method: trap
- Discriminating test mechanism to dramatize (paraphrase only — do NOT copy this sentence verbatim into prose): A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool marks, combined with cross-referencing the butler’s schedule against the stopped clock time, conclusively proves deliberate clock winding backward by John Avery, exposing his false alibi and opportunity to commit the murder.
- Test must rely on already-shown clue IDs: clue_1, clue_11, clue_7, clue_3, clue_8, clue_clock_hands_scratches
- Fair-play rationale: Step 1: The physical scratches on the clock hands and pendulum bob (early clues) establish tampering. Step 2: The servant’s testimony about the odd ticking (mid clues) reveals clock manipulation. Step 3: The stable logbook entries (mid clues) eliminate Edward Langley. Step 4: The butler’s schedule conflict (late clue) links him to the tampering. All clues are presented before the discriminating test, allowing the reader to deduce the true timeline and culprit.

## Character Reference

### Inspector Harold Finch (he/him — NEVER she/her)
Speaks with deliberate enunciation and a measured cadence
often uses dry, understated remarks to punctuate observations
Tends to phrase questions precisely and rarely indulges in small talk, though his rare wry comments reveal a sharp intellect beneath the formal exterior.
Harold struggles with the moral dilemma of enforcing justice impartially while resisting pressure from powerful figures demanding a swift resolution, fearing that yielding would betray his lifelong commitment to truth.

### Edward Langley (he/him — NEVER she/her)
Speaks with sharp, biting sarcasm and quick retorts
His tone often carries a rebellious edge, with a tendency to mock the pretensions of his family and their world
He uses humour as a weapon to unsettle and provoke, never missing an opportunity for a pointed barb.
Edward struggles to reconcile his radical ideals with lingering familial loyalties and the personal cost of his vendetta, creating a turbulent inner battle between ambition and conscience.

### Clara Mitchell (she/her — NEVER he/him)
Speaks in a soft, measured tone with an undercurrent of polite sarcasm
Her words often carry a double meaning, delivered with impeccable manners that thinly veil sharp observations
Clara’s humour is subtle, used sparingly to deflect suspicion or assert quiet control.
Clara wrestles with the guilt of betraying the family she serves and the fear of losing everything if her forgeries are exposed, caught between loyalty and self-preservation.

### John Avery (he/him — NEVER she/her)
Speaks with formal, deliberate phrasing, occasionally punctuated by dry self-deprecating remarks
His military background informs a direct style, but he tempers it with modesty and a touch of wry humour that surfaces when least expected.
John grapples with his role in past cover-ups and the fear that changing times will render his lifelong values obsolete, caught between loyalty and the inevitability of change.



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

This story takes place in April 1931 during spring.

Seasonal Atmosphere:
- Weather patterns: cool temperatures averaging 45-55°F (7-13°C), frequent overcast skies with intermittent drizzle, ground damp from overnight showers, occasional fog in mornings
- Daylight: Lengthening spring days with daylight extending until roughly 7:45 pm, twilight lingering softly until nearly 8:30 pm
- Seasonal activities: Tending to early spring gardens, planting pansies and primroses in manor grounds, Afternoon tea gatherings in conservatories or drawing rooms to avoid damp chill, Strolling along estate paths wrapped in light wool coats and scarves during breaks in drizzle
- Seasonal occasions: Easter Sunday (April 5, 1931), St. George’s Day (April 23, 1931) celebrated modestly in some households
- Season: spring

Period Fashion (describe naturally):
- Men formal: three-piece wool suits in muted greys and browns with wide lapels, starched detachable collars paired with conservative neckties, leather Oxford shoes polished to a high shine
- Men casual: knitted argyle sweaters layered over collared shirts, plus-fours or tweed knickerbockers for outdoor pursuits, soft felt trilby or homburg hats
- Men accessories: silver pocket watches with chain fobs, leather driving gloves, silk scarves in subtle patterns
- Women formal: bias-cut day dresses with modest dropped waists in pastel shades, cloche hats adorned with narrow ribbons or small flowers, kid leather gloves in cream or pale grey
- Women casual: pleated skirts paired with knit cardigans, lightweight trench coats for damp weather, flat-heeled oxford shoes or Mary Janes
- Women accessories: small leather handbags with metal clasps, string of pearls or delicate brooches, umbrella with wooden crook handle

Cultural Context (reference naturally):
- Music/entertainment: Al Bowlly's crooning hits on BBC broadcasts, Duke Ellington’s jazz gaining limited but influential audiences in London clubs, Dance bands playing foxtrots and waltzes at local ballrooms; Films: ‘Dracula’ (1931) starring Bela Lugosi, recently released and causing a stir, ‘City Lights’ by Charlie Chaplin, widely admired; Theatre: Noël Coward’s plays popular among London society, Operettas and revues in West End theaters; Radio: BBC National Programme delivering news and variety shows, Detective serials gaining a modest following
- Typical prices: Loaf of bread: 4 pence, Pint of milk: 3 pence, Taxi ride across town: 2 shillings
- Current events: Britain grappling with the economic fallout of the Great Depression, unemployment rising sharply; Labour Party under Ramsay MacDonald forming National Government coalition in response to crisis
- Literature: Agatha Christie’s ‘The Sittaford Mystery’ (1931) | Virginia Woolf’s essays in literary journals | D.H. Lawrence’s works continuing to provoke debate | [Mystery and detective fiction] | [Modernist literature with social commentary] | [Historical novels set in British countryside]
- Technology: Improved radio receivers with better sound clarity | Early versions of electric vacuum cleaners becoming available | Automatic telephone exchanges beginning to replace manual switchboards | Wind-up gramophones in many drawing rooms | Rotary dial telephones installed in wealthier homes | Manual typewriters standard in offices and manor studies
- Daily life: Reading newspa
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

• [clue_5] The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.

• [clue_6] Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer.
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: Edward Langley’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer.

• [clue_14] Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect.
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: Eliminates Clara Mitchell because her alibi is corroborated by multiple witnesses and logs.

• [clue_15] The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: Edward Langley’s alibi is disproved by the stable logbook, excluding him from suspicion.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Harold Finch: he/him/his
  • Margaret Langley: she/her/her
  • Edward Langley: he/him/his
  • Clara Mitchell: she/her/her
  • John Avery: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_butler_schedule_conflict, clue_2, clue_servant_odd_ticking, clue_3, clue_4, clue_alibi_timing, clue_8, rh_1, clue_core_elimination_chain, clue_culprit_direct_john_avery — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): The manor clock's hands show signs of tampering | The murderer's plan hinged on manipulating the manor | The manor clock's hands show signs of tampering | The scratches indicate deliberate tampering of the clock | The murderer's plan hinged on manipulating the manor | A servant recalls hearing the manor clock ticking | The clock was wound backward deliberately | A servant recalls hearing the manor clock ticking | John Avery premeditated the clock manipulation to create | rh_1 | Eliminates Clara Mitchell because her whereabouts during the | This direct evidence shows John Avery had means
• Suspects still unresolved: Clara Mitchell[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Before leaving, Finch paused to observe the room’s atmosphere. The cold, damp air, the flicker of lamplight, the subdued voices—all served as reminders of the estate’s isolation and the mounting tension. He glanced once more at the stopped hands—ten minutes pa..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 5+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-4:**
Inspector Harold Finch, Margaret Langley, Edward Langley, Clara Mitchell, John Avery

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
library, stable, manor, estate, corridor, drawing room, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Initial Examination
  Events: "The rain hasn't let up, has it?
Chapter 3: Chapter 3: Witness Statements
  Events: Finch considered the implication, his cadence measured as he spoke.
Chapter 4: Chapter 4: Motives Surface
  Events: Margaret Langley’s voice broke the silence, her tone calm but edged with anxiety.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.
═══════════════════════════════════════════════════════════


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
Known location profile anchors: Langley Manor, The Family Drawing Room, The Manor Library, Servants’ Hall, Estate Gatehouse, Stables and kitchen
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Langley Manor", "The Family Drawing Room", "The Manor Library", "Servants’ Hall", "Estate Gatehouse", "Stables and kitchen"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "Stables and kitchen". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 95/100):
  Quality gaps noted: required clue surfacing incomplete (4/5)
  Address in upcoming chapters: Surface missing clue evidence on-page with observable detail: rh_1.
- Phrases to avoid (already overused in earlier chapters): "avery s proximity to the clock and", "finch watched for any flicker of uncertainty", "hand rested on the clock s casing", "rested on the clock s casing fingers", "on the clock s casing fingers splayed", "the clock s casing fingers splayed as", "clock s casing fingers splayed as if", "s casing fingers splayed as if searching", "casing fingers splayed as if searching for", "fingers splayed as if searching for reassurance".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Harold Finch: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margaret Langley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Langley: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Clara Mitchell: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • John Avery: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Margaret watched Finch; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Margaret watched Finch; Finch crossed the room and Margaret frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speech:
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13810; context=10058; dropped=[humour_guide, location_profiles, texture_pool]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 5 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio receivers common in living rooms | early rotary dial telephones installed in manor offices and some family bedrooms | manual typewriters used for correspondence and record keeping | telephone calls routed through party-line or private exchanges within the estate | telegrams sent and received via nearest town telegraph office | airmail used for urgent overseas correspondence.
5. Respect setting movement/access constraints in scene action and alibis: estate grounds enclosed by stone walls and wrought iron gates limiting entry points | manor house layout includes restricted private family wings and servant-only corridors | weather typical of rural England with frequent fog and rain affecting visibility and evidence preservation | estate staff maintain strict visitor logs and control gatehouse entries | certain rooms and wings require permission to enter, with keys held by senior family members or head servants.
6. Sustain social coherence with this backdrop pressure: In a remote 1930s English country estate, the Langley family, their guests, and servants are confined by strict class divisions and social decorum amid economic hardship and rising geopolitical tensions, all under the watchful eye of estate staff and Inspector Finch.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Harold Finch, Margaret Langley, Edward Langley, Clara Mitchell, John Avery.
8. RETRY MITIGATION: Structural pivot mode is active — paragraph fingerprint has now failed twice for this chapter.
9. FORBIDDEN OPENING STRUCTURE: Do NOT begin this chapter with: "After the cold, damp air of the drawing room, Inspector Harold Finch found himself in the bustle of the Stables and kitchen as evening drew in."
10.   You MUST choose a structurally different opening from one of these three alternatives:
11.   (a) MID-DIALOGUE — the very first word of the chapter is spoken by a character (open quote, then speech).
12.   (b) PHYSICAL ACTION — the first sentence describes a character performing a concrete physical action they have not yet performed in any prior chapter (rising, moving, picking up an object, leaving a room).
13.   (c) SENSORY INTRUSION — the first sentence is an external sensory event interrupting the scene (a sound from outside, a knock, a clock ticking, a door slamming).
14. POSITIONAL FREEZE: The first three paragraphs must NOT position any character "near the clock", "before the clock", "approached the clock", "gestured toward the clock", or any synonymous phrase. The clock may be referenced in dialogue only within the first three paragraphs.
15. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Clara Mitchell (Act 3, Scene 5): Kitchen staff testimony confirms presence during murder
  Clues: clue_kitchen_testimony, clue_cleaning_schedule

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with clock tampering evidence and schedule contradictions

**Clue Placement for These Chapters:**
- clue_6 must appear in Act 2, Scene 2 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Clue Reinterpretation.
Mode required outcomes:
- State original clue meaning and revised meaning.
- Show suspect implications and theory update.
Forbidden at this stage:
- Do not introduce decisive new evidence from nowhere.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Reaction: 25-35%
- Clue Reinterpretation: 55-65%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 5-5.
Investigation state at start: 12 clue(s) revealed to reader; approximately 1 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Clara Mitchell, John Avery
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Stables and kitchen — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Before leaving, Finch paused to observe the room’s atmosphere. The cold, damp air, the flicker of lamplight, the subdued voices—all served as reminders of the estate’s isolation and the mounting tension. He glanced once...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer. [clue_6]
      Points to: Edward Langley’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer.
    • The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped. [clue_5]
      Points to: The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.
    • Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect. [clue_14]
      Points to: Eliminates Clara Mitchell because her alibi is corroborated by multiple witnesses and logs.
    • The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene. [clue_15]
      Points to: Edward Langley’s alibi is disproved by the stable logbook, excluding him from suspicion.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: John Avery's established alibi is "Claims to have been arranging clocks and schedules from 9:30 to 11:15". Do NOT place John Avery at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: John Avery has already made statements in earlier chapters. Any time, location, or claim attributed to John Avery in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Harold Finch: he/him/his
    Margaret Langley: she/her/her
    Edward Langley: he/him/his
    Clara Mitchell: she/her/her
    John Avery: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 5-5.
Investigation state at start: 12 clue(s) revealed to reader; approximately 1 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Clara Mitchell, John Avery
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Manor clock stopped at ten minutes past eleven
- Established timeline fact: Stable logbook records Edward Langley entering at half past eleven
- Established timeline fact: Butler’s schedule of clock winding from 9:30 to 11:15
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Gathering at Langley
Inspector Harold Finch entered the Victorian manor house, main hall, his steps muffled by the thick rug still damp from the morning’s persistent drizzle. A faint scent of beeswax mingled with the chill, and pale daylight filtered through the leaded windows, casting uncertain shadows across the oak banister. Silence hung heavy, broken only by the subdued murmur of voices and the steady ticking from the mantel. Finch’s attention was drawn to the manor clock, its hands stopped at ten minutes past eleven. As he leaned in, he noticed fine scratches radiating from the center pin—marks that seemed too deliberate to be the result of ordinary use. He traced them lightly with his gloved fingertip, considering their origin.

Straightening, Finch allowed the spring morning’s weight to settle on his shoulders. The clock, frozen at ten minutes past eleven, seemed to anchor the household in a moment of rupture. The scratches he observed were not the gentle erosion of years, but rather the telltale signs of intervention. Someone, he reasoned, must have handled the mechanism with unusual intent. Finch catalogued the detail, wondering who among the household had both access and motive to interfere with the timepiece. The discrepancy between the clock’s display and other evidence hinted at a deliberate attempt to obscure the true sequence of events. Finch resisted drawing conclusions, knowing that the evidence must be tested against the tangled loyalties of those present.

The main hall’s grandeur was diminished by the sight of Margaret Langley’s body, lying across the threshold to the library. Her pale blue dress, suited to the springtime, was marred by a deep crimson stain, and her gloved hand rested limply on the cold marble. Finch knelt beside her, careful not to disturb the scene. The air carried the musty aroma of leather and tobacco, blending with the damp chill that lingered from outside. Margaret Langley’s features were composed, as if the violence had caught her in a moment of calm. Finch searched for signs of struggle—overturned chairs, scattered papers—but found only the quiet order of a room interrupted by tragedy.

Edward Langley hovered nearby, his posture tense and eyes flicking between Finch and the clock. He wore a knitted argyle sweater over a collared shirt, the subdued hues echoing the gloom of the morning. Edward’s jaw tightened as Finch approached, and he spoke with a sharp edge. “You’ll find nothing here but old ghosts, Inspector. The manor’s secrets are older than any of us.” Finch regarded him with measured patience, noting the defensive stance and the way Edward’s fingers curled around the stable logbook he carried. Edward’s connection to Margaret Langley was clear—her son, estranged by years of political activism and family disputes. Finch marked Edward’s irritability, especially when questioned about finances, as a surface symptom of deeper wounds.

Clara Mitchell lingered at the periphery, her soft-spoken voice barely audible above the hush. She wore a pleated skirt and knit cardigan, hands folded neatly as she watched Finch’s movements. Clara’s gaze lingered on Margaret Langley, then shifted to the stopped clock. “I cannot recall hearing anything unusual,” she said, her tone layered with polite restraint. Finch observed the subtle tension in Clara’s posture, the way her fingers traced the edge of her handbag. Clara’s role as confidante and gatekeeper placed her at the intersection of family and staff, and Finch’s immediate read was one of cautious distance—her politeness masking a sharper mind.

John Avery, the retired military officer and family friend, entered with formal deliberation. His three-piece wool suit, starched collar, and polished Oxford shoes spoke of tradition, even as the spring drizzle clung to his coat. Avery’s eyes met Finch’s, steady and unflinching. “Duty calls for steady hands and clear minds, Inspector,” Avery intoned, his voice measured. Finch noted Avery’s proximity to the clock and his claim to have been arranging clocks and schedules from 9:30 to 11:15. Avery’s schedule placed him at the heart of the manor’s timekeeping, and Finch watched for any flicker of uncertainty. Avery’s hand rested on the clock’s casing, fingers splayed as if searching for reassurance.

The household gathered in uneasy silence, each member drawn into the orbit of the crime. The main hall, usually a site of springtime gatherings and formal rituals, now felt constricted by suspicion. Finch moved methodically, cataloguing each detail—the cold polished wood of the desk, the flicker of gas lamps, the muted sounds from the servants’ hall beyond. He paused at the rotary telephone mounted on the wall, its line routed through the village exchange, a reminder of the estate’s isolation. Finch’s deliberate cadence and dry undertones set the rhythm for the investigation, his presence both stabilizing and unsettling.

Margaret Langley’s legacy hung in the air, a fragile order threatened by the violence and the possibility of betrayal. Finch’s mind worked through the contradictions: the stopped clock at ten minutes past eleven, the scratches near the center pin, the household’s shifting alibis. He resisted the urge to draw quick conclusions, knowing that justice required patience and precision. The spring morning, heavy with drizzle and muted light, mirrored the uncertainty within the manor. As Finch prepared to question each suspect, he allowed himself a brief moment of reflection—a recognition that beneath the surface, every detail mattered, and the truth would not yield easily.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Examination
"The rain hasn't let up, has it?" John Avery remarked, his voice echoing faintly in the manor clock room, where the damp spring air carried a chill that clung to the brass and wood. Inspector Harold Finch, his gloved hand steady, leaned closer to the clock’s face, the scent of cold beeswax and faint tobacco smoke lingering as he traced the fine scratches near the center pin. The dim glow from the gas lamp flickered against the polished oak, revealing marks that looked purposeful—tiny gouges and lines radiating from the mechanism, as though someone had handled it with a tool rather than the gentle care of routine winding. Finch’s gaze lingered on the stopped hands, frozen at ten minutes past eleven. He spoke with measured clarity. "These marks are odd, Mr. Avery. They don't fit the pattern of regular maintenance. Someone has interfered with the clock, and not by accident." The silence between them was punctuated only by the distant patter of rain and the subdued tick from a smaller mantel clock across the hall.

Finch straightened, allowing the weight of the spring morning and the uneasy atmosphere to settle. He considered the implications: if the clock had been manipulated, the timeline of Margaret Langley’s murder was not what it seemed. He reasoned aloud, his tone precise but edged with suspicion. "If the clock was set back, perhaps by forty minutes, then the time displayed—ten minutes past eleven—would mislead anyone relying on it. Whoever did this intended to confuse the sequence of events." Finch’s inference reframed the meaning of the evidence; the stopped clock no longer anchored the moment of death but instead became a tool for deception. The contradiction unsettled the established order, casting doubt on every alibi tied to the clock’s display. Finch’s dry undertone surfaced: "It appears the household’s sense of time is as fragile as its sense of security."

John Avery’s posture stiffened, his fingers brushing the smooth edge of the clock casing as if seeking reassurance. The tension in Avery’s jaw betrayed a flicker of unease, and Finch registered the subtle shift—a man accustomed to discipline now confronted by the possibility of exposure. Avery’s voice, usually measured, faltered. "I assure you, Inspector, I followed my usual routine. The clocks require regular attention; any deviation would be noticed." Finch watched Avery’s eyes, noting the avoidance and the way his gaze flicked toward the rain-streaked window. The spring drizzle blurred the view of the estate grounds, isolating the manor further. Finch pressed gently, "Routine is the backbone of order, Mr. Avery. Yet these marks suggest someone sought to disrupt that order deliberately." The implication was clear: Avery’s proximity to the clock and his responsibility for its maintenance placed him squarely within the realm of suspicion.

The manor clock room felt constricted, the air thick with anticipation and the faint scent of musty leather. Finch catalogued the evidence, mentally revising the timeline. If the clock had been wound backward forty minutes, every alibi tethered to ten minutes past eleven was now suspect. He recalled Edward Langley’s claim of entering the stables at half past eleven—a detail rendered meaningless by the manipulated clock. Finch’s mind worked through the contradiction, resisting premature judgment but recognizing the shift in investigative focus. The springtime gloom outside mirrored the uncertainty within, and Finch allowed himself a brief pause, listening to the distant echo of voices from the Servants’ Hall.

Avery’s loyalty to the Langley family was evident, but Finch sensed a deeper conflict—a fear that tradition and duty might not shield him from scrutiny. The inspector’s dry wit surfaced again, this time as a counterpoint to the mounting tension. "One wonders, Mr. Avery, if the old ways are sufficient when the truth is so easily disguised." Avery’s response was measured but defensive. "Duty calls for steady hands, Inspector. I have nothing to hide." Finch noted the tremor in Avery’s tone, a vulnerability masked by formality. The inspector’s understanding of Avery shifted; what once seemed steadfast now appeared brittle, shaped by the pressure of maintaining appearances amid crisis.

Finch turned his attention to the rotary telephone mounted on the wall, its line routed through the village exchange—a reminder of the estate’s isolation and the limitations of communication. He considered the broader implications: the manipulation of the clock was not merely a technical feat but a calculated act designed to exploit the manor’s rigid schedule and social boundaries. The inspector’s cadence grew more deliberate, his questions more pointed. "Who else had access to the clock mechanism?" Finch asked, his gaze fixed on Avery. The reply came after a pause. "Only myself, Inspector. The family seldom interferes with such matters." Finch registered the admission, cataloguing it as both a clue and a pressure point.

The spring morning advanced, the drizzle intensifying against the leaded windows. Finch’s investigation deepened, his focus sharpened by the reframed evidence. He allowed himself a moment of ironic relief—a recognition that the unraveling of the manor’s timeline was both a challenge and an opportunity. The atmosphere in the clock room shifted, no longer merely tense but charged with the possibility of revelation. Finch’s dry observation lingered: "Time, it seems, is the most unreliable witness." Avery’s silence in response spoke volumes, and Finch marked the moment as a turning point. The investigation would now proceed with renewed purpose, every detail weighed against the possibility of deliberate deception.

As Finch prepared to leave the clock room, he glanced once more at the stopped hands—ten minutes past eleven—knowing that their significance had changed. The evidence was no longer a simple anchor but a puzzle piece in a larger scheme. Finch’s understanding of the case evolved, and with it, the emotional register of the manor. Suspicion deepened, loyalties frayed, and the fragile order of Langley Manor was further destabilized. The inspector’s resolve hardened; justice would require not only patience and precision but a willingness to pierce through facades and confront uncomfortable truths. The springtime gloom outside seemed less oppressive, replaced by a sense of cautious anticipation as Finch moved forward in his inquiry.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Witness Statements
Early afternoon brought a muted glow through the rain-streaked windows of the Manor sitting room, the air thick with damp and the scent of cold beeswax. Inspector Harold Finch stood at the threshold, his gaze drawn to the subdued flicker of lamplight on polished oak. The atmosphere was formal yet uneasy, the silence broken only by the distant echo of drizzle against glass and the low murmur of voices. Finch’s mind still lingered on the stopped hands—ten minutes past eleven—now more puzzle than anchor. As he prepared to address the assembled household, a servant’s voice carried quietly from the corridor: “I heard the manor clock ticking oddly, sir, and running backwards shortly before it stopped.” The words hovered, unsettling the room. Finch’s attention sharpened; the testimony was not merely an oddity, but a fracture in the timeline everyone had accepted.

Finch considered the implication, his cadence measured as he spoke. “If the clock was running backwards, the time displayed—ten minutes past eleven—may not mark the moment of death, but a deliberate misdirection. Someone intended to obscure the true sequence of events.” He allowed the silence to settle, watching for reactions. Margaret Langley’s legacy, once anchored to the clock’s display, now seemed fragile. Finch catalogued the new meaning: the clock’s odd behavior was no longer a trivial mechanical fault, but a calculated act. The suspicion shifted—anyone relying on the stopped time for an alibi was now vulnerable to contradiction.

Moving to the center of the room, Finch reached for the clock’s casing, his gloved hand tracing the faint grooves near the center pin. The marks were sharp, clustered in a way that suggested more than routine winding. “These are not the gentle signs of age,” he remarked, “but evidence that someone has interfered with the mechanism.” The observation was concrete, the implication clear: the clock had been handled with intent, not the care of regular maintenance.

He reasoned aloud, his tone precise. “Such intervention suggests a motive to manipulate the timeline. These scratches are the result of a tool, not natural wear. Whoever did this sought to disrupt the household’s sense of order.” Finch’s understanding shifted; the clock was no longer a passive witness but an active participant in deception. The household’s sense of order, once anchored to routine, now appeared brittle. Finch’s dry wit surfaced: “Time, it seems, is the most unreliable witness.” The remark drew a nervous smile from Edward Langley, whose fingers curled around the stable logbook he carried.

Edward Langley’s posture was tense, his jaw set as Finch approached. “You’ll find nothing but ghosts, Inspector. The manor’s secrets are older than any of us.” Finch regarded him with measured patience, noting the defensive stance. Edward’s alibi, anchored to the clock’s display, began to show cracks. Finch pressed gently. “You claimed to be in the stables at half past eleven, yet the clock’s manipulation invalidates that timeline. The stable logbook records your entry, but its meaning has changed.” Edward’s eyes flicked toward Clara Mitchell, seeking silent corroboration. The tension in his voice betrayed a deeper wound—a loyalty conflict sharpened by suspicion.

Clara Mitchell lingered near the window, her hands folded neatly as she watched Finch’s movements. Her voice, soft but layered with polite restraint, broke the silence. “I cannot recall hearing anything unusual, Inspector. The house is often filled with many sounds.” Finch observed the subtle tension in Clara’s posture, the way her fingers traced the edge of her handbag. Clara’s role as confidante and gatekeeper placed her at the intersection of family and staff, and Finch’s immediate read was one of cautious distance—her politeness masking a sharper mind. He pressed, “Did you notice the clock behaving strangely?” She hesitated, then replied, “Only that it seemed louder than usual, as if straining against itself.” The detail was slight, but Finch catalogued it as a supporting anomaly.

John Avery, standing with formal deliberation, met Finch’s gaze steadily. His three-piece wool suit and starched collar spoke of tradition, even as the spring drizzle clung to his coat. Avery’s claim to have been arranging clocks and schedules from 9:30 to 11:15 placed him at the heart of the manor’s timekeeping. Finch watched for any flicker of uncertainty. Avery’s hand rested on the clock’s casing, fingers splayed as if searching for reassurance. “Duty calls for steady hands and clear minds, Inspector,” Avery intoned. Finch noted Avery’s proximity to the clock and his responsibility for its maintenance. The implication was clear: Avery’s schedule and the scratches on the mechanism were not coincidental.

Finch catalogued the evidence, mentally revising the timeline. He weighed the servant’s testimony and the physical marks together, drawing a new conclusion. “If the clock was manipulated to run backward, the timeline of events is altered by a significant margin. The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward forty minutes before it stopped.” The contradiction unsettled the established order, casting doubt on every account.

Margaret Langley’s statement and a servant’s corroboration were revisited. Finch asked, “Did you notice anything unusual about the clock, Lady Langley?” Margaret’s reply was measured, her voice calm. “I recall the ticking seemed off, but I thought little of it at the time.” The servant’s testimony echoed: “It was as if the clock was fighting itself, ticking in reverse.” Finch catalogued the detail, recognizing its significance. The household’s sense of time, once reliable, was now a source of confusion. The implication was clear: the manipulation of the clock was not merely technical, but a calculated act designed to exploit the manor’s rigid schedule and social boundaries.

Finch’s cadence grew more deliberate, his questions more pointed. “Who else had access to the clock mechanism?” Avery replied after a pause. “Only myself, Inspector. The family seldom interferes with such matters.” Finch registered the admission, cataloguing it as both a clue and a pressure point. The spring afternoon advanced, the drizzle intensifying against the leaded windows. Finch’s investigation deepened, his focus sharpened by the reframed evidence. He allowed himself a moment of ironic relief—a recognition that the unraveling of the manor’s timeline was both a challenge and an opportunity. The atmosphere in the sitting room shifted, no longer merely tense but charged with the possibility of revelation.

Edward Langley’s sardonic humour surfaced as Finch pressed further. “If time is unreliable, Inspector, perhaps you should interrogate the weather next.” Finch’s dry undertone met the remark: “I find rain less evasive than most witnesses.” The exchange provided a moment of relief, the tension easing briefly before the inquiry resumed. Finch’s resolve hardened; justice would require not only patience and precision but a willingness to pierce through facades and confront uncomfortable truths. The springtime gloom outside seemed less oppressive, replaced by cautious anticipation as Finch moved forward in his inquiry.

As the session drew to a close, Finch reflected on the reframed clues. The clock’s odd behavior, the scratches, the contradictory testimonies—all pointed to a deliberate manipulation of time. The investigation’s emotional register deepened: suspicion, unease, and guarded behaviors now defined the household. Finch’s understanding evolved, and with it, the fragile order of Langley Manor. The inspector’s resolve was clear; the truth would not yield easily, but each detail mattered. The sitting room, once a site of formal ritual, now felt constricted by the weight of revelation. Finch allowed himself a brief pause, listening to the distant echo of voices from the Servants’ Hall, knowing that the next step would require even greater precision.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Motives Surface
A faint echo of rain against the Manor drawing room’s leaded windows lingered as late afternoon settled, the pale spring light filtered through mist and casting shifting shadows across the dark oak paneling. The air was thick with the scent of cold beeswax and a hint of tobacco, remnants from the morning’s unease. Inspector Harold Finch stood near the mantel, his gaze fixed on the stopped hands of the manor clock—ten minutes past eleven—while the subdued flicker of lamplight revealed the fine scratches around the center pin. The atmosphere was charged, every movement in the room measured as if the household feared disturbing the fragile order.

Margaret Langley’s voice broke the silence, her tone calm but edged with anxiety. "Inspector, I trust your methods, but this uncertainty weighs on us all. The estate cannot withstand further scandal." Her gloved fingers traced the smooth leather armrest, betraying a tension she tried to conceal. Finch nodded, his cadence deliberate. "The truth will emerge, Lady Langley. But it demands patience and clarity." The exchange carried an undercurrent of desperation—Margaret’s fear for her legacy, her need to control the narrative, and the pressure of social scrutiny in spring’s uncertain renewal.

Edward Langley shifted in his seat, the stable logbook balanced on his knee. He wore a knitted argyle sweater, its muted earth tones blending with the gloom of the day. "Inspector, if you’re looking for motive, you’ll find plenty. The estate’s debts, family disputes, and the old guard’s stubbornness—take your pick." His sarcasm was sharp, but his eyes betrayed a flicker of concern. Finch’s attention moved to the logbook, its pages creased from frequent handling. "You claim to have entered the stables at half past eleven. May I see the record?" Edward handed it over, his fingers lingering as if reluctant to let go.

The inspector examined the logbook, noting the entry: Edward’s name signed in bold script, dated for the afternoon. Finch’s brow furrowed. "This entry is timed after the clock stopped. Its reliability depends on the true sequence of events." He pressed further, "Did anyone witness your arrival?" Edward’s jaw tightened. "The stable hands saw me, but their testimony is as reliable as the weather. If the clock was tampered with, what does any record mean?" The tension in his voice revealed a loyalty conflict—Edward’s desire to clear his name clashing with his resentment toward family tradition.

Clara Mitchell stood near the rain-streaked window, her hands folded neatly. She wore a pleated skirt and knit cardigan, her posture composed but her gaze restless. Finch approached, his tone measured. "Miss Mitchell, where were you at the time the clock stopped?" Clara’s reply was soft, layered with polite restraint. "I was in the Servants’ Hall, assisting with preparations for tea. The kitchen staff can confirm." Finch noted the detail, cataloguing it as a possible elimination. Clara’s voice carried a subtle sarcasm, "I assure you, Inspector, my duties rarely stray from routine." Her words masked a deeper anxiety—the fear of exposure, the precarious balance between loyalty and self-preservation.

A servant’s report carried from the corridor, barely audible above the hush. "I heard a scream just as the clock struck ten minutes past eleven." The testimony, delivered with trembling certainty, acted as a red herring—reinforcing the false timeline established by the manipulated clock. Finch allowed the statement to settle, watching for reactions. Margaret’s face paled, Edward’s fingers tightened around the logbook, and Clara’s gaze flicked toward John Avery.

John Avery stood with formal deliberation beside the clock, his three-piece wool suit and starched collar immaculate despite the persistent drizzle outside. His hand rested on the clock’s casing, fingers splayed as if searching for reassurance. Finch addressed him directly. "Mr. Avery, your schedule places you arranging clocks from nine thirty to eleven fifteen. Can you account for every moment?" Avery’s response was measured, his military discipline evident. "My routine is well established, Inspector. The clocks require regular attention; any deviation would be noticed." Finch watched for any flicker of uncertainty, noting Avery’s proximity to the mechanism and his responsibility for its maintenance.

The inspector’s gaze lingered on the scratches near the center pin, cataloguing the evidence. He reasoned aloud, "Such marks are not the gentle signs of age, but evidence of intervention. Someone handled the mechanism with intent." Avery’s jaw clenched, his eyes avoiding Finch’s. The implication was clear: Avery’s schedule and the physical evidence were not coincidental. Finch pressed, "Did anyone else have access to the clock?" Avery hesitated. "Only myself. The family seldom interferes." The admission was both a clue and a pressure point, narrowing the pool of suspects.

A moment of relief surfaced as Clara offered a quiet observation. "The house is often filled with many sounds, Inspector. Sometimes, routine itself is the only alibi." Finch’s dry wit met her remark. "Routine can be a clever disguise, Miss Mitchell." The exchange eased the tension briefly, the atmosphere shifting from suspicion to cautious camaraderie. Yet the relief was fleeting; the investigation pressed onward.

Finch returned to the logbook, cross-referencing Edward’s entry with the kitchen staff’s testimony about Clara’s whereabouts. The inspector’s mind worked through the contradiction: if Clara was in the Servants’ Hall at the time of the murder, and Edward’s entry was timed after the clock stopped, then Clara’s alibi was confirmed by independent witnesses. Finch catalogued the detail, recognizing its significance. The elimination of Clara as a suspect sharpened focus on those with access to the clock.

A subtle anomaly caught Finch’s attention—John Avery’s schedule conflicted by exactly forty minutes with the time shown on the stopped clock face. The inspector noted the discrepancy, but refrained from drawing a final conclusion. Instead, he allowed the evidence to accumulate, knowing that the mechanism and its manipulation would require a discriminating test. Avery’s composure faltered, his formality masking a deeper fear: the weight of responsibility, the fear of exposure, and the struggle to preserve the old order.

As Finch catalogued the observable evidence, he registered the shifting pressure within the household. The spring afternoon waned, the drizzle intensifying against the glass. The drawing room, once a site of formal ritual, now felt constricted by suspicion and subtle hostility. The inspector’s resolve hardened; justice would require not only patience and precision, but a willingness to confront uncomfortable truths. The investigation’s emotional register deepened—motives surfaced, alibis were tested, and the fragile order of Langley Manor was further destabilized.

Before leaving, Finch paused to observe the room’s atmosphere. The cold, damp air, the flicker of lamplight, the subdued voices—all served as reminders of the estate’s isolation and the mounting tension. He glanced once more at the stopped hands—ten minutes past eleven—knowing their significance had changed. The evidence was no longer a simple anchor but a puzzle piece in a larger scheme. Finch’s understanding of the case evolved, and with it, the emotional landscape of the manor. Suspicion deepened, loyalties frayed, and the fragile order of Langley Manor was further destabilized. The inspector’s resolve was clear; the truth would not yield easily, but each detail mattered.
--- END PRIOR CHAPTER 4 ---

# Case Overview
Title: The Langley Clock Conundrum
Era: 1930s
Setting: Large country estate with late Victorian manor house
Crime: murder (stabbing with false timeline alibi)
Culprit: John Avery
False assumption: The stopped manor clock’s displayed time accurately indicates the time of the murder.
Cast: Inspector Harold Finch (he/him), Margaret Langley (she/her), Edward Langley (he/him), Clara Mitchell (she/her), John Avery (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Large country estate with late Victorian manor house). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Large country estate with late Victorian manor house" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Harold Finch — he/him/his (NEVER she/her)
• Margaret Langley — she/her/her (NEVER he/him)
• Edward Langley — he/him/his (NEVER she/her)
• Clara Mitchell — she/her/her (NEVER he/him)
• John Avery — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Alibis & Contradictions",
    "setting": {
      "location": "Stables and kitchen",
      "timeOfDay": "Evening",
      "atmosphere": "Busy with servant activity and scrutiny"
    },
    "characters": [
      "Inspector Harold Finch",
      "Edward Langley",
      "Clara Mitchell",
      "John Avery"
    ],
    "purpose": "Test alibis with timing and reveal inconsistencies",
    "cluesRevealed": [
      "clue_5",
      "clue_6",
      "clue_14",
      "clue_15"
    ],
    "dramaticElements": {
      "conflict": "Alibis begin to unravel under scrutiny",
      "tension": "Edward’s stable logbook entry contradicts his claimed timeline"
    },
    "summary": "Finch examines the stable logbook showing Edward Langley’s presence at half past eleven, conflicting with the murder timeline. Clara Mitchell’s alibi is corroborated by kitchen staff. The detective notes the inconsistencies and narrows suspicion away from Clara but not Edward or John Avery.",
    "beat": "alibis",
    "estimatedWordCount": 2000,
    "emotionalRegister": "Physical evidence and contradictions emerge, intensifying psychological pressure and exposing hidden fractures in the household.",
    "dominantCharacterNote": {
      "name": "Inspector Harold Finch",
      "voiceRegister": "Speaks with deliberate clarity and measured cadence, using precise language and dry undertones."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Edward Langley",
      "form": "sardonic",
      "condition": "Subtle humour from Edward Langley or Clara Mitchell’s polite sarcasm allowed to highlight tension"
    },
    "eraTextureNote": "Communication relies on rotary telephones with manual exchanges and telegrams via village offices; Travel is primarily by passenger train or reliable automobiles, limiting rapid external contact; Estate grounds are physically isolated by stone walls and social protocol restricting outsider access; Information dissemination depends on radio broadcasts and newspapers, delaying news flow; Manual typewriters and handwritten logs govern record-keeping, susceptible to human error or manipulation; Electric home appliances are rare; lighting relies on gas lamps and candles, affecting night activities",
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
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Harold Finch | he/him/his/himself        | [fill in]     | [yes/no]
  Margaret Langley     | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Langley       | he/him/his/himself        | [fill in]     | [yes/no]
  Clara Mitchell       | she/her/her/herself       | [fill in]     | [yes/no]
  John Avery           | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 5 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: template | subcode: template_bleed_openers.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 5: a clue/test description was copied verbatim into the prose (16 consecutive words from "The stable logbook shows Edward Langley entering the stables at half p…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (12 consecutive words from "Edward Langley’s claimed alibi at the stables after the murder time is…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "Clara Mitchell’s alibi is corroborated by kitchen staff testimony and …"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "The stable logbook’s time entry conflicts with Edward Langley’s claime…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: repeated content opener detected ("clara mitchell"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.
- Every paragraph must begin with a different name or meaningful word — no two paragraphs may share the same opening name/word (pronouns and articles like she/the/a are fine). Replace these repeated opener pattern(s) "clara mitchell" with distinct paragraph openings from different angles: sensory detail, object, movement, thought, or another speaker.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- No two paragraphs begin with the same name or meaningful word — each of these openers appeared more than once and must now be unique: "clara mitchell" (pronouns and articles like she/the/a are fine).
- Primary failure class cleared: template / template_bleed_openers.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 5 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 5
Attempt: 3/3 | class: template | subcode: template_bleed_openers
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Chapter 5: a clue/test description was copied verbatim into the prose (16 consecutive words from "The stable logbook shows Edward Langley entering the stables at half p…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (12 consecutive words from "Edward Langley’s claimed alibi at the stables after the murder time is…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "Clara Mitchell’s alibi is corroborated by kitchen staff testimony and …"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "The stable logbook’s time entry conflicts with Edward Langley’s claime…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: repeated content opener detected ("clara mitchell"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.
- Template linter: high n-gram overlap detected (1.00 >= 0.65). Rephrase this passage to avoid template leakage.
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

PACKET MUST-FIX ITEMS
- Resolve template issues before accepting this batch.
- Chapter 5: a clue/test description was copied verbatim into the prose (16 consecutive words from "The stable logbook shows Edward Langley entering the stables at half p…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (12 consecutive words from "Edward Langley’s claimed alibi at the stables after the murder time is…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "Clara Mitchell’s alibi is corroborated by kitchen staff testimony and …"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "The stable logbook’s time entry conflicts with Edward Langley’s claime…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

TEMPLATE RESET CONTRACT
- Rewrite all failing paragraphs from new sentence skeletons.
- Avoid repeated paragraph openers and high-overlap phrasing from prior chapters.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: template
RETRY SUBCODE: template_bleed_openers
ATTEMPT: 2/3
OFFENDING TEXT: The stable logbook shows Edward Langley entering the stables at half p…
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Chapter 5: a clue/test description was copied verbatim into the prose (16 consecutive words from "The stable logbook shows Edward Langley entering the stables at half p…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (12 consecutive words from "Edward Langley’s claimed alibi at the stables after the murder time is…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "Clara Mitchell’s alibi is corroborated by kitchen staff testimony and …"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
- Chapter 5: a clue/test description was copied verbatim into the prose (13 consecutive words from "The stable logbook’s time entry conflicts with Edward Langley’s claime…"). Dramatize it as an observed detail, action, or dialogue in your own words — do NOT transcribe schema descriptions.
SECONDARY FIXES:
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: repeated content opener detected ("clara mitchell"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.
- Template linter: high n-gram overlap detected (1.00 >= 0.65). Rephrase this passage to avoid template leakage.
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
MITIGATION MODE: structural_pivot
```
