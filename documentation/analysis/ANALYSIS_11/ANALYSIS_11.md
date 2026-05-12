# ANALYSIS_11 - Chapter 7 Template Convergence Stall (Latest Core Run)

Run reference: latest local core execution captured in chat session artifact  
Date: 2026-05-10  
Execution command: npm run canary:core  
Outcome: FAIL (Agent9 Chapter 7 retry exhaustion on template gate)

## 1. Executive Summary

The latest run did not fail at final story validation. It failed earlier inside Agent9 chapter generation, at Chapter 7, after exhausting retries on a template-only failure class:

- Template linter high n-gram overlap (0.84 >= 0.62)
- No mixed hard narrative error in the terminal failure payload

This indicates the current retry system still lacks a decisive template-only convergence lane. The system can detect template leakage, but it does not force enough structural divergence quickly enough to break repetition loops within the allowed attempts.

## 2. Evidence Snapshot (From Last Run Output)

Observed in run output tail:

- prose remains undefined at pipeline exit.
- upstream warning persists:
  - Fair-play: 6 non-structural violations remain ... proceeding with prose
- terminal failure:
  - Pipeline failure: Chapter 7 generation failed after 4 attempts
  - Chapter 7 failed validation after 4 attempts
  - Issues: Template linter: high n-gram overlap detected (0.84 >= 0.62)

Notably absent from this terminal failure payload:

- locked_fact_missing_value majors
- pronoun_drift majors/moderates

Interpretation: the active blocker shifted to template non-convergence during chapter retries.

## 3. Code-Level Root Cause Map

### RC1. Template-only retries do not escalate strongly enough, early enough

Relevant paths:

- packages/prompts-llm/src/retry-protocol.ts
- packages/prompts-llm/src/agent9-prose.ts

Current behavior:

- Template failures classify to failureClass=template.
- Deterministic mitigation for template sets freshen_atoms.
- In generation loop, freshen_atoms mainly:
  - adds one lexical refresh guardrail line
  - clears assistant carry-forward context

Gap:

- No hard structural diversification contract is guaranteed for template-only failures.
- No explicit anti-overlap rewrite constraints are injected from measured overlap diagnostics.

### RC2. Linter hard-stop policy is asymmetric (entropy bypass exists, overlap bypass does not)

Relevant path:

- packages/prompts-llm/src/agent9-prose.ts

Current behavior:

- opening-style entropy has an exhaustion bypass path.
- n-gram overlap and paragraph fingerprint remain hard blockers at max attempts.

Impact:

- Chapter can hard-stop even when all non-template obligations are satisfied.
- Retry budget is consumed without a deterministic fallback rewrite path.

### RC3. Upstream warning state still increases repetition pressure downstream

Relevant path:

- apps/worker/src/jobs/mystery-orchestrator.ts (proceeds to prose with non-structural fair-play warnings)

Current behavior:

- pipeline still proceeds to prose despite unresolved fair-play warning cluster.

Impact:

- prose prompt must satisfy heavy obligation density under unstable upstream semantics.
- this increases reuse of safe scaffolds and raises template overlap risk in retries.

## 4. Why This Run Stalled At Chapter 7

The chapter retry loop is still optimized for eventual correction of content violations, but not for hard stylistic divergence under overlap pressure.

Current loop profile in this failure:

1. Chapter 7 triggers template overlap.
2. Retry packet marks template class.
3. Mitigation refreshes atoms/context but does not enforce structural rewrite with measurable anti-overlap guarantees.
4. Linter re-detects high overlap.
5. Attempt budget is exhausted and pipeline aborts.

## 5. Prevention-First Remediation Plan

### P0 (Immediate): Add explicit template-only divergence contract

Change:

- For repeated template class failures, set deterministic mitigation params to include diversifyStructure=true (not only freshenAtoms).
- In prompt assembly, make diversifyStructure mandatory for template-only retries:
  - enforce new paragraph opening forms
  - enforce sentence-length pattern changes
  - enforce altered rhetorical sequence (observation -> interaction -> inference, not prior order)

Success condition:

- consecutive retries are structurally distinct by design, not by chance.

### P1 (Immediate): Inject measured anti-overlap directives

Change:

- When n-gram overlap fails, extract top overlapping n-grams from prior attempt and pass a compact forbidden-phrase list into retry feedback.
- Keep clues/facts fixed, but forbid repeated scaffold strings.

Success condition:

- retry attempts stop reusing the same high-overlap phrase skeletons.

### P2 (Immediate): Add deterministic final-attempt rewrite fallback

Change:

- On final attempt with template-only failure, run one deterministic chapter-local rewrite pass focused on paraphrase + structure reshaping while preserving locked facts and clue obligations.
- Re-run linter once before aborting.

Success condition:

- template-only stalls no longer cause immediate pipeline abort when content validity is otherwise intact.

### P3 (Short-term): Obligation-aware template thresholds

Change:

- apply adaptive n-gram thresholding by chapter position and obligation density (strict later, slightly more tolerant in high-obligation transition chapters).

Success condition:

- reduced false hard-stops without weakening anti-template protections globally.

### P4 (Short-term): Non-convergence telemetry gate

Change:

- emit per-chapter retry class streaks and overlap trend (attempt1..N) in validationDetails.
- add canary alert when same class repeats >=3 for a chapter.

Success condition:

- template stalls become visible before full abort.

## 6. Verification Gates For This Analysis

Required checks after remediation:

1. Full core run does not abort on template-only Chapter 7 retries.
2. For any chapter with template failure, overlap score decreases attempt-to-attempt.
3. No chapter exits with failure when only template issues remain and deterministic fallback has not been attempted.
4. End-to-end run reaches final story validation phase consistently.

## 7. Final Assessment

The latest blocker is now a chapter-level template convergence failure, not a final validation consistency failure. This is progress in failure localization, but the retry contract still needs a stronger, deterministic anti-overlap lane to ensure Chapter 7 type stalls do not terminate otherwise recoverable runs.
