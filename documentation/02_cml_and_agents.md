# CML 2.0 Alignment and Agent Design

## CML’s role
- CML is the internal source of truth and always exists for every mystery.
- CML is not the primary user interface; it is hidden by default.

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
- Use samples as structural inspiration only (classic crime structure), never copy content or plot.
- Use samples as quality baselines and regression tests.
- Flag and normalize schema deviations if any.

## Information access levels (docs must match UI)
- **Level 1 — User (Default):** no raw CML; only friendly projections.
- **Level 2 — Advanced (Opt-in):** read-only CML viewer and export.
- **Level 3 — Expert (Explicit Opt-in):** direct CML editing with full validation and regeneration scope control.

## Agent responsibilities
### Agent 1 — Era & Setting
Outputs era constraints: tech, policing, social norms, travel, communication.

### Agent 2 — Cast & Motive
Outputs cast list, secrets, motives, and access plausibility.

### Agent 3 — Crime Designer (CML generator)
Produces a full CML 2.0-compliant draft that is novel and not traceable to any single seed.
Uses seed CMLs for abstract structure patterns only (axis, mechanism families, cadence), never for specific characters, events, or clue chains.

### Agent 4 — CML Validator
Validates schema + checklist (validation/VALIDATION_CHECKLIST.md), checks contradictions and fair-play guarantees.
Runs a novelty/similarity audit against selected seeds; if too similar to a single seed, regeneration is required with explicit divergence constraints.

### Agent 5 — Clue & Red Herrings
Derives clue list by category and creates red herrings that support the false assumption without breaking fairness.

### Agent 6 — Narrative Outliner
Creates outline with clue placement and discriminating test timing.

### Agent 7 — Prose Writer
Produces prose constrained by CML facts. Uses style input to match tone/voice without copying copyrighted text.
Never alters CML logic; prose is always downstream of validated CML.
Current build: deterministic placeholder prose is generated from outline and cast (no LLM yet).

### Agent 8 — Game Pack (optional)
Creates suspect cards, host packet, timeline sheet, and handouts.
Current build: deterministic placeholder game pack is generated from CML and cast (no LLM yet).

## Validator gates
- Structural integrity
- Axis dominance
- Epistemic integrity
- False assumption test
- Inference path validity
- Discriminating test soundness
- Fair-play guarantees
- Novelty audit vs selected seed CMLs (regenerate if too similar)
