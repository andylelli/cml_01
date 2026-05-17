# Actual Prompt Record

- Run ID: `mystery-1779031682468`
- Project ID: `unknown`
- Timestamp: `2026-05-17T15:28:54.971Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `first`
- Prompt Hash: `08e54bae96c7e1d7`

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
**Title**: The Clockwork Conspiracy
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 4 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (14 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows ten minutes past eleven...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "This suggests the time of death is later than it actually is...."
   → contradiction | essential | early | temporal | step 1 | terms: suggests, death, later

3. Generate a clue that makes the reader directly observe: "A note found in Eleanor's hand states a meeting time of midnight...."
   → observation | essential | early | temporal | step 2 | terms: found, eleanor's, states

4. Generate a clue that provides evidence for: "The note's timestamp contradicts the clock's reading...."
   → contradiction | essential | early | temporal | step 2 | terms: note's, timestamp, contradicts

5. Generate a clue that makes the reader directly observe: "Witnesses recall seeing Eleanor alive at 10:45 PM...."
   → observation | essential | mid | testimonial | step 3 | terms: witnesses, recall, seeing

6. Generate a clue that provides evidence for: "If Eleanor was alive at 10:45, the clock's time must be incorrect...."
   → contradiction | essential | mid | temporal | step 3 | terms: eleanor, alive, 10:45,

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "This suggests the time of death is later than it actually is...."
   → contradiction | essential | mid | temporal | step 1 | terms: suggests, death, later

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The mechanism relies on clock, study, and minut to expose the false timing...."
   → observation | essential | early | temporal | terms: mechanism, relies, clock,

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "The discriminating test compares clock, study, and minut against the claimed timeline...."
   → observation | essential | mid | temporal | terms: discriminating, compares, clock,

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Beatrice Quill and states the unique trace, preparation detail, or mechanism link that points to Beatrice Quill rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Beatrice Quill, mechanism, relies, clock,

11. Generate a clue showing observable evidence of Beatrice Quill's premeditation or planning (Ambition). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: ambition

12. Generate a clue that explicitly eliminates suspect Dr. Mallory Finch using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Dr. Mallory Finch because ...").
   → elimination | essential | mid | testimonial | terms: Dr. Mallory Finch

13. Generate a clue that explicitly eliminates suspect Captain Ivor Hale using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Captain Ivor Hale because ...").
   → elimination | essential | mid | testimonial | terms: Captain Ivor Hale

14. Generate one essential early or mid elimination clue that explicitly rules out Dr. Mallory Finch and narrows the solution toward culprit Beatrice Quill. The pointsTo text must start with "Eliminates Dr. Mallory Finch because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Dr. Mallory Finch, Beatrice Quill

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- 10:30 PM
- 11:15 PM
- The clock's time conflicts with the note's timestamp.
- Witnesses recall Eleanor being seen alive at 10:45 PM.

## Access Constraints
Actors: Beatrice Quill, Eleanor Voss
Objects: the clock, the note

## Physical Evidence
- Fingerprints found on the clock's mechanism.

## Evidence-Sensitive Characters
- Eleanor Voss: sensitive items: none
- Dr. Mallory Finch: sensitive items: high
- Captain Ivor Hale: sensitive items: medium
- Beatrice Quill: sensitive items: medium

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
- constraint_space.time.contradictions index range: 0..1
- cast index range: 0..3

## Cast Name -> Index Map (for CASE.cast[N] paths)
- Eleanor Voss -> 0
- Dr. Mallory Finch -> 1
- Captain Ivor Hale -> 2
- Beatrice Quill -> 3

## Clue Density: dense
Generate 12-18 clues total.
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The murder must have occurred after the clock showed the time of eleven o'clock."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - suggests
  - death
  - later
  - note's
  - timestamp
  - contradicts
  - eleanor
  - alive
  - 10:45,
- preferred_false_assumption_terms:
  - murder
  - occurred
  - after
- red_herring_contract:
  - Use preferred_false_assumption_terms where possible.
  - Avoid correction_terms_forbidden_in_red_herrings in redHerrings[].description and redHerrings[].misdirection.
  - Include one sentence in each misdirection explicitly justifying non-overlap with true-solution mechanism language.

## CANONICAL LOCKED FACTS — Honour Verbatim
The following values are ground truth established by the hard-logic device generator.
Any clue description that references these concepts MUST use these exact values (in word form, not digits).
Do not write a different time, distance, quantity, or measurement in any clue description.

- **clock_reading**: "ten minutes past eleven" — The exact time shown on the stopped clock face
- **tamper_amount**: "forty minutes" — The exact amount the clock was wound back
- **room_temperature**: "seventy degrees Fahrenheit" — The temperature in the room at the time of the murder
- **note_time**: "a quarter past twelve" — The time written on the note found with the victim

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
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- Do not reference a different suspect name when sourceInCML points to CASE.cast[N].*.
- Required discriminating-test IDs must be present in clues[].id and placed early|mid as essential.
- Elimination clues must include alibi window + corroborator + explicit exclusion logic.
- Red-herring forbidden terms apply to description/misdirection only; supportsAssumption may restate the false assumption.
- Set status="pass" only when missing discriminating IDs, weak elimination suspects, and invalid source paths are all empty.
- If cast-path binding, source-path legality, or discriminating evidence ID contracts fail, status MUST be "fail".

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
- CASE.constraint_space.time.contradictions[1]
- CASE.constraint_space.access.actors[0]
- CASE.constraint_space.access.actors[1]
- CASE.constraint_space.access.objects[0]
- CASE.constraint_space.access.objects[1]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.physical.laws[0]
- CASE.constraint_space.physical.traces[0]
- CASE.cast[0].alibi_window
- CASE.cast[0].access_plausibility
- CASE.cast[0].evidence_sensitivity[0]
- CASE.cast[1].alibi_window
- CASE.cast[1].access_plausibility
- CASE.cast[1].evidence_sensitivity[0]
- CASE.cast[2].alibi_window
- CASE.cast[2].access_plausibility
- CASE.cast[2].evidence_sensitivity[0]
- CASE.cast[3].alibi_window
- CASE.cast[3].access_plausibility
- CASE.cast[3].evidence_sensitivity[0]
- CASE.discriminating_test.evidence_clues[0]
- CASE.discriminating_test.evidence_clues[1]
- CASE.discriminating_test.evidence_clues[2]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

## Deterministic Output Contracts
- FIRST-PASS CONTRACT: satisfy every contract in the initial output; downstream deterministic guardrails are safety nets, not primary completion paths.
- REQUIRED FIELDS CONTRACT: every clue must include non-empty id, sourceInCML, pointsTo, and supportsInferenceStep.
- FIELD CONSISTENCY CONTRACT: if sourceInCML is CASE.inference_path.steps[N].*, supportsInferenceStep must equal N+1.
- PER-STEP COVERAGE CONTRACT: for each inference step in range 1..3, include at least one mapped clue and at least one contradiction clue.
- SOURCE LEGALITY CONTRACT: sourceInCML must exactly match an entry in valid_source_paths[]; never invent or transform paths.
- SOURCE FORMAT CONTRACT: use bracket-index leaf paths only (for example CASE.inference_path.steps[1].correction). Dot-index and intermediate-node paths are forbidden.
- SUSPECT PARITY CONTRACT: if any non-culprit suspect is named, include elimination/alibi evidence parity for that suspect.
- TOP-LEVEL KEY CONTRACT: output top-level keys exactly as status, clues, redHerrings, audit.
- FORBIDDEN KEY CONTRACT: do not output red_herrings.
- STATUS DERIVATION CONTRACT: return status="pass" only when all hard contracts are satisfied and all audit arrays are empty.
- DISCRIMINATING ID EXACTNESS: preserve ID strings exactly; clue_1 must remain clue_1 (do not output clue1).
- FULL OBJECT CONTRACT: emit full clue objects only, never partial clue objects.
- ANTI-COLLAPSE OUTPUT RULE: status="fail" does not permit empty clues[] when evidence exists; output best-effort clues and put defects in audit arrays.

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
- every CASE.cast[N].* clue references cast[N].name consistently in description/pointsTo
- no out-of-range inference-step indices
- no digit-based clock notation in description/pointsTo
- required fixed slot IDs exist exactly once with essential early/mid placement
- if cast-path binding/source-path legality/discriminating-ID coverage fails, set status="fail"
- set status="pass" only when all audit arrays are empty and no cast-path mismatch remains
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

Generate 12-18 clues and 2 red herrings that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- OUTPUT SHAPE CONTRACT: Include all three fixed IDs exactly once each - clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain.
- MECHANISM VISIBILITY: At least one essential early/mid clue must surface the core mechanism detail from hidden_model.mechanism.description.
- CONTRADICTION CHAIN: At least one essential early/mid contradiction clue must explicitly overturn the false assumption.
- ELIMINATION CHAIN: At least one essential early/mid elimination clue must explicitly eliminate an eligible non-culprit and narrow the solution.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- FAIL-FAST STATUS: status MUST be "fail" if any cast-path mismatch, illegal source path, or missing discriminating-test evidence clue ID remains.
- REQUIRED FIELDS CONTRACT: each clue MUST include non-empty sourceInCML, pointsTo, and supportsInferenceStep.
- PER-STEP COVERAGE CONTRACT: each inference step (1..3) MUST have at least one mapped clue and at least one contradiction clue.
- SUSPECT PARITY CONTRACT: any named non-culprit suspect MUST have elimination/alibi evidence parity.
- TOP-LEVEL KEY CONTRACT: output exactly status, clues, redHerrings, audit; do not output red_herrings.
- FAIL-FAST STATUS EXTENSION: status MUST be fail if any required clue fields are missing, if any step lacks mapped or contradiction coverage, or if suspect parity fails.
- SOURCE FORMAT CONTRACT: sourceInCML MUST use bracket-index leaf paths only (no dot-index and no intermediate-node paths).
- DISCRIMINATING ID EXACTNESS: keep discriminating clue IDs as exact string matches, including underscores.
- FULL OBJECT CONTRACT: each clue object MUST include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- SELF-CHECK OUTPUT RULE: run all checks internally and output JSON only; do not output checklist commentary.
- ANTI-COLLAPSE OUTPUT RULE: if checks fail, keep status="fail" but still output a non-empty best-effort clues[] set unless CML evidence is unusable.
- If quality controls require late clues, satisfy late placement with supporting or optional clues only.
- Essential solving clues must remain early or mid.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

```
