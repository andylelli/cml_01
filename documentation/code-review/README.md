# Code review — the agent code

**Status: in progress** (last updated 2026-09-26). A full refactoring audit of the pipeline's agents:
how to make the code cleaner and more efficient without changing what it does, and where a change in
behaviour is the right call, how to route it through ADR-0004 / ADR-0011.

## Read this first: which code was reviewed

**Snapshot: commit `dd56e8ae`** (`main`, 2026-08-26). This review ran on a checkout of `main`, which was
444 commits behind the live line at the time. Since the snapshot, the audited scope (`apps/worker/src/jobs`,
`packages/prompts-llm/src`, `packages/story-validation/src/scoring`) has changed by **162 files,
+21,529 / −798 lines, 93 new files** — mostly the Agent 9 v2 engine. `agent9-run.ts` is now 8,827 lines
(7,602 reviewed).

What that means for using these reports:

- Very little reviewed code was deleted, so **most findings should still apply** — but **line numbers have
  shifted**; search for the quoted code, not the line.
- **Some findings may already be fixed** (A_103 fixed defects from four other read-only audits in the same
  period). Re-check a finding against current code before acting on it.
- **The Agent 9 v2 engine was not reviewed.**

## Tracker

| Item | Status |
|---|---|
| Baseline: [RUBRIC.md](RUBRIC.md), [tools/](tools/), [data/](data/) | ✅ done |
| Area reports | ◑ **11 / 12** — area 02 (Agent 9 generation core) not written |
| Synthesis: cross-cutting themes, phased roadmap, verification protocol | ⬜ not started |

## Area reports

Each follows [RUBRIC.md](RUBRIC.md) §6: findings with priority (P1–P3), risk class (R0 mechanical ·
R1 behaviour-preserving · R2 behaviour change, owner decides) and effort. Findings marked
**confirmed** were re-checked against source by the coordinating reviewer.

| Area | Headline |
|---|---|
| [01 — Agent 9 worker](areas/01-agent9-worker.md) | `runAgent9` as a coordinator over ~14 phases (78 cross-phase bindings, six state objects). Confirmed: `cml.CAST` reads a key the CML does not have; 11 worker regens pass `beatSheet: []`. |
| 02 — Agent 9 generation core | **Not written.** `generateProse` (2,661 lines) was only partly covered, by areas 01, 03 and 05. |
| [03 — Agent 9 prompts](areas/03-agent9-prompts.md) | STORY TO DATE sits outside the budget (~59% of the chapter-10 prompt); stale block caps truncate pronoun rules 9–11 and the season lock in every prompt. |
| [04 — Agent 9 validation](areas/04-agent9-validation.md) | Typed issues flattened to strings and re-classified by regex (17 of 42 templates credited to the wrong gate); `lintBatchProse` is ~21 rules in one function. |
| [05 — Agent 9 repair & polish](areas/05-agent9-repair.md) | The polish prompt tells the model to cut the wording the validators require; the regen registry is read only by tests. |
| [06 — Agent 5 clues](areas/06-agent5-clues.md) | Confirmed: `agent5-run.ts:1971` holds literal backspace bytes, so the AM/PM guard never fires. Five diverged copies of the legal clue source paths. |
| [07 — Agents 6 & 6.5](areas/07-agent6-fairplay-worldbuilder.md) | Retry feedback ignores the failure in both agents; confirmed: Agent 6.5's `_retryFeedback` is unused. |
| [08 — Agents 7 & 7.5](areas/08-agent7-narrative-geometry.md) | Agent 7's case summary never received Agent 6's CML 2.0 fixes ("Victim: Unknown" in all 125 archived prompts); S7's blocker is gone. |
| [09 — Agents 3, 3b & 4](areas/09-agent3-cml-agent4-revision.md) | Two CML normalisers disagree on 23 of 25 fields; confirmed: Agent 3 still falls back to `"Poisoned tea."`. |
| [10 — Agents 1, 2–2e & 8](areas/10-agents1-2-8-context.md) | Detective/victim identity checked in 5+ places; confirmed: `agent2c-run.ts:79` uses `/s+/g` for `/\s+/g`. |
| [11 — Orchestration & shared](areas/11-orchestration-shared.md) | The call→parse→retry→score→persist skeleton exists as 14 hand-written variants; `executeAgentWithRetry` swallows its own abort. |
| [12 — Scoring layer](areas/12-scoring-layer.md) | The default scorers grade adapter-padded data (A in 36/36 golden cells); the honest scorers sit behind `HONEST_SCORERS=off`. Confirmed: FLAG-AUDIT has `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY`'s default wrong. |

## Baseline data (MEASURED on the snapshot)

[metrics](data/metrics.md) · [scoring metrics](data/metrics-scoring.md) · [coverage](data/coverage.md) ·
[duplication](data/duplication.md) · [export usage](data/export-usage.md) · [history](data/history.md).
Re-run [tools/](tools/) against current code before quoting a number.
