# Schema Alignment Strict Pass (2026-04-22)

## Scope
Canonical paths only:
- `schema/cml_2_0.schema.yaml`
- `documentation/02_cml/02_cml.md`
- `documentation/08_cml_schema/08_cml_schema.md`
- `packages/**/src/**`

## Checklist
- [x] Legacy field removed: `victim_identity_status`
- [x] `crime_class.category` enum aligned to canonical values: `murder|theft|disappearance|fraud`
- [x] Hidden model outcome shape aligned to `outcome.result` string
- [x] Runtime `CMLData` aligns on `crime_class?: { category?: string; subtype?: string }`
- [x] CML alignment doc required field list includes `cast` and `culpability`

## Evidence
- Schema enum: `schema/cml_2_0.schema.yaml:58`
- CML alignment doc enum + required keys: `documentation/02_cml/02_cml.md:11`, `documentation/02_cml/02_cml.md:14`
- Schema doc outcome shape: `documentation/08_cml_schema/08_cml_schema.md:177`
- Runtime type shape: `packages/story-validation/src/types.ts:61`
- Agent 4 guidance (canonical enum + outcome key): `packages/prompts-llm/src/agent4-revision.ts:188`, `packages/prompts-llm/src/agent4-revision.ts:197`

## Result
Strict canonical-path pass is clean for the targeted schema drift classes.

## Notes
- Matches still exist in historical artifacts under `documentation/prompts/actual/**` and runtime logs; these are run snapshots, not canonical source-of-truth contract files.
