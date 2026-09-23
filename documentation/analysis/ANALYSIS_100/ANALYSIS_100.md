# ANALYSIS_100 — Recombinant skeletons: implementation record

**Started 2026-09-18. Cost granted by the owner. Design: WP-004 (gene map) and the recombination
method described in the 2026-09-18 conversation, recorded here in §1 so this document stands alone.**

This is a task document. Status lives in the table below and is updated in the same commit as the
code it describes (CLAUDE.md, *Long tasks*). Resume from the first row that is not `done`.

## STATUS

| # | item | state | commit | note |
|---|---|---|---|---|
| A2 | encode the 110 held works, intent tranche first | done | fd74d62d (artifacts) | 99 attempts · 81 valid cases · £11.83; library 132 verified cases + 18 rejected encodes of 169 works (A_103 B46) |
| A0 | this record | done | — | |
| B1 | `scripts/corpus-parts.mjs` → `library/index/parts.json` | done | fd74d62d | 137 cases · 957 steps · 274 herrings · 137 false solutions; chapter denominators from text headings, 102/137 (35 short stories have none) |
| B2 | part-type vocabulary (LLM-typed, batched) → `library/index/part-types.json` | done | (A_103 second pass) | flaw 135/137 into 14 types (1 refused by the content filter even alone), herring 274/274 into 14, step 957/957 into 14 (top: deception_and_fabrication 218, motive_and_responsibility 172, method_explanation 128); cumulative £0.0716. Failed twice on the step proposal first - A_103 B43 (truncated JSON parsed) and B47 (sample defined as a stride grew to 192 with the encode) |
| A1 | ranked exemplar selection, `SEED_SELECTION_RANKED` | done | fd74d62d | flag off pinned byte-identical; 6 tests; memo key carries mode + source; FLAG-AUDIT row; A_103 B4 found the production call shape inert and fixed it |
| B3 | grammar fit: PMI, transitions, positions → `library/index/grammar.json` | pending | | |
| B4 | falsifier: dispersion of our last 20 shipped runs vs the canon | pending | | **gate** for phase C |
| A3 | ledger backfill (97 runs) | pending | | ~£0.29 |
| C1 | `scheduleSkeleton()` — sample a novel-as-whole, pairwise-attested tuple | pending | | after B4 |
| C2 | `NOVELTY_SKELETON` flag; `noveltyConstraints.skeleton`; Agent 3 render as constraint | pending | | never as an example (A_67) |
| C3 | surprisal-band novelty telemetry beside Agent 8 (shadow) | pending | | |
| C4 | tests, FLAG-AUDIT rows, `flags:check` | pending | | |
| C5 | one run with the flag on; verify by prompt label; extract and check | pending | | ~£1.15 |
| D | refit B2/B3 on the full encode; regenerate map/manifest/cells | pending | | after A2 |

## §1 The method, in one place

Each encoded case yields ~10 typed **parts**: a 7-step inference chain (`observation → correction →
effect`), 2 red herrings (`innocent_explanation`, `resolved_in_chapter`), 1 false solution
(`the_one_flaw`, `refuted_in_chapter`), the test method, axis, family. MEASURED at 56 cases: 390
steps, 112 herrings, 56 false solutions; timing present on 56/56 and 112/112; constraint space 0/56.

Learn a **type vocabulary** for steps, herrings and flaws. Over the corpus estimate **PMI** between
part-types, **transition probabilities** along the chain, and the **position distribution** of the
false solution and herrings (chapter / chapter_count). A **skeleton** is a tuple of part-types that
(1) occurs as a whole in no encoded case and no shipped run, and (2) has every adjacent pair
attested (PMI > 0, transition P > 0). Novelty of any case = surprisal under the fitted model.

Only types and positions cross into a prompt, as a **constraint**, never as an example. Anti-copy
gate unchanged.

## §2 Findings (filled as items land)

- **Positions are real.** Of 36 novels whose text has ≥ 3 chapter headings, 36/36 have every
  `*_in_chapter` integer within the heading count. The false solution is refuted at **median 0.76** of
  the book (p10 0.25, p90 1.00). Story collections index stories, not chapters — excluded from positions.
- **The exemplar selection was an allowlist.** `filter(axis).slice(0,3)` over a sorted pool: identity's
  19 cases had only ever shown the alphabetically first three. Fixed behind `SEED_SELECTION_RANKED`.
- **Azure's content filter is a batch-size limit here.** 118 herring explanations in one prompt pass;
  ~137 inference steps ("X was killed by Y" at density) trip the policy. Split-and-retry, not a rewrite.
- **`constraint_space` is empty in 57/57 encoded cases** — requested by the encoder, never filled.
- **33 of 45 run directories carry an Agent 3 response** the falsifier can type (`_resume` dirs do not).
