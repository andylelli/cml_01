# 0006 — `run_outcome` derives from the release gate, not from phase thresholds

**Status:** Accepted · **Decided:** A_63 era, contested in most batch-gate tallies since

## Context

A run produces a 15-phase scoring report. Each phase has a score and a pass/fail threshold. It is
tempting to define the run's outcome as a function of those: "all phases passed → the run passed."

That definition breaks in both directions. A run can pass every phase threshold and still ship a story
whose culprit is never named — because no phase threshold encodes "the culprit is named." And a run
can fail a phase threshold on a diagnostic that has no bearing on whether the story is publishable.

Every batch gate on this project is stated as "N consecutive runs, zero aborts", so the definition of
outcome is not a reporting detail — it decides whether a lever gets promoted.

## Decision

**`run_outcome` is the release gate's verdict: did a complete, obligation-satisfying story ship?
Phase scores are diagnostics that inform, but do not define, the outcome.**

## Consequences

- **The outcome means one thing.** "Shipped" is a claim about the artifact a reader would receive, not
  an aggregate of internal metrics.
- **Phase scores stay honest.** Because they do not gate, a phase scorer can be made *stricter* without
  anyone fearing it will fail the batch. Scorers that gate get quietly softened; scorers that only
  report do not.
- **Batch tallies are reproducible.** Anyone can recount a batch from the release gate field. Hand
  tallies over phase panels have been wrong before, in a direction that flattered the change.
- **A shipped story can still be bad.** This decision deliberately separates *shipped* from *good*. The
  rubric measures good; the release gate measures shipped. Conflating them is what produced "a
  'weakest phase' that was a scorer bug."
- **It pairs with ADR-0003.** Never-abort plus outcome-from-release-gate means almost every run reports
  as shipped — so *floor-firing counts*, not the outcome field, carry the quality signal.

## What would change our mind

- If the release gate itself were shown to pass stories that a reader would reject outright, the gate
  would need strengthening — but the fix would be a stronger gate, not a switch to phase thresholds.
- If a phase scorer were ever proven to correlate with reader judgement better than the release gate
  does, that scorer would be a candidate for *joining* the gate — with the measurement to justify it,
  per ADR-0011.
