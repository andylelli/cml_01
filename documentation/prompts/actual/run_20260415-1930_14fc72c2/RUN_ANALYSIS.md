# Run Analysis: run_20260415-1930_14fc72c2

## Scope
This analysis is based on:
- API run report: `apps/api/data/reports/proj_c25500a0-cb7b-4fac-a6c9-0544b6c3f769/run_14fc72c2-64b7-4950-9d6b-ead6f04fed56.json`
- Prompt index/state: `documentation/prompts/actual/run_20260415-1930_14fc72c2/INDEX.md`, `documentation/prompts/actual/run_20260415-1930_14fc72c2/.actual-run-state.json`
- Available request/response artifacts in `documentation/prompts/actual/run_20260415-1930_14fc72c2/`

## Run Summary
- Run ID: `run_14fc72c2-64b7-4950-9d6b-ead6f04fed56`
- Project ID: `proj_c25500a0-cb7b-4fac-a6c9-0544b6c3f769`
- Start: `2026-04-15T19:30:55.590Z` (first recorded request)
- End: `2026-04-15T19:32:26.163Z` (report generation timestamp)
- Duration: `90966 ms`
- Final status: `aborted` (`passed: false`)
- Terminal failure: `Agent 5 red-herring overlap gate failed after retry. Overlapping red herring(s): rh_1, rh_2`
- Scoring snapshot: `99.6 (A)` while run still aborted by hard gate

## Stage Timeline (from report + prompt records)
1. `setting` completed (Agent 1).
2. `cast` completed (Agent 2).
3. `background-context` completed (Agent 2e).
4. `hard_logic_devices` completed (Agent 3b).
5. `cml` completed (Agent 3).
6. `novelty` skipped per threshold settings.
7. `clues` entered regeneration and terminated at red-herring overlap gate.

## Request/Response Pair Review

### 01 Agent1-SettingRefiner
- Request: `01_Agent1-SettingRefiner_request.md`
- Response: `01_Agent1-SettingRefiner_response.md`
- Result:
  - Returned coherent 1940s setting with investigation-relevant constraints.
  - `realism.anachronisms` and `realism.implausibilities` were empty arrays as required.
- Notable risks:
  - None material to terminal failure.

### 02 Agent2-CastDesigner
- Request: `02_Agent2-CastDesigner_request.md`
- Response: `02_Agent2-CastDesigner_response.md`
- Result:
  - Produced 5-character cast with one detective and at least 3 possible culprits.
- Notable risks:
  - `relationships` returned as an array, while request contract called for `relationships.pairs[]` object shape.
  - This schema-shape drift can cause downstream parsing/scoring brittleness.

### 03 Agent2e-BackgroundContext
- Request: `03_Agent2e-BackgroundContext_request.md`
- Response: `03_Agent2e-BackgroundContext_response.md`
- Result:
  - Returned concise, valid backdrop (`status: ok`) aligned to era, setting, and cast anchors.
- Notable risks:
  - None material to terminal failure.

### 04 Agent3b-HardLogicDeviceGenerator
- Request: `04_Agent3b-HardLogicDeviceGenerator_request.md`
- Response: `04_Agent3b-HardLogicDeviceGenerator_response.md`
- Result:
  - Returned 5 devices with valid `principleType` enums and primary locked facts in worded time/quantity format.
- Notable risks:
  - Several non-primary devices are broad and rely on Agent 3 to concretize constraints cleanly.

### 05 Agent3-CMLGenerator
- Request: `05_Agent3-CMLGenerator_request.md`
- Response: `05_Agent3-CMLGenerator_response.md`
- Result:
  - Produced complete CML structure that passed schema gate in this run.
- High-impact downstream risks introduced here:
  - `culpability.culprit_count` is `1` while `culpability.culprits` is empty (`[]`), which weakens downstream certainty contracts.
  - Narrative-facing cast alibi windows use digit-based time notation (`9:00 to 11:00 PM`, etc.), increasing chance of style drift into clue text.
  - Several values in cast fields are loosely normalized (`access_plausibility: high|medium`) and can diverge from stricter downstream vocab expectations.

### 06 Agent5-ClueExtraction (initial)
- Request: `06_Agent5-ClueExtraction_request.md`
- Response: `06_Agent5-ClueExtraction_response.md`
- Result:
  - Returned `status: pass`, 9 clues, and 2 red herrings.
  - Prompt already contained strict contracts (source-path legality, step bounds, status contract, red-herring separation).
- Issues visible in output:
  - Invalid `sourceInCML` indices used (for example `CASE.constraint_space.time.contradictions[1]` and `[2]` where only one contradiction exists).
  - Name-index mismatch in cast references (for example `CASE.cast[Geoffrey Colenso].alibi_window` is not legal and later normalized to wrong numeric index).
  - `audit.invalidSourcePaths` remained empty despite invalid paths.
  - Red herrings leaned on clock-stoppage/timeline language close to inference correction semantics.

### 07 Agent5-ClueExtraction (response-only record)
- Response: `07_Agent5-ClueExtraction_response.md`
- Request file status:
  - Missing (`requestFile` empty in `.actual-run-state.json`).
- Result:
  - Response text not captured.
- Impact:
  - Observability gap during retry progression.

### 08 Agent5-ClueExtraction (retry 1)
- Request: `08_Agent5-ClueExtraction_retry1_request.md`
- Response: `08_Agent5-ClueExtraction_retry1_response.md`
- Result:
  - Retry prompt explicitly targeted red-herring overlap and demanded explicit rewrites.
  - Returned `status: pass`, 9 clues, and 2 revised red herrings.
- Final gate outcome:
  - Run aborted due to persistent red-herring overlap (`rh_1`, `rh_2`).
- Additional concerns in retry output:
  - Invalid/out-of-range paths persisted (`CASE.constraint_space.time.anchors[1]`, `CASE.constraint_space.time.contradictions[1]`, `CASE.constraint_space.time.contradictions[2]`).
  - Cast path drift persisted (`CASE.cast[2].alibi_window` for a clue describing Geoffrey Colenso).
  - `audit.invalidSourcePaths` still empty, contradicting deterministic path validity.

## Why The Run Failed (Root Cause)
Primary failure occurred at Agent 5 red-herring overlap gate after retry.

Contributing factors visible across artifacts:
1. Red-herring overlap persisted despite targeted retry:
- Retry instructions explicitly required non-overlap rewrites for `rh_1` and `rh_2`, but responses remained semantically close to true-solution temporal correction language.

2. Self-audit did not match generated defects:
- `audit.invalidSourcePaths` stayed empty while response contained clearly invalid/out-of-range `sourceInCML` paths.

3. Upstream normalization drift increased downstream fragility:
- CML included weak culprit-assignment consistency (`culprit_count` set with empty culprits list) and style drift that can leak into clue wording.

4. Retry observability gap:
- One Agent 5 response-only record lacked both request body and response content, reducing forensic traceability.

## Issue / Fix List (LLM Request Changes Only)
1. Issue: Red herrings remained semantically coupled to inference correction language after explicit retry instructions.
  Fix: Add strict exclusion list in Agent 5 retry prompt: prohibit reuse of correction n-grams and require orthogonal false-assumption-only phrasing validated by a short non-overlap rationale per red herring.

2. Issue: `audit.invalidSourcePaths` stayed empty despite invalid path output.
  Fix: Add a mandatory pre-output self-check block in Agent 5 request that enumerates each source path candidate and forces `status: fail` if any path is out of bounds.

3. Issue: Out-of-range step/constraint indices were still emitted (`anchors[1]`, `contradictions[1]`, `contradictions[2]`).
  Fix: Inject explicit live bounds in prompt (`anchors: 0..0`, `contradictions: 0..0`, step count bounds) and require model to cite only in-range indices.

4. Issue: Cast references drifted from entity to wrong index (Geoffrey clue mapped to `cast[2]`).
  Fix: In request, provide resolved cast name->index table and require source paths to use those exact indexes.

5. Issue: Model returned `status: pass` when audit arrays were inconsistent with output quality.
  Fix: Strengthen status contract language to require `pass` only when deterministic checks would succeed; otherwise force `fail` and list unresolved blocking items.

6. Issue: Retry mode targeted policy-level overlap but did not force concrete lexical substitutions.
  Fix: Require a compact rewrite ledger in output metadata (`old_phrase -> replacement_phrase`) for each red herring when overlap targets are present.

7. Issue: CML culpability assignment had internal weakness (`culprit_count` without assigned culprit).
  Fix: Tighten Agent 3 request to require non-empty `culprits` length exactly matching `culprit_count` before output acceptance.

8. Issue: Time-style drift remains a recurring source of downstream violations.
  Fix: Tighten Agent 3 and Agent 5 user prompts with explicit ban on digit-based time notation across narrative-facing fields and clue text.

## Additional Fixes (Runtime/Gate Hardening)
1. Issue: Model self-audit can report false negatives for invalid paths.
  Fix: Keep deterministic runtime source-path validation authoritative and hard-fail on any mismatch regardless of model `status`.

2. Issue: Red-herring overlap can evade simple lexical checks.
  Fix: Use weighted overlap scoring (token + phrase-level) and preserve hard-fail behavior for persistent high-severity overlap after retry.

3. Issue: Name/index mapping mistakes in cast paths are easy for model to produce.
  Fix: Add deterministic name-path consistency check for elimination clues, failing when clue text names one suspect but source path points to another.

4. Issue: Missing request/response artifacts reduce postmortem confidence.
  Fix: Enforce atomic artifact logging per attempt (request file + non-empty response body + response file) before marking attempt complete.

5. Issue: High quality score can mask gate-fatal clue-stage defects.
  Fix: Ensure report summary highlights gate-fatal errors alongside score so release-readiness cannot be inferred from grade alone.

## Artifacts Read (Checklist)
- `apps/api/data/reports/proj_c25500a0-cb7b-4fac-a6c9-0544b6c3f769/run_14fc72c2-64b7-4950-9d6b-ead6f04fed56.json`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/INDEX.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/.actual-run-state.json`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/01_Agent1-SettingRefiner_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/01_Agent1-SettingRefiner_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/02_Agent2-CastDesigner_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/02_Agent2-CastDesigner_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/03_Agent2e-BackgroundContext_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/03_Agent2e-BackgroundContext_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/04_Agent3b-HardLogicDeviceGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/04_Agent3b-HardLogicDeviceGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/05_Agent3-CMLGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/05_Agent3-CMLGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/06_Agent5-ClueExtraction_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/06_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/07_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/08_Agent5-ClueExtraction_retry1_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/08_Agent5-ClueExtraction_retry1_response.md`
