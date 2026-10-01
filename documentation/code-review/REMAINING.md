# The items outside decision 12 — audit and plan (2026-10-01)

A read-only agent re-checked the 64 open ledger items outside decision 12 against current src (~231k tokens, 106 tool
uses). **12 moot, 26 behaviour-preserving (R0/R1), 11 behaviour changes, 15 owner questions.**

**Correction found:** the ledger's "still applies after the v1 deletion" note (written in this programme) was wrong for
five of the six Agent 9 items — A9W-05, A9P-05, A9R-02, A9R-05, A9R-D02 describe deleted v1 code. All 12 moot items are
withdrawn with their evidence in the ledger.

## Plan

1. **R0/R1, small first:** A6-19, A5-14 + ORC-13 (one clue-id module), ORC-15, A7-14, ORC-08 (two importer-less
   modules), A1X-08, SCO-D10, A34-11 (type), SCO-Q03 (stale threshold keys only), A1X-07.
2. **R0/R1, medium:** A6-10 + A7-03 (one CML prompt view, byte-equal), A6-11, A5-09, A7-09 (section builders behind byte
   snapshots), A5-04 / A6-18 / A7-04 (typed case view), A9V-04 (one clue-term matcher, today's policies), A5-06
   (typed gate errors, today's labels), A34-03 (registry to @cml/cml), A1X-09 / ORC-03 (per-call cost), A1X-12, SCO-03.
3. **Behaviour changes:** into the `CML_VERIFIED_FIXES` batch where they are verified defects (A5-D06, A5-D07, A7-07,
   A7-D04); wait for decision 2's flip (A34-02, A1X-01, A6-07, A6-D04, A6-D07); A7-02 step 2; A34-D09 waits on A6-Q01.
4. **Owner questions with no recommendation:** listed in the final report, not decided here.

## STATUS

| Item | Class | Status | Commit | Note |
|---|---|---|---|---|
| A6-19 | a | todo | | rubric-score's DEATH_METHOD_TOKENS imported, not copied |
| A5-14 | a | todo | | one CLUE_ID_RE + escape helper |
| ORC-13 | a | todo | | clue-id ×5, grade ladder ×3, simpleHash ×4 |
| ORC-15 | a | todo | | type three context fields |
| A7-14 | a | todo | | drop three casts in agent75-run |
| ORC-08 | a | todo | | delete two importer-less modules |
| A1X-08 | a | todo | | one month→season body |
| SCO-D10 | a | todo | | web report type mirrors the real one |
| A34-11 | a | todo | | discriminated revision result |
| SCO-Q03 | a/c | todo | | stale threshold keys (a); modes (c) |
| A1X-07 | a | todo | | unreachable fallback |
| A6-10 | a | todo | | with A7-03 |
| A7-03 | a | todo | | CaseBrief, byte-equal |
| A6-11 | a | todo | | |
| A5-09 | a | todo | | |
| A7-09 | a | todo | | |
| A5-04 | a | todo | | |
| A6-18 | a | todo | | |
| A7-04 | a | todo | | |
| A9V-04 | a | todo | | |
| A5-06 | a | todo | | |
| A34-03 | a | todo | | |
| A1X-09 | a | todo | | with ORC-03 |
| ORC-03 | a | todo | | |
| A1X-12 | a | todo | | |
| SCO-03 | a | todo | | |
| A5-D06 | b | todo | | batch candidate |
| A5-D07 | b | todo | | batch candidate |
| A7-07 | b | todo | | reported number only |
| A7-D04 | b | todo | | reported number only |
| A7-02 | b | todo | | step 2 |
| A34-D09 | b | todo | | waits on A6-Q01 |
