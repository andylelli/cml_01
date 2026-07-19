# Actual Prompt Record

- Run ID: `run_cdcf28d9-b08b-429d-bc7a-d50f3da66bd3`
- Project ID: `proj_60ea64d0-8bbf-4c6a-a528-7798eeaafb92`
- Timestamp: `2026-07-17T20:08:48.997Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `385a88044b5572e0`

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
**Title**: The Sundial’s Silent Hour at Stanhope Manor
**Era & Setting**: 1930s - Stanhope Manor Estate
**Setting Lock**: All scenes must remain within this setting: Stanhope Manor Estate. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: stabbing with letter opener
**Victim**: Unknown
**Culprit**: Charles Stanhope
**Motive**: Unknown motive
**Method**: stabbing with letter opener

## The False Assumption
The victim was seen alive precisely at quarter past two by multiple witnesses, confirmed by the sundial’s shadow.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Inspector Harold Bramwell
- **Suspect**: Margaret Lyle
- **Suspect**: James Archer
- **Suspect**: Beatrice Collins
- **Suspect**: Dr. Philip Marsh
- **Witness**: Lady Evelyn Stanhope
- **Witness**: Charles Stanhope

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The sundial’s surface near the garden shows no shadow mark at quarter past two despite witness claims.**: A dense cloud bank at that moment prevented the sundial from casting any shadow, invalidating the claimed time. → Narrows victim’s time of death to before quarter past two, eliminating suspects relying on the later timeline.
2. **The library clock pendulum has scratch marks inside the casing and the clock’s time lags real time by about fifteen minutes before accelerating.**: The pendulum was impeded deliberately, causing the clock to show an inaccurate time and creating a false timeline for alibis. → Eliminates suspects whose alibis depend on the clock’s displayed time after 2:00.
3. **Servant ledger entries for shifts between 1:30 and 3:30 show overlapping times with inconsistent handwriting and ink.**: The ledger was altered with rounding errors and overlapping shifts to support the false timeline and cover for the suspect’s absence. → Narrows opportunity window, confirming Charles Stanhope’s presence in the garden before quarter past two, eliminating others with alibis in ledger.
4. **Charles Stanhope uniquely possesses knowledge of clock mechanisms and had opportunity to tamper with the library clock pendulum latch.**: Only Charles could engineer the mechanical interference creating the false timeline. → Identifies Charles Stanhope as the only suspect with means to manipulate physical timekeeping devices.

### The Discriminating Test
**Method**: constraint_proof
**Design**: A timed comparison is staged between the manor’s library clock and an external time standard using the sundial during a replicated cloudless afternoon. The test demonstrates the clock’s fifteen-minute lag caused by the pendulum latch mechanism and the sundial’s inability to cast shadows under cloud cover. This exposes the false timeline asserted by Charles Stanhope and disproves his alibi.
**Reveals**: The mechanical interference with the clock pendulum latch caused the false time display, and the cloud cover eliminated the sundial’s shadow, invalidating witness timelines.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_1] testimonial: The sundial’s surface near the garden shows no shadow mark at quarter past two despite witness claim.
- [clue_core_contradiction_chain] temporal: A dense cloud bank at that moment prevented the sundial from casting any shadow, invalidating the claimed time.
- [clue_3] temporal: The library clock pendulum has scratch marks inside the casing and the clock’s time lags real time by several minutes.
- [clue_4] temporal: The pendulum was impeded deliberately, causing the clock to show an inaccurate time and creating a false timeline.
- [clue_mechanism_visibility_core] temporal: A brief but dense cloud cover at quarter past two erased the sundial’s shadow, making witnesses mistakenly believe Lady Evelyn was alive at that time.
- [clue_11] physical: At the body-discovery scene, the victim has a puncture wound consistent with being stabbed by a letter opener; blood pooling is visible and the victim’s garment is torn near the wound.

### Mid Clues (Act II)
- [clue_5] temporal: Servant ledger entries for shifts between one thirty in the morningand three thirty in the morningshow overlapping times with inconsistent handwriting styles.
- [clue_6] temporal: The ledger was altered with rounding errors and overlapping shifts to support the false timeline and mislead the investigation.
- [clue_7] temporal: Charles Stanhope uniquely possesses knowledge of clock mechanisms and had opportunity to tamper with the library clock.
- [clue_8] temporal: Only Charles could engineer the mechanical interference creating the false timeline, as no other suspect had his skill or access.
- [clue_12] temporal: A timed comparison is staged between the manor’s library clock and an external time standard using the inspector’s pocket watch.
- [clue_13] temporal: Charles Stanhope’s unique knowledge and access allowed him to prepare the brief dense cloud cover alibi by timing the sundial’s shadow disappearance.
- [clue_14] behavioral: Charles Stanhope uniquely had the means, skill, and access to execute the concealment mechanism involving the clock and sundial, unlike other suspects.
- [clue_15] behavioral: Financial pressure and political disagreements visible in Charles Stanhope’s correspondence indicate premeditation.
- [clue_16] testimonial: Eliminates Margaret Lyle because her alibi from one thirty in the morningto three thirty in the morningis corroborated by multiple servants and ledger entries.
- [clue_17] testimonial: Eliminates James Archer because his clock mechanism observations and sundial knowledge place him away from the scene at the time.
- [clue_18] testimonial: Eliminates Beatrice Collins because her witness statements and weather journal confirm she was outside the manor grounds during the murder.
- [clue_19] testimonial: Eliminates Dr. Philip Marsh because medical reports and timing of injury confirm he was attending another patient at the murder time.
- [clue_core_elimination_chain] testimonial: Eliminates Margaret Lyle because ledger entries and servant testimonies corroborate her presence away from the crime scene, narrowing the solution toward Charles Stanhope.
- [clue_20] temporal: A dense cloud bank at quarter past two prevented the sundial from casting any shadow, invalidating the claimed time and supporting the false timeline correction.
- [clue_21] temporal: Timed comparison between the manor’s library clock and an external time standard confirms the clock lags behind real time due to pendulum interference.
- [clue_22] physical: Faint footprints on damp garden soil near the sundial suggest recent presence but do not match Margaret Lyle’s shoes.
- [clue_culprit_direct_charles_stanhope] temporal: Direct evidence ties Charles Stanhope to the mechanism access point before the discriminating test and excludes competing suspect timelines.

### Late Clues (Act III)
None

### Red Herrings
- [rh_1] Multiple witnesses claim the victim was seen alive precisely at quarter past two, supported by the precisely’s apparent quarter.
- [rh_2] James Archer’s observations of the sundials’s testimonies at quarter past two seem to confirm the victim’s presence alive at that time.

---

## Key Constraints

### Temporal
- Quarter past two sundial shadow disappearance
- Library clock pendulum obstruction between 1:45 and 3:00
- Servants’ ledger shift times from 1:30 to 4:00

### Access
- Charles Stanhope
- Margaret Lyle
- James Archer

---

## Era Details
- No modern technology beyond 1930s standards
- Forensic methods limited to fingerprinting and basic toxicology
- Social hierarchy and household protocol strictly enforced
- Physical laws and mechanical clocks behave as known in the 1930s

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** constraint_proof
- **Required elements:** Execute the timed comparison between the manor clock and the sundial under replicated conditions, Observe the clock lag and sundial shadow absence, Draw conclusion about Charles Stanhope’s guilt

### Suspect Clearance Scenes (REQUIRED)
- **Margaret Lyle**: Act 3, Scene 5
  - Method: Confirmed alibi by multiple servants and ledger consistency
  - Clues: Servant ledger with overlapping shifts and mismatched ink, Housekeeper Margaret Lyle’s control over staff schedules
- **James Archer**: Act 3, Scene 5
  - Method: Alibi confirmed by witness statements and timing constraints
  - Clues: Butler James Archer’s testimony on clock’s irregular ticking, Displaced clock weights found unevenly hanging
- **Beatrice Collins**: Act 3, Scene 5
  - Method: Alibi verified through nursery records and weather journal
  - Clues: Witness statements, Weather journal noting fleeting cloud cover
- **Dr. Philip Marsh**: Act 3, Scene 5
  - Method: Medical report timing excludes opportunity
  - Clues: Medical report, Timing of injury
- **Lady Evelyn Stanhope**: Act 3, Scene 5
  - Method: Alibi confirmed: N/A
  - Clues: Charles Stanhope’s familiarity with clock mechanisms

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with mechanical clock tampering evidence and sundial shadow contradiction

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Witness statement)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_11**: Act 1, Scene 3 (Direct observation)
- **clue_3**: Act 1, Scene 3 (Direct observation)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)


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
- **Required elements:** Execute the timed comparison between the manor clock and the sundial under replicated conditions, Observe the clock lag and sundial shadow absence, Draw conclusion about Charles Stanhope’s guilt

### Suspect Clearance Scenes (REQUIRED)
- **Margaret Lyle**: Act 3, Scene 5
  - Method: Confirmed alibi by multiple servants and ledger consistency
  - Clues: Servant ledger with overlapping shifts and mismatched ink, Housekeeper Margaret Lyle’s control over staff schedules
- **James Archer**: Act 3, Scene 5
  - Method: Alibi confirmed by witness statements and timing constraints
  - Clues: Butler James Archer’s testimony on clock’s irregular ticking, Displaced clock weights found unevenly hanging
- **Beatrice Collins**: Act 3, Scene 5
  - Method: Alibi verified through nursery records and weather journal
  - Clues: Witness statements, Weather journal noting fleeting cloud cover
- **Dr. Philip Marsh**: Act 3, Scene 5
  - Method: Medical report timing excludes opportunity
  - Clues: Medical report, Timing of injury
- **Lady Evelyn Stanhope**: Act 3, Scene 5
  - Method: Alibi confirmed: N/A
  - Clues: Charles Stanhope’s familiarity with clock mechanisms

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with mechanical clock tampering evidence and sundial shadow contradiction

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Witness statement)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_11**: Act 1, Scene 3 (Direct observation)
- **clue_3**: Act 1, Scene 3 (Direct observation)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)


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
1. Return a valid narrative_outline artifact that strictly matches required schema fields and types.
2. Schema fix required: acts[1].scenes[2].dramaticElements is required
3. Clue pacing requirement: at least 6 of 10 scenes must include non-empty cluesRevealed arrays.
4. Act clue distribution requirement: Act I >= 1 clue-bearing scenes, Act II >= 2, Act III >= 3.
5. Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.


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
9. beat: "final_trap" — The Final Trap — staged confrontation/decisive, deduction-led proof (NOT a confession as the proof); the culprit exposes themselves through knowledge or reaction and is named on-page; end ready to explain.
10. beat: "revelation" — The Revelation — aftermath-dominant close: with the culprit already exposed in the final trap, tie off which clues mattered and why the false solution was wrong WITHOUT re-staging the accusation or confession; refer to the culprit by name in retrospect; end on the emotional/social aftermath.
The culprit must already be present by beat "crime". The false_solution beat must accuse an innocent suspect. "final_trap" must be deduction-led (no confession as the proof), and "revelation" must NOT re-stage the accusation or confession — it ties off the explanation and aftermath.


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
