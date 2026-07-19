# Actual Prompt Record

- Run ID: `mystery-1784454613188`
- Project ID: ``
- Timestamp: `2026-07-19T09:56:09.919Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `16d3530bec4e52ac`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman) — DECEASED, past-tense only, Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit intended to protect a loved one from the victim's manipulative behavior, leading to a morally complex dilemma." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Dr. Mallory Finch is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Dr. Mallory Finch is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Dr. Mallory Finch said, "…"` / `Dr. Mallory Finch turned to him`. RIGHT: `Dr. Mallory Finch had said, weeks before, that…` / `Agnes remembered how Dr. Mallory Finch used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Dr. Mallory Finch beside an action or speech verb. A live dialogue tag or present action for Dr. Mallory Finch is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch (DECEASED), Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: victim (DECEASED — does not appear in any scene, past tense only)
   - Captain Ivor Hale: Traditionalist Patriarch
   - Beatrice Quill: Ambitious Outsider
   - Sylvia Trent: Manipulative Insider
   - Hugo Vane: Cynical Outsider
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
- False assumption in force: Dr. Mallory Finch died from a sudden medical condition due to her past health issues.
- Hidden truth to progressively expose (compose in your own words from these elements): true, nature, poisoning, deliberate, administration, botanical, toxin
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: half, empty, bottle, beach, finch, room, label, indicating, contains, rare, coastal, plant | corr: presence, beach, suggests, possible, link, poisoning, contain, toxic, substance | effect: narrows, investigation, towards, guests, access, victim, room
  - Step 2: obs: witnesses, recall, finch, complaining, unusual, rash, using, beach | corr: rash, indicates, possible, adverse, reaction, strengthening, connection, death | effect: eliminates, theory, natural, causes, finch, death
  - Step 3: obs: note, mentioning, rare, coastal, plant, among, finch, belongings | corr: note, implies, plant, known, finch, suggesting, used, intentionally, unaware, toxic, effects | effect: narrows, suspicion, toward, provided, suggested
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): experiment, staged, guests, asked, apply, beach, supervision, observe, adverse, reactions
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_4, clue_early_1
- Fair-play rationale: Step 1: The half-empty bottle of beach oil (early) and witness testimonies about Dr. Finch's rash (mid) indicate a connection between the oil and her death. Step 2: The note about the rare plant (mid) narrows suspicion towards guests associated with it. Step 3: The controlled experiment (discriminating test) reveals who had the knowledge of the oil's effects.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured pace, often slipping in witty asides that reflect her observations
She tends to use metaphors related to travel and exploration, making her dialogue both engaging and layered.
Eleanor grapples with her gambling addiction, feeling the weight of her hidden debts while trying to maintain her image as a successful writer.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a commanding presence, his voice resonant and authoritative
However, he occasionally interjects self-deprecating remarks, revealing a softer side beneath his stoic exterior
His dialogue often reflects a sense of duty and honor, with a touch of nostalgia for his past.
Captain Hale is torn between his sense of duty to his family and the fear of losing his financial grip on the future.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively and enthusiastic tone, often punctuated by sardonic quips that reflect her youthful ambition
She has a tendency to use dramatic gestures and vivid imagery when discussing her aspirations, making her dialogue colorful and engaging.
Beatrice is torn between her desire for success and the guilt of her affair, feeling both empowered and betrayed by the victim’s actions.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a refined and articulate tone, her words carefully chosen to convey both sophistication and authority
She often employs polite yet cutting remarks, revealing her sharp wit and keen business sense.
Sylvia struggles with the tension between her ambition and her loyalty to family, fearing the repercussions of her secret dealings.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a straightforward, no-nonsense manner, often cutting to the heart of the matter with blunt observations
His dialogue is peppered with sardonic humor, reflecting his cynical view of the world and the moral ambiguity of his profession.
Hugo wrestles with the ethics of his profession, torn between self-interest and the pursuit of truth, questioning whether his actions align with his values.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured pace, often slipping in witty asides that reflect her observations. She tends to use metaphors related to travel and exploration, making her dialogue both engaging and layered.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“Life’s a journey, isn’t it?”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life’s a journey, isn’t it? You never know where the next path will take you."
  [evasive] "Oh, I wouldn't know anything about that. Just a simple traveler, really."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with her gambling addiction, feeling the weight of her hidden debts while trying to maintain her image as a successful writer."

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a commanding presence, his voice resonant and authoritative. However, he occasionally interjects self-deprecating remarks, revealing a softer side beneath his stoic exterior. His dialogue often reflects a sense of duty and honor, with a touch of nostalgia for his past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“In my day…”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, things were much simpler. We had a code of honor."
  [evasive] "I can’t say I remember every little detail, you know how it is."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is torn between his sense of duty to his family and the fear of losing his financial grip on the future."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively and enthusiastic tone, often punctuated by sardonic quips that reflect her youthful ambition. She has a tendency to use dramatic gestures and vivid imagery when discussing her aspirations, making her dialogue colorful and engaging.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“Isn’t it just thrilling?”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it just thrilling to be surrounded by such drama?"
  [evasive] "Oh, come now! I’m sure we all have our secrets."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice is torn between her desire for success and the guilt of her affair, feeling both empowered and betrayed by the victim’s actions."

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a refined and articulate tone, her words carefully chosen to convey both sophistication and authority. She often employs polite yet cutting remarks, revealing her sharp wit and keen business sense.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“One must always consider the finer details.”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must always consider the finer details of any deal."
  [evasive] "I couldn’t possibly comment on unverified rumors."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia struggles with the tension between her ambition and her loyalty to family, fearing the repercussions of her secret dealings."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a straightforward, no-nonsense manner, often cutting to the heart of the matter with blunt observations. His dialogue is peppered with sardonic humor, reflecting his cynical view of the world and the moral ambiguity of his profession.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“What’s the angle?”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "What’s the angle? You always have to consider your next move."
  [evasive] "I’d rather not get involved in matters that don’t concern me."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo wrestles with the ethics of his profession, torn between self-interest and the pursuit of truth, questioning whether his actions align with his values."



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

This story takes place in May 1942 during spring.

Seasonal Atmosphere:
- Weather patterns: mild but overcast, occasional coastal fog, cool breezes from the ocean
- Daylight: Daylight stretches longer as the sun rises earlier, providing soft light until nearly eight o'clock in the evening.
- Seasonal activities: spring cleaning in homes and hotels, garden planting as the frost has passed, picnics and seaside strolls in the cooler weather
- Seasonal occasions: Victoria Day (May 24) celebrated in some regions, with parades and gatherings planned for the end of the month
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt with a stiff collar, silk tie with geometric patterns
- Men casual: tweed jacket with elbow patches, lightweight slacks in khaki, canvas loafers
- Men accessories: fedora hat, leather gloves, silver pocket watch
- Women formal: A-line dress with a cinched waist in pastel colors, pearl necklace for evening events, matching clutch purse
- Women casual: short-sleeved blouse with floral print, high-waisted skirt reaching mid-calf, ballet flats
- Women accessories: wide-brimmed straw hat, silk scarf tied around the neck, small handbag

Cultural Context (reference naturally):
- Music/entertainment: 'In the Mood' by Glenn Miller, 'I'll Be Seeing You' by Bing Crosby, 'Don't Sit Under the Apple Tree' by The Andrews Sisters; Films: 'Casablanca', 'The Magnificent Ambersons'; Theatre: 'Oklahoma!' continues to draw crowds, 'The Glass Menagerie' begins to gain traction; Radio: 'The Shadow' provides thrilling suspense, 'Your Hit Parade' features popular wartime songs
- Typical prices: Loaf of bread: four pence, A gallon of gasoline: one shilling, A theater ticket: two shillings
- Current events: Battle of the Atlantic tensions escalate; U.S. military steps up recruitment for the war effort
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | 'The Little Prince' by Antoine de Saint-Exupéry | [detective fiction] | [war novels] | [romantic literature reflecting wartime separation]
- Technology: improved radar technology used by the military | advancements in radio communication | the beginnings of electronic computing in military applications | battery-operated radios in homes | simple mechanical typewriters in offices | early-model television sets beginning to appear in urban homes
- Daily life: attending community events and fundraisers for the war effort, participating in local gardening clubs, engaging in scrap drives to collect materials for the military
- Social rituals: Sunday family gatherings for dinner, weekly bingo nights at community centers, evening strolls through neighborhood parks

Atmospheric Details:
The scent of salt air mixes with the faint aroma of blooming spring flowers, creating a tense yet invigorating atmosphere. Flickering lights from the hotel lobby cast shadows along the polished marble floors, hinting at secrets hidden within the walls. Soft sounds of jazz music waft through the hotel bar, punctuated by the occasional laughter of patrons, contrasting with the palpable anxiety of the times.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-speci
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time when the victim was officially declared dead.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"
  - The time when the first symptoms of poisoning began to manifest.: "twenty minutes past seven"
    ⛔ FORBIDDEN alternatives: "7:20", "7.20", "seven twenty", "seven-twenty", "seven past twenty", "quarter past seven", "half past seven" — the ONLY acceptable form is "twenty minutes past seven"
  - The time when the oil was last applied to the victim's skin.: "a quarter to seven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] finch, seen, applying, beach, shortly, before, dinner
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: application, time, crucial, understanding, poisoning

• [clue_5] witnesses, claim, finch, appeared, healthy, dinner
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: witnesses, accounts, challenge, sudden, medical, condition, assumption

• [clue_fp_elimination_hugo_vane] murder
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: eliminates, hugo, vane, because, independent, corroboration, places, away, decisive, mechanism, window

• [clue_mid_2] captain, ivor, hale, observed, acting, nervously, dinner
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: captain, hale, behavior, raises, suspicion

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time when the victim was officially declared dead.: "ten minutes past eight"
  • The time when the first symptoms of poisoning began to manifest.: "twenty minutes past seven"
  • The time when the oil was last applied to the victim's skin.: "a quarter to seven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_culprit_direct_captain_ivor_hale, clue_mechanism_visibility_core, clue_mid_1, clue_core_contradiction_chain, clue_fp_contradiction_step_1, clue_fp_contradiction_step_2, clue_fp_contradiction_step_3 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): beach, involved, poisoning | direct, shows, captain, ivor, hale, means | core, mechanism, poisoning, linked | rash, suggests, connection, poisoning | rash, suggests, connection, poisoning | presence, beach, suggests, possible, link, poisoning | rash, indicates, possible, adverse, reaction, strengthening | note, implies, plant, known, finch, suggesting
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor’s mind sifted through the evidence and the stories, searching for the thread that would bind them together. The contradictions were not merely inconvenient; they were the heart of the mystery. Dr. Finch had appeared healthy to some, ill to others. The..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Dr. Mallory Finch: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Dr. Mallory Finch crossed the room" / "Dr. Mallory Finch sat on the sofa" / "Dr. Mallory Finch nodded"
  - WRONG: "Dr. Mallory Finch gave testimony" / "Dr. Mallory Finch asked what had happened"
  - CORRECT: "Dr. Mallory Finch had often said..." / "Dr. Mallory Finch's effects were found" / "witnesses recalled Dr. Mallory Finch's habit of..."
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
Known location profile anchors: The Oceanic Hotel, The Grand Lobby, The Dining Room, Private Beach Access, The Hotel Library, the hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Oceanic Hotel", "The Grand Lobby", "The Dining Room", "Private Beach Access", "The Hotel Library", "the hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "one must always consider the finer details", "only by the distant sound of waves", "by the distant sound of waves and", "the distant sound of waves and the", "distant sound of waves and the persistent".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=14508; context=8180; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military-grade radar | code-breaking machines | long-distance telephone calls | military encryption techniques.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | locked staff-only areas | oceanfront access restricted during storms | restricted access to the roof and service areas | check-in procedures for guests.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a seaside hotel for a post-WWII reunion exposes hidden rivalries and secrets among guests, intensified by the pressures of emerging Cold War anxieties and changing gender roles.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method of delayed-action poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and similar location type)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the guest's reaction
Test type: reaction to beach oil

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Evidence shows she was not near the victim
  Clues: Witnesses confirming her whereabouts
- Sylvia Trent (Act 3, Scene 5): Documented delivery of painting to Dr. Finch
  Clues: Delivery confirmation from hotel staff
- Hugo Vane (Act 3, Scene 5): Alibi confirmed: during the murder

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_elimination_chain must appear in Act 2, Scene 1 via Corroborated elimination

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
Investigation state at start: 8 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
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
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor’s mind sifted through the evidence and the stories, searching for the thread that would bind them together. The contradictions were not merely inconvenient; they were the heart of the mystery. Dr. Finch had appea...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • eleanor, voss, corroborated, alibi, hotel, staff [clue_core_elimination_chain]
      Points to: eleanor, voss, excluded, suspect
    • witnesses, confirm, seeing, finch, beach [clue_2]
      Points to: application, time, crucial, understanding, poisoning
    • several, guests, confirm, finch, condition, dinner [clue_5]
      Points to: witnesses, accounts, challenge, sudden, medical, condition, assumption
    • detailed, note, among, finch, belongings, mentions, specific, natural [clue_fp_elimination_hugo_vane]
      Points to: eliminates, hugo, vane, because, independent, corroboration, places, away, decisive, mechanism, window
    • guests, notice, captain, hale, unusual, behavior [clue_mid_2]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "around the time of the murder". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The time when the victim was officially declared dead., write exactly: "ten minutes past eight".
  - If this batch mentions The time when the first symptoms of poisoning began to manifest., write exactly: "twenty minutes past seven".
  - If this batch mentions The time when the oil was last applied to the victim's skin., write exactly: "a quarter to seven".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 8 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Dinner time
- Established timeline fact: Time of death
- If referenced, use exact phrase: "ten minutes past eight" (The time when the victim was officially declared dead.).
- If referenced, use exact phrase: "twenty minutes past seven" (The time when the first symptoms of poisoning began to manifest.).
- If referenced, use exact phrase: "a quarter to seven" (The time when the oil was last applied to the victim's skin.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Silent Room
Eleanor Voss pressed her gloved hand against the cold brass handle, pausing at the threshold of the victim's hotel room at the seaside hotel. The corridor behind her was hushed, the usual murmur of morning activity stilled by the fog that pressed against the windowpanes and the knowledge of what lay beyond the door. The faint scent of salt and last night's cigarette smoke clung to the air, mingling with the sharper tang of something medicinal. Inside, the lamplight cast a pale glow across the room's geometric wallpaper and the still form of Dr. Mallory Finch, sprawled awkwardly atop the bed, her eyes fixed on nothing. The silence was absolute, except for the distant echo of a radio in the lobby below—news of the war, unheeded in this private disaster.

Eleanor stepped forward, her shoes muffled by the faded carpet, and her gaze landed immediately on a half-empty bottle resting on the bedside table. The label was crisp and recent, declaring its contents as beach oil, with a warning in small print about possible adverse reactions for sensitive skin. Next to it, a folded note lay half-tucked beneath a book, the handwriting unmistakably Dr. Mallory Finch's: a detailed mention of a rare coastal plant, its properties, and a cryptic line about its use in traditional remedies. The bottle's position—so close to the victim's hand—felt deliberate, as though it had been set there after some final act. A faint, unfamiliar rash traced the skin of Dr. Mallory Finch's forearm, angry and red against the pallor of her complexion. The effect was jarring, a contradiction to the calm that should have accompanied sleep.

A prickle of unease ran through Eleanor as she took in these details. The bottle's label, the rash, and the note about the coastal plant—none of it fit the narrative of a peaceful passing. She recalled overhearing Dr. Mallory Finch mention an irritation from a new oil she had tried after a walk on the beach the previous afternoon. The implication hovered in the air: something in this room had not merely soothed, but harmed. Eleanor's mind began to catalogue the possibilities, the evidence refusing to arrange itself into a benign explanation.

The door creaked open further behind her, and Captain Ivor Hale entered, his posture rigid, the silver of his pocket watch chain catching the lamplight. He was dressed impeccably in a double-breasted navy suit, the lines of his uniform crisp even in this hour of distress. Captain Ivor Hale, the retired naval officer and board member of the local charity, had always seemed to Eleanor a man of unyielding discipline. Now, his eyes swept the scene with a restlessness that belied his calm. He lingered near the writing desk, fingers drumming against the surface, gaze flicking from the bottle to the note, then to Eleanor herself. It was a performance of composure, but the tension in his jaw spoke of something more unsettled.

Beatrice Quill arrived next, her entrance a burst of nervous energy that seemed to disrupt the static air. She wore a short-sleeved blouse with a faded floral print and a high-waisted skirt, her hair pinned back hastily. As the hotel receptionist and a confidante of Dr. Mallory Finch, Beatrice Quill's presence here was both expected and jarring. Her eyes darted to the body, then to the bottle, and she pressed her lips together, knuckles white around the strap of her handbag. 'Isn’t it just thrilling?' she whispered, the words brittle, her bravado cracking as she looked away. Eleanor noted the tremor in her hands—a woman accustomed to managing guests, now adrift in a scene she could not control.

Sylvia Trent entered with a measured step, her tailored suit and silk scarf immaculate despite the early hour. As an art dealer, Sylvia Trent moved with the certainty of someone used to commanding attention, but now her gaze was guarded. She paused by the window, the fog outside rendering her reflection ghostly, and regarded the gathering with polite detachment. 'One must always consider the finer details,' she murmured, her eyes lingering on the bottle before shifting to the note. Eleanor caught the faintest arch of an eyebrow—a signal of skepticism, or perhaps calculation. Sylvia Trent's composure was intact, but her fingers toyed with the edge of her scarf, betraying a flicker of unease.

Hugo Vane trailed in last, the private investigator's presence announced by the scrape of his shoes against the floorboards. He wore a tweed jacket with frayed elbows and a battered fedora, his expression set in a mask of blunt appraisal. Hugo Vane surveyed the room with a cool detachment, his gaze lingering on the bottle and the rash on Dr. Mallory Finch's arm. 'What’s the angle?' he muttered, voice low enough for only Eleanor to catch. He leaned against the doorframe, arms folded, as if daring anyone to challenge his right to be here. Yet even his cynicism seemed to falter in the face of the scene before them.

Eleanor cleared her throat, drawing the attention of the assembled guests. 'Dr. Mallory Finch is dead,' she said quietly, the words heavy in the close air. 'I will be conducting the inquiry.' There was a collective intake of breath, the reality settling in with the weight of the overcast morning. Outside, the fog pressed closer, as if the world itself recoiled from what had transpired within these walls.

She moved to the bedside table, examining the bottle more closely. The label's warning about toxic substances seemed almost an afterthought, but now it loomed large. Eleanor considered the rash, the note, and the proximity of the oil. It was a constellation of facts that refused to resolve into a simple accident. She glanced at the others, searching their faces for any sign of recognition or guilt. Captain Ivor Hale's restlessness, Beatrice Quill's strained bravado, Sylvia Trent's poised reserve, and Hugo Vane's guarded watchfulness—all were pieces of a puzzle she had only begun to assemble.

A knock sounded from the corridor, and a muffled voice announced the arrival of a constable, but Eleanor did not relinquish her role. She gestured for silence, her gaze returning to the note. The details about the coastal plant were precise, almost clinical, yet the mention of its use in traditional remedies hinted at knowledge beyond the ordinary. Why had Dr. Mallory Finch taken such an interest in this particular oil? And who had ensured it was within her reach at the crucial moment?

The room felt colder now, the fog outside deepening into a grey shroud. Eleanor's thoughts circled the evidence: the half-empty bottle, the rash, the note. She could not ignore the possibility that Dr. Mallory Finch's death was no accident. The others shifted uneasily, the silence punctuated only by the distant sound of waves and the persistent tick of the bedside clock. It was not yet time for answers, but the questions had already begun their relentless march.

As the morning wore on, Eleanor found herself replaying the details in her mind. The bottle's placement, the specificity of the note, the visible rash—each element suggested intention. Yet intention did not equal guilt, and guilt did not always wear a visible face. She would need to probe beneath the surface, to test the stories and alibis that would soon emerge. For now, the only certainty was the presence of death, and the knowledge that someone in this room knew more than they would admit.

Eleanor Voss pressed on to the next concrete detail. The record now held: Poison absorbed skin contact mechanism activated; Witnesses recall finch complaining unusual rash.

Those details shifted the reasoning. Weighed against the rest, Poison absorbed skin contact mechanism activated bent the trail toward Core mechanism poisoning linked. Weighed against the rest, Witnesses recall finch complaining unusual rash bent the trail toward Rash suggests connection poisoning.

Eleanor looked once more at Dr. Mallory Finch, her features softened by the lamplight. There was no peace in that expression, only the unresolved tension of a life interrupted. The war outside had brought its own casualties, but here, in this quiet room, another battle had been fought—and lost. Eleanor straightened, her resolve hardening. The journey had begun, and she would see it through, wherever the path might lead.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"She mentioned the rash again just before dinner—said it was worse after her walk on the beach," Beatrice Quill’s voice carried through the dim glow of the hotel lobby, slicing through the anxious hush that had settled since the discovery. The air was thick with the scent of damp wool and salt, a reminder of the vernal fog pressing against the windows, blurring the world beyond. Eleanor Voss stood at the edge of a cluster of guests, her gloved hand still tingling from the cold brass handle upstairs, the echo of Dr. Mallory Finch’s lifeless gaze lingering in her mind. The lobby’s marble floor reflected the flicker of lamplight, and the subdued murmur of voices was punctuated by the distant creak of an old settee as someone shifted, restless.

Eleanor’s thoughts circled the details Beatrice Quill had offered. If Dr. Mallory Finch had complained of a rash after applying the beach oil—especially after her time by the shore—then the irritation was no idle matter. It suggested more than a simple allergy; it hinted at something introduced, something that had changed her condition after the walk. The implication was chilling: what if the rash was not merely a symptom, but a signpost pointing toward the cause of death? Eleanor’s gaze swept the lobby, noting how the others absorbed Beatrice Quill’s words, some with skepticism, others with a flicker of fear.

A folded note, retrieved from among Dr. Mallory Finch’s belongings and now resting in Eleanor’s palm, drew her focus. The handwriting was precise, the ink slightly smudged in one corner. It described a rare coastal plant, its properties, and a warning about its use in topical remedies. The note referenced the very oil found on the bedside table—half-empty, its label clear about the inclusion of the plant. The specificity was unsettling. Eleanor turned the paper over, feeling the roughness of the stationary against her skin, the words echoing the warning on the bottle: possible adverse reactions for sensitive skin.

This was no idle curiosity on Dr. Mallory Finch’s part. The presence of both the oil and the note, each referencing the same rare plant, suggested a deliberate connection. Eleanor’s mind traced the possibilities: had Dr. Mallory Finch been experimenting, or had someone else ensured she received the oil? The evidence narrowed the field to those who had access to her room and knowledge of her habits. The contradiction was stark—Dr. Mallory Finch, a woman of caution, would not have risked her health without reason. Someone had either misled her, or the oil had been tampered with.

Sylvia Trent, standing near the lobby’s art deco fireplace, caught Eleanor’s eye. "One must always consider the finer details," Sylvia Trent remarked, her tone measured, eyes lingering on the note in Eleanor’s hand. She adjusted her silk scarf, the gesture smooth but revealing a slight tremor. "Dr. Finch seemed perfectly well when I saw her before dinner—she was discussing the upcoming art auction, not a word about feeling unwell." The contradiction was immediate: Beatrice Quill’s account of complaints and Sylvia Trent’s insistence on normalcy. The tension between them was palpable, a silent contest for the narrative.

Captain Ivor Hale, his uniform immaculate and his posture rigid, interjected with a voice that carried authority. "I can’t say I remember every little detail, you know how it is. But Dr. Finch was in good spirits at dinner. If there was anything amiss, she hid it well." He avoided Eleanor’s gaze, his fingers drumming against the polished wood of the reception desk. The self-deprecation in his tone did little to mask the unease in his eyes. Eleanor noted the careful way he skirted specifics, as if unwilling to be pinned to a version of events.

Hugo Vane, leaning against a marble pillar, offered a blunt assessment. "People see what they want. Some say she was fine, others say she wasn’t. Doesn’t change the fact she’s dead now, does it?" His words drew a sharp glance from Beatrice Quill, who bristled but said nothing. Hugo Vane’s gaze was cool, but Eleanor caught a flicker of something else—a calculation, perhaps, or a reluctance to be drawn into the emotional current swirling around them.

The lobby’s atmosphere grew heavier as the guests’ conflicting statements settled over the group. Eleanor watched their faces, each marked by a different shade of anxiety. Beatrice Quill’s hands twisted the strap of her handbag, her earlier bravado replaced by uncertainty. Sylvia Trent maintained her poise, but her eyes darted to the note whenever she thought no one was looking. Captain Ivor Hale’s composure was a mask, one that slipped whenever the conversation edged too close to specifics. Hugo Vane remained on the periphery, his cynicism a shield against the rising tide of suspicion.

Eleanor cleared her throat, drawing the group’s attention. "We must be precise. Dr. Finch’s complaints about the rash—did anyone else hear them? Or see her apply the oil?" The question hung in the air, unanswered for a moment. Beatrice Quill hesitated, then nodded. "She showed me the rash on her arm. Said it started after the beach, but she thought it would pass. I told her to see the hotel doctor, but she laughed it off."

Sylvia Trent’s lips pressed together. "I saw her only briefly. She seemed well enough to me. Perhaps she was putting on a brave face." The implication was clear: Dr. Mallory Finch might have concealed her discomfort, or perhaps the witnesses’ memories were colored by the shock of her death. The contradiction deepened—how could a woman appear so healthy moments before succumbing to a fatal reaction?

A burst of laughter from the far end of the lobby—quickly stifled—reminded Eleanor that life at The Oceanic Hotel continued, even in the shadow of tragedy. The radio crackled with news of the war, the familiar drone a backdrop to the mounting tension. Outside, the clouds hung low over the sea, muting the daylight and casting long shadows across the marble. The war’s anxieties pressed in, but the guests’ attention was fixed on the mystery at hand.

Eleanor’s mind sifted through the statements, the evidence, and the silences between. The half-empty bottle, the note, the rash—all pointed to a connection between the oil and Dr. Mallory Finch’s death. Yet the witnesses’ accounts could not be reconciled: some insisted on her health, others on her distress. The contradiction was not merely academic; it was a fracture in the narrative, one that demanded resolution.

She turned to Hugo Vane. "You were near Dr. Finch yesterday evening. Did you notice anything unusual?" Hugo Vane shrugged. "She seemed distracted, but then, who isn’t these days? Didn’t mention a rash to me. Maybe she didn’t trust me with her secrets." His tone was sardonic, but Eleanor caught the edge beneath the words—a reluctance to be implicated, or perhaps a hint of guilt.

The lobby’s silence deepened, broken only by the distant sound of waves and the persistent creak of the settee. Eleanor felt the weight of the guests’ suspicion, the sense that every word was being measured, every gesture scrutinized. The investigation had begun, but already the path was obscured by conflicting truths and the shadows of doubt.

As the afternoon wore on, Eleanor found herself replaying the details, searching for a thread that would bind the evidence together. The contradictions in the witnesses’ statements were not merely inconvenient; they were the heart of the mystery. Dr. Mallory Finch had appeared healthy to some, ill to others. The oil, the note, the rash—each pointed toward a deliberate act, yet the means and motive remained elusive.

For a moment, Eleanor allowed herself a breath of relief, a brief escape from the tension. The radio’s melody drifted through the lobby, and she recalled a line from her travels: "Life’s a journey, isn’t it? You never know where the next path will take you." The irony was not lost on her. Here, in the shadow of death, the journey had only just begun.

Eleanor straightened, her resolve hardening. The evidence refused to align, the witnesses’ memories clashed, and the truth remained just out of reach. But the contradictions themselves were a clue—a sign that beneath the surface of The Oceanic Hotel, something far more complex was at work. She would pursue it, wherever the path might lead.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Gathering Evidence
Later that morning, the vernal chill still clung to the air as Eleanor Voss stepped back into Dr. Finch's hotel room. The scent of damp linen and a faint medicinal undertone mingled with the lingering saltiness from the sea, drifting in through a cracked window. The lamplight cast long, uncertain shadows along the patterned carpet, and the silence was broken only by the distant sound of a radio playing ‘In the Mood’ somewhere down the corridor. Eleanor’s gaze was drawn immediately to the bedside table, where the half-empty bottle of beach oil sat, its label crisp and explicit: a warning about toxic substances for those with sensitive skin. The bottle’s position, so near where Dr. Finch’s hand had fallen, seemed almost accusatory in the pale morning light.

She leaned in, careful not to disturb the scene, and studied the bottle. The label was more than a formality—it was a declaration. The words ‘contains rare coastal plant—may cause adverse reactions’ leapt out at her, echoed by the angry rash that still marked Dr. Finch’s arm. The implication was clear: this was no ordinary cosmetic, and its presence here was no accident. Eleanor’s mind began to map the possible routes by which such a substance might have found its way into Dr. Finch’s routine. Who had access to her room? Who knew of her habits? The evidence narrowed, not widened, the field. The oil’s deliberate placement—half-used, label outward—suggested someone wanted it to be noticed, or perhaps hoped it would go unquestioned.

Her attention shifted to a folded note among Dr. Finch’s belongings, the paper slightly rough beneath her gloved fingers. The writing, unmistakably Dr. Finch’s, described the properties of a rare coastal plant—its use in traditional remedies, and a cryptic caution about topical application. The note was detailed, almost clinical, but the final line was underlined: ‘Potential for severe reaction if misused.’ Eleanor’s pulse quickened. The specificity of the note, paired with the bottle, felt like a signpost. Dr. Finch had not stumbled into danger blindly. Someone, perhaps even herself, had brought this plant into play. The note’s presence among her effects was both explanation and accusation.

Eleanor straightened, the chill of the room settling into her bones. She replayed the contradiction: Dr. Finch, a woman of science, would not have used an unfamiliar oil without reason. The note implied knowledge, perhaps even intent, but the rash on her arm told another story—one of suffering, not curiosity. The evidence refused to align. Was Dr. Finch experimenting, or had someone else ensured the oil’s presence? The contradiction was no longer theoretical; it was written on her skin and echoed in the objects left behind.

The door creaked, and Captain Ivor Hale entered with the measured tread of a man accustomed to command. His navy suit was immaculate, the silver chain of his pocket watch glinting against the dimness. He paused by the writing desk, gaze flicking from the bottle to the note to Eleanor herself. “I trust you’re making progress, Miss Voss?” His voice was steady, but the tension in his jaw betrayed him. He reached for the back of a chair, fingers drumming lightly—a habit Eleanor had come to associate with discomfort. She watched him, noting how his eyes lingered on the oil, then darted away. If he had nothing to hide, he hid it well.

Beatrice Quill appeared next, her presence a burst of nervous energy that seemed to unsettle even the air. Her short-sleeved blouse, patterned with faded springtime flowers, did little to disguise the tremor in her hands. She hovered near the foot of the bed, eyes wide and voice pitched just above a whisper. “Isn’t it just thrilling?” she said, the words brittle, her usual bravado fraying at the edges. “I mean—awful, of course. But who would have thought something so… ordinary could be so dangerous?” Her gaze darted to the bottle, then to Eleanor, as if searching for reassurance or absolution.

Sylvia Trent followed, her tailored suit and silk scarf immaculate, her expression composed but eyes sharp. She moved to the window, the morning fog blurring her reflection in the glass. “One must always consider the finer details,” she murmured, her tone as smooth as the silk at her throat. Her gaze lingered on the note in Eleanor’s hand, and for a moment, a flicker of something—recognition, perhaps—crossed her face. She turned away, adjusting her scarf with deliberate precision. “Dr. Finch was always so careful. I can hardly imagine her making such a mistake.” The implication hung in the air: if there was carelessness, it belonged to someone else.

Hugo Vane entered last, his tweed jacket and battered fedora marking him as a man apart. He leaned against the doorframe, arms folded, eyes narrowed. “What’s the angle?” he asked, voice low and sardonic. “You think someone slipped her a dose of bad luck, or did she do herself in?” He nodded toward the bottle, lips curling in a half-smile that didn’t reach his eyes. “Funny, isn’t it, how the simplest things turn deadly?” His bluntness drew a sharp glance from Beatrice Quill, who bristled but said nothing. Hugo Vane’s gaze lingered on the rash, then flicked to Eleanor, as if daring her to challenge his cynicism.

Eleanor cleared her throat. “Dr. Finch complained of a rash, didn’t she? Just before dinner?” She directed the question at Beatrice Quill, who nodded, her fingers twisting the strap of her handbag. “She showed me. Said it started after her walk on the beach. I told her to see the hotel doctor, but she laughed it off. Said it was nothing.” The detail was important—a confirmation that the symptoms had begun after contact with the oil. Eleanor’s mind ticked through the timeline: the rash, the note, the bottle. Each pointed to a link between the beach oil and Dr. Finch’s death. Yet the witnesses’ stories diverged.

Sylvia Trent interjected, voice measured. “I saw her only briefly. She seemed well enough to me. Perhaps she was putting on a brave face.” The contradiction was immediate: Beatrice Quill’s account of distress versus Sylvia Trent’s insistence on normalcy. Eleanor watched the exchange, noting the tension that simmered beneath the surface. Each woman clung to her version of events, unwilling to yield ground. The truth, Eleanor suspected, lay somewhere between their stories.

Captain Ivor Hale shifted, the movement drawing Eleanor’s attention. “In my day, we trusted our instincts. If something felt wrong, it usually was.” He offered a self-deprecating smile, but his eyes were wary. “Dr. Finch was in good spirits at dinner. If there was anything amiss, she hid it well.” The words were careful, chosen to avoid commitment. Eleanor sensed the effort it cost him to maintain composure. His alibi was intact, but his reluctance to be pinned to specifics was telling.

Hugo Vane snorted. “People see what they want. Some say she was fine, others say she wasn’t. Doesn’t change the fact she’s dead now, does it?” His tone was blunt, but Eleanor caught the edge beneath the words—a reluctance to be implicated, or perhaps a hint of guilt. He glanced at the bottle again, then at the note, as if weighing the evidence for himself.

A moment of silence settled over the room, broken only by the distant sound of waves and the persistent tick of the bedside clock. Eleanor allowed herself a brief, ironic smile. “Life’s a journey, isn’t it? You never know where the next path will take you.” The words, meant to lighten the mood, fell flat in the charged atmosphere. Still, the tension eased for a heartbeat, the guests’ postures relaxing minutely.

She returned her focus to the evidence. The half-empty bottle of beach oil, the detailed note about the rare coastal plant, the witness accounts of a rash—all pointed to a deliberate connection. Yet the contradictions in the guests’ statements remained unresolved. Eleanor’s investigation had revealed not only the complexity of the relationships among the guests but also the depth of their secrets. Each had something to hide, and each had reason to fear what the truth might reveal.

As the morning wore on, Eleanor pressed each guest for their whereabouts at the crucial times. Captain Ivor Hale’s answers were measured, his self-deprecation masking a reluctance to be pinned down. Beatrice Quill’s nervous energy gave way to defensiveness, her earlier bravado replaced by anxiety. Sylvia Trent maintained her poise, but her eyes flickered with uncertainty whenever the note was mentioned. Hugo Vane remained on the periphery, his cynicism a shield against the rising tide of suspicion.

Eleanor’s mind sifted through the evidence and the stories, searching for the thread that would bind them together. The contradictions were not merely inconvenient; they were the heart of the mystery. Dr. Finch had appeared healthy to some, ill to others. The oil, the note, the rash—each pointed toward a deliberate act, yet the means and motive remained elusive. For now, the only certainty was that the journey had begun, and the path ahead would be anything but simple.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's nervous behavior during questioning."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes multiple potential motives among the suspects, especially for Captain Hale and Beatrice."

# Case Overview
Title: The Delayed Reckoning
Era: 1940s
Setting: Seaside Hotel
Crime: murder (delayed-action poisoning)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch died from a sudden medical condition due to her past health issues.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "sceneNumber": 4,
    "act": 2,
    "title": "First Interviews",
    "setting": {
      "location": "the hotel dining room",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Quiet and tense as guests gather for lunch"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Conduct initial interviews to establish alibis and motives.",
    "cluesRevealed": [
      "clue_2",
      "clue_5",
      "clue_fp_elimination_hugo_vane",
      "clue_mid_2"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's questioning leads to defensiveness among the suspects.",
      "tension": "The atmosphere thickens as motives are hinted at.",
      "microMomentBeats": [
        "Eleanor's heart races as she senses the tension in the room."
      ]
    },
    "summary": "Eleanor interviews the guests during lunch, probing for alibis and motives. Captain Hale is nervous, while Beatrice seems evasive about her whereabouts. Sylvia claims to have been in the lobby at the time of death, and Hugo insists he was outside.",
    "beat": "motives",
    "estimatedWordCount": 1250,
    "pivotElement": "Captain Hale's nervous behavior during questioning.",
    "factEstablished": "Establishes multiple potential motives among the suspects, especially for Captain Hale and Beatrice.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A crucial clue shifts the investigation's direction, leading Eleanor deeper into the web of deceit.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is measured and engaging, laced with dry wit that reflects her observations."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Rationing limits available goods and services; Communication often delayed due to wartime restrictions; Travel limited by fuel shortages and strict regulations; Frequent air raid drills disrupt daily routines; The presence of military checkpoints affects movement",
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
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
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
