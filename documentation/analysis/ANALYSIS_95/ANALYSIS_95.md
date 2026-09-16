# ANALYSIS_95 — THE ROAD TO 88–90

**Opened 2026-09-15.** Cost: £0. Sources: the external-read ledger (61 reads with a category table,
34 of them with a manuscript on disk above 8,000 words), the 15 reviewer texts on disk, the 87/100
read's recommendations (A_90 §12), the reader's first humour verdict (A_94 §8.1), and the instruments
(`machine-register`, `repetition-density`, `wit-density`, the past-anchor probe) run over every book
that has both a read and a manuscript.

This is a plan, and every claim in it is labelled. Nothing in it is built.

---

## §0 THE BAR, AS ARITHMETIC — MEASURED

The reader's headline is the ten category marks summed, plus an offset the reader adds for the whole.

| | value |
|---|---|
| reads with a full category table | 61 |
| best-ever mark in each category, summed | **85** |
| top-15 books: mean category sum | 78.3 |
| top-15 books: mean headline | 83.9 |
| top-15 offset (headline − sum) | **+5.6** (all reads: 0 to +8, mean 3.9) |
| best headline ever | 87 (once, 2026-09-12); 86 twice |

**A perfect stack — every category at its best-ever mark in one book, plus the mean offset — projects
to 88.9.** That has never happened; the best-ever marks have never co-occurred. So 88 is reachable by
consistency alone, and **90 requires a mark no book has ever received.**

Five categories have never scored a 9 in 61 reads:

| category | max | top-15 mean | headroom to 9 |
|---|---|---|---|
| **prose** | 8 | **6.93** | 2.1 |
| **dialogue** | 8 | **7.20** | 1.8 |
| ending | 9 | 7.73 | 1.3 |
| clues | 9 | 7.87 | 1.1 |
| pacing | 8 | 7.93 | 1.1 |
| opening hook | 8 | 7.93 | 1.1 |
| character clarity | 8 | 8.00 | 1.0 |
| plot | 9 | 8.00 | 1.0 |
| atmosphere | 9 | 8.13 | 0.9 |
| premise | 9 | 8.60 | 0.4 |

**Prose and dialogue are the whole gap.** Together they sit 3.9 marks below a 9 on the top books; the
other eight categories together sit 8.5 below, but spread thin. Bring prose and dialogue to 8 on a
book where the rest hold at their top-15 means and the sum is 80.2 → headline **≈ 86**. Bring one of
them to 9 → **≈ 87–88**. Both to 9 with two other 9s → **≈ 90**.

---

## §1 WHERE WE FALL SHORT — the reader's words, counted

Fifteen reviewer texts on disk, 2026-08-23 to 2026-09-13. A theme is counted once per review.

| complaint | reviews | last 10 | category it costs |
|---|---|---|---|
| **scaffold / generated phrasing** | **15 of 15** | 10/10 | prose |
| **Ch.9/10 recap, reveal residue, "trim back to aftermath"** | **14 of 15** | 10/10 | ending, pacing |
| timing / clock maths contradict | 12 of 15 | 8/10 | clues, plot |
| mechanism not proved, not visual, "one clean sentence" | 7 of 15 | 6/10 | clues, ending |
| motive generic / relationship not alive, "dramatise earlier" | 7 of 15 | 6/10 | character life, character |
| cast-name collision | 5 of 15 | 3/10 | character clarity |
| evidence circles the same information | 3 of 15 | 3/10 | pacing |

The reader also writes, in every recent review, a sentence of the form *"with X, Y and Z fixed this
could reach 87–91."* Across fourteen of those sentences the X, Y, Z are the first five rows of the
table above, and nothing else. **The reader has told us the road fourteen times.**

What the reader says about the two gap categories, last eight reads:

- **prose** (5, 6, 6, 6, 7, 7, 7, 7): *"still has generated/scaffold lines"* — every single time. The
  7s are *"fewer scaffold artifacts than before, but several remain."* An 8 has been given only to
  books the reader called clean of them. **Prose is capped by one defect class, not by quality.**
- **dialogue** (7, 7, 7, 7, 7, 7, 8, 8): *"decent voices"*, *"distinct enough"*, and the 8s are *"more
  natural social voices than usual"*, *"good dry voices"*. The humour read (A_94 §8.1): *"several
  characters speak in similar polished aphorisms."* **Dialogue is capped by sameness, and the two 8s
  were the two books the reader found witty.**

---

## §2 WHAT THE INSTRUMENTS SAY — MEASURED, n = 34, `words ≥ 8000`

Spearman ρ of each instrument against the external marks. Critical |ρ| ≈ 0.34 at n = 34.

| instrument | headline | prose | dialogue | character | pacing | hook | ending | clues |
|---|---|---|---|---|---|---|---|---|
| **machine-register rate** | **−0.60** | −0.42 | −0.35 | **−0.71** | −0.37 | −0.20 | −0.12 | −0.30 |
| wit per 10k | +0.32 | +0.22 | +0.20 | **+0.35** | **+0.37** | +0.05 | +0.29 | +0.33 |
| repetition per 10k | −0.13 | −0.07 | −0.15 | −0.15 | −0.18 | −0.32 | −0.23 | **−0.35** |
| dialogue share | +0.20 | +0.12 | +0.01 | +0.28 | +0.19 | −0.13 | +0.24 | +0.35 |
| past-anchors per 10k | +0.08 | +0.05 | +0.01 | −0.15 | +0.06 | +0.05 | +0.17 | +0.11 |
| length | −0.16 | −0.29 | −0.13 | −0.17 | +0.07 | −0.13 | +0.39 | +0.18 |

Three things this table settles:

1. **Machine register is the lever, and it is stronger against *character* (−0.71) than against
   prose.** A book full of stative, abstract, noun-less narration reads as a book whose people are
   not there. It is still telemetry nothing acts on (A_88's finding, unchanged).
2. **Wit is now a real signal** — the first time any humour measure has shown one. It reaches
   significance on character and pacing and sits just under it on the headline. The two dialogue 8s
   in §1 are the two witty books.
3. **Past-anchors show nothing, because our books have none** — 13 of 20 at zero (A_93). An
   instrument cannot correlate with a constant. That is not evidence depth does not matter; it is
   evidence the lever has never been pulled.

Repetition's −0.35 on clues and −0.32 on hook are the "evidence circles" and "busy opening" complaints
in numbers.

---

## §3 THE FIVE MOVES

Ranked by (marks available) × (evidence the mechanism is understood). Each names the complaint it
answers, what is already built, what is missing, and the check that settles it without a reader.

### M1 — Prose to 8, then 9: act on the register instrument · the whole prose gap

**The complaint:** "generated / scaffold lines", 15 of 15. **The mechanism, MEASURED:** three
sources. (a) Our own injectors — A_84 traced all 11 of one read's "generated lines" to Agent 9
templates; the latest read still named one (*"shifted the reasoning"*, `injection-templates.ts:168`).
(b) Copied sentences — A_94: five of six flagged phrases were the model's own lines repeated across
chapters. (c) Register sentences — stative verb, abstract subject, no concrete noun, no sensory word:
*"The mechanism behind it all remained hidden, the contradiction unresolved."* The instrument scores
these; they are what the reader calls "generated" when no template is involved.

**Built:** the repeat ban list (R5) for (b); the injector paraphrase registry and A_84's audit for (a);
the instrument for (c), acting on nothing.

**Build — the register ban, by the same shape as R5:** score every narration sentence of the
chapter's *first draft*; hand the polish pass the top-N (score ≥ 3) as a numbered list with one
instruction — *rewrite each so it has a concrete noun and something a person does; keep the fact* —
and re-score. An operation, not a rate. Expected reach: the top-15 books run 7.6–12.2%; the reader's
prose-8 books sit near 10%, prose-4 near 16% (register memory). Target: **every chapter under 8%,
book under 7%.**

**Check:** register rate per chapter in the ship-check, and the reader's prose note losing the word
"generated". **Prediction for the first book under 7%: prose 8.** Two reads at 8 → build for 9: the
same list, floor 2, with sensory detail required.

### M2 — Ending to 9: plan the aftermath, don't just defend it · ending + pacing

**The complaint:** 14 of 15 — recap, reveal residue, "trim Ch.10 to pure aftermath". **The mechanism,
MEASURED (A_94 §3):** 48 of 50 stored outlines end on the reveal scene; only 2 contain an aftermath
scene at all. Every "Ch.10 aftermath" the reader has ever seen was Agent 9 improvising one against an
outline that ordered a reveal — and 15 of 50 also ordered the alibi walk-back there.

**Built:** B3 (reveal never on the aftermath chapter), R1 (clearances stripped), R2 (aftermath purpose
replaces the scene's), `AGENT9_AFTERMATH_POSITIVE_JOB`. All defensive.

**Build — Agent 7 plans the aftermath:** the outline schema requires the final scene to be
`arcPosition: aftermath`, after the reveal scene, with a purpose drawn from consequence (what the
truth cost whom) — and the clearances scene required *before* the discriminating test. Deterministic
check at outline validation, feeding the existing retry. Fires on 48 of 50 today — which under B1 says
it must be a *repair*, not a gate: if the model ends on the reveal, append the aftermath scene from
a template of *consequence* fields, not prose.

**Check:** final scene `arcPosition`; Ch.10 with zero alibi and zero evidence-chain sentences (A_94's
scorer). **Prediction:** the reader's "trim Ch.10" sentence disappears; ending ≥ 8 on the next three
reads, 9 on one.

### M3 — Clues to 9: the mechanism in numbers, then shown · clues + plot

**The complaint:** timing 12 of 15; "not proved / not visual" 7 of 15; the 87 read's #1. **The
mechanism:** A_90 found the cases coherent and the prose compressing three locked values into one
clause; A_94 found a coherent device reported as a list. `AGENT9_REVEAL_ARITHMETIC` renders the three
steps *from the numbers* — for clocks only. `AGENT9_TEST_AS_EVENT` (R3) asks for the demonstration;
on its first book the model demonstrated and explained in the wrong order.

**Build:** (a) extend reveal arithmetic to the spatial and behavioural axes — real length, mirror
position, recess depth rendered deterministically as the reveal's three sentences, the way the clock
offset is; (b) make R3's ordering a post-check on the DT chapter: if a sentence explaining the
mechanism precedes the first demonstration sentence, one targeted regen with that fact only.

**Check:** the reader's "did the mirror… / did the clock…" question-shape absent. **Prediction:**
clues ≥ 8 on the next three reads.

### M4 — Dialogue to 8, then 9: differentiate, and keep the wit · dialogue

**The complaint:** "decent voices", "similar polished aphorisms". **The mechanism, MEASURED:** the two
dialogue 8s are the two witty books; the reader ranked the 1358 cast's comic voices in exactly Agent
2b's order (A_94 §8.1) — the profile layer works; what it lacks is *difference in kind*. The two
shapes (R4) are asked of the chapter, not of a person; the flat answer landed in 5 of 10 chapters.

**Build — R7, shape by register:** the flat answer belongs to the `dry_wit`/`understatement`
character, the retort to the `sardonic`/`polite_savagery` one, and the `none` character gets a
line that is *unintentionally* funny (the reader's own suggestion for Agatha). Three operations, each
owned. Plus the humour band left at `classic`/`sharp` by axis: `sharp` for authority and identity
(social axes), `classic` otherwise.

**Check:** wit ≥ 41.4 (canon median) with the reader's humour mark ≥ 7; per-character shape counts in
the ship-check. **Prediction:** dialogue 8 on the next witty book; 9 needs the reader to write the
word "distinct" unprompted.

### M5 — Character life: a specific, dated motive · character + the supplementary mark

**The complaint:** 7 of 15 — *"motive too broad… make it specific: Edmund discovered Adela had
mortgaged the theatre twice."* **The mechanism, MEASURED (A_93):** 0 of 4,700 profile field values
carry a date; the one lever that asked for a dated event moved a field 0% → 37%; the formative
incident now varies (1/5 share a stem) but reaches the page for 1 of 5 characters.

**Build:** the culprit's motive at Agent 3 must name ONE dated act — what the victim did or found,
and when — and Agent 7's `MOTIVE_PLANT_BEFORE_REVEAL` must plant *that act*, not the motive's
category. Same instruction shape as `sharedHistory`. And A_93 D1 (a place with a past) once
`location_profiles`' priority is settled.

**Check:** the motive string carries a date/age and a verb; the reader's "generic" absent.
**Prediction:** character life ≥ 8.

### M6 — The middle of the book has no turn · plot + pacing · added 2026-09-16

**The complaint, as the reader phrases it:** *"chapters 3–8 circle the same mirror/panel information"*,
*"the evidence repeats"*, plot 7, pacing 7. Never "obvious culprit" — the rubric has no misdirection
category, so this defect produces a positive sentence and a 7 (REVIEW_14's rule).

**The mechanism — MEASURED on the bookshop book (`story_20260907-2203`, seed 63935) and the corpus:**

Three vocabularies claim each chapter's job, and the prose obeys the concrete one.

| vocabulary | owner | on the bookshop book | across the corpus |
|---|---|---|---|
| Golden-Age **beat label** on the scene | Agent 7 | scene 6 = `false_solution` | present in 50 of 51 outlines; near-fixed sequence |
| scene **purpose** | Agent 7 | *"Reveal physical evidence linking murder weapon to concealed mechanism"* | `false_solution` scenes whose purpose names an innocent accused: **23 of 51 (45%)**; `alibis` scenes whose purpose has the second incident: **2 of 51 (4%)** |
| **archetype** by chapter position | Agent 9 `buildMacroArcPlan(chapterCount)` | ch5 RED_HERRING, ch6–7 REVERSAL — delivered to every prompt by label | positional: drops CONFRONTATION on 10-chapter books; ch10 "confession or arrest" against B3's aftermath |

The bookshop prose: chapters 3–7 are five consecutive "reveal evidence linking Percival" scenes;
**0 sentences in ten chapters entertain any other suspect; 0 theories overturned; new-content rate
60% → 25% by chapter 7.** RED_HERRING and REVERSAL were in the prompt and answered by clue reveals.
Nothing enforces any of it: `lint.ts:817` — *"archetype validator disabled (false positives). Enforced
via prompt injection only."* The label is worn, not done. A label is a rate; the purpose is an
operation.

**Build — three changes, one owner:**

1. **Agent 7: the beat's job becomes REQUIRED, COUNTABLE fields on the scene**, validated by the
   existing outline-completeness contract (which already requires `pivotElement`, `factEstablished`,
   `redHerringPlacement` and passed 10/10 on 1358 — the machinery exists):
   - `false_solution` → `accusedInnocent` (a cast name, not the culprit) and `flawFound` (one
     sentence); the purpose must open *"Accuse <name> …"*.
   - `alibis` → `secondIncident` (a dated event: a threat, a theft, a second discovery).
   - `motives` → `suspicionShiftsTo` (a name, not the culprit).
   - `secrets` → `unrelatedLie` (who lied about what, unconnected to the murder).
   A missing field is a scene-level re-ask at the £0.02 stage, not an outline regeneration. Flag
   `AGENT7_BEAT_JOB_FIELDS`.
2. **Agent 9's archetype derives from the outline's beat** — `buildMacroArcPlan` reads the scene
   beats instead of the chapter count (WF-002: one owner). `false_solution`→RED_HERRING,
   `secrets`→REVERSAL, `final_trap`→CONFRONTATION, `revelation`→RESOLUTION-as-aftermath. Fixes the
   dropped CONFRONTATION and the ch10 contradiction as a by-product. Flag `AGENT9_ARC_FROM_BEATS`.
3. **The chapter contract names the fields**, not the archetype: *"This chapter accuses
   <accusedInnocent>; <detective> finds the flaw — <flawFound> — before the chapter ends"* replaces
   *"wrong lead followed and disproved"*. Concrete names are what the model obeys.

**The instrument — turn density, in the SHIP-CHECK:** for chapters 3–8, the count of chapters in
which a non-culprit is named within a sentence carrying *suspect / accuse / guilt / theory*, plus a
theory-overturned marker. Telemetry (it would fire on most books today — B1). Bookshop: **0 of 6**.

**Check and prediction:** outline `false_solution` scenes naming an innocent 45% → **100%** (schema-
required); `alibis` second incident 4% → **≥ 80%**; on the page, **≥ 2 of chapters 3–8 entertain a
non-culprit**; new-content rate not below 30% by chapter 7; the reader's "circle the same information"
absent; **plot 8, pacing 8**. Upstream lever — needs a fresh run; bundles with §5 step 2.

**What would falsify it:** a book whose outline names the innocent and whose prose still never
accuses them — then the carry problem is Agent 9's, and the post-check becomes a regen channel.

---

## §4 WHAT IS NOT THE ROAD — with the evidence

- **Another instrument before the register one is acted on.** Register has predicted the headline at
  −0.6 since A_88 and nothing has ever rewritten a sentence because of it. Measuring more will not
  move a mark.
- **Rubric A/B, or any internal judge.** It cannot rank an 86 against an 81 (memory:
  `rubric-cannot-rank-two-books`). External reads only; the humour mark is now one of them.
- **A prompt that asks for a rate** — "vary your phrasing", "more wit", "deeper characters". Every
  lever above is a countable operation because those are the only ones this model has ever obeyed
  (VoiceSpec; the shapes; the tic ban; the incident ban).
- **A `--depth` parameter, or a longer prompt.** A_93 §5; A_88's ceiling was self-imposed.
- **Expecting 90 from a tidy book.** 88 is consistency; 90 is a mark never given. The only categories
  with a plausible first 9 are prose (M1 to the floor) and dialogue (M4 with a reader who now scores
  humour). Aim M1 and M4 at 9, the rest at 8.

---

## §5 THE ORDER, AND WHAT EACH STEP COSTS

| step | build | verify | settles |
|---|---|---|---|
| 1 | M1 register ban (polish-pass list) | matched pair on 1358, ~£0.45 | register < 7% and the pair's prose note |
| 2 | M2 aftermath planned at Agent 7; M3a spatial reveal arithmetic; **M6 beat-job fields** | one fresh run, £1.10 | Ch.10 zero recap; the mechanism in three sentences; ≥2 middle chapters entertain a non-culprit |
| 3 | M4 R7 shape-by-register; M5 dated motive | the same fresh run | wit ≥ 41.4; motive dated |
| 4 | **one external read** of that book, humour scored | a reader | prose 8, ending 8, clues 8, dialogue 8: **≈ 86–87** |
| 5 | M1 to floor 2 with sensory; M4 unintentional-comedy line | one run + one read | the first 9 in prose or dialogue: **88–90** |

Three paid runs, two reads, ~£3.50, and every step has a number that says whether it worked before a
reader is spent. Steps 2–3 share a run because they touch different agents and different chapters,
which CLAUDE.md's bundling rule allows.

**What would falsify this plan:** a book under 7% register that still draws "generated lines" (then
the reader means injectors, and A_84's audit reopens); a book at canon-median wit that draws dialogue
7 (then sameness is not the cap); an aftermath planned by Agent 7 that the reader still calls recap
(then the recap is in the prose contract, not the outline).

---

## §6 STATUS

| # | item | state | commit |
|---|---|---|---|
| — | the arithmetic, the complaint counts, the correlations | **MEASURED** | this doc |
| M1 | register ban list into the polish pass | **NOT BUILT** | — |
| M2 | Agent 7 plans an aftermath scene; clearances before the test | **NOT BUILT** | — |
| M3 | reveal arithmetic for spatial/behavioural; R3 ordering post-check | **NOT BUILT** | — |
| M4 | R7 shape by register; band by axis; the unintentional line | **NOT BUILT** | — |
| M5 | dated motive at Agent 3; plant the act, not the category | **NOT BUILT** | — |
| M6 | beat-job fields at Agent 7; archetype from beats; turn density | **NOT BUILT** — designed 2026-09-16 | — |

**NEXT ITEM: M1**, because it is the only move with a −0.6 behind it and a £0.45 test.
