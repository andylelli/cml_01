# Actual Prompt Record

- Run ID: `run_14fc72c2-64b7-4950-9d6b-ead6f04fed56`
- Project ID: `proj_c25500a0-cb7b-4fac-a6c9-0544b6c3f769`
- Timestamp: `2026-04-15T19:31:56.281Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `first`
- Prompt Hash: `170ddfc11e6c50b5`

## Message 1 (role=system)

```text
You are a clue extraction specialist for Golden Age mystery fiction. Extract clues ONLY from existing CML facts and organize them for fair play presentation.

**Rules**:
- Extract clues ONLY from existing CML facts — never invent new information
- Every clue must be traceable to the CML structure
- Concrete, specific descriptions (not abstract)
- Observable by reader in scenes, not detective-only information
- Cite sourceInCML for every clue
- All essential clues must appear before the solution so the reader can solve the mystery
- fair play is the core principle: every logical step must be supported by visible evidence

**Clue Categories**:
- **Temporal**: Time-based evidence (clocks, schedules, alibis, timelines)
- **Spatial**: Location and access evidence (rooms, distances, locked doors)
- **Physical**: Tangible evidence (objects, traces, fingerprints, injuries)
- **Behavioral**: Pattern evidence (habits, reactions, suspicious actions)
- **Testimonial**: Witness statements and testimony

**Example**: ❌ "Timeline discrepancies" ✅ "Mrs. Whitmore says a quarter to ten, but library clock stopped at a quarter past nine"

Return valid JSON.
```

## Message 2 (role=developer)

```text
## CML Summary
**Title**: The Hands of Time
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters

## Mandatory Clue Requirements (10 required)
1. Generate a clue that makes the reader directly observe: "The clock's hands are stuck at ten minutes past eleven...."
   → observation | essential | early | temporal | step 1 | terms: clock's, hands, stuck

2. Generate a clue that provides evidence for: "The time shown on the clock cannot indicate the time of death accurately...."
   → contradiction | essential | early | temporal | step 1 | terms: shown, clock, cannot

3. Generate a clue that makes the reader directly observe: "A note near the clock mentions a meeting scheduled for a quarter past eleven...."
   → observation | essential | early | temporal | step 2 | terms: clock, mentions, meeting

4. Generate a clue that provides evidence for: "The clock's time is suspect, as it indicates a time inconsistent with the meeting...."
   → contradiction | essential | early | temporal | step 2 | terms: clock's, suspect,, indicates

5. Generate a clue that makes the reader directly observe: "The clock's mechanism shows signs of tampering...."
   → observation | essential | mid | temporal | step 3 | terms: clock's, mechanism, shows

6. Generate a clue that provides evidence for: "The clock was deliberately manipulated to mislead witnesses about the time of death...."
   → contradiction | essential | mid | temporal | step 3 | terms: clock, deliberately, manipulated

7. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A confrontation is staged where suspects are asked about their whereabouts during the time the clock..."
   → observation | essential | mid | temporal | terms: confrontation, staged, suspects

8. Generate a clue showing observable evidence of Rosen Trembath's premeditation or planning (Curiosity about the case). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: curiosity, about

9. Generate a clue that provides elimination evidence for suspect: Mervyn Chegwin
   → elimination | essential | mid | testimonial | terms: Mervyn Chegwin

10. Generate a clue that provides elimination evidence for suspect: Geoffrey Colenso
   → elimination | essential | mid | testimonial | terms: Geoffrey Colenso

## Temporal Constraints
- Clock stopped at ten minutes past eleven
- Witnesses' accounts of the victim's last actions contradict the clock's time

## Access Constraints
Actors: Mervyn Chegwin, Geoffrey Colenso, Christine Pasco
Objects: The clock, The study

## Physical Evidence
- Fresh fingerprints on the clock not belonging to the victim

## Clue Density: minimal
Generate 5-8 essential clues total. Additional optional clues (0-2 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The victim must have died shortly after the clock stopped."

## Clue Placement Strategy
- Early (Act I): essential clues, set up the puzzle, introduce key observations
- Mid (Act II): supporting clues, deepen investigation, complicate the picture
- Late (Act III): optional clues, final revelations, confirm the solution

Criticality levels:
- essential: reader must see this to follow the detective's logic
- supporting: reinforces key deductions without being critical
- optional: adds texture and atmosphere

## Quality Controls (from CML)
- Essential clues minimum: 3
- Essential clues before test: true
- Early clues minimum: 2
- Mid clues minimum: 2
- Late clues minimum: 1

If targets conflict with clue density, prioritize fair play (essential clues and early placement).

## Quality Bar
- Essential clues must form a solvable chain, not disconnected facts.
- Clue wording should be concrete enough for scene-level prose rendering.
- Placement should enforce fair-play timing rather than clustering clues at reveal.

## Hard Constraints Learned from Failures
- Discriminating-test clue ID coverage is mandatory: every ID in CASE.discriminating_test.evidence_clues must appear as a clue id.
- Required discriminating-test clue IDs must be criticality: essential and placement: early|mid.
- Elimination clues must include a concrete alibi window, corroborator/evidence source, and explicit exclusion logic in pointsTo.
- sourceInCML must use legal CML paths only; do not invent path families.
- Red herrings must support the false assumption and include non-overlap justification vs true culprit mechanism facts.
- Narrative-facing time wording must be era-appropriate and written in words (for example, "quarter past nine", not "9:15 PM").
- supportsInferenceStep and step-indexed sourceInCML references must stay within actual inference-path bounds.
- Red herring text must not reuse correction-language tokens from inference_path.steps[].correction.
- If inference_path has 3 step(s), valid supportsInferenceStep/source step indices are 1..3 and 0..2 respectively.

## Source Path Legality (Critical)
Allowed source roots include:
- CASE.inference_path.steps[N].observation
- CASE.inference_path.steps[N].correction
- CASE.inference_path.steps[N].required_evidence[M]
- CASE.constraint_space.time.anchors[M]
- CASE.constraint_space.time.contradictions[M]
- CASE.constraint_space.access.actors[M]
- CASE.constraint_space.access.objects[M]
- CASE.constraint_space.access.permissions[M]
- CASE.constraint_space.physical.laws[M]
- CASE.constraint_space.physical.traces[M]
- CASE.cast[N].alibi_window
- CASE.cast[N].access_plausibility
- CASE.cast[N].evidence_sensitivity[M]
- CASE.discriminating_test.evidence_clues[M]
- CASE.prose_requirements.clue_to_scene_mapping[M].clue_id
Forbidden examples:
- CASE.constraint_space.access.footprints[0]
- CASE.character_behavior.*
- CASE.character_testimonial.*
- CASE.cast.Name.*

## Micro-exemplars
- Weak clue: "Someone was nervous around dinner."
- Strong clue: "Port wine decanter seal is broken before service despite butler log marking it intact at ten past seven."
- Weak sourceInCML: "case notes"
- Strong sourceInCML: "CASE.constraint_space.time.anchors[1]"

## Silent Pre-Output Checklist
- every clue traceable to CML
- essential clues placed early/mid only
- supportsInferenceStep populated when applicable
- at least one contradiction clue exists for every inference step with supportsInferenceStep mapping
- red herrings support false assumption without inventing facts
- all discriminating-test evidence clue IDs present in clue list
- elimination clues include qualifying alibi/corroboration/exclusion detail
- no illegal sourceInCML paths
- no out-of-range inference-step indices
- no digit-based clock notation in description/pointsTo
- set status="pass" only when all audit arrays are empty; otherwise status="fail"
- JSON only, no markdown fences

## Output JSON Schema
```json
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "Concrete, specific clue description",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Red herring description",
      "supportsAssumption": "Which false assumption it supports",
      "misdirection": "How it misleads"
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}
```
```

## Message 3 (role=user)

```text
Extract and organize clues from this mystery CML.

Generate 5-8 clues and 2 red herrings that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- DISCRIMINATING TEST CLUES: Any clue that enables the discriminating test to make sense must be placed "early" or "mid". The discriminating test scene exploits knowledge the reader already has — it must NEVER be the reader's first exposure to the mechanism detail.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- PREMEDITATION CLUES: If the culprit's guilt depends on premeditation or planning, that evidence must be a separate reader-visible clue placed "early" or "mid". The detective cannot withhold this from the reader until confrontation.
- ELIMINATION CLUES: Must include time window, corroborator/evidence source, and direct exclusion logic in pointsTo ("Eliminates <name> because ...").
- SOURCE PATH LEGALITY: sourceInCML must use only legal CML path roots.
- STYLE: Use era-appropriate worded time references in clue descriptions and pointsTo.
- TIME FORMAT: Never use digit-based clock notation in clue descriptions or pointsTo.
- RED HERRING SEPARATION: Do not reuse correction-language tokens from inference_path.steps[].correction in red herring description/misdirection text.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above
```
