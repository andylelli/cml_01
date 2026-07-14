# ANALYSIS_33 — Run `893f8630`: Narrative Schema Abort After Deep Pipeline Progress
*Date: 2026-05-30 | Project: `proj_83cb0b92` | Run: `run_893f8630-1072-4d9d-bab3-e3f4a7b4d086` | Prompt bundle: `run_20260530-1721_893f8630`*

---

## 1. Scope

This report analyzes the run associated with:

- `C:\CML\documentation\prompts\actual\run_20260530-1721_893f8630`

This is a different run from ANALYSIS_32.

---

## 2. Outcome Summary

| Item | Value |
|------|-------|
| Run status | `idle` (after failure handling) |
| Event count | 48 (from `store.json` runEvents for this run) |
| Last terminal stage | `pipeline_error` -> `run_failed` |
| Failure class | Narrative outline schema validation failure |
| LLM availability | Healthy (all captured prompt/response pairs completed) |

---

## 3. Pipeline Progress Reached

The run progressed through all major pre-prose stages before failing at narrative validation:

1. Agent1 Setting: completed
2. Agent2 Cast: completed (`Cast designed (5 characters)`)
3. Agent2e Background context: completed
4. Agent3b Hard-logic devices: completed
5. Agent3 CML: completed (with one retry cycle)
6. Agent5 Clues: completed (deterministic sanitization + mapping repairs logged)
7. Agent6 Fair-play + Blind reader: pass
8. Agent2b Character profiles: completed
9. Agent2c Location profiles: completed
10. Agent2d Temporal context: completed
11. Agent65 World builder: completed
12. Agent7 Narrative formatting: LLM response returned, then schema gate failed

Partial artifacts were persisted for all completed stages after failure (`*_partial_done`).

---

## 4. Failure Evidence

### 4.1 Top-level pipeline error

`Pipeline failed: Mystery generation failed: Narrative outline artifact failed schema validation (deterministic mode: schema retry disabled)`

### 4.2 Failure snapshot errors

From `pipeline_failure_snapshot` payload:

- `Outline schema failure: acts[1].scenes[4].characters is required`
- `Outline schema failure: acts[1].scenes[4].cluesRevealed is required`
- `Outline schema failure: acts[1].scenes[4].dramaticElements is required`
- `Outline schema failure: acts[1].scenes[5].sceneNumber is required`
- `Outline schema failure: acts[1].scenes[5].act is required`
- `Outline schema failure: acts[1].scenes[5].setting.location is required`
- `Outline schema failure: acts[1].scenes[5].setting.atmosphere is required`
- `Outline schema failure: acts[1].scenes[5].characters is required`
- `Outline schema failure: acts[1].scenes[5].cluesRevealed is required`
- `Outline schema failure: acts[1].scenes[5].dramaticElements is required`
- `Outline schema failure: acts[1].estimatedWordCount is required`
- `Outline schema failure: pacingNotes is required`

### 4.3 Deterministic mode effect

The run was in deterministic mode for pre-Agent9 retries, so schema-repair retry for narrative was disabled. This converted a recoverable malformed outline into an immediate hard stop.

---

## 5. LLM Timing (From `.actual-run-state.json`)

Request->response durations indicate normal model responsiveness; no long-hang signature:

| Seq | Agent | Retry | Gap (s) |
|-----|-------|-------|---------|
| 1 | Agent1-SettingRefiner | 1 | 6.724 |
| 2 | Agent2-CastDesigner | 1 | 14.702 |
| 3 | Agent2e-BackgroundContext | 1 | 3.155 |
| 4 | Agent3b-HardLogicDeviceGenerator | 1 | 15.660 |
| 5 | Agent3-CMLGenerator | 1 | 29.453 |
| 6 | Agent3-CMLGenerator | 2 | 27.213 |
| 7 | Agent5-ClueExtraction | 1 | 19.493 |
| 8 | Agent6-FairPlayAuditor | 1 | 5.606 |
| 9 | Agent6-BlindReader | 1 | 4.327 |
| 10 | Agent2b-CharacterProfiles | 1 | 21.633 |
| 11 | Agent2c-LocationProfiles | 1 | 44.463 |
| 12 | Agent2d-TemporalContext | 1 | 18.753 |
| 13 | Agent65-WorldBuilder | 1 | 28.682 |
| 14 | Agent7-NarrativeFormatter | 1 | 20.838 |

Interpretation: model latency was acceptable; failure source is artifact contract conformance, not service slowness.

---

## 6. Diagnostic Notes

1. Narrative agent returned a response (`14_Agent7-NarrativeFormatter_response.md` present, non-empty).
2. Schema failures are concentrated in Act 2 scene structures plus missing `pacingNotes` and missing `acts[1].estimatedWordCount`.
3. Run warnings show heavy deterministic sanitation activity in Agent5/Agent6, but those did not cause abort; they completed and persisted.

---

## 7. Root Cause

Primary cause: Narrative output shape drifted from the outline schema contract.

Contributing factor: Deterministic mode disabled narrative schema-repair retry, so no automatic correction pass was attempted.

---

## 8. Recommended Fix Direction

1. Add narrative-level pre-validation normalization for common near-miss structural patterns (scene object completeness, optional-to-required field lifts where safe).
2. Introduce a bounded schema-repair retry for Agent7 even when global deterministic mode is enabled, or a narrow override for structural outline failures.
3. Add targeted guardrails in Agent7 request contract requiring all required fields in every scene object and explicit `pacingNotes` emission.

---

## 9. Appendix: Artifact Coverage at Failure Time

Artifact types persisted for this project include:

- `setting`
- `cast`
- `background_context`
- `hard_logic_devices`
- `cml`
- `clues`
- `fair_play_report`
- `character_profiles`
- `location_profiles`
- `temporal_context`
- `world_document`
- `pipeline_failure_snapshot`

This confirms the run reached late-stage narrative before aborting.