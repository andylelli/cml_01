# Actual Prompt Record

- Run ID: `run_19eda5b0-8198-450e-b6b9-899c9b63f44e`
- Project ID: `proj_8ad2ffee-2b37-48f6-b589-2ee6aa477191`
- Timestamp: `2026-04-25T07:39:08.392Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `retry 1`
- Prompt Hash: `604ae3d3e28b3482`

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
**Title**: A Timely Deception
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (14 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows a time of ten minutes past eleven...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "The clock was deliberately tampered with to mislead the investigation...."
   → contradiction | essential | early | temporal | step 1 | terms: clock, deliberately, tampered

3. Generate a clue that makes the reader directly observe: "Witnesses reported hearing a scream at eleven o'clock...."
   → observation | essential | early | temporal | step 2 | terms: witnesses, reported, hearing

4. Generate a clue that provides evidence for: "If the clock is wrong, the timing of the scream must be reevaluated...."
   → contradiction | essential | early | temporal | step 2 | terms: clock, wrong,, timing

5. Generate a clue that makes the reader directly observe: "The garden's footprint patterns lead away from the study...."
   → observation | essential | mid | physical | step 3 | terms: garden's, footprint, patterns

6. Generate a clue that provides evidence for: "The footprints show movement inconsistent with the clock's time...."
   → contradiction | essential | mid | temporal | step 3 | terms: footprints, movement, inconsistent

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "The clock was deliberately tampered with to mislead the investigation...."
   → contradiction | essential | mid | temporal | step 1 | terms: clock, deliberately, tampered

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The clock in the study was tampered with to create a false timeline...."
   → observation | essential | early | temporal | terms: clock, study, tampered

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A controlled reenactment of the clock's timeline is staged, comparing the clock's indicated time aga..."
   → observation | essential | mid | temporal | terms: controlled, reenactment, clock's

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Gervaise Lacy and states the unique trace, preparation detail, or mechanism link that points to Gervaise Lacy rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Gervaise Lacy, clock, study, tampered

11. Generate a clue showing observable evidence of Gervaise Lacy's premeditation or planning (Desire for inheritance). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: desire, inheritance

12. Generate a clue that explicitly eliminates suspect Derek Delacroix using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Derek Delacroix because ...").
   → elimination | essential | mid | testimonial | terms: Derek Delacroix

13. Generate a clue that explicitly eliminates suspect Sharon Beaumont using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Sharon Beaumont because ...").
   → elimination | essential | mid | testimonial | terms: Sharon Beaumont

14. Generate one essential early or mid elimination clue that explicitly rules out Derek Delacroix and narrows the solution toward culprit Gervaise Lacy. The pointsTo text must start with "Eliminates Derek Delacroix because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Derek Delacroix, Gervaise Lacy

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- the moment of death
- the clock timestamp
- Witnesses claim to hear sounds after the clock shows the time of death.

## Access Constraints
Actors: Gervaise Lacy, Derek Delacroix, Sharon Beaumont
Objects: the clock, the study, the garden

## Physical Evidence
- Fingerprints on the clock face

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
- Peter Devereux -> 0
- Gervaise Lacy -> 1
- Derek Delacroix -> 2
- Sandra Waldegrave -> 3
- Sharon Beaumont -> 4

## Clue Density: dense
Generate 12-18 clues total.
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "Peter was murdered at ten minutes past eleven."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - clock
  - deliberately
  - tampered
  - wrong,
  - timing
  - footprints
  - movement
  - inconsistent
- preferred_false_assumption_terms:
  - peter
  - murdered
  - minutes
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

Violations: 1. [critical] Information Parity: Critical Information Parity breach: the reader does not know about the clock's tampering until the discriminating test.; 2. [critical] Logical Deducibility: The reader cannot logically deduce the solution without knowing the clock was tampered with until the discriminating test.; 3. [critical] No Withholding: The detective knows about the clock's tampering, which is not revealed to the reader until the discriminating test.
Warnings: First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.; Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
Recommendations: Consider adding a clue that hints at the clock's tampering earlier in the narrative to improve logical deducibility and information parity.; First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.; Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.

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
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, any suspect named in clue description/pointsTo as the owner/subject of that evidence must equal cast[N].name from the Name->Index map.
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
- CASE.constraint_space.access.objects[2]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.physical.laws[0]
- CASE.constraint_space.physical.traces[0]
- CASE.cast[0].alibi_window
- CASE.cast[0].access_plausibility
- CASE.cast[1].alibi_window
- CASE.cast[1].access_plausibility
- CASE.cast[2].alibi_window
- CASE.cast[2].access_plausibility
- CASE.cast[3].alibi_window
- CASE.cast[3].access_plausibility
- CASE.cast[4].alibi_window
- CASE.cast[4].access_plausibility
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
- OUTPUT SHAPE CONTRACT: Include all three fixed IDs exactly once each — clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain — and each must be criticality="essential" with placement="early" or "mid".
- MECHANISM VISIBILITY: At least one essential early/mid clue must surface the core mechanism detail from hidden_model.mechanism.description. The reader must encounter the method before the discriminating test exploits it.
- CONTRADICTION CHAIN: At least one essential early/mid contradiction clue must explicitly overturn the false assumption with concrete scene-observable evidence before Act III.
- ELIMINATION CHAIN: At least one essential early/mid elimination clue must explicitly eliminate an eligible non-culprit and narrow the solution toward the culprit.
- DISCRIMINATING TEST CLUES: Any clue that enables the discriminating test to make sense must be placed "early" or "mid". The discriminating test scene exploits knowledge the reader already has — it must NEVER be the reader's first exposure to the mechanism detail.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- CULPRIT-UNIQUE CLUE: At least one essential clue must explicitly name the culprit in description or pointsTo and state the unique mechanism trace, preparation detail, or access fact that points to that culprit rather than any non-culprit.
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
- CAST PATH BINDING CONTRACT: Use the Name->Index map as authoritative. If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- FAIL-FAST STATUS: status MUST be "fail" if any cast-path mismatch, illegal source path, or missing discriminating-test evidence clue ID remains after self-check.
- REQUIRED FIELDS CONTRACT: each clue MUST include non-empty sourceInCML, pointsTo, and supportsInferenceStep.
- PER-STEP COVERAGE CONTRACT: each inference step (1..3) MUST have at least one mapped clue and at least one contradiction clue.
- SUSPECT PARITY CONTRACT: any non-culprit suspect MUST have elimination/alibi evidence parity.
- TOP-LEVEL KEY CONTRACT: output exactly status, clues, redHerrings, audit; do not output red_herrings.
- FAIL-FAST STATUS EXTENSION: status MUST be fail if any required clue fields are missing, if any step lacks mapped or contradiction coverage, or if suspect parity fails.
- SOURCE FORMAT CONTRACT: sourceInCML MUST use bracket-index leaf paths only (no dot-index and no intermediate-node paths).
- DISCRIMINATING ID EXACTNESS: keep discriminating clue IDs as exact string matches, including underscores.
- FULL OBJECT CONTRACT: each clue object MUST include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- SELF-CHECK OUTPUT RULE: run all checks internally and output JSON only; do not output checklist commentary.
- ANTI-COLLAPSE OUTPUT RULE: if checks fail, keep status="fail" but still output a non-empty best-effort clues[] set unless CML evidence is unusable.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

Retry mode (correction targets):
- Fix these unresolved targets first:
  - [critical] Information Parity: Critical Information Parity breach: the reader does not know about the clock's tampering until the discriminating test.
  - [critical] Logical Deducibility: The reader cannot logically deduce the solution without knowing the clock was tampered with until the discriminating test.
  - [critical] No Withholding: The detective knows about the clock's tampering, which is not revealed to the reader until the discriminating test.
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
  - DISCRIMINATING ID SET: clue_clock_tampering, clue_witness_scream, clue_footprints
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.

Structured correction payload (apply exactly):
- must_fix[]:
  - [critical] Information Parity: Critical Information Parity breach: the reader does not know about the clock's tampering until the discriminating test.
  - [critical] Logical Deducibility: The reader cannot logically deduce the solution without knowing the clock was tampered with until the discriminating test.
  - [critical] No Withholding: The detective knows about the clock's tampering, which is not revealed to the reader until the discriminating test.
  - [warning] First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.
  - [warning] Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
- cast_index_to_name_map[] (authoritative for CASE.cast[N].*):
  - [0] Peter Devereux
  - [1] Gervaise Lacy
  - [2] Derek Delacroix
  - [3] Sandra Waldegrave
  - [4] Sharon Beaumont
- cast_path_binding_rules[]:
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.
  - cast_index_to_name_map[0] = Peter Devereux
  - cast_index_to_name_map[1] = Gervaise Lacy
  - cast_index_to_name_map[2] = Derek Delacroix
  - cast_index_to_name_map[3] = Sandra Waldegrave
  - cast_index_to_name_map[4] = Sharon Beaumont
- forbidden_terms[] (do not use in red herring description/misdirection):
  - clock
  - deliberately
  - tampered
  - wrong,
  - timing
  - footprints
  - movement
  - inconsistent
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
