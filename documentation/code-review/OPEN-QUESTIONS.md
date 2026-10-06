# What the refactoring needs from the owner (2026-10-02)

**2026-10-06: none remain — 401 of 401 ledger items are closed** (decision 2 flipped on the graded archive, ANALYSIS_111 §2.2). The text below is the record as of 2026-10-02. **Every buildable item is built.** The ledger figure is the README's first line. The 34 that remained then could not be closed by code
alone: 15 are owner questions (each now with a recommendation, §1), 5 wait on a flag flip or a paid read, and 14 are deferred with reasons.

## 1. Decisions — recommended 2026-10-02, BUILT the same day (`a2a0615c`)

The owner said "carry on"; every row below is built as recommended. A5-15 / A5-Q07 stay open only for their timing:
promotion to the prompt waits on the A7-Q05 read.

None had a recommendation on record. A read-only research pass (~191k tokens, 96 tool uses) measured each against the
archive (`data/store.json` 66 projects with clues / 69 CMLs, its backup, ~80 runs of `logs/llm.jsonl`,
`apps/worker/logs/scoring.jsonl` 1,588 rows); every negative is checked against a known positive.

| Item | Recommendation | Evidence (MEASURED unless marked) | Cost |
|---|---|---|---|
| A6-Q01 | **Retire Agent 6's LLM-retry arm**, as decision 7 retired the phase-score path. | It ran in **0 of 70** runs with an Agent 6 audit (none of its own warnings anywhere; call-order probe finds re-runs, not the arm). ~600 lines (INFERRED). If ON it would fire on ~4% (3 of 83 audits failed). Retiring also closes A6-16, A6-Q03 and the arm's half of A6-02/A6-03/A34-D09. | Free — default path untouched |
| A7-Q04 | **Act 2.** | It is the default at 3 of 4 sites (`clue-pacing.ts:466`, `scheduler.ts:207`, `beat-scheduler/collect.ts:90`); act 3 at `clue-pacing.ts:171` contradicts the prompt's own rule that essential clues are early/mid. **0 of 3,530** archived clues lack a placement — moot in practice. | Free — 0 archived clues change |
| A5-Q04 | **A targeted red-herring-only call, placed after separation.** | The question is recorded two ways (LEDGER "before", here "after"); the evidence says neither: red herrings are lost to deterministic pruning (`separateRedHerringsFromSolution`), not to the model — 6 of 61 projects since 2026-08-03 shipped 0 red herrings while the model had returned 2; the floor itself fired 0 times. | Prompt change on ~10% of runs — flag OFF + probe |
| A5-12 | **Delete the memos; compute fresh.** | They save milliseconds against a ~30 s call (the area review); invalidation is manual and was missed on the remap path (A5-D06). "Derive once" is impossible — the first prompt needs the contract before the mutations. Remap fired 0 times (known positive: a neighbouring warning 16). | Ship with A5-D06 under `CML_VERIFIED_FIXES` |
| A5-15 / A5-Q07 | **After the A7-Q05 read: promote `@cml/clue-spec` behind a flag, one matched pair.** Meanwhile the shadow line also reports required slots no shipped clue covers. | Still shadow-only. Over 69 CMLs its slot count equals the checklist's in 7, is longer in 58; category disagrees on 187 of 566 per-step slots (two `inferCategory` bodies); placement agrees 566/566. | Prompt change on ~90% of runs — flag + pair |
| A1X-Q02 | **Score the shipped artifact.** | The report should describe what ships; Agent 5 already does; since decision 7 no score drives a retry. Post-processing rarely changes anything (Agent 1 re-rolled in 1 of 78 runs). | Free — report numbers only |
| A1X-Q04 | **Pin 2d's month/year to `generateSpecificDate`; key it on the SOURCE run's id on resume.** | The model matched the mandate in **66 of 66** calls (known positive: cross-run comparison differs 50/58); 0 of 45 resumes re-ran 2d. Mostly moot; closes the `RESUME_REDO` re-dating risk. | Free — fresh runs byte-identical |
| SCO-D12 | **Mark a skipped novelty audit N/A and exclude it from the mean.** | A skipped check reporting A is a report that lies; decision 8 did the same for "scoring off". `.env.local` threshold 1.0 is the skip condition; ~17 of 80 runs skipped (INFERRED). | Free — report numbers only |
| SCO-Q03 | **Delete the strict / lenient modes and the `agent4-hard-logic` key; keep `agent9-prose`.** | The only production constructor hard-codes "standard"; no config ever selected another. `agent9-prose` is still emitted at 3 sites (`pipeline/abort.ts:98`) — the "stale keys" premise was half wrong. | Free |
| SCO-Q07 | **Honest tables for 2b, 2d, 6.5 (~90 lines each); keep Agent 9's phase score.** | 6.5 scored 100 in 72 of 72 runs, 2d ≥95 in 72/72, 2b ≥94 in 72/72 — never discriminating. Agent 9 ranges 60–100 and carries the headline cap. Net ~−750 lines. | Free — report numbers only |
| ORC-Q02 (+ORC-D02) | **Yes — the offline replay adopts `runRubricScoring`, and records which path scored.** | Nothing to stay comparable with: `eval/golden/baseline.json` does not exist; the judge model is already the same in practice (both gpt-4.1-mini); the real difference is the verifiers and `noResolution`. | Free — offline scores only |
| A7-10 | **json-schema-to-ts (`FromSchema`, type-only) with ajv as the boundary parser.** | Already installed (via `@anthropic-ai/sdk`, undeclared); ajv is a dependency of 5 packages; the schemas are JSON Schema; zod is not installed anywhere. | Free — types only |

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
