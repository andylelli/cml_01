# Actual Prompt Record

- Run ID: `mystery-1784240688362`
- Project ID: ``
- Timestamp: `2026-07-16T22:32:33.629Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `51c704c246f69f20`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice against the victim's past wrongs." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Enforcer
   - Beatrice Quill: Disgruntled Employee
   - Sylvia Trent: Jealous Rival
   - Hugo Vane: Manipulative Opportunist
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
- False assumption in force: Dr. Finch died from natural causes due to her known health issues.
- Hidden truth to progressively expose (compose in your own words from these elements): true, timing, method, poisoning, obscured, social, interactions
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: guests, noted, finch, engaging, conversation, before, collapse | corr: indicates, show, signs, distress, until | effect: narrows, timeline, poisoning, within, service
  - Step 2: obs: residue, rare, flower | corr: presence, poison, consumed, finch | effect: eliminates, possibility, natural, causes, sole, reason, symptoms
  - Step 3: obs: captain, hale, mixed, claimed, prepared, staff | corr: discrepancy, suggests, tampered | effect: narrows, suspicion, towards, captain, hale
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, service, noted, engag, claimed, timeline
- Test must rely on already-shown clue IDs: clue_culprit_direct_1, clue_3, clue_4, clue_culprit_direct_captain_ivor_hale
- Fair-play rationale: Step 1: Witness statements (early) confirm Dr. Finch's health before the tea. Step 2: The residue found (mid) points to poisoning. Step 3: Hale's contradictory claims during the test (discriminating test) reveal his guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a keen edge, often peppering her observations with a sardonic undertone
She has a habit of raising an eyebrow when she questions someone's motives.
Eleanor battles with her addiction, which often clouds her judgment and leads her to question her own capabilities as a journalist.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a booming, authoritative voice, often punctuating his statements with a hearty laugh
He has a tendency to tell long-winded stories, often losing his audience along the way.
Captain Hale grapples with the guilt of his past actions and the fear of their repercussions on his present life.
Voice colour: Captain Ivor Hale uses observational humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks softly, often trailing off as if unsure of herself
She has a habit of fidgeting with her hands when nervous, and her sentences are often punctuated with hesitant laughter.
Beatrice is torn between her desire for respect and her actions that undermine her dignity.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an air of sophistication, her words carefully chosen
She often employs biting sarcasm, and her laughter can be both charming and cutting.
Sylvia struggles with her jealousy and the realization that her social standing is built on superficiality.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, confident tone, often interjecting playful sarcasm into his conversations
He has a tendency to lean in closer when making a point, creating an air of intimacy.
Hugo wrestles with the fear of losing his empire and the realization that his manipulative tactics may lead to his downfall.
Voice colour: Hugo Vane uses sardonic humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a keen edge, often peppering her observations with a sardonic undertone. She has a habit of raising an eyebrow when she questions someone's motives.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn't that just delightful?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "What a delightful gathering we have here."
  [evasive] "I’m just here to observe, really."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor battles with her addiction, which often clouds her judgment and leads her to question her own capabilities as a journalist."

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a booming, authoritative voice, often punctuating his statements with a hearty laugh. He has a tendency to tell long-winded stories, often losing his audience along the way.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "In my day, we knew how to handle such matters!"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we knew how to handle such matters!"
  [evasive] "I was just having a drink, nothing more."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "everyone could sense the atmosphere"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale grapples with the guilt of his past actions and the fear of their repercussions on his present life."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks softly, often trailing off as if unsure of herself. She has a habit of fidgeting with her hands when nervous, and her sentences are often punctuated with hesitant laughter.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, I’m just a nobody."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, I’m just a nobody."
  [evasive] "I was just, um, cleaning a room."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice is torn between her desire for respect and her actions that undermine her dignity."

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an air of sophistication, her words carefully chosen. She often employs biting sarcasm, and her laughter can be both charming and cutting.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "How quaint."
Sample voice fragments (match this register and rhythm):
  [comfortable] "How quaint."
  [evasive] "I would never dream of interfering."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia struggles with her jealousy and the realization that her social standing is built on superficiality."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, confident tone, often interjecting playful sarcasm into his conversations. He has a tendency to lean in closer when making a point, creating an air of intimacy.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Isn't that just the way?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't that just the way?"
  [evasive] "I was on the phone, you can check."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo wrestles with the fear of losing his empire and the realization that his manipulative tactics may lead to his downfall."



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

This story takes place in May 1949 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool coastal breezes, mild temperatures around 12-15°C (54-59°F)
- Daylight: Days are gradually lengthening, with twilight lasting until nearly nine o'clock at night, providing a soft glow that contrasts with the grey skies.
- Seasonal activities: attending local spring fairs, enjoying tea in gardens despite the weather, participating in Maypole dances
- Seasonal occasions: May Day (1st May), Victoria Day (Canada, 23rd May)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, tailored white dress shirt, silk tie with geometric patterns
- Men casual: tweed blazer, button-up shirt with rolled sleeves, slacks in light grey
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: sleeveless floral tea dress, tailored jacket with shoulder pads, string of pearls
- Women casual: lightweight cardigan, ankle-length skirt, blouse with a Peter Pan collar
- Women accessories: small clutch purse, wide-brimmed straw hat, scarf tied at the neck

Cultural Context (reference naturally):
- Music/entertainment: Frank Sinatra's 'I've Got a Crush on You', Nat King Cole's 'Nature Boy', The Andrews Sisters' 'Rum and Coca-Cola'; Films: 'All the King's Men', 'The Third Man'; Theatre: 'A Streetcar Named Desire', 'Death of a Salesman'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: loaf of bread: four pence, a pint of milk: three pence, bus fare: two pence
- Current events: tensions rise in Eastern Europe with the Berlin Blockade continuing; the formation of NATO in April 1949
- Literature: '1984' by George Orwell | 'The Naked and the Dead' by Norman Mailer | 'Fahrenheit 451' by Ray Bradbury | [mystery and detective fiction] | [science fiction] | [post-war realism]
- Technology: the first commercial television broadcasts begin in the UK | the introduction of the microwave oven | early computers like the ENIAC are in use | radio sets are prevalent in homes | black-and-white television sets are starting to become popular | typewriters are common in offices
- Daily life: enjoying afternoon tea, playing croquet in gardens, congregating in cafes for conversation
- Social rituals: Sunday family dinners, weekly bridge nights among friends, attending church services regularly

Atmospheric Details:
The scent of rain-soaked earth mingles with the aroma of freshly brewed tea, creating a comforting yet tense atmosphere in the tea room. Muffled conversations and clinking teacups reverberate against the backdrop of distant thunder, heightening the sense of unease among the guests. The dim light filters through the heavy curtains, casting elongated shadows that dance ominously as the storm outside rages on.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the lates
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The victim was confirmed dead at this time.: "half past six"
    ⛔ FORBIDDEN alternatives: "6:30", "6.30", "six thirty", "six-thirty", "six past thirty", "quarter past six" — the ONLY acceptable form is "half past six"
  - Witnesses last saw the victim alive at this time.: "half past five"
    ⛔ FORBIDDEN alternatives: "5:30", "5.30", "five thirty", "five-thirty", "five past thirty", "quarter past five" — the ONLY acceptable form is "half past five"
  - The toxic effects of the flower take this long to appear.: "three hours"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "half past six" and "half past five" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] captain, hale, mixed, claimed, prepared, staff
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: captain, hale, potential, involvement, tampering

• [clue_7] captain, ivor, hale, exhibited, signs, jealousy, towards, finch
  Category: behavioral | Criticality: essential | Supports inference step 3
  Points to: captain, hale, possible, motive, murder

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The victim was confirmed dead at this time.: "half past six"
  • Witnesses last saw the victim alive at this time.: "half past five"
  • The toxic effects of the flower take this long to appear.: "three hours"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mid_1, clue_late_1, clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3, clue_4, clue_early_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): presence, poison, consumed, finch | mechanism, poisoning | mechanism, poisoning | assumption, natural, causes, false | finch, sudden, collapse, suspicious | presence, poison, consumed, finch | finch, sudden, collapse, suspicious
• Suspect cleared: Beatrice Quill[SHE] — Beatrice was serving the tea and had no access to the poison.
• Suspect cleared: Sylvia Trent[SHE] — Sylvia's conversation with Dr. Finch ruled out her involvement during the tea.
• Suspect cleared: Hugo Vane[HE] — Hugo's managerial responsibilities kept him from direct contact with the tea.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor closed her notebook, the pages filled with contradictions and half-truths. She would need to press harder, to unravel the tangled stories and expose the lie at their center. As she rose, she caught Captain Hale watching her, his expression unreadable...."
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
Known location profile anchors: The Seaside Retreat Hotel, The Tea Room, Hotel Lobby, Guest Rooms, Oceanfront Cliffs, the coastal hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Retreat Hotel", "The Tea Room", "Hotel Lobby", "Guest Rooms", "Oceanfront Cliffs", "the coastal hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the coastal hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Phrases to avoid (already overused in earlier chapters): "we knew how to handle such matters", "knew how to handle such matters he".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13456; context=7677; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | basic radar systems | long-distance telephone calls | military encryption methods | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to certain guest areas | oceanfront cliffs limiting escape routes | staff-only areas | guest room privacy regulations.
6. Sustain social coherence with this backdrop pressure: A gathering at a coastal hotel for a post-war reunion reveals deep-seated tensions among guests, exacerbated by the pressures of a changing society and the lingering shadows of conflict.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same crime method of poisoning and similar setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast size and character roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: behavioral

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Beatrice was serving the tea and had no access to the poison.
  Clues: serving records
- Sylvia Trent (Act 3, Scene 5): Sylvia's conversation with Dr. Finch ruled out her involvement during the tea.
  Clues: conversation testimony
- Hugo Vane (Act 3, Scene 5): Hugo's managerial responsibilities kept him from direct contact with the tea.
  Clues: staff testimony

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
Investigation state at start: 7 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
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
  - Scene is set in: the coastal hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor closed her notebook, the pages filled with contradictions and half-truths. She would need to press harder, to unravel the tangled stories and expose the lie at their center. As she rose, she caught Captain Hale w...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • captain, hale, statement, preparation [clue_5]
      Points to: captain, hale, potential, involvement, tampering
    • captain, hale, demeanor, around, finch [clue_7]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "during the tea party". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The victim was confirmed dead at this time., write exactly: "half past six".
  - If this batch mentions Witnesses last saw the victim alive at this time., write exactly: "half past five".
  - If this batch mentions The toxic effects of the flower take this long to appear., write exactly: "three hours".
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
Investigation state at start: 7 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: tea served at half past five
- Established timeline fact: Dr. Finch collapsed at six
- If referenced, use exact phrase: "half past six" (The victim was confirmed dead at this time.).
- If referenced, use exact phrase: "half past five" (Witnesses last saw the victim alive at this time.).
- If referenced, use exact phrase: "three hours" (The toxic effects of the flower take this long to appear.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Unsettled Tea Room
The faint clatter of porcelain echoed through the coastal hotel tea room as Eleanor Voss stepped inside, her shoes damp from the morning drizzle that still clung to the Brighton air. The room was suffused with a dim, overcast light, the heavy curtains filtering what little sun managed to pierce the spring clouds. The scent of Earl Grey, sharp and floral, mingled with the salt tang drifting in from the sea—a scent that seemed suddenly out of place against the hush that had settled over the assembled guests. At the center of it all, Dr. Mallory Finch lay sprawled beside the low table, her hand rigid around a delicate teacup, its contents pooled darkly on the pale linen. The hush was so complete that Eleanor could hear the distant crash of waves against the cliffs, a reminder that the world outside continued, oblivious to the abrupt stillness within.

Eleanor’s gaze swept the scene, her journalist’s instinct parsing details with clinical detachment even as her heart thudded in her chest. The teacup, still clutched by Dr. Mallory Finch, bore a faint residue along the rim—an odd, powdery trace, almost luminous in the muted light. On the saucer, a few petals from a rare, deep blue flower stood out, their presence incongruous amid the ordinary crumbs of scone and the neat arrangement of teaspoons. The room itself was undisturbed, save for the silent tableau of the guests: Captain Ivor Hale, his jaw set and arms folded; Beatrice Quill, pale and fidgeting with her apron; Sylvia Trent, spine ramrod straight, eyes fixed on the floor; and Hugo Vane, who lingered by the window, his silhouette tense against the grey sky.

It was the timing of Dr. Finch’s collapse that gnawed at Eleanor most. She recalled the gentle murmur of voices as tea was served at half past five, the laughter that had seemed genuine enough, and the sudden, inexplicable silence that followed Dr. Finch’s faint gasp. Yet the clock on the mantelpiece now read half past six, a full hour after the last time anyone could recall speaking with her. Eleanor’s mind snagged on the contradiction: how could Dr. Finch have gone unnoticed for so long, in a room full of attentive eyes and eager tongues? The discrepancy between the time of tea and the apparent time of death was too stark to ignore.

She knelt beside Dr. Finch, careful not to disturb the body or the teacup. The residue on the rim had a faint, bitter odor—nothing like the bergamot of the tea. Eleanor reached for a handkerchief, dabbing at the edge of the cup, and her fingers brushed against the petals. She recognized the flower: aconitum, monkshood, notorious not only for its beauty but for its deadly properties. The realization sent a chill through her, sharper than the spring breeze that rattled the windowpanes.

The implications were immediate and unsettling. If the residue was indeed from aconitum, the poison would have taken hours to show its effects—meaning Dr. Finch must have consumed it well before her collapse. Eleanor’s thoughts raced: someone had introduced the toxin during the tea service, knowing it would not act immediately. The guests’ alibis, the timing of their movements, even the order in which the cups had been poured—all would need to be examined with ruthless precision.

Captain Ivor Hale, the retired naval officer whose booming voice now seemed muted, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain as Eleanor’s eyes met his. "In my day, we knew how to handle such matters," he muttered, though his gaze flickered away, betraying a flash of uncertainty. Eleanor noted the defensiveness in his stance, the way he seemed to brace himself against an accusation that had not yet been spoken.

Beatrice Quill lingered near the sideboard, her hands twisting the hem of her apron as if she might wring the truth from the fabric itself. Her eyes darted between Eleanor and Captain Hale, and when she caught Eleanor’s gaze, she offered a brittle smile. "Oh, I’m just a nobody," she whispered, her voice barely more than a breath. Yet Eleanor saw the tremor in her fingers, the way she shrank from the circle of scrutiny. Beatrice’s presence at the tea service, her proximity to the cups and the pot, would place her at the heart of the investigation.

Sylvia Trent, ever the picture of composure, stood apart from the others, her gloved hands folded neatly over her handbag. "How quaint," she remarked, her tone brittle as glass. "One expects a little drama at these gatherings, but this is rather beyond the pale." Her gaze lingered on Dr. Finch’s body with a mixture of disdain and something sharper—resentment, perhaps, or fear. Eleanor marked the tension in Sylvia’s jaw, the way her eyes avoided the teacup, as if the sight of it might betray her own secrets.

Hugo Vane, the hotel’s manager, cut a striking figure in his tailored navy suit, though the effect was marred by the pallor beneath his tan. He leaned against the window frame, arms crossed, his attention fixed on the rain-streaked glass. "Isn’t that just the way?" he drawled, voice low. "A quiet spring morning, and suddenly we’re all suspects." There was a sardonic edge to his words, but Eleanor sensed the calculation behind them—Hugo was already weighing the odds, assessing who might be most vulnerable to suspicion.

Eleanor straightened, folding her handkerchief with deliberate care. The evidence was as fragile as the mood in the room: a teacup with a poisonous residue, a rare flower whose petals did not belong, and a timeline that refused to align with the memories of those present. She glanced at the clock again—half past six, yet the events of the afternoon seemed impossibly distant. "I’ll need to speak with each of you," she said, her voice steady despite the tremor in her hands. "Dr. Finch deserves the truth, and I intend to find it."

A low murmur rippled through the room, the guests shifting uneasily as the reality of the situation settled over them. The spring rain intensified, drumming against the windows in a relentless rhythm, as if urging Eleanor onward. She felt the weight of expectation pressing in—the responsibility to see justice done, to untangle the web of lies that had already begun to form. Yet beneath it all, she sensed something else: the first stirrings of relief, a perverse gratitude that the waiting was over and the investigation had begun.

The tea room, once a haven of warmth and conversation, now felt colder, the air charged with suspicion. Eleanor moved to the sideboard, inspecting the teapot and the remaining cups. Each bore the faintest trace of the same residue, though only Dr. Finch’s cup held the telltale petals. The clues were there, scattered like breadcrumbs, but the path they traced was far from clear. She would need to tread carefully, for every answer seemed only to raise further questions.

As the guests began to disperse under the watchful eye of a hotel attendant, Eleanor lingered by the window, her gaze drifting over the rain-lashed cliffs beyond. The sea was a churning grey, its restlessness echoing the turmoil within the tea room. She pressed her palm to the cold glass, letting the chill steady her thoughts. The truth was out there, hidden among the half-truths and polite evasions, waiting for someone to see what others had missed.

Eleanor turned back to the room, her eyes lingering on Dr. Finch’s still form. The teacup, the petals, the residue—each detail was a piece of the puzzle, and she would not rest until she had fitted them all together. The spring morning had begun with laughter and ended in silence, but Eleanor knew that silence was never empty. It was merely waiting to be broken.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Observations
"She seemed perfectly herself, not a hint of discomfort," Beatrice Quill murmured, her voice barely audible above the low hum of rain against the windowpanes. The coastal hotel tea room, still heavy with the scent of cold Earl Grey and the faint bitterness of something less innocent, felt suspended between the grey morning and the events of the night before. Eleanor Voss stood at the edge of the table where Dr. Mallory Finch’s body had been, the linen still creased from the weight of the fallen cup. The air was thick with whispers, the dampness of spring clinging to every surface, and the shadows cast by the overcast sky seemed to pool beneath the chairs. Beatrice’s hands twisted the hem of her apron, her eyes darting from Eleanor to the others as if searching for an anchor.

Eleanor glanced at the others, her mind cataloguing the details. Dr. Finch had shown no outward signs of distress—no pallor, no clutching at her chest, not even a tremor in her voice—until the very moment she collapsed. The witnesses were united on this point: Dr. Finch was last seen alive at half past five, engaged in lively conversation, her laughter carrying over the clinking of porcelain. Yet the clock now read half past six when her death was confirmed. The contradiction gnawed at Eleanor. If the poison had been administered during the tea, why had no symptoms appeared until the hour had turned? The timeline was too neat, the gap too wide to be dismissed as mere oversight.

The residue on Dr. Finch’s cup, the strange blue petals, and the faint bitter tang that lingered in the air all pointed to something deliberate—a rare flower, its poison slow to reveal itself, brewed with care to mask its presence. Eleanor’s heart beat faster as she traced the sequence in her mind: tea served at half past five, Dr. Finch animated and well, then a sudden, fatal collapse an hour later. The poison’s effects, she recalled, would take hours to manifest, not minutes. Was it possible the toxin had been introduced earlier, or had someone tampered with the service in a way no one had yet noticed? The evidence refused to fit any comfortable narrative.

Captain Ivor Hale’s voice cut through the tension, his tone gruff but oddly hesitant. "I assure you, Miss Voss, the staff handled the tea. I merely poured a cup or two—nothing more." His hands, broad and steady, rested atop the back of a chair, yet his knuckles whitened as he spoke. The rain outside intensified, a steady percussion that underscored the unease in the room. Eleanor watched him closely, noting the way his gaze flicked to Beatrice before settling on the window. "In my day, we knew how to handle such matters!" he added, though the bravado rang hollow.

Beatrice’s response was immediate, a tremulous shake of her head. "No, sir, it was I who brought the tray from the kitchen. Dr. Finch poured her own tea, I’m certain of it. She asked for an extra spoon of sugar—she always did." Her words tumbled out in a rush, as if the truth might shield her from suspicion. Eleanor caught the tremor in her voice, the way she clutched at her apron as if it might anchor her to the present. The contradiction was stark: Captain Hale claimed the staff prepared and served the tea, while Beatrice insisted Dr. Finch had taken charge of her own cup. The pivot point of the investigation had revealed itself—who, precisely, had handled the tea that killed Dr. Finch?

Sylvia Trent, standing apart from the others, regarded the scene with a practiced detachment. Her gloved fingers traced the rim of her handbag, her eyes sharp beneath the brim of her hat. "How quaint," she said, her words laced with a brittle irony. "We seem to have misplaced a servant, or perhaps a memory. I recall Dr. Finch complimenting the blend, but nothing more. If you expect me to remember who poured which cup, you’ll be disappointed." The disdain in her voice was matched only by the precision of her posture—a woman accustomed to control, now forced to cede ground to chaos.

Hugo Vane, ever the picture of managerial composure, leaned against the window frame, his silhouette outlined by the pale morning light. "Isn’t that just the way?" he drawled, voice low and sardonic. "A quiet spring morning, and suddenly every gesture is suspect. For what it’s worth, I was overseeing the kitchen accounts. I didn’t so much as touch a teapot." He offered Eleanor a tight smile, but his eyes flicked to the table, lingering on the empty seat where Dr. Finch had sat. The calculation in his gaze was unmistakable—Hugo was already measuring the risk, the likelihood that suspicion might drift his way.

The conflicting statements tangled in Eleanor’s mind, each version of events casting doubt on the others. The absence of distress in Dr. Finch until her collapse, the uncertain chain of custody for the tea, the missing corroboration from any staff beyond Beatrice—each detail pressed against the others, refusing to settle into a single, reliable narrative. Eleanor’s heart raced as she considered the implications: if the poison took hours to act, then the moment of collapse was not the moment of murder. The killer had relied on patience, on the slow unfolding of symptoms, and on the confusion that would follow.

A brief silence settled over the tea room, broken only by the rhythmic patter of rain and the distant crash of waves against the cliffs. Eleanor let her gaze drift from face to face—Captain Hale’s forced bravado, Beatrice’s anxious defensiveness, Sylvia’s brittle composure, Hugo’s careful detachment. Each wore their secrets differently, but all were united by a single, inescapable fact: the story of the tea service was fractured, and somewhere in those fractures lay the truth.

Eleanor drew a slow breath, letting the chill of the morning steady her thoughts. She would need to press harder, to unravel the web of half-truths and misremembered details. The evidence—the residue, the petals, the timeline—was as fragile as the trust between the guests. But one thing was clear: the story of Dr. Finch’s final hour was not as simple as it seemed. The contradictions had surfaced, and with them, the first real glimmer of suspicion.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Witness Statements
That morning, the coastal hotel tea room was thick with the scent of cold tea and the lingering bitterness of last night’s tragedy. The pale spring light filtered through rain-streaked windows, casting a chill over the assembled guests. Eleanor Voss’s fingers trembled slightly as she uncapped her fountain pen, the scratch of its nib on notepaper loud in the hush. She began with the most immediate evidence: the recollections of those present. Captain Ivor Hale, his double-breasted suit immaculate despite the hour, cleared his throat. “Dr. Finch was in fine spirits—laughing, talking about her latest article—right up until the moment she… well, until she wasn’t.”

Eleanor’s gaze moved from one face to the next, searching for cracks in their stories. Beatrice Quill, standing by the sideboard, nodded, her voice barely above a whisper. “She was telling us about her travels, how she’d seen the spring tulips in Holland. There was nothing at all odd, not until she dropped her cup.” Sylvia Trent, gloved hands folded, added with a brittle smile, “If anything, she was more animated than usual. I remember thinking she’d finally shaken off those dreadful headaches she always complained about.” The memory of Dr. Finch’s laughter, so close to the moment of her collapse, gnawed at Eleanor. If the poison had been at work, it had left no outward mark until it was too late.

The implication was chilling: Dr. Finch had shown no sign of distress before her sudden collapse. The witnesses agreed—she was lively, even exuberant, until the moment she slumped forward. Eleanor jotted a note: suddenness suggests deliberate timing. The absence of symptoms until the fatal moment narrowed the window for when the poison could have taken effect. If Dr. Finch had been poisoned, it must have been administered during the tea service, with a substance designed to act slowly and invisibly.

Turning her attention to the table, Eleanor leaned in, the cold air prickling her skin as she examined the remains of the tea set. The cups and saucers, still arranged in their neat circle, bore faint streaks of powder along their rims. On Dr. Finch’s saucer, the blue petals from the previous day’s discovery remained vivid against the white porcelain. Eleanor lifted the teapot, careful not to disturb the arrangement, and inhaled. Beneath the fading scent of bergamot, there was a bitter, metallic tang that caught in her throat.

She dabbed a handkerchief along the rim of Dr. Finch’s cup, watching as a fine dust—almost luminous—clung to the fabric. She recognized the telltale signs: residue from monkshood, the rare flower whose poison was both subtle and deadly. The presence of the blue petals, so out of place among the ordinary crumbs and sugar grains, confirmed her suspicion. The tea set had not merely been a vessel for hospitality; it was the instrument of murder.

Eleanor’s mind raced. The residue proved that Dr. Finch had ingested poison, likely during the tea service. But who had placed it there, and how? The guests’ accounts were too consistent, almost rehearsed. If the toxin was introduced during the pouring of tea, any one of them could have been responsible. Yet the presence of the rare flower’s residue suggested knowledge and intent—someone had planned this, counting on the slow action of the poison to mask their involvement.

A flicker of movement drew Eleanor’s attention to Hugo Vane, who stood by the window, his silhouette outlined by the grey spring morning. “I was in the kitchen, going over the accounts,” he said, his tone smooth but his eyes wary. “Didn’t so much as touch a teapot. You can ask the staff.” Eleanor noted the quickness of his denial, the way he distanced himself from the scene. Beatrice, meanwhile, twisted her apron, her voice faltering as she insisted, “I only brought the tray. Dr. Finch poured her own tea. She always did, especially when her hands weren’t trembling.”

Sylvia’s gaze sharpened. “She was always fussing over her health,” she said, her sarcasm edged with something darker. “If you ask me, it was only a matter of time before her ailments caught up with her.” The remark hung in the air, a red herring that threatened to draw attention from the evidence at hand. Yet Eleanor could not dismiss the possibility that Dr. Finch’s well-known health complaints might have provided the perfect cover for a more sinister cause.

Captain Ivor Hale shifted, the chain of his pocket watch glinting as he adjusted his waistcoat. “In my day, we knew how to handle such matters!” he declared, but the bravado sounded forced. “I poured a cup for Dr. Finch, yes, but so did others. It was a communal affair.” His gaze flickered to Beatrice, then to Sylvia, as if daring them to contradict him. The tension in the room was palpable, each guest subtly maneuvering to shield themselves from suspicion.

Eleanor pressed harder, her questions probing for inconsistencies. “Who handled the sugar? Did anyone see Dr. Finch add it herself?” Beatrice hesitated, glancing at Captain Hale before answering. “She asked me to pass the bowl, but she spooned it in herself. I remember because she always tapped the spoon twice against the rim—said it was for luck.” The detail struck Eleanor as both trivial and telling; in a room where every gesture was now suspect, even a superstition could become a clue.

As the morning wore on, the atmosphere in the tea room grew heavier, the sound of rain against the windows a constant reminder of the world outside. Eleanor’s fingers cramped from writing, but she pressed on, cataloguing every detail, every hesitation. She noted how Hugo Vane’s confidence faltered when pressed about his whereabouts, how Beatrice’s eyes filled with tears when she described Dr. Finch’s kindness, and how Sylvia’s composure cracked, just for a moment, when Eleanor mentioned the rare flower.

A sudden silence fell as Eleanor lifted the teapot once more, tilting it to catch the light. There, along the spout, was a smear of blue—barely visible, but unmistakable. She dabbed it with her handkerchief, confirming her suspicion: the residue was not confined to Dr. Finch’s cup. It had touched the entire service. The implications were clear: the presence of the rare flower’s residue was not limited to a single vessel.

Eleanor’s mind returned to the timeline. Tea was served at half past five; Dr. Finch was lively, engaging, until her sudden collapse an hour later. The poison, she knew, would take hours to show its effects. The contradiction gnawed at her: how could the symptoms appear so suddenly, if the toxin required time to work? Was there a detail she was missing—a manipulation of the service, an overlooked gesture, a lie buried in the routine of hospitality?

She glanced at the guests, each now caught in their own web of anxiety. Captain Hale’s bravado had given way to a wary silence; Beatrice’s hands trembled as she poured herself a glass of water; Sylvia’s sarcasm had sharpened, her words brittle as glass. Hugo Vane, watching from the window, seemed to shrink into himself, calculating the odds of exposure. The façade of civility was cracking, and beneath it, Eleanor glimpsed the raw nerves of guilt and fear.

A brief moment of relief intruded as the rain slackened, sunlight glimmering on the wet glass. For an instant, the room felt almost normal, the clink of porcelain and the murmur of voices recalling happier mornings. But the illusion faded quickly, replaced by the cold certainty that one among them had orchestrated Dr. Finch’s death. The residue, the petals, the timeline—all pointed to a deliberate act, hidden beneath the rituals of springtime hospitality.

Eleanor closed her notebook, the pages filled with contradictions and half-truths. She would need to press harder, to unravel the tangled stories and expose the lie at their center. As she rose, she caught Captain Hale watching her, his expression unreadable. The investigation had only begun, but already the cost was mounting—trust eroded, friendships tested, and the shadow of murder stretching long across the spring morning.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's jealous outburst during questioning"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale harbored jealousy towards Dr. Finch, suggesting a motive."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Some guests mention feeling unwell after the tea service — suggesting a broader issue.

# Case Overview
Title: Death in the Tea Room
Era: 1940s
Setting: Coastal Hotel
Crime: murder (poisoning)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Finch died from natural causes due to her known health issues.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Coastal Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Coastal Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Uncovering Motives",
    "setting": {
      "location": "the coastal hotel dining room",
      "timeOfDay": "Afternoon",
      "atmosphere": "Somber and tense, filled with lingering questions"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Explore motives of the suspects and establish suspicion",
    "cluesRevealed": [
      "clue_5",
      "clue_7"
    ],
    "dramaticElements": {
      "conflict": "Suspects react defensively when questioned about their motives",
      "tension": "Eleanor feels the pressure mounting as she digs deeper",
      "microMomentBeats": [
        "Eleanor's heart races as she senses the jealousy in Captain Hale's gaze."
      ]
    },
    "summary": "Eleanor confronts the suspects about their potential motives for wanting to harm Dr. Finch. Captain Hale's jealousy surfaces as he reveals his disdain for Finch's influence. Beatrice, who had been close to Finch, expresses her shock, while Sylvia's unease hints at a deeper rivalry. Eleanor notes the brewing tensions, realizing that everyone had something to gain from Finch's demise.",
    "beat": "motives",
    "estimatedWordCount": 1250,
    "pivotElement": "Captain Hale's jealous outburst during questioning",
    "factEstablished": "Establishes that Captain Hale harbored jealousy towards Dr. Finch, suggesting a motive.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Exhibit signs of jealousy towards Dr. Finch."
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
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Some guests mention feeling unwell after the tea service — suggesting a broader issue."
    },
    "emotionalRegister": "Eleanor uncovers a connection between Hale and the victim, shifting the investigation's focus.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a keen edge, often peppering her observations with a sardonic undertone."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Travel is limited due to fuel rationing and public transport shortages.; Communication is slow, relying heavily on letters and landline telephones.; Many goods are still rationed, affecting daily life and social gatherings.",
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
