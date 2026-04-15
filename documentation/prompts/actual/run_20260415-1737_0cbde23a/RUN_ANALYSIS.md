# Run Analysis: run_20260415-1737_0cbde23a

## Scope
This analysis is based on:
- Worker run log: `apps/worker/logs/run_20260415_0cbde23a.json`
- Prompt index/state: `documentation/prompts/actual/run_20260415-1737_0cbde23a/INDEX.md`, `documentation/prompts/actual/run_20260415-1737_0cbde23a/.actual-run-state.json`
- All available request/response artifacts in `documentation/prompts/actual/run_20260415-1737_0cbde23a/`

## Run Summary
- Run ID: `run_0cbde23a-2cd5-4b11-81bf-73982c2c16e4`
- Project ID: `proj_9df0d9dc-1a8a-493c-9d39-dac62ff1424c`
- Start: `2026-04-15T17:37:12.542Z`
- End: `2026-04-15T17:38:52.403Z`
- Duration: `99860 ms`
- Final status: `failed`
- Terminal failure: `Agent 5 suspect-coverage gate failed after retry. Weak elimination/alibi evidence: Dennis Simms`

## Stage Timeline (from worker log)
1. `setting` completed: Era/setting refined.
2. `cast` completed: 5-character cast generated.
3. `background-context` completed.
4. `hard_logic_devices` completed: 5 devices generated.
5. `cml` completed: CML generated/validated in pipeline.
6. `novelty` skipped (threshold >= 1.0).
7. `clues` entered regeneration loop and failed at suspect-coverage gate.

## Request/Response Pair Review

### 01 Agent1-SettingRefiner
- Request: `01_Agent1-SettingRefiner_request.md`
- Response: `01_Agent1-SettingRefiner_response.md`
- Result:
  - Delivered a coherent 1940s setting object.
  - `realism.anachronisms` and `realism.implausibilities` returned as empty arrays as requested.
  - Provides practical constraints useful to downstream generation.
- Notable quality risks:
  - Uses broad historical wording in places, but not a run-breaking issue.

### 02 Agent2-CastDesigner
- Request: `02_Agent2-CastDesigner_request.md`
- Response: `02_Agent2-CastDesigner_response.md`
- Result:
  - Produced exactly 5 characters with one detective (`Hannah Pratt`) and 3 possible culprits.
  - Satisfied required detective exclusion from `possibleCulprits`.
- Notable quality/schema risks visible in raw response:
  - `relationships` returned as an array, while the prompt schema requested `relationships.pairs` object shape.
  - Some text encoding artifacts in request/response markdown (`â€”`, `Ã©`) indicate Unicode/encoding noise in logs.
  - Potential downstream alignment pressure from loosely structured fields.

### 03 Agent2e-BackgroundContext
- Request: `03_Agent2e-BackgroundContext_request.md`
- Response: `03_Agent2e-BackgroundContext_response.md`
- Result:
  - Returned `status: ok` with aligned era/location/weather/cast anchors.
  - Meets concise backdrop requirement.
- Notable risk:
  - None material to this run failure.

### 04 Agent3b-HardLogicDeviceGenerator
- Request: `04_Agent3b-HardLogicDeviceGenerator_request.md`
- Response: `04_Agent3b-HardLogicDeviceGenerator_response.md`
- Result:
  - Returned 5 devices with required `principleType` values and primary `lockedFacts` in word-form values.
- Notable quality risks:
  - Several devices are broad/conceptual and may require stronger grounding by Agent 3 to avoid traceability drift.

### 05 Agent3-CMLGenerator
- Request: `05_Agent3-CMLGenerator_request.md`
- Response: `05_Agent3-CMLGenerator_response.md`
- Result:
  - Returned full CML JSON with temporal false assumption and 3-step inference path.
  - Included discriminating test and clue mapping sections.
- High-impact downstream risks introduced here:
  - Non-schema enum/value drift in cast fields (for example `access_plausibility` values such as `high`, `medium`, `low`, `none` instead of stricter expected labels in other stages).
  - Empty required setting field: `CASE.meta.setting.institution` is empty string.
  - Evidence path naming diverges from expected extraction paths (later clue extraction references unresolved paths such as `CASE.constraint_space.access.footprints[0]`, `CASE.constraint_space.physical.evidence[0]`, `CASE.character_behavior.*`, `CASE.character_testimonial.*`).
  - This creates brittle traceability for Agent 5 and fairness gates.

### 06 Agent5-ClueExtraction (initial)
- Request: `06_Agent5-ClueExtraction_request.md`
- Response: `06_Agent5-ClueExtraction_response.md`
- Result:
  - Generated 6 clues and 2 red herrings.
- Gate findings (from worker log and retry prompts):
  - Critical: discriminating test evidence clue IDs missing from clue set (`clock_stopped`, `footprints_angle`, `mechanical_timer`).
  - Critical: discriminating test had no evidence found in clue set.
  - Warnings: missing contradiction coverage for inference steps; red herrings may overlap with true-solution logic.
- Why this mattered:
  - Failed fair-play coverage requirements and triggered regeneration.

### 07 Agent5-ClueExtraction (retry 1)
- Response only: `07_Agent5-ClueExtraction_retry1_response.md`
- Request file status:
  - Missing (`requestFile` empty in `.actual-run-state.json`; index also marks request missing).
- Result:
  - Response body not captured, so this retry is not auditable.
- Impact:
  - Reduced observability/debuggability for gate failure progression.

### 08 Agent5-ClueExtraction (retry 2)
- Request: `08_Agent5-ClueExtraction_retry2_request.md`
- Response: `08_Agent5-ClueExtraction_retry2_response.md`
- Result:
  - Added 8 clues and 2 red herrings.
  - Added IDs/coverage intended to satisfy discriminating-test linkage.
- Remaining issues:
  - Multiple `sourceInCML` paths do not match CML structure (for example `CASE.constraint_space.access.footprints[0]`, `CASE.cast.NicholasCobbett.behavior[0]`, `CASE.cast.DennisSimms.testimonial[0]`).
  - Evidence remains semantically weak for suspect elimination quality gate.

### 09 Agent5-ClueExtraction (retry 3)
- Request: `09_Agent5-ClueExtraction_retry3_request.md`
- Response: `09_Agent5-ClueExtraction_retry3_response.md`
- Result:
  - Again produced 8 clues and 2 red herrings with intended elimination clue for Dennis.
- Final gate outcome:
  - Pipeline still failed suspect coverage gate: Dennis Simms elimination/alibi evidence deemed weak/non-qualifying by scorer/gate.

## Why The Run Failed (Root Cause)
Primary failure occurred at Agent 5 gate enforcement after retries.

Contributing factors visible across artifacts:
1. Evidence traceability mismatch:
- Agent 5 retries repeatedly referenced non-existent or non-canonical CML paths for clue sources.
- This undermined confidence/validity of elimination and inference coverage.

2. Coverage quality vs mere mention:
- Gate required robust elimination/alibi support, not just suspect name mention.
- Final retries still failed the quality threshold for Dennis Simms elimination evidence.

3. Observability gap during retry loop:
- Retry 1 request missing and response body uncaptured.
- This prevented precise diagnosis of first regeneration step and made progression harder to verify.

## Artifacts Read (Checklist)
- `apps/worker/logs/run_20260415_0cbde23a.json`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/INDEX.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/.actual-run-state.json`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/01_Agent1-SettingRefiner_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/01_Agent1-SettingRefiner_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/02_Agent2-CastDesigner_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/02_Agent2-CastDesigner_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/03_Agent2e-BackgroundContext_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/03_Agent2e-BackgroundContext_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/04_Agent3b-HardLogicDeviceGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/04_Agent3b-HardLogicDeviceGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/05_Agent3-CMLGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/05_Agent3-CMLGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/06_Agent5-ClueExtraction_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/06_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/07_Agent5-ClueExtraction_retry1_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/08_Agent5-ClueExtraction_retry2_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/08_Agent5-ClueExtraction_retry2_response.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/09_Agent5-ClueExtraction_retry3_request.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/09_Agent5-ClueExtraction_retry3_response.md`

## Issue / Fix List
1. Issue: Discriminating-test evidence clue IDs were missing from Agent 5 output (`clock_stopped`, `footprints_angle`, `mechanical_timer`).
  Fix: LLM request change: add a hard output contract in the Agent 5 request stating every `CASE.discriminating_test.evidence_clues` ID must appear as a clue `id`, must be `essential`, and must be placed `early` or `mid`.

2. Issue: Suspect elimination evidence was too weak for gate scoring (Dennis Simms remained non-qualifying).
  Fix: LLM request change: require elimination clues to include explicit alibi time window, corroborator/evidence source, and direct exclusion logic in `pointsTo` (for example, `Eliminates <name> because ...`).

3. Issue: Agent 5 used non-existent/non-canonical `sourceInCML` paths during retries.
  Fix: LLM request change: include a `sourceInCML` whitelist in the Agent 5 request and instruct the model to return no clue for any unsupported path (and report it in an `audit.invalidSourcePaths` array).

4. Issue: Retry attempts were not consistently focused on concrete unresolved failures.
  Fix: LLM request change: prepend every retry request with a `Correction Targets` block listing exact unresolved failures (missing clue IDs, weak elimination suspects, invalid source paths), and instruct the model to fix only those targets first.

5. Issue: Agent 3 output included schema/value drift that increased downstream brittleness (`institution` empty, inconsistent enum-style values).
  Fix: LLM request change: strengthen Agent 3 request with a strict schema contract requiring non-empty required fields (including `CASE.meta.setting.institution`) and canonical enum vocabulary only.

6. Issue: Regeneration retries were broad rewrites instead of targeted fixes.
  Fix: LLM request change: add retry mode instructions that prioritize unresolved gate failures first (missing clue IDs, weak elimination evidence) and preserve unaffected clues unless required.

7. Issue: Gate pass criteria were not transparent in the prompt loop.
  Fix: LLM request change: add explicit preflight self-audit output fields in Agent 5 response (for example `missingDiscriminatingEvidenceIds`, `weakEliminationSuspects`, `invalidSourcePaths`) and require all to be empty.

8. Issue: Red herrings risked overlapping true-solution logic, reducing fairness clarity.
  Fix: LLM request change: require each red herring to be tagged with false-assumption support plus a non-overlap justification against culprit mechanism facts.

9. Issue: Some time references can drift into modern numeric notation that weakens period voice.
  Fix: LLM request change: require all narrative-facing time references to be written in era-appropriate words (for example, `quarter past nine`, `half past eight`, `ten minutes to eleven`) rather than digital/numeric forms.
