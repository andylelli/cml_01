# Actual Prompt Record

- Run ID: `run_20f9ca27-9933-4c85-bb51-9146f093c292`
- Project ID: `proj_0b9d9c24-d00c-455d-a7a2-b502f3126204`
- Timestamp: `2026-04-17T21:11:30.633Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `retry 1`
- Prompt Hash: `dd0677eff40efe79`

## Message 1 (role=system)

```text
You are a clue extraction specialist for Golden Age mystery fiction.
Extract clues ONLY from existing CML facts.
Do not invent facts.
Keep clues reader-observable and fair play ordered.
Return valid JSON only.

Clue categories:
- Temporal
- Spatial
- Physical
- Behavioral
- Testimonial
```

## Message 2 (role=developer)

```text
## CML Summary
**Title**: The Timed Deception
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: moderate (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (10 required)
1. Generate a clue that makes the reader directly observe: "The clock in the library shows stopped at 9:50 PM...."
   → observation | essential | early | temporal | step 1 | terms: clock, library, shows

2. Generate a clue that provides evidence for: "If the clock stopped at 9:50 PM, the timeline of events must be reassessed...."
   → contradiction | essential | early | temporal | step 1 | terms: clock, stopped, timeline

3. Generate a clue that makes the reader directly observe: "Witness statements indicate they last saw the victim alive at 10 PM...."
   → observation | essential | early | testimonial | step 2 | terms: witness, statements, indicate

4. Generate a clue that provides evidence for: "The conflicting times suggest the victim could not have been alive at 10 PM...."
   → contradiction | essential | early | temporal | step 2 | terms: conflicting, times, suggest

5. Generate a clue that makes the reader directly observe: "Footprints lead away from the library window but vanish...."
   → observation | essential | mid | spatial | step 3 | terms: footprints, library, window

6. Generate a clue that provides evidence for: "The vanishing footprints indicate a possible escape route...."
   → contradiction | essential | mid | physical | step 3 | terms: vanishing, footprints, indicate

7. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A controlled reenactment of the night events with all suspects present to recreate the timeline, hig..."
   → observation | essential | mid | temporal | terms: controlled, reenactment, night

8. Generate a clue showing observable evidence of Finlay Bryce's premeditation or planning (Financial strain). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: financial, strain

9. Generate a clue that provides elimination evidence for suspect: George Veitch
   → elimination | essential | mid | testimonial | terms: George Veitch

10. Generate a clue that provides elimination evidence for suspect: Christine Gillespie
   → elimination | essential | mid | testimonial | terms: Christine Gillespie

## Temporal Constraints
- Witness statements about the time of the loud bang
- Clock in the library stopped at 9:50 PM
- Witnesses saw the victim alive at 10 PM vs. clock stopped at 9:50 PM

## Access Constraints
Actors: George Veitch, Christine Gillespie, Finlay Bryce, Timothy Buchanan
Objects: Library door, Clock, Fireplace

## Physical Evidence
- Soot marks around the fireplace
- Footprints near the library window

## Evidence-Sensitive Characters
- George Veitch: sensitive items: Financial records, Witness statements
- Christine Gillespie: sensitive items: Witness testimonies, Alibi checks
- Finlay Bryce: sensitive items: Financial records, Witness statements
- Timothy Buchanan: sensitive items: Witness testimonies, Social interactions

## Hard Precedence (resolve in order)
1. sourceInCML legality
2. index bounds and cast name-index correctness
3. discriminating-test clue ID coverage
4. suspect elimination quality
5. red-herring separation
6. optional texture

## Generation Order (Critical)
1. Build clues[].id and clues[].sourceInCML first.
2. Validate source paths against valid_source_paths[] when available; otherwise allowed roots + bounds.
3. Populate clue description/pointsTo text.
4. Build elimination details.
5. Generate red herrings last.
6. Set status based on unresolved hard-rule defects.

## Deterministic Bounds (use exactly)
- inference_path steps path index range: 0..2
- supportsInferenceStep valid range: 1..3
- constraint_space.time.anchors index range: 0..1
- constraint_space.time.contradictions index range: 0..0
- cast index range: 0..4

## Cast Name -> Index Map (for CASE.cast[N] paths)
- George Veitch -> 0
- Christine Gillespie -> 1
- Finlay Bryce -> 2
- Timothy Buchanan -> 3
- Violet Irvine -> 4

## Clue Density: moderate
Generate 8-12 clues total.
Additional optional clues (2-4 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The victim was killed at 10 PM, aligning with the alibis of all suspects."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - clock
  - stopped
  - timeline
  - conflicting
  - times
  - suggest
  - vanishing
  - footprints
  - indicate
- preferred_false_assumption_terms:
  - victim
  - killed
  - aligning
- red_herring_contract:
  - Use preferred_false_assumption_terms where possible.
  - Avoid correction_terms_forbidden_in_red_herrings in redHerrings[].description and redHerrings[].misdirection.
  - Include one sentence in each misdirection explicitly justifying non-overlap with true-solution mechanism language.

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
If mandatory requirements exceed requested density, satisfy mandatory requirements first and keep optional clues minimal.

## Fair Play Audit Feedback
Status: **fail**

Violations: 1. [critical] Red Herring Separation: Red herring rh_1 overlaps inference corrections (steps: 1; words: clock, stopped) and may support the true solution.; 2. [critical] Red Herring Separation: Red herring rh_2 overlaps inference corrections (steps: 1, 2; words: timeline, alive) and may support the true solution.
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
- supportsInferenceStep and step-indexed sourceInCML references must stay within actual inference-path bounds.
- Red herring text must not reuse correction-language tokens from inference_path.steps[].correction.
- If inference_path has 3 step(s), valid supportsInferenceStep/source step indices are 1..3 and 0..2 respectively.
- Cast paths must use CASE.cast[N] with N from the Name->Index map above. Do not substitute names inside brackets.

## Failure-Mode Hardening (pass-first)
- If valid_source_paths[] is provided, sourceInCML should exactly match one listed path.
- If sourceInCML is CASE.cast[N].*, suspect references in clue text/pointsTo must match cast index N.
- Required discriminating-test IDs must be present in clues[].id and placed early|mid as essential.
- Elimination clues must include alibi window + corroborator + explicit exclusion logic.
- Red-herring forbidden terms apply to description/misdirection only; supportsAssumption may restate the false assumption.
- Set status="pass" only when missing discriminating IDs, weak elimination suspects, and invalid source paths are all empty.

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

## valid_source_paths[] (exact match preferred)
- CASE.inference_path.steps[0].observation
- CASE.inference_path.steps[0].correction
- CASE.inference_path.steps[0].required_evidence[0]
- CASE.inference_path.steps[0].required_evidence[1]
- CASE.inference_path.steps[1].observation
- CASE.inference_path.steps[1].correction
- CASE.inference_path.steps[1].required_evidence[0]
- CASE.inference_path.steps[1].required_evidence[1]
- CASE.inference_path.steps[2].observation
- CASE.inference_path.steps[2].correction
- CASE.inference_path.steps[2].required_evidence[0]
- CASE.inference_path.steps[2].required_evidence[1]
- CASE.constraint_space.time.anchors[0]
- CASE.constraint_space.time.anchors[1]
- CASE.constraint_space.time.contradictions[0]
- CASE.constraint_space.access.actors[0]
- CASE.constraint_space.access.actors[1]
- CASE.constraint_space.access.actors[2]
- CASE.constraint_space.access.actors[3]
- CASE.constraint_space.access.objects[0]
- CASE.constraint_space.access.objects[1]
- CASE.constraint_space.access.objects[2]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.physical.laws[0]
- CASE.constraint_space.physical.laws[1]
- CASE.constraint_space.physical.traces[0]
- CASE.constraint_space.physical.traces[1]
- CASE.cast[0].alibi_window
- CASE.cast[0].access_plausibility
- CASE.cast[0].evidence_sensitivity[0]
- CASE.cast[0].evidence_sensitivity[1]
- CASE.cast[1].alibi_window
- CASE.cast[1].access_plausibility
- CASE.cast[1].evidence_sensitivity[0]
- CASE.cast[1].evidence_sensitivity[1]
- CASE.cast[2].alibi_window
- CASE.cast[2].access_plausibility
- CASE.cast[2].evidence_sensitivity[0]
- CASE.cast[2].evidence_sensitivity[1]
- CASE.cast[3].alibi_window
- CASE.cast[3].access_plausibility
- CASE.cast[3].evidence_sensitivity[0]
- CASE.cast[3].evidence_sensitivity[1]
- CASE.cast[4].alibi_window
- CASE.cast[4].access_plausibility
- CASE.discriminating_test.evidence_clues[0]
- CASE.discriminating_test.evidence_clues[1]
- CASE.discriminating_test.evidence_clues[2]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

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

Generate 8-12 clues and 2 red herrings that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- DISCRIMINATING TEST CLUES: Any clue that enables the discriminating test to make sense must be placed "early" or "mid". The discriminating test scene exploits knowledge the reader already has — it must NEVER be the reader's first exposure to the mechanism detail.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- PREMEDITATION CLUES: If the culprit's guilt depends on premeditation or planning, that evidence must be a separate reader-visible clue placed "early" or "mid". The detective cannot withhold this from the reader until confrontation.
- ELIMINATION CLUES: Must include time window, corroborator/evidence source, and direct exclusion logic in pointsTo ("Eliminates <name> because ...").
- SOURCE PATH LEGALITY: sourceInCML must use only legal CML path roots.
- SOURCE PATH EXACT MATCH: if valid_source_paths[] is present in the developer prompt, sourceInCML must exactly match one listed path.
- STYLE: Use era-appropriate worded time references in clue descriptions and pointsTo.
- TIME FORMAT: Never use digit-based clock notation in clue descriptions or pointsTo.
- RED HERRING SEPARATION: Do not reuse correction-language tokens from inference_path.steps[].correction in red herring description/misdirection text.
- RED HERRING FIELD SCOPE: forbidden overlap terms apply to redHerrings[].description and redHerrings[].misdirection; supportsAssumption may restate the false assumption.
- FIRST-ATTEMPT RED HERRING CONTRACT: avoid correction-language tokens in red herrings from the start, not only in retry mode.
- CAST PATH CONSISTENCY: If sourceInCML is CASE.cast[N].*, then clue description/pointsTo suspect references must match the name at cast index N.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

Retry mode (correction targets):
- Fix these unresolved targets first:
  - [critical] Red Herring Separation: Red herring rh_1 overlaps inference corrections (steps: 1; words: clock, stopped) and may support the true solution.
  - [critical] Red Herring Separation: Red herring rh_2 overlaps inference corrections (steps: 1, 2; words: timeline, alive) and may support the true solution.
- Retry scope: rewrite only targeted IDs when provided; keep unaffected IDs and wording stable unless a dependency requires change.
- Preserve unaffected clues unless changes are needed for consistency.
- Populate audit arrays to show no unresolved critical defects.
- If any target mentions red-herring overlap, include rewrite table entries as: old phrase -> replacement phrase.


Structured correction payload (apply exactly):
- must_fix[]:
  - [critical] Red Herring Separation: Red herring rh_1 overlaps inference corrections (steps: 1; words: clock, stopped) and may support the true solution.
  - [critical] Red Herring Separation: Red herring rh_2 overlaps inference corrections (steps: 1, 2; words: timeline, alive) and may support the true solution.
- forbidden_terms[] (do not use in red herring description/misdirection):
  - clock
  - stopped
  - timeline
  - alive
  - conflicting
  - times
  - suggest
  - vanishing
  - footprints
  - indicate
- preferred_terms[] (use these instead when possible):
  - killed
  - aligning
  - alibis
  - suspects
  - witnesses
  - recall
  - seeing
  - until
- required_replacements[]:
  - clock -> killed
  - stopped -> aligning
  - timeline -> alibis
  - alive -> suspects

Hard retry contract:
- If forbidden_terms[] is non-empty, none of those terms may appear in redHerrings[].description or redHerrings[].misdirection.
- If that cannot be satisfied while keeping red herring coherence, return status="fail" with the blocking term list in audit.invalidSourcePaths.
- Explicitly rewrite rh_1, rh_2 and include a non-overlap justification sentence in each misdirection field.
```
