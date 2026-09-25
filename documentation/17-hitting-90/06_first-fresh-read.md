# 06 — THE FIRST FRESH READ: 69

**2026-09-25.** Run `run_98dec72a` (story `story_20260925-1318`, *The Shadows of Ashford Manor*) was the
first fresh case written by v2, and it read **69**. Pair 3 (`resume-1790335377015`), four hours earlier,
read **88**. This document is what the 69 says about the system, and the £0 work it produced.

**The rule for everything below (the user's, 2026-09-25): changes are holistic to every axis. Nothing
here is fitted to the Ashford Manor case.** Every fix is a checker, a guard or a brief line that runs
on every book, and every checker is shown against a known-negative as well as a known-positive.

---

## 1. Why 69, when the last read was 88

### 1.1 The 88 measured one case; the 69 measured the system

MEASURED from the review files in `stories/`:

| | reads | range |
|---|---|---|
| fresh runs, 2026-08-02 → 09-16 | 34 | 68–86, mostly 76–85 |
| resumes of seed 23403 (tidal cave), 09-16 → 09-25 | 9 | 80 → 88 |
| **run 98dec72a, fresh, identity axis** | 1 | **69** |

v2 was chosen on seed 23403 (A_108) and tuned on it through three prose pairs the same morning. Every
read since 16 September was that case. CLAUDE.md already says *choose the next seed by AXIS until every
axis has three reads*; the programme did not. **INFERRED:** most of the 19-point gap is the case and
the generalisation, not a regression — the 69 is about ten below the fresh-run level, not nineteen
below the best.

It was also the first book through four changes that had only met harnesses: P2.1 (the staged wound),
P3.1 (the wound site), P3.2 (the act window) and P3.4 (scene titles). MEASURED: the run started 12:01
UTC, after `f63f7b4d` (11:45 UTC). Whether the worker's `dist` was rebuilt is **ASSUMED** — the run log
is on the laptop (`logs/`, gitignored), and `documentation/prompts/actual/run_20260925-1201_98dec72a/`
is indexed but ignored.

### 1.2 What the reader named, and where each came from

| the reader's complaint | on the page, MEASURED | source |
|---|---|---|
| "a gesture that carried nothing the plot needed" — meta-text | ×3 | `brief.ts` O5: "…an exchange that **carries nothing the plot needs**" |
| "the survivors changed in concrete ways" — outline language | ×1 | `brief.ts` aftermath: "gives two named survivors one **concrete change** each … the place **resuming ordinary use**" |
| repeated catchphrases | "that's the way of things" ×5, "cut to the chase" ×5, "Order, Mr. Wentworth insists" ×3 | `bible.ts:180` "Says, in their own way: <tic>" — given to every chapter call, owned by none |
| repeated "Inspector, [clue]…" lines that sound like notes | **23** lines opening by addressing the investigator (pair 3: **2**, both real questions) | `bible.ts` clue list: "as something somebody sees, finds **or says**", next to the clue's `observable` — which Agent 5 often writes as a conclusion (§2) |
| duplicated lines | 3 passages, **all inside one chapter** (pair 3: 0) | a speech closed and restarted mid-paragraph after a stray quotation mark — the shape of an edit whose replacement carried the next sentence (INFERRED; the log would settle it) |
| "spoke at length" and the like | "spoke at length" ×7, "answer was brief"/"reply was short" ×6, "answered with four words" ×2 | `brief.ts` wit shapes: "somebody **speaks at length**…"; pair 3 printed it ×7 too |
| too many mechanisms | the discriminating test compounds two proofs (ladder dust **and** letter delivery times); the premise stacks impersonation, forged credentials, forged passes and forged letters | the case (Agent 3), before a word of prose — `data/novelty-ledger.json` |
| "Dr. Langley's alibi is confirmed" — the victim | ×1 | open (§5) |

### 1.3 Why the checkers let it through — four faults, all general

MEASURED over the 227 saved books of 8,000+ words, with a golden contract standing in for each book's own:

1. **Anchoring discarded every checker quote under eight words.** "Evelyn's answer was brief." was
   found and thrown away. On the 69: 5 of 12 operation announcements lost; on the corpus: 45
   operation, 141 abstract-subject and 9 scaffold findings.
2. **The sentence splitter ended a sentence at every honorific.** "Order, Mr. Wentworth insists" was
   said three times and counted zero: "Mr." cut the quotation in two.
3. **`copied_sentence` only looked across chapters.** All three of the 69's duplicates were inside
   one; it reported none.
4. **The echo checker matches verbatim n-grams.** "carries nothing the plot needs" in the brief does not
   match "carried nothing the plot needed" on the page — the tense changed and "nothing"/"the" are stop
   words.

And one hole in the edit guards: the validator compares the **sum** of guard scores, so a splice that
repeats a sentence carrying a name raises `castNamesIntact` by what it takes from any duplicate
measure, and nothing reverts it.

---

## 2. The clue observable is often a conclusion

MEASURED on the four golden cases (`eval/golden/`, all temporal): many `observable` fields are not
things anyone can see — *"Records and possessions confirm Charles Fenwick's exclusive access and tools
for clock tampering"*, *"Timeline correction based on hourglass frost blockage and Charles's presence"*,
*"Physical and timing evidence contradicts the assumption of correct clock time."* A conclusion can
only be SAID, and the brief offers "says" as one of the three ways to show a clue. On the 69 that is
the report-to-the-inspector line: *"Inspector, the ink composition of forged letter unavailable before
half past eleven."*

---

## 3. What WP-001 says about it

- O5 ("one thing that isn't doing a job") and the wit shapes came back **announced instead of
  performed**. The writer printed the operation's *purpose*. The general rule: a brief line states the
  act, never the reason for it, and carries no noun a narrator can lift (plot, case, survivors, length).
- The stock line is §4.3's template ratchet at the scale of a character: a line guaranteed to be
  available to every chapter is a line that recurs.
- §7 binds the fixes: detect and report, never gate; no deterministic scrubber — the editor (an LLM)
  makes every change, under the guards.

---

## STATUS

| id | item | status | commit | evidence |
|---|---|---|---|---|
| F1 | one abbreviation-aware sentence splitter for the checkers (`sentences.ts`) | built | 48819b8e | "Order, Mr. Wentworth insists" ×3: 0 → found. The draft selector keeps its own splitter: its instruments are calibrated on it |
| F2 | a checker quote under eight words is widened by its neighbours, not discarded | built | 48819b8e | the 69: discarded 5 → 0; corpus: 195 → 0 |
| F3 | `copied_sentence` reports a repeat inside one chapter | built | 48819b8e | the 69: 0 → 3 of 3; pair 3: 0 → 0; corpus: 40 of 227 books carry one (mostly v1 injector lines) |
| F4 | a catchphrase said with an address added counts as the same line | built | 48819b8e | "Let's cut to the chase, Inspector" joins "Let's cut to the chase"; two different lines sharing words stay apart (test) |
| F5 | `operation_narrated` reads "answered with four words" | built | 48819b8e | the 69: ×2, was unmatched |
| F6 | edit guard `noNewDuplicate`, as a violation per duplicated sentence | built | 48819b8e | the ch-4 splice shape is reverted; a repair, even partial, is never a new violation (test) |
| F7 | the echo checker tolerates inflection: three stemmed content words in a row from one instruction line | built | aa0f0d9b | the 69: 0 → 4 of 4 ("carried nothing the plot needed" ×3, "resumed its ordinary use"); v1-era books (never saw the brief): 9 hits in 5 of 200, all grams of the foreign golden case's own clock values — a run excludes its own case text |
| F8 | the brief and the chapter contract state acts, not purposes: O5, the aftermath, the wit shapes, "closes in the scene" | built | aa0f0d9b | the sources, MEASURED: "speaks at length" → "spoke at length" ×7 (pair 3 ×7 too); contract "the short reply to a long speech is Sir Edmund's" → "Sir Edmund's reply was short"; "the very short answer is Evelyn's" → "Evelyn's answer was brief". Test: no brief line or template phrase carries a property a book has printed — fails 4 of 4 on the old brief. **Prediction for the next v2 book:** `operation_narrated` before edits ≤ 3 (the 69: 17); `scaffold_token` "plot"/"concrete"/"ordinary use" 0 |
| F9 | each stock line owned by one chapter the character is on the page in, never the reveal or aftermath | built | aa0f0d9b | golden contracts: 7 lines over chapters 1–6. **Prediction:** no stock line said more than twice (the 69: 5, 5, 3) |
| F10 | a clue put on the page as an act ("by a named person doing the thing that finds it … what they make of it comes after, in their own words"); checker `clue_recited` (craft): a spoken line carrying ≥5 and ≥70% of a clue observable's content words | built | 65e7adcc | known-positive: the 69's ink line; known-negatives: the same clue found by a person and read aloud in the speaker's own words, and the clue in narration BETWEEN two straight-quoted speeches (the first cut paired quote marks wrongly and would have flagged it). **Fire rate on real books UNMEASURED** — no saved book has its contract here. **Prediction:** on the next v2 book, lines opening by addressing the investigator ≤ 5 (the 69: 23; pair 3: 2) |
| F11 | compound discriminating tests against the read | measured — **no effect; the case-level change is withdrawn (W1)** | 65e7adcc | §4.2 |
| F12 | the read ledger by axis and by fresh/resume | measured | 65e7adcc | §4.1 |

**Deferred or withdrawn, with the reason:**

| id | item | why |
|---|---|---|
| D1 | make every guard exact per guard, not a sum | **would cause harm.** `castNamesIntact` counts name *occurrences*, so an exact rule reverts every deletion of a named sentence — which is the repair `operation_narrated` asks for ("Charles Wentworth spoke at length, his words carefully chosen."). How often the sum lets such repairs through today needs the run log. Only the new duplicate guard is exact (F6) |
| D2 | skip quoted measurements in the catchphrase checker | MEASURED 106 of 206 corpus hits are quoted clock values or measures, but 2 of 52 on v2-era books; not worth a change |
| D3 | a checker for the victim given an alibi ("Dr. Langley's alibi is confirmed") | once, in one book. No golden case lists its victim for clearance (4 of 4, MEASURED with the contract's own victim), so the contract did not ask for it; `victim_alive` is a declared class with no producer. Not built on one instance |
| W1 | **withdrawn:** "cap a case at one main deception" (Agent 3) | my own recommendation from the first reading of the 69. The ledger does not support it: compound tests 74.3 (n=3) against 77.5 (n=25), inside one read's ±3; "overloaded / too many mechanisms" is in 5 of 71 reviews. One reader's complaint about one book is not a system change |

---

## 4. The measurements, over the whole ledger

All from the 71 review files in `stories/`, scores parsed as "NN/100", joined to `data/novelty-ledger.json`
by the Run ID each book carries; books of 8,000+ words only (CLAUDE.md). 41 of 70 reads join.

### 4.1 What has been read, by axis

| | temporal | authority | identity | spatial | behavioural |
|---|---:|---:|---:|---:|---:|
| fresh reads | 12 · mean 76.2 | 8 · 78.4 | 4 · 75.5 | 2 · 81.5 | 2 · 77.0 |
| resume reads | 4 · 81.0 | 2 · 79.0 | — | 3 · 84.3 | 1 · 82.0 |

The four golden bundles in `eval/golden/` are **all temporal**. Spatial and behavioural still have two
fresh reads each, against the three CLAUDE.md asks for before a seed is chosen by anything but axis.
**INFERRED:** a resume scores higher than a fresh run on every axis that has both, because a resumed
case is one that was already chosen to be worth resuming — which is why a resume can prove a prose
lever and cannot prove the system.

### 4.2 Does a compound discriminating test cost marks? No measurable effect

A test is compound when its design joins two proofs ("combined with", "together with", "as well as",
"alongside"…). Fresh reads: **compound 74.3 (n=3), single 77.5 (n=25)**. The gap is inside one read's
±3 and n=3; CLAUDE.md forbids reporting it as an effect. Longer test designs go with HIGHER marks
(r = +0.39 with the design's word count, n=28) — concreteness, not simplicity, is what the ledger
rewards. Withdrawn as a change (W1).

### 4.3 What the readers complain about, over all 71 reviews

| complaint | reviews |
|---|---:|
| repetition ("repetit…", "repeated") | 64 |
| scaffold / meta-text / outline language / "generator" | 34 |
| catchphrase | 19 |
| overloaded / too many mechanisms / cluttered | 5 |

F1–F10 aim at the first three. The fourth is the 69's alone in kind.

### 4.4 Where the contract puts the clues — an observation, not acted on

Clues each chapter OWES, from the four golden contracts (MEASURED):

```
56049d93  2 1 4 2 4 7 1 0 1 0
6b91b4b1  2 2 2 3 4 6 1 0 0 0
a5c017a1  3 2 3 3 6 4 0 0 1 0
eb1251aa  2 1 4 3 4 9 0 0 1 0
```

Chapter 1 owes two or three, so the 69's crowded opening ("too many clues at once") was the writer
front-loading past its contract — WP-001 §5.1's over-orientation — not the plan. **INFERRED.** The
contract's own pile-up is chapter 5–6: six to nine clues in all four cases. That is an outline-stage
question (Agent 5 placement, Agent 7 scenes) and needs a paid run to test; recorded here so the
next pacing complaint has somewhere to start.

---

## 5. What the next paid runs should be — not launched

Both need their parameters stated in full before launch (CLAUDE.md), and neither has been started.

1. **The matched pair on the 69's own case:** `RESUME_REDO=prose` on run 98dec72a (~£0.45 by CLAUDE.md;
   v2 chapter-per-call measured ~$1.0 on pair 3). Same case, byte-identical upstream, the new prose
   code: this isolates F1–F10 from the case, which a fresh run cannot. **Predictions, each checkable
   in the checkpoint's findings and on the page before any read:** `operation_narrated` before edits
   ≤ 3 (was 17); no stock line said more than twice (was 5, 5, 3); lines opening by addressing the
   investigator ≤ 5 (was 23); "plot" / "concrete" / "ordinary use" from the brief: 0; duplicated
   passages after edits: 0 (was 3).
2. **A fresh run on a behavioural or spatial seed** — the axes with the fewest reads — so the next
   number measures the system and not a case. The read rule stands: the book is read by us first, and
   never sent with a fallback chapter or a WORTH A LOOK ship-check.

---

## 6. Pre-existing test failures — found, not caused, not fixed here

The full workspace suite (`npm run test --workspaces`) has four failures that reproduce with this
document's code reverted to `a22e69f0` (MEASURED 2026-09-25): `apps/worker` runtime-paths ("does not
depend on process cwd"); `prompts-llm` clearance-trim ("mirrored sources are byte-identical to
story-geometry accept.ts"); `story-validation` fixed-seed-benchmark replay and report-invariants replay.
None is in a package this work touches.

---

## 7. Second review — reading the 69 whole (2026-09-25), findings not yet built

MEASURED unless marked. Book counts compare the 69 against pair 3 (88) and pair 2 (85), same engine.

| id | finding | evidence | general? |
|---|---|---|---|
| R1 | **The test is asked for twice.** When the test and the reveal are different chapters, the reveal chapter's contract repeats "the test is applied on the page to X first and to Y second" (`contract.ts:484`, role `discriminating_test` OR `reveal`). The 69 performs the boot test in ch 8 and again in ch 9 | golden contracts: `testSubjects` on ch 8 AND 9 in 4 of 4; pair 3 had test = reveal, so never exercised it; "twice/redundant" in 18 of 71 reviews | yes — every case with test ≠ reveal |
| R2 | **Clues that name the culprit are scheduled before the test.** The 69: "the duplicate study key was recently found with Leonard Pike" in ch 4 | golden contracts: clue observables naming the culprit owned by ch 4–7 in 4 of 4, the test at 8; "guess/obvious/too early/gives away" in 22 of 71 reviews | yes — Agent 5 placement; needs a paid harness |
| R3 | **The humour move is narrated as a label.** "her humor at her own expense" ×5, "the plain truth" ×5, "less than the moment deserved" ×3, "keeping his face straight", "the one small absurd thing" | 69: 15; 88: 0; 85: 1 | yes — the `humourMove` text is the same for every book |
| R4 | **Chapters close on a summary of the investigation.** "The investigation pressed on, each detail—…—drawing the group closer to the truth" | 69: "investigation pressed on" 6, "closer to the truth" 5, "weight/imprint of routine" 8; 88 and 85: 0 each | the shape is general; its size on the 69 is not (below) |
| R5 | **The culprit is the investigator's assistant.** Pike demonstrates the lock, reads the dust and the ink in ch 1–8 | read; unmeasured elsewhere | INFERRED general: nothing in the contract says who surfaces a clue |
| R6 | **Clearances restated.** Margot's "nine o'clock to ten o'clock, sixty minutes" in ch 2, 5, 7, 8; Sir Edmund's financial papers ch 5, 6 ×2 | read | INFERRED general |

**The size question — ASSUMED, settle from the laptop logs.** R3 and R4 are 0 on two books from the same
engine and near-identical brief, and 15–19 on the 69. The 69 came from the website; pairs 2 and 3 from
the CLI resume. Whether both read the same `.env.local` (`PROSE_ENGINE`, `PROSE_V2_WRITER`,
`PROSE_V2_SEGMENT_CHAPTERS`, `AGENT9_V2_FILTER_SOFTEN`) is not visible in the repository. Check
`logs/llm-prompts-full.jsonl` for run 98dec72a: the writer's agent label and model, and the segment count.

### 7.1 STATUS of the second review

| id | status | commit | evidence |
|---|---|---|---|
| R1 | built — the test belongs to the test chapter (else the reveal); the reveal contract says the result "was watched in chapter N … spoken of as already seen" | 02b109d1 | golden: carriers 8+9 → 8 in 4 of 4 (test) |
| R2 | deferred to the matched pair — Agent 5 placement, needs a paid harness | | prediction for the re-run: note the first chapter in which the culprit is tied to the means |
| R3 | built — `humour_move_narrated` (craft), one pattern per move | 02b109d1 | the 69: 10; pair 3: 0; pair 2: 1; all 227 books: 13 in 4. Word pairs were tried first and flagged "the strain on his face" — 127 hits in 87 books — withdrawn |
| R4 | built — `summary_ending` (craft): last paragraph all narration, an "each detail—…—" inventory or "the investigation pressed on" / "closer to the truth" | 02b109d1 | the 69: 5 of 10 chapters; other books 0–2; corpus 46 in 34 of 227 |
| R5 | built — the bible names who finds a clue: "the investigator or anyone present except <culprit>" | 02b109d1 | golden: 4 of 4 carry it. **Prediction:** on the re-run the culprit surfaces ≤ 1 clue (the 69: most of ch 1–8) |
| R6 | not built — alibis restated across chapters; the clearance lines already say where each is cleared, and the new copy/echo checkers cover verbatim restatement. Measure on the re-run first | | |

---

## 8. The matched pair read 74 (2026-09-25) — +5 on the same case

`RESUME_REDO=prose` on run 98dec72a with §06 F1–F10, R1, R3–R5 and §07. Read **74** against **69**.

| category | 69 | 74 |
|---|---:|---:|
| premise | 7 | 7 |
| opening | 7 | 7 |
| plot | 5 | 6 |
| character clarity | 6 | 7 |
| dialogue | 5 | 6 |
| atmosphere | 7 | **8** |
| clues | 6 | 6 |
| pacing | 5 | 6 |
| ending | 6 | 7 |
| prose | 4 | 5 |
| character life | 6 | 7 |
| humour | 4 | 6 |

The §07 prediction (+1 atmosphere, +1 character) held on both. The reader credits rain, blackout
curtains, rationing slips and the characters' inner pressures — the material §07 routed.

**What the reader still names:**
- **Our aftermath rewrite printed** — "could not have done before the arrest", "the last paragraph
  belonged to Evelyn Marsh", "The consequence for him was immediate" (from the contract's "Whose life
  this shows changed"). Rewritten as acts; the phrases are in the regression test. (this commit)
- **Duplicated sentences, six.** Several are short ("Why would anyone need a second key?", 7 words),
  under the 8-word floor of the copy checker. Needs the manuscript to measure before changing the floor.
- **Catchphrases still repeat** — whether F9's ownership held needs the manuscript's counts.
- **The case**: too many mechanisms, unclear study/ladder geography, timeline. Case-level (Agent 3);
  the ceiling on this case per the reader is 82–84.

**Needed from the laptop:** the new manuscript under `stories/`, so the ten predictions are scored
by count, not by the reader's summary.

### 8.1 The predictions, counted on the manuscript (`stories/story_20260925-1823`)

| prediction | the 69 | the 74 | verdict |
|---|---:|---:|---|
| narrated operations ≤ 3 | 15 | **0** | held |
| no stock line more than twice | 4 | 3 ("Inspector, if I may") | nearly — "Order, Mr. Wentworth insists" 3 → 2, "that's the way of things" 4 → 0 |
| clue recited to the investigator ≤ 5 | ~15 of 24 "Inspector," lines | ~2 of 26 | **held; my proxy was wrong** — the 26 are now questions and address ("Inspector, may I sit?") |
| our brief's words 0 | 5 | 6, all ch 10 | failed — the aftermath rewrite printed; fixed in 475caed2 |
| duplicated passages 0 | 3 | 6 | **failed** — see below |
| the test performed once | ch 8 and 9 | once | held |
| humour moves narrated ≤ 3 | 15 | **0** | held |
| summary endings ≤ 2 | 18 phrases | **1** | held |

**The duplicates.** All six are copies INSIDE one paragraph and none is a whole repeated sentence of
8+ words, so neither `copied_sentence` nor the `noNewDuplicate` guard could see them: a clause doubled
("his shoes catching on the thick Persian carpet …, his shoes catching on …"), a spoken line copied to
the paragraph's front and left in place ("Why would anyone need a second key?" ×2 — the brief's
"the first character of the paragraph is the opening quotation mark" met by copying), a sentence restated
as the next one's opening. Writer or editor is not separable without the checkpoint (INFERRED: the
front-copy is the writer meeting the speech-opening operation; 3 → 6 on the same case may include
editor splices, the guard being blind to them). Built (this commit): six-word runs repeated in one
paragraph are a `copied_sentence` finding and a guard violation; the speech-opening line now says
"the line is said there once". MEASURED: the 74: 7; the 69: 4; other v2-era books 0–2; clock values
exempt.
