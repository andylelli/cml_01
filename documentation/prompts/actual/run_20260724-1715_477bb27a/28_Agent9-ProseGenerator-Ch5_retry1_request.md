# Actual Prompt Record

- Run ID: `run_477bb27a-9d95-4577-96b8-9f1ce53e9e89`
- Project ID: `proj_d916493c-17b7-4b6a-babb-4c77eb1251aa`
- Timestamp: `2026-07-24T17:31:00.809Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.54`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `b7e0cfe78c80404a`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Inspector Harold Wren[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Inspector Harold Wren. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Harold Wren (man), Lady Beatrice Ellsworth (woman) — DECEASED, past-tense only, Charles Pembroke (man), Margaret Huxley (woman), Simon Clarkson (man), Eleanor Fairchild (woman), Thomas Granger (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Harold Wren, Lady Beatrice Ellsworth, Charles Pembroke, Margaret Huxley, Simon Clarkson, Eleanor Fairchild, Thomas Granger?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted to prevent a scandal that would have ruined the family’s honor, raising questions about justice versus social preservation." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- ⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud), but the established setting is "Cool, damp autumn evening with intermittent fog rolling over the estate grounds · Late evening, shortly after sunset, with gas lamps and early electric lighting casting shadows indoors" (note "fog"). At the clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in the prevailing conditions (e.g. "a brief clearing in the fog") — so the mechanism can operate WITHOUT contradicting the established weather. Do not silently ignore the fog, and do not present the mechanism as if the conditions were always favourable.
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Lady Beatrice Ellsworth is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Lady Beatrice Ellsworth is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Lady Beatrice Ellsworth said, "…"` / `Lady Beatrice Ellsworth turned to him`. RIGHT: `Lady Beatrice Ellsworth had said, weeks before, that…` / `Agnes remembered how Lady Beatrice Ellsworth used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Lady Beatrice Ellsworth beside an action or speech verb. A live dialogue tag or present action for Lady Beatrice Ellsworth is a continuity failure that will be rejected and regenerated.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Harold Wren, Lady Beatrice Ellsworth (DECEASED), Charles Pembroke, Margaret Huxley, Simon Clarkson, Eleanor Fairchild, Thomas Granger
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Harold Wren: Police Detective / Inspector
   - Lady Beatrice Ellsworth: victim (DECEASED — does not appear in any scene, past tense only)
   - Charles Pembroke: Ambitious Administrator
   - Margaret Huxley: Resentful Secretary
   - Simon Clarkson: Proud Skilled Tradesman
   - Eleanor Fairchild: Social Climber
   - Thomas Granger: Loyal Servant with Hidden Ambitions
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

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was alive until at least twenty past ten, as indicated by the sundial’s shadow position and multiple witness sightings in the garden.
- Hidden truth to progressively expose (compose in your own words from these elements): sundial, copper, plate, contracted, early, morning, cold, delaying, shadow, twenty, minutes, misleading
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: thermometer, garden, wall, recorded, temperature, thirty, degrees, fahrenheit, morning, murder | corr: since, temperature, below, freezing, copper, sundial, plate, contracted, causing, gnomon, shadow, behind | effect: narrows, time, window, death, earlier, sundial, shadow, indicates, challenging, witness, timings, based
  - Step 2: obs: lady, beatrice, wristwatch, stopped, reads, quarter, past, morning | corr: victim, died, before, time, sundial, shadow, indicating, therefore, misleading, physical, contraction, effects | effect: eliminates, alibis, witness, statements, place, victim, alive, quarter, past
  - Step 3: obs: charles, pembroke, alibi, claims, occupied, eleven, witnesses, place, near, sundial, before | corr: since, victim, died, before, quarter, past, charles, pembroke, alibi, undermined, opportunity, commit | effect: eliminates, charles, pembroke, alibi, making, prime, suspect
  - Step 4: obs: copper, sundial, plate, shows, slight, warping, frost, crystals, close, inspection | corr: physical, sundial, subject, thermal, contraction, causing, shadow, delay, misled, witnesses | effect: false, timeline, mechanism, supports, reevaluation, suspect, timelines
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): exact, stopped, time, lady, beatrice, watch, sundial, shadow, position, measuring, copper, plate
- Test must rely on already-shown clue IDs: clue_thermometer_reading, clue_stopped_watch, clue_sundial_warping, clue_witness_timing_conflict, clue_charles_alibi_conflict, clue_comparing_watch_and_sundial, clue_shadow_time_contradiction, clue_witness_statements
- Fair-play rationale: Step 1: The thermometer reading and frost on the sundial base expose the contracting copper effect that misleads the timeline (early clues).
Step 2: The victim’s stopped watch proves death before the assumed sundial time, contradicting witness statements (mid clues).
Step 3: Witness accounts and alibis are reexamined and Charles Pembroke’s alibi fails (mid to late clues).
Step 4: Physical inspection of the sundial plate confirms the contraction mechanism (late clue).
The discriminating test crystallizes this contradiction using only previously observed evidence, allowing the reader to logically deduce Charles Pembroke’s guilt.


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

This story takes place in June 1931 during summer.

Seasonal Atmosphere:
- Weather patterns: generally mild with cool mornings and evenings, occasional drizzles and intermittent fog patches over the countryside, early summer warmth tempered by dampness in the air
- Daylight: Long summer days with sunrise around 4:45 am and sunset near 9:15 pm, providing extended twilight and lingering daylight into late evening
- Seasonal activities: early morning garden tending and rose pruning, afternoon croquet matches on the lawn, evening strolls along shaded woodland paths of the estate
- Seasonal occasions: Whit Monday (Pentecost Monday) observed early June in some regions, Empire Day celebrations lingering in public memory, though less prominent
- Season: summer

Period Fashion (describe naturally):
- Men formal: lightweight wool or flannel suits in muted greys and tans, single-breasted jackets with narrow lapels, linen dress shirts with detachable collars
- Men casual: plus-fours or knickerbockers paired with argyle socks, soft-crowned trilby hats, cotton polo shirts or light knit sweaters
- Men accessories: silk neckties with geometric patterns, leather brogues polished to a shine, pocket watches with chain fobs
- Women formal: light silk or rayon day dresses featuring dropped waists and pleated skirts, delicate lace collars and subtle embroidery detailing, straw cloche hats adorned with ribbons or small flowers
- Women casual: calico or cotton print frocks with peter pan collars, knitted cardigans in pastel shades, flat leather T-strap shoes
- Women accessories: beaded handbags, gloves of kid leather or cotton, delicate pearl necklaces and simple brooches

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington – 'Mood Indigo', Bing Crosby – 'At Your Command', Al Bowlly – 'Love Is the Sweetest Thing'; Films: Dr. Jekyll and Mr. Hyde (1931), City Lights (1931) starring Charlie Chaplin; Theatre: Noël Coward’s latest revues playing in London, West End productions of classic comedies and emerging modern dramas; Radio: BBC National Programme delivering news and variety shows, Radio comedy series such as 'ITMA' beginning to gain popularity
- Typical prices: Loaf of bread: 3 pence, Pint of milk: 1 penny, Taxi ride across town: 2 shillings
- Current events: Ongoing global economic strain from the Great Depression deepening unemployment and social unrest; Chancellor Brüning’s austerity measures in Germany heightening tensions across Europe
- Literature: Agatha Christie’s 'The Sittaford Mystery' (1931) | Virginia Woolf’s 'The Waves' (1931) | John Galsworthy’s 'End of the Chapter' (1931) | [Mystery and detective fiction] | [Modernist literature] | [Social realism]
- Technology: Improved radio receivers becoming household staples | Early development of talking motion pictures | Advances in automotive engineering with more affordable cars | Domestic telephones often shared on party lines | Mechanical typewriters for correspondence and administration | Battery-powered radios for evening entertainment
- Daily life: Afternoon tea in drawing rooms or garden terraces, Sunday church services followed by family outings, Estate staff completing daily maintenance and groundskeeping
- Social rituals: Formal dinner parties with strict seating arrangements, Morning calls and visits by ladies to maintain s
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Recorded temperature on the garden wall thermometer at morning time of murder: "thirty-one degrees Fahrenheit"
  - Stopped time on victim’s pocket watch found on body: "a quarter past ten"
  - Apparent solar time indicated by the sundial’s shadow at murder time: "twenty minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:20", "10.20", "ten twenty", "ten-twenty", "ten past twenty", "quarter past ten", "half past ten" — the ONLY acceptable form is "twenty minutes past ten"
  - Inferred actual time of death based on combined clues: "ten minutes to eleven"
    ⛔ FORBIDDEN alternatives: "10:50", "10.50", "ten fifty", "ten-fifty", "ten past fifty", "quarter past ten", "half past ten" — the ONLY acceptable form is "ten minutes to eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_charles_alibi_conflict] charles, pembroke, alibi, claims, occupied, eleven, witnesses, place, near, sundial, before
  Category: temporal | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): charles, pembroke, alibi, conflict, opportunity

• [clue_housekeeper_alibi] housekeeper, margaret, huxley, corroborated, alibi, placing, away, garden, murder, time
  Category: testimonial | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): eliminates, margaret, huxley, because, strong, alibi

• [clue_servants_schedule] staff, movement, logs, schedules, confirm, simon, clarkson, toolshed, murder, time
  Category: testimonial | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): eliminates, simon, clarkson, because, corroborated, alibi

• [clue_gardener_testimony] thomas, granger, known, movements, gardener, testimony, place, away, garden, gates, murder, time
  Category: testimonial | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): eliminates, thomas, granger, because, corroborated, alibi

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Recorded temperature on the garden wall thermometer at morning time of murder: "thirty-one degrees Fahrenheit"
  • Stopped time on victim’s pocket watch found on body: "a quarter past ten"
  • Apparent solar time indicated by the sundial’s shadow at murder time: "twenty minutes past ten"
  • Inferred actual time of death based on combined clues: "ten minutes to eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Harold Wren: he/him/his
  • Lady Beatrice Ellsworth: she/her/her
  • Charles Pembroke: he/him/his
  • Margaret Huxley: she/her/her
  • Simon Clarkson: he/him/his
  • Eleanor Fairchild: she/her/her
  • Thomas Granger: he/him/his

CLUES ALREADY REVEALED TO READER: clue_struck_wound_observation, clue_thermometer_reading, clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_shadow_time_contradiction, clue_stopped_watch, clue_witness_statements, clue_charles_premeditation_observation, clue_argument_context, rh_1, rh_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): manner, death, blunt, force, sundial, gnomon | temperature, below, freezing | contradiction, sundial, shadow, time, thermal, contraction | core, mechanism, murder, concealment, thermal, contraction | contradiction, sundial, shadow, victim, time, death | victim, time, death, before, quarter, past | contradiction, sundial, shadow, victim, time, death | charles, pembroke, motive, premeditation | motive, charles, pembroke | rh_1 | rh_2
• Suspects still unresolved: Margaret Huxley[SHE], Simon Clarkson[HE], Eleanor Fairchild[SHE], Thomas Granger[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The sound of the clock’s chime marked the hour. Inspector Harold Wren straightened, his silhouette etched against the lamplight. The investigation was no closer to resolution, but the web of motive and opportunity had tightened. He turned away, the contradicti..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Lady Beatrice Ellsworth: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Lady Beatrice Ellsworth crossed the room" / "Lady Beatrice Ellsworth sat on the sofa" / "Lady Beatrice Ellsworth nodded"
  - WRONG: "Lady Beatrice Ellsworth gave testimony" / "Lady Beatrice Ellsworth asked what had happened"
  - CORRECT: "Lady Beatrice Ellsworth had often said..." / "Lady Beatrice Ellsworth's effects were found" / "witnesses recalled Lady Beatrice Ellsworth's habit of..."
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
Known location profile anchors: Ashcombe Manor, Walled Garden Sundial, Manor Library, Servants’ Hall, Estate Gatehouse, Estate offices and garden
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Ashcombe Manor", "Walled Garden Sundial", "Manor Library", "Servants’ Hall", "Estate Gatehouse", "Estate offices and garden"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "Estate offices and garden". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 90/100):
  Quality gaps noted: required clue surfacing incomplete (3/5)
  Address in upcoming chapters: Surface missing clue evidence on-page with observable detail: rh_1; rh_2.
- USED-UP PHRASINGS (these exact wordings are spent — they already appear in earlier chapters and repetition is this story's biggest measured quality risk): "inspector harold wren lingered by the sundial", "harold wren lingered by the sundial his".
  Do not reuse or lightly vary them. Draw this chapter's atmosphere and transitions from a DIFFERENT sensory or physical source than the previous chapter (if the last chapter leaned on sound/silence, use light, temperature, touch, or object detail here).
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Harold Wren: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Lady Beatrice Ellsworth: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Pembroke: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margaret Huxley: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Simon Clarkson: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Eleanor Fairchild: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Thomas Granger: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Lady watched Wren; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Lady watched Wren; Wren crossed the room and Lady
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=17137; context=6559; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document, character_personality]; truncated=[location_profiles, temporal_context, continuity_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic telephones with limited lines, often party-line systems | mechanical typewriters for correspondence and record-keeping | battery-powered or mains radios for news and entertainment | telephone calls subject to line availability and operator assistance | telegrams sent and received through nearest town telegraph office | postal mail with standard delivery delays, including airmail options.
5. Respect setting movement/access constraints in scene action and alibis: main house with locked private quarters and restricted servant areas | estate grounds enclosed by walls and natural barriers limiting movement | seasonal weather affecting accessibility of outbuildings and paths | estate gates guarded and locked at night, limiting entry and exit | staff and visitors require permission for access to private areas.
6. Sustain social coherence with this backdrop pressure: Amidst the rigid class divisions and formal routines of a secluded English manor estate during economic and political uncertainty, a diverse group bound by duty and social expectation faces a sudden crisis that disrupts their carefully maintained order.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Harold Wren, Lady Beatrice Ellsworth, Charles Pembroke, Margaret Huxley, Simon Clarkson, Eleanor Fairchild.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Margaret Huxley (Act 3, Scene 5): Alibi confirmed by servants’ schedules and absence from garden
  Clues: clue_housekeeper_alibi, clue_servants_schedule
- Simon Clarkson (Act 3, Scene 5): Footprint moisture analysis proves prints were older, eliminating presence during true time of death
  Clues: clue_footprint_moisture, clue_gardener_testimony
- Eleanor Fairchild (Act 3, Scene 5): Argument context and witness statements clear her of motive or opportunity
  Clues: clue_argument_context, clue_witness_statements
- Thomas Granger (Act 3, Scene 5): Alibi verified by vehicle logs and staff witness
  Clues: clue_vehicle_log, clue_staff_witness

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with collected evidence showing sundial contraction and disproved alibi

**Clue Placement for These Chapters:**
- clue_victim_before_quarter_past_ten_contradiction must appear in Act 2, Scene 2 via Cross-check contradiction

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
Investigation state at start: 11 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Charles Pembroke, Margaret Huxley, Simon Clarkson, Thomas Granger
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Estate offices and garden — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The sound of the clock’s chime marked the hour. Inspector Harold Wren straightened, his silhouette etched against the lamplight. The investigation was no closer to resolution, but the web of motive and opportunity had ti...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • victim, watch, stopped, quarter, past, contradicting, charles, pembroke, alibi, eleven [clue_victim_before_quarter_past_ten_contradiction]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • multiple, witnesses, place, charles, pembroke, near, garden, sundial, before, eleven, clock, conflicting [clue_charles_alibi_conflict]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • multiple, staff, confirm, margaret, huxley, attending, household, duties, kitchen, murder, timeframe [clue_housekeeper_alibi]
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.
    • servants, schedules, logs, place, simon, clarkson, toolshed, corroborated, staff [clue_servants_schedule]
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.
    • gardener, testifies, thomas, granger, greenhouse, murder, timeframe [clue_gardener_testimony]
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • footprints, near, sundial, lack, moisture, traces, matching, eleanor, fairchild, shoes [plant:clue_footprint_moisture]
    • estate, vehicle, shows, departures, nine, eleven [plant:clue_vehicle_log]
    • multiple, staff, confirm, margaret, huxley, presence, kitchen, murder [plant:clue_core_elimination_chain]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):
      · Inspector Harold Wren claims: Entire investigation period
      · Charles Pembroke claims: Between midday and one o'clock
      · Margaret Huxley claims: Between noon and two o'clock
      · Simon Clarkson claims: Late morning to early afternoon
      · Eleanor Fairchild claims: Around midday
      · Thomas Granger claims: Between 11 a.m. and 1 p.m.
  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Charles Pembroke's established alibi is "Between midday and one o'clock". Do NOT place Charles Pembroke at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Charles Pembroke has already made statements in earlier chapters. Any time, location, or claim attributed to Charles Pembroke in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. Eleanor Fairchild may use sardonic to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions Recorded temperature on the garden wall thermometer at morning time of murder, write exactly: "thirty-one degrees Fahrenheit".
  - If this batch mentions Stopped time on victim’s pocket watch found on body, write exactly: "a quarter past ten".
  - If this batch mentions Apparent solar time indicated by the sundial’s shadow at murder time, write exactly: "twenty minutes past ten".
  - If this batch mentions Inferred actual time of death based on combined clues, write exactly: "ten minutes to eleven".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Harold Wren: he/him/his
    Lady Beatrice Ellsworth: she/her/her
    Charles Pembroke: he/him/his
    Margaret Huxley: she/her/her
    Simon Clarkson: he/him/his
    Eleanor Fairchild: she/her/her
    Thomas Granger: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 5-5.
Investigation state at start: 11 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Charles Pembroke, Margaret Huxley, Simon Clarkson, Thomas Granger
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Lady Beatrice’s stopped watch at quarter past ten
- Established timeline fact: Thermometer reading of thirty-one degrees Fahrenheit at garden wall at 10 a.m.
- If referenced, use exact phrase: "thirty-one degrees Fahrenheit" (Recorded temperature on the garden wall thermometer at morning time of murder).
- If referenced, use exact phrase: "a quarter past ten" (Stopped time on victim’s pocket watch found on body).
- If referenced, use exact phrase: "twenty minutes past ten" (Apparent solar time indicated by the sundial’s shadow at murder time).
- If referenced, use exact phrase: "ten minutes to eleven" (Inferred actual time of death based on combined clues).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Sundial’s Shadow
Inspector Harold Wren stepped onto the gravel path as a chill mist curled low over the clipped box hedges, muffling the distant clang of a gardener’s spade and the subdued voices that hovered on the edge of silence. The morning air was thick with damp, the scent of cold stone and bruised herbs rising around the Walled Garden Sundial. The hush was broken only by the faint crunch of his shoes and the soft click of the gate closing behind him. At the centre of the garden, Lady Beatrice Ellsworth lay sprawled in her summer frock, one gloved hand splayed against the dew-dark earth, her body unnaturally still beneath the warped copper plate of the sundial.

He paused, the weight of his authority settling over the assembled faces—Charles Pembroke, the estate manager, rigid and pale; Margaret Huxley, the secretary, her eyes fixed on the ground; Simon Clarkson, the head gardener, hands damp with soil; Eleanor Fairchild, her lips pressed together in silent calculation; Thomas Granger, the butler, standing a little apart with his hat in his hands. The air was thick with shock, the kind that clings in the early hours before the day’s routines can sweep it away. Inspector Harold Wren’s gaze fell to the garden wall, where a mercury thermometer glinted in the weak sunlight, its red line marking precisely thirty-one degrees Fahrenheit—a detail so out of place in the supposed warmth of summer it demanded a second glance.

He knelt beside Lady Beatrice Ellsworth, careful not to disturb the frost-rimmed gravel. Her face was turned slightly away, the delicate lines of her jaw marred by a grotesque, bloodied wound above her right temple. The injury was unmistakable in its violence—blunt force, the skin split and bruised, blood matted in her silvered hair. A heavy, copper object had struck her with enough force to end her life: the sundial’s gnomon, its base smeared with drying blood, lay only inches from her outstretched arm. Inspector Harold Wren’s hand hovered above the wound, the cold radiating from her skin, before he straightened, his expression unreadable.

The silence fractured as Charles Pembroke, the estate manager, cleared his throat. He was a tall man, his suit immaculate despite the hour, but his composure was fraying at the edges. 'I—I found her just as you see, Inspector,' Charles Pembroke said, his voice clipped, eyes darting not to the body but to the sundial itself. 'She was meant to meet with me after her walk, but she never arrived.' There was a tremor in his hand as he adjusted his cufflink, a gesture too practiced to be entirely natural. Inspector Harold Wren noted the detail, the way Charles Pembroke’s gaze avoided Lady Beatrice Ellsworth’s face, lingering instead on the warped copper plate of the sundial, where a faint dusting of frost still clung to the metal.

Margaret Huxley, the secretary, stood rigidly at the edge of the gathering, her posture immaculate, a ledger clutched to her chest as if it might shield her from the morning’s horror. 'Lady Beatrice was expected in the library at ten,' Margaret Huxley said, her tone brittle, eyes never leaving the ground. 'She was always punctual.' The words hung in the air, a challenge and a lament entwined. Inspector Harold Wren caught the flicker of resentment beneath her formality, the way her grip tightened on the ledger until her knuckles whitened.

Simon Clarkson, the head gardener, hovered near the herbaceous border, his cap in his hands, rough fingers stained with earth. 'Didn’t see her after half-past nine,' Simon Clarkson muttered, voice low and flat. 'She liked to walk the paths before the sun got too high. I was in the greenhouse.' His eyes darted to the sundial, then away, as if the sight of Lady Beatrice Ellsworth’s body was something to be endured rather than witnessed. Inspector Harold Wren registered the man’s discomfort, the way Simon Clarkson’s shoulders hunched against the cold, and the tension that vibrated through his stance.

Eleanor Fairchild, resplendent even in distress, drew her silk shawl tighter around her shoulders. 'It’s all too ghastly,' Eleanor Fairchild whispered, her voice trembling with a mixture of fear and something sharper. 'One expects a certain dignity in death, doesn’t one? Not—' She gestured helplessly at the scene, her eyes shining with unshed tears or outrage, it was difficult to tell. Inspector Harold Wren noted the careful calculation in her glance, the way she measured the reactions of those around her before daring to meet his gaze.

Thomas Granger, the butler, stood at a discreet distance, his hat twisting between his gloved hands. 'If there’s anything you require, sir,' Thomas Granger offered, his voice steady but subdued. 'The household is at your disposal.' Yet even in his deference, there was a flicker of something else—a guardedness, perhaps, or the weight of secrets too long borne. Inspector Harold Wren gave a curt nod, marking Thomas Granger’s position in the web of relationships that now bound everyone present.

Inspector Harold Wren’s attention returned to the sundial, its shadow stretched across the engraved copper plate. The line of darkness pointed to twenty minutes past ten, a fact rendered in the precise geometry of sunlight and metal. He glanced down at Lady Beatrice Ellsworth’s wrist, where a delicate watch had stopped at a quarter past ten. The contradiction was immediate and unspoken, a riddle that would not be solved by the morning’s chill alone. He let his gaze linger on the warped edge of the copper plate, the faint frost crystals glimmering in the muted light, before rising to address the gathering.

He spoke quietly, but his words carried. 'No one is to leave the grounds until I have spoken with each of you. The constabulary will secure the gates.' The announcement was met with a ripple of apprehension, the sort that passes through a room when the rules of order are upended. Inspector Harold Wren’s eyes swept the faces before him, searching for the first crack in composure, the first sign of a lie waiting to be told.

The garden itself seemed to hold its breath. The air was thick with the scent of damp earth and the faint bitterness of frost-touched herbs. Somewhere beyond the walls, a radio murmured in a distant room, the news of the world reduced to a faint, unintelligible hum. Here, time was measured not in headlines or telegrams but in the slow drift of fog and the silent accusation of a bloodied sundial.

Inspector Harold Wren’s mind catalogued the details: the thermometer’s reading of thirty-one degrees Fahrenheit, the stopped watch at a quarter past ten, the shadow on the sundial pointing to twenty minutes past ten. Each fact was a piece of a puzzle that refused to settle into place. He moved with deliberate care, instructing Thomas Granger to fetch a blanket for Lady Beatrice Ellsworth’s body, his own hands steady despite the cold that crept through his coat.

As the household retreated in uneasy silence, Inspector Harold Wren lingered by the sundial, his gaze fixed on the warped copper plate and the frost that had not yet melted in the midsummer air. He bent to examine the base, noting the subtle distortion of the metal and the way the blood had pooled in the crevice where the gnomon had fallen. He did not speak, but his silence was heavy with questions.

The morning light grew brighter, scattering the mist and casting long shadows across the gravel. Inspector Harold Wren straightened, his silhouette etched against the garden wall. The investigation had begun, not with a revelation, but with a contradiction—a body stilled before her time, a sundial’s shadow out of step with the world, and a household held captive by the weight of what had been lost. The hush of the garden was broken only by the distant tolling of a bell, marking the hour in a world now altered beyond recognition.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Conflicting Times
"You see the frost, Inspector? In June, no less," Charles Pembroke said, his voice brittle as he gestured toward the sundial’s copper plate. The morning air was sharp with the scent of damp earth and the faint tang of metal, the silence broken only by the distant caw of a rook beyond the garden wall. Sunlight filtered weakly through the thinning fog, illuminating the warped plate and the blood that had dried in a rough crescent at its base. Inspector Harold Wren’s shadow stretched alongside the sundial’s, both cast long and uncertain across the gravel. He knelt, gloved fingers brushing the cold, rough edge of the copper, and glanced up at the garden wall where the mercury thermometer’s red line stood out: thirty-one degrees Fahrenheit. The incongruity of such a reading in the heart of summer was as jarring as the violence at his feet.

Inspector Harold Wren rose, his gaze lingering on the sundial’s shadow, which pointed with mechanical indifference to twenty minutes past ten. The air was still, the hush of the garden broken only by the soft whisper of mist receding from the stone path. He made a mental note: the thermometer, the frost, and the sundial’s time—each element seemed to inhabit a separate reality. The wound on Lady Beatrice Ellsworth’s temple, ragged and bloodied, matched the gnomon now lying beside her hand. The violence was intimate, the aftermath clinical. As Inspector Harold Wren straightened, the contradiction pressed in: a garden frozen at thirty-one degrees Fahrenheit, a sundial marking twenty minutes past ten, and a body that told its own silent tale.

He let his hand rest briefly on the sundial’s base, feeling the chill that lingered in the metal. The copper had contracted in the cold, the plate slightly warped, its surface rimmed with frost crystals that had not yet yielded to the morning’s light. Inspector Harold Wren’s eyes narrowed, registering the subtle distortion. The physical laws at play here were as immutable as the social ones that governed the estate, but their intersection was far less orderly. He glanced again at the thermometer, its glass column unwavering, and then at Lady Beatrice Ellsworth’s stopped watch—still and silent at a quarter past ten.

Simon Clarkson approached, his boots crunching softly on the gravel. He kept his cap low, eyes fixed on the ground. "Never seen it freeze up like this, not in June," Simon Clarkson muttered, voice flat. "Frost’s bad for the roses. The old hands always warned about that." He hesitated, glancing toward the sundial, then away. Inspector Harold Wren caught the flicker of something beneath Simon Clarkson’s stoicism—anxiety, perhaps, or the memory of an argument best left unspoken. Simon Clarkson’s hands, rough and stained with earth, twisted his cap until the fabric creaked.

"You were in the greenhouse, Mr. Clarkson?" Inspector Harold Wren’s tone was even, but his gaze was sharp.

Simon Clarkson’s reply was measured, almost rehearsed. "That’s right. Checking the cuttings. Didn’t see Lady Beatrice Ellsworth after half-past nine. She liked her walks early." He paused, then added, "Heard voices, though. Raised, near the sundial. Didn’t see who." The admission hung in the air, a thread Inspector Harold Wren would tug later. Simon Clarkson’s glance slid toward Charles Pembroke, then away, the silence between them thickening.

Charles Pembroke stood a little apart, his posture rigid, hands clasped behind his back. The keys to the garden gates glinted at his belt. "I was in the library, preparing the accounts," Charles Pembroke said, but his eyes betrayed him, flicking to the sundial and then to the bloodstained gnomon. "Lady Beatrice Ellsworth was meant to join me after her walk. She never arrived." His words were precise, but Inspector Harold Wren noted the tremor in his voice, the way his jaw tightened at the mention of Lady Beatrice Ellsworth’s name.

A silence settled, filled only by the distant hum of a radio from the manor and the persistent drip of water from the garden tap. Inspector Harold Wren turned his attention to the schedule pinned to the toolshed door, visible beyond the hedge—a neat grid of names and duties, Simon Clarkson’s among them. The routine was as rigid as the estate’s social order, yet it had not prevented chaos from seeping in. Inspector Harold Wren’s gaze returned to the sundial, its face marked by the passage of sunlight and something less tangible: the weight of expectation, the pressure of ambition.

"You and Lady Beatrice Ellsworth had words recently?" Inspector Harold Wren’s question was casual, but the effect was immediate. Charles Pembroke’s lips thinned, and for a moment, the mask of composure slipped.

"We disagreed about the future of the estate," Charles Pembroke replied, his tone clipped. "She was… traditional. I have other ideas. But disagreements are hardly motive for—this." He gestured at the body, but his hand faltered mid-air, as if unwilling to complete the accusation.

Inspector Harold Wren let the silence stretch. He watched as Charles Pembroke’s gaze drifted to the sundial, then to the thermometer, and finally to the frost that lingered on the copper plate. The contradiction was not lost on him. "You noticed the frost yourself, Mr. Pembroke. Unusual, isn’t it?"

"Yes, well, the weather’s been odd all week," Charles Pembroke replied, too quickly. "Perhaps it’s nothing. These old walls hold the cold." His attempt at nonchalance was undermined by the tension in his shoulders.

Simon Clarkson shifted, his voice low. "Heard Lady Beatrice Ellsworth and Charles Pembroke arguing two days ago. Didn’t catch much, but it carried. She was angry." He looked away, the admission costing him. Inspector Harold Wren registered the flicker of fear in Simon Clarkson’s eyes—a man who knew the value of silence, yet felt the cost of it now.

The sun climbed higher, the fog thinning further, but the chill in the garden remained. Inspector Harold Wren moved to Lady Beatrice Ellsworth’s side, studying the wound again. The shape of the bruise, the blood, the gnomon’s weight—all pointed to a single, brutal moment. Yet the timing, the frost, the readings—none of it aligned. He glanced at the stopped watch: a quarter past ten. The sundial insisted on twenty minutes past ten. The thermometer, thirty-one degrees Fahrenheit. Each fact was an island, and the waters between them were growing rough.

He straightened, brushing a fleck of frost from his coat. "No one is to leave the grounds," Inspector Harold Wren repeated, voice calm but unyielding. "I will require statements from each of you." He watched as Charles Pembroke’s jaw clenched, the man’s ambition and unease warring beneath the surface. Simon Clarkson retreated to the toolshed, his gait stiff, the schedule on the door a silent testament to his movements.

As the household began to disperse, Inspector Harold Wren lingered by the sundial, his eyes tracing the warped copper plate, the frost, and the blood. The contradiction gnawed at him—a sundial’s shadow that lied, a thermometer that spoke truth, and a body that would not answer. The garden, for all its order, had become a stage for secrets. Inspector Harold Wren’s thoughts circled the silence left by Lady Beatrice Ellsworth, the weight of her absence pressing in with the certainty of a shadow at noon.

He let his gaze drift to the horizon, where the last threads of mist were burning away. Somewhere in the distance, the estate’s radio crackled with news of a world in turmoil, but here, time was fractured—measured in frost, in blood, and in the uneasy glances of those left behind. Inspector Harold Wren’s hand hovered once more above the sundial’s base, as if to test the cold, but he did not touch it. Instead, he turned, his mind already assembling the next set of questions, the morning’s contradictions unresolved but sharpened into purpose.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Sundial and the Stopped Watch
By late morning, as the last filaments of mist dissolved into the pale sunlight, a hush lingered over the garden and nearby hall. The air was still cool, carrying the faint scent of damp stone and clipped boxwood, while the distant echo of the estate’s radio—now little more than a murmur—reminded Inspector Harold Wren that the world outside pressed on, indifferent. He stooped once more beside Lady Beatrice Ellsworth’s body, the gravel rough beneath his knees, and let his gloved hand hover above the warped copper plate of the sundial. Frost crystals still clung to the metal, glinting like splinters of glass in the midsummer light—a detail at odds with the season, and one that refused to be dismissed. He noted the subtle distortion along the plate’s edge, the way the surface bowed ever so slightly, as if the cold had gripped it and not yet let go.

The sundial’s shadow, cast with geometric precision, pointed unwaveringly to twenty minutes past ten. Inspector Harold Wren’s gaze drifted from the line of darkness to Lady Beatrice Ellsworth’s wrist, where her delicate watch—its gold case dulled by blood and frost—had stopped at a quarter past ten. The contradiction was as sharp as the morning’s chill: the sun insisted on one hour, the watch on another, and the body itself offered only silence. He paused, letting the silence settle, and then reached for the watch, careful not to disturb the bruised and bloodied wound above her right temple. The injury was unmistakable: a single, brutal blow, the skin split and hair matted, the shape and size consistent with the heavy copper gnomon that now lay beside her outstretched hand.

He glanced up as Charles Pembroke approached, his footsteps muffled by the damp gravel. Charles Pembroke’s composure had frayed since dawn; his suit, though pressed, seemed to hang more heavily, and his eyes darted between the sundial and the Inspector’s hands. 'You’ll find the timepiece reliable, Inspector,' Charles Pembroke said, voice taut. 'Lady Beatrice Ellsworth was never one to let her watch run down.' There was a brittle pride in the words, but also a tremor that betrayed the strain beneath. Inspector Harold Wren met his gaze, offering only a nod. He turned the watch over, the stopped hands unwavering at a quarter past ten, and let the silence press in.

Margaret Huxley stood just inside the threshold of the hall, her posture immaculate, a ledger clutched to her chest. Her eyes flicked to the sundial, then to the body, and finally to Inspector Harold Wren. 'The household schedule is precise,' she said, her tone edged with polite sarcasm. 'Lady Beatrice Ellsworth was expected in the library at ten. She was always punctual, unless detained by matters of… importance.' The emphasis was delicate, but not lost on Inspector Harold Wren. He watched as Margaret Huxley’s grip tightened on the ledger, her knuckles whitening, and wondered what private calculations occupied her mind.

Inspector Harold Wren rose, brushing a fleck of frost from his coat sleeve. He let his gaze sweep the garden, noting the subtle cues that marked the estate’s routines: the gardener’s schedule pinned to the toolshed door, the faint sound of typewriter keys from an open window, the distant clatter of crockery as the kitchen staff prepared luncheon. He caught sight of Simon Clarkson moving between the greenhouse and the border, his gait brisk but wary—a man aware of being watched. Thomas Granger’s steady presence near the hall door, hat in hand, was a reminder of the estate’s hierarchy, while Eleanor Fairchild’s silhouette drifted past the window, her posture tense and guarded.

Returning to the sundial, Inspector Harold Wren crouched to study the bloodied gnomon. The copper was cold to the touch, its base smeared with drying blood. He traced the line of the wound on Lady Beatrice Ellsworth’s temple, the shape matching the instrument precisely. The violence was intimate, the aftermath clinical. He set the gnomon aside, careful to preserve the scene, and glanced once more at the sundial’s face. The shadow remained fixed at twenty minutes past ten, indifferent to the contradictions it had sown.

A flicker of movement drew his attention to Charles Pembroke, who lingered near the garden gate, keys at his belt. Several witnesses, Inspector Harold Wren recalled, had placed Charles Pembroke near the sundial before eleven o’clock—a detail that now felt less certain, given the mounting contradictions. He watched as Charles Pembroke exchanged a brief, uneasy glance with Margaret Huxley, the silent tension between them palpable. Margaret Huxley, for her part, seemed to shrink into the doorway, her ledger a shield against scrutiny.

Inspector Harold Wren addressed them both, his tone measured but insistent. 'I require your accounts of the morning, beginning with your whereabouts at the relevant times.' Charles Pembroke’s reply was polished but tight: 'Between midday and one o’clock, I was in the library, preparing accounts. I passed through the garden shortly before, but saw nothing amiss.' The words were delivered with a formality that bordered on defensive, and Inspector Harold Wren noted the way Charles Pembroke’s hand hovered near his pocket watch, as if to anchor himself to the certainty of its ticking.

Margaret Huxley’s response was equally precise, though her voice carried a hint of veiled resentment. 'I was attending to household duties in the kitchen from noon until two. Several members of staff can confirm my presence, should you require it.' She did not offer more, and Inspector Harold Wren sensed the boundaries she had drawn—lines not to be crossed without consequence.

A brief, ironic counterpoint surfaced as Simon Clarkson, passing with a basket of cuttings, paused to mutter, 'Never thought I’d see frost in June, nor a sundial cause so much trouble.' The remark, delivered with a gardener’s weary fatalism, drew a faint, reluctant smile from Inspector Harold Wren. The moment of levity, though fleeting, eased the tension, if only for an instant.

Inspector Harold Wren returned his attention to the physical evidence. The warped copper plate, the frost crystals, the bloodied gnomon, the stopped watch—all pointed to a sequence of events that refused to align. The sundial’s shadow insisted on twenty minutes past ten, Lady Beatrice Ellsworth’s watch on a quarter past, and yet witnesses claimed to have seen her alive after that hour. The contradiction gnawed at him, a puzzle whose pieces would not fit. He made a note in his pocketbook, the scratch of the pencil loud in the silence.

He paused, letting his gaze rest on the garden wall where the thermometer’s red line still marked thirty-one degrees Fahrenheit. The incongruity was as stark as ever, a challenge to the estate’s routines and the assumptions of those who lived within its walls. Inspector Harold Wren’s mind circled the facts: the physical evidence, the witness statements, the schedules and alibis. Each element seemed to inhabit a separate reality, and yet all were bound by the same, unyielding morning.

As the interviews concluded, Inspector Harold Wren lingered by the sundial, his silhouette etched against the brightening sky. The garden, for all its order, had become a stage for secrets. He watched the interplay of shadow and sunlight, the way the copper plate caught the light and refracted it in unexpected directions. The contradictions remained unresolved, but sharper now—less a matter of confusion than of deliberate misdirection. Inspector Harold Wren’s doubts had deepened, and with them, the suspicion that someone among the household had mastered the art of deception as surely as the sundial had mastered the art of shadow.

He closed his notebook with a decisive snap. The investigation was no longer a matter of routine; it had become a contest of wits, played out in the measured cadence of questions and the silent language of glances. Inspector Harold Wren’s dry wit surfaced as he addressed Charles Pembroke and Margaret Huxley one last time: 'It seems, in Ashcombe Manor, even the sun keeps its own counsel. I trust you will do the same—until I call on you again.' The words hung in the air, a challenge and a warning entwined. He turned away, the case’s contradictions pressing in as the morning gave way to the uncertain promise of afternoon.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interviews and Motives
The sound of the grandfather clock’s pendulum, steady and faint in the hush, was the only movement as Inspector Harold Wren closed his notebook with a decisive snap. The afternoon light, filtered through the tall windows of the Estate drawing room, cast pale shadows across the Turkish carpet and the polished arms of the settee. There was a lingering damp in the air, a reminder of the morning’s fog, and the faint scent of pipe smoke clung to the heavy drapes. Inspector Harold Wren’s gaze swept the assembled faces—Charles Pembroke rigid in his chair, Eleanor Fairchild poised with a teacup balanced carelessly in her gloved hand, Margaret Huxley standing sentinel beside the writing desk, and Simon Clarkson shifting his weight near the door, boots leaving faint marks on the parquet.

It was the sort of afternoon that pressed in, thick with expectation and the weight of unsaid things. The room’s lamplight flickered, not yet needed but already lit against the uncertain weather, and the atmosphere was brittle with tension. Inspector Harold Wren’s own posture was measured, his voice calm as he addressed the group. 'We will proceed in order. Mr. Pembroke, your account of the morning, if you please.'

Charles Pembroke’s reply was precise, almost rehearsed. 'As I have stated, Inspector, between midday and one o’clock I was occupied in the library, reviewing the estate ledgers. I passed through the garden shortly before, but saw nothing amiss.' His gaze flicked to the window, then to the clock, as if the reassurance of measured time might anchor him. The keys at his belt jingled softly when he shifted. He paused, then added, 'Several members of staff can confirm my presence near the garden gates earlier. I am sure you will find their recollections align.'

Inspector Harold Wren noted the careful phrasing, the way Charles Pembroke’s hands gripped the arms of his chair. The man’s composure was brittle, a veneer of control stretched tight over something more volatile. 'And Lady Beatrice Ellsworth?' Inspector Harold Wren prompted, his tone neutral. 'Did you see her at any point during your passage through the garden?'

A brief silence, the kind that draws attention to itself. Charles Pembroke’s jaw tightened. 'I did not. She was expected to join me in the library after her walk, but she failed to arrive. We…' He hesitated, the word hanging. 'We had words, earlier this week. A difference of opinion regarding the estate’s future. She was traditional. I am not.' The admission was edged with something sharper than regret—resentment, perhaps, or wounded pride.

Margaret Huxley’s posture stiffened at the mention of the argument. Her voice, when it came, was crisp and formal. 'Lady Beatrice Ellsworth was always punctual, Inspector. She kept to her schedule with a rigor some might call excessive.' Margaret Huxley’s eyes lingered on Charles Pembroke, a flicker of something unspoken passing between them. 'I was in the kitchen from noon until two, supervising luncheon preparations. The staff will attest to my presence.'

Eleanor Fairchild set her teacup down with a faint clink, her lips curling into a sardonic smile. 'Schedules and ledgers—how thrilling. I was in the morning room, contemplating the tragic fate of the English summer and the even more tragic fate of Lady Beatrice Ellsworth’s rose garden.' Her tone was light, but her eyes were watchful. 'If you wish to know whether I saw anything untoward, Inspector, I am afraid I must disappoint. I am not in the habit of observing the comings and goings of others—at least, not before my second cup of tea.'

Simon Clarkson’s reply was as plain as his manner. 'I was in the greenhouse, as I told you. Didn’t see Lady Beatrice Ellsworth after half-past nine. Heard voices, though. Raised—near the sundial. Sounded like an argument.' He glanced at Charles Pembroke, then away. 'Didn’t see who it was. Didn’t want to.'

Inspector Harold Wren let the silence settle, watching the subtle shifts in posture and expression. He noted the way Charles Pembroke’s knuckles whitened, the way Margaret Huxley’s fingers twisted the edge of her ledger, the way Eleanor Fairchild’s gaze flickered to the windows, as if seeking escape. The drawing room, with its orderly arrangement of chairs and its faint, persistent chill, felt suddenly claustrophobic.

He drew a sheet of paper from the writing desk, laying it flat on the table. 'Several witnesses,' Inspector Harold Wren said, his tone even, 'recall seeing Lady Beatrice Ellsworth alive at twenty minutes past ten, near the Walled Garden Sundial. Others place Mr. Pembroke near the garden gates shortly before the murder.' He let the words hang, watching for the ripple of reaction. 'And yet, the victim’s watch was found stopped at a quarter past ten.'

Margaret Huxley’s eyes narrowed, her voice sharp. 'Are you suggesting the witnesses are mistaken, Inspector? The household is not in the habit of inventing sightings.'

Eleanor Fairchild’s laughter, low and musical, broke the tension for an instant. 'Mistaken? In this house, Inspector, people see what they wish to see. Or what they are told to see.' She leaned back, the lamplight catching the pearl at her throat. 'Lady Beatrice Ellsworth was not without her enemies. Nor her admirers.'

Simon Clarkson’s jaw worked. 'I only know what I heard. Raised voices, that’s all. If there was more, I didn’t want to know.' His gaze dropped to the floor, boots scuffing the carpet. The admission cost him something—a piece of his pride, perhaps, or a measure of his certainty.

Inspector Harold Wren made a note, the scratch of his pencil loud in the hush. He glanced at Charles Pembroke, whose composure was now visibly fraying. 'You mentioned a disagreement with Lady Beatrice Ellsworth. Was it of a professional nature?'

Charles Pembroke’s reply was clipped. 'Professional, yes. She feared exposure—of what, I cannot say. She was convinced I intended to undermine her authority. In truth, I merely wished to modernise the estate. That is hardly a crime.' The words were brittle, but beneath them lay a pulse of genuine anxiety.

Margaret Huxley’s ledger slipped slightly in her grip. 'Lady Beatrice Ellsworth valued tradition, Inspector. She was not always… gentle in her methods.' The admission was quiet, almost reluctant. 'There were those who resented her. Not only Mr. Pembroke.'

Eleanor Fairchild’s smile faded. She hesitated, a rare uncertainty flickering across her face. 'If you are asking whether I had reason to wish Lady Beatrice Ellsworth ill, Inspector, I assure you—my ambitions run to the social, not the criminal.' She paused, then added, more softly, 'But ambition is a dangerous thing, in any house.'

A brief silence. The lamplight flickered, casting shifting shadows across the faces of those assembled. Inspector Harold Wren’s gaze lingered on the stopped watch, visible on the table—a quarter past ten, the hands unmoving. He let his attention drift to the window, where the garden path was just visible, the gravel still marked by the passage of many feet. Somewhere in the corridor beyond, the faint clatter of a typewriter echoed, a reminder of the estate’s relentless routine.

He turned back to the group, voice low. 'We are left, then, with contradictions. Witnesses who claim to have seen Lady Beatrice Ellsworth alive after her watch had already stopped. Schedules that do not align. Arguments that cast long shadows.' Inspector Harold Wren let the silence settle, the weight of it pressing in.

Charles Pembroke’s composure finally cracked. 'If you are accusing me, Inspector, say so plainly. I have nothing to hide.' His voice was sharp, but the tremor in his hand betrayed him.

Inspector Harold Wren’s reply was mild, almost amused. 'I am accusing no one, Mr. Pembroke. I am merely collecting facts. The truth, as you know, has a habit of emerging—eventually.' He closed his notebook once more, the sound decisive.

The room’s tension lingered, but a faint, ironic relief surfaced as Eleanor Fairchild, with a theatrical sigh, remarked, 'I do hope you will not keep us here all day, Inspector. The roses will not prune themselves, and scandal is so dreadfully exhausting.' The momentary levity passed as quickly as it came, but it left the air less suffocating.

Inspector Harold Wren’s gaze swept the group, his own expression unreadable. He let his eyes rest on the stopped watch, the ledger, the keys at Charles Pembroke’s belt. The contradictions remained, sharper now—less a matter of confusion than of deliberate misdirection. He made a final note, the scratch of his pencil a quiet coda to the afternoon’s revelations.

As the group began to disperse, Inspector Harold Wren lingered by the writing desk, eyes tracing the lines of the ledger, the faint impression of a recent signature, the ink not yet fully dry. He glanced at the window, where the garden path curved out of sight, and let his thoughts settle on the pattern of footsteps, the rhythm of schedules, and the silent language of rivalry. The afternoon’s light was fading, but the case’s contradictions had only grown more acute.

He watched as Charles Pembroke paused at the door, exchanging a brief, uneasy glance with Margaret Huxley. Eleanor Fairchild drifted toward the window, her posture languid but her eyes alert. Simon Clarkson lingered, his hands shoved deep in his pockets, the set of his shoulders wary. Inspector Harold Wren let the silence stretch, the drawing room’s atmosphere thick with unresolved questions.

The sound of the clock’s chime marked the hour. Inspector Harold Wren straightened, his silhouette etched against the lamplight. The investigation was no closer to resolution, but the web of motive and opportunity had tightened. He turned away, the contradictions pressing in, as the afternoon gave way to the uncertain promise of evening.
--- END PRIOR CHAPTER 4 ---

# Case Overview
Title: The Sundial’s Frozen Shadow
Era: 1930s
Setting: English countryside
Crime: murder (struck with heavy copper sundial gnomon)
Culprit: Charles Pembroke
Victim: Lady Beatrice Ellsworth
False assumption: The victim was alive until at least twenty past ten, as indicated by the sundial’s shadow position and multiple witness sightings in the garden.
Cast: Inspector Harold Wren (he/him), Lady Beatrice Ellsworth (she/her), Charles Pembroke (he/him), Margaret Huxley (she/her), Simon Clarkson (he/him), Eleanor Fairchild (she/her), Thomas Granger (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (English countryside). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "English countryside" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Harold Wren — he/him/his (NEVER she/her)
• Lady Beatrice Ellsworth — she/her/her (NEVER he/him)
• Charles Pembroke — he/him/his (NEVER she/her)
• Margaret Huxley — she/her/her (NEVER he/him)
• Simon Clarkson — he/him/his (NEVER she/her)
• Eleanor Fairchild — she/her/her (NEVER he/him)
• Thomas Granger — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Alibis and Inconsistencies",
    "setting": {
      "location": "Estate offices and garden",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Growing suspicion and unease"
    },
    "characters": [
      "Inspector Harold Wren",
      "Charles Pembroke",
      "Margaret Huxley",
      "Simon Clarkson",
      "Thomas Granger"
    ],
    "purpose": "Test alibis and highlight contradictions",
    "cluesRevealed": [
      "clue_charles_alibi_conflict",
      "clue_housekeeper_alibi",
      "clue_servants_schedule",
      "clue_gardener_testimony"
    ],
    "dramaticElements": {
      "conflict": "Charles Pembroke's alibi is undermined while others gain support",
      "tension": "Detective senses something off about the timeline and suspects",
      "microMomentBeats": [
        "Margaret Huxley quietly asserts her innocence with calm certainty"
      ]
    },
    "summary": "Inspector Wren examines Charles Pembroke’s alibi, which conflicts with witness sightings placing him near the sundial before ten. Margaret Huxley’s alibi is corroborated by servants’ schedules, and Simon Clarkson and Thomas Granger provide evidence supporting their absence from the crime scene, narrowing suspicion.",
    "beat": "alibis",
    "estimatedWordCount": 2200,
    "emotionalRegister": "Focused determination replaces uncertainty as the investigation narrows toward a prime suspect.",
    "dominantCharacterNote": {
      "name": "Inspector Harold Wren",
      "voiceRegister": "Measured, precise, and calm, with subtle irony and occasional dry wit that gently disarms and probes."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Charles Pembroke",
      "form": "observational",
      "condition": "Humour must be subtle and character-driven, avoiding any that undercuts rising tension."
    },
    "eraTextureNote": "Limited telephone infrastructure relying on party-line systems restricting private communication; No television; news and entertainment reliant on radio and newspapers; Travel primarily by reliable but slow automobiles and passenger trains with fixed schedules; Estate grounds locked and guarded at night limiting movement; Dependence on mechanical typewriters for official correspondence; Early aviation exists but plays little role in rural life or urgent communication",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_footprint_moisture",
      "clue_vehicle_log",
      "clue_core_elimination_chain"
    ]
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Harold Wren | he/him/his/himself        | [fill in]     | [yes/no]
  Lady Beatrice Ellsworth | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Pembroke     | he/him/his/himself        | [fill in]     | [yes/no]
  Margaret Huxley      | she/her/her/herself       | [fill in]     | [yes/no]
  Simon Clarkson       | he/him/his/himself        | [fill in]     | [yes/no]
  Eleanor Fairchild    | she/her/her/herself       | [fill in]     | [yes/no]
  Thomas Granger       | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 5 in this one retry.
Retry mode: TARGETED_REBUILD.
Attempt context: 2/3 | primary class: template.
Why this mode: template failure detected; prior wording is likely harmful anchor.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: template.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 5 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/3 — chapters 5 — 1 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

✓ SOLUTION: The ONLY characters who exist are: Inspector Harold Wren, Lady Beatrice Ellsworth, Charles Pembroke, Margaret Huxley, Simon Clarkson, Eleanor Fairchild, Thomas Granger
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

Return corrected JSON for chapters 5. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/3
OFFENDING TEXT: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
```
