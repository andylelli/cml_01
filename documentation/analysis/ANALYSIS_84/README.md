# ANALYSIS_84 — Agent 9: what stands between the reader and a 9

**Date** 2026-09-07 · **Cost** £0 · **Method** the last ten external reads' own words, traced to the
Agent 9 source line that wrote each one, then measured over the 29 post-X70 manuscripts, the 25
post-X70 run reports and the 39 stored prose artifacts. Every count below was produced by running the
built code or reading the runs' own warnings; nothing is inferred from source alone.

---

## 0. The answer in one paragraph

The two categories that hold the book under 90 are **prose (mean 5.9, never above 7)** and **ending
(mean 6.6)**. Read the ten reviews and the reviewer names the exact sentences responsible, and they
are the same sentences every time: *"It had taken forty minutes in all"*, *"The clocks put it at…"*,
*"…had passed before it was done"*, and the book's final line *"You did it." … said nothing, and the
proof on the table said the rest.* **Every one of those is a deterministic injector template in Agent
9's own code.** The model did not write them. They are written by floors that exist to guarantee an
obligation, and MEASURED: the locked-fact floor fired **95 times post-X70 and 95 of 95 inject a value
the book already states verbatim elsewhere**; the culprit-evidence floor ends 6 books on its template
and in **5 of the 6 the culprit had already confessed on the page** but not in the floor's vocabulary.
The LLM passes designed to make those floors "rare" lose almost every time — culprit regen **0 of 18**,
aftermath-repeat regen **0 of 22** — and the ship-check that would catch the ending runs **before** the
three passes that can still move it. So the prose mark is set by our injectors, and the ending mark by
our checker's vocabulary and our pass order. Both are fixable in Agent 9 without touching the model.

---

## 1. What the reviewer says, ten reads running

| category | mean | max | the complaint, in the reviewer's words |
|---|---|---|---|
| prose | 5.9 | 7 | "generated/scaffold lines remain" — **10 of 10 reads** |
| ending | 6.6 | 8 | "Chapter 10 ends with reveal residue", "Ch. 10 redoes the accusation" — 8 of 10 |
| clues | 6.5 | 8 | "timing wobbles / clock logic muddy" — 7 of 10 (Agent 3/3b; A_83, T2/T3) |
| dialogue | 6.8 | 8 | "repeated catchphrases feel artificial" — older reads (A_82 §12.4: the tic is ours) |

The reviewer's "scaffold" lists across the last four reads, verbatim, with the line of code that emits each:

| quoted by the reviewer | emitted by | post-X70 books (n=29) |
|---|---|---|
| *"It had taken … in all."* | `DURATION_VARIANTS[0]`, agent9-run.ts | **17** |
| *"… had passed before it was done."* | `DURATION_VARIANTS[1]` | **16** |
| *"The clocks put it at …"* | `TIME_VARIANTS[2]` | **15** |
| *"It was … by the mantel clock."* | `TIME_VARIANTS[0]` | **14** |
| *"By then it was …"* | `TIME_VARIANTS[1]` | 10 |
| *"Measured out, it ran to …"* | `LENGTH_VARIANTS[1]` | 1 |
| *"You did it." … said nothing, and the proof on the table said the rest.* | `buildCulpritEvidenceSentenceInScene`, injection-templates.ts:77 | **6 — and in 6 of 6 it is the last line of the book** |
| *"… set out one competing theory against the other …"* | deterministic-repair.ts:485 | 3 |
| *"Nobody in the room could unsee what had just happened."* | deterministic-repair.ts:500 | 3 |
| *"That detail turned the logic stacked against the rest …"* | injection-templates.ts (clue inference) | 2 |

Nothing on the reviewer's list is the model's prose. One line the reviewer quoted in read 0738 is
(*"You did it." The words hung between them*) — and `detectFinalChapterVerdictEnding`'s docblock already
records that instance as model-authored. The other eleven are ours.

---

## 2. The locked-fact floor — 95 of 95 redundant

`enforceLockedFactValuePresence` (agent9-run.ts:2262) injects a template sentence into any chapter that
mentions two or more tokens of a locked fact's description but does not contain the value verbatim,
up to `MAX_INJECTIONS_PER_FACT = 2` per fact. It runs unconditionally at :6218 and again inside the
rescue path at :6766.

MEASURED over the 29 post-X70 manuscripts: **95 template sentences shipped. For 95 of them, the same
value already appears verbatim elsewhere in the book.** Zero were genuinely absent; zero were near-miss
forms. The floor never once supplied a value the reader did not already have.

### 2.1 Why — the regen and the floor use different scopes

The design (Ledger Item 15, agent9-run.ts:6160) is LLM-first: `runInsertionRegenPass` surfaces a missing
value in-scene, and the injector is "a rare floor". But the two disagree about what "missing" means:

```ts
// regen, :6172 — BOOK scope
if (chapterTextsLf.some((t) => t.includes(canonical.toLowerCase()))) continue; // already on the page

// injector, enforceLockedFactValuePresence — CHAPTER scope
if (chapterTextLower.includes(canonical.toLowerCase())) continue;
```

The regen judges the book compliant and stands down; the injector then judges each chapter alone and
fires. This is the WF-002 divergence shape exactly — two components computing "is the value present"
at different scopes, where one is the sole input to a WRITE — and it is why the "rare floor" fires
three times per book.

When the regen does engage (the value is absent from the whole book), it loses **12 of 16** times, and
10 of those 12 are `modified_or_dropped_original_paragraph` — the paragraph-preservation guard
rejecting the candidate because the model touched a word of an existing paragraph while inserting.

### 2.2 The pass that could fix it never sees it

`buildPostPassPolishPrompt` (post-pass-polish.ts:148) tells the model, as item 4 of five: *"SPEC TEXT
WEARING A SENTENCE. A computed value or measurement set down bare, as though copied from a
specification … Keep the number exactly; give it to a character to notice, doubt, or argue about."*
That is a description of `TIME_VARIANTS`. But `polishPassingChapter` is called inside `generateProse`
(generate.ts:3391), per chapter, during generation — and `enforceLockedFactValuePresence` runs in
`runAgent9` at :6218, after `generateProse` returns at :4987. **The polish runs before the sentences it
was written to remove exist.**

---

## 3. The ending — a vocabulary gate, a lost regen, and a check that runs too early

### 3.1 The floor fires on books that already confessed

`enforceCulpritEvidencePresence` injects `buildCulpritEvidenceSentenceInScene` when no chapter
satisfies `culpritEvidenceLinkInText` (regen-integration.ts:1239): the culprit's name **and** a word
from `/(culprits?|killers?|murderers?|responsible|did\s+it)/` **and** a word from
`/(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)/`, all in
one chapter.

Strip the injected sentence from the six books that carry it and re-run the real predicate: **5 of 6
still fail it — and all 6 contain confession language beside the culprit's surname in an earlier
chapter** (ch8 in four of them). Desmond "confesses to striking Clarissa with the candlestick"
(reviewer, 2035); the predicate does not see *struck* or *candlestick*. A dramatised confession fails a
vocabulary gate, and the gate's floor writes an undramatised one after it.

The same disease one layer up: geometry's `reveal_culprit_not_named` fires on **9 of 25 (36%)** post-X70
reveal chapters. On run 1242 it flagged ch8 — the chapter the reviewer scored the reveal 7/10 on — because
ch8 contains **zero sentences** with the culprit's name and a guilt word together. The reveal-repair
regen then "did not improve (score 400, was 400)", and the floor fired into ch10.

### 3.2 The LLM path loses 18 of 18

`runCulpritEvidenceRegenPass` post-X70: **0 linked, 18 UNRESOLVED.** 14 of the 18 are
`modified_or_dropped_original_paragraph` — the insertion-only guard (regen-integration.ts:256) rejecting
the candidate whole. The guard's own docblock (A_73 §4.2) already names this outcome: *"Four paid calls
… died here rather than to the thing they were sent to fix, and then the deterministic injector pasted
the template prose the reader complains about."* That was written as a diagnosis on 2026-08-23. It is
now the steady state.

### 3.3 The check runs before the movers

`AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH` (commit 9a531690, 2026-09-04 21:04) puts the sentence one
paragraph before the end. Run 1242 (2026-09-05 11:26, after the flag) still ships it in the **last**
paragraph — appended into the "Harmony" paragraph, which was second-to-last at injection time and is
last in the artifact. Something after the injector removed the final paragraph.

The order in `runAgent9`, by line:

    6456  enforceCulpritEvidencePresence        (injects)
    6570  detectFinalChapterVerdictEnding       (SHIP-CHECK — looks, warns)
    6740  deterministic rescue                  (re-runs all four injectors)  <- ran on 1242
    7602  aftermath-repeat regen                (rewrites aftermath chapters)
    8342  full-story diagnostic                 (rewrites chapters by candidate) <- applied 3 findings on 1242

SHIP-CHECK looks at chapter 10 and then three passes that can rewrite chapter 10 run. MEASURED: it fired
**once** post-X70 while **six** books end on the template. Which of the three moved 1242's paragraph is
not proven; that all three run after the check is.

### 3.4 Chapter 9 repeats because two authorities disagree about where the reveal is

Geometry derives one reveal chapter and binds every chapter after it as `aftermath`
(`mustNotContain`: a re-staged confession). Agent 7 independently places a `revelation` beat. MEASURED
over 25 post-X70 runs with both artifacts: **geometry's reveal chapter ≠ Agent 7's first `revelation`
scene in 24 of 25.** Geometry says ch8 with aftermath [9, 10]; Agent 7 says sc9 or sc10 — and in **10 of
25 outlines (40%) Agent 7 schedules two accusing/reveal-shaped jobs in the last three scenes.**

So chapter 9 is written to Agent 7's *"Confront Desmond Jardine … reveal him as the culprit"*, then
judged by geometry's aftermath contract, then sent to `runAftermathRepeatRegenPass` — which post-X70 is
**0 repaired of 22**, 20 of them "did not improve". The reviewer reads what was left: *"Chapter 8
reveals, Chapter 9 reveals again, Chapter 10 ends with reveal residue."* This half is an Agent 7 / geometry
contract defect that Agent 9 pays for; it is recorded here because Agent 9's repair traffic is where it
surfaces.

---

## 4. What to change — ordered by mark ÷ risk, all inside Agent 9

**F1 — Give the locked-fact injector the regen's scope.** One condition: `if (any chapter contains the
value) continue`. MEASURED effect: **95 → 0** template sentences on the post-X70 corpus, no value lost
(all 95 present elsewhere). This removes four of the six items on every reviewer's scaffold list. Flag
it (`AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE`), default ON after one read, because the measured downside is
nil. Risk: a value the case needs *in a specific chapter* is no longer forced there; the regen already
behaves this way and the reviewer has never once complained a value was absent.

**F2 — Run the ship-check last, and make it act.** Move `detectFinalChapterVerdictEnding` after the
diagnostic (:8342). When it fires and the offending sentence matches an injector template, strip the
template — ADR-0003 is not violated, because the obligation it served was satisfied elsewhere in 5 of
6 measured cases and the strip can be conditioned on `culpritEvidenceLinkInText` passing in another
chapter. Where it does not pass, leave the sentence and warn, as today.

**F3 — Widen the two culprit vocabularies to what a confession actually contains.** Add the case's own
`death_method` verbs and the first-person forms (`I struck`, `I killed`, `I put`, `I took`) to
`CULPRIT_TERMS_RE`, and let geometry's disclosure test accept name-in-attribution + guilt-in-dialogue
across the paragraph (X34 started this; 36% still fail). Cheap, deterministic, and it stops the floor
firing on books that already confessed. Baseline the new regex against the 29 books before wiring
(the 6-gram lesson: a gate is measured before it gates).

**F4 — Let the polish see the injections.** Either run one polish pass over the chapters the injector
touched, after :6218, or route locked-fact surfacing through polish instead of a template. The polish
prompt already contains the instruction; only the order is wrong.

**F5 — Stop spending on the two regens until their guards are re-scoped.** 0/18 and 0/22 with the
paragraph-preservation guard as the leading cause. Options: allow a *single* paragraph to be modified
when the obligation lands in it, or give the guard the book-scoped locked-fact check the aftermath pass
already got on 2026-09-04. Measure success rate on the next run; below 3 of 10, turn them off — they
are cost with no output.

**F6 — Reconcile geometry's reveal with Agent 7's revelation beat** — one authority. Either Agent 7
receives geometry's reveal chapter as an input and may not place `revelation` elsewhere, or geometry
derives its reveal from Agent 7's beat. 24/25 disagree today; this is the ch9 repeat at source. Owned
by Agent 7 / geometry, listed here so it is not lost.

**Not recommended:** another injector template, another prohibition in the prompt, or another
detector. Three of the six reviewer-named lines were added *as fixes for earlier reviewer-named lines*.

---

## 5. What this could NOT determine

- Which of the three late passes moved 1242's injected sentence into the final paragraph.
- Whether F1 costs a chapter-level obligation that some future reviewer would notice; no reviewer has
  yet complained that a locked value was missing, only that it was stated like a machine.
- Whether the 9+ is reachable by these alone. The arithmetic (A_75, five-categories memory) says prose
  and ending each need a mark never yet given; removing our own sentences from the page is the first
  change that addresses the reviewer's stated reason for both.
