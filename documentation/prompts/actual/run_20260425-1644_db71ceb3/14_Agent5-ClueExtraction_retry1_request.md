# Actual Prompt Record

- Run ID: `run_db71ceb3-63a9-4d62-b77a-6882fb75bd3f`
- Project ID: `proj_da695adb-c7f9-4353-b427-133ed4e32a28`
- Timestamp: `2026-04-25T16:47:33.081Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `retry 1`
- Prompt Hash: `842a12dfad11f2bc`

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
**Title**: The Clock's Deceit
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (14 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows ten minutes past eleven...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "The clock's time contradicts eyewitness accounts...."
   → contradiction | essential | early | temporal | step 1 | terms: clock's, contradicts, eyewitness

3. Generate a clue that makes the reader directly observe: "A unique winding key is found near the clock...."
   → observation | essential | early | temporal | step 2 | terms: unique, winding, found

4. Generate a clue that provides evidence for: "The presence of the key indicates potential tampering with the clock...."
   → contradiction | essential | early | temporal | step 2 | terms: presence, indicates, potential

5. Generate a clue that makes the reader directly observe: "Dust on the clock face indicates it hasn't been disturbed in days...."
   → observation | essential | mid | temporal | step 3 | terms: clock, indicates, hasn't

6. Generate a clue that provides evidence for: "This contradicts claims of the clock being tampered with during the party...."
   → contradiction | essential | mid | temporal | step 3 | terms: contradicts, claims, clock

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "The clock's time contradicts eyewitness accounts...."
   → contradiction | essential | mid | temporal | step 1 | terms: clock's, contradicts, eyewitness

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The mechanism relies on clock, study, and minut to expose the false timing...."
   → observation | essential | early | temporal | terms: mechanism, relies, clock,

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A controlled test comparing the clock's time with eyewitness accounts shows inconsistencies...."
   → observation | essential | mid | temporal | terms: controlled, comparing, clock's

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Roger Merton and states the unique trace, preparation detail, or mechanism link that points to Roger Merton rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Roger Merton, mechanism, relies, clock,

11. Generate a clue showing observable evidence of Roger Merton's premeditation or planning (Financial gain). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: financial

12. Generate a clue that explicitly eliminates suspect Joan Rayleigh using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Joan Rayleigh because ...").
   → elimination | essential | mid | testimonial | terms: Joan Rayleigh

13. Generate a clue that explicitly eliminates suspect Philip Ingram using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Philip Ingram because ...").
   → elimination | essential | mid | testimonial | terms: Philip Ingram

14. Generate one essential early or mid elimination clue that explicitly rules out Joan Rayleigh and narrows the solution toward culprit Roger Merton. The pointsTo text must start with "Eliminates Joan Rayleigh because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Joan Rayleigh, Roger Merton

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- Theodora last seen at 10:45 PM
- Time of death recorded at 11:15 PM
- Clock shows 10:05 PM while Theodora was last seen at 10:45 PM.

## Access Constraints
Actors: Roger Merton, Joan Rayleigh, Philip Ingram
Objects: The clock, Theodora's drink, Garden tools

## Physical Evidence
- Fingerprints on the clock face
- Footprints in the garden

## Evidence-Sensitive Characters
- Theodora Compton: sensitive items: Financial documents, Guest testimonies
- Roger Merton: sensitive items: Witness statements, Financial records
- Joan Rayleigh: sensitive items: Her own alibi, Witness observations
- Philip Ingram: sensitive items: Business ledgers, Witness statements
- Geoffrey Plowden: sensitive items: Witness statements, Physical evidence

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
- Theodora Compton -> 0
- Roger Merton -> 1
- Joan Rayleigh -> 2
- Philip Ingram -> 3
- Geoffrey Plowden -> 4

## Clue Density: dense
Generate 12-18 clues total.
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The murder occurred just before the clock stopped showing quarter past eleven."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - clock's
  - contradicts
  - eyewitness
  - presence
  - indicates
  - potential
  - claims
  - clock
- preferred_false_assumption_terms:
  - murder
  - occurred
  - before
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

Violations: 1. [critical] Clue Visibility: Essential fingerprint evidence is introduced only at the discriminating test, preventing logical deduction.; 2. [critical] Information Parity: The detective has knowledge of the fingerprints that the reader does not, creating a critical information gap.; 3. [critical] Logical Deducibility: Reader cannot deduce the solution due to missing essential clues before the discriminating test.; 4. [critical] Discriminating Test Timing: The discriminating test relies on evidence not introduced until that scene.; 5. [critical] No Withholding: The detective's knowledge of the fingerprints is not shared with the reader, violating fair play.
Warnings: Consider adding more early clues to enhance the reader's ability to deduce the solution.; First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.; Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
Recommendations: Strengthen the narrative by ensuring all essential clues are revealed in a timely manner to enhance logical deduction.

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
- CASE.constraint_space.access.objects[2]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.access.permissions[1]
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
- CASE.cast[4].evidence_sensitivity[0]
- CASE.cast[4].evidence_sensitivity[1]
- CASE.discriminating_test.evidence_clues[0]
- CASE.discriminating_test.evidence_clues[1]
- CASE.discriminating_test.evidence_clues[2]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[3].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[4].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[5].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[6].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[7].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[8].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[9].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[10].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[11].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[12].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[13].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[14].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[15].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[16].clue_id

## Deterministic Output Contracts
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


    Retry mode (bounded delta repair):
    - Retry scope: use violation_codes[], targeted_clue_ids[], and preserve_clue_ids[] below as the authoritative delta contract.
    - Do not reopen unaffected clues or red herrings beyond the bounded scope declared below.
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
  - DISCRIMINATING ID SET: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_12
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.

    Structured correction payload (bounded delta; apply exactly):
    - violation_codes[]:
      - clue_visibility
  - information_parity
  - logical_deducibility
  - discriminating_test_timing
  - no_withholding
- must_fix[]:
  - [critical] Clue Visibility: Essential fingerprint evidence is introduced only at the discriminating test, preventing logical deduction.
  - [critical] Information Parity: The detective has knowledge of the fingerprints that the reader does not, creating a critical information gap.
  - [critical] Logical Deducibility: Reader cannot deduce the solution due to missing essential clues before the discriminating test.
  - [critical] Discriminating Test Timing: The discriminating test relies on evidence not introduced until that scene.
  - [critical] No Withholding: The detective's knowledge of the fingerprints is not shared with the reader, violating fair play.
  - [warning] Consider adding more early clues to enhance the reader's ability to deduce the solution.
  - [warning] First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.
  - [warning] Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.
    - targeted_clue_ids[]:
      - clue_mechanism_visibility_core
  - clue_core_contradiction_chain
  - clue_core_elimination_chain
  - clue_12
    - preserve_clue_ids[]:
      - clue_1
  - clue_2
  - clue_3
  - clue_4
  - clue_5
  - clue_6
  - clue_7
  - clue_8
  - clue_9
  - clue_10
  - clue_culprit_direct_roger_merton
  - clue_11
  - clue_late_optional_slot_1
  - clue_fp_contradiction_step_3
- strict_source_paths[]:
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
  - CASE.constraint_space.access.permissions[1]
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
- required_id_to_source_mappings[]:
  - clue_mechanism_visibility_core -> CASE.discriminating_test.evidence_clues[0]
  - clue_core_contradiction_chain -> CASE.discriminating_test.evidence_clues[1]
  - clue_12 -> CASE.discriminating_test.evidence_clues[2]
  - clue_culprit_direct_roger_merton -> CASE.cast[1].access_plausibility
  - clue_core_elimination_chain -> CASE.prose_requirements.clue_to_scene_mapping[3].clue_id
  - clue_1 -> CASE.prose_requirements.clue_to_scene_mapping[4].clue_id
  - clue_2 -> CASE.prose_requirements.clue_to_scene_mapping[5].clue_id
  - clue_10 -> CASE.prose_requirements.clue_to_scene_mapping[6].clue_id
  - clue_11 -> CASE.prose_requirements.clue_to_scene_mapping[7].clue_id
  - clue_3 -> CASE.prose_requirements.clue_to_scene_mapping[8].clue_id
  - clue_4 -> CASE.prose_requirements.clue_to_scene_mapping[9].clue_id
  - clue_5 -> CASE.prose_requirements.clue_to_scene_mapping[10].clue_id
  - clue_6 -> CASE.prose_requirements.clue_to_scene_mapping[11].clue_id
  - clue_7 -> CASE.prose_requirements.clue_to_scene_mapping[12].clue_id
  - clue_8 -> CASE.prose_requirements.clue_to_scene_mapping[13].clue_id
  - clue_9 -> CASE.prose_requirements.clue_to_scene_mapping[14].clue_id
  - clue_fp_contradiction_step_3 -> CASE.prose_requirements.clue_to_scene_mapping[16].clue_id
- required_step_coverage_floors[]:
  - step 1 | contradiction=true | mapped=true
  - step 2 | contradiction=true | mapped=true
  - step 3 | contradiction=true | mapped=true
- required_late_clue_slot:
  - id=clue_late_optional_slot_1 | placement=late | criticality=optional
- required_direct_culprit_clue:
  - id=clue_culprit_direct_roger_merton | culprit=Roger Merton
  - allowed_source_paths=CASE.cast[1].access_plausibility, CASE.cast[1].alibi_window, CASE.cast[1].evidence_sensitivity[0]
  - required_phrases=Roger Merton, direct evidence, means and opportunity
- cast_index_to_name_map[] (authoritative for CASE.cast[N].*):
  - [0] Theodora Compton
  - [1] Roger Merton
  - [2] Joan Rayleigh
  - [3] Philip Ingram
  - [4] Geoffrey Plowden
- cast_path_binding_rules[]:
  - CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.
  - CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.
  - cast_index_to_name_map[0] = Theodora Compton
  - cast_index_to_name_map[1] = Roger Merton
  - cast_index_to_name_map[2] = Joan Rayleigh
  - cast_index_to_name_map[3] = Philip Ingram
  - cast_index_to_name_map[4] = Geoffrey Plowden
- forbidden_terms[] (do not use in red herring description/misdirection):
  - clock's
  - contradicts
  - eyewitness
  - presence
  - indicates
  - potential
  - claims
  - clock
- preferred_terms[] (use these instead when possible):
  - none
- required_replacements[]:
  - old phrase -> replacement phrase (for every overlap-triggering phrase)
  - old phrase -> replacement phrase (for every invalid source path token)

Hard retry contract:
- Rewrite targeted_clue_ids[] only; add missing IDs from targeted_clue_ids[] when must_fix[] requires them.
- Preserve preserve_clue_ids[] unchanged unless a targeted dependency forces a paired update.
- If targeted_clue_ids[] is empty, limit changes to the minimum new IDs required by must_fix[].
- strict_source_paths[] are the authoritative legal retry sourceInCML leaves; do not emit any clue outside that whitelist.
- Keep every required_id_to_source_mappings[] clue ID exact, early|mid, and essential.
- Satisfy every required_step_coverage_floors[] entry in the same output; do not defer contradiction coverage to a later retry.
- If required_late_clue_slot is present, keep that exact ID late and non-essential.
- If required_direct_culprit_clue is present, keep that exact ID, name the culprit explicitly, and use one of its allowed_source_paths.
- If forbidden_terms[] is non-empty, none of those terms may appear in redHerrings[].description or redHerrings[].misdirection.
- Retry CAST PATH BINDING CONTRACT (MANDATORY): for each clue with sourceInCML=CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name from cast_index_to_name_map[].
- Mandatory pre-output self-check: iterate every clue and verify cast-path binding, source-path legality, and discriminating evidence ID coverage before final output.
- If that cannot be satisfied while keeping red herring coherence, return status="fail" with the blocking term list in audit.invalidSourcePaths.
```
