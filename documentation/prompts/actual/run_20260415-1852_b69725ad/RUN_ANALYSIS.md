# Run Analysis: run_20260415-1852_b69725ad

## Scope
This analysis is based on:
- Worker run log: `apps/worker/logs/run_20260415_b69725ad.json`
- Prompt index/state: `documentation/prompts/actual/run_20260415-1852_b69725ad/INDEX.md`, `documentation/prompts/actual/run_20260415-1852_b69725ad/.actual-run-state.json`
- All available request/response artifacts in `documentation/prompts/actual/run_20260415-1852_b69725ad/`

## Run Summary
- Run ID: `run_b69725ad-a4a6-415c-8826-03f83afdb15e`
- Project ID: `proj_0ccab91b-5a71-40f5-b565-29b635654f6c`
- Start: `2026-04-15T18:52:22.351Z`
- End: `2026-04-15T18:54:05.413Z`
- Duration: `103062 ms`
- Final status: `failed`
- Terminal failure: `Agent 5 red-herring overlap gate failed after retry. Overlapping red herring(s): rh_1, rh_2`

## Stage Timeline (from worker log)
1. `setting` completed: Era/setting refined.
2. `cast` completed: 5-character cast generated.
3. `background-context` completed.
4. `hard_logic_devices` completed: 5 devices generated.
5. `cml` completed: CML generated/validated in pipeline.
6. `novelty` skipped (threshold >= 1.0).
7. `clues` entered regeneration loop and failed at red-herring separation gate.

## Request/Response Pair Review

### 01 Agent1-SettingRefiner
- Request: `01_Agent1-SettingRefiner_request.md`
- Response: `01_Agent1-SettingRefiner_response.md`
- Result:
  - Returned valid setting package with realism arrays empty as required.
  - Investigation-relevant constraints were present (access control, isolation, communications).
- Notable quality risks:
  - Includes some broad modern-feeling phrasing, but no direct run blocker.

### 02 Agent2-CastDesigner
- Request: `02_Agent2-CastDesigner_request.md`
- Response: `02_Agent2-CastDesigner_response.md`
- Result:
  - Produced exactly 5 characters with one detective (`Ailla Lawry`) and >=3 suspect candidates.
  - Detector exclusion from `possibleCulprits` respected.
- Notable quality risks:
  - `relationships` came back as array entries, while request schema referenced `relationships.pairs[]` shape.
  - Worker warning indicates scoring path instability (`Cannot read properties of undefined (reading 'filter')`), suggesting parser/schema mismatch risk around cast-scoring integration.

### 03 Agent2e-BackgroundContext
- Request: `03_Agent2e-BackgroundContext_request.md`
- Response: `03_Agent2e-BackgroundContext_response.md`
- Result:
  - Returned concise, coherent backdrop with valid cast anchors and setting alignment.
- Notable risk:
  - None material to terminal failure.

### 04 Agent3b-HardLogicDeviceGenerator
- Request: `04_Agent3b-HardLogicDeviceGenerator_request.md`
- Response: `04_Agent3b-HardLogicDeviceGenerator_response.md`
- Result:
  - Returned 5 devices with required `principleType` enums.
  - Primary device includes worded locked facts (time/quantity wording and imperial-unit style guidance mostly respected).
- Notable quality risks:
  - Several devices are concept-level and require stronger grounding by Agent 3 to avoid downstream clue ambiguity.

### 05 Agent3-CMLGenerator
- Request: `05_Agent3-CMLGenerator_request.md`
- Response: `05_Agent3-CMLGenerator_response.md`
- Result:
  - Returned complete CML object that passed pipeline validation gates for this run.
- High-impact downstream risks introduced here:
  - Time references in CML are frequently numeric (`10:10 AM`, `11:15 AM`), which conflicts with period-style wording guidance and can bleed into clue phrasing.
  - Enum/value drift appears in cast fields (for example `access_plausibility: high|medium`), increasing mismatch risk across downstream logic expecting canonical vocabularies.
  - Inference text contains contradictory eliminations (one step effect says "Eliminates Raymond" while culprit is Raymond), which weakens clue-stage consistency.

### 06 Agent5-ClueExtraction (initial)
- Request: `06_Agent5-ClueExtraction_request.md`
- Response: `06_Agent5-ClueExtraction_response.md`
- Result:
  - Produced 8 clues + 2 red herrings.
  - Prompt already contains updated hard constraints (ID contract, source-path legality, elimination detail, era time wording, retry correction targets).
- Gate findings:
  - Worker warned about missing contradiction coverage and weak elimination coverage for `Paul Stephens`.
  - Red herring overlap warnings later triggered retry.
- Notable quality risks in response:
  - `sourceInCML` references include invalid indices (for example `CASE.constraint_space.time.contradictions[1]` where only one contradiction is evident).
  - Era-style time wording rule not consistently followed (numeric times remain).

### 07 Agent5-ClueExtraction (extra response record)
- Response only: `07_Agent5-ClueExtraction_response.md`
- Request file status:
  - Missing (`requestFile` empty in `.actual-run-state.json` and `INDEX.md`).
- Result:
  - Response text not captured.
- Impact:
  - Observability gap during retry sequence.

### 08 Agent5-ClueExtraction (retry 1)
- Request: `08_Agent5-ClueExtraction_retry1_request.md`
- Response: `08_Agent5-ClueExtraction_retry1_response.md`
- Result:
  - Included correction-target block for suspect-coverage issue and produced expanded clues.
- Remaining issues:
  - Red herrings still overlap true-solution signals per worker warning.
  - `sourceInCML` still includes questionable/out-of-range references (for example `CASE.constraint_space.physical.traces[1]` when CML shows one trace item).
  - Numeric time formatting persists despite style rule.

### 09 Agent5-ClueExtraction (retry 2)
- Request: `09_Agent5-ClueExtraction_retry2_request.md`
- Response: `09_Agent5-ClueExtraction_retry2_response.md`
- Result:
  - Included correction-target block for red-herring separation and returned updated clues/red herrings.
- Final gate outcome:
  - Pipeline failed: red herrings `rh_1` and `rh_2` still overlap inference-correction language and were judged to reinforce true-solution logic.
- Additional artifact-level concerns:
  - Multiple `sourceInCML` pointers target non-existent inference steps (`CASE.inference_path.steps[3]` through `[6]` with only 3 steps in CML).
  - `audit.invalidSourcePaths` remained empty despite those invalid references, reducing trust in self-audit effectiveness.

## Why The Run Failed (Root Cause)
Primary failure occurred at Agent 5 red-herring separation gate after retries.

Contributing factors visible across artifacts:
1. Red-herring semantic overlap remained unresolved:
- Retry prompt explicitly targeted overlap, but response red herrings still reused timeline/conflict language tightly coupled to true inference corrections.

2. Self-audit did not reflect actual output defects:
- `audit.invalidSourcePaths` remained empty while response contained clearly out-of-range `sourceInCML` references.
- This indicates the self-audit contract is present but not faithfully enforced by generation.

3. Upstream normalization pressure from Agent 3 CML:
- Numeric time style and field-value drift increase ambiguity and make downstream clue/wording compliance harder.
- Contradictory inference effects reduce clean separation between signal clues and red-herring text.

4. Observability gap in retry sequence:
- One Agent 5 response-only record lacks both request and body, weakening forensic traceability of retry progression.

## Issue / Fix List (LLM Request Changes Only)
1. Issue: Red herrings continued to overlap true-solution correction language after targeted retry.
  Fix: LLM request change: add a hard lexical-separation rule forbidding reuse of inference correction keywords in `redHerrings[*].description` and `misdirection`; require replacement with orthogonal, false-assumption-only framing.

2. Issue: `audit.invalidSourcePaths` returned empty despite invalid/out-of-range `sourceInCML` entries.
  Fix: LLM request change: require explicit index validation in prompt ("Do not cite any array index unless that index exists in CML") and require `invalidSourcePaths` to list each rejected candidate before final output.

3. Issue: Response used non-existent inference step paths (`steps[3+]`) while only 3 steps exist.
  Fix: LLM request change: provide exact step count in developer prompt and require all `supportsInferenceStep` and `sourceInCML` step indices to be within `[0..stepCount-1]`.

4. Issue: Era time-style instruction was not consistently followed in clue text.
  Fix: LLM request change: add a strict wording gate in user prompt: "No digit-based clock notation in clue descriptions/pointsTo; use only worded period expressions (for example, `a quarter past eleven`)."

5. Issue: Red-herring overlap retry targeted abstract policy but not concrete rewrite actions.
  Fix: LLM request change: in retry `Correction Targets`, require per-red-herring rewrite table (`old phrase -> replacement phrase`) and force both `rh_1` and `rh_2` to include explicit non-overlap justification.

6. Issue: Elimination cues improved, but contradiction-clue coverage warnings still appeared.
  Fix: LLM request change: include mandatory minimum of one contradiction clue per inference step with explicit `supportsInferenceStep` mapping and an enforcement checklist line.

7. Issue: Prompt contract includes self-audit arrays but does not force failure when non-empty.
  Fix: LLM request change: require model to return a hard `status` field (`pass|fail`) where `pass` is allowed only if all audit arrays are empty; otherwise output `fail` with blocking reasons.

8. Issue: Upstream CML wording/value drift weakens downstream clue quality.
  Fix: LLM request change (Agent 3): tighten request constraints for canonical enum vocabulary and era-worded times across narrative-facing fields before Agent 5 ingestion.

## Additional Fixes (Scoring/Gate Modernization)
1. Issue: Red-herring overlap gate is lexical and overly brittle (single keyword overlap can trigger failure).
  Fix: Replace word-overlap heuristic with weighted semantic overlap scoring that checks phrase-level proximity to inference corrections and only fails when overlap score exceeds a calibrated threshold.

2. Issue: Red-herring overlap currently hard-fails after one retry, even if overlap is minor/noisy.
  Fix: Convert first overlap failure to warning + targeted retry, and reserve hard-fail for persistent high-severity overlap after a second calibrated pass.

3. Issue: Clue-count scoring baseline is static (`>=8`) and penalizes valid minimal-density runs.
  Fix: Make clue-count scoring density-aware (`minimal`, `moderate`, `dense`) so expected count is derived from run target instead of fixed threshold.

4. Issue: Elimination/alibi detection uses narrow regex cues and misses semantically valid formulations.
  Fix: Expand elimination/alibi detection with synonym sets and structure-aware features (`evidenceType`, suspect name + time window + corroborator), not regex-only matching.

5. Issue: `sourceInCML` validity is trusted from model output but not deterministically verified.
  Fix: Add deterministic `sourceInCML` path parser/validator in Agent 5 runtime that checks root path legality and array index bounds against actual CML before accepting clues.

6. Issue: Self-audit arrays are not enforced against actual computed defects.
  Fix: Recompute audit facts in runtime (`missingDiscriminatingEvidenceIds`, `invalidSourcePaths`, weak elimination set) and fail when model-declared audit disagrees with deterministic checks.

7. Issue: Time-style compliance is prompt-only and therefore drift-prone.
  Fix: Add deterministic time-style lint in Agent 5 gate for clue text (`description`, `pointsTo`) to block digit-based clock notation when era rules require worded forms.

8. Issue: Retry observability gap remains possible (missing request/response record in middle of loop).
  Fix: Add atomic artifact logging contract per retry attempt: request file + response file + non-empty response body must all exist before retry attempt is considered complete.

## Artifacts Read (Checklist)
- `apps/worker/logs/run_20260415_b69725ad.json`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/INDEX.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/.actual-run-state.json`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/01_Agent1-SettingRefiner_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/01_Agent1-SettingRefiner_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/02_Agent2-CastDesigner_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/02_Agent2-CastDesigner_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/03_Agent2e-BackgroundContext_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/03_Agent2e-BackgroundContext_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/04_Agent3b-HardLogicDeviceGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/04_Agent3b-HardLogicDeviceGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/05_Agent3-CMLGenerator_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/05_Agent3-CMLGenerator_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/06_Agent5-ClueExtraction_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/06_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/07_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/08_Agent5-ClueExtraction_retry1_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/08_Agent5-ClueExtraction_retry1_response.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/09_Agent5-ClueExtraction_retry2_request.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/09_Agent5-ClueExtraction_retry2_response.md`
