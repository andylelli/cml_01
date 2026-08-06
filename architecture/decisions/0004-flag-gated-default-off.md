# 0004 — Flag-gated, default-OFF, promoted only on an N≥4 matched-pair probe

**Status:** Accepted · **Decided:** corpus era (§2.8 regime), reaffirmed by [FLAG-AUDIT.md](../FLAG-AUDIT.md) · **Ratified:** 2026-08-06 (owner)

## Context

Every behaviour change to a generative pipeline is a hypothesis. It cannot be verified by unit tests,
because the thing it changes is prose quality, which no assertion captures. It can only be verified by
running the pipeline and comparing outputs — which costs £4–8 and about two hours per comparison.

Before this regime, changes shipped on the author's judgement. The boards are a record of what that
produced: a lever documented as "(common)" that had fired 0/18 times, a "weakest phase" that was a
scorer bug, a cap panel hand-tallied wrong. In each case the change *sounded* right and the code
*looked* right.

## Decision

**Every behaviour change ships behind an environment flag, read at runtime, defaulting to OFF, and is
promoted only on a matched-pair A/B of at least four runs per arm.**

Three details are load-bearing:

- **Runtime-read, never a module const.** A module-level `const X = process.env.Y` freezes before
  dotenv loads, so the flag silently never fires — the probe then measures nothing and reports a null
  result as evidence of no effect. This has actually happened.
- **Matched pairs.** Chapter count and opening-naming dominate rubric variance; comparing unmatched
  runs measures those, not the lever.
- **N≥4.** A single run cannot separate a lever from noise.

## Consequences

- **The pipeline has not regressed across ~70 boards of change.** This is the return on the regime,
  and it is the reason REVIEW §4 lists it under "do not change."
- **It is slow, and it accumulates flags.** 148 environment flags exist; Agent 9 owns 33. Fifteen are
  dormant. Each dormant flag guards a branch that ships in the dist, is unit-tested in isolation, and
  has never executed inside a real pipeline.
- **Flags need an exit path, and did not have one.** [FLAG-AUDIT.md](../FLAG-AUDIT.md) added it: every
  flag must end as *promoted*, *deleted*, or *deferred with a named blocker*. "Unset indefinitely" is
  not a state.
- **Default-ON flags are the hidden risk.** The audit found four flags whose unset value means ON, so
  they run in production with nothing in config recording that choice. A run's behaviour is not
  reconstructable from `.env.local` alone.
- **The regime made measurement the bottleneck.** Eleven of seventeen deferred flags name one blocker:
  the eval harness (R6). That is not a failure of the regime; it is the regime correctly refusing to
  promote on faith, and correctly identifying what would unblock it.

## What would change our mind

> **Ratification note, 2026-08-06.** Accepted, **and the rule is now enforced rather than stated.**
> "Runtime-read, never a module const" was broken AFTER this record was written, in `agent7-run.ts` —
> the one module holding the lever of the next paid probe ([REVIEW_05 §24.1](../REVIEW_05.md)). A rule
> that has been broken after being written down is not being held by the writing down, so
> `scripts/module-const-flag-check.mjs` now fails the build on a module-scope `const X =
> process.env.Y`, and runs on every `npm test`.


- Not the cost. Cheap measurement (R6) does not weaken this decision — it *strengthens* it, by making
  the probe requirement affordable rather than aspirational.
- A change class provably unable to affect prose (a pure rename, a type-only refactor) does not need a
  flag. The test is whether any byte of any prompt or any shipped chapter could differ.
