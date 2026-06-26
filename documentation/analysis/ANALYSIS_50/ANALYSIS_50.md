# ANALYSIS_50 — Outstanding issues by agent (consolidated register)

Status: **living register — the single place that tracks every still-open per-agent defect across the pipeline.** Sibling of [ANALYSIS_48](../ANALYSIS_48/ANALYSIS_48.md) (the upstream-fitness thesis + the T1/T2/T3 backlog), [ANALYSIS_49](../ANALYSIS_49/ANALYSIS_49.md) (code-grounded plans for the four deferred Tier-1 items), and the [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md). Where A_48 is "what's wrong and why" and A_49 is "how to land the four deferred levers," **A_50 is the agent-keyed scoreboard: for each agent, what is still open, what landed, and what to do next.**

> Naming: follows the established `ANALYSIS_nn` convention (prior doc is ANALYSIS_49). "A_50" = this file. Pull-through source of truth for status is A_48 §8 (implementation log) and A_49 §1 (novelty live status); this doc consolidates them by **agent** rather than by tier.

---

## Legend

`☐` open / not started · `◐` in progress / partial · `☑` implemented (build + unit tests green) · `⊘` deferred (planned, gated on a live run) · `✓` verified-in-code · `🔑` keystone / highest leverage.

"Outstanding" = anything not `☑` **and flipped on**. A landed-but-flag-OFF item is still outstanding (it does not yet move the rubric).

---

## 0. TL;DR — the state of play

1. **The keystone landed.** Agent 3's required physical `death_method` (T1.1) — the single defect that tanked `run_0a53fb34` to rubric 68 — is shipped and unit-tested. So is the season-lock validator fix that was driving 10-chapter churn. These are the two "stop the bleeding" wins.
2. **Most of the remaining work is *flipping on* code that already exists, not inventing it.** The cross-run novelty store, the authoritative beat scheduler, the VoiceCapsule gate, and the real cast scorer are all built and sitting in shadow/flag-OFF. Outstanding ≠ unwritten.
3. **The biggest still-open clusters are Agent 7 (pacing), Agent 6 (predictable reveal), Agent 5 (clue restructure), and the Tier-3 "vanity scorer" rewrites** that let every upstream agent report 100/A on the wrong test.
4. **The clean corrected-build baseline run is now done** (`run_9b824eb2`, 2026-06-24 — see §0.5). It completed cleanly (10/10 chapters, 11,718 words, no churn, no abort) at **rubric 71 LLM / 68 shadow**, and the death-method + pronoun + season-lock landings **held** — every structural judge-flag passed and no A_43/A_47-class killer recurred. The LLM-judged loss is now concentrated in the *known* open levers: `pacing 6` + `opening_hook 6` (Agent 7 repetition) and `premise 7` (Agent 8 novelty, which was *skipped* this run). The deferred flags can now be flipped one at a time against this honest baseline.
5. **Runtime/operational issues are tracked separately in §3** (release-gate-vs-post-mutation, retry parity, report invariants, Agent 9 run-killers) — these are pipeline-control defects, not artifact-fitness defects.

---

## 0.5 Latest live-run baseline — `run_9b824eb2` (2026-06-24 21:56 UTC)

**This is the clean corrected-build run §0 point 4 was waiting for.** It completed end-to-end — 10/10 chapters, 11,718 words, `status: complete`, no abort, no churn loop — on the post-Tier-1 build. It is now the honest baseline.

**Rubric: `71/100` (LLM judge, `gpt-4.1-mini`) · `68/100` (deterministic shadow — "promising but rough").**

| Category | Mark | Driver (verbatim from the judge) |
|---|:--:|---|
| atmosphere | **8** | "moody, claustrophobic… coal smoke, damp wool, flickering firelight" |
| clues | **8** | "well planted and revisited… fair-play… the mechanical demonstration is a strong, fair clue" |
| ending | **8** | "satisfying resolution… culprit identified, motive explained… no loose threads" |
| premise | 7 | "solid, classic Golden Age, **but conventional and lacks a more novel hook**" |
| plot_structure | 7 | "logical… **but repetitive in revisiting the same contradictions**" |
| character_clarity | 7 | "clearly distinguished by roles, mannerisms, alibis" |
| dialogue | 7 | "formal and fitting… some lines a bit on-the-nose" |
| prose | 7 | "polished, evocative… **occasional awkward repetitions ('the the') and verbosity**" |
| opening_hook | **6** | "**slow and repetitive** (repeated mentions of the hour and soot)… may lose reader early" |
| pacing | **6** | "**uneven… repeating the same contradictions multiple times**… slows momentum" |

**What the run proves:**

- ✅ **The Tier-1 keystone held in prose.** The judge's structural flags all pass — *"victim clearly named and consistently dead," "reveal explains murder, not just cover-up," "culprit clearly distinct from victim," "pronouns stable," "no multiple role changes."* The death-method (T1.1) + pronoun-policy + season-lock landings collapsed the A_43/A_47-class run-killers — **none recurred.** No 10-chapter churn; the LLM-judged loss is now concentrated in the *known* open levers, not in structural integrity.
- 🎯 **The two lowest marks are exactly the open Agent 7 levers.** `pacing 6` + `opening_hook 6` trace to **mechanical repetition, not length.** Concrete proof in Ch1: *"The hour stood at eleven o'clock. The hour stood at twenty-five minutes past eleven. The hour stood at eleven o'clock. The hour stood at twenty-five minutes past eleven."* — the same timeline contradiction restated four times verbatim, then re-restated across later chapters. **Correction to A_48's weighting:** chapters this run were **~1,000–1,460 words (not 1,800)**, so the pacing loss is driven by **T1.2 (one-job-per-chapter scheduler) + T2.11 (one-insight/one-clearance)**, *not* primarily by **T1.3 (word budget)**. Flip the scheduler authority before assuming length is the driver.
- 🎯 **`premise 7` with novelty *skipped*.** The run log shows *"Novelty check skipped (threshold ≥ 1.0)"* — `NOVELTY_CROSS_RUN` was OFF and `similarity_threshold_default` still 1.1, so Agent 8 never fired. Confirms **T1.7 / T1.6 remain the only lever on the frozen premise.**
- ⚠️ **Agent 5 red-herring overlap fired and was auto-sanitized.** `rh_1` / `rh_2` were detected as "may accidentally support the true solution" and deterministically sanitized/regenerated for separation — the mitigation worked, but it confirms the structural need for the **T2.2 gate** (fail if a herring points at the culprit).

**Two NEW run-visible Agent 9 polish defects** (added to §1 / §2.9):

- 🆕 **Title scaffold leakage** — the shipped story's H1 title is literally `Generated in scene batches. 10 batch(es) required retry for validation.` — a diagnostic/fallback status string used as the title. High-visibility, low-effort deterministic fix.
- 🆕 **`the the` doubled-word leakage** — the judge raised `CONFIRMED LEAKAGE: the the`; a deterministic adjacent-duplicate-word pass is missing from the post-processing chain.

---

## 1. Master outstanding-issues table

Items are grouped by owning agent. `Src` points to the originating analysis. Only rows that are **not `☑`-and-on** are truly outstanding; landed rows are kept for context and marked `☑`.

| Agent | ID | Outstanding issue | Status | Lever | Src |
|---|---|---|:--:|---|---|
| **1 Setting** | T3.1 | `atmosphere` block is computed but **never read by Agent 9** (2c overrides it; season flips autumn→summer) | ☑ | atmosphere | A_48 |
| **1 Setting** | T3.8 | No season/time consistency contract with 2c | ☐ | consistency | A_48 |
| **1 Setting** | — | Scorer grades a *fabricated* `SettingRefinementOutput` adapter, not the real artifact | ☐ | honesty | A_48 |
| **2 Cast** | T3.2 | Real `agent2-cast-real-scorer.ts` + `checkCast` now **wired** via `applyHonestScorer` (`HONEST_SCORERS`) | ☑ | character | A_48 |
| **2 Cast** | — | `motiveStrength="N/A"` enum drift can hard-abort cast_design (sanitizer added; keep parity) | ☑ | stability | repo-mem |
| **2b Profiles** | T1.4 | `checkVoiceCapsules` enforced behind `AGENT2B_VOICE_CHECK=enforce` (bounded retry, accept-after-exhaustion); shadow path retained | ☑ | dialogue 🔑 | A_48/49 |
| **2b Profiles** | T1.5 | Atomize humour (`voice:NAME:humour`) | ☑ | dialogue | A_48 |
| **2b Profiles** | — | `signatureTic` added to `CharacterProfileOutput` + prompt; leads the VoiceCapsule tic list so Agent 9 can *quote* not paraphrase | ☑ | dialogue | A_48 |
| **2c Locations** | T2.7 | 2c runs **before** Agent 7 → **crime scene has no profile** (profiled Library, crime was the Study) → generic repeated openers. **Gate landed** (`checkCrimeSceneProfiled`); full reorder still deferred | ☑ | atmosphere/pacing | A_48 |
| **2c Locations** | T2.8 | Per-location distinctness gate. Prompt half (cross-location sensory) landed; **gate now enforced** (`checkLocationDistinctness`, flag OFF) | ☑ | atmosphere | A_48/49 |
| **2c Locations** | T3.3 | `scoreRealLocations` grades **distinct sensory atoms**, not word count | ☑ | atmosphere | A_48 |
| **2d/2e Context** | T3.4 | `scoreRealBackground` grades 2e's **own** artifact (real anchors, no Agent-1 echo) | ☑ | consistency | A_48 |
| **3 CML** | T1.1 | Required physical `death_method`, distinct from concealment mechanism | ☑ 🔑 | ending | A_48 |
| **3 CML** | T2.9 | Anti-trope motive (off the banned "financial-desperation" list) + ≥2 herrings misdirect **away**. Prompt landed; **no validator gate** | ◐ | premise | A_48/49 |
| **3 CML** | T3.5 | `scoreRealCml` replaces the hardcoded 100s with CASE content assertions | ☑ | honesty | A_48 |
| **3b Hard-logic** | T2.5 | Hardcoded clock-rewind exemplar in the prompt | ☑ | premise | A_48 |
| **3b Hard-logic** | T2.4 | Independent mechanism-plausibility **judge leg** (hard floor ≥80). **Judge wired** (`AGENT3B_PLAUSIBILITY_JUDGE`, flag OFF) | ☑ | premise | A_48/49 |
| **3b Hard-logic** | T2.6 | Cap device complexity; stop rewarding length. Prompt half landed; **scorer not replaced** | ◐ | premise | A_48/49 |
| **3b Hard-logic** | T3.6 | `scoreRealHardLogic` grades device **depth** (concrete claim/clues/locked facts), not length | ☑ | honesty | A_48 |
| **4 Revision** | — | Historical revision **non-convergence** after fair-play escalation; prompt-contract drift in retries | ☐ | stability | A_56 |
| **4 Revision** | — | `knowledge_revealed` grounding precheck added (Agent3+4); keep grounded before fair-play gates | ☑ | clues | repo-mem |
| **5 Clues** | T1.8 / T2.10 | Record gains `{observable, inference, first_full_reveal_chapter}` **additively** (derived `description` back-compat); Agent 9 read-site flipped to `deriveClueObservable`. Inert until the LLM emits the fields | ☑ | clues/prose | A_48/49 |
| **5 Clues** | T2.11 | `checkPointsToDistinctness` gate added (no two non-optional clues share a normalized `pointsTo`) | ☑ | pacing | A_48/49 |
| **5 Clues** | — | Direct-culprit strict slot must require concrete trace/alibi-conflict grounding + non-culprit exclusivity (generic "direct evidence" still let blind-reader pick a non-culprit) | ☐ | clues | repo-mem |
| **6 Fair-play** | T2.1 | Invert blind-reader to **fooled-then-convinced** (fail when the reader guesses the culprit early) → makes surprise gateable | ☑ 🔑 | ending | A_48 |
| **6 Fair-play** | T2.2 | Fail if any red herring `points_at_suspect` is the real culprit | ☑ | clues | A_48 |
| **6 Fair-play** | T2.3 | Verify manner-of-death **deducibility** in the structural audit | ☑ | ending | A_48 |
| **6.5 World** | — | `storyTheme ≥ 25` runtime gate ↔ scorer/docs parity (normalized; keep tests paired) | ☑ | atmosphere | repo-mem |
| **7 Outline** | T1.2 | `buildSceneGrid` **authoritative** behind `AGENT7_SCHEDULER_AUTHORITATIVE`: per-scene clue job stamped from the grid (one reveal per clue, no adjacent repeat); infeasible-grid guard | ☑ 🔑 | pacing | A_48/49 |
| **7 Outline** | T1.3 | Per-chapter word budget from the length-target pacing curve (replaces the uniform `Math.max` floor / hardcoded `1800`) behind the same flag | ☑ | pacing | A_48/49 |
| **7 Outline** | T3.7 | `scoreRealNarrative` rewards scene concision **near budget**, not length | ☑ | honesty | A_48 |
| **7 Outline** | — | Opening-hook contract: Scene 1 leads with body/discovery, not arrival/atmosphere | ☐ | opening | A_48 |
| **8 Novelty** | T1.7 | Cross-run fingerprint store. **Constraints-feed core + de-vanity score LANDED** (real-score path fires when `NOVELTY_CROSS_RUN` on); deterministic judge-gate (reject-and-regenerate) still deferred | ◐ 🔑 | premise | A_49 |
| **8 Novelty** | T1.6 | `effectiveNoveltyThreshold` couples the audit threshold to the flag (→0.7 only when `NOVELTY_CROSS_RUN` on) — fires the audit without lowering the YAML default blind | ☑ | premise | A_48/49 |
| **9 Prose** | — | Post-validation **mutation gap**: a mutation could ship without re-validation → release gate reads a stale report. **Landed:** `mutateThenValidate` + `AGENT9_MUTATION_REVALIDATION` (default ON) reverts any grounding-lead mutation that regresses the metadata-dump check. **Residual:** extend the wrapper to the rest of the post-processing chain | ◐ | stability | repo-mem |
| **9 Prose** | — | `template_bleed` run-killer fired every chapter with no exhaustion backstop (A_44 died Ch4). `preferCompletionOnFailure` now commits fallback — **confirm holds on a live run** | ◐ | stability | A_44/repo-mem |
| **9 Prose** | — | Victim-alive/identity slip + male→female pronoun miss routed to **terminal abort** instead of deterministic repair (A_43 G/H/I) | ☐ | stability | A_43 |
| **9 Prose** | — | 🆕 **Deterministic-fallback prose leakage** — when a chapter exhausts retries, `preferCompletionOnFailure` commits fallback prose containing `composeKeyTermPhrase` comma-token dumps (e.g. `captain, ivor, hale, seen, acting, nervously`; `clue-validation.ts:396`, pasted at `deterministic-repair.ts:151/156/163/221/227/280/466/537/619/803`) and canned scaffold narration (`…treated those facts as observable evidence, not rumor…`; `deterministic-repair.ts:285`). Caught by NEITHER `detectTemplateLeakage` (its `TEMPLATE_LEAKAGE` set, `prose-guard/fidelity.ts:112`, omits these strings) NOR the rubric → the leakage hard-cap (`hard-caps.ts:66`, prose ≤4 / overall ≤65) never fires. OUTPUT-side twin of HEAD `8ef69f55` (prompt-side); a live instance of the Tier-3 honest-scorer thesis. **✅ Landed + live-validated (`run_20260625-2335`):** detector hardened (semicolon machine-table pattern — the broad comma-dump was reverted after an adversarial review caught it false-firing on Oxford/asyndeton lists); source cleaned (`composeProseTermPhrase` space-join + control-plane neutralizer + the missed `evidenceSummary` site). Offline re-score gate met — old leaky story = **7** `detectTemplateLeakage` hits (cap would fire → toward ChatGPT's 56), new run = **0**; shipped prose grep-clean. | ☑ | prose/polish + rubric-honesty | run_2026-06-25 |
| **9 Prose** | — | 🆕 **Title scaffold leakage** — H1 title shipped as `Generated in scene batches. 10 batch(es) required retry for validation.` (diagnostic/fallback string used as the title) | ☑ | prose/polish | run_9b824eb2 |
| **9 Prose** | — | 🆕 **Doubled-word leakage** (`the the`, `soft soft`) — no deterministic adjacent-duplicate-word pass in post-processing (judge: `CONFIRMED LEAKAGE`) | ☑ | prose/polish | run_9b824eb2 |

---

## 2. Per-agent detail

Each agent: **current rubric cap**, **what's still open**, and **what already landed** (for context). File:line anchors are carried from A_48/A_49 where cited there.

### Agent 1 — SettingRefiner
**Caps:** atmosphere, premise grounding.
- **Open:** `atmosphere` is generated then **discarded** — no runner pipes it into the Agent 9 prompt, and 2c's atmosphere wins (proven by the autumn→summer season flip). (T3.1)
- **Open:** no season/time consistency contract with 2c (T3.8); the scorer grades a *fabricated* adapter (`agent1-scoring-adapter.ts`), not the real LLM output.
- **Landed:** season-lock validator false-positive fixed in `temporal-consistency.ts` (mechanical-spring collocations stripped before the seasonal test) — this killed a 10-chapter `month/season contradiction` churn driver.

### Agent 2 — Cast
**Caps:** character_clarity, dialogue (via downstream voice).
- **Open:** the **real** `agent2-cast-real-scorer.ts` + `checkCast` exist but are **unwired** (flag `AGENT2_CAST_CHECK` default OFF). The scoring adapter hardcodes `opportunity_channels`/`behavioral_tells = []`, so `scoreCharacterDepth` pins quality ~60 no matter how good the cast is (T3.2). Reject hollow `motiveSeed=""`/"N/A".
- **Landed:** enum-drift sanitizer (`motiveStrength`, `accessPlausibility`, tension, gender) normalizes before cast_design schema validation; `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` (default ON) separates contract recovery from quality retries.

### Agent 2b — Character Profiles / VoiceCapsule
**Caps:** dialogue (frozen 6), character_clarity. **Highest-leverage dialogue lever.**
- **Open (◐):** `checkVoiceCapsules` runs **shadow only** (`AGENT2B_VOICE_CHECK` default OFF); nothing reads `ok`/`metrics`. Four of five voices land on "measured/precise/formal." The **prompt half** (voice-distinctness section: ≥3 registers, distinct tic each) landed; the **enforced bounded retry gate** (`uniqueRegisters ≥ ceil(0.6×count) && duplicatePairs==0 && deployableCount==count`, ≤1 retry, accept-after-exhaustion) is **not flipped** — A_49 §4 has the full plan. (T1.4)
- **Open:** add a concrete `signatureTic` to `CharacterProfileOutput` so Agent 9 quotes rather than paraphrases.
- **Landed:** humour atoms (`voice:NAME:humour`, fires on `humourStyle≠none && humourLevel≥0.4`). (T1.5)

### Agent 2c — Location Profiles
**Caps:** atmosphere, pacing.
- **Open (🔑):** 2c runs **before** Agent 7, so the **crime scene has no sensory profile** (real run profiled a Library; the murder was in the Study) → Agent 9 had no bible for the actual scene → generic, repeated openers + 3 AtmosphereRepair passes. Run 2c after Agent 7 (or pass the CML crime-scene location). (T2.7)
- **Open (◐):** per-location distinctness gate — prompt half (cross-location sensory distinctness) landed; the **gate** (flag >50% atom overlap / shared `mood`) is not enforced (T2.8); `scoreSensoryRichness` still counts **words**, not distinct atoms (T3.3).

### Agents 2d / 2e — Temporal / Background Context
**Caps:** consistency.
- **Open:** 2e is graded on **Agent-1 back-filled** fields (`agent2e-scoring-adapter.ts`), so its score reflects Agent 1's data, not its own one-sentence output; thin/duplicative. Grade 2e's own artifact. (T3.4)

### Agent 3 — CMLGenerator (keystone)
**Caps:** ending, plot_structure, clues, premise.
- **Landed (🔑):** required physical `death_method`, distinct from the concealment mechanism, with a guaranteed `normalizeCml` population (`deriveDeathMethodFromCrimeClass`). This is the defect that silently skipped the reveal obligation and tanked the run. (T1.1)
- **Open (◐):** anti-trope motive (off the banned financial-desperation list) + ≥2 herrings misdirect *away* — **prompt landed**, but there is **no validator gate** asserting it (T2.9).
- **Open:** the scorer is **hardcoded constants** (validation/completeness/consistency = 100), docked only if Agent 4 revised — replace with content assertions (T3.5).

### Agent 3b — HardLogicDeviceGenerator
**Caps:** premise (plausibility), plot_structure.
- **Landed:** removed the hardcoded clock-rewind `lockedFacts` exemplar (`"ten minutes past eleven"`/`"forty minutes"`) that the model copied verbatim into every story; added a "don't default to the clock" nudge. (T2.5)
- **Open (◐):** an **independent mechanism-plausibility judge leg** (real LLM, hard floor ≥80, wired into the retry loop) — prompt half (plausibility + simplicity bar) landed, **judge not wired** (T2.4); device-complexity cap + length-scorer replacement landed in the prompt only (T2.6 / T3.6).

### Agent 4 — CMLRevision
**Caps:** stability (no A_48 fitness item; convergence is the risk).
- **Open:** historical **revision non-convergence** after fair-play escalation, with prompt-contract drift across retries and weak audit traceability (A_56, run `20f9ca27`). No new structural item, but the retry-convergence path remains fragile and should be watched on the next live run.
- **Landed:** `groundDiscriminatingKnowledgeRevealed` precheck (Agent3+4) rewrites ungrounded `discriminating_test.knowledge_revealed` from the evidence corpus before validator/fair-play gates.

### Agent 5 — Clues / Red Herrings
**Caps:** clues, prose (leakage), pacing.
- **Open (⊘, planned):** restructure the clue record to `{observable, inference, pointsTo, first_full_reveal_chapter}` **additively** (keep a derived `description` for back-compat) so the spec sentence never reaches Agent 9. ~12-consumer blast radius; A_49 §2 has the phased, inert-until-the-last-flip plan. (T1.8/T2.10)
- **Open (⊘):** one-insight / one-clearance discipline — ≤1 elimination clue per suspect (kills the Ch9/Ch10 double-clearance smear) and no two clues sharing a normalized `pointsTo`. (T2.11)
- **Open:** the direct-culprit strict slot must require concrete **trace/alibi-conflict** grounding + non-culprit exclusivity; `access_plausibility` alone produced generic "direct evidence" that still let the blind-reader pick a non-culprit (`run_9d8d0ab6`).
- **Landed:** `dedupeByDescriptionSimilarity` (deterministic-repair) already mitigates the prose-visible twin; red-herring retry now passes explicit overlap-derived `forbiddenTerms` (e.g. `clock`) into `fairPlayFeedback`; strict deterministic contracts (`enforceAgent5DeterministicContracts`) run on the initial path, not just at Agent 6.

### Agent 6 — Fair-Play Auditor / BlindReader
**Caps:** ending ("predictable"), clues. **Only lever for "predictable reveal."**
- **Open (🔑):** the blind-reader **rewards predictability** — it passes when the reader guesses the culprit and fails when fooled. Invert to a two-stage **fooled-then-convinced** test: fooled by `false_solution` on early+mid clues, reverses to the true culprit on the late clue; a reader who names the culprit *before* the reversal **fails** (too obvious). (T2.1)
- **Open:** audit `false_solution`/red-herring `points_at_suspect` (currently 0 references) — fail if any herring points at the real culprit (T2.2); verify manner-of-death deducibility in the structural audit (T2.3).
- **Landed:** structural-retry escalation for discriminating-test-timing + information-parity failures (→ `inference_path_abstract`), with concrete mechanism context fed to Agent 4; parity-bridge/backstop clues kept case-grounded (no `reader-visible`/`pre-test`/`inference step` phrasing that trips `checkMetaAuditClueText`); warning-lifecycle dedupe; synthesized upstream context for targeted `--agent 6` runs.

### Agent 6.5 — WorldBuilder
**Caps:** atmosphere.
- **Landed:** `storyTheme ≥ 25` word runtime gate with scorer/docs parity and deterministic normalization for short themes. No open item.

### Agent 7 — Narrative Outliner
**Caps:** pacing (the frozen 5), plot_structure, opening_hook. **Largest pacing lever.**
- **Open (⊘, 🔑):** `runAgent7SchedulerShadow` is the *last* statement of `runAgent7` and "acts on nothing" — make `buildSceneGrid` **authoritative** (flag `AGENT7_SCHEDULER_AUTHORITATIVE`), assigning one distinct job per chapter and rejecting adjacent-duplicate jobs (kills the Ch9/Ch10 smear by construction). (T1.2)
- **Open (⊘):** every scene is hardcoded `estimatedWordCount:1800` and `prompt-builder.ts` does `Math.max(scene.estimatedWordCount, chapterTargetWords)`, so a *short* story's ~1,000 ideal is overridden → ~1,800-word chapters → pacing 5. Derive the budget from `getStoryLengthTarget`. (T1.3)
- **Open:** invert `scoreSceneDetail` (it rewards longer summaries) (T3.7); opening-hook contract that Scene 1 leads with the body/discovery. A_49 §3 has the full phased plan (steps inert until the final flip).
- **Run evidence (`run_9b824eb2`):** `pacing 6` + `opening_hook 6` were the two lowest marks, driven by **mechanical repetition** — Ch1 restates one timeline contradiction four times verbatim (*"The hour stood at eleven o'clock. The hour stood at twenty-five minutes past eleven."* ×2 pairs), and later chapters re-restate it. **Chapters were ~1,000–1,460 words, not 1,800**, so on this run the pacing loss is **T1.2/T2.11 (one job restated per chapter), not primarily T1.3 (length)** — flip the scheduler authority first.

### Agent 8 — NoveltyAuditor
**Caps:** premise (frozen 7), opening_hook. **Only lever on the frozen premise.**
- **Open (◐, 🔑):** the cross-run novelty store — `@cml/novelty` was built/tested but unwired and every run compares only to **static seeds** (identical each time) → the "manor-clock attractor." The **constraints-feed core LANDED** (`apps/worker/src/jobs/novelty-ledger.ts` persists each shipped run's fingerprint and folds `recent(20)` into Agent 3's avoidance), but it is behind `NOVELTY_CROSS_RUN` **default OFF**; the deterministic **judge gate** (reject-and-regenerate) and the de-vanity score are **deferred** (A_49 §1). (T1.7)
- **Open (⊘):** `similarity_threshold_default: 1.1` means the audit "can never fire" — lower to 0.7, but only paired with T1.7 and validated live (T1.6).
- **Run evidence (`run_9b824eb2`):** `premise 7` ("conventional, lacks a novel hook") with the run log showing *"Novelty check skipped (threshold ≥ 1.0)"* — Agent 8 never fired. Direct confirmation that **T1.7 + T1.6 are the only premise lever**, and that flipping them is the highest-value next move.

### Agent 9 — ProseGenerator
**Caps:** prose/polish + run completion. (See §3 for the runtime-control issues that also live here.)
- **Mostly landed (◐):** the **post-validation mutation gap** is closed for the known-dangerous mutation — the validation-gated-mutation law (`mutateThenValidate` from `@cml/prose-guard`, flag `AGENT9_MUTATION_REVALIDATION` **default ON**, `agent9-run.ts:120-125`) wraps the deterministic grounding-lead injector and reverts it if it would introduce a §3.2 location-metadata dump. **Residual:** the law currently covers only the grounding-lead mutation; extend it across the rest of `applyDeterministicProsePostProcessing` (pronoun/title/location rewrites), or re-run the full `StoryValidationPipeline` after the chain before the release gate.
- **Open (◐):** the `template_bleed` linter fired every chapter with no exhaustion backstop and killed `run_70ac132d` at Ch4. `preferCompletionOnFailure` (default true) now commits a deterministic fallback chapter instead of aborting, and template-class failures are full-budget convergence loops — **confirm this holds end-to-end on a clean run.**
- **Open (🆕, `run_2026-06-25`, external re-score — Fix #1, head of the rubric-honesty milestone):** **deterministic-fallback prose leakage.** The `preferCompletionOnFailure` path (the same fallback that replaced the `template_bleed` abort) commits machine text into shipped chapters: `composeKeyTermPhrase` token-dumps (`"captain, ivor, hale, seen, acting, nervously"`) and the canned scaffold sentence `"…treated those facts as observable evidence, not rumor, and tied them to what could be seen, timed, and compared in real time."` (`deterministic-repair.ts:280/285`, used at 151/156/163/221/227/466/537/619/803). This is the primary driver of the rubric's **16-point over-score (internal 72 vs external 56)**: the leakage hard-cap already exists (`rubric-score/hard-caps.ts:66`) but its extractor `detectTemplateLeakage` (`prose-guard/fidelity.ts:112`) matches none of these fragments, so the cap never fires. Distinct from HEAD `8ef69f55`, which closed the PROMPT side. **Fix (rubric-honesty milestone, ahead of any flag flip):** (1) add these patterns to `TEMPLATE_LEAKAGE` so the existing cap fires; (2) replace the token-dumps/canned narration with grammatical fallback prose; (3) gate the `preferCompletionOnFailure` commit on the detector — route a tripping chapter to one more bounded repair, **never** a hard abort (MEMORY: no-backstop gates kill runs).
- **Landed (🆕, `run_2026-06-25` triage):** **two linter false positives fixed** that were tanking nearly every chapter (9/10 batches→retry). **(a) Cast-name paragraph openers** — `lintBatchProse`'s repeated-opener gate counted character names ("Beatrice"/"Eleanor"/"Captain Ivor") as scaffold "template bleed"; it now receives the cast roster and excludes name tokens (`lint.ts` + `generate.ts`; n-gram/fingerprint checks untouched). **(b) `contract_term` control-plane leakage** matched the ordinary English verb/noun "contract" ("the walls seem to contract"); tightened to scaffold-qualified usage only (`control-plane-leakage.ts`). Verified live: the two false positives went from ~30+ hits → **0**, retry batches 9/10 → **2/10** (prompts-llm 479 / story-validation 280 green).
- **Landed (🆕, `run_2026-06-25` confirmation):** the `suspect_pressure` "premature culprit reveal" failures were **mostly a THIRD validator false positive**, not the model resolving early. `AFFIRMATIVE_SUSPECT_PRESSURE_RESOLUTION_RE` fired on the ordinary words *confess/confession* (a suspect confessing a **secret** — literally the point of the stage: "I confess, I lost track of time"; "her confession hung in the air"; "you confessed you never touched it"), on the **metaphor** "time arrested by violence", and on **suspense** ("the murderer was still among them"). Tightened so each branch requires genuine resolution — confession **tied to the crime**, an **actual arrest**, "case closed", or **naming/accusing** the culprit (suspense continuations excluded). Belt-and-suspenders prompt guidance also added (suspect_pressure `forbidden_reveals` + mode-outcome + checklist; YAML + TS default + `prompt-builder.ts`). 2 regression tests (false positives → false, genuine → true). **Effect:** with the three linter false positives fixed, the confirmation run reached **rubric 72/100 (status `warning`, above the `run_9b824eb2` baseline of 71)**, up from 61–62. Residual real issues are now boundary-integrity (unbalanced quotes) + genuine n-gram/fingerprint bleed on a couple of chapters, and the premise ceiling from a near-clone seed (novelty 0.72, warning).
- **Open:** victim-alive/identity slip (Ch3) and a male→female pronoun miss (Ch5) were routed to **terminal abort** despite being deterministically repairable (A_43 G/H/I).
- **Open (🆕, `run_9b824eb2`):** **title scaffold leakage** — the shipped H1 title was the diagnostic string `Generated in scene batches. 10 batch(es) required retry for validation.` instead of a real title; a fallback/status string is reaching the title field. High-visibility, deterministic fix (sanitize/replace the title before assembly).
- **Open (🆕, `run_9b824eb2`):** **doubled-word leakage** — the judge flagged `CONFIRMED LEAKAGE: the the`; add a deterministic adjacent-duplicate-word pass to `applyDeterministicProsePostProcessing`.
- **Landed:** pre-commit chapter completeness gates (min words by target + required clue obligations); unified pronoun policy (`strict|relaxed|off` via `getPronounPolicySettings()`); pronoun-vs-name-drift kept as separate retry-feedback classes; lifecycle continuity evaluated across the full chapter; NSD clue-evidence parity hard-enforces only canonical IDs (red-herring `rh_*` advisory); two-phase retry routing (logic Phase 1 → quality Phase 2) and compacted terminal-retry contracts.

---

## 3. Cross-cutting / runtime issues (not artifact-fitness)

These are pipeline-control defects that span agents; they gate whether a *good* artifact still ships a *complete* story.

| Area | Outstanding issue | Status | Where |
|---|---|:--:|---|
| Release gate | Validation-gated mutation law landed (`mutateThenValidate`, `AGENT9_MUTATION_REVALIDATION` default ON) — covers the grounding-lead/metadata-dump mutation. Residual: extend across the rest of the post-processing chain | ◐ | `apps/worker/.../agent9-run.ts` |
| Report invariants | `GenerationReport` invariants enforced in `FileReportRepository.save()`; template-linter abort requires `template_linter_failed_checks > 0` | ☑ | `@cml/story-validation` |
| Retry parity | Keep `apps/worker/config/retry-limits.yaml` ↔ `retry-manager.ts` fallback defaults in sync; Agent 7 structural gates must branch on `preAgent9ContractRecoveryEnabled()` not `preAgent9LlmRetriesEnabled()` | ☑ | worker/story-validation |
| Completion-first | `preferCompletionOnFailure` commits deterministic fallback instead of aborting; confirm no regression where prose stops before full chapter count | ◐ | `agent9-prose/generate.ts` |
| Build hygiene | Stale-`dist` trap **closed**: `build:all` (dependency-ordered, `scripts/build-all.mjs`) is wired into `dev` and `canary:core` so they rebuild every package first. Residual is operational only — the clean corrected-build validation run itself still has to be done | ☑ | `package.json` / ops |

---

## 4. Recommended next sequence (decisive)

> **⚠️ SUPERSEDED for execution order by §8** (resequenced 2026-06-25 after the external ChatGPT re-score exposed a 16-pt rubric over-score from *blindfolded* hard-caps). §4–§5 below remain the per-item rationale/history; **§8 is the authoritative running order.** The headline change: the rubric-honesty work (Fix #1 + the deterministic victim-alive cap + HONEST_SCORERS) now runs **before** the flag-flip ladder, because accepting flags "on a moved category" is meaningless against a rubric that over-scores.

The discipline (from A_49 §5) is non-negotiable: **land code + unit tests with the flag OFF, flip in one replay, accept only if the target metric moved and nothing regressed, keep shadow telemetry on.**

1. **✅ Done — clean corrected-build baseline established (`run_9b824eb2`, §0.5).** The run confirmed the death-method + season-lock landings collapsed the 10-chapter churn (structurally clean; 71 LLM / 68 shadow). Two **cheap immediate wins** it surfaced, before any flag flip: **(a)** stop the **title scaffold leak**, and **(b)** add a **doubled-word (`the the`) pass** to Agent 9 post-processing — both deterministic, no-retry, no-flag. Then proceed to the flag flips below.
2. **T1.7 + T1.6 (Agent 8 novelty)** — additive, isolated, instant kill-switch; the only lever on the frozen `premise`. Flip `NOVELTY_CROSS_RUN`, then lower the threshold. Accept when two runs diverge on ≥2 structural fields.
3. **T1.8 / T2.10 / T2.11 (Agent 5 clue restructure)** — additive fields with a derived `description`; large blast radius but back-compat. Settles the clue IDs the scheduler will consume.
4. **T1.2 / T1.3 (Agent 7 scheduler + word budget)** — the largest pacing lever; behavior-flipping, so do it after the clue IDs are stable. Target pacing 5→≥7.
5. **T1.4 (Agent 2b voice gate)** — last of the retry-bearing gates; tune the threshold on a stable pipeline. Never flip a second retry gate in the same run as the scheduler.
6. **Tier 2 substance** (Agent 6 fooled-then-convinced inversion 🔑, Agent 3b plausibility judge, Agent 2c crime-scene profiling) and **Tier 3 honest scorers** (Agents 1/2/2c/2e/3/3b/7) — each a focused PR gated on a live run, so a future regression *fails* instead of scoring A.

**One-line version:** the keystone (death method) and the churn driver (season lock) are fixed; everything else outstanding is mostly **flipping on already-built machinery, one flag and one live run at a time** — novelty → clues → scheduler → voice → reveal-surprise → honest scorers.

---

## 5. Implementation plan (sequenced, code-grounded)

> **Discipline (non-negotiable, from A_49 §5):** land code + unit tests with the behaviour-flag **OFF** → flip in **exactly one** replay → accept **only** if the target rubric category moved *and* nothing regressed → keep shadow telemetry on. **One retry-bearing gate per run, never two.**
>
> **Baseline to beat** = `run_9b824eb2` (§0.5): overall **71 LLM / 68 shadow**; `pacing 6`, `opening_hook 6`, `premise 7`, `dialogue 7`; two polish leaks (title, `the the`).

### Phase 0 — Immediate deterministic fixes (no flag, no retry, ship today)

The two run-visible leaks from §0.5. Both are deterministic, ship in **one PR**, and are validated by unit tests + an offline re-judge of the existing `run_9b824eb2` prose — **no new live run required.** Do these first: they cost nothing and remove embarrassing residue before the baseline is quoted anywhere.

**P0.1 — Kill the title scaffold leak (root-cause fix).**
- **Root cause (traced):** the generation **note** `Generated in scene batches. N batch(es) required retry for validation.` is built at `packages/prompts-llm/src/agent9-prose/generate.ts:4084` and then used as a **title fallback** in five sites — `apps/api/src/server.ts:322` (`buildProsePdf`), `:565` (`buildReadableStoryText`), `:604` (`saveReadableStoryText` ← wrote the leaked `.md`), `apps/worker/src/jobs/agent9-replay.ts:157`, and `apps/web/src/stores/projectStore.ts:179`. A *note* is process metadata, never a title. The existing scrubs at `agent9-run.ts:270` and `server.ts:487` match only the **bare** phrase (`/^Generated in scene batches\.?$/`), so the full diagnostic line slips through.
- **Change (prevention-over-cure, fix-once) — *as built*:** added one shared `deriveStoryTitle(prose, fallbackTitle)` + `isGenerationResidueTitle()` in **`@cml/prompts-llm`** (`story-title.ts`, exported via the barrel) — chosen over `@cml/utils` because both `apps/api` and `apps/worker` already depend on `@cml/prompts-llm` (and `@cml/utils` is imported nowhere). It prefers `prose.title` → `fallbackTitle` → `"Mystery Story"`, **never `note`**, rejecting residue via denylist `/generated in scene batches|batch\(es\)\s*required|required retry for validation/i`. Replaced **all four backend** fallback chains with it (`server.ts` ×3, `agent9-replay.ts`); fixed the browser-only `projectStore.ts:179` inline with the same residue guard (no new `@cml/*` web dep). Broadened both scrubs to the full line (`/^…\b.*$/`).
- **Tests:** note-as-title rejected → `"Mystery Story"`; real `prose.title` passes through; denylist catches the full diagnostic line; fixture asserts the saved `.md` H1 is never the note.
- **Acceptance:** replay `run_9b824eb2` prose → H1 is a real title; `grep -r "scene batches\|batch(es) required" stories/` returns **0**.
- **Rollback:** pure formatting, no flag — revert is a single helper swap.

**P0.2 — Doubled-word collapse (`the the`).**
- **Where:** `sanitizeProseText` at `apps/worker/src/jobs/agents/agent9-run.ts:262` — runs on every paragraph via `enforceReadableParagraphFlow`, so it covers all four post-processing call sites at once.
- **Change — *as built* (upgraded after evidence):** `run_9b824eb2` leaked **two** genuine doublings (`the the` **and** `soft soft`), so a function-word denylist would have under-fixed. Implemented a **decisive blanket** case-preserving collapse `/\b(\w+)\s+\1\b/gi` with a tiny **allowlist** of grammatically-valid doublings (`had`, `that`, `is`) that are preserved. The trailing `\b` prevents false positives where a word merely prefixes the next (`the thermometer` stays intact). Also broadened the adjacent residue scrub to `/^Generated in scene batches\b.*$/gim`.
- **Tests:** `"the the door"`→`"the door"`; `"soft soft"`→`"soft"`; `"had had"`/`"that that"`/cleft `"is is"` preserved; `"the thermometer"` and `"a apple"` untouched; sentence-start case preserved; cross-sentence (`"the. The"`) not collapsed.
- **Acceptance:** re-judge `run_9b824eb2` prose → `CONFIRMED LEAKAGE: the the` flag clears; `prose` mark not regressed.
- **Rollback:** low-risk deterministic regex; remove the one line.

### Phase 1 — Flag-flip ladder (one flag, one run each, in this order)

Each lever is already built and sitting flag-OFF/shadow (per §1–§2). Order respects blast-radius and the "stable IDs before behaviour" rule.

**P1.1 — Agent 8 novelty · T1.7 + T1.6 · lever: `premise 7→≥8` · 🔑**
- **Change:** flip `NOVELTY_CROSS_RUN` (constraints-feed core already landed in `apps/worker/src/jobs/novelty-ledger.ts`); *then* lower `similarity_threshold_default` 1.1→0.7 so the audit can fire. Do **not** lower the threshold blind — pair it with the cross-run feed.
- **Why first:** additive, isolated, instant kill-switch, and the **only** lever on the frozen premise — which §0.5 confirmed was never even exercised this run ("Novelty check skipped, threshold ≥ 1.0").
- **Accept:** two consecutive runs diverge on ≥2 structural fields (no "manor-clock attractor") **and** `premise` ↑. **Rollback:** flag OFF.

**P1.2 — Agent 5 clue restructure · T1.8 / T2.10 / T2.11 · lever: clues/prose-leakage + pacing**
- **Change:** add the record fields `{observable, inference, pointsTo, first_full_reveal_chapter}` **additively** (keep a derived `description` for back-compat) so the spec sentence never reaches Agent 9; enforce one-insight/one-clearance (≤1 elimination clue per suspect; no two clues share a normalized `pointsTo`). ~12-consumer blast radius — follow the phased, inert-until-last-flip plan in A_49 §2.
- **Why second:** settles the clue IDs the scheduler (P1.3) will consume — sequence it *before* the behaviour-flip.
- **Accept:** no spec-sentence string in prose; no two clues share a normalized `pointsTo`; `clues`/`prose` not regressed. **Rollback:** read-site flip reverts to derived `description`.

**P1.3 — Agent 7 scheduler authority + word budget · T1.2 / T1.3 · lever: `pacing 6→≥7`, `opening_hook 6→≥7` · 🔑**
- **Change:** add **new** flag `AGENT7_SCHEDULER_AUTHORITATIVE` and make `buildSceneGrid` authoritative (promote `runAgent7SchedulerShadow` from shadow→gate): one distinct job per chapter, reject adjacent-duplicate jobs. Derive the per-chapter budget from `getStoryLengthTarget` — remove the hardcoded `estimatedWordCount:1800` (`agent7-narrative.ts:875`) and the `Math.max(scene.estimatedWordCount, chapterTargetWords)` override (`prompt-builder.ts:1772`). Add the opening-hook contract (Scene 1 leads with the body/discovery). A_49 §3 has the phased plan.
- **§0.5 correction — this is the dominant pacing driver, not length.** Chapters were already ~1.0k–1.46k words; the loss came from the *same job restated every chapter* (Ch1 repeated one contradiction ×4). So **T1.2/T2.11 carry the pacing win; T1.3 is secondary.**
- **Accept:** `pacing` + `opening_hook` ↑ **and** Ch1 no longer restates a single contradiction ≥3×. **Rollback:** flag OFF (reverts to model-authored grid).

**P1.4 — Agent 2b voice gate · T1.4 · lever: `dialogue 7→≥8`**
- **Change:** flip `AGENT2B_VOICE_CHECK` (real `checkVoiceCapsules`); enforce the bounded retry `uniqueRegisters ≥ ceil(0.6×count) && duplicatePairs == 0 && deployableCount == count`, ≤1 retry, accept-after-exhaustion (A_49 §4). Add a concrete `signatureTic` to `CharacterProfileOutput` so Agent 9 can *quote* not paraphrase.
- **Rule:** **never** flip this in the same run as P1.3 (two retry gates at once is forbidden).
- **Accept:** `dialogue` ↑; ≥3 distinct registers across the cast. **Rollback:** flag OFF.

### Phase 2 — Tier-2 substance (each a focused PR, gated on a live run)

- **P2.1 — Agent 6 fooled-then-convinced inversion (T2.1 🔑) + herring-points-at-culprit gate (T2.2) + manner-of-death deducibility (T2.3).** Invert the blind-reader so it *fails* when the reader names the culprit before the late-clue reversal — the only lever on a "predictable" ending. §0.5 showed `rh_1`/`rh_2` overlapped the true solution and were only caught by Agent 5's deterministic sanitizer; **T2.2 makes that a hard gate.**
- **P2.2 — Agent 3b independent plausibility judge leg (T2.4)** — real LLM, hard floor ≥80, wired into the retry loop (prompt half already landed).
- **P2.3 — Agent 2c crime-scene profiling (T2.7) + distinctness gate (T2.8)** — run 2c *after* Agent 7 (or pass the CML crime-scene location) so the murder room has a sensory bible; enforce the >50%-atom-overlap gate. Protects the current `atmosphere 8`.

### Phase 3 — Honest scorers (Tier-3, regression insurance)

Replace each vanity scorer with content assertions so a future regression **fails** instead of scoring A — each gated on a live run: Agent 1 (grade the real artifact + pipe `atmosphere` into Agent 9, T3.1/T3.8), Agent 2 (wire `AGENT2_CAST_CHECK` + the real `agent2-cast-real-scorer.ts`, T3.2), Agent 2c (`scoreSensoryRichness` on distinct atoms, T3.3), Agent 2e (grade its own output, T3.4), Agent 3 (content assertions, T3.5), Agent 3b (`scoreDeviceDepth`, T3.6), Agent 7 (invert `scoreSceneDetail`, T3.7).

### Acceptance ladder (target = [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md))

| After | Primary categories moved | Overall target (LLM) |
|---|---|---|
| Phase 0 | polish only — title + `the the` leaks gone (`prose` flag clears) | 71 (no regress) |
| P1.1 | `premise` 7→≥8 | ≥73 |
| P1.2 | `clues`/`prose` leakage closed | ≥74 |
| P1.3 | `pacing` 6→≥7, `opening_hook` 6→≥7 | ≥77 |
| P1.4 | `dialogue` 7→≥8 | ≥78 |
| Phase 2 | `ending` (surprise), `premise` (plausibility), `atmosphere` held | **≥80** |

### Sequencing one-liner

**P0 (title + `the the`, ship now) → P1.1 novelty → P1.2 clues → P1.3 scheduler → P1.4 voice → P2 reveal/plausibility/crime-scene → P3 honest scorers.** One behaviour flag per replay; never two retry gates in one run; accept only on a moved category with no regression.

---

## 6. Progress tracker (live)

Updated as each step lands. Legend: `☐` not started · `◐` in progress · `☑` code + unit tests green · `✅` accepted on a live run.

| Step | Item | Status | Notes |
|---|---|:--:|---|
| P0.1 | Title scaffold leak — shared `deriveStoryTitle`, drop `note`, residue denylist, broaden scrubs | ☑ | **Landed.** `deriveStoryTitle`/`isGenerationResidueTitle` added to `@cml/prompts-llm` (`story-title.ts`), exported via barrel. Wired all 4 backend sites (`server.ts` ×3 + `agent9-replay.ts`) + web `projectStore.ts` residue-guard. Both residue scrubs broadened to whole-line (`^…\b.*$`). 11 unit tests green; offline-validated against `run_9b824eb2` (note→"The Sedgemoor Manor Murder"/"Mystery Story", slug no longer `generated_in_scene_batches…`). Accept on next live run. |
| P0.2 | Doubled-word collapse in `sanitizeProseText` | ☑ | **Landed (upgraded).** Switched from a function-word denylist to a decisive blanket adjacent-duplicate collapse `\b(\w+)\s+\1\b` with an allowlist (`had`/`that`/`is`). Catches **both** real leaks (`the the` AND `soft soft`), preserves grammar ("had had") and prefixes ("the thermometer"). 9 unit tests green; offline-validated vs `run_9b824eb2`. Full worker (182) + prompts-llm (444) suites pass. Accept on next live run. |
| P1.1 | Agent 8 novelty flip (`NOVELTY_CROSS_RUN` + threshold) | ☑ | **Landed (flag-coupled).** `effectiveNoveltyThreshold` + `CROSS_RUN_NOVELTY_THRESHOLD=0.7` in `novelty-ledger.ts`; Agent 8 leg (`agent3-run.ts`) consumes it so the audit fires (real score, de-vanity'd) **only** when `NOVELTY_CROSS_RUN` is on — no blind lowering of the YAML default. 8 novelty-ledger tests green. Default OFF. **Live shadow confirmed (`mystery-1782415325943`, 2026-06-25):** audit fires with a real score (`most similar 'The Second Key' 0.65` at the capped `threshold 0.70`, no longer "skipped"); cross-run feed read the prior ledger entry and **diverged** the generation (0.85 unconstrained → 0.65 → pass); ledger correctly records only shipped runs. Mechanics ✅. The run's overall rubric (61/failure) is dominated by **unrelated Agent-9 prose-validation failures** (premature reveal / resolution-ending, with pre-Agent9 retries OFF), so the `premise ↑` rubric acceptance still needs a prose-clean run. |
| P1.2 | Agent 5 clue restructure | ☑ | **Landed (additive, inert-until-data).** Record gains `observable`/`inference`/`first_full_reveal_chapter` (parse has no field whitelist → flows through); `deriveClueObservable`/`deriveClueDescription` back-compat helpers + `checkPointsToDistinctness` (no two non-optional clues share a normalized `pointsTo`). Agent 9 obligation-block now reads `deriveClueObservable` (falls back to `description` ⇒ identical today). 8 tests green. No flag — inert until the LLM emits the fields. Accept on a live run. |
| P1.3 | Agent 7 scheduler authority + word budget | ☑ | **Landed (flag-gated, both halves).** New `AGENT7_SCHEDULER_AUTHORITATIVE`: **(T1.2, job authority)** each scene's revealed-clue job is stamped from the deterministic grid (`buildSceneGrid` → `applyGridClueJobs`), which places every reveal in exactly one slot → a clue is dramatized once, never re-revealed across adjacent chapters (kills the *"one contradiction restated every chapter"* smear); infeasible-grid guard keeps the LLM distribution. **(T1.3, word budget)** worker stamps a three-act pacing-curve per-chapter budget (`distributeChapterWordBudget`) and `resolveSceneWordBudget` stops the uniform `Math.max(scene, chapterTargetWords)` floor clobbering per-scene budgets. 9 scene-word-budget + 4 scene-job-authority tests green. Default OFF (reverts to model grid). Accept on a live run. |
| P1.4 | Agent 2b voice gate | ☑ | **Landed (flag-gated).** `AGENT2B_VOICE_CHECK=enforce` runs the bounded retry — `voiceGatePass`: `uniqueRegisters ≥ ceil(0.6×count) && duplicatePairs==0 && deployableCount==count`, ≤`AGENT2B_VOICE_MAX_RETRIES` (default 1), accept-after-exhaustion keeps best-so-far. `signatureTic` added to `CharacterProfileOutput` + leads the VoiceCapsule tic list. 8 tests green. Default OFF (`off`/`shadow`/`enforce`). **Never enable with P1.3 in the same run.** Accept on a live run. |
| P2.1 | Agent 6 fooled-then-convinced + herring gate | ☑ | **Landed (flag-gated, default OFF).** New `AGENT6_REVEAL_GATE` (off/shadow/enforce) + pure module `agent6-reveal-gate.ts`. **T2.1**: early+mid-only blind reader added (`blindReaderSimulation` gains a `placementFilter`); naming the culprit pre-reversal = `too_obvious`. The legacy full-clue reader stays the "convinced"/solvability stage. **T2.2**: `auditRedHerringTargets` reads `CASE.red_herrings[].points_at_suspect` (not the runtime clues) vs culprits. **T2.3**: `auditDeathMethodDeducibility` requires an essential early|mid clue to surface the death-method (curated synonym stems, mirroring rubric-score's `DEATH_METHOD_TOKENS` — fixes the false pos/neg of a blind prefix match). `namesMatch` is surname-based (no "Ann"⊂"Joanna" substring collisions). enforce flips the audit to needs-revision (routed through the existing binding gate, respects forceWarnings) — **never a new throw** (MEMORY: no-backstop gates kill runs). 14 reveal-gate tests + agent6 suites green. Accept on a live run. |
| P2.2 | Agent 3b plausibility judge leg | ☑ | **Landed (flag-gated, default OFF).** New `agent3b-plausibility-judge.ts`: focused single-question LLM judge (`judgeMechanismPlausibility`, never throws), `AGENT3B_PLAUSIBILITY_FLOOR=80`, `plausibilityGatePass`, `buildPlausibilityJudgeFeedback`. `AGENT3B_PLAUSIBILITY_JUDGE` (off/shadow/enforce): shadow scores+logs; enforce bounded regenerate-with-feedback (≤`AGENT3B_PLAUSIBILITY_MAX_RETRIES`, hard-capped 3) below the floor, accept-best-by-score, re-validates schema each candidate. Per-call cost computed as a byAgent delta (no double-count). No upstream skip decision (Phase-1 novelty `server.ts` trap N/A). 5 judge tests green. Accept on a live run. |
| P2.3 | Agent 2c crime-scene profiling | ☑ | **Landed (flag-gated, default OFF).** New `agent2c-location-distinctness.ts`: **T2.8** `checkLocationDistinctness` (Jaccard atom overlap >0.5 on raw `sensoryDetails` arrays + shared primary mood; **excludes the injected deterministic fallback atoms** so sparse rooms don't collide falsely); **T2.7** `checkCrimeSceneProfiled` verifies a crime-scene-purposed keyLocation exists (no broad `meta.setting.location` hint — it isn't a room; **room-accuracy still needs the deferred 2c-after-7 reorder**). `AGENT2C_SCENE_GATE` (off/shadow/enforce): shadow warns; enforce bounded regenerate-with-feedback (≤`AGENT2C_SCENE_GATE_MAX_RETRIES`, capped 2), accept fewest-issues, re-validates. No pipeline reorder (keeps the 2c→6.5 dependency intact). 10 distinctness tests green. Accept on a live run. |
| P3 | Honest scorers (Agents 1/2/2c/2e/3/3b/7) | ☑ | **Landed (umbrella flag `HONEST_SCORERS`, off/shadow/enforce, default OFF).** Six new "grade the REAL artifact" scorers in `@cml/story-validation` (`scoreRealSetting`/`scoreRealLocations`/`scoreRealBackground`/`scoreRealCml`/`scoreRealHardLogic`/`scoreRealNarrative`) + the pre-existing `scoreRealCast` now wired. Shared `applyHonestScorer` (worker `shared.ts`) branches each agent's `scoreOutput`: shadow logs the vanity↔honest delta + returns vanity; enforce returns honest; off byte-identical. T3.1 grade real setting incl. atmosphere; T3.2 wire `scoreRealCast`+`checkCast`; T3.3 distinct sensory atoms not words; T3.4 grade 2e's own artifact (anchors are real cast names, no Agent-1 echo); T3.5 CML content assertions replacing the hardcoded 100s; T3.6 device depth not length; T3.7 scene concision-near-budget not length. Scorers live in story-validation with local mirror types (no prompts-llm cycle). Safe by default — pre-Agent9 retries are OFF, so enforce changes the logged grade/aggregate, not run flow. 13 honest-scorer tests; story-validation 278 / worker 210 / prompts-llm 478 green. Non-scorer halves deferred: T3.1 pipe atmosphere→Agent 9, T3.8 season/2c contract. Accept on a live run (shadow first). |

---

## 7. Run plan (shadow-first, one gate per replay)

> **Order update (2026-06-25):** the ladder below is now **Milestone B of §8** — it runs *after* Milestone A (rubric honesty: Fix #1 + the deterministic victim-alive cap + `HONEST_SCORERS`). The mechanics here (how to launch, what to read, shadow→enforce) are unchanged; only the *order* and the rule "don't accept a flag against a dishonest rubric" are added by §8.

### 7.0 Prerequisites (all **landed**)
- **P1.1 skip-ownership** fixed in `server.ts` — the cross-run threshold cap now actually fires (was a dead flip).
- **P1.2 prompt/validator aligned** on `deriveClueObservable` across `clue-validation.ts` + `deterministic-repair.ts` — no false-fail clue-obligation churn once `observable` appears; byte-identical until it does.
- **Retry-gate guard** (`retry-gate-guard.ts`, wired in `mystery-orchestrator.ts`) — **refuses to start with >1 retry-bearing enforce gate** (`ALLOW_MULTIPLE_RETRY_GATES=1` to override) and logs the worst-case extra-call budget.
- Before P1.1: ensure `.env.local` `NOVELTY_SIMILARITY_THRESHOLD` is **unset or < 1** (it's the operator value the 0.7 cap lowers from).

### 7.1 How to run one replay
Full pipeline (Git Bash; an env prefix sets the flag for that one run only):
```bash
# baseline (no flags) — the comparison point
npm run canary:core

# one gate in shadow (telemetry only, no behaviour change)
AGENT6_REVEAL_GATE=shadow npm run canary:core

# same gate promoted to enforce (acts on failures)
AGENT6_REVEAL_GATE=enforce npm run canary:core
```
Inputs come from the canary inputs file (`CANARY_INPUTS_FILE` is echoed at start). `build:all` runs first, so source edits are picked up.

### 7.2 What to read after each run
1. **Console** — `CANARY_STATUS`, `RUN_ID`, `WARNINGS` (first 6) and `STORY_SAVED <path>`.
2. **Gate telemetry** — grep the saved report's `warnings` for the gate's tag (console truncates to 6):
   `[retry-gate-guard] …`, `[agent6-reveal-gate][shadow|enforce] …`, `[agent3b-plausibility][…] gate=… score=…`, `[agent2c-scene-gate][…] …`, `[agent2b-voice-check][…] …`. Novelty: look for `Novelty check skipped` (bad — still skipping) vs an actual similarity score.
3. **Rubric scores** — the run report JSON under `apps/api/data/reports/<project>/run_<RUN_ID>.json` (`scoringReport` / phase categories). Compare against the **baseline `run_9b824eb2`: 71 LLM / 68 shadow; `pacing 6`, `opening_hook 6`, `premise 7`, `dialogue 7`.**
4. **The story** — `stories/story_<date>/<slug>.md` for a human read of the chapter(s) the gate targets.

### 7.3 The ladder (run top-to-bottom; accept before moving on)

| Step | Flag (shadow → enforce) | Target category | Accept when | Reject / rollback |
|---|---|---|---|---|
| P1.1 | `NOVELTY_CROSS_RUN=1` | `premise` 7→≥8 | audit fires (real score, no "skipped") **and** two runs diverge on ≥2 structural fields; `premise` ↑ | flag OFF; keep `NOVELTY_HARD_FAIL=false` until proven |
| P1.2 | *(no flag — already active)* | `clues`/`prose` leakage | no spec-sentence string in prose; no clue-obligation false-fails in telemetry | revert read-sites to `description` |
| P1.3 | `AGENT7_SCHEDULER_AUTHORITATIVE` | `pacing`/`opening_hook` 6→≥7 | both ↑ **and** Ch1 stops restating one contradiction ≥3× | flag OFF (reverts to model grid) |
| P1.4 | `AGENT2B_VOICE_CHECK` | `dialogue` 7→≥8 | ≥3 distinct registers; `dialogue` ↑. **Never in the same run as P1.3** (guard blocks it) | flag OFF |
| P2.1 | `AGENT6_REVEAL_GATE` | `ending` (surprise) | shadow shows sane `too_obvious`/herring/death-method verdicts that **converge**; then enforce; `ending` ↑ | flag OFF (no throw either way) |
| P2.2 | `AGENT3B_PLAUSIBILITY_JUDGE` | `premise` (plausibility) | shadow `score=` values track human judgement → calibrate the 80 floor → enforce; `premise` ↑ | flag OFF |
| P2.3 | `AGENT2C_SCENE_GATE` | `atmosphere` (hold) | distinctness/crime-scene warnings are real (not fallback-atom noise); `atmosphere` does not regress | flag OFF. T2.7 room-accuracy still needs the deferred 2c-after-7 reorder |

### 7.4 The loop (per row)
1. Run **shadow** → read the gate telemetry (§7.2.2). If it's flagging nonsense, fix the gate before enforcing.
2. Run **enforce** → compare the report's target category against the baseline (§7.2.3) and skim the story (§7.2.4).
3. **Accept** only if the target category moved up *and* nothing else regressed; otherwise set the flag back OFF.
4. Keep the accepted flag on, move to the next row. **One flag per replay** — the guard enforces the retry-gate half automatically.

Target: [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md) — overall LLM ≥80 after the full ladder (see §5 acceptance table).

---

## 8. Resequenced execution order (authoritative, 2026-06-25)

> Computed by a 4-lens design panel (dependency / ROI / risk / alignment) after the external ChatGPT re-score of the rubric-72 story returned **56** — a **16-point over-score**. **This order supersedes §4–§5 for execution;** those sections remain the per-item rationale.

**Governing principle — make the measuring stick honest before reading anything off it.** The over-score is *not* a missing safety net but a **blindfolded** one: the hard-caps that should catch the worst defects already exist — `hard-caps.ts:33` caps `character_clarity ≤3` on dead-victim, `hard-caps.ts:66` caps `prose ≤4 / overall ≤65` on leakage — but their fact extractors are blind to the actual defects (`facts.ts:135` defaults `deadVictimAppearsAlive` to the **soft LLM judge**, which waved an alive victim through as "clearly dead"; `prose-guard/fidelity.ts:112` `TEMPLATE_LEAKAGE` omits the deterministic-fallback strings). So: **feed the existing caps deterministic facts + clean the source that trips them FIRST** (no flags, offline-acceptable), **prove honesty via `HONEST_SCORERS` shadow→enforce**, *then* resume the one-flag-per-run ladder against a trustworthy rubric — preserving the hard dependencies (stable clue IDs P1.2 before scheduler P1.3; never two retry-bearing gates in one run; shadow before enforce).

**Milestone A — Rubric honesty (no flags; offline / shadow acceptable; do FIRST):**

| # | Item | Why (condensed) | Acceptance gate |
|--:|---|---|---|
| 1 | **Fix #1a — harden the leakage DETECTOR** (`TEMPLATE_LEAKAGE`/`detectTemplateLeakage`) | The leakage cap already exists but matches none of the fallback strings → reclaims the largest slice of the 16-pt over-score; always-on, lowest blast radius | Offline re-score of the rubric-72 story: `detectTemplateLeakage` ≥2 fragments → cap fires → overall drops toward 56; ordinary "observable"/"contract" prose NOT matched; prose-guard + rubric-score suites green |
| 2 | **Fix #1b — clean the SOURCE + gate the fallback commit** (`deterministic-repair.ts`) | Once the rubric SEES the leak, the `preferCompletionOnFailure` path tanks real runs, so ship in the same PR pair: replace token-dumps/canned narration with grammatical prose; refuse to ship a tripping chapter (one more bounded repair, **never** a hard abort) | Forced-exhaustion unit test emits prose with 0 leakage hits / 0 comma-dumps; a hard-clue canary completes 10/10 with no abort and no leaked-scaffold prop |
| 3 | **Victim-alive HARD-CAP honesty** — make `facts.deadVictimAppearsAlive` deterministic | Wire the already-computed `victim_reappears_alive` lifecycle event into the fact extractor so the cap fires from FACTS not the soft judge; completes the rubric-honesty triad | Offline re-score of the Eleanor-speaks-after-death story → `deadVictimAppearsAlive=true` → `character_clarity ≤3`, `overall ≤60` (matches external 2/10); clean story does not trip it; multi-sentence post-death test |
| 4 | **P3 `HONEST_SCORERS=shadow`** (Agents 1/2/2c/2e/3/3b/7) | Confirm the per-agent vanity↔honest deltas; zero run-flow change; second half of rubric honesty | Stable-across-two-runs deltas that track the external read; no scorer throws |
| 5 | **P3 `HONEST_SCORERS=enforce`** (pre-Agent9 retries stay OFF) | Keystone: the rubric becomes trustworthy end-to-end; only logged grade changes; regression insurance | Enforced honest overall/per-category lands within single digits of an external re-score of the same story (72-vs-56 collapses); a regressed artifact now FAILS |

**Milestone B — Flag-flip ladder against the now-honest stick (one flag per replay, shadow→enforce):**

| # | Item | Depends on | Acceptance gate |
|--:|---|---|---|
| 6 | **P1.2** clue restructure (already active, no flag) | honest rubric (5) | no spec-sentence/comma-dump survives into prose; no two non-optional clues share a normalized `pointsTo`; clues/prose not regressed — **must precede P1.3** (stable IDs) |
| 7 | **P1.1** novelty (`NOVELTY_CROSS_RUN`, hard-fail OFF) | honest rubric (5) | two runs diverge on ≥2 structural fields; real similarity score (never "skipped"); `premise` ↑; no abort/retry loop |
| 8 | **P1.3** scheduler authority + word budget + opening-hook (`AGENT7_SCHEDULER_AUTHORITATIVE`) | P1.2 stable IDs (6) | `pacing` + `opening_hook` ↑; Ch1 stops restating one contradiction ≥3×; Scene 1 opens on body/discovery; sole retry gate this run |
| 9 | **P1.4** voice gate (`AGENT2B_VOICE_CHECK`) + `signatureTic` | P1.3 accepted, **not co-flipped** | ≥3 distinct registers, `duplicatePairs==0`, `dialogue` ↑; guard confirms P1.3 OFF this run |
| 10 | **P2.2** plausibility judge (`AGENT3B_PLAUSIBILITY_JUDGE`) + T2.6 cap | honest rubric (5); sole retry gate | shadow scores track external → 80 floor calibrated → enforce raises `premise`(plausibility), bounded regen ≤3, no abort |
| 11 | **P2.1** reveal gate (`AGENT6_REVEAL_GATE`) + T2.9 anti-trope-motive validator | stable clues (6); sole retry gate | shadow `too_obvious`/herring/death-method verdicts converge (no false pos on baseline); enforce raises `ending`(surprise); never a new throw |
| 12 | **P2.3** crime-scene + distinctness (`AGENT2C_SCENE_GATE`) — HOLD lever | honest rubric (5); sole retry gate | warnings are real (not fallback-atom noise); enforce holds `atmosphere`; bounded regen ≤2 |

**Milestone C — Heavy structural + deferred (after cheap reversible levers are banked):**

| # | Item | Depends on | Acceptance gate |
|--:|---|---|---|
| 13 | **Victim-alive STRUCTURAL fix — Option A** (enlarge cast / add a witness char + harden the victim-reappears validator) | rank 3 cap proves the fix; Agent-2 cast-shape work | victim never speaks/acts post-death (validator clean, not 1-sentence reframed); `character_clarity` ↑; rank-3 cap fires on a planted regression. **Path A over B** — B reassigns the canonical victim/case identity that clues/herrings/Agent-6 all key off (far higher blast radius) |
| 14 | **T3.1 non-scorer half** (pipe Agent-1 atmosphere into Agent 9) → **T3.8** (Agent-1↔2c season/time contract) | P2.3 (12) + honest setting scorer (5) | shipped season/atmosphere matches Agent-1 (no autumn→summer flip); `atmosphere` holds/rises; contract fails a mismatched 1/2c fixture |
| 15 | **Residual prose polish** — boundary-integrity quotes, Ch9/Ch10 overlap, pronoun slips; extend `AGENT9_MUTATION_REVALIDATION` across the full post-processing chain | P1.3 (8) absorbs the Ch9/Ch10 smear | balanced quotes; no Ch9/Ch10 double-clearance; stable pronouns; any post-Agent9 mutation that regresses a validator auto-reverts |

**Sequencing one-liner:** rubric-honesty first (Fix#1 detector → Fix#1 source+commit-gate → deterministic victim-alive cap → `HONEST_SCORERS` shadow→enforce) → then the ladder against the now-honest stick (P1.2 clue IDs → P1.1 novelty → P1.3 scheduler+opening-hook → P1.4 voice [separate run] → P2.2 plausibility → P2.1 reveal+T2.9 → P2.3 scene-hold) → then heavy structural + deferred (victim-alive cast Option A → T3.1/T3.8 → prose-residual polish).

**Top risks if misordered:** (1) **False-accept lock-in** — flipping any flag before ranks 1–5 accepts it on a rubric that over-scores by 16, the canonical rework, and can silently lock in a regression scored as a win (the reason this inverts the doc's "Phase 3 last"). (2) **Blind-cap trap** — Fix #1b without #1a leaves the cap blind; #1a without #1b tanks legitimately-stuck chapters → ship as a pair. (3) **Retry-gate collision** — P1.3+P1.4 in one run (guard refuses). (4) **Stale-clue-ID cascade** — P1.3 before P1.2 accepted smears Ch9/Ch10. (5) **Soft-judge blindfold** — skipping rank 3 leaves `character_clarity` hostage to the judge that already mis-declared an alive victim "dead". (6) **Enforce-without-shadow** — skipping the zero-blast-radius probe that catches a mis-firing gate.

---

## 9. Strategic checkpoint (2026-06-26) — is the score actually moving?

**Observation.** After landing Phases 0–3 (flag-OFF), the three Agent-9 linter false-positive fixes, and Fix #1 (rank 1–2), the internal prose rubric has stayed **flat ~61–62** across live canary runs (the one 72 was leakage-inflated *and* a lucky generation). This is **expected** at this point of the §8 order — every step so far is either flag-OFF or *rubric-honesty* (which makes the number truthful, not higher); **no quality lever has been flipped in a live run yet**, so there is as yet *zero evidence* any lever moves the score.

**Structural-ceiling hypothesis (from reading the shipped stories).** Two caps live upstream of the category levers and won't be moved by them:
- **Unstable cast/victim roles.** The fixed 4-person canary cast is re-assigned roles per run: Eleanor was the *victim* in `run_20260625-2151` (dead but speaking — the ChatGPT cap) and the *detective* in `run_20260625-2335`; the victim is not always clearly named in the prose. Fair-play coherence problem.
- **Near-clone premise every run** — novelty 0.68–0.72, always the clock-tampering seaside-hotel murder (~seed "The Second Key"). ChatGPT's biggest caps were "predictable/clone" + victim coherence — both structural.

**Decision — levers-on probe (breaks the one-flag-per-run discipline on purpose).** Run one canary with **all** quality levers enforced at once to answer: *can the ladder move the score at all, or is the ceiling structural?*
`NOVELTY_CROSS_RUN=1 AGENT7_SCHEDULER_AUTHORITATIVE=1 AGENT2B_VOICE_CHECK=enforce AGENT6_REVEAL_GATE=enforce AGENT3B_PLAUSIBILITY_JUDGE=enforce HONEST_SCORERS=enforce ALLOW_MULTIPLE_RETRY_GATES=1 AGENT_PRE9_ENABLE_LLM_RETRIES=1` (+ forceWarnings inputs, `--use-system-ca`).
- **If the rubric jumps** → the approach works; bisect to attribute per lever, then resume the disciplined §8 ladder.
- **If it stays ~62** → decisive evidence the bottleneck is **structural**; pivot to varying the theme/seed per run + fixing role assignment (the victim-alive cast work, §8 rank 13, and a premise-diversity lever) *before* further category-lever tuning.

**Result (probe 2026-06-26, all levers enforced):** **Structural ceiling CONFIRMED — decisively.** The levers all engaged and work mechanically (live evidence: `[honest-scorer][enforce]` de-inflated agent2-cast **88→79/C**, agent3b **100→87/B**; `[agent3b-plausibility][enforce]` fired *"score 30 < 80 → regenerating"*; reveal/voice gates ran). But the run produced **no rubric at all** — it reached prose, then **threw at the final `StoryValidationPipeline`**:
- `[critical] deceased_character_confesses`: the victim **Eleanor Voss** has confession language in Ch9 (victim-alive again — roles shifted vs `run_2151`, where she was the detective).
- `[major] cleared_culprit_conflict`: the culprit **Beatrice Quill** is *cleared* in Ch9 yet marked culprit.

**Verdict.** The category levers (pacing/voice/reveal/plausibility/honest-scorers) are **not** the bottleneck — they can't even be *scored*, because the case core is structurally incoherent (a dead victim speaks; the culprit is cleared). No pacing/dialogue tuning fixes that. **Pivot (as pre-agreed): role-coherence is now the top priority, ahead of the flag ladder.** Concretely:
1. **Victim-alive → deterministic REPAIR, not terminal abort** (open A_43 G/H/I, §1 line 102): `deceased_character_confesses` currently throws the whole run; it should repair (reframe/strip the dead victim's late-chapter dialogue) so the run completes coherently. §8 rank 3 makes the *cap* honest; this is the *repair* half.
2. **`cleared_culprit_conflict`**: the false-clearing logic cleared the *actual culprit* — a CML/Agent-6 fair-play logic error to fix upstream.
3. **Premise/role diversity** (§8 rank 13 + a new premise-diversity lever): the fixed 4-person cast yields a near-clone premise *and* unstable victim/culprit assignment each run — the upstream driver of both failures above.
These supersede the Milestone-B flag flips as the next work — the flags are proven-good machinery sitting on a structurally-broken core.

### §9.1 — Role-coherence fixes landed (2026-06-26)

Both abort causes from §9 are now addressed at their roots. Status: **landed + typecheck-clean + unit-tested; live re-test in flight** (levers-on canary, same probe config as §9).

**Fix A — Victim-alive → deterministic REPAIR, not abort (§9 item 1).** The `deceased_character_confesses` / `victim_reappears_alive` aborts were caused by **detector/repair drift**: the validator's death/confession/active-verb regexes and the Agent 9 rescue pass had diverged, so the rescue missed exactly the sentences the validator flagged.
- The detector regexes are now the **single source of truth** — exported from `character-lifecycle-validator.ts` (`DEATH_RE`, `CONFESSION_RE`, `ACTIVE_VERB_RE`, `RECOLLECTION_FRAME_RE`) and imported by `agent9-run.ts`'s `applyCanonicalVictimRescue`, which now strips/reframes a dead victim's late-chapter confession+active-voice sentences using the *same* patterns the validator enforces (with a recollection-frame exception so "she remembered saying…" is not a reappearance). Off-by-one fixed (`<` not `<=` on `deadByChapter`).
- `cleared_culprit_conflict` added to `REPAIRABLE_ISSUE_TYPES` so it routes to repair, not terminal abort.

**Fix B — Clearance machinery must never clear the actual culprit (§9 item 2).** Root cause of `cleared_culprit_conflict`: the deterministic clearance authoring and the Agent-3 CML writeback could both emit a clearance scene for the *culprit*. Closed at both sources:
- `deterministic-repair.ts` `resolveBatchMatchingClearances` — `allClearanceScenes` now filters out any entry whose `suspect_name` is a culprit (via `culpability.culprits`) **or** the victim, mirroring the prior victim-only exclusion.
- `agent3-cml.ts` — before writeback, LLM-authored `existingClearances` entries matching a culprit **or** a detective-cast name are spliced out.
- The `character-lifecycle-validator.ts` cleared-event emitter also now suppresses a culprit's *negated* clearance ("alibi collapsed/unravelled") so a broken alibi is not mistaken for a standing clearance.

**Tests.** `character-lifecycle-confession.test.ts` (cleared-culprit guard, 5 cases); `agent9-locked-facts.test.ts` (comprehensive 3-sentence rescue asserting `repairCount===3` + default-safe no-op); `agent9-clearance-culprit.test.ts` (culprit **and** victim never appear in resolved clearances; genuine non-culprit suspect still clearable). All green.

**Re-test — DONE (`run_mystery-1782504792424`, 2026-06-26 21:28, all 6 levers enforced + `forceWarnings`).** ✅ The fixes held under levers-on: the run **completed end-to-end (status `warning`, no abort)** — `deceased_character_confesses` / `cleared_culprit_conflict` did **not** recur. So the §9 probe is finally answerable.

### §9.2 — Levers-on probe verdict (2026-06-26): structural ceiling CONFIRMED

**Final-Story rubric: `63` ("Promising but rough").** Context: plain run earlier today `59` → levers-on `63` → Tier-1 baseline `run_9b824eb2` `71`.

| Category | Plain `59` | Levers `63` | Read |
|---|:--:|:--:|---|
| dialogue | 5 | **7** | +2 — **voice gate (P1.4) works**; bankable |
| atmosphere | 7 | **8** | +1 — bankable |
| premise | 7 | 7 | flat — cross-run novelty diverged from 4 runs but **still landed "The Second Key" 0.69** (clone attractor held) |
| pacing | 5 | 5 | flat — **scheduler authority (P1.3) did NOT move it** |
| plot_structure | 5 | 5 | flat |
| clues 6 · opening_hook 6 · character_clarity 6 · ending 7 · prose 6 | | | |

**Levers verifiably engaged:** `[honest-scorer][enforce]` de-inflated agent2-cast `88/B→79/C`; cross-run novelty `diverging from 4 recent run(s)`; retry-gate-guard logged 3 enforce gates (voice + plausibility + reveal). Integrity assertions pass; boundary-integrity 0; pronoun-drift 0.

**Still fails the release gate** (0 hard-stops, warning-level, `forceWarnings` kept it from aborting): `fair play audit needs revision (70/100)` + a **critical temporal-continuity issue** + `scene-grounding coverage 6/10` (up from 3/9).

**Verdict (per the §9 criterion "if it stays ~62 → structural").** `63` = stayed ~62 — it did **not** jump. The levers give *real but marginal* gains (dialogue +2, atmosphere +1) and **cannot break the ceiling**, because the three things capping the score are all structural and lever-proof: (1) the **clone premise** — cross-run novelty alone is now *proven insufficient* to escape the "The Second Key" attractor; (2) **pacing/plot stuck at 5** (repetitive contradictions, not length — P1.3 didn't move it); (3) the **same fair-play/continuity/grounding triad** still failing the gate.

**→ Structural-pivot branch fires. Next work, in order:**
1. **Premise/role-diversity lever** — vary theme/seed per run (cross-run novelty is insufficient on its own; this is the only thing that moves `premise` off 7).
2. **§8 rank 13 — victim-alive cast Option A** (enlarge cast / add a witness) — the root of the continuity + fair-play coherence failures and the per-run role reassignment.
3. **The release-gate triad** — fair-play 70/100, temporal-continuity, scene-grounding 6/10.
4. **Then bank P1.4 (dialogue) + atmosphere** via the disciplined §8 Milestone-B ladder — *after* the structural floor lifts; they will not reach 70 alone.

### §9.3 — Verified root cause of the probe's structural cap (artifact-traced, 2026-06-26)

The judge's three `flags` on the probe (`RubricScorer`, total 60) were traced to their originating agents by reading the run's artifacts (`stories/story_20260626-2128/` + `documentation/prompts/actual/run_20260626-2013_mystery/`). **The prose is internally consistent** — the clock anchors (`twenty minutes past eight` frozen hands vs the `ninth chime`, true death `nine minutes past nine`) are stated identically across Ch1/2/8/9/10 with zero drift. The cap is **upstream case incoherence**, not prose:

- **🔑 Agent 3b device is OFF-THEME and IGNORED by Agent 3 — and the new plausibility lever amplified it.** The canary theme is locked to *clock-tampering*, but Agent 3b generated unrelated devices (call 1 = "Thermal Alibi"/gramophone; **call 2, forced by `AGENT3B_PLAUSIBILITY_JUDGE=enforce` after "score 30 < 80 → regenerating", = a tide/drowning device + "Illusive Ledger"**). Agent 3's CML **ignores 3b's device entirely** (CML response: 39× clock, 0× tide/thermal/drown) and builds the clock case from the theme. Net: 3b's `lockedFacts` — the supposed canonical anchors feeding the locked-fact registry/gate — come from a call whose device the CML doesn't use; call 1's facts happened to match (`twenty past eight`/`nine past nine`), but the **regeneration left the *final stored* 3b artifact at "five/ten past ten" (a different clock), diverging from the case.** So the lever we enforced burns LLM calls AND produces an incoherent final 3b artifact. *(Lever caveat for P2.2: the plausibility judge regenerates a device the pipeline discards — wire it to the device Agent 3 actually consumes, or constrain 3b to the locked theme, before crediting `premise`.)*
- **Flag #2 (unfair reveal) — Agent 3 thin `discriminating_test` → Agent 5 planting gap.** The reveal leans on Hale's *"mechanical knowledge"* and *"dining logs"* (Ch8–10) that **no earlier chapter plants** — Ch1–7 give Hale only "professional jealousy," and the dining log first appears at the reveal. Agent 3's `discriminating_test` never names a concrete discriminator, so Agent 5 extracted none and Agent 9 invented the connective tissue at reveal time. This is the `fair play audit 70/100`.
- **Flag #1 (clock explained too early) — Agent 7 ordering.** The "clock was made to lie" beat is telegraphed Ch1–2 and fully resolved Ch7, but the `discriminating_test_scene` is mapped to Ch8 — nothing is left for the test to reveal. **`AGENT7_SCHEDULER_AUTHORITATIVE` was ON this run and did NOT fix it** (it stamps clue *jobs*, not the mechanism-explanation beat) — a gap in the scheduler's authority.
- **Role coherence is OK; pronoun slips remain (lower priority).** Victim = Dr. Mallory Finch, culprit = Capt. Ivor Hale, detective = Eleanor Voss (matches CML). But Agent 9's pronoun sweep mis-genders Hale ("she" at the confession) and renders Eleanor "he" at the close — surface coreference corruption (the known post-process layer), not a logic break.

**Ranked single upstream fixes (most flags cleared first):** (1) **constrain Agent 3b to the locked theme + reconcile its `lockedFacts` with the device Agent 3 actually consumes** (clears the phantom "contradiction" + de-risks the P2.2 lever); (2) **make Agent 3's `discriminating_test` name a concrete discriminator and have Agent 5 plant it early** (clears the unfair-reveal / fair-play 70); (3) **extend `AGENT7_SCHEDULER_AUTHORITATIVE` to order the mechanism-explanation beat, not just clue jobs** (clears early-reveal + pacing). Each is a bounded, flag-OFF + unit-tested change per the §5 discipline — *not* a refactor.
