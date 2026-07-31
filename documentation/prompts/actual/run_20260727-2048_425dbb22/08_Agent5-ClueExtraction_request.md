# Actual Prompt Record

- Run ID: `run_425dbb22-2e5e-4f39-86a6-7935a3c3830b`
- Project ID: `proj_8d84e7a9-9798-4656-8c29-73c856049d93`
- Timestamp: `2026-07-27T20:51:33.663Z`
- Agent: `Agent5-ClueExtraction`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.4`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b2eadce144482d22`

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
**Title**: The Frosted Hourglass Mystery
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 7 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (20 required)
1. Generate a clue that makes the reader directly observe: "The hourglass on the study mantelpiece contains minute frost crystals visible on the inner glass sur..."
   → observation | essential | early | temporal | step 1 | terms: hourglass, study, mantelpiece

2. Generate a clue that provides evidence for: "The presence of frost crystals indicates condensation froze inside the hourglass, causing temporary ..."
   → contradiction | essential | early | temporal | step 1 | terms: presence, frost, crystals

3. Generate a clue that makes the reader directly observe: "A faint scratch on the study room window latch indicates it was left slightly ajar during the evenin..."
   → observation | essential | early | spatial | step 2 | terms: faint, scratch, study

4. Generate a clue that provides evidence for: "A slightly open window allowed cold air in, lowering the room temperature enough to freeze moisture ..."
   → contradiction | essential | early | temporal | step 2 | terms: slightly, window, allowed

5. Generate a clue that makes the reader directly observe: "Witnesses agree the garden gate latched at half past six, but wind direction logs show a shift causi..."
   → observation | essential | mid | temporal | step 3 | terms: witnesses, agree, garden

6. Generate a clue that provides evidence for: "The auditory perception of the gate latch time was misjudged due to environmental acoustics, invalid..."
   → contradiction | essential | mid | temporal | step 3 | terms: auditory, perception, latch

7. Generate a clue that makes the reader directly observe: "Charles Montague was observed near the study shortly before half past seven and had motive due to bl..."
   → observation | essential | mid | temporal | step 4 | terms: charles, montague, observed

8. Generate a clue that provides evidence for: "Charles had both motive and opportunity within the corrected timeline of the murder after the hourgl..."
   → contradiction | essential | mid | temporal | step 4 | terms: charles, motive, opportunity

9. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "The presence of frost crystals indicates condensation froze inside the hourglass, causing temporary blockage of sand flow...."
   → contradiction | essential | mid | temporal | step 1 | terms: presence, frost, crystals

10. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "The sealed hourglass on the study mantelpiece contained trapped moisture that condensed and froze overnight due to the cold room temperature..."
   → observation | essential | early | temporal | terms: sealed, hourglass, study

11. Generate one essential EARLY clue giving a concrete, fair-play indicator of the manner of death (struck with a heavy antique paperweight) observable at the body-discovery scene — e.g. for blunt-force: a head wound, a bloodied heavy object, or bruising. Do NOT name or explain the concealment trick; only the physical tell a witness could see at the scene.
   → observation | essential | early | testimonial | terms: struck, heavy, antique, wound, blood, bruis, blunt

12. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "A controlled temperature test is conducted by placing a sealed hourglass identical to the manor's in..."
   → observation | essential | mid | temporal | terms: controlled, temperature, conducted

13. Generate one essential mid-story clue whose description or pointsTo explicitly names Charles Montague and states the unique trace, preparation detail, or mechanism link that points to Charles Montague rather than any non-culprit.
   → observation | essential | mid | temporal | terms: Charles Montague, sealed, hourglass, study

14. Generate one essential early-or-mid clue establishing that Charles Montague UNIQUELY had the means/skill/access/knowledge required to execute the concealment mechanism, and that the other suspects did not — so the reveal relies only on this already-planted capability, never on a means introduced for the first time at the confrontation.
   → elimination | essential | mid | temporal | terms: Charles Montague, sealed, hourglass, study

15. Generate a clue showing observable evidence of Charles Montague's premeditation or planning (Blackmail threat from victim). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.
   → observation | essential | mid | behavioral | terms: blackmail, threat, victim

16. Generate a clue that explicitly eliminates suspect Margaret Hensley using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Margaret Hensley because ...").
   → elimination | essential | mid | testimonial | terms: Margaret Hensley

17. Generate a clue that explicitly eliminates suspect Edward Winthrope using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Edward Winthrope because ...").
   → elimination | essential | mid | testimonial | terms: Edward Winthrope

18. Generate a clue that explicitly eliminates suspect Clara Simmons using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Clara Simmons because ...").
   → elimination | essential | mid | testimonial | terms: Clara Simmons

19. Generate a clue that explicitly eliminates suspect James Fletcher using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates James Fletcher because ...").
   → elimination | essential | mid | testimonial | terms: James Fletcher

20. Generate one essential early or mid elimination clue that explicitly rules out Margaret Hensley and narrows the solution toward culprit Charles Montague. The pointsTo text must start with "Eliminates Margaret Hensley because ..." and cite corroborated evidence.
   → elimination | essential | mid | testimonial | terms: Margaret Hensley, Charles Montague

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Temporal Constraints
- Half past six: Hourglass indicates death time
- Half past seven: Body discovered
- Quarter past six: Margaret Hensley last saw Lady Beatrice alive
- Half past six: Garden gate latch sound heard
- Hourglass empty but room temperature too low for normal sand flow
- Servants' consistent testimony conflicts with physical evidence of delayed sand flow
- Garden gate latch time conflicts with corrected time of death

## Access Constraints
Actors: Charles Montague, Margaret Hensley, Edward Winthrope, Clara Simmons, James Fletcher
Objects: Sealed hourglass, Heavy antique paperweight, Garden gate latch, Study room window

## Physical Evidence
- Minute frost crystals inside hourglass glass surface
- Damp spot on hourglass base matching condensation pattern
- Faint scratch on study window latch consistent with deliberate slight opening

## Evidence-Sensitive Characters
- Inspector Helen Marwood: sensitive items: Sensitive to contradictions in testimony
- Charles Montague: sensitive items: Knowledge of manor schedules, Access to hourglass
- Margaret Hensley: sensitive items: Presence near hourglass, Witness to victim’s last movements
- Edward Winthrope: sensitive items: Control over clock and schedules
- Clara Simmons: sensitive items: Knowledge of study meetings, Observed unusual hourglass placement
- James Fletcher: sensitive items: Knowledge of garden gate latch, Presence near manor grounds

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
- inference_path steps path index range: 0..3
- supportsInferenceStep valid range: 1..4
- constraint_space.time.anchors index range: 0..3
- constraint_space.time.contradictions index range: 0..2
- cast index range: 0..6

## Cast Name -> Index Map (for CASE.cast[N] paths)
- Inspector Helen Marwood -> 0
- Lady Beatrice Winthrope -> 1
- Charles Montague -> 2
- Margaret Hensley -> 3
- Edward Winthrope -> 4
- Clara Simmons -> 5
- James Fletcher -> 6

## Clue Density: dense
Generate at least 20 clues (mandatory requirements exceed dense target range).
Additional optional clues (4-6 extra) for texture.

## Red Herring Budget: 2
Create 2 red herrings that support the false assumption: "The hourglass on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six."

## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
  - presence
  - frost
  - crystals
  - slightly
  - window
  - allowed
  - auditory
  - perception
  - latch
  - charles
  - motive
  - opportunity
- preferred_false_assumption_terms:
  - hourglass
  - mantelpiece
  - normally
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
- Essential clues minimum: 4
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
- If inference_path has 4 step(s), valid supportsInferenceStep/source step indices are 1..4 and 0..3 respectively.
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
- CASE.death_method
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
- CASE.inference_path.steps[1].observation
- CASE.inference_path.steps[1].correction
- CASE.inference_path.steps[1].required_evidence[0]
- CASE.inference_path.steps[1].required_evidence[1]
- CASE.inference_path.steps[1].required_evidence[2]
- CASE.inference_path.steps[2].observation
- CASE.inference_path.steps[2].correction
- CASE.inference_path.steps[2].required_evidence[0]
- CASE.inference_path.steps[2].required_evidence[1]
- CASE.inference_path.steps[2].required_evidence[2]
- CASE.inference_path.steps[3].observation
- CASE.inference_path.steps[3].correction
- CASE.inference_path.steps[3].required_evidence[0]
- CASE.inference_path.steps[3].required_evidence[1]
- CASE.inference_path.steps[3].required_evidence[2]
- CASE.constraint_space.time.anchors[0]
- CASE.constraint_space.time.anchors[1]
- CASE.constraint_space.time.anchors[2]
- CASE.constraint_space.time.anchors[3]
- CASE.constraint_space.time.contradictions[0]
- CASE.constraint_space.time.contradictions[1]
- CASE.constraint_space.time.contradictions[2]
- CASE.constraint_space.access.actors[0]
- CASE.constraint_space.access.actors[1]
- CASE.constraint_space.access.actors[2]
- CASE.constraint_space.access.actors[3]
- CASE.constraint_space.access.actors[4]
- CASE.constraint_space.access.objects[0]
- CASE.constraint_space.access.objects[1]
- CASE.constraint_space.access.objects[2]
- CASE.constraint_space.access.objects[3]
- CASE.constraint_space.access.permissions[0]
- CASE.constraint_space.access.permissions[1]
- CASE.constraint_space.access.permissions[2]
- CASE.constraint_space.access.permissions[3]
- CASE.constraint_space.access.permissions[4]
- CASE.constraint_space.physical.laws[0]
- CASE.constraint_space.physical.laws[1]
- CASE.constraint_space.physical.laws[2]
- CASE.constraint_space.physical.traces[0]
- CASE.constraint_space.physical.traces[1]
- CASE.constraint_space.physical.traces[2]
- CASE.cast[0].alibi_window
- CASE.cast[0].access_plausibility
- CASE.cast[0].evidence_sensitivity[0]
- CASE.cast[1].alibi_window
- CASE.cast[1].access_plausibility
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
- CASE.cast[5].alibi_window
- CASE.cast[5].access_plausibility
- CASE.cast[5].evidence_sensitivity[0]
- CASE.cast[5].evidence_sensitivity[1]
- CASE.cast[6].alibi_window
- CASE.cast[6].access_plausibility
- CASE.cast[6].evidence_sensitivity[0]
- CASE.cast[6].evidence_sensitivity[1]
- CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[2].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[3].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[4].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[5].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[6].clue_id
- CASE.prose_requirements.clue_to_scene_mapping[7].clue_id
- CASE.death_method

## Deterministic Output Contracts
- FIRST-PASS CONTRACT: satisfy every contract in the initial output; downstream deterministic guardrails are safety nets, not primary completion paths.
- REQUIRED FIELDS CONTRACT: every clue must include non-empty id, sourceInCML, pointsTo, and supportsInferenceStep.
- FIELD CONSISTENCY CONTRACT: if sourceInCML is CASE.inference_path.steps[N].*, supportsInferenceStep must equal N+1.
- PER-STEP COVERAGE CONTRACT: for each inference step in range 1..4, include at least one mapped clue and at least one contradiction clue.
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
      "observable": "The on-page surface a character can SEE/HEAR/FIND — no interpretation",
      "inference": "What that observable lets the detective conclude",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
      "first_full_reveal_chapter": null,
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

Generate at least 20 clues and 2 red herrings that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- OUTPUT SHAPE CONTRACT: Include all three fixed IDs exactly once each - clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain.
- MECHANISM VISIBILITY: At least one essential early/mid clue must surface the core mechanism detail from hidden_model.mechanism.description.

- STRICT STRUCTURAL CONTRACT (author ALL of these YOURSELF, as concrete scene-register clues — a character sees/hears/finds something. NEVER meta-boilerplate like "adds texture to the case background"; if you omit any, a deterministic pass will synthesize flat machine text in its place, which reads as machine-made):
    • REQUIRED ID: "clue_culprit_direct_charles_montague" with sourceInCML=CASE.cast[2].evidence_sensitivity[0]
    • DIRECT CULPRIT CLUE: id="clue_culprit_direct_charles_montague" — observable evidence tying Charles Montague uniquely to the crime (source from: CASE.cast[2].evidence_sensitivity[0], CASE.cast[2].alibi_window, CASE.cast[2].access_plausibility, CASE.inference_path.steps[3].observation, CASE.inference_path.steps[3].correction); the pointsTo must include: Charles Montague, direct evidence, means and opportunity, no other eligible suspect
    • LATE SLOT: id="clue_late_optional_slot_1" placement=late criticality=optional — a real, observable late-story detail (a found object, an overheard line), never filler.
    • STEP 1: must have a CONTRADICTION-evidence clue (observable, scene-register).
    • STEP 2: must have a CONTRADICTION-evidence clue (observable, scene-register).
    • STEP 3: must have a CONTRADICTION-evidence clue (observable, scene-register).
    • STEP 4: must have a CONTRADICTION-evidence clue (observable, scene-register).
    • ALLOWED SOURCE PATHS (bracket-index leaf paths): CASE.inference_path.steps[0].observation, CASE.inference_path.steps[0].correction, CASE.inference_path.steps[0].required_evidence[0], CASE.inference_path.steps[0].required_evidence[1], CASE.inference_path.steps[0].required_evidence[2], CASE.inference_path.steps[1].observation, CASE.inference_path.steps[1].correction, CASE.inference_path.steps[1].required_evidence[0], CASE.inference_path.steps[1].required_evidence[1], CASE.inference_path.steps[1].required_evidence[2], CASE.inference_path.steps[2].observation, CASE.inference_path.steps[2].correction, CASE.inference_path.steps[2].required_evidence[0], CASE.inference_path.steps[2].required_evidence[1], CASE.inference_path.steps[2].required_evidence[2], CASE.inference_path.steps[3].observation, CASE.inference_path.steps[3].correction, CASE.inference_path.steps[3].required_evidence[0], CASE.inference_path.steps[3].required_evidence[1], CASE.inference_path.steps[3].required_evidence[2]
- CONTRADICTION CHAIN: At least one essential early/mid contradiction clue must explicitly overturn the false assumption.
- ELIMINATION CHAIN: At least one essential early/mid elimination clue must explicitly eliminate an eligible non-culprit and narrow the solution.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- FAIL-FAST STATUS: status MUST be "fail" if any cast-path mismatch, illegal source path, or missing discriminating-test evidence clue ID remains.
- REQUIRED FIELDS CONTRACT: each clue MUST include non-empty sourceInCML, pointsTo, and supportsInferenceStep.
- PER-STEP COVERAGE CONTRACT: each inference step (1..4) MUST have at least one mapped clue and at least one contradiction clue.
- SUSPECT PARITY CONTRACT: any named non-culprit suspect MUST have elimination/alibi evidence parity.
- TOP-LEVEL KEY CONTRACT: output exactly status, clues, redHerrings, audit; do not output red_herrings.
- FAIL-FAST STATUS EXTENSION: status MUST be fail if any required clue fields are missing, if any step lacks mapped or contradiction coverage, or if suspect parity fails.
- SOURCE FORMAT CONTRACT: sourceInCML MUST use bracket-index leaf paths only (no dot-index and no intermediate-node paths).
- DISCRIMINATING ID EXACTNESS: keep discriminating clue IDs as exact string matches, including underscores.
- FULL OBJECT CONTRACT: each clue object MUST include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- OBSERVABLE/INFERENCE SPLIT: also give each clue an "observable" (the concrete thing a character sees/hears/finds, with NO interpretation) and an "inference" (what that observable lets the detective conclude). Keep the solution/pointsTo OUT of "observable".
- POINTS-TO DISTINCTNESS: no two essential clues may share the same "pointsTo" implication — each solving clue must advance a DISTINCT step of the deduction rather than re-eliminating the same suspect.
- SELF-CHECK OUTPUT RULE: run all checks internally and output JSON only; do not output checklist commentary.
- ANTI-COLLAPSE OUTPUT RULE: if checks fail, keep status="fail" but still output a non-empty best-effort clues[] set unless CML evidence is unusable.
- If quality controls require late clues, satisfy late placement with supporting or optional clues only.
- Essential solving clues must remain early or mid.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above

```
