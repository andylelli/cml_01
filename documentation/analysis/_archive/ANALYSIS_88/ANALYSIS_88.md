# ANALYSIS_88 — A sentence splitter re-punctuated 46% of the prose

**Date** 2026-09-11 · **Cost** £0 · **Method** the shipped splitter replayed over the 3,392 paragraphs
in the stored prose archive, plus `logs/llm-prompts-full.jsonl` to establish what the model actually
wrote. Every count is MEASURED.

---

## 1. The finding

`apps/worker/src/jobs/agents/agent9-run.ts` split sentences with

```ts
.match(/[^.!?
]+[.!?]*/g)
```

A closing quote is not a terminator, so `cooperation.” Her words` splits into `cooperation.` and
`” Her words`. Three callers then rebuild the paragraph with `sentences.join(" ")`, which puts a
space where the model wrote none:

| stage | text |
|---|---|
| model output (every Agent 9 log entry) | `...full cooperation.” Her words hung in the air.` |
| stored artifact, and the RubricScorer | `...full cooperation. ” Her words hung in the air.` |

**MEASURED: the old pattern corrupts 1,573 of 3,392 archived paragraphs (46.4%).** The replacement
corrupts none and alters 5 (0.1%) — all inside the two books whose quotes are already inverted, where
it inserts the missing space *after* an opening quote.

## 2. Why it stayed invisible for the life of the project

1. **The corruption is a fixed point.** Re-splitting an already-corrupted paragraph reproduces it
   exactly, so the naive test — round-trip the archive — reports 0% and looks clean. The defect is
   only visible against text that has not been through the pass yet.
2. **It was diagnosed once and patched at the wrong layer.** `injection-templates.ts:194` records
   *"a space and a CURLY closing quote, put there by a pass that ran after the floor"* and widened the
   detection pattern to tolerate it, rather than finding the pass. That fixed one hard-coded sentence
   and left the other 1,572 paragraphs.
3. **The pass rewrote what it had not changed.** The rebuild at `agent9-run.ts` ran over every
   paragraph in the chapter whether or not a lifecycle repair touched it, so a single name replacement
   in one paragraph re-punctuated the whole chapter. Blast radius was the chapter, not the edit. Also
   fixed here.

## 3. The general rule

**A pass that takes prose apart owns putting it back byte-identically.** Any split/rejoin is a lossy
round-trip unless proven otherwise, and the proof must be run against text that has NOT already been
through the pass — otherwise the corruption certifies itself. The same shape exists in
`sanitizeContinuityTailForPrompt` (`continuity-tail.ts`), which feeds the model a corrupted excerpt of
the previous chapter; it writes no prose, so it is left for now, but it is the same defect.

## 4. What this does NOT claim

No score effect. This is a typographic defect: reader-visible, present in roughly half the paragraphs
of every book, and never mentioned by any of the 58 external reads. Whether removing it moves `prose`
is untested and probably unmeasurable at the rubric's resolution.

## 5. Two other findings from the same sweep

- **`GROUP_A_OPENER_RE` has never fired** — 0 hits across 1,933 chapter openings. A closed list of ten
  exact phrases the model never writes. Widened behind `AGENT9_OPENER_WEATHER_GATE` (default OFF,
  8% fire rate); see the FLAG-AUDIT row for the retry-cost trade.
- **Two more gates are dead by vocabulary**, left in place and documented rather than changed:
  `IMPERATIVE_VERBS` + `STORYTELLING_NOUNS` (`chapter-validator.ts`, 0/223 manuscripts) and
  `AMATEUR_INVESTIGATOR_TERMS` / `OFFICIAL_TAKES_CHARGE_TERMS` (`narrative-continuity-validator.ts`,
  0/223). They guard real risks with words the genre does not use.

## 6. Withdrawn during this work

Three claims were measured, found false, and dropped — each would have read as a finding:

- *"21 named regexes never match any manuscript."* Most are anchored token matchers (`/^(?:s|t|re)$/`)
  applied to a captured word; testing them against whole manuscripts could only ever fail.
- *"Case metadata leaks into prose in 49% of books."* The pattern was matching ordinary spaced
  em-dash prose. The real figure is 2 books, 3 paragraphs.
- *"Call sites disagree on argument count for `buildChapterObligationBlock`."* Production passes all
  14 arguments in the declared order. The off-by-one was in a test harness written earlier the same
  day, not in the pipeline.

---

## 7. THE SECOND BUG, WHICH THE FIRST ONE WAS HOLDING SHUT

Fixing §1 nearly shipped a worse defect. `splitParagraphForStructure` (`sanitization.ts`) chunks a
paragraph with

```ts
/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g
```

which requires whitespace or end-of-string **immediately** after the terminator. A paragraph that
opens with dialogue has a closing quote there, so the alternative fails, the engine advances past the
whole sentence, and nothing ever matches it. The sentence is **silently deleted**, leaving a dangling
quote:

```
IN : “I expect your full cooperation.” Her words hung in the air. He said nothing.
OUT: ” Her words hung in the air. He said nothing.
```

**Measured against the archive as stored: 0% loss.** Measured against the same paragraphs
de-corrupted to the shape the model actually emits: **1,567 of the paragraphs it splits lose or alter
text — 29,933 words.** The §1 defect had put a space in front of every closing quote, and that space
satisfied `(?:\s+|$)`. One bug was holding the other one shut, and removing the first would have
opened the second on the next run.

The replacement ends in `\s*` rather than a required `(?:\s+|$)`, so the pattern always matches and
the worst case is an inserted space rather than a deletion. After the fix: **0 words dropped** across
the archive; 5 paragraphs (0.15%, both inverted-quote books) gain a space.

**The rule:** when a defect is fixed, re-run the measurement that found it against the CORRECTED
input, not the historical artifacts. Archived data has been through the broken code, so it encodes
the bug's assumptions — and any downstream bug that depended on them is invisible until the day the
upstream fix ships. A green result from a corpus the bug produced is not evidence.

---

## 8. A literal control character, three times over

A mis-escaped word boundary leaves a **literal 0x08 backspace** in the regex. It compiles, it is
invisible in review and in most diffs, and the pattern simply never matches. Swept across all 1,636
source files:

| site | consequence |
|---|---|
| `agent5-run.ts` `statesExplicitMeridiem` | **production.** `/<0x08>(am\|pm\|a.m.\|p.m.)<0x08>/i` returns false for every input, so the AM/PM ambiguity violation cannot fire — CONFIRMED, the string appears **0 times in every file in `logs/`** — and the transposition repair's meridiem guard never skips |
| `injector-lifecycle-interaction.test.ts` | **a test that could not fail.** `expect(nameRe.test(s) && DEATH_RE.test(s)).toBe(false)` where both regexes were `/<0x08>…<0x08>/` — `false && false` is always `false`. Corrected; it passes for real now |
| `case-time-arithmetic-x61.test.ts` | in a comment; harmless |

Three remaining control characters (U+0001, U+0002 in `anti-copy.ts` and `agent5-run.ts`) are
deliberate join delimiters — chosen because they cannot occur in prose — and were left alone.

`clearance-vocabulary-parity.test.ts` now asserts that no regex in the shared clearance vocabulary
carries a control character. The corrected meridiem predicate is behind `AGENT5_MERIDIEM_CHECK`,
default OFF, because it switches a never-fired VIOLATION live and a violation can block a run.

**The rule:** a regex that never matches is indistinguishable from a condition that never occurs. The
only way to tell them apart is a known-positive — and this project has now been bitten by that
distinction in `GROUP_A_OPENER_RE`, `AGENT9_DT_THEORY_VOCABULARY`, `statesExplicitMeridiem` and the
CML scene-ref join.

## 9. The clearance repair's private vocabulary

`deterministic-repair.ts:72` read *"A_73 §11.1 — single-sourced; see shared/clearance-vocabulary.ts"*
and line 73 defined its own `CLEARANCE_EVIDENCE_RE` with a different body. A_73 single-sourced
`CLEARANCE_TERMS_RE` and left this one behind, so the comment described a state never reached and
stopped anyone re-checking.

It gates a WRITE — `chapterHasCoLocatedClearance` decides whether a clearance sentence is INJECTED.
The private body carries `which proves` / `constraint` / `observation` and lacks `witness(es)` /
`saw` / `seen` / `account`, which is the vocabulary clearance prose actually uses. MEASURED over the
374 clearance-bearing paragraphs in the archive: **57 (15%)** are accepted by the shared regex and
rejected by the repair's, and **zero** go the other way — the three inference words have never once
been the deciding term. Those 57 get machine text pasted on top of a clearance they already had.

Single-sourcing is unconditional and byte-identical; the union is behind
`AGENT9_CLEARANCE_EVIDENCE_UNION`.
