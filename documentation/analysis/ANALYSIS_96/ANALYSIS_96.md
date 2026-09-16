# ANALYSIS_96 — WHAT READING THE BOOK FOUND THAT THE INSTRUMENTS DID NOT

**Opened 2026-09-16.** Cost: £0 beyond the run it examines (seed 50862, `canary_1789577884303`,
£1.10). Sources: the manuscript read end to end, the stored CML / outline / profiles / prose
artifacts, `logs/llm-prompts-full.jsonl`, the run log, and 52–59 archived cases and outlines for the
comparisons.

**The run that produced this book passed its release gate and met the two predictions that mattered
most** (A_95 §8). Reading it took twenty minutes and found nine defects, four of which no instrument
we own can see; a second pass with the prompt log open found four more and corrected one of the nine. This document is the deep dive: every bug, its owner, the cross-agent cause where
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

## §1 THE DEFECTS — nine on the first pass, thirteen on the second

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

### B4 — The repeat ban list works on ordinary prose and loses to competing instructions — CORRECTED

The first draft of this section said "issued and ignored", from an end-state count: 15 of the 63
passages repeated in the finished book had been named in a ban list. That measured overlap, not
compliance. **The dynamics say the opposite, MEASURED per passage, per chapter:**

| 38 passages ever listed, each with chapters on both sides of its first listing | |
|---|---|
| mean occurrences per chapter BEFORE first listed | **0.35** |
| mean occurrences per chapter AFTER first listed | **0.09** |
| rate fell after listing | 23 |
| **stopped entirely after listing** | **28 of 38** |
| rate rose after listing | **2** |

The list suppressed what it named, three times out of four. The two risers are the finding:

> *"in the lounge at nine thirty"* — 0.67 → 1.00 per chapter. It is Gwendolyn's alibi value, and the
> alibi and clearance obligations in the same prompt **require it restated**: 35 mentions outside the
> ban block across chapters 4–10.
> *"replied her answer as brief as the"* — 0.67 → 0.71. It is the brevity instruction's own shape
> (B1), asked for in every chapter.

**A ban cannot beat a positive instruction in the same prompt.** Where the two collided, the
instruction won every time; where the ban stood alone, it worked. So R5 is not refuted — it is
*bounded*: it removes authored repetition and cannot remove mandated repetition, exactly as the
locked-value exemption already assumes. The fix is at the source of the mandate, not the ban.

**And the 76% never listed is a coverage gap by design**: a passage must repeat twice in prior
chapters before it can be named, so the third occurrence is the first the ban can prevent.

**Owner: A_94 R5's claim, and this document's first draft. Status: R5 BOUNDED, not refuted. A_95 §8.2
is corrected below.**

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

### B10 — The costume roll-call is instructed, and STORY TO DATE amplifies the instruction

Every appearance of a character re-states her clothes:

| tag | count |
|---|---|
| *pastel tea dress* / *white gloves* (Gwendolyn) | **8 / 8** |
| *cleaning apron crisp* (Harriet) | **8** |
| *tea dress in pale blue* / *cloche hat adorned* / *pearls* (Theodora) | 4 / 5 / 4 |
| *cotton blouse* / *pleated skirt* / oil (Nora) | 3 / 3 / 4 |

**MEASURED on the chapter-1 prompt, which has no prior text: "pastel tea dress" appears twice and
"cloche hat" three times before a word of the book exists.** The character-portrait block hands the
costume to every chapter as observable detail, the model writes it as an identification tag, and
STORY TO DATE then shows the tag back in every later prompt. The mechanism is the same one that
carried *"as brief as"* from one instruction seed to 47 exposures (§1b).

**Owner: the per-chapter character block (Agent 2b's observable detail, rendered by Agent 9 every
chapter).** A description belongs in the chapter a character enters; a tag belongs nowhere.
**Status: NOT FIXED — F8.**

### B11 — The depth beat's CAUSE is narrated as a tag, which the beat forbids

`AGENT9_DEPTH_BEAT` asks for the trait as action and **forbids narrating the cause in the same
paragraph**. The book narrates the cause as a recurring label:

> *"a dignity hard-won after a false accusation years prior"* — **7 variants**
> *"a vigilance born of hard experience"* — 4
> *"the memory of a failed operation at twenty-seven"* — 3
> *"the catastrophic engine failure that had nearly ended her racing ambitions"* — 2

**MEASURED:** none of *"false accusation"*, *"hard-won"* or *"vigilance"* is in the chapter-1
prompt. Unlike the costume, these are **model-authored once and then copied** — the depth beat's
explicit prohibition was overridden by the chapter's own prior text. Third instance of C1 in one book.

**Owner: Agent 9, with the prohibition losing to STORY TO DATE.** **Status: NOT FIXED — F9.**

### B12 — The reveal obligations landed one chapter after the confession

M3a (B8) delivered the kill statement, evidence chain and arithmetic to **chapter 9**. The confession
and arrest are in **chapter 8** — *"It was me… I struck Montague Gaunt with the heavy paperweight"*,
*"you are under arrest"*. The obligations were written for a chapter whose culprit had already been
taken away.

**Why: B6.** The outline gave `final_trap` to scenes 8 AND 9. The DT claim took 8; the reveal winner
fell through to the second `final_trap` at 9. M3a did exactly what it was built to do on an outline
that broke the rule it assumes. A correct beat sequence (F2) makes this impossible; until then, the
reveal winner should be the *earliest* `final_trap`, not the last.

**Owner: Agent 7's duplicate beat, surfacing through Agent 9's arbitration. Status: NOT FIXED — F2.**

### B13 — The release gate "passed" with its blind reader skipped

The run log: *"blind reader NOT MEASURED — Azure refused the prompt (content filter; the case's death
method is in it). The gate is SKIPPED, not passed."* The same happened on seed 1358. A gate that is
skipped and reports PASSED is the shape B1 of CLAUDE.md warns about from the other side: an off
switch that looks like a check. **Status: recorded; the content-filter interaction is its own item.**

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

### §1b — How one seed becomes forty-seven exposures — MEASURED

The chapter-1 prompt contains each leaked phrase **once**: *"she did not elaborate"* 1, *"four
words, final"* 1, *"six words"* 1, *"four words"* 2. Across all ten prompts those same strings appear
**33–35 times**, and *"as brief as"* — which is in no instruction at all — **47 times**. The
difference is STORY TO DATE: every prior chapter's own use of the phrase is shown back to the model
as context.

So the instruction plants a phrase once, the first chapter writes it, and every subsequent prompt
carries the accumulated copies. **A prohibition is a single sentence competing with a dozen
demonstrations of the thing it forbids** — which is why B1, B4's two risers, B10 and B11 all have the
same shape. The channel was identified in A_90 §12 #7 for clue restatement; it is the general
mechanism.

### §1c — The polish pass seeded one of the repeats — MEASURED, one instance

Diffing each chapter's pre-polish text (in the `PostPassPolish-ChN` request) against the stored
prose: polish removed none of the repeated tags and **added one** — *"knuckles white against the
polished wood"* in chapter 1, the book's first occurrence, which chapters 3, 7 and 9 then copied.
The register ban asked for *"something physically present"*; the pass supplied a concrete image; the
book repeated it. One measured seed. It does not attribute the book's repetition to M1, and it does
say the register ban and the repeat ban pull in opposite directions when the concrete image is a
stock one.

### §1d — What the reader would score — a PREDICTION, checkable if this book is ever read

| category | predicted | why |
|---|---|---|
| clues | 5–6 | B7: the mechanism's actor is the victim; the exploitation step is never written |
| ending | 5–6 | B6/B12: arrest in 8, clearances in 9, a cliffhanger after the arrest |
| prose | 5–6 | B1/B3: ten uses of one tag, two corrupt sentences, the costume roll-call |
| pacing | 6 | chapters 3–7 re-examine the compass, then the third act stalls |
| dialogue | 6 | B2: 132 speeches, mean 9.5 words, eight *"Beach viewing stand"* |
| **headline** | **76–79** | |

If it scores 80 or above, §0's claim that the instruments passed a failing book is wrong and this
document should say so.

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

**Sharpened by §1b and B4:** a prohibition is not merely weak — it is *outvoted*. The ban list, which
is a prohibition, suppressed 28 of 38 passages when it stood alone and lost both times a positive
instruction in the same prompt wanted the phrase. The order of strength this book demonstrates is:
STORY TO DATE demonstrations > a positive instruction > a prohibition. Anything we forbid must
therefore also be absent from the demonstrations, which means the FIRST chapter's compliance decides
the book.

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

**F5 — Exempt mandated values from the repeat ban, as locked values already are (B4).** The ban works
where it stands alone. Its two failures were an alibi value the clearance obligations require and the
brevity tag the shapes instruction requires. Alibi and clearance values should join locked values in
the position-based exemption; the brevity tag disappears with R4d. **Do not escalate the ban to a
regen** — it is not the ban that is failing.

**F6 — Strengthen turn density, or stop citing it (C3).** A turn requires the accusation to *survive
the chapter it is made in*. Today's check is satisfied by a suspicion sentence. Until it is stronger,
A_95 §8's "CONFIRMED" for M6 should read "not established".

**F8 — Describe a character once (B10).** The per-chapter portrait block should carry costume only
in the chapter a character first appears; thereafter a name. Check: no costume phrase appears more
than twice in a book. Today: eight.

**F9 — Keep the cause out of the chapter block (B11).** The depth beat should hand Agent 9 the TRAIT
and withhold the formative incident's text entirely, so there is nothing to copy. The cause reaching
the page in one line of dialogue was the design (A_91); seven narrated labels is what arrived.

**F10 — The earliest `final_trap` wins the reveal (B12).** Until F2 makes duplicates impossible, the
reveal arbitration should prefer the first `final_trap`, since that is where the prose confesses.

**F11 — Do not let the first chapter set the pattern (§1b).** Whatever the first chapter writes, the
other nine will copy. The chapter-1 prompt is the one place a prohibition is not yet outvoted, and the
place the register ban, the shapes and the costume rule should be strictest. Measured on the next run
by whether chapter 1 contains any of the tags this book repeated.

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
- **Whether the polish pass seeds repetition in general.** One measured instance (§1c). A pair with
  `AGENT9_REGISTER_BAN` off would settle it and costs £0.45.
- **Why 69% of outlines duplicate a beat.** The prompt states the sequence plainly. Whether this is a
  schema gap, a prompt gap, or the model treating the ten beats as a menu is unmeasured.

---

## §5 STATUS

| # | defect | owner | state |
|---|---|---|---|
| B1 | prompt vocabulary narrated, then spoken | Agent 9 prompt | **PARTLY FIXED** `39d6caba`, unmeasured |
| B2 | brevity shortened all speech | Agent 9 prompt | **FIXED** `9e61fdd7`, unmeasured |
| B3 | AtmosphereRepair corrupts paraphrases | Agent 9 pass | **INTERIM FIX** `56260d2d` — narration only + two splice shapes refused; A_91 F4 (a replacing detector) still unbuilt |
| B4 | repeat ban loses to competing instructions | A_94 R5 | **FIXED** `e7e449ec` — alibi windows and clearance methods exempt by position |
| B5 | beat names in chapter titles | Agent 7 → 9 | **FIXED** `f91a2c28` — stripped at Agent 7 and at chapter sanitisation |
| B6 | duplicate beats; clearances after the arrest | Agent 7 | **FIXED** `f91a2c28` — relabel, strip after the first `final_trap`, retitle; a repair, never a gate |
| B7 | mechanism actor absent from the cast | Agent 3 → 9 | **FIXED** `e7e449ec` — named as OFF-STAGE in the chapter block; `[A_96 F3]` telemetry |
| B8 | reveal contract reached no chapter | Agent 9 | **FIXED & CONFIRMED** `7eac5c71` |
| B9 | audit false negative; sidecar seed null | mine | **FIXED** `39d6caba`, `e0d970cc` |
| B10 | costume roll-call instructed, then amplified | Agent 2b → 9 | **FIXED** `e7e449ec` — portrait only in the chapter a character enters |
| B11 | depth beat's cause narrated as a tag | Agent 9 | **FIXED** `e7e449ec` — the trait clause only; the cause never enters the prompt |
| B12 | reveal obligations one chapter after the confession | Agent 7 → 9 | **FIXED** `f91a2c28` — the earliest `final_trap` wins; F2 removes the duplicate at source |
| B13 | gate passed with the blind reader skipped | Agent 6 | recorded |
| — | B4's first draft ("issued and ignored") | this doc | **CORRECTED** — the ban works alone, loses to a competing instruction |

### §5.1 Built, 2026-09-16 — three groups, eleven flags, 49 tests, all default OFF and ON in `.env.local`

| group | fixes | flags | commit |
|---|---|---|---|
| A — Agent 7 structure | F1, F2, F10 | `AGENT7_BEAT_SEQUENCE_REPAIR`, `AGENT9_STRIP_BEAT_TITLES`, `AGENT9_EARLIEST_TRAP_WINS` | `f91a2c28` |
| B — what the prompt hands over | F3, F5, F8 (+F11), F9 | `AGENT9_OFFSTAGE_ACTORS`, `AGENT9_REPEAT_BAN_ALIBI_EXEMPT`, `AGENT9_DESCRIBE_ONCE`, `AGENT9_DEPTH_TRAIT_ONLY` | `e7e449ec` |
| C — passes and instruments | F4 (interim), F6 | `AGENT9_ATMOSPHERE_NARRATION_ONLY`; turn density strengthened (no flag — an instrument) | `56260d2d` |

Every fix is pinned on run 50862's own material: its outline (the duplicate `final_trap` relabelled
to `pattern`, *"Confirm alibis of all innocent suspects; provide closure to their arcs"* reduced to
*"Provide closure to their arcs"*, both leaking titles retitled), its mechanism text (the off-stage
judge found; a cast that holds the role not flagged), its corrupt sentence (*"You; searching"*
refused), and its false turn (an accusation cleared in-chapter scoring 0).

**Still unbuilt, with the reason:** A_91 F4, a repetition detector that *replaces* from a
pre-approved set — F4 here is the interim; B13, the release gate reporting PASSED with its blind
reader skipped by the content filter — its own item, because the fix is in how a skipped gate
reports, not in prose.

### §5.2 THE VERIFICATION RUN — seed 95041 · 2026-09-16 · ABORTED, and worth its cost

authority · 1930s · Village · Dark · short · amateur · atmospheric · cast 7 · `--humour classic` ·
angle *"an archaeological dig and what it turned up"*. Project `canary_1789583740167`. Prose
completed — **10 chapters, 13,928 words** — and then **story validation refused the book**: 7 major
issues, so nothing was saved to `stories/`.

**The fixes worked, measured from the ship-check before the abort:**

| | seed 50862 | seed 95041 | |
|---|---|---|---|
| repetition per 10k | 159.6 | **20.8** (corpus median 17.3, "Normal") | **MET** (< 50) |
| turn density, STRICT rule | — (4/6 on the weak rule) | **4 of 6** — 2 end with a non-culprit in frame, 3 overturn a belief | **MET** (≥ 2) |
| wit per 10k | 9.7 | **29.6** — 3× | short of 41.4, but the band was `classic` not `sharp` |
| machine register | 0.071 | **0.065** | **MET** (< 0.070) |
| duplicated beats | `final_trap` ×2 | **none** | **MET** |
| `[A_96 F2]` | — | *"relabelled s9 false_solution→pattern; clearances stripped after the reveal in s9; beat-name prefixes removed from 2 titles"* | **the repair fired, on its own** |

Repetition fell by a factor of eight and the middle of the book turned four times under the *stricter*
rule. Those are the two largest moves this project has measured from a prompt-side change.

### §5.3 AND I CAUSED THE ABORT — F8, MEASURED

| | 1358 | 50862 | **95041** |
|---|---|---|---|
| `pronoun_gender_mismatch` | 0 | 0 | **2** |
| `pronoun_drift` | 1 | 1 | **7** |
| `cleared_culprit_conflict` | 0 | 0 | **1** |

*"Ambrose Rutherford has incorrect pronouns. Should use he/him/his but found: she"*; Frances Orme
drifted in seven chapters.

**The cause: `AGENT9_DESCRIBE_ONCE` (F8).** The world document's portraits carry the only PROSE-level
gender signal — *"Frances Orme… **Her**… **she**"* — and suppressing them removed five gendered
paragraphs per chapter. The `(she/her)` labels in the Voices block survived (7 of them in the
chapter-5 prompt) and were not enough on their own.

**I traded a costume roll-call for pronoun drift, and the trade cost a run.** The fix keeps the
pronoun and drops only the costume: *"Already introduced — Frances Orme is she/her. A name suffices:
do NOT restate clothing…"*. Pinned by a regression test naming this run.

**The lesson, which is C2 again from the inside:** a block removed is not only its stated content. The
portrait block was *described* as appearance and *did* two jobs — appearance and gender reinforcement
— and nothing said so. Before suppressing a block, measure what else it carries.

### §5.4 THE MATCHED PAIR — seed 50862, arm B `resume-1789585724953` · 2026-09-16 · £0.45

`RESUME_REDO=prose` against byte-identical upstream. Arm A is the shipped 50862 book; arm B is the
same thirteen artifacts with only the prose stage re-run, carrying the A_96 prose-side fixes. M1, M3a,
M4, M5 and M6 were on for BOTH arms, so this isolates A_96. No fallback chapter.

| | arm A | arm B | verdict |
|---|---|---|---|
| *"as brief as"* | 7 | **0** | **MET** |
| stated word counts | 5 | **0** | **MET** |
| narrated backstory labels (B11) | 11 | **0** | **MET** — F9 |
| corrupt splices (B3) | 1 | **0** | **MET** — F4 |
| pronoun failures | 0 / 1 | **0 / 0** | **MET** — the F8 regression did not recur |
| machine register | 0.071 | **0.055** | **MET**, and the best measured on any book |
| turn density (strict) | 3/6 | **4/6** | **MET** |
| repetition per 10k | 159.6 | **91.2** | improved 43%, still far above 50 |
| wit per 10k | 9.7 | **15.5** (retorts 3→9) | short of 20.6 |
| *"She did not elaborate"* | 10 | **5** | **halved, not eliminated** |
| speeches ≥ 15 words | 17/132 | **26/146** | short of 40 |
| worst costume phrase | 8× *"pastel tea dress"* | **7× *"her cloche hat"*** | **F8 FAILED** |
| chapter titles with a beat name | 3 | **3** | **F1 FAILED** |

**Every fix reached every chapter** — verified by label in the prompt log: *"A name suffices"* ch2–10,
*"OFF-STAGE ACTOR"* ch1–10, *"withheld from you on purpose"* ch1–10, *"TWENTY-FIVE WORDS OR MORE"*
ch1–10, *"NEVER STATE A WORD COUNT"* ch1–10. So the four misses are compliance or wiring, not reach.

**What this settles.** F9 and F4 work outright: the narrated-backstory label went 11 → 0 by withholding
the cause from the prompt, and the corruption stopped when the pass was kept out of dialogue. Register
at **0.055** is the lowest this project has measured and it moved on a prose-side change alone. And the
F8 pronoun regression did not recur, so that fix holds.

**F1 FAILED for a reason worth recording.** The strip is correct — `stripBeatPrefixFromTitle` turns
*"False Solution: The Judge's Compass"* into *"The Judge's Compass"*, the dist carried it, and the
flag read true. But the stored chapter kept the prefix, so some Agent 9 path preserves the title past
`sanitizeGeneratedChapter`. **I could not determine which**, and chasing it further was poor value, so
the fix moved to the boundary A_96 B5 actually named: the *print*. `story-output.ts` and
`save-readable-story.ts` now strip at render, where no internal path can bypass it. Verified against
arm B's own stored titles: both leaking chapters render clean, 0 of 10 leak.

**F8 FAILED outright, and differently than expected.** Suppressing the portrait did not stop the
costume roll-call — it changed which garment repeats (*"pastel tea dress"* ×8 → *"her cloche hat"* ×7).
The model is not copying the portrait block; it is re-describing a character at every entrance because
that is what it thinks prose does. **INFERRED:** an instruction not to restate cannot beat a habit;
what might is the positive form — name the character and give the sentence a different job. Not built;
F8 stands as a measured non-fix.

**B1 is half-fixed.** *"as brief as"* and the word counts went to zero — the two things R4d names
positively. *"She did not elaborate"*, the phrase banned BY NAME, only halved. That is C1 once more:
the positively-stated rules landed and the prohibition did not.

### §5.5 A_91 F4 — NOT BUILT, and the measurement is why

F4 was queued as "the replacing detector" for the repetition still at 91.2 per 10k on arm B. Measuring
before building retired it:

| arm B's 32 repeated passages (×3+, merged) | |
|---|---|
| AUTHORED narration — removable | 22 |
| MANDATED (a value the case requires restated) | 7 |
| dialogue tag / the banned phrase | 2 |
| costume | 1 |

Three facts against building it:

1. **A_91's own §7 forbids it** — *"Do not add another scrubber. Prose polish is an LLM line-edit
   pass; strengthen the instruction."* And its §6 defines F4 as **a detector, reported not gated**,
   which duplicates the `repetitionDensity` ship-check already shipping.
2. **Repetition is a weak predictor.** A_95 §2: ρ **−0.13** against the headline, over 34 read books.
   Register is the lever at −0.60, and arm B put it at **0.055**.
3. **The biggest remaining offenders are repeated DIALOGUE lines** — *"I keep the books as best…"* ×4,
   *"you think I would lie about…"* ×4 — and F4 of this document (`AGENT9_ATMOSPHERE_NARRATION_ONLY`)
   now explicitly keeps the only pass that could touch them OUT of dialogue, because touching dialogue
   is what corrupted three books.

So the queued build was retired on its own evidence, and the budget went to a defect that was
actually costing runs.

### §5.6 THE RUN-KILLER — a month that dates a document is not the calendar · FIXED

Run 95041's abort (§5.3) had a second cause I had not diagnosed: **four `temporal_contradiction`
majors**, where both predecessor runs had zero. The threshold is `major > 5`
(`pipeline.ts:141`), so these four were most of what killed it.

Recovered from the Agent 9 checkpoint (the manuscript was never saved), every flagged month is the
case's own MECHANISM:

> *"the date plainly written — a quarter to four on the **twenty-second of April**. That is the
> official record."*
> *"The words '**the tenth of October**' shimmered faintly in the paper's grain."*
> *"three stamps with dates ranging from **May to July** in illogical filing order."*

The concealment was *an official record accepted without question, and wrong* — a forged excavation
report whose date contradicts its own paper. **The validator flagged the murder method as a continuity
error.**

This is REVIEW_12 §3.1's mechanical-spring exclusion one class over: a spring that is a clock part is
not the season; a month that dates a document is not the story's present.
`VALIDATION_DOCUMENTARY_MONTHS` blanks documentary months before the month scan — a marker within 70
characters, never across a sentence boundary, plus single-quoted spans (the book renders cited values
in single quotes and dialogue in double). **KNOWN-POSITIVE pinned:** *"It was a bright April
morning"* in a winter book still fires, and a documentary month elsewhere in the same text does not
suppress it.

**A divergence found and NOT fixed, recorded because it is real:** `chapter-validator.ts` passes the
case's mechanism terms and mechanical-spring flag to this analyser; `narrative-continuity-validator.ts`
calls it BARE. The `Story` type carries no case, so the scene validator cannot see one without
pipeline plumbing. The documentary-month exclusion lives inside the shared analyser and so protects
both, but the mechanism-term half of the divergence stands.

**What none of it has yet is a run that finished.** Eleven levers went in on one book's evidence. The next fresh
run carries all of them and settles, before a reader: chapter titles free of beat names; one
`final_trap`; the reveal contract on the confession chapter; costume phrases ≤ 2 per book; no
narrated backstory label; turn density ≥ 2 of 6 under the stricter rule; and — the two unmeasured
generations of the brevity fix — speeches of ≥ 15 words back above 40, and the banned tag absent.
