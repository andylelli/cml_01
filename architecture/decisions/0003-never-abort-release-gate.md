# 0003 — Never-abort release gate, with a deterministic floor under it

**Status:** Accepted · **Decided:** ~A_55, load-bearing through the corpus era · **Ratified:** 2026-08-06 (owner)

## Context

Some obligations are non-negotiable: the culprit must be named, every suspect must be cleared, the
required clues must appear, the story must resolve. When the LLM fails to satisfy one after retries
and regens, there are two options.

**Abort** the run: no story ships, the defect never reaches a reader, and the batch loses a slot.
**Inject** deterministically: paste a machine-written sentence that satisfies the obligation, and ship
a story with one flat paragraph in it.

The choice matters more than it looks, because the batch gates that govern every decision on this
project are of the form "N consecutive runs, zero aborts." An abort does not just cost £1.50 — it
resets the count that gates everything else.

## Decision

**Never abort on a repairable obligation. Ship, with a deterministic injector as the floor.**

The repair ladder tries the LLM paths first (targeted regen, scoped rewrite). Only when those fail
does the deterministic injector fire, and when it does it is *logged as a floor firing* rather than as
a success.

## Consequences

- **Ship rate is protected.** A story always exists at the end of a run that did not die of
  infrastructure. That is what makes N≥4 batches affordable.
- **The floor is visible in the prose, and readers notice.** External reviewers have called injected
  paragraphs "generated validation prose". This is the cost, and it is a real one — the floor trades
  prose quality for shipped-story rate, deliberately and in that direction.
- **Floor firings are the primary quality signal.** Because every firing is logged, "how often did we
  fall to the floor?" is a measurable proxy for "how often did the craft path fail?" That number is
  more actionable than a rubric delta.
- **The floor must never be removed to improve prose.** REVIEW §4 lists it under "do not change" for
  this reason: deleting the injector does not make the prose better, it makes the run abort.
- **It creates pressure in the right place.** The way to stop shipping flat paragraphs is to make the
  LLM rungs succeed more often — which is what the regen flags exist to test.

## Scope boundary — what this decision does NOT cover

Added 2026-08-02, because REVIEW_02 introduced an abort path and a reader should not have to guess
whether it violates this record.

**This decision governs REPAIRABLE OBLIGATIONS in a run that has already spent money.** It says
nothing about a run that cannot possibly succeed. `assertFlagCapabilities` throws at t=0 when the
configuration is impossible — e.g. structured outputs requested on a transport that cannot carry a
schema. That abort costs nothing, protects the £1.40 the run would otherwise burn before failing, and
crucially **refuses to degrade silently**: falling back would let a probe report "flag ON" while
running the control arm, which corrupts the measurement this project's every decision rests on.

The distinction: *never abort a story that could still ship* · *always abort a run that cannot*.

## What would change our mind

> **Ratification note, 2026-08-06.** Accepted. One correction to the record above: the clause *"when
> it does fire it is logged as a floor firing rather than as a success"* was **aspirational until
> 2026-08-04**. The 08-04 run recorded an injected disclosure as an obligation *met*, which is exactly
> what this ADR says does not happen. It became true with N1's `met_by_injection` verdict and X4's
> injector telemetry ([REVIEW_05 §14](../REVIEW_05.md), §22). Noted because a Consequences clause is a
> claim, and claims in this project are supposed to carry their measurement.


- If the LLM rungs reached a high enough success rate that the floor fired approximately never, the
  floor would become dead code and could be demoted to an error path. The evidence is a floor-firing
  count near zero across a batch — which is exactly what the regen-lever probes measure.
- If a reader-facing quality bar were adopted that treats an injected paragraph as *worse than no
  story*, the trade would invert. Nobody has argued that, but it is the honest reversal condition.
