# 0002 — Sequential prompt chaining, not an autonomous agent

**Status:** Accepted · **Decided:** original design, re-examined in REVIEW.md §2.1 (2026-08-01)

## Context

The pipeline is thirteen hardcoded stages executed in a fixed order by one orchestrator function.
That reads like technical debt. The obvious "modernisation" is an autonomous agent that decides for
itself which tools to call and when — one loop, no hardcoded sequence, less orchestration code.

## Decision

**Keep the fixed sequential chain. Do not adopt an autonomous agent architecture.**

Anthropic's [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
names prompt chaining — sequential LLM calls with programmatic gates between them — as the right
choice "where the task can be easily and cleanly decomposed into fixed subtasks", and warns that
autonomous agents carry "higher costs and compounding error risks."

Generating a mystery decomposes cleanly and *fixedly*: the subtasks are determined by the genre, not
by the premise. Setting, then cast, then structure, then clues, then fair-play audit, then outline,
then prose — that order is a property of mysteries, not an implementation detail we happened to pick.

## Consequences

- **Gates are possible.** Because the next stage is known, a gate between stages can hard-fail on a
  structural defect before spending money downstream. An autonomous agent has no equivalent place to
  stand — there is no "between" in a loop that chooses its own next move.
- **The orchestrator is readable top-to-bottom.** A reader follows one path. REVIEW §4 defends the big
  orchestrator file for exactly this reason; the size is a consequence of the linearity, and the
  linearity is the feature.
- **Errors do not compound.** Each stage's output is validated before the next consumes it, so a defect
  is caught one stage from its cause rather than five.
- **We lose adaptivity.** A premise that would benefit from an unusual order cannot get one. We accept
  this: in ~71 boards, no defect has been traced to the *order* being wrong for a particular premise.
- **Stages are trivially parallelisable where genuinely independent** — see R9's 2b/2c/2d work. That
  optimisation is available *because* the dependency graph is explicit.

## What would change our mind

- A premise class that genuinely needs a different stage order — evidence would be a batch of runs
  failing for order-related reasons, not a hypothetical.
- Orchestrator-worker becoming appropriate: if subtasks stopped being predictable from the genre. The
  test is whether we could still write the stage list down in advance. Today we can.
