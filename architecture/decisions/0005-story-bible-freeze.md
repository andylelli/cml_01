# 0005 — Freeze the Story Bible: dereference, never re-derive

**Status:** Accepted · **Decided:** A_61 RC-2 era (`AGENT9_BIBLE_AUTHORITATIVE`) · **Ratified:** 2026-08-06 (owner)

## Context

Agent 9 needs many derived facts: each character's pronouns, the locked-fact values that must appear
verbatim, which culprit is under embargo in which chapter, the beat sheet. Each of these can be
*computed* from the CML — and originally each consumer computed its own.

That is a correctness trap with a specific shape. Two call sites deriving "the culprit's pronouns"
from the same CML will agree until one of them is fixed. Then they disagree, silently, and the
disagreement surfaces as a prose defect several stages away from either derivation. The A_66 pronoun
war was exactly this: one concept, three bodies, across two packages.

## Decision

**Derive once, into a frozen Story Bible. Every consumer dereferences it; nobody re-derives.**

The Bible is built after the structure is settled and before prose begins. From that point it is
read-only. `regen-integration.ts` states the contract explicitly: a `ProseDefect` becomes a
fully-constrained `RegenRequest` by *dereferencing* the Bible — pronouns from identity, locked-fact
values, culprit embargo from the chapter beat — "nothing re-derived."

## Consequences

- **A derivation bug has one body.** Fix the Bible builder and every consumer is fixed. This is the
  single most valuable property, given the defect history.
- **Provenance is real.** REVIEW §5 (Gap 5) rates Agent 9 well on provenance specifically because of
  this: any fact in a prompt can be traced to a Bible entry, not to a local computation.
- **Disagreement becomes impossible rather than unlikely.** Two consumers cannot drift apart if
  neither computes anything.
- **Staleness becomes the new failure mode.** If the structure changes after the freeze, the Bible is
  wrong everywhere at once. This is why the freeze happens after the last structural gate, and why
  Agent 4/6 revisions must precede it.
- **It costs economy.** The whole Bible is carried into every chapter prompt whether the chapter needs
  it or not — REVIEW's Gap 5 criticism. That is a real cost, and the fix is per-chapter slimming, not
  re-derivation.

## What would change our mind

- Nothing about the freeze itself. The pressure is on *scope*: if prompt economy becomes the binding
  constraint, the Bible could be sliced per chapter — but each slice must still be a **projection of
  the one frozen Bible**, never an independent derivation. A "slim Bible" computed separately would
  reintroduce the exact defect this decision exists to prevent.
