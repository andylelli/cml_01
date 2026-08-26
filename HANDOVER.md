# HANDOVER — 2026-08-26, end of the distinctiveness-engine session

**Read this first on the other laptop.** It is the standing handover file: overwrite it at the end of
each session rather than adding a new one, so there is never a question of which is current.

Branch: **`redesign/agent-blue-sky`** (live). `main` is fast-forwarded to match — both point at the
same commit, as always.

```bash
git fetch origin && git checkout redesign/agent-blue-sky && git pull
npm install && npm run build:all
```

`npm install` matters this time: `apps/worker` gained a dependency on `@cml/device-library`.

---

## 1. What changed in one paragraph

The distinctiveness engine (ANALYSIS_74 §8) was designed, built, and run. It works: the pipeline has
produced its first two cases outside the temporal/clock cell in its entire history, and axis coverage
moved from `H=0.00` to `H=0.38`. The first was read externally at **79/100 with `premise` 9** and the
reader calling it *"a nice break from clock-only mysteries"*. The second is **unread and waiting for
you** — that is the one open task. Along the way four real defects were found and fixed, and the
single biggest finding of the session is not about distinctiveness at all: **the quality gate detects
most of what the reader complains about and ships anyway.**

---

## 2. THE ONE THING TO DO FIRST — DONE 2026-08-26

> **CLOSED.** Run 2 was read: **82/100**, `premise` 9, `prose` 6. DE9 is answered in
> [A_74 §11](documentation/analysis/ANALYSIS_74/ANALYSIS_74.md) — the unused cells buy `premise` (9 on
> both DE runs vs 8 on both unscheduled clock stories) and do **not** move the headline (79 and 82,
> inside the 80–85 spread of the unscheduled runs). The shadow rubric over-scored run 1 by 5; it was
> not consulted first. Ledger updated, 41 rows.
>
> The section below is kept as written, for the record of what was asked.

## 2. (as originally written) THE ONE THING TO DO FIRST

**Cold-read `stories/story_20260826-1753/the_canary_s_slippers_a_seaside_hotel_identity_m.md`**, the
same way every other read in the ledger was done, and save the review as
`stories/story_20260826-1753/chatgpt-review.txt`. Then:

```bash
node scripts/external-read-ledger.mjs --write
```

Why it matters: this is the first `identity`-axis story the project has ever produced.
[PLAN-TO-90 §0.2](architecture/PLAN-TO-90.md) records that axis as *unreachable* until X70 landed on
08-20, because the orchestrator silently coerced every unrecognised axis to `temporal`. It is also the
second half of DE9 — the question of whether an unused cell reads better. One read is in; this is the
other.

**Do not read the shadow rubric first.** It said 84 for run 1 and the human said 79, over-scoring by 5
on exactly the axis it is least able to judge.

---

## 3. What is in the repo now that was not before

Everything below is committed, built, tested and pushed.

| what | where |
|---|---|
| **DE1** ledger-append logging — both silent branches | `apps/worker/src/jobs/mystery-orchestrator.ts` |
| **DE2** dispersion (normalised entropy per field, no threshold) | `apps/worker/src/jobs/novelty-dispersion.ts` |
| **DE4** one mechanism-family vocabulary, weighted scoring | same file |
| **DE3** prior runs into the structural judge + skeleton persisted | `apps/worker/src/jobs/prior-run-fingerprints.ts`, `packages/novelty/src/loader.ts` |
| **DE5** the cell scheduler | `apps/worker/src/jobs/cell-scheduler.ts` |
| **DE6** scheduled-input generator | `scripts/schedule-run.mjs` |
| **DE8** device-library retrieval into Agent 3b | `apps/worker/src/jobs/device-library-block.ts` |
| all the free measurements in one place | `scripts/distinctiveness-report.mjs` |
| 28 tests for the above | `apps/worker/src/__tests__/distinctiveness-engine.test.ts` |
| the analysis | `documentation/analysis/ANALYSIS_74/ANALYSIS_74.md` §8, §9, §10 |
| both new flags, with settling probes | `architecture/FLAG-AUDIT.md` (A_74 addendum) |

Two commands worth knowing:

```bash
node scripts/distinctiveness-report.mjs
```

Prints corpus coverage, external reads cross-tabbed by mechanism family, and the same-day variance
pairs. Costs nothing, calls nothing.

```bash
node scripts/schedule-run.mjs --dry
```

Shows the next cell the scheduler would pick and the config it would write. Drop `--dry` to write it,
then run with `CANARY_CORE_INPUTS_YAML=<path> node scripts/canary-core.mjs`.

---

## 4. Flags changed in `.env.local` — NOT in git, redo them on the other laptop

`.env.local` is gitignored, so **these will not arrive with the pull.** Backup of the previous state
on this machine is `.env.local.bak-20260826`.

```
AGENT9_LOCKED_FACT_ALIASES=false     # was true. C4 was falsified in step 2 — dialogue did not move.
AGENT9_PROMPT_PREFIX_ORDER=true      # was a #DEFERRED comment. Built, registered, never once run.
NOVELTY_CELL_SCHEDULER=shadow        # DE5. Shadow only — the assignment is applied at the INPUT layer.
AGENT3B_DEVICE_LIBRARY=true          # DE8.
```

Still ON from before: `AGENT9_POLISH_PROVIDER=anthropic`, `AGENT9_POLISH_ANTHROPIC_MODEL=claude-opus-5`,
`AGENT9_FOLD_SUSPECT_CLEARANCES`, `AGENT9_CLEARANCE_AT_END`, `AGENT9_CONTINUITY_SPAN`,
`LLM_HTTP_TRANSPORT`, `AGENT3_DEVICE_TIME_BINDING`.

Verify with `node scripts/flag-register-check.mjs` — it should say *clean*.

---

## 4b. What does NOT travel with the pull

Four things live outside git. Three are fine; one would have quietly broken the engine and is now
fixed, but it is worth knowing why.

| what | where | matters? |
|---|---|---|
| `.env.local` | gitignored | **Yes** — redo §4 above. |
| `apps/api/data/novelty-ledger.json` | tracked, but was left dirty all session | **This was the real gap. Now committed.** See below. |
| `documentation/prompts/actual/<run>/` | gitignored (A_71) | No. Per-run prompt/response archives; reproducible. |
| `apps/worker/logs/novelty-skeleton-*.json` | gitignored (`logs/`) | No, but worth knowing: DE3 persists one skeleton per run so the shadow judge finally leaves a dataset, and those files stay on the machine that made them. If that history ever needs analysing across machines, the path has to move out of `logs/`. |

**Why the ledger mattered.** It is not a log — it is the corpus `scheduleCell()` walks. The scheduler
reads the shipped runs, picks the stalest unused `(axis, family, testShape)`, and requires at least two
coordinates to differ from the previous run. Pulling a **7**-record ledger would have made it re-pick
`spatial × locked_room_key` — the cell run 1 already used — and the walk would have silently restarted
rather than continued. Nothing in the output would have said so.

It is committed now at **9 records**. Confirm after pulling:

```bash
node scripts/distinctiveness-report.mjs
```

Section 1 should print `axis 0.38, 3 distinct of 6` and a top family share of 56%. If it says `0.21` or
`0.00`, the ledger did not arrive and the scheduler will repeat a cell.

**One caution on `apps/api/data/store.json`.** It is tracked, ~900KB, and both laptops write to it on every
run. If it ever conflicts on a pull, do not try to merge it — take either side, or delete it and let
`apps/api/src/db.ts` recreate it. It is a runtime artifact, not source.

**Two files are deliberately left untracked**: `dev-shell.ps1` and `start-dev.bat`. They point at a
portable Node and Git under `../.tools/`, which is machine setup rather than project source, and on a
laptop without that layout they throw rather than degrade. Commit them yourself if the other machine
has the same `.tools` arrangement.

---

## 5. The findings, in order of what they are worth

### 5.1 The gate sees the problems and ships anyway — this is the biggest lever

Five of the 08-26 reader's seven complaints were **already in the run's own log** before the
manuscript was written to disk. Not a detection failure; an authority failure. Full mapping table in
[ANALYSIS_74 §9.4](documentation/analysis/ANALYSIS_74/ANALYSIS_74.md).

The sharpest instance: the reader quoted chapter 10's *"validation leakage"* verbatim and said it
*"must be deleted"*. The pipeline **wrote those sentences deliberately**, logged that they violated its
own `verdict_closer` rule, and shipped them because ADR-0003 says injections stand. It then did the
same thing again on run 2 — different case, different cell, same chapter, same injector.

**`prose` 6 is the traceable output of a policy, not a model failure.** This is B1, gate authority,
and it needs a decision rather than a build.

### 5.2 The Opus polish pass rolled back 4 of 4 on run 2

```
post_pass_polish    4 calls — changed 0, no-change 0, ROLLED BACK 4
atmosphere_repair  10 calls — changed 9, no-change 1, rolled back 0
```

Polish is 18–24% of a run's spend. On run 2 it bought nothing and the run still scored 83. Across both
runs it is 4 changed / 6 rolled back, and the rollback reasons name **validators**, not the model.
`atmosphere_repair` at 9-of-10 shows what a working pass looks like. Either fix what the validator
reverts or gate polish on a trigger instead of running it per chapter. Free, and no read needed.

### 5.3 The repair machinery is tuned to the cell we just left

`clues` scored 6 on run 1. The reader's #1 complaint was that a *mechanism* was under-explained — and
for a clock case there is a dedicated apparatus for exactly that (X38, device time binding,
`reveal_times_not_stated`). **Five of the fifteen geometry codes are temporal-only.** A spatial case
walks into a thinner net; X38 fired anyway, hunting its own kind of defect in a case that was not
about time.

The engine did not make the pipeline worse. It made visible how narrow the pipeline's competence had
become while nobody could see the walls.

### 5.4 Four defects found and fixed

- **Agent 6.5 truncation retry asked for MORE words.** The retry block is fixed text appended whatever
  went wrong, and nearly every line pushes length up. On a truncation failure that is backwards, and
  the three responses grew monotonically — 28012 → 28379 → 28647 bytes — before the run aborted at
  £0.58 with no manuscript. `maxTokens` 6000 → 12000 and a truncation-specific retry. **This had been
  a coin flip on every run**: run 1 truncated on attempt 1 too and happened to fit on attempt 2.
- **The family classifier was first-match-wins over a long text.** One incidental "clock" in a
  paragraph of premise prose outvoted a mechanism with zero timing content. Now scored across weighted
  fields, distinct hits only.
- **The ledger silently skipped failed runs** (`status !== "failure"` plus an empty catch), so
  "diverge from recent runs" quietly meant "diverge from recent *clean* runs".
- **`loadReferenceCorpus()` was never passed prior runs**, though `CORPUS_SPECIFICITY` ranked
  `prior_run` highest. The judge could not see the repetition it existed to detect.

### 5.5 A correction I have to carry forward

ANALYSIS_74 §8 reported `mechanismFamily H=0.00` next to `axis H=0.00`. **Only the axis figure was
real.** `axis` is declared by the CML and nothing infers it; the family number was an artifact of the
classifier bug in 5.4. The monoculture is real — seven consecutive time-of-death tricks, visible in
the titles — but the evidence is the axis and the titles, not a number a classifier produced. §8 and
§10.5 both carry the correction.

### 5.6 The content filter is a recurring tax, not an incident

Three Azure refusals across two runs (`Agent6-BlindReader` ×1, `Agent9-ProseGenerator` ×2). On run 1
that meant the fair-play blind-reader gate was **SKIPPED, not passed**, on a run whose largest failure
was fair-play clarity. Nothing records this as a known operating condition; it should.

---

## 6. Numbers

```
axis dispersion    H=0.00  ->  0.21  ->  0.38     1 -> 2 -> 3 distinct of 6
top family share     100%  ->    —   ->    56%

run 1  The Elevator Cage Enigma   spatial x locked_room_key    £1.45  40 calls  shadow 84  ext 79
run 2  The Canary's Slippers      identity x alibi_fabrication £1.73  58 calls  shadow 83  ext ??
lost   identity, first attempt                                 £0.58  19 calls  Agent 6.5 (fixed)
                                                               -----
                                                               £3.76
```

Run 1 category line, against the two runs before it — **eight of ten identical**, `premise` 8→9,
`ending` 8→7:

```
                     prem open plot char dial atmo clue paci endi pros   ext  sum
read-20260825-1838      8    8    8    8    7    8    8    8    8    6    82   77
read-20260825-2102      8    8    8    8    7    8    6    8    8    7    80   76
read-20260826-1708      9    8    8    8    7    8    6    8    7    6    79   75
```

A sum gap of 1 is **inside the noise**: same-build pairs already in the ledger show sum-gaps of 4 and
10. That measurement is free and repeatable — `node scripts/distinctiveness-report.mjs`, section 3.

---

## 7. `stories/` is now tracked

The A_71 gitignore rule that untracked run artifacts was aimed at
`documentation/prompts/actual/*/`, `results/`, `logs/` and `data/store.json` — a 1,236,261-line diff.
Manuscripts were never the cause: all of `stories/` on this machine is 356KB across 9 files. It is now
tracked; everything else stays ignored.

**This machine only ever had 5 stories.** The larger archive — the 184 manuscripts behind
`OPENING_CORPUS_MANUSCRIPTS` — is on your other laptop, and the external-read ledger still reports
*"in the manifest, no manuscript on disk"* for about 35 rows because of it.

> **RESOLVED 2026-08-26 on the other laptop, and WITHOUT publishing anything.** `RECENT_OPENING_SITUATIONS`
> is emitted by `build-opening-corpus.mjs` into `packages/prompts-llm/src/constants/opening-corpus.ts`
> — a **generated source file that is already tracked**. Running the builder on the machine that has
> the archive populates the constant, the constant travels in git, and `openingCorpusReady()` flips
> `false → true`. **4a is unblocked; the 13MB of manuscripts did not need to be committed at all.**
> Corpus is now 189 manuscripts. The advice below still works, but it is no longer necessary for 4a —
> and it is the option that publishes 184 manuscripts to a public repo permanently.
>
> Audited before deciding: the archive is 184 `.md`, 31 reviews, 5 `rubric-report.json`; no credential
> shapes, no keys, no email addresses. The 1,457 hits for "secret" are the murder mysteries.

**So there is a bonus available on that laptop**, and it unblocks a roadmap item:

```bash
git add stories && git commit -m "chore: bring the manuscript archive under version control"
node scripts/build-opening-corpus.mjs --write
```

`RECENT_OPENING_SITUATIONS` ships **empty** today and `openingCorpusReady()` refuses to run A2b
without it — so [ROADMAP-FROM-82](architecture/ROADMAP-FROM-82.md) item **4a has been blocked on a
gitignore line, not on any code**. Committing the archive fixes it permanently, for every clone.

**The repo is public.** Manuscripts and their `chatgpt-review.txt` files are now visible to anyone,
and will be cached by third parties even if removed later. Nothing in them is a credential or personal
data, but if publishing the fiction is not what you want, **make the repo private before the next
push**.

---

## 8. What I would do next, in order

1. **Read run 2** (§2). Everything about DE9 waits on it.
2. **Decide B1, gate authority** (§5.1). Free, biggest lever, needs a decision not a build.
3. **Fix or gate the polish pass** (§5.2). Free, 18–24% of spend, currently mostly discarded.
4. **Commit the manuscript archive and rebuild the opening corpus** (§7). Free, unblocks 4a.
5. Only then another distinctiveness lever. The two runs said the engine works and the *execution*
   machinery is what is costing marks — so more novelty is not the next thing to buy.

Open and unresolved, so it does not get lost:

- **DE8 is untested.** Run 1 had the curated corpus; run 2's cell had no library coverage and
  correctly emitted no block. That is an accidental N=1 ablation and worth exactly what that is worth.
  If run 2 reads *better* than run 1, suspect DE8 before suspecting the scheduler — the reasoning is
  in `FLAG-AUDIT.md`.
- **A vacuous theme lock.** `extractThemeMechanismFamilies` locked run 1's primary device to the
  family *"constraint"* — a synthetic token naming no mechanism at all — and told the model its device
  "must all concern constraint". Harmless only because it is meaningless. It was also competing with
  the DE5 assignment rather than carrying it; DE5 won only because `MECHANISM_FAMILY_KEYWORDS` has no
  entry for `locked_room_key`. Against one of its eight keyword families, the hard selector would
  still win.
- **The two classifiers disagree about run 2.** DE1 stored `staged_scene`; the LLM extractor said
  `impersonation`. For an identity/alibi case `impersonation` is probably righter. Neither is ground
  truth.
