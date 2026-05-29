# Actual Prompt Record

- Run ID: `mystery-1779998607579`
- Project ID: `unknown`
- Timestamp: `2026-05-28T20:10:51.183Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `8f0f6b167e422538`

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
**Title**: The Wound-Back Pendulum Mystery
**Era & Setting**: 1930s - Voss Manor House
**Setting Lock**: All scenes must remain within this setting: Voss Manor House. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: mechanical clock tampering causing false death time
**Victim**: Unknown
**Culprit**: Dr. Mallory Finch
**Motive**: Unknown motive
**Method**: mechanical clock tampering causing false death time

## The False Assumption
The grandfather clock’s stopped time accurately marks the victim’s time of death at ten minutes past eleven.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Eleanor Voss
- **Suspect**: Captain Ivor Hale
- **Suspect**: Beatrice Quill
- **Witness**: Dr. Mallory Finch

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The grandfather clock’s pendulum suspension spring shows a slight deformation and oily residue inconsistent with normal maintenance.**: The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time. → Narrows the time of death window; invalidates reliance on the clock’s stopped time.
2. **Servants report hearing thirteen chimes at midnight, an impossible occurrence for the manor clock.**: The clock’s chimes are inconsistent with normal operation, indicating tampering and unreliable timekeeping. → Eliminates the accepted timeline based on the clock’s chimes, tightening temporal constraints.
3. **A watch found on the victim’s desk stopped at twenty past midnight, conflicting with the clock’s stopped time.**: The victim’s personal watch indicates a later time of death than the manor clock, supporting the conclusion that the clock was running slow. → Eliminates suspects whose alibis cover the time before twenty past midnight, specifically Captain Ivor Hale and Beatrice Quill.
4. **Stable hands report seeing an unusual visitor near the stables after the supposed time of death based on the clock.**: An unauthorized presence at the manor grounds at the true time of death, inconsistent with Captain Hale’s claimed presence and the false timeline. → Narrows suspect opportunity to those present around actual midnight, implicating Dr. Mallory Finch.
5. **Dinner plates found in the kitchen show no signs of having been used during the assumed time of death based on the clock.**: The assumed time for the evening meal is incorrect, supporting the corrected later timeline of death. → Eliminates Beatrice Quill’s motive based on meal schedule and confirms timing shift.

### The Discriminating Test
**Method**: trap
**Design**: A controlled comparison of the manor clock’s pendulum suspension spring with a reference spring under identical conditions reveals the deformation and oily residue that slow the pendulum’s swing. Concurrently, a public recounting of the servants’ thirteen chimes and the victim’s stopped wristwatch time exposes the contradiction in the timeline. This trap forces Dr. Mallory Finch to confront the physical impossibility of her alibi based on the false clock time.
**Reveals**: Exposes the clock tampering mechanism and disproves Dr. Finch’s alibi by showing the clock’s hands lag behind actual time, revealing her presence at the manor during the true time of death.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_1] physical: The grandfather clock’s pendulum suspension spring shows a slight deformation and oily residue inconsistent with normal wear.
- [clue_2] temporal: The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time by forty minutes.
- [clue_3] testimonial: Servants report hearing thirteen chimes at midnight, an impossible occurrence for the manor clock which normally chimes twelve times.
- [clue_4] temporal: The clock’s chimes are inconsistent with normal operation, confirming tampering and unreliable timekeeping.
- [clue_mechanism_visibility_core] physical: The murderer physically tampered with the grandfather clock’s pendulum suspension spring, applying a slight deformation and an oily lubricant residue.

### Mid Clues (Act II)
- [clue_5] physical: A watch found on the victim’s desk stopped at twenty past midnight, conflicting with the grandfather clock’s stopped time of ten minutes past eleven.
- [clue_6] temporal: The victim’s personal watch indicates a later time of death than the manor clock, supporting the corrected timeline over the clock’s stopped time.
- [clue_7] testimonial: Stable hands report seeing an unusual visitor near the stables after the supposed time of death based on the clock’s stopped time.
- [clue_8] temporal: An unauthorized presence at the manor grounds at the true time of death contradicts Captain Ivor Hale’s claimed timeline.
- [clue_9] physical: Dinner plates found in the kitchen show no signs of having been used during the assumed time of death, indicating the evening meal time was earlier than supposed.
- [clue_10] temporal: The assumed time for the evening meal is incorrect, supporting the corrected later timeline of death rather than the false earlier timeline.
- [clue_core_contradiction_chain] temporal: The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time, invalidating the clock’s stopped time as the time of death.
- [clue_core_elimination_chain] testimonial: Eliminates Captain Ivor Hale because stable hand testimony and clock chiming inconsistencies corroborate his absence from the manor grounds at the true time of death, narrowing suspicion toward Dr. Mallory Finch.
- [clue_11] physical: A controlled comparison of the manor clock’s pendulum suspension spring with a reference spring under identical conditions reveals the manor clock’s spring has been altered.
- [clue_12] behavioral: A blackmail threat from the victim’s estate manager to Dr. Mallory Finch is found, showing premeditation and motive.
- [clue_13] testimonial: Eliminates Beatrice Quill because kitchen utensil logs and servants’ testimony confirm her absence from the manor during the corrected time of death.
- [clue_14] testimonial: Eliminates Captain Ivor Hale because stable hand testimony and clock chiming inconsistencies corroborate his absence, narrowing the solution toward Dr. Mallory Finch.
- [clue_15] physical: Dr. Mallory Finch’s unique trace of oily lubricant on the pendulum suspension spring matches a preparation detail known only to him, linking him to the tampering.
- [clue_culprit_direct_dr_mallory_finch] physical: Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: Clock stopped at ten minutes past eleven remains a late texture detail in the case background.

### Red Herrings
- [rh_1] The grandfather grandfather’s stopped time at ten minutes past eleven is supported by the butler’s log noting the grandfather stopped at that exact time with no disturbances.
- [rh_2] Servants recall the grandfather accurately’s stopped time at ten minutes past eleven as the last time they saw the accurately functioning normally before the murder.

---

## Key Constraints

### Temporal
- Clock stopped at ten minutes past eleven
- Servants heard thirteen chimes at midnight
- Victim’s wristwatch stopped at twenty past midnight

### Access
- Dr. Mallory Finch
- Captain Ivor Hale
- Beatrice Quill

---

## Era Details
- Mechanical clocks are common and well-understood
- Forensic science includes fingerprinting and ballistics
- Social hierarchy and etiquette strictly govern manor life
- No modern technology beyond telephones and early radios

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** trap
- **Required elements:** Execute the controlled comparison of pendulum springs, Present servants’ testimony of thirteen chimes, Show victim’s wristwatch stopped time contradiction, Conclude Dr. Finch’s alibi is invalid

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Stable hands’ testimony and consistent alibi during corrected timeline
  - Clues: Stable hand testimony of unusual visitor distinct from Hale, Hale’s presence in stables 10:00 to 11:30
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Unused dinner plates and kitchen activity logs confirm alibi during corrected timeline
  - Clues: Unused dinner plates at assumed meal time, Beatrice’s kitchen presence 9:45 to 11:15
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Library presence and no contradictions in timing
  - Clues: Eleanor’s alibi in library 10:00 to midnight, No evidence contradicting her timeline

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with clock tampering evidence, servants’ testimonies, and victim’s wristwatch time

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_mechanism_visibility_core**: Act 1, Scene 3 (Direct observation)


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

## CANONICAL LOCKED FACTS — Honour Verbatim in All Scenes
The following values are ground truth from the hard-logic device. Every scene summary and time reference MUST use these exact values (word form, not digits). Do not invent different clock times or quantities.

- **clock_reading**: "ten minutes past eleven" — The exact time shown on the stopped clock face
- **tamper_amount**: "forty minutes" — The exact amount the clock was wound back
- **chime_count**: "thirteen" — The number of chimes heard at midnight, an impossible count


## PILLAR 4 — OUTLINE COMPLETENESS CONTRACT DATA

### Character Permitted Behaviours (use for permittedBehavioursByAct per scene)
- **Eleanor Voss**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A - Investigator" — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Haunted by her secret knowledge of the family document, Eleanor struggles with the fear that revealing it might shatter the fragile peace of the household—or worse, betray a trust long held sacred." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Dr. Mallory Finch**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Stands to lose her unofficial position and access to the family if a new heir gains control; victim planned to replace her with an outsider." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch wrestles with the conflict between her Hippocratic duty to do no harm and the personal grudges that color her view of the family’s power struggles. The fear of losing her place fuels a quiet bitterness that she struggles to contain." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Captain Ivor Hale**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Stands to inherit the estate if the victim, who planned to cut him out, is removed; murder chosen over legal battle which he fears losing." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hale struggles with the tension between loyalty to the family that rejected him and the ambition that drives him to desperate acts. His rigid discipline clashes with the chaos of his concealed identity and the moral cost of his choices." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Beatrice Quill**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears losing her lucrative position and facing disgrace if victim exposed her theft; considered bribery but felt murder was safer given the victim’s resolve." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Her ambition clashes with guilt and fear, creating a tension between her calculated self-preservation and the moral cost of her actions. She battles the risk of exposure and the desire to rise socially, each feeding her anxiety." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.

### Red Herrings (must be seeded in Act I–II scenes via redHerringPlacement)
- **rh_1**: The grandfather grandfather’s stopped time at ten minutes past eleven is supported by the butler’s log noting the grandfather stopped at that exact time with no disturbances. (misdirection: This misleads by relying on official logs without considering physical stopped and ignores the oily residue and deformation which reveal the true mechanism.)
- **rh_2**: Servants recall the grandfather accurately’s stopped time at ten minutes past eleven as the last time they saw the accurately functioning normally before the murder. (misdirection: This misleads by emphasizing witness memory over physical evidence, ignoring the impossible thirteen marks and the victim’s minutes stopped eleven.)
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
- **Test type:** trap
- **Required elements:** Execute the controlled comparison of pendulum springs, Present servants’ testimony of thirteen chimes, Show victim’s wristwatch stopped time contradiction, Conclude Dr. Finch’s alibi is invalid

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Stable hands’ testimony and consistent alibi during corrected timeline
  - Clues: Stable hand testimony of unusual visitor distinct from Hale, Hale’s presence in stables 10:00 to 11:30
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Unused dinner plates and kitchen activity logs confirm alibi during corrected timeline
  - Clues: Unused dinner plates at assumed meal time, Beatrice’s kitchen presence 9:45 to 11:15
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Library presence and no contradictions in timing
  - Clues: Eleanor’s alibi in library 10:00 to midnight, No evidence contradicting her timeline

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with clock tampering evidence, servants’ testimonies, and victim’s wristwatch time

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Cross-check contradiction)
- **clue_mechanism_visibility_core**: Act 1, Scene 3 (Direct observation)


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
          "estimatedWordCount": 1800,
          "pivotElement": "The stopped pocket watch found in the victim's hand — still showing ten past eleven",
          "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis",
          "permittedBehavioursByAct": [{ "characterName": "[EXACT NAME]", "behaviour": "[permitted behaviour for this act from Character Permitted Behaviours above]" }],
          "redHerringPlacement": { "redHerringId": "rh_1", "placementDetail": "[how the red herring is seeded: which character, what they say or do, what false impression is created]" }
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

## SCENE COMPLETENESS CONTRACT (Pillar 4 — MANDATORY)

For EVERY scene you MUST fill these additional fields:

**pivotElement** (required, all scenes): A specific concrete physical element (object, detail, observation) the scene turns on. Not a plot summary — a tangible thing.
  ✗ Bad: "investigation continues" / "characters discuss the case" / "more evidence found"
  ✓ Good: "The stopped pocket watch found still ticking at ten past eleven"

**factEstablished** (required, all scenes): The specific new fact the reader knows or has eliminated by scene end. Name the epistemic change.
  ✗ Bad: "more clues emerge" / "investigation advances"
  ✓ Good: "Establishes that the accused was not at their claimed location before the stated time — their alibi collapses"

**permittedBehavioursByAct** (required, all scenes): For each named character present, copy their permitted behaviour for this act from the Character Permitted Behaviours section in your context.
  Format: [{ "characterName": "[Character Name]", "behaviour": "[permitted behaviour for this act from Character Permitted Behaviours above]" }]

**redHerringPlacement** (required, Act I and Act II scenes only):
  - If planting a red herring: { "redHerringId": "rh_1", "placementDetail": "[Character] mentions [misleading detail] — seeds false inference about [topic]" }
  - If Act I or II but no red herring planted this scene: null
  - Act III scenes: omit this field entirely (do NOT include it in Act III scene objects)

By the end of Acts I and II every red herring ID listed in your context must appear in at least one scene's redHerringPlacement.
```
