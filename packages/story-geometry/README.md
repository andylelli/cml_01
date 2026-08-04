# @cml/story-geometry

Agent 7.5 — the Story Geometry compiler.

Design: [`architecture/GEOMETRY-AGENT-DESIGN.md`](../../architecture/GEOMETRY-AGENT-DESIGN.md) ·
concept: [`architecture/STORY-GEOMETRY.md`](../../architecture/STORY-GEOMETRY.md) ·
motivation: [`architecture/THINK_01.md`](../../architecture/THINK_01.md)

## What it is

> **Story geometry is the constraint set governing the mapping from case model to manuscript: what
> must appear, where, how often, and what must never recur.**

Todorov's observation, in 1966, was that a detective story is two stories: the crime, which is absent
and complete, and the investigation, which is present and exists to let the reader rebuild the first.
This project has built the first with great care and left the mapping between them unspecified — so
the model invents it, plausibly and differently every run, and the endgame chapters take three
attempts each while the front of the book takes one.

This package is that mapping, written down:

```
StoryGeometry {
  timeModel        { trueTime, apparentTime }     // the manuscript may contain no third time
  clincher         { trace, uniqueToCulprit, plantByChapter, payoffChapter }
  methodSignature  { method, plantChapter: 1, keyTerms }
  chapterContract  [ { chapter, role, mustContain, mustNotContain } ]
  falseSolution    { accused ≠ culprit, proposedChapter, collapseChapter }
  clearanceBudget  { maxSentences, inScene }
  closure          { closed, unmet, waived }
}
```

Three exports do the work:

| Function | When | What it answers |
|---|---|---|
| `deriveStoryGeometry` | after the outline | What must be true of the finished manuscript? |
| `checkGeometryClosure` | same call | Can this outline satisfy that at all? (repair is free here — no prose tokens spent) |
| `checkManuscriptGeometry` | after the manuscript is committed | Did it? |

The third is what makes Agent 7.5 a stage rather than a utility: **it is the only component that
writes its acceptance test before the artefact exists and enforces it after.**

## What it deliberately does not own

- **Prose.** Not one sentence, not one injected clause. `prompt.ts` states obligations in the
  vocabulary of the finished text and stops — a unit test asserts it supplies no quotable copy. The
  moment geometry supplies prose it becomes the injector layer under a new name.
- **Clues.** `@cml/clue-spec` derives which clues must exist. The clincher is *selected* from them.
- **Scene assignment.** `@cml/beat-scheduler` owns the grid, `plant_clue`, and
  `checkPlantBeforeReveal`. Geometry consumes the grid; it never re-derives it.
- **The case.** The CML is frozen upstream and read-only here (ADR-0005).
- **Solvability.** Agent 6 answers "can the reader solve it". Geometry answers "does the manuscript
  deliver it".

## Purity

No runtime dependencies, no LLM, no I/O. Two things it needs but must not own a second copy of are
**injected** rather than reimplemented:

- `timelineViolations` — from `checkCaseTimelineDeception` in `@cml/prompts-llm`.
- `parseClockTime` — required (no default) on `checkManuscriptGeometry`, so the acceptance test and
  the timeline invariant read the clock the same way.

Every function is total: missing or malformed input yields an unmet closure entry or no check at all,
never a throw and never a fabricated violation.
