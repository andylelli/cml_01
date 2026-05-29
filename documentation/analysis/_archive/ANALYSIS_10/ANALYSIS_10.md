# ANALYSIS_10 - Prose Generation Deep Dive (First-Attempt Pass Target)

Run ID: mystery-1778409707905  
Date: 2026-05-10  
Execution command: npm run canary:core  
Outcome: FAIL (Agent9 prose abort at Chapter 3 after retry exhaustion)

## 1. Executive Summary

Agent9 is failing because three pressure systems are colliding in the same chapter:

1. Upstream fair-play and clue integrity remain unstable, but the pipeline still proceeds into prose.
2. Chapter pre-commit clue obligations are strict and semantically brittle for some clue phrasings.
3. Template-leakage gates are tripped by repetitive chapter text patterns before clue obligations can converge.

In the latest full core run, Chapter 3 failed all 4 attempts with the same mixed failure family:

- missing clue evidence obligation (clue timing/placement)
- paragraph fingerprint repetition
- high 6-gram overlap (0.96 >= 0.62)

This is a convergence design issue, not a single prompt-quality issue.

## 2. Evidence Snapshot From Latest Run

Primary failure payload from core run output:

- Pipeline failure: Chapter 3 generation failed after 4 attempts.
- Hard issue 1: clue evidence absent
  - Required clue text: "The clock in the central hall shows a time inconsistent with the sun's position."
  - Requirement: include in first 2 paragraphs plus explicit immediate inference paragraph.
- Hard issue 2: template linter repeated long paragraph fingerprint.
- Hard issue 3: n-gram overlap too high (0.96 >= 0.62).

Upstream warning state before prose started (same run):

- Fair-play remained unresolved after retries with critical classes including:
  - Clue Visibility
  - Information Parity
  - Discriminating Test Timing
  - No Withholding
  - Solution Uniqueness
- Pipeline then proceeded with warnings:
  - "Fair-play: 6 non-structural violation(s) remain ... proceeding with prose"

Interpretation:

- Prose generation is receiving unstable clue semantics and timing contracts.
- Agent9 then enforces strict chapter obligations and strict anti-template checks simultaneously.
- Retry attempts are consumed without reaching a state where both constraints pass.

## 3. Code-Level Root Cause Map

### RC1. Upstream instability enters prose phase instead of failing fast

Relevant path:

- apps/worker/src/jobs/agents/agent9-run.ts

Observed behavior:

- Worker allows prose generation even when fair-play remains in critical warning state after retries.

Impact:

- Agent9 receives contradiction-prone or incomplete clue semantics, then is expected to satisfy strict chapter clue obligations immediately.

Why this breaks first-attempt pass:

- First-attempt pass requires high-quality, stable obligations.
- If obligations are unstable upstream, chapter-level prose retries become probabilistic instead of deterministic.

### RC2. Clue obligation gate is semantically strict and phrasing-sensitive

Relevant path:

- packages/prompts-llm/src/agent9-prose.ts
- Function group: validateChapterPreCommitObligations, chapterMentionsRequiredClue, chapterClueAppearsEarly

Observed behavior:

- Required clues are validated via token matching from clue description/pointsTo.
- Early placement checks require clue evidence in first quarter of paragraphs.
- Failure messages enforce strong placement and explicit inference sequencing.

Impact:

- For awkward/abstract clue descriptions (example: "sun's position" phrasing), valid narrative evidence may not match required token set strongly enough.
- This can produce persistent "absent clue evidence" failures even when the narrative is directionally correct.

Why this breaks first-attempt pass:

- Strong positional and lexical constraints raise false-negative risk in otherwise plausible prose.
- That pushes chapters into retries where template gates become more likely to fail.

### RC3. Anti-template gate is sensitive under obligation-heavy prompts

Relevant path:

- packages/prompts-llm/src/agent9-prose.ts
- Linter section: paragraph fingerprint + n-gram overlap
- Config path: apps/worker/config/generation-params.yaml
  - paragraph_fingerprint_min_chars: 170
  - ngram.overlap_threshold: 0.62
  - ngram.gram_size: 6

Observed behavior:

- Chapter 3 hit repeated fingerprint and extreme overlap (0.96) during retries.

Impact:

- Retries become trapped: trying to satisfy strict clue obligations while avoiding repeated phrasing under a low overlap threshold.

Why this breaks first-attempt pass:

- The model converges on similar local structures while chasing hard clue constraints, so linter failures reoccur.

### RC4. Retry strategy does not isolate mixed-failure batches effectively

Relevant path:

- packages/prompts-llm/src/retry-protocol.ts

Observed behavior:

- A dominant failure class is selected, but Chapter 3 exhibits a mixed failure set (clue_timing + template).

Impact:

- Single-class retry guidance can under-correct one side while over-correcting the other.

Why this breaks first-attempt pass:

- Mixed-failure batches need dual-path mitigation, not winner-take-all class routing.

## 4. Why "Each Chapter First Time" Is Not Happening

The current system still optimizes for eventual convergence, not first-attempt convergence.

Current reality:

1. Upstream clue contract may be unresolved but prose still starts.
2. Agent9 enforces high strictness at chapter gate.
3. Retry loop re-prompts under compounded constraints.
4. Template checks fail before clue obligation quality stabilizes.

Therefore first-attempt pass rate collapses on obligation-heavy chapters.

## 5. Prevention-First Remediation Plan (Pass Each Chapter First Attempt)

### P0 (Immediate): Block prose on unresolved fair-play critical classes

Change:

- In worker orchestration, fail/repair upstream instead of proceeding when critical fair-play classes remain that directly affect clue timing/visibility/withholding.

Success condition:

- Agent9 starts only with stable clue semantics and placement contracts.

### P1 (Immediate): Normalize clue obligations into canonical, prose-realizable anchors

Change:

- Derive a canonical "observable anchor" per required clue (short, concrete, scene-realizable) and validate against anchor families, not brittle raw sentence phrasing.
- Preserve strict sequencing (observation before inference) but reduce lexical fragility.

Success condition:

- Chapter clue gate passes on semantically correct prose without requiring near-verbatim token distribution.

### P2 (Immediate): Add mixed-failure retry packet for clue_timing + template

Change:

- When both classes fire, enforce a two-lane mitigation packet:
  1. keep clue anchors fixed and explicit,
  2. force lexical/structural diversification (sentence skeleton rewrite constraints) in the same attempt.

Success condition:

- Retry attempts materially diverge while retaining clue obligations.

### P3 (Short-term): Early-chapter anti-template calibration under hard clue obligations

Change:

- Use chapter-phase-aware overlap thresholds or temporary guardrails for chapters with mandatory early clue injections.
- Keep strict threshold in later chapters where narrative texture can vary more freely.

Success condition:

- No false-positive template blocks in clue-heavy early chapters.

### P4 (Short-term): Add first-attempt pass telemetry as a hard KPI

Change:

- Emit per-chapter first_attempt_pass boolean and batch failure-class vectors.
- Track chapter-level first-attempt pass rate in canary summary.

Success condition:

- Regression surface is measurable and enforceable.

## 6. Verification Gates For This Analysis

Required checks after remediation:

1. Full core run completes without Agent9 retry exhaustion.
2. Chapter first-attempt pass rate target:
   - core canary: 100% (all chapters pass attempt 1)
   - broader runs: >= 95% initial target, then tighten.
3. No chapter fails simultaneously on clue obligation absence and template overlap after P1+P2.
4. Fair-play critical classes tied to clue timing/visibility are zero before prose begins.

## 7. Concrete Next Implementation Slice

1. Add worker pre-prose blocker for unresolved fair-play critical classes that map to clue timing/visibility/withholding.
2. Add clue canonical-anchor normalization in Agent9 chapter obligation validation.
3. Add mixed-failure retry packet behavior in retry protocol.
4. Add chapter first-attempt KPI to run diagnostics and canary rollup.

## 8. Final Assessment

The latest failure is not random model drift. It is deterministic friction between unstable upstream clue contracts, strict chapter clue gates, and strict anti-template gates. To achieve first-attempt chapter passes, the pipeline must prevent unstable obligations from reaching prose and must validate clue realization semantically rather than via brittle phrase-token matching.