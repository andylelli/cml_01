# History — growth and co-change

**MEASURED 2026-09-25** from full git history (406 commits on `claude/eloquent-hamilton-mqlnzq`,
first commit 2026-01-31). Commands at the end.

## 1. Growth of the largest agent files (lines, at the last commit on or before each date)

| date | `agent9-run.ts` | `generate.ts` | `agent5-run.ts` | `agent7-run.ts` | `agent6-run.ts` | `mystery-orchestrator.ts` | `prompt-builder.ts` | worker + prompts-llm source | test files (repo) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2026-03-01 | — | — | — | — | — | 3,491 | — | 12,273 | 31 |
| 2026-04-01 | 1,673 | — | 403 | 854 | 511 | 652 | — | 19,363 | 55 |
| 2026-05-01 | 2,568 | — | 2,290 | 1,124 | 1,513 | 878 | — | 27,419 | 68 |
| 2026-06-01 | 3,884 | 2,859 | 3,530 | 1,500 | 2,138 | 1,272 | 1,569 | 39,021 | 74 |
| 2026-07-01 | 5,594 | 4,317 | 4,043 | 1,927 | 2,386 | 1,468 | 2,187 | 53,945 | 155 |
| 2026-08-01 | 7,078 | 4,614 | 4,344 | 2,288 | 2,431 | 1,637 | 2,212 | 61,849 | 224 |
| 2026-08-15 | 7,422 | 4,614 | 4,356 | 2,423 | 2,532 | 1,919 | 2,231 | 65,485 | 251 |
| 2026-09-25 | 7,602 | 4,712 | 4,474 | 2,682 | 2,532 | 2,061 | 2,507 | 70,008 | 296 |

What it says:

- **The agent code grew 5.7× in six months** (12,273 → 70,008 lines of `apps/worker/src` +
  `packages/prompts-llm/src`, tests excluded). The orchestrator's early drop (3,491 → 652) is the
  per-agent extraction into `apps/worker/src/jobs/agents/`; everything after that is growth.
- **`agent9-run.ts` added ~1,000 lines a month from April to July.** S4's two tranches took it to
  6,814 in early August (REVIEW_03 §0h); it was back to 7,422 within two weeks and is 7,602 now.
  A split that is not protected by a guard loses to feature work.
- **Tests grew faster than code** (31 → 296 test files, ~10×). The safety net for a refactor is real.

## 2. Co-change: which files move together

214 non-merge commits touching `apps/worker/src/jobs`, `packages/prompts-llm/src` or
`packages/story-validation/src` (12 sweeping commits of more than 25 source files excluded). The
percentage is *of the first file's commits*, the share that also touched the second file.

| file (commits) | co-changes with | share |
|---|---|---:|
| `agents/agent9-run.ts` (75) | `prompts-llm/src/index.ts` | 37% |
| | `mystery-orchestrator.ts` | 31% |
| | `agent9-prose/regen-integration.ts` | 24% |
| | `agents/agent7-run.ts` | 21% |
| `prompts-llm/src/index.ts` (41) | `agents/agent9-run.ts` | **68%** |
| | `mystery-orchestrator.ts` | 46% |
| `mystery-orchestrator.ts` (47) | `agents/agent9-run.ts` | **49%** |
| | `agents/agent7-run.ts` | 36% |
| `agent9-prose/generate.ts` (25) | `agent9-prose/prompt-builder.ts` | 40% |
| | `agents/agent9-run.ts` | 36% |
| `agents/agent5-run.ts` (17) | `agent9-run.ts`, `mystery-orchestrator.ts` | 59% each |
| `agents/agent7-run.ts` (29) | `mystery-orchestrator.ts` | 59% |
| | `agents/agent9-run.ts` | 55% |

What it says:

- **The worker ⇄ `prompts-llm` boundary is not a boundary for change.** Two thirds of the edits to
  the package barrel come with an edit to `agent9-run.ts`: a new Agent 9 behaviour is typically written
  in the package, exported through `index.ts`, and wired in the worker — three files and a rebuild of
  `dist/` for one change. That is the concrete cost the S6 decision (REVIEW_03 §0j) has never been
  given.
- **The orchestrator changes with every large agent.** Half of its commits also touch `agent9-run.ts`
  and a third touch `agent7-run.ts`: stage-specific decisions live in the orchestrator, not behind the
  stage's own interface.

## Commands

```bash
# §1 — sizes at a date
h=$(git log --format=%H --before="2026-08-01 23:59" -1 HEAD); git show "$h:apps/worker/src/jobs/agents/agent9-run.ts" | wc -l

# §2 — co-change pairs
git log --no-merges --format='format:@@%h' --name-only -- apps/worker/src/jobs packages/prompts-llm/src packages/story-validation/src
# then count pairs of non-test .ts files per commit, skipping commits touching more than 25 of them
```
