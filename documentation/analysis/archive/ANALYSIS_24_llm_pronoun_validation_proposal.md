# ANALYSIS_24: Should Pronoun Validation Use an LLM Instead of (or Alongside) Code?

Date: 2026-03-31

## Question Answered

Would it be better to have the LLM read each generated chapter back and validate its own pronouns, rather than relying on the existing code-based `CharacterConsistencyValidator`?

---

## Context: What Triggered This Question

Run `run_fa94c55d` (2026-03-31T17:18) produced:

```
[Agent 9] Batch ch1-2 validation failed (attempt 1/4):
  - Chapter 1: word count below hard floor (859/1040)
  - Chapter 2: weak atmosphere/time grounding
  - Character "Ann Mowbray" has incorrect pronouns. Should use she/her/her but found: he, him
```

The pronoun error was a **false positive**. The LLM's prose was correct. Ann Mowbray was given `she/her` throughout. The validator fired because of this sentence pair:

```
"His defensiveness only served to heighten Ann's suspicions. Why was he so quick to deflect?"
```

- Sentence 1 contains `"Ann"` → validator opens an Ann pronoun check
- Sentence 2 has no character name → gets appended to the context window
- `"he"` found in the combined context
- Competing-entity guard checked sentence 1 only for a named male character — Barry was implied by `"His"` but not named
- Guard returned false → `"he"` was wrongly attributed to Ann

The fix was a **possessive carry-forward guard** in `character-validator.ts`: when the primary sentence starts with a male possessive (`"His..."`) it signals an active male carry-forward subject, suppressing the false positive.

This prompts the broader question of whether code-based validation is the right tool for pronoun checking at all.

---

## Current Pronoun Enforcement Architecture (Three Layers)

The pipeline already has three distinct layers before we reach the question of LLM re-validation:

### Layer 1 — Prompt Engineering (pre-generation)

Every prose batch includes:
- `⛔ ABSOLUTE RULE — CHARACTER NAMES` block listing gender per character (`Ann Mowbray (woman)`)
- `⚠️ GENDER IS NON-NEGOTIABLE` directive
- `PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT` with 8 rules and a 4-column table
- `MANDATORY PRE-OUTPUT CHECK` instruction to re-read every pronoun before outputting
- Checklist message (msg 3) asking the model to self-verify pronouns before submitting

**Status**: Active and comprehensive. However: GPT-4o-mini still drifts on pronouns in ~5–15% of chapters under long-context pressure (ANALYSIS_07). Prompt-only enforcement is insufficient.

### Layer 2 — Deterministic Post-Generation Repair (post-generation, pre-validation)

`repairChapterPronouns()` in `packages/story-validation/src/pronoun-repair.ts`:
- Wired into `agent9-run.ts` at four post-processing call sites (lines 309, 922, 1219, 1242)
- Sentence-level scan: find sentences with exactly one named character, repair wrong-gender pronouns
- Follow-up sentence carry-forward: inherit single character from prior sentence when current has none
- Skips sentences with two or more characters of different genders (ambiguous — by design)
- Handles "her" possessive vs. object disambiguation, case preservation, reflexive pronouns

**Status**: Active and effective for single-character sentences. The main residual gap is **multi-character ambiguous sentences** where two characters of opposite gender appear and the wrong pronoun cannot be unambiguously resolved.

### Layer 3 — Code-Based Validator (post-repair, final check)

`CharacterConsistencyValidator.findIncorrectPronouns()` in `character-validator.ts`:
- Per-sentence scan with 1-sentence lookahead context window
- Competing-entity guard: suppresses false positives when a same-gender character also appears
- Recently extended guards: alias/surname recognition (ANALYSIS_21), possessive carry-forward (ANALYSIS_24 — today)

**Status**: Active. False positive rate is now very low after successive fixes. Genuine errors caught here are the hard cases that slipped through Layer 2.

---

## The LLM Validation Proposal

The idea: after generation, send each chapter to an LLM with the canonical pronoun table and ask it to verify (and optionally repair) any mismatches. This would function as a fourth layer.

### How It Would Work

**Option A — LLM as judge (report only)**
```
System: "You are a pronoun consistency auditor."
User: "Cast: Ann Mowbray (she/her), Barry Mandeville (he/him)...
       Chapter text: [full chapter]
       List every sentence where the wrong pronoun is used for a named character."
```
Output fed back into the retry mechanism if errors are found.

**Option B — LLM as surgical editor (find + fix)**
```
System: "You are a pronoun repair agent."
User: "Cast: [table]
       Chapter text: [full chapter]
       Return the full corrected chapter with only pronoun mismatches fixed."
```
Chapter replaced with corrected version; validation re-run.

**Option C — In-prompt structured self-audit (inline, zero cost)**
Add to the checklist message (msg 3) a structured pronoun audit table requirement:
```
□ Pronoun audit — fill in the table before submitting:
  | Character | Pronouns used in this chapter |
  |-----------|-------------------------------|
  | Ann Mowbray | [list] |
  | Barry Mandeville | [list] |
  ...
  Any entry that doesn't match the canonical table → fix before outputting.
```
No extra LLM call. The model produces a self-audit as part of its output. Stripped before storage (like the `audit` field).

---

## Analysis

### Would LLM validation have caught today's false positive?

Yes. Any model that understands English would correctly parse:
> "His defensiveness only served to heighten Ann's suspicions. Why was he so quick to deflect?"

and report zero pronoun errors for Ann Mowbray. The `"he"` clearly belongs to the implied male subject of `"His defensiveness"`. The code validator could not see this because it operates on patterns, not meaning.

### Would LLM validation catch genuine pronoun errors better than the code validator?

**For single-character sentences**: No — the deterministic repair already handles these before validation runs. By the time the chapter reaches validation, single-character pronoun errors have been repaired. An LLM validator would find nothing to improve.

**For multi-character ambiguous sentences** (the main residual gap): Yes, potentially. An LLM can resolve the referent in sentences like:
> "Frederick turned to Ann as she reached for the glass, and he handed it to her."

The code validator skips this sentence (two characters of opposite gender, ambiguous by design). The LLM would correctly see no errors. And if the model had written:
> "Frederick turned to Ann as he reached for the glass, and she handed it to her."

(wrong pronouns swapped), an LLM judge would catch it. The code validator would also likely catch it (Ann has `"he"` which is wrong for her), but only for the obvious mismatch — the subtle semantic inversion might slip through.

### What are the costs and risks?

| Dimension | Options A/B (post-gen LLM call) | Option C (inline audit) |
|-----------|----------------------------------|------------------------|
| Extra cost | ~1 LLM call per chapter (~$0.002–0.01 each) | Zero |
| Extra latency | +5–15 seconds per chapter | Zero |
| False positives | Different kind — LLM hallucinates an error | Low (model reviews its own output) |
| False negatives | LLM misses an error it wrote | Same as current missed-error rate |
| Determinism | Non-deterministic | Non-deterministic |
| Auditability | Opaque — hard to trace why flag was raised | Output is in the JSON (auditable) |
| Pipeline complexity | New agent type, new call path, new retry integration | One extra JSON field, negligible |

### How does today's error rate justify the investment?

After ANALYSIS_19 (all four repair call sites fixed), ANALYSIS_21 (alias guard + paragraph-boundary reset), and today's fix (possessive carry-forward), the validator's false positive rate is very low. The run history shows:

| Run | Validator results | Root cause |
|-----|------------------|-----------|
| run_fa94c55d (today) | 1 false positive | Possessive carry-forward — fixed today |
| run_2026-03-30T17:15 | 7 errors — genuine | Paragraph-boundary reset — fixed ANALYSIS_21 |
| run_2026-03-29T18:18 | 15 errors — genuine | Missing cast on call-site — fixed ANALYSIS_19 |

The historical genuine error rate has been driven by **implementation bugs in the repair pipeline**, not by the fundamental inadequacy of code-based validation. Each bug, once fixed, eliminated an entire error class and applied permanently to all future runs.

An LLM validator would not have fixed the paragraph-boundary reset bug or the missing cast bug — it would just have caught their symptoms on a per-run basis, requiring costly extra calls on every chapter thereafter.

---

## Recommendation

**Do not add a post-generation LLM validation call for pronouns — yet.**

The current three-layer architecture is now structurally sound. The cost of an extra LLM call per chapter (≈50–100 calls per full story) is not justified given the current error rate after today's validator fix.

**Do implement Option C (inline structured audit).**

The zero-cost path is to add a per-character pronoun audit table to the checklist message (msg 3). The model already has a self-check obligation; requiring it to produce a structured table (stripped before storage, like the `audit` field) forces the model to enumerate pronouns rather than just assert "I checked." This works within the existing prompt budget and pipeline structure.

The table should look like this in msg 3:

```
□ Pronoun audit — before outputting, fill in:
  For each character who appears in your chapters, list every pronoun you used.
  Correct any that do not match the canonical table above.
  Do not include this table in your final JSON output.
```

**Revisit LLM validation if:**
1. Genuine pronoun error rate post-Option-C remains above 1% of chapters
2. Multi-character ambiguous sentences become a documented failure pattern
3. A specific run demonstrates the structural limit of code + repair

---

## Decision Flow Summary

```
Pronoun error in chapter?
│
├── Was it a genuine LLM error?
│     ├── Single-character sentence → should be caught by repair (Layer 2), fix in repair if not
│     └── Multi-character sentence → hard case; LLM judge would help, but rare
│
└── Was it a validator false positive?
      └── Fix the validator (one-time, free, permanent) — NOT add LLM validation (recurring cost)
```

Today's approach was correct: fix the validator. The LLM was innocent.
