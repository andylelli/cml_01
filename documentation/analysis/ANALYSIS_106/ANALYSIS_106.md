# ANALYSIS_106 — The fallback chapter: a redo for one chapter, and the polish that caused them

**2026-09-24.** Every book this month that was fit to read in every other respect was held back by one
fallback chapter. This document covers the two pieces of work that address it. Code comments cite it
as A_106.

---

## §1 THE ONE-CHAPTER REDO

`RESUME_REDO=prose AGENT9_REDO_CHAPTER=N` rewrites one chapter against the run's own Agent 9 checkpoint
and keeps the rest. Built and first used in A_102 §13 (commit 7203e8da): chapter 1 of seed 18179, a
fallback, was rewritten in one attempt, and the book read 86. Registered in `FLAG-AUDIT.md`. Cost: one
chapter plus the post-passes, under £0.15. The kept chapters are not byte-identical — the post-passes
run over the rejoined book — which is fine for a read and a confound for a strict one-chapter pair.

## §2 WHY CHAPTERS FELL BACK: THE POLISH DROPPED QUOTATION MARKS AND NOTHING LOOKED

**The gate.** `lintBatchProse`'s boundary check fails a chapter whose total count of double quotation
marks (straight and curly together) is odd, and the retry loop then asks the model to repair it. Three
failed attempts end in a completion fallback. It fired on chapter 1 of seed 18179's original run and on
chapter 8 in two of three chapter-8 redos (A_102 §15).

**The model did not write the fault.** Every raw chapter draft across the four seed 18179 runs had an
even quote count — 19 of 19. **MEASURED** (`logs/llm.jsonl`, `Agent9-ProseGenerator-Ch*` responses).
The first probe of this reported zero odd drafts and was treated as a claim about the probe until the
responses were shown to parse; they did.

**The post-pass polish did.** It is an LLM line-edit that runs after the draft and before the batch
lint. Comparing each polish output with the draft it received:

| run | chapter | draft quotes | after polish | fell back |
|---|---|---|---|---|
| 18179 original | 3–9 | even | even | — |
| ch8 redo 1 | 8 | 52 | **53** | **yes** |
| ch8 redo 2 | 8 | 60 | 60 | no |
| ch8 redo 3 | 8 | 48 | **47** | **yes** |

**The two chapters the polish unbalanced are exactly the two that fell back. MEASURED.** It also
converts curly quotes to straight ones in rewritten paragraphs.

**Why the damage was accepted.** The polish has its own acceptance check (`validateCandidate` in
`generate.ts`), with a paragraph-level salvage and a whole-chapter rollback behind it. That check runs
the content, obligation and victim-alive tests — **not `lintBatchProse`**, where the boundary gate
lives, and which runs after the polish has been accepted. So a quote-dropping polish passed its own
check, then failed the batch lint, and forced a retry of a chapter the model had written correctly.
This is [[agent9-postprocess-after-validation]] once more.

## §3 THE FIX — ONE FUNCTION, TWO CALLERS

- `lint.ts`: the boundary check is now `findBoundaryIntegrityFindings(paragraphs)`, exported;
  `lintBatchProse` calls it with unchanged behaviour.
- `generate.ts`: the polish's `validateCandidate` calls the same function, so the **existing** salvage
  and rollback revert a quote-dropping polish instead of accepting it.
- `post-pass-polish.ts`: one count the model can obey — the same number of quotation marks per
  paragraph, in the style it was given — so fewer polishes are thrown away.

**Tested on the real outputs:** the shared function flags exactly the two broken polishes and passes
the other eight — **10 of 10 agreement**. Five unit tests, including a fixture shaped on redo 3's
paragraph.

**Live:** a chapter-8 redo with the guard in place (`resume-1790265783874`) had no fallback, quotes
even, the scaffold lines cleared, repetition 17.7 per 10k and a rubric of 75 — the best this book has
had. **The guard was not exercised on that run:** the polish happened not to drop a quote. The
evidence that the guard works is the 10-of-10 check and the rollback path it feeds; the evidence that
it prevents fallbacks at the book level needs more runs than one.

## §4 WHAT THIS DOES NOT CLAIM

- That the boundary gate is now correct. It still counts across the chapter, so the standard
  convention for speech running over several paragraphs — each paragraph opens, only the last closes —
  fails it. None of the 19 drafts above used that convention; if one does, this is the next defect.
- That fallbacks are gone. One other retry happened on the guard's redo, for a reason other than
  quotes, and was recovered by the retry.
