# Agent 6 — Spike A/B result: blind-reader variance vs deterministic checker

> Companion to [`11_agent_6_fair_play_auditor.md`](11_agent_6_fair_play_auditor.md) §9.1. The redesign
> rests on one empirical claim — *the blind reader is a stochastic sample treated as a deterministic
> verdict, and its failure path `throw`s and kills sound runs.* This is the measurement, run with
> [`scripts/agent6-blind-reader-variance.mjs`](../../scripts/agent6-blind-reader-variance.mjs) against
> real shipped cases. Reported honestly, including where the data is more nuanced than the hypothesis.

## Method

- **Spike A (stochastic gate).** Call the *same* `blindReaderSimulation` that gates the live run
  (and whose failure path throws, [`agent6-run.ts` ~1731]) N times per case, on already-shipped cases
  pulled from `store.json` + historical git snapshots. The "pass" computed exactly as the live gate:
  `suspectedCulprit ≈ culprit AND confidence ∈ {certain, likely}`. The metric is the **false-veto
  rate** — samples that would veto a case the full pipeline already shipped as fair.
- **Spike B (deterministic checker).** Run `proveSolvability` (the redesign's correctness oracle,
  built over `@cml/cml-core`'s engines) N times and count verdict flips.

## Result

| | samples | flips / vetoes |
|---|---|---|
| **Spike A** — sweep, 12 shipped cases × 8 | 96 | **8 vetoes (8%)**; 11/12 cases clean (0/8), **1 case vetoed uniformly** |
| **Spike A** — targeted, the one veto case × 20 | 20 | **20/20 veto** (all "likely" → a *different* suspect than the shipped culprit) |
| **Spike B** — `proveSolvability` × 20 | 20 | **0 flips** — byte-identical every time |

## Reading it honestly

- **The checker never wavers (0/20).** The deterministic side of the §9.1 contrast table holds
  trivially, as predicted.
- **The blind reader is *not* a pure per-sample coin flip on these cases.** Within a case it was
  mostly self-consistent (0/8 or 8/8). The clearest sampling noise is in the **confidence level**
  (e.g. one case split `{likely:6, certain:2}`, another `{likely:5, certain:3}`) — which matters,
  because pass/fail turns on that level, so a case sitting at the `likely`/`uncertain` boundary would
  flip the gate on resampling. The variance is real but lives *near the confidence threshold*.
- **The damning finding is the uniformly-vetoed shipped case.** `proj_9ce79bff` (culprit *Miriam
  Sawyer*) vetoes **20/20** — yet it shipped, so the live gate passed it at run time. The gate's
  verdict is **not reproducible against the shipped artifact**: run-time passed, replay kills it every
  time. Whether that is a *false veto* (the case is actually fair) or a *real fairness defect* (the
  clues genuinely don't entail Miriam Sawyer), **a stochastic LLM veto that `throw`s is the wrong
  instrument** — exactly the §3 category error. The deterministic checker is what should adjudicate
  truth here; the blind reader should only ever annotate.

## Conclusion (what this justifies)

The run-killing `throw` is indefensible **either way**: it kills sound cases on a bad sample, or it
reacts to a genuine defect with a coin-flip-shaped sledgehammer instead of a precise, routed
obligation. The redesign's move is supported:

1. **Correctness → the deterministic checker** (`proveSolvability`, 0 flips). Shipped as a typed
   `SolvabilityProof` contract over the cml-core engines (this increment).
2. **Demote the blind reader to a non-fatal annotator** — remove the throw first (§7.3), then fan it
   into the N-persona panel producing a `DifficultyReport` (metadata, never a gate).

Caveat retained: this sample is small (12 cases, one snapshot family) and the cases are mostly
"easy" for the reader. The harness is repeatable and case-targetable (`--project=`), so widening the
corpus — especially toward borderline cases near the confidence threshold — is the obvious next
measurement before any deletion lands.
