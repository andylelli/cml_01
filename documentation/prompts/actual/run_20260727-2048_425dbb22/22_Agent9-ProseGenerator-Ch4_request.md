# Actual Prompt Record

- Run ID: `run_425dbb22-2e5e-4f39-86a6-7935a3c3830b`
- Project ID: `proj_8d84e7a9-9798-4656-8c29-73c856049d93`
- Timestamp: `2026-07-27T21:00:02.734Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `25cfe7daf411fd4f`

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
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Lady Beatrice Winthrope is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Lady Beatrice Winthrope is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Lady Beatrice Winthrope said, "…"` / `Lady Beatrice Winthrope turned to him`. RIGHT: `Lady Beatrice Winthrope had said, weeks before, that…` / `Agnes remembered how Lady Beatrice Winthrope used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Lady Beatrice Winthrope beside an action or speech verb. A live dialogue tag or present action for Lady Beatrice Winthrope is a continuity failure that will be rejected and regenerated.


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

• [clue_5] witnesses, agree, garden, gate, latched, half, past, wind, direction, logs, show, shift
  Category: temporal | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): witness, agreement, garden, gate, latch, temporal, discrepancy

• [clue_6] auditory, perception, gate, latch, time, misjudged, environmental, acoustics, invalidating, original, timing, assumption
  Category: temporal | Criticality: essential | Supports inference step 3
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): auditory, perception, contradiction, latch, timing

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

CLUES ALREADY REVEALED TO READER: clue_11, clue_1, clue_2, clue_3, clue_4 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): struck, heavy, antique, blunt, wound, manner | hourglass, frost, crystals, temporal, anomaly | presence, frost, crystals, contradiction, normal, sand | faint, scratch, study, window, latch, spatial | slightly, open, window, contradiction, warm, room
• Suspects still unresolved: Margaret Hensley[SHE], Edward Winthrope[HE], Clara Simmons[SHE], James Fletcher[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "By midday, the Study room and adjoining hallway had become a crucible of tension. The clues—frosted hourglass, battered paperweight, scratched window latch, and all—remained stubbornly opaque. Helen stood at the centre of it all, her mind cataloguing each deta..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Lady Beatrice Winthrope: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Lady Beatrice Winthrope crossed the room" / "Lady Beatrice Winthrope sat on the sofa" / "Lady Beatrice Winthrope nodded"
  - WRONG: "Lady Beatrice Winthrope gave testimony" / "Lady Beatrice Winthrope asked what had happened"
  - CORRECT: "Lady Beatrice Winthrope had often said..." / "Lady Beatrice Winthrope's effects were found" / "witnesses recalled Lady Beatrice Winthrope's habit of..."
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
Known location profile anchors: Winthrope Manor Estate, Winthrope Manor Library, Servants’ Quarters, Winthrope Manor Gardens, Estate Gatehouse, Garden gate and nearby grounds
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Winthrope Manor Estate", "Winthrope Manor Library", "Servants’ Quarters", "Winthrope Manor Gardens", "Estate Gatehouse", "Garden gate and nearby grounds"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "Garden gate and nearby grounds". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=14836; context=6637; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic wired telephones with party-line exchanges | manual typewriters for correspondence and record-keeping | battery-powered portable radios for news and entertainment | telegrams sent via nearest post office with typical delays | telephone calls subject to party-line privacy limitations | written correspondence through postal service with multi-day transit.
5. Respect setting movement/access constraints in scene action and alibis: estate roads and pathways restrict movement to defined routes | manor architecture includes locked private rooms and servant passages | estate isolation limits quick external assistance, especially after dusk | entry to manor controlled by gatehouse with visitor log | staff and residents have designated areas; unauthorized access discouraged and monitored.
6. Sustain social coherence with this backdrop pressure: Amid economic strain and rigid class divides, the residents and staff of an isolated 1930s English manor are bound by strict social codes and estate routines that heighten tensions when a murder disrupts their fragile order.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Helen Marwood, Lady Beatrice Winthrope, Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

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
- clue_5 must appear in Act 2, Scene 1 via Direct observation

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
Investigation state at start: 5 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): James Fletcher
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
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Garden gate and nearby grounds — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "By midday, the Study room and adjoining hallway had become a crucible of tension. The clues—frosted hourglass, battered paperweight, scratched window latch, and all—remained stubbornly opaque. Helen stood at the centre o...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, testimony, garden, gate, latch, time, wind, direction, logs [clue_5]
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.
    • wind, direction, logs, garden, gate, latch, sound, timing [clue_6]
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • servants, testimony, logs, place, margaret, hensley, kitchen, murder, timeframe [plant:clue_16]
    • multiple, witnesses, confirm, edward, winthrope, presence, library, relevant, time [plant:clue_17]
    • servants, testimony, placing, margaret, hensley, kitchen, charles, montague, access, logs, motive [plant:clue_20]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):
      · Inspector Helen Marwood claims: N/A
      · Charles Montague claims: Between quarter past six and half past six
      · Margaret Hensley claims: Between quarter past five and six
      · Edward Winthrope claims: Between six and half past six
      · Clara Simmons claims: Between six and quarter to seven
      · James Fletcher claims: Between quarter past six and seven
  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Charles Montague's established alibi is "Between quarter past six and half past six". Do NOT place Charles Montague at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Charles Montague has already made statements in earlier chapters. Any time, location, or claim attributed to Charles Montague in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
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
Batch chapters: 4-4.
Investigation state at start: 5 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): James Fletcher
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

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
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Frosted Hourglass
Helen’s gloved hand pressed against the cold brass handle as she entered the Study room, Winthrope Manor Estate. Rain whispered against the leaded glass panes, the faintest chill curling beneath the door and stirring the scent of old leather and extinguished fire. In the centre of the room, Lady Beatrice Winthrope lay sprawled beside the desk, her head turned at an unnatural angle, dark hair matted with fresh blood. The heavy antique paperweight—its base smeared red—rested inches from her outstretched fingers, as if dropped in haste or horror. Helen paused, the gravity of the scene settling on her shoulders with the same weight as the winter air.

A hush clung to the room, broken only by the distant creak of settling wood and the soft, uneven breaths of those assembled. Helen’s gaze swept the scene, cataloguing the evidence with methodical calm. The hourglass on the mantelpiece drew her eye: within its glass, minute frost crystals traced delicate patterns along the inner surface, sparkling faintly in the dim morning light. She stepped closer, noting the peculiar shimmer—an anomaly for a room warmed by last night’s fire, and yet the glass was rimmed with a fine, unmistakable layer of ice. Her mind marked the detail, though her face betrayed nothing but professional reserve.

Charles Montague, the estate manager, stood a measured distance from the body, his hands clasped so tightly behind his back that the knuckles blanched. His tailored suit was immaculate, save for a single thread caught at the cuff. He spoke first, voice smooth but pitched too low. “I found her—Lady Beatrice—just as you see.” His eyes flicked from Helen to the hourglass, then away, as if the sight of it unsettled him. Helen watched him for a heartbeat longer, noting the nervous dart of his gaze and the way his jaw worked as if grinding down a confession.

Margaret Hensley lingered at the threshold, her posture rigid, hands twisted in the folds of her apron. The lady’s maid’s face was blotched with the rawness of recent tears, her eyes fixed on Lady Beatrice Winthrope with a devotion that bordered on anguish. She did not move closer, nor did she look at Charles Montague, though her shoulders tightened at the sound of his voice. Helen registered the tension—resentment, perhaps, or something deeper—before turning her attention to the others.

Edward Winthrope, the late Lady Beatrice’s brother, loomed near the window, his stance as unyielding as the military cut of his overcoat. The faint scratch on the window latch and the slight gap where the sash met the sill caught Helen’s eye, but Edward’s focus remained fixed on the body, his expression carved from stone. “This is intolerable,” he said, the words clipped and cold. “You’ll see to it that the family’s reputation is not dragged through the mud, Inspector.” He did not wait for a reply, but Helen noted the tremor in his hand as he adjusted his cufflink.

Clara Simmons, housekeeper and pragmatic confidante, hovered at the edge of the rug, her gaze steady and unflinching. She surveyed the room with the practiced calm of one accustomed to crisis, yet her fingers drummed a silent rhythm against her skirt. “If you’ll permit, Inspector, the staff are waiting for instruction. There’s stew on the hob and nerves to settle.” Her voice was even, but her eyes lingered on the hourglass, then the window, as if piecing together her own silent narrative.

James Fletcher, the young legal advisor, stood apart, a sheaf of papers clutched to his chest. His hair was rumpled, his collar askew, and his eyes darted from the body to the hourglass and back again. “I—I was drafting correspondence in the library when I heard the commotion,” he stammered, voice thin. “Lady Beatrice had asked for the estate ledgers, but I never imagined—” He broke off, swallowing hard, the words dissolving into the heavy silence.

Helen knelt beside Lady Beatrice Winthrope, careful not to disturb the pattern of blood pooling on the Turkish rug. The wound at the crown of Lady Beatrice’s head was unmistakable: a deep, brutal indentation, edged with bruising and fresh blood, perfectly aligned with the heft and shape of the antique paperweight. No sign of a struggle marred the room—no overturned chair, no scattered papers—only the silent witness of the hourglass and the faint, metallic tang of blood in the air.

She rose, glancing again at the mantelpiece. The hourglass, its sand arrested halfway, seemed to mark time in defiance of the scene’s violence. The frost crystals inside the glass—so fine, so out of place—caught the light with a ghostly shimmer. Helen’s breath clouded faintly as she exhaled, the room colder than it ought to be, as if the winter had seeped through more than just the window’s imperfect seal.

A faint scratch marred the window latch, and the latch itself showed signs of having been opened, if only slightly. Helen ran her gloved finger along the groove, noting its freshness. She let her gaze drift to the access logs stacked on the desk—a neat column of entries in Charles Montague’s hand, each line confirming the estate manager’s authority and opportunity to move freely about the house. The detail was quietly filed away, its significance yet to be determined.

Margaret Hensley’s voice broke the silence, trembling. “She was well last night, Inspector. I brought her tea at quarter past six. She—she said she’d be working late, as usual.” Margaret’s gaze flickered to Charles Montague, then dropped. “I never thought—” Her words faltered, and she pressed a hand to her mouth, shoulders shaking.

Charles Montague cleared his throat, stepping forward. “If I may, Inspector, I was in the study myself not long after. Lady Beatrice was…preoccupied. She dismissed me. I left her to her work—she often preferred solitude at this hour.” His words were careful, measured, but Helen caught the way his eyes lingered on the hourglass, as though weighing its testimony against his own.

Edward Winthrope’s patience frayed. “This is a family matter, Inspector. I trust you will proceed with discretion.” He glanced at Clara Simmons, who merely nodded, her composure unbroken. Helen offered no reassurance, only a measured, “I am here to establish the facts, Mr. Winthrope. The law does not distinguish by pedigree.”

The silence that followed was thick with unspoken accusation. Helen moved to the desk, scanning the scattered papers, the ink still wet on Lady Beatrice Winthrope’s final correspondence. The faint scent of lavender clung to the air, a last trace of the woman whose presence had once dominated this room. The hourglass, the wound, the frost—each detail layered upon the next, demanding explanation.

Helen addressed the room, her voice low but unwavering. “No one is to leave the manor. I will speak to each of you in turn. Until then, I ask for your patience—and your candour.” The assembled suspects exchanged glances, some defiant, some fearful, all united by the shock of what had transpired.

As Helen turned back to the mantelpiece, the morning light caught the frost within the hourglass, illuminating a mystery as chilling as the winter beyond the pane. The evidence was plain: Lady Beatrice Winthrope, struck down in her own study, the hourglass and its crystalline frost marking a contradiction that could not yet be named. In the hush that followed, Helen felt the first stirrings of suspicion settle over the room—subtle, persistent, and as impossible to ignore as the cold.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Hourglass Anomaly
"You see it too, don’t you?" Charles Montague’s voice, roughened by a night without sleep, broke the hush that hung over the Study room, Winthrope Manor Estate. The cold seeped through the thick carpet, and the pale morning rain tapped a nervous rhythm against the leaded glass. Inspector Helen Marwood’s gaze lingered on the hourglass atop the mantelpiece, where tiny frost crystals clung to the inside of the glass, catching in the dim glow of the brass lamp. The air was sharp with the scent of extinguished fire and something metallic—blood, still fresh, pooling beneath Lady Beatrice Winthrope’s head. The wound was unmistakable: a deep, purpling bruise and a jagged gash, both consistent with the heavy antique paperweight that lay nearby, its base stained dark. Helen’s breath clouded faintly as she straightened, the chill more than physical.

Helen paused, troubled by the implication of the frost. The hourglass, meant to mark time with impartial certainty, now seemed to bear witness to something unnatural. The crystals inside—delicate, yet persistent—suggested a cold far deeper than the room’s current temperature. Helen pressed her gloved fingertip to the glass, feeling the roughness of frost just beneath the surface. It was thicker than any mere condensation—no accident, but the result of something deliberate or at least unusual. She measured the layer by eye: one sixteenth of an inch, no more, no less. The sand within was clumped, refusing to flow. A contradiction, she thought, between what the hourglass claimed and what the body declared.

The hourglass’s sand had stopped at ten minutes past nine, yet the evidence on the rug—blood not yet fully congealed, skin still faintly warm—spoke of a death far more recent. Helen’s mind circled the contradiction: the hourglass testified to one moment, but the body to another. The frost, the blockage, the false testimony of sand—each detail undermined the apparent certainty of the timeline. She glanced at the window, where a faint scratch marred the latch and a thin line of moisture beaded the sill. The cold outside was real enough, but here, in the heart of the manor, it had done something more than chill the air.

Charles Montague shifted, his hands still clasped tightly behind his back. He was the estate’s manager, responsible for order and routine, yet now his composure frayed at the edges. "It’s not natural, Inspector," he said, voice low. "That frost. The fire was out, yes, but it’s never so cold in here. Not unless someone left the window open, and I—well, I’d have noticed." His eyes flicked to the window, then to Helen, searching for reassurance or perhaps for an ally. Helen noted the tremor in his voice, the way his gaze avoided the hourglass as if it accused him personally.

Helen’s tone was measured, almost gentle. "You were the first to find her, Mr. Montague. Walk me through what you saw." She watched him closely, noting the way his jaw clenched and unclenched. "I came in to deliver the estate accounts—she’d asked for them the night before. The door was ajar. I saw her—like this. The hourglass was as you see it now. I didn’t touch it." His words were careful, but his eyes betrayed unease. The silence stretched, punctuated only by the distant echo of a clock somewhere deeper in the house. Helen let the pause linger, giving him space to fill it, but he offered nothing more.

Margaret Hensley hovered at the threshold, her hands twisting in the folds of her apron. The lady’s maid’s face was drawn, eyes rimmed red, but her voice, when it came, was steadier than before. "She was well last night, Inspector. I brought her tea at quarter past six. She said she’d be working late." Margaret’s gaze flickered to the body, then to the hourglass. "I never noticed the frost before. It’s always just… sand and glass. Ordinary." Helen caught the note of longing in her words—an ache for the world to be as simple as it had seemed only hours ago.

Helen turned her attention to the desk, where the estate logs sat in a neat stack. The topmost page bore Charles Montague’s handwriting, each entry precise. Beneath it, a folded letter addressed in Lady Beatrice Winthrope’s hand, its seal broken. Helen’s fingers brushed over the paper, feeling the raised impression of the family crest. The contents—a terse demand for silence, signed only with Lady Beatrice’s initials—hinted at a private quarrel. She set it aside, her mind filing the detail for later, and moved to the window, where the latch bore a fresh scratch and the faintest trace of moisture.

A sudden gust rattled the pane, drawing Helen’s attention to the garden beyond. The gate stood closed, its latch gleaming with the residue of last night’s rain. A logbook rested on the sill, open to a page recording wind direction and time—set dressing for the estate’s meticulous routines, yet now another thread in the tapestry of the morning’s contradictions. Helen’s eyes narrowed, reading the entry: half past six, wind from the northeast, latch heard shutting. She made no comment, but the detail joined the growing list of inconsistencies.

Clara Simmons entered quietly, her presence as steadying as the scent of lavender that lingered in the room. "Inspector, the staff are anxious. Shall I send for tea?" Her voice was calm, but her gaze lingered on the hourglass, then the body. Helen nodded, grateful for the interruption. The rhythm of the house, even in crisis, persisted. Clara’s fingers drummed a silent pattern against her skirt as she withdrew, leaving Helen once more with her thoughts and the silent witnesses of the room.

James Fletcher, the legal advisor, hovered near the door, a sheaf of correspondence pressed to his chest. He cleared his throat, voice thin. "If you need me, Inspector, I’ll be in the library. There are letters—urgent ones. Lady Beatrice was expecting a reply from the solicitors." His words trailed off, and he retreated before Helen could respond. His unease was palpable, but whether it stemmed from guilt or simple fear, she could not yet say.

Helen returned to the hourglass, her mind replaying the sequence of events. The frost, the sand, the wound—all spoke, but not in harmony. The hourglass claimed ten minutes past nine, yet the evidence of blood and warmth contradicted it. The frost inside the glass, precisely one sixteenth of an inch thick, suggested a blockage, a delay—something that made the hourglass a false witness. Helen’s suspicion deepened: what if the timeline was not what it seemed? What if the hourglass, trusted by all, was the very thing that had been manipulated?

She let her gaze drift to the paperweight, its ornate base glinting dully in the lamplight. The wound on Lady Beatrice Winthrope’s head was brutal, the kind that spoke of sudden violence. Helen knelt once more, examining the edges of the bruise, the way the blood had pooled and begun to darken. There was no sign of struggle—no overturned chair, no scattered papers—only the silent accusation of the hourglass and the cold certainty of death.

A moment of ironic relief surfaced as Helen straightened, her back protesting the cold. "It seems," she murmured, mostly to herself, "that even time can be persuaded to lie." The remark drew a startled glance from Charles Montague, who offered a wan smile. "If only it would do so for happier reasons, Inspector." The exchange broke the tension, if only for a heartbeat, before the weight of the morning settled once more.

Helen’s mind catalogued the contradictions: the frost within the hourglass, the wound on Lady Beatrice Winthrope’s head, the letter demanding silence, the logbook recording wind and latch. Each detail, once reassuring in its normalcy, now undermined the narrative the house wished to tell. She sensed the pressure mounting—not only to solve the crime, but to do so without shattering the fragile order that held the estate together.

Margaret Hensley lingered, her posture tense. "She trusted you, Inspector. Lady Beatrice. She said you were thorough." The words were both comfort and challenge. Helen met Margaret’s gaze, seeing the flicker of hope and fear mingled there. "I intend to be, Miss Hensley. No detail will be overlooked." The promise hung in the air, binding Helen to the truth—whatever shape it might take.

As the morning wore on, the Study room, Winthrope Manor Estate, grew colder, the rain outside intensifying. Helen stood at the centre of the room, surrounded by objects that no longer meant what they seemed. The hourglass, the frost, the wound, the logs, the letter: each a fragment of a story that refused to align. And in the silence that followed, Helen felt the first real tremor of doubt—not in herself, but in the evidence. The hourglass anomaly was no longer a curiosity; it was the heart of the mystery.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Study Window and Initial Suspicions
Late morning brought a wan, uncertain light to the Study room and adjoining hallway, the rain outside now a steady percussion against the glass. The air inside was thick with the cold, the scent of damp wool and extinguished fire lingering beneath the sharper metallic tang of blood. Helen’s boots creaked softly as she crossed the rug, her gaze returning, again and again, to the place where Lady Beatrice Winthrope’s body had lain. The blood had only just begun to darken, pooling beneath the tangled black hair, and the brutal wound at the crown of her head—swollen, edged in purple—spoke plainly of the violence that had ended her life. The heavy antique paperweight, its ornate base still streaked with drying blood, sat on the desk as if awaiting further orders.

Helen paused, her gloved hand hovering over the window latch. A faint scratch marred the brass, fresh enough to catch the dim light filtering through the rain-smeared pane. She pressed gently, feeling the subtle give—the latch had been forced, if only slightly, and the sash itself was barely ajar. Cold air seeped through the gap, carrying with it the whisper of drizzle and the distant echo of the estate’s gravel drive. The room’s chill was more than seasonal; it was as if the winter itself had been invited inside. Helen’s mind ticked over the implications, her expression unreadable but for a tightening around the eyes.

Turning back to the mantelpiece, Helen studied the hourglass. Its glass was rimed with minute frost crystals, delicate as lacework and utterly out of place in a house where fires were kept burning through the night. She leaned in, noting the patterns—no mere condensation, but a fine, even layer of ice, precisely one sixteenth of an inch thick. The sand within was clumped, refusing to flow, and the base of the hourglass showed damp, frozen patterns where moisture had condensed and then solidified. She did not touch it, but her breath clouded faintly as she exhaled, the cold inside the room sharper than ever.

A contradiction was taking shape—a chain of evidence that refused to align. The hourglass’s sand, halted at ten minutes past nine, seemed to offer certainty, yet the state of Lady Beatrice Winthrope’s body, the freshness of the wound, and the temperature in the room all murmured a different story. Helen’s gaze swept the assembled objects: the hourglass, the paperweight, the blood, the window latch. Each detail was a node in a network of doubt, and none could be trusted on its own.

Edward Winthrope stood by the doorway, his arms folded, the set of his jaw as rigid as the military crease in his trousers. He watched Helen’s movements with open suspicion. “You’re looking for something that isn’t there, Inspector. The window’s always stiff in winter. If it was left open, it was an oversight, nothing more.” His voice was clipped, yet a tremor betrayed his unease. Helen did not reply at once, but noted the way Edward’s gaze lingered on the hourglass, then darted to the bloodstain on the rug. His discomfort was palpable, and she wondered whether it was grief, guilt, or some mix of both.

Margaret Hensley hovered at the threshold, her hands twisting the edge of her apron. Her voice, when it came, was soft and uncertain. “She never liked the cold, Lady Beatrice. Always wanted the fire stoked, even in midwinter. I—I checked the window myself last night. It was shut then, I’m sure of it. But this morning—” Margaret’s eyes darted to Helen, then away. “I don’t know how it came to be open. Maybe someone needed air, or…” She trailed off, her fingers worrying the fabric until it threatened to tear.

Charles Montague entered, his step measured, his expression carefully composed. He paused beside the desk, glancing at the paperweight before meeting Helen’s gaze. “You’ll forgive me, Inspector, if I say this all feels rather theatrical. A window left open, a frosted hourglass, and now the suggestion that someone crept about in the night.” His tone was urbane, but the smile he offered was brittle. “I assure you, I was in my own quarters between quarter past six and half past six, as the logs will confirm. If you’re seeking a villain, I fear you’ll find only the weather and the peculiarities of old English houses.”

Helen arched an eyebrow, her voice dry. “The weather is rarely so precise in its timing, Mr. Montague. Nor does it often leave scratches on window latches.” She let the silence stretch, watching for the flicker of irritation that crossed Charles Montague’s face before he masked it with a shrug. He moved to the mantelpiece, fingers brushing a folded slip of paper—a note, half-concealed beneath a ledger. For a moment, his hand lingered, then withdrew. Helen filed away the gesture, her mind marking the detail for later.

Clara Simmons appeared in the doorway, her calm presence a balm against the mounting tension. “Inspector, the staff are anxious. There’s stew on the hob and tea in the pot, if you’ll allow it.” Her gaze swept the room, pausing on the hourglass, then the window. “We keep the rooms shut tight in winter, as a rule. If the window was open, it wasn’t by any of us on duty last night.” Her words were even, but her eyes flickered to Margaret Hensley, a silent exchange passing between them.

Helen nodded, accepting the offer as a brief reprieve. “Thank you, Mrs. Simmons. I’ll join you shortly.” She watched as Clara Simmons retreated, noting the way the housekeeper’s composure seemed to steady the room, if only for a moment. The rhythm of the house, even in crisis, persisted—tea, stew, and the unspoken rules of service.

In the adjoining hallway, Helen paused beside a narrow table stacked with estate logs. A blackmail note, half-hidden by a ledger, caught her eye—Charles Montague’s handwriting unmistakable on the folded corner. She made no comment, but the presence of the note, the logs, and the faint scent of lavender from a nearby vase all layered the scene with further complexity. She glanced through the open door to the dining room, where staff testimony would later place Clara Simmons during the crucial timeframe. The evidence was accumulating, but its meaning remained elusive.

Returning to the study, Helen found Edward Winthrope still at his post, his expression unreadable. “You’ll want to speak to Fletcher as well,” he said, voice low. “He was in the library, or so he claims.” The words carried a note of disdain, as if the mere act of consulting the legal advisor was beneath the dignity of the family. Helen made a mental note to follow up, but for now, her focus remained on the room and its contradictions.

Margaret Hensley, emboldened by the housekeeper’s presence, spoke again. “Lady Beatrice was unsettled last night, more than usual. She asked me to check the locks twice. I did as she asked, but…” Her voice faltered, and Helen caught the glimmer of something deeper—fear, perhaps, or guilt. “I should have done more. I should have stayed.” The admission hung in the air, raw and unguarded.

Charles Montague, sensing the shift, interjected with a polished smile. “We all wish we could have done more, Miss Hensley. Hindsight is the one luxury this house affords in abundance.” His words were smooth, but Helen detected the faintest edge beneath them—a defensiveness masked as sympathy.

Helen moved once more to the hourglass, her eyes tracing the frost, the clumped sand, the patterns of condensation at the base. The evidence was plain, but its meaning was anything but. She glanced at the window, the scratch on the latch, the slight gap where the cold had crept in. Each detail seemed to undermine the others, creating a web of contradiction that resisted easy resolution.

Outside, the rain intensified, beating a steady rhythm against the glass. The sound was oddly comforting—a reminder that, beyond the charged atmosphere of the manor, the world continued as usual. Helen allowed herself a brief moment of ironic relief. “It seems,” she murmured, “that nothing in this house is quite what it appears.” The words were meant for herself, but Margaret Hensley heard them and offered a wan, grateful smile.

As the morning wore on, Helen gathered the suspects for individual questioning. Each interview revealed more than it concealed: Edward Winthrope’s insistence on discretion, Margaret Hensley’s gnawing guilt, Charles Montague’s polished evasions, and Clara Simmons’s quiet authority. The pressure in the room mounted, suspicion shifting with every glance and half-truth. Helen felt the weight of it settle on her shoulders—a burden as cold and inescapable as the wintry air that seeped through the study window.

By midday, the Study room and adjoining hallway had become a crucible of tension. The clues—frosted hourglass, battered paperweight, scratched window latch, and all—remained stubbornly opaque. Helen stood at the centre of it all, her mind cataloguing each detail, each contradiction, each flicker of fear or resentment. The truth was there, hidden in plain sight, but for now, it eluded her. And as the rain continued to fall, Helen knew only that the investigation had reached a new and dangerous threshold—one where every certainty was suspect, and every answer only deepened the mystery.
--- END PRIOR CHAPTER 3 ---

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
    "sceneNumber": 4,
    "act": 2,
    "title": "Garden Gate Timing Confusion",
    "setting": {
      "location": "Garden gate and nearby grounds",
      "timeOfDay": "Afternoon",
      "atmosphere": "Windy, slightly chaotic"
    },
    "characters": [
      "Inspector Helen Marwood",
      "James Fletcher"
    ],
    "purpose": "Reveal auditory timeline confusion and misjudgment of gate latch time",
    "cluesRevealed": [
      "clue_5",
      "clue_6"
    ],
    "dramaticElements": {
      "conflict": "Auditory evidence challenged",
      "tension": "James Fletcher's timeline becomes questionable",
      "microMomentBeats": [
        "Helen notes the gardener's hesitance recalling the noisy wind"
      ]
    },
    "summary": "Helen investigates the garden gate latch timing and learns from wind direction logs that a shift caused the latch sound to be delayed. Servants confirm the gate noise was distorted by echoes, casting doubt on the assumed time of death based on the gate latch, weakening James Fletcher’s alibi.",
    "beat": "motives",
    "estimatedWordCount": 1800,
    "emotionalRegister": "Discovery of frozen condensation inside the hourglass forces a radical reevaluation of the timeline.",
    "dominantCharacterNote": {
      "name": "Inspector Helen Marwood",
      "voiceRegister": "Helen speaks with measured precision and clipped clarity, her tone calm yet incisive, cutting through pretense with dry wit and subtle irony."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Inspector Helen Marwood",
      "form": "dry_wit"
    },
    "eraTextureNote": "Reliance on wired party-line telephones compromising privacy and communication speed; Limited personal transport with rare petrol touring cars and distant steam train stations; Manual typewriters and telegrams as primary means of urgent written communication; Short daylight hours restricting outdoor activity and travel during winter; Estate isolation with locked gates and monitored access limiting movement; Environmental effects like cold temperatures causing physical phenomena impacting objects",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_16",
      "clue_17",
      "clue_20"
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
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.
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
