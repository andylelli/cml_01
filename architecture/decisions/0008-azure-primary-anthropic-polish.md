# 0008 — Azure OpenAI as the primary provider; Anthropic for the polish pass

**Status:** Accepted · **Decided:** A_71 (`AGENT9_POLISH_PROVIDER=anthropic`) · **Ratified:** 2026-08-06 (owner)

## Context

The pipeline makes ~40 LLM calls per run across stages with very different requirements. Structural
stages need schema-shaped output, high throughput, and low cost per call. The final polish pass is a
line-edit over finished prose: one call, high stakes, and the quality of the model's *prose judgement*
is the entire value.

Those are different jobs, and the best model for each is not obviously the same model.

## Decision

**Azure OpenAI is the primary provider for the pipeline. The Agent 9 polish pass may run on Anthropic,
selected by `AGENT9_POLISH_PROVIDER`.**

`AGENT9_MODEL_POLISH` (Azure tier) and `AGENT9_POLISH_PROVIDER` (Azure vs Anthropic) are **orthogonal
axes**, not one superseding the other — REVIEW §5.1 got this wrong and
[FLAG-AUDIT.md](../FLAG-AUDIT.md) corrected it.

## Consequences

- **The client layer must stay provider-agnostic at the call site.** `polish-provider.ts` exists to keep
  the choice from leaking into the prose logic.
- **Structured outputs are available where they matter.** Azure supports `json_schema` with
  `strict: true` on gpt-4.1, which is what R3/R4 build on. No provider switch is needed for that —
  an earlier draft of the review implied otherwise.
- **Cost accounting has to span two providers.** `llm-prompts-full.jsonl` is the single audit source
  precisely because it is written at the client layer, below the provider split.
- **The polish arm has never been A/B'd against the Azure path.** It is in FLAG-AUDIT as DEFER with R6
  named as the blocker. Choosing Anthropic for polish is currently a *judgement*, not a measurement —
  which ADR-0011 says is exactly the kind of claim that needs one.
- **Two providers means two failure modes.** Rate limits, content filters and outage behaviour differ.
  The content-filter tracker counts refusals per provider for this reason.

## What would change our mind

- The A/B that has not been run. If Azure polish matches Anthropic polish on a matched set, the second
  provider is complexity with no return and should go.
- If a single provider offered both schema-constrained decoding and the better line-edit, the split
  would lose its justification.
