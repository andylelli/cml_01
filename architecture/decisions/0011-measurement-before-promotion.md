# 0011 — Nothing is promoted without measurement — and that includes deletions

**Status:** Accepted · **Decided:** implicit since the corpus era; stated explicitly by · **Ratified:** 2026-08-06 (owner)
[FLAG-AUDIT.md](../FLAG-AUDIT.md) and REVIEW's S7

## Context

ADR-0004 says a change ships flag-off until a probe justifies turning it on. The symmetric case is
less obvious and has bitten harder: **removing** something also changes behaviour, and the argument
for removal is usually a belief rather than a measurement.

Three live examples:

- **S7** proposes deleting ~55 coercion sites once structured outputs make them redundant. "Redundant"
  is a prediction about a schema-constrained model's output.
- **S1** proposes promoting eight flags to default-ON. Promotion flips the *flag-off* path, which is a
  behaviour change on the arm nobody has been running.
- **REVIEW §5.1** asserted 19 unset flags all guard never-executed branches. The audit found four of
  them are default-**ON** and run in every single run. The assertion was confidently wrong.

## Decision

**A deletion or a promotion needs the same evidence as an activation: a counter, a probe, or a
recorded verdict. "It should be redundant now" is not evidence.**

For each class the admissible evidence is specific:

| Change | Evidence |
|---|---|
| Turn a lever ON | N≥4 matched-pair A/B showing the intended effect |
| Promote a flag to default | The same probe, plus the flag-OFF path still passing |
| Delete a coercion site | Its **counter** at zero across several real runs on the relevant arm |
| Delete a pass entirely | A probe with a negative verdict (e.g. `AGENT9_CRITIQUE_REWRITE`: prose −1.00, rubric −2.0) |

## Consequences

- **Counters have to exist before deletions can be argued.** This is why R4 step 4 built per-helper
  coercion counters stamped with the structured-output arm: without them S7 is unfalsifiable.
- **Dead code lives longer than it should.** Accepted. The alternative — deleting on belief — has a
  worse record on this codebase than carrying an unused branch.
- **A negative probe is a *result*, not a failure.** It licenses deletion, which is the cheapest large
  win available. `AGENT9_CRITIQUE_REWRITE` is the model case: probed negative, 247 lines removed, plus
  its tests and one dimension of the interaction space.
- **Audits are worth doing for their corrections alone.** FLAG-AUDIT's most valuable output was not the
  register; it was discovering that the document commissioning it had the facts wrong.

## What would change our mind

- Cheap measurement (R6) does not relax this rule — it removes the excuse for breaking it.
- A genuinely unreachable code path (no caller, no export, no flag) can be deleted on the compiler's
  evidence alone. `@cml/utils` — one line, zero importers — qualified. Almost nothing else does.
