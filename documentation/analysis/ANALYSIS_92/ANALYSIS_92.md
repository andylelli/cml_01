# ANALYSIS_92 — WIT: AN INSTRUMENT, THEN A DIAL

**Opened 2026-09-14.** Cost: £0 — no paid run. Sources: the 11 real Golden Age novels in
`library/texts/`, 20 shipped manuscripts, and the pipeline itself.

A_91 found the humour machinery built and deleted first, fixed that, and added the wit and depth
beats. It left the obvious question unanswerable: **did any of it work?** Repetition is measured.
Machine register is measured and predicts the external score (−0.697). Humour was measured by
nothing at all, so every lever aimed at it — five layers, three agents — could only be judged by a
person reading the book at £1.15 and forty minutes a go.

This analysis does two things, in the only order that makes sense: build the instrument, then build
the dial it calibrates.

---

## §1 THE INSTRUMENT — four shapes, not a judgement

`packages/prose-guard/src/wit-density.ts`. It does **not** detect whether a line is funny. It counts
four SHAPES wit takes in this genre, each a structural fact about the text:

| # | shape | definition |
|---|---|---|
| 1 | THE SHORT RETORT | a speech of ≤6 words immediately after one of ≥15, within 700 chars |
| 2 | THE FLAT ANSWER | a question answered in ≤4 words |
| 3 | UNDERSTATEMENT | a diminisher and a grave word in one sentence |
| 4 | POLITE SAVAGERY | a courtesy marker and a hostile word in one sentence |

A book can score well and not be funny. But a book cannot be funny in the Golden Age manner while
scoring near zero, because these are the moves that manner is made of.

### It separates, which is the only thing that makes it an instrument — MEASURED

11 canon novels above a 6,000-word floor against 20 of our shipped manuscripts:

| shape | canon median | ours median | ratio |
|---|---|---|---|
| retort | 30.6 | 8.8 | 3.5× |
| flat answer | 13.3 | 1.5 | 8.9× |
| understatement | 1.2 | 0.0 | ∞ |
| polite savagery | 0.2 | 0.0 | ∞ |
| **ALL** | **41.4** | **11.4** | **3.6×** |

canon range 20.6–69.1 · ours range 1.1–44.6

**18 OF OUR 20 BOOKS FALL BELOW THE LOWEST-SCORING REAL NOVEL.** One reaches the canon median. The
last three books score 8.8, 13.0 and 20.5.

The two strongest discriminators are the two that cost nothing to write: a character answering
briefly, and a character answering a question without expanding. **Our books explain; the canon lets
people be short with each other.**

### TELEMETRY, NEVER A GATE

It would fire on 18 of 20, which is CLAUDE.md's B1 — a check that fires on most runs is an off switch
with extra steps. It ships in the Agent 9 SHIP-CHECK beside repetition and machine register.

### A recalibration mid-build, recorded because it changed the constants

The first cut of the grave vocabulary held "stabbed" but not "stabbing", so it missed the humour
guide's OWN worked example — *"The evening deteriorated somewhat after the stabbing"*. Widening to the
-ing forms moved the canon understatement median from 0.9 to 1.2; every other constant held. Module
and calibration probe (`scripts/wit-calibration.mjs`) were widened together, so the shipped constants
come from the shipped code. **Re-run that script after any detector change.**

---

## §2 THE DIAL — humour as a story parameter

`packages/prompts-llm/src/humour-level.ts`. Until now humour was decided entirely inside the pipeline.

| band | Agent 2b is told | beat cadence | target/10k |
|---|---|---|---|
| `none` | every character style `none`, level 0.0 | no chapter | 0 |
| `dry` | at most TWO humorous, none above 0.3; mild styles only | every 3rd | 20 |
| `classic` *(default)* | nothing — no style withheld | every chapter | 41 |
| `sharp` | ≥THREE humorous, one at 0.7+; sharp registers; one still `none` | every chapter | 60 |

**Bands, not a slider**, because a slider is a RATE and this model complies with countable operations
and ignores rates. Each band resolves to two integers before it reaches a prompt.

**`classic` targets 41 because that is the canon median from §1.** The default target is what the
genre does, not what we do.

**The default changes nothing** — absent or unrecognised resolves to `classic`, the behaviour every
book in the corpus was written under. Pinned by a test asserting the Agent 2b prompt is byte-identical
with the parameter absent and with it set to `classic`; without that property the parameter silently
reprices every comparison against the corpus.

### The hop list — each a place it could have been dropped silently

`run-params.mjs` → `run-params-<seed>.yaml` → `canary-input-overrides.mjs` → `MysteryGenerationInputs`
→ Agent 2b cast directive · Agent 9 beat cadence → SHIP-CHECK.

**`canary-input-overrides.mjs` filters yaml keys against an allow-list and warns about nothing.** A
generated parameter missing from that set never reaches the run and never says so. Proved end to end
by probe with `narrativeStyle` as the control, not by reading the module.

### Seed reproducibility — MEASURED, not assumed

The draw is placed after `storyAngle`, the last existing draw, for the reason that block records:
anything drawn earlier shifts every seed that already exists.

- seed 10845, pre-change generator vs current, `--fresh-names 0`: **differs by exactly one line**
- draw-consumed vs `--humour classic` supplied: **byte-identical**

Random pool `classic, classic, dry, sharp` — half of all runs stay comparable with the corpus. `none`
is excluded: a humourless mystery is a deliberate experiment, not a variation worth a random £1.15.

---

## §3 WHAT IS STILL UNKNOWN

- **Whether a band moves the number.** Nothing here has run. `sharp` asking for 60 per 10k against our
  median of 11.4 is a hypothesis, and the first run on it is the test.
- **Whether wit density predicts the external score.** It separates canon from us, which is not the
  same claim. The correlation needs reads against books with known densities, `words >= 8000`.
- **Whether the four shapes are the right four.** They were chosen because they are countable and they
  separate. A fifth may matter more.

---

## §4 STATUS

| # | item | state | commit |
|---|---|---|---|
| 1 | `wit-density.ts` — four shapes, calibrated | **BUILT** | `8a1edc66` |
| 2 | `scripts/wit-calibration.mjs` — regenerates the constants | **BUILT** | `8a1edc66` |
| 3 | SHIP-CHECK line | **BUILT** | `8a1edc66` |
| 4 | `HOW-HUMOUR-WORKS.md` §7 names the instrument | **BUILT** | `256e4c12` |
| 5 | `humour-level.ts` — four bands | **BUILT** | `c1f90598` |
| 6 | Agent 2b cast directive per band | **BUILT** | `c1f90598` |
| 7 | Agent 9 beat cadence per band | **BUILT** | `c1f90598` |
| 8 | `--humour` + weighted pool in `run-params.mjs` | **BUILT** | `c1f90598` |
| 9 | allow-list key, API + resume passthrough | **BUILT** | `c1f90598` |
| 10 | SHIP-CHECK reports target beside measured | **BUILT** | `c1f90598` |
| 11 | `HOW-HUMOUR-WORKS.md` layer 0 | **BUILT** | `c1f90598` |
| 12 | first run on a non-default band | **RUN** — seed 1358, `sharp`: Agent 2b assigned 4 humorous / max 0.75 / one `none`; wit 20.5 per 10k (last fresh run 8.8); ship-check reads "Asked for sharp (target 60) — short by 39.4". The band reaches every hop; the shapes are obeyed in 5 of 10 chapters (A_94 §8) | `mystery-1789497521865` |

**NEXT ITEM: 12.** A matched pair is the wrong instrument here — the band changes Agent 2b, which is
upstream of prose, so `RESUME_REDO=prose` cannot carry it. This needs a fresh run at `--humour sharp`,
and its checkable prediction is the SHIP-CHECK wit line: **`sharp` should clear 20.6, the canon floor,
which 18 of our 20 books do not.**
