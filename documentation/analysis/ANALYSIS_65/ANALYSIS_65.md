# ANALYSIS_65 — The corpus era's founding analysis: what actually stands between 60.5 and 80

**Written:** 2026-07-22 · **Regime:** §2.8 (corpus analysis + singular probes; no batches) · **Data:** the preserved 93-story corpus (`campaign_data/20260722`), 38 scored reports on disk, the 5 planted-era runs (A_64 probe + M3) with full prompt archives. **Derivation scripts:** `scratchpad/a65/` (judge-sensitivity.py, plant-compliance.mjs) — derive, never hand-extend.

**The one-sentence status:** three free corpus analyses answered the questions M3 left open — the judge's clue complaints persist on stories whose plants are provably on the page, because the pipeline *explains everything the moment it shows it*; three rubric categories are judge dead-bands that no lever has ever moved; and the corpus's own best runs already sit at 74 internal — so the road to 80 is (1) pin the offset, (2) stop explaining, (3) reproduce the live-category profile the corpus already contains.

---

## 0. PROGRESS TRACKER

*(Update this table as work lands; one row per phase, statuses ⬜ pending · 🟡 in progress · ✅ done · ⛔ blocked. **The build-level plan with file targets and per-step fixtures lives in [CRAFT_IMPLEMENTATION_PLAN.md](./CRAFT_IMPLEMENTATION_PLAN.md); the reliability sibling in [RELIABILITY_REMEDIATION_PLAN.md](./RELIABILITY_REMEDIATION_PLAN.md) — the two share sittings, probes, and one measures harness.**)*

| Phase | What | Cost | Depends on | Status | Last update |
|---|---|---|---|---|---|
| — | Founding analyses F1–F5 (judge sensitivity, plant compliance, contrast) | £0 | — | ✅ done | 2026-07-22 |
| **0** | Offset: owner's 4 M3 reads → external mean + gap | ~1.5h owner, £0 | — | ⬜ **owner** | — |
| **1** | Withheld-Inference build (contract inversion, licensing, register guard, embargo fixture) | ~4–6h attended | — (parallel with 0) | ⬜ | — |
| **2** | Probe #1 (ONE run) + P5 measures read | ~£1.5 | 1 | ⬜ | — |
| **3** | Top-6 profile derivation → live-category contracts (rides the next probe) | ~3–4h | — (derivation free) | ⬜ | — |
| **4** | Instrument decision (offset branch; optional external re-read of probe #1) | owner | 0 | ⬜ **owner** | — |
| **5** | Standing corpus measures wired into the analyzer | ~1h | — | ⬜ | — |

**Reading the tracker:** Phases 0 and 1 start in parallel today — 0 is the owner's, 1 is build work. The only spend on the board is probe runs at ~£1.5 each; every probe carries the full accumulated contract set, so Phase 3's contracts ride Phase 2's *successor* probe rather than buying their own. If the offset holds (Phase 0) and the live categories reach the top-6 profile (Phases 1–3), F5's arithmetic says the external-80 read is in reach — verified externally at that point, not by the instrument that can't see it (F4).

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

## 3. The phased implementation plan — what we will actually do

### Phase 0 — Pin the offset (owner; parallel with everything)
1. Read the four M3 stories against the usual external rubric (packet: `scratchpad/m3/read-packet.md`); record the four /100 marks in the packet table.
2. Derive: external mean, and gap = external mean − 60.8. Gap > 3 → 7.8 recalibration becomes a Phase-4 input; gap ≤ 3 → offset dead, Phase 4 branch B.
3. While reading, note (free, invaluable): did the planted clues *feel* planted? Did the reveal feel earned? These two impressions are the only measurements of C1/C2 no internal instrument can make.

### Phase 1 — The Withheld-Inference build (the A_64 sequel, fixture-first)
1. **Fixtures before code** (the house rule): (a) the F3 chapter-1 sentence — *"If Sylvia's watch truly stopped at… then the tide chart's prediction could not account for her drowning"* — becomes the failing fixture for a new derived-contradiction embargo check; (b) evidentiary-register samples from the corpus ("witnesses report…", "analysis of the salt shaker suggests…") become fixtures for the register guard.
2. **Invert the instant-inference contract — COMPLETELY, or not at all** (`obligation-block.ts` and everywhere else). The mole audit's sharpest finding: deleting the ¶2 mandate alone would leave the model under *contradictory* instructions, because inference is demanded in several other places — the "**Points to:** …" line on every non-deferred clue obligation, the DT evidence-chain language, clue-repair regen prompts, and possibly validation gates (G6 read-back, fair-play deducibility). Step 2 therefore begins with a **full inventory of every inference-demanding instruction and gate across the prompt + validation surface**, and reconciles ALL of them: pre-reveal chapters get observation-only (Points-to lines suppressed or moved to the writer-facing planning surface, never the prose instruction); the three licensed beats keep their reasoning language; any gate that literally requires visible pre-reveal inference is re-pointed or re-scoped in the same change. An incomplete inversion is worse than none — mixed signals persist the symptoms and invite one-at-a-time patching (the class #8/#12 self-interference family). **Net-instruction-count rule: the obligation block must end this phase SMALLER than it started** — this is a pruning, not an accretion.
3. **License inference at exactly three beats**: the false-solution chapter (reasoning REQUIRED, honestly wrong), the discriminating-test chapter (the decisive comparison, already contracted), and the C2 walked reveal (already built — it finally receives material never assembled before). All other chapters: observation only.
4. **The register guard** (`prose-guard`, new detector) — **a MEASURE, permanently, never an enforcement arm.** This is a phrase-list detector, and the campaign already ran this movie: A_47 renamed an injector phrase to dodge detectors, Item-15 re-listed it, the one string became the most frequent cap, and Item-17 ended the arms race *by contract*. So: the family list ("witnesses report/recall", "analysis shows/suggests", "statements/records/logs confirm(ing)", narration-scope only) is **FROZEN at birth** — no re-listing when the model paraphrases around it; a rising count with new phrasings means the CONTRACT failed, and the answer is a better contract, not a longer list. It never drives a regen and never caps; promotion to anything more requires an explicit owner decision. Counts flow through the A_64 F5 telemetry.
5. **Extend the embargo** to derived contradictions — **fixture-narrow, not a reasoning-shape detector.** The F3 chapter-1 sentence class (canonical-value pairs joined by conditional-inference syntax) is checkable precisely because both canonical values are known strings; that exact class becomes the fixture and the check. NO general "detect assembled reasoning" regex — chasing paraphrases of *reasoning* is a worse arms race than chasing phrases. If new leak forms appear, the response is to find and fix the instruction that produced them (as F3 did), never to grow the detector.
6. **Verify like A_64**: unit fixtures green → package + worker suites → tsc → rebuild EVERY dist and grep each for a new string (the stale-dist lesson, now standing rule).

### Phase 2 — Probe #1 and its measures (the only spend)
1. ONE fresh run on the full accumulated config (A_64 contracts + Phase 1).
2. Read it with the P5 measures, not the marks: inference-density per chapter must DROP to ~zero outside the three licensed beats; register-guard counts must drop vs the M3 baseline; plant compliance stays ≥90%; zero caps; gate ships. The rubric marks are recorded for the corpus, never concluded from (n=1, K2).
3. Any abort or wiring miss: same-day-fix doctrine, fixture the class, no rerun until fixed.

### Phase 3 — The top-6 profile, made deliberate (free derivation; contracts ride the next probe)
1. Derive from the corpus what the 66–74 runs do that the 55–59s don't, per live category: ending (aftermath length and content — M3 endings scored 5–7 *with* the aftermath contract; autopsy what the 7s did that the 5s didn't), atmosphere (already 8.3 at the top — find its floor), premise (Agent-1/3-era property — measure which devices score 8), prose (description density, sentence variance, dialogue share vs marks). **Goodhart guard: derive STRUCTURAL story properties only (scene content, beat lengths, dialogue share) — never phrase-level imitation of top-6 wording. Optimizing the judge's stylistic likes is the mole in mark-space; the external reads (Phase 0/4) are the check that structural deltas move the real experience.**
2. Encode the two or three strongest deltas as drafting-contract revisions (prompt-level, no new subsystems).
3. These ride the NEXT probe after Phase 2's — one probe per accumulated iteration, never a probe per contract.

### Phase 4 — The instrument decision (owner, once Phase 0 lands)
- **Branch A (gap ≥ +6):** internal 73 stays the proxy; iterate Phases 1–3 by live categories + P5 measures; external spot-reads at milestones only.
- **Branch B (gap < +6):** the internal judge cannot certify the target. Owner chooses: a K2-class judge revision (stronger judge model, decomposed rubric, anchored exemplars — a measuring-stick change, made alone, never bundled with a lever), or steering purely by periodic external reads. Optional cheap input either way: externally re-read Phase 2's probe story (~20 min) to test whether withheld inference moved the *felt* experience.

### Phase 5 — Standing measures (make every probe self-measuring)
1. Promote `scratchpad/a65/` + the Phase-2 measures into one `derive-a65-measures.mjs`: plant compliance, per-chapter inference density, register counts, complaint-template hit-rate vs the frozen A_64 taxonomy, cap profile.
2. Run it on every future probe automatically; append one row per probe to a tracked measures TSV — the corpus era's longitudinal record.

---

## 4. The do-NOT-do list

- Do not spend levers on clues/plot_structure/pacing **marks** — dead bands (F4) until P4 resolves the instrument.
- Do not touch the judge prompt as a side effect of anything — measuring-stick changes are owner decisions, made alone.
- Do not run batches. One probe per lever iteration; the corpus is the control arm.
- Do not conclude from the probe's marks (n=1, K2); conclude from P5's deterministic measures + the next external read.
- Do not un-build A_64's contracts if P2 stalls — plants are the precondition for withheld inference, not a competing theory.

**The anti-whack-a-mole rules (this campaign's own history, made binding):**
- **Never grow a detector's phrase list in response to paraphrase evasion.** A rising count under new phrasings means the generation contract failed — fix the contract (the Item-17 lesson: the arms race ended by contract, not by re-listing).
- **Never chase caps one at a time.** M3 already showed the next-cap-layer dynamic (scaffold died → mechanism-early and unplanted-evidence surfaced). A new cap is a SYMPTOM to trace to a shared root (F3-style) before any per-cap fix; per-cap fixes are allowed only for our own machine-inserted text, where they terminate by construction.
- **Contracts must be pruned as they are added.** The obligation block ends Phase 1 smaller than it started; every new instruction names the instruction it replaces or retires. Instruction soup is the mole field where models misweight everything.
- **Detectors are measures; contracts are levers; gates are floors.** A measure that starts driving regens without an owner decision has changed category silently — that is how the inject→detect→regen→re-inject loop was born (A_64 §1).

