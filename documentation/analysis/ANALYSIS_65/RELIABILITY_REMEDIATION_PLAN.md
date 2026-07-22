# The Reliability Remediation Plan — emptying the churn pool (A_65b's program, made concrete)

**Written:** 2026-07-22 · **Companion to:** [A_65b](./ANALYSIS_65b.md) (the failure ledger) and [A_65](./ANALYSIS_65.md) (the craft program — the two share probes and one root cause). **Regime:** §2.8 — every derivation free, every fix fixture-first, probes shared with A_65, no batches.

**The one-sentence plan:** the ground-truth derivations below show the top churn causes and the top warning families both point UPSTREAM — at the instant-inference contract (already A_65 Phase 1) and at source-layer clue synthesis that fires on every run — so the plan fixes process debt immediately (R5), splits the warning channel (R2a), builds the measures (R6), lets Phase 1's probe show which churn it kills for free, then root-causes what remains in ranked order (R1), hardens detectors and inputs (R3/R4), and holds the era targets: **aborts 0 · corrective share falling · gate=passed the norm.**

---

## 0. PROGRESS TRACKER

*(One row per implementation phase — the detailed steps are §5. Statuses ⬜ pending · 🟡 in progress · ✅ done · ⛔ blocked.)*

| Phase | What (workstream) | Cost | Depends on | Status | Last update |
|---|---|---|---|---|---|
| — | R0 ground-truth derivations (churn ranking, warning families, retry reasons) | £0 | — | ✅ done (embedded in §1) | 2026-07-22 |
| **1** | Process debt (R5): preflight dist-check · sleep-guard · report-outcome honesty | ~1–2h | — | ✅ done — `scripts/preflight-dist-check.mjs` (self-tested: caught the just-edited package live; 15 pkgs in scope) · `scripts/harness-lib.sh` (sleep_guard + preflight) · `run_outcome` now P0.2-derived, phase verdict demoted to `phase_thresholds_met` (the M1v2-2 folklore retired; 1 pinning test updated, 98/98) | 2026-07-23 |
| **2** | Warning-channel split (R2a): info vs warn bands → honest accounting | ~1–2h | — | ✅ done — `run-warnings.ts` classifier (frozen prefix map over our own literals; discovery-tell correctly `warn` — deficiency response, vs the plant stamp `info` — designed behavior) · F5 diagnostic banded · status counts `warn` only · fixtured on the probe's real 37 warnings (5/5) | 2026-07-23 |
| **3** | The measures harness (R6): one derive, baseline row, auto-run per probe | ~1–2h | — | ✅ done — `scratchpad/a65/derive-a65-measures.mjs` (imports the worker-dist classifier — single source); baseline TSV = the 5 planted-era rows (corr% 41–51, warn 19–40, inference density already showing the reveal-chapter spike); `scratchpad/run-probe.sh` is the canonical probe harness (preflight → run → measures) | 2026-07-23 |
| **4** | Atmosphere-repair root-cause (R1.1) — corpus-only, parallel with everything | ~2–3h | — | ✅ done — **VERDICT: Type-B self-interference, not weak drafting.** The 277-call census: top phrase = the A1 injector's own lead ("pressed on to the next concrete detail", 19+16+16 n-grams); next tier = LOCKED-FACT value phrasings the prose must repeat verbatim — whose LLM "fresh alternative" risked `locked_fact_absent` regens (a 3-stage chain). Fix: `detectRecurringPhrases` exempts mandated repetitions (injector-fragment sub-windows + locked-value ≥3-word sub-windows; bounded, ours); both call sites pass locked values; fixtured both directions. Expected: ~7.6/run → the genuine-repetition tail; measured next probe | 2026-07-23 |
| **5** | Post-Phase-1-probe re-rank (R1): measure what the inversion killed; fix top residual | ~2–4h | A_65 Phase-1 probe + Phase 3 | ⬜ | — |
| **6** | Source-layer clue completeness (R2b): kill the every-run synthesis; herring separation at source | ~3–5h | Phase 2 ranking | ⬜ | — |
| **7** | Detector census over the 93-story corpus + precision-fixture retrofit (R3) | ~2–3h | Phase 3 | ⬜ | — |
| **8** | Input-integrity audits (R4): JSON boundaries + `repairCaseSoundness` vs Type C | ~2–3h | — | ⬜ | — |

**Era acceptance (from A_65b §5):** aborts+losses stay **0** · corrective-call share **< 30%** (from ~45–65%) · Agent-9 retries **< 3/run** (from 6.2) · atmosphere repairs **< 2/run** (from 7.6) · gate=`passed` becomes the **majority** of shipped runs · zero detector over-firers on the known-good corpus.

---

## 1. What the derivations say (R0 — done; scripts in `scratchpad/a65/`, rerun anytime)

### 1.1 Churn, ranked by cause (40 pre-era runs vs 5 planted-era runs)

| Cause | pre (per run) | planted (per run) | Reading |
|---|---|---|---|
| **AtmosphereRepair** | 6.0 | **7.6** | **#1 consumer, RISING** — fires on ~70–80% of chapters, every era, every config. Precision-suspect: it treats near-every first draft as deficient |
| **Agent-9 chapter retries** | 4.7 | **6.2** | #2, rising. Sampled triggers: *mechanism explained early* (×3 in one run), template-linter repeats, stage-mode outcomes — largely instant-inference symptoms |
| **scaffold_not_prose regens** | 3.5 | **5.4** | #3, rising. Ship-time is clean (A_64 works) but DEMAND rose — the instant-inference contract keeps generating scaffold-shaped text for the regens to fight |
| **missing_clue regens** | 4.3 | 3.6 | #4, falling — the C1 plants are plausibly already reducing clue-absence |
| Rewrite / others | 1.0 / <1 | 0 / <1 | tail |

**Corrective share: 43% pre → 47% planted (~21→~25 corrective calls/run).** The A_64/C-lever era made ship-time clean without reducing in-run fighting — because the cause of the fighting (the explain-everything contract) is untouched until A_65 Phase 1.

### 1.2 The warning corpus (179 warnings across the 5 F5-era artifacts), in three bands

1. **Informational noise (~40%):** "Scoring system enabled", "Cross-run novelty diverging", shadow-gate score lines, "pre-audit PASS", "deterministic remediation mode active". These are telemetry, not warnings — they pollute the channel and the gate accounting.
2. **THE structural finding — source-layer clue synthesis fires on EVERY run (~30%):** strict direct-culprit synthesis (5/5 runs), fp_contradiction_step synthesis (7 instances), strict late-slot synthesis (5/5), mapping/source/phrasing repairs (12), era-style sanitizer. **Agent 3/5 never emit a structurally complete clue set; deterministic machinery synthesizes the missing pieces from templates on every single run** — and that templated clue text is exactly the register the judge reads as machine-made (A_65 F3's "witnesses recall…" family traces here).
3. **Real defect warnings (~25%):** inference-coverage gaps (13 — steps without contradiction/elimination evidence), red-herring overlap with the true solution (every run: detected → regenerated → sanitized, three warnings each).

### 1.3 The gate accounting artifact
`run_outcome: failed` appears on 21 SHIPPED runs ("One or more phases failed threshold" — the M1v2-2 artifact), and informational lines inflate warning counts. Every scan of the corpus must currently know this folklore to read outcomes correctly. That is a reporting-honesty bug, not a run problem.

---

## 2. The workstreams

### R5 — Process debt (do first; ~1–2h total; kills three A_65b classes forever)
1. **Automated preflight** (`scripts/preflight-dist-check.mjs`): for every `packages/*` and `apps/worker`, fail if any `src/**` file is newer than the package's `dist/**`. Run at the top of every harness. *Retires the stale-dist class (the probe's C3 slip) permanently — no more grep-the-dist folklore.*
2. **Sleep-guard wrapper:** harness template gains `powercfg /change standby-timeout-ac 0` on entry and `…2700` on exit (trap on EXIT). Any script expected >30 min unattended uses it. *Retires the host-sleep loss class without re-opening the daily-use debt.*
3. **Report-outcome honesty:** `run_outcome` derives from the P0.2 definition (release gate ∈ {passed, warning} = shipped), with the phase-threshold detail demoted to its own field. *Retires the M1v2-2 folklore; every future scan reads truthfully.*

### R2a — Split the warning channel (~1–2h; prerequisite for honest targets)
Add a `severity` to pushed lines (`info` | `warn`) — mechanical reclassification of the §1.2 band-1 families to `info`. The F5 artifact diagnostic carries both, separated; gate/status accounting counts only `warn`. **Only after this is "gate=passed majority" a meaningful target.** (No behavior change to any gate — accounting only.)

### R6 — The measures harness (~1–2h; the plan's instrument)
`scratchpad/a65/derive-a65-measures.mjs`, run on every probe, appending one TSV row: corrective share · retries/regens/repairs by cause · warning count by family band · caps · plant compliance · inference density (A_65's) · gate status. The R0 numbers above are the baseline row. *This is A_65 P5 and A_65b §5 as one artifact — craft and reliability read the same probes.*

### R1 — Churn reduction, in evidence order (AFTER the Phase-1 probe re-ranks it)
**Sequencing rule: A_65 Phase 1 is also the top reliability lever.** Retry triggers (mechanism-early), scaffold-regen demand, and the report-register warnings are all instant-inference symptoms — build nothing cause-specific until the Phase-1 probe's R6 row shows what it killed. Then:
1. **AtmosphereRepair root-cause** (the one clearly INDEPENDENT of Phase 1 — start its investigation in parallel, corpus-only): it fires on ~3/4 of all chapters across every era and config. Read the detector's criteria against shipped chapters that scored atmosphere 8 — if it flags prize-winning atmosphere, it is a precision defect (Type A) and gets the R3 treatment; if the drafts genuinely lack anchors, the fix is the drafting prompt's sensory contract, not more repair. Either way the repair loop shrinks from ~7.6/run toward the <2 target.
2. **Template-linter retry triggers:** rank linter hits from chain logs; if concentrated in openers/recaps, the Phase-1 pruning (net-smaller obligation block) plus existing opener diversity rules should absorb them — measure before adding rules.
3. **Residual missing_clue regens:** already falling with plants; if the trend continues on probes, close as won; if it plateaus, the clue-observable phrasing (R2b) is the next suspect — a clue whose observable is unrenderable invites a regen every time.

### R2b — Source-layer completeness: stop synthesizing clues on every run (~3–5h; also a craft fix)
The every-run synthesis means the Agent-3 contract under-specifies the clue set structurally (direct-culprit clue, contradiction steps, late slot). Fix at the SOURCE: the Agent-3/5 prompts and schemas require the complete structural set (each inference step's contradiction/elimination evidence named, a direct-culprit clue authored, the late slot filled) so deterministic synthesis becomes a rare floor, not the norm — with its firing rate tracked by R6 toward ~0. Same change owns the **red-herring separation** (Agent 8 constraint: herrings must not share signal terms with the true solution — currently detected and sanitized downstream on every run) and the **inference-coverage gaps**. *This is the reliability face of A_65's register problem: hand-authored clue text at the source is also what stops the corpus reading as machine-made.*

### R3 — Detector census + precision retrofit (~2–3h; Type-A prevention at scale)
Run EVERY deterministic detector (prose-guard families, template linter, lifecycle, continuity, atmosphere criteria) over the 93-story shipped corpus — known-good by definition. Rank fire rates. Any detector firing on a large fraction of shipped stories is precision-suspect and gets: an innocent-look-alike fixture set from the corpus, an amplification cap (one defect ≠ N chapters × majors — the #7 lesson), and advisory-first status until its precision is proven. Census output becomes a tracked table; new detectors ship with the same kit by rule (A_65's detectors-are-measures law, reliability face).

### R4 — Input-integrity audit (~2–3h; Types C/D closed by construction)
1. **JSON boundaries:** inventory every agent's LLM-JSON parse site; each gets the Agent-5 kit (truncation detect + one retry, parse-boundary filter, honest max_tokens). The jsonrepair-phantom class becomes structurally impossible anywhere, not just Agent 5.
2. **`repairCaseSoundness` completeness:** assert one repair arm + one fixture per Type-C class (dual-detective, dual-victim, cleared-culprit-conflict, victim-coverage, beat-enum) — the audit is a checklist against the A_65b taxonomy, with any gap filled in the same pattern.

---

## 3. Sequencing and the shared-probe economy

```
now (all free/cheap):   R5 → R2a → R6  (+ R1.1 atmosphere investigation, corpus-only)
next probe (A_65 Ph.1): R6 row = the re-ranking → decide R1 order
then:                   R2b → R3 → R4, one workstream per sitting, measures per probe
```
Probes are shared with A_65 — reliability never buys its own run. Every workstream is fixture-first, and every fix must show up as a falling number in the R6 TSV within one probe, or it is re-examined rather than stacked on (the anti-whack-a-mole law applies here identically: falling counts via contract/source fixes, never via longer detector lists or more repair passes).

## 4. What DONE looks like (the era's reliability definition)

A probe that ships with: gate=`passed` · corrective share <30% · atmosphere repairs <2 · retries <3 · zero synthesis warnings · zero detector over-firers — at which point the churn pool has visibly drained, £/run and minutes/run have roughly halved, and the reliability ledger closes the way the abort ledger did: by running out of classes.

---

## 5. The phased implementation plan — what we will actually do

*(Fixture-first throughout; every phase ends with its suites green, tsc clean, and — where dists changed — the Phase-1 preflight passing. No phase buys a run: validation reads come from the probes A_65 already schedules.)*

### Phase 1 — Process debt (retires three A_65b classes by construction)
1. **`scripts/preflight-dist-check.mjs`**: for each workspace package with a build (every `packages/*` + `apps/worker`), fail loudly if any `src/**` mtime exceeds the newest `dist/**` mtime, naming the stale package. Self-test: touch a src file → preflight exits 1; rebuild → exits 0.
2. **Wire it in**: first line of every harness template (probe scripts, any future chain) + a note in the campaign README. The grep-the-dist folklore is retired — the check is mechanical now.
3. **Sleep-guard**: a shared harness snippet — `powercfg /change standby-timeout-ac 0` on entry, `trap 'powercfg /change standby-timeout-ac 45' EXIT` (minutes form) — used by any script expected >30 min unattended. Verify the trap restores on both clean exit and Ctrl-C.
4. **Report-outcome honesty**: in the orchestrator, derive `run_outcome` from the P0.2 definition (release gate ∈ {passed, warning} → `shipped`); the phase-threshold detail moves to its own field (`phase_thresholds_met: false`), never again masquerading as a run failure. **First inventory every consumer of `run_outcome`** (scan scripts, `mark-interrupted-reports.mjs`, any dashboard) and migrate them in the same change. Fixture: a report with failing phase thresholds + gate=warning asserts `shipped`.

### Phase 2 — The warning-channel split (accounting only; zero behavior change to gates)
1. **Inventory before code**: confirm empirically which accounting consumes `warnings.length` (the run-logger status vs `release_gate_outcome` — they are different mechanisms; read both call paths first, assume nothing).
2. **Band classifier**: `classifyRunWarning(w): "info" | "warn"` — a prefix map over OUR OWN emitted strings (bounded and ours, so a frozen map terminates — this is not a paraphrase-chasing detector; the anti-mole law does not apply to our own literals). The §1.2 band-1 families ("Scoring system enabled", novelty divergence, shadow-gate lines, "pre-audit PASS", "deterministic remediation mode") → `info`.
3. **The F5 diagnostic gains bands**: `run_warnings.details = { info: [...], warn: [...], counts }` — full array still preserved. Status accounting counts `warn` only.
4. **Fixture**: the probe artifact's 37 warnings classified; asserting the known five info-families land in `info` and the synthesis/inference-coverage lines land in `warn`.
5. **Acceptance**: next probe's artifact shows banded warnings; a run whose only lines are `info` reports a clean status. Only now does "gate=passed majority" become measurable.

### Phase 3 — The measures harness (the plan's instrument; craft + reliability in one)
1. **`scratchpad/a65/derive-a65-measures.mjs`**, one run-scoped derive emitting a TSV row: corrective share · retries/regens/repairs by cause label · warning counts by band and family · caps · plant-page compliance (the A_65 script folded in) · inference density per chapter (count of reasoning-connective sentences — reuse the prose-guard connective vocabulary, one source) · evidentiary-register count (the frozen family) · gate status · £-true (chars/4 audit).
2. **Baseline**: run it over the 5 planted-era runs; commit the baseline rows — the numbers in §1 become machine-derived and re-derivable.
3. **Auto-run**: harness templates call it after `STORY_SAVED`; the TSV is the era's longitudinal record (append-only, one row per run).

### Phase 4 — Atmosphere-repair root-cause (corpus-only; the one big cause independent of A_65 Phase 1)
1. **Read the criteria** (`agent9-run.ts` anchor/sensory checks) and extract them into a standalone testable predicate if they aren't already.
2. **Census them**: run the criteria over every chapter of the 93-story corpus, PLUS specifically the chapters of runs that scored atmosphere ≥8. Fire rate on judge-certified-excellent atmosphere = the precision verdict.
3. **Fork on evidence**: (a) fires on excellent chapters → Type-A precision defect: recalibrate with innocent fixtures drawn from the atmosphere-8 set, amplification capped; (b) genuinely absent anchors in first drafts → the fix is the DRAFTING sensory contract (front-load what the repair back-fills), and the repair pass becomes the rare floor. Either way: target <2/run, measured on the next probe; the repair pass itself is never deleted (floor, not lever).
4. **Fixture whichever fork**: innocent look-alikes (fork a) or a drafting-prompt snapshot test (fork b).

### Phase 5 — Post-probe re-rank (the sequencing rule made operational)
1. When A_65 Phase-1's probe lands, its Phase-3 TSV row IS the re-ranking: compare corrective share, retries, scaffold-regen and mechanism-early counts against the baseline.
2. **Decision rule**: any cause the inversion cut ≥50% → leave alone (the contract fix is working; iterate there). Any cause flat → it has an independent root: take the top one, root-cause it from its prompt-archive labels, fix generation-side, fixture it.
3. Expected residuals (predicted now, checked then): atmosphere (Phase 4 owns it), Agent-2 retries (~1/run, schema-shaped), template-linter repeats if opener-independent.

### Phase 6 — Source-layer clue completeness (the every-run synthesis ends)
1. **Derive the exact gaps** per run from the warn-band: which structural elements were synthesized (direct-culprit clue 5/5, fp_contradiction steps, late slot) and what the synthesized text looked like.
2. **Move the contract upstream** (`agent3-cml.ts` prompt + schema, `agent5-clues` extraction): the clue set must arrive structurally complete — every inference step names its contradiction/elimination evidence, a direct-culprit clue is AUTHORED (in scene-register language, not template), the late slot is filled. Schema-level presence checks, LLM-authored content.
3. **Red-herring separation at source** (`agent8`): herrings may not share key signal terms with the true-solution clues — stated in the generation contract; the downstream sanitizer stays as the floor.
4. **Synthesis machinery is kept as the floor** — with its firing now a `warn`-band event counted by Phase 3, target ~0. Fixture: a CML missing the direct-culprit clue still ships (floor works), and a complete one shows zero synthesis warnings.
5. *Craft dividend (A_65's register problem, same fix): clue text authored at the source in scene language is what stops the corpus reading as machine-made — this phase is jointly owned by both plans.*

### Phase 7 — The detector census (Type-A prevention at scale)
1. **Script**: run every deterministic detector family (scaffold, template-leakage, report-style, validation-note, the atmosphere criteria from Phase 4, the template linter, lifecycle death heuristic where runnable offline) over all 93 shipped stories, chapter-wise.
2. **Rank fire rates.** Shipped stories are known-good by definition; any detector firing on >~20% of them is precision-suspect and gets the kit: an innocent-look-alike fixture set drawn from the corpus hits, an amplification cap (one defect ≠ N×majors — the class-#7 law), and advisory-first status until precision is re-proven.
3. **Commit the census table** and add the standing rule: no new detector ships without its census run and its fixture kit.

### Phase 8 — Input integrity (Types C/D closed by construction)
1. **JSON-boundary inventory**: grep every LLM-JSON parse site across agents 1–9; tabulate which have the Agent-5 kit (truncation detect + one retry, parse-boundary filter, honest max_tokens). Add the kit where missing, with a truncated-payload fixture per boundary.
2. **Type-C checklist**: one `repairCaseSoundness` arm + one fixture per class — dual-detective, dual-victim, cleared-culprit-conflict, victim cast-coverage, beat-enum. Fill gaps in the same pattern (soundness at Agent-3 exit, never discovered chapters later).
3. **Acceptance**: the inventory tables committed; every row green; the phantom-clue and structural-CML classes become impossible anywhere, not just where they were first seen.

**Order recap:** Phases 1→2→3 in one sitting (~4h, all free) · Phase 4 parallel, corpus-only · Phase 5 waits for A_65 Phase-1's probe · Phases 6→7→8 one per sitting thereafter, each read by Phase 3's measures on the next shared probe.
