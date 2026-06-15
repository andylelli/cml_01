# ANALYSIS_36 — Run `run_52999c10-8f10-4a61-8310-338bb73257b2`: Retry Exhaustion + Identity Continuity Collapse
*Date: 2026-06-13 | Run: `run_52999c10-8f10-4a61-8310-338bb73257b2` | Story folder: `story_20260613-2133` | Duration: 609.5s | Pipeline status: warning*

---

## 1. Scope

This analysis covers all warnings, failures, retries, and quality defects for run `run_52999c10-8f10-4a61-8310-338bb73257b2` using:

- `data/store.json` run event stream and warning payload
- `stories/story_20260613-2133/generated_in_scene_batches_8_batch_es_required_r.md`
- `stories/story_20260613-2133/chatgpt-review.txt`
- `apps/api/data/reports/proj_64310fe1-5dff-47f3-a70c-17967afcc266/run_52999c10-8f10-4a61-8310-338bb73257b2.json`

---

## 2. Outcome Summary

| Item | Value |
|---|---|
| Pipeline status | Warning (completed) |
| Run completion | 10/10 chapters generated |
| Batches requiring retry | 8 |
| Chapters with retry exhaustion fallback | 3 (Ch3, Ch7, Ch9) |
| Total failed chapter attempts | 24 |
| Avg failed attempts per affected chapter | 3.0 |
| Cumulative system prose score | 98/100 |
| External review score | 53/100 |
| Score gap | 45 points |

### Key contradiction

The run is structurally “passed” in internal scoring but contains a story-breaking identity conflict:

- Chapter 1 presents **Felix Vautier as the corpse/victim**.
- Later chapters treat **Felix Vautier as alive**, interrogated, and ultimately confessional culprit.

This single defect invalidates narrative continuity and dominates reader-facing quality.

---

## 3. Full Failure and Warning Inventory

## 3.1 Prose validation failures by chapter

| Chapter | Failed attempts | Final failure class | Fallback used | Notes |
|---|---:|---|---|---|
| 1 | 1 | Template opener repetition (`ellen s`) | No | Recovered on retry 2 |
| 2 | 0 | — | No | First-pass success |
| 3 | 6 | Template opener repetition (`ellen paused`) | Yes | Severe collapse chapter (445 words) |
| 4 | 1 | Template opener repetition (`ellen s`) | No | Recovered on retry 2 |
| 5 | 1 | Stage mode (`suspect_pressure` premature resolution) | No | Recovered on retry 2 |
| 6 | 0 | — | No | First-pass success |
| 7 | 6 | Stage mode (`suspect_pressure` premature resolution) | Yes | Severe collapse chapter (332 words) |
| 8 | 1 | Scene cast coverage missing (`Ellen Lacy`) | No | Recovered on retry 2 |
| 9 | 6 | Stage mode (`suspect_pressure` premature resolution; first two attempts had 2 issues) | Yes | Severe collapse chapter (320 words) |
| 10 | 2 | Boundary integrity (unbalanced quotation marks) | No | Recovered on retry 3 |

### Failure concentration

- Template/opener class: Ch1, Ch3, Ch4 (8 failed attempts total)
- Stage-mode class: Ch5, Ch7, Ch9 (13 failed attempts total)
- Cast coverage class: Ch8 (1 failed attempt)
- Boundary integrity class: Ch10 (2 failed attempts)

The run has two dominant failure loops:
1. opener repetition loop (early chapters)
2. suspect-pressure early-resolution loop (mid/late chapters)

---

## 3.2 Pipeline warnings and deterministic remediations

From pipeline warnings and clues phase events:

1. **Agent 5 deterministic mode active** (LLM retry loops disabled by default).
2. **Inference coverage warning:** 2 red herrings overlapped true-solution signals (`rh_1`, `rh_2`).
3. **Red-herring overlap sanitizer applied** for both IDs.
4. **Temporal lexical collision warning:** shared tokens between false-assumption and correction lexicons (`clock`, `quarter`).
5. **Strict mapping contract synthesis:** `clue_culprit_direct_felix_vautier` cloned from `clue_11`.
6. **Strict direct culprit source repair:** mapped to `CASE.cast[0].access_plausibility`.
7. **Strict late clue slot repair:** synthesized `clue_late_optional_slot_1`.
8. **Agent 6 deterministic mode active**; structural pre-audit passed.
9. **Scoring report generation failed:** invariant `nsd_revealed_clues_missing_evidence_anchors`.

Additional clues-phase signals from event stream:

- Non-canonical `discriminating_test.evidence_clues` were normalized.
- Evidence IDs were seeded deterministically from canonical clue IDs (`clue_11`, `clue_12`, `clue_2`).

This indicates upstream clue-ID drift was already present before prose generation.

---

## 3.3 Post-run state inconsistencies

There are reporting inconsistencies between surfaces:

| Field | Pipeline events | API report JSON |
|---|---|---|
| Overall run status | warning | `run_outcome: passed` |
| Release gate | warning-bearing completion | `release_gate_outcome.status: unknown`, warning_count 0 |
| Total cost | £0.3480 | 0.0571 |

These inconsistencies reduce trust in telemetry and can mask operational risk in dashboards.

---

## 4. Story-Quality Defects (Reader-Facing)

## 4.1 Critical

1. **Victim/Culprit identity continuity break (fatal narrative defect).**
2. **Prompt/validator leakage into prose** (meta lines about chapter movement/evidence handling appear in narrative chapters).
3. **Fallback-short chapters** (Ch3/7/9) far below intended prose quality floor and investigative function.

## 4.2 High

4. **Stage-mode governance instability** in suspect-pressure chapters (repeated premature resolution impulses).
5. **Pronoun/reference instability** across cast mentions (degrades clarity and trust).

## 4.3 Medium

6. **Mechanism exposition repetition** (clock/soot/time contradictions repeatedly over-explained).
7. **Ch8-Ch9 functional weakness** (test preparation and discriminating test staging not cleanly differentiated).

---

## 5. Root Cause Analysis

### RC1 — Missing hard identity continuity gate

No deterministic pre-prose gate blocked an impossible lifecycle transition where a named victim later appears alive as active suspect/culprit.

Impact: catastrophic reader-facing contradiction that bypasses high internal score.

### RC2 — Retry packet mismatch for dominant prose failures (at run time)

Opener repetition and stage-mode failures repeated through multiple attempts, indicating retry guidance did not reliably alter generation trajectory for those classes in this run.

Impact: 24 failed attempts, 3 fallback chapters.

### RC3 — Deterministic clue contract patching masks upstream drift

Agent 5 had to normalize/seeding/synthesize clue mappings and direct culprit clue artifacts, indicating CML-to-clue namespace drift and insufficient pre-commit contract parity.

Impact: more warnings, less semantic stability, downstream trace fragility.

### RC4 — NSD transfer trace anchor parity not guaranteed (run-time behavior)

Newly revealed clue IDs were present in transfer trace without matching evidence anchors, triggering report invariant failure.

Impact: scoring report generation failure despite completed story.

### RC5 — Internal score objective mismatch

System scoring emphasizes structural checks and chapter-level metrics but underweights reader-trust failures (identity continuity, leakage severity).

Impact: 98/100 internal vs 53/100 external.

---

## 6. Strategic Fix Plan (Holistic, Not Run-Specific)

## 6.1 P0 — Identity continuity as hard invariant (Likelihood 10/10)

Add a deterministic lifecycle ledger gate before prose and at chapter commit:

- If a character is marked victim/deceased in any committed chapter, block later chapters from active dialogue/interrogation/confession roles unless explicit resurrection mechanics exist (none in schema).
- Fail-fast generation for violation, not warning.

This must be release-blocking.

## 6.2 P1 — Failure-class specific retry control for Agent 9 (Likelihood 9/10)

Route retries by failure family with distinct packets:

- `template_bleed_openers`
- `stage_mode_outcome`
- `scene_cast_coverage`
- `boundary_integrity`

Each packet should carry:
- exact offending text/token
- deterministic do-not-repeat constraints
- chapter-role hard rules

Stop using broad generic retry text for these classes.

## 6.3 P2 — Stage-mode prevention, not cure (Likelihood 9/10)

Inject suspect-pressure prohibition in base obligations and final-attempt packet:

- no confession
- no explicit culprit naming as resolved
- no arrest language

Validator and prompt must share identical rule terms.

## 6.4 P3 — Fallback quality floor and expansion pass (Likelihood 8/10)

Completion fallback should preserve readability baseline:

- hard floor for fallback chapters in short mode (>=850 words)
- deterministic expansion scaffolds for dialogue/evidence beats
- preserve chapter function requirements

Prevents 300–450 word collapse chapters from shipping.

## 6.5 P4 — Clue namespace contract hardening between Agent 3 and Agent 5 (Likelihood 8/10)

Upstream contract should guarantee discriminating evidence IDs align with canonical clue IDs before clues run.

- pre-validate `evidence_clues` ID set against clue distribution namespace
- deterministic remap where safe
- reject impossible mappings before prose

## 6.6 P5 — NSD anchor parity guarantee with quality label (Likelihood 9/10)

Always ensure each `newly_revealed_clue_id` has anchor representation in transfer trace.

- synthetic anchor fallback allowed for parity
- include anchor quality class (`explicit`, `hinted`, `synthetic`)
- scoring/report should surface quality degradation without failing persistence

## 6.7 P6 — Score alignment with reader trust (Likelihood 10/10)

Add trust-weighted hard penalties:

- victim/corpse continuity break => cap score <=60
- prompt leakage above threshold => cap grade to C or below
- fallback-short chapter count >1 => strong completeness penalty

Align internal score to external quality reality.

---

## 7. Prioritized Actions

| Priority | Action | Layer | Likelihood |
|---|---|---|---|
| 1 | Identity continuity hard gate (victim lifecycle ledger) | Validation/Release | 10/10 |
| 2 | Reader-trust score penalties and caps | Scoring | 10/10 |
| 3 | Stage-mode prohibition in obligations + retries | Prompt/Validation | 9/10 |
| 4 | Failure-class retry packets for Agent 9 | Generation control | 9/10 |
| 5 | NSD anchor parity + quality labels | Reporting/Telemetry | 9/10 |
| 6 | Fallback expansion floor | Generation quality | 8/10 |
| 7 | Agent3→Agent5 clue namespace hardening | Upstream contracts | 8/10 |
| 8 | Mechanism repetition dampening | Prose polish | 6/10 |

---

## 8. Net Verdict

Run `run_52999c10-8f10-4a61-8310-338bb73257b2` is a high-completion, low-trust output:

- It completed all chapters and passed many structural checks.
- It failed reader-critical coherence due to unresolved identity continuity.
- It required heavy retry/fallback behavior and deterministic patching.
- It surfaced telemetry/report integrity gaps that obscure real quality risk.

Primary conclusion: this is not a “prompt tuning” miss; it is a control-plane and invariant-enforcement gap. The most valuable next fixes are deterministic gates and score-alignment changes that prevent impossible narrative states from ever reaching final story output.
