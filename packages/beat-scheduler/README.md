# @cml/beat-scheduler

The **Beat Scheduler** — deterministic scene-grid layout for Agent 7. First increment of the redesign
in [`documentation/12_system_redesign/13_agent_7_narrative_outliner.md`](../../documentation/12_system_redesign/13_agent_7_narrative_outliner.md).

> **Thesis (§4):** the outline is a *scheduling problem with a known-correct answer*. The obligatory
> beats of a fair-play whodunit form a partially-ordered set with hard ordering + pacing laws the CML
> already encodes — so a deterministic scheduler should lay them into a scene grid, and the LLM's job
> should shrink to *dramatizing* each fixed slot. Today we do the opposite: the LLM free-schedules,
> then ~700 lines of band-aids (`applyDeterministicCluePreAssignment`, the scene-count lock,
> Bridge-Scene fabrication, the test-vocabulary splice) try to repair the schedule after the fact.

This package is **Stage A** — pure, deterministic, no LLM, **NOT wired into the pipeline** (nothing
deleted). The Stage-B Dramatizer (LLM fills texture into fixed slots via structured output) is the
gated later phase.

## What it does

`buildSceneGrid(input, sceneCount): SceneGrid` reads the CML obligations + Agent-5 clue distribution
and lays them into a grid that is **complete, correctly ordered, exact-count, and ≥60% clue-bearing
by construction**:

- **`collectObligations`** reads the must-occur beats directly from structured fields
  (`culpability.culprits`, `cast` roles, the clue distribution, `discriminating_test`,
  `prose_requirements`) — never from prose.
- **`buildSceneGrid`** splits `sceneCount` slots by act ratio (0.28 / 0.47 / rest), places anchors
  (victim/crime in Act I, false solution then test then reveal/denouement), spreads clue reveals
  (essentials before the test, none after the reveal), places clearances after their supporting
  clues, and plants herrings before the false solution. `cluesRevealed` is **scheduler-owned** — the
  property the live runner retrofits is now the construction.
- **Invariants** (`checkComplete` / `checkOrdered` / `checkCoverage`) are pure checks the scheduler
  self-verifies before returning; an infeasible obligation set throws `SchedulerInfeasibleError` with
  the precise unmet constraint — *loud and early at the logic layer, not at scene 14 of prose.*

The hard guarantees are completeness, ordering, and ≥60% coverage; "no run of >2 clueless slots" is
a **soft** pacing target (`CoverageResult.pacingOk`), best-effort, never thrown on.

## Spike 1 — the scheduler emits a valid grid, offline (§9.1), and its result

[`scripts/agent7-scheduler-shadow.mjs`](../../scripts/agent7-scheduler-shadow.mjs) runs `buildSceneGrid`
over every already-shipped run (cml + clues + the live outline's scene count) and asserts the three
invariants directly. Measured over **12 shipped runs**:

- **11/12 feasible**, and of those **100% complete · 100% ordered · 100% ≥60% coverage · 100% no
  >2-clueless-run** — a complete, correctly-ordered grid at the *live* scene count, with zero LLM and
  zero band-aids.
- The **1 infeasible** case is a real signal, not a bug: `proj_9ce79bff` at **19 scenes** has only
  58% clue coverage, so the scheduler **refuses to fabricate filler** (the Bridge-Scene smell §3-C/§4.1
  removes) and surfaces *"too few clue-bearing slots for 19 scenes."* (It's the same run the Agent-6
  blind reader vetoed 20/20 — independent evidence the outline was padded.)

```bash
node scripts/agent7-scheduler-shadow.mjs                    # live data/store.json
node scripts/agent7-scheduler-shadow.mjs a.json b.json …    # aggregate a wider corpus
```

## Tests (11)

- **The §4.5 worked example** reproduced end-to-end: exactly 10 slots split 3/5/2, complete, ordered,
  ≥60% covered, the Golden-Age 10-beat arc in canonical order, every essential clue before the test,
  reveal last with no clue after, `cluesRevealed` covering every distributed clue once.
- **Robustness** across scene counts (8–16): complete + ordered + ≥60% coverage at each.
- **Infeasibility surfaces loudly**: a scene count <4 and a near-clueless story that can't reach 60%
  both throw `SchedulerInfeasibleError`.

```bash
npm run -w @cml/beat-scheduler test         # vitest (11 tests)
npm run -w @cml/beat-scheduler type-check   # tsc --noEmit
npm run -w @cml/beat-scheduler build        # tsc → dist/ (gitignored)
```

## What's next on the §7 ladder (gated)

1. **Shadow** beside the live agent (this harness, productised) — gather match/divergence data.
2. **Swap `cluesRevealed`** from the grid (delete `applyDeterministicCluePreAssignment`).
3. **Swap the scene count** from the grid (delete the count lock + Bridge-Scene fabricator).
4. **Invert the prompt** to the per-slot Dramatizer under structured output (P2) — the four
   scheduler-owned fields become non-writable.
5. **Promote feasibility into Agent 4** (CML validation); Agent 7 becomes purely the Dramatizer.
