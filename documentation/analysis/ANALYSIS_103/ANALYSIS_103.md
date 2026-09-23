# ANALYSIS_103 — Bug hunt over the corpus stream: fifty defects, recent changes first

**Started 2026-09-23. £0 unless a row says otherwise.** Scope, in order: the corpus scripts and
package changes of 2026-09-17 → 09-19 (A_97, A_98, WP-003/004, A_100), then the pre-existing corpus
pipeline they call (`corpus-classify`, `corpus-derive`, `corpus-encode*`, `corpus-verify`,
`corpus-sync-fingerprints`), then the API/web edits. Each defect is **verified by running**, not by
reading — `fix-regresses-its-own-defect` records that every real bug in this project was caught by
execution and none by review.

This is a task document. Status lives in the ledger below and is updated in the same commit as each
fix (CLAUDE.md, *Long tasks*). Resume from the first row not `fixed` or `withdrawn`.

## LEDGER

| # | file:line | defect | reach (MEASURED) | state | commit |
|---|---|---|---|---|---|
| 1 | `scripts/corpus-classify.mjs` FAMILIES | 14-entry literal vs 16-entry schema: `role_invisibility`, `investigative_blind_spot` unassignable | classify could never emit 2 of 16 families; WP-003/004 reported their zero attestation as a genre fact | fixed | G2 |
| 2 | `scripts/corpus-derive.mjs` + `corpus-classify.mjs` DEVICE_FAMILY | same two families missing -> device family `null` | any work in those families would load no device pattern | fixed | G2 |
| 3 | `apps/api/src/server.ts` readProvenanceTitle | regex kept YAML escapes; `The \"Canary\" murder case` served to the Archive | every quoted title in the UI | fixed | G4 |
| 4 | `seed-loader.ts` selectRelevantPatterns | worksRoot omitted -> `libraryRoot("")` = cwd-relative; evidence unreadable; ranked pick silently alphabetical | flag ON did nothing in production shape (probe from `C:\`) | fixed | G3 |
| 5 | `seed-loader.ts` libraryRoot | `[\/]+$` lost its backslash; trailing-backslash hint -> 0 cases | any caller passing a Windows path with a trailing separator | fixed | G3 |
| 7 | `scripts/corpus-acquire.mjs` --top/--min-genre | bare flag -> `Number(true)` = 1 row, silently | probe: `--top` selected 1 of 349 | fixed | G1 |
| 8 | `scripts/corpus-acquire.mjs` --dry-run | overwrote `.acquire-report.json`; a waiter read 136 dry rows as acquired | live incident 2026-09-17 | fixed | G1 |
| 9 | `scripts/corpus-acquire.mjs` --id | missing --death/--pub -> `uk(d.NaN)` refusal | garbage reason instead of a usage error | fixed | G1 |
| 10 | `scripts/corpus-survey.mjs` slug dedupe | hypothesis: held slug + `_id` re-proposed | probe: 0 rows | withdrawn | - |
| 15 | `scripts/corpus-derive.mjs` family default | no rule matched -> silent `staged_scene` | 24 of 137 cases; 1 hits `will` as a verb | fixed (named + counted; classify mandatory) | G2 |
| 16 | `scripts/corpus-derive.mjs` TEST_SHAPE fallback | absent method -> `physical_trace`, the unreachable shape | a broken encode would read as the rarest form | fixed (modal default) | G2 |
| 24 | `apps/worker/.../agent9-run.ts` gate docstring | said default OFF, 204 manuscripts, n=10 | live gate is ON at n=11 over 229 | fixed | G4 |
| 25a | `scripts/corpus-part-types.mjs` | all-or-nothing write lost finished kinds on a later failure | ~£0.02 lost twice | fixed (per-kind write) | G1 |
| 25b | `scripts/corpus-part-types.mjs` | no handling of Azure content-filter 400; ~137 steps in one prompt trips it | B2 could not complete | fixed (split-and-retry to singletons + framing) | G1 |
| 26 | `seed-fingerprints.legacy.yaml` source: paths | stale `examples/` paths | nothing dereferences `source` | withdrawn (cosmetic) | - |
| 27 | `scripts/corpus-encode-all.mjs` --only | unknown slug silently dropped; `queue (0)` and exit 0 | a typo in a paid batch was invisible | fixed (warns; lists already-encoded) | G1 |
| 29 | `scripts/corpus-verify.mjs` TEXT_ALIAS | 3 slugs mapped to text names that do not exist | 3 works could never be re-verified | fixed (alias removed) | G1 |
| 34 | `scripts/corpus-cells.mjs` ledger families | values outside the enum (`unclassified` x3) silently ignored | 3 of 37 ledger families | candidate | |
| 41 | `scripts/corpus-classify.mjs` | no fingerprint -> paid call made, nothing written, no message | silent no-op if run before derive | fixed (says so) | G2 |

States: `candidate` (read, not yet run) · `confirmed` (probe reproduces it) · `fixed` (test or probe
pins the fix) · `withdrawn` (premise false — recorded, never deleted) · `deferred` (reason given).

## §1 Method

1. Read the file once, list candidates with a one-line hypothesis and the probe that would confirm.
2. Run the probe against a known-positive where the defect is a negative result.
3. Fix with a script (never by re-reading), pin with a test where the module has tests, re-run the
   touched package's suite, commit the group with the measurement in the message.

## §2 Findings that change a premise

- **Two of the three "zero-attestation" families were unassignable by construction.** `corpus-classify.mjs`
  carried a 14-entry family literal against a 16-entry schema. WP-003 §6.3 and WP-004 §6.3 read their
  absence as possibly a fact about the genre; it was a fact about a list. The only honest conclusion
  now is *unknown until re-classified*. (`information_leak`, the third, WAS assignable and is genuinely
  unattested.)
- **The ranked-selection fix reintroduced the defect it fixed.** With the production call shape the
  evidence root resolved relative to cwd, every score was 0, and the pick fell back to alphabetical
  order - the flag was on and inert. Caught by a probe run from `C:\`, not by the 21 passing tests,
  which all passed a root explicitly. The test that pins it now passes none.
- **Twenty-four of 137 derive fingerprints were filed `staged_scene` because no rule matched**, not
  because the trick was staged. Second-largest family in the map, and a quarter of it was a default.


## §3 Groups and commits

| group | files | commit |
|---|---|---|
| G1 corpus scripts (mine) | survey · acquire · clearance · manifest · cells · coverage · parts · part-types | |
| G2 pipeline scripts (pre-existing) | classify · derive · encode · encode-all · verify · sync | |
| G3 packages | prose-guard anti-copy · prompts-llm seed-loader/agent3 · novelty test | |
| G4 api/web | server samples · InspirationView · api.ts | |
