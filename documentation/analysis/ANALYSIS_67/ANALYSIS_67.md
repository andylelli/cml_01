# ANALYSIS_67 — The outstanding-problems board (post-pronoun-war census)

**Written:** 2026-07-23 · **Trigger:** A_66 CLOSED same day (the pronoun war won: external verdict "much improved", item 7/7) — the owner asked for a full census of what remains, by category. **This is a BOARD, not a plan**: no fixes are designed here, no phases, no spend. Every item carries its evidence source and its §2.8 constraint. **Regime:** corpus era (A_63 §2.8) — corpus analysis + singular probes only; anything batch-shaped needs an explicit owner decision.

**Scoreboard context:** external 76/100 on probe #3 (`probe3-external-read.txt`, A_66), priced **82–85 with the structural fixes** below; probe #1 read 78/100 (+9 offset, S0 replicated, single data point). Internal rubric shadow on the last three probes: 66 / 62 / 66. The 80 target is EXTERNAL.

---

## 1. CRAFT — external-score blockers (the road from 76 to 82–85)

All from the probe-#3 external read unless noted. These are the priced, named blockers — the reviewer's "fastest fixes" list, ordered by their weighting.

| # | Problem | Evidence | Notes |
|---|---|---|---|
| 1.1 | **Ch9 is a duplicate validation chapter** — ch8 already delivers the full reveal (mask logic, clearances, confession, arrest); ch9 re-clears Beatrice/Sylvia/Finch in formal language instead of aftermath | read §"Biggest issue" | The reviewer's #1. Fix shape (theirs): ch9 becomes aftermath-only or is deleted. Root cause likely NOT prose — see 2.1/2.2 |
| 1.2 | **Checklist/report prose in ch9** — "X's alibi was confirmed because multiple witnesses saw her in the lounge at the time" ×3, near-verbatim per suspect | read §"Main issues 1" | Same sentences the injection layer writes (2.1). "Logically useful… they sound like a checklist" |
| 1.3 | **Unpaid clue setups: the clocks** — ch2 plants 11:10 vs 10:50; the solution never uses them | read §"Main issues 3" | "The clocks need to matter, or they should be cut" |
| 1.4 | **Unpaid clue setups: the footprints** — ch7 introduces terrace/garden prints; the reveal never cashes them | read §"Main issues 4" | |
| 1.5 | **No early method clue** — strangulation is revealed, never planted (ch1 is all mask tableau) | read §"Main issues 6" | Reviewer offers five plant options (bruising, ribbon, thread under fingernails…) |
| 1.6 | **The same-tear deduction reads magical, not forensic** — both masks torn at the left eye is asserted, not derived (staged tear vs struggle tear never distinguished) | read §"Main issues 2" | |
| 1.7 | **False-solution framing unstated** — ch6 suspects Hale, ch8 convicts Hale; the "right culprit, insufficient proof" distinction is never articulated | read §"Main issues 5" | |
| 1.8 | **Referent vagueness (residual, NON-gendered)** — "a sentence starts with one character and the next pronoun or phrase points vaguely to another" | read §7 | The pronoun war's successor class — a light pass, not a war. A_66 §5 explicitly rejected a coreference engine; measure first |
| 1.9 | **Craft iteration toward 80, generally** — internal floor mean 6.08 vs ≥8.0 at M3; the Planted-Mystery contracts (C1/C2/C3) fire but don't move internal marks | A_63 M3 verdict; A_65 craft plan | Corpus-era queue item; entangled with the instrument question (3.2) |

## 2. TYPE-B SELF-INTERFERENCE — deterministic layers writing into fiction

The A_66 pattern, four kills deep (grounding-lead, template-mangle, pronoun vandalism ×3 bodies). These are the known still-standing members of the family.

| # | Problem | Evidence | Notes |
|---|---|---|---|
| 2.1 | **The suspect-elimination injection writes checklist prose** — deterministic alibi-clearance sentences injected as fiction; also the proven probe-#1 mangled-template leakage sentence ("validation-style" ch10 line appeared in NO LLM response) | A_66 §2 bonus (replay-proven); probe-#3 read items 1.1/1.2 | **The natural next kill.** Same forensic method applies: replay the injection on accepted drafts, census what it writes |
| 2.2 | **Whatever makes ch9 a validation chapter** — is the duplicate-clearance chapter an Agent7 outline artifact, the injection layer's placement, or both? | probe-#3 read | Attribution unknown — needs the entry-point forensics BEFORE any fix (the A_66 lesson: don't fix the layer you haven't proven) |
| 2.3 | **`narrativeVoiceLine` misfires** — matches "investigator" vs "detective" and falls back to `'SHE'` | A_66 §5 (noted, deliberately not fixed in-phase) | Dormant landmine: harmless today, wrong the day a POV line is wanted. Fix-if-touched |
| 2.4 | **Post-processing runs after validation, structurally** — any deterministic pass after the ship-check can corrupt clean output with no re-validation; A_66 closed the pronoun instances, the architectural exposure remains for other pass types | A_66 §2; memory `agent9-postprocess-after-validation` | The A_64 no-writes-after-final-check law is applied to pronouns only; a general audit of what else writes late is unowned |

## 3. INSTRUMENTS & TELEMETRY — where our measurements lie to us

| # | Problem | Evidence | Notes |
|---|---|---|---|
| 3.1 | **HP-detector quote-parity inverts on multi-paragraph quotations** — straight-quote parity counted from chapter start; one spanning quote flips narration/dialogue classification for the rest of the chapter. Faked probe-#3's only census hit; can equally HIDE a real flip | A_66 §7 run 3 (mechanical proof); fixture named: ch8 of `stories/story_20260723-2051/masks_of_authority.md` | Queued from A_66 (deliberately not fixed mid-acceptance). Feeds the P2 guard + P3 producers, so precision here is lever-grade |
| 3.2 | **Internal-judge sensitivity unproven** — suspicion of template-answering ("not planted early enough" near-verbatim on stories where plants are provably on the page) | A_63 M3; roadmap queue #1 | **Free, high value, first in the corpus-era queue.** Decides whether craft levers are being scored by a broken meter |
| 3.3 | **Internal/external offset pinned by ONE data point** — probe #1 read +9 (S0's −9.5 "replicated" once); the owner's 4 M3 reads (A_63 7.8 trigger) remain optional-open | A_63 7.7/7.8; probe-#1 read | Owner-gated. Two external reads now exist (78, 76) vs internal 69?/66 — a third would firm the offset for free next probe |
| 3.4 | **Report-generation invariant failure** — `failed_phase_signal_cannot_have_passed_outcome` (Cast Design 85/B with `passed:false`) killed the final report; only the interim snapshot reached disk. Intermittent: fired on probe-#3 run 1, clean on runs 2–3 | A_66 §7 run 1 | Real bug: when it fires, the run's true telemetry never reaches the report JSON and downstream harnesses read blanks |
| 3.5 | **`total_cost` under-reports ~7×** — never budget from it; audit via `llm-prompts-full.jsonl` chars/4 × Azure prices | memory `report-total-cost-underreports-7x` | Standing, known, unowned |
| 3.6 | **`entity_pronoun_drift_count` canary is the demoted loose heuristic** — read 21 / 21 / 26 across three different stories; identical 21 twice suggests it may count something partially static | probe logs (all three runs) | Measure-band only (correctly demoted by A_66 P5); the identical readings deserve one curious look, low priority |
| 3.7 | **Stale log line: "pronoun repair is DISABLED (…pronoun_policy=off)"** — hardcoded `=off` prints regardless of the actual policy (`verify`) | agent9-run.ts:3529; all three probe logs | Cosmetic but actively misleading during forensics — it cost real minutes in A_66's timeline reconstruction |
| 3.8 | **Detector recall in mixed-gender chapters ≈ 0** — the Item-13 suppression guards collapsed recall; unanchored viewpoint narration is structurally invisible to every layer; `pronounsUnstable` read 0/20 while externals saw drift | A_66 §4 | Accepted limitation while the external read is the instrument of record; becomes a problem the day anyone gates on internal pronoun marks again |
| 3.9 | **A_65 craft-plan tracker rows are stale** — probes #1/#2 are DONE per commits (`034f7972`, `44313f3d`) but the CRAFT_IMPLEMENTATION_PLAN table still shows ⬜ | grep of open trackers, 2026-07-23 | Hygiene: stale boards mislead future sessions (this board exists partly because of that) |
| 3.10 | **measures.tsv hygiene** — duplicate row for `mystery-1784667048584` (register_hits 4 vs 3) | `scratchpad/a65/measures.tsv` lines 6–7 | One-line fix, append-only etiquette: keep the corrected row, drop the other |

## 4. DORMANT / SHADOW LEVERS — built, waiting on a decision or a baseline

All §2.8-constrained: measuring most of these is batch-shaped and therefore owner-gated.

| # | Lever | State | Blocker |
|---|---|---|---|
| 4.1 | `NOVELTY_SKELETON_JUDGE` | wired SHADOW | Promote to gating only after telemetry tracks the LLM audit (memory: deterministic `cmlToSkeleton` is always-"distinct" against hand-authored corpus labels) |
| 4.2 | `AGENT9_REGEN_MECHANISM` | ON, no OFF baseline ever measured | Corpus question first (can its effect be estimated from preserved runs?), else a probe pair |
| 4.3 | Voice tics (A_63 7.3) | tics never reach attributed dialogue | Generation-side design needed — a prompt-layer problem, not a repair-layer one |
| 4.4 | Injector deletion | injectors idle under F1/F2 | **LAST, alone**, per the standing order — after everything else is stable |
| 4.5 | A_61 residual A/B flag-flips | fixes shipped, flips unmeasured | N≥4 batches = owner decision under §2.8 |
| 4.6 | A_62 RC-2.1/2.2 (leakage + dual-value levers) | source-complete, default-OFF | P3 measurement was in flight when the batch era ended; needs DISPOSITION (measure via corpus, run singular probe, or formally park) — a stale 🟡 is the worst state |
| 4.7 | A_62 RC-2.3 general detector sweep | ⬜ by design | Gated on 4.6 measuring first — deliberate no-speculative-fixes gate, unchanged |
| 4.8 | A_62 RC-4 / Item 10 detector recalibration | evidence complete | Blocked on the externals' quoted examples (never recorded in-repo) + the 3.3 offset decision |

## 5. HOUSEKEEPING

| # | Item | Notes |
|---|---|---|
| 5.1 | `apps/worker/node_modules/.vite/vitest/results.json` is git-TRACKED and churns every test run | Should be untracked/ignored; it dirties every session's status |
| 5.2 | Batch chain scripts not resumable (A_62 structural note) | Moot under §2.8; matters only if batches return |
| 5.3 | Probe wall-clock trap: machine sleep mid-run (probe-#3 run 1 lost ~8h) and the process-start-vs-dist-build validity rule | Documented (A_66 §7, memory); a pre-probe checklist line would make it mechanical |

---

## The shape of the board, in one paragraph

The pronoun war's closure exposes the same pattern one layer up: **the top external blocker is again our own deterministic layer** (the suspect-elimination injection and the ch9 validation chapter it produces — category 2), followed by classic craft debts the reviewer priced precisely (category 1: clue payoffs, early method clue, tear forensics). Categories 3–5 are the meta-work: instruments that lie (quote-parity, the unpinned offset, the possibly-template-answering judge) and a shelf of built-but-unmeasured levers that §2.8 correctly refuses to let us measure by reflex. Nothing here is designed or scheduled — that is the next analysis's job, and the A_66 lesson stands for all of it: **prove the entry point before fixing the layer.**
