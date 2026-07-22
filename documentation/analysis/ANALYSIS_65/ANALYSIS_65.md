# ANALYSIS_65 — The corpus era's founding analysis: what actually stands between 60.5 and 80

**Written:** 2026-07-22 · **Regime:** §2.8 (corpus analysis + singular probes; no batches) · **Data:** the preserved 93-story corpus (`campaign_data/20260722`), 38 scored reports on disk, the 5 planted-era runs (A_64 probe + M3) with full prompt archives. **Derivation scripts:** `scratchpad/a65/` (judge-sensitivity.py, plant-compliance.mjs) — derive, never hand-extend.

**The one-sentence status:** three free corpus analyses answered the questions M3 left open — the judge's clue complaints persist on stories whose plants are provably on the page, because the pipeline *explains everything the moment it shows it*; three rubric categories are judge dead-bands that no lever has ever moved; and the corpus's own best runs already sit at 74 internal — so the road to 80 is (1) pin the offset, (2) stop explaining, (3) reproduce the live-category profile the corpus already contains.

---

## 1. Findings (each derivable in minutes from the corpus; scripts committed)

### F1 — The judge's complaint templates persist on planted-era stories: 5/5

All five planted-era runs (C1/C2/C3 provably active in their prompts) scored **clues = 5**, with the same complaint family as the 33-run pre-A_64 mine — near-verbatim on three ("Clues are present but not always effectively planted; some critical pieces of evidence are introduced too late…"). The lever fired; the complaint did not move.

### F2 — But the plants ARE on the page: 69/73 (95%) before their reveals, 0 absent

Deterministic check (plant key terms vs shipped chapter texts): virtually every stamped plant's material appears in the prose before the clue's reveal chapter. **The complaint is not about literal absence.** (Instrument caveat: key-term co-occurrence over-credits generic witness terms; the object-specific plants — salt-shaker residue, tide charts in Sylvia's room, the water line on the clothing — confirm the direction cleanly.)

### F3 — The real defect: NOTHING IS WITHHELD. The pipeline explains every clue the moment it shows it

Chapter 1 of the M3 tide run contains this sentence: *"If Sylvia Trent's watch truly stopped at 'ten minutes past eleven,' and the tide was only at 'three feet' when she was found, then the official tide chart's prediction of 'eleven thirty' for high tide could not account for her drowning."* — **the story's central contradiction, fully reasoned, on page one.**

This is not a model whim; it is our own contract. The clue-obligation block's **MANDATORY TWO-PARAGRAPH STRUCTURE** orders, for every early-placed clue: paragraph 1 observe, paragraph 2 *"explicitly reason about what this evidence implies."* Instant inference is compulsory, everywhere, all story long. Consequences, unified:

- **"Clues not planted / unearned"** — planted material never *functions* as a plant, because its significance is stated on arrival; there is nothing for the reveal to newly synthesize.
- **"Pacing drags in exposition"** — every scene carries mandatory reasoning paragraphs.
- **"Prose overly descriptive / report-like"** — much clue material renders in evidentiary-summary register ("witnesses report…", "analysis of the salt shaker suggests…", "statements confirming…") — data-sheet language inside prose. (Item 14's "artificial" externals, same root.)
- **"Reveal relies on confession / lacks payoff"** — the deduction was serialized across chapters 1–8, so the reveal has nothing left to do but assert or confess.

One syndrome, one layer deeper than A_64: **A_64 planted the clues; A_65 must stop the pipeline from explaining them.**

### F4 — Three rubric categories are judge DEAD BANDS; five are live — and the live ones are where the top runs win

Top-6 vs bottom-6 of the 38 scored runs:

| category | top6 | bot6 | Δ | reading |
|---|---|---|---|---|
| ending | 7.17 | 5.00 | **+2.17** | LIVE — the biggest separator |
| atmosphere | 8.33 | 6.67 | **+1.67** | LIVE (already near 8 at the top) |
| premise | 8.00 | 6.50 | **+1.50** | LIVE (8.0 achieved in-distribution) |
| prose | 6.50 | 5.00 | **+1.50** | LIVE |
| opening_hook | 7.00 | 5.83 | +1.17 | live |
| character_clarity | 6.50 | 5.50 | +1.00 | live |
| clues | 5.50 | 5.00 | +0.50 | **DEAD BAND** — nobody escapes ~5, ever |
| plot_structure | 6.00 | 5.50 | +0.50 | **DEAD BAND** |
| pacing | 6.17 | 6.00 | +0.17 | **DEAD BAND** |

The judge hands clues/plot_structure/pacing a 5–6 to *every* story in the distribution — 38 runs of levers, injectors, regens, and contracts have never moved them. Combined with F1's verbatim templates, the parsimonious reading: **on these three categories the judge is template-answering, and further lever spend aimed at their MARKS is wasted until the instrument question is settled.** (The underlying craft still matters — but it must be measured by external readers or by the live categories it feeds, not by these three numbers.)

### F5 — The arithmetic: the corpus already contains ~74 internal, and 74 internal ≈ external 80 IF the offset holds

Best run in the corpus: **74** (v_poison_enforce), zero caps; the top-6 band is 66–74 with 0–1 caps. S0's only external calibration read externals **+9.5** above internal. If that offset is real, the corpus's best runs are already brushing the external-80 boundary — and the whole remaining game is: *make the median look like the top-6* (live categories + zero caps), then verify externally. If the offset is NOT real, no internal target is meaningful and the 80 conversation changes. **Every path below forks on this one number.**

---

## 2. The program (in order; all §2.8-compliant)

### P1 — Pin the offset: the owner's 4 M3 reads (~1.5h, £0) — THE unlock

No longer "optional-for-M3": F5 makes the offset the fork for everything. Read packet: `scratchpad/m3/read-packet.md`. Output: external mean + gap. (Bonus while reading: note whether the planted clues *felt* planted — the one question no internal instrument can answer.)

### P2 — THE WITHHELD INFERENCE lever (design + build, ~4–6h attended, fixtures + ONE probe ~£1.5)

Invert the instant-inference contract — the generation-side sequel to A_64's plants:

- **Observation-only clue rendering:** the two-paragraph mandate's ¶2 (compulsory immediate reasoning) is REMOVED for standard clue obligations; clues render as C1-register appearances — concrete, sensory, in-scene, significance unstated. The detective may *notice* (a pause, a pocketed item, a second glance) — never explain.
- **Inference rationing:** explicit reasoning is licensed ONLY at designated beats — the pattern/false-solution chapter (partial, honestly wrong), the discriminating test (the decisive comparison), and the walked reveal (C2, already built — it finally gets material no reader has seen assembled).
- **Register guard:** a deterministic detector for evidentiary-summary narration ("witnesses report/recall…", "analysis (of X) suggests/shows…", "statements confirming…", "records indicate…") outside interrogation dialogue — the data-sheet family; advisory first, with the A_64 telemetry carrying counts into every artifact.
- **Embargo hardening:** the F3 chapter-1 solution-logic leak becomes a fixture; the mustNotReveal embargo extends to *derived contradictions* (the "if A and B then C" form), not just culprit/mechanism.

Directly targets: ending (+2.17 headroom), prose (+1.50), pacing-drags, and the *substance* of the clue complaint — while the dead-band marks are expected NOT to move (that's the instrument, P4).

### P3 — Reproduce the top-6 profile deliberately (live-category pass; design from corpus, ~3–4h)

The corpus's own 66–74 runs are the spec. Derive per-category what they do differently (premise 8.0, atmosphere 8.3, ending 7.2) — read the top-6 against the bottom-6 on: opening structure, aftermath length/content, dialogue share, description density, chapter count. Then encode the deltas as drafting contracts (the aftermath beat exists but M3 endings still landed 5–7 — autopsy which aftermath contracts produced the 7s). No new subsystem: prompt-contract iteration, validated per P5's measures, probed singly.

### P4 — The instrument decision (owner, after P1)

- Offset ≥ +6: internal 73 stays the proxy target; steer P2/P3 by live categories + external spot-reads at milestones; ignore dead-band marks.
- Offset < +6: the internal judge cannot certify progress toward 80 at all. The options are a K2-class judge revision (stronger model / decomposed rubric / anchored exemplars) — **a measuring-stick change that only the owner can call** — or steering purely by periodic external reads.
- Either way: never edit the judge and a lever in the same period (the A/B hygiene rule, applied to the instrument).

### P5 — Standing corpus measures (wire into the analyzer, ~1h)

Promote A_65's scripts to standing derives run on every future singular probe: plant-page compliance, inference-density per chapter (reasoning-connective counts — the P2 metric), evidentiary-register counts, complaint-template hit-rate vs the frozen A_64 taxonomy. Every probe then measures itself against the corpus automatically.

---

## 3. The do-NOT-do list

- Do not spend levers on clues/plot_structure/pacing **marks** — dead bands (F4) until P4 resolves the instrument.
- Do not touch the judge prompt as a side effect of anything — measuring-stick changes are owner decisions, made alone.
- Do not run batches. One probe per lever iteration; the corpus is the control arm.
- Do not conclude from the probe's marks (n=1, K2); conclude from P5's deterministic measures + the next external read.
- Do not un-build A_64's contracts if P2 stalls — plants are the precondition for withheld inference, not a competing theory.

## 4. Task board

| # | Task | Cost | Depends on |
|---|---|---|---|
| 65.1 | Owner's M3 reads → offset + gap (+7.8 if gap > 3) | ~1.5h owner, £0 | — |
| 65.2 | P2 build: withheld-inference contracts + register guard + embargo fixture | ~4–6h | — (parallel with 65.1) |
| 65.3 | P2 probe (ONE run) + P5 measures on it | ~£1.5 | 65.2 |
| 65.4 | P3 top-6 profile derivation + drafting contracts | ~3–4h | can start free |
| 65.5 | P4 instrument decision | owner | 65.1 |
| 65.6 | P5 standing measures wired into the analyzer | ~1h | — |

**Reading the board:** 65.1 and 65.2 can run in parallel today; the P2 probe is the campaign's next spend (~£1.5). If the offset holds and P2+P3 lift the live categories to the top-6 profile, the arithmetic of F5 says the external-80 read is in reach — verified, at that point, by external reads, not by the instrument that can't see it.
