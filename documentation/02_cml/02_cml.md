# CML 2.0 Alignment

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

### CMLData runtime interface

```typescript
// packages/story-validation/src/types.ts (shared by all validators and scorers)
interface CMLData {
  CASE: {
    meta:   { era?: { decade?: string }; setting?: { location?: string }; crime_class?: { victim_identity_status?: string } };
    cast:   Array<{ name: string; role_archetype: string; gender?: string }>;
    crime_scene?:       { primary_location: string; location_type: 'interior' | 'exterior' };
    discriminating_test?: { method?: string; design?: string; pass_condition?: string };
    culpability?:       { culprits: string[] };
  };
  /** Locked ground-truth evidence facts from hard-logic devices; validated verbatim in prose. */
  lockedFacts?: Array<{ id: string; value: string; description: string; appearsInChapters?: string[] }>;
  /** Location profiles from Agent 2c — used for cross-chapter location name consistency. */
  locationProfiles?: {
    primary?:     { name?: string };
    keyLocations?: Array<{ name: string; id?: string }>;
  };
}
```

### Clue state progression

Clue states used in NSD transfer traces and release-gate diagnostics:

| State         | Meaning                                                    |
|---------------|------------------------------------------------------------|
| `introduced`  | Clue first appears in prose scene                          |
| `hinted`      | Indirect reference without naming the clue                 |
| `explicit`    | Clue named and described directly                          |
| `confirmed`   | Clue conclusively established with corroborating evidence  |

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



