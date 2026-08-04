# Architecture Review 04 — the geometry work, and the four defects it uncovered

**Written:** 2026-08-04 · **Type:** a position statement, like [REVIEW_03](REVIEW_03.md). It records where things stand after the Story Geometry line of work, because that work touched eleven packages and produced more findings outside itself than inside.

**Companion documents:** [THINK_01](THINK_01.md) argued the gap · [STORY-GEOMETRY](STORY-GEOMETRY.md) defines the concept · [GEOMETRY-AGENT-DESIGN](GEOMETRY-AGENT-DESIGN.md) is the design and carries the build record in §10.1–§10.4 · [FLAG-AUDIT](FLAG-AUDIT.md) Addendum 7 registers the flags.

**Method marking, unchanged across four boards:** **MEASURED** · **INFERRED** · **UNVERIFIABLE**.

---

## 0. The position, in one paragraph

> Agent 7.5 is **built, wired, run once, and changing nothing by default** — phases 1–3 of its own build sequence, with every behaviour-altering half flag-gated OFF. That is the smaller half of what happened. The larger half is that building a checker which reads the finished manuscript, and then backtesting it against manuscripts we already had, **surfaced four defects that predate it and outrank it** — a culprit chosen by array position who was also the falsely accused suspect; a case whose false-time deception was backwards in both directions with nothing checking; a warning channel that silently discarded everything Agent 9 has ever said; and, on the first live run, the discovery that **the pipeline carries two contradictory time models**. None of those are geometry defects. Geometry is only how they were found. **The story has not improved and no probe has run** — every quality lever remains OFF, exactly as on 2026-08-03.

---

## 1. If you read one section, read this one

| Thing | State | Where |
|---|---|---|
| **Agent 7.5 / `@cml/story-geometry`** | Built. Runs in `shadow` by default: derives the contract, reports, changes nothing | §2 |
| **Its acceptance test in Agent 9** | Built. Runs in `shadow` by default: re-checks the manuscript, records every check | §2 |
| **Everything that changes behaviour** | Flag-gated, default OFF: prompt binding, outline repair, the repair ladder | §3 |
| **Four defects found, three fixed** | Culprit integrity ✅ · timeline invariant ✅ · warning channel ✅ · two time models ⚠️ reported, not repaired | §4 |
| **Phase 2 (prompt binding)** | **BLOCKED** — see §5. Enabling it today would make stories worse | §5 |
| **Has any of this improved a story?** | **No, and nothing claims it has.** No probe has run | §6 |

---

## 2. What was built

**`@cml/story-geometry`** — a new pure package (no runtime deps, no LLM, no I/O). It derives a machine-checkable contract for the finished manuscript from the frozen CML plus the Agent-7 outline, checks whether the outline can satisfy it, and re-checks it against the committed text.

```
StoryGeometry {
  timeModel        { trueTime, apparentTime }         // the manuscript may contain no third time
  clincher         { trace, uniqueToCulprit, plantByChapter, payoffChapter, sourceCriticality }
  methodSignature  { method, plantChapter: 1, keyTerms }
  chapterContract  [ { chapter, role, mustContain, mustNotContain } ]
  falseSolution    { accused ≠ culprit, proposedChapter, collapseChapter }
  clearanceBudget  { maxSentences, inScene }
  closure          { closed, unmet, waived, notes }
}
```

**`runAgent75`** sits between the outline and prose, persists the contract as an artifact, restores it on resume, and publishes it to the report. It never throws into the run.

**Four prompt blocks and an acceptance test** in Agent 9 — the contract as input before a chapter, the same object as a test after the manuscript. Plus `runAftermathRepeatRegenPass`, the thirteenth regen pass and the first that expresses a *negative* obligation, because nothing in the registry could say "must not contain".

**One long-dark module wired.** `checkCaseTimelineDeception` was written in response to an external review calling a timeline "backwards", exported from its package, and called by nothing for two months. It is now called — and, going further than the design asked, moved into `@cml/cml` so `validateCml` enforces it pre-prose.

---

## 3. Flag state — what a run does today

```
AGENT75_GEOMETRY              = shadow   derive + close + report.  No LLM call, no behaviour change.
AGENT75_GEOMETRY_RESOLVE      = off      the one LLM call is not made
AGENT9_GEOMETRY_CONTRACT      = off      the prose prompt is byte-identical to before
AGENT9_GEOMETRY_ACCEPTANCE    = shadow   re-check the manuscript, record every check.  Free.
AGENT9_REGEN_AFTERMATH_REPEAT = off      no repair attempted
```

No configuration file sets any of them; those are code defaults. Two read-only halves default to `shadow` rather than `off` deliberately: both are deterministic and free, and §1 of the design says the failure mode to design against is *"checkers get built and never wired"* — a checker shipping `off` is that failure with a flag on it.

**Flag-off is confirmed on the wire, not by reading code.** Across all 42 prompt records of the 08-04 run: zero occurrences of any geometry block marker. **MEASURED.**

`flags:check` reports no unregistered flags and no configured-but-unread flags. Preflight refuses the three combinations that would silently execute the control arm while reporting as the treatment.

---

## 4. The four defects — none of them geometry's

### 4.1 The culprit was chosen by array position, and it was the falsely accused suspect ✅ FIXED

Run `20260802-1654` (external **80/100**). Agent 3 returned `culpability: { culprit_count: 1, culprits: [] }` — the model never decided who did it. `normalizeCml`'s silent fallback took the first culprit-eligible cast member: **Captain Ivor Hale, who is also `false_solution.accused_suspect`**. Confirmed downstream — by Agent 6 the clue ids read `culprit_direct_captain_ivor_hale`. The external reviewer's complaint on that story was, verbatim: *"Chapter 6 accuses Hale, but Hale is guilty."*

`agent3-cml.ts` has instructed *"The accused_suspect MUST NOT be the real culprit"* for months. Nothing checked it, and the fallback that violated it logged nothing — so on the report a fabricated answer was indistinguishable from a decided one.

**Fixed:** `validateCml` now rejects an empty culprit list, and a culprit who is the accused / the victim / the detective / cast-ineligible / absent from the cast, as validation **errors** — so Agent 4's revision loop repairs them pre-prose. The fallback now prefers a cast member the model actually marked guilty, excludes the falsely accused, and records what it invented in `normalizationNotes`.

*Two test fixtures named the detective as the culprit and had never been valid. Fixed.*

### 4.2 The false-time deception was backwards in both directions ✅ FIXED

Run `20260802-1818` (external **68/100**): apparent 8:50, actual 8:15, culprit's alibi window 8:10–8:30 — which *contains* the real time of death (so he could not have done it) and *excludes* the staged one (so faking it does not protect him). `checkTimelineDeception` returns both violations and had never been called.

**Fixed:** the module moved to `@cml/cml` (a leaf cannot import upward, so the body had to move rather than be called across the edge; `@cml/prompts-llm/timeline-deception.ts` is now a re-export, not a second copy), and `validateCml` enforces it. Conservative by construction: absent or unparseable times yield nothing, so a case that does not fake a time is never blocked.

### 4.3 Everything Agent 9 has ever said was discarded ✅ FIXED

`agent6-run.ts` cleared its transient warnings with `ctx.warnings = ctx.warnings.filter(...)`. **`filter` returns a new array**, and that call is unconditional at the end of every Agent 6 — so every run severed `ctx.warnings` from the orchestrator's array. Everything pushed afterwards went nowhere: Agent 7, Agent 7.5, and all 108 push sites in Agent 9.

The 08-04 run logged *"Release gate warning: scene-grounding coverage below target"* to the console and recorded it on no artifact. Every archived report shows zero `[Agent 9]` warnings — not because Agent 9 is quiet. The clearing never worked either: the report's array still held every line it meant to remove.

`mystery-orchestrator.ts` asserts the opposite in a comment — *"Everything Agent 9 pushes to ctx.warnings aliases this array, so this captures the whole run"* — sitting inside the A_64 §2 F5 fix for exactly this blindness. **A comment is not a check.** There is now a property test that scans every agent for the reassignment, verified against the original line.

### 4.4 The pipeline has two time models ⚠️ REPORTED, NOT REPAIRED

Found on the first live geometry run, 08-04:

| | apparent | true |
|---|---|---|
| `hidden_model.mechanism` — read by geometry, `timeline-deception`, the rubric | "quarter past eight" | "quarter past seven" |
| **appearances in the shipped manuscript** | **0** | **0** |
| locked-fact registry — injected into the prose | "a quarter to four" (5×) | "ten minutes past four" (6×) |

Agent 3b designs the device, locks its times, and injects them into prose. Agent 3 authors the mechanism's times and **its prompt never receives the device's**. Nothing reconciles them.

**B1 SHIPPED 2026-08-04, flag-gated OFF** — `AGENT3_DEVICE_TIME_BINDING` passes the device's locked
facts into the CML prompt and requires `apparent_time_of_death` to equal the locked displayed time,
with the true time and every alibi window on the same clock. Default OFF because it changes a prompt.
Self-gating twice over: with no locked facts, or with `enableLockedFactRegistry` off, the prompt is
byte-identical (asserted by test). **§5 stays true until the probe runs and the flag flips.**

`checkLockedFactTimeAlignment` reports the split on every run regardless. It deliberately does not repair: `false_time_displayed` ↔ `apparent_time_of_death` is unambiguous, but `resumption_time` is when the mechanism restarted — not when anyone died — and writing `actual_time_of_death` from it would fabricate the coherence claim the case failed to make. **The root fix is upstream: give Agent 3 the device's locked times.** That is a prompt change, so it is a flag and a probe, and it is the owner's call.

---

## 5. Why phase 2 is blocked

Enabling `AGENT9_GEOMETRY_CONTRACT` today would put the mechanism's two times into every chapter prompt as a hard contract, while the locked-fact layer injects two *different* times into the same prompt. Two mandatory blocks contradicting each other, on every chapter.

**That is not a delay, it is a dependency that could not be seen before the run.** §4.4 must be resolved first — and resolving it is worth doing on its own merits, since the case model and the manuscript currently disagree about when the murder happened.

---

## 6. Built vs proven — the honest ledger

| Claim | Status |
|---|---|
| The stage executes on a live run | ✅ **MEASURED** — 08-04, both halves, story shipped, exit 0 |
| Its diagnostics reach the artifact | ✅ **MEASURED** — 11 checks, 8 satisfied, extra times located |
| Flag-off changes no prompt | ✅ **MEASURED** — 0 markers in 42 prompt records |
| It flags the three defects the design named | ✅ **MEASURED** — offline backtest against both 08-02 manuscripts |
| It does not become a new abort class | ✅ **MEASURED** — one run |
| **It improves first-pass chapter success** | ❌ **UNVERIFIED** — the probe is blocked by §5 |
| **It improves any story** | ❌ **UNVERIFIED** — nothing claims it does |
| **Its violations rank a good story above a bad one** | ❌ **NO** — 6 violations on the 68, 6 on the 80. It is a checklist, not a judge |

The one quantitative separator between the two 08-02 stories is extra clock times: **2 on the 80, 5 on the 68**. Everything else fires on both.

---

## 7. Defects in the geometry code itself

Six, all found before any of it was probed — four by adversarial self-review, two forced by the corpus. Three of the four were **silent**: they produced confident wrong output rather than failing. Full detail in [GEOMETRY-AGENT-DESIGN §10.3](GEOMETRY-AGENT-DESIGN.md) and §10.4.

1. **The reveal contract could vanish** when the false-solution beat landed on the reveal chapter — the most important obligation in the object, dropped because of the order two lines were written in.
2. **Chapter lookup was positional.** Reordering a compliant manuscript produced six fabricated violations. In `apply` mode it would have regenerated clean chapters.
3. **The clincher trace could be authored prose** — a resolve naming an unknown clue plus a sentence put the reviewer's own suggested sentence into the prompt as the clincher. §3 breached through the back door.
4. **A repair claimed a fix it had not made**, so the closure re-check read as a pass.
5. **`clearance_over_budget` had the test backwards** — it required an evidence connector in the same sentence, so *"You are cleared." / "You are ruled out."* scored zero. It was filtering out the most mechanical clearances.
6. **The clincher rests on an `optional` clue** on every run measured. Now a `closure.notes` entry: it does not block closure, and it is no longer silent.

**The pattern worth carrying forward:** defects 2 and 5 are the same class as the near-miss in §10.2 — *a conjunction is only evidence at the granularity a reader reads it, and an index is only a chapter if something guarantees the ordering.* Every one was invisible against tidy unit fixtures and obvious against real data.

---

## 8. One more thing that affects every future probe

**"The last Agent-7 response is the outline that shipped" is false.** Run 1654 produced three outlines and the manuscript matches the **first**; run 1818 produced two and matches the **second**. `.actual-run-state.json` records sequence, agent, retry number and file names — **no validation status, no success flag, nothing saying which candidate was committed.** The correct attempt is not merely un-chosen; it is unrecoverable from that substrate.

`readLatestAgentJson` (two bodies: `canary-agent-boundary.mjs`, `canary-agent3.mjs`) takes the highest sequence for every agent code. **10 of 11 recorded runs** have at least one multi-attempt agent — Agent 7 in 8, Agent 2 in 5, Agent 3 in 3. Hydrating the wrong Agent-7 attempt hands a replay a different **chapter count**, which is one of the two variables that dominate any single-run comparison and precisely what matched-pair A/B exists to hold fixed.

Interim: both call sites now emit `HYDRATION_AMBIGUOUS`, so the guess is on the record rather than inside it. **The real fix is to hydrate from the committed `onArtifact` store** that production resume already reads — the open scope note in `resume-hydration.ts` — and it should land before any probe whose conclusion depends on matched upstream.

---

## 9. What to do next, in order

1. **Fix the two time models at source** (§4.4). Give Agent 3 the device's locked times. Unblocks phase 2 and fixes a real incoherence.
2. **Unify resume hydration** (§8), so probes are not measured through a harness that may swap the outline underneath them.
3. **Promote `beat-scheduler`**, ≥4 runs — §8bis's discriminating test between "geometry is the fix" and "the scheduler was". May deliver much of geometry's benefit on its own, in which case geometry's remaining scope is craft-ceiling rather than variance-elimination and **should be re-justified before phase 2 is paid for**.
4. **Then** the phase-2 and phase-3 probes; then phase 4's deletions, gated on firing rates reaching zero.

Still true and still gating separately: the internal judge ranks at 42.9%. None of the above routes through it — deliberately — but anything phrased as *"did quality improve"* still does.

---

## 10. Verification log

Every number here re-measured on 2026-08-04.

| Check | Result |
|---|---|
| `node scripts/build-all.mjs` | 16 packages, clean |
| `@cml/story-geometry` | 49/49 |
| `@cml/cml` | 33/33 (package had no test runner before this work) |
| `@cml/worker` | 452/452 |
| `@cml/prompts-llm` | 1002/1002, 1 skipped |
| `@cml/story-validation` | 430/430 |
| `node scripts/flag-register-check.mjs` | clean — no unregistered, no configured-but-unread |
| `node scripts/geometry-backtest.mjs` | PASS on all three §10 criterion defects |
| Live run `mystery-1785860662362` | shipped, exit 0, release gate `warning`, rubric shadow 75 |

**Working tree: 56 files changed, uncommitted.** 13 new (the package, the stage, four test files, the backtest script, three architecture documents); 41 modified; 2 moved.

---

## 11. The plan — everything outstanding, in dependency order

**The shape of it.** Four things must happen before any money is usefully spent: measure the risk this session's validators introduced, commit the tree, fix the two time models at source, and make replay hydration honest. Only then do the paid probes mean anything — and one of them (D1) may reduce the value of everything geometry does, which is why it comes *before* the geometry probes rather than after.

Each item states **what**, **why now**, **cost**, and **how you would know it worked**. Items marked **[decision]** are the owner's judgement, not mechanical work.

---

### 11.1 Phase A — before the next run. Offline, free.

**A1. Measure what the new validators would do to the corpus.** *Highest priority in this document.*

This session made `validateCml` materially stricter — empty culprits, accused == culprit, culprit-is-victim/detective/ineligible, count mismatch, and both false-time direction violations are now **errors**. Those errors drive Agent 4's revision loop. **None of them has ever run live.**

The abort risk is lower than it first looks: `AGENT4_GRACEFUL_DEGRADE=true` is set in `.env.local` and defaults ON, so an unresolved error degrades to a warning and the run proceeds. But two real costs remain, and one latent hazard:

- **Agent 4 churn.** Every newly-failing case now triggers revision cycles that cost money and rewrite the CML. Run 1818's timeline violated the invariant in *both* directions, so that case would now fail validation where it previously passed.
- **Noise instead of a gate.** If revision cannot fix them, the run ships the same defect with extra warnings attached.
- **Latent:** if anyone sets `AGENT4_GRACEFUL_DEGRADE=false`, these validators become a new abort class.

*Do:* run `validateCml` over every archived CML in `documentation/prompts/actual/*/` and count which of the new error codes fire, and how often. Free, decisive, ~30 minutes.

*Know it worked:* a firing rate per error code across 11 runs. **If the timeline invariant fires on most cases it should be demoted to a warning until B lands** — because it is currently judging anchors the manuscript does not use (§4.4).

**A2. Commit the tree.** 56 files, uncommitted, spanning a new package and fixes across five others. Suggested slices, each independently revertible:

1. `@cml/story-geometry` + Agent 7.5 + orchestrator wiring (the stage)
2. Agent 9 prompt blocks + acceptance test + the `aftermath_repeat` pass
3. `validateCml` culprit integrity + the Agent 3 fallback fix + the two bad fixtures
4. `timeline-deception` moved into `@cml/cml` + the invariant
5. The warning-channel fix + property test + the hydration-ambiguity warning
6. Architecture documents

*Why now:* five packages of interlocking changes in a dirty tree is one bad `git checkout` away from gone.

**A3. Collapse the two `readLatestAgentJson` bodies.** `canary-agent-boundary.mjs` and `canary-agent3.mjs` carry the same function, and C1 is about to change it. Fixing one and not the other is precisely the two-bodies trap S3 exists to prevent. Do it before touching either. ~20 minutes.

---

### 11.2 Phase B — the two time models. The one substantive source fix.

**B1. Give Agent 3 the device's locked times. [decision]**

`buildCMLPrompt` receives the device's mechanism *family* and never its locked facts, so Agent 3 authors `apparent_time_of_death` blind to the time the prose will actually print. Pass `ctx.lockedFactRegistry` into `CMLPromptInputs`, and state that `apparent_time_of_death` **is** `false_time_displayed` and that `actual_time_of_death` must be consistent with the device's timeline.

*Cost:* a prompt change, therefore flag-gated and default-OFF under the corpus regime — call it `AGENT3_DEVICE_TIME_BINDING`. One matched pair to probe, ~£3.

*Know it worked:* `checkLockedFactTimeAlignment` findings drop to zero, and the case's two anchors start appearing in the manuscript at all.

**B2. The floor, if B1 does not take.** Deterministically set `apparent_time_of_death` from `false_time_displayed` after generation — the one unambiguous mapping — and keep reporting the `actual_time_of_death` residual rather than inventing it.

**Recommendation:** B1, with B2 as the fallback rather than the first move. B1 fixes the cause; B2 patches one symptom and leaves the true time still bound to nothing the prose must print. **Neither may be skipped — §5 blocks phase 2 until one lands.**

---

### 11.3 Phase C — make measurement trustworthy.

**C1. Hydrate replays from the committed artifacts, not the prompt log.** The `onArtifact` store that production resume already reads records what actually shipped; the prompt log records every attempt and marks none of them. This is the open scope note in `resume-hydration.ts`, and §8 is the bill for leaving it open.

*Cost:* about a day, offline.

*Know it worked:* replaying run 1654 hydrates the **10-beat** outline (attempt 18), not the 9-scene one (attempt 20). That single assertion is the whole test.

**C2. If C1 is deferred, at least record the truth going forward.** Mark the committed candidate in `.actual-run-state.json`. It does not recover the existing corpus — those eleven runs stay permanently ambiguous — but it stops the corpus growing more of them.

---

### 11.4 Phase D — the paid probes, in dependency order.

**D1. Promote `beat-scheduler`, ≥4 runs. [decision] — before the geometry probes, not after.**

`AGENT7_SCHEDULER_AUTHORITATIVE=1`, count endgame failures. **~£6.**

This is §8bis's discriminating test between *"geometry is the fix"* and *"the scheduler was"*. It goes first because of what it might prove: **if promoting the scheduler removes the completion failures, geometry's remaining scope is the craft ceiling rather than variance elimination — a smaller and less urgent brief — and phases 2–4 should be re-justified before they are paid for.** Running the geometry probes first would credit geometry with gains the scheduler produced.

*Blocked by:* A1, C1. A probe read through a harness that may swap the outline underneath it is not evidence.

**D2. Re-justify geometry against D1's result. [decision]** Not a task — a decision point. State plainly whether phases 2–4 are still worth their cost, and record the answer.

**D3. Phase 2 — `AGENT9_GEOMETRY_CONTRACT`, one matched pair. ~£3.** Read first-pass chapter success against the 64%/71% baseline, plus generation-side cost. **Blocked on B.** If it does not move, the thesis is wrong and the stage should stop at shadow — that is the design's own exit condition and it should be honoured rather than argued with.

**D4. Phase 3 — `AGENT9_GEOMETRY_ACCEPTANCE=apply` + `AGENT9_REGEN_AFTERMATH_REPEAT`. ~£3.** Read violation rate at ship and regen volume. Best run over `AGENT9_REGEN_EDIT_LIST`, whose safety argument is exactly this pass's argument. **Blocked on D3** — repairing against a contract nothing has shown to be useful is spending twice.

**D5. Phase 4 — retire the superseded band-aids.** `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence`. **Each gated on its own firing rate reaching zero across ≥4 runs.** Deleting before that measurement exists is the unmeasured change this whole line of work argues against.

---

### 11.5 Phase E — the smaller open items.

| Item | Do what | When |
|---|---|---|
| Clincher rests on an `optional` clue | Add a clincher slot type to `clue-spec` — §5's missing slot. Removes the `closure.notes` entry by construction rather than by warning | When `clue-spec` leaves shadow |
| `.env` / `.env.local` duplicate keys | Delete the `.env` copies of `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_DEPLOYMENT_NAME`. `flags:check` has reported them for two sessions | Any time, 2 minutes |
| Canary `mechanical_term_collision_count == 13` | Pre-existing assertion failure, unrelated to this work. Fix the collisions or re-baseline the assertion — but stop shipping runs that report `CANARY_STATUS failure` for a known reason, because that trains people to ignore the status line | Before D1, so probe runs have a clean signal |
| `geometry_feedback` prompt block | Stays unbuilt. It acquires a producer only if the chapter-level acceptance test moves inside the retry loop, which §8.9 forbids for good reason | Not planned |
| The warning-channel fix | Shipped but never exercised live. It rides the next run for free — check for `[Agent 9]` lines in the report | D1 |

---

### 11.6 What this plan does not fix

**The judge still ranks at 42.9%.** Nothing above routes through it — deliberately: every probe here reads first-pass success, firing rates, violation counts or endgame failures, none of which need the judge. But the moment anyone asks *"is the story better?"*, [THINK_01](THINK_01.md) Move 1 is the blocker, and none of this touches it. **That remains the largest unaddressed item in the architecture.** It is absent from this plan because it is not geometry's to fix, not because it is unimportant.

**The existing corpus stays ambiguous.** C1 fixes hydration going forward; it cannot recover which Agent-7 attempt shipped in the eleven runs already recorded.

---

### 11.7 The plan in one table

| # | Item | Cost | Blocks | Blocked by |
|---|---|---|---|---|
| A1 | Measure the new validators against the corpus | free | D1 | ✅ **done** — 17% reach Agent 4, all timeline; no demotion needed |
| A2 | Commit the tree | free | — | ✅ **done** — five commits |
| A3 | One `readLatestAgentJson`, not two | free | C1 | ✅ **done** — plus the Agent-75 canary mapping it exposed |
| B1 | Give Agent 3 the device's locked times — **built 2026-08-04, flag OFF; the ~£3 is the probe** | ~£3 | D3 | A1 ✅ |
| C1 | Hydrate from committed artifacts | free | D1, D3, D4 | A3 |
| D1 | Promote `beat-scheduler`, ≥4 runs **[decision]** | ~£6 | D2 | A1, C1 |
| D2 | Re-justify geometry **[decision]** | free | D3 | D1 |
| D3 | Phase 2 probe | ~£3 | D4 | B, C1, D2 |
| D4 | Phase 3 probe | ~£3 | D5 | D3 |
| D5 | Retire the band-aids | free | — | D4 + firing rates at zero |

**Total paid: ~£15 — and the first £6 of it may make the remaining £9 unnecessary.** Everything before D1 is free.
