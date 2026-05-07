# ANALYSIS_03 Perfect Prompt - Populated With Last Run Values (v6)

Source run: run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4  
Source prompt capture: documentation/prompts/actual/run_20260424-1809_a2a462c9/16_Agent5-ClueExtraction_retry1_request.md  
Agent: Agent5-ClueExtraction (retry 1)  
Prompt hash: ec4b1150aee60749

This document shows the same prompt pattern as ANALYSIS_03_perfect_llm_prompt_for_pass.md, but with placeholders populated using the values from the last failing run.

## 1) Placeholder Expansion Map (Last Run)

### CML_JSON (populated)
```json
{
  "CASE": {
    "meta": {
      "title": "The Clockwork Deception",
      "crime_class": {
        "category": "murder"
      }
    },
    "false_assumption": {
      "type": "temporal",
      "statement": "The murder must have occurred before the clock was reset."
    },
    "hidden_model": {
      "mechanism": {
        "description": "A clock was deliberately wound back to obscure the actual time of Leon's murder, misleading witnesses and investigators about when the crime occurred."
      }
    },
    "culpability": {
      "culprits": [
        "Auberon Warenne"
      ]
    },
    "inference_path": {
      "steps": [
        {
          "observation": "The clock in the library shows ten minutes past eleven.",
          "correction": "The clock's time indicates it was tampered with before the murder.",
          "required_evidence": [
            "The clock shows ten minutes past eleven",
            "Witnesses report hearing a scream coinciding with the clock reading",
            "The clock was found in the library",
            "The clock shows signs of tampering"
          ]
        },
        {
          "observation": "Witness testimonies about the time of the scream vary.",
          "correction": "The varied testimonies indicate confusion about the actual timeline.",
          "required_evidence": [
            "Witnesses report different times they heard the scream",
            "The clock shows signs of tampering",
            "Witnesses were present during the charity event",
            "The clock was last wound before the event"
          ]
        },
        {
          "observation": "The clock shows signs of recent tampering.",
          "correction": "The clock was wound back to obscure the actual time of death.",
          "required_evidence": [
            "The clock shows signs of tampering",
            "Witness testimonies about the scream",
            "The clock was found in the library",
            "The time of the scream is inconsistent with the clock"
          ]
        }
      ]
    },
    "discriminating_test": {
      "design": "Compare the clock's time with the witnesses' varied statements about when they heard the scream to show the contradiction between the clock's time and the actual time of death.",
      "evidence_clues": [
        "clue_early_1",
        "clue_early_2",
        "clue_early_3"
      ]
    },
    "quality_controls": {
      "clue_visibility_requirements": {
        "essential_clues_min": 3,
        "essential_clues_before_test": true,
        "early_clues_min": 2,
        "mid_clues_min": 2,
        "late_clues_min": 1
      }
    },
    "cast": [
      {
        "name": "Leon Vautier",
        "evidence_sensitivity": [
          "Financial records",
          "Personal correspondence"
        ]
      },
      {
        "name": "Auberon Warenne",
        "evidence_sensitivity": [
          "Alibi witnesses",
          "Political connections"
        ]
      },
      {
        "name": "Yvette Brabazon",
        "evidence_sensitivity": [
          "Witness testimonies",
          "Event schedules"
        ]
      },
      {
        "name": "Alison Waldegrave",
        "evidence_sensitivity": [
          "Art supplies",
          "Financial records"
        ]
      },
      {
        "name": "Claire Courtenay",
        "evidence_sensitivity": [
          "Investigation logs",
          "Witness statements"
        ]
      }
    ]
  }
}
```

### VALID_SOURCE_PATHS (populated)
```text
CASE.inference_path.steps[0].observation
CASE.inference_path.steps[0].correction
CASE.inference_path.steps[0].required_evidence[0]
CASE.inference_path.steps[0].required_evidence[1]
CASE.inference_path.steps[0].required_evidence[2]
CASE.inference_path.steps[0].required_evidence[3]
CASE.inference_path.steps[1].observation
CASE.inference_path.steps[1].correction
CASE.inference_path.steps[1].required_evidence[0]
CASE.inference_path.steps[1].required_evidence[1]
CASE.inference_path.steps[1].required_evidence[2]
CASE.inference_path.steps[1].required_evidence[3]
CASE.inference_path.steps[2].observation
CASE.inference_path.steps[2].correction
CASE.inference_path.steps[2].required_evidence[0]
CASE.inference_path.steps[2].required_evidence[1]
CASE.inference_path.steps[2].required_evidence[2]
CASE.inference_path.steps[2].required_evidence[3]
CASE.constraint_space.time.anchors[0]
CASE.constraint_space.time.anchors[1]
CASE.constraint_space.time.contradictions[0]
CASE.constraint_space.access.actors[0]
CASE.constraint_space.access.actors[1]
CASE.constraint_space.access.objects[0]
CASE.constraint_space.access.objects[1]
CASE.constraint_space.access.permissions[0]
CASE.constraint_space.physical.laws[0]
CASE.constraint_space.physical.traces[0]
CASE.cast[0].alibi_window
CASE.cast[0].access_plausibility
CASE.cast[0].evidence_sensitivity[0]
CASE.cast[0].evidence_sensitivity[1]
CASE.cast[1].alibi_window
CASE.cast[1].access_plausibility
CASE.cast[1].evidence_sensitivity[0]
CASE.cast[1].evidence_sensitivity[1]
CASE.cast[2].alibi_window
CASE.cast[2].access_plausibility
CASE.cast[2].evidence_sensitivity[0]
CASE.cast[2].evidence_sensitivity[1]
CASE.cast[3].alibi_window
CASE.cast[3].access_plausibility
CASE.cast[3].evidence_sensitivity[0]
CASE.cast[3].evidence_sensitivity[1]
CASE.cast[4].alibi_window
CASE.cast[4].access_plausibility
CASE.cast[4].evidence_sensitivity[0]
CASE.cast[4].evidence_sensitivity[1]
CASE.discriminating_test.evidence_clues[0]
CASE.discriminating_test.evidence_clues[1]
CASE.discriminating_test.evidence_clues[2]
CASE.prose_requirements.clue_to_scene_mapping[0].clue_id
CASE.prose_requirements.clue_to_scene_mapping[1].clue_id
CASE.prose_requirements.clue_to_scene_mapping[2].clue_id
```

### CAST_INDEX_MAP (populated)
```text
0 -> Leon Vautier
1 -> Auberon Warenne
2 -> Yvette Brabazon
3 -> Alison Waldegrave
4 -> Claire Courtenay
```

### DISCRIMINATING_EVIDENCE_IDS (populated)
```text
clue_early_1
clue_early_2
clue_early_3
```

### QUALITY_CONTROLS (populated)
```json
{
  "essential_clues_min": 3,
  "essential_clues_before_test": true,
  "early_clues_min": 2,
  "mid_clues_min": 2,
  "late_clues_min": 1
}
```

## 2) Fully Populated Prompt (As Captured In Last Run)

### Message 1 (system)
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

### Message 2 (developer)
```text
## CML Summary
**Title**: The Clockwork Deception
**Crime**: murder
**Primary axis**: temporal axis
**Cast**: 5 characters
**Requested density**: minimal
**Effective density**: dense (auto-escalated to satisfy mandatory requirements)

## Mandatory Clue Requirements (14 required)
1. Generate a clue that makes the reader directly observe: "The clock in the library shows ten minutes past eleven...."
   -> observation | essential | early | temporal | step 1 | terms: clock, library, shows

2. Generate a clue that provides evidence for: "The clock's time indicates it was tampered with before the murder...."
   -> contradiction | essential | early | temporal | step 1 | terms: clock's, indicates, tampered

3. Generate a clue that makes the reader directly observe: "Witness testimonies about the time of the scream vary...."
   -> observation | essential | early | temporal | step 2 | terms: witness, testimonies, about

4. Generate a clue that provides evidence for: "The varied testimonies indicate confusion about the actual timeline...."
   -> contradiction | essential | early | temporal | step 2 | terms: varied, testimonies, indicate

5. Generate a clue that makes the reader directly observe: "The clock shows signs of recent tampering...."
   -> observation | essential | mid | temporal | step 3 | terms: clock, shows, signs

6. Generate a clue that provides evidence for: "The clock was wound back to obscure the actual time of death...."
   -> contradiction | essential | mid | temporal | step 3 | terms: clock, wound, obscure

7. Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "The clock's time indicates it was tampered with before the murder...."
   -> contradiction | essential | mid | temporal | step 1 | terms: clock's, indicates, tampered

8. Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "A clock was deliberately wound back to obscure the actual time of Leon's murder, misleading witnesses and investigators about when the crime..."
   -> observation | essential | early | temporal | terms: clock, deliberately, wound

9. Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence - it does NOT reveal it. Evidence for: "Compare the clock's time with the witnesses' varied statements about when they heard the scream to s..."
   -> observation | essential | mid | temporal | terms: compare, clock's, witnesses'

10. Generate one essential mid-story clue whose description or pointsTo explicitly names Auberon Warenne and states the unique trace, preparation detail, or mechanism link that points to Auberon Warenne rather than any non-culprit.
   -> observation | essential | mid | temporal | terms: Auberon Warenne, clock, deliberately, wound

11. Generate a clue showing observable evidence of Auberon Warenne's premeditation or planning (Inheritance). This MUST be visible to the reader before the confrontation scene - the detective cannot privately know this and withhold it.
   -> observation | essential | mid | behavioral | terms: inheritance

12. Generate a clue that explicitly eliminates suspect Yvette Brabazon using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Yvette Brabazon because ...").
   -> elimination | essential | mid | testimonial | terms: Yvette Brabazon

13. Generate a clue that explicitly eliminates suspect Alison Waldegrave using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates Alison Waldegrave because ...").
   -> elimination | essential | mid | testimonial | terms: Alison Waldegrave

14. Generate one essential early or mid elimination clue that explicitly rules out Yvette Brabazon and narrows the solution toward culprit Auberon Warenne. The pointsTo text must start with "Eliminates Yvette Brabazon because ..." and cite corroborated evidence.
   -> elimination | essential | mid | testimonial | terms: Yvette Brabazon, Auberon Warenne

## First-pass Required Output Slots (non-negotiable IDs)
1. id=clue_mechanism_visibility_core | placement=early|mid | criticality=essential | evidenceType=observation
   contract: Reader-visible mechanism detail appears before the discriminating test.
2. id=clue_core_contradiction_chain | placement=early|mid | criticality=essential | evidenceType=contradiction
   contract: Explicitly overturns the false assumption using concrete reader-observable evidence.
3. id=clue_core_elimination_chain | placement=early|mid | criticality=essential | evidenceType=elimination
   contract: Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.

## Deterministic Bounds (use exactly)
- inference_path steps path index range: 0..2
- supportsInferenceStep valid range: 1..3
- constraint_space.time.anchors index range: 0..1
- constraint_space.time.contradictions index range: 0..0
- cast index range: 0..4

## Cast Name -> Index Map (for CASE.cast[N] paths)
- Leon Vautier -> 0
- Auberon Warenne -> 1
- Yvette Brabazon -> 2
- Alison Waldegrave -> 3
- Claire Courtenay -> 4

## Quality Controls (from CML)
- Essential clues minimum: 3
- Essential clues before test: true
- Early clues minimum: 2
- Mid clues minimum: 2
- Late clues minimum: 1

## valid_source_paths[] (exact match preferred)
(see full list in section 1 above; copied from this exact captured prompt)

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
  - CASE.cast[1].access_plausibility
  - CASE.cast[1].evidence_sensitivity[0]
  - CASE.cast[2].alibi_window
  - CASE.cast[2].evidence_sensitivity[0]
  - CASE.cast[3].alibi_window
  - CASE.cast[3].evidence_sensitivity[0]
- Forbidden in this run: CASE.inference_path.steps[*].mechanism and CASE.inference_path.steps[*].elimination.

Required ID -> sourceInCML mapping (exact):
- clue_mechanism_visibility_core -> CASE.inference_path.steps[2].correction
- clue_core_contradiction_chain -> CASE.inference_path.steps[0].correction
- clue_core_elimination_chain -> CASE.cast[2].alibi_window
- clue_1 -> CASE.inference_path.steps[0].observation
- clue_2 -> CASE.inference_path.steps[1].observation
- clue_3 -> CASE.inference_path.steps[2].correction

Step coverage floor (exact):
- supportsInferenceStep=1 must include at least one contradiction clue.
- supportsInferenceStep=2 must include at least one contradiction clue.
- supportsInferenceStep=3 must include at least one contradiction clue.

Suspect parity floor (exact):
- Include one Yvette Brabazon elimination clue with evidenceType=elimination, legal cast[2] source path, and pointsTo containing both a time-window phrase and corroborator phrase.
- Include one Alison Waldegrave elimination clue with evidenceType=elimination and legal cast[3] source path.

Direct culprit-evidence floor (exact):
- Include one essential clue with id=clue_culprit_direct_auberon.
- description and pointsTo must explicitly name "Auberon Warenne".
- description or pointsTo must include one of these incriminating phrases: "direct evidence", "physical trace", "motive", "opportunity", "means", or "only person who could".
- sourceInCML must be CASE.cast[1].access_plausibility or CASE.cast[1].evidence_sensitivity[0].

Late-clue floor (exact):
- Include one clue with id=clue_late_texture_1.
- placement must be late.
- criticality must be optional or supporting.
- evidenceType must be observation.
- sourceInCML must be from the shortlist and must not be a discriminating-test evidence clue path.
- This late clue must not introduce first-time mechanism facts.
```

### Message 3 (user)
```text
Extract and organize clues from this mystery CML.

Generate 12-18 clues and 2 red herrings that uphold fair play - every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts - every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY - never "late".
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
- V5 YVETTE RULE: include one Yvette elimination clue with time-window and corroborator wording in pointsTo and a legal cast[2] source path.
- V6 CULPRIT RULE: include clue_culprit_direct_auberon with explicit Auberon name plus an incriminating phrase and legal cast[1] source path.
- V6 LATE-CLUE RULE: include clue_late_texture_1 with placement=late and criticality optional/supporting.

Retry mode (correction targets) and structured payload were included in this run and retained in the captured request.
```

## 3) Notes

- This document is populated from the actual captured prompt in the last failing run, not a hypothetical template fill.
- The exact full captured prompt remains the source of truth in:
  - documentation/prompts/actual/run_20260424-1809_a2a462c9/16_Agent5-ClueExtraction_retry1_request.md
