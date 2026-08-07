# Architecture Review 07 — the target was hit, and the queue is now aimed at the wrong things

**Written:** 2026-08-07 · **Type:** the working board. Supersedes [REVIEW_06](REVIEW_06.md), whose
list was built before the N6 pair ran and before the external read came back.
[REVIEW_05](REVIEW_05.md) remains the analysis — read it for *why*; read this for *what next*.

---

## 1. Where this actually stands

Three things changed in two days, and all three change what is worth doing next.

**1. The 80 target was hit — twice, on the same premise.**

| | internal | external | ending | prose |
|---|---|---|---|---|
| `the_pendulum_s_secret_chime` (N6 control) | 74 | **84** | 8/10 | 7/10 |
| `the_weighted_pendulum_deception` (N6 treatment) | 70 | **86** | 9/10 | 8/10 |

The corpus's previous best external read was 80. These are 84 and 86.

**2. The rubric judge is calibrated for the first time.** 87.9% ranking agreement at n=9 against an
85% target, offset usable (add ~11 to estimate the external read). Every board for months has
qualified its numbers with *"the judge is uncalibrated"*. That sentence can be retired — subject to
M1c's ±3 single-score error bar, which has not gone away and never will.

**3. Two instruments are provably wrong, and one of them is making scores worse.** X18's
`noResolution` cap fired on the better story and cost it three marks. X19's `aftermath_repeat` missed
the defect both external reviews call the biggest structural weakness.

---

## 2. What the reader actually complains about

Both external reviews, reduced to their overlapping complaints. This is the first time this project
has had two independent reads of two runs from the same premise, and the agreement between them is
the most useful signal on the board.

| Rank | Complaint | Both reviews? | Existing machinery |
|---|---|---|---|
| **1** | **The endgame repeats itself.** *"Chapter 9 repeats the clearances. Chapter 10 repeats the mechanism and clearances again. This is the biggest structural weakness."* / *"Chapter 10 repeats Chapter 9."* | **yes** | `aftermath_repeat` detector (**X19: missed it**) + the `aftermath_repeat` regen pass, which **has never fired** |
| **2** | **Template / generated prose survives.** The injected verdict sentence, quoted by name; *"catchphrases… sound like template residue"* | **yes** | Injectors (M5) + X4's counters, which caught #1 exactly |
| **3** | **The corrected timeline is never stated crisply.** *"the final deduction should state: true murder time X, false clock time Y"* | **yes** | `unaccounted_time`; no pass states the corrected timeline |
| 4 | Weapon/wound not tied back in the reveal | yes | none |
| 5 | Mechanism needs one clean explanatory paragraph | control only | mechanism regen pass |

**The board's paid queue does not address any of the top three.** N7 repairs a missing disclosure; N8
tests a generation-time contract; CS1 promotes a clue package. All defensible, none aimed at what two
readers independently said is wrong. That is the central finding of this document.

---

## 3. Outstanding, by category

### Free — instrument defects, all found by the external read or by reviewing our own work

| # | Item | Why it matters |
|---|---|---|
| **A1** | **X18** — the disclosure test wants a name + guilt verb in ONE sentence; the reader gave that dramatised reveal 9/10. Cap cost it 3 marks | Actively distorting a judge that has just become trustworthy |
| **A2** | **X19** — `aftermath_repeat` false negative on the treatment run | It is complaint #1, and the detector for it is blind |
| **A3** | **X17** — the N6 lever's confirmation goes to `console.info`, not the report | A probe whose arm cannot be identified from its record is unattributable |
| **A4** | Re-run `eval:calibrate` after A1 lands | A1 changes an internal score in the corpus; the 87.9% must be recomputed, not assumed |
| **A5** | **F3** — REVIEW_05's four stale framing statements | Cheap, and the document is the record |

### Free but blocked on runs

| # | Item | Needs |
|---|---|---|
| B1 | **S7** — retire the dead coercion sites | One more run at `firings=0` (3 of 4 on record) |
| B2 | **M3** — is `apply` worth it for the full-story diagnostic? | Anchoring rate across more runs |
| B3 | **R5** — kill-and-resume drill | Any run it can ride on |
| B4 | **P4** — retire `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence` | 4 runs at zero firings |

### Paid

| # | Item | Cost | Ready? |
|---|---|---|---|
| C1 | **Aftermath-repeat regen** — the pass exists and has never fired | 1 run | after A2 |
| C2 | **N8** — phase-2 geometry contract | 1 run | now (the only untried mechanism for the misbinding) |
| C3 | **N7** — culprit-evidence regen on the edit-list channel | 1 run | after A1 — X18 may remove its premise |
| C4 | **CS1** — promote `@cml/clue-spec` | 1 run | now |
| C5 | **M6** — give Agent 9 the real rubric | 1 run | now the judge is calibrated |
| C6 | **R6** — `eval:baseline` with `--repeats 3` | £12–24 | after A4 |

### Yours

| # | Decision |
|---|---|
| D1 | **Promote the scheduler?** It works, budgets are honoured, and the shorter book scored higher — but it does *not* fix the reveal misbinding, which was the argument for it. Now a pacing decision: is ~10,800 words right for "short"? |
| D2 | **X4 Option 1** — refuse an injection that violates a model-bound rule? After C3 |
| D3 | **M5** — retire the injectors. First external evidence in hand ([R05 §32.2](REVIEW_05.md)); not yet a decision |
| D4 | **Geometry phases 2–4** — still worth their cost? After C2 |

---

## 4. The order

Sequential. Each step is doable when the one above it is done, and nothing here needs a decision
before it starts except where marked 👤.

```
FREE — fix the instruments before trusting them further
 1  A1  X18   widen/replace the disclosure test; stop the cap harming good endings
 2  A4        re-run eval:calibrate — A1 moves an internal score, so 87.9% must be recomputed
 3  A2  X19   aftermath_repeat false negative — complaint #1's detector
 4  A3  X17   lever confirmation into ctx.warnings, so the next probe is attributable
 5  A5  F3    REVIEW_05's stale framing statements

PAID — aimed at what the readers actually said, cheapest first
 6  C1        aftermath-repeat regen, 1 run      ← complaint #1, pass exists, never fired
              rides along: S7 (B1, the 4th zero) · R5 (B3) · M3 (B2)
 7  👤 D1     promote the scheduler? decide on pacing, with §31/§32 in hand
 8  C2  N8    phase-2 geometry contract, 1 run   ← the misbinding's only untried mechanism
 9  👤 D4     geometry phases 2–4 — worth it?
10  C5  M6    rubric-in-prompt, 1 run            ← only readable now the judge is calibrated
11  C4  CS1   promote clue-spec, 1 run
12  C3  N7    culprit-evidence on edit-list, 1 run — ONLY if A1 leaves it justified
13  👤 D2     X4 Option 1
14  C6  R6    eval:baseline --repeats 3, £12–24  ← the durable measurement, last because dearest
15  👤 D3     M5 — retire the injectors, on the evidence by then
16  B4  P4    retire the band-aids, once four runs read zero
```

**Steps 1–5 are free and unblock the rest. Steps 6–12 are five runs, ~£7.50.** R6 at step 14 is the
only large number and it buys a baseline that is finally worth having.

---

## 5. Two rules that now bind everything above

**No rubric comparison from a single scoring.** M1c measured a six-mark spread on identical input
(66–72, caps off, eight scorings). Any delta under ~6 marks is noise. Firing *counts* are exempt —
integers do not wobble — which is why the mechanism reads in §3's B-list are still worth one run each.

**One run settles a fact; it cannot settle a quality delta.** Everything in the B-list and every
ride-along is a fact — a flag took effect, a counter emitted, a stage resumed. Quality needs repeats,
and after step 14 there will be a baseline to compare against.
