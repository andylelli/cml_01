# CML-first Whodunit Builder — Overview

## Product vision
Users configure setting, cast, tone, and logic to generate a fair-play Golden Age whodunit. The system is CML-first: a coherent CML 2.0 model is generated and validated before any prose.

## Core principles
- CML is the single source of truth.
- Mandatory pipeline: Spec → CML → Validate → Clues → Outline → Prose.
- Sample CMLs in examples/ must be discoverable and usable as seeds.

## Configurable inputs (user knobs)
### Setting
- Decade, region flavor, weather/season, social structure, institutional backdrop.

### Cast
- Cast size, role palette, relationship graph, secret intensity, motive distribution.

### Crime logic
- Primary axis: temporal, spatial, identity, behavioral, authority.
- Mechanism families: poison, staging, object routing, social engineering.
- Fair-play toggles.
- Clue density and red-herring budget.

### Output
- Format: outline, chapter beats, full prose, party kit.
- POV, tone, violence level, length.
- Writing style capture (sample/descriptor) for prose only.

## Roadmap
### MVP
- Wizard UI for Spec
- Generate: Setting → Cast → CML → Validate → Outline
- CML + Outline viewer

### V1
- Clue list + red herrings
- Fair-play report
- Granular regenerate

### V2
- Full prose generation
- Printable party kit
- Play Mode and templates

## Functional planning considerations
- Versioning rules: when a new version is created and how diffs are displayed
- Regenerate scopes: which artifacts are rebuilt and which are locked
- Validation gates: which errors block progress vs warn only
- Style input isolation: apply only to prose, never to CML logic
- Sample handling: clone vs read-only baselines
- Conflict resolution: e.g., clue density vs length constraints
- Fair-play fixes: surface actionable corrections per checklist item
- Discriminating test placement: enforce Act II/III placement
- Clue ordering: enforce all load-bearing clues pre-reveal
- Red herring constraints: must support false assumption only
- Provenance: track which run, agent, and prompt created each artifact
- Multi-run concurrency: one active run per project or queued runs
- Partial failure handling: retries, skip, or rollback
- Export packaging: ZIP structure and included artifacts
- CML edits: validation + merge strategy for manual changes
