# Actual Prompt Record

- Run ID: `run_b69725ad-a4a6-415c-8826-03f83afdb15e`
- Project ID: `proj_0ccab91b-5a71-40f5-b565-29b635654f6c`
- Timestamp: `2026-04-15T18:53:53.951Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `retry 2`
- Prompt Hash: `c60df9b6aa1c9d7e`

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
**Title**: The Clockwork Conspiracy
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters

## Mandatory Clue Requirements (10 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows 10:10 AM at the time of discovery...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "The clock being stopped suggests tampering, contradicting the timeline...."
   → contradiction | essential | early | temporal | step 1 | terms: clock, being, stopped

3. Generate a clue that makes the reader directly observe: "Witnesses recall seeing Raymond entering the house at 11:20 AM...."
   → observation | essential | early | testimonial | step 2 | terms: witnesses, recall, seeing

4. Generate a clue that provides evidence for: "Raymond's later arrival contradicts the clock's indicated time of death...."
   → contradiction | essential | early | temporal | step 2 | terms: raymond's, later, arrival

5. Generate a clue that makes the reader directly observe: "Fingerprints on the clock face indicate tampering...."
   → observation | essential | mid | temporal | step 3 | terms: fingerprints, clock, indicate

6. Generate a clue that provides evidence for: "The fingerprints suggest someone altered the clock to mislead investigators...."
   → contradiction | essential | mid | temporal | step 3 | terms: fingerprints, suggest, someone

7. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A controlled experiment is conducted comparing the clock's mechanism against another known working c..."
   → observation | essential | mid | temporal | terms: controlled, experiment, conducted

8. Generate a clue showing observable evidence of Raymond Pasco's premeditation or planning (Inheritance disputes). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: inheritance, disputes

9. Generate a clue that provides elimination evidence for suspect: Jenna Opie
   → elimination | essential | mid | testimonial | terms: Jenna Opie

10. Generate a clue that provides elimination evidence for suspect: Paul Stephens
   → elimination | essential | mid | testimonial | terms: Paul Stephens

## Temporal Constraints
- 11:15 AM (time of death)
- 10:10 AM (clock time)
- Witnesses recall seeing Raymond at 11:20 AM near the lake.

## Access Constraints
Actors: Raymond Pasco, Paul Stephens
Objects: the clock, the dining room

## Physical Evidence
- Fingerprints on the clock face indicate tampering.

## Evidence-Sensitive Characters
- Raymond Pasco: sensitive items: high
- Jenna Opie: sensitive items: medium
- Mary Vivian: sensitive items: high
- Paul Stephens: sensitive items: medium
- Ailla Lawry: sensitive items: high

## Clue Density: minimal
Generate 5-8 essential clues total. Additional optional clues (0-2 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The murder must have occurred before 11:15 AM, as indicated by the clock."

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

## Fair Play Audit Feedback
Status: **fail**

Violations: 1. [critical] Red Herring Separation: Red herring rh_1 contains terms that overlap inference corrections and may support the true solution.; 2. [critical] Red Herring Separation: Red herring rh_2 contains terms that overlap inference corrections and may support the true solution.
Warnings: None
Recommendations: Red herrings must support the false assumption only; Do not reuse correction-language terms from inference_path.steps[].correction in red herring text; Preserve misdirection without reinforcing culprit-identifying logic

Regeneration: Adjust placement so essential clues appear before the discriminating test.

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
- red herrings support false assumption without inventing facts
- all discriminating-test evidence clue IDs present in clue list
- elimination clues include qualifying alibi/corroboration/exclusion detail
- no illegal sourceInCML paths
- JSON only, no markdown fences

## Output JSON Schema
```json
{
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
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

Retry mode (correction targets):
- Fix these unresolved targets first:
  - [critical] Red Herring Separation: Red herring rh_1 contains terms that overlap inference corrections and may support the true solution.
  - [critical] Red Herring Separation: Red herring rh_2 contains terms that overlap inference corrections and may support the true solution.
- Preserve unaffected clues unless changes are needed for consistency.
- Populate audit arrays to show no unresolved critical defects.
```
