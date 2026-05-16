# Actual Prompt Record

- Run ID: `mystery-1778689279748`
- Project ID: `unknown`
- Timestamp: `2026-05-13T16:26:13.267Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `b37151ee608c8fd7`

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
**Title**: The Clockwork Conundrum
**Era & Setting**: 1930s - Little Middleton, Yorkshire
**Setting Lock**: All scenes must remain within this setting: Little Middleton, Yorkshire. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: timed execution
**Victim**: Unknown
**Culprit**: Dr. Mallory Finch
**Motive**: Unknown motive
**Method**: timed execution

## The False Assumption
The murder must have occurred shortly after Eleanor showed signs of distress.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Dr. Mallory Finch
- **Witness**: Eleanor Voss
- **Witness**: Captain Ivor Hale
- **Witness**: Beatrice Quill

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The clock in the study shows the hands pointing to quarter past seven.**: This contradicts the wall clock showing eight o'clock when Eleanor was found. → Narrows the timeline of events leading to the murder.
2. **A half-opened drawer contains a winding key with fresh grease on it.**: The presence of grease indicates recent tampering with the clock. → Points to Dr. Mallory Finch as having access to tamper with the clock.
3. **Witnesses note Eleanor's nervousness increased as the time approached eight o'clock.**: The anxiety suggests she sensed danger close to the time of her death, not earlier. → Eliminates the assumption that she was calm before the murder.

### The Discriminating Test
**Method**: trap
**Design**: A controlled comparison of the clock's time with the wall clock during a reenactment reveals the manipulation.
**Reveals**: The clock's mechanism was tampered with to mislead the timeline.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_mechanism_visibility_core] temporal: The clock in the study shows the hands pointing to quarter past seven.
- [clue_core_contradiction_chain] temporal: This contradicts the wall clock showing eight o'clock when Eleanor was found.
- [clue_1] physical: A half-opened drawer contains a winding key with fresh grease on it.
- [clue_2] temporal: The presence of grease indicates recent tampering with the clock.
- [clue_5] temporal: The clock was wound back by Dr. Mallory Finch to create an alibi for the murder.
- [clue_culprit_direct_dr_mallory_finch] temporal: Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.

### Mid Clues (Act II)
- [clue_3] behavioral: Witnesses note Eleanor's nervousness increased as the time approached eight o'clock.
- [clue_4] temporal: The anxiety suggests she sensed danger close to the time of her death, not earlier.
- [clue_core_elimination_chain] temporal: Dr. Mallory Finch has an alibi as he was seen in the study at the time of the murder.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: Dinner starts at seven o'clock remains a late texture detail in the case background.

### Red Herrings
- [rh_1] Eleanor was seen drinking heavily before her death, which might suggest she acted irrationally.
- [rh_2] Witnesses recall hearing a loud argument coming from the study shortly before Eleanor was found.

---

## Key Constraints

### Temporal
- dinner starts at seven o'clock
- Eleanor found dead at quarter past eight
- The clock was manipulated between seven and eight

### Access
- Dr. Mallory Finch
- Eleanor Voss
- The clock in the study

---

## Era Details


---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** temporal manipulation
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Proves he had no access to the clock.
  - Clues: Eleanor's drink was untouched, Hale was seen in the dining room at the time
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Eliminates her as the murderer posthumously.
  - Clues: Eleanor was the victim., No evidence suggests she manipulated the clock.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_1**: Act 1, Scene 3 (Direct observation)
- **clue_2**: Act 1, Scene 3 (Found in the study)
- **clue_5**: Act 1, Scene 3 (Direct observation)


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

## CANONICAL LOCKED FACTS — Honour Verbatim in All Scenes
The following values are ground truth from the hard-logic device. Every scene summary and time reference MUST use these exact values (word form, not digits). Do not invent different clock times or quantities.

- **clock_reading**: "ten minutes past eleven" — The exact time shown on the stopped clock face
- **tamper_amount**: "forty minutes" — The exact amount the clock was wound back
- **temperature**: "eighty-five degrees Fahrenheit" — The temperature on the clock case, indicating recent tampering
- **drawer_position**: "half-open" — The position of the drawer where the winding key was found


## PILLAR 4 — OUTLINE COMPLETENESS CONTRACT DATA

### Character Permitted Behaviours (use for permittedBehavioursByAct per scene)
- **Eleanor Voss**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her fear of being publicly outed for her political activities drives her to desperation, as she knows the repercussions could shatter her carefully constructed world." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the moral implications of her actions; while she believes in her cause, she is terrified that her political activism could cost her everything she has worked for." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Dr. Mallory Finch**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of losing their career to the very addiction they cannot control fuels a sense of desperation that is both palpable and dangerous." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch is caught in a web of guilt and shame, battling the duality of their public persona as a healer and the private truth of their addiction. This conflict leaves them feeling isolated, as they fear that any slip could lead to their downfall." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Captain Ivor Hale**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of tarnishing his legacy and losing the respect he commands in the community is a potent motivator for Ivor." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is torn between the man he was and the man he aspires to be. The burden of guilt he carries is a constant reminder of his past mistakes, and he struggles with the desire for redemption while fearing the truth of his actions." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Beatrice Quill**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of losing both her career and the love she cherished drives Beatrice to a point of desperation." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice is torn between her ambition and her heart; the desire for success clashes with the fear of being judged for her relationship, leaving her in a constant state of turmoil." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.

### Red Herrings (must be seeded in Act I–II scenes via redHerringPlacement)
- **rh_1**: Eleanor was seen drinking heavily before her death, which might suggest she acted irrationally. (misdirection: This implies her state of mind was unstable, distracting from the actual timeline.)
- **rh_2**: Witnesses recall hearing a loud argument coming from the study shortly before Eleanor was found. (misdirection: This draws attention away from the time discrepancies related to the clocks.)
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
- **Test type:** temporal manipulation
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Proves he had no access to the clock.
  - Clues: Eleanor's drink was untouched, Hale was seen in the dining room at the time
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Eliminates her as the murderer posthumously.
  - Clues: Eleanor was the victim., No evidence suggests she manipulated the clock.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_1**: Act 1, Scene 3 (Direct observation)
- **clue_2**: Act 1, Scene 3 (Found in the study)
- **clue_5**: Act 1, Scene 3 (Direct observation)


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
  ✓ Good: "Establishes that Dr. Finch was not in the library before 10 PM — his claimed alibi collapses"

**permittedBehavioursByAct** (required, all scenes): For each named character present, copy their permitted behaviour for this act from the Character Permitted Behaviours section in your context.
  Format: [{ "characterName": "Eleanor Voss", "behaviour": "cooperative grief; no guilt-tells in Act I" }]

**redHerringPlacement** (required, Act I and Act II scenes only):
  - If planting a red herring: { "redHerringId": "rh_1", "placementDetail": "Captain Hale mentions the clock ran at dinner — seeds timing doubt" }
  - If Act I or II but no red herring planted this scene: null
  - Act III scenes: omit this field entirely (do NOT include it in Act III scene objects)

By the end of Acts I and II every red herring ID listed in your context must appear in at least one scene's redHerringPlacement.
```
