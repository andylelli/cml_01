# Analysis Index

This folder tracks run-level failure analysis reports and consolidated issue lists.

## Latest
- `ANALYSIS_57/ANALYSIS_57.md` — **strategy: prose into the 80+ ChatGPT band.** Deep-dive on run `09168377` (internal K2 80 / ChatGPT 70). §1–8: seven generic, parameter-agnostic defect classes (D1 verbatim-locked-fact garble, D2 self-contradicting central clue, D3 mechanism-environment incoherence, D4 injection template prose, D5 pronoun instability, D6 functional dialogue, D7 abstract test) + the meta-lever (teach the internal judge to see the polish defects so we stop optimising blind). **§9: the architectural deep-dive** — collapses the seven symptoms into three root solutions, one per quality pillar (Coherent ← a canonical world-state ledger; Logically sound ← a discriminator verifier; Interesting ← dramatization-not-declaration) + the generation contract (construct→verify→draw→dramatize→judge-all-three) and a best-value build order. Prioritised P0/P1/P2 with code/measurement/model-tier disposition.
- `ANALYSIS_56/ANALYSIS_56.md` — **CURRENT source of truth for agents 1–8.** Consolidated "what's left" register, verified against live code by a 19-agent workflow (240 candidates → mostly already-done; docs lag code). Defines the implementation line (Waves A–C: deterministic code) vs the separate flag-flip-and-measure and research/defer tracks. Records that A_55 #2/#3b/#4/#5 already closed several items the older docs still list open.
- `ANALYSIS_55/ANALYSIS_55.md` — failure-run review (K2=0 false-zero) + the 5 root causes (all fixed): parser object-map shape, mechanism-gate enforcement, culprit-near-death FP, victim active-after-death, completion-first severity, G4 gap.
- `ANALYSIS_54/ANALYSIS_54.md` — 3-run validation of A_53; cross-run-novelty cost inconclusive/confounded (kept shadow); top findings (culprit-near-death FP, scene-grounding FN, G4 gap, resolution fragility).
- `ANALYSIS_53/ANALYSIS_53.md` — the 11-phase repair-not-abort tracker (~98/103 done) + deferrals.
- `ANALYSIS_52/ANALYSIS_52.md` — **the role model + the remaining work** — supersedes A_51. K1 (named victim) + K2 (rubric honesty) landed and the pipeline now completes (K2 honest in situ, 62/100); formalizes the cast **role model** (1 detective + 1 victim + n-2 suspects, n≥5) that closes the victim dead-and-alive class, and re-orders the remaining work around triad-effectiveness-in-prose. *(Directory doc — distinct from the older flat `ANALYSIS_52_run_970b323c_error_warning_report.md`.)*
- `ANALYSIS_51/ANALYSIS_51.md` — outstanding issues, restated (post-triad register) + the detailed K1/K2 build, two live diagnoses, and Fix #1/Fix #2 record (§3.1–§3.7). **Superseded by A_52 for tracking; retained as the build history.**
- `ANALYSIS_50/ANALYSIS_50.md` — outstanding issues by agent (consolidated register + the §9 structural-pivot investigation + triad fixes). **Superseded by A_51 for tracking; retained as history.**
- `ANALYSIS_49/ANALYSIS_49.md` — implementation plans for the four deferred A_48 items (novelty store, clue restructure, Agent 7 scheduler+budget, voice gate)
- `ANALYSIS_48/ANALYSIS_48.md` — agents 1–8 to 90% prose-fitness (vanity-scorer + shadow-machinery thesis) so Agent 9 can reach 80
- `ANALYSIS_47/ANALYSIS_47.md` — upstream-vs-prose ablation + ROADMAP_TO_80/90
- `ANALYSIS_44/ANALYSIS_44.md`
- `ANALYSIS_43/ANALYSIS_43.md`
- `ANALYSIS_42/ANALYSIS_42.md`
- `ANALYSIS_41/ANALYSIS_41.md`
- `ANALYSIS_40/ANALYSIS_40.md`
- `ANALYSIS_28/ANALYSIS_28.md`
- `ANALYSIS_27/ANALYSIS_27.md`
- `ANALYSIS_26/ANALYSIS_26.md`
- `ANALYSIS_57_agent4_required_evidence_checklist_status.md`
- `ANALYSIS_56_run_20f9ca27_prompt_review.md`
- `ANALYSIS_55_run_34d713c0_error_warning_report.md`
- `ISSUES_05.md`
- `ANALYSIS_54_run_71e31ebd_error_warning_report.md`
- `ISSUES_04.md`

## Run Triage Table

| Date       | Analysis | Run ID (short) | Status | Primary failure class |
|------------|----------|----------------|--------|-----------------------|
| 2026-06-24 | `ANALYSIS_50` | `9b824eb2` | complete (10/10) | **First clean corrected-build baseline.** Tier-1 keystones **HELD** — death-method / pronoun / season-lock killers did not recur (every structural judge-flag passes; no churn, no abort). Rubric **71 LLM / 68 shadow**. Loss now concentrated in *open levers*: `pacing 6` + `opening_hook 6` (Agent 7 mechanical repetition — same timeline contradiction restated ×4 in Ch1; chapters ~1.0k–1.46k words, so **T1.2/T2.11, not T1.3**) and `premise 7` (Agent 8 novelty **skipped**, threshold ≥1.0). New polish leaks: **title scaffold** ("Generated in scene batches…") + **`the the`** doubled-word. |
| 2026-06-19 | `ANALYSIS_44` | `70ac132d` | incomplete (died at Ch4/10) | Validation run for ANALYSIS_43 G/H/I. A–D content fixes confirmed holding (0 leakage/setting/reveal/pronoun in committed Ch1–3; D2 gate caught+cleared a Ch3 `mechanism access point` leak). G/H/I **never exercised** — they run at final validation, but the run died in per-chapter prose generation. New run-killer = template linter `template_bleed` (repeated paragraph openers) firing every chapter, no exhaustion backstop → no story produced; report frozen green 97.85/A `in_progress`. |
| 2026-06-18 | `ANALYSIS_43` | `1d55f7c7` → `5411ba7f` | aborted (fixes landed) | Baseline 1d55f7c7: verbatim schema/test leakage + post-LLM pronoun corruption & setting dump + dead disclosure embargo (premature reveal) — Layers A–D landed. Follow-up 5411ba7f (74/C, aborted): those killers did NOT recur; new blockers = victim-alive/identity slip (Ch3) + male→female pronoun miss (Ch5), both deterministically repairable but routed to terminal abort (recs G/H/I). |
| 2026-06-16 | `ANALYSIS_42` | `bdaf4d70` | warning | False-green passed run: upstream timeline contradiction + locked-fact injection + deterministic fallback prose regression |
| 2026-06-15 | `ANALYSIS_41` | `88ed23b2` | failed | Agent9 prose abort at chapter 9 after retry/fallback exhaustion; final reveal completeness gate not satisfied |
| 2026-05-28 | `ANALYSIS_28` | `17799935` | warning | Deep-dive errors: template_leakage Ch5/7; completeness_structure Ch7/10; clue_timing Ch10; 4 major post-gen validators |
| 2026-05-28 | `ANALYSIS_27` | `17799935` | warning | G6-Q1 culprit full-name gate false positive; 4 major issues; ChatGPT prose 72/100 |
| 2026-05-28 | `ANALYSIS_26` | `17799884` | failed | Cast Design abort (score 85 < threshold); locked fact value omission; pronoun false positives |
| 2026-05-07 | `ANALYSIS_07` | `17781744` | failed | Fair-play structural abort before prose with novelty telemetry/scoring mismatch |
| 2026-04-24 | `ANALYSIS_57` | `20f9ca27` | partial | Checklist audit: Agent 4 prompt contract implemented; acceptance gate still open (suggest replay still shows `cml.required_evidence_missing`) |
| 2026-04-18 | `ANALYSIS_56` | `20f9ca27` | failed | Agent 4 revision non-convergence after fair-play escalation; prompt-contract drift in retries and audit traceability |
| 2026-04-14 | `ANALYSIS_55` | `34d713c0` | failed | Agent 5 discriminating-test evidence mapping + weak suspect elimination/alibi gate failure |
| 2026-04-14 | `ANALYSIS_54` | `71e31ebd` | failed | Agent 5 suspect-coverage hard gate failure after retry |
| 2026-04-14 | `ANALYSIS_53` | `27958eec` | failed | Agent 9 pre-prose CML integrity contradiction abort |
| 2026-04-13 | `ANALYSIS_52` | `970b323c` | failed | Agent 9 chapter generation runtime exception |
| 2026-04-13 | `ANALYSIS_51` | n/a | strategy doc | Pre-prose enrichment strategy review |

## Analysis Reports
- `ANALYSIS_50/ANALYSIS_50.md` — outstanding issues by agent (consolidated register)
- `ANALYSIS_44/ANALYSIS_44.md`
- `ANALYSIS_43/ANALYSIS_43.md`
- `ANALYSIS_42/ANALYSIS_42.md`
- `ANALYSIS_41/ANALYSIS_41.md`
- `ANALYSIS_40/ANALYSIS_40.md`
- `ANALYSIS_07/ANALYSIS_07.md`
- `ANALYSIS_57_agent4_required_evidence_checklist_status.md`
- `ANALYSIS_56_run_20f9ca27_prompt_review.md`
- `ANALYSIS_55_run_34d713c0_error_warning_report.md`
- `ANALYSIS_54_run_71e31ebd_error_warning_report.md`
- `ANALYSIS_53_run_27958eec_error_warning_report.md`
- `ANALYSIS_52_run_970b323c_error_warning_report.md`
- `ANALYSIS_51_pre_prose_enrichment_strategy.md`

## Issue Lists
- `ISSUES_05.md`
- `ISSUES_04.md`
- `ISSUES_03.md`
- `ISSUES_02.md`
- `ISSUES_01.md`

## Archive
- See `archive/` for older `ANALYSIS_*` reports.
