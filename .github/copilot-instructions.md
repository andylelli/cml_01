# Copilot Instructions (Project Documentation Fidelity)

CRITICAL: Read all relevant docs before building anything. All changes must be documented so the docs fully represent what is being built.

## Purpose
Keep documentation fully aligned with the implemented product. As features are built or changed, update the docs in the same change set so the documentation always reflects what is actually being built.

## Required behavior
0. **No new markdown docs**
   - Never create new .md documentation files.
   - Always update the existing documentation files listed below.

1. **Read before change**
   - Before implementing or modifying features, read the relevant documentation:
     - documentation/01_overview.md
     - documentation/02_cml_and_agents.md
     - documentation/03_architecture_backend.md
     - documentation/04_llm_ai.md
     - documentation/05_ui_spec.md
     - multi_agent_whodunit_plan.md
     - README.md

2. **Update docs with code changes**
   - If a change affects architecture, data flow, UI, access levels, APIs, storage, or agent behavior, update the corresponding doc in the same PR/commit.
   - If a change introduces a new capability, add it to the relevant doc section and remove/adjust any outdated statements.

3. **Keep product rules consistent**
   - Ensure docs consistently describe:
     - CML is the canonical source of truth and is always generated.
     - CML is hidden by default; viewing is Advanced; editing is Expert-only.
     - Seed CMLs provide structural inspiration only; no copying.
     - Novelty is enforced via a similarity audit gate.
     - Friendly projections are the default user experience.

4. **Document the build state**
   - When stubbing or scaffolding features, document them as “planned” or “not yet implemented.”
   - When implementing, update docs to “implemented” or “in progress.”

5. **Checklist for every feature change**
   - Does this change affect UI flows? Update documentation/05_ui_spec.md.
   - Does this change affect agents or prompts? Update documentation/02_cml_and_agents.md or documentation/04_llm_ai.md.
   - Does this change affect backend/data model/APIs? Update documentation/03_architecture_backend.md.
   - Does this change affect overall product behavior or UX levels? Update documentation/01_overview.md and README.md.

6. **Fail-safe**
   - If you cannot determine where to document a change, update multi_agent_whodunit_plan.md with a concise summary and add a TODO for placement.
