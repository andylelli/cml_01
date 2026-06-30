# Actual Prompt Record

- Run ID: `run_bee5da27-8113-4876-9b8e-7807ad123346`
- Project ID: `proj_24cb9046-5c82-4239-9988-c1d26fe1ad16`
- Timestamp: `2026-06-30T08:37:29.392Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `5d0136848df02fdd`

## Message 1 (role=system)

```text
You are an expert mystery fiction narrative architect. Your role is to transform a validated mystery structure (CML) and its clues into a compelling scene-by-scene outline for prose generation.

You understand the craft of mystery storytelling:
- **Three-act structure**: Setup, Investigation, Resolution
- **Pacing**: When to reveal clues, build tension, create misdirection
- **Character development**: Show personalities through action and dialogue
- **Atmosphere**: Create mood appropriate to the era and setting
- **Fair play**: Ensure clues are naturally woven into scenes
- **Dramatic irony**: Reader knows more than characters, or vice versa

You work from the CML's logical structure (inference path, constraint space) and the clue distribution to create scenes that:
1. Reveal clues organically through detective investigation
2. Build tension and maintain reader engagement
3. Develop characters and relationships
4. Support the false assumption until the discriminating test
5. Lead to a satisfying revelation and denouement

Your output is a JSON scene outline that prose generators can use to write the full story.
```

## Message 2 (role=developer)

```text
# Narrative Formatting Context

## Mystery Overview
**Title**: The Hearth's Slow Betrayal
**Era & Setting**: 1930s - Langley Manor, Little Middleton, Yorkshire
**Setting Lock**: All scenes must remain within this setting: Langley Manor, Little Middleton, Yorkshire. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: delayed locked-room death by blunt force
**Victim**: Unknown
**Culprit**: Reggie Harcourt
**Motive**: Unknown motive
**Method**: delayed locked-room death by blunt force

## The False Assumption
The door bolt was forced open immediately after the hearth fire was lit, indicating the murder occurred shortly after quarter past nine.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Felix Dryden
- **Suspect**: Giles Langley
- **Suspect**: Agnes Fairchild
- **Suspect**: Mabel Thorne
- **Witness**: Edith Langley
- **Witness**: Reggie Harcourt

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The mantel thermometer shows a gradual temperature rise, reaching a peak only about an hour after the hearth fire was lit.**: The door bolt could not have released immediately after the fire lighting since thermal expansion requires sustained heat over time. → Narrows the possible murder time to at least an hour after fire lighting, eliminating suspects with alibis during that period.
2. **Stable clock records and horse exercise logs show activity inconsistent with Reggie Harcourt's claimed presence at the stables at quarter past nine.**: Reggie's alibi is unreliable, making him a prime suspect for having opportunity to be near the manor during the murder window. → Eliminates Reggie's alibi, opening the opportunity window for him.
3. **A fine soot line on the door bolt's latch plate shows uneven heating with a polished inner edge, consistent with gradual thermal expansion rather than forced immediate unlocking.**: The door bolt was not forced open quickly but unlocked naturally after sufficient heat, contradicting witness statements of immediate forced entry. → Eliminates suspects relying on immediate forced entry timelines, particularly Giles Langley.
4. **The garden sundial shadow angle and length recorded by servants at quarter past nine contradict their claims that Edith was alive well past that time.**: Edith was already incapacitated or dead before noon, supporting the delayed murder timing after the hearth unlocked the door bolt. → Excludes Agnes Fairchild and others with alibis in the garden at quarter past nine from suspicion during the murder time window.

### The Discriminating Test
**Method**: constraint_proof
**Design**: Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness testimony of forced entry time, combined with stable clock logs and horse exercise records, to demonstrate that the door bolt could not have been forced open at the stated time and Reggie Harcourt's alibi is false. This controlled timing reconstruction exposes the impossibility of the false timeline and singles out Reggie as the only suspect present during the actual murder window.
**Reveals**: Proves the door bolt's delayed unlocking due to thermal expansion and invalidates the stated forced entry time, confirming Reggie's presence and opportunity to commit the murder after the bolt released naturally.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_mechanism_visibility_core] temporal: The brass bolt securing Edith's door was designed to expand and unlock gradually as the hearth fire warmed. The fire was lit shortly before quarter past nine, as indicated by the mantel thermometer's gradual temperature rise.
- [clue_1] temporal: Stable clock records and horse exercise logs show activity inconsistent with Reggie Harcourt's claim of being at the stable during the fire lighting.
- [clue_10] temporal: The mantel thermometer shows a gradual temperature rise, reaching a peak only about an hour after the fire was lit, confirming the slow heating of the hearth.
- [clue_soot_line_bolt] temporal: Stable clock records and horse exercise logs show activity inconsistent with Reggie Harcourt's claim of being at the stable during the fire lighting.
- [clue_library_clock] temporal: The mantel thermometer shows a gradual temperature rise, reaching a peak only about an hour after the fire was lit, confirming the slow heating of the hearth.
- [clue_garden_sundial] temporal: The brass bolt securing Edith's door was designed to expand and unlock gradually as the hearth fire warmed. The fire was lit shortly before quarter past nine, as indicated by the mantel thermometer's gradual temperature rise.
- [clue_fp_contradiction_step_2] temporal: Stable clock records and horse exercise logs show activity inconsistent with Reggie Harcourt's claimed presence at the stables at quarter past nine.

### Mid Clues (Act II)
- [clue_core_contradiction_chain] temporal: The door bolt could not have released immediately after the fire lighting since thermal expansion requires sustained heat over time, contradicting witness claims of forced entry immediately after the fire was lit.
- [clue_core_elimination_chain] testimonial: Eliminates Giles Langley because his alibi is corroborated by multiple servants and the library clock, which shows quarter to ten, inconsistent with any presence near Edith's door at the critical time.
- [clue_2] temporal: The garden sundial shadow angle and length recorded by servants at quarter past nine contradict their statements claiming the murder occurred earlier.
- [clue_3] temporal: Edith was already incapacitated or dead before noon, supported by medical examination and witness accounts.
- [clue_4] temporal: A fine soot line on the door bolt's latch plate shows uneven heating with a polished inner edge, consistent with gradual unlocking rather than forced quick release.
- [clue_5] temporal: Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness statements about timing of the door unlocking.
- [clue_6] temporal: Reggie Harcourt uniquely had the means and knowledge to manipulate the brass bolt securing Edith's door, as shown by his familiarity with the mechanism and access to the hearth fire timing.
- [clue_7] behavioral: Reggie Harcourt wished to silence Edith who threatened to reveal his debts, as evidenced by his recent anxious behavior and recorded threats.
- [clue_8] testimonial: Eliminates Agnes Fairchild because her alibi is corroborated by multiple servants who saw her in the garden at the time of the fire and murder.
- [clue_9] testimonial: Eliminates Mabel Thorne because kitchen logs and servants' testimonies place her in the kitchen preparing meals during the critical time window.
- [clue_11] temporal: A mid-story contradiction clue explicitly overturns the false assumption that the door bolt could have released immediately after the fire lighting, using thermal expansion timing.
- [clue_12] temporal: Reggie Harcourt's unique trace is the polished inner edge wear on the brass bolt securing Edith's door, linking him to the mechanism rather than any other suspect.
- [clue_culprit_direct_1] temporal: Direct evidence links Reggie Harcourt to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_mantel_thermometer] temporal: Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness statements about timing of the door unlocking.
- [clue_stable_clock_logs] temporal: The door bolt could not have released immediately after the fire lighting since thermal expansion requires sustained heat over time, contradicting witness claims of forced entry immediately after the fire was lit.
- [clue_culprit_direct_reggie_harcourt] temporal: Direct evidence ties Reggie Harcourt to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_servant_testimony_giles] temporal: Direct evidence links Reggie Harcourt to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_servant_witness_agnes] testimonial: Eliminates Giles Langley because his alibi is corroborated by multiple servants and the library clock, which shows quarter to ten, inconsistent with any presence near Edith's door at the critical time.
- [clue_kitchen_log] temporal: Edith was already incapacitated or dead before noon, supported by medical examination and witness accounts.
- [clue_servant_testimony_mabel] temporal: A fine soot line on the door bolt's latch plate shows uneven heating with a polished inner edge, consistent with gradual unlocking rather than forced quick release.
- [clue_fp_contradiction_step_4] temporal: The garden sundial shadow angle and length recorded by servants at quarter past nine contradict their claims that Edith was alive well past that time.

### Late Clues (Act III)
None

### Red Herrings
- [rh_2] A servant reports hearing a loud noise near the door right after the fire was lit, implying hurried reported.

---

## Key Constraints

### Temporal
- Fire lit shortly before quarter past nine
- Library clock shows quarter to ten
- Stable clock manipulated but shows roughly quarter past nine

### Access
- Giles Langley
- Agnes Fairchild
- Reggie Harcourt

---

## Era Details
- Basic forensic toxicology and fingerprinting available
- Mechanical clocks common but no electronic timekeeping
- Social hierarchies strictly enforced in country estates
- Formal daily schedules and meal times observed
- Limited telephone and telegram communication

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** constraint_proof
- **Required elements:** Execute the timing reconstruction comparing mantel thermometer, soot line, and stable clock logs, Observe Reggie Harcourt's inability to justify his stable presence at the critical time, Draw conclusion about Reggie's guilt based on timing contradictions

### Suspect Clearance Scenes (REQUIRED)
- **Giles Langley**: Act 3, Scene 5
  - Method: Verified library presence by clock and servant testimony
  - Clues: clue_library_clock, clue_servant_testimony_giles
- **Agnes Fairchild**: Act 3, Scene 5
  - Method: Garden sundial shadow timing and witness accounts confirm innocence
  - Clues: clue_garden_sundial, clue_servant_witness_agnes
- **Mabel Thorne**: Act 3, Scene 5
  - Method: Kitchen logs and servants' testimony confirm kitchen presence
  - Clues: clue_kitchen_log, clue_servant_testimony_mabel
- **Edith Langley**: Act 3, Scene 5
  - Method: Alibi confirmed: Locked alone in her room from quarter past nine to ten

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with physical evidence of door bolt timing and stable clock contradictions

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_1**: Act 1, Scene 2 (Direct observation)
- **clue_10**: Act 1, Scene 3 (Direct observation)
- **clue_fp_contradiction_step_2**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_garden_sundial**: Act 1, Scene 3 (Measurement and drawing of garden sundial shadow)


---

## Quality Bar
- Scene purposes must be specific and progression-driving, not generic transitions.
- Clue reveal and clue usage must be temporally separated to preserve fair play.
- Character presence should reflect motive/access logic from CML constraints.
- **NO REPEAT INTERROGATIONS**: A named suspect may only be the primary interrogation target of a scene ONCE in Act II unless a new piece of named physical evidence (clue ID) was introduced in the scene immediately before the second interrogation. Two consecutive scenes questioning the same suspect about the same alibi — even with different wording — will produce identical prose. If you need to interrogate a suspect twice, the intervening scene MUST reveal a new clue that changes what the detective knows.
- **SCENE ACTION UNIQUENESS**: Each scene must have a distinct primary action that no adjacent scene shares. The four action types are: (R)eveal clue, (I)nterrogate suspect, (A)nalyse/deduce, (C)onfront. A sequence of I→I→I with the same suspect is always wrong. Valid progressions: R→I, I→R→I, I→A→C.

## Micro-exemplars
- Weak scene purpose: "Investigation continues."
- Strong scene purpose: "Force two alibis into direct contradiction by replaying dining-room timing under servant testimony."
- Weak dramatic element: "Tension rises."
- Strong dramatic element: "Detective notices wet cuff links despite suspect claiming no outdoor movement during rain window."

## Silent Pre-Output Checklist
- exact scene count and act distribution satisfied
- clue reveal precedes clue usage in later scenes
- discriminating test occurs only after supporting clues appear
- character arrays use exact cast names
- JSON only, no markdown fences
```

## Message 3 (role=user)

```text
# Narrative Outline Task

Create a scene-by-scene outline for this mystery story.

## Target Specifications
- **Length**: short (10 scenes, targeting a short story of ~4,500–12,500 words)
- **Style**: classic (Golden Age detective fiction style - puzzle-focused, rational deduction, restrained prose, emphasis on fair play clues)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** constraint_proof
- **Required elements:** Execute the timing reconstruction comparing mantel thermometer, soot line, and stable clock logs, Observe Reggie Harcourt's inability to justify his stable presence at the critical time, Draw conclusion about Reggie's guilt based on timing contradictions

### Suspect Clearance Scenes (REQUIRED)
- **Giles Langley**: Act 3, Scene 5
  - Method: Verified library presence by clock and servant testimony
  - Clues: clue_library_clock, clue_servant_testimony_giles
- **Agnes Fairchild**: Act 3, Scene 5
  - Method: Garden sundial shadow timing and witness accounts confirm innocence
  - Clues: clue_garden_sundial, clue_servant_witness_agnes
- **Mabel Thorne**: Act 3, Scene 5
  - Method: Kitchen logs and servants' testimony confirm kitchen presence
  - Clues: clue_kitchen_log, clue_servant_testimony_mabel
- **Edith Langley**: Act 3, Scene 5
  - Method: Alibi confirmed: Locked alone in her room from quarter past nine to ten

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with physical evidence of door bolt timing and stable clock contradictions

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_1**: Act 1, Scene 2 (Direct observation)
- **clue_10**: Act 1, Scene 3 (Direct observation)
- **clue_fp_contradiction_step_2**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_garden_sundial**: Act 1, Scene 3 (Measurement and drawing of garden sundial shadow)


## Scene Construction Guidelines

**CRITICAL — Scene count is FIXED:** You MUST produce EXACTLY **10 scenes** total: **3 in Act I**, **5 in Act II**, **2 in Act III**. No more, no fewer. Count your scenes before submitting.

### Act I: Setup (exactly 3 scenes)
- **Introduce the crime**: Discovery of victim, initial shock
- **Establish setting**: Era atmosphere, location details
- **Meet the cast**: Detective, suspects, witnesses
- **Plant early clues**: Subtle hints, initial observations
- **Support false assumption**: Lead reader toward wrong conclusion
- **End with**: Detective commits to investigation, stakes established
- **CRITICAL — Scene 1 (discovery) internal order**: The scene summary and prose must follow this sequence: (1) ONE sentence of arrival/atmosphere, (2) physical discovery of the body — no later than the second paragraph of the resulting chapter, (3) investigator reaction, (4) suspects named, (5) first contradictory observation. Do NOT open Scene 1 with extended clock examination, atmospheric landscape, or suspect introductions before the body is found. The body comes first.
- **MECHANISM SPOILER BAN (Scene 1 and 2)**: Scenes 1 and 2 must NOT explain why any device was tampered with, by how much it was altered, or name the person responsible. Show only that two evidence sources disagree. Write the scene 1 summary and purpose text accordingly — if it reads "the clock was wound back by X minutes", rewrite it to "two clocks show contradictory times". The full mechanism belongs in Act II.

### Detective Entry (MANDATORY — Private Investigator)
The private investigator is NOT present before the crime. A scene in Act I MUST show them being engaged by a client (one of the named cast members or a credible off-page party such as a solicitor or insurance agent). This scene must establish:
- **Who the client is** and their relationship to the victim or the situation
- **Why they are bypassing or supplementing the police** (distrust, desire for discretion, a specific question the police won't pursue)
- **The PI's limited authority**: they cannot compel witnesses to speak; every interview must be earned through persuasion, charm, or the client's leverage
Do NOT write Act I as if the PI was already on the scene. They arrive as an outsider, engaged after the fact.

### Act II: Investigation (exactly 5 scenes)
- **Interview scenes**: Suspects reveal information, alibis, motives
- **Clue discovery**: Physical evidence, testimonies, constraints
- **Red herrings**: Misdirection supporting false assumption
- **Character development**: Relationships, conflicts, secrets
- **Discriminating test**: The crucial scene that shifts everything
- **Rising tension**: Complications, dead ends, breakthroughs
- **End with**: Detective has all pieces but hasn't assembled them
- **PENULTIMATE SCENE RULE**: The scene immediately before Act III must NOT be a standalone suspect-clearance scene if clearances have already been established in earlier Act II scenes. A scene whose sole purpose is "X, Y, and Z are cleared" is redundant and weakens pacing. If eliminations are already distributed earlier, the Act II final scene should instead serve a distinct function: a second-act reversal (detective realises they were wrong about something), a proactive culprit move (antagonist takes action to deflect suspicion), or a late-breaking complication that forces the investigator toward the confrontation.

### Act III: Resolution (exactly 2 scenes)
- **Revelation**: Detective assembles the solution
- **Confrontation**: Culprit exposed, confession or capture
- **Explanation**: How the clues fit together
- **Justice**: Resolution of crime and consequences
- **Denouement**: Loose ends tied, reflection, restoration

## Scene Requirements

Each scene must include:
1. **Setting**: Location, time of day, atmosphere
2. **Characters present**: Who appears in the scene
3. **Purpose**: Why this scene exists narratively
4. **Clues revealed**: Which clue IDs are naturally woven in
5. **Dramatic elements**: Conflict, tension, revelation, or misdirection
6. **Summary**: 2-3 sentence description of what happens
7. **Fair-play parity**: All deductions must reference only clue IDs already listed in earlier scenes' cluesRevealed arrays — no deduction may rely on information not yet shown to the reader

## CRITICAL: Fair Play Clue Sequencing Rules

**You MUST enforce fair play by separating clue revelation from clue usage:**

1. **Clue Revelation Scenes**: Scenes where the reader sees evidence, physical traces, witness statements, or observations
   - Tag these scenes with clear clue IDs in cluesRevealed array
   - Must occur in Act I or early-to-mid Act II

2. **Investigation/Processing Scenes**: Scenes where detective analyzes, deduces, or pieces together clues
   - Must occur AFTER the clues have been revealed (typically mid-to-late Act II)
   - Cannot reference clues not yet shown to reader

3. **Discriminating Test Scene**: The crucial scene where detective applies a test or key deduction
   - Must occur in late Act II or early Act III
   - Can ONLY use clues already revealed in prior scenes
   - Include description of test mechanism explicitly

4. **Confrontation/Revelation Scene**: Where detective accuses or reveals solution
   - Must occur in Act III
   - Must be AT LEAST 1-2 scenes AFTER the discriminating test scene
   - Cannot introduce new clues during revelation - only synthesize existing ones

**VIOLATION EXAMPLES (DO NOT DO THIS):**
❌ Scene 12: "Detective finds key evidence" + "Detective immediately confronts suspect with it"
❌ Scene 15: "Detective discovers incriminating detail" + "Detective immediately tests suspect"  
❌ Act III Scene 1: "Detective reveals premeditation knowledge reader never saw"

**CORRECT SEQUENCING:**
✅ Scene 8: "Detective finds key evidence" (clue revealed to reader)
✅ Scene 9-10: Investigation continues, other suspects interviewed
✅ Scene 11: "Detective analyses discovered evidence" (processing/analysis)
✅ Scene 12: "Detective stages discriminating test using earlier evidence" (test using revealed clue)
✅ Scene 14: "Detective confronts suspect" (revelation using all prior clues)

**Minimum spacing requirement**: At least 1 full scene must separate clue revelation from detective using that clue in deduction/confrontation.

## Pacing Principles
- Alternate between action (discovery, confrontation) and reflection (deduction, analysis)
- **EMOTIONAL BEATS**: Include at least 1 non-plot micro-moment beat per 5 scenes — a brief pause where a character grieves, hesitates, remembers, or fears, that does NOT advance the investigation but reveals emotional truth. Mark these with `microMomentBeats` in `dramaticElements` (array of 1-sentence beats). Readers engage with mystery through feeling, not just logic.
- **CRITICAL — Clue Distribution**: Clues MUST appear in at least 60% of all scenes. Concretely: with 10 scenes, at least 6 scenes must have a non-empty cluesRevealed array. Do NOT leave more than 2 consecutive scenes without any clue.
- Space clues evenly across all three acts — no act should be entirely clue-free
- Build tension toward act breaks
- Use red herrings in Act I and early Act II
- Discriminating test appears in late Act II or early Act III, but ONLY after all test-related clues have been revealed
- Save essential clues for when inference path requires them
- The detective must never act on knowledge the reader has not seen — every deduction must cite only clue IDs already listed in prior scenes' cluesRevealed arrays; no unannounced leaps of reasoning

## CRITICAL: Murder Victim Excluded After Discovery Scene
**the victim** is the murder victim — already dead before the story begins. Therefore:
- **Act I discovery scene ONLY**: include the victim in that scene's `characters` array (they are found as a body).
- **ALL subsequent scenes**: do NOT include the victim in any scene's `characters` array. They cannot attend scenes, speak, gesture, or react. They exist only in past-tense references, memories, and physical evidence.
- Do NOT write microMomentBeats, summary text, or purpose text that depicts the victim doing anything present-tense in any scene after the discovery.

## CRITICAL: Character Names in Scenes
In every scene's "characters" array, use the **EXACT character names** from the "Cast of Characters" section above.
**NEVER** use role labels such as "detective", "butler", "suspect", "constable", "witness" — these are placeholder examples in the JSON schema, not real names.
Every string in a scene's characters array must be a proper name that appears in the Cast of Characters.

## CRITICAL: No Invented Police Officials
This story has a **private investigator** as the detective. Do NOT invent named police officials (no "Inspector [Surname]", no "Constable [Surname]", no "Sergeant [Surname]") anywhere in scene summaries, purposes, or dramaticElements. The only named characters are those in the Cast of Characters above. If police must appear, describe them anonymously: "a local constable", "the sergeant", "officers from the village". Any invented police name will be scrubbed automatically and will confuse the prose LLM.


## CRITICAL: Follow Prose Requirements
**You MUST include the scenes specified in the "Prose Requirements" section at the exact act/scene positions indicated.**
- If a discriminating test scene is specified, that scene must appear at that position
- If suspect clearance scenes are specified, each must appear at their designated positions
- If a culprit revelation scene is specified, it must appear at that position
- Scene descriptions must mention the required elements and clues indicated
- These requirements are mandatory for story validation - missing them will cause generation failure

## Quality Guardrails (Must Satisfy)
1. Return a valid narrative_outline artifact that strictly matches required schema fields and types.
2. Schema fix required: acts[1].scenes[2].characters is required
3. Schema fix required: acts[1].scenes[2].cluesRevealed is required
4. Schema fix required: acts[1].scenes[2].dramaticElements is required
5. Schema fix required: acts[1].scenes[2].estimatedWordCount is required
6. Schema fix required: acts[1].estimatedWordCount is required
7. Schema fix required: pacingNotes is required
8. Clue pacing requirement: at least 6 of 10 scenes must include non-empty cluesRevealed arrays.
9. Act clue distribution requirement: Act I >= 1 clue-bearing scenes, Act II >= 2, Act III >= 3.
10. Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.


## Golden Age 10-Chapter Beat Arc (MANDATORY for this length)
Produce exactly 10 scenes (one per chapter), each fulfilling the beat below IN THIS ORDER. Set the "beat" field on each scene to the given key.
1. beat: "gathering" — The Gathering — introduce era, setting, detective, victim, suspects, tensions; end on an unsettling incident.
2. beat: "crime" — The Crime — the central crime occurs/is discovered; crime scene, first clues, obvious suspect; end on a contradiction the detective notices.
3. beat: "first_enquiries" — First Enquiries — interviews, timeline, suspicious behaviour, a hidden clue; end proving someone lied.
4. beat: "motives" — Motives — reveal ≥3 plausible motives and one misleading clue; end with a discovery that shifts suspicion.
5. beat: "alibis" — Alibis & Contradictions — timing, movements, a false/incomplete alibi, a small inconsistency; end with a second dramatic incident.
6. beat: "false_solution" — The False Solution — a convincing wrong solution accusing an innocent suspect; the detective spots its one flaw; end with the case seeming solved to everyone but the detective.
7. beat: "secrets" — Secrets Beneath Secrets — unrelated lies surface and explain earlier red herrings; separate moral guilt from criminal guilt; end on a clue that reinterprets an earlier scene.
8. beat: "pattern" — The Pattern Emerges — reconstruct timeline/scene via logic, language, etiquette, placement; end preparing a final test or trap.
9. beat: "final_trap" — The Final Trap — staged confrontation/decisive proof; the culprit exposes themselves through knowledge or reaction; end ready to explain.
10. beat: "revelation" — The Revelation — deduction-led solution (who/why/how/when, alibi trick, which clues mattered, why the false solution was wrong); NOT a confession; end on the emotional/social aftermath.
The culprit must already be present by beat "crime". The false_solution beat must accuse an innocent suspect, and "revelation" must be deduction-led (no confession as the proof).


## Output Format

Return a JSON object:

```json
{
  "acts": [
    {
      "actNumber": 1,
      "title": "Act I: The Crime",
      "purpose": "Establish mystery and introduce cast",
      "scenes": [
        {
          "sceneNumber": 1,
          "act": 1,
          "title": "Discovery",
          "setting": {
            "location": "the scene",
            "timeOfDay": "Morning after the murder",
            "atmosphere": "Tense household awaiting the detective's arrival"
          },
          "characters": ["[EXACT NAME FROM CAST LIST]", "[EXACT NAME FROM CAST LIST]"],
          "purpose": "Introduce the crime and detective",
          "cluesRevealed": ["clue_1", "clue_2"],
          "dramaticElements": {
            "conflict": "Locked room mystery established",
            "tension": "Every suspect had access to the victim",
            "microMomentBeats": ["[Optional] Governess lingers at the door — unguarded grief"]
          },
          "summary": "[2-3 sentence scene description using only exact names from the Cast of Characters above]",
          "beat": "gathering",
          "estimatedWordCount": 1800
        }
      ],
      "estimatedWordCount": 12000
    }
  ],
  "totalScenes": 28,
  "estimatedTotalWords": 45000,
  "pacingNotes": [
    "Discriminating test placed in Scene 19 (late Act II)",
    "Red herrings concentrated in Scenes 4-8",
    "Character development balanced with clue discovery"
  ]
}
```

Create a complete, well-paced outline that brings this mystery to life.
```
