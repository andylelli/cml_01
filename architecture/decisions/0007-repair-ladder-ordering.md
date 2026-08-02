# 0007 — The repair ladder: LLM rungs first, deterministic floor last, and the floor stays

**Status:** Accepted · **Decided:** A_57 → A_68, continuously refined

## Context

When a chapter fails an obligation — a required clue absent, a suspect uncleared, the mechanism
explained too early — something has to fix it. There are three kinds of fix, in increasing crudeness
and increasing reliability:

1. **Retry** the chapter with feedback. Highest quality when it works; may not converge.
2. **Scoped regen**: rewrite only the offending region with a targeted instruction and a validator
   that gates acceptance. Good quality, bounded blast radius.
3. **Deterministic injection**: paste a sentence that satisfies the obligation. Always works, reads as
   machine-written.

Reliability and quality run in opposite directions, so ordering is the whole design.

## Decision

**Try in quality order and stop at the first success: retry → scoped regen → deterministic injection.
The deterministic rung always exists and is never removed.**

Each regen pass runs **before** its corresponding injector, so a successful regen makes the injector a
logged no-op. Every rung's firing is recorded, so the ladder's own distribution is measurable.

## Consequences

- **The ladder is correct and bottom-heavy in practice.** REVIEW Gap 4: most obligations still land on
  rung 3, because the rung-2 flags are default-OFF pending probes that cost £4–8 each. The
  architecture is right; the *distribution* is wrong, and it is wrong for a measurement-cost reason
  rather than a craft reason.
- **Regen must be insertion-only where it can be.** A free rewrite once re-gendered existing prose
  (`repair.ts:153`). Insertion passes are guarded by `preserveOriginalParagraphsValidator`; rewrite
  passes need their own fidelity guard. The
  [regen registry](../../packages/prompts-llm/src/agent9-prose/regen-registry.ts) records which family
  each pass belongs to, because misclassifying one removes that guard silently.
- **Every rung needs a validator, or it is not a rung.** A regen that "succeeds" without a check that
  the target obligation is now satisfied is just a rewrite with extra cost.
- **The floor stays** — see ADR-0003. Removing it does not improve prose; it aborts runs.
- **One defect, one repair path.** Twelve passes with the same shape is how a defect quietly acquires a
  second body. S3's registry exists to keep that enumerable.

## What would change our mind

- Ordering: nothing plausible. Quality-first-with-a-reliable-floor is the only order that both ships
  and improves.
- Composition: if a probe showed a regen pass makes prose *worse* than the injector it replaces, that
  pass should be deleted, not left flag-off. `AGENT9_CRITIQUE_REWRITE` is the precedent — it probed
  negative (prose −1.00, rubric −2.0) and its 247 lines were removed.
