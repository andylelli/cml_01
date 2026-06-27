# ANALYSIS_51 — Outstanding issues, restated (post-triad register)

Status: **living register — supersedes [ANALYSIS_50](../ANALYSIS_50/ANALYSIS_50.md) as the single source of truth for what is still open.** A_50 remains the historical record of the §9 structural-pivot investigation and the triad fixes; **A_51 restates the outstanding work with everything learned through the triad validation run (`mystery-1782508634205`, 2026-06-26), reorders it around the two root causes that investigation exposed, and pairs each open item with a best-solution idea.**

> Lineage: A_48 (upstream-fitness thesis + T-backlog) → A_49 (code plans for the deferred Tier-1 levers) → A_50 (agent-keyed scoreboard + the §9 structural pivot) → **A_51 (this doc: the bottleneck has moved; restate accordingly).** Target unchanged: [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md).

---

## ⏱ Implementation order (do top-to-bottom)

Legend: `✅` landed · `☐` not started · `◐` built, acceptance-blocked. **Rule:** do the keystones (1–2) before reopening the category ladder (5); a "fix" is only *accepted* on a trustworthy signal (structural for K1, an honest rubric after K2).

| # | Fix | Status | Depends on → Unblocks | Accept when |
|:--:|---|:--:|---|---|
| 0a | Role-coherence repair (§9.1) | ✅ | — | *Done* — holds levers-on, no abort |
| 0b | Case-design triad #1/#2/#3 (§3) | ✅ | — → registers once #2 done | *Done in prose* — registers on rubric after #2 |
| **1** | **K1 — Enlarge cast + first-class named victim** (§1 K1) | ◐ 🔑 | none (start now) → fixes continuity / fair-play / motive | Victim named + related to culprit; `critical continuity` + fair-play warnings clear (structural, not rubric) — *code-complete + unit-tested (`a08be22d`); live-run confirmation pending* |
| **2** | **K2 — Final-story rubric honesty** (§1 K2) | ◐ 🔑 | none (parallel with 1) → **gates acceptance of 4 & 5** | Planted-vs-unplanted fixture scores correctly; internal↔external agree within single digits — *fixture half met + unit-tested (`6ee19960`); external calibration still a seam* |
| 3 | Premise diversity (rotate seed theme + structural cross-run divergence) (§2 #3) | ☐ | after 1 → `premise` can vary run-to-run | Two runs diverge on ≥2 structural fields (victim/mechanism/motive class); not the clone |
| 4 | **Re-open category ladder** (one flag/run): novelty → voice → reveal → plausibility → 2c-hold (§4) | ◐ | **needs 2 (honest judge) + 1 (coherent cast)** | Each: target category ↑ on the *honest* rubric, nothing regressed |
| 5 | Residual polish: reveal-gate→exact test chapter · pronoun sweep under role-swap · mutation re-validation full chain · scene-grounding for withheld chapters (§2 #4/#11/#12) | ☐ | after 4 | Each defect gone on a clean run |

**One-liner:** ✅ triad/repair done → **1 cast + 2 honest judge (parallel) → 3 premise diversity → 4 category ladder → 5 polish.** Stop flipping category levers until 1 and 2 land.

> **2026-06-27 update — both keystones landed code-complete (one live run still owed).** K1 (`a08be22d`) and K2 (`6ee19960`) are implemented, unit-tested, and committed; the previously-uncommitted A_50/A_51 §4 machinery + scorers + ROADMAP_TO_80 docs were banked first (`36e12e26`). All suites green (prompts-llm 511, story-validation 288, worker 217, rubric-score 42, prose-guard 21, web 174). **Neither keystone has been exercised on a live generation yet** — that single replay is the next action, and it is what flips 1 & 2 from ◐ to ✅ and lets the triad finally register. See §3.1.

---

## 0. TL;DR — the state of play (2026-06-27)

1. **The category-lever machinery is built and the case-design triad is landed + verified in prose — but the rubric will not move, for two reasons that are now proven, not hypothesised.** Three structurally-distinct levers-on runs (plain `59`, probe `63`, triad `63`) all land ~60 with near-identical judge flags.
2. **🔑 Root cause A — the final-story rubric judge (`gpt-4o-mini`) is noisy/templated.** The triad validation run *fixed* the prose (mechanism posed as a question early + explained at the test; the means-discriminator planted in Ch3) yet the judge re-issued *"the reveal uses evidence not planted earlier"* — **demonstrably false that run.** You cannot read lever success off this stick. This empirically confirms A_50 §8's governing principle: **make the measuring stick honest before reading anything off it.**
3. **🔑 Root cause B — the fixed 4-person cast is too small for a coherent fair-play mystery.** Victim + detective + culprit + ≥2 suspects = **five roles for four people**, so each run either draws the victim from the cast (→ the dead-victim-speaks aborts of §9) or leaves the victim an **unnamed phantom** (the triad run: "a woman, evening dress rumpled, one shoe missing", never named). That single deficit drives the persistent `critical continuity issue`, `fair-play 70/100`, and the hollow "passion/jealousy" motive.
4. **Everything else outstanding is downstream of those two.** The category levers (pacing/voice/reveal/plausibility/novelty/honest-scorers) are good machinery sitting flag-OFF; flipping them is **meaningless until the rubric is honest and the case core is coherent.** So the running order inverts again: **cast + rubric-honesty first, category levers last.**
5. **What's solid:** the run completes coherently (no abort — the §9.1 role-coherence repair holds even levers-on), structural integrity passes (boundary/pronoun/clue assertions clean), and the triad is correct, tested machinery. The problem is no longer "the run dies" or "the case contract is wrong" — it's "the cast can't host a fair mystery" and "the judge can't see quality."

---

## 1. The two keystones (highest leverage, do first)

### K1 — Cast/role deficit: the case has no real victim 🔑🔑
**Evidence.** Triad run `mystery-1782508634205`: cast = Eleanor Voss (detective), Dr. Mallory Finch (culprit), Captain Ivor Hale (cleared), Beatrice Quill (cleared). The murdered woman is never one of them — she is an unnamed body. The culprit's motive ("years of being dismissed, of watching *her* — so reckless") points at a victim with **no name, no profile, no relationship**. Prior runs that instead cast the victim *as* a cast member produced `deceased_character_confesses` aborts (§9). Same root both ways: **4 people cannot fill 5 fair-play roles.**

**Why it's the ceiling.** A fair-play mystery needs a victim the reader knows (so the motive lands), a detective, a culprit, and ≥2 viable suspects. With 4 people one role is always starved — usually the victim. No amount of pacing/voice/clue tuning fixes a case whose victim is a cipher; the `critical continuity` + `fair-play 70` warnings recur every run because of it.

**Best solution (cast Option A, elevated from A_50 §8 rank 13).**
1. **Enlarge the cast to ≥5 and make the victim a first-class, named, profiled character** distinct from detective/culprit/suspects. The canary inputs already carry commented-out names (`Sylvia Trent`, `Hugo Vane`, `Agnes Pike` in `scripts/canary-core-inputs.yaml`) — promote enough that `victim + detective + culprit + ≥2 suspects` are all distinct people.
2. **Add a `victim` role to the Agent 2 cast contract** with a concrete relationship to the culprit (the motive anchor) and ≥1 relationship to each suspect (the misdirection surface). The victim must be characterised (a paragraph, a voice) even though they die early — so the loss has weight and the motive is specific.
3. **Enforce a role-assignment invariant** (deterministic, repair-not-abort per MEMORY): `victim ∉ {detective, culprit, suspects}`, victim is named and profiled, culprit has a stated relationship to the victim. Wire as a warning→repair, never a hard throw.
- *Path A over Path B:* do NOT keep reassigning the canonical victim/culprit identity inside the existing 4-cast (the high-blast-radius churn that clues/herrings/Agent 6 all key off). Grow the cast instead.
- *Acceptance:* the shipped story names the victim, gives them a relationship to the culprit, and the `critical continuity` + fair-play warnings clear — independent of the rubric number.

### K2 — Final-story rubric honesty: the measuring stick is blind 🔑🔑
**Evidence.** Triad run: the prose demonstrably planted the means-discriminator in Ch3 and withheld the mechanism until Ch7–8, yet the `gpt-4o-mini` RubricScorer flagged *"clock explained too early"* and *"reveal uses evidence not planted earlier"* anyway, and scored `58` raw — statistically identical to the plain (`59`) and probe (`63`) runs. Combined with A_50 §8's external re-score gap (internal 72 vs ChatGPT 56), the final judge is both **over-scoring on leakage** and **issuing false structural flags** — it is not a usable acceptance signal.

**Why it's the ceiling.** Every lever's acceptance gate in A_50 §7/§8 reads a rubric category. If the judge can't see a real structural fix, no lever can ever be "accepted," and a regression can be scored as a win. The whole ladder is gated on this.

**Best solution (extend A_50 §8 Milestone A to the FINAL judge, not just per-agent scorers).**
1. **Deterministic structural caps/credits that override the LLM judge** for the things that *are* checkable: a planted-evidence verifier (does each piece of evidence the reveal names appear in an earlier chapter? — reuse `findUnplantedDiscriminatingClues` + a prose-level scan), a mechanism-timing check (first full mechanism explanation chapter vs the test chapter), a victim-named check. These produce hard facts that **correct or veto** the judge's corresponding flags.
2. **Require the judge to cite chapter+sentence evidence for every flag**, then **deterministically verify the citation**; drop flags whose cited evidence doesn't hold. This self-exposes the templated false-positives ("unplanted evidence" with no actual unplanted item).
3. **Upgrade the final-judge model.** `gpt-4o-mini` is the cheapest tier; the §8 over-score + the templated flags both point at capability. Move the final-story rubric to a stronger judge (and/or an ensemble), and **calibrate against a periodic external re-score** so internal↔external stay within single digits.
- *Acceptance:* on a story with a deliberately-planted vs deliberately-unplanted reveal, the rubric's "unplanted evidence" flag fires only on the unplanted one; internal overall lands within single digits of an external re-score of the same story.

> **Sequencing of the keystones:** K1 (cast) and K2 (rubric) are independent and can proceed in parallel. But **K2 gates acceptance of everything else**, and **K1 is the biggest single quality lever**. Do both before resuming any category-lever flip.

---

## 2. Master outstanding-issues table (restated, with best solutions)

Legend: `☐` open · `◐` partial/built-not-accepted · `☑` landed+tested · `🔑` keystone. "Outstanding" = anything that does not yet move a *trustworthy* rubric or fix a structural defect.

| # | Area | Outstanding issue (today's understanding) | Status | Best solution idea |
|---|---|---|:--:|---|
| 1 | **Cast (Agent 2)** | 4-person cast can't host victim+detective+culprit+≥2 suspects → phantom/unstable victim (K1) | ☐ 🔑 | Enlarge cast ≥5; first-class named `victim` role with culprit/suspect relationships; role-assignment invariant (repair-not-abort) |
| 2 | **Rubric judge (scoring)** | `gpt-4o-mini` final-story judge issues templated/false flags + over-scores leakage (K2) | ☐ 🔑 | Deterministic structural caps/credits that veto/confirm judge flags; require+verify cited evidence per flag; stronger judge model + external calibration |
| 3 | **Premise (Agent 8/3)** | Near-clone every run (novelty 0.66, "The Second Key" attractor); cross-run novelty alone insufficient to diverge the *premise* | ◐ | Rotate/perturb the seed theme per run (canary uses ONE fixed theme → inherent clone); make cross-run divergence target structural fields (victim, mechanism family, motive class), not just the similarity score |
| 4 | **Agent 9 ↔ judge** | Real structural fixes (triad) land in prose but don't register — partly K2, partly Agent 9 still leaks a little (Ch7 explains some mechanism one chapter before the Ch8 test) | ◐ | After K2: tighten the mechanism-reveal gate to the exact test chapter (currently `>= testScene`; Ch7 leaked); add a deterministic "reveal evidence ∈ earlier chapters" prose check |
| 5 | **Agent 3 motive (T2.9)** | Anti-trope motive: prompt landed, no validator; motive still resolves to generic "passion/jealousy/desperation", worsened by the phantom victim (no relationship to anchor it) | ◐ | Validator gate on banned-motive list + require the motive to reference the (now real, per K1) victim relationship; ≥2 herrings misdirect away |
| 6 | **Agent 5 exclusivity** | Direct-culprit slot still lets a blind reader pick a non-culprit; "direct evidence" too generic | ☐ | Require concrete trace/alibi-conflict grounding + non-culprit exclusivity in the strict slot (builds on the §9.3 #2 means-discriminator now planted) |
| 7 | **Agent 3b (T2.6)** | Device-complexity cap + depth-not-length scorer: prompt half only | ◐ | Replace the length scorer with `scoreDeviceDepth` (concrete claim/clues/locked-facts); flag-OFF + test |
| 8 | **Agent 1 (T3.1/T3.8)** | `atmosphere` generated then discarded (2c overrides); no season/time contract with 2c | ◐ | Pipe Agent-1 atmosphere into the Agent 9 prompt; add an Agent-1↔2c season/time contract (fails a mismatched fixture) |
| 9 | **Agent 4** | Revision non-convergence after fair-play escalation; prompt-contract drift across retries | ☐ | Watch on the next live run; compact + freeze the retry contract; bounded convergence with accept-best |
| 10 | **Honest scorers (non-scorer halves)** | `HONEST_SCORERS` enforce changes logged grades only; the *non-scorer* halves (atmosphere→9 pipe, 2e own-artifact, season contract) remain | ◐ | Land each non-scorer half behind its agent; gated on K2 (so the honest grade is read against an honest final rubric) |
| 11 | **Agent 9 stability (residual)** | Pronoun mis-gendering at the confession still occurs (triad run: Hale "she", Eleanor "he"); post-Agent9 mutation re-validation covers only grounding-lead | ◐ | Extend `AGENT9_MUTATION_REVALIDATION` across the full post-processing chain; harden the pronoun sweep against role-swap context |
| 12 | **Scene-grounding** | `scene-grounding coverage 6/10` recurs; the mechanism-reveal WITHHOLD may starve pre-test chapters of groundable content | ◐ | Pair the withhold-gate with a "ground in setting/character, not mechanism" instruction for pre-test chapters; re-measure coverage |

---

## 3. Landed this session (banked — do not re-litigate)

All on `redesign/agent-blue-sky`, build + unit tests green (story-validation 288, prompts-llm 507, worker 212), type-checks clean.

| Commit | What |
|---|---|
| `b81725c2` | **Role-coherence repair (A_50 §9.1).** Victim-alive → deterministic repair not abort (shared lifecycle regexes); clearance machinery never clears the culprit (`deterministic-repair` + `agent3-cml` + validator). Holds even levers-on (no abort in 2 levers-on runs). |
| `89402c64` | **Triad #1 — Agent 3b theme-lock.** Primary device must realize the locked theme; `selectThemeCoherentPrimary` reorder + regen guard. *Verified in prose:* clock device with coherent locked facts. |
| `ccc2585e` | **Triad #2 — plant the unique-means discriminator before the reveal.** Agent 3 rules 9h/9i; Agent 5 plants it; `findUnplantedDiscriminatingClues` detector (non-fatal warning). *Verified in prose:* Finch's clock expertise planted Ch3, used at reveal. |
| `7970092d` | **Triad #3 — mechanism-reveal gate.** `mechanism-reveal-gate.ts` withholds the full mechanism until the discriminating-test scene; extends `AGENT7_SCHEDULER_AUTHORITATIVE`. *Verified in prose:* mechanism posed as a question Ch1–3, explained Ch7–8. |

**Key lesson banked:** the triad was correct and improved the prose — and *that's how we proved the bottleneck is elsewhere* (K1/K2). The triad is not wasted; it removes real defects and will register once K2 makes the judge honest.

### 3.1 Landed 2026-06-27 — both keystones (code-complete) + a tree-hygiene correction

| Commit | What |
|---|---|
| `36e12e26` | **Tree-hygiene correction.** §4 claimed the "built-but-blocked" machinery was banked; it was actually sitting **uncommitted** in the working tree (honest/real scorers, agent6 reveal-gate, retry-gate-guard, agent3b plausibility judge, agent2b voice gate, agent2c distinctness, story-title helper, **and the ANALYSIS_47 ROADMAP_TO_80/90 docs**). Banked as a green checkpoint (source/tests/docs only; run-output artifacts excluded). The §4 list is now *actually* on the branch. |
| `6ee19960` | **K2 — rubric honesty.** Extended `packages/rubric-score`: deterministic structural verifiers (`structural-verifiers.ts`) that **veto/confirm** the LLM judge — planted-evidence (reuses `findUnplantedDiscriminatingClues`), mechanism-timing, victim-named; per-flag **cited-evidence verification** (flags with unverifiable chapter+sentence citations are dropped); `RUBRIC_JUDGE_MODEL` makes the final judge independently upgradeable; `calibration.ts` records the internal↔external delta. Shadow default + never-throw wrapper preserved. +14 unit tests incl. the planted-vs-unplanted fixture. |
| `a08be22d` | **K1 — first-class named victim.** Canary cast grown 4→6; first-class VICTIM contract in the Agent 2 prompt; `checkCast` victim reporting (warn-severity) + metrics; `enforceVictimRoleInvariant` in `agent2-run` — deterministic, **repair-not-abort**: resolves/locks the victim, excludes it from `possibleCulprits`, pins `victimCandidates`, and synthesises the motive-anchor edge, surfacing every repair on `ctx.warnings`. +9 unit tests. |

**Two caveats, recorded honestly.** (1) Neither keystone has been run through a live generation — the unit fixtures pass, but the *acceptance* gates ("warnings clear on a real run" for K1; "internal↔external within single digits" for K2) need one replay. (2) The first parallel K1 attempt was discarded: its isolated worktree was created from a ~46-commit-stale base and re-created files that already exist — K1 was re-implemented against the correct HEAD. Lesson: **verify a worktree's base commit before trusting its output.**

---

## 4. Built-but-blocked machinery (flag-OFF; acceptance gated on K2)

These are fully implemented from A_50 and sit flag-OFF. They are **not** the next work — flipping them against the current noisy judge cannot be accepted. Re-evaluate each only after K2 lands.

- **P1.1** `NOVELTY_CROSS_RUN` (premise) · **P1.3** `AGENT7_SCHEDULER_AUTHORITATIVE` (pacing; partially exercised by the triad runs) · **P1.4** `AGENT2B_VOICE_CHECK` (dialogue) · **P2.1** `AGENT6_REVEAL_GATE` (ending) · **P2.2** `AGENT3B_PLAUSIBILITY_JUDGE` (premise/plausibility — note A_50 §9.3 caveat: its regen is now theme-guarded by triad #1) · **P2.3** `AGENT2C_SCENE_GATE` (atmosphere) · **P3** `HONEST_SCORERS` (per-agent grade honesty).
- Retry-gate guard (`retry-gate-guard.ts`) still enforces ≤1 retry-bearing enforce gate per run unless `ALLOW_MULTIPLE_RETRY_GATES=1`.

---

## 5. Recommended sequence (decisive, supersedes A_50 §8)

The A_50 §8 order put rubric-honesty first, then the flag ladder. The triad investigation revealed the **cast deficit** as a co-equal keystone and **demoted the whole category ladder** below both. New order:

1. **K1 — Enlarge the cast / add a named victim** (§1 K1). Biggest single quality lever; fixes continuity + fair-play + motive at the root. Accept on *structural* signals (victim named + related to culprit; continuity/fair-play warnings clear), not the rubric.
2. **K2 — Make the final-story rubric honest** (§1 K2). Deterministic structural caps + cited-evidence verification + stronger judge. Accept when a planted-vs-unplanted fixture scores correctly and internal↔external agree within single digits.
3. **Premise diversity** (table #3) — rotate the canary seed theme + structural cross-run divergence, so "premise" can actually vary run-to-run.
4. **THEN re-open the category-lever ladder** (§4) against the now-honest rubric and the now-coherent cast — one flag per replay, accept on a moved (trustworthy) category: novelty → voice → reveal → plausibility → 2c-hold. The triad + P1.3 should finally register here.
5. **Residual polish** (table #4/#11/#12) — tighten the reveal gate to the exact test chapter, pronoun sweep under role-swap, mutation re-validation across the full chain, scene-grounding for withheld chapters.

**One-liner:** cast (real victim) → honest final judge → premise diversity → *then* the category ladder → polish. Stop flipping category levers until the stick is honest and the case has a victim.

---

## 6. Progress tracker (live)

`☐` not started · `◐` in progress · `☑` code+tests green · `✅` accepted on a (trustworthy) signal.

| Item | Status | Notes |
|---|:--:|---|
| K1 cast enlargement + named victim | ◐ | **Code-complete + unit-tested (`a08be22d`).** Cast 4→6; first-class victim contract; `enforceVictimRoleInvariant` (repair-not-abort). Awaiting a live run to confirm the shipped story names the victim + warnings clear. |
| K2 final-rubric honesty | ◐ | **Code-complete + unit-tested (`6ee19960`).** Structural verifiers veto/confirm judge flags; cited-evidence verification; `RUBRIC_JUDGE_MODEL`. Planted-vs-unplanted fixture passes; external calibration still a seam. |
| Premise diversity (rotate seed + structural divergence) | ☐ | Canary's single fixed theme guarantees a clone; product themes vary. |
| Triad #1/#2/#3 | ☑ | Landed + verified in prose (§3). Awaiting K2 to register on the rubric. |
| Role-coherence repair (§9.1) | ☑ | Holds levers-on (no abort across 2 runs). |
| Category ladder (P1.1/P1.3/P1.4/P2.1/P2.2/P2.3/P3) | ◐ | Built, flag-OFF. Blocked on K2 for acceptance. |
| Reveal-gate exact-chapter tightening | ☐ | Ch7 leaked some mechanism one chapter before the Ch8 test. |
| Pronoun sweep under role-swap | ☐ | Triad run mis-gendered Hale/Eleanor at the confession. |

---

### Appendix — the three reference runs (all `gpt-4o-mini` final judge, same fixed 4-cast + clock theme)

| Run | Config | Final rubric | Outcome | What it proved |
|---|---|:--:|---|---|
| `mystery-1782494487500` | plain (no levers) | 59 | release-gate fail | role-coherence repair lets it complete; ~60 baseline |
| `mystery-1782504792424` | all levers enforced | 63 | release-gate fail | levers engage but don't move the score → structural ceiling |
| `mystery-1782508634205` | all levers + triad | 63 (58 raw) | release-gate fail | triad fixes the prose but the judge can't see it → K2; victim is a phantom → K1 |

Baseline for reference: `run_9b824eb2` (Tier-1 only, older judge) = 71 LLM / 68 shadow. Target: [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md) ≥80.
