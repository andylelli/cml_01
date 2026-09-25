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
| **M3a** | **the reveal contract reached NO chapter** — `AGENT9_REVEAL_ON_DT_CHAPTER` | **BUILT, ON** | `7eac5c71` |
| M1 | register ban list into the polish pass — `AGENT9_REGISTER_BAN` | **BUILT, ON** | `64e821c3` |
| M6 | beat-job fields (`AGENT7_BEAT_JOB_FIELDS`); archetype from beats (`AGENT9_ARC_FROM_BEATS`) | **BUILT, ON** | `c78a473c` |
| M4 | shape by register (`AGENT9_SHAPE_BY_REGISTER`); band by axis (`AGENT2B_BAND_BY_AXIS`) | **BUILT, ON** | `d0a42ae3` |
| M5 | dated motive at Agent 3 — `AGENT3_DATED_MOTIVE` | **BUILT, ON** | `d0a42ae3` |
| M6b | turn density in the SHIP-CHECK | **BUILT** | this commit |
| M2 | Agent 7 plans an aftermath; clearances before the test | **SUBSTANTIALLY ALREADY BUILT** — see §7.1 | A_94 `R1`/`R2` + M6 |
| M3b | R3 ordering post-check on the DT chapter | **NOT BUILT** — one observation only (A_94 §6.1) | — |
| P1 | one run carrying all of it | **NOT RUN** | — |

### §7.1 Two premises that turned out false, and what changed because of them

**M2's premise was wrong, and the measurement says so.** M2 was written as "clearances before the
test". They already are: **48 of 51 stored outlines place a clearance scene before the discriminating
test.** The defect was never the placement — it was the DUPLICATE clearance in the final scene, which
A_94's R1 strips and R2 replaces. The remaining half, "Agent 7 plans the aftermath rather than Agent 9
rescuing it", is what M6's `revelation` beat job now requires (`consequenceFor`). No separate
machinery was built, because it would have been redundant.

**M3's premise was wrong in a way that mattered far more.** M3 was written as "extend the reveal
arithmetic to the spatial and behavioural axes", on the assumption the arithmetic was temporal-only.
It is not: every stored case carries `actual_time_of_death` and `apparent_time_of_death` whatever its
axis (A_83's finding). The real defect, found while checking that assumption:

> **The reveal contract reached NO chapter in the last six runs** — `CULPRIT REVELATION REQUIRED`
> appears in 39 of 57 runs in the prompt log and in **none** of the last six, which include the
> 87-class brewery book, the 80/100 theatre book, its matched pair and seed 1358. The evidence chain,
> the kill statement, the pronoun resolution, the resolution event, close-in-scene,
> `AGENT9_REVEAL_DECEPTION_PURPOSE` and `AGENT9_REVEAL_ARITHMETIC` went with it. **A_90 built that
> arithmetic to answer the 87 read's FIRST complaint and it has never once reached a prompt.**

`isRevealChapter` requires `!isDiscriminatingTestChapter`; the winner-selection excludes the aftermath
scene and then excludes every remaining candidate as the DT claim, so the winner is **null** and there
is no later chapter to catch the drop. The coordinate join cannot prevent it — **51 of 51 stored cases
put the revelation at "act 3, scene 6" while act 3 holds 2–5 scenes**. That is M3a, and it is the most
valuable thing this analysis found.

## §8 P1 — THE RUN · seed 50862 · 2026-09-16 · £1.10

authority · 1930s · SeasideHotel · Dark · short · private · atmospheric · cast 6 · `--humour sharp` ·
angle *"a record-attempt speed trial on the sands"*. Project `canary_1789577884303`. 9,323 words, no
fallback chapter, **release gate PASSED**. Every lever verified by agent label in the prompt log.

| # | prediction | pass | measured | verdict |
|---|---|---|---|---|
| 1 | reveal obligations reach a chapter | the DT chapter carries them | **chapter 9: kill statement, evidence chain, resolution event AND the arithmetic** — first time in seven runs | **MET** |
| 2 | turn density, chapters 3-8 | ≥ 2 of 6 | **4 of 6** — 4 chapters put a non-culprit in the frame (0 overturn a belief) | **MET** |
| 3 | `[A_95 M6]` beat jobs | ≥ 80% | **3/5 scenes did the job, 4/5 carried the fields** — short: `alibis` purpose, `revelation` missing `consequenceFor` | **PARTIAL** (60/80%) |
| 4 | register rate | < 0.070 | **0.071**, worst chapter 20.0% | **MISSED BY 0.001** |
| 5 | wit per 10k | ≥ 41.4 | **9.7** (retort 3, flat 6) | **FAILED** — §8.1 |
| 6 | culprit motive dated | names an act, a date, a consequence | *"Victim threatened to expose financial mismanagement"* — an act, no date | **FAILED** |
| 7 | formative stems | ≤ 1 share a stem | **2 of 6** | **MISSED** |
| — | repetition per 10k | < 50 | **159.6** — ship-check said WORTH A LOOK | **FAILED** — §8.2 |

**And one number nobody predicted:** the polish pass **kept 9 of 9 chapters, 0% discarded**, against a
historical 54% discard rate (A_86 item 85: 39 of 72 recorded calls thrown away). M1 gave that pass
work it could do without tripping the rollback guard. That is the clearest single result of the run.

### §8.1 Why wit failed, and it is A_94 §6.1 repeating in a new dimension — MEASURED

| | seed 1358 (wit 20.5) | seed 50862 (wit 9.7) |
|---|---|---|
| speeches | 230 | **132** |
| speeches of ≥ 15 words | 62 | **17** |
| mean speech length | 12.8 | **9.5** |
| flat answers (instrument) | 6 | 6 |
| short retorts (instrument) | **17** | **3** |

**The flat answer held; the retort collapsed, because its SETUP disappeared.** The shape needs a long
speech to deflate, and the chapter obeyed "short answers" by shortening everything. A_94's R4b was
written against exactly this failure — *"additions, not a diet — the chapter keeps every conversation
at full length"* — and it did not prevent it; the diet simply moved from dialogue SHARE (11.9% on the
pair) to speech LENGTH.

**And the narration ban was routed around.** R4c banned *"Four words, final."* and *"She did not
elaborate."* by name. The model wrote **"her answer as brief as the fading light" seven times** —
an unbanned variant, which also became one of the book's most repeated passages. Banning specific
strings teaches the shape and the model finds a wording not on the list.

**R4d, built on this run:** the long setup becomes its own instruction (*"somebody makes a speech of
TWENTY-FIVE WORDS OR MORE — write that speech; it is half the joke"*), the chapter is told explicitly
that **these are the only short speeches it owes**, and the brevity-tag prohibition is replaced by a
positive operation — *the sentence after a short answer must be what somebody else DOES*. A
prohibition list is routed around; an operation is performed.

### §8.2 Repetition — flagged, NOT attributed

150 of 159.6 per 10k are authored, not mandated: locked values account for **9 of 150** repeated
spans. So this is real. But **one run cannot attribute it**: repetition has ranged 23.6 to 516 per 10k
on *identical* code (the brewery and theatre books), and CLAUDE.md's rule against concluding from a
single canary applies exactly here.

What IS measured, and it overturns an assumption behind A_94 R5: **the repeat ban list named these
passages and the model wrote them anyway.** *"pastel tea dress"* was banned in the prompts of chapters
3-10 and appears 4 times; *"answer as brief as"* was banned in 4-10 and appears 7 times. R5 was
inferred from the tic-ban precedent and has now been measured on a run: **issued and ignored.**

The register ban is NOT shown to be the cause — chapter 7 carried no ban block and has 205 repeated
spans, while banned chapters range 33 to 304. Recorded as open.

### §8.3 STATUS after P1

| item | state |
|---|---|
| M3a reveal obligations | **CONFIRMED on a run** — chapter 9, arithmetic included |
| M6 turn density | **NOT ESTABLISHED** — 4 of 6 against 0 of 6, but reading the book found no false solution a reader would believe; the instrument counts a suspicion sentence, which is too weak to carry the claim (A_96 §2 C3) |
| M1 register ban | **PARTIAL** — 0.071 against < 0.070, but polish discard 54% → 0% |
| M6 beat jobs | **PARTIAL** — 3/5, two named failures to fix |
| M4 wit shapes | **FAILED, cause measured, R4d built** |
| M5 dated motive | **FAILED** — the act arrived, the date did not |
| repetition | **FLAGGED, NOT ATTRIBUTED** — needs a matched pair |
| R5 repeat ban | **BOUNDED, not refuted** — A_96 §1 B4 measured it per passage: 28 of 38 listed passages stopped entirely; the two that rose were forced by a competing obligation in the same prompt |

**NEXT: a matched pair on 50862** (`RESUME_REDO=prose`, ~£0.45) carrying R4d, which settles the wit
cause and the repetition attribution against byte-identical upstream. M5's date and M6's two scene
failures are upstream and need the run after it.

---

**The original P1 predictions, for the record:**

| prediction | today | pass |
|---|---|---|
| reveal obligations reach a chapter | **0 of the last 6 runs** | the DT chapter carries them |
| register rate | 0.079–0.134 | **< 0.07** book-wide |
| `[A_95 M6]` beat jobs done | 45% / 4% baseline | **≥ 80%** of job scenes |
| turn density, chapters 3–8 | **0 of 6** | **≥ 2 of 6** |
| wit per 10k | 20.5 | ≥ 41.4, with named owners per shape |
| the culprit's motive | no date in ~4,700 field values | names an act, a date and a consequence |
