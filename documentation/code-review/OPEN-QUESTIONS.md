# What the refactoring needs from the owner (2026-10-02)

**Every buildable item is built.** The ledger is at 367 of 401 closed. The 34 that remain cannot be closed by code
alone: 15 are owner questions, 5 wait on a flag flip or a paid read, and 14 are deferred with reasons.

## 1. Decisions with no recommendation on record — yours to make

| Item | The question | Notes |
|---|---|---|
| A6-Q01 | Probe Agent 6's own LLM-retry arm (`AGENT_PRE9_ENABLE_LLM_RETRIES`, OFF, never set), or retire it as decision 7 retired the phase-score path? | Its retries are now failure-aware (A6-02) and refuse degraded revisions (A34-D09). Retiring would also settle A6-16 and A6-Q03. |
| A7-Q04 | A clue with no placement: act 2 or act 3? | `clue-pacing.ts` uses act 3 in one place, act 2 in two (`clue-pacing.ts`, `agent7/scheduler.ts`). |
| A5-Q04 | Red-herring floor: a targeted red-herring-only call, or move the floor after the deterministic phases? | Its whole-set regeneration is what A5-D05 (behind the flag) repairs after. |
| A5-12 | Derive Agent 5's strict contract once, after all CML mutation (removes the WeakMap memos)? | A5-D06 (behind the flag) already invalidates the stale memo; this is the structural version. |
| A5-15 / A5-Q07 | When does `@cml/clue-spec` become the source of Agent 5's checklist? | The review gives the direction (the checklist as a projection of ClueSpec), no timing. Changes the prompt. |
| A1X-Q02 | Phase scores on the raw LLM output (today, for 1, 2, 2c) or on the shipped, post-processed artifact? | |
| A1X-Q04 | Pin Agent 2d's date to the run's hashed anchor rather than trusting the model's month? | A resume that re-runs 2d currently re-dates the story. |
| SCO-D12 | Novelty "skipped" is recorded as 100/A and averaged into the overall score. Keep, exclude, or mark N/A? | A report-number policy. |
| SCO-Q03 | Are the strict / lenient threshold modes wanted at all? | If not, their tables and the stale `agent4-hard-logic` / `agent9-prose` keys go too. |
| SCO-Q07 | Should 2b, 2d and 6.5 get honest check tables (they keep vanity scorers), and should Agent 9 have a phase score at all? | Decision 8 kept them "until SCO-Q07". |
| ORC-Q02 (+ ORC-D02) | May the offline Agent 9 replay adopt the live rubric path (judge model, verifiers)? Its historical scores become non-comparable. | |
| A7-10 | Pick a schema source (zod or json-schema-to-ts) for one schema → type → boundary parser? | A new dependency. |

## 2. Waiting on a flip or a paid read

| Item | What it waits on |
|---|---|
| A7-Q05 | **The `CML_VERIFIED_FIXES` read** — one matched pair (two full runs, ~£2.30). ~30 verified-bug fixes in Agents 1–8 are built behind it, OFF ([DECISION-12](DECISION-12.md)). |
| A34-02, A1X-01, A34-D10, A6-07 | **Decision 2's flip** of `CML_IDENTITY_ROLE_WINS`, after N runs of the `[identity-disagree]` shadow counter. |

## 3. Deferred, with reasons (ledger notes carry them)

CR-28 ×6 (A5-10, A5-16, A5-Q03, A6-17, A34-14, A1X-11): every-run prompt changes in non-prose agents, each needs a
probe. CR-34 ×2 (A6-16, A6-Q03): k=1 by default; the audit→read data dependency; the arm waits on A6-Q01. Plus A6-04,
A6-D09, A7-12, A6-06, A6-12, A6-D05 (earlier deferrals), and A1X-15's Agent 2 no-names branch (public input, pinned by
14 test calls).
