# TARGET 80 — LEDGER (the standing scoreboard)

**Created:** 2026-07-13 · **Branch:** `redesign/agent-blue-sky` · **Companion to:** [ROADMAP_TO_80.md](ROADMAP_TO_80.md) (§3 defines this document; §5/§6 are the row definitions)
**What this is:** the three-panel scoreboard the roadmap mandates *instead of* per-run analysis docs. Update the panels **from run reports** (`apps/api/data/reports/<proj>/<run>.json` → `rubric_score` + `agent9_prose_release_gate_summary` diagnostics) after every run/batch — numbers, not prose. "Reach 80" is done when every Reliability row is 0, every Cap row is 0, and the Category Floor averages ≥ 8 over a ≥4×4 matched batch.

**Update procedure (per run):** add a Run Log row → tick any Reliability/Cap occurrences against their rows → paste the ten rubric marks into the Category Floor → move anything new into Open Items with an owner-lever. Never conclude from n=1 (guardrail #1); the panels exist to make the *batch* readable.

**Definition of SHIPPED (P0.2, decided 2026-07-13):** a run is *shipped* iff `release_gate_outcome.status ∈ {passed, warning}` — i.e. it reached a scored release gate with **zero hard stops**. `warning` = needs-review. `run_outcome` remains phase-threshold-driven and may read `failed` on a shipped run; **ship-rate and the M1 gate tally `release_gate_outcome.status`, never `run_outcome`.** (Pinned by two aggregator tests in `scoring.test.ts`.)

---

## 0. Milestone status

| Milestone | Target | Status |
|---|---|---|
| **M1 — Floor** | 8/8 consecutive post-change runs reach a scored release gate (never aborted/failure) | **S0 baseline COMPLETE 2026-07-13: 4/4 shipped, 0 hard stops** (5/5 counting smoke f90e5f09). The formal M1 gate (two dedicated 4-run batches) remains to be run — P2. |
| **M2 — Ceiling** | top-4 caps ≤1 occurrence across ≥4 runs; median shipped ≥ 73 | **at risk on current data** — scaffold/report-style fired on 2/4 S0 runs; S0 median rubric 66 (59/60/66/70 + smoke 70). The scaffold lever fires but loses ~half the time (Item 8) → the A/B decides whether to strengthen the pass. |
| **M3 — Target 80** | mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship 100%, ≥4×4 matched | not started — **no external scores collected yet**; 5 shipped stories now flagged for reads (Item 6) |

---

## 1. Run Log

*(Smoke runs validate the machinery; they do NOT count toward S0/S5 batch gates.)*

| Run | Date | Kind | Outcome | Gate (hard/warn) | Internal score | Rubric (uncapped) | External | Cost / min | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `a3c2973f` | 2026-07-12 | smoke | **aborted** | 1 / 2 | 59 F (pre-abort) | — | — | £0.29 / 15.4 | Phantom clue `clue_` from truncated Agent-5 JSON + jsonrepair; all 20 real clues visible. Class fixed same day (parse filter + truncation retry + max_tokens 6000 + gate-status fix). |
| `f90e5f09` | 2026-07-13 | smoke | **shipped** (needs_review; surfaced as `failed` — see Open Item 2) | 0 / 2 | 74 C | **70, `caps_applied: []`** | — | £0.26 / 18.6 | Fixes held: 19/19 clues, no parse warnings, gate status consistent. 1 major = validator FP (Open Item 1). Grounding 5/10 (warn). |
| `mystery-…1161277` (poison) | 2026-07-13 | **S0-1** | **SHIPPED** (gate `passed`) | 0 / 1 | 74 C | **59, `caps: []`** | — | £0.21 / 17.0 | Clean gate, 19/19 clues. Uncapped but LOW rubric — craft floor across the board (no mark above 7). Grounding 8/10 ✓. `run_outcome=failed` is phase-threshold only. |
| `mystery-…2181080` (tide) | 2026-07-13 | **S0-2** | **SHIPPED** (gate `warning`) | 0 / 2 | 95 A (phase-weighted) | **66 (raw 70), 3 caps** | — | £0.23 / 19.5 | Caps: deductive-scaffold → prose ≤4; report-style clearance ×2 → prose ≤6 / ending ≤7. Scaffold regen DID fire (Ch1 ×2, Ch10 ×1) — effectiveness question → Open Item 8. Continuity warning = NEW FP class → Open Item 7 (fixed). Grounding 3/10. 17/17 clues. |
| `mystery-…4840251` (acoustic) | 2026-07-13 | **S0-3** | **SHIPPED** (gate `warning`) | 0 / 1 | 95 A (phase-weighted) | **60 (raw 63), 5 caps** | — | £0.21 / 20.9 | Scaffold family fired HARD: scaffold → prose ≤4, ceil-65, report-style ×2, **dualValueNoContrast** (marked "fixed" — reopened, see Cap panel). Scaffold regen attempted on Ch4/6/7/10 and lost → Item 8. Grounding 1/10. 17/17 clues. No Item-7 FP. |
| `mystery-…6096323` (identity) | 2026-07-13 | **S0-4** | **SHIPPED** (gate `passed`) | 0 / 1 | 95 A (phase-weighted) | **70, `caps: []`** | — | £0.20 / 14.9 | Clean and uncapped — and its scaffold regen ALSO fired (Ch3 ×2, Ch8 ×2, Ch10) and won: the lever can work. 19/19 clues. Grounding 1/10 (warn). |

---

## 2. Reliability Ledger  *(abort channels — every row must read 0 occurrences per batch)*

| Hard-fail class | Lever / state (roadmap §6) | `a3c2973f` | `f90e5f09` | Batch tally |
|---|---|---|---|---|
| `illegal_named_walk_on` | `AGENT9_WALKON_REPAIR` ON · built | 0 | 0 | 0/2 |
| `cleared_culprit_conflict` | construction guard (unflagged) · built | 0 | 0 | 0/2 |
| `missing_case_transition_bridge` (abort form) | `AGENT9_REGEN_TRANSITION` ON · built | 0 | 0 (warn-level FP only — Open Item 1) | 0/2 |
| season/mechanism FP | fixed · live | 0 | 0 | 0/2 |
| Agent-5 coverage abort | RC3.1 repair-not-abort · fixed | 0 | 0 | 0/2 |
| reveal never converges | `AGENT9_REGEN_RESOLUTION` ON | 0 | 0 | 0/2 |
| template-bleed openers | backstops live (audited 2026-07-12) | 0 | 0 | 0/2 |
| Agent-7 `scene.beat` enum | coercion + persistence live (audited) | 0 | 0 | 0/2 |
| **Truncated Agent-5 JSON → jsonrepair phantom clue** | parse filter + retry + max_tokens 6000 · **fixed 2026-07-12** | **1 — the abort** | 0 | 1/2 (pre-fix) |

**Ship rate:** smoke 1/2 (abort root-caused and fixed the same day). **Post-fix: 3/3 shipped** (f90e5f09, S0-poison, S0-tide) — zero hard stops, zero aborts; every §2 row at 0 occurrences across all post-fix runs.

---

## 3. Cap Ledger  *(rubric ceilings on shipped drafts — frequency per batch; target 0)*

*Read `caps_applied` + `structural` from the report's `rubric_score` diagnostic. Aborted runs don't count (no honest rubric).*

| Cap | Lever | `f90e5f09` | poison | tide | acoustic | identity | Shipped freq |
|---|---|---|---|---|---|---|---|
| `mechanismExplainedTooEarly` | `AGENT9_REGEN_MECHANISM` ON | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `scaffoldHits` (incl. ceil-65 at ≥2) | `AGENT9_REGEN_SCAFFOLD` ON | 0 | 0 | **1** | **2** | 0 | **2/5** |
| `reportStyleClearance` | same lever (scaffold pass) | 0 | 0 | **2** | **2** | 0 | **2/5** |
| `revealUsesUnplantedEvidence` | `AGENT6_DT_EVIDENCE_COMPLETENESS` ON | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `templateLeakageHits` | `AGENT9_REGEN_CLUE` ON | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `culpritIsVictim` / role collision | `repairCaseSoundness` unconditional | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `pronounsUnstable` | `AGENT9_BIBLE_AUTHORITATIVE` ON | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `victimUnnamed` / `malformedEvidenceSurfacing` | fixed (landed) | 0 | 0 | 0 | 0 | 0 | 0/5 |
| `dualValueNoContrast` | A_57 D2 — **REOPENED** (fired on acoustic: "central clue stated as two flat values, not one contradiction" → clues ≤6) | 0 | 0 | 0 | **1** | 0 | **1/5** |
| `weakMurderMethod` | RC3.5 tell · off | 0 | 0 | 0 | 0 | 0 | 0/5 |

**The S0 read: the scaffold/report-style family is THE dominant live cap (2/5 runs), and the lever's story is now precise** — the regen attempted on every capped run (tide Ch1/Ch10; acoustic Ch4/6/7/10) *and* on the uncapped identity run (Ch3/8/10) where it won. So the pass works sometimes and loses sometimes; whether it beats no-lever at all is exactly the P4 A/B question (Open Item 8). `dualValueNoContrast` reopened at 1/5 (Open Item 9).

---

## 4. Category Floor  *(ten rubric marks vs the 8.0 each needs; the LAST lift — S14)*

| Category | Target | `f90e5f09` | poison | tide | acoustic | identity | Mean (5 shipped) |
|---|---|---|---|---|---|---|---|
| premise | 8 | 7 | **6** | 8 | 7 | 8 | 7.2 |
| opening_hook | 8 | **6** | **5** | 7 | **6** | 7 | **6.2** |
| plot_structure | 8 | 7 | **6** | **6** | **5** | **6** | **6.0** |
| character_clarity | 8 | 7 | **5** | 7 | **6** | 7 | 6.4 |
| dialogue | 8 | **6** | **6** | 8 | 7 | **6** | 6.6 |
| atmosphere | 8 | 8 | 7 | 8 | 8 | 8 | 7.8 |
| clues | 8 | 8 | **5** | **6** | **5** (capped) | 7 | **6.2** |
| pacing | 8 | **6** | **6** | **5** | **6** | **6** | **5.8** |
| ending | 8 | 8 | **6** | 7 | **6** (capped) | 8 | 7.0 |
| prose | 8 | 7 | 7 | **4** (capped) | **4** (capped) | 7 | **5.8** |
| **Mean** | **8.0** | 7.0 | 5.9 | 6.6 | 6.0 | 7.0 | **6.5** |

**S0 baseline floor: 6.5 mean, no category at target.** The uncapped ceiling today is ~70 (f90e5f09, identity); the consistent deficits are **pacing (5.8), prose (5.8 — cap-dragged), plot_structure (6.0), opening_hook (6.2)**. Atmosphere (7.8) is the only near-target category. Reading: extinguishing the scaffold family (Item 8) recovers prose/ending/clues on capped runs, but even cap-free runs sit at 70 — the last ten points are craft (P5), exactly as the roadmap predicted.

---

## 5. Open Items  *(found on smoke runs; each needs a lever or a decision before/during the batches)*

| # | Item | Class | State |
|---|---|---|---|
| 1 | **`PERSON_DISAPPEARANCE_RE` verb-branch FP** — bare `vanished/disappeared` needed person-context (fired on "bravado **vanished** from his posture" + confession-scene murder vocab → spurious `missing_case_transition_bridge` major → gate warning) | validator FP (guardrail #4 family) | **FIXED 2026-07-13 (P0.1)** — verb branch now requires a person noun/pronoun subject (case-insensitive) or honorific+Name (case-sensitive); the exact f90e5f09 sentence is a must-not-match test; 8/8 detector tests green |
| 2 | **Warnings-only outcome mapping** — gate audit `warning` / validation `needs_review` surfaced as `run_outcome: "failed"`; M1 counts shipped+needs_review as success, so the bookkeeping was ambiguous | definitions / aggregator mapping | **DECIDED + IMPLEMENTED 2026-07-13 (P0.2)** — `release_gate_outcome.status` gains `'warning'` (shipped needs-review); run_outcome stays phase-driven; SHIPPED definition added to this file's header; pinned by 2 tests |
| 3 | **Rewrite passes can reintroduce cleared defect classes** — transition/mechanism predicates were not in the critique-rewrite acceptance validator; a post-regen rewrite mutated ch8/ch9 text after the transition detector had run | ordering gap (systemic) | **FIXED 2026-07-13 (P4.2)** — `buildRewriteAcceptanceValidator` (agent9-run.ts, exported + 6 both-directions tests) adds case-transition (candidate swapped into the chapter snapshot, defects at the rewritten position ±1) and mechanism-too-early predicates; self-baselines via isRegression so pre-existing defects don't block. Atmosphere-repair needs no guard: it runs BEFORE the regen detectors (phrase-level, during generation), so the regens see its output |
| 4 | **`agent2-cast` below phase threshold both runs** (85 vs threshold) | phase scoring calibration | monitor on batch; non-fatal |
| 5 | **Scene-grounding coverage below target** (1/10 → 5/10) | craft/warn | monitor; feeds the pacing/atmosphere floor |
| 6 | **No external (ChatGPT) scores collected yet** — the M3 gap ≤ 3 criterion is unmeasured on every run so far | measurement debt | start collecting on the S0 batch (one external read per shipped run) |
| 7 | **Victim-timeline reconstruction FP** (tide) — "Dr. Finch **vanished** from the lobby just before eleven" is reconstruction of the victim's last movements, not a case transition; person-context can't exclude it (a person genuinely vanishes) | validator FP, second shape of the Item-1 family | **FIXED 2026-07-13** — the transition check (detector + validator, shared) now applies ONLY where death language FIRST enters the story; once a murder is established, later disappearance phrasing never flags. Tide's exact shape is a must-not-match test; 10/10 detector tests, 371/371 suite. *(Landed after S0-3/4 launched — those two may still show the warn-level FP; discount it when tallying.)* |
| 8 | **Scaffold/report-style regen effectiveness** — fired on every capped run (tide Ch1/10; acoustic Ch4/6/7/10 → still 5 caps) AND on the uncapped identity run (Ch3/8/10 → clean): works sometimes, loses sometimes; the rubric's LLM judge reads "report-style" more broadly than the regen's deterministic clear-check | lever effectiveness (NOT wiring) — **now 2/4 S0 runs affected; the dominant live cap** | measure in the P4 A/B (`--flag AGENT9_REGEN_SCAFFOLD`); if the lever doesn't move cap frequency, strengthen the pass (prompt/attempts/validator alignment with the rubric's reading) — a POST-A/B change by design |
| 9 | **`dualValueNoContrast` REOPENED** (acoustic) — "central clue stated as two flat values, not one contradiction" → clues ≤6; the Cap Ledger had this marked fixed (A_57 D2) | cap regression or sub-shape the D2 fix missed | 1/5 shipped; check the acoustic central-clue phrasing vs the D2 detector before the M1 batches; candidate small fix |

---

## 6. What's next

The immediate three moves: close Open Item 1, decide Item 2, run the S0 baseline batch. The full path from here to a validated 80 is §7.

---

## 7. Phased completion plan — from the smoke runs to a validated 80

Ordered and dependency-sequenced from the **current** state (all roadmap CODE/CONFIG steps done; two smoke runs; six open items). Each step tags its kind — `CODE` (build + both-directions tests + `build:all`), `DECISION` (definitions; no build), `RUN` (canary, ~£1–1.5 each), `VERIFY` (grep/report checks), `SCORE` (external ChatGPT read) — and its exit check. Golden rules stand: one lever per measured replay; verify a lever by its agent label in `logs/llm-prompts-full.jsonl`; never conclude from n=1.

**Run budget from here:** P1 (4) + P2 (8) + P3 (4) + P4 (≥16 arms ≈ 8 full-run equivalents, replays are cheaper) + P5 A/Bs (~8) ≈ **£35–55**. The budget is the plan — trimming batch sizes is how the powered A/B stayed deferred since A_54.

### Phase 0 — Pre-batch hardening *(no runs; blocks clean M1 accounting)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P0.1** | `CODE` | Fix Open Item 1: person-context guard on the `vanished/disappeared` verb branch of `PERSON_DISAPPEARANCE_RE` (same noun/pronoun adjacency as the "missing" branch; keep possessive "her disappearance"). Both-directions tests: "bravado vanished from his posture" must NOT match; "Lady Beatrice vanished" / "he had disappeared" must. | story-validation suite green; the `f90e5f09` ch8/ch9 text no longer flags |
| **P0.2** | `DECISION`+`CODE` | Settle Open Item 2: a 0-hard-stop gate with warnings surfaces as a **shipped needs-review** run, not `failed` (M1 counts it as success). Map it explicitly in the aggregator (or document the hand-tally rule if semantics stay). | one sentence in this file's header defining "shipped"; aggregator test pinning the mapping |
| **P0.3** | `CODE` | Commit the working tree (roadmap work + smoke-run fixes + this ledger) so every batch run is traceable to an exact commit; `npm run build:all`. | clean `git status`; dist current |
| **P0.4** | `VERIFY` | Confirm worker/API restart if any run will be UI-triggered (canary CLI needs nothing). | — |

### Phase 1 — S0 baseline batch *(the first ledger column set)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P1.1** | `RUN`×4 | 4 sequential `node scripts/canary-core.mjs` on the standing config, diverse `CANARY_THEME` per run. | 4 reports on disk |
| **P1.2** | `VERIFY` | Per run: fill §1–§4 columns; grep lever labels (`Agent9-Regen-*`, `Agent3b-PlausibilityJudge`, walk-on repair); any Reliability/Cap occurrence ticks its row. | every fired cap has a matching regen attempt in the log — else it's an S6 wiring bug → fix before P2 |
| **P1.3** | `SCORE` | Open Item 6: one external ChatGPT read per shipped run (the A_57 protocol). Record internal−external gap in §1. | gap column populated; if gap > 3, stop and diagnose the rubric before proceeding |

**Exit P1:** baseline ship-rate, cap frequencies, and category floor recorded over 4 runs.

### Phase 2 — M1: the floor *(ship rate → 100%)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P2.1** | `RUN`×8 | Two sequential 4-run batches. Smoke runs and S0 do **not** count toward the 8. | — |
| **P2.2** | `CODE` (conditional) | Any abort → root-cause it (report diagnostics → `failure_lineage` / missing-id fields → walk `documentation/prompts/actual/run_*/` files in numeric order to bound where the artifact was created) → fix → **restart the 8-count**. | — |

**Exit M1:** 8/8 consecutive runs reach a scored release gate (passed or needs-review per P0.2's definition; never aborted). All §2 rows read 0.

### Phase 3 — M2: the ceiling *(caps extinguished on the batch)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P3.1** | `VERIFY` | S6 on the M1 batches: every cap that appears in any report has a corresponding regen label; absent label = wiring bug → `CODE` fix. | — |
| **P3.2** | `RUN`×4 | Re-batch if P3.1 required fixes; else the M1 batches double as the M2 sample. | — |

**Exit M2:** top-4 Cap-Ledger rows ≤1 occurrence across ≥4 runs; median shipped ≥ 73. *(First signal is good: 0 caps on `f90e5f09`.)*

### Phase 4 — Prove: the powered A/B *(the move deferred since A_54)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P4.1** | `VERIFY` | S11 pool: pick ≥4 shipped runs from P1–P3, diverse on era/setting/cast/crime/mechanism, chapter-count known. | no `SYNTHESIZING_CODE 7` on replay |
| **P4.2** | `CODE` (pre-req) | Open Item 3 before rewrite levers are A/B'd: add the transition/mechanism predicates to critique-rewrite & atmosphere-repair acceptance validators (a rewrite may not reintroduce a cleared defect class). | both-directions test; suites green |
| **P4.3** | `RUN` (≥16 arms) | S12: `exp-regen-clue-ab.mjs --flag <NAME>` per lever, one flag per replay (`--agents 6,9` for the Agent-6 lever; `--treatmentValue enforce --controlValue shadow` for the plausibility judge). Read raw scores + cap frequencies, never the band. | per-lever accept/reject table with deltas appended to this file |
| **P4.4** | `CODE` | S13: flip code defaults for winners; delete the injector layer (LLD P7) once every RC-1 regen is validated-on. | full suite green; empty-`.env.local` run behaves like the validated config |

**Exit P4:** every lever has a powered verdict; defaults match the evidence.

### Phase 5 — The craft lift *(the last 74→80 push; targets §4's floor)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P5.1** | `RUN` A/B | S14: A/B the craft levers in isolation — critique-rewrite targeting (aim it at opening_hook/dialogue/pacing, the three 6s), `AGENT9_VOICE_ENFORCE=enforce` (the RC5.3 repair is built and untested live), model tiering. | each lever moves its target category ≥+1 with nothing regressed |
| **P5.2** | `RUN`+`SCORE` | Final validation batch: ≥4×4 matched, external read per run. | — |
| **P5.3** | `VERIFY` | Also watch Open Items 4–5 (agent2-cast threshold, scene grounding) across the batch — recalibrate or fix only if they persist at batch scale. | — |

**Exit M3 = target 80:** mean ChatGPT ≥ 80 · internal−external gap ≤ 3 · ship rate 100% · over ≥4×4 matched. Flip remaining defaults, archive this ledger's final state, and stop.

### Sequencing at a glance

```
P0 harden (Items 1,2 + commit) → P1 S0 baseline ×4 + external reads → P2 M1 ×8 (0 aborts)
→ P3 M2 verify (+×4) → P4 A/B ≥16 arms + Item 3 + default flips → P5 craft A/B + final ≥4×4 → 80 ✅
```

**Critical path:** P0.1/P0.2 are the only work blocking P1. Everything after P1 is gated on the batch before it. The only remaining CODE of substance is P4.2 (rewrite-validator hardening); all else is flips, runs, and reads.

---

*Update this file per batch. A new `ANALYSIS_NN` is for a genuinely new finding only (guardrail #5).*
