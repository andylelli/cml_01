# ANALYSIS_65b — The failure ledger: every way a run has died, grouped and counted

**Written:** 2026-07-22 · **Companion to:** A_65 (the craft program) — this is the RELIABILITY program: as well as aiming for 80, we aim for zero lost runs and falling correction churn. **Sources (derive, never hand-extend):** the TARGET_80_LEDGER reliability panel (the per-class fix records), the six batch-chain TSVs (`scratchpad/{m1,m2,p5cr,p5dv,p5voice,m3}/summary.tsv`), the 45 on-disk report artifacts, and the 5 planted-era prompt archives (churn counts).

**The one-sentence status:** the campaign met ~23 distinct failure classes and ended with zero — the abort rate fell from ~1-per-run (M1 attempts) to ~1-per-6 (7.x batches) to **0 in the last 9 runs** — but the classes did not disappear, they *submerged*: roughly **half of every run's LLM calls are now corrections** (retries/regens/repairs), so the reliability frontier has moved from "runs die" to "runs limp", and the reduction program below targets the churn with the same doctrine that killed the aborts.

---

## 1. The headline counts

| Measure | Value | Source |
|---|---|---|
| Distinct failure classes met, campaign-wide | **~23** (16 ledger reliability rows + classes #7, #9–#14) | ledger panel + A_63 §0 |
| Aborts during the M1 floor campaign | **11 aborts / 10 attempts / 9 distinct classes** | ledger M1 row |
| Losses across the 7.x batch chains (on-disk TSVs, 47 chain rows) | **7**: 4 × EXIT1 (chain death), 2 × gate `failed`, 1 × `failure` | batch TSVs |
| Infra losses (not content classes) | hang class (5 hangs absorbed post-RC-6) · 1 DNS-killed scorer · 2 host-sleep/power losses | ledger + A_63 §4.3 |
| Final 9 runs (7.3 second half + probe + M3) | **0 aborts, 0 losses** | TSVs |
| On-disk report outcomes | 37 shipped (34 warning / 3 passed) · 4 gate-failed · 4 interrupted | reports scan |
| **Correction churn, planted-era runs (the submerged failures)** | **~50–59 LLM calls/run, of which ~45–65% are retries/regens/repairs** (probe: 44 calls, 33 corrective-family; M3 identity: 59 calls, 12 retries + 31 regens + 16 repairs) | prompt archives |
| Gate quality | **34 of 37 shipped runs are `warning`, not `passed`** — the failure-adjacent band is almost universal | reports scan |

---

## 2. The taxonomy — every class, grouped by root-cause type

### Type A — Detector-precision false positives (a correct story, convicted) — 5 classes
The validator fires on innocent content; per-chapter amplification crosses a count threshold and kills a good run. *The last three M1 classes shared this signature; A_62 RC-4 predicted it.*

| Class | The conviction | Status |
|---|---|---|
| Season/mechanism FP | seasonal/mechanism terms misread as contradictions | fixed (pre-M1) |
| #7 polysemy ("tablet") | "tablet"-as-pill convicted as computing anachronism ×8 chapters → majors>5 with zero criticals | fixed same-day |
| #9 time comparator | absolute-minutes diff across asymmetric meridiem — 50 min read as 670 | fixed same-day |
| #10 role substring | `role.includes("victim")` at ~30 sites — "Friend of the victim" PROMPTED as deceased | fixed (`isVictimArchetype`, all sites) |
| Optional-NSD visibility hard-stop | optional-criticality clue without anchors hard-stopped the gate | fixed |

### Type B — Pipeline self-interference (two correct subsystems destroy each other's work) — 6 classes
The deepest family: repairs, hygiene, injectors, and gates running in orders that undo one another. *A_64's whole Part I is this family's cap-side twin.*

| Class | The interference | Status |
|---|---|---|
| #5 gate/repair split-brain | ledger matcher ≠ gate matcher — prose saturated with the clue, `corrective_attempts: 0`, hard stop | fixed (repair consumes the gate's matcher — the class-#5 doctrine) |
| #6 injector fabricates a death | template glued detective's name to death key-terms; lifecycle heuristic believed it → `victim_reappears_alive` | fixed (template restructured) |
| #8 post-processing corrupts validated output | deterministic post-LLM passes mutate clean prose with no re-validation | fixed; F2 ship-check now closes the layer |
| #12 hygiene eats the accepted plant | NSD-anchor repair's plant destroyed by the downstream hygiene chain | fixed (two plant→hygiene→re-collect rounds) |
| Dual-value lever split-brain (7.2) | lever's input ≠ detector's pair; cap fired while the enabled lever idled | fixed (A_64 ship-scope rewire) |
| B5 injector after the scaffold pass (A_64 Mechanism B) | culprit-evidence template pasted post-repair, unvalidated, 17s before scoring | fixed (F1 shared signal + F2) |

### Type C — Upstream structural defects passed downstream (bad CML, honest crash later) — 5 classes
Agent 2/3 emit a structurally illegal case; the failure surfaces chapters later as a prose "error".

| Class | The defect | Status |
|---|---|---|
| Dual-detective archetype | two detectives → `detective_name_inconsistency` critical; **the campaign's only repeat class** (dead fix: `role` vs `role_archetype`) | fixed (second fix) |
| #11 dual-victim archetype | Agent 3 assigned Victim to two cast members (class #3's victim-side sibling) | fixed (`repairCaseSoundness` arm) |
| `cleared_culprit_conflict` | culprit cleared by their own clearance scene | fixed |
| Agent 6.5 victim cast-coverage | voice sketches/portraits demanded of the deceased | fixed |
| Agent-7 `scene.beat` enum | LLM free-texts beat labels → schema retry death | fixed (deterministic coercion + synonym map) |

### Type D — Parse/truncation at LLM boundaries (malformed data enters the pipeline as fact) — 2 classes

| Class | The defect | Status |
|---|---|---|
| jsonrepair phantom clue | truncated Agent-5 JSON "repaired" into a fabricated clue → NSD ledger → gate hard-stop 15 min later | fixed (truncation retry, parse filter, max_tokens, gate-status honesty) |
| Agent-5 coverage abort | coverage contract unmet on parse edge | fixed |

### Type E — Bounded-retry exhaustion (the gate is right, the retry budget isn't) — 4 classes

| Class | The defect | Status |
|---|---|---|
| Template-bleed openers | opener/entropy/fingerprint exhaustion → abort (needed `preferCompletionOnFailure=false`, which no caller sets) | fixed (accept-after-exhaustion + completion-first fallback) |
| Reveal never converges | reveal contract unmet across all retries | fixed |
| #13 filter-starved regen | Azure content filter starves the regen → deterministic floor path | fixed (floor) |
| #14 pacing-gate single retry | catastrophic outline draw (2/10 clue scenes), ONE retry, gap beyond the bounded fill | fixed (second targeted retry) |

### Type F — Infrastructure and environment (not the pipeline's content at all) — 4 classes

| Class | The defect | Status |
|---|---|---|
| #4 transport bypass | ~30s DNS outage burned 3 content retries in 28s → certain abort | fixed (transport retry inside `chat()`, all 23 sites) |
| Unbounded-request hang (a *loss*, not abort) | Azure socket ESTABLISHED, CPU 0, forever | fixed (RC-6 deadline; absorbed 5 hangs) |
| DNS-killed scorer | run shipped but unscored (a datapoint loss) | mitigated (shipped-AND-scored chain rule) |
| Host sleep/power | overnight standby / flat battery mid-batch | procedural (see §4.4 — standby is now RESTORED to 2700s) |

### Type G — Prose-rule hard stops that had no repair arm — 2 classes

| Class | The defect | Status |
|---|---|---|
| `illegal_named_walk_on` | out-of-cast named extra aborts the run | fixed (walk-on anonymizer, flag-gated) |
| `missing_case_transition_bridge` (abort form) | missing-person→murder reclassification absent | fixed (bridge regen + injector floor) |

**Reading the taxonomy:** every class is closed, and the *types* tell the story the individual fixes don't — **B (self-interference) and A (detector precision) are the native failure modes of a pipeline that corrects itself this much**; C/D are input-integrity, E is retry economics, F is the world, G is gates-before-repairs. New failure classes, when they come, will almost certainly land in A or B — suspect the detector or the ordering before the story (A_63 §4.2, still the standing doctrine).

---

## 3. What ended the aborts (keep all of it — this machinery is why the last 9 runs were clean)

1. **Halt-on-abort + same-day-fix + fixture-pin + validate-on-the-aborting-theme** — no class was ever allowed a second free kill (one repeat happened anyway — via a dead fix whose tests fixtured the fix's own wrong assumption; hence:)
2. **Fixture the FAILURE before the fix** — the fixture must reproduce the kill, not describe the repair.
3. **RC-6 deadlines** (hangs → retries), **transport retry inside `chat()`** (all sites inherit), **resumable chains** (done-files), **repairable-abort softening**, **shipped-AND-scored** as the datapoint definition.
4. **A_64's F1–F5**: shared signals (kills split-brains), the ship-check as the last write, exhaustion floors for our own templates, and — decisively for diagnosis — **the full warnings array in every artifact** (the forensic blindness that hid the scaffold residual for a month is closed).
5. **The dist-grep rule** (a silent stale build cost the probe its C3 arm — now a standing check before any run).

---

## 4. The reduction program — the next reliability frontier is CHURN, not death

### 4.1 The submerged failure: ~half of all LLM calls are corrections
Planted-era runs: 44–59 calls each; retries 6–20, regens 9–31, repairs 6–18 per run. Every closed abort class survives here as its warning-level shadow (the same defects, one threshold below conviction). Churn = cost (~2× true £/run), latency (~2× wall), and quality risk (every regen is a chance to introduce the next defect — the Type-B lesson). **Actions:**
- Add churn to the P5 standing measures: retries/regens/repairs per run, by cause label, appended per probe (the TSV row). Target trend: down.
- Rank correction causes from the prompt archives (the labels are the taxonomy: `missing_clue`, `scaffold_not_prose`, `AtmosphereRepair`, chapter retries) and take the top cause per era as a GENERATION-side fix — the A_65 Phase-1 inversion should itself cut regen demand (fewer forced-inference violations → fewer scaffold/leakage/mechanism corrections; measure it on probe #1).

### 4.2 The warning band: 34 of 37 shipped runs are `warning`, not `passed`
Nobody has ever inventoried what the warnings ARE now that F5 puts them in every artifact. **Action (free):** frequency-rank the `run_warnings` corpus across the 9 clean runs; the top three warning families become the next fix candidates — *before* they are ever promoted to gates. A gate=passed majority is the reliability target of the corpus era.

### 4.3 Detector-precision review discipline (Type A prevention)
Any NEW detector/gate ships with: a precision fixture set drawn from the corpus (innocent look-alikes), per-chapter amplification capped (one defect ≠ N chapters × majors), and advisory-first telemetry through F5 before it may gate. This is now also A_65's detectors-are-measures rule — same law, reliability face.

### 4.4 Environment (Type F residue) — one procedural gap
`standby-timeout-ac` is restored to 2700s (the 7.9 debt), which is correct for daily use but re-opens the mid-run-sleep loss for any future long chain. **Rule:** any harness expected to run >30 min unattended disables sleep for its own lifetime and restores it on exit (two `powercfg` lines in the chain script). Singular probes (~15 min active) are safe as-is.

### 4.5 Input integrity at the source (Types C/D prevention)
The `repairCaseSoundness` pattern (structural CML legality checked and repaired at Agent-3 exit, not discovered by prose validators chapters later) should own every Type-C class: one soundness pass, one place, fixture per class. Type D likewise: every LLM JSON boundary gets the truncation-retry + parse-boundary-filter treatment the Agent-5 fix proved.

---

## 5. Standing reliability metrics (wire into `derive-a65-measures.mjs`, per probe)

| Metric | Now (planted era) | Target direction |
|---|---|---|
| Aborts + losses per 10 runs | **0** | stay 0 |
| Corrective calls / total calls | ~45–65% | **down** — the headline churn metric |
| Chapter retries per run | 6–20 | down |
| Regen passes per run | 9–31 | down |
| `run_warnings` count per run (by family) | 37 on the probe | down; families ranked |
| Gate `passed` share of shipped | 3/37 | **up** — the era target: passed becomes the norm |

**The claim to beat, stated plainly:** the campaign proved the abort pool was finite. The corpus era's reliability thesis is that the CHURN pool is finite too — and that the same doctrine (fixture-first, shared signals, generation-side fixes over enforcement) that emptied the first pool will empty the second, with the £/run and minutes/run falling as it does.
