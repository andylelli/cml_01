# Actual Prompt Record

- Run ID: `run_2ec58044-f816-487c-96d7-5c608526413d`
- Project ID: `proj_f8e7afed-9a3b-43cd-a161-70ca430c6778`
- Timestamp: `2026-04-25T08:10:11.632Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `retry 1`
- Prompt Hash: `5fcb7add98293767`

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
**Title**: The Timeless Deceit
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (14 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows the hands stuck at ten minutes past eleven...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "The stuck clock indicates that time may have been tampered with...."
   → contradiction | essential | early | temporal | step 1 | terms: stuck, clock, indicates

3. Generate a clue that makes the reader directly observe: "Witnesses recall hearing the clock chime at an unexpected time...."
   → observation | essential | early | temporal | step 2 | terms: witnesses, recall, hearing

4. Generate a clue that provides evidence for: "The unexpected chime suggests the clock was not functioning correctly at the time of death...."
   → contradiction | essential | early | temporal | step 2 | terms: unexpected, chime, suggests

5. Generate a clue that makes the reader directly observe: "The clock shows faint scratch marks on its winding stem...."
   → observation | essential | mid | temporal | step 3 | terms: clock, shows, faint

6. Generate a clue that provides evidence for: "The scratch marks indicate recent manipulation of the clock mechanism...."
   → contradiction | essential | mid | temporal | step 3 | terms: scratch, marks, indicate

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "The stuck clock indicates that time may have been tampered with...."
   → contradiction | essential | mid | temporal | step 1 | terms: stuck, clock, indicates

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The clock in the study was tampered with to create a false timeline of events surrounding Victor's murder...."
   → observation | essential | early | temporal | terms: clock, study, tampered

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "Recreate the sequence of events leading to Victor's death by manipulating the stopped clock, proving..."
   → observation | essential | mid | temporal | terms: recreate, sequence, events

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Muriel Clifton and states the unique trace, preparation detail, or mechanism link that points to Muriel Clifton rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Muriel Clifton, clock, study, tampered

11. Generate a clue showing observable evidence of Muriel Clifton's premeditation or planning (Jealousy over Victor's plans). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: jealousy, victor's, plans

12. Generate a clue that explicitly eliminates suspect Herbert Redmore using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Herbert Redmore because ...").
   → elimination | essential | mid | testimonial | terms: Herbert Redmore

13. Generate a clue that explicitly eliminates suspect Barry Cromer using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Barry Cromer because ...").
   → elimination | essential | mid | testimonial | terms: Barry Cromer

14. Generate one essential early or mid elimination clue that explicitly rules out Herbert Redmore and narrows the solution toward culprit Muriel Clifton. The pointsTo text must start with "Eliminates Herbert Redmore because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Herbert Redmore, Muriel Clifton

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- Clock time at ten minutes past eleven
- Witness statements about the time
- Witnesses recall hearing the clock chime at an unexpected time

## Access Constraints
Actors: Muriel Clifton, Barry Cromer, Herbert Redmore
Objects: Clock, Murder weapon

## Physical Evidence
- Scratch marks on the clock's winding stem

## Evidence-Sensitive Characters
- Herbert Redmore: sensitive items: Alibi verification
- Muriel Clifton: sensitive items: Witness statements
- Barry Cromer: sensitive items: Business records
- Ethel Woodbridge: sensitive items: Household records
- Vivienne Plowden: sensitive items: Witness accounts

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
- Herbert Redmore -> 0
- Muriel Clifton -> 1
- Barry Cromer -> 2
- Ethel Woodbridge -> 3
- Vivienne Plowden -> 4

## Clue Density: dense
Generate 12-18 clues total.
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The murder must have occurred shortly before the clock showed ten minutes past eleven."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - stuck
  - clock
  - indicates
  - unexpected
  - chime
  - suggests
  - scratch
  - marks
  - indicate
- preferred_false_assumption_terms:
  - murder
  - occurred
  - shortly
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

Violations: None
Warnings: The red herrings could be more effectively integrated to mislead the reader without being too obvious.; First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.; Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
Recommendations: Consider adding more clues that directly connect Muriel to the motive and the clock manipulation to strengthen the logical deduction path.; Ensure that all essential clues are clearly marked as such and their relevance is established before the critical moments in the narrative.; First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.; Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.

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
- CASE.inference_path.steps[0].required_evidence[2]
- CASE.inference_path.steps[0].required_evidence[3]
- CASE.inference_path.steps[1].observation
- CASE.inference_path.steps[1].correction
- CASE.inference_path.steps[1].required_evidence[0]
- CASE.inference_path.steps[1].required_evidence[1]
- CASE.inference_path.steps[1].required_evidence[2]
- CASE.inference_path.steps[1].required_evidence[3]
- CASE.inference_path.steps[2].observation
- CASE.inference_path.steps[2].correction
- CASE.inference_path.steps[2].required_evidence[0]
- CASE.inference_path.steps[2].required_evidence[1]
- CASE.inference_path.steps[2].required_evidence[2]
- CASE.inference_path.steps[2].required_evidence[3]
- CASE.constraint_space.time.anchors[0]
- CASE.constraint_space.time.anchors[1]
- CASE.constraint_space.time.contradictions[0]
- CASE.constraint_space.access.actors[0]
- CASE.constraint_space.access.actors[1]
- CASE.constraint_space.access.actors[2]
- CASE.constraint_space.access.objects[0]
- CASE.constraint_space.access.objects[1]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.access.permissions[1]
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
- CASE.cast[4].alibi_window
- CASE.cast[4].access_plausibility
- CASE.cast[4].evidence_sensitivity[0]
- CASE.discriminating_test.evidence_clues[0]
- CASE.discriminating_test.evidence_clues[1]
- CASE.discriminating_test.evidence_clues[2]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

## V2 Hardening Addendum (apply strictly)
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

## V5 Deterministic Source Mapping (highest priority)
- For this run, sourceInCML MUST be selected only from this shortlist:
  - CASE.inference_path.steps[0].observation
  - CASE.inference_path.steps[0].correction
  - CASE.inference_path.steps[1].observation
  - CASE.inference_path.steps[1].correction
  - CASE.inference_path.steps[2].observation
  - CASE.inference_path.steps[2].correction
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
  - CASE.cast[4].alibi_window
  - CASE.cast[4].access_plausibility
- Forbidden in this run: CASE.inference_path.steps[*].mechanism and CASE.inference_path.steps[*].elimination.

Required ID -> sourceInCML mapping (exact):
- clue_mechanism_visibility_core -> CASE.inference_path.steps[2].correction
- clue_core_contradiction_chain -> CASE.inference_path.steps[0].correction
- clue_core_elimination_chain -> CASE.cast[0].alibi_window
- clue_1 -> CASE.inference_path.steps[0].observation
- clue_2 -> CASE.inference_path.steps[0].correction
- clue_3 -> CASE.inference_path.steps[2].correction

Step coverage floor (exact):
- supportsInferenceStep=1 must include at least one contradiction clue.
- supportsInferenceStep=2 must include at least one contradiction clue.
- supportsInferenceStep=3 must include at least one contradiction clue.

Suspect parity floor (exact):
- Include one Herbert Redmore elimination clue with evidenceType=elimination, legal cast[0] source path, and pointsTo containing both a time-window phrase and corroborator phrase.

Direct culprit-evidence floor (exact):
- Include one essential clue with id=clue_culprit_direct_muriel_clifton.
- description and pointsTo must explicitly name "Muriel Clifton".
- description or pointsTo must include one of these incriminating phrases: "direct evidence", "physical trace", "motive", "opportunity", "means", or "only person who could".
- sourceInCML must be CASE.cast[1].access_plausibility or CASE.cast[1].evidence_sensitivity[0].

Late-clue floor (exact):
- Include one clue with id=clue_late_texture_1.
- placement must be late.
- criticality must be optional or supporting.
- evidenceType must be observation.
- sourceInCML must be from the shortlist and must not be a discriminating-test evidence clue path.
- This late clue must not introduce first-time mechanism facts.

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
- V5 SOURCE SHORTLIST RULE: use only the explicitly listed legal source paths in this prompt.
- V5 ID->PATH RULE: required IDs must use the exact source mappings listed in this prompt.
- V5 STEP-3 RULE: at least one contradiction clue MUST use supportsInferenceStep=3.
- V5 YVETTE RULE: include one Herbert Redmore elimination clue with time-window and corroborator wording in pointsTo and a legal cast[0] source path.
- V6 CULPRIT RULE: include clue_culprit_direct_muriel_clifton with explicit Muriel Clifton name plus an incriminating phrase and legal cast[1] source path.
- V6 LATE-CLUE RULE: include clue_late_texture_1 with placement=late and criticality optional/supporting.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

Retry mode (correction targets) and structured payload were included in this run and retained in the captured request.

Retry mode (correction targets):
- Fix these unresolved targets first:
  - [warning] The red herrings could be more effectively integrated to mislead the reader without being too obvious.
  - [warning] First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.
  - [warning] Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
- Retry scope: rewrite only targeted IDs when provided; keep unaffected IDs and wording stable unless a dependency requires change.
- Preserve unaffected clues unless changes are needed for consistency.
- Populate audit arrays to show no unresolved critical defects.
- If any target mentions red-herring overlap, include rewrite table entries as: old phrase -> replacement phrase.
- REQUIRED CLUE CONTENT (must be covered by essential early/mid clues):
  - ACCEPTANCE: clue_mechanism_visibility_core must be essential and early|mid, and must make the mechanism reader-visible before the discriminating test.
  - ACCEPTANCE: clue_core_contradiction_chain must be essential and early|mid, and must overturn the false assumption with concrete evidence.
  - ACCEPTANCE: clue_core_elimination_chain must be essential and early|mid, and must explicitly eliminate at least one eligible non-culprit.
  - ACCEPTANCE: Before Act III, the reader can execute observation -> correction -> elimination to narrow uniquely to the culprit; the discriminating test only confirms.
  - UNIFIED RETRY CONTRACT: Keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering jointly true in the same output.
  - MECHANISM VISIBILITY ORDER: Before Act III, the reader can execute observation -> correction -> elimination using essential early|mid clues; the discriminating test only confirms.
  - DISCRIMINATING ID PARITY CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear in clues[].id and be essential early|mid.
  - CAST PATH COUPLING CONTRACT: If sourceInCML uses CASE.cast[N].*, clue suspect references must use cast[N].name and no other suspect name.
  - FAIL-FAST CONTRACT: If cast-path coupling, source-path legality, or discriminating evidence ID parity fails, status must be fail.
  - DISCRIMINATING ID SET: clue_1, clue_2, clue_3
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.

Structured correction payload (apply exactly):
- must_fix[]:
  - [warning] The red herrings could be more effectively integrated to mislead the reader without being too obvious.
  - [warning] First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.
  - [warning] Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
- cast_index_to_name_map[] (authoritative for CASE.cast[N].*):
  - [0] Herbert Redmore
  - [1] Muriel Clifton
  - [2] Barry Cromer
  - [3] Ethel Woodbridge
  - [4] Vivienne Plowden
- cast_path_binding_rules[]:
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.
  - cast_index_to_name_map[0] = Herbert Redmore
  - cast_index_to_name_map[1] = Muriel Clifton
  - cast_index_to_name_map[2] = Barry Cromer
  - cast_index_to_name_map[3] = Ethel Woodbridge
  - cast_index_to_name_map[4] = Vivienne Plowden
- forbidden_terms[] (do not use in red herring description/misdirection):
  - stuck
  - clock
  - indicates
  - unexpected
  - chime
  - suggests
  - scratch
  - marks
  - indicate
- preferred_terms[] (use these instead when possible):
  - none
- required_replacements[]:
  - old phrase -> replacement phrase (for every overlap-triggering phrase)
  - old phrase -> replacement phrase (for every invalid source path token)

Hard retry contract:
- If forbidden_terms[] is non-empty, none of those terms may appear in redHerrings[].description or redHerrings[].misdirection.
- Retry CAST PATH BINDING CONTRACT (MANDATORY): for each clue with sourceInCML=CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name from cast_index_to_name_map[].
- Mandatory pre-output self-check: iterate every clue and verify cast-path binding, source-path legality, and discriminating evidence ID coverage before final output.
- If that cannot be satisfied while keeping red herring coherence, return status="fail" with the blocking term list in audit.invalidSourcePaths.
```
