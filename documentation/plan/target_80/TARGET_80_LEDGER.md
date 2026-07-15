# TARGET 80 — LEDGER (the standing scoreboard)

**Created:** 2026-07-13 · **Branch:** `redesign/agent-blue-sky` · **Companion to:** [ROADMAP_TO_80.md](ROADMAP_TO_80.md) (§3 defines this document; §5/§6 are the row definitions)
**What this is:** the three-panel scoreboard the roadmap mandates *instead of* per-run analysis docs. Update the panels **from run reports** (`apps/api/data/reports/<proj>/<run>.json` → `rubric_score` + `agent9_prose_release_gate_summary` diagnostics) after every run/batch — numbers, not prose. "Reach 80" is done when every Reliability row is 0, every Cap row is 0, and the Category Floor averages ≥ 8 over a ≥4×4 matched batch.

**Update procedure (per run):** add a Run Log row → tick any Reliability/Cap occurrences against their rows → paste the ten rubric marks into the Category Floor → move anything new into Open Items with an owner-lever. Never conclude from n=1 (guardrail #1); the panels exist to make the *batch* readable.

**Definition of SHIPPED (P0.2, decided 2026-07-13):** a run is *shipped* iff `release_gate_outcome.status ∈ {passed, warning}` — i.e. it reached a scored release gate with **zero hard stops**. `warning` = needs-review. `run_outcome` remains phase-threshold-driven and may read `failed` on a shipped run; **ship-rate and the M1 gate tally `release_gate_outcome.status`, never `run_outcome`.** (Pinned by two aggregator tests in `scoring.test.ts`.)

---

## 0. Milestone status

| Milestone | Target | Status |
|---|---|---|
| **M1 — Floor** | 8/8 consecutive post-change runs reach a scored release gate (never aborted/failure) | **COUNT RESTARTED 2026-07-15 at `257f7855`** — attempt 1 reached **6/8 shipped, 0 aborts**, then the run-7 re-run hard-aborted on a **new class** (Agent 6.5 refuses to voice-sketch the victim, 3/3 attempts → `mystery-1784133922125`); fixed same-day (victim-exempt cast coverage, `257f7855`) and a fresh 8-run fail-fast batch launched (poison first). Two abort classes found and killed so far (`dd2190f6`, `257f7855`) — the gate is doing its job. Attempt 1's 6 shipped runs still feed the cap ledger and P4 pool. |
| **M2 — Ceiling** | top-4 caps ≤1 occurrence across ≥4 runs; median shipped ≥ 73 | **at risk, and M1 sharpens it** — caps fired on **5/6** M1 runs (report-style 3/6, scaffold 2/6); M1 median shipped rubric **63** (59/60/63/63/65/68) vs the ≥73 bar. Only the identity-theme run ran uncapped — in S0 *and* M1 (theme confound). The scaffold lever fires but loses ~half the time (Item 8) → the P4 A/B decides whether to strengthen the pass. |
| **M3 — Target 80** | mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship 100%, ≥4×4 matched | **first external reads (S0, 2026-07-13): mean ChatGPT 73.25** (75/69/73/76) — the bar is 6.75 points away, much closer than internal suggested. **BUT the gap criterion fails in the NEW direction: internal−external = −9.5** (internal 63.75) — the rubric now *underscores*; per-run gaps −16/−3/−13/−6. Safe direction (no blind-spot risk) but the honesty criterion needs recalibration → Open Item 10. |

---

## 1. Run Log

*(Smoke runs validate the machinery; they do NOT count toward S0/S5 batch gates.)*

| Run | Date | Kind | Outcome | Gate (hard/warn) | Internal score | Rubric (uncapped) | External | Cost / min | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `a3c2973f` | 2026-07-12 | smoke | **aborted** | 1 / 2 | 59 F (pre-abort) | — | — | £0.29 / 15.4 | Phantom clue `clue_` from truncated Agent-5 JSON + jsonrepair; all 20 real clues visible. Class fixed same day (parse filter + truncation retry + max_tokens 6000 + gate-status fix). |
| `f90e5f09` | 2026-07-13 | smoke | **shipped** (needs_review; surfaced as `failed` — see Open Item 2) | 0 / 2 | 74 C | **70, `caps_applied: []`** | — | £0.26 / 18.6 | Fixes held: 19/19 clues, no parse warnings, gate status consistent. 1 major = validator FP (Open Item 1). Grounding 5/10 (warn). |
| `mystery-…1161277` (poison) | 2026-07-13 | **S0-1** | **SHIPPED** (gate `passed`) | 0 / 1 | 74 C | **59, `caps: []`** | **75** (gap −16) | £0.21 / 17.0 | Clean gate, 19/19 clues. Uncapped but LOW rubric — craft floor across the board (no mark above 7). Grounding 8/10 ✓. `run_outcome=failed` is phase-threshold only. |
| `mystery-…2181080` (tide) | 2026-07-13 | **S0-2** | **SHIPPED** (gate `warning`) | 0 / 2 | 95 A (phase-weighted) | **66 (raw 70), 3 caps** | **69** (gap −3) | £0.23 / 19.5 | Caps: deductive-scaffold → prose ≤4; report-style clearance ×2 → prose ≤6 / ending ≤7. Scaffold regen DID fire (Ch1 ×2, Ch10 ×1) — effectiveness question → Open Item 8. Continuity warning = NEW FP class → Open Item 7 (fixed). Grounding 3/10. 17/17 clues. |
| `mystery-…4840251` (acoustic) | 2026-07-13 | **S0-3** | **SHIPPED** (gate `warning`) | 0 / 1 | 95 A (phase-weighted) | **60 (raw 63), 5 caps** | **73** (gap −13) | £0.21 / 20.9 | Scaffold family fired HARD: scaffold → prose ≤4, ceil-65, report-style ×2, **dualValueNoContrast** (marked "fixed" — reopened, see Cap panel). Scaffold regen attempted on Ch4/6/7/10 and lost → Item 8. Grounding 1/10. 17/17 clues. No Item-7 FP. |
| `mystery-…6096323` (identity) | 2026-07-13 | **S0-4** | **SHIPPED** (gate `passed`) | 0 / 1 | 95 A (phase-weighted) | **70, `caps: []`** | **76** (gap −6) | £0.20 / 14.9 | Clean and uncapped — and its scaffold regen ALSO fired (Ch3 ×2, Ch8 ×2, Ch10) and won: the lever can work. 19/19 clues. Grounding 1/10 (warn). Best external of the batch. |
| `mystery-…5526685` (optics) | 2026-07-14 | M1 pre | **ABORTED** (pre-count) | 1 / 2 | — | — | — | £1.16 / 15.0 | Clue-visibility hard-stop on `clue_late_optional_slot_1` — an **optional**-criticality NSD clue landed in the enforceable set. Fixed `dd2190f6` (optional → advisory `optionalDowngraded` bucket); the M1 count starts after this fix. |
| `mystery-…7933768` (optics) | 2026-07-14 | **M1-1** | **SHIPPED** (gate `warning`) | 0 / 1 | 74 C | **68 (raw 70), 2 caps** | — | £0.27 / 20.3 | 10-ch. **Items 11+12 confirmed fixed live** (Ch10 = aftermath, no re-staged reveal; Ch1 opens with the generated scene). Caps: report-style ×2. Residual Ch10 clearance recitation → **Item 16**. |
| `mystery-…9393094` (poison) | 2026-07-14 | **M1-2** | **SHIPPED** (gate `warning`) | 0 / 1 | 95.93 A (phase-weighted) | **59 (raw 61), 2 caps** | — | £0.18 / 12.8 | 9-ch. Caps: template/validation-text leakage → prose ≤4 (**first cap-level occurrence** — Item 15 family) + **dualValueNoContrast → clues ≤6 (Item 9 recurs)**. |
| `mystery-…0164809` (tide) | 2026-07-14 | **M1-3** | **SHIPPED** (gate `warning`) | 0 / 1 | 74 C | **63 (raw 63), 2 caps** | — | **£1.23** / 25.0 | 9-ch. Caps: report-style ×2. Cost outlier ~6× — **NOT regen volume** (tide 27 regen calls at £1.23 vs acoustic 31 at £0.24; the aborted optics run read £1.16 having died at Agent 6.5): the `total_cost` field itself is suspect → check cost aggregation before using it for budget decisions. `structural.mechanismExplainedChapter=6` recorded with NO mechanism cap — watch the detector/rubric split. |
| `mystery-…1663248` (acoustic) | 2026-07-14 | **M1-4** | **SHIPPED** (gate `warning`) | 0 / 1 | 74 C | **65 (raw 69), 2 caps** | — | £0.24 / 23.7 | 9-ch. Caps: scaffold → prose ≤4 + ceil-65 (the scaffold family again). |
| `mystery-…3124632` (identity) | 2026-07-14 | **M1-5** | **SHIPPED** (gate `warning`) | 0 / 1 | 74 C | **63, `caps: []`** | — | £0.23 / 18.9 | 10-ch. Uncapped but LOW — the craft floor again (cf. S0-poison's 59). Identity is now the cap-free theme in **both** S0 and M1. |
| `mystery-…4257736` (clock) | 2026-07-14 | **M1-6** | **SHIPPED** (gate **`passed`**) | 0 / 1 | 74 C | **60 (raw 63), 3 caps** | — | £0.28 / **72.1** | 10-ch. First outright `passed` of the batch — while carrying 3 caps (scaffold + report-style ×2): the gate and the rubric measure different things. Duration outlier 72 min. |
| `mystery-…8590753` (poison) | 2026-07-15 | M1-7 (attempt 1) | **INTERRUPTED** — does not count | — | — | — | — | — | Machine stop ~04:52 mid-Agent-7 (report stuck `in_progress: true`; 12/12 upstream phases had passed). Not a pipeline abort. |
| `mystery-…3922125` (poison) | 2026-07-15 | M1-7 re-run | **ABORTED — NEW CLASS → count restarted** | abort | — | — | — | — | **Agent 6.5 voice-sketch cast-coverage hard-fail**: the model refuses to voice-sketch the **victim** (Hugo Vane) — sketches 5/6 on all 3 attempts (retry feedback fixed portraits, never sketches). Fixed `257f7855`: victim-exempt `enforceCastCoverage` (downstream find()s by name and tolerates absence; no fabricated victim dialogue). Fresh 8-run batch launched 2026-07-15. |

---

## 2. Reliability Ledger  *(abort channels — every row must read 0 occurrences per batch)*

| Hard-fail class | Lever / state (roadmap §6) | `a3c2973f` | `f90e5f09` | M1 runs 1–6 | Batch tally |
|---|---|---|---|---|---|
| `illegal_named_walk_on` | `AGENT9_WALKON_REPAIR` ON · built | 0 | 0 | 0 | 0/8 |
| `cleared_culprit_conflict` | construction guard (unflagged) · built | 0 | 0 | 0 | 0/8 |
| `missing_case_transition_bridge` (abort form) | `AGENT9_REGEN_TRANSITION` ON · built | 0 | 0 (warn-level FP only — Open Item 1) | 0 | 0/8 |
| season/mechanism FP | fixed · live | 0 | 0 | 0 | 0/8 |
| Agent-5 coverage abort | RC3.1 repair-not-abort · fixed | 0 | 0 | 0 | 0/8 |
| reveal never converges | `AGENT9_REGEN_RESOLUTION` ON | 0 | 0 | 0 | 0/8 |
| template-bleed openers | backstops live (audited 2026-07-12) | 0 | 0 | 0 | 0/8 |
| Agent-7 `scene.beat` enum | coercion + persistence live (audited) | 0 | 0 | 0 | 0/8 |
| **Truncated Agent-5 JSON → jsonrepair phantom clue** | parse filter + retry + max_tokens 6000 · **fixed 2026-07-12** | **1 — the abort** | 0 | 0 | 1/8 (pre-fix) |
| **Clue-visibility hard-stop on optional-criticality NSD clue** | `partitionNsdRevealedCluesForReleaseGate` → advisory `optionalDowngraded` · **fixed 2026-07-14 `dd2190f6`** | — | — | **1 pre-count abort** (optics `…5526685`) · 0/6 post-fix | 1 pre-fix, 0 since |
| **Agent 6.5 victim voice-sketch cast-coverage hard-fail** | victim-exempt `enforceCastCoverage` (accept a missing victim, never fabricate dialogue) · **fixed 2026-07-15 `257f7855`** | — | — | **1 — the run-7 re-run abort** (`…3922125`, poison) → **M1 count restarted** | 1 pre-fix, 0 since |

**Ship rate:** every abort class so far has been root-caused and fixed same-day (jsonrepair 2026-07-12; optional-clue visibility `dd2190f6` 2026-07-14; victim voice-sketch `257f7855` 2026-07-15). Attempt 1 post-`dd2190f6`: **6/6 shipped** — zero hard stops; every §2 row reads 0 across those runs. The restarted 8-run count (post-`257f7855`) is in flight. Run 7's first attempt was a machine interruption (not a pipeline abort) and doesn't tally here.

---

## 3. Cap Ledger  *(rubric ceilings on shipped drafts — frequency per batch; target 0)*

*Read `caps_applied` + `structural` from the report's `rubric_score` diagnostic. Aborted runs don't count (no honest rubric).*

| Cap | Lever | `f90e5f09` | poison | tide | acoustic | identity | M1 runs 1–6 | Shipped freq |
|---|---|---|---|---|---|---|---|---|
| `mechanismExplainedTooEarly` | `AGENT9_REGEN_MECHANISM` ON | 0 | 0 | 0 | 0 | 0 | 0 *(but see M1-3: `mechanismExplainedChapter=6` with no cap)* | 0/11 |
| `scaffoldHits` (incl. ceil-65 at ≥2) | `AGENT9_REGEN_SCAFFOLD` ON | 0 | 0 | **1** | **2** | 0 | **2** (M1-4 acoustic incl. ceil-65; M1-6 clock) | **4/11** |
| `reportStyleClearance` | same lever (scaffold pass) | 0 | 0 | **2** | **2** | 0 | **3** (M1-1 optics ×2; M1-3 tide ×2; M1-6 clock ×2) | **5/11** |
| `revealUsesUnplantedEvidence` | `AGENT6_DT_EVIDENCE_COMPLETENESS` ON | 0 | 0 | 0 | 0 | 0 | 0 | 0/11 |
| `templateLeakageHits` | **NO regen lever** — in-loop batch gate only (`AGENT9_REGEN_CLUE` doesn't exist as a flag; attribution corrected by the P3.1 audit → Item 17) | 0 | 0 | 0 | 0 | 0 | **1** (M1-2 poison → prose ≤4 — first cap-level occurrence; Item 15 family) | **1/11** |
| `culpritIsVictim` / role collision | `repairCaseSoundness` unconditional | 0 | 0 | 0 | 0 | 0 | 0 | 0/11 |
| `pronounsUnstable` | `AGENT9_BIBLE_AUTHORITATIVE` ON | 0 | 0 | 0 | 0 | 0 | 0 | 0/11 |
| `victimUnnamed` / `malformedEvidenceSurfacing` | fixed (landed) | 0 | 0 | 0 | 0 | 0 | 0 | 0/11 |
| `dualValueNoContrast` | A_57 D2 — **REOPENED** (fired on acoustic: "central clue stated as two flat values, not one contradiction" → clues ≤6) | 0 | 0 | 0 | **1** | 0 | **1** (M1-2 poison — recurrence, Item 9) | **2/11** |
| `weakMurderMethod` | RC3.5 tell · off | 0 | 0 | 0 | 0 | 0 | 0 | 0/11 |

**The S0 read: the scaffold/report-style family is THE dominant live cap (2/5 runs), and the lever's story is now precise** — the regen attempted on every capped run (tide Ch1/Ch10; acoustic Ch4/6/7/10) *and* on the uncapped identity run (Ch3/8/10) where it won. So the pass works sometimes and loses sometimes; whether it beats no-lever at all is exactly the P4 A/B question (Open Item 8). `dualValueNoContrast` reopened at 1/5 (Open Item 9).

**The M1 read (runs 1–6, 2026-07-14): caps fired on 5/6 shipped runs — the family is getting MORE frequent, not less.** Report-style 3/6, scaffold 2/6; `templateLeakageHits` reached cap level for the first time (M1-2 poison) and `dualValueNoContrast` recurred on the same run (Item 9, now 2/11). The only uncapped run was **identity — the same theme as S0's cap-free run**: treat theme as a confound when reading cap frequency, and make sure the P4 A/B pool is theme-matched. M1 median shipped rubric **63** vs the M2 bar ≥73 — P4's scaffold verdict is now clearly the biggest single lever on the board.

**P3.1 label audit (run 2026-07-15 on the six attempt-1 runs): the scaffold family is cleanly wired.** Every scaffold/report-style cap on every capped run has matching `Agent9-Regen-*-scaffold_not_prose` labels (optics Ch9/10; tide Ch4/6/9; acoustic Ch2/3/5/6/7/9; clock Ch4/6/9/10) — the caps are fired-and-lost (Item 8, lever effectiveness), **not** missing wiring, so the P4 A/B is safe to run. Two gaps found: `templateLeakageHits` and `dualValueNoContrast` have **no regen lever at any layer** (→ Item 17 / Item 9). Bonus finding: tide's `mechanism_revealed_early` regen fired (Ch6 ×2) and lost deterministically (`structural.mechanismExplainedChapter=6` persists) yet the rubric applied no cap — the detector is stricter than the rubric's reading there. Re-run this audit on the restarted batch at the P3 gate.

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

### M1 batch (runs 1–6, 2026-07-14)

| Category | Target | optics | poison | tide | acoustic | identity | clock | Mean (6) |
|---|---|---|---|---|---|---|---|---|
| premise | 8 | 8 | 7 | 7 | 7 | 7 | 7 | 7.2 |
| opening_hook | 8 | 7 | **6** | **6** | **6** | **6** | **6** | **6.2** |
| plot_structure | 8 | **6** | **5** | **6** | 7 | **5** | **5** | **5.7** |
| character_clarity | 8 | 7 | **6** | 7 | 8 | **6** | **6** | 6.7 |
| dialogue | 8 | **6** | 7 | **6** | 7 | 7 | 7 | 6.7 |
| atmosphere | 8 | 8 | **6** | 7 | 8 | 8 | 8 | 7.5 |
| clues | 8 | **6** | **5** (capped) | **5** | **6** | **5** | **5** | **5.3** |
| pacing | 8 | 7 | **6** | **6** | **5** | **6** | **6** | **6.0** |
| ending | 8 | 7 (capped) | 7 | 7 (capped) | 8 | 7 | **6** (capped) | 7.0 |
| prose | 8 | **6** (capped) | **4** (capped) | **6** (capped) | **4** (capped) | **6** | **4** (capped) | **5.0** |
| **Mean** | **8.0** | 6.8 | 5.9 | 6.3 | 6.6 | 6.3 | 6.0 | **6.3** |

**M1 floor: 6.3 vs S0's 6.5 — flat, as expected from reliability runs.** Prose is cap-dragged to 5.0 (three runs at 4) and **clues fell to 5.3** — now the second-worst category (S0: 6.2). plot_structure 5.7 with four runs at 5–6. opening_hook is a uniform 6 wall except optics (7 — the run where Item 12's fix was confirmed live; suggestive, not conclusive at n=1). The floor lift remains P4 (caps) + P5 (craft); nothing here changes that ordering, but clues' slide says Item 9 deserves its pre-P4 look.

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
| 9 | **`dualValueNoContrast` REOPENED** (acoustic) — "central clue stated as two flat values, not one contradiction" → clues ≤6; the Cap Ledger had this marked fixed (A_57 D2) | cap regression or sub-shape the D2 fix missed | **2/11 shipped — recurred on M1-2 (poison) 2026-07-14**; check both runs' central-clue phrasing vs the D2 detector before P4; candidate small fix; clues is now the second-worst floor category (5.3) |
| 10 | **Internal rubric UNDERSCORES by ~9.5** (S0 externals: −16/−3/−13/−6) — opposite direction from the A_57 blind-spot; external reads plot/pacing/ending 1–2 marks higher than internal on the same stories | rubric calibration (M3 gap ≤3 fails) | safe direction (no false-80 risk) but the honesty criterion fails; diagnose AFTER caps are extinguished — capped runs (tide/acoustic) show the biggest single-category divergences, so Item 8 may close much of this |
| 11 | **Ch9/Ch10 duplicated reveal — flagged by ALL FOUR external reads** ("Chapter 10 should be aftermath only") | structural — root-caused: `getCulpritRevealChapter`'s last-chapter fallback gave Ch10 the full MANDATORY-RESOLUTION mandate even when Ch9 (`final_trap`) already revealed | **FIXED 2026-07-14 (`2b6cfc23`, beat-aware stage classifier)** — `resolveStageModeKey` returns `aftermath_consequence` for the final chapter when the outline authored a `revelation` beat after an earlier `final_trap`; only fires on beat-authored (10-ch Golden-Age) arcs, never suppresses a legitimately-late reveal. **Confirmed live on M1-1** (10-ch optics): Ch10 = aftermath, no re-staging. Residual clearance recitation → Item 16. |
| 12 | **Ch1 opens with reveal-like exposition, then "restarts" with the discovery** (poison + tide: "duplicated/generated opening") | deterministic clue-materialization repair (`applyDeterministicCluePatch`) prepended two templated clue paragraphs at index 0 — *not* the grounding-lead pass | **FIXED (`4826eb80`, `earlyInsertAt = max(1,…)` — the repair never opens a chapter)** + regression test; the worker's dist was stale until `build:all` 2026-07-14. **Confirmed live on M1-1**: Ch1 opens with the generated scene. Watch opening_hook for movement (M1-1 scored 7 vs the batch's 6 wall). |
| 13 | **Pronoun drift visible in ALL FOUR external reads while the internal `pronounsUnstable` cap stayed silent** | internal gate under-detects (sweep repairs the countable cases; residuals remain) | quantify: run the pronoun validator standalone on the S0 stories; if it reads clean while externals see slips, the detector needs the externals' examples |
| 14 | **Signature tics read as "artificial repeated catchphrases"** (3/4 reads) — the RC5.3 idiolect injection is landing but reads mechanical | craft/lever tuning | feed into P5: tic frequency cap or variation; the voice A/B (`AGENT9_VOICE_ENFORCE`) should measure dialogue mark movement, not just leakage |
| 15 | **Prompt-leakage lines externally visible** ("The hour stood at…", "The investigation had entered a new phase…") below the internal linter's ≥2-hits cap threshold | template-leakage detector gap (sub-threshold instances) | collect the externals' quoted lines as linter fixtures; low priority until Items 8/11 land. **Related: the leakage family reached full cap level on M1-2 (poison, `templateLeakageHits` → prose ≤4)** — the detector fires when hits are dense enough; the gap is only the sub-threshold tail |
| 16 | **Ch10 aftermath still recites suspect clearances** (found on M1-1 with Item 11's fix live) — no re-staged accusation/confession, but per-suspect clearance recitation persists ("Dr. Finch was innocent…"), incl. an injection artifact ("the **Confirmed** alibi by hotel staff…") | deterministic suspect-clearance injection that runs regardless of stage mode (the capitalized "Confirmed" is the tell) | NEW 2026-07-14; candidate for the injector-layer deletion (P4.4 / LLD P7); low priority — milder than the old full duplicate, not blocking |
| 17 | **`templateLeakageHits` cap has no regen lever** — P3.1 audit (2026-07-15): template leakage is gated only in-loop (batch gate) during generation; leakage that survives to the shipped draft reaches the rubric uncorrected (fired on M1-2 poison → prose ≤4). The Cap Ledger's `AGENT9_REGEN_CLUE` attribution was wrong — no such flag exists. `dualValueNoContrast` likewise leverless (that's Item 9's route). | wiring gap, 1/11 frequency | logged, deliberately NOT fixed mid-count (a code change restarts M1 for a 1/11 cap). Decide at the P3 gate: recurs in the restarted batch → add the regen kind and restart; 0/8 → fold into Item 15's linter-fixture route |

---

## 6. What's next

The immediate three moves (2026-07-15): finish the **restarted** M1 gate — 8 fresh runs post-`257f7855`, chained fail-fast (poison, tide, optics, acoustic, identity, clock, poison, tide); then P3.1 (verify every fired cap has a matching `Agent9-Regen-*` label in `logs/llm-prompts-full.jsonl` — not yet done); then assemble the P4 A/B pool (theme-matched — identity is a known cap-free confound). The full path is §7.

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
| **P4.3** | `RUN` (×8 matched pairs) | **Rescoped 2026-07-15 (−25%):** powered A/B on `AGENT9_REGEN_SCAFFOLD` only — the sole lever whose caps fire at measurable frequency (report-style 5/11, scaffold 4/11; every other target cap 0–1/11). Other regens keep observational verdicts (stay ON, zero caps across the batch); plausibility judge stays shadow. Pool theme-matched (identity = cap-free confound). Read raw scores + cap frequencies, never the band. | scaffold accept/reject verdict with deltas appended to this file |
| **P4.4** | `CODE` | S13: flip code defaults for winners; delete the injector layer (LLD P7) once every RC-1 regen is validated-on. | full suite green; empty-`.env.local` run behaves like the validated config |

**Exit P4:** every lever has a powered verdict; defaults match the evidence.

### Phase 5 — The craft lift *(the last 74→80 push; targets §4's floor)*

| Step | Kind | What | Exit check |
|---|---|---|---|
| **P5.1** | `RUN` A/B | S14 (rescoped 2026-07-15): A/B **two** craft levers in isolation — critique-rewrite targeting (aim it at opening_hook/dialogue/pacing) and `AGENT9_VOICE_ENFORCE=enforce` (the RC5.3 repair is built and untested live). Model tiering moved to the decision-gated reserve (buy only in the 76–78 gray zone). | each lever moves its target category ≥+1 with nothing regressed |
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
