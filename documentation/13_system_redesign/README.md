# 14 — ChatGPT Scoring Alignment (placeholder)

> **Placeholder.** This folder is reserved for upcoming work on aligning the pipeline's scoring with
> an external ChatGPT/GPT-based reference. Content TBD.

## Likely scope (to be confirmed)

- Cross-check the internal phase scorers (`packages/story-validation/src/scoring/`) against an
  external GPT judge on a shared sample, and measure agreement.
- Identify where the deterministic/heuristic scores diverge from a human-or-GPT notion of quality
  (echoing the redesign's recurring theme: *judge quality with a critic, check fidelity with a
  checker* — see [`../12_system_redesign/15_agent_9_prose_generator.md`](../12_system_redesign/15_agent_9_prose_generator.md) §4.3
  and [`../12_system_redesign/14_agent_8_novelty_auditor.md`](../12_system_redesign/14_agent_8_novelty_auditor.md) §4.5).
- Define a calibration set and an alignment metric before changing any scorer weights.

## Status

Empty placeholder — no work started. Add documents here as the effort begins.
