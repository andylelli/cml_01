# ROADMAP TO 80 — the operational plan: a **dependable 73–76 ("Solid draft")** via deterministic-defect engineering, and an honest, gated stretch to 80

Status: **operational roadmap, adversarially stress-tested. Sibling of [ANALYSIS_47](./ANALYSIS_47.md) (the 62→65 validation + diagnosis) and [ROADMAP_TO_90.md](./ROADMAP_TO_90.md) (the long-horizon research framing). This is the *near-term, fundable* plan. Bottom line: the M0→M1→M4 deterministic-defect program reliably reaches 73–76 (~70–80%); 80 is a stretch (~5–12% on a single run, <5% sustained) gated on three levers the prose-engineering program does not contain — judge re-calibration, a real critique→rewrite loop, and likely a stronger model for two frozen craft categories.**

All model/prompt/code facts below are **verified in the repo**. Current state: rubric **65** ("Promising but rough"), prose on `gpt-4.1`, judge `gpt-4.1-mini` @ temp 0.2.

---

## ▸ Implementation progress tracker

Legend: ☐ not started · ◐ in progress · ☑ code complete (build + unit tests green) · ✔ verified on a live replay (N≥5).

| Milestone | Sub-task | Status | Verified by | Notes |
|---|---|:--:|---|---|
| **M0** | L1 `death_method` — derived helper + repoint 3 `murderMethod` sites + obligation + rubric manner-of-death gate | ☑ | rubric-score 28/28, prompts-llm 422, worker build, REPLAY_DRY | derived from `crime_class.subtype`; explicit `death_method` added to replay CML; collision-free tokens (dropped "wound") |
| **M0** | R-B pronoun sweep — gendered-title appositive anchor (overrides Guard C) added to existing strict sweep | ☑ | story-validation 247 (incl. 2 new pronoun tests), worker build | fixes the verified "mistress, he" Eleanor slip; existing strict sweep already covered named cases |
| **M0** | R-A hardening: near-duplicate clue collapse + **full key-term chokepoint** — every clue/test/mechanism spec field is surfaced as deduped KEY TERMS (never a full sentence) at all prompt-hand AND deterministic-paste sites; detector kept as full-sentence backstop | ☑ | prompts-llm **426** (incl. 4 new R-A tests), sv 247, rubric 28, worker build, REPLAY_DRY; **real-data: all 42 stored spec strings → 0 verbatim runs** | one `surfaceSpecKeyTerms`/`composeKeyTermPhrase` chokepoint on the existing `tokenizeForClueObligation`, so the same tokens satisfy the clue-PRESENCE check (≥12-consecutive-word run impossible). Threaded the squeeze; fixed an obligation-guard regression (rich summaries for the guard, key-terms only at paste). 7-file change (F0–F6) per recon plan |
| **M1** | Grounding-lead prepend disabled by default (`AGENT9_GROUNDING_LEAD=0`), reversible; model's opening kept | ☑ | prompts-llm 422, worker build, REPLAY_DRY | the dominant prose offender; flag-gated so it's a one-env revert |
| **M1** | Atmosphere-density guard (don't regress the lone 8) | ◐ | needs live replay | mitigated via the reversible flag; confirm atmosphere ≥8 on a replay before locking in |
| **M1** | Widen `lint.ts`: adjacent verbatim-duplicate sentence + cross-chapter repeated opener | ☑ | prompts-llm 422, worker build | catches the Ch6 doubled opener + templated-opener signature |
| **M4** | Beat-scheduler authoritative (Agent 7 off `SHADOW`) | ⊘ deferred | — | **Replay-invisible** (replay reuses frozen outline; Agent 7 doesn't run in replay) + cross-cutting rewire needing full-run validation. Deferred to a full-run effort, not flipped blind. |
| **M4** | Clue dedupe (one-insight-per-clue) | ☑ (Agent-9 side) | prompts-llm 422 | covered by the M0c near-duplicate collapse; upstream Agent-5 dedupe is replay-invisible, deferred with the scheduler |
| **M2** | Ch1 in-medias-res hook contract (prompt) | ☑ | prompts-llm 422, worker build | safe general fix; fires only when a victim name resolves |
| **M2** | Named victim added to replay cast | ⊘ **reverted** | live run | "Lord Edgar **Blackwood**" collided on surname with "Lady Eleanor **Blackwood**" → false "VICTIM ALIVE" flag in the live run. Reverted to isolate; revisit with a non-colliding name after the leakage is clean |
| **M2** | `CASE.premise{logline, unusual_angle}` field added to replay CML | ☑ (data) / ⊘ (prompt) | data present | not wired to prompt — analysis says a logline can't move the frozen premise; field is there for future originality-engine work |
| **M3** | Per-character voice contract reaches the prompt | ☑ (already wired) | code read | full runs: `buildCharacterContractsBlock` (speechMannerisms + voiceFragments + register); replay: `buildCharacterPersonalityBlock(characterProfiles)` (speechMannerisms + WRITING GUIDANCE). The standalone `agent2b-voice-capsule` projection is redundant with this → explicit wiring not needed |
| **M3** | Anti-exposition dialogue rule (system prompt) + dialogue-subtext + de-redundancy targets in the guarded polish | ☑ | prompts-llm 422, worker build, REPLAY_DRY | the actual dialogue lever; ceiling is base-model/craft per analysis (expect 6→7) |

**Score checkpoints** (fill in from live replays — code changes are build+test-verified; score movement needs the user's Azure replay): baseline **65** · after M0+M1+M2+M3 _— pending clean replay_.

**Live-run learnings (replay-1782251042071, first attempt — 44 generation-validator failures):**
- ✅ The L1 stab-wound gate fires correctly — the reveal-completeness validator now *demands* the death method (working as designed; the LLM just hadn't complied in 2 attempts).
- ❗ **Verbatim leakage is the real blocker, as ANALYSIS_47 §6.4 predicted.** The full `design` sentence was handed to the prompt (obligation-block L569) *and* pasted by the deterministic patch → the LLM copied it (78-word Ch9 leak). **Now fully cured via a key-term chokepoint (F0–F6):** every clue/test/mechanism spec field is surfaced as deduped key terms at all 14 prompt-hand + paste sites, on the *same* tokenizer the clue-presence check uses — so a ≥12-consecutive-word run is structurally impossible while clue-presence is still satisfied. Verified offline: all 42 real spec strings → 0 verbatim runs; the obligation-guard regression this introduced (key-terms starved the presence check) was caught by a unit test and fixed by keeping summaries rich for the guard and reducing only at paste. **No live run was needed to prove the leak is gone** — the recon→implement→offline-verify loop replaced it.
- ❗ Adding a named victim with the family surname tripped a false "VICTIM ALIVE" check → **reverted**.
- These are generation-time *retry* signals; with `preferCompletionOnFailure=true` the run still ships a best-draft. The design/clue verbatim copies do **not** trip the rubric's `detectTemplateLeakage` cap (that keys on the time-phrases already fixed) — but they depress the LLM judge's prose/clues marks.

---

## 0. TL;DR

1. **Fund the floor.** M0 (contract-render + `death_method` + pronoun sweep) → M1 (delete the grounding-lead template) → M4 (authoritative beat-scheduler + clue dedupe) are engineering-class, owned, and low-perceptibility-risk. They reliably move **65 → 73–76**.
2. **80 = average 8.0 with zero slack.** From 65 that is +15 raw: five categories at 6 each need +2, three more need +1, ending must clear its cap and gain a reveal point, and atmosphere must hold at 8 — **every bet must win.**
3. **Four categories are frozen** at `premise=7, opening=6, dialogue=6, ending=6(capped)` across 5 runs (zero variance). The plan books +1/+2 on marks the judge has never awarded — so the back half is fragile.
4. **80 needs three things the prose program omits:** (a) judge re-calibration at the 70–80 band, (b) a real critique→rewrite revision loop (not the temp-0.2 fidelity polish that exists), (c) likely a stronger model for the frozen dialogue/opening. Even ChatGPT (scores above the rubric) capped the cheap-fix path at ~77.
5. **Recommended sequence:** M0 → M1 → **M4 before the fragile craft block** → M2/M3 (budgeted +1, not +2) → run a **judge-calibration track in parallel**. Prove every craft gain across **N≥5 replays** before believing it.

---

## 1. The arithmetic and the evidence

80 = band "Very strong" = **category average 8.0, no weak category.** Baseline (post-fix run `story_20260623-2039`, total 65):

`premise 7 · opening_hook 6 · plot_structure 7 · character_clarity 6 · dialogue 6 · atmosphere 8 · clues 7 · pacing 6 · ending 6(capped) · prose 6`

To reach 80 (+15): the five at 6 (**opening, character, dialogue, pacing, prose**) each need **+2**; **premise, plot, clues** each need **+1**; **ending** must clear its cap (+1) and gain a reveal point (+1); **atmosphere must hold at 8.** Zero slack.

**The freeze (5 runs, zero variance):** `premise=7, opening=6, dialogue=6, ending=6(capped)` — see ANALYSIS_47 §9.1. These are structural judge priors, not noise. Three of them (premise/opening/dialogue) are precisely the categories the plan must move +1/+2, which is why 80 is a stretch and not a floor.

---

## 2. The milestones

The **shared hard dependency is M0's contract-render**: *nothing in Agent 9 currently consumes a victim / premise / voice / beat artifact*, so every upstream field is inert until R-A surfaces it into prose. M0 first — not just for the cap-clear, but because it unblocks M2/M3/M4.

### M0 — Contract-render plumbing + `death_method` + pronoun sweep → **68–70**
*Engineering. The unblocker. Low risk.*
- **R-A contract-render:** `deriveChapterContracts` renders `must_surface`/`must_not_reveal` obligations into prose — the plumbing every upstream artifact rides. Also kills the `"It had taken three minutes in all."` injection (`enforceLockedFactValuePresence`, `deterministic-repair.ts`) and the doubled three/forty-minute bug.
- **L1 `death_method`:** add a typed `CASE.death_method` (Agent 3 schema + `agent3-cml.ts`), promote from `meta.crime_class.subtype` ("premeditated stabbing"), assert <50% token overlap with `hidden_model.mechanism.description`. **Repoint the 3 `murderMethod = mechanism.description` sites** in `generate.ts` (≈L2494/3448/3860) to `death_method`, and HARD-require key terms `[stab, stabbed, wound, knife, blade]` in the reveal chapter (`clue-validation.ts` ≈L1007/1043). *Verified: "stab" appears ~0× in the prose today; this is what makes the `weakMurderMethod` cap clear.*
- **R-B pronoun sweep:** deterministic gender-aware pass over `CASE.cast.gender` (`prose-guard/fidelity.ts` `countMisgenderedPronouns`), re-validated and rolled back if worse (avoid the [[agent9-postprocess-after-validation]] trap).
- *Lifts:* clears the only firing cap (ending 6→7, removes `overall ≤75`); protects character/prose floors. *Gate:* N≥5, no leakage caps, ending ≥7.

### M1 — Delete the deterministic grounding-lead template → **71–73**
*Engineering. Highest single-fix ROI. Judge reads it directly.*
- **Delete `buildDeterministicGroundingLead`** (`agent9-run.ts` L362–411; the 5 fixed `leadTemplates` L389–395). On grounding failure, keep `getGroundingSignals` (L419–432) as the **gate only** and route the chapter back through scoped micro-regen / `OPENING_STYLE_ROTATION` with "first 2 paragraphs: named anchor + 2 sensory + 1 atmosphere cue, in-scene from POV." If a synchronous fallback is mandatory, compose per-scene fragments **and verify the location name matches `scene.setting.location`** (fixes the Ch1 "Library" vs Study mismatch from `cleanLocationName` `keyLocations[idx % n]`).
- This one template *is* the judge's exact complaints across four categories: "repeated atmospheric/setting descriptions" (pacing), "redundancy/repetitive phrasing" (prose), "slow atmospheric hook" (opening), and the Ch6 doubled opener.
- **Add the template-bleed backstop** so the opener linter can't hard-abort (per [[template-bleed-no-backstop-kills-runs]]); widen `lint.ts` to catch cross-chapter repeated setting sentences; ensure `selectSensoryVariant` advances per chapter (`prompt-blocks.ts` L334–371).
- ⚠ **Add an atmosphere-density guard:** atmosphere=8 is the lone at-target mark and is *partly earned by the very template this deletes.* Without the guard, M1 can silently regress atmosphere 8→7. *Lifts:* prose 6→7, pacing 6→7, opening assist; *hold* atmosphere 8.

### M4 — Authoritative beat-scheduler + clue dedupe → **~76** *(promoted ahead of the craft block)*
*Engineering, structural. Lower perceptibility risk than prose tweaks — the judge sees the removed redundancy in reverse.*
- **Promote `buildSceneGrid` from shadow to authoritative.** Verified: `agent7-run.ts` (L38/42/57) `AGENT7_SCHEDULER_SHADOW` defaults on and "acts on nothing." Make `grid.slots[].cluesRevealed/obligations` authoritative for the Agent-9 outline. Result: Ch9 = run the discriminating test + one new mechanism proof; Ch10 = name culprit + `death_method` + denouement only (clearances done in Act II) — removes the Ch9/Ch10 double-accusation that drove "repetitive"/"predictable"/pacing-drag.
- **Clue dedupe:** in `deterministic-repair.ts` (`buildDeterministicClueParagraphs` L224–245, `applyDeterministicCluePatch` L247–289) dedupe `RequiredClueMaterialization` by normalized `description`/`pointsTo` **before** injection (collapses the verbatim Ch8 "links/ties" twin); upstream Agent 5 collapses matching records; carry `first_full_reveal_chapter` so each clue is stated in full once, then only referenced.
- *Lifts:* pacing 6→8, plot 7→8, clues 7→8.

### M2 — Named victim + in-medias-res Ch1 hook + premise logline → *(craft block; budget +1, not +2)*
- Agent 2 (`agent2-cast.ts`) promotes one candidate to a fully-profiled **named victim**; add `CASE.premise{logline, named_victim, unusual_angle}` (Agent 2/2e). Thread into the Ch1 contract via M0: the victim's resolved name (`resolveVictimName`, `prompt-builder.ts` L409–423) must appear in paragraph 1 as a *named person*, not "the victim"; first 2 sentences = a concrete discovery beat before any room-tour.
- *Note:* the deterministic victim check (`clue-validation.ts` L935–950) only fires when a `role:victim` cast member exists — here it does not, so a prose-side guard is needed; this also de-risks the `victimUnnamed ≤72` cap.
- *Lifts (realistic):* opening 6→7 (naming is real; the "slow/not gripping" half is craft), premise 7→8 only if the angle is genuinely non-generic.

### M3 — Distinct voices + anti-expository dialogue → *(craft block; the hardest, budget +1)*
- **Wire the built-but-dead VoiceCapsule** (`agent2b-voice-capsule.ts`) into `buildCharacterContractsBlock` (`prompt-blocks.ts` L130–174) via M0 — a distinct register + 1 concrete speech tic + emotional throughline per active speaker.
- Promote the **anti-exposition rule** to a standalone block: "no character states evidence/alibi/timeline as a flat report; dialogue carries subtext — deflect/evade/imply."
- Add a dialogue-subtext target to the **guarded polish** (`post-pass-polish.ts` `buildPostPassPolishPrompt` L95–128, invoked `generate.ts` L2912 when provisional <95) — it re-validates and rolls back on regression, so it sidesteps the post-validation trap, but it currently runs at temp 0.2 and rarely makes real edits.
- *Reality:* dialogue is **frozen at 6 across 5 runs** despite the craft guide already prescribing subtext and the VoiceCapsule sitting unused. A capsule + one timid polish most likely yields **6→7, not 6→8.** This is the category most likely to break the zero-slack math.

### M5 — Buffer / ceiling push (not on the minimum spine)
Planted fair-play reversal (Agent 3 `false_assumption.misdirected_suspect` + an inference step anchored to an already-planted clue, gated by an Agent-6 blind-reader sim); D6 mechanism plausibility (delete the clock-rewind exemplar `agent3b` L155–157 + `store.json` lockedFacts; add a plausibility-judge leg); D7 cross-run novelty store (Agent 8 is DARK). These target the least-perceptible qualities (surprise, originality) — treat as durability/buffer, **never a banked point.**

---

## 3. Category target table

| Category | now | →80 target | owning milestone |
|---|:--:|:--:|---|
| premise | 7 | 8 | M2 (logline/angle) + M5/D6 |
| opening_hook | 6 | 8→**7 realistic** | M2 (named victim) + M1 (de-template) |
| plot_structure | 7 | 8 | M0 (death_method as plot obligation) + M4 |
| character_clarity | 6 | 8 | M3 (traits + voice) + M0 (pronoun floor) |
| dialogue | 6 | 8→**7 realistic** | M3 (VoiceCapsule + subtext) — *base-model gated* |
| atmosphere | 8 | 8 HOLD | M1 density guard (do not regress) |
| clues | 7 | 8 | M4 dedupe + one-insight-per-clue |
| pacing | 6 | 8 | M1 + M4 |
| ending | 6\* | 8 | M0 (cap clear→7) + M5/X1 (reveal→8) |
| prose | 6 | 8 | M1 (de-template) + M3 (subtext/de-redundancy) |

---

## 4. Two projections — optimistic vs. honest

**Optimistic (every bet lands, fully judge-perceived):** 65 → [M0] 68–70 → [M1] 71–73 → [M2] 73–75 → [M3] 76–78 → [M4] 78–80 → [M5] 80–82.

**Honest (adversarially corrected):** M0+M1+M4 reliably reach **73–76**. The craft block (M2/M3) most likely adds **+1 each, not +2** — dialogue and opening are empirically frozen and the judge under-perceives sub-threshold craft. M5's surprise lever is +1 expected (not +2) and least perceptible. **Realistic landing: 73–76 reliably; ~78 with the calibration + multi-pass additions; 80 only if a model upgrade or judge recalibration legitimately lifts the frozen 6s.** Probability of a single run ≥80: **~5–12%**; sustained across the N≥3 acceptance bar: **<5%**.

---

## 5. What the prose program *misses* — the real levers for the last ~5 points

1. **Judge re-calibration at the 70–80 band** — the rubric was calibrated near 65 and runs 1–6 pts under ChatGPT; its frozen `dialogue=6`/`opening=6` priors may themselves be miscalibrated. Auditing against human/ChatGPT scores at 77–80 is potentially the cheapest real lever and is currently unproposed. *(Full diagnosis in [ROADMAP_TO_90.md](./ROADMAP_TO_90.md) §2.)*
2. **A real critique→rewrite loop** at temp 0.7–0.9 with deterministic re-validation + rollback — the existing polish is temp-0.2 "prefer no change" and cannot improve craft.
3. **A stronger model for the frozen categories** — four runs frozen at the same craft marks regardless of prompt changes is the signature of a model ceiling; if the generator can't write 8-level dialogue, no contract surfaces what isn't generated.
4. **Atmosphere-hold verification** (M1 deletes the templates earning the lone 8) and an **N≥5 replay variance budget** (raw totals cluster 65–70 ±2; single-replay +1s are within noise).
5. **Premise 7→8 has no real mechanism** in the prose program — a logline *surfaces* an angle, it doesn't *invent* one (that's the T3 originality work in the 90 roadmap).

---

## 6. Recommended sequence & verdict

**Sequence:**
1. **M0** — contract-render + `death_method` + pronoun sweep (the unblocker; also the only piece that moves *this* run's score today).
2. **M1** — delete the grounding-lead template (highest ROI), **with the atmosphere-density guard**.
3. **M4** — authoritative beat-scheduler + clue dedupe (structural, low perceptibility risk) — **before** the craft block.
4. **M2 + M3** — the fragile craft block; budget +1 each; **gate each on N≥5 replays.**
5. **In parallel:** a **judge-calibration track** — score the M1+M4 output with ChatGPT/a human at the 70–80 band; audit whether `dialogue=6`/`opening=6` are miscalibrated priors. This may be worth more than M3.
6. Only if still short: a multi-pass critique→rewrite loop and/or a stronger base model. M5 surprise stays a hopeful buffer.

**Verdict:** **73–76 is dependable, well-engineered, and fundable as a milestone.** **80 is a research-gated stretch, not a deliverable** — it requires the judge to move structural priors it has held across 5 runs, which is unproven, and it needs the three missing levers above. Commit to the 73–76 floor; treat 80 as conditional on the calibration + revision-loop + model work; and prove any frozen-category gain across ≥5 replays before declaring it.

> The dividing line between this doc and [ROADMAP_TO_90.md](./ROADMAP_TO_90.md): **80 is mostly an engineering problem with a calibration tail; 90 is a measurement-and-craft research program.** Both share the same first move — M0 contract-render — and the same hard truth: above ~76, the binding constraint stops being the prose and starts being the judge.
