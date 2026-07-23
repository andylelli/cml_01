# ANALYSIS_66 — Pronoun drift: the six-month war, ended by forensics

**Written:** 2026-07-23 · **Trigger:** the probe-#1 external review ("pronoun drift is still severe… fixing it alone reaches 84–87") · **Method:** a 6-agent evidence workflow (machinery map ×3, forensics ×3; ~795K tokens, 226 tool calls; structured results in `scratchpad/a66/`) + main-loop design and adversarial judging. **Regime:** §2.8 — fixture-first, probes shared, the A_65 §4 anti-mole laws binding.

**The one-sentence status:** the drafts were clean — **every one of probe #1's 27 shipped drift instances was manufactured by our own deterministic pronoun repair** (proven by byte-for-byte replay: the reviewer's headline sentence was written by the LLM as "***He** felt the ache of **his** own failure*"), running on a path that ignores the `pronoun_policy: verify` setting, seeded by false-positive detectors, unwrapped by the D5 guard, scored as an *improvement* by a metric sharing the same fallacy, and invisible in telemetry — so the plan below is not a coreference moonshot; it is the fourth and largest Type-B self-interference kill of the week.

---

## 0. PROGRESS TRACKER

| Phase | What | Cost | Depends on | Status | Last update |
|---|---|---|---|---|---|
| — | Evidence workflow (map ×3 + forensics ×3; census, replay proof, cross-story test) | £0 | — | ✅ done | 2026-07-23 |
| **1** | STOP THE VANDALISM: the parity path obeys the policy; no deterministic pronoun mutation under `verify` | ~1h | — | ⬜ | — |
| **2** | The guard law: any pronoun-mutating pass wraps in a HIGH-PRECISION-metric guard; no pronoun writes after the ship-check | ~1–2h | 1 | ⬜ | — |
| **3** | Wire verify's promised repair: high-precision detections → `pronoun_mismatch` defects → the (existing, never-fed) validator-gated LLM regen | ~2–3h | 1 | ⬜ | — |
| **4** | Fix the binding fallacies: object-position capture, the "Dr." splitter, reflexive/hers coverage, the guard metric | ~2–3h | 2 | ⬜ | — |
| **5** | Detector precision retrofit + telemetry: proximity heuristic demoted to measure; pronoun counters into run_warnings + the TSV; census fixtures | ~2h | — | ⬜ | — |
| **6** | Probe #3 + the standing shipped-page pronoun census; then ONE external re-read | ~£1.5 + owner ~20min | 1–5 | ⬜ | — |

**Acceptance:** probe #3 ships with **zero** census-detected drift on the page AND **zero unguarded pronoun mutations applied**; the external re-read no longer lists pronouns among the top problems. (The reviewer's arithmetic: this is worth ~6–9 external points — the difference between 78 and the mid-80s.)

---

## 1. What the external review said — and what the evidence did to it

The reviewer's diagnosis was **role-pronoun contamination**: the model assigns pronouns from the role's usual occupant (prior drafts had a female investigator), not the character holding it. The cross-story test **refutes the strong form**: the three female-investigator stories carry 14–26 drift instances each, Eleanor-as-investigator is herself masculinized 5–10 times per story, and the single largest drift target across four stories is **Captain Ivor Hale — male, never the investigator — 33 instances, all feminized**. A female-investigator prior cannot produce any of that. What survives is a weak form: a male investigator attracts ~3× the investigator-directed drift — but the S1 cast is five-sixths female, so *local gender dominance* explains it as well as role memory does (drift direction is 67% male→feminine, matching the cast balance).

The reviewer was right that it's severe, right that it's the top blocker, and wrong — reasonably, from outside — about the mechanism. The mechanism is ours.

## 2. THE SMOKING GUN (entry-point forensics, proven by replay)

For every one of the 27 shipped drift instances in probe #1: **GENERATED-WRONG: 0. REPAIR-MISSED: 0. INTRODUCED-BY-OUR-POST-PROCESSING: 27/27.** All ten accepted Agent-9 chapter drafts are pronoun-clean (the per-chapter pronoun gate passed 10/10). Node-replaying the shipped `repairChapterPronouns` dist on the clean drafts **reproduces all 28 pronoun-token flips byte-for-byte**, including the reviewer's flagged sentence, and produces zero changes on ch7/ch9 — precisely the two chapters that shipped clean.

The five-link chain, each link verified:

1. **The policy split-brain.** `generation-params.yaml:549` sets `pronoun_policy: verify` — comment: *"deterministic fixer stays off (it corrupted prose historically)"* — which correctly disables every policy-gated repair. But `pronoun_gate_parity_enabled: true` (yaml:438) runs `applyTargetedPronounSweep → repairChapterPronouns` **anyway**. The owner's own config said don't; a second flag did.
2. **False-positive seeding.** Replaying the validators on the *clean* assembled drafts yields 23 moderate `pronoun_drift` (the ±200-char proximity heuristic) + 2 major `pronoun_gender_mismatch` — naming ALL SIX cast members. The repair's target list is built by regex-parsing these messages. Garbage in.
3. **The binding fallacy.** `repairPronouns`' single-mention rule — *"exactly one character named in a sentence ⇒ every pronoun is theirs"* — rebinds SUBJECT pronouns to OBJECT-position names: "*He* knelt beside **Eleanor Voss**" → "*She* knelt beside Eleanor Voss" (12 of 27). Its directional-verb guard covers 12 verbs; *watched/felt/wondered/knelt-beside/save* are not among them. The sentence splitter also breaks on "**Dr.** Finch" — the same honorific-period class that blinded the A3 detector.
4. **The guard that guards nothing.** The D5 monotonic guard wraps two *other* passes (both no-ops under `verify`); the parity path is bare. Worse, the guard's metric (`countChapterPronounMismatches`) uses the same nearest-named-entity fallacy — **the corruption scores as an improvement**.
5. **Invisible.** The path's own warning pushes never surfaced in the artifact's `run_warnings` — a telemetry gap to root-cause in Phase 5 (the F5 diagnostic captured other warnings fine).

Bonus, same layer: the reviewer's ch10 "validation-style" leakage sentence appears in **no** LLM response — it was written by the deterministic suspect-elimination injection mangling its template. The post-LLM layer was this run's entire quality deficit.

## 3. The census (what shipped, classified)

27 instances / 36 wrong tokens across ch1–6, 8, 10 (ch7/ch9 clean). **Dialogue is 100% correct across 10 chapters — every drift is narration.** 22/27 are Hugo-as-she; 5 are other characters, bidirectional. The structural signatures:

- **Cataphoric capture**: sentence-initial "She" + investigator action verb + female-name-as-OBJECT later ("She caught **Dr. Finch's** eye", "She knelt beside **Eleanor Voss**") — in most, the nearest PRECEDING name is the *correct* male name. This is the replay's object-rebind class, visible in the text.
- **Sticky runs**: 8/27 are continuations of an immediately-preceding drifted sentence (the repair flips a run wholesale).
- Drift concentrates in name-sparse reflective narration (openings, evidence beats, the epilogue); the name-dense denouement is clean.

## 4. Six months of history, one pattern (the map agents' verdict)

Every era's fix worked at its own layer and was defeated one layer up: the ANALYSIS_17 prompt locks failed to context distance; ANALYSIS_20's full-chapter LLM rewrites *caused* 15–17 errors/run (re-gendering) and were replaced by phrase substitution; the deterministic sweeps failed to shape-blindness; A_57 D5 added the monotonic guard — around the wrong passes; Item 13 (owner's spec) fixed detector *precision* for name-adjacent shapes — and the added suppression guards (opposite-gender-nearby, −10/+3 windows, competitor checks) collapsed detection *recall* in mixed-gender chapters to near zero. Today's detectors are **uniformly name-anchored** (name-in-sentence, ±200-char window, nearest-referent-≤2-paragraphs) — there is no POV or discourse-state concept anywhere, so unanchored viewpoint narration is structurally invisible to every layer. And `verify`-mode's documented contract — *"repairs go through LLM regen, validator-gated"* — was **never wired**: `pronoun_mismatch` has an instruction, a regen path, and **zero producers**.

Also noted for honesty: the internal `pronounsUnstable` cap read 0/20 while all four S0 externals saw drift — partly version skew, partly the recall collapse. The internal instrument has never measured this class.

## 5. THE DESIGN — judged in the main loop (the workflow's design/judge agents hit the session cap; evidence was complete, so the judging is mine, adversarially self-checked against the census + history)

**The controlling insight: this is not a hard AI problem in our pipeline today. The generation layer, with its existing gender-map prompts, produces clean drafts (10/10 chapters, probe #1). The entire shipped defect is self-inflicted. Therefore the fix is ordered: first stop the vandalism (sufficient for everything probe #1 shipped), then wire the honest path for the true-drift residual that older stories show the LLM does sometimes produce.**

- **P1 — Stop the vandalism.** The parity/targeted path obeys `pronoun_policy`: under `verify`, NO deterministic pronoun mutation, period. This one change ships probe #1's story drift-free — proven, not predicted (the drafts were clean).
- **P2 — The guard law.** Any pronoun-mutating pass that remains reachable (strict-policy runs, future flips) must wrap in `applyPronounGuardedMutation`, and the guard metric changes to the **high-precision detector family only** (`detectAttributionFlips` + `detectImpossibleSelfReferences` — precision-first by design, independent copies live in rubric-score): a mutation that raises high-precision mismatches reverts. No pronoun-writing pass may run after the A_64 ship-check (the no-writes-after-final-check law, applied to this layer).
- **P3 — Wire verify's promise.** The high-precision detectors become the first-ever **producers of `pronoun_mismatch` defects**, feeding the existing validator-gated LLM regen (scoped, phrase-level acceptance — the ANALYSIS_20-safe shape). This is the honest repair channel for TRUE drift: detect precisely, regen surgically, accept only if the high-precision count falls and nothing else regresses.
- **P4 — Fix the binding fallacies** (they serve the guard metric and any strict-mode repair): a name in object/possessive position never captures a subject pronoun; subject pronouns bind to the running sentence SUBJECT chain; the "Dr." splitter fixed (the honorific class, again); reflexives/`hers` added to the checked forms; the census's cataphoric signature becomes the canonical fixture.
- **P5 — Detector precision retrofit + measures.** The ±200-char proximity heuristic (`checkPronounDrift`) — the false-positive seed — is **demoted to a warn-band measure**; it may never again feed a repair target list (detectors-are-measures law). Root-cause and fix the pronoun-telemetry gap so every flip/revert reaches `run_warnings`; add `pronoun_flips_applied`, `pronoun_reverts`, and the high-precision mismatch count to the per-probe TSV; the 27 census instances + the S3 template-carrier sentence + clean-draft replay (assert ZERO flips) become the fixture corpus.
- **P6 — Probe #3 + one external re-read.** The probe validates wiring (zero flips, zero census drift on the page); your ~20-minute re-read validates the *felt* experience — the only instrument this class has ever been visible to.

**Explicitly rejected, with reasons:**
- *A male-investigator prompt lock as the fix* — premise refuted (§1); drift is bidirectional and cast-dominance-shaped. (A one-line POV declaration per chapter is harmless insurance, but it is not the fix and gets no priority; note the existing `narrativeVoiceLine` misfires on "investigator" vs "detective" and falls back to `'SHE'` — fix that string if touched at all.)
- *Full-chapter LLM pronoun rewrites* — ANALYSIS_20, permanently.
- *More suppression guards on the existing detectors* — the guards ARE the recall collapse; the precision path is the high-precision family + demotion of the heuristic, not more window logic.
- *A discourse-state coreference engine* — over-engineering for a defect that is 100% self-inflicted at the shipped layer; revisit only if post-P1 probes show genuine LLM drift the high-precision family cannot see (measure first).

## 6. Do-NOT-do

- Do not enable any deterministic pronoun fixer "just for this run" — the config comment that said it corrupts prose was RIGHT; honor it structurally (P1).
- Do not let any detector with a proximity/window association feed a repair. Measures may be loose; levers may not.
- Do not fixture the fix — fixture the FAILURE: the clean-draft replay asserting zero flips is the primary fixture; the 27 shipped instances are its witnesses.
- Do not conclude pronoun health from internal marks (they never saw this class); the census script + the external read are the instruments.
- Do not touch the judge, the licensed-beat contracts, or any other lever in the same probe (single-variable discipline).
