# The Craft Implementation Plan — the road from 60.5 to the top-6 profile (A_65's program, made concrete)

**Written:** 2026-07-22 · **Companion to:** [A_65](./ANALYSIS_65.md) (the analysis and strategy — findings F1–F5, program P1–P5) and the [Reliability Remediation Plan](./RELIABILITY_REMEDIATION_PLAN.md) (the sibling plan — **the two share sittings, probes, and one measures harness**). **Regime:** §2.8 — corpus-derived, fixture-first, one probe per accumulated iteration.

**The one-sentence plan:** delete the instant-inference mandate *completely* (inventory first, prune everything, license reasoning at exactly three beats), measure the deletion on one shared probe, then encode what the corpus's own 66–74 runs already do in the live categories — with the owner's offset reads deciding, in parallel, which instrument is allowed to call the result progress.

---

## 0. PROGRESS TRACKER

*(One row per implementation phase — detailed steps in §2. Statuses ⬜ pending · 🟡 in progress · ✅ done · ⛔ blocked. A_65 §0 tracks strategy; THIS table tracks the build.)*

| Phase | What | Cost | Depends on | Status | Last update |
|---|---|---|---|---|---|
| — | Founding analyses F1–F5 (A_65 §1) | £0 | — | ✅ done | 2026-07-22 |
| **0** | Offset: the owner's 4 M3 reads → external mean, gap, felt-experience notes | ~1.5h owner, £0 | — | ⬜ **owner** | — |
| **1** | The Withheld-Inference build: inventory → invert → license → guard → fixture | ~4–6h | reliability Ph1 (preflight) helpful, not required | ⬜ | — |
| **2** | Probe #1 (the shared spend) + the measures read | ~£1.5 | 1 (+ reliability Ph3 for the TSV) | ⬜ | — |
| **3** | Top-6 profile: derive the live-category deltas → encode 2–3 contracts | ~3–4h | derivation free now; contracts ride probe #2 | ⬜ | — |
| **4** | Instrument decision: offset branch A/B (+ optional external re-read of probe #1) | owner | 0 | ⬜ **owner** | — |
| **5** | Standing measures (joint harness — reliability Ph3 owns the build; craft metrics ride in it) | (shared) | reliability Ph3 | ⬜ | — |

**Era acceptance (craft):** live categories trend to the top-6 profile on successive probes — **ending ≥7 · atmosphere ≥8 · premise ≥7.5 · prose ≥6.5 (internal)** — with **zero caps**, inference density ~0 outside licensed beats, register counts falling; then ONE external read confirms the felt experience moved. Dead-band marks (clues/plot_structure/pacing) are explicitly NOT acceptance inputs until Phase 4 resolves the instrument.

---

## 1. The evidence this plan stands on (recap — full derivations in A_65 §1)

| Finding | One line | Consequence here |
|---|---|---|
| F1 | Judge complaint templates persist on 5/5 planted-era stories | Don't steer by dead-band marks |
| F2 | 95% of plants ARE on the page before their reveals | The lever landed; the defect is elsewhere |
| F3 | **Nothing is withheld** — our own mandate forces instant inference; ch1 carries the solved contradiction | Phase 1 is the campaign's next lever |
| F4 | clues/plot_structure/pacing = dead bands; ending/atmosphere/premise/prose = live, +1.5–2.2 headroom | Aim every contract at live categories |
| F5 | The corpus already contains 74 internal; +9.5 offset ⇒ ~external 80 | Phase 0's reads decide what "progress" means |

---

## 2. The phased implementation plan — what we will actually do

*(Fixture-first throughout; suites green + tsc clean + preflight passing before any probe; the anti-whack-a-mole rules of A_65 §4 are binding on every step.)*

### Phase 0 — Pin the offset (owner; parallel with everything)
1. Read the four M3 stories with the usual external rubric; record the marks in `scratchpad/m3/read-packet.md`.
2. Derive external mean and gap vs internal 60.8. Gap > 3 additionally fires the old 7.8 recalibration item.
3. Note the two felt-experience answers while reading: did the planted clues *feel* planted; did the reveal feel *earned*. These route straight into Phase 4.

### Phase 1 — The Withheld-Inference build

**Step 1.1 — The inference-instruction inventory (read before touching anything).** Enumerate every place the prompt/validation surface DEMANDS visible reasoning, and tabulate keep/kill/move for each. Known members to seed the inventory (it must be completed, not assumed):
- `obligation-block.ts`: the MANDATORY TWO-PARAGRAPH structure (both the clue-map branch and the fallback branch — it appears twice); the `Points to:` line emitted for every non-deferred clue; the early-placement "reasons about what this evidence implies" language.
- `regen-integration.ts`: `instructionForDefect` for `missing_clue` / `clue_too_late` (do the regen instructions demand inference too?).
- The DT and reveal contracts (KEEP — they are two of the three licensed beats) and the false-solution beat (currently has no reasoning license — it GAINS one).
- Gates that might *require* inference text: G6 read-back (keys on observation tokens — verify), fair-play "Logical Deducibility" (verify what it actually reads), `validateChapterPreCommitObligations`, the clue-presence/early-placement validators (these key on observables — expected safe; verify).

**Step 1.2 — Fixtures before code.** (a) The F3 chapter-1 sentence, verbatim, as the failing fixture for the derived-contradiction embargo check (both canonical values + conditional-inference syntax — checkable because the values are known strings; fixture-narrow by the anti-mole law). (b) Corpus samples of the evidentiary-register family as the register-guard fixtures, PLUS innocent look-alikes (dialogue quoting a witness is LEGAL — narration-scope only). (c) A built-obligation-block snapshot fixture that counts instructions — the **net-smaller assertion** (the block after Phase 1 < the block before, mechanically checked).

**Step 1.3 — Invert.** Execute the inventory's kill/move column in ONE change: ¶2 deleted from both branches; `Points to:` suppressed in pre-reveal prose instructions (it survives on the planning surface only — regen/repair internals that need clue semantics keep reading it from the clue object, never printing it into drafting prompts); the replacement language is the C1 register generalized (*observed concretely, in scene; noticed, never explained; meaning arrives later*).

**Step 1.4 — License.** Reasoning language is present in exactly three chapter contracts: false solution (gains: "reason VISIBLY and honestly to the wrong conclusion the evidence permits"), discriminating test (existing contract kept), the walked reveal (C2, already built — unchanged). Everything else observation-only.

**Step 1.5 — The register guard** (`packages/prose-guard`, new module): `detectEvidentiaryRegister(prose)` over the FROZEN family, narration-scope (quoted dialogue excluded). A measure permanently: counts → ctx.warnings (`warn` band once reliability Ph2 lands) → F5 artifact → the TSV. It never regens, never caps, never grows its list (A_65 §4, binding).

**Step 1.6 — Verify.** New fixtures green; `obligation-aftermath-item11`, `obligation-planted-mystery-a64`, and the full prompts-llm/worker suites green (the inventory's gate audits proven by the suites, not by assertion); tsc; every dist rebuilt; preflight (or the grep-the-dist rule until reliability Ph1 ships).

### Phase 2 — Probe #1 (shared with the reliability plan) and its read
1. ONE fresh run on the accumulated config. Before launch: preflight; flags unchanged (`AGENT7_PLANT_BEFORE_REVEAL`, `AGENT7_DISCOVERY_TELL` stay on).
2. Read by measures, never marks: **inference density ~0 outside the three beats** (the Phase-1 success metric) · register counts vs the M3 baseline · plant compliance ≥90% holds · zero caps · gate ships · AND the reliability read (corrective share, retries, scaffold-regen demand — Phase 1 is predicted to cut them; the same TSV row answers both plans).
3. The row feeds reliability Phase 5's decision rule; craft-side, any wiring miss is fixed offline (the C3 precedent) before anything else stacks.

### Phase 3 — The top-6 profile, made deliberate
1. **Derive (free, can start today):** a contrast script over the top-6 vs bottom-6 STORIES (not their marks): aftermath — paragraphs after the resolution event, and what they contain (motive-in-human-terms? a changed circumstance shown?); dialogue share per chapter; description density (adjectives/NP, sentence-length variance); opening shape (time-to-stakes in paragraphs); chapter count and length variance. The M3 endings scored 5–7 *with* the aftermath contract — the 7s vs the 5s difference is the first thing the script must answer.
2. **Encode** the two or three strongest structural deltas as drafting-contract revisions — prompt-level, no new subsystems, each replacing or tightening an existing instruction (the net-smaller rule keeps holding). **Goodhart guard binding: structural properties only, never phrase imitation.**
3. **Ride probe #2** — the next accumulated probe, not a dedicated one; read by the same TSV + the live-category marks recorded (trend, not verdict).

### Phase 4 — The instrument decision (owner, once Phase 0 lands)
- **Branch A (gap ≥ +6):** internal 73 stands as proxy. Iterate Phases 1–3; external spot-read at milestones (e.g., first probe with ending ≥7 + zero caps).
- **Branch B (gap < +6):** internal totals retire as a target. Owner picks: K2-class judge revision (stronger judge model / decomposed rubric / anchored exemplars — changed alone, never bundled with a lever), or steering by periodic external reads only.
- Either branch: the optional external re-read of probe #1 (~20 min, one story) is the cheapest possible check that withheld inference changed the *felt* mystery.

### Phase 5 — Standing measures (joint)
The reliability plan's Phase 3 builds the harness; the craft metrics (inference density, register counts, plant compliance, live-category marks, cap profile) are rows in the same TSV. One instrument, two ledgers, every probe self-measuring. Nothing to build here beyond confirming the craft columns land.

---

## 3. Sequencing — the two plans, one calendar

```
sitting 1 (free):      reliability Ph1–Ph3 (preflight, warning split, measures)  + Phase 3.1 derivation can start
sitting 2 (~4–6h):     Phase 1 (the inversion)                                   + reliability Ph4 runs parallel
probe #1 (~£1.5):      Phase 2 = reliability Ph5's re-rank — ONE run, both plans read it
sitting 3:             Phase 3.2 contracts + top residual churn fix (reliability Ph5 verdict)
probe #2 (~£1.5):      both plans' second row; live-category trend read
owner, any time:       Phase 0 reads → Phase 4 decision
```

**What DONE looks like (craft):** a probe shipping gate=passed with zero caps, inference held to the three beats, register counts near zero, ending ≥7 / atmosphere ≥8 / premise ≥7.5 / prose ≥6.5 internal — and then one external read saying the mystery finally *withholds*. If the offset held, that story is the campaign's first external-80 candidate; if it didn't, it is still the best story the pipeline has ever produced, and the remaining argument is with the ruler, not the work.
