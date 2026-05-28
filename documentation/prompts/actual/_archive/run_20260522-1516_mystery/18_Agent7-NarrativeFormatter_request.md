# Actual Prompt Record

- Run ID: `mystery-1779462962541`
- Project ID: `unknown`
- Timestamp: `2026-05-22T15:39:25.973Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `899953b38342d56d`

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
**Title**: The Clock's Deceit
**Era & Setting**: 1930s - Little Middleton
**Setting Lock**: All scenes must remain within this setting: Little Middleton. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: mechanical tampering
**Victim**: Unknown
**Culprit**: Dr. Mallory Finch
**Motive**: Unknown motive
**Method**: mechanical tampering

## The False Assumption
Eleanor Voss must have died just before the clock struck eleven.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Beatrice Quill
- **Suspect**: Captain Ivor Hale
- **Witness**: Eleanor Voss
- **Witness**: Dr. Mallory Finch

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The clock's hands are stuck at ten minutes past eleven.**: The clock must have been tampered with since it shouldn't be stuck. → Narrows the timeline of the murder.
2. **Witnesses recall Eleanor was seen alive at ten minutes to eleven.**: This contradicts the notion that she died at eleven. → Eliminates the assumption of timing and narrows the suspects' alibis.
3. **A small scratch on the clock casing indicates tampering.**: The clock's tampering must have been done recently. → Ties Dr. Mallory Finch to the scene due to his access.

### The Discriminating Test
**Method**: trap
**Design**: Comparing the clock's condition with the maintenance log reveals discrepancies in the clock's recent history.
**Reveals**: The clock was last serviced a week before the murder, contradicting claims of recent tampering.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_1] temporal: The clock's hands are stuck at ten minutes past eleven.
- [clue_2] temporal: Witnesses recall Eleanor was seen alive at ten minutes to eleven.
- [clue_3] contradiction: This contradicts the notion that she died at eleven.
- [clue_8] physical: A mechanical clock was tampered with to alter the perceived time of death.
- [clue_10] testimonial: Witnesses confirmed Eleanor was last seen alive shortly before the clock struck eleven.
- [clue_fp_contradiction_step_1] temporal: The clock's hands are stuck at ten minutes past eleven.

### Mid Clues (Act II)
- [clue_4] physical: A small scratch on the clock casing indicates tampering.
- [clue_5] contradiction: The clock's tampering must have been done recently.
- [clue_culprit_direct_dr_mallory_finch] behavioral: Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.
- [clue_6] testimonial: Eliminates Captain Ivor Hale because he was seen at the pub until eleven fifteen in the morning.
- [clue_7] temporal: Comparing the clock's condition with the maintenance log reveals discrepancies in the clock's recent history.
- [clue_9] behavioral: Dr. Mallory Finch expressed a desire to protect Eleanor from her husband.
- [clue_11] testimonial: Witnesses corroborated Eleanor's presence until shortly before eleven.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: Clock's last recorded time remains a late texture detail in the case background.

### Red Herrings
- [rh_2] Rumors suggest Eleanor was last seen with a drink in her hand, leading some to think she was poisoned.

---

## Key Constraints

### Temporal
- Clock's last recorded time
- Witness statements about timings
- 10:50 AM - 11:10 AM

### Access
- Dr. Mallory Finch
- Captain Ivor Hale
- Mechanical clock

---

## Era Details


---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** comparison
- **Required elements:** Execute the discriminating test, Analyze the clock's maintenance log, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Proving his alibi with witness statements.
  - Clues: clue_id_1, clue_id_2
- **Dr. Mallory Finch**: Act 3, Scene 6
  - Method: Demonstrating his access lagged behind the clock's tampering.
  - Clues: clue_id_3, clue_id_4
- **Eleanor Voss**: Act 3, Scene 6
  - Method: Alibi confirmed: none

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 7
- **Revelation method:** Confrontation with evidence from the clock.

### Identity Reference Rules
- **Eleanor Voss**:
  - Before reveal (Acts 1-2): "the victim"
  - After reveal (Act 3+): "Eleanor"

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Witness statement)
- **clue_10**: Act 1, Scene 3 (Witness statement)
- **clue_3**: Act 1, Scene 3 (Clock maintenance log)
- **clue_8**: Act 1, Scene 3 (Direct observation)


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


## PILLAR 4 — OUTLINE COMPLETENESS CONTRACT DATA

### Character Permitted Behaviours (use for permittedBehavioursByAct per scene)
- **Eleanor Voss**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The imminent threat posed by the victim's revelation about her past is a sword dangling over Eleanor's head, one that could sever the ties to her family's fortune and social standing—an outcome she simply cannot abide." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Haunted by the specter of her past, Eleanor grapples with guilt and fear, torn between the desire to preserve her reputation and the need to confront the truth that could liberate her." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Dr. Mallory Finch**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's impending expose of unethical practices within the local healthcare system threatens to tarnish Dr. Finch's reputation as a caring and progressive physician, a label she has fought hard to earn." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Caught between her ideals and the harsh realities of her upbringing, Dr. Finch grapples with the resentment she feels towards the wealthy, questioning whether she can truly make a difference in a world rife with inequality." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Captain Ivor Hale**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's threat to expose Ivor's past could shatter the image he has worked to maintain, a revelation that would not only tarnish his legacy but also sever the respect he has garnered from his peers." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is torn between the man he was and the man he has become, grappling with the shame of his past decisions while longing for redemption in a world that no longer feels like home." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Beatrice Quill**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's impending expose of dealings that could damage Beatrice's career presents a double-edged sword, as her own secrets hang precariously in the balance." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Caught between her ambition and the moral implications of her work, Beatrice struggles with the weight of her secrets, questioning whether her pursuit of success is worth the potential fallout." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.

### Red Herrings (must be seeded in Act I–II scenes via redHerringPlacement)
- **rh_2**: Rumors suggest Eleanor was last seen with a drink in her hand, leading some to think she was poisoned. (misdirection: This misleads by implying the drink is the cause of death, diverting attention from the clock's role.)
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
- **Test type:** comparison
- **Required elements:** Execute the discriminating test, Analyze the clock's maintenance log, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Proving his alibi with witness statements.
  - Clues: clue_id_1, clue_id_2
- **Dr. Mallory Finch**: Act 3, Scene 6
  - Method: Demonstrating his access lagged behind the clock's tampering.
  - Clues: clue_id_3, clue_id_4
- **Eleanor Voss**: Act 3, Scene 6
  - Method: Alibi confirmed: none

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 7
- **Revelation method:** Confrontation with evidence from the clock.

### Identity Reference Rules
- **Eleanor Voss**:
  - Before reveal (Acts 1-2): "the victim"
  - After reveal (Act 3+): "Eleanor"

### Clue Placement Guidelines
- **clue_1**: Act 1, Scene 1 (Direct observation)
- **clue_2**: Act 1, Scene 2 (Witness statement)
- **clue_10**: Act 1, Scene 3 (Witness statement)
- **clue_3**: Act 1, Scene 3 (Clock maintenance log)
- **clue_8**: Act 1, Scene 3 (Direct observation)


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
