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
| 3 | one controlled pair on A, then a read | **done — read 82** | `resume-1790183007808`, £0.29 | §13, §14 |
| 4–6 | voice parameters, ledger guard, blind read | not started | — | — |

---

## §13 THE CONTROLLED PAIR, RUN · 2026-09-23 · £0.29 · `resume-1790183007808`

Seed 50862, `PROSE_V2_DRAFTS=3`, with `461512bd` and `3f41049e`; upstream byte-identical. The book is
`stories/story_20260923-1806/`. Six predictions were stated before the run:

| # | prediction | verdict | evidence |
|---|---|---|---|
| 1 | chapters 9 and 10 carry the writer's own titles | **HELD** | "The Shape of the Truth" / "Dunes Resuming Their Silence" |
| 2 | chapter 9 names Nora, and Nora answers in her own words | **HELD** | Bertram: *"Nora Quayle killed Montague Gaunt"*; Nora: *"Torque says otherwise, but I can't argue the proof."* — the scripted check scored 0 because her name sits in the sentence before the quote; read by hand |
| 3 | chapter 8 does not name her; chapter 10 does not name her again | **HELD** | `namesAsCulprit` false on both |
| 4 | no instruction echoes; no victim among the living in chapter 1 | **HELD** | 0 echoes; the victim does not speak in chapter 1 |
| 5 | ships at ≥ 7,500 words | **FAILED on length** | ships, no stop, **7,404 words**: all three drafts were short (7,380 / 7,234 / 7,129) |
| 6 | cost ≤ £0.45 | **HELD** | £0.29 |

**The selector passed over the highest composite, correctly.** Draft 3 scored 29.72 and draft 2 23.60,
but drafts 1 and 3 both dropped `clue_mechanism_visibility_core`, the compass casing that the
mechanism rests on. Draft 2 was the only one to carry it. **MEASURED**, from the checkpoint.

**Two things for the read to settle, both INFERRED:** the accusation is the operation's own words,
verbatim (the model copies what it is given); and Nora's answer is built on her catchphrase, which a
reader may take as a callback or as the tic again. The catchphrases themselves fell from five lines
said 3+ times (18 sightings) to one ("fact first" ×4).

| instrument | v1 | v2, previous A (read 80) | v2, this run |
|---|---|---|---|
| words | 8,965 | 9,551 | 7,404 |
| register | 0.0552 | 0.0251 | 0.0218 |
| repetition /10k | 96.0 | 7.1 | 5.2 |
| **speech-open share** | 0.174 | 0.266 | **0.279** |
| long-sentence share | 0.028 | 0.055 | 0.045 |

**The read came back at 82** — §14.

---

## §14 THE READ: 82 — THE BEST THIS CASE HAS HAD, AND THE FIRST READ THAT IS NOT AN INJECTOR AUDIT

`stories/story_20260923-1806/chatgpt-review.txt`, merged to the ledger (68 rows). **MEASURED.**

### §14.1 THE SAME CASE, THREE TIMES

| category | v1 (77) | v2 first (80) | **v2 now (82)** |
|---|---|---|---|
| premise | 8 | 8 | 8 |
| opening hook | 7 | 7 | **8** |
| plot structure | 7 | 7 | **8** |
| character clarity | 7 | **8** | 8 |
| dialogue | 7 | 7 | 7 |
| atmosphere | 8 | 8 | 8 |
| clues | 5 | **6** | **7** |
| pacing | 7 | 7 | **8** |
| ending | 6 | **7** | 7 |
| prose | 6 | **7** | 7 |
| **headline** | **77** | **80** | **82** |

**Nothing fell at any step.** 82 beats 71% of all v1 reads and half of September's. The reader's
opening line: *"a clearer, more polished compass draft than the previous one, and the opening is much
better because Montague is already dead when the story begins"* — the victim-as-body fix (`461512bd`),
named by the reader as the improvement.

### §14.2 THE INJECTOR AUDIT IS OVER

CLAUDE.md: *"When a read names no injector, the injector audit is over. Until then a read is an
injector audit and should be scored as one, not as evidence about prose quality."*

This read names **eight** phrases as "generated or accidental". **None is ours.** Checked against the
brief's asks and every contract template phrase: *"For no reason at all"* (×5), *"The truth remained
elusive"*, *"The evidence was mounting"*, *"The result was undeniable"*, *"The silence lingered"*,
*"The room held its breath"*, *"The truth is in the details"*, *"There's always more beneath the
surface"* — all the model's own filler, none in any prompt this pipeline writes. **MEASURED.**

Every v2 injector the previous reads named is gone from this one: no "flat answer", no "six words or
fewer", no "unmeant joke", no "delivered a speech", no chapter titled "The Culprit Revealed", no
"settled outcome", and no victim alive and dead in one scene. **This is the first read in the
project's history that is evidence about the prose and not about the wiring.**

It also updates A_84, which found **11 of 11** reviewer-named "generated lines" were Agent 9
templates. Here it is **0 of 8**. The next lever for that class is the prose-polish instruction, not
another scrubber ([[prose-polish-is-llm-line-edit-pass]]).

### §14.3 BOTH RISKS FLAGGED BEFORE THE READ, CONFIRMED

§13 named two things for the read to settle. It settled both, against us:

- **The accusation is the operation's own words.** Ending 7/10: *"Nora's confession is weak and almost
  jokey."*
- **Nora's answer is built on her catchphrase.** The reader quotes *"Torque says otherwise, but I
  can't argue the proof"* and calls it *"a bit too cute for a murder confession"*.

So the reveal fix worked structurally and not yet dramatically: the culprit answers, and what she says
is too light for the moment. The reader's own remedy is a motive line —*"He would have ruined me. Not
for justice. For sport."* **The operation asks for an answer; it does not ask for what the answer must
carry.** That is the next £0 change, and it is the same compliance law as every one before it: name a
countable thing (the culprit's reason, in her own words, before she is taken away) and it arrives.

### §14.4 WHAT THE READER ASKS FOR NEXT, AND WHOSE IT IS

| ask | whose |
|---|---|
| a precise sightline rule: tilted compass → beach, level compass → office door | **upstream** — the mechanism's physics (Agents 3/3b) |
| one physical clue tying Nora to the paperweight (oil, fibre, the drawer key) | **upstream** — Agent 5's decisive clue |
| a confession that carries a motive | **v2** — §14.3 |
| fewer repeated phrases | **mixed** — catchphrases fell 5 lines → 1 ("Fact first" ×4); the eight new ones are the model's filler |

Chapter 10 the reader now calls *"the best ending of the compass versions"*: *"It does not repeat the
whole proof. It shows absences, changed jobs, financial control, reputation, objects left behind, and
routine returning."* That is the aftermath fix, working, in the reader's words.

### §14.5 STATUS AFTER FOUR READS

v2's four reads: **80, 80, 82, 84 — mean 81.5**, against v1's September mean of 80.8. Still not a
measurable difference in the headline (`rubric-cannot-rank-two-books`: under ~7 marks is unmeasured).
What IS established, on this case, is a **monotone climb across three reads of one contract with no
category falling** — and the reasons for each step are named by the reader and traceable to a commit.

**The ceiling the reader keeps naming is upstream.** Twice now: *"the compass/ledger trick is
interesting, yet it still does not fully prove the murder in a satisfying, physical way"*, and clues
sits at 7/10 while everything around it reaches 8. A_101's remaining recommendations are unchanged,
and one is added:

| # | next | cost | state |
|---|---|---|---|
| 1 | the confession carries the motive, as a countable operation | £0 | **built** — §14.6 |
| 2 | the decisive clue must tie the culprit to the weapon — Agent 5 | £0 | **WITHDRAWN after measuring — §15** |
| 3 | then a pair, and a read | ~£0.30 + a read | next |

### §14.6 THE TWO FREE FIXES, BUILT

**1. The confession carries its reason (v2, `brief.ts`).** The operation asked the culprit to answer
and never said what the answer must carry, so it came out as her catchphrase. It now reads: *"Then X
answers, in their own words on the page, and what X says is the reason: what Y was going to do to
them, or what they stood to lose."*

No motive TEXT enters the prompt. Verified on seed 50862: the motive is in the **bible** (`true`) and
not in the **brief** (`false`) — pasting it into an operation is how A_67 puts a phrase on the page
word for word.

**The brief's own law rejected my first wording.** *"never the evidence, and never a joke"* is a
prohibition, which a v2 brief may not contain; `briefLawViolations` failed the test and the wording is
positive now. The law working on the hand that wrote it.

**2. A clue that ties the culprit to the weapon (upstream, Agent 5).** MEASURED on seed 50862, and the
reason the reader's complaint was exactly right: of fourteen essential clues, **one mentions the
paperweight** (*"visible head wound and bloodied heavy paperweight found at the scene"*) and **zero
tie it to Nora**. Slot 2b already asked for "the unique trace, preparation detail, **or** mechanism
link" — a disjunction, and the model took the abstract branch, producing *"Nora's exclusive access and
knowledge of the ledger and compass usage patterns"*.

The new slot asks for the physical branch alone: *a PHYSICAL trace connecting X to the means of death
itself (<death_method>) or to the place it was kept … Access, knowledge, opportunity and presence do
NOT satisfy this slot.* It describes a construction and gives **no example**, because A_67 is that an
illustrative clue in a prompt is reproduced rather than adapted.

**Reach and how it can be tested.** This is Agent 5, upstream of Agent 9. `RESUME_REDO=prose` restores
the clues artifact byte-identical, so **a prose-only pair cannot test it** — it needs a full run
(~£1.15) or a resume from Agent 5. Fix 1 is testable by the usual ~£0.30 prose pair. Two
implementations of the required-slot list exist (`generateExplicitClueRequirements` in the prompt,
`deriveClueSpec` in `@cml/clue-spec`); the prompt is the write path and has the slot, the deriver is
shadow telemetry and does not (WF-002 — a divergence that feeds no write is absorbed).

Tests: 184 prose-engine, 4 new for the Agent 5 slot, 4,543 across every suite.

---

## §15 THE AGENT 5 HARNESS: THE WEAPON-LINK FIX WAS AIMED ONE STAGE TOO LATE

`npm run -w @cml/worker harness:agent5:direct` runs Agent 5 alone against a frozen CML. Four calls on
seed 50862's CML, pennies, and they withdrew §14.6's second fix.

### §15.1 THE SLOT WORKED, AND WHAT IT PRODUCED WAS FABRICATED

| run | wording asked for | the clue that came back | `sourceInCML` it cited | that path actually holds |
|---|---|---|---|---|
| 1 | a physical trace tying the culprit to the means of death | *"Fingerprint analysis links Nora Quayle's print to the paperweight"* | `constraint_space.physical.traces[1]` | "Ledger entries with fresh ink" |
| 2 | + "must have an innocent explanation available" | *"Nora Quayle's fingerprints are found on the bloodied paperweight"* | `cast[1].evidence_sensitivity[0]` | "Ledger entries" |
| 3 | + "a TRANSFER BETWEEN TWO OBJECTS… a property of the body does not satisfy this slot" | *"Fingerprints on the heavy paperweight match Nora Quayle's"* | `inference_path.steps[2].required_evidence[2]` | witness statements, time of death, compass bearing |

**All three passed every guardrail** (`pass: true`, `deterministicContracts.passed: true`). **MEASURED.**

**The case authors no trace on the weapon.** `constraint_space.physical.traces` is, in full: *"Wear on
compass casing consistent with tilting"*, *"Ledger entries with fresh ink under close inspection"*,
*"Footprints near dunes inconsistent with suspect timeline"*. The only mention of a print anywhere in
the CASE is the ERA's capability line — *"Fingerprinting standard, basic toxicology"* — which says what
the 1930s could do, not what happened here.

So the slot did not surface evidence; **it asked for evidence that does not exist, and the model
invented the genre's default and cited a path that says something else.** Three wordings did not move
it, including one that ruled out properties of the body in as many words.

### §15.2 WHAT THIS SETTLES, AND WHAT IT COSTS TO HAVE LEARNED IT

**Withdrawn as harmful (CLAUDE.md — *surface anything withdrawn because building it would have caused
harm*).** The slot is removed and the reason is recorded where it stood. A clue the case cannot
support is a fair-play defect wearing a citation: the reader would meet a fingerprint on the murder
weapon, and it would also close the case before the discriminating test could matter — undoing §6's
work on the reveal.

**Three findings worth more than the fix:**

1. **The requirement belongs to Agent 3**, which authors `constraint_space.physical.traces`. Once the
   case carries a trace on the means of death, the existing culprit-direct and mechanism slots surface
   it with no new slot at all. This also explains the reader's complaint exactly: *"the paperweight is
   introduced well… but the reveal does not really use it"* — the case never gave it anything to use.
2. **Asking any agent for evidence its input does not contain produces fabrication, not absence.**
   The model does not answer "there is no such trace"; it invents one and cites a neighbour. This is
   the shape to expect from every "generate a clue that…" requirement whose anchor is missing.
3. **`sourceInCML` is not checked against what the path holds.** Agent 5 has strict source-path
   machinery — the harness log shows it auto-repairing other clues' paths — and it passed a clue whose
   citation supports nothing like it, three times. A citation nothing verifies is
   [[restated-facts-must-be-generated-and-checked]] in a new place, and it is cheap to close: compare
   the clue's key terms against the text at the path it names.

### §15.3 THE ROUTE ITSELF

`RESUME_REDO=clues` works and keeps the CML frozen, but re-runs **nine** stages — clues, fair-play,
profiles, locations, temporal, world, outline, geometry, prose. The outline and profiles regenerating
means a book from that route is not one lever from the 82 and cannot be read against it. It could not
be priced from the logs (`logs/llm.jsonl` carries no token counts and the original run has rolled out
of the window); bounded between the £0.32 prose pair and a full book. **The single-agent harness is
the right instrument for an upstream prompt change, and it cost pennies to overturn a fix.**

### §15.4 THE RECOMMENDATIONS, REVISED

| # | next | cost | state |
|---|---|---|---|
| 1 | the confession carries its reason (v2) | £0 | **built** — §14.6, untested on a book |
| 2 | ~~the weapon-link clue slot in Agent 5~~ | — | **withdrawn — §15.1** |
| 2a | Agent 3 authors a trace on the means of death in `constraint_space.physical.traces` | £0 to build, needs a full run to test | not started |
| 2b | check `sourceInCML` against the text at that path | £0 | not started |
| 3 | a prose pair on A for fix 1, then a read | ~£0.30 + a read | next |
