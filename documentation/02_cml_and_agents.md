# CML 2.0 Alignment and Agent Design

## CML 2.0 schema alignment
Use schema/cml_2_0.schema.yaml. Generated CML must include:
- CML_VERSION = 2.0
- meta, surface_model, hidden_model, false_assumption, constraint_space, inference_path, discriminating_test, fair_play
- false_assumption.type in {temporal, spatial, identity, behavioral, authority}
- discriminating_test.method in {reenactment, trap, constraint_proof, administrative_pressure}
- crime_class.category in {murder, theft, disappearance, fraud}

If additional values are needed, update schema explicitly or normalize to allowed values.

## Sample CML awareness
- Load examples/ at startup.
- Use samples as seeds, quality baselines, and regression tests.
- Flag and normalize schema deviations if any.

## Agent responsibilities
### Agent 1 — Era & Setting
Outputs era constraints: tech, policing, social norms, travel, communication.

### Agent 2 — Cast & Motive
Outputs cast list, secrets, motives, and access plausibility.

### Agent 3 — Crime Designer (CML generator)
Produces full CML 2.0-compliant draft.

### Agent 4 — CML Validator
Validates schema + checklist (validation/VALIDATION_CHECKLIST.md), checks contradictions and fair-play guarantees.

### Agent 5 — Clue & Red Herrings
Derives clue list by category and creates red herrings that support the false assumption without breaking fairness.

### Agent 6 — Narrative Outliner
Creates outline with clue placement and discriminating test timing.

### Agent 7 — Prose Writer
Produces prose constrained by CML facts. Uses style input to match tone/voice without copying copyrighted text.

### Agent 8 — Game Pack (optional)
Creates suspect cards, host packet, timeline sheet, and handouts.

## Validator gates
- Structural integrity
- Axis dominance
- Epistemic integrity
- False assumption test
- Inference path validity
- Discriminating test soundness
- Fair-play guarantees
