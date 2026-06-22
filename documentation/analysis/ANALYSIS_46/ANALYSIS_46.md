# ANALYSIS_46 — Run `c133fe54` headline says **96.64/A** while the prose is a **64/70**: the chasm proves the rubric must own the headline, Phase 0's calibration is validated live, and every defect recurs as an ANALYSIS_45 §8 *class* (+ two new classes)

Status: **investigation complete; run COMPLETED (10/10 chapters); headline overall_score 96.64/A vs rubric 64 vs ChatGPT 70 — the gap is the finding; ANALYSIS_45 §8 plan validated on a 2nd run; Phase 0 (C1/C2) confirmed live + correct; two new defect classes identified (D6 mechanism plausibility, D7 cross-run mode collapse); recommendations open**
Run reviewed: `run_c133fe54-68a1-4b73-b240-f17d5856988c` (project `proj_8e6d7185`, "Blackwood Manor", 2026-06-22T21:14:49Z), culprit **Lady Eleanor Blackwood**, victim **the late master of the house** (NOT fully named — see §3 D1).
Sources: prose [`stories/story_20260622-2214/…required_.md`](../../../stories/story_20260622-2214/generated_in_scene_batches_10_batch_es_required_.md) (232 lines); human review [`…/chatgpt-review.txt`](../../../stories/story_20260622-2214/chatgpt-review.txt) (70/100); report `apps/api/data/reports/proj_8e6d7185…/run_c133fe54….json` (overall **96.64/A**, rubric diagnostic); checkpoint `logs/agent9-checkpoint-run_c133fe54….json`.
Scorers: **headline 96.64/A** (15-phase average); **rubric (live, shadow) 64/100** (raw judge **69**); **ChatGPT 70/100**.
Predecessor: **ANALYSIS_45** (run `story_20260622-2122`, "Fairweather Manor", rubric 65 / ChatGPT 71; §8 strategic plan authored). Phase 0 (C1/C2) landed `8ec05d6e` *before* this run.

---

## 0. TL;DR

1. **The headline number is meaningless and this run proves it dramatically.** The pipeline's `overall_score` — the average of 15 deterministic per-agent artifact scores — is **96.64 / A** for a story with raw validation-checklist text dumped into Chapter 9, the two lead characters' pronouns swapped, and a physically impossible mechanism. The rubric (64) and the human (70) agree the draft is mediocre. **The 15-phase average measures process health, not product quality; the rubric must own the headline.** This is the strongest single argument yet for promoting `RUBRIC_SCORING_MODE` past shadow.
2. **Phase 0's calibration is validated live and correct.** The rubric ran with C1/C2 active: **C1 correctly *deferred*** — the victim is only "the late master of the house," no `role:victim` cast member, so the old code would have false-capped `victimUnnamed ≤72`; the new code did **not** flag it (no victim-unnamed cap in the report). **C2 fired correctly** — the report shows *"**significant** prompt / template / validation-text leakage → overall ≤ 65"*, i.e. the ≥2-fragment material-leakage path, which is right (Ch9 leakage is egregious). The judge's **raw 69 is within 1 point of ChatGPT's 70** — the critic half is well-calibrated.
3. **The rubric is now *stricter than the human, but faithful to the written rubric*.** Final 64 vs ChatGPT 70: the gap is the leakage overall-ceiling (≤65), which the rubric applies (Ch9 leakage is *not* minor) and ChatGPT did not. Per scoring-approach.md ("overall should not exceed 65 unless leakage is very minor"), **64 is the more rule-faithful number; ChatGPT was lenient.** This is a defensible cap, not a bug (contrast ANALYSIS_45, where the cap over-fired on *minor* leakage — C2 fixed that).
4. **Every defect is an ANALYSIS_45 §8 *class*, recurring** (§3): D1 murder-method (now *contradictory*: a stab wound vs a mercy-killing confession), D2 Ch9≈Ch10, D3 control-plane leakage (the **worst yet** — raw discriminating-test + clearance schema pasted into Ch9), D4 pronouns (both leads mis-gendered). The plan's diagnosis holds across two runs.
5. **Two new classes the plan must absorb** (§4): **D6 — mechanism *plausibility*** ("the wind rewinds the clock by forty minutes" is physically absurd; the §4.3 Agent-3b feasibility/plausibility judge is the home), and **D7 — cross-run mode collapse** (this "Blackwood Manor, clock-winding, Lady + Inspector" is structurally the *same mystery* as the 2122 "Fairweather Manor, clock-winding, Lady Constance + Inspector" — exactly what the dark Agent-8 novelty store catches).

---

## 1. The headline-vs-reality chasm (the finding)

| Scorer | Score | What it measures |
|---|---|---|
| **Pipeline headline** `overall_score` | **96.64 / A** | average of 15 per-agent *artifact* scores → process health |
| **Rubric (live, shadow)** | **64 / Promising but rough** | the *finished prose*, capped by deterministic facts |
| **ChatGPT (human)** | **70 / 100** | the finished prose |
| Agent 9 phase score | 80 / passed | the prose *artifact* against its gates |

The headline calls an A+ a story that the two prose-reading judges call mediocre. The 32-point gap is not noise — it is the structural flaw the scoring-alignment redesign exists to fix: **fifteen agents each passed their artifact gate (hence 96.64), while the *book* leaks validation text, swaps its leads' genders, and asks a reader to believe wind rewinds a clock 40 minutes.** Process health ≠ product quality. The rubric and the human, reading the actual prose, converge near 64–70. **This run is the canonical evidence to make the rubric the headline.**

---

## 2. Phase 0 (C1/C2) — validated live, and correct

The report's `rubric_score` diagnostic, generated during this run:

- `final: 64`, `raw_total: 69`, band "Promising but rough".
- `caps_applied`: `prose ≤ 4` (leakage) · **`significant … leakage → overall ≤ 65`** (the **C2** ≥2-fragment path) · `ending ≤ 6` and `overall ≤ 75` (weak murder method).
- categories: `… pacing:5 ending:6* prose:4*` (only the two capped marks marked `*`).
- **No `victim unnamed` cap** — the **C1** fix working: the victim is unnamed-ish ("the master"), and rather than the old false `≤72` cap, the new code *deferred* to the judge (which scored character_clarity 7, in line with ChatGPT's 6).

So both calibration fixes behaved exactly as designed on independent live data: C1 removed a false positive, C2 correctly recognised *material* leakage (and would have stayed silent on a single line). And the judge's raw 69 ≈ ChatGPT 70 confirms the critic is well-tuned; the cap engine is now the only source of divergence, and here its divergence is *rule-faithful strictness*, not error.

---

## 3. The recurring ANALYSIS_45 §8 defect classes (2nd data point)

| # | Class | Evidence (line refs) | ChatGPT | §8 fix |
|---|---|---|---|---|
| **D3** | **Control-plane leakage — worst yet** | Ch9 dumps raw schema: *"Dr. Beatrice Langley was cleared because the Medical appointment records and absence during murder window established by…"* (L187–189); *"Inspector … set out two competing theories. Either The stopped clock… or Proves the physical mechanism… The comparison used A controlled test is arranged where…"* (L203–207). This is the `discriminating_test.design` + clearance fields pasted verbatim. | "the generator's validation checklist entered the prose … hurts the final section badly" → Prose 5 | **R-A** chapter-as-contract: hand the obligation + key terms, never the spec sentence |
| **D1** | **Murder method — now *contradictory*** | "a crimson stain blooming on the crisp linen shirt" (L9, violence) vs "He was suffering… His illness… I could not bear to watch him fade" (L197–199, mercy/illness). Never reconciled; method never stated. | "crimson stain implies stabbing… reveal talks like a mercy killing. Those don't match." → Ending 6 | **L1** required `death_method` field (≠ mechanism), validated, surfaced in the reveal |
| **D2** | **Ch9 ≈ Ch10** | Lady Eleanor confesses in Ch9 (L197–199); Ch10 "Clearance and Culprit Revealed" repeats every clearance + the confession (L217–227). | "Chapter 9 already … gets the confession. Then Chapter 10 repeats." | **S1** scheduler authoritative — test and reveal get distinct slots |
| **D4** | **Pronouns — both leads mis-gendered** | Pembroke (male) → "**She** set the clock" (L55), "**She** traced the arc with **her** finger" (L79). Lady Eleanor (female) → "**his** poise" (L15), "**his** opportunity to open the window" (L107), "**He** met Pembroke's gaze, but **his** eyes" (L173), escorted away then "**His** final glance" (L227). | "Pronouns still slip … Pembroke 'She set the clock'… 'his opportunity' referring to Lady Eleanor" → Char 6 / Prose 5 | **R-B** gender-aware pronoun critique over `CASE.cast.gender` |

Also recurring: **template-phrase leakage** ("The elapsed time was confirmed as three minutes" L11/55/75/103; "…forty minutes" L169; "The time was recorded as ten minutes past eleven" L53) and the scaffold term **"the device door"** (L119, L131) — the exact strings `detectTemplateLeakage` catches, which is why C2's *significant-leakage* path fired.

**The §8 plan's single diagnosis holds on a second, independent run:** every defect is a load-bearing reader-facing fact the logic left implicit, that the prose then transcribed (D3), omitted/contradicted (D1), smeared (D2), or got wrong (D4).

---

## 4. Two new classes the plan must absorb

### D6 — Mechanism *plausibility* (Agent 3 / 3b)
"the wind, entering through a gap of six inches, is sufficient to **rewind the mechanism by forty minutes**" (L193); "it would strike the exposed pendulum arm … winding the clock backward by exactly forty minutes" (L223). A gust does not wind a pendulum clock backwards 40 minutes — it is physically absurd, and the whole proof hangs on it. ChatGPT: *"the wind mechanism is clever but physically muddy … that is a lot to ask from a gust,"* and proposes the believable version (wind *stopped* the clock; the culprit had *already* set it back). **This is the §4.3 Agent-3b feasibility/plausibility judge's job** — the hard-logic device must pass a "would this actually work?" check before Agent 3 builds a proof on it. **Strategic, general:** every CML's mechanism must be physically possible in its era *and* mechanically sound; add a plausibility gate at device selection. *(Note: this is distinct from era-feasibility, which `@cml/device-library`'s `checkFeasibility` already does — D6 is mechanical soundness, the LLM-judge leg of §4.3.)*

### D7 — Cross-run mode collapse (Agent 8)
This run and its predecessor are **the same mystery in new clothes**:

| | ANALYSIS_45 (`2122`) | This run (`c133fe54`) |
|---|---|---|
| Setting | Fairweather **Manor** | Blackwood **Manor** |
| Axis / mechanism | temporal / **clock manipulation** | temporal / **clock manipulation** |
| False assumption | stopped clock = time of death | stopped clock = time of death |
| Culprit | **Lady** Constance | **Lady** Eleanor |
| Detective | Inspector (Bramley) | Inspector (Pembroke) |

Two consecutive generations collapsed onto one structural fingerprint (axis `temporal`, mechanism `clock manipulation`, false-assumption "stopped-clock⇒time-of-death", lady-culprit + inspector). **This is exactly the cross-run mode collapse `@cml/novelty`'s store detects** — and Agent 8 is *dark* (threshold 1.1; ANALYSIS_… confirmed). **Strategic, general:** stand up the cross-run fingerprint store so run N+1 cannot reuse run N's axis+mechanism+false-assumption. The novelty package + the deterministic structural compare already exist; they need the LLM skeleton-extractor to run on the live CML.

**Plan addendum:** add **D6** to Layer 1 (logic — a mechanism-plausibility gate at Agent 3b, the §4.3 judge) and **D7** as a new **Layer 0 (premise/novelty)** — front-run mode collapse *before* the expensive elaboration, per the Agent 8 redesign.

---

## 5. Recommendations (delta over ANALYSIS_45 §8)

The §8 plan is unchanged and reaffirmed; this run adds urgency and two classes:

- **P0 (new urgency): promote the rubric toward the headline.** The 96.64-vs-64 chasm is the case. Concretely: surface `rubric_score` prominently in the report/UI now (it's already attached as a diagnostic), and plan `RUBRIC_SCORING_MODE=primary` once a short canary confirms the judge tracks humans (raw 69≈70 here, 70≈71 last run — two points already). The 15-phase average becomes a *secondary* "process health" block.
- **P1 unchanged:** promote `@cml/beat-scheduler` (S1) — fixes D2 (Ch9/Ch10 split) for any story.
- **P2 unchanged:** CML facts L1 (death_method — fixes the *contradiction* in D1, the sharpest defect this run) + L2/L3.
- **P2′ (new, D6):** add the Agent-3b mechanism-plausibility judge (§4.3) — would have caught "wind rewinds clock 40 min" before Agent 3 built the proof.
- **P3 unchanged:** R-A chapter-as-contract (kills the Ch9 leakage class) + R-B pronoun critique + R-C HARD/SOFT accept floor (the Ch9 leakage shipped via completion-first fallback — the floor would have blocked it as a *hard* contract violation).
- **P-Novelty (new, D7):** wire the Agent-8 skeleton fingerprint + cross-run store so run N+1 can't be run N. Two-for-two clock-manor mysteries is a live mode-collapse signal.

**Anti-tactical reminder (per §8.4):** none of these is "fix the Blackwood story." Each is a class fix — required `death_method` for *every* CML, plausibility gate for *every* mechanism, contract render for *every* clue, novelty store for *every* run — proven on a corpus, indifferent to whether the manor was Blackwood or Fairweather.

---

## 6. One-paragraph summary

The pipeline graded this A+ (96.64) while the prose dumped its validation checklist into Chapter 9, called the male inspector "she" and the female culprit "he," and claimed wind rewinds a clock by forty minutes — and both prose-reading judges (rubric 64, human 70) saw through it. That chasm is the case for making the rubric the headline, and this run validates the ANALYSIS_45 §8 plan twice over: Phase 0's calibration behaved exactly right live (C1 deferred on the un-named victim, C2 correctly flagged *material* leakage, raw judge 69 ≈ human 70), and every defect recurred as a *class* the plan already targets — plus two new classes it must absorb: mechanism *plausibility* (a gust cannot rewind a clock — the Agent-3b feasibility judge) and cross-run *mode collapse* (two consecutive clock-winding manor mysteries — the dark Agent-8 store). The fix list is unchanged in spirit and stronger in evidence: calibrate the score (done), make it the headline, then pin the facts, schedule the placement, gate the plausibility, render from a contract, and guard novelty — every one a grammar fix, none a sentence patch.
