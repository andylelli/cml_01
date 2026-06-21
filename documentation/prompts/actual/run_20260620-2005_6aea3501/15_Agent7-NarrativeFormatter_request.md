# Actual Prompt Record

- Run ID: `run_6aea3501-f039-4b40-bc33-78b25107ce8b`
- Project ID: `proj_5f4e668b-257b-4fed-87e4-90607f127ab3`
- Timestamp: `2026-06-20T20:09:20.832Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `b73ef70ec532029c`

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
**Title**: The Langley Clock Conundrum
**Era & Setting**: 1930s - Large country estate with late Victorian manor house
**Setting Lock**: All scenes must remain within this setting: Large country estate with late Victorian manor house. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: stabbing with false timeline alibi
**Victim**: Unknown
**Culprit**: John Avery
**Motive**: Unknown motive
**Method**: stabbing with false timeline alibi

## The False Assumption
The stopped manor clock’s displayed time accurately indicates the time of the murder.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Inspector Harold Finch
- **Suspect**: Clara Mitchell
- **Witness**: Margaret Langley
- **Witness**: Edward Langley
- **Witness**: John Avery

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.**: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. → Narrows suspect pool to those with access to clock mechanism, notably John Avery.
2. **A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped at ten minutes past eleven.**: The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating all alibis based on the stopped clock time. → Eliminates alibis dependent on clock time, focusing suspicion on those who could manipulate the clock.
3. **The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the true time of death inferred from clock tampering.**: Edward’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer. → Eliminates Edward Langley as suspect.
4. **Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, and he was responsible for winding clocks on the evening of the murder.**: John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window to commit the murder. → Identifies John Avery as the only suspect with motive, access, and opportunity.

### The Discriminating Test
**Method**: trap
**Design**: A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool marks, combined with cross-referencing the butler’s schedule against the stopped clock time, conclusively proves deliberate clock winding backward by John Avery, exposing his false alibi and opportunity to commit the murder.
**Reveals**: The butler’s premeditated clock tampering and manipulation of the timeline is irrefutably established, eliminating all other suspects and confirming his guilt.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_1] temporal: The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.
- [clue_2] temporal: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [clue_3] testimonial: A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.
- [clue_4] temporal: The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.
- [clue_mechanism_visibility_core] temporal: The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.
- [clue_servant_odd_ticking] temporal: The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.
- [clue_butler_schedule_conflict] temporal: The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.
- [clue_stable_log] temporal: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [clue_alibi_timing] testimonial: A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.
- [clue_margaret_alibi] temporal: The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.

### Mid Clues (Act II)
- [clue_5] temporal: The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.
- [clue_6] testimonial: Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer.
- [clue_7] temporal: Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.
- [clue_8] behavioral: John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.
- [clue_core_contradiction_chain] temporal: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [clue_11] physical: A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool reveals matching scratch patterns.
- [clue_12] temporal: John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.
- [clue_13] behavioral: John Avery’s personal notes reveal intentions to protect family secrets and maintain control over the estate, indicating motive and premeditation.
- [clue_14] testimonial: Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect.
- [clue_core_elimination_chain] testimonial: Eliminates Clara Mitchell because her whereabouts during the murder time are confirmed by servant logs and kitchen staff testimony, focusing suspicion on John Avery.
- [clue_15] temporal: The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene.
- [clue_culprit_direct_1] temporal: Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_culprit_direct_john_avery] physical: Direct evidence ties John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_clock_hands_scratches] behavioral: John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.
- [clue_pendulum_scratch] temporal: Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.
- [clue_servant_testimony] temporal: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [clue_kitchen_testimony] temporal: John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.
- [clue_cleaning_schedule] temporal: Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: Manor clock stopped at ten minutes past eleven remains a late texture detail in the case background.

### Red Herrings
- [rh_1] The manor displayed accurately at ten trusted past eleven, which matches the time servants reported hearing a scream, suggesting it accurately central.
- [rh_2] The manor timekeeper’s hands appear worn in a manner consistent with normal use, supporting the idea that the timekeeper estate servant at the time of the murder.

---

## Key Constraints

### Temporal
- Manor clock stopped at ten minutes past eleven
- Stable logbook records Edward Langley entering at half past eleven
- Butler’s schedule of clock winding from 9:30 to 11:15

### Access
- Butler John Avery
- Margaret Langley
- Edward Langley

---

## Era Details
- Radio common, early telephones in homes, no television, typewriters standard
- Fingerprinting standard, basic toxicology, ballistics analysis emerging
- Automobiles more reliable, passenger trains peak, early commercial aviation
- Telephone more common, telegrams faster, airmail available
- Great Depression impact, class tensions, fascism rising in Europe
- Professional detectives emerging, forensic science developing

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** trap
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Margaret Langley**: Act 3, Scene 5
  - Method: Alibi confirmed by multiple servants and schedule alignment
  - Clues: clue_margaret_alibi, clue_servant_testimony
- **Edward Langley**: Act 3, Scene 5
  - Method: Stable logbook entry disproves claimed alibi
  - Clues: clue_stable_log, clue_alibi_timing
- **Clara Mitchell**: Act 3, Scene 5
  - Method: Kitchen staff testimony confirms presence during murder
  - Clues: clue_kitchen_testimony, clue_cleaning_schedule

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with clock tampering evidence and schedule contradictions

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_alibi_timing**: Act 1, Scene 3 (Edward’s testimony and schedule)


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
- **Test type:** trap
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Margaret Langley**: Act 3, Scene 5
  - Method: Alibi confirmed by multiple servants and schedule alignment
  - Clues: clue_margaret_alibi, clue_servant_testimony
- **Edward Langley**: Act 3, Scene 5
  - Method: Stable logbook entry disproves claimed alibi
  - Clues: clue_stable_log, clue_alibi_timing
- **Clara Mitchell**: Act 3, Scene 5
  - Method: Kitchen staff testimony confirms presence during murder
  - Clues: clue_kitchen_testimony, clue_cleaning_schedule

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with clock tampering evidence and schedule contradictions

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_alibi_timing**: Act 1, Scene 3 (Edward’s testimony and schedule)


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

### Detective Entry (Police Inspector)
The police detective/inspector is summoned in an official capacity following a formal report of the crime. They arrive at the scene with full investigative authority. Act I opens with or shortly after their official arrival. Witnesses are expected to cooperate; the detective can compel access.

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



## CRITICAL: Follow Prose Requirements
**You MUST include the scenes specified in the "Prose Requirements" section at the exact act/scene positions indicated.**
- If a discriminating test scene is specified, that scene must appear at that position
- If suspect clearance scenes are specified, each must appear at their designated positions
- If a culprit revelation scene is specified, it must appear at that position
- Scene descriptions must mention the required elements and clues indicated
- These requirements are mandatory for story validation - missing them will cause generation failure

## Quality Guardrails (Must Satisfy)
1. Clue pacing requirement: at least 6 of 10 scenes must include non-empty cluesRevealed arrays.
2. Act clue distribution requirement: Act I >= 1 clue-bearing scenes, Act II >= 2, Act III >= 3.
3. Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.


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
