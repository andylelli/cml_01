# Analysis Index

This folder tracks run-level failure analysis reports and consolidated issue lists.

## Latest
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
