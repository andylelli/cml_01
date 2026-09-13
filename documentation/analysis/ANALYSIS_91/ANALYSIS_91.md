# ANALYSIS_91 — THE FIRST HALF: WHY IT REPEATS, AND WHERE THE WIT WENT

**2026-09-13 · £0 · every number from the shipped manuscripts, `data/store.json`, and
`logs/llm-prompts-full.jsonl`.**

---

## 0. THE HEADLINE

Two findings, both MEASURED, and they are not the same problem.

**The first half of the book is measurably more repetitive than the second, in 6 of 8 shipped
manuscripts** — by up to **8×** on one book. The repetition is not within a chapter; each chapter on
its own is fine. It is **across** the first-half chapters: the same clue, in the same locked
vocabulary, restated in chapter after chapter. That is the half where evidence is planted, and
planting is what repeats.

**The humour machinery is elaborate, correct, and the FIRST thing the prompt budget deletes.** A
1,900-word guide with five named styles and worked examples, nine per-character humour styles with
levels, a scene-by-scene permission map, and humorous voice fragments — all built, all wired. But
`humour_guide` is the only block in the prose prompt carrying `priority: 'optional'`, and the
budgeter's drop order is literally `["optional", "medium", "high"]`. **It is first in the queue to be
deleted, every time the prompt is over budget.** MEASURED: present in 10 of 10 chapters on one run,
**0 of 10 on each of the next two**.

This is X47 repeating. That analysis found the prompt budget deleting the craft blocks; `craft_guide`
was promoted from `optional` to `high` and now survives. The humour guide sitting beside it was left
at `optional` and is being deleted on exactly the same mechanism.

---

## 1. METHOD

Eight shipped manuscripts, `story_20260908-1829` through `story_20260912-2103`, split at the
mid-chapter. Repetition counted as distinct 6-word spans occurring more than once, normalised per
10,000 words — the same instrument as `packages/prose-guard/src/repetition-density.ts`, whose corpus
median is **17.3 per 10k**. Prompt reach read from `logs/llm-prompts-full.jsonl` by `runId` and agent
label, never by grepping a module (ADR-0004's lesson).

---

## 2. THE MEASUREMENT: THE FIRST HALF IS THE PROBLEM

| book | first half rep/10k | second half rep/10k | ratio |
|---|---|---|---|
| 20260912-1815 | **1,153.5** | 137.9 | **8.4×** |
| 20260912-1507 | **763.3** | 195.9 | 3.9× |
| 20260911-2112 | **612.8** | 278.2 | 2.2× |
| 20260912-1926 | **505.4** | 276.1 | 1.8× |
| 20260912-2103 | 202.8 | 286.2 | 0.7× |
| 20260911-1701 | 177.6 | 116.8 | 1.5× |
| 20260908-1829 | 116.3 | 108.1 | 1.1× |
| 20260912-2016 | 85.8 | 81.4 | 1.1× |

Six of eight are worse in the first half; the two that are not are the two least repetitive books
overall. **Every one of these is above the corpus median of 17.3.**

**It is cross-chapter, not within-chapter.** Counted per chapter, most chapters carry 0–150 per 10k
and several carry zero. The half-level figure is high because the repetition spans chapters: a phrase
established in chapter 2 returns in 3, 4 and 5.

**And most of it is not mandated.** Of the repeated spans in three recent books, the share carrying a
locked-fact value — the values the prose is REQUIRED to print verbatim — is **24%, 39% and 14%**. The
remaining 61–86% is authored repetition with no contract behind it.

---

## 3. THE FOUR KINDS, EACH WITH ITS OWN CAUSE

### 3.1 The clue, restated in its own vocabulary (the largest)

> "the contradiction between the clock and the victim's pocket watch" ×5
> "was seen on the promenade deck at twenty minutes past eight" ×5
> "crew quarters at ten minutes past eight" ×5

**Cause, MEASURED in A_90 §12:** in chapters 3–6 of run 81042, **11 of 14 clue obligations** were for
clues whose key terms were already ≥70% present on earlier pages. The chapter contract asks for the
clue; the clue arrives in the clue's own words; the next chapter's contract asks again.

**Note the history.** A_90 §13 tried to fix this by retiring on-page clues and **it made the book
worse** — it retired the reveal's own culprit-direct evidence and the rubric capped the ending. The
lever is withdrawn and its guard is in the code, untested. **Any fix here must not repeat that.** The
distinction A_90 §13 could not draw is the one this analysis needs: *re-staging a discovery* is a
recap; *re-citing evidence at the reveal* is the contract.

### 3.2 The locked value, printed verbatim (mandated, and not the enemy)

> "at half past ten at night" ×13 · "twenty minutes past eight at night" ×10

This is the locked-fact contract working. 14–39% of repeated spans. A reader has never complained
about a time repeating; three reads complained about times **disagreeing**. **Do not touch this** —
A_90 §11.2 built `AGENT9_PHRASE_LOCKED_BOUNDARY` specifically to stop a repetition pass paraphrasing
a locked value, after one did and garbled a clock.

### 3.3 Sentences that open with a character's full name

The most-repeated two-word sentence opener in the first half of every book measured is a cast name:

| book | opener | count |
|---|---|---|
| 20260912-2016 | "Gerald Jardine…" | **21** |
| 20260908-1829 | "Neville Ingram…" | **31** |
| 20260911-2112 / 1507 | "Nora Gaunt…" | **27** each |
| 20260912-1926 | "Ambrose Halloway…" | 18 |
| 20260912-2103 | "Katherine Bellamy…" | 14 |

**INFERRED cause:** the pronoun-attribution rules, which are `critical` priority and were raised to a
1,100-token cap in 2026-09-04, instruct *"in ALL dialogue attribution use the speaker's FULL NAME, not
a pronoun"*. That rule is correct for attribution and is being applied to narration as well. The
result is a book in which one name starts a sentence every forty words.

### 3.4 A whole clause, reused verbatim

> "gaze lingered on Ambrose, her composure faltering, sometimes the smallest…" ×4

Four occurrences of a fourteen-word clause in one half. **This is the class `AtmosphereRepair` existed
to catch**, and A_90 §12 turned that pass off after measuring that it authored 5 of the last 20 lines
readers called machine prose. Turning it off was right; **nothing replaced it**, and this is the gap.

---

## 4. THE HUMOUR MACHINERY: BUILT, WIRED, AND DELETED FIRST

### 4.1 What exists

| piece | where | state |
|---|---|---|
| `DEFINITIVE_GUIDE_TO_HUMOUR.md` | `notes/`, 6,930 bytes | on disk, loaded by `loadWritingGuides` |
| the distilled guide — 5 approved styles with worked examples, rhythm, balance, forbidden zones | `prompt-builder.ts` ~2251 | built into `humourGuideBlock` |
| 9 humour styles with one-line definitions | `prompt-blocks.ts` `HUMOUR_STYLE_DESCRIPTIONS` | per character |
| per-character `humourStyle` + `humourLevel` | Agent 2b profiles | **populated on every run** |
| `humourPlacementMap` — scene-position permission | world doc | present on some chapters |
| humorous voice-register fragments, elevated when permitted | `prompt-builder.ts` ~297 | wired |

The per-character data is real and varied. Six recent casts carry, for example,
`dry_wit:0.5  observational:0.3  polite_savagery:0.6  understatement:0.2  deadpan:0.4  none:0`.

### 4.2 Where it goes

| run | humour guide in ch1 prompt | craft guide in ch1 prompt | prompt size |
|---|---|---|---|
| `mystery-1789232316546` (fresh) | **yes** — 10 of 10 chapters | yes | 117 KB |
| `resume-1789239262975` | **no** — 0 of 10 | yes | 95 KB |
| `resume-1789242865847` | **no** — 0 of 10 | yes | 96 KB |

Both guides come from the same loader, on the same line, in the same call. The craft guide survives
and the humour guide does not, because:

```
{ key: 'humour_guide', content: …, priority: 'optional', stability: 'run' },
{ key: 'craft_guide',  content: …, priority: 'high',     stability: 'run' }, // Fix D2: promoted from optional
```

and

```
const dropOrder: PromptBlockPriority[] = ["optional", "medium", "high"];
```

**`humour_guide` is the only `optional` block in the list.** It is not one of several candidates for
deletion; it is the whole first tier. The craft guide was rescued by Fix D2 and its neighbour was not.

### 4.3 What that costs

MEASURED: 22 KB of prompt, which is the guide plus its appended full source. INFERRED: the per-chapter
humour instructions survive (`Humour: dry wit — deploy occasionally (level 0.5)`, present in 7–8 of 10
chapters even on the resumes), so what is lost is the **how** — the worked examples, the rhythm rule,
the forbidden zones — while the **instruction to be funny** remains. A character told to deploy dry wit
occasionally, with no model of what that looks like, is the VoiceSpec shape: an instruction that
reaches every prompt and moves nothing.

---

## 5. CHARACTER AND DEPTH: WHAT THE READS ACTUALLY SAID

Three consecutive external reads, same complaint, different words:

- 79/100: *"the motive is conceptually fine, but emotionally thin… Add one scene or memory where
  Bertram actively crushes Gwendolyn's work."*
- 82/100: *"Gwendolyn and Bertram still need one stronger personal scene. 'He was destroying
  everything I cared for' is understandable, but generic. Give one concrete wound."*
- 87/100: *"relationships still need more lived specificity"* (scored 8/10, the best of the three).

A_89 D1 already found the mechanism for part of this: a 40-character label cap discarded **747 of 752
(99%)** `relationship` strings before they reached Agent 9, and `AGENT9_RELATIONSHIP_CONTENT` now
renders them as sentences. That fix is ON and confirmed on the page. **The residue is different**: the
reads are not asking for more relationship TEXT, they are asking for one dramatised SCENE — a
countable operation this model complies with, and one nothing currently asks for.

**And the dialogue share is the structural half of it.** Paragraphs opening on speech, first half:
**14–33%**. A_79 §13.2 measured the canon at **59.7%**. The first half is where a reader forms an
opinion of the characters, and it is the half with the least speech in it.

---

## 6. THE FIXES, RANKED — NOTHING IS BUILT YET

### F1 · Promote `humour_guide` to `high` (one word)

The craft guide's own comment says a promotion already happened once for exactly this reason. The
humour guide is run-stable, so it lands in the cached prompt prefix and is paid for once.
**Falsifiable:** if the guide then reaches 10/10 chapters on a resume and the next read still names
no wit, the guide is a dead lever and should be cut rather than carried at 22 KB.

### F2 · One dramatised grievance scene, as an obligation

Three reads asked for the same thing in the same words. The case already holds `motive_seed`,
`relationship` and `sharedHistory`. Ask ONE first-half chapter for a scene in which the culprit and
the victim are on the page together and the wound is shown, not summarised. A countable operation,
not a rate. **Falsifiable:** count scenes containing both names in the first half — today, INFERRED
from the reads, near zero.

### F3 · Restrict the full-name rule to dialogue attribution

The rule is right for attribution and is leaking into narration, producing a cast name every forty
words. Scope it explicitly and add its complement: vary the narrative subject. **Falsifiable:**
top-opener count per first half, today 14–31.

### F4 · Replace `AtmosphereRepair` with a first-half cross-chapter check

The pass was turned off in A_90 §12 for authoring machine prose. §3.4's repeated 14-word clause is
what it used to catch. A DETECTOR, reported not gated (B1), keyed to cross-chapter repetition in the
first half and excluding locked values by construction.

### F5 · The clue-restaging distinction A_90 §13 could not draw

Retire a clue's *re-staging* while protecting its *citation*. §13's guard is already in the code and
untested. **This is the one to build last**, because its predecessor made a book worse.

---

## 7. WHAT NOT TO DO

- **Do not paraphrase locked values.** A_90 §11.2 exists because a repetition pass did and garbled a
  clock the whole story depended on.
- **Do not re-enable clue ownership by page without the guard and a probe.** A_90 §13: 16 of 31
  obligations retired, including the reveal's, and two new rubric caps.
- **Do not ask for humour as a rate.** "For every 3 pages, 1 understated observation" is exactly the
  instruction shape this model ignores (VoiceSpec: asked for 22.0-word sentences, got 15.86).
- **Do not add another scrubber.** Prose polish is an LLM line-edit pass; strengthen the instruction.

---

## 8. STATUS

| item | status |
|---|---|
| the first-half repetition measurement | **MEASURED**, 8 books |
| the four repetition classes and their causes | 3 MEASURED, 1 INFERRED (§3.3) |
| the humour guide is the only `optional` block and is dropped first | **MEASURED**, 3 runs |
| per-character humour data is populated | **MEASURED**, 6 casts |
| F1–F5 | **designed, none built** |

**The next cheap thing** is F1, one word, verifiable without a paid run by rebuilding a prompt and
counting whether the block survives. **The next expensive thing** is the read of either shipped book
that is still waiting — the first spatial read the project has ever had, and identity's third.
