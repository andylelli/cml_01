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

---

## 8. BUILD LOG — what P1–P5 became when measured (2026-09-11)

Everything below is MEASURED by running the **real** `buildChapterObligationBlock` over all 45
archived (cml, outline) pairs, not by replaying a hand-written replica of its classification. That
distinction cost two wrong numbers in this session and is the reason P5 exists.

### STATUS

| item | state | commit | what it actually does |
|---|---|---|---|
| P1 audit + telemetry | **BUILT, unconditional** | see below | `resolveSceneRef` returns the PATH (`exact` / `global-scene` / `signal` / `none`); `auditCmlSceneRefs` + one warning line per run at the Agent 7 boundary |
| P2 global-scene reading | **BUILT, RECOMMENDED AGAINST** | see below | `AGENT9_SCENE_REF_RESOLUTION` — measured before switching on, and it is wrong (§8.1) |
| P3 placeholder | **BUILT, flag-gated** | see below | `AGENT3_SCENE_REF_PLACEHOLDER`; code defaults kept but made audible (§8.2) |
| P4 + P4b + P4c arbitration | **BUILT, flag-gated, ON** | `84e628f6`, `0a587005` | `AGENT9_SCENE_REF_ARBITRATION`; reveal contract 28/45 → **45/45** correct, doubling → 0 |
| P5 join test | **BUILT, green** | see below | `a87-scene-ref-join.test.ts`, 6 assertions over the frozen 45-pair fixture |
| P6 register entry | **WRITTEN** | this file | §6 P6 stands, and §8.4 strengthens it |
| P7 reconciliation | **BUILT, flag-gated** | see §8.7 | `AGENT7_SCENE_REF_RECONCILE`; reveal refs resolve **0/45 → 45/45** |

### 8.1 P2 IS REFUTED. The recommendation in §6 was wrong.

§6 P2 argued: `scene_number` read as GLOBAL resolves 45/45 where the act check resolves 0/45, so the
matcher should prefer the scene number. Built it, then measured where it lands **before** switching
it on:

| the scene P2 would hand the reveal contract to | count |
|---|---|
| beat `false_solution` | **43/45** |
| beat `alibis` | 1/45 |
| no beat | 1/45 |
| in the FINAL act | **0/45** |
| position in book | scene **6 of 10**, 41/45 |

`scene_number: 6` was never a coordinate. It is the prompt's worked example, in range by luck.
Reading it as global would put *name the culprit, walk the deduction, state the kill* on the mid-book
chapter that airs the detective's **wrong** theory — worse than the keyword fallback it replaces.
The flag stays OFF and is recommended-against in `FLAG-AUDIT.md`; the resolver it introduced is kept,
because P1's audit and P4's arbitration are both built on it.

**The lesson is §3's own, turned on this document:** a ref that "resolves" is not a ref that is
right. 45/45 resolution was the same kind of reassuring number as a keyword fallback returning
`true`.

### 8.2 P3 landed narrower than §6 asked, on purpose

§6 said to remove the `|| 3` / `|| 6` code defaults outright. They are **kept**, because a gap-filled
clearance still needs some coordinate and at Agent 3 time no real scene namespace exists — Agent 7
has not run. What changed is that their use is now audible instead of silent, which is the actual
defect. And the prompt change is flag-gated rather than unconditional: `scene_number` is
`{ type: number, required: true }`, so a model that copies `<the GLOBAL scene index…>` emits a string
and buys a schema-repair retry. That is a run's worth of risk, not a free fix.

### 8.3 The numbers in §2 and §3 were right; one intermediate number was not

Ground truth re-verified for run `mystery-1789140940497`: of its **64** Agent-9 prose prompts, **0**
carry `CULPRIT REVELATION REQUIRED` and **5** carry `DISCRIMINATING TEST`. The join test reproduces
exactly that — with the flag off it gives that pair `revealCh=[]` and `dtCh=[8,9,10]`.

Two intermediate figures produced during the build were wrong and were caught by the fixture rather
than by reading:

1. A first cut of the fixture **truncated `purpose` to 400 characters**. `normalizeSceneSignalText`
   reads purpose + summary + title + dramaticElements, so the keyword fallback looked far narrower
   than it is and the suite reported **1** broken run instead of **11**.
2. The harness passed `allOutlineScenes` **one argument late**, landing it in `currentStageMode`.
   Per-act numbering and the whole arbitration were silently disabled, and the arbitration measured
   as *worse* (doubling 7 → 12) when it in fact drives doubling to **0**.

Both failures have the same shape as the defect under investigation: a value that was quietly absent,
with no error, producing a plausible number. The fixture now carries the full signal fields and
asserts they are non-empty.

### 8.4 This was found once before, and fixed for one consumer only

`FLAG-AUDIT.md`'s `AGENT9_CLEARANCE_OWNERSHIP` row (A_76 §14, 2026-08-30) already records it:

> *"only **1 of 116 clearance refs across 29 books ever matches** — the CML numbers scenes against a
> nominal ~6-scene story (act 3 scene 5) while the outline numbers globally (act 3 scenes 8–10), so
> the branch is dead code and everything falls through to keyword matching"*

That is this defect, diagnosed correctly, twelve days earlier. `clearance-ownership.ts` was built to
reconcile the two numberings **for suspect clearances**. Nobody asked whether the other three
consumers of the same broken join — `culprit_revelation_scene`, `discriminating_test_scene`,
`clue_to_scene_mapping` — had the same problem. They did; the reveal is the one that costs a book.

**So P6 needs a second clause:** when a cross-agent reference is found to be broken, the finding is
about the REFERENCE SYSTEM, not about the consumer that surfaced it. Fixing one consumer and leaving
the join broken buries the evidence — the next occurrence looks new.

### 8.5 Still open

- **P7 (not built): reconcile after the outline exists.** The only sound fix. Agent 3 emits a forward
  reference; Agent 7 is then handed it as prose (`agent7-narrative.ts:459` writes *"Must appear in:
  Act 3, Scene 6"* into the outline prompt) and cannot satisfy it, because act 3 holds scenes 8–10.
  Nothing rewrites the CML refs to the outline's real coordinates once they exist. Until that happens
  P4's arbitration is a semantic resolver standing in for a coordinate one.
- **2 of 45 runs still lose the reveal contract** with arbitration on. Not traced.
- **Whether any of this raises the score is UNTESTED.** The ch8/ch9 repetition the reviewer named is
  a plausible consequence of the missing contract and nothing more than that.

### 8.6 A THIRD dead branch, and reconciliation does NOT fix it

`isPostRevealChapter` (obligation-block) gates the post-reveal naming constraint — the rule that stops
the prose swapping the culprit's name for a role alias once they have been named. MEASURED over the
45 archived pairs: it is **false for every chapter of every run**. The constraint has never fired.

The first guess was that the `act3/sc6` fiction caused it. It does not. The condition requires BOTH

```ts
Number(scene.sceneNumber) > Number(ref.scene_number)      // GLOBAL numbering
&& perActSceneNum        > Number(ref.scene_number)       // PER-ACT numbering
```

against the **same** field. For any reveal in the final act the two cannot both hold: a global index
of 8 or more is never exceeded by a per-act index of 1–3. So the branch is unsatisfiable before
reconciliation *and after it* — and after reconciliation every one of the 45 reveals sits in the
final act, which the test now asserts. The consumer mixes the two numbering systems inside one
conjunction; correcting the coordinate cannot save it.

Left unrepaired on purpose. Fixing it would newly activate a naming constraint that has never once
run, on the chapters after the reveal, on every run — a behaviour change that needs a run of its own
rather than a ride on this one. Pinned by `a87-scene-ref-reconcile.test.ts` so it cannot drift
unnoticed.

### 8.7 P7 — reconcile after the outline exists (built, flag-gated, held)

`AGENT7_SCENE_REF_RECONCILE`. Once the outline is final, the reveal and discriminating-test refs are
rewritten to real `(act, global scene)` coordinates. MEASURED over the 45 pairs: reveal refs resolve
**0/45 before, 45/45 after**.

It picks the scene by the same precedence the P4c arbitration uses — a resolved coordinate, else the
last keyword claimant the DT does not hold, else the last `revelation`-beat scene the DT does not
hold — and the test asserts the two agree on all 45 pairs, so the reconciler and the classifier
cannot silently diverge (WF-002: harmful exactly where one copy is the sole input to a WRITE, and
this one writes).

Deliberately narrow: `suspect_clearance_scenes` is untouched because `clearance-ownership.ts` already
owns that field, and `clue_to_scene_mapping` is untouched because it already resolves at 87%.

**Held OFF** until the arbitration run lands. Two levers aimed at the same join, flipped together,
would leave neither attributable.

### 8.8 What still cannot be settled without a paid run

Everything above is £0 — the 45 archived pairs and the real prompt builder answer every behavioural
question offline. Three things they cannot answer:

1. **Whether a correct reveal contract raises the mark.** The ch8/ch9 repetition the reviewer named
   is a plausible consequence of the missing contract; plausible is all it is. Needs a run and an
   external read (±3 marks).
2. **Whether the arbitration survives contact with a live model.** The offline measurement proves the
   obligation reaches the right chapter's PROMPT. Whether the model then writes a clean single reveal
   is a different question.
3. **Whether the P3 placeholder confuses Agent 3** into emitting a string or omitting the field. That
   is a schema-repair retry, visible only in a run.
