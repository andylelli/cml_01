# ANALYSIS_41 - Run History Log Forensics and Fix Workstreams

Date: 2026-06-15

## 1. Scope

This analysis consolidates issues and warnings from run history and operational logs to prepare implementation-ready fix workstreams.

In scope:
- Current failed run: `run_88ed23b2-e3f7-4321-a2fe-95e091e64481`
- Historical recurrence signals from run-event stores
- Worker run/scoring logs, API report/log summaries, and activity transport logs

Out of scope:
- Full prompt transcript payloads in `logs/llm-prompts-full.jsonl`

Primary sources reviewed:
- `apps/worker/logs/run_20260615_88ed23b2.json`
- `apps/worker/logs/scoring.jsonl`
- `apps/api/data/reports/proj_4d574e5c-65c8-4366-8031-f29cfd632ed1/run_88ed23b2-e3f7-4321-a2fe-95e091e64481.json`
- `apps/api/logs/llm.jsonl`
- `logs/activity.jsonl`
- `data/store.json`
- `apps/api/data/store.json`
- `documentation/07_workflow/07_workflow.md`

## 2. Executive Summary

The run failed for a hard, end-of-pipeline reason, not for early schema rejection:
- Prose generation aborted at chapter 9 after retry exhaustion and fallback validation failure.
- Failure reason is explicit final-reveal incompleteness (motive/opportunity linkage not satisfied).

Cross-run evidence shows recurrence, not a one-off:
- Historical runs also terminate on late chapter validation failures after limited retries.
- Failure classes include name-contract drift and discriminating-test completeness gaps.

Non-blocking but high-noise issues are also present:
- Repeated cast schema warnings for character-level `relationships` fields.
- High-volume `404` polling in activity logs that appears mostly expected according to workflow docs.

## 3. Severity-Ranked Findings

### F1 - P0 Blocking: Terminal prose abort on final reveal completeness

Evidence:
- `apps/worker/logs/run_20260615_88ed23b2.json:76` - `Chapter 9 validation failed (attempt 6/6): 7 issue(s)`
- `apps/worker/logs/run_20260615_88ed23b2.json:155` - pipeline failure cites final reveal completeness requirement
- `apps/api/data/reports/proj_4d574e5c-65c8-4366-8031-f29cfd632ed1/run_88ed23b2-e3f7-4321-a2fe-95e091e64481.json:10` - `run_outcome: "aborted"`
- `apps/api/data/reports/proj_4d574e5c-65c8-4366-8031-f29cfd632ed1/run_88ed23b2-e3f7-4321-a2fe-95e091e64481.json:3894` - `component_failures: ["prose_generation_aborted"]`
- `apps/api/data/reports/proj_4d574e5c-65c8-4366-8031-f29cfd632ed1/run_88ed23b2-e3f7-4321-a2fe-95e091e64481.json:3896` - explicit abort failure reason

Impact:
- Run does not complete prose chapter set; downstream acceptance remains failed.

### F2 - P0 Blocking Recurrence: Chapter-level retry exhaustion and non-convergent fallback path

Evidence (current run):
- `data/store.json:227-592` - repeated chapter validation failures across chapters 1-9
- `data/store.json:407`, `data/store.json:457`, `data/store.json:557` - forced deterministic fallback events
- `data/store.json:666` - `run_failed`

Evidence (historical runs):
- `apps/api/data/store.json:473`, `apps/api/data/store.json:478` - chapter 17 failed after retries
- `apps/api/data/store.json:483` - pipeline error with character-name contract breach (`Mr. Jennings` not in cast)
- `apps/api/data/store.json:808`, `apps/api/data/store.json:813` - chapter 12 failed after retries
- `apps/api/data/store.json:818` - pipeline error for missing discriminating-test scene

Impact:
- Late-stage failures consume compute budget and still end in aborted/failed outcomes.

### F3 - P1 High Recurrence: Name-contract drift under fallback/retry pressure

Evidence:
- `data/store.json:257`, `data/store.json:327`, `data/store.json:402`, `data/store.json:452`, `data/store.json:552` - repeated `Character name "Detective Inspector" not found in CML cast`
- `apps/api/data/store.json:483` - historical recurrence with `Mr. Jennings` not in cast

Impact:
- Validator contract breaches persist despite retries and become terminal in some runs.

### F4 - P1 Warning Drift: Cast schema mismatch for character-level relationships

Evidence:
- `apps/worker/logs/run_20260615_88ed23b2.json:120-125` - `characters[n].relationships is not defined in schema`
- Warning origin path:
  - `apps/worker/src/jobs/agents/agent2-run.ts:359`
  - `packages/cml/src/artifact-validator.ts:110`
- Schema reference currently models relationships at top-level:
  - `schema/cast_design.schema.yaml:55`

Impact:
- Non-blocking today, but signals schema/output contract drift that can hide future regressions.

### F5 - P1 Quality Degrader: Inference coverage weaknesses patched deterministically

Evidence:
- `apps/worker/logs/run_20260615_88ed23b2.json:127-130` - contradiction clue gap, low mapped clues, red-herring overlap, unreferenced suspect
- `apps/worker/logs/scoring.jsonl:8` - `evidence_clue_backfill` injected clues to satisfy traceability

Impact:
- Quality and traceability rely on deterministic repair/backfill; base generation remains brittle.

### F6 - P2 Operational Noise: High-volume 404 polling is mostly expected

Evidence:
- `logs/activity.jsonl:34` and surrounding lines - repeated `http_error` 404 on `/latest` endpoints while run progresses
- Expected behavior documented:
  - `documentation/07_workflow/07_workflow.md:21` - `GET /api/projects/:id/*/latest` can return `404 (artifact not found)`
  - `documentation/07_workflow/07_workflow.md:82` - UI avoids new-project 404 fan-out when latest run is null

Impact:
- Log signal-to-noise is degraded; operator triage is slower unless noise is explicitly classified.

## 4. Root-Cause Hypotheses (Tagged)

H1 (high confidence): Retry classification/continuation policy can terminate non-template classes too aggressively under repeated class convergence.
- Evidence touchpoints:
  - `packages/prompts-llm/src/retry-protocol.ts:35` (`final reveal completeness` -> `fair_play`)
  - `packages/prompts-llm/src/retry-protocol.ts:69` (class rank)
  - `packages/prompts-llm/src/retry-protocol.ts:197` (stop on repeated non-template class at attempt >= 2)

H2 (high confidence): Final-reveal contract is strict and correctly explicit, but fallback content path is not consistently satisfying that contract before commit.
- Evidence touchpoints:
  - `packages/prompts-llm/src/agent9-prose/clue-validation.ts:1004`
  - `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts:693`
  - Runtime symptom in run/report logs (F1/F2)

H3 (medium confidence): Name alias/title handling in fallback prose remains under-constrained, causing repeated cast-name legality violations.
- Evidence touchpoints:
  - repeated runtime errors in store history (F3)
  - generated chapter text examples in checkpoint artifact show heavy title-first phrasing.

H4 (high confidence): Cast `relationships` warnings are a schema-shape parity issue (top-level schema vs character-level emission).
- Evidence touchpoints:
  - runtime warnings (F4)
  - validator warning mechanism (`artifact-validator.ts`) + schema definition.

H5 (high confidence): 404 activity noise is mostly expected artifact-availability timing, not direct persistence loss.
- Evidence touchpoints:
  - workflow docs define expected 404 for missing latest artifacts
  - run completed many upstream stages before prose abort.

## 5. Prioritized Fix Workstreams

### Workstream A (P0): Agent9 terminal completion hardening

Goal:
- Prevent chapter-level terminal abort when fallback path can be made contract-complete.

Primary touchpoints:
- `packages/prompts-llm/src/retry-protocol.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/clue-validation.ts`
- `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`

Acceptance criteria:
- For final-reveal failures, retries/fallback either satisfy reveal completeness or produce a deterministic escalation path that still completes chapter generation.
- No `prose_generation_aborted` for the equivalent failure class in regression test fixture.

### Workstream B (P0): Name-contract prevention before chapter commit

Goal:
- Eliminate title-only or unknown-name drift (`Detective Inspector`, `Mr. Jennings`) in fallback/repair text.

Primary touchpoints:
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`
- name-validation helpers in story-validation stack.

Acceptance criteria:
- Regression tests fail if any committed paragraph references non-cast character names outside approved alias rules.
- Historical error signatures no longer appear in rerun logs.

### Workstream C (P1): Cast schema/output parity cleanup

Goal:
- Remove recurring `characters[n].relationships` unexpected-field warnings by making one canonical shape.

Primary touchpoints:
- `apps/worker/src/jobs/agents/agent2-run.ts`
- `schema/cast_design.schema.yaml`
- `packages/cml/src/artifact-validator.ts` (warning semantics unchanged, only parity improved)

Acceptance criteria:
- Current run cast warnings reduced to zero for relationships-shape mismatch.
- Schema validation still enforces required relationship coverage.

### Workstream D (P1): Template-linter resilience under fallback pressure

Goal:
- Reduce repeated opener/template failures without collapsing into repetitive deterministic prose.

Primary touchpoints:
- `packages/prompts-llm/src/agent9-prose/lint.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- deterministic fallback prose builder paths.

Acceptance criteria:
- Significant reduction in repeated opener retries for mid-late chapters.
- No increase in hard structural failures.

### Workstream E (P2): 404 polling noise normalization in reporting

Goal:
- Keep expected-not-found transport events visible but reduce their weight in issue triage reports.

Primary touchpoints:
- activity-log interpretation/reporting layer and run-analysis docs.

Acceptance criteria:
- Analysis reports classify expected 404s as operational noise by default unless correlated with missing artifacts post-stage completion.

## 6. Verification Plan and Exit Criteria

Verification steps:
1. Reproduce baseline on current fixture run logs and assert all cited signatures are detectable.
2. Add targeted regression tests for:
- final-reveal completeness convergence path
- cast-name legality in fallback output
- cast relationships schema parity
3. Re-run worker build/tests for touched packages.
4. Execute one end-to-end generation run and validate:
- no prose abort for equivalent failure class
- warning profile improved (schema drift + template churn)
- report invariants remain valid.

Exit criteria:
- `run_outcome` is no longer aborted for this failure class.
- No recurring `Character name ... not found in CML cast` in analogous runs.
- Cast relationships warning class removed.
- Expected 404 noise remains documented as non-blocking.

## 7. Notes

- This analysis intentionally separates proven evidence from hypotheses.
- Full prompt transcript analysis remains excluded by scope.
- Implementation should prioritize prevention-over-cure controls first (contract hardening before additional retry complexity).