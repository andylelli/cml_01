# ROADMAP TO 90+ — the wall is the **judge**, not the prose: 90 is effectively unreachable (and *unmeasurable*) as an automated target; the realistic asymptote is **76–80**, dependable floor **73–76**

Status: **strategic roadmap, adversarially stress-tested. Sibling of [ANALYSIS_47](./ANALYSIS_47.md) (the validation + diagnosis) and [ROADMAP_TO_80.md](./ROADMAP_TO_80.md) (the near-term operational plan; start there for what to build first). Verdict: 90 = category average 9.0 with no weak category; this is a human-supervised research program (~2–8%/run and not trustworthy today), not a deliverable. The decisive, code-verified finding: the generator already runs on `gpt-4.1` and four categories STILL froze — so the dominant ceiling has moved to the JUDGE (a `gpt-4.1-mini`, temp 0.2, "start at 5/10" scorer with no 9/10 anchors and no top-band calibration) and to genuine craft, neither of which pipeline plumbing crosses.**

Method: three design lenses (craft excellence / mystery excellence / system prerequisites) → synthesis → adversarial feasibility review. All model/prompt facts below are **verified in the repo**, not inferred.

---

## 0. TL;DR — the honest arc

| Tier | Band | Realistic odds | Nature |
|---|---|---|---|
| **T1** M0/M1/M4 deterministic-defect cure (ANALYSIS_47 §9.2) | **73–76 "Solid draft"** | **~70–80%** | Engineering — fundable now |
| **T2** judge re-calibration + real critique→rewrite loop | 77–80 "Very strong" (low end) | ~25–40% | Contested — two unproven bets |
| **T3** originality engine + blind-read surprise judge | 83–86 | ~10–20% | Research |
| **T4** distinctive voice at near-zero defect | **90+ "Excellent"** | **~2–8%** | Human-supervised research program |

**Most likely stall: 78–80.** The arc is gated, in order, by: deterministic defects (solvable) → a judge that cannot emit/measure top-band marks (the real wall) → craft + originality ceilings on the generator (research).

Three findings drive everything below:
1. **The easy lever is already spent.** Prose runs on `gpt-4.1` (`.env.local` `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE=gpt-4.1`), and `premise=7 / opening=6 / dialogue=6 / ending=6` still froze across 5 runs. "Upgrade the cheap writer" is no longer the answer.
2. **There is a scoring-system ceiling.** The judge is `gpt-4.1-mini` at temp 0.2, reusing the base deployment (there is **no** dedicated judge-tier env var), under a prompt that says *"start EACH category at 5/10… Do not inflate"* ([prompt.ts:17](../../../packages/rubric-score/src/prompt.ts#L17)) with **zero in-context 9/10 exemplars**. A low-temp model told to start at 5 and justify every increment clusters at 6–8 — which is exactly the observed zero-variance freeze.
3. **90 is not measurable today.** The rubric was calibrated near 65, runs 1–6 pts under ChatGPT, and has **zero calibration data in the 80–90 band**. You can trust neither a 90 it emits nor its refusal to emit one.

---

## 1. The evidence: four frozen categories + the verified configuration

Per-category marks across **five independent runs** (the same table as ANALYSIS_47 §9.1):

| Run | final | premise | opening | dialogue | ending | prose | pacing | char | atmos | plot | clues |
|---|--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 2336 | 68 | **7** | **6** | **6** | **6\*** | 7 | 6 | 7 | 8 | 7 | 7 |
| 2343 | 65 | **7** | **6** | **6** | **6\*** | 4\* | 6 | 7 | 8 | 7 | 7 |
| 2351 | 62 | **7** | **6** | **6** | **6\*** | 4\* | 5 | 6 | 8 | 7 | 7 |
| 2039 | 65 | **7** | **6** | **6** | **6\*** | 6 | 6 | 6 | 8 | 7 | 7 |
| 2102 | 66 | **7** | **6** | **6** | **6\*** | 6 | 6 | 6 | 8 | 7 | 7 |

`premise=7, opening=6, dialogue=6, ending=6(capped)` — **zero variance.** 90 requires every one of these at ~9 *simultaneously*. Best total ever recorded: 68.

**Verified configuration (the levers everyone assumes are available — and which actually are):**
- **Generator:** `gpt-4.1` for prose (`AZURE_OPENAI_DEPLOYMENT_NAME_PROSE`); base `gpt-4.1-mini`. The freeze is on a frontier-ish writer, not a cheap one.
- **Judge:** `gpt-4.1-mini` at temp 0.2, reusing `AZURE_OPENAI_DEPLOYMENT_NAME` — **no judge-specific tier exists**. Prompt: *"start EACH category at 5/10. Add points only for clear strengths… Do not inflate"* ([prompt.ts:17–18](../../../packages/rubric-score/src/prompt.ts#L17)); 9/10 given only as bare adjectives, **no exemplar of the 8→9 line**.
- **Surprise is structurally unmeasurable:** `buildRubricUserMessage` hands the judge *"Culprit (confirmed): X"* **before** the prose ([prompt.ts:48](../../../packages/rubric-score/src/prompt.ts#L48)). A judge given the answer key cannot be surprised — the `ending` mark cannot exceed its prior without a redesign.

---

## 2. The decisive finding — a scoring-system ceiling near 80

The freeze is most parsimoniously a **judge ceiling**, and this is the difference between ANALYSIS_47 (which assumed craft/model limits) and this document:

- A temp-0.2 model under "start at 5, justify every point upward, do not inflate" is **mechanically biased to the 6–8 mode**. Emitting a 9 means overcoming its own justify-every-increment prior **with no anchor that licenses a 9**. Four categories freezing with zero variance across five runs is the signature.
- **Because prose is already `gpt-4.1`**, the freeze cannot be blamed primarily on a cheap writer — which relocates the dominant suspected ceiling onto the judge.
- **90 is therefore unmeasurable before recalibration.** With zero data at 80–90, a 1–6 pt under-read vs ChatGPT, and documented under-perception of sub-threshold craft (under-counted pronouns 4:1; tolerated a verbatim schema dump at `clues=7`), you cannot tell a **craft-ceiling** apart from a **judge-ceiling** today. That ambiguity is the single most important unknown in the whole program.

**Consequence for sequencing:** recalibrating and re-tiering the judge is a *hard prerequisite* — it must come **before** any craft investment above ~76, or you will spend on prose gains the judge structurally cannot register.

---

## 3. The tiered roadmap

### T0 — Re-baseline the measurement (bookkeeping; do first)
Confirm which deployment each agent resolved on the 5 frozen runs (prose `gpt-4.1`, judge `gpt-4.1-mini`), and **add an `AZURE_OPENAI_DEPLOYMENT_NAME_JUDGE` tier** so the judge can be upgraded independently of the mechanical base. ~100%, one env line + logging. *Gate:* freeze reproduces on the logged config (it should).

### T1 — Deterministic-defect cure → **73–76** (the bankable floor)
Exactly the ANALYSIS_47 §9.2 program, all engineering-class:
- **M0** R-A contract-render (locked facts surface as prose, not pasted schema; kills the `"It had taken three minutes in all."` injection and the doubled three/forty-minute bug) + **L1 `death_method`** (clears the `ending` weak-method cap, 6→7) + **R-B** pronoun sweep.
- **M1** delete `buildDeterministicGroundingLead` (the templated location-preamble that opens every chapter and is the Ch1 location mismatch + Ch6 doubled opener) — route grounding failures through micro-regen. **Add an atmosphere-density guard** so deleting it doesn't regress the lone 8.
- **M4** make Agent 7's beat scheduler **authoritative** (it currently runs `SHADOW`, "acts on nothing") + clue dedupe, so Ch2–4 stop re-litigating the open-window/stopped-clock beat.

*Lifts:* prose 4→6/7, pacing +1, opening +1 (named victim), plot/clues 7→8, ending 6→7. **~70–80%** to a durable 73–76. *Gate:* N≥5 replays, no leakage caps, median ≥73, atmosphere held ≥8.

### T2 — Judge calibration + revision architecture → **77–80** (contested)
Two compounding bets ANALYSIS_47 named as the real 80 blockers:
- **(a) Re-architect the judge** (not just re-prompt): move it off the mini tier via the new T0 env var; replace "start at 5, justify upward" with **anchored in-context 9/10 exemplars**; **validate against human/ChatGPT scores at 77–80**. This is what could unfreeze the premise/opening/dialogue priors.
- **(b) Build a real critique→rewrite loop** alongside the existing fidelity-polish: a CRITIC pass scoped to one category ("every on-the-nose alibi / flat-register line / repeated opener"), then a REWRITE at **temp 0.7–0.9**, deterministically re-validated and **rolled back if worse** (avoid the [[agent9-postprocess-after-validation]] trap). Wire the **built-but-dead VoiceCapsule** (`agent2b`) for idiolect.

*Gate (hard):* judge calibration error vs human within ±3 at 77–80 on a held-out set **before** trusting any craft gain; then dialogue and opening each move off 6 to ≥7 on N≥5. **If the judge cannot be calibrated to reliably emit 8s, STOP — 80 is not measurable and the arc ends here.** ~25–40%. (ChatGPT, which scores above this rubric, already capped the cheap-fix path at ~77.)

### T3 — Originality engine + surprise measurement → **83–86** (research)
Attacks the two categories no engineering reaches:
- **Originality:** a high-temp divergent `premise.logline / unusual_angle` pass + a persistent **cross-run novelty store** (D7) + replace the manor/clock/timetable Agent-3b exemplars + a **mechanism-plausibility gate** (D6 — kill "wind rewinds a pendulum clock").
- **Surprise:** a **two-pass blind-read judge** that predicts the culprit *before* seeing the reveal (surprise = prediction-wrong-yet-justified) — necessary because the judge is currently handed the culprit up front. Strengthen misdirection via critique→rewrite, with Agent 6 proving every reveal-clue was planted (no `revealUsesUnplantedEvidence` regression).

*Gate:* blind-read judge correlates with human surprise judgments; premise/ending each ≥8 on N≥5. ~10–20%.

### T4 — Excellent & polished → **90+** (human-supervised research program)
Every category ~9, several at 10, simultaneously, on N≥5. Requires **all of**: (1) a generator empirically proven (via a Claude-class bake-off with less over-prescriptive prompts) to write subtext-bearing, idiolect-distinct dialogue — `gpt-4.1` has not shown this in 5 runs; (2) a strong critic+rewriter loop (a weak critic revises toward the same cluster); (3) a judge re-calibrated **and** validated against genuine human 90-tier exemplars; (4) **best-of-N ensemble** selection by that trusted judge and/or a human acceptance gate to certify 90 was reached, not sampled. *Gate:* category median ≥9 across all ten on N≥5, agreeing with human top-band scoring. **~2–8%** as an automated target.

---

## 4. Category arc (current → 80-target → 90-target)

| Category | now | →80 (how) | →90 (how, class) |
|---|:--:|---|---|
| premise | 7 | 7–8 leakage-clean + plausible mechanism | 9 originality engine + judge that credits freshness — *research* |
| opening_hook | 6 | 8 delete grounding-lead, name victim in S1, lead with the contradiction — *engineering* | 9 one genuinely gripping line — *craft* |
| dialogue | 6 | 7 wire VoiceCapsule + one critique→rewrite | 9 subtext + distinct idiolect — **the hardest blocker, base-model/craft** |
| ending | 6\* | 7 L1 death_method clears the cap | 9 surprising-yet-inevitable + blind-read judge to *measure* it — *research* |
| prose | 4–7 | 7 contract-render kills all dumps | 9 sentence-level variety + voice — *craft* |
| pacing | 5–6 | 7–8 authoritative Agent 7 + dedupe + de-templated openers | 9 every scene changes state — *engineering→craft* |
| character | 6–7 | 8 VoiceCapsule + critique pass | 9 distinctive interiority — *craft* |
| atmosphere | 8 | 8 HOLD (density guard; don't regress when M1 lands) | 9 sensory that does plot work — *craft* |
| plot | 7 | 8 test uses only planted evidence — *engineering, safest bet* | 9 elegant interlocking lattice |
| clues | 7 | 8 dedupe + no schema dump | 9 intricate, re-reads-differently lattice — *craft* |

---

## 5. Non-negotiable prerequisites for 90

1. **A judge that can MEASURE the top band** — re-tier off `gpt-4.1-mini`, replace "start at 5" with anchored 9/10 exemplars, validate against human scores at 80–90. *Until this exists, 90 is unmeasurable, not merely unachievable.*
2. **A blind-read surprise judge** — predict-then-reveal; today the culprit is handed over before the prose ([prompt.ts:48](../../../packages/rubric-score/src/prompt.ts#L48)), capping `ending` at its prior regardless of quality.
3. **A generator proven to write 8–9 dialogue** — a Claude-class bake-off over N≥5 to disambiguate generator-ceiling from judge-ceiling (currently indistinguishable).
4. **A real critique→rewrite loop** at creative temperature with deterministic re-validation + rollback (the current `post-pass-polish.ts` is temp-0.2 "prefer no change" and cannot improve craft).
5. **An upstream originality engine** that *manufactures* fresh premises (the stack today only pushes *away* from seed-plagiarism, never *toward* originality).
6. **N≥5 replay acceptance + a human acceptance gate** for every claimed gain (single +1 rolls are inside the documented 65–70 ±2 noise band).

---

## 6. Hardest blockers (ranked)

1. **Scoring-system ceiling (dominant):** a `gpt-4.1-mini`, temp-0.2, "start at 5/10" judge with no 9/10 anchors and no independent upgrade path structurally caps emitted marks near 6–8. 90 may be unmeasurable on it regardless of prose quality.
2. **Dialogue (base-model/craft):** frozen at 6 on `gpt-4.1` despite the craft guide prescribing subtext verbatim and a built-but-dead VoiceCapsule. No plumbing crosses this.
3. **Ending surprise (structural + intrinsic):** unmeasurable today; even a blind-read redesign may not reliably score surprise on LLM prose.
4. **Originality/premise (research):** frozen at 7, over-determined by convention-anchored exemplars *and* a judge that cannot perceive freshness.
5. **Atmosphere regression risk:** the lone 8 is partly earned by the very template M1 deletes — net headline effect unproven.

---

## 7. Realistic asymptote & recommendation

**Asymptote ≈ 76–80, with a hard structural lid at ~80 set by the judge, not the prose.** The dependable, fundable result is a **durable "Solid draft" 73–76** via the T1 deterministic-defect program — real, owned, ~70–80%. Above that, the binding constraint is a measurement problem before it is a craft problem.

**Recommendation:**
- **Fund T1** as a committed milestone (73–76).
- **Before any craft spend above ~76, do the judge work (T2a) first** — re-tier + anchor + human-calibrate at 70–90. It is plausibly the cheapest real lever and it is the prerequisite that makes every later gain *measurable*. It may also reveal the frozen 6s are partly the judge's, not the writer's.
- **Treat 80 as a research goal** (T2/T3), **90 as a human-supervised research program** (T4) — and say so to stakeholders. Do not declare any top-band number reached without ≥5 replays and a human cross-check.
- **Resolve the one unknown that gates the rest:** is the dialogue/opening freeze a generator or a judge ceiling? Run the generator bake-off and the judge recalibration *in parallel* — until then they are indistinguishable, and the path to 90 cannot be honestly costed.

> Bottom line: ANALYSIS_47 took the score from 62→65 and mapped 65→73–76. This document’s addition is the verified diagnosis that the next wall is the **judge**, and that 90 is a research program contingent on rebuilding how the story is *measured* before how it is *written*.
