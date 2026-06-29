# Actual Prompt Record

- Run ID: `run_09168377-8a7c-483c-b498-af9745492070`
- Project ID: `proj_b81c20c5-117d-447a-9663-b6dd7554ca0d`
- Timestamp: `2026-06-29T20:25:20.677Z`
- Agent: `Agent9-ProseGenerator-Ch9`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `879a9f7163b7a0d3`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Arthur Langley[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Arthur Langley. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Edith Marwood (woman) — DECEASED, past-tense only, Arthur Langley (man), Beatrice Hargrave (woman), Charles Whitmore (man), Daphne Sinclair (woman), Edward Marwood (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Edith Marwood, Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted to prevent the victim from revealing a devastating family secret that would ruin innocent relatives, blurring justice and protection." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- VICTIM IDENTITY: Edith Marwood is the murder victim, already dead before this chapter. Refer to them ONLY in past tense (memory, testimony, physical evidence). They do not speak, enter rooms, react, or gesture. Never write them as present or alive in any scene.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Edith Marwood (DECEASED), Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Edith Marwood: victim (DECEASED — does not appear in any scene, past tense only)
   - Arthur Langley: Private Investigator / Inquiry Agent
   - Beatrice Hargrave: Ambitious Socialite
   - Charles Whitmore: Legal Advisor
   - Daphne Sinclair: Loyal Servant with a Hidden Past
   - Edward Marwood: Disgruntled Heir
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
- False assumption in force: The victim was murdered shortly before sunset as all household servants consistently testified.
- Hidden truth to progressively expose (compose in your own words from these elements): hides, fact, murder, occurred, servants, claimed, presence, timeline, manipulated, false, testimonies, physical
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: edith, marwood, watch, stopped, garden, shows, clear, shadow, face, cast, sundial, gnomon | corr: shadow, length, direction, correspond, time, servants, claimed, death, based, solar, geometry, little | effect: narrows, murder, time, window, servants, last, reported, sighting, invalidating, timeline
  - Step 2: obs: household, ledger, pages, show, financial, entries, dated, servants, claimed, time, death, inconsistencies | corr: since, edith, confronted, edward, ledger, falsifications, timing, proves, murder, happened, servants, supposed | effect: eliminates, suspects, claiming, presence, before, ledger, entries, implicates, motive, hide, fraudulent, finances
  - Step 3: obs: edward, marwood, study, logs, housekeeper, testimony, conflict, claims, presence, four, independent, confirmation | corr: given, adjusted, murder, time, sundial, ledger, edward, alibi, overlaps, window, making, claimed | effect: eliminates, edward, alibi, narrows, culpability
  - Step 4: obs: edward, authority, unmonitored, access, manipulate, watch, position, garden, cast, misleading, sundial, shadow | corr: exclusive, access, knowledge, prove, premeditation, ability, stage, false, timeline | effect: uniquely, identifies, edward, marwood, culprit
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): sundial, shadow, experiment, conducted, placing, identical, watch, face, sunlight, conditions, various, times
- Test must rely on already-shown clue IDs: clue_12, clue_2, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The sundial shadow on Edith’s watch and weather logs (early clues) establish the murder time contradicting servant statements. Step 2: Ledger ink inconsistencies and financial entries dated after servants’ timeline narrow suspects and reveal Edward’s motive. Step 3: Edward’s alibi conflicts with the revised timeline, eliminating his claimed innocence. Step 4: Only Edward’s exclusive access to the garden and watch placement proves premeditation. The discriminating test uses these clues to definitively prove the false timeline and Edward’s guilt.

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The actual time when the sundial’s shadow length indicates the murder must have occurred: "twenty minutes past four in the afternoon"
  - Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline: "half past three in the afternoon"
  - Weather condition recorded in the estate’s log confirming shadow visibility: "clear skies"
  - Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation: "forty-five degrees"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_late_optional_slot_1] servant, testimonies, placing, edith, alive, before, sunset, remains, late, texture, detail, case
  Category: temporal | Criticality: optional | Supports inference step 4
  Points to: adds, late, texture, changing, essential, deduction, chain

• [clue_12] sundial, shadow, experiment, conducted, placing, identical, watch, face, confirming, angle, length, correspond
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: sundial, shadow

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The actual time when the sundial’s shadow length indicates the murder must have occurred: "twenty minutes past four in the afternoon"
  • Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline: "half past three in the afternoon"
  • Weather condition recorded in the estate’s log confirming shadow visibility: "clear skies"
  • Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation: "forty-five degrees"

CHARACTER PRONOUNS — never deviate from these:
  • Edith Marwood: she/her/her
  • Arthur Langley: he/him/his
  • Beatrice Hargrave: she/her/her
  • Charles Whitmore: he/him/his
  • Daphne Sinclair: she/her/her
  • Edward Marwood: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_3, clue_4, clue_mechanism_visibility_core, clue_14, rh_1, rh_2, clue_5, clue_6, clue_7, clue_8, clue_core_contradiction_chain, clue_culprit_direct_1, clue_culprit_direct_edward_marwood, clue_core_elimination_chain, clue_15, clue_16, clue_18, clue_12, clue_13 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): edith, marwood, watch | shadow, length, direction | household, ledger, pages | since, edith, confronted | murder, concealed, manipulating | scandal, exposure | rh_1 | rh_2 | edward, marwood, study | given, adjusted, murder | edward, authority, unmonitored | exclusive, access, knowledge | shadow, length, direction | physical, trace, opportunity, indicate, edward, marwood | direct, shows, edward, marwood, means, opportunity | eliminates, beatrice, hargrave, because, corroborated, alibi | eliminates, charles, whitmore, because, corroborated, alibi | eliminates, daphne, sinclair, because, corroborated, alibi | eliminates, beatrice, hargrave, because, corroborated, alibi | sundial, shadow | edward, marwood, murder, concealed, manipulating
• Suspects still unresolved: Beatrice Hargrave[SHE], Charles Whitmore[HE], Daphne Sinclair[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (pre_climax): Narrow to the culprit — apply the discriminating test logic

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The group dispersed slowly, the cold and the weight of revelation sending each to their own corner of the manor. Arthur lingered by the sundial, the rough stone cold beneath his hand. The shadow, now lengthening with the dying light, seemed to point not only t..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Edith Marwood: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Edith Marwood crossed the room" / "Edith Marwood sat on the sofa" / "Edith Marwood nodded"
  - WRONG: "Edith Marwood gave testimony" / "Edith Marwood asked what had happened"
  - CORRECT: "Edith Marwood had often said..." / "Edith Marwood's effects were found" / "witnesses recalled Edith Marwood's habit of..."

⛔ IDENTITY STABILITY — post-reveal zone:
If the culprit has been arrested or confessed in any prior chapter, NEVER use role aliases in narrative prose:
  FORBIDDEN (narrator voice): "the killer", "the murderer", "the culprit", "the criminal", "the guilty party"
  REQUIRED: use the character's actual name (first name or full name) every time.
  Exception: a character's spoken dialogue may contain these terms — the ban applies to narrator voice only.
═══════════════════════════════════════════════════════

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Marwood Manor, The Sundial Terrace, Marwood Manor Library, Servants' Hall, Family Study, Drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Marwood Manor", "The Sundial Terrace", "Marwood Manor Library", "Servants' Hall", "Family Study", "Drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 9: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Drawing room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 7 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 8 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "the weather condition recorded in the estate", "weather condition recorded in the estate s", "condition recorded in the estate s log", "recorded in the estate s log confirming", "in the estate s log confirming shadow", "the estate s log confirming shadow visibility", "estate s log confirming shadow visibility was", "s log confirming shadow visibility was clear", "log confirming shadow visibility was clear skies", "the time indicated by the sundial s".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Edith Marwood: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Arthur Langley: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Hargrave: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Whitmore: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Daphne Sinclair: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Edward Marwood: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Edith watched Langley; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Edith watched Langley; Langley crossed the room and Edith frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=22690; context=4591; dropped=[humour_guide, location_profiles, texture_pool, continuity_context, world_document, character_personality, physical_plausibility, era_authenticity, temporal_context, craft_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 9 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio receivers common in drawing rooms | domestic telephones connected via party-line exchanges | manual typewriters used for correspondence and record-keeping | telephone calls subject to party-line privacy limitations | telegrams dispatched from nearest town post office | postal mail and airmail for longer-distance correspondence.
5. Respect setting movement/access constraints in scene action and alibis: main entrances guarded by estate staff controlling visitor access | restricted areas such as private family quarters and staff-only zones | estate layout includes natural barriers like hedges and gated driveways limiting movement | weather conditions such as frequent rain can affect outdoor evidence and timing | entry to manor strictly monitored by staff with visitor logs maintained.
6. Sustain social coherence with this backdrop pressure: Amidst the strict social hierarchy and regimented routines of an isolated 1930s English manor, the Marwood family and their close associates navigate economic anxieties and guarded interactions while confined by estate protocols and rising external tensions.
7. Maintain continuity around these socially central cast anchors where relevant: Edith Marwood, Arthur Langley, Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the sundial shadow experiment demonstrating time contradiction, Observe Edward Marwood’s reaction to the invalidation of his alibi, Draw conclusion about Edward’s guilt based on physical evidence
Test type: trap

**Suspect Clearance Scenes:**
- Beatrice Hargrave (Act 3, Scene 5): Proof of kitchen presence and ledger corrections unrelated to murder
  Clues: Kitchen access logs, Ledger pagination and ink analysis
- Charles Whitmore (Act 3, Scene 5): Servants’ testimonies and location in main hall during murder time
  Clues: Household schedules, Witness accounts
- Daphne Sinclair (Act 3, Scene 5): Alibi verified by guest logs and Arthur Langley’s confirmation
  Clues: Guest arrival and movement logs, Arthur’s testimony

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with sundial shadow evidence, ledger analysis, and authority channel breach

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: False Suspect Clearing.
Mode required outcomes:
- Show why suspect looked guilty.
- Prove innocence with evidence, corroborated alibi, or timing logic.
- Shift suspicion afterward.
Forbidden at this stage:
- Do not clear by convenience or assertion.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Consequence: 30-40%
- Evidence Proving Innocence: 50-60%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 9-9.
Investigation state at start: 21 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Prove innocence with evidence and re-target suspicion.
Suspect pressure target(s): Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
Required new information: Evidence that clears one suspect and redirects inquiry.
Forbidden reveals at this stage: Do not clear by convenience or assertion.

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
- Chapter 9:
  - STRUCTURAL ARCHETYPE — Chapter 9 must be: DISCRIMINATING
      ✓ MUST contain: discriminating test logic applied to culprit
      ✗ MUST NOT contain: unresolved crime or no test performed
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Drawing room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Arthur" or "Arthur's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Arthur" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The group dispersed slowly, the cold and the weight of revelation sending each to their own corner of the manor. Arthur lingered by the sundial, the rough stone cold beneath his hand. The shadow, now lengthening with the...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • servant, testimonies, placing, edith, alive, before, sunset, remains, late, texture, detail, case [clue_late_optional_slot_1]
      Points to: adds, late, texture, changing, essential, deduction, chain
    • experiment, replicates, sundial, shadow, identical, watch, face, confirming, timing, discrepancies [clue_12]
      Points to: sundial, shadow
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ⚠ SUSPECT CLEARANCE REQUIRED (MANDATORY): each suspect below MUST be named explicitly and cleared with on-page evidence and a reasoning connector (because / therefore / which proves):
    • "Beatrice Hargrave": write a dedicated paragraph that (a) names Beatrice Hargrave explicitly, (b) states the clearance method ("Proof of kitchen presence and ledger corrections unrelated to murder"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Kitchen access logs, Ledger pagination and ink analysis.
    • "Charles Whitmore": write a dedicated paragraph that (a) names Charles Whitmore explicitly, (b) states the clearance method ("Servants’ testimonies and location in main hall during murder time"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Household schedules, Witness accounts.
    • "Daphne Sinclair": write a dedicated paragraph that (a) names Daphne Sinclair explicitly, (b) states the clearance method ("Alibi verified by guest logs and Arthur Langley’s confirmation"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have". Cite clues: Guest arrival and movement logs, Arthur’s testimony.
  - ALIBI LOCK: Edward Marwood's established alibi is "Says he was in his study from one to four". Do NOT place Edward Marwood at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Edward Marwood has already made statements in earlier chapters. Any time, location, or claim attributed to Edward Marwood in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. Beatrice Hargrave may use polite_savagery to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions The actual time when the sundial’s shadow length indicates the murder must have occurred, write exactly: "twenty minutes past four in the afternoon".
  - If this batch mentions Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, write exactly: "half past three in the afternoon".
  - If this batch mentions Weather condition recorded in the estate’s log confirming shadow visibility, write exactly: "clear skies".
  - If this batch mentions Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation, write exactly: "forty-five degrees".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⚠ DISCRIMINATING TEST WINDOW: The story's "trap" test MUST be staged as a concrete scene before the story ends. If this chapter has not yet performed it, do so now — do not defer to a later chapter. A post-hoc summary is NOT acceptable.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Edith Marwood: she/her/her
    Arthur Langley: he/him/his
    Beatrice Hargrave: she/her/her
    Charles Whitmore: he/him/his
    Daphne Sinclair: she/her/her
    Edward Marwood: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 9-9.
Investigation state at start: 21 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Prove innocence with evidence and re-target suspicion.
Suspect pressure target(s): Beatrice Hargrave, Charles Whitmore, Daphne Sinclair, Edward Marwood
Required new information: Evidence that clears one suspect and redirects inquiry.
Forbidden reveals at this stage: Do not clear by convenience or assertion.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Servant testimonies placing Edith alive before sunset
- Established timeline fact: Sun position and shadow length on the sundial
- Established timeline fact: Household meal schedule starting at half past six
- Established timeline fact: Edward's study occupancy from one to four in the afternoon
- If referenced, use exact phrase: "twenty minutes past four in the afternoon" (The actual time when the sundial’s shadow length indicates the murder must have occurred).
- If referenced, use exact phrase: "half past three in the afternoon" (Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline).
- If referenced, use exact phrase: "clear skies" (Weather condition recorded in the estate’s log confirming shadow visibility).
- If referenced, use exact phrase: "forty-five degrees" (Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Sundial's Witness
Arthur Langley stepped onto the frost-laced flagstones of the Garden of Marwood Manor, the cold morning air prickling the skin beneath his woolen gloves. A hush had settled over the estate, broken only by the distant echo of a train whistle and the soft patter of last night’s rain dripping from the box hedges. The sky, a muted grey, pressed low upon the winter landscape. Ahead, beneath the pale shadow cast by the ancient sundial, Edith Marwood lay motionless, her form half-shrouded by the trailing edge of her fur-trimmed coat. The faint scent of damp earth mingled with something sharper—metallic, unmistakable. Arthur paused, the breath clouding before him, and knelt at Edith’s side, his gaze drawn immediately to her left wrist. There, her watch had stopped, its face catching the slender shadow of the sundial’s gnomon, perfectly aligned and sharply defined in the morning’s wintry light.

He studied the watch, noting the clarity of the shadow across its glass. The angle and length of the sundial’s shadow, combined with the position of the stopped hands, struck him as oddly precise—too precise, perhaps, for a death that the household claimed had occurred before sunset. The servants’ statements, gathered in hurried whispers since dawn, insisted on a timeline that did not match the evidence before him. Arthur’s mind catalogued the contradiction: the sundial’s shadow, unwavering and distinct, suggested a time at odds with the household’s recollections. The watch, marked by the unmistakable imprint of the sundial’s shadow, seemed to point to a different hour altogether. It was a detail that demanded explanation, and Arthur felt the first stirrings of unease—a sense that the truth here would not yield easily.

He rose, brushing the moisture from his knees, and surveyed the scene. The Garden of Marwood Manor, usually a place of quiet order, was now unsettled by the presence of death. The moss-covered flagstones felt rough beneath his boots, and the air carried the chill dampness of a Yorkshire winter. Beyond the sundial, the manor’s windows glimmered dully, their curtains drawn but not quite concealing the movement within. Arthur’s gaze lingered on the sundial itself, its weathered stone base and the gnomon set at precisely forty-five degrees from the horizontal—a detail he filed away, knowing the geometry of shadow and time would matter before the day was done.

A cluster of figures gathered at the edge of the terrace, their faces taut with shock and something more guarded. Beatrice Hargrave stood nearest, her gloved hands clasped tightly around a silk handkerchief. She was the very image of composure, yet her gaze flickered anxiously between Arthur and the watch on Edith’s wrist. Beatrice’s reputation as an ambitious socialite preceded her—her ascent through the ranks of local society had been swift, and not without its share of whispered scandals. Edith Marwood’s recent discovery of a forged letter had placed Beatrice under a cloud she could not easily dispel. Now, as Arthur watched, Beatrice’s posture betrayed a nervous tension, her shoulders rigid beneath her tailored coat. He noted the way she avoided meeting his eyes, focusing instead on the sundial as if it might absolve her of any involvement.

Charles Whitmore, the family solicitor, stood a pace behind, his expression unreadable beneath the brim of his felt hat. Charles’s presence at Marwood Manor was a fixture—his loyalty to the family unquestioned, though not, perhaps, untainted by self-interest. Edith had confronted him only days before about discrepancies in the estate’s will, and Arthur wondered now if those secrets had played any part in the night’s violence. Charles’s hands were folded behind his back, but Arthur caught the briefest tightening of his grip on his leather portfolio, a gesture that suggested more than professional anxiety. When Arthur’s gaze met his, Charles offered a curt nod, his voice flat as he spoke. “You’ll want to see the guest logs, I presume. The law is, regrettably, indifferent to sentiment.” The words were correct, but the tone was brittle, and Arthur marked it as a sign of pressure.

Daphne Sinclair, the head housekeeper, hovered near the servants’ entrance, her posture both attentive and wary. Daphne’s Yorkshire accent surfaced as she murmured instructions to a junior maid, her tone brisk yet not unkind. She had served the Marwoods for over a decade, her loyalty forged in the quiet crucible of domestic routine. Yet Edith’s knowledge of Daphne’s past—her affair with Edith’s late husband—had always been a silent threat. Today, Daphne’s composure seemed to fray at the edges. She smoothed her apron with deliberate care, but her eyes darted to Arthur, then to the sundial, then back again. “If you’ll be needing the kitchen records, sir, I’ve them ready,” she said, but the words came out thinner than usual, betraying an undercurrent of dread.

Edward Marwood, the heir, arrived last, his stride brisk and his jaw set in a line of impatience. He wore a dark overcoat, the collar turned up against the cold, and his gloved hands were thrust deep into his pockets. Edward’s reputation as the estate’s restless moderniser was well known; he had little patience for tradition and even less for the constraints of family expectation. Now, his eyes swept the scene with a mixture of irritation and something sharper—fear, perhaps, or guilt. “I trust you’ll be thorough, Mr. Langley,” he said, his tone clipped. “We can’t afford delays. The estate’s affairs are complicated enough without this.” Arthur noted the way Edward’s gaze lingered on the sundial and the watch, then flicked away. It was not the look of a man at ease with circumstance.

Arthur turned back to Edith Marwood, careful not to disturb the scene more than necessary. The silence grew heavier, punctuated only by the distant caw of a rook and the soft rustle of Daphne’s skirts as she withdrew. The cold seemed to intensify, seeping through Arthur’s coat and settling in his bones. He glanced once more at the watch, the sundial’s shadow still perfectly aligned across its face. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, was unmistakable: half past three in the afternoon. Yet every servant’s account insisted that Edith had been seen alive well before then. The contradiction was stark, and Arthur felt its weight.

He straightened, drawing a slow breath, and turned to the assembled household. “I am Arthur Langley. I have been engaged to investigate Mrs. Marwood’s death. Until I am satisfied, no one is to leave the premises or alter anything in this garden.” His voice carried across the terrace, firm but not unkind. He saw Beatrice’s lips part as if to protest, but she only nodded, her eyes fixed on the ground. Charles’s jaw worked, but he said nothing. Daphne gathered her courage and met Arthur’s gaze, her hands twisting in her apron. Edward merely shrugged, but his stance grew more rigid, a man bracing himself for a storm.

Arthur’s mind worked methodically through the details. The stopped watch, the sundial’s shadow, the precise geometry of the gnomon at forty-five degrees—each pointed to a timeline that refused to align with the household’s narrative. The weather condition recorded in the estate’s log confirming shadow visibility was clear skies, a fact that left no room for ambiguity. If the sundial’s shadow was so distinct, then the time it marked could not be dismissed as coincidence. Yet the servants’ testimonies, delivered with the anxious precision of the well-drilled, all agreed on a different hour. The contradiction was not merely academic; it was the fulcrum upon which the entire case would turn.

He allowed himself a single, silent moment of relief—a brief, ironic recognition that even in death, Edith Marwood had managed to disrupt the careful choreography of Marwood Manor. The household, for all its rituals and routines, was now suspended in uncertainty. Arthur glanced once more at the sundial, its shadow stretching across the cold stone, and knew that the answers he sought would not come easily. The winter day was only just beginning, and already the shadows had grown long.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Conflicting Clocks
"You’ll forgive me, but I must ask again—precisely when did you last see Mrs. Marwood alive?" Arthur’s voice cut through the hush of the manor hallway, its echo mingling with the faint creak of floorboards beneath his polished shoes. The air was thick with the scent of damp wool and the lingering chill from the garden, where the morning’s drizzle still streaked the leaded windows. Outside, the pale daylight struggled through overcast skies, casting a wan glow across the tiled floor and the cluster of uneasy faces before him. The household stood arrayed in uneasy formation: Beatrice Hargrave closest, her gloved hands twisting a handkerchief; Charles Whitmore, his gaze fixed on the grandfather clock; Daphne Sinclair, half-shadowed near the entrance; and Edward Marwood, arms folded, jaw clenched, eyes darting between Arthur and the garden beyond.

Arthur’s mind lingered on the contradiction that had unsettled him in the garden: the sundial’s shadow, sharp and unwavering, had lain across Edith Marwood’s stopped watch at an angle that could not be mistaken. The length and direction of that shadow, matched against the face of the watch, told a story at odds with every account he had gathered so far. The servants had insisted, with the precision of the well-drilled, that Edith had been seen alive shortly before sunset. Yet the evidence—cold, impartial—spoke otherwise. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, was unmistakable: half past three in the afternoon. Arthur felt the weight of this detail pressing against the neat edifice of their testimonies.

He allowed the silence to stretch, watching as discomfort flickered across the faces before him. The contradiction was not a matter of idle curiosity; it was a wedge, prying at the carefully synchronized accounts. If the sundial’s shadow and the stopped watch both pointed to half past three in the afternoon, then the entire household’s narrative—insisting on a death near sunset—was suddenly suspect. Either the evidence was misleading, or someone was lying with remarkable discipline. Arthur’s suspicion deepened: the alignment of the sundial’s shadow was not a detail easily forged, especially given the weather condition recorded in the estate’s log confirming shadow visibility as clear skies. He resolved to test the household’s unity of recollection, one voice at a time.

"It was just before dusk, I’m certain," Beatrice said, her voice pitched low, eyes averted. "I’d gone to fetch a wrap from the cloakroom—Edith was still out on the terrace. The light was fading, you see." She dabbed at her cheek, but Arthur noted the absence of tears. Her composure was brittle, the performance too studied. He wondered if it was fear or calculation that stiffened her posture. Beatrice’s reputation for ambition was well known, but her relationship with Edith had been fraught of late. If she was lying, it was not for lack of practice.

Charles Whitmore cleared his throat, the sound abrupt in the hush. "I was in the library, reviewing the estate ledgers. The household schedule is quite fixed—tea at four, dinner at half past six. Edith was always prompt. I recall glancing at the clock as the gas lamps were lit—just after four, I believe. She had not yet returned." His tone was flat, almost bored, but his eyes flicked to Arthur as if searching for approval. The solicitor’s loyalty to the family was a matter of record, but Arthur sensed a deeper anxiety beneath the veneer of professionalism. Charles’s grip on his portfolio tightened imperceptibly, betraying a man under pressure.

"I was in the kitchen, sir," Daphne offered, her accent softening the edges of her words. "Preparing for supper. Mrs. Marwood came by for a word about the silver, then left for the terrace. I saw her through the window, plain as day. It were just before the sun dipped behind the hedge." Her hands twisted the hem of her apron, knuckles white. Daphne’s loyalty was legendary, yet Arthur recalled Edith’s knowledge of her past—a secret that could shatter her position. Was Daphne protecting herself, or someone else?

Edward Marwood’s response was brisk, almost impatient. "I was in my study from one until four. I’ve said as much already. If you’re looking for inconsistencies, you’ll find none with me." His tone was clipped, the words edged with irritation. Yet Arthur noted the way Edward’s gaze lingered on the garden, then flicked away. The heir’s restlessness was palpable, a man accustomed to command but now corralled by suspicion and circumstance. If Edward felt the walls closing in, he masked it with bluster.

Arthur let their statements settle, then stepped toward the window overlooking the garden. The wintry light was thin, the terrace slick with rain. He replayed the morning’s discovery: the sundial’s gnomon set at forty-five degrees, the shadow slicing across the watch face, the time fixed in silent accusation. If the servants’ accounts were true, the shadow should have been longer, the angle altered by the lowering sun. Instead, the evidence pointed to a moment well before sunset—half past three in the afternoon—when the sky was still bright and the shadow crisp. The contradiction was not merely technical; it was foundational. Someone had orchestrated a story, and the household had rehearsed it well.

He turned back to the group, his expression unreadable. "The details matter," Arthur said, voice measured. "Shadows do not lie, though people sometimes do—intentionally or otherwise. I will need to speak with each of you again." His words landed with a quiet finality, and he watched as Beatrice’s gaze darted to Charles, then to Daphne. The unity of their testimonies now seemed less like solidarity and more like a pact. The first fissures of doubt had begun to show.

As the household dispersed, Arthur lingered in the hallway, the cold seeping through the stone beneath his feet. He replayed each account, weighing tone against detail, posture against word. The contradiction between the sundial’s evidence and the servants’ timeline was no longer a curiosity—it was a lever. The original meaning of the clue had been simple: a time of death, a fixed point. Now, its revised meaning was more sinister: a deliberate distortion, a coordinated deception. The investigation had shifted. The question was no longer when Edith had died, but why so many were invested in obscuring the true hour.

A faint, ironic relief touched Arthur as he watched the household retreat to their separate routines. Even in death, Edith Marwood had managed to upend the choreography of Marwood Manor. The winter day pressed on, the air heavy with secrets, and Arthur knew the next conversation would matter more than any clock or shadow.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Ledger and Shadow
By the time the pale winter afternoon pressed its chill against the tall windows of the study, Arthur Langley found himself alone amid the hush and faint crackle of the fire. The air carried the scent of old paper and a trace of peat smoke, mingling with the sharper tang of ink. A ledger—its spine creased, pages thick with entries—lay open on the desk, the faint glow of lamplight casting long shadows across the columns of figures. Outside, the garden was a blur of grey and damp, the terrace slick with rain and the sundial standing sentinel beneath the overcast sky. Arthur’s fingers, cold despite his gloves, turned a page and paused: the ink on several entries shimmered differently, some lines still glistening faintly, others faded to a dull brown. The dates—carefully penned—marched past the hour the servants had so insistently claimed for Edith Marwood’s death.

He leaned closer, tracing the sequence of numbers with the tip of his pencil. The financial entries, supposedly recorded before Edith Marwood’s death, bore dates and times that extended well into the disputed window. Here was a payment for coal, noted at 'four fifteen', and there, a notation for a telegram dispatched at 'half past four'. The ink, too, betrayed a hurried hand: some lines bled into the paper as if written in haste, while others bore the crispness of a practiced scribe. The inconsistency was unmistakable. If the household’s narrative were to be believed, these entries could not exist. The ledger, it seemed, was quietly at war with the testimonies.

Arthur’s mind worked methodically through the implications. If the ledger was accurate, then the servants’ timeline—so tidily recited—was fatally compromised. Either the entries had been fabricated after the fact, or the household had rehearsed a fiction to shield someone from scrutiny. The presence of fresh ink among older, settled lines suggested more than mere clerical error. It was a silent accusation, one that pointed to deliberate manipulation. He felt a prickle of unease: the ledger did not merely contradict; it accused.

A memory surfaced—Edith Marwood’s voice, measured and low, recounting her confrontation with Edward Marwood only days before her death. She had spoken of ledger falsifications, of her determination to bring the estate’s affairs into order. Arthur recalled the way her eyes had flashed with a mixture of fear and resolve as she described Edward’s reaction: a brittle composure, a refusal to meet her gaze, the clipped retort that the estate’s future was not her concern. The confrontation, documented in her own hand on a slip of notepaper now tucked within the ledger’s cover, was dated the day before she died.

He drew the note from its place and read Edith’s careful script: 'Confronted Edward regarding discrepancies—denied knowledge, became agitated. Insisted all was in order. Will review entries myself.' The words were precise, the hand steady. Yet Arthur could almost hear the tension beneath the surface, the effort to maintain control in the face of mounting anxiety. Edith had not been a woman easily rattled, but the prospect of betrayal from within her own household had clearly unsettled her.

Arthur set the note aside and returned to the ledger, cross-referencing the entries against the household’s daily schedule. The contradictions multiplied. If Edith had died when the servants claimed, the coal delivery and telegram could not have been recorded in her hand. If, instead, the ledger told the truth, then the entire household had colluded—wittingly or not—in obscuring the true hour of her death. The evidence was damning in its quiet way, a ledger’s worth of numbers undermining the facade of order.

A soft knock broke the silence. Edward Marwood entered, his silhouette framed by the dim afternoon light. He wore his impatience like a second coat, shoulders tense, jaw set. 'Still at the books, Mr. Langley?' he asked, voice brisk. 'If you’re hoping to find a fortune hidden in those pages, you’ll be disappointed. The estate’s finances are as dull as the weather.'

Arthur did not look up at once. 'Dullness has its own charms. Though these entries—' he tapped the page with his pencil—'seem unusually lively for a winter’s afternoon. Coal delivered at four fifteen, a telegram at half past four. Yet I was told Mrs. Marwood was already dead by then. Curious, don’t you think?'

Edward’s eyes narrowed, a flicker of something—annoyance, or perhaps alarm—passing over his features. 'The staff aren’t accountants, Langley. They muddle times, forget details. I doubt Edith would have bothered herself with the ledgers so late in the day.' He crossed to the window, gaze fixed on the sodden terrace. 'If you’re suggesting I had a hand in any of this, you’ll need more than smudged ink and idle speculation.'

Arthur allowed a small, dry smile. 'Idle speculation can be surprisingly productive. Especially when the facts refuse to cooperate.' He closed the ledger with a deliberate motion, the thud echoing in the quiet. 'Tell me, Mr. Marwood—where were you at four o’clock yesterday?'

Edward’s reply was immediate, almost rehearsed. 'In my study. As I’ve said. The estate’s correspondence doesn’t write itself.' His tone was clipped, but a muscle twitched along his jaw. 'If you’re quite finished, I have business to attend to.'

Arthur regarded him for a long moment, weighing the performance. Edward’s confidence was brittle, the veneer of control thinning at the edges. The confrontation with Edith, the ledger’s silent testimony, the staff’s rehearsed timeline—all pointed to a pressure mounting beneath the surface. Arthur sensed that Edward’s fear was not merely of accusation, but of exposure: the possibility that the careful order he had imposed upon the estate might unravel under scrutiny.

He let the silence stretch, then spoke quietly. 'One last thing, Mr. Marwood. The sundial in the garden—its shadow was remarkably precise yesterday. The watch on Mrs. Marwood’s wrist, stopped at half past three in the afternoon, bore the mark of that shadow. Yet the weather condition recorded in the estate’s log confirming shadow visibility was clear skies. The angle of the sundial’s gnomon, as you know, is forty-five degrees. The evidence, in short, is uncooperative.'

Edward’s expression tightened. 'Shadows are for poets and gardeners, Langley. I prefer facts.' He moved to the door, pausing with his hand on the knob. 'If you find any, do let me know.' The door closed behind him with a muted click, leaving Arthur alone with the ledger and the growing sense that the truth, like the winter light, was slipping away by degrees.

Arthur returned to the window, watching as the garden faded into the gathering dusk. The sundial stood mute amid the damp flagstones, its shadow lengthening as the day waned. He considered the contradiction: the servants’ testimonies, the ledger’s stubborn entries, the sundial’s silent accusation. Each piece fit uneasily with the others, as if someone had taken pains to arrange a tableau that would not withstand close inspection.

He jotted a final note in his pocketbook, the scratch of his pen loud in the quiet. The investigation had shifted: the question was no longer simply who had killed Edith Marwood, but how so many could have conspired—by intent or omission—to obscure the truth. The ledger’s inconsistencies, the confrontation Edith had recorded, the sundial’s shadow all pointed to a deliberate manipulation of time and memory. Yet the method remained elusive, a mechanism glimpsed only in the corner of the eye.

A faint, ironic relief touched Arthur as he closed the ledger. Even in the labyrinth of Marwood Manor, with its rituals and routines, the truth had a way of seeping through the cracks. He would follow the shadow, the ink, the silence—whatever it took. For now, the winter afternoon pressed on, the study dimming, the garden beyond shrouded in uncertainty.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Motives Surface
The sound of steady rain tapping on the windowpanes filled the Library and drawing room as dusk pressed close, the grey light filtering through heavy velvet curtains. Arthur Langley remained standing by the hearth, the faint scent of coal smoke lingering beneath the sharper tang of old books and polished wood. The fire’s glow cast soft shadows across the Persian rug, illuminating the assembled faces—each one carefully arranged, yet betraying a flicker of tension beneath the surface. The ledger he had closed moments before still weighed on his mind, its contradictions gnawing at the certainty the household so desperately projected.

Beatrice Hargrave was the first to break the silence, her voice low and precise. 'I do hope you’re not planning to keep us here all evening, Mr. Langley. The prospect of cold beef and tepid tea is enough to make one confess to anything.' Her lips curled in a practiced smile, but her gaze lingered on Edward Marwood, who sat apart, shoulders hunched, fingers drumming a nervous rhythm on the arm of his chair. The polite savagery in Beatrice’s remark drew a faint, appreciative smirk from Arthur, who saw in her performance both a shield and a subtle prod—an invitation to probe deeper.

Charles Whitmore, his expression as unreadable as ever, leaned forward, the lamplight glinting off his spectacles. 'If you require further clarification regarding the estate’s schedule, I have the records here.' His voice was flat, almost bored, but Arthur caught the careful way Charles held the folder—knuckles white, as if the papers within might bite. The solicitor’s role as guardian of order was clear, yet the tension in his posture betrayed a man who feared chaos lurking just beneath the surface.

Daphne Sinclair hovered near the sideboard, her hands busy with a tea tray, but her eyes never strayed far from Arthur. The soft clink of porcelain punctuated the hush as she arranged cups with the precision of long habit. 'There’s little to tell, sir. Supper was set for half past six, as always. Mrs. Marwood was last seen on the terrace, just before the sun slipped behind the hedges. I saw her myself, plain as day.' The Yorkshire inflection in her voice was steady, but Arthur noted the way her fingers trembled as she poured. Loyalty, he thought, could be a double-edged sword.

Edward Marwood’s agitation was impossible to miss. He sat rigid, his gaze fixed on the rain-streaked window, jaw working as if chewing over an unpleasant memory. A notepad lay open in his lap, pages filled with tight, slanted script—names, figures, and, Arthur saw as he glanced closer, a series of underlined words: 'scandal', 'exposure', 'Edith', 'ledger'. Edward’s pencil hovered, then pressed down, scoring a line beneath 'fear'. When he sensed Arthur’s attention, Edward snapped the notebook shut with a sharp motion. 'If you’re hoping to catch me out with idle scribbling, you’ll be disappointed,' he said, voice brittle. 'I’m merely trying to keep the estate from collapsing under the weight of all this melodrama.'

Arthur let the tension settle, then addressed the group with a measured tone. 'The sundial’s shadow and the ledger entries do not agree with the timeline you’ve all described. The weather condition recorded in the estate’s log confirming shadow visibility was clear skies, and the angle of the sundial’s gnomon is forty-five degrees. Yet every account insists Edith Marwood was alive well past the hour those shadows would have marked.' He watched for reactions—Beatrice’s eyes narrowed, Charles’s jaw tightened, Daphne’s hand paused mid-pour, and Edward’s knuckles whitened around his pencil.

Charles cleared his throat, his tone clipped. 'The household schedule is a matter of record. If there are discrepancies, they are clerical, not criminal. Edith was meticulous, but even she could be distracted.' He slid the folder across the table, but Arthur saw the reluctance in the gesture—a man offering evidence he hoped would exonerate, yet fearing it might do the opposite.

Beatrice’s voice, light as spun sugar, cut through the tension. 'One wonders, Mr. Langley, whether you believe any of us capable of such… calculation. Edith was not universally beloved, but she was respected. If someone wished her harm, surely it would not have been so elaborate.' Her words danced on the edge of accusation and defense, and Arthur caught the flicker of fear she tried to mask with bravado.

Daphne, setting the teapot down with a soft clatter, spoke quietly. 'Mrs. Marwood had a way of stirring things up. She’d been asking after the silver, the accounts, even the staff’s comings and goings. Folk get nervous when old secrets are dug up.' Her gaze flickered to Edward, then away. The implication hung in the air: Edith’s scrutiny had unsettled more than one member of the household.

Edward, unable to contain himself, burst out, 'If you’re so convinced, Langley, why not simply say so? I have nothing to hide. My study logs will show I was occupied from one to four. Ask the housekeeper—she saw me there.' His voice rose, brittle and edged with panic. The notebook in his lap quivered as his grip tightened. It was not the protest of an innocent man, Arthur thought, but of one desperate to maintain control.

Arthur fixed Edward with a steady gaze. 'The study logs do show your presence, but the housekeeper’s testimony places you away for a period—unaccounted for. That’s a gap I cannot ignore.' He let the words hang, watching as Edward’s bravado faltered, replaced by a flicker of something rawer—fear, or perhaps guilt. The room seemed to contract, the fire’s warmth unable to dispel the chill that settled over the gathering.

A brief silence followed, broken only by the soft scratching of Edward’s pencil as he resumed his anxious note-taking. Beatrice, seizing the moment, offered a brittle laugh. 'If Mr. Marwood is to be tried for nervous handwriting, I shudder to think what fate awaits the rest of us.' Her attempt at levity was met with strained smiles, the relief momentary but real. Even so, Arthur noted the way her fingers twisted her handkerchief, the fabric nearly torn.

Charles rose, gathering his papers with deliberate care. 'If you have further questions, Mr. Langley, I’ll be in the study. Some of us have duties that do not pause for tragedy.' His tone was flat, but a tremor betrayed the strain beneath. Daphne excused herself to attend to supper preparations, her exit marked by a lingering glance at Edward. Beatrice remained, her posture composed but her eyes troubled.

Arthur lingered by the fire, mind racing. The contradictions were multiplying: Edward’s secretive notes and agitation, the study logs that failed to account for every minute, the servants’ insistence on a sunset timeline, and the household schedule that seemed too perfectly rehearsed. Each motive was plausible, each alibi frayed at the edges. Yet the mechanism by which the truth had been concealed remained maddeningly out of reach.

As the room emptied, Arthur caught a final glimpse of Edward, hunched over his notebook, the word 'scandal' circled twice. The evidence was mounting—not enough for accusation, but sufficient to force a reassessment of every testimony. The winter darkness pressed against the windows, and Arthur felt the weight of the case settle anew. Motives had surfaced, but the truth remained submerged, elusive as the last flicker of firelight on the library’s polished floor.
--- END PRIOR CHAPTER 4 ---

--- BEGIN PRIOR CHAPTER 5 ---
Title: Chapter 5: Alibis and Inconsistencies
As the last echoes of rain faded against the leaded panes, Arthur Langley lingered in the dim glow of the Study, the firelight throwing restless shadows across the oak-panelled walls. The air was thick with the scent of peat smoke and the faint, metallic tang of ink—a reminder of the ledger’s silent accusations. Edward Marwood’s notebook still lay open on the desk, the word 'scandal' circled twice, its presence a silent dare. Evening had drawn its grey curtain over Marwood Manor, and with it, the sense of mounting suspicion settled like a damp shroud. The hush was broken only by the distant sound of footsteps in the servants’ quarters, muffled by thick carpets and the weight of unspoken questions.

Edward entered, his silhouette sharp against the flicker of lamplight. He paused, gloved hand still on the doorframe, as if bracing himself for a blow. The cold from the corridor clung to his overcoat, and Arthur could see the faint tremor in Edward’s fingers as he reached for his notepad. 'If you’re here to rehearse the same accusations, Langley, I suggest we spare ourselves the repetition,' Edward said, his tone brisk but edged with fatigue. He moved to the desk, the sound of his leather shoes oddly loud in the hush.

Arthur allowed himself a brief, sardonic smile. 'I’ve no fondness for repetition, Mr. Marwood. But the facts, I’m afraid, are stubborn things.' He gestured to the ledger, its pages splayed open, and to the study logs lying beside it. 'You’ve maintained you were in your study from one until four. Yet the ledger entries and the household schedule suggest otherwise.' He watched Edward closely, noting the way his jaw tightened, the flicker of uncertainty that passed across his eyes.

Edward’s reply was immediate, almost too swift. 'The logs are quite clear. I was here, attending to correspondence. The housekeeper herself can confirm it—she saw me at my desk.' His hand hovered over the notepad, as if seeking refuge in its pages. But Arthur caught the hesitation, the subtle shift in posture that betrayed a deeper anxiety. 'If you’re implying I left the study, you’ll need more than ambiguous ink and a nervous staff.'

'The trouble is,' Arthur said, voice low, 'the housekeeper’s testimony is not as ironclad as you’d like. She recalls seeing you away from the study for a period—unaccounted for.' He let the words hang, watching the ripple of tension that passed through Edward’s frame. 'And the timing of that absence overlaps with the adjusted window for the murder.'

Edward’s hand, usually so steady, trembled as he reached for his cigarette case. He fumbled with the clasp, the silver lid snapping open with a metallic click. 'You’re twisting details, Langley. The household runs on routine. Gaps in recollection are inevitable. I was here.' He lit a cigarette, the flare of the match briefly illuminating the pallor of his face. Smoke curled upward, mingling with the scent of old paper and damp wool.

Arthur leaned back, letting the silence stretch. The sound of voices drifted faintly from the servants’ quarters—a reminder of the world beyond this crucible of suspicion. 'Routine is a fine thing, Mr. Marwood, but it does not account for every minute. The study logs show your presence, yes, but the housekeeper’s account introduces a gap. More troubling still, that gap coincides with the time the sundial’s shadow marked in the garden.'

Edward’s eyes narrowed, a flash of irritation breaking through his composure. 'You’re making a case out of shadows and hearsay. The weather was clear, yes, but I fail to see how a sundial’s whimsy trumps the testimony of those who live here.' He exhaled a plume of smoke, the gesture defiant, but his voice betrayed a note of uncertainty.

Arthur’s tone was dry, almost amused. 'Whimsy, perhaps, but the sundial’s shadow is less forgiving than memory. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, was half past three in the afternoon. Yet the actual time when the sundial’s shadow length indicates the murder must have occurred is twenty minutes past four in the afternoon. Your claimed presence in the study is uncomfortably close to that window.'

A silence stretched between them, the only sound the faint crackle of the fire and the distant clatter of dishes from the servants’ hall. Edward tapped ash into the tray, his movements brusque. 'If you’re so certain, why bother with questions? Accuse me, if you must.' The bravado rang hollow, and Arthur saw the first real fissure in Edward’s armor—a man accustomed to control, now forced to defend himself with bluster.

Arthur did not rise to the bait. Instead, he turned the conversation. 'It’s not accusation, Mr. Marwood, but clarity I seek. The study logs are precise, but the housekeeper’s recollection is less so. She remembers seeing you step away, though she cannot say exactly when. That uncertainty, paired with the ledger’s entries—payments and telegrams recorded after the time the household claims Edith Marwood was last seen alive—demands explanation.'

Edward’s expression tightened, his knuckles whitening around the cigarette case. 'You’re chasing phantoms, Langley. The staff are nervous, the logs imperfect. Edith was fond of order, but even she made mistakes.' He forced a laugh, brittle and unconvincing. 'If every gap in memory were a crime, this house would be empty.'

Arthur regarded him for a long moment, weighing each word. 'Perhaps. But the overlap between your absence and the revised time of death is more than a gap, Mr. Marwood. It’s a chasm.' He let the words settle, watching the color drain from Edward’s face. The heir’s bravado was failing him, replaced by a raw, unguarded fear.

A brief knock at the door interrupted the tension. Beatrice Hargrave entered, her composure as immaculate as her tailored wool dress. She surveyed the room with a practiced eye, then offered a smile as brittle as spun glass. 'I do hope I’m not intruding on a duel, gentlemen. The atmosphere in the hall is positively arctic—one might think we were hosting a séance, not a supper.' Her remark, delivered with perfect poise, drew a flicker of relief—a momentary reprieve from the suffocating tension.

Arthur inclined his head, his tone wry. 'Not a duel, Miss Hargrave. Merely a contest of recollections.' He caught Edward’s eye, noting the way the heir’s shoulders sagged, the fight momentarily gone from him. Beatrice’s arrival had broken the spell, but the fracture remained.

Beatrice turned her attention to Edward, her voice soft but edged. 'You look rather pale, Mr. Marwood. Perhaps you should take supper in your room. The rest of us will try not to let the ghosts run riot.' Her words, though light, carried a sting, and Edward bristled, but said nothing. He gathered his notepad and made for the door, pausing only to shoot Arthur a look of mingled resentment and fear.

As Edward left, Beatrice lingered by the hearth, her gaze thoughtful. 'You’re making progress, I trust, Mr. Langley? The household is growing restless. Secrets have a way of festering in the dark.' She glanced at the ledger, then back at Arthur. 'If you need anything further, you know where to find me.'

Arthur nodded, watching her go. The room felt colder in her absence, the fire’s glow insufficient against the winter night pressing at the windows. He returned to the ledger, reviewing the sequence of entries and the housekeeper’s ambiguous recollection. The original meaning of the study logs had been simple: an alibi, a record of presence. Now, their revised meaning was more sinister—a carefully constructed fiction, undermined by a single lapse in routine.

He jotted a note in his pocketbook, the scratch of his pen loud in the quiet. The investigation’s focus had shifted: Edward Marwood’s alibi, once a shield, was now a source of suspicion. Motive and opportunity had aligned, and the cost of concealment was written in every nervous gesture, every contradiction. Arthur felt the weight of the case anew, the truth drawing closer, its outline sharpened by the cold clarity of winter.
--- END PRIOR CHAPTER 5 ---

--- BEGIN PRIOR CHAPTER 6 ---
Title: Chapter 6: Access and Opportunity
It was not until the first pale light of winter morning seeped through the frosted panes of the household office that Arthur Langley set down his pocketbook, the scratch of his pen still echoing in the hush. The air was sharp with the scent of old paper and the faint, metallic tang of typewriter ink, a chill lingering from the night’s damp. Beyond the door, the Garden sundial area was shrouded in a thin mist, the flagstones slick beneath a rime of frost, and the only sound was the distant creak of a gate as the groundsman made his rounds. Arthur’s gaze lingered on the ledger and access logs arrayed before him, their columns of names and times as precise as the geometry of the sundial itself. The atmosphere was clinical, almost surgical in its scrutiny, but beneath it ran a current of menace—an awareness that the next finding might shift the entire balance of suspicion.

There was a note of unfinished business in the air, a tension carried over from the previous night’s confrontation. Arthur’s mind replayed the brittle exchange with Edward Marwood, the way Edward’s hand had trembled on his cigarette case, the word 'scandal' circled twice in his notebook. Now, as the first rays of sunlight struggled through the overcast sky, Arthur turned his attention to the access logs—thick, cream-colored pages marked in a clerk’s steady hand. He ran his gloved finger down the list of entries, noting the precise times at which the garden and sundial area had been unlocked and relocked. The logs were meticulous, but one pattern emerged with chilling clarity: only Edward Marwood’s name appeared in the columns for the critical hours. The authority to enter the garden unsupervised, to linger by the sundial or adjust any object there, belonged to Edward alone. The cold realization settled in Arthur’s chest like a stone.

Edward entered without knocking, his overcoat buttoned high against the cold, his breath visible in the dim light. 'You’re up early, Langley,' he said, voice clipped. 'I trust you’ve found something to occupy your time.' He glanced at the logs, then at Arthur, his gaze hardening as he registered the direction of the inquiry. Arthur did not rise. Instead, he gestured to the window, where the sundial’s silhouette loomed against the pale sky. 'I’ve been reviewing the estate’s records,' Arthur replied, his tone as dry as the winter air. 'It seems you alone had access to the garden and the sundial area during the hours in question. No one else’s name appears—no staff, no family, not even the groundsman.'

Edward’s jaw tightened, but he said nothing. The silence was heavy, broken only by the faint tick of the office clock and the echo of a distant footstep on the terrace. Arthur pressed on, his words measured: 'The logs are clear. If anyone could have placed or moved the watch, or manipulated the scene, it was you. The rest of the household was accounted for elsewhere, their access restricted.' The implication was unmistakable, and Edward’s composure faltered for the briefest instant—a flicker of fear, quickly masked by irritation. 'You’re making rather a lot of a few lines in a book, Langley. Access does not prove intent.'

Arthur allowed himself a thin smile. 'Intent is a matter for later. For now, I am interested in opportunity. The sundial’s shadow, the stopped watch—these are not accidents. The shadow’s length and direction at the time of discovery do not correspond to the hour claimed by the servants. The physical evidence contradicts the household’s timeline, and the only one with the means to arrange such a tableau was you.' He let the words hang, watching as Edward’s hands, usually so steady, curled into fists at his sides.

The conversation shifted as Arthur produced a second, identical watch from his pocket—a timepiece borrowed from the butler’s collection for the purpose of experiment. 'I’d like to show you something,' Arthur said, rising and leading Edward out to the Garden sundial area. The cold bit through their coats, the air heavy with the scent of damp stone and the faint, acrid odor of coal smoke drifting from the manor’s chimneys. Arthur set the watch on the sundial’s plinth, aligning it precisely as Edith Marwood’s had been found. The shadow, cast by the gnomon at forty-five degrees from the horizontal plane, fell across the watch face with mathematical precision. 'Observe,' Arthur murmured, noting the shadow’s position. 'The time marked is not what the household claims.'

Edward’s breath steamed in the morning air, and for a moment, his bravado faltered. 'Shadows are a poor witness, Langley. The weather changes, the sun shifts—' Arthur cut him off, voice crisp. 'The weather condition recorded in the estate’s log confirming shadow visibility was clear skies. The sundial’s shadow at the time the watch was found indicated half past three in the afternoon. Yet the actual time when the sundial’s shadow length indicates the murder must have occurred is twenty minutes past four in the afternoon. The contradiction is not a matter of chance.'

The experiment was repeated, Arthur adjusting the watch’s position and the angle of the gnomon, confirming the discrepancy at each step. Edward watched, silent now, his face set in grim lines. The evidence was irrefutable: the shadow’s measurements contradicted the servants’ timeline explicitly, and the access logs proved that only Edward could have orchestrated the scene. The original meaning of the sundial’s shadow had been a simple marker of time; now, its revised meaning was a silent accusation, a testament to deliberate manipulation.

Arthur’s theory shifted with the weight of the new evidence. The servants’ unity of testimony, once a shield, now appeared as a coordinated effort to protect someone with the authority to command their silence. The access logs, the shadow’s geometry, the stopped watch—all pointed to a single conclusion: the timeline had been staged, the evidence arranged by one with both motive and means. Edward’s authority over the estate, his exclusive access, and his mounting anxiety recast every earlier clue in a harsher light.

Yet even as the pressure mounted, Arthur caught a glimmer of relief in Edward’s eyes—a desperate hope that bluster and denial might yet carry the day. It was an ironic counterpoint to the menace of the morning, a reminder that the line between control and collapse is perilously thin. The investigation had reached a turning point: the theory of an accidental or opportunistic crime was overturned. What remained was the work of premeditation, of betrayal concealed beneath the rituals of order. Arthur turned back to the office, the cold pressing at his back, and jotted a final note: 'Access and opportunity—exclusive. Timeline: manipulated. Motive: concealed.' The winter sun struggled higher, but the shadows at Marwood Manor only deepened.
--- END PRIOR CHAPTER 6 ---

--- BEGIN PRIOR CHAPTER 7 ---
Title: Chapter 7: Clearing the Others
Beatrice Hargrave set her gloves down with a faint sigh, the sound nearly lost amid the muffled hush of Marwood Manor’s corridor. Afternoon sunlight, pale and filtered through frosted glass, cast long shadows along the wainscoting. The air was tinged with the scent of beeswax and the lingering cold that crept in from the wintry grounds. Arthur Langley paused by the archway, notebook in hand, his gaze flicking from Beatrice’s composed silhouette to the distant echo of voices in the Servants' Hall. The manor felt suspended—each room a stage, every occupant waiting for the next cue.

It was the pressure from the morning’s confrontation that lingered most: the brittle edge in Edward Marwood’s tone, the glimmer of hope in his eyes that denial might yet hold. Arthur let that tension settle in the silence, then cleared his throat, the sound sharp against the hush. 'Miss Hargrave, if you would.' He gestured toward the kitchen, where the afternoon’s light fell in a golden slant across the tiled floor. The kitchen’s warmth was a welcome contrast, the faint sound of water simmering and the aroma of bread rising in the air. Beatrice followed, her posture rigid but her face carefully neutral.

Arthur laid the kitchen access logs on the table, the pages crisp and faintly scented of ink. He traced a line with his finger: 'Here—your name, entered at half past three, and again at four. The staff confirm you remained until the supper bell.' He glanced up, watching for the flicker of relief or fear. Beatrice’s eyes widened, just for a moment, before she composed herself. 'I was preparing the table settings. Daphne can attest to that.' Her voice was steady, but Arthur caught the tremor in her hands as she reached for a teacup. The logs matched the testimonies—Beatrice’s presence in the kitchen was corroborated by multiple witnesses, her absence from the garden and sundial area beyond dispute.

A faint smile tugged at the corner of Arthur’s mouth. 'It seems your reputation for order is well deserved, Miss Hargrave.' The remark, delivered with dry wit, drew a brittle laugh from Beatrice. 'If only order were a guarantee of innocence, Mr. Langley. In this house, it seems more a shield than a virtue.' The moment of levity was brief, but it eased the tension, if only for a heartbeat. Arthur made a note: Beatrice’s alibi, confirmed by logs and servant testimony, stood unshaken.

He moved next to the Marwood Manor Library, where Charles Whitmore sat hunched over a stack of correspondence, the sound of a manual typewriter clacking in the background. The room was dim, the fire’s glow barely warming the air, and the scent of old vellum mingled with the acrid tang of typewriter ribbon. Arthur placed the household schedules before Charles, the paper rustling softly. 'You attended the town council meeting at four, did you not? The guest logs and household schedules confirm your absence from the manor at the relevant time.'

Charles adjusted his spectacles, his expression guarded. 'I was present at the meeting, yes. Several townsfolk can attest to that—and the minutes were filed by the clerk.' His voice was flat, but his fingers drummed a nervous rhythm on the arm of his chair. Arthur pressed: 'And you returned when?' Charles hesitated, then replied, 'Just before six. I signed the guest log myself.' The evidence was clear: Charles’s alibi was supported by external documentation and multiple witnesses. The solicitor’s anxiety, Arthur realized, was less about guilt than the fear of being ensnared by circumstance.

The investigation wound its way to the Servants' Hall, where Daphne Sinclair stood by the window, her hands folded neatly before her. The afternoon had grown colder, the light thinning as clouds gathered outside, and the faint sound of wind rattled the panes. Arthur greeted her with a nod. 'Miss Sinclair, the guest logs place you in the east wing, attending to the visiting relatives, during the critical hours. The surveillance notes confirm you did not enter the garden or the sundial area.'

Daphne’s composure was steadier than before, though her eyes flickered with residual worry. 'I was with the guests, sir, as the logs show. I never left the wing until the supper bell.' Her Yorkshire accent softened the words, but the conviction was unmistakable. Arthur cross-referenced the entries: the guest logs, the movement records, and his own observation all aligned. Daphne’s alibi, like the others, was watertight.

Yet beneath the relief that flickered in Daphne’s eyes, Arthur saw something else—a weariness born of weeks spent under suspicion, and a lingering fear that the truth, once revealed, might cost her more than her position. 'You’ve been thorough, Mr. Langley,' she said quietly, her voice edged with gratitude and exhaustion. 'I only hope the truth brings peace, not more trouble.'

Arthur gathered his notes, the weight of the evidence settling on his shoulders. The original meaning of the household’s unity had been one of solidarity, a bulwark against scandal. Now, its revised meaning was more troubling: a coordinated effort to shield the one with true opportunity. Each alibi, tested and confirmed, narrowed the circle of suspicion until only Edward Marwood remained unaccounted for. The betrayal lay not only in the crime itself, but in the deception woven through the household’s routines.

He paused in the corridor, the sound of a distant clock marking the hour. The winter afternoon was drawing to a close, the manor settling into its habitual rhythms, but Arthur felt the current of tension running deeper than ever. He caught sight of Beatrice lingering at the threshold, her relief poorly concealed by a show of brisk efficiency. 'You’ll forgive me, Mr. Langley, if I say I’m rather glad to be out of your crosshairs,' she quipped, her tone light but her eyes haunted. Arthur offered a wry smile in return. 'I suspect you’ll find the air less stifling now, Miss Hargrave.'

In the Library, Charles returned to his correspondence, the tension in his shoulders easing as Arthur’s scrutiny moved on. Daphne, in the Servants' Hall, allowed herself a rare moment of stillness, her hands unclenching as she watched the snow begin to drift past the window. The emotional cost of suspicion, Arthur realized, was not easily measured—but its relief, however fleeting, was palpable.

As Arthur made his way toward the Family Study, the evidence arranged itself with a clarity that was almost cruel. The kitchen logs, the guest records, the household schedules—all pointed away from the others and toward a single, unyielding conclusion. The focus of the investigation had shifted: the theory of a household conspiracy was overturned, replaced by the stark reality of a betrayal orchestrated by one with both motive and means.

Yet even as the circle closed, Arthur could not help but feel a pang of regret. The cost of truth, in this house, was measured not only in justice but in the wounds left behind. The afternoon light faded, the manor’s shadows lengthened, and Arthur prepared himself for the final confrontation—a reckoning shaped by deceit, loyalty, and the long memory of winter.
--- END PRIOR CHAPTER 7 ---

--- BEGIN PRIOR CHAPTER 8 ---
Title: Chapter 8: The Sundial Shadow Experiment
"Let us begin, if you please," Arthur Langley said, his voice cutting through the late afternoon hush that had settled over the Garden sundial area. The air was sharp with the cold, carrying the faint scent of damp stone and the distant echo of a bird’s call. Shadows stretched long across the frost-bitten flagstones, and a wintry glow filtered through the bare branches overhead. The tension was palpable as the household assembled, each face drawn and wary, the sunlight already thinning as dusk threatened at the edges of the sky.

Arthur’s gloved hand hovered over the identical watch he had borrowed from the butler’s collection, its polished face gleaming in the pale light. The sundial—its gnomon set at precisely forty-five degrees—stood sentinel at the heart of the garden, its stone surface rough beneath a dusting of frost. He glanced once at Edward Marwood, who stood apart, shoulders hunched, his breath visible with each exhale. The cold, the silence, and the expectation pressed in on all of them, but it was the unresolved pressure from the afternoon—regret and suspicion in equal measure—that lingered most for Arthur.

Beatrice Hargrave drew her coat tighter, her eyes flickering from Arthur to the sundial and back again. The sound of her silk scarf brushing against her collar was almost lost in the hush. Charles Whitmore shifted his weight, the crunch of gravel beneath his shoes a small, nervous counterpoint to the stillness. Daphne Sinclair, standing just behind Beatrice, folded her arms against the chill, her gaze fixed on the ground as if searching for answers in the pattern of moss between the stones.

Arthur cleared his throat, the sound crisp in the cold air. "We are here to resolve a contradiction," he announced, his tone clipped and precise. "The sundial’s shadow, the stopped watch, and the timeline described by the household cannot all be true. I intend to demonstrate, with this watch and the present sunlight, the hour marked by the shadow’s length and angle." He set the watch upon the sundial’s plinth, aligning it with deliberate care. The shadow, cast by the gnomon, fell across the face with mathematical certainty.

Edward’s eyes narrowed, and his jaw worked as if he were biting back a retort. Arthur noted the tension in Edward’s posture, the way his hands curled into fists in the pockets of his overcoat. The others watched in silence, breath steaming in the cold. Arthur adjusted the watch, then stepped back so all could see. "Observe the shadow," he said, his voice low. "The angle and length correspond not to the hour claimed by the household, but to a later time."

He waited, letting the silence stretch. The only sound was the faint whistle of wind through the bare branches and the distant creak of a garden gate. Arthur glanced at the assembled faces: Beatrice’s composure was brittle, her lips pressed in a line of concentration; Charles’s brow furrowed, his eyes darting between Arthur and Edward; Daphne’s hands trembled, though she tried to hide them in the folds of her skirt. The experiment’s result was unmistakable: the shadow, measured against the watch face, did not align with the servants’ timeline.

Arthur spoke again, his tone measured. "The weather condition recorded in the estate’s log confirming shadow visibility was clear skies. The sundial’s gnomon is set at forty-five degrees. The shadow at this hour falls precisely as it did on the day in question. The time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline, is half past three in the afternoon. Yet the actual time when the sundial’s shadow length indicates the murder must have occurred is twenty minutes past four in the afternoon." He let the facts hang in the cold air, unadorned and irrefutable.

Edward’s face paled, the bravado of earlier days slipping away. He looked not at Arthur, but at the sundial, as if searching for some flaw in the stone or the shadow it cast. His breath came faster, fogging in the chill. "This is absurd," he muttered, but the words lacked conviction. Arthur caught the flicker of fear in Edward’s eyes—a man confronted not by accusation, but by the slow, inexorable press of proof.

Beatrice broke the silence with a brittle laugh, the sound startling in the stillness. "Well, Mr. Langley, you do have a flair for the dramatic. Shall we all confess to being in two places at once?" Her attempt at levity was met with strained smiles, but Arthur saw the relief in her posture—a woman who knew, at last, that the weight of suspicion was shifting away from her. Charles, for his part, offered a curt nod, his relief tempered by the knowledge that the household’s unity had been fractured.

Daphne’s voice, soft and uncertain, broke through the tension. "But the logs—the routines—we all swore we saw her before sunset." She looked at Arthur, her eyes pleading for reassurance. Arthur met her gaze, his tone gentle but unyielding. "The evidence does not lie, Miss Sinclair. The shadow’s measurement, the ledger’s entries, the access logs—they speak with one voice, even if we do not."

Edward’s composure crumbled further. He turned away from the group, shoulders hunched, hands clenched at his sides. For a moment, Arthur thought Edward might speak—might confess or protest—but the words died on his lips. The silence that followed was heavy with implication, the experiment’s result as damning as any accusation.

Arthur allowed himself a brief, ironic smile. "If only all mysteries could be solved by a patch of sunlight and a reliable timepiece," he said, his dry wit drawing a faint, genuine laugh from Beatrice. The tension eased, if only for a moment, before settling once more into a deeper, more dangerous quiet. The experiment had done its work: the contradiction was exposed, the timeline shattered, and the circle of suspicion narrowed to a single, trembling point.

He gathered the watch, tucking it into his pocket with a deliberate motion. The cold bit through his gloves, but Arthur barely felt it. He surveyed the group—Beatrice’s relief, Charles’s wary acceptance, Daphne’s lingering fear, and Edward’s silent collapse. The household, once united in its rehearsed narrative, now stood divided by the clarity of the evidence.

As the last light of afternoon faded, Arthur turned to Edward, his voice low and final. "We will speak again, Mr. Marwood. There are questions only you can answer." The words were not a threat, but a promise. The experiment had not only invalidated the servants’ timeline; it had revealed the depth of the deception and the cost of loyalty misplaced.

The group dispersed slowly, the cold and the weight of revelation sending each to their own corner of the manor. Arthur lingered by the sundial, the rough stone cold beneath his hand. The shadow, now lengthening with the dying light, seemed to point not only to the hour, but to the truth itself—a truth that could no longer be denied. The experiment had isolated the last suspect, but the reckoning was yet to come.
--- END PRIOR CHAPTER 8 ---

# Case Overview
Title: The Sundial Shadow Conspiracy
Era: 1930s
Setting: Marwood Manor, Little Middleton, Yorkshire
Crime: murder (stabbing)
Culprit: Edward Marwood
Victim: Edith Marwood
False assumption: The victim was murdered shortly before sunset as all household servants consistently testified.
Cast: Edith Marwood (she/her), Arthur Langley (he/him), Beatrice Hargrave (she/her), Charles Whitmore (he/him), Daphne Sinclair (she/her), Edward Marwood (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Marwood Manor, Little Middleton, Yorkshire). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Marwood Manor, Little Middleton, Yorkshire" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Edith Marwood — she/her/her (NEVER he/him)
• Arthur Langley — he/him/his (NEVER she/her)
• Beatrice Hargrave — she/her/her (NEVER he/him)
• Charles Whitmore — he/him/his (NEVER she/her)
• Daphne Sinclair — she/her/her (NEVER he/him)
• Edward Marwood — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 9,
    "act": 3,
    "title": "Suspect Clearances",
    "setting": {
      "location": "Drawing room",
      "timeOfDay": "Early evening",
      "atmosphere": "Calm but expectant"
    },
    "characters": [
      "Arthur Langley",
      "Beatrice Hargrave",
      "Charles Whitmore",
      "Daphne Sinclair",
      "Edward Marwood"
    ],
    "purpose": "Officially clear all suspects except Edward using evidence and alibis",
    "cluesRevealed": [
      "clue_late_optional_slot_1",
      "clue_12"
    ],
    "dramaticElements": {
      "conflict": "Tensions ease as innocent parties are absolved",
      "tension": "Edward remains silent, visibly strained",
      "microMomentBeats": [
        "Edith quietly reflects on the tragedy, her grief tempered by justice"
      ]
    },
    "summary": "Langley presents evidence clearing Beatrice through kitchen logs and ledger analysis, Charles via household schedules and witness accounts, Daphne with guest logs and his own confirmation, and Edith by Edward’s study occupancy claim. The focus narrows solely on Edward Marwood.",
    "beat": "final_trap",
    "estimatedWordCount": 2000,
    "emotionalRegister": "Edward’s alibi collapses under scrutiny, culminating in a charged exposure of guilt.",
    "dominantCharacterNote": {
      "name": "Edith Marwood",
      "voiceRegister": "Edith speaks with measured calm and formal phrasing, her words deliberate and weighted with subtle irony."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Communication limited to domestic telephones on party lines and telegrams; Transportation mostly by petrol-powered automobiles and limited passenger trains; Manor estate access tightly controlled with strict visitor logs and locked areas; Manual typewriters and handwritten correspondence remain primary record-keeping methods; Short winter daylight hours restrict outdoor activity and investigation timing; Household schedules and social protocols constrain movement and interactions",
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
□ Mode check (False Suspect Clearing): suspect innocence is evidenced (not asserted) and suspicion shifts after clearing.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Edith Marwood        | she/her/her/herself       | [fill in]     | [yes/no]
  Arthur Langley       | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Hargrave    | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Whitmore     | he/him/his/himself        | [fill in]     | [yes/no]
  Daphne Sinclair      | she/her/her/herself       | [fill in]     | [yes/no]
  Edward Marwood       | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
