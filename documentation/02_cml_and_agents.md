# CML 2.0 Alignment and Agent Design

## CML’s role
- CML is the internal source of truth and always exists for every mystery.
- CML is not the primary user interface; it is hidden by default.
- Pipeline execution requires Azure OpenAI credentials; deterministic fallback artifacts are not produced.

## CML 2.0 schema alignment
Use schema/cml_2_0.schema.yaml. Generated CML must include:
- CML_VERSION = 2.0
- meta, surface_model, hidden_model, false_assumption, constraint_space, inference_path, discriminating_test, fair_play, quality_controls
- false_assumption.type in {temporal, spatial, identity, behavioral, authority}
- discriminating_test.method in {reenactment, trap, constraint_proof, administrative_pressure}
- crime_class.category in {murder, theft, disappearance, fraud}

If additional values are needed, update schema explicitly or normalize to allowed values.

## Sample CML awareness
- Load examples/ at startup.
- Use samples as structural inspiration only (classic crime structure), never copy content or plot.
- Use samples as quality baselines and regression tests.
- Flag and normalize schema deviations if any.
- Use grabber/ instructions to create new open-source seed CMLs before adding to examples/.

## Information access levels (docs must match UI)
- **Level 1 — User (Default):** no raw CML; only friendly projections.
- **Level 2 — Advanced (Opt-in):** read-only CML viewer and export.
- **Level 3 — Expert (Explicit Opt-in):** direct CML editing with full validation and regeneration scope control.

## Agent responsibilities
### Agent 1 — Era & Setting
Outputs era constraints: tech, policing, social norms, travel, communication.
Guardrail: non-empty anachronisms/implausibilities trigger retry and block the pipeline if unresolved.
Uniqueness: prompts include a per-run uniqueness seed (runId/projectId) to encourage varied settings.
Period accuracy: prompts include 2–3 period-accurate anchors (politics, science, current affairs).

### Agent 2 — Cast & Motive
Outputs cast list, secrets, motives, and access plausibility.
Guardrail: non-empty stereotypeCheck triggers retry and blocks the pipeline if unresolved.
Uniqueness: prompts include a per-run uniqueness seed (runId/projectId) to encourage varied casts.

### Agent 2b — Character Profiles (LLM)
Profiles are generated from the cast (post-CML) to provide per-character narrative bios. LLM output targets ~1000 words per profile and must not introduce new facts.

### Agent 3 — Crime Designer (CML generator)
Produces a full CML 2.0-compliant draft that is novel and not traceable to any single seed.
Uses seed CMLs for abstract structure patterns only (axis, mechanism families, cadence), never for specific characters, events, or clue chains.
Applies explicit divergence constraints from seed patterns (era/location, method, false assumption, discriminating test) to reduce similarity.
Uses inventive, non-obvious combinations of setting details, false assumptions, access paths, and discriminating tests while staying fair-play and era-accurate.

### Agent 4 — CML Validator
Validates schema + checklist (validation/VALIDATION_CHECKLIST.md), checks contradictions and fair-play guarantees.
Runs a novelty/similarity audit against selected seeds; if too similar to a single seed, regeneration is required with explicit divergence constraints.

### Agent 5 — Clue & Red Herrings
Derives clue list by category and creates red herrings that support the false assumption without breaking fairness.
Quality loop: if the fair-play audit fails, Agent 5 regenerates clues once using the audit’s violations and recommendations.

### Agent 6 — Fair Play Auditor
Produces a structured fair-play audit (overall status, checklist items, violations, summary) based on CML + clue distribution.
Missing required fields cause the pipeline to fail fast.
Guardrail: overallStatus of fail or needs-revision triggers a single clue-regeneration pass and re-audit, then continues with warnings.

### Agent 7 — Narrative Outliner
Creates outline with clue placement and discriminating test timing.

### Agent 8 — Novelty Auditor
Scores similarity vs selected seed CMLs and summarizes novelty risks.
Guardrail: status fail blocks the pipeline.

### Agent 9 — Prose Generator (LLM)
Generates full prose from outline + CML + cast. Must not introduce new facts or override CML logic.

### Prose (LLM) & Game Pack (planned)
Prose is generated from outline + CML + cast using an LLM (implemented). Game pack generation is planned and not yet available without LLM support.

## Validator gates
- Structural integrity
- Axis dominance
- Epistemic integrity
- False assumption test
- Inference path validity
- Discriminating test soundness
- Fair-play guarantees
- Novelty audit vs selected seed CMLs (regenerate if too similar)
