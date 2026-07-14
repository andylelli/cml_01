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

---

## 8. Strategic remediation plan — fix the defect *classes*, never the run

> **The rule for everything below.** A fix is only allowed if it would improve **any** scenario the
> pipeline can produce — a poisoning in a 1920s liner, a locked-room in a lighthouse, a fraud in a
> bank — *without ever referencing this run's names, clue IDs, chapter numbers, times, or phrases*. If
> a proposed change would need to know that the culprit is "Lady Constance" or the clue is "the
> winding key," it is **tactical and rejected**. We are fixing the grammar, not the sentence.

### 8.0 The single diagnosis under all five defects

D1–D5 look like five problems; they are one. **Every one is a load-bearing, reader-facing *fact* that
the logic layer left implicit, so the prose layer then mishandled it** in one of three ways:

| Failure mode | Defects | What the prose did with the un-pinned fact |
|---|---|---|
| **Omits** it | D1 (death method), D5 (true/false time) | the fact was never required, so the model never wrote it |
| **Transcribes** it | D3 (verbatim clue/schema copy) | the model was handed the *spec sentence* and pasted it |
| **Smears** it | D2 (Ch9≈Ch10) | the fact (the discriminating test) had no fixed home, so it bled across slots |

And the **completion-first fallback** — correct as a *liveness* guarantee (ANALYSIS_44) — currently
converts "the model couldn't pin the fact in 3 tries" into "ship the un-pinned version." So the
strategic program is two moves, applied to a *class* of facts, not a list of phrases:

1. **Make every load-bearing reader-facing fact an explicit, typed, validated CML field**, and
   **propagate it as a per-chapter obligation the prose must satisfy in its own words.** (Constrain at
   the source.)
2. **Redefine "acceptable to ship" so a HARD obligation violation is never shippable** — only *soft*
   (cosmetic) issues may be downgraded to warnings; a missing/leaked fact triggers a *scoped* rewrite,
   and if still unmet, surfaces a *precise upstream defect* instead of shipping the defect. (Dramatize
   at the sink, but never ship below the contract floor.)

This is the program's existing thesis — *constrain at the source, verify with a checker, dramatize
with the model* — applied uniformly. It is general by construction: it never names a fact, only the
*category* "load-bearing reader-facing fact."

### 8.1 Six cross-cutting reframes (each general; each kills a class)

1. **Facts are axioms, not flourishes.** How the victim died, the true vs apparent time and *which
   alibi the gap breaks*, the victim's identity — these are not optional prose colour. They are
   theorems the CML must *state* and the prose must *surface*. (Fixes D1, D5, R1-upstream for any
   mystery.)
2. **Separate the three questions of every murder** (the rubric's own Important Distinction, true for
   all whodunits): *how the victim died* (death method) ≠ *how the culprit concealed it* (mechanism) ≠
   *how the detective proves it* (discriminating test). The CML currently collapses death into
   concealment; split them as distinct required fields. (Fixes D1 generally.)
3. **The model must never be handed prose it can copy.** Where the model is given a clue today, it
   gets the polished schema *description* and pastes it. Hand it the clue's **function + key terms**
   and an explicit "render in your own words; the spec is not prose" — the obligation, not the
   sentence. (Fixes D3 at the source for any clue, not via phrase blacklists.)
4. **Scheduling is a solved constraint problem; the LLM dramatizes a fixed grid.** Placement of the
   discriminating test (after its evidence, before the reveal, in its own slot) is deterministic for
   *any* obligation set; the LLM should never free-schedule it. (Fixes D2 generally.)
5. **The accept decision must split HARD from SOFT.** Hard = fairness/fact integrity (a clue leaked
   early, a required fact absent, the culprit revealed before the reveal, the death method unstated).
   Soft = cosmetic (repeated openers, n-gram overlap). The fallback may ship with *soft* warnings; it
   must **never** ship a *hard* violation — that gets a located, scoped rewrite, then an upstream
   defect signal. "Ship something" must mean "ship the best *contract-clean* draft." (Fixes the
   mechanism that let D1–D4 reach the page, for any story.)
6. **The score must be calibrated and severity-aware**, so it is a trustworthy driver of the loop and
   of human triage — not a blunt instrument that mis-fires (R1) or over-penalises minor issues (R2).

### 8.2 The plan by layer (source → sink), each fix stated as a class fix

The defects are not co-equal; they live at different layers, and **fixing a lower layer dissolves work
at a higher one.** Order matters: a death-method *field* (logic) makes the death-method *obligation*
(render) trivial; the chapter-as-contract (render) makes the verbatim-copy *gate* (sink) dead code.

**Layer 1 — Logic (Agent 3 / CML schema): pin the facts that don't exist yet.**
- **L1 (D1, general): add a required `death_method` to the CML, distinct from the concealment
  mechanism**, with a validator asserting the two are different propositions, and an obligation that
  the reveal must surface the death method. *Generality test:* every murder CML must answer "how did
  the victim die," independent of trick. The rubric's `weakMurderMethod` then checks the *death
  method* is on the page, not the mechanism.
- **L2 (D5, general): promote the temporal contradiction to required locked facts** — apparent time,
  true time, **and the eliminating consequence** ("the gap breaks suspect X's alibi"), carried
  verbatim as locked facts so they *must* be surfaced. *Generality test:* applies to every
  temporal-axis mystery; for non-temporal axes the field is empty and inert.
- **L3 (R1-upstream, general): canonicalise the victim.** The schema already designates `role:victim`
  as "the canonical signal used by prose agents to identify the murder victim" — but this run's CML
  set no such member. Validate that exactly one canonical victim identity exists (cast role *or* a
  dedicated field) and that Agent 2/3 always sets it. *This is the upstream half of R1.*

**Layer 2 — Schedule (Agent 7): make placement a property.**
- **S1 (D2, general): promote `@cml/beat-scheduler` from shadow → authoritative for scene/clue
  placement.** The shadow already proved (this run and the offline corpus) that the grid is complete,
  ordered, and ≥60% covered for real cases. Authoritative placement puts the discriminating test in
  its own slot, *after* its supporting clues, *before* the reveal — eliminating the "DT-scene
  scheduling gap … prose cannot repair" for *any* story, and giving Ch-N-vs-Ch-N+1 a clean seam. The
  band-aids (`applyDeterministicCluePreAssignment`, the count lock, the DT-vocabulary splice) become
  dead code.

**Layer 3 — Render (Agent 9): hand obligations, not specs; rewrite scoped, ship clean.**
- **R-A (D3, general): wire the chapter-as-contract render path** (`@cml/prose-guard`
  `deriveChapterContracts` + `checkContractFidelity`). The model receives `must_surface` (clue
  function + key terms) and `must_not_reveal`, never the copy-able schema sentence. Fidelity is
  *checked*, not regex-policed. This removes the *source* of the verbatim copy and the reasoning-leak
  for every clue in every story.
- **R-B (D4, general): pronoun consistency as a gender-aware critique-and-rewrite**, gated by
  `countMisgenderedPronouns` over `CASE.cast.gender` per character — the model fixes the located slip
  in context. Replaces the disabled deterministic per-chapter repair and the lossy final sweep;
  correct for any cast composition.
- **R-C (cross-cutting, general): implement reframe #5 — the HARD/SOFT accept floor.** Completion-first
  may downgrade *soft* gate failures to warnings (keeps the ANALYSIS_44 liveness win) but must escalate
  a *hard* failure to a scoped rewrite of the offending passage, and—if unmet—emit the precise upstream
  defect (e.g. "outline DT gap") rather than shipping it. This is the load-bearing change that stops
  D1–D4 reaching the page even on a hard day, for any run. It depends on R-A (so a contract-clean draft
  is *reachable*).

**Layer 4 — Score (rubric): calibrate so the signal is trustworthy.**
- **C1 (R1, general): robust victim resolution** — resolve the victim name from cast `role:victim`,
  `meta`, or the crime spec; flag `victimUnnamed` *only* when a name is positively resolved and absent
  from prose; never infer "unnamed" from "no role:victim member." (With L3, this rarely fires.)
- **C2 (R2, general): severity-scale the leakage cap** — `Prose ≤ 4` on any hit, but the overall
  `≤ 65` ceiling only when leakage is material (≥2 distinct fragments or ≥2 chapters), per the rubric's
  own "unless leakage is very minor." Brings the cap engine into line with the human on minor leakage.

### 8.3 Sequencing — independently shippable, each shadow → canary → promote

The order maximises *dissolved* work and minimises blast radius:

| Phase | Fixes | Why first / dependency | Risk |
|---|---|---|---|
| **0** | C1, C2 (rubric calibration) | makes the *signal* trustworthy before we steer by it; pure, offline, no pipeline change | trivial |
| **1** | S1 (scheduler authoritative) | deterministic, already shadow-proven on live + corpus; fixes the "prose-cannot-repair" class outright | low |
| **2** | L1, L2, L3 (CML facts: death / time / victim) | source fixes that make the render obligations *exist*; schema + Agent 3/2 + validators | medium (schema/gen) |
| **3** | R-A, R-B, R-C (contract render + pronoun critique + HARD/SOFT floor) | needs L1–L3 (the facts to render) and benefits from S1 (clean placement); highest blast radius, do last | high — canary hard |

Each phase is reversible behind a flag and **proven against a corpus, not this run** (§8.4). No phase
"makes story_20260622-2122 pass"; each makes a *class* of stories better, measured by the calibrated
rubric distribution + the deterministic checkers across the canary set.

### 8.4 Generality guardrails — how we *prove* a fix is strategic, not tactical

For every change above:
1. **No story-specific identifiers** anywhere in the diff (no names, clue IDs, times, phrases). A diff
   that greps for "winding key" or "Lady Constance" is rejected on sight.
2. **Validated on a corpus / property test, not a run.** A schema/field fix ships with a property test
   over generated + historical CMLs (as the foundations already do); a render fix ships with the
   chapter-as-contract fidelity test; a scheduler change ships with the invariant suite — *not* with
   "the last run now completes."
3. **The calibrated rubric is the cross-run yardstick.** Success = the *distribution* of rubric scores
   (and the deterministic cap-fire rates: leakage, weak-murder, victim-unnamed) improves across the
   canary corpus, with no single-run cherry-picking.
4. **A fix that can't be stated without the storyline is the wrong fix** — escalate it one layer down
   until it can. (E.g. "this reveal lacks a death sentence" → *tactical*; "every CML must carry a
   `death_method` field, validated distinct from the mechanism, surfaced as a reveal obligation" →
   *strategic*.)

### 8.5 Explicit anti-patterns (what we will **not** do)

- ❌ Add regex for the exact leaked phrases ("elapsed time was confirmed", "Inspector Bramley was
  cleared") — that is whack-a-mole against an infinite phrase space; fix the *source* (R-A) so the
  model never produces schema-shaped prose.
- ❌ Merge/renumber Ch9–Ch10 for this story — fix *placement* (S1) so test and reveal get distinct
  slots for any chapter count.
- ❌ Inject a death-method sentence into the reveal — add the *field + obligation* (L1) so every story
  states one.
- ❌ Hand-fix the three pronoun slips — gender-aware critique (R-B) for any cast.
- ❌ Tune a threshold so this run clears 70 — calibrate the cap against the *rubric's own rule* and the
  corpus (C1/C2), then let the score fall where it falls.

### 8.6 The one-paragraph strategy

Every defect this run is a load-bearing fact the logic left implicit and the prose then omitted,
copied, or smeared — and a fallback that shipped the result. So the strategy is not five patches but
one principle applied at four layers: **pin every reader-facing fact as a typed, validated CML field
(death method, true/false time + the alibi it breaks, canonical victim); schedule its placement
deterministically; hand the model the obligation and its key terms — never the spec sentence — and
check fidelity instead of policing phrases; and never let "ship something" mean "ship a hard
violation."** Calibrate the rubric first so we can see the class-level effect, promote the
shadow-proven scheduler, enrich the CML at the source, then land the chapter-as-contract render with a
HARD/SOFT accept floor — each step proven on a corpus, none of it knowing or caring that the victim was
Sir Lionel or the trick was a clock.
