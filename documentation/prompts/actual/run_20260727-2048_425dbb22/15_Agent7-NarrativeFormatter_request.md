# Actual Prompt Record

- Run ID: `run_425dbb22-2e5e-4f39-86a6-7935a3c3830b`
- Project ID: `proj_8d84e7a9-9798-4656-8c29-73c856049d93`
- Timestamp: `2026-07-27T20:56:45.909Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `07728dc719f019c4`

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
**Title**: The Frosted Hourglass Mystery
**Era & Setting**: 1930s - Winthrope Manor Estate
**Setting Lock**: All scenes must remain within this setting: Winthrope Manor Estate. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: blunt force trauma with a heavy antique paperweight
**Victim**: Unknown
**Culprit**: Charles Montague
**Motive**: Unknown motive
**Method**: blunt force trauma with a heavy antique paperweight

## The False Assumption
The hourglass on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Inspector Helen Marwood
- **Suspect**: Margaret Hensley
- **Suspect**: Edward Winthrope
- **Suspect**: Clara Simmons
- **Suspect**: James Fletcher
- **Witness**: Lady Beatrice Winthrope
- **Witness**: Charles Montague

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The hourglass on the study mantelpiece contains minute frost crystals visible on the inner glass surface.**: The presence of frost crystals indicates condensation froze inside the hourglass, causing temporary blockage of sand flow. → Narrows the possible time of death to after the hourglass stopped flowing; eliminates assumptions about normal hourglass timing.
2. **A faint scratch on the study room window latch indicates it was left slightly ajar during the evening.**: A slightly open window allowed cold air in, lowering the room temperature enough to freeze moisture inside the hourglass. → Narrows access and opportunity to suspects with study room access and knowledge; eliminates suspects without study access.
3. **Witnesses agree the garden gate latched at half past six, but wind direction logs show a shift causing echo distortions at that time.**: The auditory perception of the gate latch time was misjudged due to environmental acoustics, invalidating the timeline based on gate sounds. → Eliminates James Fletcher from suspect pool based on faulty timing assumptions.
4. **Charles Montague was observed near the study shortly before half past seven and had motive due to blackmail threats from Lady Beatrice.**: Charles had both motive and opportunity within the corrected timeline of the murder after the hourglass stopped flowing. → Identifies Charles Montague as the narrowed prime suspect.

### The Discriminating Test
**Method**: constraint_proof
**Design**: A controlled temperature test is conducted by placing a sealed hourglass identical to the manor's in a cold room at forty-four degrees Fahrenheit and then warming it to room temperature to observe the delay of sand flow caused by frozen condensation, proving the hourglass reading was artificially delayed and invalidating the assumed time of death.
**Reveals**: The revealed facts are hourglas, study, and mantelpiece.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_1] temporal: The hourglass on the study mantelpiece contains minute frost crystals visible on the inner glass surface.
- [clue_2] temporal: The presence of frost crystals indicates condensation froze inside the hourglass, causing temporary blockage of sand flow.
- [clue_3] spatial: A faint scratch on the study room window latch indicates it was left slightly ajar during the evening.
- [clue_4] temporal: A slightly open window allowed cold air in, lowering the room temperature enough to freeze moisture inside the sealed hourglass.
- [clue_mechanism_visibility_core] temporal: The sealed hourglass on the study mantelpiece contained trapped moisture that condensed and froze overnight due to the cold room temperature.
- [clue_11] physical: At the body discovery scene, the victim has a fresh, bloodied head wound consistent with being struck by a heavy antique paperweight.
- [clue_core_contradiction_chain] temporal: The presence of frost crystals inside the hourglass explicitly overturns the false assumption that the hourglass ran its sand normally and accurately marked the time of death.

### Mid Clues (Act II)
- [clue_5] temporal: Witnesses agree the garden gate latched at half past six, but wind direction logs show a shift causing the latch sound to be delayed.
- [clue_6] temporal: The auditory perception of the gate latch time was misjudged due to environmental acoustics, invalidating the original timing assumption.
- [clue_7] temporal: Charles Montague was observed near the study shortly before half past seven and had motive due to blackmail threat from the victim.
- [clue_8] temporal: Charles had both motive and opportunity within the corrected timeline of the murder after the hourglass was blocked by frost.
- [clue_12] temporal: A controlled temperature test is conducted by placing a sealed hourglass identical to the manor's in a cold chamber, reproducing the frost and blockage.
- [clue_culprit_direct_charles_montague] temporal: Direct evidence ties Charles Montague to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_14] behavioral: Charles Montague uniquely possessed the knowledge and access to prepare the sealed hourglass with trapped moisture, unlike other suspects.
- [clue_15] behavioral: A blackmail threat from the victim to Charles Montague was found, indicating Charles’s premeditation and motive.
- [clue_16] testimonial: Eliminates Margaret Hensley because she was seen by multiple servants in the kitchen at the time of the murder, corroborated by household logs.
- [clue_17] testimonial: Eliminates Edward Winthrope because he was attending a meeting with witnesses at the manor’s library during the murder time.
- [clue_18] testimonial: Eliminates Clara Simmons because she was observed by several staff members preparing the dining room at the time of the murder.
- [clue_19] testimonial: Eliminates James Fletcher because he was seen by the gardener and stable hands at the far end of the grounds at the time of the murder.
- [clue_20] testimonial: Eliminates Margaret Hensley because multiple servants corroborate her presence in the kitchen, while Charles Montague had unique access and motive.
- [clue_core_elimination_chain] testimonial: Margaret Hensley is eliminated by servants’ testimony and alibi logs, focusing suspicion on Charles Montague as the only suspect with motive and opportunity.

### Late Clues (Act III)
- [clue_late_optional_slot_1] physical: A blood-stained glove found in the garden shrubbery late in the investigation suggests a hurried escape.

### Red Herrings
- [rh_1] The marked on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six, as confirmed by the consistent sand level.
- [rh_2] The completely on the mantelpiece shows no signs of beatrices or intact, indicating it ran normally throughout the evening.

---

## Key Constraints

### Temporal
- Half past six: Hourglass indicates death time
- Half past seven: Body discovered
- Quarter past six: Margaret Hensley last saw Lady Beatrice alive

### Access
- Charles Montague
- Margaret Hensley
- Edward Winthrope

---

## Era Details
- Early telephone technology
- Basic forensic toxicology and fingerprinting
- No modern digital technology
- Social hierarchies and formal etiquette at English country estates

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** constraint_proof
- **Required elements:** Execute the controlled temperature hourglass test, Observe the delayed sand flow caused by frozen condensation, Draw conclusion about the false elapsed time reading, Link test results to Charles Montague’s manipulation

### Suspect Clearance Scenes (REQUIRED)
- **James Fletcher**: Act 3, Scene 5
  - Method: Invalidation of auditory timeline by wind and echo analysis
  - Clues: Wind direction logs showing shift during evening, Servant testimony on gate latch confusion
- **Margaret Hensley**: Act 3, Scene 5
  - Method: Alibi matching servants' shift overlapping and personal attestations
  - Clues: Servants’ shift logs, Margaret’s testimony and demeanor analysis
- **Edward Winthrope**: Act 3, Scene 5
  - Method: Alibi confirmation via formal scheduled meetings
  - Clues: Estate meeting logs, Witness statements confirming Edward’s presence
- **Clara Simmons**: Act 3, Scene 5
  - Method: Kitchen attendance records and lack of study access
  - Clues: Kitchen logs, Access permissions
- **Lady Beatrice Winthrope**: Act 3, Scene 5
  - Method: Alibi confirmed: N/A

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with physical evidence and temporal contradiction exposed by hourglass test

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
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
- **Required elements:** Execute the controlled temperature hourglass test, Observe the delayed sand flow caused by frozen condensation, Draw conclusion about the false elapsed time reading, Link test results to Charles Montague’s manipulation

### Suspect Clearance Scenes (REQUIRED)
- **James Fletcher**: Act 3, Scene 5
  - Method: Invalidation of auditory timeline by wind and echo analysis
  - Clues: Wind direction logs showing shift during evening, Servant testimony on gate latch confusion
- **Margaret Hensley**: Act 3, Scene 5
  - Method: Alibi matching servants' shift overlapping and personal attestations
  - Clues: Servants’ shift logs, Margaret’s testimony and demeanor analysis
- **Edward Winthrope**: Act 3, Scene 5
  - Method: Alibi confirmation via formal scheduled meetings
  - Clues: Estate meeting logs, Witness statements confirming Edward’s presence
- **Clara Simmons**: Act 3, Scene 5
  - Method: Kitchen attendance records and lack of study access
  - Clues: Kitchen logs, Access permissions
- **Lady Beatrice Winthrope**: Act 3, Scene 5
  - Method: Alibi confirmed: N/A

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with physical evidence and temporal contradiction exposed by hourglass test

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
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
