# ANALYSIS_70 — The outstanding-issues board after the 2026-07-27 pool run

**Written:** 2026-07-27 · **Trigger:** owner's request — *"review all outstanding issues from recent runs."* · **Regime:** corpus era (A_63 §2.8) — behaviour levers ship flag-gated default-OFF, probed before promotion; runtime env getters, never module consts.

**Type:** a BOARD, not a plan. It records what is *outstanding*, what the evidence for each item actually is, and — where a prior doc's premise turned out to be wrong — says so. Nothing here is scheduled. Two items were closed by building; the rest are open.

**Method note, load-bearing:** every claim below is marked **MEASURED** (I ran the check and quote the output), **INFERRED** (follows from code reading, not observed on a run), or **UNBASELINED** (a number with no comparison point yet). A_68 §8's top recommendation rested on an unmarked frequency claim that turns out to be false — §2 — so the marking is the point, not decoration.

---

## 1. The runs under review

| Run | Date | Ships? | Rubric | Notes |
|---|---|---|---|---|
| `run_e68c8118` | 07-24 | yes | — | pool member; report `run_outcome: failed`, weakest phase Cast Design |
| `run_6dc1ee3a` | 07-24 | yes | — | pool member; same shape |
| `run_477bb27a` | 07-24 | yes | — | pool member; the run A_69 measures throughout |
| `story_20260724-1841` sundial | 07-24 | yes | **72** external | A_68's subject |
| `mystery-1785175520689` | **07-27** | yes (gate `warning`) | **66** internal | fresh pool run, built for the N≥4 A/B. This doc's main new evidence |

**MEASURED — the 07-27 run shipped.** `CANARY_STATUS failure` is *phase-threshold noise*: [canary-core.mjs:161](../../scripts/canary-core.mjs#L161) states outright that `result.status` "may read 'failure' on a shipped run … it must never decide the exit code." The authoritative signal is `CANARY_RELEASE_GATE warning` → `shipped` → exit 0. **Anyone triaging a run by `CANARY_STATUS` will misread it.** I did, initially.

---

## 2. The load-bearing correction — A_68 §8's #1 recommendation rests on a false premise

A_68 §8 names `AGENT9_REGEN_SUSPECT_ELIM` the single biggest lift, priced *"76 → mid-80s on any run where a clearance floor fires **(common)**."* The parenthesis is the whole argument, and it is not supported.

**MEASURED, three independent ways:**

1. The injector's exact template ([agent9-run.ts:2363](../../apps/worker/src/jobs/agents/agent9-run.ts#L2363), *"`<Surname>` was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime."*) appears **0 times across all 14 shipped stories** — including the manor-clock **81**, the bell-tower **79** and the sundial **72**.
2. The 07-27 run's log shows `enforceLockedFactValuePresence` injecting, and **no `enforceSuspectEliminationPresence` firing at all**. The injector `console.warn`s on every injection ([agent9-run.ts:2297](../../apps/worker/src/jobs/agents/agent9-run.ts#L2297)), so silence is evidence.
3. `detectReportStyleClearance` — the cap A_68 says that injection trips — returns **clean on 14/14 shipped stories**. Run over whole stories, which can only *over*-fire, so a clean result is a strong negative.

**INFERRED — why.** The already-present predicate is very broad: `ELIMINATION_TERMS` (cleared|ruled out|eliminated|innocent|alibi confirmed|could not have) **AND** `EVIDENCE_TERMS` (evidence|because|therefore|proof|alibi|timeline|observation). Ordinary Golden-Age prose about a suspect satisfies both almost every time, so the floor reads as already-met and declines to inject.

**Honest limit — it is not "never".** The injector *did* fire in the 1715 probe replay; that is exactly how commit `fa160350` discovered it was clearing the **victim** of murder. Replays regenerate prose, so the floor can fire there. The defensible claim is **0/14 shipped stories and 0/4 pool runs**, not zero-always.

**Consequence.** An 8-replay A/B on this flag would return mostly no-op pairs — a null result by construction, for ~£4–8 and ~2h. **It was not run.** A_68 §8's priority-1 line needs amending: the *prose problem* it describes may well be real, but **the injector is not its source**, so an injector→regen swap cannot be the fix. Finding the actual source of report-style clearance prose is open work.

---

## 3. The recurring architecture bug: fixes aimed at a layer that runs too early

This is the same defect three times, and it is the most valuable pattern on the board.

| Instance | Fix aimed at | Injection actually happens | Outcome |
|---|---|---|---|
| A_67 polish strengthening | LLM polish prompt | `deterministic-repair.ts` **after** validation | A_68 §2 caught it; fixed at source |
| A_69 whole-story diagnostic | `generate.ts` | prose keeps changing after `generate.ts` returns | anchor rate 60%; moved to ship layer → 100% |
| **`"In a remembered moment, "`** | polish prompt | `agent9-run.ts` **after** `generateProse` | **OPEN — new in this doc** |

**MEASURED.** `"in a remembered moment"` appears **28 times in one shipped story** (`the_bell_tower_s_last_chime.md`, the 79), 4 times in `the_tidal_deception.md`, and 4 times in the 07-27 run. It is the most-repeated machine phrase in the corpus.

**MEASURED — it is a deterministic injection, not an LLM tic.** `VICTIM_RECOLLECTION_PREFIX = "In a remembered moment, "` ([agent9-run.ts:1948](../../apps/worker/src/jobs/agents/agent9-run.ts#L1948)), applied by `applyCanonicalVictimRescue` to reframe active-victim sentences so the character-lifecycle validator passes. The 07-27 log reads *"reframed **4** active-victim sentence(s) … for 1 canonical victim(s): Hugo Vane"* — and the story contains exactly **4**. Causal, one-to-one.

**MEASURED — the fix that exists cannot work.** [post-pass-polish.ts:107](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L107) explicitly instructs the polish LLM to remove *"a repeated stock filler (\"in a remembered moment\")"*. But polish runs inside `generateProse` (called at [agent9-run.ts:4314](../../apps/worker/src/jobs/agents/agent9-run.ts#L4314)) and the injection happens at lines **5949 / 6195** — roughly 1,600 lines later. **The polish pass is instructed to delete a phrase that does not exist yet.**

**MEASURED again, live, mid-A/B.** The first control arm of the §8 A/B (replaying `e68c8118`) logged *"reframed **8** active-victim sentence(s) as recollection for 1 canonical victim(s): Lady Beatrice Marwood."* — 8 more injections of the identical frame, in a different premise, on a run nobody was watching for it. The volume is not a bell-tower peculiarity.

**Why it matters beyond one phrase.** The bell-tower scored **79** with 28 identical stock openers in it. A validator-satisfying deterministic reframe is buying lifecycle-correctness at direct cost to prose. Two shapes of fix, both open:
- vary the frame (a small phrase bank) — cheap, mechanical, no LLM;
- move the rescue *before* polish, or give it its own guarded LLM reframe with the deterministic string as rollback floor — the A_68 §8 "guiding principle" applied to the one injector that provably ships at volume.

**Note this is not the cross-chapter polish's job.** `AGENT9_FULLSTORY_POLISH` (currently in A/B, §8) works on n-grams *within* `generate.ts`, so it is upstream of this injection too and cannot see it either.

---

## 4. Reporting integrity — a failed run persists a report claiming 96 A

**MEASURED.** The 07-27 run's persisted report (`apps/api/data/reports/mystery-1785175520689/`) reads:

```
overall_score: 96   grade: A   run_outcome: passed
phases_passed: 13   phases_failed: 0   pass_rate: 100
in_progress: true   generated_at: 18:11:19   total_cost: 0.0222
phases: Setting Refinement … Narrative Outline        ← stops at Agent 7
```

The run's *actual* outcome: internal rubric **66**, three chapters failing validation, release gate `warning`. The 96/A report is a **stale in-progress snapshot frozen at 18:11**, before Agent 9 finished at 18:22 — it contains no Prose Generation, no validation, no rubric phase, and a cost (£0.02) an order of magnitude below a real run.

**Root cause, MEASURED from the warning:** *"Scoring report generation failed: GenerationReport invariant violation(s): `failed_phase_signal_cannot_have_passed_outcome`: Failed phase signals … are incompatible with `run_outcome=passed`."* The final report refused to serialise, and **nothing rolled back or marked the stale one** — so the in-progress artifact became the record of the run.

**CORRECTION to an earlier draft of this section, which overstated the blast radius.** The **API serving path is already protected**: ANALYSIS_44 R5a's `finalizeStaleInProgressReport` ([server.ts:1336](../../apps/api/src/server.ts#L1336)) detects a stale `in_progress` snapshot and flips it to `run_outcome: "aborted"`, `passed: false`, `stale: true`, with an explicit `incomplete_reason`. That machinery works and needs nothing.

**The real, narrower gap is direct-file consumers.** `scripts/target80-ledger-row.mjs` reads the report with a bare `fs.readFileSync` ([:8](../../scripts/target80-ledger-row.mjs#L8)) and checks neither `in_progress` nor `stale` — so it will read **96 A / passed** for a run that scored 66 and failed three chapters. Any human or agent grepping `apps/api/data/reports/` directly is equally exposed; that is exactly how this was found.

**Severity: moderate, and it is a measurement bug, not a craft bug.** The reporting analogue of `report-total-cost-underreports-7x`: **never trust a persisted report read off disk without checking `in_progress` / `stale`.** The durable fix belongs on the **write** side — mark or rename the snapshot when finalization fails — because that protects every consumer at once instead of one script at a time.

Adjacent, MEASURED: all three 07-24 reports carry `release_gate_outcome: {"status":"unknown", …}` while reporting `run_outcome: failed` and `overall_score: 74 C`. Under `canary-core`'s shipped rule (`status ∈ {passed, warning}`), `unknown` is **not** shipped — so the same run can read "shipped" via one path and "not shipped" via another. The two definitions need reconciling.

---

## 5. New failure mode — Azure content filter blocks the pipeline's own regens

**MEASURED, first observation.** The 07-27 run took **10** content-filter refusals, all on `missing_clue` regen prompts:

```
Agent9-Regen-Ch2-missing_clue  × 6
Agent9-Regen-Ch5-missing_clue  × 2
Agent9-Regen-Ch6-missing_clue  × 2
ERROR: The response was filtered due to the prompt triggering Azure OpenAI's content management policy.
```

The blocked prompt carries the pipeline's own generated prose: *"a brass candlestick, its base stained with something dark."* **The pipeline generated content that its own next call refuses to accept.**

**Partial causal link, stated precisely.** Chapters **2, 4, 10** failed validation. Ch2 both had its regen blocked six times *and* failed validation — plausibly caused. Ch5 and Ch6 had regens blocked but passed anyway (the deterministic backstop held). Ch4 and Ch10 failed for unrelated reasons. So: **one of three validation failures is attributable; two are not.**

**Why it is on the board.** The never-abort gate held and the story shipped — the system degraded correctly. But this is an *uninstrumented* class: no detector, no telemetry, no retry-with-softened-prompt. It is premise-dependent (blunt-force weapon + staining), so it will recur on that story family and be invisible except in raw logs. It also injects unmodelled variance into any A/B whose replays regenerate this prose.

---

## 6. Run-specific anomalies from 07-27 (each UNBASELINED unless noted)

| Signal | Value | Read |
|---|---|---|
| **Red herrings** | **0** | **MEASURED anomaly.** All three 07-24 runs produced **2**; this run produced **0**. A fair-play mystery with no red herrings has no misdirection field. Correlates with the rubric's `clues: 5/10` and with two suspects having zero clue coverage |
| Suspects with zero clue coverage | 2 (Quill, Trent) | Agent 5 papered over it with `clue_fp_elimination_*` deterministic backstops — the machinery worked, but the LLM produced a cast where a third of the suspects were unclued |
| Scene-grounding coverage | 4/10 chapters | release-gate warning; below target |
| `entity_pronoun_drift_count` | 19 | **UNBASELINED.** Not asserted by the integrity gate (only mechanical-term collision and culprit-gate FP are). Given A_66 closed the pronoun war on "zero mutations under verify", 19 deserves a comparison against the 07-24 runs before anyone calls it a regression. **I am not calling it one** |
| Internal rubric judge | `gpt-4o-mini` | **MEASURED** from the RubricScorer response record. The judge that gates and caps the whole pipeline is the cheapest deployed model — directly relevant to A_67 §3.2's open "internal-judge sensitivity unproven" item |

**Persistent across every run, MEASURED:** Cast Design is the weakest phase in all three 07-24 reports, failing on `quality_score ≈ 49/100` while validation/completeness/consistency all score 100. One phase fails the same way every run and nothing acts on it.

---

## 7. Carried forward — still open from A_67 / A_68 / A_69

**Built, tested, default-OFF, unprobed** (nothing in `.env.local` sets any of these):

| Flag | From | Blocker |
|---|---|---|
| `AGENT9_FULLSTORY_POLISH` | A_68 §8.4 / A_69 Inc-1 | **A/B in flight** (§8) |
| `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | A_68 §8.2 | queued behind the above; one flag per arm |
| `AGENT9_POLISH_RETRIED_CHAPTERS` | A_68 §7.2 | — |
| `RUBRIC_STRUCTURAL_CAPS_A68` | A_68 FIX B+C | needs zero-false-positive confirmation |
| `AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK` | A_68 FIX C | pairs with `AGENT9_FOLD_SUSPECT_CLEARANCES` |
| `AGENT9_REGEN_SUSPECT_ELIM` | A_67 FIX-1 / A_68 §8.1 | **premise invalidated — see §2** |
| `AGENT9_MODEL_POLISH` | A_69 Inc-2 | **hard-blocked**: no frontier deployment on the Sweden resource (`gpt-4o-mini` / `gpt-4.1-mini` / `gpt-4.1` only) |
| `AGENT9_FULLSTORY_DIAGNOSTIC` | A_69 Inc-3 | shadow-first across ≥3 runs before `apply` |

**Designed, not built:** the CML-mechanism physics judge (`AGENT3_MECHANISM_PHYSICS_JUDGE`); locked true/staged times as first-class locked facts (A_68 FIX B catches the *impossible* reveal, not the 10:15↔10:20 *drift*); the LLM weave for the unguarded locked-fact value splice; **a raw-identifier linter** (A_69 §9.3 — the diagnostic caught `rh_1`/`rh_2` dramatized as story content; **MEASURED: 0 occurrences across the 14 shipped stories**, so this is a replay-surfaced defect, lower frequency than A_69 implies, but the code path is live and no detector covers it).

**Closed by building since A_68** (2026-07-27 commits): the Agent-5 stale-audit **run-killing abort**; the Agent-7 missing beat-coercion on retry paths — which could let an uncoerced beat reach Agent 9 and misfire the aftermath stage-mode, *permitting exactly the duplicate reveal A_68 FIX C targets*; and `corpus-snapshot.ts` (A_67 FIX-3 groundwork).

**Infrastructure, MEASURED and fixed:** `preflight-dist-check.mjs` failed on 07-27 — `agent9-run.ts` was two days newer than the newest worker dist file. **The A_69 ship-layer diagnostic wiring had never reached a run**, and any A/B started before the rebuild would have measured stale code. This is `worker-consumes-cml-packages-via-dist` biting again; the preflight script caught it, and it should be a hard precondition of every probe rather than a step someone remembers.

---

## 8. RESULT — the A/B ran, and it found a silent no-op (not a verdict on the craft)

**Completed 2026-07-27, ~£1.10 actual.** The analyzer prints `VERDICT: FAIL ❌ — flag stays off`. **That headline is misleading and must not be quoted on its own.** The FAIL is driven entirely by `all_pairs_ok: 3/4` — one arm crashed. Every substantive gate passed, and treatment was *cheaper* ($0.8178 → $0.5772). The real finding is underneath.

### 8.1 The lever never ran — MEASURED, four ways

| Treatment arm | flag `enabled` | `recurringPhraseCount` | `editedChapters` |
|---|---|---|---|
| `e68c8118` | true | 15 | **[]** |
| `6dc1ee3a` | true | 7 | **[]** |
| `mystery-1785175520689` | true | 5 | **[]** |
| `477bb27a` | — | — | arm crashed |

1. The A_69 §9.5 telemetry works — `enabled` correctly tracks the arm. **That fix is validated.**
2. `editedChapters` is empty in **every** treatment arm despite 5–15 recurring phrases detected.
3. **Zero** `Agent9-FullStoryRepetitionPolish-Ch*` LLM calls in the entire 1,627-line A/B log — while the same log carries hundreds of `Agent9-ProseGenerator` / `Agent9-Regen-*` labels, so label capture demonstrably works. The label is confirmed at [post-pass-polish.ts:446](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L446).
4. **NOT my Increment-2 routing.** `resolveStageModel("polish", args.model)` returns `args.model` when `AGENT9_MODEL_POLISH` is unset — verified against [model-tiering.ts:35](../../packages/prompts-llm/src/agent9-prose/model-tiering.ts#L35). Ruled out explicitly.

### 8.2 Root cause — normalized needle, raw haystack

**MEASURED by reproduction.** Replaying `detectRecurringPhrases` over a treatment arm's shipped chapters returns exactly **15** phrases — matching that arm's telemetry `recurringPhraseCount: 15`, which validates the reproduction. Then:

```
repeatedOpenings:                                    0
phrases that literally substring-match some chapter: 0 / 15
```

`detectRecurringPhrases` ([phrase-analysis.ts:173](../../packages/prompts-llm/src/agent9-prose/phrase-analysis.ts#L173)) builds 7-word n-grams from `tokenizeWords(...)` — a **normalized** stream: lowercased, punctuation stripped, single-spaced. Sample output: `"clock running oddly earlier this afternoon chimes"`.

`runFullStoryRepetitionPolish` ([post-pass-polish.ts:406](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L406)) then matches those needles with a raw substring test against **un-normalized** chapter text:

```js
if (chapterFullText(chapters[i]).toLowerCase().includes(needle))
```

A 7-word n-gram nearly always spans a sentence break or punctuation (`"…this afternoon. Chimes not as usual…"`), so the raw `.includes()` can never match it. `targetIdx` stays empty → the early return at [post-pass-polish.ts:412](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L412) → **zero LLM calls, no error, no warning.**

**The phrase path has therefore never worked.** The only functioning trigger is `repeatedOpenings`, which is a different, narrower signal.

### 8.3 This reconciles A_69 §9.4 exactly

A_69 reported the smoke probe firing on Ch4 + Ch10 — and noted, honestly and with puzzlement, that *"it varied the words and not the image — both chapters still open on the grandfather clock."* That is now fully explained: both chapters shared an **opening shape**, so they were caught by the `repeatedOpenings` path. The n-gram path contributed nothing then either. A_69 attributed the limitation to "the detector works on n-grams, so that is the ceiling" — the truth is the opposite: **the n-gram half was dead, and only the opening half ran.**

### 8.4 What this does and does not say

- It says **nothing** about whether cross-chapter polish improves prose. The experiment could not test that, because the treatment never differed from control on 3 of 4 pairs. A null result here is a **plumbing** result.
- Fix the needle/haystack mismatch (normalize both sides before matching), then re-run. The pool is built and the harness is proven, so the re-run is ~£4–8 and needs no new infrastructure.
- **The A/B was still worth its cost.** It bought a proven-dead code path in a lever that two prior docs treated as working, plus a validated telemetry channel. Probes that find plumbing bugs are not wasted probes.

### 8.5 The crashed arm — flake, not signal

`477bb27a :: treatment` died with exit `3221226505` (`0xC0000409`, a Windows fatal process abort) **seconds in, right after `Agent4-Revision | chat_request`** — long before Agent 9, and therefore unrelated to the flag under test. No error text was emitted. The harness correctly marked the pair invalid rather than scoring a half-pair. **UNBASELINED — one occurrence; worth watching for recurrence, not worth chasing yet.**

---

## 8b. Original A/B framing (retained)

`AGENT9_FULLSTORY_POLISH` A/B — 4 matched pairs, 8 Agent-9 replays, ~£4–8, launched 2026-07-27 after the pool reached N=4:

```
node scripts/exp-regen-clue-ab.mjs \
  --runIds run_e68c8118…,run_6dc1ee3a…,run_477bb27a…,mystery-1785175520689 \
  --flag AGENT9_FULLSTORY_POLISH --treatmentValue true --controlValue false \
  --agents 9 --out results/ab-agent9_fullstory_polish
```

Chosen over the suspect-elim A/B because its trigger is **demonstrated**: the A_69 smoke probe showed it firing, targeting Ch4 + Ch10, with both rewrites surviving the rollback guard into the final output. Acceptance per A_69 §7.4: prose mark up; **zero rollbacks on locked values, cast names, number/time tokens or length**; no new `locked_fact_absent` regens; no pair invalidated by a re-synthesised Agent 7.

This is also the first real test of the A_69 §9.5 telemetry fix — whether `fullStoryPolish` / `fullStoryDiagnostic` in the boundary dump make an 8-arm read possible without reconstructing from `logs/llm.jsonl` by hand.

**Known caveat, carried from A_69 §9.4:** the pass varies *words*, not *images* — it renamed two chapter openings but both still opened on the grandfather clock. n-grams are the ceiling. Do not over-read a prose-mark delta.

---

## 9. The board, ranked by (evidence × lift) ÷ cost

0. **The `AGENT9_FULLSTORY_POLISH` needle/haystack bug** (§8.2) — measured by reproduction, one-line-class fix (normalize both sides), and it unblocks a lever two docs already believed was working. Highest ratio on the board.
1. **`"In a remembered moment"` × 28** (§3) — measured, one-to-one causal, a phrase bank is near-zero cost and needs no LLM. The clearest craft win on the board.
2. **Stale-report integrity** (§4) — measured; a run that scored 66 is on record as 96 A *on disk*. The API view is already protected (A_44 R5a); the gap is direct-file readers. Fix on the write side so every consumer is covered at once.
3. **Amend A_68 §8.1** (§2) — free; leaving it unamended means the next session spends £4–8 on a null A/B.
4. **Red herrings = 0 / Cast Design quality 49** (§6) — measured, upstream of everything Agent 9 can fix; a mystery with no misdirection cannot score well on clues no matter how good the prose.
5. **Content-filter instrumentation** (§5) — measured but low frequency; needs telemetry before it needs a fix.
6. Everything in §7, which is gated on probes, not on decisions.

**The through-line.** Four of the six are *measurement* problems, not craft problems: a report that lies, a status field that misleads, a frequency claim nobody checked, a dist that silently predates the code. A_68's census concluded every craft fix needs a detector or it doesn't stick. The 07-27 evidence extends that: **every detector needs a verified read path, or the number it produces is worse than no number.**
