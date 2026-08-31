# Workflow findings

Every multi-agent workflow run against this repo, and what it found. **One file per run, never
deleted** — a refuted finding is as useful as a surviving one and costs the same to rediscover.

These runs are expensive (~1.4–1.6M subagent tokens each) and their output is otherwise lost in a
session transcript. This directory is the durable record.

## Index

| # | workflow | date | agents | outcome |
|---|---|---|---|---|
| [WF-001](WF-001-ch910-root-cause.md) | ch9/ch10 root cause | 2026-08-30 | 10 | **Root cause found.** The suspect roll-call was ORDERED in ch8/ch9/ch10 (172 prompts, never ch1–7) and a lint gate regenerated any chapter omitting it. Cause of the cause: CML and outline number scenes incompatibly, so only 1 of 116 coordinate refs ever matched and exclusivity fell through to keyword matching. 4 fixes built. |
| [WF-002](WF-002-boundary-audit-abf.md) | boundary audit A/B/F | 2026-08-31 | 13 | **9 findings, 3 survived, 6 refuted.** Caught a same-day regression before a paid run: the clearance trim treated the CULPRIT as clearable on 31/31 books. Established the triage rule — divergence is harmful only where it feeds a WRITE. |

## What these runs established, carried forward

**The triage rule (WF-002).** Divergence between two copies of the same computation is HARMFUL only
where one copy is the sole input to a mutation — a deletion, an injection, a floor that must supply
text. Where it feeds a PROMPT it is absorbed, because the prose prompt layer is redundantly wired.
This predicted all three survivors and all six refutations. Ask *"does the divergent list feed a write
with no second channel behind it?"*, not *"do these two lists disagree?"*

**The systemic cause (WF-002).** Entity sets are recomputed independently at each consumption site
rather than computed once and passed. Nine components compute "who is a suspect"; four compute arc
position. Each copy is locally correct; the defect lives in the gap, which is why it survives code
review.

**The probe rule (WF-001, WF-002, and eight fixture errors on 2026-08-29/30).** A negative result from
a probe you just wrote is a claim about the PROBE until it is shown to work on a known-positive.
Every refuted finding overstated its reach, and multiple probes returned FALSE NULLS from harness
bugs — collapsed escapes, artifact payloads read without unwrapping, a missing parser argument — each
producing exactly the "nothing here" answer the prober was hunting for.

**Boundary, not agent (WF-002).** Slice an audit by data lifecycle, not by agent. `cml` is referenced
by 184 source files, `cast` by 125, `clues` by 105 — artifacts are read far outside the agent that
produced them, and that is where the bugs are.

## Slices not yet run

`E` role and identity (**highest prior**) · `D` time and mechanism · `C` clue lifecycle, narrowed to
identifier joins · `G` flag integrity end-to-end. `H` information loss was assessed and **skipped**,
with its two known instances folded into G.

## Recording rule

When a workflow completes, write its findings here **before acting on them**, as
`WF-NNN-<short-name>.md`, and add a row to the index above. Record:

- run id, date, agent count, subagent tokens, duration, and the script filename
- the question it was asked
- **findings that SURVIVED verification**, with file:line and measured reach
- **findings that were REFUTED, and why** — this is the half that stops the same hypothesis being
  re-bought, and in WF-002 it produced the most valuable output of the run
- what the run could NOT determine
- any expand/skip recommendation for follow-on work

A workflow whose findings are not written down has to be paid for twice.
