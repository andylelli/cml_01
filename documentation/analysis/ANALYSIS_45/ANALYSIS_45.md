# ANALYSIS_45 — Run `story_20260622-2122` completed a full 10-chapter story (71/ChatGPT, 65/rubric): the new instrumentation fired and pinpoints the remaining defects to specific upstream gaps the built-but-unwired redesign packages already solve

Status: **investigation complete; run COMPLETED (10/10 chapters) — a recovery from ANALYSIS_44's Ch4 death; ChatGPT 71/100 (improvement); live rubric 65/100; root causes mapped; two rubric-calibration bugs found (open); fixes recommended**
Run reviewed: `story_20260622-2122` (2026-06-22T20:02–20:22), "Fairweather Manor", culprit **Lady Constance Fairweather**, victim **Sir Lionel** (named in prose, **not** a `role:victim` cast entry).
Sources: the API console log (Agents 1–9 + the three new shadow/score hooks); the human review [`stories/story_20260622-2122/chatgpt-review.txt`](../../../stories/story_20260622-2122/chatgpt-review.txt) (71/100); the live `[Rubric] 65/100` line + caps; `data/store.json` latest CML artifact.
Predecessor: **ANALYSIS_44** (run `70ac132d` died at Ch4 on the `template_bleed` opener gate; ANALYSIS_43 A–D content-hygiene fixes confirmed holding but invisible because no story shipped).
New this run: first live firing of three redesign hooks — **Agent 5 clue-spec shadow**, **Agent 7 scheduler shadow**, **rubric scorer** (all wired 2026-06-22, default-on/shadow).

---

## 0. TL;DR

1. **Completion restored.** Unlike `70ac132d` (ANALYSIS_44, dead at Ch4), this run produced a **full 10-chapter story** the human could review. The `preferCompletionOnFailure` / completion-first fallback + the opener-exhaustion bypass did their job — **9 of 10 chapters required retry**, and **4 chapters (Ch5/6/9/10) shipped via completion-first fallback** after exhausting all 3 attempts.
2. **The score improved and the two scorers agree on substance.** ChatGPT: **71/100** ("one of the stronger drafts structurally"). Live rubric: **65/100** (raw judge total **70**). The LLM critic half of the rubric (70) lands within **1 point** of ChatGPT (71) — the rubric judge is well-calibrated. The 6-point delta is one over-aggressive deterministic cap (§5).
3. **Both scorers flag the same five real defects** (§3): (a) **murder method never stated** — the CML describes the *concealment*, not how Sir Lionel died; (b) **Ch9/Ch10 overlap** — the discriminating-test scene and the reveal are smeared across two chapters; (c) **report-like / control-plane leakage** still ships ("*The elapsed time was confirmed as forty minutes*", "*Inspector Bramley was cleared because…*"); (d) **pronoun errors** survive (Sir Lionel "her", Eleanor "his", Dr. Fenwick "she/her") despite a 17-repair deterministic sweep; (e) **time logic ungrounded** (false 11:10 vs true ~11:50 never stated).
4. **The fallback is shipping the defects the gates caught.** Every defect above was *detected* by an Agent 9 gate (verbatim-clue-copy, `reasoning_leak_*`, `contract_term`, missing-DT-scene, no-resolution) and then **accepted anyway** by completion-first fallback. So content hygiene regressed vs ANALYSIS_44's committed chapters — not because the gates failed, but because "ship something" outranks "ship clean" once retries exhaust.
5. **The new instrumentation localizes the root causes to upstream gaps the redesign already fixes** (§4): the **Agent 7 scheduler shadow** built a *complete, ordered, 90%-covered* grid @10 while the live run logged a **"DT-scene scheduling gap"** on Ch9 *and* Ch10 ("discriminating-test scene has no fresh DT evidence clue scheduled in the outline … prose generation cannot repair"). The **clue-spec shadow** confirmed Agent 5's distribution is **100% derivable** (25/25). The verbatim-copy + leakage are exactly the Agent 9 chapter-as-contract target.
6. **Two rubric-calibration bugs found** (§5): the **victim-unnamed cap is a false positive** (Sir Lionel is named; the CML just doesn't tag a `role:victim` cast member), and the **template-leakage overall-ceiling (≤65) over-fires** on minor leakage (the rubric says "unless leakage is very minor"). Fixing both would move the rubric from 65 → ~70, matching ChatGPT.

---

## 1. What the run actually did (timeline)

| Time (UTC) | Event |
|---|---|
| 20:02:41 → 20:04:38 | Agents 1, 2, 2e, 3b, 3 run; CML generated (culprit Lady Constance, clock-winding concealment). |
| 20:04:38 → 20:05:15 | **Agent 5** (2 parallel calls) → clues extracted. |
| 20:05:15 | **`[Agent 5 clue-spec shadow]`**: deriveClueSpec → **19 required slots + 3 red-herring**; **25 shipped clues, 25/25 (100%) map to a derived slot.** ✅ |
| 20:05:15 → 20:08:50 | Agents 6, 2b, 2c, 2d, 6.5 run. (Agent 2c F5b flags 3 sensory full-sentence bleeds — pre-existing.) |
| 20:08:51 → 20:09:26 | **Agent 7** (2 calls) → outline (10 scenes). |
| 20:09:26 | **`[Agent 7 scheduler shadow]`**: grid **@10 (3/5/2)** from **39 obligations**: **complete=true ordered=true coverage=90% (ratioOk=true)** \| live outline scenes=10. ✅ |
| 20:09:27 → 20:21:45 | **Agent 9 Ch1–Ch10.** 9/10 chapters retried; Ch5/6/9/10 via completion-first fallback (see §2/§3). Ch8 clean on attempt 1. |
| 20:19:21–20:21:45 | **Ch9 + Ch10**: both hit **"G4 DT-scene scheduling gap … prose generation cannot repair"**; Ch10 needed a **deterministic clearance patch** (no-resolution) and still failed the location-inventory opener. |
| 20:21:45 → 20:21:59 | Agent9 AtmosphereRepair (Ch2/4/5/6/8/9/10); **deterministic pronoun sweep: 17 repairs across 10 chapters.** |
| 20:22:01 | `[ERROR] 9/10 batch(es) required retry`; 16 `Chapters N failed validation` error lines; `enforceLockedFactValuePresence` injected 5 canonical locked-fact mentions. |
| 20:22:04 → 20:22:18 | **`[Rubric]`**: **65/100 (Promising but rough); raw 70**; caps: leakage→prose≤4 + overall≤65; victim-unnamed→≤72; weak-murder-method→ending≤6 + overall≤75. |

**Outcome: complete. 10/10 chapters shipped; reviewable story produced; scored 71 (human) / 65 (rubric).**

---

## 2. What worked

- **The story completed and is reviewable** — the headline recovery from ANALYSIS_44. ChatGPT: *"one of the stronger drafts structurally … the cast is mostly stable, the victim is named immediately, the suspects have defined roles, and the final reveal actually includes a physical test."*
- **The three new hooks fired cleanly and add real signal** (all default-on, none broke the run):
  - **Clue-spec shadow: 25/25 (100%)** — every shipped clue maps to a slot `deriveClueSpec` would produce. Confirms the Agent 5 redesign thesis on live data: the clue set is fully *derivable*, so the free-generation step (which causes the verbatim-copy bleed below) is replaceable by derive-then-render.
  - **Scheduler shadow: complete + ordered + 90% coverage @10** — the deterministic grid is sound; the *live* outline is the one with the DT-scene gap (§4.1).
  - **Rubric: 65/100 with explainable caps**, raw judge 70 — within 1 point of the human (§5).
- **The Agent 9 mutation-revalidation (now default-on) ran without incident** — no `mutation-revalidation: reverted grounding lead` line, i.e. no metadata-dump opening occurred to revert. It is correctly inert when there is nothing to fix (belt-and-suspenders behind the existing `looksMalformed` guard).
- **ChatGPT's structural praise:** the discriminating test (Bramley states two theories, demonstrates the backward winding, matches dust/paint, collapses the false timeline) is "the best part" and "much closer to the structure you want."

---

## 3. The remaining defects (where the two scorers + the log agree)

| # | Defect | Log evidence | ChatGPT | Rubric |
|---|---|---|---|---|
| D1 | **Murder method never stated** (concealment ≠ death) | CML `hidden_model.outcome` = *"the false timeline shields … contradictions expose her guilt"* — describes exposure, not the killing | "the actual killing is not clearly described … poison? strike? suffocate?" → Ending 6 | `weak murder method` cap → ending≤6, overall≤75 ✅ |
| D2 | **Ch9 ≈ Ch10** (test + reveal smeared) | Ch9 "may be missing the discriminating test scene"; Ch10 repeats clearances + test | "Chapter 9 already performs much of the final trap … Chapter 10 becomes repetitive" → Pacing 7 | (judge: pacing) |
| D3 | **Report-like / control-plane leakage ships** | `reasoning_leak_false_assumption` (Ch1), `contract_term` (Ch9), verbatim clue copy (Ch1–7,9), "*The elapsed time was confirmed as forty minutes*" | "report-like clearance lines remain … 'Inspector Bramley was cleared…' feels like validation text leaking" → Prose 5 | `template leakage` cap → prose≤4, overall≤65 ✅ (caught the real "elapsed time was confirmed" line) |
| D4 | **Pronoun errors survive** | "pronoun repair DISABLED" (per-chapter) yet "pronoun **sweep: 17 repairs**" — still incomplete | Sir Lionel "her", Eleanor "his", Dr. Fenwick "she/her", Lady Constance "his proximity" → Char 6, Prose 5 | (judge: character_clarity) |
| D5 | **Time logic ungrounded** | locked-fact mentions injected post-hoc (`enforceLockedFactValuePresence`) | "false 11:10 vs true 11:50 … death window not cleanly stated" | (judge: clues) |

**The unifying mechanism (D1–D5):** every one of these was *detected* by a gate and then **shipped via completion-first fallback** after 3 attempts. The fallback guarantees a story (good — that's the ANALYSIS_44 fix) but it ships the un-dramatized schema text, the leaked reasoning, and the smeared test/reveal because there is no *clean* alternative once the LLM can't satisfy the gate in 3 tries. This is the §3.4 "96% retry spend → ship-anyway" pathology the Agent 9 redesign targets.

---

## 4. Root cause → the built-but-unwired package that fixes each

This run is the clearest live evidence yet that the redesign foundations address the *actual* failures.

### 4.1 The DT-scene scheduling gap (D2) → `@cml/beat-scheduler` (Agent 7)
The log states it plainly twice: *"G4 DT-scene scheduling gap chN: discriminating-test scene has no fresh DT evidence clue scheduled in the outline … This is an outline-level gap that prose generation cannot repair."* The **scheduler shadow built a complete, correctly-ordered grid for the same case** — `buildSceneGrid` places the discriminating test *after* its supporting clues and *before* the reveal **by construction**, in a distinct slot from the reveal. The live LLM outline did not, so the DT evidence wasn't scheduled and Ch9/Ch10 collided. **This is exactly the band-aid the Agent 7 redesign deletes by making placement a property, not a hope.** Promoting the scheduler from shadow → authoritative for `cluesRevealed`/scene-placement would have prevented D2.

### 4.2 Verbatim clue copy + reasoning leak (D3) → `@cml/prose-guard` chapter-as-contract (Agent 9)
The model transcribes schema descriptions ("*The clock hands were moved backward…*", "*Eliminates Eleanor Marsh because…*") because its obligations are *implicit*. The Agent 9 redesign's `ChapterObligationContract` + critic-rewrite replaces "infer obligations from a 40 KB blob, then regex-police the result" with "render this slot's obligation in your own words." The rubric's own `detectTemplateLeakage` already catches the residue; the contract prevents it.

### 4.3 Murder method ≠ concealment (D1) → Agent 3/3b mechanism distinction
The CML conflates *mechanism* (the clock-winding concealment) with *murder method* (how Sir Lionel died). The Agent 3b redesign's "the mystery mechanism is not automatically the murder method" and the rubric's own "Important Distinction" name this exactly. The CML never carries a death-method fact, so no downstream agent can dramatize one — `weakMurderMethod` is a true upstream-CML defect.

### 4.4 Pronoun errors (D4) → `@cml/prose-guard` pronoun validator
Per-chapter pronoun repair is *off*; the final `applyDeterministicPronounSweep` made 17 repairs but missed cross-gender slips a regex can't disambiguate. The redesign's stance — pronoun consistency is a *critique the model fixes in context*, gated by `countMisgenderedPronouns` — handles the cases the deterministic sweep can't.

### 4.5 Time logic (D5) → locked-fact carry / Agent 3 constraint_space
The false/true time is in the CML's constraint space but never surfaced as prose; `enforceLockedFactValuePresence` injects it post-hoc (a band-aid). A clean locked-fact-to-prose contract (clue-spec slot carries the locked fact verbatim) closes it.

---

## 5. Rubric calibration: 65 (rubric) vs 71 (ChatGPT) — the judge agrees; one cap over-fires; one cap is a bug

**The encouraging result:** the LLM critic's **raw total (70)** is within **1 point** of ChatGPT (71). The category marks track closely (both: premise ~8, plot ~8, character ~6, dialogue ~6, atmosphere ~7, clues ~7, ending ~6, prose ~5). So the *judge* is well-calibrated against the human on this draft. The entire 6-point gap is the **deterministic cap engine**, where two issues surfaced:

### 5.1 BUG — `victim unnamed` is a false positive
`extractStoryFacts` finds the victim by scanning `CASE.cast` for `role`/`role_archetype` matching `/victim/`. In this CML **no cast member is tagged `victim`** (the victim Sir Lionel is named throughout the prose but lives outside the suspect cast). My code's `else` branch then set `victimUnnamed = true` — conflating *"I couldn't find a victim-role cast member"* with *"the victim is unnamed."* ChatGPT confirms the opposite: *"the victim is named immediately."*
**Fix:** only set `victimUnnamed` when a victim name is positively identified (cast role, `meta`, or crime spec) **and** absent from the prose; if no victim name can be resolved, do **not** flag (the LLM critic still judges naming). This cap was non-binding here (the leakage ceiling was tighter) but would mis-cap other stories at ≤72.

### 5.2 CALIBRATION — the leakage overall-ceiling (≤65) over-fires on *minor* leakage
The rubric (`scoring-approach.md` § Prompt/Template Leakage) says *"Overall score usually should not exceed 65 **unless leakage is very minor**."* My `applyHardCaps` applies the ≤65 ceiling on **any** non-empty leakage-hit set — it does not distinguish one note-like line from pervasive scaffold bleed. Here the detector caught the genuine "*The elapsed time was confirmed as forty minutes*" (ChatGPT flagged it too) but ChatGPT treated it as minor (docked Prose to 5, no global cap), while the rubric capped the whole story at 65.
**Fix:** scale the leakage treatment by severity — always cap Prose ≤4 on any hit, but only apply the overall ≤65 ceiling when hits ≥ a threshold (e.g. ≥2 distinct leakage fragments, or leakage in ≥2 chapters). Minor leakage → Prose penalty only.

> With 5.1 + 5.2 applied, this run's rubric would be **~70** (raw 70, Prose capped to 4, no binding overall ceiling) — matching ChatGPT's 71. That is the calibration target the §7 (aligning-the-scoring-system) shadow phase exists to find, and this is the first real data point.

---

## 6. Recommendations (prioritized)

**P0 — rubric calibration (cheap, ships now; makes the shadow score trustworthy):**
- R1. Fix the `victim unnamed` false positive (§5.1) — resolve the victim name from cast role / `meta` / crime spec; don't flag when unresolved.
- R2. Make the leakage overall-ceiling severity-scaled (§5.2) — Prose≤4 always, overall≤65 only on ≥2 distinct hits.

**P1 — the highest-leverage live promotion (addresses D2, the outline gap that "prose cannot repair"):**
- R3. Promote `@cml/beat-scheduler` from shadow → **authoritative for clue/scene placement** in Agent 7, so the discriminating-test scene always has its supporting clues scheduled and is distinct from the reveal. The shadow already proved the grid is complete/ordered/90% for this case.

**P2 — content hygiene (addresses D3/D4, what completion-first ships):**
- R4. Begin the Agent 9 chapter-as-contract render path (prose-guard) on one chapter behind a flag — the contract makes the verbatim-copy/reasoning-leak unrepresentable rather than regex-caught-then-shipped.
- R5. Re-enable a pronoun pass as a *critique-and-rewrite* (not the disabled deterministic per-chapter repair), gated by `countMisgenderedPronouns`.

**P3 — upstream logic (addresses D1/D5):**
- R6. Add a **death-method** field to the CML distinct from the concealment mechanism (Agent 3/3b), and a locked-fact-to-prose carry for the true/false time (D5).

**Quick win the human asked for (per ChatGPT's "fastest fixes"):** D1 (one clear murder-method sentence) + D2 (split Ch9 prep / Ch10 reveal) + D4 (pronoun pass) + delete "*Inspector Bramley was cleared…*" would, per ChatGPT, raise the draft from 71 → 77–80.

---

## 7. Status of the new instrumentation (for the record)

| Hook | Mode | This run | Verdict |
|---|---|---|---|
| Agent 5 clue-spec shadow | log-only | 25/25 (100%) coverage | working; confirms derive-then-render is viable |
| Agent 7 scheduler shadow | log-only | grid complete/ordered/90% vs an outline with a DT gap | working; **strongest case to promote (R3)** |
| Rubric scorer | shadow | 65/100 (raw 70) vs ChatGPT 71 | working; judge well-calibrated; cap engine needs R1+R2 |
| Agent 9 mutation-revalidation | active | no reverts needed | correctly inert; no regression |

Nothing in the four new hooks caused a defect; every defect this run is a **pre-existing pipeline behaviour** that the redesign packages are designed to remove. The instrumentation's value is that it now *measures* that, per run, on live traffic.
