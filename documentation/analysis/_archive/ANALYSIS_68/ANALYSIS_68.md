# ANALYSIS_68 — Why the sundial scored 72, and the three highest-lift fixes

**Written:** 2026-07-24 · **Trigger:** run `story_20260724-1841` (*The Sundial's Frozen Shadow*) scored **72/100** external — down from the manor-clock **81** and bell-tower **79** of the same day. The owner's framing is the correct one: *"I have no control over the story other than the parameters I set."* The pipeline chose the sundial premise **and** chose a physically-impossible cover-up. A low score there is a **pipeline failure, not premise variance** — so this doc diagnoses by root cause and fixes the three gaps with the most score lift. **Regime:** corpus era (A_63 §2.8) — behaviour levers ship flag-gated default-OFF, probed before promotion; runtime env getters, never module consts.

**Method:** a 5-reader census (`wnuk54nqj`) mapped the machinery behind each drag before any code was written. This is a **decision + action** doc — the fixes below are built, tested, and committed.

---

## 1. Diagnosis — why 72, by sub-score

The external drag is concentrated in three marks, and the reviewer's own verdict was *"with the sundial mechanism clarified and the time contradiction fixed, it could reach 80–84."*

| Dimension | Sundial | Clock (81) | Root cause (from the census) |
|---|---|---|---|
| **Mystery clues / evidence logic** | **5/10** | 8 | The cover-up is physically **impossible**: "cold contracts copper → warps the plate → *delays* the sundial's shadow." A shadow follows the sun; it cannot be time-delayed like a chime or a fast clock. **Nothing in the pipeline checks mechanism physics.** |
| **Ending / reveal** | **6/10** | 8 | Same impossible mechanism + a **self-contradictory reveal time**: *"died **before** twenty minutes past ten. In fact, the true time of death was **ten minutes to eleven**"* — 10:50 is after 10:20. |
| **Prose / polish** | **6/10** | 6 | Planning/validation leakage (*"The result proved one theory and ruled out the other…"*) + a name-casing garble (*"Inspector harold wren"*). **Both are deterministic injections**, not LLM slips. |
| Plot / pacing | 7 / 7 | — | Ch10 ("Clearance and Culprit Revealed") **re-stages** the Ch9 reveal — the recurring "solve then keep explaining" duplicate chapter. |

**"One run" caveat still holds** (`canary-k2-single-run-confounded`) — but the point is not that 72 proves a regression; it's that each drag traces to a **structural gap that ships on every run of that shape**. The sundial merely exposed them.

---

## 2. Census verdict — the load-bearing finding

Reader 4 (rubric-score): **none of the three craft fixes moves an internal cap today — they are "vanity" to the score that gates/regens generation until each gets a detector.** So the pipeline had *no lever* to catch any of these; it would keep shipping them. **Every fix below is therefore craft + detector**, or it doesn't stick.

Other census surprises that reshaped the plan:
- The one physics judge (`Agent3b-PlausibilityJudge`) is **default-OFF**, judges the *ideation device* not the shipped `hidden_model.mechanism`, and only checks *magnitude*, never the false-time *category* error. (`agent3b-plausibility-judge.ts`)
- `temporal-consistency.ts` is a **month→season validator only** — zero clock logic. The real clock machinery (agent9-run) uses a **60-minute floor** (so a 30-min or 5-min drift is sub-threshold) and an **unsigned** diff (no before/after), and scans artifacts, never chapter-vs-chapter prose.
- The aftermath machinery to make the final chapter a denouement **exists and is wired** — but its trigger is **100% dependent on LLM-emitted `scene.beat` strings**; when they're absent it silently binds the reveal to the last chapter. (`clue-validation.ts`)
- The leakage sentences are **hardcoded deterministic templates** injected *after* validation (`deterministic-repair.ts:408/413`). My A_67 polish-prompt strengthening was aiming at the wrong layer — a soft LLM scrub of a phrase a deterministic injector re-adds every run.

---

## 3. The three fixes (built + tested)

### FIX A — Mechanism physical coherence  *(biggest lift: clues 5→8, ending 6→8)*
**Root cause:** `hidden_model.mechanism.description` is free-text with no physics rule anywhere on the shipping path.

- **Prevention (ACTIVE, unflagged):** a **false-time category rule** in the Agent-3 CML prompt (`agent3-cml.ts` req 6 + self-checklist) and the hard-logic-device prompt (`agent3b-hard-logic-devices.ts`): *a false time can only be faked on an instrument whose reading can be reset/advanced/retarded (clock/watch/chime/bell/log); a reading fixed by an external driver — sundial/shadow, thermometer, tide, candle — cannot be time-shifted by cooling/warping/moving it.* Pure prompt text; nothing breaks.
- **Detection (ACTIVE, citation-gated):** new judge flag **`mechanismIncoherent`** (`rubric-score` schema/prompt/types) — the judge is now explicitly asked to grade the **physics**, with the sundial as the worked example. Cap: `clues≤6, plot_structure≤6, ending≤6, overall≤72` (mirrors weak-murder-method). Rides the existing citation-verify path, so it can't false-fire on an uncited claim.

### FIX B — Temporal reveal contradiction  *(the reviewer's "biggest continuity error")*
**Root cause:** no gate models before/after ordering or sub-60-min drift.

- **Detection (deterministic, flag-gated cap):** `detectTemporalOrderingContradiction` (`structural-verifiers.ts`) parses **digit and word-form** times ("twenty minutes past ten", "ten minutes to eleven", "quarter past", "o'clock", "10:20") and fires **only** on an explicit `before/after <T1> … (in fact|the true time was) <T2>` where T2 numerically contradicts the stated order. The **correct** reveal ("died at ten minutes to eleven, **not** twenty past ten as the shadow suggested") has no before/after relation and never fires. New fact **`temporalContradiction`**, cap `plot_structure≤5, ending≤6, overall≤72`.
- **Flag:** the deterministic caps (B + C) are gated behind **`RUBRIC_STRUCTURAL_CAPS_A68`** (default-OFF). The detectors always run and are surfaced in `structural` for telemetry; they only clamp once an A/B confirms no false-positives (§2.8).

### FIX C — Duplicate reveal chapter  *(recurring "solve then keep explaining")*
**Root cause:** aftermath detection collapses to nothing when `scene.beat` is absent → reveal binds to the last chapter → a second MANDATORY RESOLUTION.

- **Generation (flag-gated):** a **beat-independent signal fallback** in `isGoldenAgeAftermathFinalChapter` (`clue-validation.ts`) — when **no** scene carries a beat, recover the aftermath decision from scene title/purpose signals (final-trap/discriminating-test on an earlier chapter + reveal/aftermath on the last), so the final chapter becomes aftermath-only and the existing AFTERMATH CONTRACT fires. Guards against suppressing a genuine last-chapter reveal (requires an earlier naming chapter; excludes false-solution chapters). Flag **`AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK`** (default-OFF). Pairs with `AGENT9_FOLD_SUSPECT_CLEARANCES` — enable both together so clearances live on the reveal chapter, not the aftermath.
- **Detection (deterministic, flag-gated cap):** `detectDuplicateReveal` — flags ≥2 late chapters that each fully re-state culprit + mechanism/test. New fact **`duplicateReveal`**, cap `pacing≤5, ending≤6, plot_structure≤6`. Same `RUBRIC_STRUCTURAL_CAPS_A68` gate.

---

## 4. Cleanup — the deterministic leakage source (corrects the A_67 polish mislayering)

The census proved the recurring "generated phrasing" drag is **self-inflicted**: `deterministic-repair.ts` injects fixed DT sentences *after* validation. Fixed at source (ACTIVE, unflagged):

- **Leakage templates rewritten** (`deterministic-repair.ts:406-413`) — *"The result proved one theory and ruled out the other because the evidence behaved in only one way when tested directly"* → in-scene observation tied to what the room watched, **keeping the DT-validity markers** the pre-commit gate needs (a `theory` word + a `result`/`ruled out` proof word).
- **Name-casing fixed** — a `titleCaseName` helper replaces the `replace(/^\w/…)` band-aid that produced *"Inspector harold wren"* (`:881` + the DT-patch path).
- **DT-leakage detector (SHADOW):** the DT-validation-phrase family added to `control-plane-leakage.ts` at `watch` confidence — catches LLM variants (incl. the *"ambiguity than of misdirection"* leak that has no deterministic source) for telemetry, not gating; promote to `contextual` after a corpus pass.

---

## 5. What's live now vs flag-gated vs deferred

| Change | Status | Flag |
|---|---|---|
| Mechanism false-time prompt rule (Agent 3 + 3b) | **ACTIVE** | — |
| `mechanismIncoherent` judge flag + cap | **ACTIVE** (citation-gated) | — |
| Leakage-template rewrite + name-casing | **ACTIVE** | — |
| DT-leakage detector | shadow (telemetry) | `watch` confidence |
| Temporal-contradiction + duplicate-reveal **detectors** | run always (telemetry) | — |
| Temporal + duplicate **caps** | flag-gated | `RUBRIC_STRUCTURAL_CAPS_A68` |
| Aftermath beat-independent fallback | flag-gated | `AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK` |

**Deferred (designed, not built):** the CML-mechanism physics *judge/regen* (`AGENT3_MECHANISM_PHYSICS_JUDGE`, a stronger enforcement than the prompt rule + rubric flag); locking the true/staged times as first-class locked facts to stop cross-chapter drift (the 10:15↔10:20 wobble — FIX B's detector catches the *impossible* reveal, not yet the *drift*). Both are their own increments.

## 6. Priced lift (external, from 72)

Per reader 4, not fully additive (shared plot/ending headroom): mechanism coherence **+3 to +5**, temporal **+2 to +4**, duplicate reveal **+2 to +3** → **low-80s**, matching the roadmap's 82–85 band. The prompt rule + mechanismIncoherent flag are the immediate movers; the flag-gated caps make the **internal** score track so the pipeline self-corrects instead of shipping the defect.

## 7. Probe plan

1. Rebuild + **restart** the server (Node caches modules at startup — run 1841 may predate the A_67 build; `probe-validity-process-start-vs-dist-build`).
2. Run a **matched clock premise** (same family as the 81) with `AGENT9_POLISH_RETRIED_CHAPTERS=1` — a fair test of the prose changes on the leakiest chapters.
3. A/B `RUBRIC_STRUCTURAL_CAPS_A68` and `AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK` (+ `AGENT9_FOLD_SUSPECT_CLEARANCES`) — confirm zero false-positive caps / no suppressed genuine reveal before default-on.

## 8. Prose audit — deterministic string → LLM rewrite (where machine prose ships)

> **⚠️ AMENDED TWICE — read this before acting on §8.1.**
>
> **A_70 §2 (2026-07-27) falsified the frequency claim.** *"76 → mid-80s on any run where a clearance
> floor fires **(common)**"* — the parenthesis is the whole argument, and it is wrong.
> `enforceSuspectEliminationPresence`'s exact template appears **0 times across 14 shipped stories**;
> the injector never fired on any of 4 pool runs; `detectReportStyleClearance` returns clean 14/14.
>
> **A_71 (2026-07-31) confirms the measurement and corrects the conclusion.** Re-measured on the four
> 07-31 stories: still **0 — now 0/18**. So A_70's number holds. But A_70 then concluded *"the
> injector is not its source, so an injector→regen swap cannot be the fix"*, and left "find the
> actual source of report-style clearance prose" as open work. **That source is now found, and it IS
> an injector — a different one.** The clearance prose both 07-31 external reviewers quoted comes
> from `buildDeterministicClearanceParagraph` / `applyDeterministicClearancePatch`
> (`packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`), not from
> `enforceSuspectEliminationPresence` (`apps/worker/.../agent9-run.ts`). Two injectors, two packages,
> one symptom — the `probe-validity-process-start-vs-dist-build` lesson again: *grep one module and
> you prove nothing.*
>
> **Consequence for §8.1's recommendation:** it is directionally right for the wrong reason.
> `AGENT9_REGEN_SUSPECT_ELIM` does more than swap the agent9-run injector — it also suppresses the
> generate.ts pre-retry clearance shortcut, which is a real path into shipped prose. But **two of the
> three `applyDeterministicClearancePatch` call sites are not gated by it at all**
> (`repairChapterDeterministically`, `applyDeterministicStagePatches`), so the flag alone cannot
> remove the class. A_71 added `deterministic_clearance_paste_count` at the shared choke point so the
> live probe finally has a read path; until it returns a number, nobody should quote a lift figure
> for this lever. See [ANALYSIS_71](../ANALYSIS_71/ANALYSIS_71.md) §3.

Follow-on 5-reader audit (`wlzyp77sh`) of every place a deterministic string reaches the final prose. **All five readers converged on one root cause:** the pipeline has a **complete, wired, validator-gated LLM scoped-regen layer** that dramatizes each obligation in-scene — but **every content-obligation regen ships default-OFF**, so the reader gets the machine template, and (worse) the *default-ON* scaffold regen then has to un-machine a sentence the pipeline itself just pasted.

**The single worst offender (named by 3 readers, = the A_67 "suspect-closure stack is one machine"):** `enforceSuspectEliminationPresence` (`agent9-run.ts:2325`) pastes *"`<Surname>` was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime"* **once per uncleared suspect** — N near-identical verdict sentences stacked into the endgame. One such sentence trips **two** prose caps at once (`scaffoldHits` B7 → prose≤4 **and** `reportStyleClearance` → prose≤6 + ending≤7); a second scaffold signature (the culprit-evidence B5 line) drops the overall ceiling to **≤65**. It runs *after* the scaffold regen, so nothing rewrites it. Reader 5's estimate: flipping its flag on clears two prose caps + the ending cap + removes the ≤65 ceiling → **76 → mid-80s on any run where a clearance floor fires (common).**

**Recommended, in priority order:**
1. **Promote the built LLM-regen flags OFF→ON (probe-gated, the biggest lift, ~zero new code):** `AGENT9_REGEN_SUSPECT_ELIM` (#1) + `AGENT9_REGEN_CULPRIT_EVIDENCE` + `AGENT9_REGEN_CLUE` + `AGENT9_REGEN_RESOLUTION` (+ `AGENT9_REGEN_DUAL_VALUE`). Each dramatizes the obligation in-scene, validator-gated, with the **deterministic injector as its rollback floor** — so the never-abort release gate is fully preserved. A_67 already queued "probe both flags on"; this is that probe.
2. **Widen polish coverage (SHIPPED, flagged):** `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` (default-OFF) runs the existing LLM polish on any accepted reveal/discriminating-test/suspect-pressure/clearance chapter **regardless of attempt** and **bypassing the provisional<95 gate** (the provisional score is blind to prose flatness, so it excludes exactly the clue-complete reveal chapters that leak most). Rollback-guarded.
3. **Strengthen the polish instruction (SHIPPED, unflagged):** added **SHOW-THE-DEDUCTION** ("X concluded that Y" / "Z was cleared by the alibi" → observation-plus-inference on the page) and a bounded **PERIOD DICTION LIFT** to `buildPostPassPolishPrompt`.
4. **Deferred (designed):** a **full-story cross-chapter polish** fed a repetition map (catches "in a remembered moment" recurrence + opening monotony a per-chapter pass can't see, `AGENT9_FULLSTORY_POLISH`); an **LLM weave** of the unguarded locked-fact value splice (`enforceLockedFactValuePresence`, the "a twenty minutes past ten" garble class); relaxing the insertion-only guard to a paragraph **WEAVE** so a clue emerges from the scene instead of a bolt-on paragraph.

**Guiding principle (owner's instinct, twice-confirmed):** prefer an LLM rewrite that keeps the content but reads as fiction over any deterministic string that reads as a machine — **with the deterministic string retained as the validate-then-rollback floor**, so quality rises without ever reintroducing abort risk.

## 9. Verification

Typecheck clean (rubric-score, prompts-llm, story-validation). Suites green: **rubric-score 84** (+8), **story-validation 423**, **prompts-llm 841**, **worker 358**. New tests pin: the sundial contradiction fires / the correct reveal doesn't; duplicate-reveal ≥2 vs reveal+aftermath; `mechanismIncoherent` cap; the aftermath signal fallback (on/off/negative/beats-present); the DT patch drops the leak phrases and title-cases the name.
