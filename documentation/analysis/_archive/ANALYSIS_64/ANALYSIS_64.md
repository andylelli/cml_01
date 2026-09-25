# ANALYSIS_64 — §7.6: the scaffold-residual autopsy and the craft-lever design

**Written:** 2026-07-21 · **Trigger:** A_63 §7.6 FIRED (7.5 median 61 < 73) · **Scope per §2.8:** corpus-driven design, deterministic fixes, ONE probe run, no batches. **Supersedes nothing** — this is the first work item of the corpus era.

**The one-sentence status:** the 50% scaffold residual is the pipeline's own injector templates shipping uncaught (two named mechanisms, both fixture-pinnable, worth ≈ +2 median), and the raw-craft gap is one coherent syndrome across 33 runs — clues planted too late, timeline muddled, reveal rushed — for which this doc designs one generation-side lever with three sub-contracts.

---

## 0. What §7.6 asked

Two questions from A_63 / the ledger's 7.4–7.5 row:

1. **Scaffold-residual autopsy** — why does `deductive-scaffold → prose ≤ 4` fire on 8/16 final-config fresh runs when P3's verdict was "−85%, residual 3/20"?
2. **Craft-lever design** — clues 5.31 / plot_structure 5.56 / opening_hook / prose have no owning lever; design one from the corpus. DESIGN ONLY; validation is fixtures + one probe.

---

## 1. The autopsy — method and instrument check

Method: re-run `detectScaffoldNotProse` (the exact function `facts.ts` uses for the rubric cap) per chapter over the 16 shipped stories (`STORY_SAVED` markdown from the chain logs), and cross-reference each hit against (a) the chapters the in-run `scaffold_not_prose` regen touched (prompt archives — the flag-verification doctrine applied), and (b) the run's full LLM request/response record.

**Instrument check: 16/16 agreement** between the offline recompute and the rubric caps. The cap is honest; the question is what it's catching.

### 1.1 The headline facts

| Fact | Value |
|---|---|
| Ship-time hits, entire pool | **10 hits, exactly TWO rules**: `A3:accounted_for_movements` ×6, `B5:beyond_reasonable_doubt` ×4 |
| Where | Reveal chapters only (ch 8/9/10) |
| A1 family (P3's target) | **0 ship-time hits** — the P3 lever's actual target is dead |
| Scaffold regen activity | 67 `Agent9-Regen-Ch*-scaffold_not_prose` calls across all 16 runs — the lever is ON and firing everywhere |
| Correlation regen-count ↔ cap | None (capped runs had 2–5 calls; uncapped up to 9) |
| Regen'd chapter still hit at ship | **7 of 8 capped runs** |
| Artifact record of any of this | **Zero** — scaffold-pass telemetry is absent from every report (the #12/#13 forensic-blindness family again) |

**P3 was not wrong; it was answered.** P3 measured the A1 surfacing family on replays and killed it (−85% there, 0 ship hits now). The load moved to A3/B5 — different injectors, different mechanism, invisible to the P3 frame.

### 1.2 A3 and B5 are OUR OWN SENTENCES

Both rules are verbatim signatures of the pipeline's deterministic injectors (`scaffold.ts` SEED_SIGNATURES):
- **A3** ← clearance patch, `deterministic-repair.ts:487` — inserts "…accounted for X's movements elsewhere…"
- **B5** ← culprit-evidence injection, `agent9-run.ts:2160` — inserts "NAME was responsible, and the evidence placed the matter beyond all reasonable doubt."

The 50% cap rate is the pipeline fighting itself: **injector inserts template → detector flags → regen dramatizes → injector (or a sibling) re-lands the template → ships → cap.** Two distinct mechanisms, both traced end-to-end on live runs:

### 1.3 Mechanism A (A3, 6 hits): regen fails on the flagged text and the pipeline ships it anyway

Trace — `dv_clock_off` / run `run_20260720-1725`, call 48 (`Agent9-Regen-Ch10-scaffold_not_prose`):
- Chapter 10 at regen time carried TWO A3 instances (Mallory Finch's + Beatrice Quill's). The obligation named **one** fragment and told the model to focus on **one paragraph index**.
- The regen RESPONSE still contains the flagged sentence **verbatim**: *"By the time of the crime, the Alibi confirmed: nine to ten PM accounted for Beatrice Quill's movements elsewhere; Beatrice Quill could not have been the killer."* (capital-A "Alibi", colon syntax — raw patch text, not prose).
- It shipped. Acceptance did not reject the chapter (multi-instance + paragraph-focus + bounded-attempts = the UNRESOLVED "cap may still apply" path — whose warning is also absent from the artifact).
- A later post-pass then rewrote *"the killer"* → *"Captain Ivor Hale"*, producing semantic nonsense in the shipped story: *"Beatrice Quill could not have been Captain Ivor Hale."* A name-sweep substituted an identity into a role slot, after all validation.

### 1.4 Mechanism B (B5, 4 hits): the RC1.4 no-op-floor is split-brained and the injector writes AFTER the last LLM call

Trace — `v_tide_enforce` / run `run_20260720-2228`:
- Shipped ch10 contains the verbatim B5 template. The sentence appears in **no Agent-9 request or response in the entire run** — only in the RubricScorer request. It was inserted by code between the last regen (22:45:01) and scoring (22:45:18).
- `AGENT9_REGEN_CULPRIT_EVIDENCE=true` — yet the archive has **zero** culprit-evidence regen calls. RC1.4's design ("regen runs BEFORE its injector; success makes the injector a logged no-op floor") is defeated by a **split-brain**: the regen pass's own missing-deduction scan found nothing to do, while the injector's separate check later found a gap and pasted the template — post-repair, unvalidated. This is the same pathology 7.2 found in dual-value (`worldState.contradiction` vs the detector's pair): **the repair does not consume the gate's signal** — class-#5 doctrine violated in a second location.
- `v_poison_shadow`'s ch9 hit (the one "never-flagged" chapter) is this mechanism too: the injection postdates the in-run detection pass, so the detector never saw it.

### 1.5 What the cap costs (sizing the buy-back)

Derived from the 16 reports (`final` vs `raw_total`):

| | median final | counterfactual (caps removed) |
|---|---|---|
| Pool (n=16) | **61** | **63** (mean 62.75 → 64.38) |

Two runs additionally carried `significant deductive-scaffold → overall ≤ 65`. Several capped-prose reviews are **pure praise text with mark 4** ("readable and engaging, vivid descriptions, strong narrative voice" → 4) — cap artifact, not prose judgment. **The deterministic fix below is worth ≈ +2 median points and removes the largest live cap. It is not the road to 73 by itself; §3 is.**

---

## 2. Design part I — the deterministic ordering fix (reliability, code-only)

Four fixes, all fixture-pinnable from the two shipped sentences above, in priority order:

- **F1 — unify the culprit-evidence signal (kills Mechanism B).** The B5 injector and `runCulpritEvidenceRegenPass` must consume ONE missing-deduction derivation. If the shared signal says a deduction is missing, regen runs first (targeted, one call); the injector fires only as the failure floor — and any injector write routes through F2. If the shared signal says nothing is missing, the injector must not fire. (Same doctrine, same shape as the 2.2 dual-value rewire — build both to the same pattern.)
- **F2 — final-write re-validation (backstops both mechanisms).** After the LAST deterministic mutation of any chapter, re-run `detectScaffoldNotProse` on that chapter. On a hit: one whole-chapter-acceptance regen attempt; if still failing, ship WITHOUT the injected sentence when the underlying obligation is advisory, else ship with the cap **and a warning that reaches the artifact**. No text-writing pass may run after this check.
- **F3 — whole-chapter regen acceptance (kills Mechanism A).** The scaffold regen obligation must enumerate ALL flagged fragments in the chapter; acceptance must reject any response in which ANY scaffold rule still fires on the whole chapter — not just the named paragraph. (dv_clock_off failed on exactly this: two instances, one named, response kept the named one.)
- **F4 — guard the name-sweep.** Whatever pass rewrote "the killer" → "Captain Ivor Hale" must never substitute a proper name into a role predicate ("could not have been the killer/the murderer/responsible"). Locate the pass, fixture the corruption, add the guard. (Also: it ran after validation — F2's "no writes after the final check" subsumes the ordering half.)
- **F5 — telemetry debt (cheap, do with F1–F4).** Scaffold-pass activity (fired/repaired/unresolved per chapter) must reach the report artifact. 67 regen calls with zero artifact trace is how this residual stayed invisible for a month.

**Validation:** fixtures first (the two shipped sentences + the split-brain condition), then the §2.8 singular probe run — expected: scaffold cap ~0/1, artifact carries the pass telemetry. The probe doubles as the C-lever probe (§4).

---

## 3. Design part II — the craft lever: THE PLANTED MYSTERY

### 3.1 The corpus evidence (33 on-disk scored runs; deficit = mark ≤ 6)

| category | mean | deficit share | THE recurring complaint (near-verbatim across runs) |
|---|---|---|---|
| clues | **5.21** | **32/33 (96%)** | "present but **not planted early enough / not foreshadowed**; introduced too late; reveal feels **unearned/unfair**" |
| plot_structure | **5.55** | **32/33 (96%)** | "**timeline muddled** by conflicting witness accounts; too many characters re-litigating; **resolution rushed** without buildup" |
| pacing | 5.94 | 30/33 (90%) | "drags in **alibi/exposition discussions**; **climax/reveal rushed**" |
| prose | 5.48 | 23/33 (69%) | "overly descriptive/verbose" + **cap artifacts** (§1.5) |
| character_clarity | 6.12 | 25/33 (75%) | "minor characters interchangeable; motivations vague until late" |
| ending | 6.12 | 21/33 (63%) | "reveal **relies on confession, not deduction from planted clues**; emotional fallout skipped" |
| opening_hook | 6.33 | 19/33 (57%) | "victim+setting fine but **stakes/urgency arrive late**; over-description" |

The complaints are near-verbatim across 33 independent stories — this is **pipeline shape, not story variance**. And they compose into ONE syndrome: *clues aren't planted before they're needed → the middle re-litigates a muddled timeline instead of advancing → the reveal must therefore arrive by assertion/confession → unearned, rushed, unfair.*

### 3.2 Why the pipeline produces exactly this

The beat-scheduler (`packages/beat-scheduler`) schedules `reveal_clue` obligations — **a clue's reveal is its FIRST and only appearance**. There is no plant/foreshadow obligation kind (red herrings get `plant_red_herring`; real clues don't get planted). `placement` comes from the CML clue (default "mid"), and essentials are only constrained to land before the discriminating test. A "late" essential legitimately first appears in Act 3 — which a reader (and the rubric) reads as "introduced too late, unearned." The reveal chapter then has no planted history to cite, so the deduction can only assert — hence confession-driven endings, hence the B5 injector existing at all.

**The injectors are the symptom of the missing craft contract.** A reveal that walks planted clues doesn't need a culprit-evidence template pasted in.

### 3.3 The lever — three sub-contracts, one mechanism

**C1 — plant-before-reveal (attacks clues, the 96% deficit).**
- Scheduler: new obligation kind `plant_clue { id, revealSlot }` — every `essential` clue gets a plant slot **≥ 2 scenes before its reveal**, laid by construction (no LLM, same guarantee style as the rest of the grid). Supporting clues: plant when slack exists.
- Drafting contract (Agent 9 per-scene): a plant is a **sensory/incidental appearance with its significance unflagged** (the object/fact is on the page; nobody says it matters). The reveal scene surfaces the significance.
- Deterministic post-check: for every essential clue, first-mention chapter ≤ reveal chapter − 1. (Advisory first; gate only after the probe.)

**C2 — the earned reveal (attacks ending + clues-unearned + pacing-rushed; retires the B5 injector's job).**
- Reveal-chapter beat contract: the deduction **walks the essential clues in planted order, citing each one's earlier appearance** ("the tide table we saw on the first morning…"); the confession — if any — **confirms** the deduction, never supplies it; a **denouement beat carries the emotional fallout** (motive understood, consequences landed — the grid already schedules `denouement`; the drafting prompt must give it content).
- This is the generative replacement for the culprit-evidence injector: when C2 holds, F1's shared signal finds nothing missing and the injector is structurally idle.

**C3 — the timeline spine (attacks plot_structure + pacing-drags).**
- One canonical timeline (already derivable from the CML) rendered into every alibi/interrogation scene prompt.
- Scene contract in the grid's `function` line: each interrogation/alibi scene **resolves or sharpens exactly ONE timeline question** — it may not re-open settled facts. (The corpus's "drags during repetitive alibi discussions" is scenes re-litigating the whole board.)

Fold-in (cheap, adjacent): opening_hook — ch-1 contract requires the stakes beat (irreversible event + personal stake) before chapter end; the built-but-OFF RC3.5 discovery-tell lever (`AGENT7_DISCOVERY_TELL`) is one flag and directly serves "key tell lands early" — flip it in the same probe.

### 3.4 Priority and expected value

C1 > C2 > C3. C1+C2 are one contract seen from both ends (plant → cite-the-plant) and travel together in the probe. The honest arithmetic: caps fix ≈ +2 median (§1.5); the raw-craft distance to 73 is ~10 points concentrated in the §3.1 table; C1/C2/C3 attack the three highest-deficit categories at their named root causes. No number is promised — the probe checks wiring, M3 measures.

---

## 4. Validation plan (§2.8-compliant)

1. **Fixtures before any run** — Mechanism A sentence, Mechanism B condition, name-sweep corruption, plant-before-reveal grid property (scheduler unit test: every essential has a plant slot ≥2 before reveal), reveal-cites-plant prompt contract snapshot.
2. **ONE probe run** with F1–F5 + C1 + C2 (+ RC3.5 flip). Read as wiring/smoke only (K2 confound doctrine — no quality conclusion at n=1): scaffold cap fired? plant slots present in the grid? first-mention distribution moved? artifact telemetry present?
3. **The quality read happens at M3** (§7.7's ≥4×4 batch) — which was always the plan; this lever just has to be IN the final defaults before M3 launches.

## 5. Do-NOT-do (inherited + new)

- Do not conclude anything from the probe's rubric marks (n=1; K2).
- Do not delete the injector layer in this change — F1/F2 make injectors idle-by-construction; deletion stays the separate, last, smoke-run-validated step (A_63 §2.4).
- Do not add a "timeline recap scene" as prose — that is the scaffold family reborn; C3 constrains scene function, it does not add explainer scenes.
- Do not hand-extend the ledger — derive.

## 6. Task list for the build (attended estimates)

| # | Task | Size | Status (2026-07-21) |
|---|---|---|---|
| B1 | F3 whole-chapter acceptance + F4 name-sweep guard + fixtures | ~1–2h | ✅ replace-wording instruction; detector-gated exhaustion floor (A3→"placed X elsewhere", B5→evidence-preserving); FLOORED warning; negated-identity guard in the role-alias sweep (→"responsible", possessives stay referential); A3 template tail de-collided. Fixtures: the two shipped sentences verbatim |
| B2 | F1 shared-signal rewire (with the 2.2 dual-value rewire — same doctrine, do together) | ~2–3h | ✅ `culpritEvidenceLinkInText` consumed by BOTH the RC1.4 pass and the injector (the split-brain was the name matcher: case-sensitive substring vs `/\b…\b/i` — "hale and hearty" false-linked); 7.2 rewire: `assembleScoringChapterTexts` single-sourced (orchestrator delegates), ship-scope detector + full-story residual regen arm + warn-only ship-check |
| B3 | F2 final-write re-validation + F5 telemetry to artifact | ~1–2h | ✅ scaffold SHIP-CHECK in the last-write-wins slot (post-injectors, pre-validation; floors + honest-residual warnings); `run_warnings` diagnostic carries the FULL warnings array into every artifact |
| B4 | C1 scheduler `plant_clue` + unit tests | ~2–3h | ✅ scheduler-synthesized plants ≥2 slots before essential reveals (by construction, `checkPlantBeforeReveal` self-verified) + `applyPlantBeforeReveal` additive outline stamp (RC3.5 pattern, `AGENT7_PLANT_BEFORE_REVEAL`, runtime getter) |
| B5 | C2 reveal-walk + denouement drafting contracts | ~1–2h | ✅ PLANT OBLIGATIONS rendering (incidental, significance-unflagged, narrator-hint forbidden); walked deduction (prior essentials in reader order); CONFESSION CONFIRMS, NEVER SUPPLIES; AFTERMATH REQUIRED on the final chapter |
| B6 | C3 timeline spine + scene-function contract | ~2h | ✅ canonical claimed-accounts spine (victims excluded) + ONE-QUESTION rule on pre-reveal interrogation-register scenes |
| B7 | Probe run + wiring read | ~1h attended | ✅ **PASS** 2026-07-21 — `mystery-1784662295274` (tide), gate=warning (SHIPPED), **zero caps of any kind** (`caps_applied: []`), rubric 63/63 raw (n=1, recorded not concluded). **Live-verified:** C1 stamped 17 plants and PLANT OBLIGATIONS reached the Agent-9 prompts; C2 walked-deduction + confession-confirms + aftermath in the reveal request; F5 `run_warnings` (37) in the artifact; offline ship-time scaffold recheck clean; **F1 agreement by mutual silence** (no injector fire, no regen call — the link existed naturally in the walked reveal, the predicted C2 effect). **One build slip found and closed:** the B6 rebuild hadn't taken, so C3 was absent from the probe's dist — dist rebuilt, the one-question rule un-gated from spine availability (probe review fix), and C3 verified OFFLINE against the probe's own outline+cast (renders in chapters 2/3/5: exactly the interrogation-register scenes). No second run spent (§2.8). |

All build steps test-covered: beat-scheduler 17/17 · prompts-llm 798 · worker 343 · tsc clean across all three; worker + package dists rebuilt (the canary imports worker dist).

**Build order (run budget cut 33%, owner 2026-07-21): B1 → B3 → B2 → B4 → B5 → B6 → B7.** C3 no longer rides a second singular run — the ONE probe carries F1–F5 + C1 + C2 + C3 + the RC3.5 flip together, and M3 is pinned at exactly 4 runs (its acceptance floor), no contingency re-queues budgeted. Remaining runs: **5 total (~£7.5)** — probe 1, M3 4.
