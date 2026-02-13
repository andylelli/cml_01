# CML-first Whodunit Builder — Overview

## Product vision
Users configure setting, cast, tone, and logic to generate a fair-play Golden Age whodunit. The system is CML-first: a coherent CML 2.0 model is generated and validated before any prose. CML is always generated, but it is hidden by default and never required for typical use.

**Guiding sentence:** The system builds mysteries like an engineer builds proofs: the logic comes first, the interface stays friendly, and the machinery is hidden unless the user asks to see it.

## Core principles
- CML is the single source of truth and is always generated.
- Mandatory pipeline: Spec → CML → Validate → Clues → Outline → Prose.
- CML is not the primary interface; most users should never need to see it.
- Sample CMLs in examples/ are used as structural inspiration only, never copied.
- Full activity logging is captured for debugging across UI and API.
- The UI restores the last project/spec/session state after refresh.
- Default UI avoids technical controls (no API health checks or manual refresh actions).
- Pipeline runs require Azure OpenAI credentials; no deterministic fallback artifacts are produced.
- When the API is not connected to Postgres, a simple JSON file-backed store preserves projects and artifacts across restarts.

## Information access levels
**Level 1 — User (Default)**
- No raw CML visible.
- User sees friendly, human-readable projections: setting summary, cast cards + relationships, mystery “bones” overview, clue board with explanations, outline/timeline, fair-play report in plain language.
- Character profiles are visible, but private details are hidden.

**Level 2 — Advanced (Opt-in)**
- Read-only CML viewer.
- CML can be inspected and exported.
- No direct editing.
- Character profiles reveal private details.

**Level 3 — Expert (Explicit Opt-in)**
- Direct CML editing.
- Full validation output and warnings.
- Regeneration scope control.
- Character profiles reveal private details.

## Canonical user flow
### Input stage
- User selects options (setting, tone, cast size, constraints).
- AI proposes suggestions; user explicitly accepts or rejects.
- No CML interaction.

### Generate action
- System combines user selections, accepted suggestions, and structural patterns learned from seed CMLs.
- System generates a dedicated hard-logic ideation artifact (`hard_logic_devices`) to propose novel mechanism concepts before CML generation.
- Generates a completely new CML (full logical structure, no prose, no copied plot).
- Creating a project auto-starts the pipeline to generate initial artifacts.

### Output stage
- Default UI shows friendly projections derived from CML.
- Review now includes a dedicated Background view that surfaces generated hard-logic devices (`hard_logic_devices`) used to ground mechanism design.
- CML exists internally and is visible only in Advanced/Expert modes.
- Prose and character profiles are LLM-generated from CML + outline + cast (implemented).
- Story length is user-selectable (`short`, `medium`, `long`) and can be changed between runs.
- Prose versions generated at different lengths are retained for PDF export.
- Clue generation now enforces deterministic fair-play guardrails (essential clues before discriminating test and no detective-only clue phrasing), with critical failures blocking completion.
- Prose output is now sanitized before persistence/export (mojibake cleanup, system-residue stripping, Unicode normalization).
- Story validation now includes continuity/transition/discriminating-test/suspect-closure validators and blocks release-gate failures.
- Game pack generation is planned and currently unavailable without LLM support.
- Play mode allows chapter-based clue reveal in the UI.
- Community templates are listed from examples/ for structural inspiration.
- Printable party kit PDF is available from the game pack panel.

## Seed CML library usage (structural only)
- Seeds teach classic crime structure, not story content.
- Seeds may inform axis selection, mechanism families, false-assumption patterns, discriminating tests, clue cadence, and fair-play structure.
- Seeds must not inform specific characters, events, clue wording, reveal logic, plot sequences, or inference paths.

## Novelty enforcement (validation gate)
- After CML generation, run a similarity audit against selected seeds.
- If too many structural elements match a single seed, regeneration is required with explicit divergence constraints.
- Provenance records seed IDs and abstract patterns; seed details are not shown by default.

## Configurable inputs (user knobs)
### Setting
- Decade, region flavor, weather/season, social structure, institutional backdrop.
 - Optional theme prompt to steer the mystery.
 - Theme text can include hard-logic directives (e.g., locked-room, mathematics, botanical, train/seaside) plus escalation phrases (`increase difficulty`, `make it brutal`).
- Hard-logic directives are now only a starting hint; the pipeline must first generate novel hard-logic device concepts via LLM and then ground CML generation in those device outputs.

### Cast
- Cast size, role palette, relationship graph, secret intensity, motive distribution.
- Optional manual cast names (comma-separated) override the placeholder cast list.
- If no cast names are provided, the system generates readable default names.

### Crime logic
- Primary axis: temporal, spatial, identity, behavioral, authority.
- Mechanism families: poison, staging, object routing, social engineering.
- Fair-play toggles.
- Clue density and red-herring budget.

### Output
- Format: outline, chapter beats, character profiles, full prose, party kit.
- POV, tone, violence level, length.
- Writing style capture (sample/descriptor) for prose only.

## Roadmap
### MVP
- Wizard UI for Spec
- Generate: Setting → Cast → CML → Validate → Outline
- Friendly projections (cast, clues, outline, fair-play report)
- Advanced CML viewer (read-only)

### V1
- Clue list + red herrings
- Fair-play report
- Granular regenerate

### V2
- Full prose generation (implemented)
- Character profiles (implemented)
- Printable party kit
- Play Mode and templates

## Functional planning considerations
- Versioning rules: when a new version is created and how diffs are displayed
- Regenerate scopes: which artifacts are rebuilt and which are locked
- Validation gates: which errors block progress vs warn only
- Style input isolation: apply only to prose, never to CML logic
- Sample handling: read-only structural baselines (no copying)
- Conflict resolution: e.g., clue density vs length constraints
- Fair-play fixes: surface actionable corrections per checklist item
- Discriminating test placement: enforce Act II/III placement
- Clue ordering: enforce all load-bearing clues pre-reveal
- Red herring constraints: must support false assumption only
- Provenance: track which run, agent, and prompt created each artifact
- Seed usage: track seed IDs consulted and abstract patterns extracted
- Multi-run concurrency: one active run per project or queued runs
- Partial failure handling: retries, skip, or rollback
- Export packaging: ZIP structure and included artifacts
- CML edits: Expert-only, with validation + merge strategy
- Novelty enforcement: similarity audit vs seeds as a validation gate
- Default UX: friendly projections only; CML hidden unless Advanced/Expert
