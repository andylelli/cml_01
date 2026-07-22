# The Reliability Remediation Plan — emptying the churn pool (A_65b's program, made concrete)

**Written:** 2026-07-22 · **Companion to:** [A_65b](./ANALYSIS_65b.md) (the failure ledger) and [A_65](./ANALYSIS_65.md) (the craft program — the two share probes and one root cause). **Regime:** §2.8 — every derivation free, every fix fixture-first, probes shared with A_65, no batches.

**The one-sentence plan:** the ground-truth derivations below show the top churn causes and the top warning families both point UPSTREAM — at the instant-inference contract (already A_65 Phase 1) and at source-layer clue synthesis that fires on every run — so the plan fixes process debt immediately (R5), splits the warning channel (R2a), builds the measures (R6), lets Phase 1's probe show which churn it kills for free, then root-causes what remains in ranked order (R1), hardens detectors and inputs (R3/R4), and holds the era targets: **aborts 0 · corrective share falling · gate=passed the norm.**

---

## 0. PROGRESS TRACKER

| # | Workstream | Cost | Depends on | Status | Last update |
|---|---|---|---|---|---|
| R0 | Ground-truth derivations (churn ranking, warning families, retry reasons) | £0 | — | ✅ done (embedded in §1) | 2026-07-22 |
| R5 | Process debt: preflight dist-check · sleep-guard wrapper · report-outcome honesty | ~1–2h | — | ⬜ | — |
| R2a | Warning-channel split (informational vs defect) → honest gate accounting | ~1–2h | — | ⬜ | — |
| R6 | `derive-a65-measures.mjs`: churn + warning-family + craft measures, per probe | ~1–2h | — | ⬜ | — |
| — | *A_65 Phase 1 probe lands (shared)* | (A_65's) | A_65 Phase 1 | ⬜ | — |
| R1 | Churn reduction, ranked: re-rank post-Phase-1, then fix top residual causes (atmosphere-repair root-cause first) | ~2–4h each | R6 + Phase-1 probe | ⬜ | — |
| R2b | Source-layer clue completeness (kill the every-run synthesis) + red-herring separation at source | ~3–5h | R2a ranking | ⬜ | — |
| R3 | Detector census over the 93-story corpus + precision-fixture retrofit | ~2–3h | R6 | ⬜ | — |
| R4 | Input-integrity audit: JSON boundaries (truncation/parse) + `repairCaseSoundness` vs the Type-C list | ~2–3h | — | ⬜ | — |

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
