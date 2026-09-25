# 01 — KEEP v1, USE v2

## The decision

**v2 becomes the engine the pipeline uses. v1 stays in the codebase unchanged, runnable with
`PROSE_ENGINE=v1`, as the reference engine every v2 change is measured against.**

## Why v2, on a tie

The engine pair on seed 23403 (A_108) read **v1 85, v2 84**. One read carries about ±3 marks, so the
headline is a tie. What separates the engines is where each one lost marks, and what each costs.

| | v1 | v2 | label |
|---|---|---|---|
| headline | 85 | 84 | MEASURED, one read each |
| clues | 8 | 7 | MEASURED |
| ending | 8 | 7 | MEASURED |
| prose | 7 | **8** | MEASURED |
| dialogue | 8 | 8 | MEASURED |
| pacing | 8 | 8 | MEASURED |
| words | 12,652 | 8,044 | MEASURED |
| prose-stage cost | most of $1.29 | about $0.30 | MEASURED (A_108 §0) |

**v1 lost its marks to its sentences; v2 lost its marks to its proof.** Prose has never reached 9 in
70 reads, and v2 is the first engine to earn an 8 in it on a matched pair. The proof, by contrast, is
a set of requirements this project already knows how to state as shapes: the means-link chain (A_102)
took v1 from clues 6.38 on average to 8. Porting a known shape into v2 is a smaller job than teaching
v1 to write differently, and every test of it costs a quarter of a v1 prose run. **INFERRED.**

## What "keep v1" means

- No v1 file is deleted or edited as part of this programme, except where a fix is shared by both
  engines (the case-level fixes in `04`).
- v1 remains the default in code; the switch is **configuration**: `PROSE_ENGINE=v2` in `.env.local`.
  That keeps a v1 run one environment variable away and keeps the flag audit honest.
- Every v2 lever is judged against the v1 read of the same case where one exists — seed 23403 has
  both, so it is the standing comparison.

## Configuration, P0

| variable | value | why |
|---|---|---|
| `PROSE_ENGINE` | `v2` | the decision |
| `AGENT9_V2_FILTER_SOFTEN` | `true` | the first v2 attempt on a stabbing wrote nothing: all three drafts refused `violence: medium`. v2 packs the case into one ~31,000-character brief at 24.9 violent words per 10k characters against v1's 13.0 (A_108 §2). The retry softens only on a refusal. |

## What v2 does not yet run

These v1 post-passes and checks have no v2 counterpart, and the plan has to decide each one rather
than assume it:

| v1 component | v2 status | decision |
|---|---|---|
| ship-check repetition (per 10k) | does not run on v2 | port the MEASUREMENT (it reads the manuscript, not the engine) before the first v2 read — the CLAUDE.md rule against reading a WORTH A LOOK book needs it |
| fallback-chapter detection | v2 has no deterministic fallback | nothing to port; v2 fails a draft instead |
| DT injector | not in v2 | leave out; the reader named injector lines five times (A_102 §14) |
| clearance ownership | v2 distributes clearances itself (`contract.ts:184`) | keep v2's |
