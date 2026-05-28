# Actual Prompt Record

- Run ID: `mystery-1779912116475`
- Project ID: `unknown`
- Timestamp: `2026-05-27T20:08:40.504Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `65dc825af71c0f91`

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
**Title**: The Clock's Backward Toll
**Era & Setting**: 1930s - Stoneleigh Manor
**Setting Lock**: All scenes must remain within this setting: Stoneleigh Manor. Do not move to a different location type.
**Primary Axis**: temporal
**Crime**: mechanical clock tampering temporal alibi manipulation
**Victim**: Unknown
**Culprit**: Dr. Mallory Finch
**Motive**: Unknown motive
**Method**: mechanical clock tampering temporal alibi manipulation

## The False Assumption
The manor clock’s displayed time accurately reflects the true time of the victim’s death.
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

1. **The manor clock’s winding key was found in the study with fresh oil stains and a slight scratch on the clock’s back plate consistent with forced backward winding.**: The clock was deliberately wound backward, not stopped naturally, indicating tampering. → Narrows timing constraint to a manipulated clock timeline; eliminates assumption that clock time is reliable.
2. **Witnesses heard the manor clock chime twice in quick succession just before it stopped, which is mechanically impossible under normal operation.**: The clock’s mechanism was disturbed causing abnormal chiming, corroborating tampering. → Confirms forced mechanical interference in clock operation, supporting adjusted timeline.
3. **The victim’s pocket watch was found stopped at eleven-fifty, well after the manor clock’s stopped time, indicating the victim was alive beyond the clock’s displayed time.**: The true time of death is later than the manor clock’s stopped time, invalidating alibis based on the manor clock. → Eliminates suspects whose alibis rely on the manor clock’s incorrect time, specifically Captain Hale and Beatrice Quill’s supported alibis remain plausible; Dr. Finch’s alibi is invalidated.
4. **Dr. Mallory Finch was seen near the study shortly after the manor clock stopped, inconsistent with her claimed alibi during the apparent murder window.**: Dr. Finch had opportunity to commit the murder during the true time window obscured by the clock tampering. → Narrows suspect pool to Dr. Mallory Finch as only plausible culprit.

### The Discriminating Test
**Method**: trap
**Design**: A controlled comparison is staged at Stoneleigh Manor where the manor clock spring tension is measured alongside the winding key’s fresh oil stains and scratch marks. Witnesses recount the manor clock’s abnormal chiming, while the victim’s pocket watch time is compared to the stopped manor clock, conclusively proving the backward winding tampering and disproving Dr. Finch’s alibi.
**Reveals**: The test proves the manor clock’s time is shifted backward by forty minutes due to deliberate mechanical tampering, invalidating Dr. Finch’s claimed alibi and exposing her as the murderer.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_mechanism_visibility_core] temporal: The clock’s mechanism relies on the manor clock and the study room setup to expose the false timing of the murder, revealing how the backward winding created a misleading time display.
- [clue_1] temporal: The manor clock’s winding key was found in the study with fresh oil stains and a slight scratch on the back plate, indicating recent use and tampering.
- [clue_2] temporal: Witnesses heard the manor clock chime twice in quick succession just before it stopped, an abnormal behavior indicating the clock’s mechanism was disturbed.
- [clue_3] temporal: The clock’s mechanism was found disturbed with scratch marks and irregularities, corroborating the abnormal chiming and tampering.
- [clue_13] physical: The manor clock’s winding key shows fresh oil stains and a slight scratch on the back plate, indicating recent use and tampering.

### Mid Clues (Act II)
- [clue_core_contradiction_chain] temporal: The clock was deliberately wound backward by exactly forty minutes, not stopped naturally, as shown by the scratch marks on the clock back plate and fresh oil stains on the winding key found in the study.
- [clue_4] temporal: The victim’s pocket watch was found stopped at eleven-fifty, well after the manor clock’s stopped time of ten minutes past eleven.
- [clue_5] temporal: The true time of death is later than the manor clock’s stopped time, invalidating alibis based on the clock’s displayed time.
- [clue_6] temporal: Dr. Mallory Finch was seen near the study shortly after the manor clock stopped, inconsistent with his claimed whereabouts.
- [clue_7] temporal: Dr. Finch had the opportunity to commit the murder during the true time window obscured by the clock tampering, as he had access and was near the study.
- [clue_8] temporal: A controlled comparison is staged at Stoneleigh Manor where the manor clock spring tension is measured at six pounds three ounces, confirming partial rewind consistent with tampering.
- [clue_9] temporal: Dr. Mallory Finch’s unique trace is the fresh oil stains matching those on the manor clock’s winding key, linking him directly to the tampering mechanism.
- [clue_10] behavioral: Dr. Mallory Finch had been preparing to silence the victim who threatened exposure, as evidenced by his recent acquisition of oil and tools found in his quarters.
- [clue_11] testimonial: Eliminates Captain Ivor Hale because his alibi is corroborated by stable boy testimony and lantern oil traces placing him away from the manor during the murder time window.
- [clue_12] testimonial: Eliminates Beatrice Quill because her alibi is supported by servants’ quarters logs and tea bell mechanism notes confirming her presence away from the study.
- [clue_core_elimination_chain] testimonial: Eliminates Captain Ivor Hale because his alibi is corroborated by stable boy testimony and lantern oil traces, narrowing the solution toward Dr. Mallory Finch.
- [clue_culprit_direct_dr_mallory_finch] temporal: Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.

### Late Clues (Act III)
- [clue_late_optional_slot_1] temporal: Manor clock stopped at ten minutes past eleven remains a late texture detail in the case background.

### Red Herrings
None

---

## Key Constraints

### Temporal
- Manor clock stopped at ten minutes past eleven
- Victim’s pocket watch stopped at eleven-fifty
- Witness testimony on clock chimes timing

### Access
- Dr. Mallory Finch
- Captain Ivor Hale
- Beatrice Quill

---

## Era Details
- Mechanical clocks with spring tension
- No electronic timekeeping
- Basic forensic toxicology and fingerprinting
- Strict class hierarchy with formal routines
- Limited telecommunications

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** trap
- **Required elements:** Execute the discriminating test with clock spring tension measurement, Present witness testimony on clock chiming, Compare victim’s pocket watch time to manor clock time, Draw conclusion about Dr. Finch’s guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Stable boy testimony and lantern timing confirming alibi
  - Clues: Stable boy’s statement about Captain Hale’s presence, Lantern oil traces consistent with claimed timeline
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Servants’ quarters alibi supported by tea bell timing and diary notes
  - Clues: Beatrice’s diary entries about tea bell, Bell hammer wear consistent with normal use
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Continuous presence at manor with no opportunity for murder

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with mechanical evidence and timing contradictions

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_1**: Act 1, Scene 2 (Direct observation)
- **clue_13**: Act 1, Scene 3 (Direct observation)
- **clue_2**: Act 1, Scene 3 (Direct observation)
- **clue_3**: Act 1, Scene 3 (Cross-check contradiction)


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
- **spring_tension_measure**: "six pounds three ounces" — The measured residual spring tension indicating partial rewind


## PILLAR 4 — OUTLINE COMPLETENESS CONTRACT DATA

### Character Permitted Behaviours (use for permittedBehavioursByAct per scene)
- **Eleanor Voss**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A - investigator with no personal motive" — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor wrestles with the burden of her knowledge about the family’s past—whether to protect the fragile peace by keeping secrets or to pursue truth at the risk of irrevocable damage to relationships she values deeply." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Dr. Mallory Finch**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch stands to gain by controlling medical records that could invalidate the victim’s legal capacity, thereby preserving her financial arrangement tied to the estate’s continuity. The victim’s recent threats to revoke this arrangement and expose malpractice placed Dr. Finch in grave jeopardy, providing a compelling motive to silence her." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch is torn between her professional oath to do no harm and the self-preserving impulse to protect her financial and social standing. The ethical dilemma of betraying a patient’s trust versus saving herself creates a gnawing psychological tension." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Captain Ivor Hale**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Captain Hale’s motive is compelling: he intends to hasten his inheritance by eliminating the victim, who planned to alter the will to reduce his share. Fearful that legal avenues would expose his prior financial mismanagement, he prefers the certainty of murder over contestation." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is caught between his ingrained loyalty to the family and his simmering resentment over being sidelined. This tension fuels a psychological struggle between pride and desperation, as he contemplates actions that betray both his principles and duties." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Beatrice Quill**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice sees the victim’s death as an opportunity to destabilize the estate’s leadership, enabling her to leverage insider information for a lucrative position or payoff. The victim’s recent intention to terminate her employment after discovering a past indiscretion adds urgency and motive to her actions." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice struggles with trust and ambition, torn between the desire for advancement and the fear of exposure. Her secret debts and relationships weigh heavily, fueling a tension between self-preservation and the risk of betrayal." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.

### Red Herrings: none — set redHerringPlacement: null for all Act I–II scenes
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
- **Required elements:** Execute the discriminating test with clock spring tension measurement, Present witness testimony on clock chiming, Compare victim’s pocket watch time to manor clock time, Draw conclusion about Dr. Finch’s guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Stable boy testimony and lantern timing confirming alibi
  - Clues: Stable boy’s statement about Captain Hale’s presence, Lantern oil traces consistent with claimed timeline
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Servants’ quarters alibi supported by tea bell timing and diary notes
  - Clues: Beatrice’s diary entries about tea bell, Bell hammer wear consistent with normal use
- **Eleanor Voss**: Act 3, Scene 5
  - Method: Continuous presence at manor with no opportunity for murder

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with mechanical evidence and timing contradictions

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_1**: Act 1, Scene 2 (Direct observation)
- **clue_13**: Act 1, Scene 3 (Direct observation)
- **clue_2**: Act 1, Scene 3 (Direct observation)
- **clue_3**: Act 1, Scene 3 (Cross-check contradiction)


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
(No red herrings for this run — set redHerringPlacement: null for all Act I–II scenes.)
```
