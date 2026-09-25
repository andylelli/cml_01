# ANALYSIS_59 — Run-review: *The Sundial's Silent Verdict* (2026-06-30, 13:04)

Status: **run-review.** Scope is narrow — the concrete defects in ONE run, scored by ChatGPT at **74/100**, the strongest draft yet but blocked from the 80s by a small set of prose-layer defects. Several map onto A_57 levers (cross-refs noted); a few are **new** and not covered by A_57/A_58. This run **postdates A_57+A_58 landing but predates the regression fixes in `2e32d698`** — so the pronoun behaviour below reflects the D5 partial-revert bug that `2e32d698` fixed.

**Run:** `stories/story_20260630-1304/` — *The Sundial's Silent Verdict*. Investigator **Evelyn Harcourt**, victim **Lord Charles Harcourt**, culprit **James Harcourt**; false suspects Beatrice Langley / Agnes Wilkes / Edward Mallory. Mechanism: **aconite poison in hollowed ice cubes** + a **heat-delayed sundial shadow** masking the true time. Report: `apps/api/data/reports/proj_aa8a2295…/run_efedba16….json`; external review in `chatgpt-review.txt`.

**Outcome:** internal `overall_score` **74/100**, release gate **failed** (1 warning, 0 hard-stops), **weakest phase = Prose Generation (quality ≈ 49)**, 0 retries. ChatGPT **74/100**, with an explicit ceiling: *"with pronouns fixed, leakage removed, and the sundial physics made more believable, this could reach 80–83."*

---

## Implementation progress (first-principles redesign)

The §"Building the best Agent 9 we can" design is specified in full in **[`documentation/plan/agent9-first-principles-LLD.md`](../../plan/agent9-first-principles-LLD.md)** (six-stage target pipeline, KEEP/DELETE/BUILD register, phased plan P0–P7, with its own live tracker). This block tracks what is **built and merged-ready** here.

Status legend: ☐ not started · ◐ foundations landed (library built + unit-tested, not yet wired into the live ship path) · ☑ wired + validated on N≥4.

| Phase | What | Status | Evidence |
|---|---|---|---|
| **P0.2 / P3.2** | General `scaffold-not-prose` detector (verbatim injector signatures + reasoning-verb+connective shape) + `noScaffoldValidator`; wired into the internal score (caps prose ≤4, ceil 65 when material) so the judge **sees** the A_59 #1/#4 leakage | ◐ | `packages/prose-guard/src/scaffold.ts` (9 tests); `rubric-score/{facts,hard-caps,types}.ts` (+3 tests) |
| **P1.1 / P1.2** | `StoryBible` (typed: `clock`/`placement`/`voices`/`discriminatingTest`/`beatSheet`) + `buildStoryBible` + `ChapterBeat` beat-sheet — the single dereference source | ◐ | `packages/prompts-llm/src/story-bible.ts` (11 tests) |
| **P2** | `runBibleGates` + **gate promotion wired**: contradiction gate + discriminator warn→throw in `agent9-run.ts` behind `AGENT9_BIBLE_GATES_BLOCKING` (default off) | ◐ | `story-bible.ts`; `agent9-run.ts` (~3359/3394, gated); needs upstream repair hook + N≥4 |
| **P3.1 / P3.4** | `ProseDefect` / `RegenRequest` types + async `runRegenRepair` / `regenThenValidate` (revert-on-regression, repair-strength progress rule, injectable LLM) | ◐ | `regen-repair.ts` (6 tests) |
| **P3.3** | Concrete `RegenFn` + glue + `runClueRegenPass` + **`generate.ts` call-site** (≈2613): detect missing clues → in-scene regen BEFORE the A1 patch (A1 suppressed for planted clues; unresolved logged + floored). Insertion-only preservation guard blocks re-gendering/dropped content. **Wired behind `AGENT9_REGEN_CLUE` (default off)** | ◐ | `regen-llm.ts` (8), `regen-integration.ts` (17); `generate.ts` gated block |
| **P4** | General `runInsertionRegenPass` + `runClearanceRegenPass` (A3/B7 replacement) — the machinery A2/B5/B6/B8/B10 reuse | ◐ | `regen-integration.ts` (17 tests); per-injector detectors + call-sites pending |
| **P5** | Critique→rewrite at temp 0.7–0.9 (`critique-rewrite.ts`) + **`agent9-run.ts` call-site** (~4150): rewrites lowest ≤4 chapters, rollback on dropped locked-fact/scaffold, cost folded in. **Wired behind `AGENT9_CRITIQUE_REWRITE` (default off)** | ◐ | `critique-rewrite.ts` (9 tests); `agent9-run.ts` gated block |
| **P6** | Per-stage model router `resolveStageModel` (strong on generate/rewrite, cheap on regen; unset ⇒ today's model) | ◐ | `model-tiering.ts` (3 tests) |
| **P1.3** | Time-anchor dereference: `buildContinuityContext` prefers case ground-truth over the prose scrape, behind `AGENT9_BIBLE_AUTHORITATIVE` (default off) | ◐ | `context-management.ts` + `prompt-builder.ts` (3 tests) |
| **P0.1, P0.3, P0.7** | A1/A2 leakage direct fix in `deterministic-repair.ts`; pronoun re-measure; repetition dedup | ☐ | (P0.4 clearance now covered by P4 regen) |
| **P0.5 / P0.6** | Agent 3b magnitude-plausibility check; Agent 5/7 early poison plant | ☐ | out of Agent 9 prose scope (other agents) |
| **P7** | Delete the deterministic prose layer | ☐ | **correctly deferred** — safe only after every injector is validated-off on N≥4 (deleting now breaks the live default path) |

**Verified green:** `@cml/prose-guard` 30 · `@cml/rubric-score` 65 · `@cml/prompts-llm` 637 · `@cml/worker` 263 tests; prompts-llm + worker type-check + build to `dist` cleanly. **P2–P6 + P1.3 are all now wired behind their own default-off flags** (`AGENT9_REGEN_CLUE`, `AGENT9_REGEN_*`, `AGENT9_CRITIQUE_REWRITE`, `AGENT9_BIBLE_GATES_BLOCKING`, `AGENT9_BIBLE_AUTHORITATIVE`, `AGENT9_MODEL_*`). With every flag unset the pipeline is byte-for-byte today's behaviour; each gated path degrades to the existing deterministic behaviour on failure and can never break a run. What remains is **measurement** (flip each flag on a powered **N≥4** matched set, per `canary-k2-single-run-confounded`) and P7 (delete-after-validation) — not code a single-run review can complete.

---

### Score anatomy (ChatGPT)

| Category | Mark | The drag |
|---|---|---|
| Premise / concept | 8 | (ceiling) hollow-ice poison + unreliable sundial is distinctive |
| Plot structure | 8 | discovery → sundial doubt → ledger → echoes → ice → false accusation → test → reveal |
| Atmosphere | 8 | autumn manor, sundial garden, kitchen, stables, icebox |
| Pacing | 8 | false-accusation turning point lands |
| Ending / reveal | 8 | culprit + method + motive + opportunity + test + consequence all present |
| Opening hook | 7 | named victim/investigator/sundial/thermometer; poison under-signalled |
| **Clues / evidence logic** | **7** | strong chain, but **sundial physics implausible** |
| **Character clarity** | **6** | **pronouns slip badly (James / Edward / Lord Charles)** |
| **Dialogue** | **6** | functional in many scenes |
| **Prose / polish** | **5** | **prompt/template leakage + pronoun errors** |

**The two dominant drags are Prose 5 and Character 6 — the same prose-layer pair A_57 targets. ChatGPT names the order of operations: leakage + pronouns first, then physics.** Note the internal↔external gap has effectively closed here (74 vs 74) and the gate *failed* — the system correctly flagged "not ready," so A_59 is about the **generation** defects, not the judge.

---

## Issue catalogue (grounded in the prose + logs)

### P0 — the prose-layer ceiling (Prose 5 / Character 6)

**1. Deterministic clue/inference-surfacing templates ship RAW into the prose — the #1 polish killer.**
- Symptom (verbatim from the story, ChatGPT flagged these as "very bad … internal reasoning text, not fiction"):
  - Ch (stables): *"Evelyn Harcourt pressed on to the next concrete detail: **Wind direction stable door acoustics caused**. That detail shifted the reasoning. Evelyn Harcourt weighed Wind direction stable door acoustics caused, and **the trail bent toward Auditory illusions invalidating servants footsteps timing**."*
  - Ch (study): *"Evelyn Harcourt pressed on to the next concrete detail: **Poison concealed hollow cubes releasing toxin**. That detail shifted the reasoning. … the trail bent toward **Mechanism delayed poisoning hollow cubes**."*
  - Reveal: *"Evelyn Harcourt **set out the two competing readings** so everyone could weigh them side by side."*
- Where: [deterministic-repair.ts:294](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L294) (`"${investigatorName} pressed on to the next concrete detail"`), [:300](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L300) (`"${investigatorName} weighed ${entry.description}, and the trail bent toward ${entry.pointsTo}."`), [:376](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L376) (`"set out the two competing readings…"`).
- Read: these deterministic clue/inference-surfacing fallbacks paste **raw clue key-terms** (`entry.description` / `entry.pointsTo`, e.g. "Poison concealed hollow cubes releasing toxin") into a fixed scaffold and the result ships verbatim. This is A_57 **D4**'s disease (deterministic injection = template) but a **class A_57 D4 never touched** — A_57 D4 only reworded `buildDeterministicClearanceParagraph`. The internal template-leakage detector did not escalate it (release gate shipped with 1 warning). **This is the single highest-value fix in the run.**

**2. Pronoun errors across multiple characters — "the biggest reason the score is not closer to 80" (ChatGPT).**
- Symptom (ChatGPT): Lord Charles's hand described as *"her right hand"*; James sometimes *"she/her"*; Edward sometimes *"she/her"*; Evelyn refers to James with the wrong pronoun.
- Where: D5 territory — the deterministic pronoun sweep + the (off-by-default) `pronoun_policy`. Critically, this run ran with the **D5 mutation-revalidation guard's partial-revert bug active** ([fixed in `2e32d698`](../../apps/worker/src/jobs/agents/agent9-run.ts)): a sweep that reduced misgendering 5→2 was reverted whole, so partial pronoun fixes were discarded → drift survived.
- Read: the `2e32d698` fix should materially help next run (partial sweeps now ship). The residual is the score-sensitive `pronoun_policy` enable (A_57 D5, A/B-gated) + the cross-paragraph antecedent cases the sweep can't safely fix. Re-run first to measure the `2e32d698` effect before enabling `pronoun_policy`.

**3. Report-style clearances + the detective clearing herself — still template, not drama (D4).**
- Symptom: *"As for myself," Evelyn continued … "I am accounted for by two witnesses who placed me elsewhere until well after it happened, **which proves I could not have been responsible**."*; *"The test is complete… The evidence is incontrovertible. The others are cleared. The case is closed."* ChatGPT: *"reads like a checklist … 'Therefore, you are innocent.' / 'Your alibi is confirmed.' / 'As for myself…'."*
- Where: the deterministic clearance paragraph ([deterministic-repair.ts](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts) `buildDeterministicClearanceParagraph`) + the A_57 D4 detector (`detectReportStyleClearance` already matches `"as for myself"` — it was shadow-only here, so it capped the diagnostic but didn't block).
- Read: A_57 D4's reword reduced the worst frame but the **"two witnesses placed me elsewhere … which proves … could not have been responsible"** template and the **detective self-clearance** still ship. The clean fix is the A_57 D4 **micro-regen** (dramatize the clearance) and a rule that the detective is not cleared in report style.

**4. The final discriminating test leaks "two competing readings" validation language (D2/D7).**
- Symptom: after a genuinely strong test ("recreate the sundial delay at 80°F, shadow lags ten minutes, recheck the ice tray"), the prose reverts to *"set out the two competing readings so everyone could weigh them side by side"* and a verdict close *"The case is closed."* ChatGPT: *"after the good test, the prose slips back into explicit 'two competing readings' validation language. Trim that part and keep the scene dramatic."*
- Where: [deterministic-repair.ts:376](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L376) (same template family as #1) + the resolution close.
- Read: same root as #1 (a deterministic discriminating-injection template). Note A_58 #1 reworded the *resolution backstop*, but this "two competing readings" line is a **different** deterministic inject that A_58 didn't touch.

### P1 — mechanism plausibility & fair-play planting

**5. The sundial physics are implausible — "the biggest problem" (ChatGPT).**
- Symptom: the story claims **heat expands the brass gnomon enough to delay the shadow by ten minutes** — too large a claim for a fair-play reader. ChatGPT's cleaner version: *the gnomon was **loosened at its base**; heat softened/expanded the fixing, letting it tilt; the tilt delayed the shadow; James knew because he maintained the sundial.*
- Where: Agent 3b hard-logic device (`corePrinciple`/`underlyingReality`) and its plausibility judge (`AGENT3B_PLAUSIBILITY_JUDGE`).
- Read: the device over-claims a physical effect. The plausibility judge should flag "pure thermal expansion → 10-minute shadow shift" and prefer a mechanical assist (loosened fixing). Generic lever: a magnitude-plausibility check on physical-law devices.

**6. Cause of death is under-planted in Chapter 1 (fair-play).**
- Symptom: ChatGPT — *"Chapter 1 does not strongly signal poisoning"*; the aconite/ice method only becomes strong later. Suggested early plants: faint numbness/tingling reported earlier, bitter taste in the glass, unusual constriction/stiffness, no wound despite sudden collapse, a water glass near the sundial.
- Where: Agent 5/7 clue scheduling — the discovery scene should carry ≥1 poison indicator.
- Read: the method is fair by the end but not *early*; plant one concrete poison tell in the body-discovery scene.

### P2 — repetition polish

**7. Repeated stock phrasing across chapters.**
- Symptom: *"the truth remained elusive"* (≥2×, e.g. lines 69 & 121), *"the evidence was mounting"* (multiple chapters), and ChatGPT's noted *"emotional cost"* / *"truth remained elusive"* repetition.
- Where: the anti-repetition lint / NSD phrase-history ([lint.ts](../../packages/prompts-llm/src/agent9-prose/lint.ts), narrative-state phrase tracking).
- Read: low blast radius but it accumulates; the repeated "evidence was mounting / truth remained elusive" reads as filler between the (good) beats.

---

## Summary table

| # | Sev | Issue | Where | Disposition |
|---|---|---|---|---|
| 1 | P0 | Deterministic clue/inference templates ship raw key-terms as prose | deterministic-repair.ts:294/300/376 | **highest value** — A_57 D4 class never covered |
| 2 | P0 | Pronoun errors across James/Edward/Lord Charles | D5 sweep / pronoun_policy | `2e32d698` should help; re-measure then A/B `pronoun_policy` |
| 3 | P0 | Report-style clearances + detective self-clearance | deterministic clearance + D4 | micro-regen / dramatize; don't self-clear in report style |
| 4 | P0 | DT test leaks "two competing readings" validation language | deterministic-repair.ts:376 | same root as #1 |
| 5 | P1 | Sundial physics implausible (brass expansion → 10 min) | Agent 3b device + plausibility judge | prefer "loosened/tilted gnomon"; magnitude check |
| 6 | P1 | Poison under-planted in Ch1 | Agent 5/7 clue scheduling | plant one poison tell at discovery |
| 7 | P2 | Repeated "truth remained elusive" / "evidence was mounting" | anti-repetition lint / NSD | tighten phrase-history dedup |

---

## Fix plan

**Guiding principles** (consistent with A_58): fix the deterministic-injection leakage at its source (it is presence-guaranteed scaffolding, so it must read as prose or not ship); re-measure the `2e32d698` pronoun fix before flipping score-sensitive gates; keep each fix carrying a log/test acceptance signal.

### Phase 1 — kill the template leakage (P0 #1 + #4, the biggest single jump in Prose)
- **Change:** the deterministic clue/inference-surfacing fallbacks ([deterministic-repair.ts:294/300/376](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L294)) must never paste raw `entry.description`/`entry.pointsTo` key-terms or the "pressed on to the next concrete detail / the trail bent toward / two competing readings" scaffold into shipped prose. Two tiers (A_57 D4 model): (a) **micro-regen** — one cheap LLM call to render the clue/inference as an in-scene observation; (b) if no LLM call is affordable, **drop the inject** rather than ship the scaffold (these are surfacing *aids*, not required-presence content — the clue is already validated present elsewhere).
- **Add a detector** (so the score sees it): a deterministic template-leakage rule in `@cml/rubric-score` / `prose-guard` for these exact signatures (`pressed on to the next concrete detail`, `the trail bent toward`, `set out the two competing readings`, `that detail shifted the reasoning`) → cap *prose*. They are as machine-detectable as the A_57 D1/D4 caps.
- **Acceptance:** 0 occurrences of those phrases in shipped prose; the new detector fires on the run-09168377-style fragment in a unit test.
- **Risk:** low (deletion/dramatization of a surfacing aid); verify the clue-presence gate still passes without the scaffold (the clue is planted independently).

### Phase 2 — pronouns (P0 #2)
- **Change:** none new yet — `2e32d698` fixed the D5 partial-revert. **Re-run and measure** the deterministic-sweep repair count + residual `pronoun_gender_mismatch`. If residuals persist on multi-character mixed-gender sentences, A/B-enable `pronoun_policy` (A_57 D5, score-sensitive).
- **Acceptance:** ChatGPT-visible pronoun slips drop to ~0; sweep repair count trends down; no `mutation-revalidation … reverted` on the sweep.

### Phase 3 — clearances (P0 #3)
- **Change:** route the deterministic clearance paragraph through the A_57 D4 micro-regen so each clearance is a dramatized deduction ("Beatrice never left the kitchen; Agnes's footsteps were echoes; Edward was seen in town; only James had touched the ice"), and suppress the **detective self-clearance** ("As for myself…") or dramatize it as a one-line aside, never the "which proves I could not have been responsible" frame.
- **Acceptance:** `detectReportStyleClearance` (already in rubric-score) returns clean on the shipped reveal; no "As for myself … which proves … responsible".

### Phase 4 — mechanism plausibility (P1 #5)
- **Change:** strengthen the Agent 3b plausibility judge to flag a physical-law device whose claimed *magnitude* is implausible (pure thermal expansion → 10-min shadow shift) and prefer a mechanical assist (loosened/tilted fixing). Generic: a magnitude-sanity prompt on `physical_law` devices.
- **Acceptance:** the device's `corePrinciple`/`underlyingReality` carries a believable causal chain (loosened fixing + heat → tilt → delay), not raw expansion.

### Phase 5 — early poison plant + repetition (P1 #6, P2 #7)
- **Change:** ensure the discovery scene schedules ≥1 poison indicator (numbness/bitter taste/no wound/water glass) via Agent 5/7; tighten the anti-repetition phrase-history so "the truth remained elusive" / "the evidence was mounting" can't recur across chapters.
- **Acceptance:** Ch1 contains a fair-play poison tell; no stock phrase repeats >1×.

### Sequencing & validation
1. **Phase 1** (leakage) → 2. **Phase 3** (clearances) → 3. re-run to measure **Phase 2** (pronouns post-`2e32d698`) → 4. **Phase 4** (physics) → 5. **Phase 5** (plant + repetition).
- Phases 1 & 3 are the bulk of `Prose 5 → 7/8`; pronouns are the bulk of `Character 6 → 8`. Together they are ChatGPT's stated path to 80–83.
- **End-to-end signal:** a re-run whose log shows no deterministic-template phrases in prose, no report-style clearance, ~0 pronoun slips, and a believable mechanism — then confirm on a powered N≥4 set (single-run deltas are confounded — `canary-k2-single-run-confounded`).

> **Relationship to A_57/A_58:** #1/#4 are the A_57 **D4** disease in a class A_57 didn't cover (clue/inference surfacing, not just clearances); #3 is D4 + a new detective-self-clearance case; #2 is D5 (the `2e32d698` partial-revert fix applies); #5 is mechanism plausibility (Agent 3b, outside A_57's prose scope); #6 is fair-play planting; #7 is anti-repetition. A_59 records them **as observed in this 74/100 run**; fixes belong to whichever track picks them up.

---

## Stepping back — why this feels like whack-a-mole, and how to actually fix Agent 9

The pattern is real and worth naming. A_57 **D4** reworded the *clearance* template. A_58 **#1** rewrote the *resolution backstop* template. A_59 **#1/#4** find the *clue/inference-surfacing* templates leaking. **Same mole, three holes.** Each fix removed one template signature; the next required-presence injection became the new "prompt leakage." That is not bad luck — it is the architecture telling us something.

### The root cause (one sentence)

**Agent 9 uses the *deterministic* layer to do two incompatible jobs at once — guarantee that required elements are PRESENT, and WRITE the prose that carries them — and a string-injection layer can guarantee presence but can never produce fiction, so every guarantee surfaces as template that a human reads as leakage.**

The 8-agent code review counted the moles: there are **~15 deterministic prose-mutating passes** in the Agent 9 chain (grounding-lead, locked-fact value injection, culprit-evidence injection, resolution injection/backstop, clearance patch, suspect-elimination injection, key-term/clue surfacing, role-alias substitution, victim-reappearance rescue, pronoun sweep, malformed-surfacing repair, …). **Every one that emits text is a leakage/template surface.** Per-template detectors and rewords treat them one at a time — there will always be a next one.

A second, quieter signal: in this run the **internal score (74) and ChatGPT (74) agree, and the release gate correctly failed.** A_57's original thesis was a blind judge (internal 80 vs human 70); that gap has largely closed (A_57 §4 paid off). **So measurement is no longer the blocker — generation/repair *quality* is.** That changes the priority: the remaining 74→83 is almost entirely "deterministic scaffold reads as template" + "pronoun drift" + "model-tier craft," none of which is a *more-rules* problem.

### What we CAN do (structural, ends the game — not more moles)

1. **Invert every presence-guarantee from "inject a string" to "detect → regenerate → re-validate."** This is A_57 **§9.3**, stated but never made the default. When a required element is missing or template-shaped, spend one **tiny scoped LLM call** to render it in-scene (the clearance becomes a witnessed deduction; the clue becomes an observation), then re-run the presence check. The deterministic string survives only as a **logged last-resort fallback** — and if it ever ships, that is recorded as a quality miss, not shipped silently as prose. This kills the **entire** leakage class (D4, A_59 #1/#3/#4) at once instead of one template per analysis doc.

2. **Replace N per-template detectors with ONE general "scaffold-not-prose" gate that TRIGGERS regen** (not just caps the score). The known phrases ("pressed on to the next concrete detail", "the trail bent toward", "two competing readings", "X was cleared because", second-person "you are innocent" verdicts) are a seed; generalise to the *shape* — a sentence that is subject + reasoning-verb + raw key-terms with no scene grounding. Wire it to fire the micro-regen above, so detection and repair are the same loop.

3. **Land the critique→rewrite pass at creative temperature** (A_57 **§3** / the deferred P2). After deterministic presence-repair, rewrite the lowest-scoring chapters at temp 0.7–0.9 with deterministic re-validation + rollback. The current post-pass runs at temp 0.2 ("prefer no change") and *structurally cannot lift craft*. A rewrite that takes a present-but-template chapter and re-renders it as prose — preserving the validated facts — collapses leakage + report-style + functional dialogue + repetition into **one** quality pass. This is the lever that turns "scrape 74" into "hold 80+".

4. **Move pronoun and identity discipline to generation time, not post-hoc repair.** The deterministic sweep is gated off (`pronoun_policy=off`) precisely because it can't safely fix ambiguous antecedents — so drift ships. The durable fix is a gender-locked prompt contract the model actually follows (A_57 D5 generation half) plus the now-fixed re-validate-after-mutation (`2e32d698`); the sweep stays only for the unambiguous residue.

5. **Keep the deterministic layer for exactly what it is good at and nothing more:** machine-verifiable *guarantees* that must never regress — fair-play (all clues visible), no-spoiler embargo, locked-fact present, culprit named, suspect partition sound, victim not animated. These are correctly deterministic and should stay. The line is: **deterministic owns PRESENCE; the LLM owns PROSE.**

### What we CAN'T do (the honest limits)

- **We cannot make string injection read like fiction.** No reword turns "the trail bent toward Mechanism delayed poisoning hollow cubes" into prose; rewording only moves the leak. (This *is* the whack-a-mole.) So the deterministic *prose* output must stop shipping — not be improved.
- **We cannot fix ambiguous-antecedent pronouns deterministically** without false replacements — hence `pronoun_policy=off`. The safe sweep handles only the unambiguous cases; the rest needs generation-time discipline or an LLM rewrite.
- **We cannot make the LLM never need repair.** A gpt-4.1-class generator will sometimes omit a clue, misgender, or write a report-style clearance. Presence-repair must exist — the only choice is whether it ships as template (today) or is dramatized (target). So "delete the deterministic passes" is *not* an option; "stop letting them ship prose" is.
- **We cannot close the last stretch of the craft gap with rules at all.** Functional dialogue, idiolect, "many scenes still feel functional" (Dialogue 6) are model-tier — the levers are the critique-rewrite pass and/or a stronger generator, not another linter.
- **We cannot trust any of this on a single run.** Every quality change must be judged on a powered **N≥4** matched set (`canary-k2-single-run-confounded`); single-story deltas will keep producing false "fixed it" / "broke it" conclusions.

### The recommendation

**Stop adding per-template detectors and rewords** — that is the whack-a-mole, and we have now confirmed it three times. Instead make the two structural moves that end the game: **(1)** convert the deterministic injection layer from *inject-prose* to *detect-and-regenerate* (presence stays guaranteed; prose stops shipping as template), and **(2)** land the **critique→rewrite-at-creative-temperature** pass that A_57 §3 deferred. Those two together address #1/#3/#4 (leakage/report-style), most of #7 (repetition), and a large part of Dialogue 6 — i.e. the bulk of the 74→83 — **once**, rather than one template at a time. Keep the deterministic gates only as *guarantees* (presence/fairness/structure), and keep validating on N≥4. The tactical Fix-plan phases above are still worth doing as the immediate stop-gap, but the strategic work is the inversion + the rewrite pass; everything else is moles.

---

## Building the best Agent 9 we can — a from-first-principles design

This section pulls together everything learned across A_51–A_59, the 8-agent full code review, and this run, and asks: **if we could build Agent 9 right — even rebuild it — what would it be?** Constraint: LLM cost may rise to **2× current** (the run cost **$0.29 total**, so the ceiling is **~$0.58/run**). That headroom is the whole reason the design below is affordable.

### A. The spec, stated cleanly (what Agent 9 is actually for)

Agent 9 turns a fully-specified, verified case (cast, world-state, clue plan, discriminating test, beat-outline) into 8–12 chapters that are simultaneously:

1. **Coherent** — no fact drifts (times, weather, locations, identities, **pronouns**);
2. **Fair-play sound** — every clue is planted before the reveal, the discriminating test actually *discriminates*, the reader could solve it;
3. **Interesting** — reads like published Golden-Age fiction: dramatized not declared, distinct voices, real atmosphere, an earned reveal;
4. **Clean** — never leaks scaffolding, reasoning text, template, or validation language.

Those four are the entire job. The test of any line of Agent 9 code should be: *which of these four does it serve, and is it the right kind of tool for that job?* Today much of the code fails that test — deterministic string-builders trying to serve #3.

### B. The single principle we got wrong

> **Deterministic code may VERIFY and GUARANTEE; it must never WRITE. The LLM WRITES and REPAIRS; deterministic code CHECKS and BLOCKS.**

The current architecture violates this: ~15 deterministic passes both *guarantee presence* and *emit prose*, so every guarantee ships as template — and that is the whack-a-mole. Restoring this one boundary dissolves the whole class. It implies three strictly-separated layers:

| Concern | Owner | Rule |
|---|---|---|
| Presence / fairness / structure (decidable) | deterministic verifiers | check & block; **never write**; never regress |
| Prose (craft) | the LLM | writes, and repairs its own misses under constraint |
| The bridge (a verifier found a gap) | a **scoped LLM regen** | dramatize the missing element in-scene; a deterministic string is only an emergency floor that, if it ever fires, **flags the chapter for rewrite and logs a quality failure** — it does not silently ship |

### C. The target pipeline (six stages)

1. **The Story Bible — construct-then-verify, frozen before prose.** The A_57 §9.1 world-state taken to completion: one canonical, typed, cross-checked object holding *every* referenceable fact — times (staged & true), environment per moment, each character's (name, gender, role, **voice profile**, location-per-time-slot), method, motive, the murder moment, the discriminating test as `(staged_value, true_value, exposing_action)`, and a **per-chapter beat-sheet** (beats, clues planted/paid-off, suspect pressured, arc position, emotional turn). The contradiction gate (§9.1) + discriminator verifier (§9.2) run *here*; an unsound or incoherent case is repaired **at the source**, never in prose. **Everything downstream dereferences the Bible; nothing is re-derived in a prompt** — that is what kills drift (D1/D2/D3/D5 become bible properties, not prose hopes).
2. **Generate — LLM, moderate temp, full prior-chapter context.** Each chapter is written from its beat-sheet slice: beats, clues-to-plant *as obligations* (not text), characters-present with **locked voice + gender + pronouns**, locked atomic facts (verbatim) + descriptive facts (paraphrase), arc/tone, and the absolute anti-scaffold rule. The model writes the **complete** chapter — clearances, reveal, test — as prose. No placeholders, no "X was cleared because."
3. **Verify — deterministic, writes nothing.** Per-chapter and whole-story: presence (clues, locked facts, culprit named, suspects partitioned), fairness (no pre-reveal spoiler, all clues visible), coherence (gender/pronoun vs bible, victim-not-animated, time/location/weather vs bible), soundness (discriminator excludes all but the culprit), and a **general scaffold/leakage gate**. Output is a *defect list with locations*. No mutation.
4. **Repair-by-regen — LLM, scoped, then re-verify.** For each defect, a small targeted regen: *plant {clue} in this paragraph as an observation; dramatize this clearance; resolve this pronoun; rewrite this scaffold sentence as prose.* Each repair re-runs the verifier it targeted (mutate-then-validate — already the law) and rolls back on any regression. **The ~15 deterministic prose injectors are removed from the ship path.**
5. **Critique → rewrite at creative temperature — the craft layer.** For the lowest-scoring chapters/dimensions, an LLM critiques against the rubric (prose, dialogue, character, atmosphere) and rewrites to lift them at **temp 0.7–0.9**, with deterministic re-validation + rollback. This is where dramatization, idiolect (D6), atmosphere, and de-repetition are *earned*. Today's post-pass runs at temp 0.2 ("prefer no change") and **structurally cannot** do this — it is the missing craft engine.
6. **Judge & gate — honest, calibrated.** The K2 rubric + deterministic detectors decide ship / rewrite-again / abort. A_59 shows the internal↔external gap has **closed** (74 vs 74) and the gate fails correctly, so this layer is largely maintenance now — keep calibrating against held-out human scores.

**Note how this subsumes all seven A_57 defects** rather than patching them: D1/D2/D3 become Bible properties (typed facts + contradiction gate); D4 is *eliminated* by inject→regen; D5 is generation-discipline + targeted regen; D6/D7 are the Bible's voice/test fields realized by generation + the rewrite pass. Seven moles → one architecture.

### D. What we keep, delete, and build (mapped to the code)

- **KEEP (hard-won and correct):** the world-state ledger (`world-state.ts`), the discriminator verifier (`discriminator-verifier.ts`), the fair-play / no-spoiler / locked-fact / lifecycle / clue-presence **verifiers**, the `mutateThenValidate` law, the rubric + A_57 §4 detectors. These are the decidable guarantees — exactly what deterministic code *should* own.
- **DELETE from the ship path (the ~15 prose injectors):** grounding-lead, locked-fact value injection, culprit-evidence injection, resolution backstop, clearance patch, suspect-elimination injection, key-term/clue surfacing (`deterministic-repair.ts:294/300/376` — the A_59 #1 leak), role-alias substitution, the report-style templates. **The 8-agent review found ~30 latent bugs concentrated in exactly these passes** — converting them to regen removes the bugs as a side-effect.
- **BUILD:** (1) the unified **Bible + beat-sheet**; (2) the **scoped regen-repair loop** (verify→regen→re-verify→rollback); (3) the **general scaffold-not-prose detector** that *triggers regen*; (4) the **critique→rewrite-at-temperature** pass; (5) a **cost-tiered model router**.

### E. Cost — how it fits inside 2× (~$0.58/run from ~$0.29)

- **Verifiers are deterministic → free.** Deleting the injectors is cost-neutral-to-negative.
- **Micro-regens are tiny** (one paragraph in/out). Even 20–30 across a run is a small fraction of one full-chapter generation — pennies.
- **The expensive lever is the critique→rewrite pass** (full chapter in + full chapter out, ×2 for critique+rewrite). Doing it on **all** 10 chapters would likely breach 2×; **scoping it to the lowest-scoring ~3–4 chapters** keeps it comfortably inside, and that is where the marginal craft gain is anyway.
- **Model tiering — spend the budget where craft lives.** Use the **most capable model available** (per this environment, the latest Claude — Opus-class) for **Generation** and the **critique→rewrite** pass; use a cheaper/faster model for micro-regens, classification, and the scaffold detector. A stronger generator *also reduces the repair burden* (fewer defects to fix), so it is partly self-funding. (The craft ceiling — Dialogue 6, "many scenes still feel functional" — is partly **model-tier**; no rule closes it, only a better model or the rewrite pass.)
- **Net:** the 2× headroom comfortably funds full regen-repair + a scoped creative-rewrite pass + a stronger model on the two craft-critical stages. The cost goes to *earning quality*, not to *more deterministic guardrails*.

### F. What this buys

- **Ends the whack-a-mole** — no deterministic string ships as prose, so there is no "next template" to leak.
- **Lifts the craft ceiling** — the rewrite pass + stronger model reach Dialogue/idiolect/atmosphere that rules never could.
- **Coherence by construction**, not by repair — the Bible removes drift at the source instead of chasing it across ten chapters.
- **Simpler, less buggy** — deleting the injector layer removes ~30 latent bugs and a large fraction of the code's surface.

### G. Rewrite or evolve? — **Evolve.**

Do **not** green-field. The verification / fair-play / world-state logic is the hard, correct, hard-won part, and rebuilding it would re-introduce risk we've already paid down. What must change is narrow: the **prose-production boundary** (inject → regen) and the **addition of the rewrite pass**. Everything in §D-KEEP stays. So this is an in-place evolution, deleting injectors as their regen replacements prove out — not a rewrite.

### H. Migration path (incremental, flag-gated, validated on N≥4)

1. **Finish the Bible** — promote the world-state ledger to the single source every prompt draws from (the deferred A_57 §9.5(2)); add the per-chapter beat-sheet.
2. **Build the regen-repair loop + the general scaffold detector**, and **convert the worst injector first** — the clue/inference surfacing (A_59 #1). Measure on a powered N≥4 set. Then convert the rest one at a time; each conversion *deletes* an injector.
3. **Land the critique→rewrite pass** behind a flag; A/B it on N≥4.
4. **Tier the models** — strongest on Generate + Rewrite, cheap on regen/classify.
5. **Once all injectors are converted and the rewrite pass wins, delete the deterministic prose layer** outright.

Each step is independently shippable and independently measured — no big-bang, and the whack-a-mole stops as soon as step 2 converts the current mole.

### I. The honest limits (even the best version)

- LLM repair/rewrite can still produce *mediocre* prose; rollback protects facts and fairness, not brilliance.
- **Latency rises** (more calls) — fine for a batch generator, not for real-time.
- The rewrite can regress a fact → the **re-validate + rollback is load-bearing** and must be airtight (the `mutateThenValidate` law generalised to whole chapters).
- **Single runs lie** — every step validated on a powered N≥4 matched set (`canary-k2-single-run-confounded`).
- **Model tier is the ultimate ceiling** — past a point only a better model moves the craft score; the architecture's job is to stop *wasting* the model on scaffolding and let it spend its capability on prose.

**Bottom line:** the best Agent 9 we can build is not more guardrails — it is a clean split where **deterministic code guarantees the case is present, fair, and sound, and the LLM (a strong one, given creative-temperature room and rollback safety) does all the writing.** We already own the hard half (the verifiers and the world-state); the work is to stop the deterministic layer from writing, route every guarantee through a scoped regeneration, and add the creative-rewrite engine the current temp-0.2 post-pass can never be. That fits in 2× cost, removes ~30 bugs, and ends the mole hunt.
