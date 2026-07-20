# Actual Prompt Record

- Run ID: `mystery-1784581919417`
- Project ID: `unknown`
- Timestamp: `2026-07-20T21:20:22.464Z`
- Agent: `Agent7-NarrativeFormatter`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.5`
- Max Tokens: `16000`
- Attempt: `first`
- Prompt Hash: `454301732ea5dc26`

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
**Title**: The Ocean's Whisper
**Era & Setting**: 1940s - Cannes
**Setting Lock**: All scenes must remain within this setting: Cannes. Do not move to a different location type.
**Primary Axis**: behavioral
**Crime**: delayed-action poisoning
**Victim**: Unknown
**Culprit**: Sylvia Trent
**Motive**: Unknown motive
**Method**: delayed-action poisoning

## The False Assumption
Dr. Finch must have been poisoned at the gala itself due to her sudden collapse.
*Revealed: final act*

---

## Cast of Characters
- **Detective**: Eleanor Voss
- **Suspect**: Eleanor Voss
- **Suspect**: Captain Ivor Hale
- **Suspect**: Beatrice Quill
- **Suspect**: Hugo Vane
- **Witness**: Dr. Mallory Finch
- **Witness**: Sylvia Trent

---

## Detective's Inference Path
The logical steps the detective follows:

1. **The temperature gauge in the dining area shows a sudden spike to eighty-five degrees Fahrenheit just before Dr. Finch collapses.**: The poison's activation mechanism relies on temperature, indicating it was administered earlier. → Narrows the timeline of the poisoning, eliminating Captain Hale as he was seen in the lobby at that time.
2. **The cocktail glass found at the scene has a faint residue of a greenish powder.**: The residue matches the botanical poison noted in local reports, indicating foul play. → Narrows the suspect pool further by implicating those who had access to the drink.
3. **Footprints leading away from the cocktail preparation area were found near the terrace.**: The presence of footprints suggests someone tampered with the drink before it was served. → Eliminates Beatrice Quill, who was seen in the dining area prior to the drink being served.

### The Discriminating Test
**Method**: trap
**Design**: A comparison of the cocktail glasses used by Dr. Finch and those served to other guests shows unique residue only present in Dr. Finch's glass.
**Reveals**: Only Sylvia Trent had the opportunity to access the specific poison used.

---

## Clue Distribution

### Early Clues (Act I)
- [clue_mechanism_visibility_core] temporal: A botanical poison derived from a rare sea plant is mixed into a cocktail, activating only after the victim enters the heated dining area.
- [clue_core_contradiction_chain] testimonial: The poison's activation mechanism relies on temperature, indicating it was administered earlier.
- [clue_3] testimonial: The cocktail glass found at the scene has a faint residue of a greenish powder.
- [clue_4] testimonial: The residue matches the botanical poison noted in local reports, indicating foul play.
- [clue_residue_analysis] testimonial: The cocktail glass found at the scene has a faint residue of a greenish powder.
- [clue_footprints] temporal: A botanical poison derived from a rare sea plant is mixed into a cocktail, activating only after the victim enters the heated dining area.
- [clue_fp_contradiction_step_2] temporal: The cocktail glass found at the scene has a faint residue of a greenish powder.

### Mid Clues (Act II)
- [clue_5] physical: Footprints leading away from the cocktail preparation area were found near the terrace.
- [clue_6] temporal: The presence of footprints suggests someone tampered with the drink before it was served.
- [clue_7] elimination: Eliminates Eleanor Voss because she was seen in the library during the time the cocktail was prepared.
- [clue_8] elimination: Eliminates Captain Ivor Hale because he was at the bar with several guests when the cocktail was prepared.
- [clue_9] elimination: Eliminates Beatrice Quill because she was in the kitchen preparing appetizers during the cocktail preparation.
- [clue_10] elimination: Eliminates Hugo Vane because he was seen conversing with guests at the gala when the drink was prepared.
- [clue_11] behavioral: Sylvia Trent was observed acting nervously around the cocktail preparation area.
- [clue_12] behavioral: Sylvia Trent expressed fear of exposure regarding her own career.
- [clue_culprit_direct_1] temporal: Direct evidence links Sylvia Trent to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_culprit_direct_sylvia_trent] temporal: Direct evidence links Sylvia Trent to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [clue_temperature_gauge] behavioral: Sylvia Trent was observed acting nervously around the cocktail preparation area.

### Late Clues (Act III)
- [clue_late_optional_slot_1] physical: Traces of the botanical poison were found in the cocktail glass. remains a late texture detail in the case background.

### Red Herrings
- [rh_1] Witnesses claim that Dr. Finch was seen drinking a cocktail at the gala before her collapse.
- [rh_2] Some guests reported seeing a shadowy figure near the cocktail area just before the poisoned was itself.

---

## Key Constraints

### Temporal
- Dr. Finch's symptoms did not show until after the temperature increased in the dining area.

### Access
- Sylvia Trent
- The cocktail glass

---

## Era Details


---

## Prose Requirements (CRITICAL - Must be reflected in outline)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** chemical residue comparison
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Confirmed alibi by multiple witnesses.
  - Clues: clue_id_1, clue_id_2
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Alibi confirmed by her location in the dining area.
  - Clues: clue_id_1, clue_id_2
- **Hugo Vane**: Act 3, Scene 5
  - Method: Witnesses confirm his activities away from the drink preparation.
  - Clues: clue_id_1, clue_id_2
- **Dr. Mallory Finch**: Act 3, Scene 5
  - Method: Alibi confirmed: Evening of the gala.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Witness statement)
- **clue_footprints**: Act 1, Scene 3 (Direct observation)


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

- **dining_area_temp**: "eighty-five degrees" — Temperature at which the poison activates.
- **victim_entry_time**: "twenty minutes past eight" — Time when the victim entered the dining area.
- **bottle_location**: "the top shelf" — Position of the poison in the bar cabinet.


## PILLAR 4 — OUTLINE COMPLETENESS CONTRACT DATA

### Character Permitted Behaviours (use for permittedBehavioursByAct per scene)
- **Eleanor Voss**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Seeks to uncover the truth about the victim's past to protect their own reputation." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Haunted by the memories of her youthful affair with the victim, Eleanor grapples with guilt and the fear that the truth will destroy her reputation." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Dr. Mallory Finch**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears losing her career if the victim goes public with her findings." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch is torn between her ambition and her conscience, grappling with the fear that her unethical choices could unravel her life and career." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Captain Ivor Hale**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wanted to silence the victim to avoid public humiliation and financial ruin." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is caught between his charming persona and the reality of his financial desperation, struggling with guilt over his past decisions and the fear of losing everything." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Beatrice Quill**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desires to eliminate the victim's influence to reclaim her status among their peers." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice struggles with her own insecurities, torn between her desire for status and the resentment she feels towards those who threaten it." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Sylvia Trent**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Aims to expose the victim's theft and reclaim her work's integrity and reputation." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia wrestles with feelings of betrayal and a desire for revenge, struggling to reconcile her ambition with the need for integrity." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.
- **Hugo Vane**: Act I: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Worried that the victim would expose the affair, ruining his professional credibility." — do not surface in Act I. | Act II: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo is plagued by guilt over his past decisions, struggling to reconcile his desire for success with the fear of exposure and the consequences that would follow." | Act III: Full character reveal permissible. Emotional truth should be explicit — confrontation, confession, or vindication as role demands.

### Red Herrings (must be seeded in Act I–II scenes via redHerringPlacement)
- **rh_1**: Witnesses claim that Dr. Finch was seen drinking a cocktail at the gala before her collapse. (misdirection: This observation misleads by suggesting the timing of the poisoning was at the gala, rather than later.)
- **rh_2**: Some guests reported seeing a shadowy figure near the cocktail area just before the poisoned was itself. (misdirection: The shadowy figure creates suspicion but does not provide concrete evidence of who finch with the poisoned.)
```

## Message 3 (role=user)

```text
# Narrative Outline Task

Create a scene-by-scene outline for this mystery story.

## Target Specifications
- **Length**: short (10 scenes, targeting a short story of ~4,500–12,500 words)
- **Style**: dark (undefined)
### Discriminating Test Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 4
- **Test type:** chemical residue comparison
- **Required elements:** Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

### Suspect Clearance Scenes (REQUIRED)
- **Captain Ivor Hale**: Act 3, Scene 5
  - Method: Confirmed alibi by multiple witnesses.
  - Clues: clue_id_1, clue_id_2
- **Beatrice Quill**: Act 3, Scene 5
  - Method: Alibi confirmed by her location in the dining area.
  - Clues: clue_id_1, clue_id_2
- **Hugo Vane**: Act 3, Scene 5
  - Method: Witnesses confirm his activities away from the drink preparation.
  - Clues: clue_id_1, clue_id_2
- **Dr. Mallory Finch**: Act 3, Scene 5
  - Method: Alibi confirmed: Evening of the gala.

### Culprit Revelation Scene (REQUIRED)
- **Must appear in:** Act 3, Scene 6
- **Revelation method:** Confrontation with evidence

### Clue Placement Guidelines
- **clue_mechanism_visibility_core**: Act 1, Scene 1 (Direct observation)
- **clue_core_contradiction_chain**: Act 1, Scene 2 (Cross-check contradiction)
- **clue_3**: Act 1, Scene 3 (Witness statement)
- **clue_4**: Act 1, Scene 3 (Witness statement)
- **clue_footprints**: Act 1, Scene 3 (Direct observation)


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
This story has a **civilian amateur** as the detective. Do NOT invent named police officials (no "Inspector [Surname]", no "Constable [Surname]", no "Sergeant [Surname]") anywhere in scene summaries, purposes, or dramaticElements. The only named characters are those in the Cast of Characters above. If police must appear, describe them anonymously: "a local constable", "the sergeant", "officers from the village". Any invented police name will be scrubbed automatically and will confuse the prose LLM.


## CRITICAL: Follow Prose Requirements
**You MUST include the scenes specified in the "Prose Requirements" section at the exact act/scene positions indicated.**
- If a discriminating test scene is specified, that scene must appear at that position
- If suspect clearance scenes are specified, each must appear at their designated positions
- If a culprit revelation scene is specified, it must appear at that position
- Scene descriptions must mention the required elements and clues indicated
- These requirements are mandatory for story validation - missing them will cause generation failure

## Quality Guardrails (Must Satisfy)
1. CRITICAL PACING FAILURE: Your previous outline placed clues in only 3 of 10 scenes. The minimum required is 6 scenes. You MUST populate cluesRevealed with at least one clue ID in at least 6 scenes and distribute clues across all three acts.
2. Scene-count lock (clue pacing repair): keep EXACT total scene count at 10. Do not reduce chapter/scene count.
3. Act scene-count lock: Act I=3, Act II=4, Act III=3. Preserve these counts while applying fixes.
4. Preserve scene numbering continuity from 1..N with no skipped numbers and no deleted end scenes.
5. Clue pacing requirement: at least 6 of 10 scenes must include non-empty cluesRevealed arrays.
6. Act clue distribution requirement: Act I >= 1 clue-bearing scenes, Act II >= 2, Act III >= 3.
7. Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.


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
