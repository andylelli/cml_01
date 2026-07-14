# ANALYSIS_61 — Consolidated outstanding-actions register (whack-a-mole-aware)

**Purpose.** One place for *everything still to do*, consolidated from **A_56, A_57, A_58, A_59, A_60** and the two 2026-07-02 validation runs. Organised **by root cause, not by instance** — because the standing lesson (A_59 §B, confirmed 3×) is that fixing symptoms one at a time *is* the whack-a-mole. Each action is tagged **Structural** (dissolves a whole class) or **Tactical** (unblock-only; must be superseded by its Structural parent).

**Source coverage (audited).** A_58/A_59/A_60 + runs = RC-1…RC-4 (Agent-9 prose + validators). A cross-check of **A_56** (agents 1–8 source of truth) and **A_57** (D1–D7) added what the first cut missed: **RC2.5** (case-soundness gate promotion, A_57 §9.1 / A_59 P2), **RC5.3** (D6 voice capsules), and the whole **RC-6** measurement/promotion backlog (novelty shadow→gating — now unblocked by this session's junction fix — cross-run novelty, Agent-7 scheduler authority, `pronoun_policy`). A_57's D1–D4/D7 generation contracts and detectors are **landed** (A_57 status table) and are not re-listed here; only their still-open A/B-gated tails (D5 enable, D6) carry forward.

**Supersedes** the scattered fix-lists in A_58/A_59/A_60 for *tracking* (those remain as history + detail). Cross-references the LLD ([`agent9-first-principles-LLD.md`](../../plan/agent9-first-principles-LLD.md)) and A_56 (agents 1–8 source of truth).

---

## 0. Landed already (do not re-open)

| Item | Where | Proof |
|---|---|---|
| Agent-7 beat-enum abort → deterministic coercion | `agent7-run.ts` `coerceNarrativeSceneBeats` | run_0d45c651 + both 2026-07-02 runs reached prose, no beat abort |
| **Season mechanical-spring FP** (A_60 V.1) | `temporal-consistency.ts` `SPRING_MECHANICAL_RE` | 17/17 temporal tests; run bf6khyl2r: a clock/mainspring mystery produced **0 season majors** (no regression) |
| **Novelty skeleton-judge ENOENT** (A_58 #5 / A_60 N.1) | `node_modules/@cml/novelty` junction → `packages/novelty` | both 2026-07-02 runs log a `NoveltySkeletonJudge` verdict; **0** `skipped: ENOENT` |
| Season triage de-mask (A_60 P.7) | `agent9-run.ts` final-validation branch | silent when no season class (correct) |
| **2a · RC3.1 Agent-5 coverage repair-not-abort** | `agent5-run.ts` `synthesizeInferenceStepCoverageClues` (before the hard gate) | worker 269 green; round-trip test proves an uncovered step → covered (no abort); empty-observation step still gated |
| **2b · RC2.1 locked-fact once-semantics** | `prose-consistency-validator.ts` `checkLockedFacts` | story-validation green; the value is required ONCE across a fact's referencing chapters (was per-scene → one "thirty feet" fact made 6 majors); contradiction stays per-scene critical |
| **RC4.5 · `deceased_character_confesses` FP** | `character-lifecycle-validator.ts` `isConfessionKillObject` | story-validation 320 green; **the actual 94→60 cap** — the culprit's confession *"I killed Lady Beatrice Ellsworth"* tagged the **victim** (kill-object) as confessing; now excluded when the name follows a first-person harm verb. Victim-as-subject confession still fires. |
| **RC4.3 · setting-fidelity false negative** | `agent9-prose-scorer.ts` `locationReferencedInProse` | story-validation green; head-noun matching (decorated profile "The Thermally Sealed Study" ↔ prose "the study") — was exact-full-name `includes`, scored 1/4 (a separate FN on the consistency component) |

**Validated live (run_33ecb4ad, 2026-07-02 20:59):** with 2a+2b the pipeline ran end-to-end — Agent 5 did **not** abort (2a; my synth didn't even need to fire), all 10 chapters generated, `locked_fact_missing_value` 6→2 (2b), **zero** season FPs, novelty verdict logged. **The prose is genuinely good — uncapped total 94, quality 94%, readability 98%, clues 19/19, characters 7/7, fair-play 85.** It nonetheless scored **60/D** and did not ship. Two false negatives, both now fixed:
- **The 94→60 cap (RC4.5, the real ship-blocker):** a reader-trust `deceased_character_confesses` signal — the culprit Reginald confesses *"I killed Lady Beatrice Ellsworth"* and the detector attributed the confession to the **victim** because her name is the kill-object. Classic name-in-sentence FP (cf. A_58 VICTIM ALIVE).
- **A separate consistency FN (RC4.3):** `Setting fidelity 25 (1/4 locations)` from exact-full-name matching (prose used study/library/gardens/quarters by natural name).

**The reframe this forces (§4a):** four consecutive runs each died on a *different* naive-exact-match **false negative** on otherwise-shippable prose (season FP → locked-fact multiplication → setting-fidelity → victim-confession). **The ship-blocker has been validator/scorer precision, not prose craft** (the prose scores 94 uncapped). That reprioritises the plan — see §5.

**A_60 Phase 1** + **A_61 Phase 2a/2b + RC4.3** are complete this session. The rest of Phase 2 (**2c–2f**, the Bible-authoritative flip) is the larger flag-gated migration. Everything below is what remains.

---

## 1. The whack-a-mole guardrail (read before adding any fix)

> **Deterministic code may VERIFY and GUARANTEE; it must never WRITE. The LLM WRITES and REPAIRS; deterministic code CHECKS and BLOCKS.** Validators/repairers must **dereference the frozen Bible fact — never re-derive it from prose.** (A_59 §B + A_60 reframe.)

**Do NOT do (these are the moles — confirmed dead ends):**
- ❌ Add another **per-mechanism season regex** (RC-4 is capped at the Phase-1 throwaway; the real home is RC-2).
- ❌ Add another **per-template leakage detector or reword** an injector's output — "no reword turns injected scaffold into fiction; it only moves the leak" (A_59, 3× confirmed).
- ❌ Add a **new deterministic prose injector** — every one ships as template.

**Always do:** a false-positive fix lands **with both-directions tests** (the FP passes; a genuine defect still fires). Structural fixes flip behind a flag and are validated on a powered **N≥4** matched set (`canary-k2-single-run-confounded`), never a single run.

---

## 2. Register by root cause

### RC-1 — Deterministic injectors WRITE prose (must only verify) → **inject→regen**
*The A_59 strategic inversion. LLD P3 (clue) + P4 (rest). Libraries built + wired **default-off**; the remaining work is the N≥4 flip, not new code.*

| ID | Instance (symptom) | Owner | Tag | Source | Status / where prior fix fell short |
|---|---|---|---|---|---|
| RC1.1 | A1 clue/inference surfacing ships raw key-terms / **verbatim clue transcription** (32/21 words) | `deterministic-repair.ts` → `AGENT9_REGEN_CLUE` | Structural | A_59 #1/#4, A_60 P.1 | regen pass + N≥4 harness **staged** (`scripts/exp-regen-clue-*`); needs the live paired run to flip on |
| RC1.2 | Clearance injected as a templated paragraph (Beatrice Quill / Hugo Vane, run bf6khyl2r; Thomas Grey, run_0d45c651) | `agent9-run.ts` A3/B7 → `AGENT9_REGEN_<pass>` | Structural | A_59 #3, A_60 P.3, A_58 | `runInsertionRegenPass` built; per-injector detector + N≥4 pending |
| RC1.3 | Resolution injected, not generated (ch10 non-convergent) | B6 `injectResolutionIfAbsent` → regen | Structural | A_58 #1, A_60 P.4 | A_58 hardened the backstop to dramatize; still generation-fragile; convert to regen under P4 |
| RC1.4 | Culprit-evidence / stage-fallback / victim-rescue / role-alias injectors | B5/A4/B8/B10 → regen | Structural | A_59 §3.3, LLD P4 | convert one-at-a-time, N≥4 each |

**Exit:** no injector string ships as prose (LLD P7 deletes the layer once every injector is validated-off).

### RC-2 — Facts RE-DERIVED from prose instead of dereferenced from the frozen Bible → **Bible-authoritative**
*LLD P1/P1.3. Bible built (P1.1/1.2), wired **default-off** (`AGENT9_BIBLE_AUTHORITATIVE`). This is **A_60 Phase 2** and it fixes **today's release-blocker**.*

| ID | Instance (symptom) | Owner | Tag | Source | Status / where prior fix fell short |
|---|---|---|---|---|---|
| **RC2.1** | **`locked_fact_missing_value` ×6** — "thirty feet" clock-to-scene distance described without its canonical value (run bf6khyl2r; the current abort) | locked-fact obligation + validator → `bible.clock`/facts | Structural | A_58 #9, A_60 P.6 | injector (`enforceLockedFactValuePresence`) is a backstop that under-fires; the obligation must **land in-scene** and the validator must check the Bible value. **Highest-value open item — it is what aborts the run today.** |
| RC2.2 | Pronoun drift (21 sweep repairs / run) | pronoun sweep + validator → `bible.voices`/gender | Structural | A_57 D5, A_59 #2, A_60 P.5 | sweep is load-bearing; Bible-locked pronouns remove drift at source |
| RC2.3 | Season checked by re-deriving from prose + a hand regex | `temporal-consistency.ts` → case mechanism vocabulary | Structural | A_60 V.1 (Phase 2) | **the principled successor to the Phase-1 regex** — validator dereferences the case's own declared mechanism terms; no regex per mechanism ever again |
| RC2.4 | Mechanism explained before the DT scene | embargo → `bible.discriminatingTest` triple | Structural | A_60 P.2, A_58 P2 | gate catches it at a retry cost; Bible embargo makes the boundary explicit |
| RC2.5 | **Case soundness** — culprit≠victim, mechanism↔environment (D3), resolvable gender, discriminator actually discriminates — currently **warn-level telemetry only** | `runContradictionGate` + `verifyDiscriminator` → `AGENT9_BIBLE_GATES_BLOCKING` | Structural | A_57 §9.1, A_59 P2, LLD P2 | gates BUILT + wired warn→throw (default-off); **promotion needs an upstream repair hook** (Agent 3b/5/7) so an unsound case is repaired at source, not turned into an abort. Repair-at-source is the same shape as RC3.1. |

**Exit:** every checker/repairer reads the Bible; the sweep + injectors become rare backstops; an unsound case is repaired before prose. **N≥4 before default-on.**

### RC-3 — Upstream case-construction gaps (unsatisfiable / implausible / under-bridged) → **Agents 3 / 3b / 5 / 7**
*These originate before Agent 9; patching them in prose cannot work. Mostly ☐ not-started. Two are **run-killers**.*

| ID | Instance (symptom) | Owner | Tag | Source | Status / where prior fix fell short |
|---|---|---|---|---|---|
| **RC3.1** | **Agent 5 coverage hard gate abort** — "Inference step N (…) has NO covering clue" → hard-aborts after retries (run bfmz7izf6; a **run-killer**) | `agent5-run.ts` coverage gate / Agent 3 CML inference_path | Structural | run bfmz7izf6; A_58 #3 (G4 family) | an inference step exists with no clue that can cover it. Fix at construction: every `inference_path` step must have a derivable covering clue (Agent 3/5), **or** the gate repairs (synthesises a covering clue) instead of aborting. Stochastic but fatal when it fires. |
| RC3.2 | Implausible hard-logic physics (brass thermal-expansion → decisive timing shift) | Agent 3b + `AGENT3B_PLAUSIBILITY_JUDGE` | Structural | A_59 #5, A_60 M.1 | **P0.5 planned, not built.** Recurs across A_59/A_60. A nameable, plausible mechanism also reduces RC1.1 (nothing awkward to transcribe) and RC2.3 (fewer "spring"-type collisions). |
| RC3.3 | `missing_case_transition_bridge` — Scene 8 shifts disappearance→murder with no bridge (run bf6khyl2r) | `narrative-continuity-validator.ts`; root = Agent 7 outline | Structural | run bf6khyl2r; A_52/A_53 continuity family | recurring narrative-continuity flag; the outline should schedule a transition beat (or the chapter obligation must bridge). Triage owner: Agent 7 vs Agent 9 obligation — **confirm which, then fix upstream.** |
| RC3.4 | G4 DT-scene clue scheduling (DT scene cites no planted evidence) | Agent 7 scheduler | Structural | A_58 #3 | A_58 reframed + guarded the FP; the underlying scheduling completeness is the same family as RC3.1 — treat together |
| RC3.5 | Poison / key tell under-planted at discovery (Ch1) | Agent 5/7 clue scheduling | Structural | A_59 #6 (P0.6) | ☐ not started |

**Exit:** a validated case is *satisfiable, plausible, and bridged by construction* — no downstream abort, nothing awkward for prose to render.

### RC-4 — Verifier precision (false positives) → tactical, **unblock-only**
*Legitimate maintenance (A_58 Phase 2) — but the **mole-prone** class. Each fix is unblock-only and its structural home is RC-2 (dereference the Bible/case vocabulary), not an ever-growing regex.*

**Reprioritised (2026-07-02):** this class is bigger than "occasional maintenance." Three consecutive runs each shipped good prose (94% quality) but were **failed by a different naive-exact-match false negative** — season (RC4.1), locked-fact multiplication (RC2.1), setting-fidelity (RC4.3). The common root is a verifier/scorer matching prose against a **decorated/exact** form of a case fact instead of the fact's **robust/head form**. Clearing this class is now the **highest-leverage near-term work** (§4a) — and it is *not* whack-a-mole when done as a class (audit the matchers; match against the case's declared names robustly — the RC-2 direction), rather than one string at a time.

| ID | Instance | Tag | Source | Status |
|---|---|---|---|---|
| RC4.1 | Season mechanical-spring FP | Tactical (**done**) | A_60 V.1 | landed Phase 1; **capped** — go to RC2.3 for the principled version |
| **RC4.5** | **`deceased_character_confesses` — culprit's "I killed <victim>" tags the VICTIM as confessing → caps prose 94→60** | Structural-precision (**done**) | run_33ecb4ad | landed: `isConfessionKillObject` excludes the kill-object; victim-as-subject confession preserved. **The actual ship-blocker.** |
| **RC4.3** | Setting-fidelity: exact full-name `includes` under-counts locations (a consistency FN) | Structural-precision (**done**) | run_33ecb4ad | landed: `locationReferencedInProse` head-noun matcher + 6 both-directions tests |
| RC4.4 | **Audit the remaining scorers/validators for the same naive-match class** (fair-play name/time matching, other reader-trust `identity/victim/deceased` signals, any `prose.includes(exactName)`) | Structural-precision | this session | **open — the §4a near-term sweep**; each fix carries both-directions tests |
| RC4.2 | Method: FP fixes land with both-directions tests; confirm before loosening | — | A_58 | standing rule |

### RC-5 — Craft ceiling (present-but-flat prose) → **critique→rewrite + model tiering**
*The 74→80+ lever once presence/coherence are clean. LLD P5/P6, wired **default-off**.*

| ID | Instance | Owner | Tag | Source | Status |
|---|---|---|---|---|---|
| RC5.1 | Functional dialogue, repetition, thin atmosphere | `critique-rewrite.ts` @ temp 0.7–0.9 (`AGENT9_CRITIQUE_REWRITE`) | Structural | A_57 D6/D7, A_59 P2 | built + wired default-off; N≥4 |
| RC5.2 | Cost-tiered model router (strong on generate/rewrite, cheap on regen) | `model-tiering.ts` (`AGENT9_MODEL_*`) | Structural | A_59 §E | built + wired default-off |
| RC5.3 | **D6 voice capsules / idiolect** — dialogue distinctiveness | `agent2b-voice-capsule.ts` + enforce gate | Structural | A_57 D6, A_56 (2b) | capsules built; enforce gate A/B-gated, not flipped |

### RC-6 — Built machinery awaiting a powered A/B (measurement, not code) — the A_56 Tier-2 + A_57 A/B-gated backlog
*Cross-checked against A_56 (agents 1–8 source of truth) and A_57 (D-classes). These are **code-complete**; the only remaining work is deciding the default on a powered **N≥4×4 matched** campaign (one flag per replay). Listing them so they are not lost — they were absent from the first cut of this register.*

| ID | Item | Flag | Tag | Source | Status / note |
|---|---|---|---|---|---|
| RC6.1 | **Novelty judge: promote shadow → gating** | `NOVELTY_SKELETON_JUDGE` (shadow→gate) | Measurement | A_56 8-A; memory `novelty-judge-needs-skeleton-extractor` | **newly UNBLOCKED** — the A_61 junction fix means the shadow judge now runs + logs verdicts every run (both 2026-07-02 runs did). Gather the shadow telemetry, confirm it tracks the LLM auditor, then promote. |
| RC6.2 | Cross-run novelty threshold flip | `NOVELTY_CROSS_RUN` → 0.7 | Measurement | A_56 8-C | A_54 A/B inconclusive; needs ≥4×4 matched |
| RC6.3 | **Agent 7 scheduler authority** (grid-owns `sceneNumber/act/cluesRevealed/beat`; the doc-13 redesign) | Agent-7 scheduler levers | Measurement/Structural | A_56 7-E; `12_system_redesign/13_*` | infra landed, levers OFF; the "scheduler-owned beat" target that also makes RC4.1/RC2.3 (beat/season) deterministic-by-construction |
| RC6.4 | `pronoun_policy` enable A/B | `pronoun_policy` | Measurement | A_57 D5, A_59 #2 | the *re-validate-after-mutation* half shipped; the ENABLE half is A/B-gated. Re-measure after `2e32d698` (memory) before flipping. Couples with RC2.2. |
| RC6.5 | Other upstream flag-flips (2b/2c concurrency, 3-D, 6-A) | various | Measurement | A_56 Theme 1 / Tier-2 | low priority; code done, default-decision only |

**Note:** RC6.1 and RC6.4 are the two that intersect Agent-9 work directly — RC6.1's telemetry is now flowing (fix this session), and RC6.4 couples with the RC2.2 Bible-pronoun flip. RC6.3 (Agent-7 scheduler) is the structural home that would make `beat` (and hence the RC4.1 season/beat class) deterministic-by-construction — the same "scheduler owns it, LLM only dramatizes" principle as the Bible.

### Cross-cutting infra

| ID | Item | Source | Status |
|---|---|---|---|
| X.1 | **Non-symlinked stale `node_modules/@cml/*` copies** — novelty was a real dir, not a symlink; a src+dist fix never reached the worker for 2 analyses | A_60 N.1 / memory `worker-consumes-cml-packages-via-dist` | novelty fixed (junction); **audit the rest** with `isSymbolicLink()`; a stray `npm install` can regress it |
| X.2 | Best-effort masking hides which majors are one class | A_60 P.7 | season de-mask landed; generalise the triage breakdown if other FP-prone classes recur |

---

## 3. Execution sequence (maps to A_60 phases + LLD — not a new scheme)

- **Phase 1 — DONE** (RC4.1 season + X.1 novelty + X.2 triage).
- **Phase 2 — NEXT = RC-2** (`AGENT9_BIBLE_AUTHORITATIVE`): fixes **RC2.1 (today's abort)**, RC2.2, RC2.3 (season principled), RC2.4. This is the highest-value block — it dissolves the class currently failing the run.
  - **Interleave the run-killer RC3.1** (Agent 5 coverage) here — it hard-kills runs, so it gates whether we even reach prose; fix it alongside the Bible work.
- **Phase 3 — RC-1 + RC-3 + RC-5**: inject→regen conversions (RC1.x, each N≥4), RC3.2 plausibility (P0.5), RC3.3 transition bridge, then RC5.x craft. LLD P7 (delete injectors) lands after every RC-1 item is validated-off.

**Measurement track (parallel):** every flag flip (RC-1, RC-2, RC-5) is validated on a powered **N≥4** matched set via the staged `scripts/exp-regen-clue-*` harness before default-on. Single runs are confounded.

---

## 4. Priority (what to do next, ranked)

### 4a. The reframe — false-negative gates are the ship-blocker, not craft
The 2026-07-02 runs changed the picture. The pipeline now **completes and produces 94%-quality, 98%-readability prose**. What has actually blocked shipping is a *cascade of naive-match false negatives* (RC4.1 season → RC2.1 locked-fact → RC4.3 setting-fidelity), each failing a good draft. **Before investing in Phase-3/4 craft, clear this class and re-measure the true prose score** — the craft may already be near-threshold once the false gates are gone.

**Ranked:**
1. **RC4.4 — verifier/scorer precision sweep** *(new, near-term)*: audit every `prose.includes(exactName)`-style matcher (fair-play name/time, character/mechanism references, location/setting) for the RC4.3 class; fix with robust matching + both-directions tests. *Highest leverage — it is what fails good prose.* RC4.1/RC2.1/RC4.3 are the first three, done.
2. **Re-measure** on a clean run: with the false gates cleared, read the real prose/consistency score and the *genuine* remaining blockers.
3. **RC3.1 Agent-5 coverage** (done) / **RC2.1** (done) — the run-completion items; already landed.
4. **RC-2 Bible flip (2c–2f)** — pronoun/season-principled/embargo/soundness-gate; still the right structural home, but **no longer urgent** (nothing currently fails on them) → schedule behind the precision sweep, each N≥4.
5. **RC3.2 sundial plausibility (P0.5)** — cheap upstream leverage.
6. **RC-1 inject→regen** + **RC-5 craft** — only once the re-measure shows craft (not false gates) is the real ceiling.

*Nothing here is a new tangent: every item traces to A_56–A_60 or a 2026-07-02 run, tagged Structural or the capped-precision class (RC-4, done-so-far).*

---

## 5. Phased implementation plan

Four phases; **Phase 1 is done**. Each remaining phase (a) flips **one structural lever** (never a batch of instance patches — the whack-a-mole rule), (b) is **test-runnable** with `npm run canary:core`, and (c) has explicit run-log acceptance signals. Every flag flip is validated on a powered **N≥4** matched set (`scripts/exp-regen-clue-*`, `canary-k2-single-run-confounded`) before default-on — a single passing run confirms *works*, not *validated*. Dependencies: **P3 (regen) depends on P2 (Bible)** — the regen dereferences the Bible; do not reorder.

### Phase 1 — Unblock & telemetry *(DONE this session)*
RC4.1 season FP · X.1 novelty junction · X.2 season triage. Proof: §0.

### Phase 2 — Make the run complete cleanly *(2a/2b ✅ DONE + validated live; 2c–2f deferred — see §4a)*
**Lever:** the Agent-5 case gate stops aborting (RC3.1) + the locked-fact validator stops over-firing (RC2.1). **Goal (met):** a run that reaches prose and does not abort/needs-revise on those classes — confirmed by run_33ecb4ad (10 chapters, no abort). **2c–2f (the full Bible flip) are deferred** — nothing currently fails on them, and §4a shows the live blocker is scorer precision, not these.

| Step | Item | Where | Change |
|---|---|---|---|
| 2a ✅ | **RC3.1** Agent-5 coverage run-killer | `agent5-run.ts` `synthesizeInferenceStepCoverageClues` | **DONE** — repair-not-abort: synthesise a covering clue for any uncovered inference step before the hard gate; abort only if the step has no observation to plant. Round-trip + empty-step tests. |
| 2b ✅ | **RC2.1** locked-fact once-semantics | `prose-consistency-validator.ts` | **DONE** — value required ONCE across a fact's referencing chapters (was per-scene → 6 majors for one fact); contradiction stays per-scene critical. |
| 2c | **RC2.2** pronoun drift | pronoun-lock block + sweep validator → `bible.voices`/gender | Same flip: generation locks pronouns from the Bible; validator checks Bible gender. |
| 2d | **RC2.3** season, principled | `temporal-consistency.ts` → case mechanism vocabulary | Derive the mechanical-"spring" exclusion from the case's declared mechanism terms (hard-logic devices + DT object); **retire the Phase-1 regex to a fallback**. Closes RC4.1's mole for good. |
| 2e | **RC2.4** early mechanism reveal | embargo → `bible.discriminatingTest` triple | Reveal boundary read from the Bible, not re-derived. |
| 2f | **RC2.5** case soundness → blocking | `runContradictionGate` + `verifyDiscriminator` → `AGENT9_BIBLE_GATES_BLOCKING` | Promote warn→throw **with an upstream repair hook** (Agent 3b/5/7) so an unsound case is repaired at source — the same repair-not-abort shape as 2a. Land the repair hook first, then promote. |

**Test-run acceptance (`canary:core`):** no Agent-5 coverage abort (reaches prose); **`locked_fact_missing_value` majors → 0**; `Deterministic pronoun sweep` count ≪ prior (target ≤ ~5); no season/`august vs spring` regression; contradiction/discriminator gate throws only on genuinely unsound cases (paired with the repair hook); final validation `passed` or `needs_review` — **not aborted on these classes**. **N≥4** before `AGENT9_BIBLE_AUTHORITATIVE` / `AGENT9_BIBLE_GATES_BLOCKING` default-on.
**Risk:** the Bible must be the *only* dereference (LLD §6.1) — any builder left re-deriving re-opens the drift. Land dereference first (cost-neutral), flip authoritative second. Gate promotion (2f) must land *with* the repair hook or it converts unsound cases into aborts.

**Parallel measurement track (RC-6, no code):** RC6.1 **novelty judge shadow→gating is newly unblocked** — the shadow now logs a verdict every run, so start accumulating that telemetry from Phase 2's runs toward the promotion decision. RC6.4 (`pronoun_policy` enable) couples with 2c — decide it on the same pronoun A/B.

### Phase 2.5 — Clear the false-negative gate class, then re-measure *(NEW near-term priority — §4a)*
**Lever:** the RC-4 verifier/scorer precision class. **Goal:** stop failing 94%-quality prose on naive-match false negatives, then read the *true* score.

| Step | Item | Where | Status |
|---|---|---|---|
| 2.5a ✅ | **RC4.3** setting-fidelity exact-match → head-noun matcher | `agent9-prose-scorer.ts` `locationReferencedInProse` | **DONE** — 6 both-directions tests; a decorated profile name matches its natural-prose form |
| 2.5b | **RC4.4** sweep the remaining `prose.includes(exactName)` matchers | fair-play name/time, character/mechanism references, any scorer/validator | **open** — audit + robust-match each, both-directions tests; the near-term work |
| 2.5c | **Re-measure** on a clean `canary:core` run | — | read the real prose/consistency score with the false gates cleared; identify the *genuine* remaining ceiling |

**Acceptance:** run_33ecb4ad-shaped case now scores Setting fidelity ≥ 70 (not 25) and the prose phase is no longer capped to 60/D on a false negative; a re-run reports the honest prose score. **Only after 2.5c** do we know whether Phase 3/4 craft is the real ceiling or whether the drafts already pass.

### Phase 3 — De-template the prose + plausible/bridged cases
**Lever:** the **inject→regen inversion** (RC-1) + upstream case quality (RC-3). **Goal:** no deterministic string ships as prose; the mechanism is plausible; scenes are bridged.

| Step | Item | Where | Change |
|---|---|---|---|
| 3a | **RC1.1** clue/verbatim (start here) | `AGENT9_REGEN_CLUE` (harness staged) | Convert A1 to in-scene regen; run the staged N≥4 A/B; flip on if it wins. |
| 3b | **RC3.2** sundial plausibility | Agent 3b `AGENT3B_PLAUSIBILITY_JUDGE` (P0.5) | Reject implausible-magnitude physics; prefer a nameable mechanism. Cheap leverage — also reduces 3a + 2d. |
| 3c | **RC1.2 / RC1.3 / RC1.4** clearance / resolution / rest | `AGENT9_REGEN_<pass>` (per injector) | Convert one at a time via `runInsertionRegenPass`; **N≥4 each**; each deletes an injector. |
| 3d | **RC3.3 / RC3.4 / RC3.5** transition bridge / G4 / poison | Agent 7 outline + Agent 5 scheduling | Schedule the missing beats at construction (bridge scene, DT-scene evidence, Ch1 poison tell). |

**Test-run acceptance:** 0 injector seed-phrases / verbatim-copy in shipped prose; regen telemetry logs `planted`; Agent-3b mechanism carries a plausibility chain; no `missing_case_transition_bridge` major. **N≥4** per flag flip.
**Risk:** paragraph-scope the regen + re-run the pronoun validator under `mutateThenValidate` (the whole-chapter re-gender scar, LLD §6.4).

### Phase 4 — Craft ceiling & delete the injector layer
**Lever:** **critique→rewrite at creative temperature** (RC-5) + LLD **P7**. **Goal:** the 74→80+ jump, and removal of the now-dead deterministic prose layer.

| Step | Item | Where | Change |
|---|---|---|---|
| 4a | **RC5.1 / RC5.3** craft + voice capsules (D6) | `AGENT9_CRITIQUE_REWRITE` (built) + voice-capsule enforce gate | Rewrite the lowest ~3–4 chapters at temp 0.7–0.9 with rollback; A/B the voice-capsule enforce gate; N≥4. |
| 4b | **RC5.2** model tiering | `AGENT9_MODEL_*` | Strong on generate/rewrite, cheap on regen. |
| 4c | LLD **P7** delete injectors | `agent9-run.ts` / `deterministic-repair.ts` | Remove every RC-1 injector now validated-off; keep only guarded normalizers + the logged emergency floor. |
| 4d | **X.1** node_modules audit | `node_modules/@cml/*` | `isSymbolicLink()` sweep so no other package is a stale real copy (novelty was). |

**Test-run acceptance:** targeted-chapter craft scores ↑ with no presence/fairness/coherence regression, cost ≤ ~2×; **no deterministic string ships as prose**; the emergency floor, if it fires, logs a quality failure. **N≥4** for 4a.

**Upstream measurement backlog (RC-6, run alongside — decision-only, no Agent-9 code):** RC6.1 novelty shadow→gating (promote once telemetry confirms tracking), RC6.2 cross-run novelty threshold, RC6.3 Agent-7 scheduler authority (the structural home that makes `beat`/season deterministic-by-construction), RC6.5 misc upstream flag-flips. Each is a powered **N≥4×4 matched** A/B, one flag per replay.

### Sequencing at a glance
```
P1 ✅ unblock (season FP · novelty · triage)
P2 ▶ complete the run   → RC3.1 (Agent-5 repair) + AGENT9_BIBLE_AUTHORITATIVE (RC2.1/2.2/2.3/2.4)   [current blocker]
P3   de-template        → AGENT9_REGEN_CLUE + AGENT9_REGEN_* (RC1.x) + P0.5 (RC3.2) + outline beats (RC3.3/3.4/3.5)
P4   craft & cleanup    → AGENT9_CRITIQUE_REWRITE + AGENT9_MODEL_* (RC5) + P7 delete + node_modules audit
```
**Start Phase 2 at step 2a (Agent-5 repair) and 2b (locked-fact Bible)** — those are the two things the 2026-07-02 runs actually died on.
