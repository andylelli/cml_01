# ANALYSIS_103 — Bug hunt over the corpus stream: fifty defects, recent changes first

**Started 2026-09-23; closed the same day. MEASURED from the table: 68 rows (numbered to 88 - a number was assigned when a candidate was listed, and 20 never earned a row), 61 fixed, 5 withdrawn, 2 deferred. £0.07 spent (part-types reruns).** Scope, in order: the corpus scripts and
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
| 5 | `seed-loader.ts` libraryRoot | `[\/]+$` lost its backslash; trailing-backslash hint -> 0 cases | any caller passing a Windows path with a trailing separator | fixed (the probe that kept saying 0 afterwards was itself collapsing `\\` - §4) | fd74d62d |
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
| 29 | `scripts/corpus-verify.mjs` TEXT_ALIAS | 3 slugs mapped to text names that do not exist | alias removed; the 3 STILL cannot be recomputed — they have no `encode-raw.json` (August pilot). Re-encode is the only route | fixed (path); works deferred | G1 |
| 42 | `scripts/corpus-verify.mjs` work loop | `.verification.json` iterated as a work | one bogus "cannot recompute" row per run | fixed | ff760927 |
| 43 | `scripts/corpus-part-types.mjs` ask() | truncated reply (finish=length) JSON.parsed -> SyntaxError ends the run | B2 step stage died at position 5429 | fixed (retry to 2x, capped; `--kinds` rerun keeps prior kinds) - the retry alone was NOT enough, see 47 | ff760927 |
| 44 | `scripts/corpus-part-types.mjs` | one flaw refused by the content filter even alone (`the_case_of_oscar_brodski#fs`) | 1 of 137; recorded in `filtered`, not silently dropped | withdrawn (working as designed) | - |
| 45 | `scripts/corpus-verify.mjs` | "no encode-raw.json - cannot recompute" for works never encoded AND for encoded works missing their raw | 19 rows, 14 noise hiding 5 real (August pilot: a_jury_of_her_peers, oscar_brodski, twisted_candle, fenchurch_street, invisible_man) | fixed (5 named; 14 one count) | ff760927 |
| 46 | `scripts/corpus-verify.mjs` | a raw encode REJECTED at adjudication (raw + report + adjudication, no case) printed exactly like a work | 18 of 150 coverage rows were not works in the corpus | fixed (marked + counted) | ff760927 |
| 47 | `scripts/corpus-part-types.mjs` propose sample | "every fifth step" was 80 of 397 when written, 192 of 957 after A_100 A2; at 192 the model never closed the JSON at 1.2k/2.4k/4.8k/9.6k tokens (a type per instance) | B2 step stage failed twice, ~£0.02 | fixed (sample to a COUNT of 80) | ff760927 |
| 48 | `scripts/corpus-verify.mjs` --write | `verified_on: "2026-08-31"` literal | 150 of 150 reports carry it, including files rewritten 2026-09-23 | fixed (today's date) | ff760927 |
| 17 | `scripts/corpus-parts.mjs` positions | hypothesis: chapter position divides by a null chapter_count -> NaN | MEASURED: no position field is stored (35 of 137 have chapter_count null; 0 NaN/Infinity in the file) | withdrawn | - |
| 18 | `scripts/corpus-cells.mjs` richness line | hypothesis: `+null` when encodes_for_80pct is null | prints `+110 / +178` | withdrawn | - |
| 49 | `scripts/corpus-parts.mjs` chapterCount | a table of contents doubled the heading count | 26 of 102 counts inflated (room_13 66 for 33, the_crimson_circle 86 for 43); every `*_in_chapter` integer had been checked against the inflated denominator | fixed (three cuts, see §4; 24 counts corrected, 0 integers above their count) | ff760927 |
| 50 | `corpus-encode.mjs`:453 + `corpus-verify.mjs`:85 anchor matcher | case-sensitive; a sentence-initial capital the model dropped scored "not in text" | 224 of 1,022 recorded misses; recomputed with `--write`: 1,959 -> 2,183 anchors located, 106 reports were stale, 8 of 17 gate-failed works pass | fixed (exact first, folded second) | ff760927 |
| 51 | `corpus-encode.mjs`:469 `new RegExp(surname)` | the contract asks for `Real Name (Alias)`; `Edwards)` threw AFTER three paid passes and before case, report and ledger were written | 11 encodes lost in the 2026-09-18 batch; 12 of 150 raws throw, 0 after escaping | fixed | ff760927 |
| 52 | `corpus-sync-fingerprints.mjs`:185 evidence gate | ran only on works that ALSO had a fingerprint | 81 cased works ungated, 28 failing the published rule, none in `.verification.json` - the exemplar loader (which skips only `failed`) served them to Agent 3. Now 137 works judged: 108 derived, 5 unverified, 24 failed | fixed | ff760927 |
| 53 | `corpus-manifest.mjs`:84 `encoding: verified` | meant "has case.cml2.yaml", never read the gate | 17 gate-failed works listed verified (45 after regen); manifest now 113 verified + 4 legacy + 24 failed + 28 awaiting | fixed | ff760927 |
| 54 | `corpus-encode.mjs`:301 raw persisted before adjudication | adjudication and repair mutate `data` in memory; raw never rewritten; `corpus-repair.mjs` works from the raw | 17 of 132 raws differ from their case (7 mechanisms, 11 false assumptions, 2 victims) | fixed (rewritten after adjudication and after repair; not yet exercised by a paid encode) | ff760927 |
| 55 | `corpus-encode.mjs`:238 crash banking | `!ledger.runs.some(slug)` is true for every re-encode, so a re-encode that crashed was never charged | 17 slugs with >1 run; every aborted row is a first run, which the defect predicts | fixed (`banked` flag) - INFERRED | ff760927 |
| 56 | `corpus-survey.mjs`:159 author regex | required a birth year; Gutenberg's `-1946` (unknown birth) lost the death year, row dropped as `no_death_year` | 3 UK-green rows (Barbour x2, Tracy) | fixed | ff760927 |
| 57 | `corpus-sync-fingerprints.mjs`:133 mtime heuristic | a later REJECTED re-encode (raw newer than case, rejected report to `.rejected.json`) demotes a valid work | 0 today; certain on the next rejected re-encode | fixed (mtime test only when the report does not say `case_written`) | ff760927 |
| 58 | `corpus-coverage.mjs`:64 gap table | counted 56 fingerprinted works under a `137 encoded` header and prescribed paid encodes for a free classify gap | 81 works | fixed (`encoded_unclassified`, says so) | ff760927 |
| 59 | `corpus-encode.mjs`:74, `corpus-encode-all.mjs`:28 `--budget` | header advertised `--budget 5.00`/`--text <path>`; only `=` forms parsed; `--budget=abc` -> NaN, a guard that never fires | every hand-typed invocation | fixed (usage error, exit 2, both scripts) | ff760927 |
| 60 | `corpus-survey.mjs`:81 upper-bound clearance | `death+5` substituted for a missing publication year and called green; acquire and clearance-check refuse the row | 30 of 349 green candidates dead on arrival | fixed (own bucket `green_by_bound`; the bound stays an estimate, never a holding verdict) | ff760927 |
| 61 | `packages/novelty/src/types.ts`:33, `extractor.ts`:29, `novelty-dispersion.ts` FAMILY_RULES | 14 families where the schema and the scheduler have 16 | a shipped `role_invisibility`/`investigative_blind_spot` run was filed `unclassified`, its cell never gained depth, and the walk LOCKED on it: 8 of 8 consecutive picks. After: picks rotate | fixed (three copies; fourth instance of the B1 hole) | (this) |
| 62 | `scripts/schedule-run.mjs`:69 | the only WRITER of a scheduled cell called `scheduleCell(records)` with no corpus, and never loaded the env the flag lives in | NOVELTY_CELL_SCHEDULER_CORPUS changed the shadow log and never a run, since A_79 C | fixed (corpus passed; `.env.local`/`.env` loaded) | (this) |
| 63 | `apps/api/src/server.ts`:96 `/api/samples` | `verified` = case.cml2.yaml exists | 17 gate-failed works served as verified; after: 108 verified / 5 unverified / 24 failed / 4 legacy, 0 leaks | fixed | (this) |
| 64 | `cell-scheduler.ts`:258 testShape | `usedShapes` is always empty so the shape is always `physical_trace`, and the directive ordered it as non-negotiable | one value across a 12-run walk; every scheduled run got the same test-shape obligation | fixed (clause removed from the prompt; coordinate kept on the cell) | (this) |
| 65 | `prose-guard/src/anti-copy.ts`:313 | one try around the loop: the first unreadable entry dropped every later text, warning said "no source texts" | a.txt / dir b.txt / c.txt -> index [a], lift of c passed the HARD gate | fixed (per file; warning names the skipped) | (this) |
| 66 | `packages/novelty/src/loader.ts`:116 | cross-corpus de-dupe fired WITHIN the seed corpus | `the_mystery_of_a_hansom_cab` dropped from every reference corpus; after: present, 58 entries | fixed | (this) |
| 67 | `InspirationView.vue`, `api.ts` | `state`, `encoded`, `legacy` received, none rendered; empty-state copy said "Generate a mystery and it will appear here" (nothing generated reaches `/api/samples`) | every Archive visit | fixed (badge, subtitle, copy) | (this) |
| 68 | `agent3-direct-llm-check-harness.ts`:263 axis | read `meta.primary_axis`, a field no CML carries (0 of 64) -> `temporal` always | EVERY harness run to date - the whole A_102 §6/§7 series (0 of 3 -> 6 of 8) ran on `temporal` against an `authority` project | fixed (`false_assumption.type`, normalised, or throw) - premise change, see §2 | (this) |
| 69 | harness:262 theme | read `meta.theme` (never present) -> no-theme branch; families, modes and tone differed from production | same 16 runs; the project's 60-word theme never reached the prompt | fixed (`--theme` required, says where to copy it from) | (this) |
| 70 | harness:102 `--temperature`, :298 `--model` | temperature parsed and never used; model overridden by the deployment env var Agent 3 reads | any A/B passing either measured the config value | fixed (temperature refused with the reason; model applied through the env Agent 3 reads) | (this) |
| 71 | harness:155,173 + `proves-what.mjs`:50 classifier | raw substring: "rope" in "proper", "iron" in "environment", "Eve" in "Everard" | three fixtures all PROVES THE ACT; 0 flips on the current 59-case archive | fixed (whole words, both copies) | (this) |
| 72 | `proves-what.mjs` vs harness | two copies of the classifier, already diverged (STOP list two words short) | both feed a published percentage | fixed (classifier exported from the harness, main guarded, script imports it) | (this) |
| 73 | `WorkshopView.vue`:233 | dashboard block gated on the `project` tab, removed in e8f86c9a | Setting overview, Cast, Clue board, Outline, Story, Fair-play, game-pack download could never render; "View details below" scrolled to nothing | fixed (INFERRED - no mount test could run out-of-tree) | (this) |
| 74 | `App.vue`:113 | the COMPOSED theme was written back into the wizard's spec | every second generation and every reload doubled each flavour sentence ("The motive turns on jealousy." x2); the theme box showed machine text | fixed (raw theme kept; composed one travels only in the request; restore skips it) | (this) |
| 75 | `useWorkshopState.ts`:735 | Inspect fetched 200 entries of EVERY project when none was open | another project's costs and models under "LLM log entries" | fixed | (this) |
| 76 | `useWorkshopState.ts`:829, :1044 | project load spread a stored spec into the singleton with no repair (`setSpec` had zero callers); Workshop Generate had no axis pre-flight | an unknown axis rendered a blank select and threw after the run row existed (X60) | fixed | (this) |
| 77 | `GeneratePanel.vue`:89 | batch size 1-5 offered; worker clamps to 2 silently | 3, 4, 5 all ran as 2 | fixed (max 2, hint says so) | (this) |
| 78 | `server.ts`:2031 `/api/llm-logs` limit | `Number("abc")` -> NaN -> `entries.length < NaN` false -> `{entries: []}` 200 | `?limit=abc`, repeated `limit` | fixed (non-number = default) | (this) |
| 79 | `server.ts`:2048 window boundary | a record COMPLETE at the boundary dropped with the fragment | one record, only when the whole 32 MB window is needed | fixed (one byte before the window read) | (this) |
| 80 | `App.vue`:126 | nav and case-file header said "New case" while My Cases said "1930s · CountryHouse" | the 40 minutes of every run started from Create | fixed (one name, computed one way) | (this) |
| 81 | `projectStore.ts`:113 normalizeSetting | read `payload.era`; the artifact is `{ setting: { era, ... } }` | 0 of 87 stored settings flat: every field undefined, `settingReady` satisfied by an empty object | fixed (nested block first) | (this) |
| 82 | `useWorkshopState.ts`:4-22 | 15 `.vue` component imports in a composable, none used | dead weight; found by counting uses outside the import line (the first count included the import path - §4) | fixed | (this) |
| 83 | `ProjectPanel.vue`:38 | copy sent readers to Review and Advanced tabs that no longer exist | every Workshop visit | fixed (Build / Inspect) | (this) |
| 84 | `server.ts`:957 composeThemeWithAngle | angle glued onto the default theme without a full stop; the test certified it | every UI run with an angle and no theme (4 of 4 live angle specs) | fixed (test updated) | (this) |
| 85 | `vocabulary.ts`:182 humourLevel | the wizard always sent `classic`; the resolver returns an explicit band before consulting AGENT2B_BAND_BY_AXIS | the flag could never fire for a UI run | fixed (`auto` = not chosen; API drops it; 3 tests updated) | (this) |
| 86 | `agent3-cml.ts`:356 `skeletonSourceSlug` | no producer; the A_100 A1 must-include ranking cannot fire | none today | deferred - by design until A_100 C1 sets it | - |
| 87 | `useWorkshopState.ts` `castNamesInput`/`handleSuggestTheme`/`themeSuggestions`, `spoilers.ts` `partitionProfile` | exported and unconsumed since 3a6b76df | dead weight | deferred - exported symbols; removal needs a consumer audit across tests | - |
| 88 | harness:108 `--axis` unvalidated | an unknown value flowed into the prompt as-is | a typo cost a paid call | fixed with 68 (normalised or throw) | (this) |
| 34 | `scripts/corpus-cells.mjs` ledger families | values outside the enum (`unclassified` x3) made keys no cell owns | counted under `ledger_runs_with_family` (37), shown nowhere; now 34 + `ledger_family_out_of_enum: {unclassified: 3}` | fixed | ff760927 |
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


- **Verify's 150 coverage rows were 132 works plus 18 rejected encodes.** A raw encode whose case
  failed adjudication keeps its raw, report and adjudication on disk and printed exactly like a work;
  the corpus holds 132 verified cases, not 150. Every report also carried `verified_on: 2026-08-31`,
  the day the script was written, including the ones rewritten today.
- **The truncation retry was not the fix for the step stage.** Doubling the token budget four times
  never closed the JSON: the proposal sample had grown from 80 to 192 instances with the encode, and
  the model answered with a type per instance. A sample defined as a stride is a restated fact about
  the corpus size; defined as a count it cannot drift.

- **Every Agent 3 harness run to date ran on the wrong axis with no theme.** The harness read
  `meta.primary_axis` and `meta.theme`, fields no persisted CML carries (0 of 64), defaulted to
  `temporal` and the no-theme branch, and built every request that way - against project
  `canary_1789577884303` (seed 50862), whose run-params say `primaryAxis: authority` with a 60-word
  theme. The A_102 §6/§7 series - the 0 of 3 baseline, the four drafts, the "6 of 8" that
  PLAN-TO-90 §32 reports - measured the requirement under a different axis, family set, mode set and
  tone from production. §32's paid run failing its predictions is consistent with that. The number
  must be re-measured before it is treated as evidence (A_102 and PLAN-TO-90 carry the correction).
- **Verify's 150 coverage rows were 132 works plus 18 rejected encodes, and 11 of those 18 were
  rejected by a crash, not by adjudication.** `new RegExp("Edwards)")` threw after three paid
  passes; the contract itself asks for `Real Name (Alias)`. The £ spent on those 11 was real, the
  cases are on disk as raw, and `corpus-repair.mjs` can now build them.
- **The evidence gate had judged 56 of 137 cases, and the exemplar loader served the other 81 as
  if they had passed.** 28 of them fail the published rule. After the case-fold fix and the
  every-case gate: 108 derived, 5 unverified, 24 failed - and the Archive, the manifest and the
  loader now agree on those numbers, where before each had its own.
- **The novelty vocabulary had the same 14-of-16 hole as the classify script (B1), in three more
  places** - the `MechanismFamily` union, the extractor's list and the ledger classifier's rules.
  Effect on the scheduler: once the twelve recordable families had all been used, the walk picked
  `role_invisibility` eight times in a row, because the ledger filed each one as `unclassified`
  and the cell never gained depth. Fifth paid occurrence of a closed vocabulary deciding a pass.
- **The Create wizard doubled its own theme.** The composed theme (lead + flavour sentences) was
  written back into the shared spec, so the second Generate composed on top of the first:
  "The motive turns on jealousy. The victim is a wealthy patriarch." twice, and Agent 3b's
  substring matchers read that string. Every second run and every run after a reload.

## §3 Groups and commits

| group | files | commit |
|---|---|---|
| G1 corpus scripts (mine) | survey · acquire · clearance · manifest · cells · coverage · parts · part-types | fd74d62d |
| G2 pipeline scripts (pre-existing) | classify · derive · encode · encode-all · verify · sync | fd74d62d |
| G3 packages | prose-guard anti-copy · prompts-llm seed-loader/agent3 · novelty test | fd74d62d |
| G4 api/web | server samples · InspirationView · api.ts | fd74d62d |
| G1b second pass (mine) | verify 42/45/46/48 · cells 34 · part-types 43/47 · parts 49 · survey 60 | ff760927 |
| G2b pipeline scripts (audit) | encode 50/51/54/55/59 · verify 50 · sync 52/57 · manifest 53 · survey 56 · coverage 58 · encode-all 59 | ff760927 |
| G3b packages + worker (audit) | novelty types/extractor/loader 61/66 · dispersion 61 · scheduler 64 · schedule-run 62 · anti-copy 65 · harness 68-72/88 · proves-what 72 | (this) |
| G4b api + web (audit) | server 63/78/79/84/85 · web 67/73-77/80-83/85 | (this) |

## §4 Probe defects (claims about the probe, not the code)

- **B5's probe reported 0 cases for a trailing-backslash hint after the fix, for two rounds.** The probe
  was written through a bash heredoc; `"C:\\CML\\library\\works\\"` reached node as `"C:CMLlibraryworks\\"`.
  The vitest pin (which writes no heredoc) passed throughout. Fourth paid occurrence of the shape
  CLAUDE.md already names; the probe now lives in a file.
- **B17's first probe measured the wrong shape.** It looked for `position` on the 137 case items; the
  herrings and false solutions carry a `chapter`, never a normalised position. A second probe over the
  right objects found nothing to divide, and the row was withdrawn on that measurement, not the first.
- **B45's first comment restated a count from a different denominator** (37, from a directory probe) where
  the script's own loop sees 19. Corrected to the measured figure before commit.
- **The chapter counter took three cuts, each measured.** Cut 1 (a body must follow) nulled six
  contents-only novels; cut 2 (room on both sides) read 44 for 43 and one short on those six; cut 3
  tells the heading that closes a contents run apart by its NUMERAL (a first chapter is I, 1 or
  One). Only cut 3 leaves 0 of 137 cases with an integer above its count. The first cut would have
  shipped had the six not been looked at by name.
- **B82's first use-count counted the import path.** `ExportPanel` appears twice on its own import
  line; a regex count of 2 read as "used". The count that means anything excludes the import line.
- **probe-misc (b) cannot verify B62** - it simulates the script's OLD call shape rather than running
  the script. `node scripts/schedule-run.mjs --dry` is the instrument, and it exposed a second
  defect (the script never loaded the env the flag lives in) that the first fix alone left standing.
- **probe-scheduler2 files `locked_room_timing` picks as `locked_room_key`.** A property of the
  probe's synthetic premise (it names a key), not of the classifier's order; recorded, not acted on.
- **Every heredoc in this analysis that carried a backslash collapsed it** - the B5 probe, one
  patch-splitting script - and every one was caught only because the result was looked at. Patch
  files were written with the editor, never a heredoc, from the second occurrence on.
