# Actual Prompt Record

- Run ID: `run_a269b1b8-48ac-40bf-a9e3-b3abe366718c`
- Project ID: `proj_edc070bd-a528-4d4f-a99b-122b58f12845`
- Timestamp: `2026-04-24T20:51:34.997Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.4`
- Max Tokens: `3000`
- Attempt: `first`
- Prompt Hash: `150e818a492e7ffe`

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
**Title**: The Timely Deception
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (15 required)
1. Generate a clue that makes the reader directly observe: "The clock in the study shows ten minutes past eleven when found stopped...."
   → observation | essential | early | temporal | step 1 | terms: clock, study, shows

2. Generate a clue that provides evidence for: "This indicates the clock was not functioning correctly at the time of the murder...."
   → contradiction | essential | early | temporal | step 1 | terms: indicates, clock, functioning

3. Generate a clue that makes the reader directly observe: "Kenneth's pocket watch runs eight minutes fast compared to the clock...."
   → observation | essential | early | temporal | step 2 | terms: kenneth's, pocket, watch

4. Generate a clue that provides evidence for: "Kenneth's alibi is compromised by the discrepancy between his watch and the actual time...."
   → contradiction | essential | early | temporal | step 2 | terms: kenneth's, alibi, compromised

5. Generate a clue that makes the reader directly observe: "The missing weight from the clock's pendulum suggests tampering...."
   → observation | essential | mid | temporal | step 3 | terms: missing, weight, clock's

6. Generate a clue that provides evidence for: "The clock was adjusted to misrepresent the time of death...."
   → contradiction | essential | mid | temporal | step 3 | terms: clock, adjusted, misrepresent

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "This indicates the clock was not functioning correctly at the time of the murder...."
   → contradiction | essential | mid | temporal | step 1 | terms: indicates, clock, functioning

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The Clockwork Alibi - A clock was tampered with to create a false alibi for the murderer...."
   → observation | essential | early | temporal | terms: clockwork, alibi, clock

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "By comparing the actual time of death with the discrepancies found in the clock and Kenneth's watch,..."
   → observation | essential | mid | temporal | terms: comparing, actual, death

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Christopher Pengelly and states the unique trace, preparation detail, or mechanism link that points to Christopher Pengelly rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Christopher Pengelly, clockwork, alibi, clock

11. Generate a clue showing observable evidence of Christopher Pengelly's premeditation or planning (financial gain). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: financial

12. Generate a clue that explicitly eliminates suspect Enys Lawry using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Enys Lawry because ...").
   → elimination | essential | mid | testimonial | terms: Enys Lawry

13. Generate a clue that explicitly eliminates suspect Ailla Hugo using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Ailla Hugo because ...").
   → elimination | essential | mid | testimonial | terms: Ailla Hugo

14. Generate a clue that explicitly eliminates suspect Kenneth Stephens using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Kenneth Stephens because ...").
   → elimination | essential | mid | testimonial | terms: Kenneth Stephens

15. Generate one essential early or mid elimination clue that explicitly rules out Enys Lawry and narrows the solution toward culprit Christopher Pengelly. The pointsTo text must start with "Eliminates Enys Lawry because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Enys Lawry, Christopher Pengelly

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- 10:15 PM
- 10:30 PM
- The clock shows ten minutes past eleven when found stopped.

## Access Constraints
Actors: Christopher Pengelly, Enys Lawry, Ailla Hugo, Kenneth Stephens
Objects: the clock, the victim's belongings

## Physical Evidence
- missing weight from the clock's pendulum
- disturbances around the clock

## Evidence-Sensitive Characters
- Christopher Pengelly: sensitive items: alibi inconsistencies
- Enys Lawry: sensitive items: timing of alibi
- Ailla Hugo: sensitive items: potential family scandal
- Kenneth Stephens: sensitive items: conflict of interest

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
- Christopher Pengelly -> 0
- Enys Lawry -> 1
- Ailla Hugo -> 2
- Kenneth Stephens -> 3
- Nessa Tallack -> 4

## Clue Density: dense
Generate 12-18 clues total.
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The murder must have taken place during the time that the suspect claims to have been elsewhere."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - indicates
  - clock
  - functioning
  - kenneth's
  - alibi
  - compromised
  - adjusted
  - misrepresent
- preferred_false_assumption_terms:
  - murder
  - taken
  - place
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
Status: **needs-revision**

Violations: None
Warnings: None
Recommendations: Strict first-attempt contracts are active: apply strict source whitelist and required ID->source mappings exactly.; If any strict contract cannot be satisfied, return status=fail with unresolved blockers in audit.invalidSourcePaths.; Do not defer strict mapping and direct culprit evidence requirements to retry mode.

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
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.access.permissions[1]
- CASE.constraint_space.physical.laws[0]
- CASE.constraint_space.physical.traces[0]
- CASE.constraint_space.physical.traces[1]
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
- CASE.discriminating_test.evidence_clues[0]
- CASE.discriminating_test.evidence_clues[1]
- CASE.discriminating_test.evidence_clues[2]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

## Strict First-Attempt Contract Payload (apply exactly)
- This payload is active on first attempt and retry.
- Apply these contracts even when violations[] and warnings[] are empty.
- If any strict contract cannot be satisfied, return status="fail" and list blockers in audit.invalidSourcePaths.

- strict_source_paths[] (hard whitelist for sourceInCML exact match):
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
  - CASE.constraint_space.access.permissions[0]
  - CASE.constraint_space.access.permissions[1]
  - CASE.constraint_space.physical.laws[0]
  - CASE.constraint_space.physical.traces[0]
  - CASE.constraint_space.physical.traces[1]
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
  - CASE.discriminating_test.evidence_clues[0]
  - CASE.discriminating_test.evidence_clues[1]
  - CASE.discriminating_test.evidence_clues[2]
  - CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
  - CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
  - CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

- required_id_to_source_mapping[]:
  - clue_1 -> CASE.discriminating_test.evidence_clues[0]
  - clue_2 -> CASE.discriminating_test.evidence_clues[1]
  - clue_3 -> CASE.discriminating_test.evidence_clues[2]
  - clue_culprit_direct_christopher_pengelly -> CASE.cast[0].access_plausibility
  - clue_1 -> CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
  - clue_2 -> CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
  - clue_3 -> CASE.prose_requirements.clue_to_scene_mapping[2].clue_id

- required_step_coverage_floors[]:
  - step=1, requireContradiction=true, requireMapped=true
  - step=2, requireContradiction=true, requireMapped=true
  - step=3, requireContradiction=true, requireMapped=true

- required_late_clue_slot:
  - id=clue_late_optional_slot_1, placement=late, criticality=optional

- required_direct_culprit_clue:
  - id=clue_culprit_direct_christopher_pengelly, culprit=Christopher Pengelly
  - allowed_source_paths:
    - CASE.cast[0].access_plausibility
    - CASE.cast[0].alibi_window
    - CASE.cast[0].evidence_sensitivity[0]
    - CASE.inference_path.steps[2].observation
    - CASE.inference_path.steps[2].correction
  - required_phrases:
    - Christopher Pengelly
    - direct evidence
    - means and opportunity

Strict ordering:
1) source path legality + whitelist exact-match
2) required id-to-source mappings
3) step coverage floors
4) required direct culprit clue
5) required late optional slot


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
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

Strict first-attempt contract payload:
- Enforce strict_source_paths[] as an exact sourceInCML whitelist.
- Enforce required_id_to_source_mapping[] exactly (ID and sourceInCML both).
- Enforce required_step_coverage_floors[] by ensuring mapped contradiction coverage per required step.
- Emit required_direct_culprit_clue exactly once with required id and culprit naming.
- Emit required_late_clue_slot exactly once when provided.
- These strict contracts apply even when no violations/warnings are listed.
```
