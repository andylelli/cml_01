# Actual Prompt Record

- Run ID: `run_f90e5f09-fc85-42df-ac3f-0b2046c0c3e1`
- Project ID: `proj_8c4c19d0-23d6-4802-8d0c-6786100ca9b3`
- Timestamp: `2026-07-13T18:40:51.978Z`
- Agent: `Agent9-ProseGenerator-Ch10`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `08463d943268f2cd`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Inspector Evelyn Harcourt[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Inspector Evelyn Harcourt. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Evelyn Harcourt (woman), Lady Beatrice Wentworth (woman) — DECEASED, past-tense only, Charles Wentworth (man), Margot Sinclair (woman), Robert Hensley (man), Vivian Clarke (woman), James Porter (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Evelyn Harcourt, Lady Beatrice Wentworth, Charles Wentworth, Margot Sinclair, Robert Hensley, Vivian Clarke, James Porter?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit engineered the trap to avoid direct confrontation, yet their cold calculation indirectly caused a fatal delay, blurring lines between accident and intent." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- ⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud), but the established setting is "Chilly and damp typical of an English autumn, with intermittent fog reducing visibility outdoors · Early evening, just after sunset, when natural light fades and household lamps are lit" (note "fog"). At the clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in the prevailing conditions (e.g. "a brief clearing in the fog") — so the mechanism can operate WITHOUT contradicting the established weather. Do not silently ignore the fog, and do not present the mechanism as if the conditions were always favourable.
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Lady Beatrice Wentworth is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Lady Beatrice Wentworth is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Lady Beatrice Wentworth said, "…"` / `Lady Beatrice Wentworth turned to him`. RIGHT: `Lady Beatrice Wentworth had said, weeks before, that…` / `Agnes remembered how Lady Beatrice Wentworth used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Lady Beatrice Wentworth beside an action or speech verb. A live dialogue tag or present action for Lady Beatrice Wentworth is a continuity failure that will be rejected and regenerated.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Evelyn Harcourt, Lady Beatrice Wentworth (DECEASED), Charles Wentworth, Margot Sinclair, Robert Hensley, Vivian Clarke, James Porter
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Evelyn Harcourt: Police Detective / Inspector
   - Lady Beatrice Wentworth: victim (DECEASED — does not appear in any scene, past tense only)
   - Charles Wentworth: Social Climber
   - Margot Sinclair: Confidante with Hidden Loyalties
   - Robert Hensley: Resentful Servant
   - Vivian Clarke: Ambitious Socialite
   - James Porter: Loyal Employee with Secret Past
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
- False assumption in force: The garden gate was opened at noon as all household members and guests saw Lady Beatrice entering the grounds then.
- Hidden truth to progressively expose (compose in your own words from these elements): conceals, physical, fact, brass, latch, bolt, unlatch, before, thermal, expansion, making, noon
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: brass, latch, bolt, garden, gate, shows, thermal, stress, lines, soot, discoloration, consistent | corr: latch, must, heated, temperature, sufficient, cause, thermal, expansion, indicating, bolt, released, before | effect: narrows, possible, gate, opening, time, eliminating, noon, entry, claim
  - Step 2: obs: multiple, household, servants, independently, recall, seeing, lady, beatrice, hall, early, evening, exhibit | corr: servants, memories, formed, false, consensus, social, reinforcement, masking, victim, actual, earlier, death | effect: eliminates, early, evening, timeline, indicating, cognitive, bias, testimony
  - Step 3: obs: james, porter, possesses, unique, technical, knowledge, garden, gate, brass, latch, thermal, behavior | corr: james, porter, means, opportunity, exploit, latch, delayed, release, stage, murder, timeline | effect: narrows, suspect, pool, james, porter
  - Step 4: obs: victim, body, struck, heavy, detached, brass, bolt, garden, gate | corr: murder, weapon, directly, linked, garden, gate, mechanism, confirming, occurred, bolt, released, post | effect: time, death, cannot, earlier, latch, release, eliminating, timelines
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): demonstrate, temperature, simulation, gate, latch, observation, garden, bolt, cannot, released, before, contradicting
- Test must rely on already-shown clue IDs: clue_12, clue_13, clue_5
- Fair-play rationale: Step 1: Physical evidence of the garden gate’s brass latch thermal stress and thermometer readings (early) establish the gate’s opening time window. Step 2: Servants’ inconsistent testimonies about the victim’s whereabouts (mid) reveal cognitive bias and false memory. Step 3: James Porter’s unique technical knowledge and proximity to the gate (mid) narrow the suspect pool. Step 4: The victim’s wound and use of the detached brass bolt (late) confirm timing and weapon. The discriminating test synthesizes these clues to prove the physical impossibility of the assumed timeline, enabling the reader to deduce the culprit fairly.

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Exact time when the brass bolt latch releases due to thermal expansion: "forty-five minutes past one in the afternoon"
  - Temperature at which the latch begins significant thermal expansion: "seventy-eight degrees Fahrenheit"
  - Distance from the manor’s main door to the garden gate, relevant to travel time: "twenty-five yards"
  - Solar elevation angle at true noon on the day of the murder: "seventy degrees"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "seventy-eight degrees Fahrenheit" and "seventy degrees" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_late_optional_slot_1] witnesses, lady, beatrice, near, garden, gate, noon, remains, late, texture, detail, case
  Category: temporal | Criticality: optional | Supports inference step 4
  Points to: adds, late, texture, changing, essential, deduction, chain

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Exact time when the brass bolt latch releases due to thermal expansion: "forty-five minutes past one in the afternoon"
  • Temperature at which the latch begins significant thermal expansion: "seventy-eight degrees Fahrenheit"
  • Distance from the manor’s main door to the garden gate, relevant to travel time: "twenty-five yards"
  • Solar elevation angle at true noon on the day of the murder: "seventy degrees"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Evelyn Harcourt: she/her/her
  • Lady Beatrice Wentworth: she/her/her
  • Charles Wentworth: he/him/his
  • Margot Sinclair: she/her/her
  • Robert Hensley: he/him/his
  • Vivian Clarke: she/her/her
  • James Porter: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_3, clue_4, clue_11, clue_5, clue_6, clue_7, clue_8, clue_16, clue_17, clue_18, clue_12, clue_13, clue_14, clue_15, clue_culprit_direct_james_porter — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): brass, latch, bolt, garden, gate, heated | garden, gate, brass, bolt, latch, delays | latch, must, heated, temperature, sufficient, cause | multiple, household, servants, independently, recall, seeing | servants, memories, formed, false, consensus, social | victim, struck, heavy, brass, garden, gate | james, porter, possesses, unique, technical, knowledge | james, porter, means, opportunity, exploit, latch | victim, body, struck, heavy, detached, brass | murder, weapon, directly, linked, garden, gate | eliminates, charles, wentworth, because, alibi, corroborated | eliminates, margot, sinclair, because, servants, confirm | eliminates, robert, hensley, because, stable, records | demonstrates, temperature, simulation, garden, gate, brass | james, porter, uniquely, prepared, garden, gate | james, porter, uniquely, means, skill, access | james, porter, showed, observable, premeditation, planning | direct, shows, james, porter, means, opportunity
• Suspect cleared: Charles Wentworth[HE] — Verified study alibi with servant testimony and lack of physical evidence
• Suspect cleared: Margot Sinclair[SHE] — Explanation of nervousness as unrelated blackmail fear, no access to gate mechanism
• Suspect cleared: Robert Hensley[HE] — Stable footprint explanation and alibi verification
• Suspect cleared: Vivian Clarke[SHE] — Confirmed serving dinner alibi and lack of motive or access
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (resolution): Confession or arrest, culprit states motive explicitly, method explained, consequences stated

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The firelight flickered across the faces of those left behind, deepening the colors of the stained glass and casting long shadows up the paneled walls. The cost of the truth was plain in every bowed head and trembling hand. Evelyn lingered by the hearth, her g..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Lady Beatrice Wentworth: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Lady Beatrice Wentworth crossed the room" / "Lady Beatrice Wentworth sat on the sofa" / "Lady Beatrice Wentworth nodded"
  - WRONG: "Lady Beatrice Wentworth gave testimony" / "Lady Beatrice Wentworth asked what had happened"
  - CORRECT: "Lady Beatrice Wentworth had often said..." / "Lady Beatrice Wentworth's effects were found" / "witnesses recalled Lady Beatrice Wentworth's habit of..."

⛔ IDENTITY STABILITY — post-reveal zone:
If the culprit has been arrested or confessed in any prior chapter, NEVER use role aliases in narrative prose:
  FORBIDDEN (narrator voice): "the killer", "the murderer", "the culprit", "the criminal", "the guilty party"
  REQUIRED: use the character's actual name (first name or full name) every time.
  Exception: a character's spoken dialogue may contain these terms — the ban applies to narrator voice only.
═══════════════════════════════════════════════════════

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Wentworth Manor, Garden Sundial, Wentworth Manor Library, Servants' Hall, Main Entrance Hall, Garden gate and manor hall
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Wentworth Manor", "Garden Sundial", "Wentworth Manor Library", "Servants' Hall", "Main Entrance Hall", "Garden gate and manor hall"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 10: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "Garden gate and manor hall". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 7 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 8 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "forty five minutes past one in the", "five minutes past one in the afternoon", "but the edge of anxiety was unmistakable", "let the silence stretch the only sound", "the silence stretch the only sound the".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Evelyn Harcourt: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Lady Beatrice Wentworth: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Wentworth: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margot Sinclair: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Robert Hensley: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Vivian Clarke: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • James Porter: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Inspector watched Wentworth; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Inspector watched Wentworth; Wentwor
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=28413; context=4814; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document, character_personality, physical_plausibility, era_authenticity, temporal_context, craft_guide]; truncated=[location_profiles, temporal_context, continuity_context, pronoun_accuracy]

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
- Chapter numbering starts at 10 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio receivers common in main living rooms | domestic telephones connected via party-line exchanges | manual typewriters standard for correspondence and record-keeping | telephone communication limited by party-line privacy concerns | telegrams used for urgent messages, routed through nearest town office | postal mail standard for non-urgent correspondence, subject to delays.
5. Respect setting movement/access constraints in scene action and alibis: estate gates locked and monitored, limiting visitor access | interior divided into family, guest, and servant areas with restricted entry | estate grounds include natural barriers such as wooded patches and a small lake | weather conditions (typical English dampness) affect outdoor movement and evidence preservation | main entrance guarded or locked outside visiting hours.
6. Sustain social coherence with this backdrop pressure: Amidst the economic strains of the Great Depression, the aristocratic Wentworth family, their guests, and loyal staff are confined within the isolated manor where rigid class distinctions and strict social protocols heighten tensions under the watchful eye of Inspector Harcourt.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Evelyn Harcourt, Lady Beatrice Wentworth, Charles Wentworth, Margot Sinclair, Robert Hensley, Vivian Clarke.
8. RETRY MITIGATION: Refresh texture usage. Rephrase observations with different lexical framing while preserving all clue obligations and chronology.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the gate latch temperature simulation to prove time constraint, Discuss servants’ memory inconsistencies and timeline contradictions, Highlight James Porter’s unique knowledge and proximity, Conclude with logical elimination of all suspects except Porter
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Charles Wentworth (Act 3, Scene 5): Verified study alibi with servant testimony and lack of physical evidence
  Clues: Witness statement of Charles in study, No physical evidence linking Charles to garden gate
- Margot Sinclair (Act 3, Scene 5): Explanation of nervousness as unrelated blackmail fear, no access to gate mechanism
  Clues: Margot’s testimony, Lack of opportunity for gate manipulation
- Robert Hensley (Act 3, Scene 5): Stable footprint explanation and alibi verification
  Clues: Stable hand note on watering, Mud drying pattern evidence
- Vivian Clarke (Act 3, Scene 5): Confirmed serving dinner alibi and lack of motive or access
  Clues: Dinner serving schedule, No technical knowledge

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with physical evidence of thermal delay, servants’ false memories, and James Porter’s unique expertise

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Aftermath Consequence.
Mode required outcomes:
- Show emotional fallout and changed order.
- Close consequence arcs for surviving characters.
Forbidden at this stage:
- Do not introduce decisive new mystery evidence.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Emotional Fallout: 45-55%
- Social Reordering: 35-45%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 10-10.
Investigation state at start: 18 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Show emotional/social consequences without introducing decisive new evidence.
Suspect pressure target(s): James Porter, Charles Wentworth, Margot Sinclair, Robert Hensley, Vivian Clarke
Required new information: Consequence on relationships/order after truth.
Forbidden reveals at this stage: Do not introduce decisive new mystery evidence.

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
- Chapter 10:
  - STRUCTURAL ARCHETYPE — Chapter 10 must be: RESOLUTION
      ✓ MUST contain: confession or arrest, method explained
      ✗ MUST NOT contain: unresolved loose ends
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Garden gate and manor hall — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The firelight flickered across the faces of those left behind, deepening the colors of the stained glass and casting long shadows up the paneled walls. The cost of the truth was plain in every bowed head and trembling ha...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, lady, beatrice, near, garden, gate, noon, remains, late, texture, detail, case [clue_late_optional_slot_1]
      Points to: adds, late, texture, changing, essential, deduction, chain
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ⚠ SUSPECT CLEARANCE REQUIRED (MANDATORY): each suspect below MUST be named explicitly and cleared with on-page evidence and a reasoning connector (because / therefore / which proves):
    • "Charles Wentworth": write a dedicated paragraph that (a) names Charles Wentworth explicitly, (b) states the clearance method ("Verified study alibi with servant testimony and lack of physical evidence"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Witness statement of Charles in study, No physical evidence linking Charles to garden gate.
    • "Margot Sinclair": write a dedicated paragraph that (a) names Margot Sinclair explicitly, (b) states the clearance method ("Explanation of nervousness as unrelated blackmail fear, no access to gate mechanism"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Margot’s testimony, Lack of opportunity for gate manipulation.
    • "Robert Hensley": write a dedicated paragraph that (a) names Robert Hensley explicitly, (b) states the clearance method ("Stable footprint explanation and alibi verification"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Stable hand note on watering, Mud drying pattern evidence.
    • "Vivian Clarke": write a dedicated paragraph that (a) names Vivian Clarke explicitly, (b) states the clearance method ("Confirmed serving dinner alibi and lack of motive or access"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Dinner serving schedule, No technical knowledge.
  - ALIBI LOCK: James Porter's established alibi is "Claims to have been in kitchen from noon to two pm". Do NOT place James Porter at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: James Porter has already made statements in earlier chapters. Any time, location, or claim attributed to James Porter in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - ⚠ CULPRIT REVELATION REQUIRED (Confrontation with physical evidence of thermal delay, servants’ false memories, and James Porter’s unique expertise): this chapter MUST name "James Porter" explicitly as the murderer before the chapter ends. Include a complete evidence chain using "because / therefore / which proves" for each piece of proof. Do not let the chapter end with the culprit unnamed or the verdict ambiguous.
  - Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive in this chapter. Canonical motive: "Protecting family reputation". Do not paraphrase or omit it.
  - ⚠ EVIDENCE CHAIN REQUIRED: before or during the confession the detective must summarise the evidence chain — stating at minimum: (a) the mechanism of death, (b) how the culprit accessed the victim, (c) the motive, and (d) why all other suspects are excluded.
  - ⚠ KILL STATEMENT REQUIRED: the culprit must use or strongly imply a specific act verb — "I killed", "I poisoned", "I struck", "I administered" — within 3 sentences of naming the victim. Passive constructions ("the death occurred", "she was found") are NOT sufficient. The culprit's agency must be explicit.
  - ⚠ PRONOUN RESOLUTION: any pronoun in the confession that refers to a third party ("protect him", "because of her") must be resolved by naming the character in the same sentence.
  - ⚠ RESOLUTION EVENT REQUIRED: this chapter must contain a concrete resolution beat — the culprit CONFESSES, is ARRESTED/taken into custody, or the detective explicitly names them as the murderer with the evidence. A reflective summary is NOT a resolution event.
  - ⚠ CLOSE IN-SCENE (final paragraph): end the chapter INSIDE the scene — on a line of dialogue, a physical action, or a sensation. Do NOT end on a narrator's summary verdict ("the case was closed", "justice had been served", "X was responsible"). The last sentence should be something a character does, says, or feels in the moment.
- Locked fact phrase obligations:
  - If this batch mentions Exact time when the brass bolt latch releases due to thermal expansion, write exactly: "forty-five minutes past one in the afternoon".
  - If this batch mentions Temperature at which the latch begins significant thermal expansion, write exactly: "seventy-eight degrees Fahrenheit".
  - If this batch mentions Distance from the manor’s main door to the garden gate, relevant to travel time, write exactly: "twenty-five yards".
  - If this batch mentions Solar elevation angle at true noon on the day of the murder, write exactly: "seventy degrees".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ MANDATORY RESOLUTION — THIS IS THE FINAL CHAPTER:
  Five events MUST appear as on-page prose (not offstage summary):
  1. ACCUSATION: The detective names James Porter and states the charge.
  2. CULPRIT RESPONSE: James Porter confesses with detail, or reacts in a way that confirms guilt.
  3. METHOD: State BOTH how the victim was killed (name the manner of death — e.g. the stab wound, the poison, the blow) AND how the scene/timeline was manipulated (compose in your own words from these elements, do NOT quote them verbatim: garden, gate, brass, bolt, latch, delays, release, until, afternoon, heat, causes, sufficient). Naming only the concealment is a failure.
  4. CONSEQUENCE: What happens to James Porter (arrested, fled, taken into custody).
  5. AFTERMATH: At least one other character reacts emotionally to the truth.
  A chapter submitted without all five will be rejected and regenerated.
  6. SUSPECT CLEARANCES (MANDATORY — lint-enforced): every non-culprit suspect below MUST be named explicitly and cleared in a dedicated paragraph in THIS chapter:
    • "Inspector Evelyn Harcourt" — include a paragraph that: (a) names "Inspector Evelyn Harcourt" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Write it as DEDUCTION the reader watches, NOT a verdict: show the alibi as a witnessed fact, then the conclusion — avoid the report frame "X was cleared because…". Example: "Two witnesses had placed Inspector Evelyn Harcourt elsewhere until well after it happened, which proves Inspector Evelyn Harcourt could not have been responsible." All three elements must be in the SAME paragraph — do not split across paragraphs.
    • "Charles Wentworth" — include a paragraph that: (a) names "Charles Wentworth" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Write it as DEDUCTION the reader watches, NOT a verdict: show the alibi as a witnessed fact, then the conclusion — avoid the report frame "X was cleared because…". Example: "Two witnesses had placed Charles Wentworth elsewhere until well after it happened, which proves Charles Wentworth could not have been responsible." All three elements must be in the SAME paragraph — do not split across paragraphs.
    • "Margot Sinclair" — include a paragraph that: (a) names "Margot Sinclair" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Write it as DEDUCTION the reader watches, NOT a verdict: show the alibi as a witnessed fact, then the conclusion — avoid the report frame "X was cleared because…". Example: "Two witnesses had placed Margot Sinclair elsewhere until well after it happened, which proves Margot Sinclair could not have been responsible." All three elements must be in the SAME paragraph — do not split across paragraphs.
    • "Robert Hensley" — include a paragraph that: (a) names "Robert Hensley" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Write it as DEDUCTION the reader watches, NOT a verdict: show the alibi as a witnessed fact, then the conclusion — avoid the report frame "X was cleared because…". Example: "Two witnesses had placed Robert Hensley elsewhere until well after it happened, which proves Robert Hensley could not have been responsible." All three elements must be in the SAME paragraph — do not split across paragraphs.
    • "Vivian Clarke" — include a paragraph that: (a) names "Vivian Clarke" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Write it as DEDUCTION the reader watches, NOT a verdict: show the alibi as a witnessed fact, then the conclusion — avoid the report frame "X was cleared because…". Example: "Two witnesses had placed Vivian Clarke elsewhere until well after it happened, which proves Vivian Clarke could not have been responsible." All three elements must be in the SAME paragraph — do not split across paragraphs.
  Items 1–6 are ALL mandatory. A chapter missing any item will be rejected and regenerated.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Evelyn Harcourt: she/her/her
    Lady Beatrice Wentworth: she/her/her
    Charles Wentworth: he/him/his
    Margot Sinclair: she/her/her
    Robert Hensley: he/him/his
    Vivian Clarke: she/her/her
    James Porter: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 10-10.
Investigation state at start: 18 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Show emotional/social consequences without introducing decisive new evidence.
Suspect pressure target(s): James Porter, Charles Wentworth, Margot Sinclair, Robert Hensley, Vivian Clarke
Required new information: Consequence on relationships/order after truth.
Forbidden reveals at this stage: Do not introduce decisive new mystery evidence.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Witnesses see Lady Beatrice near garden gate at noon
- Established timeline fact: Garden thermometer reads 78°F at last gate closure
- Established timeline fact: Thermal expansion of brass latch begins releasing bolt at 1:45 pm
- If referenced, use exact phrase: "forty-five minutes past one in the afternoon" (Exact time when the brass bolt latch releases due to thermal expansion).
- If referenced, use exact phrase: "seventy-eight degrees Fahrenheit" (Temperature at which the latch begins significant thermal expansion).
- If referenced, use exact phrase: "twenty-five yards" (Distance from the manor’s main door to the garden gate, relevant to travel time).
- If referenced, use exact phrase: "seventy degrees" (Solar elevation angle at true noon on the day of the murder).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Death at the Garden Gate
Inspector Evelyn Harcourt stepped briskly onto the rain-darkened gravel path, her boots sinking slightly into the damp earth as a low, persistent fog clung to the clipped hedges of the garden near the gate at Wentworth Manor. The cold bit through her wool coat, and the air was thick with the scent of wet moss and the faint tang of wood smoke drifting from the manor’s distant chimneys. Ahead, the rough stone pedestal of the Garden Sundial loomed pale in the midmorning haze, but it was the stillness beyond that drew her eye—a cluster of figures, their faces pinched with shock, gathered in uneasy silence around a body sprawled at the threshold of the gate.

Lady Beatrice Wentworth lay motionless, her silver hair fanned across the frost-glazed grass, the severe wound at her temple stark against the pallor of her skin. The hush was broken only by the soft drip of moisture from the yew branches overhead. Inspector Evelyn Harcourt’s gaze flicked immediately to the garden gate itself, where a brass latch bolt hung askew. Even in the dim winter light, she noted the telltale lines of stress etched along the metal’s surface, interrupted by streaks of soot and a faint, unnatural discoloration. The bolt appeared to have endured more than the usual wear of weather and time.

She crouched beside the gate, gloved fingers tracing the rough, cold brass. The latch mechanism, she observed, was not merely tarnished but bore the unmistakable signs of recent heating—fine hairline cracks, a subtle warping, and soot that had settled into the grooves. It was as if the bolt had been subjected to a temperature far beyond what a wintry English morning could provide. Inspector Evelyn Harcourt’s mind, trained to notice the unspoken language of objects, catalogued each detail: the stress lines, the soot, the odd way the latch seemed to resist movement, as though it had been forced to hold longer than nature intended.

Rising, Inspector Evelyn Harcourt swept her gaze over the assembled household. Charles Wentworth, Lady Beatrice’s nephew, stood stiffly apart, his sharply tailored overcoat buttoned to the throat, eyes darting between the body and the inspector with a mixture of impatience and something like dread. Margot Sinclair, her gloved hands folded tightly before her, wore an expression of brittle composure, yet her gaze lingered on Lady Beatrice with a sorrow that seemed edged with fear. Robert Hensley, the estate manager, hovered near the gate, his blunt features set in a mask of stoicism, but his jaw worked as if he were biting back words. Vivian Clarke, her cheeks blotched from the cold, pressed a handkerchief to her mouth, her eyes red-rimmed but dry. James Porter, the gardener, hung back in the shadow of the hedge, his cap in his hands and his face unreadable—calm, perhaps, or simply resigned.

The winter silence pressed in, broken only by the distant toll of church bells from Little Ashcombe and the muted clatter of a petrol-powered automobile idling at the manor’s drive. Inspector Evelyn Harcourt’s presence was now unmistakable; the gathered household shifted, attention drawn to her as the figure of authority. She straightened, her voice measured but carrying through the chill, 'No one is to leave the grounds. I will require statements from each of you.' The words, though formal, seemed to settle like a shroud over the group.

Her gaze returned to the garden gate. The brass bolt, she reasoned, should have remained engaged until the afternoon sun had warmed it sufficiently to cause expansion and release. Yet the visible evidence—the stress marks, the soot, the unnatural discoloration—suggested a disruption in this ordinary process. Inspector Evelyn Harcourt did not voice her suspicion, but the contradiction gnawed at her: the mechanism had delayed, or perhaps released, at a time inconsistent with the day’s feeble warmth. Something, or someone, had intervened.

Vivian Clarke’s composure faltered as she knelt beside Lady Beatrice, her hand trembling as she adjusted the hem of the dead woman’s coat. 'She was always so particular about her walks,' Vivian murmured, her voice barely audible beneath the fog-muffled air. 'She said the garden was the only place she could think.' The words hung, brittle and unfinished, as Inspector Evelyn Harcourt watched for the flicker of guilt or grief among the faces. Vivian’s tears, wiped quickly away, seemed genuine, but the inspector noted how her gaze never quite met Charles Wentworth’s.

Margot Sinclair’s voice, low and precise, cut through the tension. 'It’s a dreadful thing, Inspector, but surely an accident. The path is slippery, and Lady Beatrice was not steady on her feet.' Her words were measured, yet the inspector caught the way Margot’s eyes darted to the brass latch, then away, as if the sight unsettled her more than the body itself.

James Porter, when addressed, met Inspector Evelyn Harcourt’s scrutiny with a steady, almost deferential calm. 'I was in the kitchen, Miss, from noon to two, tending to the stove and the luncheon vegetables. I only came out when I heard the shouting.' His hands, rough and reddened by the cold, twisted his cap as he spoke, but his voice did not waver. Inspector Evelyn Harcourt marked the detail—Porter’s access to every corner of the estate and his habitual presence near the garden gate—yet found no overt sign of panic.

Robert Hensley’s reply, when it came, was flat and unvarnished. 'I checked the gate last evening, as always. It was secure then. If there’s fault, it’s with the weather or the metal, not the staff.' The estate manager’s gaze was fixed on the ground, but his posture radiated a defensive tension, as though he expected blame and resented it already.

Charles Wentworth, when pressed, offered a brittle, sardonic smile. 'I was in the study, Inspector, reviewing correspondence. My aunt had no shortage of opinions on the matter of estate finances, as I’m sure you’ll discover.' His tone was light, but the inspector registered the way his fingers drummed restlessly against his coat pocket—a man accustomed to control, now forced to wait.

Inspector Evelyn Harcourt moved methodically, cataloguing the scene. The moss on the sundial was undisturbed, but a faint smear of soot marred the stone near Lady Beatrice’s head. The air around the body was colder, the grass slick and flattened by more than one set of feet. She noted the absence of a handbag or walking stick, both items Lady Beatrice was seldom without on her morning walks. The inspector’s mind ticked through the possibilities, each detail a thread in a tapestry of contradiction.

A brief clearing in the fog allowed a shaft of pale daylight to strike the garden gate, illuminating the brass bolt with an almost theatrical clarity. Inspector Evelyn Harcourt squinted, noting how the light revealed the fine network of stress lines and the unnatural gleam of soot. It was a fleeting moment—within minutes, the mist thickened again, swallowing the garden in its wintry shroud. But the image remained: the mechanism was not as it should be.

She summoned James Porter once more, her tone deceptively casual. 'You’ve worked these grounds for years, haven’t you, Mr. Porter? Seen the gate through every season?' His nod was slow, his eyes steady. 'Aye, Miss. Brass is a fickle thing in winter. Holds tight in the cold, lets go when the sun’s high.' The words were simple, but Inspector Evelyn Harcourt detected a guardedness beneath the humility—a man careful to say only what was required.

Margot Sinclair lingered near the edge of the group, her gloved fingers worrying the clasp of her handbag. Inspector Evelyn Harcourt caught her eye, and Margot’s composure flickered. 'Lady Beatrice was… not herself, these past weeks. The news from London, the estate’s troubles—she carried it all.' The confession was offered with a tremor, but the inspector wondered whether Margot’s anxiety was for the dead or for herself.

Vivian Clarke, having recovered her poise, straightened and addressed Inspector Evelyn Harcourt with a clipped efficiency. 'You’ll want to speak with everyone, I suppose. But you won’t find much. Lady Beatrice kept her secrets.' Her tone was brisk, but her hands betrayed her, twisting the sodden handkerchief until the fabric threatened to tear.

Robert Hensley’s bluntness returned as he gestured to the garden gate. 'If you ask me, Inspector, the latch was never right. Too clever by half—always sticking when you least expect.' His words carried a note of old grievance, but Inspector Evelyn Harcourt noted that he did not approach the mechanism itself, keeping a careful distance.

The winter day was already waning, the fog thickening as the household retreated toward the manor’s warmth. Inspector Evelyn Harcourt lingered, alone with the silence and the cold, her thoughts circling the contradictions at her feet: a body where none should be, a mechanism that defied the ordinary order of things, and a household whose grief was laced with secrets. She knew, with the certainty of experience, that the truth would not yield easily—not in a place where appearances mattered more than facts.

As she turned back toward the manor, the distant sound of a rotary telephone’s bell echoed faintly from within, a reminder of the world’s slow encroachment on the estate’s isolation. The investigation had begun, but already Inspector Evelyn Harcourt sensed that Wentworth Manor would resist her efforts at every turn. The garden gate, with its warped brass and sooted latch, had spoken its silent warning: nothing here would be as simple as it seemed.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradictory Evidence
"It’s colder than the devil’s own handshake out here," Charles Wentworth muttered, stamping his polished shoes against the gravel as the pale winter daylight faded further behind a curtain of thickening fog. The air near the Garden gate and nearby grounds clung damp and heavy, carrying the sharp scent of wet stone and the faint, metallic tang of brass. Inspector Evelyn Harcourt did not answer at once; she crouched beside the battered gate, her gloved hand tracing the rough, sooted surface of the latch. The silence was punctuated by the distant, muffled echo of the manor’s rotary telephone, a reminder that the world beyond Wentworth Manor pressed on, indifferent to the cold and the dead.

The brass latch caught what little light filtered through the mist, revealing a network of fine cracks and a peculiar warping along the bolt’s length. Evelyn’s gaze sharpened. The surface was marred not only by the expected tarnish but by streaks of soot and an unnatural, bluish discoloration—signs she recognized from her years observing the effects of heat on metal. She pressed her thumb against the latch, feeling the faint roughness where the metal had expanded and contracted, and noted how the bolt seemed to resist movement, as if it had been forced to endure something beyond the day’s chill. This was no ordinary winter weathering; the metal bore scars that spoke of a recent, intense heat that simply could not have occurred in the current wintry gloom.

Straightening, Evelyn let her breath plume in the cold air, her mind already racing ahead of the household’s recollections. The widely accepted belief that Lady Beatrice Wentworth had entered the garden at noon began to unravel. Brass, she knew, was stubborn in winter, and only yielded its grip when exposed to warmth far greater than the feeble sunlight or chill of the season. The warped, sooted latch before her was silent testimony: the mechanism could not have released until the metal reached a temperature—seventy-eight degrees Fahrenheit—never granted by the day. The evidence was not merely a detail to be weighed; it was a direct challenge to the narrative everyone else seemed to accept.

James Porter lingered at the edge of the path, cap in hand, his gaze fixed on the ground. Evelyn beckoned him with a tilt of her head. The gardener approached, boots crunching softly on the damp gravel. 'You know this gate better than anyone, Mr. Porter. Tell me—have you ever seen the latch behave like this?' Her tone was even, but her eyes did not leave his face. James’s fingers tightened around his cap. 'Brass holds tight in the cold, Miss. Only lets go when the sun’s been on it a good while. But this…' He hesitated, glancing at the sooted latch. 'I’ve not seen it like that. Not in winter.' His answer was careful, but the way his gaze darted to the latch, then away, betrayed a flicker of unease.

Evelyn watched him, weighing his words against the evidence at her fingertips. 'So it could not have opened at noon, as everyone claims?' The question hung in the air, heavier than the fog. James’s jaw worked. 'If you say so, Miss. I was in the kitchen from noon to two, tending to the stove and luncheon. Didn’t come out till the shouting started.' The alibi was delivered with practiced humility, but Evelyn noted the tremor in his voice—a man accustomed to the routine of obedience, now forced into the uneasy spotlight of suspicion.

Margot Sinclair, standing a few paces away, drew her fur collar tighter against the cold. Her eyes, rimmed with fatigue, flicked between Evelyn and James. 'Surely you’re not suggesting Lady Beatrice was kept out here, Inspector? She was seen at noon. We all saw her.' Her words were measured, but the edge of anxiety was unmistakable. Evelyn turned her attention to Margot, studying the lines of tension at the corners of her mouth. 'I am suggesting only that the physical evidence does not agree with the memory of the household. Sometimes, Miss Sinclair, what we believe we saw is less reliable than what the metal tells us.' Margot’s composure faltered, her gloved fingers twisting the clasp of her handbag. 'You think someone lied?' she whispered, more to herself than to Evelyn.

Charles Wentworth, impatient, stepped forward, his overcoat buttoned to the throat. 'Inspector, with respect, it’s a gate, not the Tower of London. The thing sticks, it always has. My aunt complained about it every week.' His tone was flippant, but Evelyn caught the way his gaze lingered on the sooted latch, a flash of calculation passing through his eyes. 'You have a theory, Mr. Wentworth?' she asked, voice deceptively mild. Charles shrugged, hands shoved deep in his pockets. 'I think we’re chasing shadows. If you want to know who had a quarrel with my aunt, you’ll need more than a stubborn bolt.' Yet his bravado rang hollow, and Evelyn sensed the defensive edge beneath the sarcasm.

A brief lull settled over the group, broken only by the distant toll of church bells and the soft drip of water from the yew branches overhead. Evelyn let the silence stretch, watching for the subtle tells—Margot’s anxious glances, James’s shifting weight, Charles’s restless hands. The garden, usually a place of order and routine, now felt fraught with secrets. The fog pressed closer, muting sound and blurring the edges of certainty.

Evelyn’s thoughts circled back to the evidence. The household’s consensus—witnesses see Lady Beatrice near garden gate at noon—was now undermined by the physical reality that the latch could not have released until it reached seventy-eight degrees Fahrenheit. The contradiction was no longer theoretical; it was etched in the warped brass and soot-stained bolt. She considered the implications: if the timeline was false, then every alibi built upon it was suspect. The mechanism of the crime had not yet revealed itself, but the first thread had been pulled.

She turned to Margot, her tone gentler. 'You were close to Lady Beatrice. Did she confide in you about any threats, any fears?' Margot’s reply was slow, her voice brittle. 'She worried for the estate, for Charles, for all of us. But she never spoke of danger. Not directly.' The admission was honest, yet Evelyn heard the hesitation—the careful omission of something unspoken. Margot’s loyalty, it seemed, was divided between the living and the dead.

James Porter lingered, his posture shrinking as the conversation shifted. Evelyn caught his eye. 'You’ve worked here longer than most. If someone wished to tamper with the gate, would you notice?' James’s answer was almost inaudible. 'I try to keep to my duties, Miss. Folk don’t always want the likes of me seeing too much.' The confession was wrapped in humility, but Evelyn recognized the fear beneath: a man who knew more than he dared admit.

Charles, unable to contain his impatience, broke the tension with a brittle laugh. 'If you’re quite finished interrogating the help, Inspector, perhaps we might all go inside before we freeze to death?' Evelyn’s mouth twitched in the faintest suggestion of a smile. 'In due course, Mr. Wentworth. The weather is not the only thing that resists cooperation.' The remark, dry and understated, drew a reluctant smirk from Charles but did little to ease the tension.

As the group began to drift toward the manor, Evelyn lingered by the gate, her thoughts racing. The evidence had shifted the ground beneath her feet: the physical reality of the latch’s thermal expansion, the impossibility of a noon release, the nervous evasions of those who claimed certainty. She knew now that the investigation would not proceed by the comfortable logic of routine statements. The truth, as always, would be found in the places where memory and mechanism collided.

The fog thickened, swallowing the garden in its wintry shroud. Evelyn watched the retreating figures, each carrying secrets as heavy as the damp air. In the silence that followed, she pressed her palm to the cold stone of the gate, grounding herself in the tactile certainty of evidence. Whatever story the household wished to tell, the brass and soot would speak their own language—and Evelyn was determined to listen.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Witness Accounts and False Consensus
By the time the grandfather clock in the Servants’ hall, Wentworth Manor, struck two, the air was thick with the scent of damp wool and the faint, lingering odor of coal smoke from the kitchen range. The glow of a single lamp cast long shadows across the scuffed floorboards, and the muffled sound of wind rattled the windowpanes, a reminder that the wintry fog still pressed against the manor’s walls. Inspector Evelyn Harcourt stood near the battered sideboard, her gloved hand resting on the cold edge, as she regarded the assembled staff with a gaze that brooked no evasion. Laid out on a folded sheet atop a nearby table, Lady Beatrice Wentworth’s effects—her gloves, a bloodied handkerchief, and the heavy brass bolt—were grim reminders of the morning’s violence. The memory of the wound at Lady Beatrice’s temple, jagged and swollen, haunted the room: a brutal, unmistakable mark, as though struck by something weighty and unyielding. Evelyn’s mind replayed that sight, the blood congealed against pale skin, the shape of the injury too precise for accident.

She drew in a slow breath, the chill of the room biting through her coat. The wound’s severity—its depth, the pattern of bruising, the way the flesh had split—left little doubt. This was not the work of a fall or a chance blow. It spoke of force, of intent, and of a weapon with mass and momentum. The brass bolt, now resting inert and cold, matched the dimensions and heft required. Evelyn’s suspicion sharpened: whomever wielded such an object had meant to kill, not merely to frighten. The violence was personal, deliberate. Yet the question remained—who had the opportunity, and who the will?

Vivian Clarke, her posture rigid and her gaze fixed on the table, broke the silence first. 'We all saw Lady Beatrice in the hall at noon, Inspector. She was wearing her blue scarf, the one with the silver thread.' Her voice was steady, but her hands trembled as she folded them in her lap. Margot Sinclair nodded, her own tone measured. 'Yes, she passed by the kitchen. I remember because she asked if the tea was ready.' Charles Wentworth, lounging with feigned indifference by the door, added, 'If you require a parade of witnesses, Inspector, I’m sure you’ll find no shortage. The household is nothing if not attentive to my aunt’s routines.' The words were sardonic, but Evelyn caught the flicker of uncertainty in his eyes.

Evelyn pressed, her voice cool. 'And you, Mr. Porter? Did you see Lady Beatrice at noon?' James Porter shifted his weight, his cap twisting nervously in his hands. 'I was in the kitchen, Miss, stoking the fire. I saw her come through, just after the clock chimed. She nodded, didn’t say much.' His answer was humble, almost apologetic, but Evelyn noted the glance he exchanged with Margot—an unspoken signal, a checking of stories. The pattern repeated as Robert Hensley, summoned from his duties, confirmed, 'She was there, sure enough. Always checked the windows at noon.' The consensus was overwhelming, almost rehearsed.

Yet as each servant spoke, Evelyn registered the subtle contradictions: Vivian hesitated before naming the color of the scarf; Margot’s recollection of the tea did not match the kitchen schedule; James Porter’s timing wavered—a moment before, a moment after. The effect was uncanny, as if the group had constructed a shared memory, each detail reinforcing the next, smoothing over the edges of uncertainty. It was a performance, Evelyn realized, shaped by the pressure to agree, to present a united front against the intruding force of the law. The servants’ memories had fused into a single narrative, masking whatever truth lay beneath.

She let the silence stretch, the only sound the distant clatter of dishes from the scullery and the persistent, low hum of the wind. In that pause, Evelyn’s mind sifted the evidence: the wound, the bolt, the impossibility of accident. The household’s certainty—witnesses see Lady Beatrice near garden gate at noon—was a fragile construct, built not on fact but on the need for order. The physical traces told another story. The brass bolt, observed earlier, should have remained engaged until the afternoon, when sufficient heat would cause expansion and release. Yet the testimonies clung to noon as the pivotal moment, a time that the mechanism itself quietly contradicted.

She turned to the table, eyeing the brass bolt with renewed suspicion. The mechanism’s delay—its refusal to yield until the temperature rose—was not merely a technicality. It was the fulcrum upon which the entire narrative balanced. If the bolt could not have released at noon, then Lady Beatrice’s presence in the hall at that hour was not proof of anything except the power of collective belief. The servants’ memories, shaped by social reinforcement, had formed a false consensus, masking the victim’s actual location and the true sequence of events.

Charles Wentworth’s sardonic veneer cracked, just for a moment. 'So, Inspector, are we all to be suspects now? Or is this a test of loyalty?' His tone was light, but the edge of anxiety was unmistakable. Margot Sinclair’s reply was sharper than usual, her words clipped. 'If you have nothing to hide, Charles, why protest?' The exchange was brittle, the room’s tension mounting as each person weighed the cost of truth against the safety of conformity.

Evelyn offered a faint, dry smile. 'I find that memory is a most cooperative accomplice, Mr. Wentworth. It tells us what we wish to believe, until the facts intervene.' Her gaze swept the room, taking in the shifting postures, the averted eyes, the small betrayals of nerves. The investigation had reached its first impasse—not for lack of evidence, but because the evidence itself was at war with the collective will of the household. The truth, Evelyn knew, would not be found in consensus, but in the cracks where certainty failed.

As the interviews wound down, Vivian Clarke lingered, her composure fraying. 'Inspector, if you’re suggesting we lied—' Evelyn cut her off, gently but firmly. 'I am suggesting only that memory is unreliable, especially when shaped by expectation. The physical evidence will guide us forward.' Vivian’s lips pressed together, but she said nothing more. The room’s atmosphere, once merely tense, now simmered with a new, uneasy awareness: the story they had agreed upon was no longer safe.

A gust of wintry air rattled the window, and for a moment, the lamp’s glow flickered, casting the room into deeper shadow. Evelyn gathered her notes, her thoughts circling the contradictions revealed. The wound, the bolt, the mechanism’s delay, the rehearsed testimonies—all pointed to a reality more complex than the household dared admit. She would need to press harder, to find the moment where memory and mechanism diverged. For now, the Servants’ hall, Wentworth Manor, held its secrets close, but Evelyn sensed the first fissures in the wall of consensus. The investigation, like the winter wind, would not be so easily stilled.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: James Porter’s Expertise and Opportunity
A faint metallic clatter broke the silence as Inspector Evelyn Harcourt set the heavy brass bolt on the scarred workbench, the echo lingering in the cold, dim air of the Garden workshop near the gate. The mid-afternoon gloom pressed against the small, frosted window, and a persistent chill crept through the cracks in the ill-fitting door. Outside, the wintry fog had thickened, muffling the distant sounds of the estate and cloaking the world in a damp, grey hush. Evelyn’s thoughts circled the contradictions that had haunted her since the Servants’ Hall: the wound, the bolt, the mechanism’s delay, and the brittle unity of the household’s recollections. Here, in the cluttered workshop, the truth felt closer—tangible, perhaps, within reach of her gloved hands.

James Porter stood before her, cap in hand, his posture deferential but tense. The faint glow of the oil lamp cast shifting shadows across his face, accentuating the lines that years of outdoor labour had etched into his skin. His gaze was steady, but his hands betrayed him—fingers trembling slightly as he wiped them on his corduroy trousers. Evelyn watched him with measured calm, her own presence a still point amid the workshop’s clutter of tools and half-mended garden implements. The air was thick with the scent of machine oil, old wood, and the lingering tang of coal smoke—a sensory reminder of the estate’s age and the slow, relentless march of winter.

Charles Wentworth lounged against a battered cabinet, his overcoat collar turned up against the chill. He watched the proceedings with an air of sardonic amusement, eyes flicking between the inspector and the gardener. 'If this is the inquisition, Inspector, I do hope you’ll allow the accused a last cigarette,' Charles drawled, his tone light but his gaze sharp. Evelyn did not rise to the bait, instead gesturing to the brass latch and bolt arrayed on the bench. 'Mr. Porter, you’ve worked with this mechanism for years. Tell me, in your own words, how does the latch behave in weather like this?'

James’s answer came slowly, each word weighed with care. 'Brass is tricky, Miss. In winter, it holds tight—shrinks, you see, with the cold. Needs a good bit of warmth to let go. If the sun’s strong, or if there’s a fire nearby, it’ll loosen some. But on a day like this…' He hesitated, glancing at the fog-dimmed window. 'Well, it’d take more than the usual to make it shift.' His hands, rough and reddened, hovered above the bolt as if reluctant to touch it. Evelyn noted the detail; the knowledge was not theoretical but intimate, born of years spent coaxing stubborn metal to comply with the unpredictable English weather.

She pressed gently, her tone deceptively mild. 'And you’re the only one who maintains the gate?' James nodded, his voice quiet. 'Aye, Miss. Been my job since before the war. No one else much cares for the thing—says it’s temperamental.' His humility was habitual, but Evelyn caught the flicker of pride beneath the words. She let the silence stretch, the only sound the distant drip of water from the eaves outside. 'You know the latch’s moods better than anyone, then. If someone wished to… interfere with it, would you notice?'

James’s fingers tightened around his cap, the tremor more pronounced now. 'I try to keep things right, Miss. But sometimes folk come and go. Hard to watch everything.' The admission was honest, yet hedged—an evasion cloaked in humility. Evelyn registered the tension: a man accustomed to invisibility, now forced into the centre of suspicion. Charles snorted softly, the sound edged with mockery. 'It’s a gate, Inspector, not the Crown Jewels. Surely we’re not to believe it takes a mastermind to make it stick?' His bravado was brittle, Evelyn noted, a shield for his own discomfort.

Evelyn turned her attention back to the physical evidence. She examined the latch, her gloved fingers tracing the fine network of stress lines and the unnatural sheen of soot that marred the brass. 'The mechanism shows signs of recent heating—beyond what this season could provide. You’d agree?' James’s reply was a whisper. 'Aye, Miss. Not seen it like that, not in winter. Takes a fair bit of heat to do that.' His eyes darted to the bolt, then away, as if the sight unsettled him. Evelyn’s mind ticked through the implications: technical knowledge, opportunity, and now, the subtle tremor of fear.

Charles, unable to contain his impatience, interjected with a sardonic twist. 'If you’re suggesting Mr. Porter here is a closet scientist, I’ll eat my hat. The man’s never been further than the village, unless you count the war.' There was a flash of something—resentment, perhaps, or envy—in his tone. Evelyn allowed herself a faint, dry smile. 'One need not travel far to understand the ways of metal and weather, Mr. Wentworth. Sometimes, proximity is the best teacher.'

James shifted, his discomfort growing. 'I just do my job, Miss. Fix what’s broken. If the latch was off, I’d have seen to it.' The protest was soft, but Evelyn heard the defensive edge. She pressed, 'And on the day in question? Where were you, precisely, between noon and two?' James’s answer was immediate, rehearsed. 'In the kitchen, Miss. Tending the stove, as I said before.' Yet his hands betrayed him, twisting the cap until the fabric threatened to tear. Evelyn weighed the alibi against the evidence—the opportunity was there, if only for a moment, and the knowledge to exploit it.

A beat of silence settled, broken only by the ticking of the workshop’s battered wall clock. The sound was oddly loud in the stillness, a reminder of time’s relentless passage. Evelyn studied James, her gaze unwavering. 'You’re certain you never left the kitchen? Not even for a moment?' James’s jaw tightened. 'Not unless you count fetching wood from the yard, Miss. But that’s no more than a minute.' The admission slipped out, unguarded. Evelyn filed it away—a crack in the certainty of his alibi, small but significant.

Charles straightened, his posture defensive. 'Are we to suspect every errand is a crime now? If so, we’d all be in the dock.' His tone was flippant, but the edge of anxiety was unmistakable. Evelyn’s reply was cool, almost amused. 'I suspect only what the evidence compels me to, Mr. Wentworth. And at present, the evidence is most uncooperative.' The exchange drew a reluctant smirk from Charles, but the tension in the room remained palpable.

Evelyn turned back to the bolt, her mind circling the contradictions. The physical evidence—the stress lines, the soot, the unnatural delay—spoke of intervention, not accident. James Porter’s technical expertise was undeniable, as was his access to the mechanism. The opportunity, though fleeting, was real. Yet the man before her was not a villain in the traditional sense; his fear was palpable, his humility genuine. The line between guilt and circumstance blurred, leaving Evelyn with more questions than answers.

A sudden gust rattled the workshop window, the fog outside swirling in the fading light. For a moment, the tension eased as Margot Sinclair’s voice drifted in from the path, sharp and oddly comforting. 'If you’re quite finished freezing the staff, Inspector, some of us would like to see the day’s end.' The remark, delivered with polite savagery, drew a faint smile from Evelyn and a snort from Charles. The moment of levity was brief, but it punctured the oppressive atmosphere, if only for a heartbeat.

As the interview wound down, Evelyn gathered her notes, her thoughts troubled. She had pressed James Porter, tested his knowledge, and found the opportunity for manipulation. The evidence was mounting, but the truth remained elusive—hidden in the interplay of memory, mechanism, and motive. Outside, the wintry fog thickened, swallowing the estate in silence once more. Evelyn knew the investigation had reached a turning point: suspicion had narrowed, but certainty was still out of reach. The Garden workshop near the gate, with its cold light and lingering shadows, had yielded its secrets reluctantly. The next move would be hers.
--- END PRIOR CHAPTER 4 ---

--- BEGIN PRIOR CHAPTER 5 ---
Title: Chapter 5: Murder Weapon and Timeline Confirmed
When Evelyn stepped into the Garden gate and crime scene that late afternoon, the last embers of daylight struggled to pierce the heavy, lingering fog. Her boots pressed into the rough, damp earth, and the cold air prickled her cheeks as she drew her coat closer. The faint sound of distant voices from Wentworth Manor drifted across the grounds, barely more than a whisper against the persistent hush. In her hand, the case notes felt heavier than paper had any right to be. The investigation had circled this place before, but today the atmosphere felt more volatile—charged with a tension that seemed to coil between the gate’s ironwork and the battered brass bolt she carried.

Evelyn laid out the evidence on a canvas cloth, her movements deliberate. The detached brass bolt, its surface marked with soot and fine lines, caught the weak glow of the gas lamp that Margot Sinclair had brought from the house. Margot hovered nearby, her gloved fingers twisting the handle of the lamp, eyes flicking from the inspector to the mechanism and back. The faint odor of singed metal mingled with the earthy scent of wet grass and the sharper tang of brass, creating an olfactory signature that would forever tie this place to violence.

‘It’s odd, isn’t it, how something so ordinary can become monstrous?’ Margot’s voice was brittle, her attempt at composure undermined by the tremor in her words. ‘Lady Beatrice would have laughed at the notion of a bolt turning traitor.’ Evelyn allowed herself a moment to study Margot’s posture—rigid, yet fragile, as if a single careless word might shatter her self-control. The lamp’s flickering light threw shifting shadows across Margot’s face, highlighting the tightness at her jaw.

James Porter was already present, standing a careful distance from the evidence, cap in hand. He seemed smaller in the waning daylight, his humility amplified by the chill that seeped through his thick wool sweater. Evelyn’s gaze swept over him, noting the way his eyes darted to the bolt, then away, never settling for long. ‘You know this mechanism well, Mr. Porter,’ Evelyn began, her tone even. ‘You’ve seen what the winter does to brass. Explain what you see here.’

James’s answer emerged slowly, each word measured. ‘Brass like that—well, it doesn’t give in easy, not when it’s cold as this. Needs proper heat to let go. The marks you see, Miss—those lines, the soot—it’s not just weather. That’s force, and more than just a bit of warmth.’ His voice trailed off, uncertainty threading through the end of his sentence. The fog thickened, muffling the world beyond the gate, and Evelyn noted the way James’s hands trembled, a subtle betrayal of nerves.

Evelyn turned her attention to the bloodied cloth that had been wrapped around the victim’s head at discovery. She unfolded it with care, revealing the dried, rust-brown stain at its centre. The wound itself—she remembered—had been ugly, deep, and unmistakably deliberate. The pattern of bruising and the sharp indentation matched the dimensions of the bolt precisely. There could be no doubt: Lady Beatrice Wentworth’s fate had been sealed by a deliberate blow, not by accident or misadventure.

Margot’s voice, softer now, broke the silence. ‘You’re saying it was this bolt—nothing else?’ Her question carried a note of disbelief, perhaps hope for some other explanation. Evelyn’s reply was gentle but firm. ‘The evidence is direct, Miss Sinclair. The injury is consistent with this precise object, and nothing in the garden fits so well.’ Margot’s eyes flickered, and she looked away, her grip on the lamp tightening until her knuckles blanched.

The air hung heavy with the scent of damp earth and the metallic tang of old blood. Evelyn examined the bolt’s shank, noting the scratches and the pattern of wear. She measured the distance from the latch mechanism to the ground, imagining the arc of the fatal blow. ‘The gate’s bolt was not only detached,’ Evelyn said, more to herself than her companions, ‘but wielded with intent. The question now is when, and by whom.’

A sudden gust of wind rattled the gate, a hollow, metallic sound echoing through the fog. James flinched, then quickly masked the reaction by adjusting his cap. Margot’s composure wavered further; her gaze darted toward the manor, as if she longed to flee the scene. Evelyn caught the exchange—a subtle, silent communication born of shared anxiety. The tension between them was palpable, an undercurrent of suspicion that threatened to surface with every word.

Evelyn circled the gate, her gloved hand tracing the battered iron as she reviewed the timeline. The household’s consensus had been clear: Lady Beatrice was last seen near the garden at noon. Yet everything about the physical evidence—the condition of the latch, the temperature required for release, the unnatural discoloration—contradicted that story. The bolt could not have been freed until the mechanism reached seventy-eight degrees Fahrenheit, a state possible only after a delay. The timeline was no longer anchored at noon; it now hinged on a precise moment later in the day.

She paused, considering the distance from the manor’s main door to the garden gate—twenty-five yards—a short journey, but enough to complicate matters if alibis overlapped or contradicted. ‘No one could have entered or left without passing close by, not without being noticed,’ Evelyn mused aloud. Margot’s lips quirked in a faint, sardonic smile. ‘You underestimate this house, Inspector. Secrets slip through cracks wider than twenty-five yards every day.’

James’s discomfort deepened. He offered, ‘I was in the kitchen, Miss, as I said before. Tending the fire, chopping vegetables. Didn’t leave—not until the shouting started.’ His words were careful, rehearsed, but Evelyn noted the way he avoided her gaze. The pressure of the investigation was wearing him down; she could almost see the cracks forming in his calm façade.

Margot, perhaps seeking to deflect attention, turned her focus to the physical evidence. ‘If the bolt was so vital, why was it left here, in the open? Surely a clever murderer would have hidden it.’ Evelyn’s answer came with a trace of dry humour. ‘Murderers often imagine themselves cleverer than they are, Miss Sinclair. Besides, evidence has a way of resurfacing when one least expects it. The truth, like brass, endures.’

The lamp’s glow flickered as a wintry draft swept through the gate, and Margot shivered involuntarily. Evelyn watched her closely, noting the subtle signs of stress: the tightening grip, the restless shifting of weight, the way Margot’s breath fogged in the cold air. ‘You were close to Lady Beatrice. Did she ever mention fearing for her safety, or suspecting someone in the household?’ Margot hesitated, her answer coming slowly. ‘She had worries, yes, but not of this kind. It was the estate’s future that troubled her, not violence.’ There was a defensiveness in her tone—a need to protect the memory of the dead, or perhaps herself.

Evelyn shifted her attention back to James. ‘You maintain the gate. If something was amiss, you’d know.’ The challenge in her voice was unmistakable. James’s reply was quiet, yet edged with resignation. ‘I try to keep things right, Miss. But not everything is under my control.’ His humility was tinged with a sadness Evelyn had not noticed before—a man burdened by more than just suspicion.

Evelyn glanced at the logbook resting atop the evidence cloth, its pages open to the entries for the day of the murder. The ink was still crisp, the signatures clear. She traced a finger along the column marked "access," noting that only James Porter's name appeared beside the relevant time. Margot, observing, remarked quietly, ‘That’s the interview record, isn’t it? I remember you said only one person had the chance to touch the latch before it failed.’ Evelyn nodded, her eyes lingering on the entry. ‘Yes. The logs and interviews show only Mr. Porter had access and timing to manipulate the latch.’

The investigation’s rhythm grew more methodical as Evelyn worked through each detail. She compared the bolt to the latch, aligning the scars and measuring the fit. The match was exact. The evidence, she realized, did not merely suggest a connection—it demanded it. The murder weapon was not an improvisation but a direct extension of the gate’s mechanism, confirming the crime occurred after the bolt’s release.

Margot’s composure faltered completely as the implication settled. ‘So… the murderer waited until the gate would yield? That’s monstrous.’ Her voice cracked, the first hint of genuine fear slipping through her polished veneer. Evelyn regarded her with a measured gaze. ‘Monstrous, perhaps, but not impulsive. This was planned with care, exploiting the mechanism’s delay. The timeline is now fixed—noon is impossible. The fatal moment could only have come at forty-five minutes past one in the afternoon, once the latch released.’

James’s face paled, and he looked away, jaw clenched. Evelyn watched him, considering what lay beneath the surface: technical skill, opportunity, and now, a rising sense of dread. The investigation had not yet reached its conclusion, but the suspects’ reactions were beginning to write their own story.

A tense silence settled, broken only by Margot’s brittle attempt at levity. ‘You must forgive us, Inspector, if we seem uncooperative. This house breeds secrets faster than it breeds roses.’ The remark, though barbed, drew a faint, appreciative smile from Evelyn. ‘If so, Miss Sinclair, I’ll need a sturdier pair of gloves.’

As dusk crept over the grounds, the lamp’s glow grew feebler, and the edges of the garden blurred into shadow. Evelyn collected the evidence with care, her thoughts racing ahead to the next round of questions. The facts had narrowed the field, eliminating old certainties and raising new doubts. The murder weapon was confirmed; the timeline, once anchored at noon, now pointed unerringly to forty-five minutes past one in the afternoon. What remained was to uncover who had the nerve—and the knowledge—to exploit that window.

Evelyn’s final glance fell on James, who stood silent and withdrawn, and on Margot, whose composure was now a fragile shell. The garden, once a place of order, had become a crucible for truth—one in which each secret, each fear, would soon be tested. The investigation was no longer a matter of routine; it was a contest of wills, and the next move belonged to her.
--- END PRIOR CHAPTER 5 ---

--- BEGIN PRIOR CHAPTER 6 ---
Title: Chapter 6: Suspect Alibis and Eliminations Begin
There was a hush in the Main house, various rooms as twilight crept through the narrow windows, the last traces of daylight fading into a cold, blue-grey gloom. The scent of damp wool and the faint, acrid tang of coal smoke lingered in the air, clinging to the heavy curtains and the polished wood of the sideboard. Inspector Evelyn Harcourt stood by the threshold, her gaze moving between the assembled suspects as the muffled sound of wind rattled the windowpanes—a reminder that the wintry world outside was closing in. The tension from the garden lingered, unresolved, coiling around each word and gesture as the investigation pressed deeper into the heart of the household.

Charles Wentworth broke the silence first, his voice edged with frustration. 'How much longer must we endure this parade, Inspector? I’ve told you—at the time in question, I was in the library. Ask anyone.' He exhaled sharply, the sound almost a sigh of exhaustion, and ran a hand through his hair. The lamplight caught the sheen of sweat at his temple, betraying a tension he could not fully conceal. Evelyn regarded him steadily, her tone cool but not unkind. 'Several guests have already placed you in the library, Mr. Wentworth, and their accounts are consistent.' The words hung in the air, both a reprieve and a subtle warning.

A faint echo of voices drifted from the corridor—a reminder of the house’s persistent life, even as suspicion narrowed its focus. Evelyn flipped open her notebook, her gloved fingers moving with practiced precision. 'You were seen by at least three guests, all of whom recall your presence from shortly before one until nearly two o’clock.' Charles’s eyes flickered, relief mingling with irritation. 'So I am to be cleared, then?' he asked, the bravado in his tone undercut by a tremor of uncertainty. Evelyn did not answer at once, letting the silence press on him. 'For the moment, your alibi stands. But I will need to confirm every detail.' Charles’s jaw tightened, but he said nothing more.

Margot Sinclair waited near the mantel, her posture rigid, hands folded tightly before her. The glow of the firelight threw shifting shadows across her face, accentuating the lines of fatigue and worry. When Evelyn turned to her, Margot’s composure seemed to waver. 'I was with the household accounts all afternoon,' Margot said, her voice low but steady. 'Ask the servants. They’ll confirm it.' There was a brittleness to her words, a hint of desperation that belied her outward calm. Evelyn nodded, her gaze never leaving Margot’s face. 'I have spoken to the staff. They recall your presence in the office, working through the ledgers. No one saw you leave.' Margot’s shoulders sagged, just a fraction, as if the burden of suspicion had pressed her spine for too long.

A knock at the door announced Robert Hensley’s arrival. He entered with a brisk nod, his boots leaving faint, muddy prints on the polished floorboards. The scent of horse and hay clung to him, a reminder of the world beyond the manor’s walls. 'You wished to see me, Inspector?' Robert’s tone was gruff, but there was a wariness in his eyes. Evelyn gestured for him to sit. 'The stable logs show you were tending to the horses throughout the afternoon. The staff confirm you did not leave the stables until the bell for tea.' Robert’s reply was blunt. 'That’s right. I was there, as always. Ask anyone.' There was a trace of wounded pride in his words—a man who resented being doubted, even as he clung to the routine that shielded him from suspicion.

Evelyn’s mind sifted the evidence as she moved from one account to the next. The facts were clear: Charles Wentworth had been seen in the library by multiple guests, Margot Sinclair had been occupied with the accounts in the main house, and Robert Hensley’s presence in the stables was corroborated by both logs and staff. Each alibi, when tested against the timeline, held firm. The investigation was narrowing, not by revelation but by elimination—a process as methodical as it was merciless.

Yet beneath the surface, Evelyn detected fractures—hairline cracks in the façade of composure each suspect wore. Charles’s impatience was more than mere irritation; it was the desperation of a man who feared the shadow of guilt. Margot’s brittle calm masked a deeper anxiety, her loyalty to Lady Beatrice Wentworth complicated by secrets she dared not voice. Robert’s bluntness, too, was a shield, his pride a brittle defense against the intrusion of suspicion. The emotional cost of the investigation was mounting, and Evelyn felt its weight with every question she asked.

A moment of ironic relief came as Margot, her voice edged with weary humour, remarked, 'If you keep us here much longer, Inspector, the accounts will never balance and the horses will revolt. Perhaps that’s your true aim.' The room’s tension eased, if only for a heartbeat, as Charles allowed himself a short, reluctant laugh. Even Robert’s stern features softened, just for a moment. But the respite was brief; the investigation pressed on, relentless as the winter wind.

Evelyn turned the conversation back to the evidence, her tone measured. 'The murder weapon was the detached brass bolt from the garden gate. The wound matches precisely, and the timeline is fixed—noon is impossible. The fatal blow could only have occurred at forty-five minutes past one in the afternoon, once the latch released.' The words landed with finality, and the room fell silent. Each suspect registered the implication: their alibis, so hard-won, now served to narrow the field still further.

As the interviews drew to a close, Evelyn caught a flicker of something in Margot’s eyes—a flash of fear, quickly masked by composure. Charles, too, seemed to shrink into himself, the weight of suspicion replaced by a different kind of dread. Robert’s posture remained rigid, but his gaze softened, as if the relief of being believed was tempered by the knowledge that someone else would bear the brunt of accusation. The investigation had reached a turning point: the field of suspicion was narrowing, but the emotional toll was only beginning to show.

Evelyn gathered her notes, her thoughts circling the contradictions and the truths revealed. The evidence had eliminated three suspects, but the cost was plain to see in the faces before her. The winter night pressed in, the wind rattling the windows, as the household braced for the next round of questions. The truth was closer now—tangible, perhaps, within reach—but the scars left by suspicion would linger long after the case was closed.

Just as Evelyn prepared to leave, she paused at the sideboard, her eyes drawn to the logbook left open beside a tray of kitchen keys. She glanced at the entries, noting the neat script: James Porter’s name appeared in both the garden and kitchen access columns, and a pencilled note from Lady Beatrice read, 'James—please see to the latch, as only you know the mechanism.' The evidence was quietly damning, and Evelyn closed the book with a soft click, her mind turning over the implications as she stepped out into the hall.
--- END PRIOR CHAPTER 6 ---

--- BEGIN PRIOR CHAPTER 7 ---
Title: Chapter 7: Controlled Temperature Simulation
Evelyn closed the logbook with a quiet snap, the faint echo carrying through the corridor as she stepped into the chill of the late afternoon. The wintry air pressed against her face as she crossed the threshold to the Garden gate and nearby workshop, the cold seeping through her gloves and biting at her knuckles. The scent of damp earth mingled with the sharp tang of brass and the lingering odor of machine oil, a reminder that this patch of ground was both crime scene and workshop. Behind her, the sky was already bruising toward dusk, the pale winter daylight fading into a grey haze that clung to the hedges and blurred the edges of the world.

James Porter stood by the battered workbench, his cap in hand, posture rigid as if bracing for a blow. The workshop’s dim glow flickered across his face, highlighting the lines etched by years of outdoor labour. Vivian Clarke lingered just inside the doorway, her arms folded tight against the cold, eyes sharp beneath the shadow of her hat. Evelyn set the logbook down beside a battered thermometer and the detached brass bolt, her movements precise, almost ceremonial. The silence was broken only by the distant sound of wind rattling the panes and the faint creak of the garden gate as it shifted in the breeze.

‘Mr. Porter,’ Evelyn began, her voice measured, ‘you’re familiar with the peculiarities of this latch. I’d like you to assist me with a demonstration.’ She gestured to the brass mechanism, its surface still marred by soot and fine stress lines. James hesitated, his gaze flicking to Vivian, who watched him with an intensity that bordered on suspicion. ‘Aye, Miss,’ he replied, his voice low, ‘though I doubt the gate will tell you much more than it already has.’ The words were humble, but the edge of resignation was unmistakable.

Evelyn produced a set of notes and a battered garden thermometer, the mercury column glinting faintly in the waning light. ‘The household insists Lady Beatrice entered the garden at noon, yet the physical evidence disagrees. The latch, as you know, requires a certain temperature to release—a temperature the day’s feeble sun could not provide. We will test it now, in full view.’ She set the thermometer against the brass, her gloved hand steady, and waited as the metal absorbed the workshop’s modest warmth. The silence grew taut, each second stretching as the mercury crept upward.

Vivian shifted, her heels scraping the flagstones. ‘You mean to say all our memories are for nothing, Inspector?’ Her tone was brittle, but her eyes betrayed a flicker of fear. Evelyn did not look up. ‘I mean only that memory is often shaped by expectation, Miss Clarke. The mechanism, however, is not so easily persuaded.’ The dry wit in her voice cut through the tension, drawing a reluctant smirk from Vivian, though her arms remained folded, defensive.

The thermometer’s reading climbed, and Evelyn narrated each increment aloud, her tone clinical. ‘At fifty degrees, the latch remains immobile. At sixty, it resists. Only when we approach seventy-eight degrees Fahrenheit does the bolt begin to shift.’ She pressed the latch, demonstrating its stubbornness, and then, as the warmth from the workshop lamp coaxed the temperature higher, the bolt finally gave way with a metallic click. ‘As you see, the mechanism could not have released before the brass reached seventy-eight degrees Fahrenheit—a state impossible at noon on a day like this.’ The words landed with the weight of finality, and James’s jaw tightened, his eyes fixed on the floor.

Vivian’s gaze darted between Evelyn and James. ‘But everyone saw Lady Beatrice at noon. Are you saying we all imagined it?’ Her voice wavered, the certainty of her memory shaken. Evelyn’s reply was gentle but unyielding. ‘I am saying that consensus is not proof. The pressure to agree can shape recollection, especially in a household such as this. The physical evidence stands apart from collective belief.’

James’s hands twisted his cap, the fabric threatening to tear. ‘I only did as I was told, Miss. Saw to the latch when asked, kept to my duties.’ The words were soft, but beneath them lay a current of unease—a man who sensed the ground shifting beneath him. Evelyn regarded him steadily, her gaze neither accusing nor forgiving. ‘The logbook shows you had access to both the garden and the kitchen on the day in question. No one else signed for the mechanism. You understand its workings better than anyone here.’

Vivian’s composure faltered. ‘James, you’ve always been loyal to the family. You’d never—’ She stopped herself, the sentence unfinished, the implication hanging in the air. James’s reply was a whisper. ‘Loyalty’s a heavy thing, Miss Clarke. Sometimes it means doing what must be done, even if it’s not understood.’ The admission was ambiguous, but the tension in his posture betrayed the cost of such loyalty.

Evelyn turned to the battered correspondence box on the workbench, retrieving a sheaf of notes written in a cramped, careful hand. She laid them out, the rustle of paper loud in the hush. ‘These letters, found in your quarters, Mr. Porter, speak of concern for the family’s reputation. Of plans made to conceal unpleasant truths. They do not accuse, but they do suggest forethought.’ James’s eyes flickered, a flash of something—fear, perhaps, or regret—before he looked away.

The wind outside rose, rattling the window and sending a shiver through the workshop. Evelyn let the silence linger, the evidence arrayed before her: the thermometer, the bolt, the logbook, the letters. ‘The facts are these: the latch could not have released before forty-five minutes past one in the afternoon. The only person with the knowledge and opportunity to manipulate the mechanism was you, Mr. Porter. The household’s timeline is contradicted by physical law.’

Vivian’s voice was barely audible. ‘You’re saying we’ve all been living a lie. That our certainty is worth nothing against a piece of brass and a thermometer.’ There was bitterness in her words, but also a dawning realization—a recognition that the ground beneath her had shifted irrevocably. Evelyn’s tone softened. ‘Not a lie, Miss Clarke. Only a story shaped by hope and habit. The truth is less forgiving, but it is also less fragile.’

James’s shoulders sagged, the fight draining from his frame. ‘I never meant harm, Miss. Only to do right by the house. Lady Beatrice… she trusted me to keep things in order.’ His voice cracked, and for a moment, the mask of humility slipped, revealing the turmoil beneath. Vivian reached out, hesitated, then let her hand fall to her side, her own certainty shaken.

Evelyn gathered the evidence, her movements deliberate. The demonstration was complete, the contradiction laid bare. The household’s consensus—witnesses see Lady Beatrice near the garden gate at noon—was now exposed as a fragile construct, undone by the implacable logic of metal and temperature. The investigation had reached a new threshold: the field of suspicion narrowed, the cost of loyalty and deception made plain.

As the shadows lengthened and the cold deepened, Evelyn allowed herself a brief, sardonic smile. ‘It seems, Miss Clarke, that even in a house as old as this, the truth has a way of slipping through the cracks—no matter how many hands try to hold it shut.’ The remark, dry as the winter air, drew a reluctant laugh from Vivian, a sound more brittle than amused. Outside, the wind carried the scent of damp earth and the promise of another long night. Within the workshop, the evidence spoke for itself, and Evelyn knew the next move would demand more than technical skill—it would require courage, from all of them.

The tension did not break, but shifted, settling over the workshop like a wintry shroud. Vivian lingered, her gaze fixed on James, who seemed diminished by the weight of what had been revealed. Evelyn watched them both, her own resolve hardening. The household’s story had been overturned, the mechanism exposed, but the final reckoning was yet to come. For now, the cold logic of the latch and the warmth of human frailty stood in uneasy balance, each waiting for the other to yield.
--- END PRIOR CHAPTER 7 ---

--- BEGIN PRIOR CHAPTER 8 ---
Title: Chapter 8: Late-Breaking Complications
"If you’re going to keep us here much longer, Inspector, I shall require a stronger drink," Charles Wentworth announced, his voice slicing through the hush that had settled over the Manor drawing room. The evening gloom pressed against the tall windows, lamplight pooling in golden puddles across the faded carpet and casting elongated shadows behind each figure. The faint sound of wind rattled the panes, and the cold seeped in at the edges, a persistent reminder of the wintry world outside. Inspector Evelyn Harcourt, seated with her notebook balanced on her knee, did not look up at once. The tension from the workshop still clung to the air—Vivian’s lingering gaze, James Porter’s hunched silence—unresolved, coiling between the settees and the marble hearth.

Margot Sinclair perched at the far end of the sofa, her gloved hands folded in her lap, eyes fixed on the flickering fire. The scent of coal smoke mingled with the faint, musty odor of old books and the sharper tang of brandy from the sideboard. Margot’s posture was rigid, but her foot tapped an erratic rhythm against the rug—a small betrayal of nerves. Evelyn watched her from beneath lowered lashes, noting the brittle composure and the way Margot’s gaze flicked, almost involuntarily, to the door each time the wind rose. The atmosphere was thick with anticipation, the kind that makes every whisper sound like a threat.

James Porter stood apart, near the bookcase, cap in hand. The lamplight revealed the pallor beneath his weathered skin, and the way his fingers twisted the brim betrayed a tension that words could not. He had spoken little since the demonstration in the workshop, and now his silence was a presence in itself, heavy and expectant. Charles, by contrast, feigned indifference, sprawled in an armchair with one ankle crossed over his knee, but the set of his jaw and the restless tapping of his fingers against the armrest told another story.

Evelyn let the silence stretch, her gaze sweeping the room. She was attuned to the small details: Margot’s anxious foot, Charles’s bravado, James’s withdrawal. The drawing room, usually a sanctuary from the estate’s chill, felt exposed—every secret and fear thrown into relief by the flicker of firelight and the relentless scrutiny of the investigation. The muffled echo of the telephone bell from the corridor reminded her of the outside world, but here, isolation was complete. The house’s boundaries had become a crucible, and its inhabitants were feeling the heat.

Margot’s composure finally cracked. She drew a breath, the sound sharp in the hush, and said, "Inspector, may I speak plainly?" Her voice was low but carried across the room. Evelyn nodded, closing her notebook with a soft click. Margot’s hands trembled as she reached into her handbag, withdrawing a folded sheet of cheap paper. "This—this is what’s been troubling me. It isn’t about Lady Beatrice, not directly. I’ve been receiving letters. Anonymous, threatening to expose a matter from my past—nothing to do with the estate or the murder. I thought… I thought someone here might be using it against me." The words tumbled out, brittle and edged with relief.

Charles’s eyebrows shot up, and he let out a short, incredulous laugh. "Blackmail? In this mausoleum? Margot, you do choose your confidences with care." The remark was savage, but Margot did not flinch. Instead, she met his gaze with a steadiness that surprised even Evelyn. "It’s not a joke, Charles. I’ve been terrified for weeks. That’s why I’ve been so on edge—why I’ve avoided questions. But I swear, Inspector, I had nothing to do with Lady Beatrice’s death. My fear is my own, and I’ll answer for it, but it’s not murder."

Evelyn regarded Margot for a long moment, weighing the confession. The nervousness, the evasions—suddenly, they fell into place, not as signs of guilt in the matter of Lady Beatrice Wentworth, but as the private terror of a woman cornered by secrets unrelated to violence. The inspector’s tone, when she spoke, was gentle but precise. "Thank you, Miss Sinclair. Fear breeds silence, and silence breeds suspicion. But your candor is noted. This matter will be kept confidential, unless it bears directly on the case." Margot’s shoulders sagged, as if a weight had been lifted, and for the first time since the investigation began, she looked almost at ease.

James shifted, his gaze flicking to Margot, then away. The silence that followed was not quite relief, but it was softer, less brittle. Charles, for his part, seemed chastened, his bravado curdling into something more uncertain. He poured himself a measure of brandy, the clink of glass loud in the hush, and muttered, "Well, if we’re all to confess our sins, perhaps the Inspector should bring a confessional instead of a notebook." The dry wit was meant to deflect, but it only underscored the unease that still lingered.

Evelyn allowed herself the faintest smile, her voice edged with irony. "If I had a confessional, Mr. Wentworth, I suspect it would overflow before the night was out. But for now, I am interested only in the facts—and the ways in which fear distorts them." The comment drew a reluctant chuckle from Charles, and even Margot’s lips quirked in a ghost of amusement. The tension did not vanish, but it shifted, becoming something more human and less accusatory.

The wind rattled the window again, and the fire guttered, sending a brief shower of sparks up the chimney. Evelyn rose, stretching her cramped legs, and crossed to the sideboard. The telephone sat there, its black Bakelite receiver gleaming dully in the lamplight—a reminder of the world beyond, and the limits of privacy within Wentworth Manor’s walls. She ran a finger along the cord, recalling the party-line exchanges and the impossibility of secrecy in a house so full of listening ears.

James Porter’s voice, quiet but firm, broke the moment. "Miss, if you’re done with me, I’d like to return to my duties. There’s little I can add, and I’ve said all I know." His humility was genuine, but Evelyn caught the edge of something else—resignation, perhaps, or the exhaustion of a man who had lived too long under suspicion. She nodded, but her gaze lingered on him as he slipped from the room, cap in hand. The door closed with a soft click, and the silence that followed was thick with unspoken questions.

Margot remained on the sofa, her hands now steady. She looked at Evelyn with a mixture of gratitude and defiance. "You’ll find nothing else, Inspector. My secrets are my own, and they end here." Evelyn inclined her head, accepting the boundary. Charles, subdued, stared into his glass, the bravado drained from his posture. The drawing room, for all its warmth, felt colder now—emptied of certainty, filled instead with the uneasy calm that precedes a storm.

Evelyn returned to her chair, notebook in hand. She let her gaze drift to the fire, watching the flames dance and gutter. The investigation had shifted again: Margot’s nervousness, once a source of suspicion, was now explained and set aside. One suspect, at least, could be eliminated. But the field had narrowed, and the emotional cost was plain to see. The truth, Evelyn sensed, was close—so close she could almost feel its shape in the silence. Yet the final piece was still missing, and the night was far from over.

Outside, the wind howled, rattling the bare branches against the glass. Within, the household waited, each member alone with their fears and their secrets. Evelyn watched the fire burn low, her thoughts circling the contradictions and the truths revealed. The next move would be decisive—a test not just of evidence, but of courage. For now, the drawing room held its uneasy calm, the storm gathering just beyond the reach of the lamplight.
--- END PRIOR CHAPTER 8 ---

--- BEGIN PRIOR CHAPTER 9 ---
Title: Chapter 9: The Final Trap
Night had settled fully over Wentworth Manor by the time Inspector Evelyn Harcourt summoned the household to the Manor library and main hall. The wind pressed at the leaded windows, its low moan a counterpoint to the muffled crackle of the fire as it cast flickering shadows across the spines of leather-bound books. Coal smoke hung faintly in the air, mingling with the scent of wood polish and the sharper tang of damp wool from coats hastily donned against the chill. The atmosphere was formal, brittle with expectation; every footstep on the thick carpet seemed to echo in the hush. Evelyn stood by the hearth, the firelight catching the silver in her hair, her posture composed but her eyes alert, measuring the tension that coiled through the assembled figures.

Charles Wentworth was the first to break the silence, his tone brittle with impatience. 'If this is to be another round of accusations, Inspector, I hope you’ll be more decisive than before.' His bravado was a shield, but Evelyn saw the flicker of anxiety in his gaze. She replied coolly, 'On the contrary, Mr. Wentworth, I believe decisiveness is precisely what this household requires.' She gestured to the cluster of guests and staff, her voice carrying in the firelit gloom. 'We will proceed methodically. Each of you will hear, in turn, the evidence that clears or condemns.'

The clock on the mantel ticked in the near-silence as Evelyn turned first to Charles. 'Your alibi has been corroborated by multiple guests,' she said, her words measured and precise. 'You were seen in the library from shortly before one until nearly two o’clock. The witness statements are consistent, and there is no physical evidence linking you to the garden gate or the mechanism.' She let the words settle, then added, 'Therefore, Charles Wentworth is cleared of suspicion. His alibi holds.' Charles’s posture slackened, the tension draining from his shoulders; relief warred with lingering resentment on his face. He managed a stiff nod, but said nothing more.

Margot Sinclair stood near the fire, her hands clasped tightly before her, the lamplight picking out the fine tremor in her fingers. Evelyn’s gaze softened as she addressed her. 'Miss Sinclair, your nervousness these past days has been noted, but the reason has now been made plain. You have been the target of anonymous threats—matters unrelated to Lady Beatrice’s death. The servants confirm you were occupied with the household accounts throughout the afternoon, never leaving the main house.' She paused, watching Margot’s eyes flicker with a mixture of gratitude and shame. 'Therefore, Margot Sinclair is cleared. Her fear is explained, and she had no access to the garden gate mechanism.' Margot’s relief was nearly palpable; her composure, so brittle before, steadied as she gave a small, dignified nod.

Robert Hensley shifted his weight, boots creaking on the carpet, the scent of stable and hay clinging to his coat. Evelyn’s tone was brisk but not unkind. 'Mr. Hensley, the stable logs and staff statements confirm you were tending the horses all afternoon. The mud drying pattern on your boots matches the stable yard, not the garden path. You could not have been at the gate at the time of Lady Beatrice’s death. Therefore, Robert Hensley is cleared.' Robert’s jaw worked, and for a moment he seemed on the verge of protest, but then he only nodded, a quiet dignity settling over him. The accusation that had weighed on him was lifted, and in its place was a somber reflection—a man who had endured suspicion and come through unchanged.

Vivian Clarke stood apart, her arms folded, eyes bright with a mix of indignation and fatigue. Evelyn turned to her last among the exonerated. 'Miss Clarke, you were serving dinner in the main hall at the relevant hour. The schedule and the testimony of the guests confirm your presence. Moreover, you lack both the technical knowledge and motive to manipulate the gate mechanism. Therefore, Vivian Clarke is cleared.' Vivian’s composure did not falter, but her lips parted as if to protest, then closed again. There was a flash of something—perhaps relief, perhaps resentment—before she looked away, her posture relaxing minutely.

The room’s temperature seemed to shift as Evelyn let the silence stretch, the only sound the soft crackle of the fire and the distant, rhythmic ticking of the clock. Four suspects had been cleared, their alibis and circumstances confirmed by evidence and testimony. Only James Porter remained, standing near the door, cap in hand, his face shadowed in the lamplight. The tension in his posture was unmistakable, his humility now edged with something harder—resignation, perhaps, or resolve.

Evelyn’s tone grew colder, her words precise as she addressed the final suspect. 'Mr. Porter, you alone had both the knowledge and the opportunity to manipulate the garden gate mechanism. The logbook shows you signed for access to both the garden and kitchen on the day in question. No one else touched the latch or the bolt. The controlled simulation demonstrates that the brass latch could not have released before the mechanism reached seventy-eight degrees Fahrenheit. On a day such as this, that temperature was not reached until forty-five minutes past one in the afternoon.' She paused, letting the evidence settle over the room. 'The murder weapon was the detached brass bolt from the garden gate. Lady Beatrice Wentworth was struck with it—deliberately, not by accident. The timeline, the mechanism, and the opportunity all point to you.'

James’s hands twisted his cap, the fabric nearly tearing under the strain. His voice, when it came, was rough but steady. 'I… I did what I thought was right. Lady Beatrice trusted me to keep the house in order, to protect the family’s name. When she threatened to expose what had been hidden—her own brother’s disgrace, the debts, the shame—I could not let it happen. I killed Lady Beatrice Wentworth. I struck her with the bolt. I waited until the latch released, knowing no one would suspect the timing.' The words fell heavily into the silence, the finality of the act undeniable.

A hush descended, broken only by the fire’s low hiss and the faint sound of the wind at the window. Margot Sinclair’s hand flew to her mouth, eyes wide with horror and pity. Charles Wentworth stared at James, his expression unreadable, caught between revulsion and a grudging understanding of the cost of loyalty. Robert Hensley’s gaze was steady, a quiet sorrow in his eyes for a man undone by devotion. Vivian Clarke’s composure shattered, tears slipping down her cheeks as she turned away.

Evelyn’s voice, when she spoke, was soft but unyielding. 'You engineered a mechanism to avoid direct confrontation, James. But in doing so, you condemned Lady Beatrice to death—a death by your hand, if not by your presence. The line between accident and intent is blurred, but the evidence is clear. You are under arrest for the murder of Lady Beatrice Wentworth.' She signaled for the door to be opened, and James Porter allowed himself to be led away without protest, his head bowed, the weight of his actions pressing his shoulders low.

The firelight flickered across the faces of those left behind, deepening the colors of the stained glass and casting long shadows up the paneled walls. The cost of the truth was plain in every bowed head and trembling hand. Evelyn lingered by the hearth, her gaze distant, the satisfaction of resolution tempered by regret. Justice had been served, but the scars of loyalty and fear would linger far longer than the night. In the hush that followed, the only sound was the soft, steady ticking of the clock—a reminder that, for all its cruelties, time would move on.
--- END PRIOR CHAPTER 9 ---

# Case Overview
Title: The Garden Sundial Enigma
Era: 1930s
Setting: Wentworth Manor
Crime: murder (brass latch delayed gate bolt murder)
Culprit: James Porter
Victim: Lady Beatrice Wentworth
False assumption: The garden gate was opened at noon as all household members and guests saw Lady Beatrice entering the grounds then.
Cast: Inspector Evelyn Harcourt (she/her), Lady Beatrice Wentworth (she/her), Charles Wentworth (he/him), Margot Sinclair (she/her), Robert Hensley (he/him), Vivian Clarke (she/her), James Porter (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Wentworth Manor). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Wentworth Manor" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Evelyn Harcourt — she/her/her (NEVER he/him)
• Lady Beatrice Wentworth — she/her/her (NEVER he/him)
• Charles Wentworth — he/him/his (NEVER she/her)
• Margot Sinclair — she/her/her (NEVER he/him)
• Robert Hensley — he/him/his (NEVER she/her)
• Vivian Clarke — she/her/her (NEVER he/him)
• James Porter — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 10,
    "act": 3,
    "title": "The Garden Sundial Enigma Revealed",
    "setting": {
      "location": "Garden gate and manor hall",
      "timeOfDay": "Late night",
      "atmosphere": "Climactic and revealing"
    },
    "characters": [
      "Inspector Evelyn Harcourt",
      "James Porter",
      "Charles Wentworth",
      "Margot Sinclair",
      "Robert Hensley",
      "Vivian Clarke"
    ],
    "purpose": "Confront culprit and reveal the full solution",
    "cluesRevealed": [
      "clue_late_optional_slot_1"
    ],
    "dramaticElements": {
      "conflict": "Culmination of tension as Porter’s guilt is exposed",
      "tension": "Emotional fallout among household members",
      "microMomentBeats": [
        "James Porter’s mask slips, revealing a glimpse of regret"
      ]
    },
    "summary": "Inspector Harcourt confronts James Porter with the physical evidence of the thermal delay in the garden gate latch, the servants’ false memories, and his exclusive technical knowledge and opportunity. She reveals how Porter exploited the latch’s delayed release to stage the murder timeline, exposing the false assumption of Lady Beatrice’s noon entry. The household grapples with the revelation as justice is set in motion.",
    "beat": "revelation",
    "estimatedWordCount": 2500,
    "emotionalRegister": "The manor grapples with the aftermath—truth achieved but at personal and social cost.",
    "dominantCharacterNote": {
      "name": "Inspector Evelyn Harcourt",
      "voiceRegister": "Measured and precise, Evelyn’s speech is economical with a subtle dry wit that reveals her sharp mind beneath a calm exterior."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Telephone communication is limited to party-line exchanges, reducing privacy and immediacy.; Transportation is reliant on petrol-powered automobiles with limited use due to economic caution.; Manual typewriters and telegrams remain primary tools for correspondence, slowing information exchange.; The manor’s isolation and estate boundaries restrict movement and access to outsiders.; Short winter daylight hours limit outdoor activity and investigation times.; No modern electronics or post-1945 scientific tools are available for forensic analysis.",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": true
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
□ Mode check (Aftermath/Consequence): chapter focuses on emotional/social fallout without introducing decisive new mystery evidence.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Evelyn Harcourt | she/her/her/herself       | [fill in]     | [yes/no]
  Lady Beatrice Wentworth | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Wentworth    | he/him/his/himself        | [fill in]     | [yes/no]
  Margot Sinclair      | she/her/her/herself       | [fill in]     | [yes/no]
  Robert Hensley       | he/him/his/himself        | [fill in]     | [yes/no]
  Vivian Clarke        | she/her/her/herself       | [fill in]     | [yes/no]
  James Porter         | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 10 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: template.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- VICTIM ALIVE: "Lady Beatrice Wentworth could not have entered the garden at noon, as so many claimed."
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.
- Keep cast-canonical names, roles, and pronouns stable in every paragraph. If a sentence drifts, rewrite the whole sentence cleanly.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Character names, roles, and pronouns are consistent in every sentence.
- Primary failure class cleared: template.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 10 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 10
Attempt: 3/3 | class: template
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- VICTIM ALIVE: "Lady Beatrice Wentworth could not have entered the garden at noon, as so many claimed."
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

PACKET MUST-FIX ITEMS
- Resolve template issues before accepting this batch.
- VICTIM ALIVE: "Lady Beatrice Wentworth could not have entered the garden at noon, as so many claimed."
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

TEMPLATE RESET CONTRACT
- Rewrite all failing paragraphs from new sentence skeletons.
- Avoid repeated paragraph openers and high-overlap phrasing from prior chapters.

CONTINUITY FIX CONTRACT
- Re-check every pronoun/name reference against cast-canonical identity before output.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: template
ATTEMPT: 2/3
OFFENDING TEXT: Lady Beatrice Wentworth could not have entered the garden at noon, as so many claimed.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- VICTIM ALIVE: "Lady Beatrice Wentworth could not have entered the garden at noon, as so many claimed."
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
MITIGATION MODE: freshen_atoms
```
