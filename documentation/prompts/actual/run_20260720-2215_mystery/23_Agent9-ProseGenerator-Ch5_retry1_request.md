# Actual Prompt Record

- Run ID: `mystery-1784585699975`
- Project ID: ``
- Timestamp: `2026-07-20T22:22:45.351Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.54`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `0cd0d20bb0c1c759`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Hugo Vane[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Hugo Vane. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman) — DECEASED, past-tense only, Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of jealousy and a desperate desire to escape a loveless marriage, making their crime tragically relatable." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Eleanor Voss is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Eleanor Voss is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Eleanor Voss said, "…"` / `Eleanor Voss turned to him`. RIGHT: `Eleanor Voss had said, weeks before, that…` / `Agnes remembered how Eleanor Voss used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Eleanor Voss beside an action or speech verb. A live dialogue tag or present action for Eleanor Voss is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss (DECEASED), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: victim (DECEASED — does not appear in any scene, past tense only)
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Manipulative Veteran
   - Beatrice Quill: Ambitious Employee
   - Sylvia Trent: Influential Networker
   - Hugo Vane: Curious Observer
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
- False assumption in force: Eleanor must have drowned while everyone was at the party.
- Hidden truth to progressively expose (compose in your own words from these elements): murder, occurred, shortly, left, party
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, eleanor, leaving, party, minutes, eleven | corr: indicates, left, party, significantly, earlier, previously, thought | effect: narrows, time, window, drowning
  - Step 2: obs: tide, table, indicates, high, minutes, past, eleven | corr: timeline, drowning, occurred | effect: eliminates, idea, eleanor, drowned, party
  - Step 3: obs: footprints, lead, hotel, beach | corr: footprints, suggest, someone, left, party, unnoticed | effect: narrows, down, suspects, access, beach, around, time
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenact, guests, movements, party, reveal, left, unnoticed
- Test must rely on already-shown clue IDs: clue_6, clue_5, clue_3, clue_id_1
- Fair-play rationale: Step 1: Witness statements reveal Eleanor's departure (early). Step 2: The tide table confirms the high tide timing (mid) eliminating the party drowning theory. Step 3: Footprint evidence shows access to the beach (late).

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks in a clipped, clinical manner, often punctuating her sentences with dry humor
She tends to use medical jargon, but her tone softens when discussing her patients.
Dr. Finch is torn between her ambition and her moral compass, grappling with the consequences of her unethical choices and the potential fallout from the victim's discovery.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a smooth elegance, often employing sophisticated language
She has a penchant for dramatic flair and subtly cutting remarks hidden beneath a polished veneer.
Sylvia is torn between her desire to maintain her lavish lifestyle and the fear of losing her social standing, grappling with the consequences of her financial choices.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a casual yet sharp tone, often employing dry humor to deflect tension
He has a penchant for asking probing questions and can be quite direct when pursuing a story.
Hugo struggles with the tension between his journalistic integrity and the personal connection he has to the victim, torn between ambition and loyalty.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks in a clipped, clinical manner, often punctuating her sentences with dry humor. She tends to use medical jargon, but her tone softens when discussing her patients.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘In medicine, as in life, there are no guarantees.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘In medicine, as in life, there are no guarantees. One must adapt to the unexpected.’"
  [evasive] "‘I’m not at liberty to discuss patient details. Let’s focus on the present, shall we?’"
Humour: dry wit — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch is torn between her ambition and her moral compass, grappling with the consequences of her unethical choices and the potential fallout from the victim's discovery."

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a smooth elegance, often employing sophisticated language. She has a penchant for dramatic flair and subtly cutting remarks hidden beneath a polished veneer.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘One must always keep appearances, darling.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘One must always keep appearances, darling. It's simply essential in our world.’"
  [evasive] "‘I wouldn’t worry about such trivial matters. Focus on what truly matters, my dear.’"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia is torn between her desire to maintain her lavish lifestyle and the fear of losing her social standing, grappling with the consequences of her financial choices."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a casual yet sharp tone, often employing dry humor to deflect tension. He has a penchant for asking probing questions and can be quite direct when pursuing a story.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Truth is a slippery fish, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Truth is a slippery fish, isn’t it? Always darting away just when you think you’ve caught it.’"
  [evasive] "‘I’m not looking to make enemies here. Just searching for the truth.’"
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo struggles with the tension between his journalistic integrity and the personal connection he has to the victim, torn between ambition and loyalty."



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
ERA AUTHENTICITY (1940s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

TEMPORAL CONTEXT:

This story takes place in August 1947 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, muggy temperatures with humidity
- Daylight: Long summer days with daylight lingering until nearly eight-thirty in the evening, but the thick clouds often obscure the sun.
- Seasonal activities: beach outings, picnics in local parks, attending county fairs
- Seasonal occasions: No major holidays, but summer vacations are in full swing
- Season: summer

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, lightweight linen dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, high-waisted trousers, oxford shoes
- Men accessories: fedora hat, leather gloves, pocket square
- Women formal: tea-length floral dress, tailored blazer, pearl necklace
- Women casual: swing skirt, blouse with puffed sleeves, ballet flats
- Women accessories: wide-brimmed straw hat, silk scarf, beaded clutch purse

Cultural Context (reference naturally):
- Music/entertainment: 'Blue Moon' by The Marcels, 'Near You' by The Andrews Sisters, 'Heartaches' by Ted Weems; Films: 'Gentlemen's Agreement', 'The Best Years of Our Lives'; Theatre: 'Annie Get Your Gun', 'Street Scene'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Cup of coffee: six pence
- Current events: the beginning of the Cold War tensions; the ongoing decolonization movements in Asia and Africa
- Literature: 'The Member of the Wedding' by Carson McCullers | 'The Catcher in the Rye' by J.D. Salinger | 'Invisible Man' by Ralph Ellison | [post-war fiction] | [mysteries and detective stories] | [social commentary]
- Technology: transistor radio | first commercial jet airliner | early computers in research labs | black-and-white television sets | record players | radios for home use
- Daily life: visiting local diners, attending community events, spending evenings listening to the radio
- Social rituals: evening walks in the neighborhood, Sunday family dinners, gathering for card games after dinner

Atmospheric Details:
The smell of rain-soaked pavement mixed with the faint aroma of blooming summer flowers wafting through the air. The distant sound of laughter from a nearby county fair contrasts with the tension inside the hotel, where whispers of secrets linger. The soft hum of radios playing popular music fills the lobby, punctuated by the occasional crackle of thunder, creating an uneasy ambiance.

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
- Class indicators: Aristocrats discuss opera, servants discuss music halls
- Authentic references: Use actual songs, films, events from t
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The exact time of the highest tide when the victim could have drowned.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The distance from the hotel to the point where footprints were found leading to the water.: "twenty feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_10] eliminates, captain, ivor, hale, because, seen, dining, area, until, eleven, clock
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: captain, ivor, hale, suspect

• [clue_11] eliminates, beatrice, quill, because, captain, ivor, hale, until, eleven
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: beatrice, quill, suspect

• [clue_12] eliminates, captain, ivor, hale, because, seen, multiple, guests, until, eleven, clock
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: captain, ivor, hale, excluded, suspect

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time of the highest tide when the victim could have drowned.: "ten minutes past eleven"
  • The distance from the hotel to the point where footprints were found leading to the water.: "twenty feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_7, clue_id_2, clue_id_3, clue_8, clue_9, clue_6 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): eleanor, left, party, earlier, expected | timeline, events, incorrect | mechanism, drowning, critical, understanding, case | eleanor, left, party, earlier, expected | timeline, events, incorrect | mallory, finch, behavior, indicates, potential, premeditation | mallory, finch, motive, crime | someone, left, party, being, noticed
• Suspect cleared: Captain Ivor Hale[HE] — Witness testimony confirms he was in the dining area.
• Suspect cleared: Beatrice Quill[SHE] — The broken bottle is traced to another guest.
• Suspect cleared: Sylvia Trent[SHE] — Her whereabouts are accounted for by other staff.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (mid): Test one suspect's alibi against a known fact — result must be stated

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the first lamps flickered on inside the hotel, casting long shadows across the terrace, Hugo felt the weight of the investigation settle on his shoulders anew. The answers were close—he could sense them—but every revelation seemed to open another door. He c..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Eleanor Voss: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Eleanor Voss crossed the room" / "Eleanor Voss sat on the sofa" / "Eleanor Voss nodded"
  - WRONG: "Eleanor Voss gave testimony" / "Eleanor Voss asked what had happened"
  - CORRECT: "Eleanor Voss had often said..." / "Eleanor Voss's effects were found" / "witnesses recalled Eleanor Voss's habit of..."
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
Known location profile anchors: L'Hôtel de la Mer, Grand Lobby, Oceanview Dining Room, Manager's Office, Beachfront, the hotel dining area
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "L'Hôtel de la Mer", "Grand Lobby", "Oceanview Dining Room", "Manager's Office", "Beachfront", "the hotel dining area"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the hotel dining area". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "honestly what were they thinking letting her".
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
  • Sylvia Trent: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Hugo Vane: ALWAYS he/him/his/himself — NEVER she/her/herself

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
9. In dialogue attribution, the pronoun refers to the SPEAKE
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=15355; context=6993; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Use dark tone and short length guidance.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | radar equipment | long-distance telephone calls | military encryption methods | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | locked staff-only areas | oceanfront providing isolation | restricted access to the manager's office | staff areas off-limits to guests.
6. Sustain social coherence with this backdrop pressure: A grand seaside hotel hosts a diverse group of guests and staff, all grappling with shifting gender roles and post-war trauma, as a murder unfolds amidst the tension of secrets and societal expectations.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same era and method of crime)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Second Key' (mirrored role of doctor and similar character dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witness testimony confirms he was in the dining area.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): The broken bottle is traced to another guest.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her whereabouts are accounted for by other staff.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_4 must appear in Act 2, Scene 2 via Cross-check contradiction

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
Batch chapters: 5-5.
Investigation state at start: 8 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Sylvia Trent
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
- ERA RULE (1940s): NEVER use these anachronistic terms: "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel dining area — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the first lamps flickered on inside the hotel, casting long shadows across the terrace, Hugo felt the weight of the investigation settle on his shoulders anew. The answers were close—he could sense them—but every reve...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • alignment, high, tide, eleanor, departure [clue_4]
      Points to: timeline, supports, drowning, theory
    • witnesses, confirming, captain, ivor, hale, presence [clue_10]
      Points to: captain, ivor, hale, suspect
    • witnesses, confirming, beatrice, quill, presence [clue_11]
      Points to: beatrice, quill, suspect
    • guests, confirming, captain, ivor, hale, presence [clue_12]
      Points to: captain, ivor, hale, excluded, suspect
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "10:50 PM to 11:10 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time of the highest tide when the victim could have drowned., write exactly: "ten minutes past eleven".
  - If this batch mentions The distance from the hotel to the point where footprints were found leading to the water., write exactly: "twenty feet".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 5-5.
Investigation state at start: 8 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: High tide at 11:10 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time of the highest tide when the victim could have drowned.).
- If referenced, use exact phrase: "twenty feet" (The distance from the hotel to the point where footprints were found leading to the water.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tides Uncover
Hugo Vane pressed his shoes into the damp sand, the chill of the early morning air biting through the linen of his trousers. A faint mist clung to the coastline, blurring the horizon where the pale sky met the restless grey of the Mediterranean. The sound of waves, steady and unhurried, was broken only by the low voices of those gathered in a tight, uneasy knot a little further down the beach near the hotel. As Hugo drew closer, the scent of salt and wet seaweed sharpened, mingling with something metallic and raw that turned his stomach.

Eleanor Voss lay at the water’s edge, her tea-length floral dress sodden and clinging to her form, the tide lapping at her bare feet. Her dark hair fanned out in the shallows, a stark contrast against the pale sand. The hush that surrounded her was not the reverence of grief but the stunned silence of disbelief. Hugo registered the rigid set of Dr. Mallory Finch’s jaw as she knelt beside Eleanor, her gloved hand hovering just above Eleanor’s wrist—no pulse to find. Captain Ivor Hale stood nearby, arms folded across his chest, his navy blazer incongruously crisp for the hour. Beatrice Quill’s hands trembled as she clutched a towel to her chest, eyes darting from the body to the hotel’s distant silhouette. Sylvia Trent, pearls glinting at her throat, pressed a handkerchief to her lips, her gaze fixed on the horizon as if refusing to acknowledge the scene before her.

Hugo’s role as a journalist had never felt heavier than in that moment. He was no stranger to tragedy, but the intimacy of this gathering, the luxury of L'Hôtel de la Mer set against the violence of Eleanor’s death, unsettled him. He crouched at the edge of the group, careful not to disturb the sand around Eleanor’s body. The overcast sky pressed low, the light flat and unforgiving. He glanced at the others, searching for any sign of composure, any mask that might have slipped. Dr. Finch’s hands were steady, but her eyes flicked repeatedly to the sea. Captain Hale’s gaze lingered on Eleanor’s face longer than necessary, his lips pressed into a line that suggested more than simple shock.

A sharp cry broke the silence. Beatrice, voice thin and brittle, said, “She left the party early—just before eleven, I think. I saw her slip out. No one else noticed.” Her words seemed to hang in the air, heavy with implication. Hugo caught the ripple of unease that passed through the group. Dr. Finch looked away, busying herself with the buttons of her coat. Sylvia Trent’s fingers tightened around her handkerchief, knuckles white. Captain Hale’s eyes narrowed, as if recalculating something in his mind.

That single contradiction—Eleanor’s departure from the party, minutes before eleven—struck Hugo as the first thread in a tapestry of secrets. The official story, murmured among the guests, was that Eleanor had been present until the very end. Yet Beatrice’s recollection, offered in the rawness of shock, suggested otherwise. Hugo filed it away, knowing it would return to haunt them all. He straightened, brushing the sand from his knees. The tide continued its slow advance, indifferent to the drama it had delivered.

The group began to fragment, each person seeking distance from the body and, perhaps, from one another. Dr. Finch rose, her movements brisk, and addressed Hugo in a clipped tone. “There’s nothing more I can do for her.” She paused, her gaze meeting his for a fraction of a second. “You’re the one with the questions, Mr. Vane. I suggest you begin.” Her voice carried the authority of a physician accustomed to command, but there was a tremor beneath her professionalism.

Captain Hale cleared his throat, the sound gruff in the damp air. “It’s a damned shame. In my day, we did things differently.” He glanced at Hugo, as if daring him to challenge the sentiment. His fingers toyed with the chain of his pocket watch, a gesture that belied his outward composure. Hugo noted the subtle tension in Hale’s posture—the way his shoulders hunched, the stiffness in his jaw. The captain’s reputation for discipline was well known, but discipline could be a mask as much as a virtue.

Sylvia Trent drifted a step closer, her perfume—a sharp floral note—cutting through the brine. “One must always keep appearances, darling,” she murmured, voice low enough for only Hugo to hear. Her eyes, however, betrayed no such composure; they darted to the others, calculating, wary. Hugo wondered how much of Sylvia’s poise was habit, how much necessity. The post-war years had not been kind to fortunes or reputations.

Beatrice, still clutching the towel, gave a nervous laugh that died almost instantly. “Honestly, what were they thinking? Letting her walk out alone at that hour?” Her voice was pitched too high, the bravado brittle. She avoided looking at Eleanor, instead focusing on the sand slipping through her fingers. Hugo watched her carefully, recognising the defensive energy of someone desperate to deflect attention.

The sound of distant radios from the hotel drifted down the beach, a tinny melody at odds with the grim tableau. Hugo glanced back toward L'Hôtel de la Mer, its Art Deco facade gleaming dully under the overcast sky. The hotel, for all its glamour, now seemed to crouch in anticipation of scandal. He felt the weight of expectation settle on his shoulders. He was not the official authority, but in the absence of one, the role of investigator had fallen to him. The others seemed to sense it, their eyes flicking to him for direction, for reassurance—or perhaps for absolution.

He turned back to the body, noting for the first time the absence of any struggle in the sand, the way the tide had smoothed the evidence of Eleanor’s final moments. The only certainty was her presence here, the rest obscured by water and silence. Hugo’s mind raced through the implications of Beatrice’s statement. If Eleanor had left the party before eleven, the window for her death was narrower than anyone had assumed. The tide, he recalled, had reached its highest point at ten minutes past eleven. The timing was too precise to ignore.

Dr. Finch moved to stand beside Hugo, her expression unreadable. “In medicine, as in life, there are no guarantees. But I would suggest you speak to everyone present last night. People remember things differently when pressed.” Her tone was brisk, but Hugo caught the flicker of uncertainty in her eyes. He nodded, filing away the advice. The investigation would not be simple. Each of these people had known Eleanor, each had something to lose.

A sudden gust of wind carried a spray of salt across the sand, stinging Hugo’s face. He straightened, scanning the beach for any sign of footprints, any clue that might have survived the night. The sand was largely undisturbed, save for the cluster of marks left by the gathering crowd. He made a mental note to return once the tide receded further, to search for anything the water might have missed.

As the morning brightened imperceptibly, the group began to drift back toward the hotel, their silhouettes elongated by the low sun struggling behind the clouds. Hugo lingered, unwilling to leave Eleanor alone. He crouched once more, studying her face. There was no peace in her features, only the faintest trace of surprise—a question left unanswered. He promised her, silently, that he would find the truth, however unwelcome it might be.

The first day of the investigation had begun not with certainty, but with doubt. Eleanor Voss was dead, and the stories told by those who had known her were already beginning to unravel. Hugo Vane, for all his experience, felt the familiar thrill of pursuit mixed with the dread of what he might uncover. The summer air, heavy with the scent of salt and secrets, pressed in around him as he turned toward L'Hôtel de la Mer, the promise of answers drawing him forward.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Aftermath
"You’re certain she left before eleven?" Hugo asked, his voice low as he leaned over the white-draped table, the clatter of cutlery and the faint murmur of rain against the tall windows punctuating the heavy air. The hotel dining area, usually bright with laughter and the scent of fresh bread, felt subdued beneath the overcast midsummer light. The glow of the crystal chandelier seemed cold, casting long shadows across the half-cleared breakfast plates and the faces gathered around him. Captain Ivor Hale sat rigid in his chair, his fists clenched on the tablecloth, while Beatrice Quill twisted a napkin between her fingers, her eyes flicking nervously from Hugo to the windows streaked with drizzle.

The contradiction gnawed at Hugo. Beatrice’s recollection from the beach—Eleanor slipping out just before eleven—directly challenged the prevailing story that she had remained at the party until the end. If Beatrice was right, the timeline for Eleanor’s death was not merely compressed; it was fundamentally altered. Hugo’s mind raced through the implications: if Eleanor had left earlier, then the assumption that everyone at the party had an alibi for the time of her drowning was suddenly suspect. He watched the others, weighing the tension in their posture and the evasions in their glances, and realized this was the first real crack in the narrative they had all accepted.

Captain Ivor Hale broke the silence with a gruff exhalation. "Some of the guests are convinced she drowned while we were all still in the dining room. That’s what they’re saying, at least." His tone was sardonic, but there was a flicker of something else—resentment, perhaps, or the strain of holding himself together. He adjusted his navy blazer, the crispness of the fabric at odds with the roughness in his voice. "In my day, we did things differently. People didn’t wander off alone at all hours." The words hung in the air, half accusation, half lament.

Beatrice’s laugh was brittle, a nervous staccato that failed to lighten the mood. "Honestly, what were they thinking? Letting her go out like that—no one even noticed until it was too late." She pressed the napkin flat, her hands trembling. "I saw her leave, I know I did. She looked—well, she didn’t look back. Not at any of us." Her voice faltered, and she glanced at Hugo as if searching for reassurance or forgiveness.

Sylvia Trent, seated opposite, dabbed delicately at her lips with a linen napkin, her pearl necklace catching the pale light. "One must always keep appearances, darling, even in the face of tragedy," she murmured, her voice smooth but edged. "But I do recall seeing Eleanor near the terrace after eleven. She was speaking with someone—perhaps Dr. Finch? I can’t be certain. It was all rather a blur." Sylvia’s gaze lingered on Hugo for a moment before drifting to the rain-streaked window, her expression unreadable.

Hugo noted the divergence in their accounts. Beatrice was adamant that Eleanor had left before eleven, while Sylvia, with her practiced poise, suggested otherwise. Captain Hale seemed content to let the confusion stand, perhaps even to encourage it. Hugo’s role as investigator was unofficial, but the expectation in the room was clear: he was to untangle these threads, however unwilling the participants might be.

He shifted in his chair, the smooth linen of his jacket catching against the rougher weave of the seat. "If Eleanor left earlier than most believe, then the window for what happened to her is narrower than we thought. That changes things." He let the words hang, watching for a reaction. Beatrice’s face paled, her lips pressed together. Captain Hale’s jaw worked, but he said nothing. Sylvia merely arched a brow, her composure unbroken.

A waiter passed by with a tray of coffee, the aroma briefly cutting through the tension. The normalcy of the gesture—a silver pot, delicate cups, a faint clink of porcelain—only heightened the surreal quality of the morning. Outside, the rain had eased to a fine mist, the sky a dull, unyielding grey. The world continued, indifferent to the drama unfolding within these walls.

Hugo turned his attention to Captain Hale. "You said some guests believe Eleanor drowned while everyone was still at the party. But if Beatrice is right, that can’t be true. Did you see her leave?"

Captain Hale’s eyes narrowed. "I didn’t see her go. I was engaged in conversation with Dr. Finch about the war—old habits die hard. But I suppose it’s possible she slipped out unnoticed. These things happen in a crowd." He shrugged, but the movement was stiff, controlled. "If you’re asking whether I kept track of every guest’s movements, the answer is no."

Beatrice interjected, her voice thin. "She was wearing that blue scarf—the one she always said brought her luck. I saw it trailing behind her as she went through the doors. I remember thinking she looked—lonely, I suppose. It’s silly." She shook her head, the nervous energy in her movements betraying her attempt at nonchalance.

Sylvia’s lips curved in a faint, polite smile. "We all see what we wish to see, Mr. Vane. Memory is a treacherous thing, especially after a night like last. Still, I do recall the clock chiming the hour while Eleanor was on the terrace. Perhaps I’m mistaken, but that’s how it seemed."

Hugo let the contradiction settle between them. The official story—Eleanor present until the end—was now openly challenged. Beatrice’s certainty, Sylvia’s ambiguity, and Captain Hale’s detachment each painted a different picture. The timeline was no longer a straight line but a tangle of recollections and omissions. Hugo felt the weight of responsibility shift: the investigation was no longer about confirming what was known, but about exposing what had been assumed.

He glanced at Beatrice, noting the way her knuckles whitened around the napkin. "You’re sure about the time?" he asked quietly. She nodded, swallowing hard. "Just before eleven. I’m certain."

Captain Hale’s fist tightened on the tablecloth, the only outward sign of his agitation. "It seems we’re all at the mercy of memory, Mr. Vane. If you’re hoping for certainty, you may be disappointed." His voice was clipped, the sardonic edge returning. "But perhaps you’ll have better luck than the rest of us."

Sylvia rose, smoothing the skirt of her floral dress. "If you’ll excuse me, I have a call to make. There are arrangements to be seen to, even in the wake of tragedy." She offered Hugo a measured glance, her composure as unyielding as the grey sky outside. "Do let me know if you require anything further, Mr. Vane."

As Sylvia drifted away, Hugo caught the faintest scent of her perfume—sharp, floral, incongruously bright against the somber mood. Beatrice remained seated, staring at the table as if willing it to provide answers. Captain Hale stared out the window, his reflection ghostly in the glass, the lines of his face deepened by the morning’s strain.

Hugo sat back, the contradictions circling in his mind. The initial assumption—that Eleanor had drowned while the party was in full swing—was now in doubt. Beatrice’s certainty, Sylvia’s ambiguity, and Captain Hale’s reluctance to commit all pointed to a deeper confusion, or perhaps to something more deliberate. The first crack in the story had widened, and Hugo knew it would take more than polite questioning to bridge the gap.

He made a note in his pocket diary, the scratch of his fountain pen loud in the hush. The investigation had shifted: the timeline was no longer fixed, and every guest was now a potential witness—or a potential liar. Outside, the rain began again, soft and persistent, as if the sky itself refused to let the morning pass unmarked.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Timeline
By late afternoon, the rain had settled into a persistent drizzle, the sound of it muffled by the thick glass windows of the hotel library. The air inside was tinged with the faint scent of old leather and damp wool, a contrast to the sharp tang of ozone that lingered from the earlier storm. Shadows gathered in the corners, deepening with the overcast light, as Hugo Vane set his pocket diary on the polished table and uncapped his fountain pen. The scratch of the nib echoed in the quiet, carrying forward the tension that had lingered since the morning’s revelations.

He had summoned Dr. Mallory Finch, Beatrice Quill, and Sylvia Trent to the library, the space chosen for its privacy and the way the heavy mahogany shelves seemed to absorb sound. The silence was broken only by the occasional creak of a floorboard or the distant rumble of thunder. Beatrice perched on the edge of an armchair, her skirt bunched in nervous fists, while Sylvia Trent stood near the window, her reflection ghostly in the grey light. Dr. Finch remained by the fireplace, arms folded, her gaze fixed on the rain streaking the glass.

Hugo cleared his throat, glancing at each woman in turn. "We need to clarify the timeline," he began, his tone measured. "There are contradictions in what’s been said about Eleanor’s movements last night. I’d like each of you to recount, as precisely as possible, when you last saw her." The request hung in the air, heavy with expectation. Beatrice’s eyes darted to Dr. Finch, then away. Sylvia’s lips curved in a faint, unreadable smile.

Beatrice spoke first, her voice brittle. "I—I saw her leave the party just before eleven. She slipped out quietly, didn’t say a word. I remember because the clock on the mantel had just chimed the quarter hour." She twisted a handkerchief in her lap, the fabric already creased from earlier fidgeting. "No one else seemed to notice. I suppose everyone was too caught up in their own conversations."

Sylvia turned from the window, her pearls catching the dim lamplight. "It’s all rather hazy, but I do recall seeing Eleanor on the terrace a little after eleven. She was speaking with someone—perhaps Dr. Finch. Or maybe it was simply the shadows playing tricks. One must always keep appearances, darling, even when the details elude us." Her tone was light, but her eyes were sharp, watching Hugo for any sign of reaction.

Dr. Finch’s reply was clipped, almost clinical. "I was in the dining room until just after ten fifty. I didn’t see Eleanor leave, but I can’t say I was watching the door. In medicine, as in life, there are no guarantees. People come and go." She shrugged, her posture rigid. "If Beatrice is certain of the time, that’s more than I can offer."

Hugo noted the subtle current running between Beatrice and Dr. Finch—a quick, almost guilty glance, as if a shared secret hovered just out of reach. He pressed on, determined to untangle the web. "Beatrice, you’re certain about the time?"

"Yes," Beatrice replied, her voice firmer now. "Just before eleven. I saw her blue scarf trailing behind her. She always said it was lucky." Her lips twisted in a brief, sardonic smile. "Didn’t do her much good in the end, did it?"

Sylvia’s gaze flicked to Beatrice, then back to Hugo. "Memories are unreliable at the best of times. Last night was hardly that." She smoothed her skirt with a practiced hand, the gesture betraying a flicker of anxiety. "Still, if Eleanor left before eleven, the assumption that she drowned while everyone was at the party is—well, questionable."

Hugo let the implications settle. The original belief had been that Eleanor was present until the end of the party, her absence only noticed after midnight. But Beatrice’s account—and the absence of any solid contradiction—suggested otherwise. If Eleanor had left before eleven, the window for her death was narrower than anyone had realized. The tide, he recalled, had reached its highest point at ten minutes past eleven. The timing was uncomfortably precise.

He turned to Dr. Finch. "You said you were in the dining room until just after ten fifty. Did you see anyone else leave around that time?"

Dr. Finch shook her head. "No. I was speaking with Captain Hale about the war. I don’t recall seeing Eleanor, but I wasn’t keeping track. Frankly, I assumed she was still among us until the end." Her tone was brisk, but Hugo caught a flicker of something—regret, perhaps, or irritation—beneath the surface.

"So," Hugo said, summarizing, "we have Beatrice’s certainty that Eleanor left just before eleven, and no one else can place her at the party after that. That contradicts the story most of the guests have accepted." He glanced at Sylvia, who gave a delicate shrug.

"People see what they wish to see," Sylvia murmured. "And remember what suits them."

Beatrice’s hands stilled, the handkerchief limp in her lap. "I know what I saw," she said, the words edged with defiance. "If everyone else missed it, that’s not my fault."

A silence fell, broken only by the steady patter of rain against the windows. Hugo’s mind raced through the possibilities. If Eleanor had left the party significantly earlier than previously thought, then the timeline for her drowning—and the opportunity for foul play—was drastically altered. The assumption that everyone at the party had an alibi for the time of her death no longer held.

He made a note in his diary, the ink pooling slightly on the page. The contradictions in the witness accounts were no longer minor discrepancies; they were fundamental to understanding what had happened. He looked up, meeting each woman’s gaze in turn. "The timeline is not what we thought. That changes everything."

Dr. Finch’s expression was unreadable, but her knuckles whitened where she gripped the back of a chair. Beatrice’s bravado seemed to falter, her shoulders curling inward. Sylvia maintained her composure, but her eyes were wary, calculating.

Hugo leaned back, letting the tension in the room stretch. "If Eleanor left before eleven, and the tide was at its highest at ten minutes past eleven, then the window for her drowning is very narrow indeed. Someone must have seen something—or done something—in that interval." He watched for a reaction, but the women held their silence, each retreating into her own thoughts.

A gust of wind rattled the windowpanes, drawing all eyes to the darkening sky. The library felt suddenly smaller, the air heavier. The investigation had shifted: the facts were no longer fixed, and every alibi was now in doubt.

Beatrice broke the silence with a nervous laugh. "Honestly, what were they thinking? Letting her wander off alone at that hour?" The attempt at levity fell flat, the question lingering in the charged air.

Sylvia’s lips curved in a polite, razor-edged smile. "Perhaps some things are best left unexamined, Mr. Vane. But I suspect you won’t agree."

Hugo Vane pressed on to the next concrete detail. The record now held: Mechanism relies drown though witness expose.

That detail shifted the reasoning. Weighed against the rest, Mechanism relies drown though witness expose bent the trail toward Mechanism drowning critical understanding case.

Hugo closed his diary, the snap of the cover sharp in the hush. The contradictions in the timeline had exposed more than just uncertainty—they had revealed the first true fault lines among the guests. As the rain intensified, drumming a steady rhythm against the glass, Hugo realized that the web of jealousy and ambition surrounding Eleanor’s death was far more tangled than he had imagined.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Motive Revealed
The sound of waves crashing below the terrace mingled with the distant rumble of thunder, the air warm and heavy with the residue of the day’s rain. Hugo Vane leaned against the cold iron balustrade, his diary still in hand from the library, the snap of its cover echoing in his mind. Evening pressed in, the last of the sunlight filtered through low clouds, casting a dull glow across the stone tiles. He watched the shifting shadows at the far end of the terrace, where Captain Ivor Hale stood, his silhouette rigid against the balustrade, and Beatrice Quill sat hunched on a rattan chair, fingers worrying the hem of her swing skirt.

The terrace, usually alive with the chatter of guests and the clink of glasses, felt subdued. The scent of wet stone lingered, punctuated by a faint trace of cigarette smoke drifting from somewhere nearby. Hugo’s shoes squeaked slightly as he crossed the slick flagstones, approaching Hale and Beatrice. The hush was broken only by the steady pulse of surf and the occasional gust of wind that rattled the leaves in the planters. The tension from the library still clung to him, unresolved, demanding answers.

Captain Hale’s eyes flicked up as Hugo neared, his expression unreadable in the dimming light. “You’re persistent, Vane,” he said, the words edged with a sardonic bite. “Still chasing ghosts?” He adjusted the chain of his pocket watch, the gesture practiced, almost defensive. The navy of his double-breasted suit looked darker in the evening gloom, the crispness of his collar at odds with the fatigue etched in the lines around his mouth.

“I’m not chasing ghosts, Captain. I’m trying to understand why Eleanor left the party before eleven—and why no one seemed to notice.” Hugo’s voice was quiet but insistent. He turned to Beatrice, who avoided his gaze, her shoulders curling inward. “You said you saw her leave. Did she say anything to you?”

Beatrice’s hands stilled, her knuckles white against the pale fabric of her skirt. She hesitated, then let out a shaky breath. “She didn’t say a word. Not to me, not to anyone. Just slipped out, like she always did when things got… complicated.” Her voice faltered, and she pressed her lips together, fighting for composure. “I suppose I should have stopped her. But I didn’t.”

Captain Hale shifted, the movement drawing Hugo’s attention. “Several guests mentioned hearing a splash not long after she left,” he said, his tone casual but his eyes sharp. “Might be nothing, of course. The sea’s full of noises at night. But it’s been talked about.” He leaned on the balustrade, the muscles in his jaw working. “In my day, we did things differently. People didn’t wander off alone, especially not women.”

Hugo studied Hale’s face, searching for any flicker of guilt or fear. The captain’s mask held, but there was a tension in his stance, a barely contained agitation. “You were in the dining room until when?” Hugo pressed, watching for a reaction.

Hale’s reply was measured. “Just after ten fifty. I was speaking with Dr. Finch about the war. Lost track of time, I suppose. Didn’t see Eleanor go, if that’s what you’re asking.” He shrugged, but the gesture was stiff, almost rehearsed. “If someone left the party unnoticed, it wouldn’t be the first time.”

Beatrice’s voice broke through, brittle and edged with something like resentment. “She was planning to leave the hotel, you know. She told me—well, she hinted at it. Said she was tired of all this. Tired of me.” She looked up, her eyes shining in the half-light. “I thought we understood each other. I thought… I thought I mattered to her.”

A silence fell, broken only by the distant crash of waves and the soft clatter of a glass somewhere deeper within the hotel. Hugo felt the admission settle between them, heavy and raw. Beatrice’s hands trembled as she reached for her beaded clutch, the sound of the clasp snapping shut loud in the hush. “I suppose it’s silly to feel betrayed, but I do. She promised we’d make something of this place together. Then she changed her mind.”

Captain Hale cleared his throat, the sound abrupt. “People change their minds all the time, Miss Quill. Especially when there’s money involved—or secrets.” He glanced at Hugo, his gaze challenging. “You’re looking for motives, aren’t you? Well, you’ll find plenty here. Jealousy, ambition, fear. Take your pick.”

The air grew heavier, the humidity pressing in as dusk deepened. Hugo turned toward the edge of the terrace, where the stone steps led down to the Beachfront. The memory of footprints in the sand—just “twenty feet” from the hotel—flashed in his mind. Someone had left the party without being noticed, that much was clear. But who, and why?

Beatrice’s voice, softer now, drew him back. “She wasn’t the only one thinking about leaving. I’ve been looking for a way out myself. The war changed everything—what we want, what we’re willing to do for it.” She hesitated, then added, “But I never thought she’d go without telling me. Not after everything.”

Hugo caught the flicker of pain in her eyes, the way she twisted her beaded clutch as if it might anchor her to the present. He wondered, for a moment, if her sense of betrayal might have been enough to drive her to something desperate. The possibility unsettled him.

Captain Hale’s gaze was fixed on the horizon, the last of the daylight glinting off the water. “There’s talk about Dr. Finch, too,” he said, almost as an afterthought. “She’s been seen preparing for late-night swims more than once. Odd, that.” He paused, as if weighing the risk of saying more. “And I’ve heard she’s not as well-off as she lets on. Money troubles make people unpredictable.”

Hugo filed the comments away, aware that each new thread only seemed to tangle the web further. He glanced at Beatrice, who offered a brittle smile. “Honestly, what were they thinking? Letting her go out there alone, with all that was happening?” She shook her head, her bravado faltering. “I suppose it doesn’t matter now.”

A sudden gust of wind sent a spray of salt across the terrace, stinging Hugo’s face. He blinked, grateful for the momentary distraction. The tension eased, just for a breath, as Beatrice let out a nervous laugh—too high, too quick, but real. “Sorry. I’m not usually like this. I just… I can’t get her out of my head.”

Captain Hale straightened, his voice softer than before. “We all have things we wish we’d done differently, Miss Quill. The war taught us that much, if nothing else.”

The moment passed, the pressure returning as Hugo pressed on. “About those footprints on the sand—did either of you leave the terrace after Eleanor?” He watched their faces closely. Beatrice shook her head, her eyes wide. Hale hesitated, then shook his head as well. “Not me. I stayed in the dining room until Dr. Finch left. By then, the rain had started.”

Hugo made a note, the scratch of his pen loud in the hush. The evidence was mounting, but nothing fit neatly. The timeline was fractured, the motives layered and raw. Beatrice’s admission of betrayal, Hale’s defensiveness, the rumors of a splash—each pointed in a different direction.

As the first lamps flickered on inside the hotel, casting long shadows across the terrace, Hugo felt the weight of the investigation settle on his shoulders anew. The answers were close—he could sense them—but every revelation seemed to open another door. He closed his diary, the sound sharp in the gathering dark, and looked out over the restless sea. Somewhere beneath the surface, the truth waited, tangled in jealousy, ambition, and the secrets people kept even from themselves.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witness testimony confirming Dr. Finch and Sylvia's presence with Captain Hale."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch and Sylvia were accounted for until eleven o'clock, clearing them of suspicion."

# Case Overview
Title: Tide of Deceit
Era: 1940s
Setting: Cannes
Crime: murder (drowning)
Culprit: Dr. Mallory Finch
Victim: Eleanor Voss
False assumption: Eleanor must have drowned while everyone was at the party.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Cannes). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Cannes" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)
• Sylvia Trent — she/her/her (NEVER he/him)
• Hugo Vane — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Alibis Under Scrutiny",
    "setting": {
      "location": "the hotel dining area",
      "timeOfDay": "Late evening",
      "atmosphere": "Heavy with anticipation, as guests await questioning"
    },
    "characters": [
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Sylvia Trent"
    ],
    "purpose": "Challenge the alibis and gather more clues",
    "cluesRevealed": [
      "clue_10",
      "clue_11",
      "clue_12"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as alibis are challenged.",
      "tension": "The atmosphere grows more charged as accusations fly.",
      "microMomentBeats": [
        "Sylvia fidgets with her necklace, avoiding eye contact as she speaks."
      ]
    },
    "summary": "Hugo questions Dr. Finch and Sylvia about their whereabouts during the critical time. As he pieces together their alibis, he discovers that they were both seen with Captain Hale until eleven o'clock, eliminating them as suspects. The tension builds as the remaining guests realize they are under scrutiny.",
    "beat": "alibis",
    "estimatedWordCount": 1250,
    "pivotElement": "Witness testimony confirming Dr. Finch and Sylvia's presence with Captain Hale.",
    "factEstablished": "Establishes that Dr. Finch and Sylvia were accounted for until eleven o'clock, clearing them of suspicion.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "New evidence shifts suspicion to other characters.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Finch has a clipped, clinical manner, often punctuated with dry humor."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "rationing limiting luxury goods; the impact of inflation on consumer choices; limited public transport options affecting movement",
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
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
  Sylvia Trent         | she/her/her/herself       | [fill in]     | [yes/no]
  Hugo Vane            | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 5: Alibis Under Scrutiny",
      "summary": "Hugo questions Dr. Mallory Finch and Sylvia Trent in the hotel dining area, seeking to test their alibis for the night of Eleanor Voss’s death. Through tense exchanges and witness testimony, he establishes that both women were with Captain Hale until eleven o’clock, clearing them as suspects and shifting suspicion elsewhere.",
      "paragraphs": [
        "When the first echoes of lamplight flickered across the pressed linen and half-cleared plates in the hotel dining area, Hugo Vane found himself standing at the threshold, the heavy hush of late evening thick as velvet. The scent of rain lingered, mingling with the faint aroma of coffee grounds and the sharper tang of lemon polish on the mahogany sideboard. Outside, the night pressed close, the windows reflecting only the dim glow within. The anticipation in the air was palpable—a storm of questions waiting to break.",
        "He moved further into the room, the soles of his oxford shoes whispering against the tiled floor. Dr. Mallory Finch sat at the end of the table, her posture rigid, the tailored lines of her blazer immaculate even in the waning light. Across from her, Sylvia Trent’s pearl necklace gleamed, her fingers fidgeting with the clasp as she avoided Hugo’s gaze. The soft hum of a radio drifted in from the Grand Lobby, a distant melody—'Near You' by The Andrews Sisters—punctuated by the occasional crackle of static. The normalcy of the music felt like an intrusion.",
        "Hugo drew a breath, the weight of the investigation heavy on his shoulders. The memory of Beatrice’s confession on the terrace still rang in his ears, and the knowledge that every alibi must now be tested left him restless. He set his diary on the table, its leather cover cool and smooth beneath his palm. \"We need to clarify your whereabouts last night,\" he began, his tone measured but unyielding. \"There are gaps in the timeline that must be closed.\"",
        "Dr. Finch’s eyes flicked to him, the clinical detachment in her gaze undercut by a tightness at the corners of her mouth. \"I was in the dining room until just after ten fifty,\" she replied, her voice clipped. \"Captain Hale will confirm as much. We were discussing the state of the National Health Service—hardly the stuff of midnight intrigue.\" She offered a brittle smile, but her hands betrayed her, fingers tapping a silent rhythm against the table’s edge.",
        "Sylvia’s response was slower, her voice smooth as silk, but edged with something sharper. \"One must always keep appearances, darling,\" she murmured, her attention fixed on the pearls at her throat. \"I recall being here with Captain Hale as well. The conversation was—well, let’s say it was not the most riveting I’ve endured.\" She glanced up at Hugo, her eyes cool and assessing. \"You may ask him yourself, if you doubt me.\"",
        "Hugo made a note, the scratch of his fountain pen loud in the hush. He pressed, \"Several guests recall seeing you both with Captain Hale until the hour struck eleven. Can either of you account for your movements after that?\"",
        "Dr. Finch’s jaw tightened. \"I left the dining area just after eleven. I returned to my room, as I told you before. If you’re suggesting I slipped out to the beach in the interim, you’ll find no evidence of it.\" Her tone was defensive, the words clipped. For a moment, her composure faltered, and Hugo glimpsed the strain beneath her professional exterior—a flicker of something like fear, quickly masked.",
        "Sylvia’s fingers stilled on her necklace. She offered a faint, ironic smile. \"I lingered in the lobby for a time, speaking with Beatrice and a few others. There was nothing remarkable about the evening, at least not until the news broke. I trust you’ll find my presence accounted for.\" Her voice was light, but Hugo caught the tremor beneath the polish—a subtle anxiety, perhaps, or the fear of being implicated by association.",
        "A sudden clatter of crockery from the kitchen startled them all, the sound sharp in the charged silence. Hugo seized the moment to shift the focus. \"Captain Hale has already confirmed your presence in the dining area until eleven o’clock. Several guests corroborate his account. That places both of you here at the critical time.\" He let the implication settle, watching for any sign of relief or resentment.",
        "Dr. Finch’s shoulders eased, just barely. \"Then I trust we can put these suspicions to rest, Mr. Vane. I have patients to attend to in the morning—and little patience for insinuation.\" Her words were brisk, but Hugo noted the way her hands remained clenched in her lap, the knuckles pale.",
        "Sylvia’s posture softened, her tone growing almost conspiratorial. \"It seems, then, that someone else must have found opportunity while we were otherwise engaged. I do hope you’ll be thorough, Mr. Vane. Scandal is so dreadfully inconvenient.\" She offered a smile, but it did not reach her eyes.",
        "Hugo considered the evidence: testimony from Captain Hale, corroboration from other guests, and the absence of any credible contradiction. The alignment of their alibis was as precise as the tide itself—at \"ten minutes past eleven\", the window for Eleanor’s drowning was narrow, and Dr. Finch and Sylvia were both accounted for. He felt the investigation pivot, suspicion shifting away from these two women and toward the shadows that still lingered at the edge of the narrative.",
        "Yet the tension in the room did not wholly dissipate. Dr. Finch’s defensiveness, Sylvia’s brittle charm—both hinted at deeper wounds, at secrets not yet confessed. Hugo wondered if the relief they felt was genuine, or merely the temporary reprieve of those who had narrowly escaped the noose. He closed his diary, the snap of the cover echoing in the hush.",
        "Outside, the rain began anew, tapping a restless rhythm against the tall windows. The dining area, for all its luxury, felt suddenly small—a stage upon which the drama of guilt and innocence played out beneath the indifferent gaze of the summer night. Hugo lingered, watching as Dr. Finch gathered her things and Sylvia drifted toward the door, her perfume trailing behind her like a final, unanswered question.",
        "As the last of the lamplight flickered over the polished silver and empty glasses, Hugo was left alone with his thoughts. The answers were closer now, the field narrowed, but the cost of each revelation weighed heavier. He knew, with a journalist’s certainty, that the truth would not be gentle—nor would it leave any of them unchanged."
      ]
    }
  ],
  "cast": [
    "Hugo Vane",
    "Dr. Mallory Finch",
    "Sylvia Trent"
  ],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 12 | absent",
    "season_words_used": "summer, summer night, midsummer | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_10: paragraph 9, clue_11: paragraph 9, clue_12: paragraph 9",
    "early_observation_present": "Sylvia fidgets with her necklace, avoiding eye contact as she speaks: paragraph 2 | present",
    "early_inference_present": "yes: paragraph immediately following observation"
  }
}
  
   
```

## Message 5 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 5 in this one retry.
Retry mode: SURGICAL_PATCH.
Attempt context: 2/3 | primary class: continuity.
Why this mode: single-family fix can preserve stable draft sections.

SOURCE OF TRUTH
- Use the existing draft as reference only for paragraphs that already satisfy the rules.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Gender agreement: "both women" / "the two ladies" used in a paragraph that also contains masculine pronouns (he/him). At least one character in the group uses he/him. Use individual names instead of a gendered collective.

REWRITE PLAN
- Preserve paragraphs that are already valid, but fully rewrite every paragraph touched by a failing issue.
- Keep cast-canonical names, roles, and pronouns stable in every paragraph. If a sentence drifts, rewrite the whole sentence cleanly.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Character names, roles, and pronouns are consistent in every sentence.
- Primary failure class cleared: continuity.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 5 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

Attempt 2/3 — chapters 5 — 1 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Gender agreement: "both women" / "the two ladies" used in a paragraph that also contains masculine pronouns (he/him). At least one character in the group uses he/him. Use individual names instead of a gendered collective.

✓ SOLUTION: The ONLY characters who exist are: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

Return corrected JSON for chapters 5. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 1/3
OFFENDING TEXT: both women
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Gender agreement: "both women" / "the two ladies" used in a paragraph that also contains masculine pronouns (he/him). At least one character in the group uses he/him. Use individual names instead of a gendered collective.
```
