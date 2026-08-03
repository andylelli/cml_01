# 0001 — CML is the single source of truth; prose is a rendering

**Status:** Accepted · **Decided:** pre-A_40, reaffirmed continuously

## Context

A mystery has two representations: the *structure* (who did it, with what, when, which clue proves
it, which suspect is cleared by which alibi) and the *prose* (the story a reader reads). Both have to
be internally consistent, and the structure has to be recoverable from the prose or the mystery is
not fair-play.

An LLM asked to write a mystery directly will produce prose that reads well and whose logic does not
close. It will invent a clue in chapter 9 that contradicts chapter 3, clear a suspect it never
implicated, or name a culprit whose alibi it forgot to break. These are not prose defects; they are
structural defects that only become visible once you try to verify the story.

## Decision

**CML (the Case Markup Language document) is the single source of truth. Prose is a rendering of it.**

Structure is generated, validated, and frozen *before* any prose exists. Agents 1–7 produce and check
CML. Agent 9 renders it. Every downstream check asks "does the prose faithfully render the CML?",
never "is the prose self-consistent?" — the latter is unanswerable without a reference.

## Consequences

- **Fair play is checkable.** Agent 6 can audit clue sufficiency against a structure, deterministically,
  before a word of prose is written. That is not possible if the structure only exists in the prose.
- **Defects get a definite location.** A contradiction is either a CML defect (structure wrong) or a
  rendering defect (prose failed to convey correct structure). Every validator in the pipeline sits on
  one side of that line, which is why they can be small.
- **Prose cannot introduce facts.** This is the constraint behind "no new facts" in the prose prompt,
  and behind the leakage detectors. It also constrains quality: the prose cannot improvise its way to a
  better story, because a better story would be a different CML.
- **The cost is front-loaded.** Roughly two thirds of the pipeline runs before any prose exists. A run
  that dies at Agent 9 has spent most of its money on structure — which is precisely why durable
  resume ([R5](../REVIEW_01.md)) is worth building rather than restarting from stage 1.
- **We inherit a rendering problem.** Prose that is *correct* is not automatically prose that is
  *good*. Every craft board since A_57 has been working on that gap, and it exists because we chose
  correctness-first.

## What would change our mind

- If a frontier model could be shown, on a matched set, to produce **structurally sound** mysteries
  directly from a premise — verified by the same Agent 6 audit — the structure-first pipeline would be
  buying consistency we no longer need to buy.
- If the rendering gap proved unclosable: if prose generated from a frozen structure has a quality
  ceiling that free generation does not, and that ceiling sits below what readers accept. Ten boards
  of craft work say we are still climbing, not stuck.
