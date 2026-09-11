# ANALYSIS_87 — The scene coordinate that has never once resolved

**Date** 2026-09-11 · **Cost** £0 · **Method** the real matcher from `dist`, replayed over all 45
stored (cml, outline) pairs, plus the prompt log of run `mystery-1789140940497`. Every count is
MEASURED by running the shipped code, not by reading it.

---

## 0. The answer in one paragraph

Run 3252 (84/100, our first spatial read) lost its **entire reveal contract** — five obligations,
four of them pre-existing and load-bearing — and the external reader's three main complaints are
exactly what a reveal chapter with no reveal obligations produces. The cause is not that run. Agent 3
names the reveal scene as `act_number: 3, scene_number: 6` in **45 of 45 archived runs**, because
that pair is the worked example in its own prompt and the hard-coded default in its own code. Read as
a global scene number it would resolve **45 times out of 45**; read with the act check the matcher
actually applies, it resolves **0 times out of 45**. So the coordinate system joining Agent 3 to
Agent 7 has never worked, every chapter contract in Agent 9 has been assigned by a **keyword
fallback** for the life of the project, and on **24% of runs** that fallback hands the reveal chapter
to the discriminating-test contract and the reveal obligations are emitted nowhere at all.

The defect is not the constant. It is that a cross-agent reference had no referential integrity
check, and its failure had a silent fallback — so a broken join was indistinguishable from a working
one for 45 runs.

---

## 1. What was seen

`read-20260911-1701`, **84/100**, the first spatial book ever read. Its three substantive complaints:

> *"Chapter 8 repeats itself after the confession… Once Quentin confesses, stop proving."*
> *"Chapter 9 also partially repeats Chapter 8."*
> *"Timing/location needs a clean sentence… 'The shadow did not change the hour. It changed the place.'"*

The third is, almost word for word, the sentence `AGENT9_REVEAL_DECEPTION_PURPOSE` was built to
produce five days ago. It reached **0 prompts**. Chasing that found the rest.

---

## 2. The mechanism, verified step by step

MEASURED on `mystery-1789140940497` against `logs/llm-prompts-full.jsonl`:

| obligation | prompts carrying it |
|---|---|
| `CULPRIT REVELATION REQUIRED` | **0** |
| `EVIDENCE CHAIN REQUIRED` | **0** |
| `KILL STATEMENT REQUIRED` | **0** |
| `THE DEDUCTION MUST BE WALKED` | **0** |
| `DECEPTION'S PURPOSE` (new) | **0** |

Not one. The chain:

1. The case **does** carry `culprit_revelation_scene: {act_number: 3, scene_number: 6}`. This is not
   a missing-field defect.
2. Agent 7's outline for this run is `3/4/3` — act 3 holds global scenes **8, 9, 10**, per-act **1, 2,
   3**. `scene_number: 6` matches neither numbering.
3. `sceneMatchesCmlSceneRef` (clue-validation.ts:103) returns false on the act check for every scene
   outside act 3, then falls through to its `signalPattern` argument.
4. The same mismatch afflicts `discriminating_test_scene` (act 3, scene 4), so `dtHasExactMatch` is
   false and **the DT keyword fallback applies to every scene in the book**.
5. `DT_SIGNAL_RE = /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i` matches **5
   of the 10 scenes**, including both `revelation` beats — scene 10, *"Confronting Quentin
   Everleigh"*, matches on the word **discriminating**.
6. `isRevealChapter = !isDiscriminatingTestChapter && …`, so the real reveal chapter was claimed as
   the discriminating-test chapter and the reveal block never executed.

The reveal chapter received no instruction to name the culprit, walk the deduction, state the kill,
or close in scene. The reviewer then reported a chapter that re-proves after the confession.

---

## 3. THE MEASUREMENT — it was never working

Replaying the shipped `sceneMatchesCmlSceneRef` over all **45 stored (cml, outline) pairs**:

| ref | present | resolves EXACTLY |
|---|---|---|
| `culprit_revelation_scene` | 45/45 | **0/45 (0%)** |
| `discriminating_test_scene` | 45/45 | **1/45 (2%)** |
| `suspect_clearance_scenes` | 179 refs | **4/179 (2%)** |
| `clue_to_scene_mapping` | 368 refs | 320/368 (87%) |

And the consequence:

- **Chapter-contract assignment runs on the keyword fallback in 98–100% of runs.** The coordinates
  are decorative.
- The DT fallback claims **more than one scene in 48%** of the runs where it is in play.
- **11 of 45 runs (24%) emit the reveal contract on no chapter at all**, and in **10 of those 11** a
  reveal scene existed and was taken by the DT fallback.

`clue_to_scene_mapping` at 87% is the control that makes this a coordinate defect rather than a
matcher defect: the matcher works when it is given real coordinates.

---

## 4. Why the constant is always the same

`agent3-cml.ts:633` — the worked example inside Agent 3's own prompt:

```yaml
    culprit_revelation_scene:
      act_number: 3
      scene_number: 6
      revelation_method: "Confrontation with evidence"
```

The model copies it. **45 runs out of 45 emit `act3/sc6`** — one distinct value across the whole
archive. This is A_67's lesson recurring: *illustrative content in a prompt is copied verbatim*.

It is belt and braces, too. `agent3-cml.ts:1300-1305` defaults the same pair in code:

```ts
? (Number((…).act_number) || 3) : 3
? (Number((…).scene_number) || 6) : 6
```

So a model that omitted the field entirely would land on the identical fiction. And
`suspect_clearance_scenes` is then derived from it (`revealSceneNum - 1`), which is why clearance
refs resolve at 2% — one wrong constant propagating into a second namespace.

**The two halves use different conventions.** `scene_number` read as GLOBAL resolves **45/45**; read
as per-act, **0/45**. The model is emitting a global scene index beside an act number, and the
matcher requires both to agree. Neither the schema (`act_number: number, scene_number: number`) nor
the prompt (*"Specify which act/scene reveals the culprit"*) says which is meant.

---

## 5. Why nothing caught it for 45 runs

This is the part worth generalising, because the coordinate is trivial to fix and the blindness is not.

1. **The fallback was indistinguishable from success.** A keyword match returns `true` exactly as an
   exact match does. There is no record of *which path resolved*, so a 0%-exact join looked identical
   to a working one in every log, report and test.
2. **The fallback is the primary path.** At 98% it is not a fallback at all — B1's rule ("a check
   that fires on most runs is an off switch with extra steps") has a mirror image: *a fallback that
   fires on most runs is the real implementation, and the thing it falls back from is dead code.*
3. **A fallback can steal another contract's chapter.** DT and reveal are mutually exclusive by
   construction (`!isDiscriminatingTestChapter`), so a loose DT keyword does not merely mis-assign
   itself — it *removes* the reveal contract. Two consumers, one shared keyword space, no arbitration.
4. **The obligations' absence is not an error state.** `buildChapterObligationBlock` returns a string.
   A missing block is a shorter string, and nothing downstream asserts that the reveal chapter
   received a reveal obligation. The pipeline has a geometry check for whether the reveal chapter
   *names the culprit* (`reveal_culprit_not_named`, A_84 §3.1, fires on 36%) — which is the symptom of
   this cause, measured for weeks without the cause being found.
5. **Tests pin the matcher, not the join.** `sceneMatchesCmlSceneRef` is correct against its own
   fixtures. Nothing tests it against a real (cml, outline) pair — the fixture-drift lesson, one level
   up: the unit is right and the integration was never exercised.

---

## 6. Prevention, ranked

### P1 — Make the reference resolvable, and say which path resolved it (free, highest value)

At the Agent 7 boundary, resolve every CML scene ref against the produced outline and record the
resolution path: `exact` / `signal` / `unresolved`. Warn on anything that is not `exact`.

This alone would have surfaced the defect on run 1 of 45. It is telemetry, not a gate — B1 forbids
gating something that fires 98% of the time, and the honest first move is to make the rate visible.

### P2 — One convention, stated in all three places (free)

`scene_number` is GLOBAL — that is what the model emits and what resolves 45/45. Say so in the schema
description, in the prompt, and in the matcher's docblock. Then relax the matcher: when `act_number`
disagrees with a global `scene_number` that does resolve, **prefer the scene number and warn**, rather
than returning false. A coordinate with one half right is not the same as no coordinate.

### P3 — Remove the copyable constant from the prompt (free)

Replace `act_number: 3 / scene_number: 6` with a placeholder that cannot be pasted (`<global scene
index of the reveal>`), exactly as A_67 required after the same defect in prose. Remove the `|| 3` /
`|| 6` code defaults, which are a second body of the same fiction; an absent ref should be *absent*,
not silently invented.

### P4 — Never let one contract's fallback delete another's (small)

`isRevealChapter` should not be `!isDiscriminatingTestChapter && …` when the DT classification came
from a keyword. Arbitrate explicitly: if a scene matches both by keyword, prefer the one whose beat is
`revelation`, and record the arbitration.

### P5 — Assert the join, not the matcher (small)

One test that takes a real archived (cml, outline) pair and asserts the reveal contract lands on
exactly one chapter. The 45 stored pairs are the fixture set, and 11 of them would fail today.

### P6 — The general rule, for the register

**A cross-agent reference needs referential integrity or it is decoration.** Where one agent emits an
identifier into a namespace another agent owns — scene coordinates, clue IDs, character names, locked
fact ids — something must check the referent exists, and the check must be visible when it fails.
Where a silent fallback absorbs the failure, the reference will rot and nothing will say so. This is
the third instance of the family in this project (`caseData.SETTING_REFINEMENT` with two readers and
no writer, A_82 §2; `cml.CAST` feeding the victim resolver, A_86; this).

**Not recommended:** making the reveal ref a hard gate. 24% of runs would abort, and the reveal
contract's absence has been survivable — those 11 runs shipped books, one of them at 84/100.

---

## 7. What this could NOT determine

- **Whether fixing it raises the score.** The obvious hypothesis — the reveal contract's absence
  causes the ch8/ch9 repetition the reviewer named — is plausible and untested. 11 archived runs lost
  the contract; comparing their `ending` marks against the other 34 is the cheap next measurement, and
  it is confounded by everything else that changed across those runs.
- **Why `clue_to_scene_mapping` resolves at 87%** when its siblings sit at 0–2%. Probably because
  those entries are act-only or carry real indices, but it was not traced.
- **Whether the DT contract is landing on the right chapter** when it fires. This analysis measured
  that it fires and that it steals the reveal; it did not check that the chapter it claims is the one
  the case intended.
