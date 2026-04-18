# ANALYSIS_56 - Run 20f9ca27 Prompt Contract Review

**Date:** 2026-04-18
**Run folder:** `documentation/prompts/actual/run_20260417-2110_20f9ca27`
**Run ID:** `run_20f9ca27-9933-4c85-bb51-9146f093c292`
**Project ID:** `proj_0b9d9c24-d00c-455d-a7a2-b502f3126204`
**Best prompt specs used for comparison:**
- `documentation/prompts/best/AGENT_3_CML_BEST_PROMPT.md`
- `documentation/prompts/best/AGENT_4_CML_VALIDATOR_BEST_PROMPT.md`
- `documentation/prompts/best/AGENT_5_CLUES_BEST_PROMPT.md`
- `documentation/prompts/best/AGENT_6_FAIRPLAY_BEST_PROMPT.md`
**Agent docs used for comparison:**
- `documentation/03_Agents/07_agent_3_cml_generator.md`
- `documentation/03_Agents/09_agent_4_cml_revision.md`
- `documentation/03_Agents/10_agent_5_clues_red_herrings.md`
- `documentation/03_Agents/11_agent_6_fair_play_auditor.md`

---

## 1. Executive Summary

This run aborted during the Agent 4 revision loop after a fair-play escalation:
- Abort reason: missing `CASE.inference_path.steps[*].required_evidence`
- Stage trajectory: Agent 1/2/2e/3b/3/5/6 ran; Agent 4 retried 5x and failed terminally

Primary pattern: prompt contracts are partially implemented but drift in key places from best-spec intent (especially retry shape, evidence-addressability, and observability consistency). The biggest defect is non-convergent Agent 4 revision behavior under repeated retries.

---

## 2. Findings (Issues, Root Cause, Fix)

### Issue A (Critical): Agent 4 revision loop is non-convergent and appears to regress/recycle stale invalid CML

**Evidence**
- Run aborted with repeated missing `required_evidence` errors: `apps/worker/logs/run_20260417_20f9ca27.json`
- Attempt 5 request still feeds an input CML whose inference steps have no `required_evidence`: `documentation/prompts/actual/run_20260417-2110_20f9ca27/16_Agent4-Revision_retry4_request.md`
- Captured Agent 4 responses include `required_evidence` in inference steps, yet loop still reports them missing: `documentation/prompts/actual/run_20260417-2110_20f9ca27/12_Agent4-Revision_response.md`, `documentation/prompts/actual/run_20260417-2110_20f9ca27/15_Agent4-Revision_retry3_response.md`, `documentation/prompts/actual/run_20260417-2110_20f9ca27/16_Agent4-Revision_retry4_response.md`

**Root cause hypothesis (high confidence)**
- Retry state is not strictly anchored to the last validated candidate object, so the next retry can be built from a stale/invalid prior payload.
- Agent 4 is asked for full-document rewrites, which increases regression surface each retry and makes convergence brittle.

**Fix**
1. In `packages/prompts-llm/src/agent4-revision.ts`, switch retry instruction to patch-mode contract:
   - "Only modify JSON paths listed in `Correction Targets`"
   - "Return unchanged document elsewhere"
2. In Agent 3/4 orchestration (`apps/worker/src/jobs/agents/agent3-run.ts`), persist and reuse a canonical `lastCandidateCml` after each successful parse, and guarantee next retry input is that object, not original/stale YAML.
3. Add a deterministic preflight before re-prompting:
   - If all missing paths are now present, skip further Agent 4 retries.
4. Add a regression sentinel:
   - Fail fast if a retry removes previously fixed required fields.

---

### Issue B (High): Agent 6 fair-play prompt is not reliably clue-ID-addressable, causing generic and unstable audit outcomes

**Evidence**
- Best spec requires concrete citations by clue IDs/CML locations: `documentation/prompts/best/AGENT_6_FAIRPLAY_BEST_PROMPT.md`
- Actual Agent 6 developer payload lists clue prose but not stable clue IDs in findings context: `documentation/prompts/actual/run_20260417-2110_20f9ca27/08_Agent6-FairPlayAuditor_request.md`, `documentation/prompts/actual/run_20260417-2110_20f9ca27/10_Agent6-FairPlayAuditor_request.md`
- Agent 6 responses use generic location strings and inconsistent judgments between consecutive audits (for example, first fails clue visibility, second passes it on near-identical context): `documentation/prompts/actual/run_20260417-2110_20f9ca27/08_Agent6-FairPlayAuditor_response.md`, `documentation/prompts/actual/run_20260417-2110_20f9ca27/10_Agent6-FairPlayAuditor_response.md`

**Root cause**
- Prompt asks for strict traceable citations, but evidence is delivered mostly as natural-language clue summaries without a strongly enforced ID-keyed table.
- Ambiguous timing phrasing ("before discriminating test") is not paired with deterministic act-order semantics in the check request.

**Fix**
1. In `packages/prompts-llm/src/agent6-fairplay.ts`, pass a mandatory `cluesById[]` block:
   - `id`, `placement`, `criticality`, `supportsInferenceStep`, `sourceInCML`
2. Enforce output contract extension:
   - each failed check must include `evidenceRefs: string[]` with clue IDs and/or CML paths.
3. Add deterministic post-check in `apps/worker/src/jobs/agents/agent6-run.ts`:
   - reject/repair audit responses with empty evidence refs on `fail` or `critical` violations.
4. Clarify timing semantics in prompt:
   - explicitly define `early < mid < late < discriminating_test_scene` and require rule evaluation against that ordering.

---

### Issue C (High): Agent 5 retry prompt drift from best-spec "delta-only" contract creates noisy/contradictory retries

**Evidence**
- Best prompt spec defines retry as delta-only (`must_fix[]`, targeted rewrites): `documentation/prompts/best/AGENT_5_CLUES_BEST_PROMPT.md`
- Actual retry prompt re-sends full large contract and includes contradictory feedback payloads (example: `Status: fail` with `Violations: None`): `documentation/prompts/actual/run_20260417-2110_20f9ca27/09_Agent5-ClueExtraction_request.md`

**Root cause**
- Retry assembly keeps entire baseline contract plus appended audit text, instead of strictly scoped corrective deltas.
- Contradictory feedback fragments are not normalized before prompt injection.

**Fix**
1. In `packages/prompts-llm/src/agent5-clues.ts`, implement strict retry-minification mode:
   - keep base system prompt stable
   - send only unresolved defects and targeted IDs in retry payload
2. Add feedback normalization before prompt assembly:
   - if `overallStatus=fail` and `violations=[]`, synthesize deterministic `must_fix` from runtime gate outputs instead of forwarding ambiguous text.
3. Keep unaffected clues/red herrings immutable during targeted retries unless dependency requires edits.

---

### Issue D (Medium): Run report and telemetry are internally inconsistent with actual execution

**Evidence**
- Report says only one failed phase (`fair-play`) and retry stats `0`, but run clearly performed Agent 5 retry + Agent 4 x5 and aborted on Agent 4 failure:
  - `apps/api/data/reports/proj_0b9d9c24-d00c-455d-a7a2-b502f3126204/run_20f9ca27-9933-4c85-bb51-9146f093c292.json`
  - `apps/worker/logs/run_20260417_20f9ca27.json`
- CML phase summary says "No structural revision needed" while same run later aborts from CML revision failure.

**Root cause**
- Reporting pipeline merges phase snapshots and abort metadata inconsistently; retry/escalation counters are not reconciled into final report summary.

**Fix**
1. In report builder path, reconcile final abort source with phase summaries before write.
2. Introduce invariant check:
   - if `abort_reason` mentions Agent 4/CML revision, `retry_stats.total_retries > 0` and CML phase must reflect structural revision activity.
3. Add regression fixture with this run signature to prevent recurrence.

---

### Issue E (Medium): Prompt-capture integrity is degraded for this run

**Evidence**
- `missing_request_count: 8` in run state: `documentation/prompts/actual/run_20260417-2110_20f9ca27/.actual-run-state.json`

**Root cause**
- Prompt archival process is partially lossy under some operations/attempts.

**Fix**
1. In prompt-capture pipeline, add per-record hard assertion:
   - `chat_request_full_prompt` and `chat_response` pair completeness per prompt hash.
2. Surface capture integrity failures as first-class warnings in run/report output.

---

## 3. Prompt vs Best-Spec Alignment Snapshot

### Agent 3
- Mostly aligned with best-spec blocks (schema summary, novelty constraints, required skeleton).
- Risk remains downstream: revision fallback behavior dominates failure, not initial Agent 3 generation.

### Agent 4
- Intent aligned (minimal fixes + complete JSON), but operational contract is too broad (full rewrite) and not convergence-safe.

### Agent 5
- Strong constraint coverage present, but retry shape diverges from "delta-only" best-spec and carries contradictory audit fragments.

### Agent 6
- High-level checklist aligned, but evidence-addressability and citation strictness are under-enforced in both input and output.

---

## 4. Priority Fix Plan

1. **P0**: Make Agent 4 retries convergence-safe (patch-mode + canonical candidate chaining + regression sentinel).
2. **P1**: Make Agent 6 outputs evidence-addressable by enforced clue-ID references.
3. **P1**: Make Agent 5 retries delta-only and normalize contradictory audit feedback.
4. **P1**: Reconcile report summary invariants with abort source and retry counts.
5. **P2**: Harden prompt-capture integrity accounting.

---

## 5. Expected Outcome After Fixes

- Agent 4 should converge or fail deterministically for genuine unresolved constraints, not state drift.
- Fair-play retries should become precise and reproducible (ID-cited, less oscillation).
- Reporting should accurately reflect retries/escalations and abort source.
- Prompt forensic review should no longer be blocked by missing request records.
