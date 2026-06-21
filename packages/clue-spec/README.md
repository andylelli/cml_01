# @cml/clue-spec

Deterministic **clue-spec deriver** for Agent 5 — Stage A of the redesign in
[`documentation/12_system_redesign/10_agent_5_clues_red_herrings.md`](../../documentation/12_system_redesign/10_agent_5_clues_red_herrings.md).

> **Thesis (§1, §4):** clues are the *renderings* of inference steps the CML has already proven, so
> the set of clues that must exist is **computed** from the frozen CML — not invented as a free
> creative act and then policed for fairness by 168 KB of accreted checkers, repairers, and
> synthesizers. `deriveClueSpec(cml)` is that computation.

This is the **first increment** (§9.7): the authoritative deriver + the Spike-1 coverage harness.
It is **pure, deterministic, no LLM, and NOT wired into the shipped pipeline** — the live Agent 5
still runs its generate-then-audit path. This package only *proves the thesis* before any deletion.

## What it does

`deriveClueSpec(cml): ClueSpec` reads a frozen CML `CASE` (or a `{ CASE: … }` wrapper) and emits the
complete set of clue + red-herring **slots** — what must exist and where each comes from, not yet
prose. The mapping is the §4.1 table, with `CASE.`-prefixed source paths matching the real corpus:

| CML source | Derived slot(s) |
|---|---|
| each `inference_path.steps[i].observation` | one **observation** slot |
| each `inference_path.steps[i].correction` | one **contradiction** slot |
| `hidden_model.mechanism.description` | one **mechanism-visibility** slot |
| `discriminating_test` (`evidence_clues[]` if declared, else `knowledge_revealed`) | **discriminating-evidence** slot(s) |
| `culpability.culprits[*]` | one **direct-evidence** slot per culprit |
| each eligible non-culprit `cast[*]` | one **elimination** slot per suspect |
| `false_solution.the_one_flaw` | the **hinge** clue the false solution can't explain |
| `false_solution.supporting_points[*]` | one **red-herring** slot each (§4.2) |

Every slot is born with a stable `id`, an `evidenceType`, a fixed legal `sourceInCML`, a
`criticality`, and a non-`late` `suggestedPlacement` — the fields today's runner spends thousands of
lines *checking and backfilling* become the **input**. Red herrings derive from `false_solution`, so
they **cannot reinforce the true solution** by construction (deleting the overlap-sanitizer
machinery, §4.2).

## Spike 1 — derivation completeness (§9.1), and its result

The whole redesign rests on one empirical claim: *the clue set is fully derivable from the frozen
CML.* [`scripts/agent5-derive-coverage.mjs`](../../scripts/agent5-derive-coverage.mjs) falsifies-or-
confirms it on **real shipped data** — for every project that shipped both a CML and a clue set, it
runs `deriveClueSpec` and asks whether the derived slots cover every clue the run shipped, and
especially every clue the deterministic **synthesizers** had to mint (`clue_fp_*`,
`clue_culprit_direct_*`).

Measured over **19 unique frozen runs** (current `store.json` + historical snapshots from git;
289 shipped clues):

- **Synthesizer coverage: 20 / 20 = 100%** — every clue a synthesizer minted traces to a derived
  slot. **The §9.1 derivation-completeness claim holds.**
- **Overall clue coverage: 288 / 289** — the lone miss is an LLM-*authored* elimination clue (a free
  rendering, not a synthesizer gap).
- **Caveat (honest):** most historical CMLs predate the optional `false_solution` block, so the §4.2
  red-herring derivation only fires where Agent 3 populated `supporting_points`. It does so correctly
  where the data exists; the corpus is simply mostly pre-`false_solution`.

```bash
node scripts/agent5-derive-coverage.mjs                    # live data/store.json
node scripts/agent5-derive-coverage.mjs a.json b.json …    # aggregate a wider corpus
```

## Tests

```bash
npm run -w @cml/clue-spec test         # vitest (15 tests: §4.1 mapping + §9.4 invariants + robustness)
npm run -w @cml/clue-spec type-check   # tsc --noEmit
npm run -w @cml/clue-spec build        # tsc → dist/ (gitignored)
```

## What's next on the §9.3 ladder

This increment ships *dark* and produces the metric (derivation coverage) that green-lights every
deletion after it. The later phases are gated and deliberately not built here:

1. **Flip the LLM contract** from "generate clues" to "render these slots" under structured output
   (needs P2) — `id`/`sourceInCML`/`evidenceType` fixed by the slot; no `status:"fail"` escape hatch.
2. **Delete the synthesizers** as their gates go quiet (the coverage metric above is the safety signal).
3. **Move placement to the deducibility checker** (`@cml/cml-core`, now built) and emit the fair-play
   certificate.
4. **Switch red herrings to `false_solution`**; delete the overlap sanitizers.
5. **Slim Agent 6** to the blind-reader pass once the certificate is trusted.
