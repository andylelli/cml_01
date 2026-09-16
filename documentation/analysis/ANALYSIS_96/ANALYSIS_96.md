# ANALYSIS_96 — WHAT READING THE BOOK FOUND THAT THE INSTRUMENTS DID NOT

**Opened 2026-09-16.** Cost: £0 beyond the run it examines (seed 50862, `canary_1789577884303`,
£1.10). Sources: the manuscript read end to end, the stored CML / outline / profiles / prose
artifacts, `logs/llm-prompts-full.jsonl`, the run log, and 52–59 archived cases and outlines for the
comparisons.

**The run that produced this book passed its release gate and met the two predictions that mattered
most** (A_95 §8). Reading it took twenty minutes and found nine defects, four of which no instrument
we own can see. This document is the deep dive: every bug, its owner, the cross-agent cause where
there is one, and what to do.

---

## §0 THE HEADLINE

**The instruments and the reader disagree about this book, and the reader is right.**

| the instruments said | reading found |
|---|---|
| release gate **PASSED** | a mechanism that does not cohere on the page |
| turn density **4 of 6** — a large move off the measured 0 of 6 | no false solution a reader would believe for a page |
| beat jobs **3 of 5**, and the outline is genuinely better than the bookshop one | the outline puts the clearances AFTER the arrest |
| register **0.071**, the best of any recent book | prose visibly assembled: 10 uses of a phrase we ban by name |
| repetition **159.6 per 10k — WORTH A LOOK** | correct, and the only instrument that called it |

The one instrument that got it right is the one we already had. The three new ones passed it.

---

## §1 THE NINE DEFECTS

Numbered for reference. **Owner** is the agent or pass that produced the defect, not the one where it
became visible.

### B1 — The instruction's own vocabulary is in the prose, and then in the dialogue

**MEASURED, in the finished manuscript:**

| | count |
|---|---|
| *"She did not elaborate"* | **10** — the exact phrase `AGENT9_SHAPE_BY_REGISTER` bans **by name** |
| *"her answer as brief as the fading light / shifting sand / dusk outside…"* | **7** |
| *"her answer was six words"*, *"his reply came in four words"* | **6** — the prompt's NUMERALS, narrated |
| *"'Six words,' Harriet Kestrel said"* | **1** — a character **speaks the instruction** |

**Owner: Agent 9 prose, and the prompt we wrote for it.** A_94 R4c banned *"Four words, final."* and
*"She did not elaborate."* by name after seed 1358 produced the first. Seed 50862 used the banned
phrase **ten times** and invented an eighth-generation variant besides.

**This is the sharpest instance of a rule this project already holds** (A_67: illustrative content in
a prompt is reproduced, not adapted) **extended to prohibitions: naming a phrase in order to forbid it
does not suppress it.** Whether it actively primes the phrase is not established — but ten uses of a
by-name ban is not suppression.

**Status: PARTLY FIXED** (`39d6caba`). R4d replaces the phrase list with a positive operation — *the
sentence after a short answer must be what somebody else DOES* — and forbids stating a word count at
all. **Unmeasured:** three generations of this fix have now shipped and none has been tested on a
book.

### B2 — The brevity instruction shortened all speech, which destroyed the shape it was asking for

**MEASURED, seed 1358 → seed 50862:**

| | 1358 | 50862 |
|---|---|---|
| speeches | 230 | **132** |
| speeches of ≥ 15 words | 62 | **17** |
| mean speech length | 12.8 | **9.5** |
| flat answers (instrument) | 6 | 6 |
| **short retorts (instrument)** | **17** | **3** |

The flat answer held. The retort collapsed **because its setup disappeared**: the shape is a short
reply to a *long* speech, and there were no long speeches left. Wit fell 20.5 → 9.7 while the book
did exactly what it was told.

**Owner: the prompt.** A_94 R4b was written against precisely this after the matched pair
(dialogue share 17.3% → 11.9%) and did not prevent it; the diet moved from share to *length*.

**Status: FIXED, UNMEASURED** — R4d makes the long setup its own countable instruction.

### B3 — AtmosphereRepair paraphrases repeated lines into ungrammatical prose

One line of dialogue, four appearances, **two of them broken**:

> ch4 *"You're searching for blame in the dimmest places."* — clean
> ch7 *"You're hunting suspicion in the wrong places."* — a clean paraphrase
> ch6 ***"You; searching for blame in the shadowed places,"*** — corrupt
> ch9 ***"You're searching for blame in the shadows places,"*** — corrupt

Plus *"Bertram norbury's gaze"* (lower-case) and *"Bertram Norbury s gaze"* (apostrophe lost).

All four corruptions are in the stored **prose artifact**, so they predate the markdown render. All
four are in chapters AtmosphereRepair touched — though it touched 9 of 10, so coverage alone proves
little. **INFERRED, not MEASURED:** the mechanism matches this pass's two previously recorded
failures exactly — it authored 5 of the last 20 reader-flagged lines (A_90 §12 #6) and produced
*"three past midnight past three"* by paraphrasing a locked value (A_91 §12.3). Paraphrasing a
repeated line into broken grammar is the same behaviour a third time.

**Owner: `runAtmosphereRepairIfNeeded`.** It is ON because A_91 reversed the skip when turning it off
produced 29.8× the repetition median. So both settings have now produced a measured harm, which is
the definition of a lever that needs replacing rather than flipping — A_91 F4 (a detector that
*replaces* rather than removes) remains designed and unbuilt.

**Status: NOT FIXED.**

### B4 — The repeat ban list is issued and ignored

**MEASURED:** 8 ban blocks were delivered (chapters 3–10). Of the **63 distinct passages** repeated
three or more times in the finished book, **15 (24%) were explicitly named in a ban list the model
received** — including five of the top eight offenders:

```
BANNED  ×9  "in the lounge at nine thirty"
BANNED  ×7  "replied her answer as brief as"
BANNED  ×4  "knuckles white against the polished wood"
BANNED  ×4  "bertram norbury said his voice steady"
BANNED  ×4  "bertram norbury let the silence stretch"
```

The other 76% were never listed — a **coverage gap**, because a passage must already repeat twice in
*prior* chapters before it can be named. So the ban has two failure modes: what it names is ignored,
and what it does not name it cannot stop.

**Owner: A_94 R5.** R5 was INFERRED from the tic-template ban's success (23% → 0 of 7) and is now
MEASURED on a run. **The inference does not hold for spans of prose.** A tic is a formula the model
reaches for; a repeated sentence is one it has already written and is looking at in STORY TO DATE.

**Status: REFUTED as an operation. Not fixed.**

### B5 — Agent 7's scaffolding vocabulary is printed to the reader as chapter titles

**MEASURED:** **8 of 10 chapter titles are the outline's scene title copied verbatim**, including:

> **Chapter 6: False Solution: The Judge's Compass**
> **Chapter 8: The Final Trap: Compass and Ledger**

Across 527 archived scenes, **54 titles (10%) carry a Golden-Age beat name.** Agent 7 writes a title
for its own bookkeeping; Agent 9 prints it for the reader; nothing in between asks whether a reader
should see the word "False Solution" at the head of a chapter.

**Owner: cross-agent (7 → 9), and nobody owns the boundary.**

**Status: NOT FIXED.** The fix is small: strip a leading beat-name prefix when a scene title becomes
a chapter title, or have Agent 9 title its own chapters.

### B6 — 69% of outlines carry a duplicated beat, and this one put the clearances after the arrest

**MEASURED over 52 distinct outlines:** **36 (69%)** assign the same Golden-Age beat to more than one
scene — most often `revelation` (21) and `final_trap` (11). The ten beats are a SEQUENCE; the prompt
says so.

On this book the consequence is the whole third act:

| scene | beat | purpose |
|---|---|---|
| 8 | `final_trap` | execute the discriminating test |
| **9** | **`final_trap`** | **"Confirm alibis of all innocent suspects"** |
| 10 | `revelation` | "Reveal culprit through confrontation; show consequences" |

The prose put the test, the confession AND the arrest in ch8. Ch9 then cleared suspects of a crime
already confessed — **repeating ch8's elimination paragraph nearly verbatim** — and closed on a
word-for-word copy of ch4's cliffhanger, *"Motives circled in the sand at his feet, but the workings
of the crime slipped from his grasp… leaving only the promise of further inquiry"*, **after the
arrest**. Ch10 had nothing left to reveal.

**Owner: Agent 7**, unchecked. **A_94 R1 did not catch it because R1 only inspects the FINAL scene** —
these clearances are at scene 9 of 10.

**Status: NOT FIXED.**

### B7 — The case was coherent and the prose broke it, because the mechanism's key actor is not in the cast

**The CML is sound.** Verbatim:

> *"The judge's habitual subtle tilting of the compass casing caused a consistent fifteen-degree
> offset… **Nora Quayle exploited this authoritative testimony**, combined with manipulation of the
> hotel ledger's timing entries, to fabricate an alibi."*

That is a proper authority-axis case: a respected witness is *honestly* wrong, and the culprit leans
on him. **But the cast is six people and none of them is the judge.** So Agent 9 had no one to attach
the role to and fused it onto the victim — ch10: *"recalling Montague Gaunt's habit of tracing the
compass's edge… the man who had once ruled the hotel's order."*

The result is incoherent on the page: a dead man's sworn bearing anchors the case, the time it was
sworn is never addressed, and the step that makes the offset *Nora's* — she cites the judge to place
herself on the beach — is never written. The reveal asserts *"that fifteen-degree gap… is the
mechanism by which Nora's alibi was constructed"* without it.

**MEASURED across 59 archived cases: this happens in 1.** It is rare, not systemic — but when it
happens it destroys the book, and nothing checks it.

**Owner: Agent 3** (a mechanism whose actor is absent from the cast), with Agent 9 as the place it
becomes visible. **Status: NOT FIXED.**

### B8 — The reveal contract had reached no chapter for six runs

Found and fixed during A_95 (`7eac5c71`), recorded here because it belongs in the cross-agent map:
`CULPRIT REVELATION REQUIRED` reached a chapter in 39 of 57 logged runs and **none of the last six**,
taking the evidence chain, kill statement, resolution event, deception purpose and
`AGENT9_REVEAL_ARITHMETIC` with it. **51 of 51 stored cases place the revelation at "act 3, scene 6"
while act 3 holds 2–5 scenes**, so the coordinate join never resolves and the winner fell to null.

**Status: FIXED and CONFIRMED on this run** — chapter 9 carried all of it, arithmetic included.

### B9 — Two audit bugs of my own, both hiding behind green

- The M6 beat-job audit reported scene 5 as failing when its purpose read *"end with a second
  **dramatic** incident"* — the contract had worked and an adjective broke the regex. **A false
  negative in an audit is worse than no audit**: it reports a defect that is not there and hides that
  the lever landed.
- The `run-params.json` sidecar recorded `"seed": null` on **every run ever**, because `seed` was
  missing from `ALLOWED_INPUT_KEYS` — the same silent filter that would have dropped `humourLevel`.

**Status: both FIXED** (`39d6caba`, `e0d970cc`).

---

## §2 THE CROSS-AGENT CAUSES

Four patterns, each producing more than one of the nine.

### C1 — Prohibitions do not work; operations do. And we keep writing prohibitions.

B1 is the proof: a phrase banned **by name** was used ten times. B4 is the same shape at span level —
24% of the book's repetition was explicitly forbidden in the prompt that produced it.

Every lever this project has that DID work is a positive operation with a countable output: the
formative-incident ban (7/7 → 1/5 sharing a stem, because it *names what to write*), the
shared-history event (0% → 37%), the wit shapes (flat answers 2 → 10). Every lever that failed is a
list of things not to do.

**The rule this yields:** *a prompt may not contain a phrase it does not want written.* State the
positive form, or state the shape without the words.

### C2 — Each agent writes for itself; nobody owns the boundary

B5 (scene title → chapter title), B7 (a mechanism actor absent from the cast), B6 (a beat sequence
nobody validates), B8 (a scene coordinate that has never once resolved). In every case the producing
agent is internally consistent and the consuming agent has no contract to check against.

**This is WF-002's shape generalised.** WF-002 said two components computing the same set will
disagree, and that it only matters where one feeds a WRITE. These are the cases where one feeds a
write: the title reaches the reader, the mechanism reaches the reveal, the beat reaches the prose.

### C3 — The instruments pass books that fail

Turn density scored **4 of 6** on a book whose "false solution" nobody would believe for a page. It
counts *a non-culprit named in a sentence containing a suspicion word* — which this book does — but
a false solution the reader never accepts is not a turn. **I built that instrument yesterday and it
is too weak to carry the claim I made for it** (A_95 §8: "turn density CONFIRMED").

Register scored 0.071, the best of any recent book, on prose the reader would call assembled — because
machine register counts stative/abstract sentences and cannot see a sentence that is concrete,
grammatical and *the same as four others*.

### C4 — Reading is the cheapest instrument we have and we had stopped using it

This read cost twenty minutes and £0, and found four things no instrument reports. The external read
costs a reader and carries ±3 marks; the internal judge cannot rank an 86 against an 81. **Reading
the book ourselves sits between them and had no place in the process.**

---

## §3 THE FIXES, RANKED

Each names the defect, the shape of the fix, and the check.

**F1 — Strip beat names from chapter titles (B5).** Smallest fix here, and it is reader-facing. Either
Agent 9 titles its own chapters, or a deterministic pass removes a leading `<beat name>:` prefix.
Check: no chapter title matches a beat vocabulary word. 10% of archived titles fail today.

**F2 — Validate the beat sequence at Agent 7 (B6).** Each of the ten beats at most once, and no
clearance scene after the scene carrying `final_trap`. Extends A_94 R1 from "the final scene" to "any
scene after the reveal". Fires on 69% of outlines, so it must be a **repair** (drop the duplicate
label, relabel by position), never a gate — B1's rule.

**F3 — Check the mechanism's actors exist (B7).** At Agent 3 or 3b: every role the mechanism
description names must map to a cast member. Rare (1 of 59) and catastrophic; deterministic and free.
Check: the audit finds this case and no other.

**F4 — Replace AtmosphereRepair rather than flipping it (B3).** Both settings have now produced a
measured harm: off gives 29.8× repetition, on corrupts prose in three separate books. A_91 F4 — a
detector that *replaces* a repeated span with a pre-approved alternative rather than asking a model to
paraphrase — is the designed answer and is still unbuilt. Interim: forbid it from touching dialogue,
where all four corruptions landed.

**F5 — Make the repeat ban carry its own consequence (B4).** The list is ignored; a list that is
ignored is telemetry. Either escalate a named-and-repeated span to a targeted regen of that
paragraph, or accept the list as advisory and stop claiming it as a lever. **Do not widen it** — 76%
of the repetition was never on it and could not have been.

**F6 — Strengthen turn density, or stop citing it (C3).** A turn requires the accusation to *survive
the chapter it is made in*. Today's check is satisfied by a suspicion sentence. Until it is stronger,
A_95 §8's "CONFIRMED" for M6 should read "not established".

**F7 — Read every book before spending a reader.** Twenty minutes, £0, and it caught four things
nothing else did. This belongs in CLAUDE.md beside the fallback-chapter and WORTH-A-LOOK rules.

---

## §4 WHAT IS NOT KNOWN

- **Whether R4d works.** Three generations of the brevity fix have shipped; none has been measured on
  a book. The next matched pair settles it.
- **Whether AtmosphereRepair authored the corruptions.** INFERRED from mechanism and prior behaviour,
  not proven — it touched 9 of 10 chapters, so correlation carries little weight. A pair with the pass
  off would settle it, but A_91 already measured what that costs.
- **Whether repetition regressed or the seed is simply a bad one.** 159.6 per 10k is high, but the
  metric has ranged 23.6 to 516 on identical code. One run attributes nothing.
- **Why 69% of outlines duplicate a beat.** The prompt states the sequence plainly. Whether this is a
  schema gap, a prompt gap, or the model treating the ten beats as a menu is unmeasured.

---

## §5 STATUS

| # | defect | owner | state |
|---|---|---|---|
| B1 | prompt vocabulary narrated, then spoken | Agent 9 prompt | **PARTLY FIXED** `39d6caba`, unmeasured |
| B2 | brevity shortened all speech | Agent 9 prompt | **FIXED** `9e61fdd7`, unmeasured |
| B3 | AtmosphereRepair corrupts paraphrases | Agent 9 pass | **NOT FIXED** — F4 |
| B4 | repeat ban issued and ignored | A_94 R5 | **REFUTED** — F5 |
| B5 | beat names in chapter titles | Agent 7 → 9 | **NOT FIXED** — F1 |
| B6 | duplicate beats; clearances after the arrest | Agent 7 | **NOT FIXED** — F2 |
| B7 | mechanism actor absent from the cast | Agent 3 → 9 | **NOT FIXED** — F3 |
| B8 | reveal contract reached no chapter | Agent 9 | **FIXED & CONFIRMED** `7eac5c71` |
| B9 | audit false negative; sidecar seed null | mine | **FIXED** `39d6caba`, `e0d970cc` |

**NEXT: F1, F2 and F3** — all three are deterministic, free, and none needs a run to build. Then a
matched pair on 50862 to settle B1/B2 and the repetition attribution together.
