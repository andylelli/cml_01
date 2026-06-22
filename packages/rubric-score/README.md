# @cml/rubric-score

The **Final-Story Rubric Scorer** — the implementation of
[`documentation/14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md`](../../documentation/14_chat-gpt-scoring-alignment/aligning-the-scoring-system.md),
which aligns the pipeline's headline score with the holistic prose rubric in
[`scoring-approach.md`](../../documentation/14_chat-gpt-scoring-alignment/scoring-approach.md).

> Today the headline `overall_score` is the **average of 15 deterministic per-agent artifact scores**
> (process health). The rubric wants one **holistic critic reading the finished story** across ten
> reader-facing categories /100 (product quality). This package is that scorer — **LLM-critic primary,
> checker-gated**: the critic scores the ten subjective categories from the prose, and a deterministic
> cap engine enforces the rubric's hard caps in code, so the number is **reproducible and consistent
> with the story's actual structure** regardless of LLM variance.

This is the doc's **§8.1 increment**: the pure deterministic core, with the LLM judge as an
**injectable seam**. Pure, **no live LLM call, NOT wired into the pipeline** (the aggregator's headline
score is unchanged). Wiring the Azure judge, swapping the headline score, and calibration are gated
next phases.

## What it provides

- **`applyHardCaps(raw, facts): CappedScore`** ([hard-caps.ts](src/hard-caps.ts)) — the heart. After
  the critic scores, this clamps category marks and overall ceilings deterministically per the
  rubric's Hard Caps + Major Penalty Rules (culprit=victim → char ≤2/ending ≤3/overall ≤55; dead
  victim alive → ≤60; pronoun instability → ≤69; template leakage → prose ≤4/overall ≤65; weak murder
  method → ≤75; …), takes the **minimum** when several caps fire, and maps the total to a score band.
- **`extractStoryFacts(cml, prose): StoryFacts`** ([facts.ts](src/facts.ts)) — the *exact* facts,
  readable today from the `CASE` artifact + prose: role collisions (culprit=victim, victim=detective —
  exact), template leakage (via `@cml/prose-guard.detectTemplateLeakage`), victim-unnamed. The
  semantic conditions (dead-victim-alive, reveal-uses-unplanted) are supplied by the judge and merged.
- **`scoreStory({ prose, cml, judge })`** ([score.ts](src/score.ts)) — the orchestration: extract
  facts → ask the **injectable** critic to score the prose (told the verified facts) → enforce the
  caps. The number the pipeline ships is `final`.
- **The rubric prompt + structured-output schema** ([prompt.ts](src/prompt.ts), [schema.ts](src/schema.ts))
  — the rubric *is* the system prompt (start-at-5, every mark cites a reason); the schema mirrors the
  Output Format so the judge returns schema-valid JSON.
- **`detectTemplateLeakage`** added to `@cml/prose-guard` (the leak family) — fires on the rubric's
  exact validation-text artifacts ("The chapter moves forward through…", "the doctor Finch", …).

## The gate-inversion (what makes this worth doing)

A test asserts the §"How to Score Overall" rule deterministically: a story the critic scored in the
**90s** but with an accidental **culprit = victim** collision is **capped to ≤55** — the right
calibration band — because the cap engine enforces it from the CASE fact, not the critic's goodwill.
*A brilliant mechanism with broken character continuity cannot score highly overall* (the rubric's
closing principle), guaranteed in code.

## Tests (19)

- **Bands** map totals to the calibration labels.
- **Every hard cap** fires correctly (culprit=victim, dead-victim-alive [+culprit], victim=investigator,
  pronoun instability, template leakage, victim-unnamed, weak murder method, unplanted reveal, ending
  contradiction) and the **minimum** is taken when several fire.
- **`extractStoryFacts`** detects the exact collisions, unnamed victim, and leakage from a CASE + prose.
- **`scoreStory`** with a stub judge: a clean story ships ~80; the deterministic extractor **overrides
  a generous judge** (leakage caps Prose ≤4 even if the judge gave 10); judge-supplied semantic flags
  merge into the caps.

```bash
npm run -w @cml/rubric-score test         # vitest (19 tests)
npm run -w @cml/rubric-score type-check   # tsc --noEmit
npm run -w @cml/rubric-score build        # tsc → dist/ (gitignored)
```

## What's next (gated — aligning-the-scoring-system.md §8)

1. **Wire the live Azure judge** into `scoreStory` (structured output, low temp, the rubric prompt +
   the full scoring-approach.md appended) — the one non-deterministic part.
2. **Run in shadow** behind `RUBRIC_SCORING_MODE = off|shadow|primary` (default shadow) — log the
   rubric next to today's `overall_score`.
3. **Calibrate** against a labelled ChatGPT/human reference set; tune the prompt + cap thresholds.
4. **Flip to primary** — `overall_score` becomes the rubric; the 15 phase scores become process-health
   telemetry. Feed `fastest_fixes` into the Agent 9 critic.
