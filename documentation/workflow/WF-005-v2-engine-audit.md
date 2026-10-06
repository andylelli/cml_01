# WF-005 — the v2 engine audit (A_111 CR-e), and a self-read of the one unread book

**2026-10-06 · 4 read-only agents (A_103 method: demonstrate every defect with a probe run from `dist` on real artifacts,
validate every zero against a known positive) · ~1.16M subagent tokens (contract 332k, orchestration 319k, checking
371k, self-read 138k) · 18–35 min each · probes copied to `WF-005-probes/` (scratch paths inside them point at the
session scratchpad; re-point before re-running).**

## The question

The code review of 2026-09-25/26 covered everything except the v2 prose engine, which has shipped since 2026-09-25
(ANALYSIS_111 §1.3, CR-e). Three slices: **contract construction** (`prose-engine` contract/bible/brief/opening and the
renderer), **orchestration** (`agent9-v2/run.ts`, the prose redo path, the save), **checking, selection and editing**
(`findings`, `edits`, `selector`, `gate`). A fourth agent read the one readable unread book (seed 82094 ON,
`stories/story_20261002-1855/`) before a reader was spent on it (CR-f).

## SURVIVED — 37 demonstrated defects (every row MEASURED unless marked)

Reach is out of the 64 stored projects with a CML, outline, clues and cast (32 distinct casts), unless stated.

### Contract construction (V2C)

| id | defect | reach | severity |
|---|---|---|---|
| V2C-01 | the reveal's "chance to do it" window is a keyword pick, else the first interval — often an innocent's alibi (`contract.ts:412`) | 26/64 fallback; ≥11/64 wrong window | corrupts the book |
| V2C-02 | the crime chapter's "between {actual} and {apparent}" prints backwards when the trick makes the death look earlier (`contract.ts:671`, `run.ts:331`) | 29/58 | corrupts the book |
| V2C-03 | decisive evidence first owned at the TEST chapter while the precedence rule reports it holds (`trace-templates.ts:36,68`) | 19/64 | fair play |
| V2C-04 | "the test is applied on the page to {innocent}" names a person off that chapter's page | 36/64 | corrupts the book |
| V2C-05 | "The body: X — found dead…" prints at and after the reveal | 25/64 | corrupts the book |
| V2C-06 | a prose redo (`RESUME_REDO=prose`) never restores the locked-fact registry (= V2O-03) | 0 of 24 resumed runs carry one | corrupts the matched pair |
| V2C-07 | THE CLOCK cut silently at 600 tokens, locked facts last, so they drop first; THE EVIDENCE at 900 | 18/64 lose locked facts; 13/64 evidence | corrupts the book |
| V2C-08 | THE CLOCK says "written the same way every time" and spells one hour two or more ways; digit labels | 54/64; 28/64 | latent; INFERRED harm |
| V2C-09 | D5's culprit filter covers one copy of `consequenceFor`; the raw job line still prints it | 7/7 carrying the field | corrupts the book |
| V2C-10 | "X is cleared here" for a suspect not on that chapter's page (round-robin) | 41/64 | corrupts the book |
| V2C-11 | the false solution's accused is cleared before the accusing chapter | 54/64 | corrupts the book |
| V2C-12 | `present` matches cast names exactly: "Detective X" drops off every page | 5/64 (41 chapters) | corrupts the book |
| V2C-13 | "a reader must be able to use" for a clue first staged after the culprit is named | 16/64 | latent |
| V2C-14 | schema field names (`suspicionShiftsTo:`) print verbatim | 13/64 | hygiene |
| V2C-15 | the A_110 "OFF is byte-identical" tests compare unset with `"0"`, which reads identically | all such tests | latent — **closed by `npm run pin:v2` (`c36add04`)** |

Already-known defects still live in the shipped OFF branch: the arrested culprit owns a wit beat after the reveal
(35/64); the culprit named in a clue the writer must surface before the reveal (64/64).

### Orchestration (V2O)

| id | defect | evidence | severity |
|---|---|---|---|
| V2O-01 | `namesAsCulprit` counts figurative verbs ("wit had **cut** through the silence") and a relative sharing the surname (`culprit.ts:38,47`) | the gate's fair-play stop passes on that line alone with every accusation stripped from the reveal | corrupts the book (= V2K-03) |
| V2O-02 | with one chapter per call, `book_short` and `reveal_unnamed` run on a single chapter (`run.ts:696`) | `book_short` on 150/150 drafts; decided 3 of 9 post-reveal picks | corrupts the book (= V2K-02, V2K-10) |
| V2O-03 | the redo never restores `ctx.lockedFactRegistry` | resumed bible 19 lines vs 25 | corrupts the matched pair |
| V2O-04 | the content-filter softened retry is sent as `retryAttempt: 2`, so the client raises temperature 0.7 → 0.82 | every writer call of 4 runs | corrupts comparability |
| V2O-05 | the checkpoint is one file per PROJECT: a second redo overwrites the first's drafts; an unchanged ask restores every segment with zero calls | arm B's drafts lost to P-5 | destroys evidence |
| V2O-06 | the run log is named by the first 8 characters of the run id, so same-day `resume-…` runs overwrite each other | arm B's log lost | destroys telemetry |
| V2O-07 | softening is not remembered within a run (refused, then softened, every call); checkers judge the unsoftened clue | 6 runs refused 3–30 times | wastes calls |
| V2O-08 | prose spend never reaches `agentCosts` (`cost: 0`) | arm B report total_cost 0 vs $1.131 | under-reports |
| V2O-09 | a missing chapter ships with a warning and the .md renumbers by position | synthetic only | latent |
| V2O-10 | an Anthropic writer role without a key "falls back" to Azure with the Anthropic model id | resolution probe | latent |
| V2O-11 | two `.md` writers: the redo path has no mojibake repair | synthetic | hygiene |

### Checking, selection, editing (V2K)

| id | defect | evidence | severity |
|---|---|---|---|
| V2K-01 | `registerNotWorse` scores a RATE: shrinking a sentence under 5 words "raises" it with no new register sentence | arm B: 44 of 45 register rollbacks kept the hit count; hit-count guard leaves 1 (P-2's exemption leaves 5) | corrupts the book |
| V2K-02 | `reveal_unnamed` per segment rewards re-accusing in the closure chapter | decided ch9 in 3/5 checkpoints | corrupts the book |
| V2K-03 | = V2O-01: 125 of 159 "didIt" matches are cut/struck/pushed/shot; 2 of 125 have a person as object | 119 cases | corrupts selection |
| V2K-04 | `clockValuesIntact` counts occurrences, so deleting a RESTATED time is reverted | 9/9 such deletions; **arm B's WORTH A LOOK rests on clock spans: 60.9 → 47.3 per 10k without them (threshold 51.9)** | corrupts the book |
| V2K-05 | the run config carries no code version: P-5 ran M10's opening terms that arm B's code lacked, with 0 flag differences | git reflog | wastes money |
| V2K-06 | `longSentenceShare` glues sentences across a closing quote | 477/813 "long" sentences; changes 5–8 of 30 picks | misdirects selection |
| V2K-07 | the guards are SUMMED: a never-fall guard can fall when register rises | 5/89 edits in A′ (one lost 4 clue terms) | latent |
| V2K-08 | gate stop 2 passes on any one key term as a substring ("door") | 4/4 known negatives pass | latent: the stop is vacuous |
| V2K-09 | `noOrphanedTag` counts `Name asked, "…"`; `noNewScaffold` counts the word "contract" | 12/12 and 68% of canon | hygiene |
| V2K-10 | = V2O-02 (`book_short`); report-only findings counted as unresolved | needs_review 12/12 | hygiene |
| V2K-11 | `clue_missing` barely separates a clue from period vocabulary | canon text "has" 9–16 of 24 clues | latent |

### The self-read (CR-f)

The seed-82094 ON book is **not** a twin of the 80 read: a fresh run with another culprit and mechanism. It
**predates** the chapter-10 fix it was meant to test (run 18:30 BST, `7501ebf9` 19:37), its chapter-10 contract still
puts the culprit on the page, and it carries "chapter four" in dialogue, "six words" ×6, bare "X cleared." lines, the
victim cleared as a suspect, and every chapter opening on speech. Predicted 72–77. **Do not read it.**

## REFUTED

- **The A_110 pair doc's mechanism for the register rollbacks** ("cutting the tail makes the sentence score higher"):
  44 of 45 kept the register hit count and lost one sentence from the denominator (V2K-01).
- **DECISION-12's "the ON half's read completes the pair"**: different culprit and mechanism; predates the fix.
- **ANALYSIS_111 §2.4 (first version)**: "the fix is ON in the ON half" — the run predates the fix commit.
- **The editor rollback attribution falls back to a default label** (my own suspicion, A_111 §1): 0 unattributed
  rollbacks in 136–142 reverts.

## Could NOT determine

Whether any defect moves an external read (contracts and prompts measured, not marks); whether Azure bills
content-filtered 400s; arm A′'s draft-level selection (checkpoint overwritten); the prose effect of the temperature
drift (V2O-04) and of the softened clue text (V2O-07).

## Expand or skip

**Expand into one fix batch** (ANALYSIS_111 §5): every row above is a rule over any case's fields, not a case noun.
Behaviour changes go behind one default-OFF flag and ride the next pair; instrument and hygiene fixes (V2O-03, -05,
-06, -08, -09, -10, -11, V2K-05) change no prompt and land unconditionally. Re-run the owning probe after each fix.
