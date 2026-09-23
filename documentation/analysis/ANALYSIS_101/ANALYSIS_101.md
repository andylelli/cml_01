# ANALYSIS_101 — Prose Engine v2 against v1: the first external reads

**2026-09-23. Cost of this analysis: £0.** Everything below is drawn from the external-read ledger
(`eval/results/external-read/manifest.json`), the manuscripts on disk, the run checkpoints and the
board (PLAN-TO-90 §22–§30). The ledger was regenerated for this analysis and differs from its last
commit by exactly ten rows: **nine September reads that had never been merged** — the three v2 reads,
both v1 arms (A 77, C 87), and four more — and **one headline corrected** (`story_20260724-1747`,
81 → 79, §10). Every claim carries CLAUDE.md's label: **MEASURED**, **INFERRED** or **ASSUMED**.

---

## §0 THE ANSWER

**v2 is not yet a better book by the only instrument that counts.** The three v2 reads are 80, 84
and 80 — mean **81.3** — against v1's September mean of **80.8** (n=16, sd 3.3). The one controlled
pair moved **77 → 80**, within the noise of a single read. **MEASURED.**

What v2 improved, it improved by a wide margin, and the reader did not follow:

- machine-register fell **65–89%** on every book, far outside the range the calibration was fitted
  on. The calibration predicts these books at **88–90**; the reader gave them **80–84**. §4.
- the fair-play reveal now attributes the act on **21 of 21** drafts, against **35%** of v1's
  shipped books that never do. The reader's `clues` mark is the one category that moved: **+0.96**
  against September's mean. §2, §7.

What cost v2 its marks is identifiable, and a third of it is **v2's own**: the reads name our prompt
vocabulary on the page, the dead man telling jokes, and — the one v2-specific defect still open — a
reveal smeared across chapters 8, 9 and 10 by v2's own role and title wiring. §5, §6.

**So the verdict is: a better engine that has not yet written a better book, with the reasons on the
page.** The fixes for the injectors are committed (`461512bd`); the reveal-structure fix is designed
here and not built; and the next paid run is one controlled matched pair that tests both. §9.

---

## §1 WHAT WAS COMPARED, AND HOW MUCH EACH COMPARISON IS WORTH

| comparison | books | worth |
|---|---|---|
| **controlled matched pair** — byte-identical upstream, all four Agent-9 parameters recorded | A: seed 50862 | the only clean head-to-head |
| **uncontrolled matched pair** — same upstream, but `humourLevel`, `tone` and `narrativeStyle` never recorded and defaulted in the v2 arm (the run printed `DEFAULTS`) | C: `canary_1789232316543` | indicative; the v2 arm wrote to a different voice contract than v1 had |
| **v2 read, no v1 read** — B's v1 manuscript has only a humour review, no headline | B: `canary_1789497521861` | against the distribution only |
| **v2 against v1's distribution** | all three | n=3 against n=16 (September) and n=55 (all ≥ 8,000 words) |
| **the reader's own head-to-head statements** — the reads are in one long conversation and it compares drafts it has seen | all three | qualitative, and not blind |

Three caveats that apply to everything below:

- **The reads are not blind.** The reader compares each draft to earlier ones by name ("better than
  the earlier compass draft"). That makes direction easier to see and makes each mark partly
  relative. **INFERRED** from the text of all three reads.
- **B's v2 book is 7,195 words**, under CLAUDE.md's 8,000-word floor for correlations. It is included
  in the headline comparison and excluded from nothing else, because no correlation is fitted on v2.
- **The ledger's pairing was audited before use.** 60 of 67 rows name the manuscript's own cast in
  their read; 5 carry no roles block; **2 come from files holding reads of more than one book**, and in
  both the folder's own book is the last read. The ledger's last-read rule (W1) pairs both correctly —
  by the owner's habit of pasting the newest read last, not by any check. §10 corrects the record on
  one of them. **MEASURED** (`audit-ledger-pairing.mjs`, scratch).

---

## §2 THE READS

### §2.1 The headline

| | n | mean | sd | median | range |
|---|---|---|---|---|---|
| v1, every read ≥ 8,000 words | 55 | 77.9 | 6.7 | 79 | 52–87 |
| v1, September reads ≥ 8,000 words | 16 | **80.8** | 3.3 | 82 | 76–87 |
| **v2** | 3 | **81.3** | 2.3 | 80 | 80–84 |

| v2 book | read | above what share of September's v1 reads |
|---|---|---|
| A `resume-1790099060243` | 80 | 44% |
| B `resume-1790099653544` | 84 | 75% |
| C `resume-1790099847162` | 80 | 44% |

**MEASURED.** v2 sits on v1's September mean. `rubric-cannot-rank-two-books` says any A/B delta under
~7 marks is unmeasured, so the honest statement is not "no change" but **"no measurable change"**.

### §2.2 By category

| category | v1 September mean | v2 A | v2 B | v2 C | v2 mean | Δ |
|---|---|---|---|---|---|---|
| premise | 8.19 | 8 | 8 | 8 | 8.00 | −0.19 |
| opening hook | 7.63 | 7 | 8 | 8 | 7.67 | +0.04 |
| plot structure | 7.56 | 7 | 8 | 7 | 7.33 | −0.23 |
| character clarity | 7.63 | 8 | 8 | 8 | 8.00 | +0.38 |
| dialogue | 7.19 | 7 | 8 | 7 | 7.33 | +0.15 |
| atmosphere | 8.06 | 8 | 8 | 8 | 8.00 | −0.06 |
| **clues** | **6.38** | 6 | 8 | 8 | **7.33** | **+0.96** |
| pacing | 7.56 | 7 | 8 | 7 | 7.33 | −0.23 |
| **ending** | 6.63 | 7 | 7 | 6 | 6.67 | **+0.04** |
| **prose** | 6.38 | 7 | 7 | 6 | 6.67 | **+0.29** |

**MEASURED.** Two readings, both **INFERRED**, neither established at n=3:

- **`clues` is the one category that moved by a whole mark.** It is also the category v2's contract
  targets hardest — clue ownership, orphan obligations excluded, a fair-play gate that stops a book
  that never attributes the act.
- **`prose` barely moved (+0.29) while register fell 65–89%.** This is the section of the table that
  should have moved most if register measured what the reader marks as prose. §4.

---

## §3 THE PAIRED ARMS

Same case, same outline, same clues, same cast — only Agent 9 differs.

| category | A v1 → v2 (controlled) | C v1 → v2 (uncontrolled) |
|---|---|---|
| premise | 8 → 8 | 9 → 8 |
| opening hook | 7 → 7 | 9 → 8 |
| plot structure | 7 → 7 | 8 → 7 |
| character clarity | 7 → **8** | 9 → 8 |
| dialogue | 7 → 7 | 8 → 7 |
| atmosphere | 8 → 8 | 9 → 8 |
| clues | 5 → **6** | 8 → 8 |
| pacing | 7 → 7 | 8 → 7 |
| ending | 6 → **7** | 8 → **6** |
| prose | 6 → **7** | 8 → **6** |
| **headline** | **77 → 80** | **87 → 80** |
| register (manuscript) | 0.0707 → 0.0251 | 0.0580 → 0.0116 |

**MEASURED.** Read together:

- **A gained exactly where v2 aims** — character, clues, ending, prose — and lost nothing. The
  reader's own words: better than the earlier compass draft, prose and atmosphere improved, the
  compass demonstration clearer. One pair, +3: consistent, not significant.
- **C lost broadly and lost most on ending and prose.** C's v1 arm was the **lowest-register book of
  all 55** (0.0580) and the **highest-scoring** (87) — the calibration's best case — and v2 took its
  register to 0.0116 and its read down 7. The reader called it a step backward in human richness and
  ending structure. Two confounds, both real: the voice parameters defaulted (§1), and the read names
  v2-specific injectors that cost marks (§5).

---

## §4 THE INSTRUMENTS DECOUPLED FROM THE READER

The selector's composite weights machine-register at **−3**, the heaviest term, because across v1's
books register was the only validated predictor of the mark. Fitted again on all 55 v1 reads with at
least 8,000 words:

- register ranges **0.0580–0.1935**, mean 0.1229
- Spearman ρ(register, headline) = **−0.577**
- OLS: headline = 91.4 − 109.9 × register

| v2 book | register | z against v1 | predicted | read | residual |
|---|---|---|---|---|---|
| A | 0.0251 | −2.9 | 88.6 | 80 | **−8.6** |
| B | 0.0344 | −2.6 | 87.6 | 84 | **−3.6** |
| C | 0.0116 | −3.3 | 90.1 | 80 | **−10.1** |

**MEASURED: no v1 book has register as low as v2's *highest*; the calibration over-predicts all three
v2 books, by 7.4 marks on average.**

**INFERRED — this is Goodhart's law, and the mechanism is visible.** Across v1's books low register
travelled with better books because both followed from a cleaner generation. v2 drives register down
*directly* — the brief asks for concrete sentences and the selector prefers the draft with fewer
abstract ones — so register moved and the causes of the mark did not. What the reader docked v2 for
(§5) is almost entirely invisible to a sentence-level abstraction count: a double reveal, a motive
stated as a category, a catchphrase said seven times, our own wording on the page.

**Consequence for the selector — INFERRED, cheap to fix:** between two v2 drafts that are both far
below the calibrated range, a register difference is unmeasured, yet it still carries the composite's
heaviest weight. Clamping register's contribution at the calibrated floor (0.058) would stop the
selector preferring ever-lower register once it no longer predicts anything. Recommendation 2, §9.

---

## §5 WHAT THE READER NAMED, CLASSIFIED

Every "fastest fix" in the three reads, sorted by whose defect it is.

| class | what the reader named | book | state |
|---|---|---|---|
| **v2 injector** | the victim alive then dead in chapter 1 ("two scene versions spliced") | A | **fixed `461512bd`** — the victim is now "The body", never on the page among the living |
| **v2 injector** | "flat answer" ×4, "six words or fewer", "delivered a speech" | C | **fixed** — the wit moves are described, never named; the echo checker catches a relapse |
| **v2 injector** | "Leonard's unmeant joke" ×7 — the dead man carries the comic beat | B | **fixed** — the victim owns no wit shape and no depth beat |
| **v2 injector** | chapter 10 titled "The Culprit Revealed" after chapter 9 revealed | C | **fixed** — the writer titles an aftermath chapter whose outline title announces a reveal |
| **v2 structure** | reveal across chapters 8, 9 **and** 10; chapter 9 "Clearing the Innocent" does the reveal | B, C | **open — §6** |
| **v2 structure** | the reveal is thin: it lists the evidence, then states the verdict; no confession or breakdown | A | **open — §6** |
| pipeline | catchphrases — "Fact first", "Torque says otherwise" and three more, every chapter | A | **detected** — the catchphrase checker lists the reader's five, in order; v1 had the same class (`voice-fragments-copied-not-matched`) |
| pipeline | the false suspects exist only to be cleared; give each a scene of their own | A, C | open — pipeline-wide, not v2's |
| upstream | the compass needs a sightline map; one physical tampering detail; one decisive weapon link | A, B | open — mechanism design, Agents 3/3b/5 |
| upstream | the motive is abstract ("fix the time"; "preserve the school") | B, C | open — CML |
| upstream | Percival's alibi covers the apparent time and not the true one | C | open — case timeline |

And what the reader singled out to **keep**, each a v2 operation:

- the discriminating test performed on the page (C, B) — §10.9's "a named witness says what they
  believe, then the test is performed … and only after it is watched does anyone say how it works";
- a chapter 10 that is aftermath, not re-argument (A);
- the Violet/Millicent exchanges (B) — the wit shapes, when the labels do not leak.

**MEASURED** (the reads' own lists). Of the defects: **four were v2's injectors and are fixed**; **two
are v2's reveal structure and are open**; the rest are upstream or were v1's too. Per CLAUDE.md these
reads are still **injector audits** — they named injectors — so they are evidence about v2's wiring
before they are evidence about v2's prose.

---

## §6 THE ONE v2-SPECIFIC DEFECT STILL OPEN: THE REVEAL

v2's roles put the test in chapter 8, the reveal in 9 and the aftermath in 10. On all three books the
**outline's own titles disagree**: chapter 9 is "Clearing the Innocent", chapter 10 is "Confrontation
and Aftermath" / "The Rector's Unimpeachable Word" / "The Culprit Revealed". The writer is handed both
the role and the title, and satisfies both.

Four mechanisms, each **INFERRED** from the prompt text and the reads, each cheap to change:

1. **The reveal chapter keeps a clearing title.** Chapter 9 is told "This chapter is the reveal" under
   the heading "Clearing the Innocent", so it clears the innocent *and* names the culprit — the
   reader's complaint on B and C, verbatim.
2. **The aftermath operation restates the reveal.** Chapter 10's contract opens with *"Opens on the
   settled outcome: Nora Quayle was exposed in chapter 9."* That is an instruction to say who did it
   again, and B's chapter 10 does — including the phrase "the outcome was settled", which the reader
   quoted back as scaffolding. **MEASURED** that the phrase leaked; the echo checker now catches it;
   the instruction that causes it is still in the prompt.
3. **The reveal operation is complied with literally.** §27 asked for *one sentence* stating as fact
   that the culprit killed the victim, to cure v2's "placement, not attribution" reveals. It worked —
   21 of 21 drafts — and on A the reveal became that sentence: the evidence listed, then the verdict,
   no confession, no breakdown. The compliance law cuts both ways: ask for a countable sentence and
   you get the sentence.
4. **The test chapter accuses.** Chapter 8 performs the test, and on B the accusation follows the test
   naturally, so the reveal happens a chapter before its contract says it should.

**v1 is not the standard to beat here.** A's v1 arm had the same fault — the reader docked it for
repeating the proof after the confession. C's v1 arm did not: the 87 read praised a chapter 10 that
was "genuinely aftermath rather than a second reveal". So v2 fixed this for no book and made one worse.

---

## §7 WHAT v2 DEMONSTRABLY DOES BETTER

| | v1 | v2 | label |
|---|---|---|---|
| every paid run delivers a whole book | — | **12 of 12** since the continuation loop (`aa674393`); the one run before it shipped 2 chapters of 10 | MEASURED |
| deterministic prose writers | ~10 (A_84 traced every reviewer-named generated line to them) | **0** by construction | MEASURED |
| the reveal attributes the act | **65%** of 51 shipped books (§24.3) | **21 of 21** drafts since §27 | MEASURED |
| a fair-play breach stops the run | release gate stopped **44 of 51** shipped books before §24 | stops only "reader never told who did it" | MEASURED |
| `clues` mark | September mean 6.38 | 7.33 (n=3) | MEASURED, not established |
| cost of the prose stage per book | ~£0.45 (CLAUDE.md, the matched-pair figure) | **£0.34** at three drafts (mean of 8 runs) | MEASURED (v2), recorded (v1) |
| drafts per book | 1 | 3, chosen by contract fitness then composite | MEASURED |
| machine-register, repetition, long sentences, wit | — | better on every paired arm | MEASURED — and §4 is why this no longer means what it meant |

**Spend on v2 to date: £3.49 across 13 paid runs** (costs audited at each run, PLAN-TO-90 §22–§30).
The three reads cost nothing.

---

## §8 WHAT IS NOT SETTLED

- **Whether v2 writes a better book.** n=1 controlled pair, +3, inside one read's noise.
- **Whether the §5 fixes recover C's marks.** They are committed and have never been read.
- **How much of C's −7 is the defaulted voice parameters.** Neither B nor C can be made a controlled
  pair without their original `humourLevel`, `tone` and `narrativeStyle`, which were never recorded.
- **Whether best-of-three helps the reader.** The selector demonstrably picks the draft that ships
  (§26, §29); whether that draft reads better has not been measured.
- **Whether any category, by itself, moved.** `clues` +0.96 at n=3 is a direction, not an effect.

---

## §9 RECOMMENDATIONS, IN ORDER

| # | what | cost | why first |
|---|---|---|---|
| 1 | **Fix the reveal structure (§6).** The reveal chapter and the aftermath chapter get role-true titles; the aftermath contract stops restating the exposure ("opens after the arrest; the culprit's name is no longer the subject"); the reveal operation keeps its sentence and adds **the culprit's answer on the page** (a confession, a denial, a breakdown — one line spoken by the culprit); chapter 8 is told the test proves and does not name. Test against the three read outlines. | £0 | the one v2-specific defect the reads name that is still in the prompt |
| 2 | **Clamp register in the composite at the calibrated floor (0.058)** so the selector stops preferring ever-lower register where it no longer predicts. | £0 | §4 — the heaviest weight is extrapolating |
| 3 | **One controlled matched pair on A** with `461512bd` + #1 + #2, then a read. | ~£0.35 + a read | A is the only project with all four parameters; one read tells whether the injector fixes and the reveal fix recover marks |
| 4 | **Record the voice parameters for B and C, or choose new controlled seeds.** Every future pair should print no `DEFAULTS` line. | £0 | without it, two of three pairs are confounded |
| 5 | **Guard the ledger's pairing.** Select the read whose roles block names the manuscript's cast; warn when none does. | £0 | §1 — two files hold reads of other books and the ledger is right by habit |
| 6 | **Ask the reader for a blind read** of one v1/v2 pair, in a fresh conversation. | a read | §1 — every read so far knows it is reading a successor |

**Recommended against, with the reason:** another run on B or C before #4. Their v2 arms cannot be
separated from their defaulted voice, so a read of either settles nothing about Agent 9.

---

## §10 CORRECTIONS TO THE RECORD

1. **"Three reads of one book — 79, 82, 87 after repairs"** (A_99 §9.1, PLAN-TO-90 §21, and the
   `selector.ts` header). **Wrong in its description.** `stories/story_20260912-1815/chatgpt-review.txt`
   holds three reads of **two** books: 79 and 82 are reads of a ballet-intermission book whose drafts
   live in `story_20260911-2112` and `story_20260912-1507`; **87 is an as-written read of the Lockwood
   book in that folder** (`canary_1789232316543`; the manuscript's mtime equals its generation time).
   **Consequences:** the 87 is real and is C's v1 arm; the best-ever-stack arithmetic stands; and W1's
   rho correction (0.524 → 0.571) was the correction of a *mispairing* — before W1 the Lockwood
   manuscript was scored with the ballet book's 79 — which strengthens it. **MEASURED.**
2. **`story_20260724-1747`** has the same shape: its first read (81) names Harcourt, Marwood and Fenwick,
   none of whom are in the manuscript; its last (79) names the book's own cast. Before W1 that row was
   mispaired too. **MEASURED.**
3. **"Register falls 89% on the book that read 87"** (PLAN-TO-90 §30) was reported as the arm to
   notice. The read of that arm fell 7. The instrument moved; the reader did not follow. §4.

---

## §11 STATE

| | |
|---|---|
| engine switch | `PROSE_ENGINE=v2`, default OFF; v1 untouched |
| last commit | `461512bd` — the injectors the three reads named, plus the instruction-echo and catchphrase checkers |
| tests | prose-engine 172, worker 884, all passing |
| checkers, measured | instruction echo: 12/12 true positives on the three read books, 0.18 false findings per book on the 51 v1 books that never saw the brief |
| spend on v2 | £3.49 over 13 paid runs; three reads at no cost |
| next paid step | recommendation 3, after 1 and 2 |

---

## §12 STATUS OF THE RECOMMENDATIONS

| # | recommendation | state | commit | measured at £0 before the paid run |
|---|---|---|---|---|
| 1 | the reveal structure | **built** | this commit | on all three read books: the reveal chapter ("Clearing the Innocent") is untitled and told it is where the culprit is named; the aftermath keeps a title only if it does not announce a reveal (A's and C's lose theirs, B's is kept); the aftermath opens once the case is closed and mentions the proof in one clause or not at all; the test chapter ends on its result; the reveal adds the culprit's own answer; the brief's law is clean |
| 2 | register no lower than 0.058 in the composite | **built** | this commit | replayed over the nine saved drafts: composites below the floor fall by 1.0–3.6, **no choice changes** — those were decided on contract fitness |
| 3 | one controlled pair on A, then a read | **next** | — | budget £0.50 |
| 4–6 | voice parameters, ledger guard, blind read | not started | — | — |
