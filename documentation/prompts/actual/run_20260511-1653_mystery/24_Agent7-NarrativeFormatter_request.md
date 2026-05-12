# Actual Prompt Record

- Run ID: `mystery-1778518410355`
- Project ID: `unknown`
- Timestamp: `2026-05-11T17:00:34.009Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `2560eb10d008e3c4`

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
**Title**: The Clock Strikes Murder
**Era & Setting**: 1930s - Little Middleton
**Setting Lock**: All scenes must remain within this setting: Little Middleton. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: mechanical clock tampering
**Victim**: Unknown
**Culprit**: Captain Ivor Hale
**Motive**: Unknown motive
**Method**: mechanical clock tampering

## The False Assumption
The murder occurred at the time shown on the clock.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Beatrice Quill
- **Suspect**: Dr. Mallory Finch
- **Witness**: Eleanor Voss
- **Witness**: Captain Ivor Hale

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The clock in the library shows the time as nine-thirty.**: The clock was stopped and tampered with to mislead. → Eliminates the reliability of the clock as a time source.
2. **Witnesses report seeing Captain Hale in the garden at nine-forty-five.**: The timeline shows he could not have been in the library at the time of death. → Narrows the timeline of opportunity to Dr. Mallory Finch.
3. **The clock's time conflicts with the witness statements.**: The tampering of the clock indicates premeditated deceit. → Narrows suspects to Captain Hale and Dr. Finch.

### The Discriminating Test
**Method**: trap
**Design**: The discriminating test compares clock, account, and library against the claimed timeline.
**Reveals**: The revealed facts are the tampered clock and conflicting witness statements.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_mechanism_visibility_core] temporal: The mechanism relies on the clock's tampering to mislead the timeline of events.
- [clue_core_contradiction_chain] temporal: The clock was stopped and tampered with to mislead.
- [clue_1] temporal: The clock in the library shows the time as nine-thirty.
- [clue_fp_contradiction_step_3] temporal: The mechanism relies on the clock's tampering to mislead the timeline of events.

### Mid Clues (Act II)
- [clue_core_elimination_chain] testimonial: Eliminates Dr. Mallory Finch because he was seen in the town at the time of the murder.
- [clue_2] testimonial: Witnesses report seeing Captain Hale in the garden at nine-forty-five.
- [clue_3] temporal: The timeline shows he could not have been in the library at the time of death.
- [clue_4] temporal: The clock's time conflicts with the witness statements.
- [clue_5] behavioral: Captain Ivor Hale had financial motives for Eleanor's death.
- [clue_6] physical: Scratch marks on the clock's winding mechanism suggest tampering.
- [clue_7] testimonial: Beatrice Quill corroborates Hale's alibi.
- [clue_8] temporal: The clock was found stopped just before Eleanor's body was discovered.
- [clue_9] behavioral: Captain Hale was seen acting suspiciously in the hours leading up to the murder.
- [clue_10] testimonial: Dr. Mallory Finch was attending a medical conference during the time of the murder.
- [clue_culprit_direct_captain_ivor_hale] temporal: Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.
- [clue_fp_contradiction_step_3_2] temporal: The clock's time conflicts with the witness statements.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: The clock stopped just before Eleanor's body was found. remains a late texture detail in the case background.

### Red Herrings
None

---

## Key Constraints

### Temporal
- The clock stopped just before Eleanor's body was found.
- Witnesses claim to have seen Captain Hale in the garden.
- Eleanor was last seen at 9:00 PM.

### Access
- Captain Ivor Hale
- Dr. Mallory Finch
- The clock in the library

---

## Era Details


---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** timing test
- **Required elements:** Execute the discriminating test, Observe the clock's time against a reliable source, Draw conclusion about Hale's guilt

### Suspect Clearance Scenes (REQUIRED)
- **Dr. Mallory Finch**: Act 3, Scene 5
  - Method: Her medical report time shows she was attending to Eleanor.
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Eleanor is the victim.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence of the tampered clock.

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_1**: Act 1, Scene 3 (Direct observation of the clock.)
- **clue_fp_contradiction_step_3**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_core_elimination_chain**: Act 2, Scene 1 (Corroborated elimination)


---

## Quality Bar
- Scene purposes must be specific and progression-driving, not generic transitions.
- Clue reveal and clue usage must be temporally separated to preserve fair play.
- Character presence should reflect motive/access logic from CML constraints.

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
- **Length**: short (20 scenes, targeting a novella of ~15,000–25,000 words)
- **Style**: classic (Golden Age detective fiction style - puzzle-focused, rational deduction, restrained prose, emphasis on fair play clues)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** timing test
- **Required elements:** Execute the discriminating test, Observe the clock's time against a reliable source, Draw conclusion about Hale's guilt

### Suspect Clearance Scenes (REQUIRED)
- **Dr. Mallory Finch**: Act 3, Scene 5
  - Method: Her medical report time shows she was attending to Eleanor.
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Eleanor is the victim.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence of the tampered clock.

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_1**: Act 1, Scene 3 (Direct observation of the clock.)
- **clue_fp_contradiction_step_3**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_core_elimination_chain**: Act 2, Scene 1 (Corroborated elimination)


## Scene Construction Guidelines

**CRITICAL — Scene count is FIXED:** You MUST produce EXACTLY **10 scenes** total: **3 in Act I**, **5 in Act II**, **2 in Act III**. No more, no fewer. Count your scenes before submitting.

### Act I: Setup (exactly 3 scenes)
- **Introduce the crime**: Discovery of victim, initial shock
- **Establish setting**: Era atmosphere, location details
- **Meet the cast**: Detective, suspects, witnesses
- **Plant early clues**: Subtle hints, initial observations
- **Support false assumption**: Lead reader toward wrong conclusion
- **End with**: Detective commits to investigation, stakes established

### Detective Entry (MANDATORY — Amateur / Civilian)
The amateur investigator has no official standing. Act I MUST establish, organically and plausibly:
- **Why they were already present** (invited guest, local resident, stranded traveller, visiting relative) OR what specific event drew them in after the crime
- **Why they are uniquely placed to investigate** despite having no authority (specialist knowledge, the victim's prior confidence in them, access to spaces or people the police can't reach socially)
- **Their uneasy relationship with authority**: the official police (if present) may be dismissive, obstructive, or actively suspicious of their involvement. Other characters may refuse to cooperate.
NEVER write the amateur as automatically welcomed or respected. Their involvement must be earned scene by scene.

### Act II: Investigation (exactly 5 scenes)
- **Interview scenes**: Suspects reveal information, alibis, motives
- **Clue discovery**: Physical evidence, testimonies, constraints
- **Red herrings**: Misdirection supporting false assumption
- **Character development**: Relationships, conflicts, secrets
- **Discriminating test**: The crucial scene that shifts everything
- **Rising tension**: Complications, dead ends, breakthroughs
- **End with**: Detective has all pieces but hasn't assembled them

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
❌ Scene 12: "Detective finds pendulum note" + "Detective confronts suspect with note"
❌ Scene 15: "Detective discovers clock tampering" + "Detective immediately tests suspect"  
❌ Act III Scene 1: "Detective reveals premeditation knowledge reader never saw"

**CORRECT SEQUENCING:**
✅ Scene 8: "Detective finds pendulum note" (clue revealed to reader)
✅ Scene 9-10: Investigation continues, other suspects interviewed
✅ Scene 11: "Detective studies clock mechanism" (processing/analysis)
✅ Scene 12: "Detective stages discriminating test using pendulum knowledge" (test using revealed clue)
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

## CRITICAL: Character Names in Scenes
In every scene's "characters" array, use the **EXACT character names** from the "Cast of Characters" section above.
**NEVER** use role labels such as "detective", "butler", "suspect", "constable", "witness" — these are placeholder examples in the JSON schema, not real names.
Every string in a scene's characters array must be a proper name that appears in the Cast of Characters.

## CRITICAL: No Invented Police Officials
This story has a **civilian amateur** as the detective. Do NOT invent named police officials (no "Inspector [Surname]", no "Constable [Surname]", no "Sergeant [Surname]") anywhere in scene summaries, purposes, or dramaticElements. The only named characters are those in the Cast of Characters above. If police must appear, describe them anonymously: "a local constable", "the sergeant", "officers from the village". Any invented police name will be scrubbed automatically and will confuse the prose LLM.


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
