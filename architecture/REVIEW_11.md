# Architecture Review 11 — 86 again, from a different shape, and the ceiling that was not one

**Written:** 2026-08-18 · **Type:** the cold read of the M6 probe run, and what it settles.
Supersedes [REVIEW_10](REVIEW_10.md)'s ordering and corrects two of its findings.
[REVIEW_05](REVIEW_05.md) remains the deep record and the tracker.

REVIEW_10 §10.6 said the M6 probe *"cannot claim a result yet — the external cold read is the
measurement and it has not been taken."* It has now been taken.

> **86/100. The same headline as the best-ever run, from a manuscript whose category profile is not
> the same shape — and `dialogue` came back 8/10, the first 8 in thirty-three external reads.**
>
> **REVIEW_10 §8 wrote its own falsification: *"§1's thesis is wrong if a category exceeds its
> best-ever mark before the 86 shape is reproduced."* It did. The flat six were not a ceiling.**

And the reader named six problems. **Five of them have a cause in the run log, four of those are free
to fix, and three were authored by our own machinery** — one by a prompt-assembly gap, one by a
detector's vocabulary, one by a repair floor aimed at the wrong person. None of that is visible from
the category table.

---

## 1. The score, and what actually moved

**Run `mystery-1786999938275`** · 10 chapters, 11,174 words · `AGENT9_RUBRIC_IN_PROMPT=1` ·
[`stories/story_20260817-2209`](../stories/story_20260817-2209) · [the read](../stories/story_20260817-2209/chatgpt.txt).
Same canary brief as the 08-06 run, so the premise is held.

| category | 08-06 (86) | **08-17 (86)** | Δ |
|---|---:|---:|---|
| premise / concept | 9 | 9 | — |
| opening hook | 8 | 8 | — |
| plot structure | 9 | 8 | **−1** |
| character clarity | 8 | 8 | — |
| **dialogue** | 7 | **8** | **+1 — first 8 in 33 reads** |
| atmosphere / setting | 8 | 8 | — |
| mystery clues / evidence | 9 | 8 | **−1** |
| pacing | 8 | 8 | — |
| ending / reveal | 9 | 9 | — |
| prose / polish | 8 | 8 | — |
| **sum of marks** | **83** | **82** | −1 |
| **headline** | **86** | **86** | — |

**Two different profiles, one number.** The 08-06 run carried four 9s and a 7; this one carries two 9s
and no mark below 8. The category sum went *down* by one and the headline did not move. That is the
third independent confirmation of REVIEW_10 §1's warning — the headline is not the sum, the offset
drifts (+3 there, **+4** here), and "reach 90" carries slack of its own before M1c's ±3 is added.

**Both losses have named causes, and both were detected before the reader saw them.** Clues 9→8 is
X38's arithmetic (§3). Plot 8 and the pacing note are chapter 9 (§7). Neither is new craft ground —
they are two known defects that shipped.

### 1.1 The dialogue ceiling, in the corpus

The full external corpus, `dialogue` only — 33 reads:

```
5/10  ×  8 reads   (05-20 → 06-16)
6/10  × 11 reads   (05-28 → 08-15, with dips)
7/10  × 13 reads   (07-13 → 08-14)   ← REVIEW_09 §1's "never above 7"
8/10  ×  1 read    (08-17)           ← this one
```

And the complaint REVIEW_10 §3 called *"the story"* — *"generated catchphrases"* / *"malformed lines"* —
appears in **the five reads immediately before this one and not in this one**:

| read | headline | dialogue | catchphrase complaint |
|---|---:|---:|---|
| 08-02 | 80 | 7 | ✅ ×2 |
| 08-06 | 86 | 7 | ✅ ×3 |
| 08-07 | 76 | 6 | ✅ ×2 |
| 08-14 | 84 | 7 | ✅ ×2 |
| 08-15 | 78 | 6 | ✅ ×1 |
| **08-17** | **86** | **8** | **absent** |

The reader wrote instead: *"Eleanor's dry wit works well; Sylvia and Hugo have clearer voices"* and, on
prose, *"much cleaner than the weaker drafts, with fewer obvious artifacts."*

**n=1.** One reader, one manuscript, on a number carrying ±2.5 of its own slack. What makes it worth
this much space is §2 — the thing that moved is not the thing we built to move it.

---

## 2. The leak rate did not change, and the complaint went away anyway

REVIEW_10 §10.3 recorded X43's guard failing its own falsification: 6 of 18 fragments came back as
≥5-word verbatim spans, **33% — identical to the 86 baseline** — with the guard verified present in the
prompt of every chapter that leaked. Re-checked here and it stands: the shipped instruction is the
`REGISTER SAMPLE` wording, it is in chapters 1–5 (the only chapters X47 leaves `character_contracts`
in), and the copying happened underneath it.

**So the rate is flat and the reader's complaint is gone. Both are true, and the reconciliation is what
the probe cannot see.** Compare what leaked:

```
08-06 (dialogue 7, "catchphrases still awkward")
  "well that s the way the biscuit crumbles isn t it one"          ← a catchphrase
  "often tells the largest story we must look beyond the obvious"  ← a catchphrase

08-17 (dialogue 8, no complaint)
  "I have nothing to hide"          "that's beside the point"
  "I was on patrol as usual"        "one mustn't jump to conclusions"
```

Same count. **The second set is ordinary English that any mystery contains; the first is a manufactured
verbal signature.** `probe:voice-fragment-leak` measures span length, and span length is not what the
reader was marking. A five-word floor was the right call for a provenance check against a known answer
(REVIEW_10 §9.1) and it is the wrong instrument for the complaint it was built to track.

**X53 — the leak probe needs a conspicuousness term, not just a length term.** **BUILT (§12), and the
separation is cleaner than this section predicted.** Two terms, both measured rather than asserted.
*Length*, as the share of leaked spans at seven words or more:

| read | dialogue | rate (5+ words) | **conspic (7+ words, rare)** |
|---|---:|---:|---:|
| 08-17 | **8** | 33% | **0%** |
| 08-06 | 7 | 33% | 17% |
| 08-14 | 7 | 28% | 28% |
| 08-15 | 6 | 39% | 39% |
| 08-07 | 6 | 50% | 44% |

Monotone in the reader's mark, no overlap between mark bands, and **the one read with no catchphrase
complaint separates to zero** — on a manuscript whose old rate was identical to the 86's. *Rarity* is
the second term and is used only to demote: over 184 corpus books, *"i have nothing to hide"* appears
in **51** of them and *"well that s the way the biscuit crumbles"* in **1**. It cleanly identifies the
very common spans, then bottoms out at one book for real signatures and merely-uncommon phrasings
alike — so it can prove a span is ordinary, never that an ordinary one is a signature, and the probe
uses it in that direction only.

**What actually moved dialogue is not settled.** The candidates are M6's `judged_on` block, present in
chapters 1–7 and naming the dialogue criterion in the writer's own words, or reader variance. Both fit
n=1. What can be said is narrower and still useful: **the run that first carried the rubric block is the
run that first broke the dialogue ceiling, with the mechanism X43 predicted held constant.**

---

## 3. The reader's headline problem is X38, and X38 saw it first — for £0.03

The read's *"Main remaining issue"*:

> *"If the clock ran backward for 20 minutes, why does it show 2:45 when the bell tower says 2:20? The
> clock appears 25 minutes ahead, not simply 'backward for twenty minutes.'"*

`apps/worker/logs/locked-facts-mystery-1786999938275.json`, written by Agent 3b before any prose existed:

```json
{ "id": "clock_face_time_at_murder",   "value": "a quarter to three" }
{ "id": "hotel_bell_chime_time",       "value": "twenty minutes past two" }
{ "id": "pendulum_reversal_duration",  "value": "twenty minutes" }
```

X38 fired on it at Agent 3b, again at Agent 7.5 (as `locked_time_arithmetic`), and a third time at
Agent 9 with **NO REPAIR PATH** — locked facts are contractual and ship verbatim. Three reports, one
run, and the defect reached the reader unchanged.

**This is the cleanest detector-validation event on the board.** A check fired pre-prose at the cheapest
end of the pipeline, and an independent human reader, given only the manuscript, reproduced its
arithmetic in their own words. REVIEW_10 §6 listed X38 as *"built, never met a fresh device"*. It has now
met one, and it was right.

**It also cost a category mark.** Clues went 9→8 externally with this as the stated reason, and the
internal rubric capped clues at 6 for the same contradiction.

**And the page is worse than the reader noticed.** `unaccounted_time` also fired: the prose states the
honest hour **three ways** — the logbook entry reads *"2:00 PM — bell tower chimed"* in chapters 2 and 3,
while chapters 4, 8 and 9 say the bell chimed at *twenty minutes past two*. The reader smoothed this
over as *"bell tower/logbook at 2:20"*. The detector did not.

**The fix is at Agent 3b's authoring**, not at Agent 9's repair: the device must satisfy its own
arithmetic before the values are frozen. That is now the highest-confidence paid item on the board
(§10), because it is the only one where a detector, an internal cap and an external reader all agree.

---

## 4. X44 declined, correctly — and the 86's second named gap is closed

REVIEW_10 §1 argued the shortest route to 90 was *"the 86 run again, plus the two things its reader
named"*, one of which was the two times stated in one line. X44 was built for it, and REVIEW_10 §9.2
worried it might be over-eager.

**It did not fire on this run, and it should not have.** Chapter 8 states *"twenty minutes past two"*
four times and *"a quarter to three"* five times, and puts them in one sentence:

> *"That is the only way the face could show a quarter to three when the bell tower had already struck
> twenty minutes past two. The face was made to lie."*

X44's obligation is satisfied on the page. The reader did not ask for it this time — **their time
complaint moved one level deeper, from presentation to arithmetic.** That is the correct order for it to
move in, and it is the first item on the board closed by a reader rather than by a test.

---

## 5. X48 — the weapon wobbles because chapter 1 was never told what it was

**Agent 7 → Agent 9. Free. MEASURED in the prompt log.**

The reader's first listed problem:

> *"Chapter 1 says heavy brass candlestick, while Chapter 2/3 use heavy bronze statuette. The final
> reveal says bronze statuette. Pick one."*

Correct, and the cause is not a model lapse. Agent 7 logged this:

```
[Agent 7 discovery-tell] body-discovery scene referenced no cause-of-death tell;
  added tell clue "clue_early_physical_wound" (struck with a heavy bronze statuette)
  to the discovery scene.
```

Counting `clue_early_physical_wound` in each chapter's live prose prompt:

| ch | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| clue mentions | **0** | 4 | 6 | 1 | 1 | 1 | 1 | 1 | 1 | 2 |
| "statuette" | **0** | 3 | 8 | 8 | 8 | 8 | 8 | 12 | 9 | 10 |

**The clue reaches every chapter except the one Agent 7 stamped it into** — the only chapter where the
body is discovered and the weapon must be on the page. And chapter 1's prompt still carries the
instruction that assumes it:

> *"…scene is the murder weapon, its physical condition must be OBSERVED here without being named as the
> weapon. Show at least two of: damage to the object consistent with impact; a transfer on it (blood,
> hair, fibre, residue); an injury on the body whose shape…"*

Agent 9 was told to describe the physical condition of an object it was never given, and it did exactly
as instructed with an invented one: *"A heavy brass candlestick, its base smeared with something dark"* —
a transfer on the object, and a head wound on the body. **Two of the required signals, on the wrong prop.**

From chapter 2 the real clue arrives, and the continuity tail carries the invented one alongside it — ch2
holds `statuette ×3` and `candlestick ×2` in one prompt, ch3 holds `×8` and `×2`. The model chose the
statuette both times and the manuscript shipped with two weapons.

**This is not X47.** Chapter 1 has the largest block budget in the book (14,520 shipped into 15,528
available) and dropped nothing.

**CORRECTED WHILE BUILDING (see §12).** This section first guessed at "a prompt-assembly gap — the
injector writes to the outline scene after the chapter-1 clue list is built". The cause is simpler and
exact: `ensureDiscoverySceneMethodTellPresent` looks for the scene whose beat is `"crime"` **first**,
and `GOLDEN_AGE_BEATS` is `["gathering", "crime", …]` — so on every 10-chapter run it stamped the tell
into **chapter 2**. Nothing was lost in assembly; it was written to the wrong chapter, which is exactly
where the prompt log shows the clue arriving.

**Cheapest first-order fix on the board.** One clue, one chapter, one reader complaint, no model change.

---

## 6. X49 — the reveal the reader scored 9/10 was scored `unmet` by our own check

**Agent 7.5 / story-geometry. Free. MEASURED against the shipped chapter.**

The run shipped with this release-gate warning:

```
[Agent 9] geometry reveal_culprit_not_named (ch8): Chapter 8 is the reveal, and no paragraph
  names Hugo Vane as the person who did it. The chapter owes the reader disclosure, not a
  further deferral.
[Agent 9] geometry reveal-repair UNRESOLVED in ch8: regen did not improve the targeted
  property (score 400, was 400).
```

The reader, on the same chapter:

> *"Ending / reveal — 9/10. The reveal is on-page, physical, and emotionally satisfying. Hugo is
> confronted in Chapter 8, the mechanism is demonstrated, the physical cloth clue appears, and he
> confesses."*

**Measured over all 112 sentences of chapter 8: zero contain any `GUILT_MARKER` term.** Not "zero with
the name attached" — zero at all. Three independent reasons, and each alone would have been enough:

1. **`GUILT_MARKER` has no blunt-force verb.** It lists `killed|murdered|strangled|poisoned|stabbed|shot|
   bludgeoned|smothered` — and this case's death method is *"struck with a heavy bronze statuette"*. The
   chapter's disclosure sentence is *"Dr. Finch was struck down with a heavy bronze statuette"*, and the
   regex is blind to it. **`FIRST_PERSON_ADMISSION`, forty lines away, does include
   `struck (him|her|them) down`.** The same act is recognised in first person and invisible in third —
   one side of a comparison fixed and not the other, which is [REVIEW_05](REVIEW_05.md) §6's defect-5
   family exactly.
2. **The disclosure is split by dialogue attribution.** The name is in the narrative sentence (*"She did
   not look away from Hugo Vane as she said it"*) and the accusation is in the quoted sentence beside it.
   `disclosingSentence` is sentence-scoped — which was itself the fix for a paragraph-scoped false
   *positive* the phase-1 backtest caught. The check is now caught between two scopes and neither is the
   one a reader uses.
3. **The confession is elided.** Hugo's admission is *"I tried to reason with her, but she would not
   listen. I—"*, broken off exactly as the genre asks. There is no first-person admission verb to match,
   so `confessionDisclosure` declines too.

**Cost on this run:** two regen calls spent, both UNRESOLVED (400→400), a release-gate warning on the
chapter the reader liked best, and the pipeline's own record of the book asserting the opposite of what
the book does.

### 6.1 CORRECTION — this is not N8's misbinding, and N8 comes off the top of the list

REVIEW_10 §10.4 read the same evidence as a binding failure and escalated on it:

> *"the contract bound chapter 8 but the manuscript discloses in chapter 4. Every reveal check read the
> wrong chapter. **N8 is now the highest-value paid item on the board.**"*

**The reader says the reveal is chapter 8.** Chapter 4 was read in full: it is an interrogation scene
whose only guilt-adjacent phrase is *"the confession he had made without quite making it — that he had
wanted the woman silenced"*, a narrator's summary of a non-confession. It discloses nothing.

So the contract binding was **right**, and the advisory locator that said "chapter 4" is a second
instance of the same vocabulary problem — a heuristic hunting guilt words in a manuscript that does not
use them. **N8's escalation rests on a premise the cold read contradicts.** N8 may still be worth running
on its own merits; it is not the top of the board, and REVIEW_10 §10.4's reasoning for putting it there
is withdrawn.

---

## 7. Chapter 9 — the outline planned the repeat, and our own floor aimed at the wrong person

The reader's second problem, and the pacing note:

> *"Chapter 8 already clears Hale, Beatrice, and Sylvia during the final trap. Chapter 9 then clears them
> again through logs and testimony. It is emotionally written, but structurally redundant."*

Four separate mechanisms produced this, in order.

**1. Agent 7 planned two reveal chapters, and said so.**

```
Beat arc: chapter 8 beat is "final_trap", expected "pattern" (Golden Age order).
Beat arc: chapter 9 beat is "revelation", expected "final_trap" (Golden Age order).
```

The whole arc is shifted one chapter late, so chapter 9 holds the `revelation` beat and ships under the
title **"Suspect Clearances"**. The warning was emitted and nothing consumed it.

**2. The validator caught it four times and the chapters shipped anyway.**

```
Chapters 9  (attempt 1): Stage-mode outcome failed (aftermath_consequence)
Chapters 9  (attempt 2): Stage-mode outcome failed (aftermath_consequence)
Chapters 10 (attempt 1): "The chapter re-runs the evidence chain rather than treating it as settled…"
Chapters 10 (attempt 2): "…this chapter must show consequence and retrospect"
```

Two chapters, two attempts each, all four failing the same gate, all four released. **The gate has an
opinion and no authority.**

**3. `aftermath_repeat` fired once, cleared, and the reader complained anyway.** REVIEW_10 §10.4 recorded
that clear as the 86's first named gap finally closing, with the caveat that the binding might have been
wrong. §6.1 removes the excuse: the checks read chapter 8, which is the correct chapter, and the clear is
simply narrower than what the reader means by "structurally redundant". Chapter 9 re-presents *the same
three clearances from the same three records* — the gardener's log, the front desk, the kitchen schedule
— which the detector does not score as a repeat because the sentences are new.

**4. X50 — the clearance machinery had the detective in its suspect set.**

```
[Agent 9] regen-suspect-elimination UNRESOLVED Eleanor Voss: regen did not improve the targeted
  property (score 300, was 300; still failing: missing_clearance:Eleanor Voss) (injector floor applies).
```

Eleanor Voss is the investigator. [`agent9-run.ts:2189`](../apps/worker/src/jobs/agents/agent9-run.ts#L2189)
excludes detectives like this:

```ts
.filter((c) => String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? '')
  .toLowerCase().includes('detective'))
```

The comment above it records the A_67 fix that made it read both spellings of the key. **The key is not
the problem now; the value is.** Agent 2's own prompt mandates, in three places:

> *"roleArchetype MUST be `"Amateur Sleuth / Civilian Investigator"`"*

which does not contain the substring `detective`. And `??` is nullish-coalescing — `roleArchetype` is
present, so **`c?.role`, the enum whose values are literally `detective|victim|suspect`, is never
reached.** The chain prefers a free-text label over the field that answers the question, and it does so
on every run where `castDesign` is present.

The victim exclusion beside it survives only because Agent 2 is told to set `roleArchetype "victim"` —
the same accident, landing the other way.

**On this run nothing template-shaped reached the page** — the floor found chapter 4's *"the only one
with nothing to hide"* sufficient and declined. The cost was two repair calls spent clearing the sleuth
of a crime nobody accused her of, and an obligation register that is wrong about who the suspects are.

**`AGENT9_FOLD_SUSPECT_CLEARANCES` — built 2026-07-24, default OFF, never probed** — is the designed fix
for the reader's complaint: fold the clearances into the reveal so chapter 9 has none to repeat. It has
been on the shelf through four cold reads that asked for it.

---

## 8. X51 and X52 — the two facts nothing pins, and the clue nothing planted

### 8.1 X51 — the locked-fact registry is device-scoped, and the device is a clock

The registry mechanism **works**. *"A quarter to three"* appears verbatim across five chapters because it
is pinned. But [`agent3b-run.ts:315`](../apps/worker/src/jobs/agents/agent3b-run.ts#L315) populates it
from exactly one source:

```ts
const primaryDevice = ctx.hardLogicDevices!.devices[0];
const rawFacts = Array.isArray(primaryDevice?.lockedFacts) ? primaryDevice.lockedFacts : [];
```

The primary device is a timing trick, so all three locked facts are times. **Every case fact outside the
device is unpinned** — and the two continuity defects the reader found are exactly those facts.

**The weapon** (§5) is not in the registry, so nothing enforced it once chapter 1 invented a second one.

**The alibi locations** are not in the registry, and they drift further than the reader noticed. Hale:

| ch | where Hale says he was |
|---|---|
| 2 | *"I was on patrol, as usual"* |
| 3 | *"I was on my rounds… The lobby was empty"* |
| 6 | *"The staff saw me in the lounge at the relevant time"* |
| 8 | *"I was in the smoking room with two staff"* |
| 9 | *"The staff in the lounge confirm your presence"* |

Four locations across five statements; the reader named three. And Beatrice is worse — *"at the front
desk all afternoon"* (ch3), *"in the kitchen at the relevant time"* (ch4), then **both in a single
sentence** in ch9: *"laying a gloved finger on the kitchen schedule… the staff confirm you never left
your post at the front desk."*

The consistency gate is value-agnostic — a verbatim string check that already warns when a locked value
is missing from the outline. **It would work on `"bronze statuette"` and on `"the smoking room"` today.**
Nothing routes them in. Free, and it closes two of the reader's six items with one change.

### 8.2 X52 — the decisive trace was invented in the reveal chapter

The reader's third problem:

> *"The torn navy wool is useful and concrete, but it appears for the first time in the reveal. Plant it
> earlier."*

**CORRECTED WHILE BUILDING (see §12), and the correction is the finding.** This section first
reported that `navy wool` appears in no prompt before `Agent9-ProseGenerator-Ch8` and concluded that
Agent 9 invented the clincher. The first half is true and the conclusion is wrong. Searching for the
words the *manuscript* uses missed the clue because the *case* uses different ones:

```
clue_late_optional_slot_1  [late/optional]  →  "A torn piece of Hugo Vane's cuff was found caught
                                                on the edge of the private study door frame."
```

It is authored by Agent 5, audited by Agent 6, scheduled by Agent 7, and reaches chapter 8's prompt.
Agent 9 dramatized the cuff as torn navy wool, which is its job. **Nothing was invented.**

**What actually happened is narrower and easier to fix.** `applyPlantBeforeReveal` — the pass whose
whole purpose is "an essential clue's reveal must not be its first appearance" — filters on
`criticality === "essential"`. This clue is labelled **optional**. So the one clue in the book that
puts the culprit physically at the scene is the one clue the planting pass ignored, and it arrived at
the reveal cold.

`clincher_not_planted` could not cover the gap either: it checks *the contract's* decisive trace — the
scoring on the escapement wheel, which **is** properly planted in chapter 1 and paid off in chapter 8.
It is correct about the trace it knows.

So the reader's request is buildable after all, and their staging was right: *"Eleanor notices a snag
on Hugo's cuff in Chapter 4 or 5."* **A clue that places the culprit at the scene is decisive evidence
whatever its criticality label says** — and it must be planted in the mid window, never at the body
discovery, where a culprit-implicating object is not a plant but the answer.

---

## 9. What X47 does and does not explain

REVIEW_10 §10.2 put X47 above everything on the board, including Move 4. It is real — measured, in the
prompt, and unreported anywhere else — and this read does not weaken it. But the cold read is the first
chance to ask *how much of the damage it accounts for*, and the answer is: **one of six.**

| the reader's problem | X47? | actual cause |
|---|---|---|
| time math doesn't add up | ✗ | X38 — the case, authored pre-prose |
| weapon identity wobbles | ✗ | **X48** — ch1 has the largest budget in the book and dropped nothing |
| ch9 repeats clearances | ✗ | beat arc + a released gate + **X50** |
| cloth clue arrives late | ✗ | **X52** — Agent 9 invented it in ch8 |
| alibi locations inconsistent | **partly** | `continuity_context` dropped from ch3 — but **X51** is why nothing caught it |
| ending could be tighter | partly | ch10 is already the shortest chapter (884 words) |

**The chapters are near-uniform in length** — 884 to 1,348 words, no taper — which is its own finding: the
pipeline fills a ten-chapter grid whether or not there is story left. With the reveal at chapter 8, 1,853
words have no job. That is Agent 7's shape (D1), not a prose problem, and the reader prescribed the same
remedy: *"Chapter 8: final trap, clearances, confrontation, confession. Chapter 9: aftermath only.
Chapter 10: optional short epilogue."*

**X47 keeps its place as a prerequisite for reading M6**, since the rubric block reached chapters 1–7 and
`character_contracts` chapters 1–5. It loses its place at the top of the board, because five of the six
things the reader marked down happen in chapters the budget never touched.

---

## 10. The order, re-derived from this read

```
FREE — ALL SEVEN BUILT 2026-08-18 (§12). Every one had a named manuscript, a reader
       sentence, and a log line; four turned out to have a different cause than named here.
 1  X48  the discovery-tell clue reaches every chapter but the one it was stamped into   Agent 7   §5
 2  X49  GUILT_MARKER has no blunt-force verb; the 9/10 reveal scored `unmet`            Agent 7.5 §6
 3  X50  the `??` chain reads the archetype label, never the role enum — the detective
          enters the suspect set on every run with a castDesign                          Agent 9   §7
 4  X51  route the weapon and each suspect's alibi location into the locked-fact
          registry — the pin works, it is only fed by the device                         Agent 3b  §8.1
 5  X52  promote the NSD advisory: prose-introduced decisive evidence is a finding       Agent 7.5 §8.2
 6  X53  give the leak probe a conspicuousness term                                      instrument §2
 7  X47  the prompt budget (unchanged, demoted — see §9)                                 Agent 9   §9

DECISIONS — built, default-OFF, never probed, and this read asked for both
 8  AGENT9_FOLD_SUSPECT_CLEARANCES   fold clearances into the reveal (A_67 change C, 07-24)   §7
 9  D1                                promote the scheduler — the uniform-length grid          §9

PAID — cheapest decisive first
10  X38-at-source  make Agent 3b's device satisfy its own arithmetic before the values
                    freeze. Detector + internal cap + external reader all agree      ~£1.5   §3
11  M6 re-read     after X47, so the block reaches all ten chapters                  ~£1.5   §2
12  CS1            promote @cml/clue-spec                                            ~£1.5
13  R6             eval:baseline --repeats 3                                         £12-24

WITHDRAWN
    N8 as top paid item — REVIEW_10 §10.4's reasoning rests on a locator misfire (§6.1)
```

**Items 1–5 are all free, all first-order, and four of them close a sentence the reader wrote.** That is a
better free block than REVIEW_10's, because all three of that one had to be measured into existence;
these were handed over by a paying reader and confirmed in the log.

---

## 11. What would falsify this document

- **§1.1's dialogue claim is wrong if** the next read returns 7 with the same guard and the same rubric
  block. n=1 on a number with ±2.5 of slack is a lead, not a law — the same standard REVIEW_10 §4 applied
  to X43, which then failed.
- **§2's reconciliation is wrong if** X53's conspicuousness term is built and does *not* separate the
  08-06 leaks from the 08-17 leaks. That would mean the two sets are equally distinctive and the dialogue
  mark moved for a reason not in the fragments at all.
- **§5 is wrong if** `clue_early_physical_wound` turns out to be absent from ch1's prompt by design — e.g.
  suppressed so the discovery scene stays unspoiled. The instruction quoted in §5 argues against it (it
  asks for the object's condition, not its concealment), but the injector's intent should be read before
  the fix, not after.
- **§6 is wrong if** `reveal_culprit_not_named` is widened and the backtest separation degrades — the 68
  must still fire. A vocabulary widening is exactly the change that can turn a false negative into a false
  positive across the corpus, and it gets its own backtest reading before it ships.
- **§6.1 is wrong if** a second read of this manuscript puts the disclosure in chapter 4. One reader said
  chapter 8, in their own words, twice.
- **§9's demotion of X47 is wrong if** the post-X47 M6 re-read moves atmosphere or character clarity.
  Those are the two categories whose inputs die earliest (ch2 and ch4), and neither drew a complaint this
  time — which is weak evidence, since neither has ever drawn one.
- **What still will not get to 90:** more detectors on plot, clues and endings; any single read of any
  story; and treating the headline /100 as the sum of its categories, which it has never once been.

**And the standing rule from REVIEW_09 §7, now with a corollary from §6.1:** no quality claim from a
single scoring — *and no defect claim from a single detector either.* Two of REVIEW_10's findings were
detector output read as ground truth, and the reader disagreed with both.

---

## 12. The free block, as built (2026-08-18)

All seven shipped the day after this review was written. **Three of them changed the review** — §5's
cause, §8.2's whole diagnosis, and §6's reach — and those corrections are in the sections themselves
rather than quietly absorbed, because in two cases the correction is the more useful finding.

**Gates:** `npm test` green across all 18 workspaces, 0 failures · geometry backtest **PASS** with the
separation unchanged (68: 9 violations, 80: 6) · `probe:voice-fragment-leak` reproduces its four
baselines exactly and adds the X53 columns.

### 12.1 X48 — the tell was written to chapter 2, and the beat list says why

Not the prompt-assembly gap §5 guessed at. `ensureDiscoverySceneMethodTellPresent` preferred the scene
whose beat is `"crime"`, and `GOLDEN_AGE_BEATS` is `["gathering", "crime", …]` — so the tell went to
**chapter 2** on every 10-chapter run, while `obligation-block.ts` hardcodes both the body-discovery
and weapon-observation obligations to `chapterNumber === 1`. Those two must name the same scene or the
instruction has no referent. Scene 1 is now preferred and the `crime` beat is the fallback; the warning
names the act, scene and beat it wrote to, because the old message said only "the discovery scene" and
was true of a scene two chapters from the one the prose contract addresses.

### 12.2 X49 — the vocabulary, and an idiom that outlived X27

`GUILT_MARKER` gains blunt force, drowning and beating, **chosen by sweeping all 187 corpus manuscripts
and counting only sentences the old marker did not already match**: `struck…down` fires twice, both
genuine disclosures, zero false positives. Bare `drowned` was rejected on that same evidence — it takes
40+ sentences of *"drowned out by the storm"*, which is X27's defect exactly — so only the agentive
forms are in. `battered` is bounded to a person because this corpus is full of *"the battered logbook"*.

**And the sweep found why the locator said "chapter 4".** X27 stripped `shot a glance` — verb then
noun. Chapter 4's only culprit-plus-guilt sentence was *"the quick glance Beatrice **shot** toward Hugo
Vane"* — the relative-clause order, which survived the strip. Six sentences across the corpus match
that order and **all six are the idiom**. §6.1's correction of REVIEW_10 §10.4 now has a mechanism, not
just a reader's disagreement.

**What it does NOT do, measured:** chapter 8 still scores `unmet`. With the wider vocabulary the
chapter has exactly one guilt-marker sentence — *"Dr. Finch was struck down with a heavy bronze
statuette"* — and it does not name Hugo, because the name sits in the narrative sentence beside it.
§6's other two causes were both built as experiments and both **rejected on evidence**:

- **Adjacency** (name in one sentence, guilt in the next) fires on the 68's chapter 9 — *"Eleanor's
  gaze landed on Hugo Vane…"* / *"…a question only the guilty could answer"* — which is the exact
  clearance-register false positive the phase-1 backtest exists to catch. Restricting it to concrete
  method verbs kills that hit, but then buys **nothing on chapter 8 either** (0 adjacency hits there).
- **The elided confession** (*"I—"*) appears in **56 sentences across 187 manuscripts**, most of them
  innocent characters faltering (*"You think I—"*, *"You can't prove that I—"*). It is not a marker.

So chapter 8's disclosure is genuinely implicit: no sentence in it attributes the act. That is a
narrower and more honest claim than §6 made, and it leaves the "X22 wall" where the code already says
it is.

### 12.3 X50 — the enum was never read, on four call sites

`isDetectiveArchetype` and `roleTextsOf` are new in `@cml/cml`'s `roles.ts`, with `isVictimArchetype`'s
head-noun discipline so *"the detective's landlady"* is not a detective. `roleTextsOf` tests **every**
role field instead of coalescing to the first non-nullish one, which is the whole bug: Agent 2's
mandated `roleArchetype` is *"Amateur Sleuth / Civilian Investigator"*, so `??` stopped there and
`c.role` — the `detective|victim|suspect` enum — was never reached. Swept across all four sites in
`agent9-run.ts`; two of the other three never read `roleArchetype` or `role_archetype` at all and
worked only by luck.

### 12.4 X51 — the registry now carries the weapon and the alibi locations

Built in `@cml/cml` and wired at the **end of `runAgent3`**, not in Agent 3b: the registry is built
before Agent 3 runs, so `CASE.death_method` and the cast's `alibi_window` do not exist yet at that
point, and the novelty-retry path can still replace `ctx.cml` after. On the real 08-17 case it extracts:

```
murder_weapon                     = "a heavy bronze statuette"
alibi_location_captain_ivor_hale  = "the smoking room"
alibi_location_beatrice_quill     = "the front desk"
alibi_location_sylvia_trent       = "the garden lounge"
```

Detective, victim and culprit are excluded — you do not pin an alibi for the corpse, and the culprit's
alibi is the lie the reveal demolishes. **Every value is refused if it parses as a clock time or a
duration**, which is the guard that matters: `checkCaseTimeCoherence` (X38) fires only on two clocks
plus one duration, so locking an alibi *window* rather than its *place* would have switched off the
check that caught this run's largest defect.

One bug found by running it against the real case: the first version took `" in "` only and missed
Beatrice Quill — *"at the front desk"* — who is the worst drifter in the manuscript.

### 12.5 X52 — it was never `essential`, so it was never planted

See §8.2 for the correction to the diagnosis. `applyDecisiveTracePlant` plants culprit-implicating
**physical** clues regardless of criticality, at the latest scene still ≥2 before the reveal and never
in the opening — because a culprit-implicating object in the body-discovery chapter is not a plant, it
is the answer, which is why `ensureDiscoverySceneMethodTellPresent` refuses them there. On the 08-17
shape (reveal at chapter 8) it plants at chapter 6.

### 12.6 X53 — the probe now measures what the reader was marking

See §2's table. The five-word floor stays, because it is the right floor for the provenance question
("are these words in the book?"); seven words is where a reader starts hearing a quotation, and the
corpus is what says so rather than an assertion about English.

### 12.7 X47 — the futility check and the craft floor, behind a flag

Two defects, one flag (`AGENT9_PROMPT_BUDGET_CRAFT_FLOOR`, **default OFF**).

**Futility.** Chapters 8–10 ship 5,499 / 5,737 / 4,723 tokens of context into 2,585 / 2,191 / 378. The
critical blocks alone already exceed what is available, so **no drop sequence can reach the budget** —
and the loop dropped `craft_guide` and `judged_on` anyway. With the flag on, a squeeze that cannot
succeed does not run.

**Which victim.** Within a priority class the loop takes blocks in array order, and array order puts
the flat six's own inputs first. A stable partition now sends the seven craft inputs last in their
class. It is a preference, not immunity: with nothing else left, a craft block still goes.

**Default OFF, and the reason is written in that file twelve lines above the change.**
`buildPromptContextBlocks` already notes that changing which block dies under budget pressure *"is a
real behaviour change under budget pressure, and it is the strongest single reason this sits behind a
flag rather than shipping as a free optimisation."* This changes exactly that, so it takes exactly that
treatment and owes the same before/after.

**The diagnosis is unconditional.** The budget summary now reports `available`, `critical`, `futile`
and `craftFloor` on every call, flag or no flag — so the next run answers "was the squeeze futile, and
what would the floor have kept?" for free. REVIEW_10 §10.2's complaint was that this was *"invisible in
every report because the drop is recorded in one line inside the prompt"*. The line is now worth reading.

### 12.8 What the day did not buy

Nothing here was measured on a live run. X48, X50, X51 and X52 change what reaches Agent 9 and none of
them has met a paid run — the same category REVIEW_10 §6 exists to track, and the same risk. X49's
widening is corpus-measured and backtest-clean but has not repaired a live reveal. X53 changes no
output at all, and X47 is off by default.

**The only claim available today is that seven named defects no longer reproduce on the inputs that
produced them.** Four of the seven were found to have a different cause than this review first gave
them, and that is the part worth carrying forward: every one of those four was corrected by reading a
log or sweeping the corpus, not by reasoning about the code.

---

## 13. The review of the block (2026-08-18)

§12 shipped seven fixes in a day. A review of the last week's diff — the committed range from X29
through M6, plus §12's uncommitted work — found **seven defects, six of them introduced by §12 itself**,
and the one that was not is the most serious.

**Gates after the repairs:** `npm test` green across all 18 workspaces, 0 failures · geometry backtest
**PASS**, separation unchanged (68: 9 violations, 80: 6) · `probe:voice-fragment-leak` unchanged at
17 / 28 / 39 / 44%.

| # | where | defect |
|---|---|---|
| 1 | `accept.ts` (pre-existing, X34) | the attribution regex read only one English word order |
| 2 | `roles.ts` (X50) | the new detective predicate rejected ordinary detective labels |
| 3 | `agent7-run.ts` (X52) | culprit matched by bare `includes()` — "weathervane" |
| 4 | `prompt-builder.ts` (X47) | futility skipped the whole drop loop, so prompts GREW |
| 5 | `probe-voice-fragment-leak.mjs` (X53) | self-exclusion compared a directory to file paths |
| 6 | `case-locked-facts.ts` (X51) | the alibi cap assumed a weapon fact always exists |
| 7 | `agent3b-run.ts` / `agent3-run.ts` (X51) | the artifact was written before the facts were added |

### 13.1 The one that was already shipped: a confession by the wrong person

`ADMISSION_ATTRIBUTION` (X34, shipped 08-14) matched **verb-then-name only** — `said Beatrice Quill`.
English writes the speech tag both ways, and only the covered order had a test:

```
"Hugo Hale stiffened by the window. \"I killed her,\" said Beatrice Quill."   →  unmet  ✅
"Hugo Hale stiffened by the window. \"I killed her,\" Beatrice Quill said."   →  MET    ❌
```

Same paragraph, same confession by the same wrong person, opposite verdicts. This is the FALSE
CERTIFICATION class [REVIEW_05](REVIEW_05.md) §10.1 exists to prevent: a second character's admission
satisfies the culprit's disclosure obligation, and `noResolution` then reaches the judge as false, where
the detector outranks it and nothing downstream can correct it. **Fixed as one regex with two
alternatives**, so leftmost-match returns the attribution NEAREST the admission — the speaker — without
hand-comparing offsets. Six new tests cover both orders for every attribution verb.

### 13.2 Four of §12's own fixes were regressions on their own findings

**X50 reopened X50.** `isDetectiveArchetype` required the role noun to be the FINAL word of its head
segment. That correctly refuses *"landlady of the detective"* — and also refused *"Private detective
hired by the family"*, *"Inspector from Scotland Yard"* and *"Detective with the county police"*, all of
which the `.includes("detective")` it replaced had matched. A detective wrongly readmitted to the
elimination-suspect set is the sleuth cleared of a crime nobody accused them of, which is X50's entire
symptom. Now the noun may sit anywhere in the head, with possessives stripped so *"the detective's
landlady"* still fails. `isVictimArchetype` beside it KEEPS the stricter rule and must: its looseness
once caused a run-killing cascade, and a false victim rewrites a lifecycle where a false detective only
skips a clearance.

**X52 planted a weathervane.** The culprit match was `text.toLowerCase().includes(term)` over the full
name and the surname — no word boundary, no common-word guard. With culprit *Vane*, *"The weathervane
above the stable creaked all night"* read as culprit-implicating physical evidence and was planted as
the decisive trace; *"exhaled"* does the same for a culprit named Hale. The repo already had the answer
— `nameMatcher` (A_61 RC4.4), which this module's package was already importing from.

**X47 made the thing it was fixing worse.** The futility branch skipped the drop loop entirely, so on
the ch8 shape the flag shipped **5,500 context tokens where the old code shipped 4,000** — the chapters
furthest over the ceiling grew, and `humour_guide` and `physical_plausibility` were retained too.
"Stop deleting craft for nothing" is not "stop deleting anything". Futility now suppresses the drop
TARGET, not the drop: the loop still sheds every non-craft droppable block and stops at the craft floor.
Measured after the repair: 4,800 tokens, `craft_guide` and `judged_on` kept.

**X53's self-exclusion never fired.** `resolveStoryPath` returns a DIRECTORY when given one; `corpus()`
holds `.md` FILE paths; `b.path !== selfPath` was therefore never false and every book counted itself.
Since a leaked span is by definition present in the book it leaked into, `books` was inflated by exactly
one for every span — enough to flip any span sitting on the `GENERIC_MIN_BOOKS` boundary. **Fixed, and
the conclusion survives**: the corrected counts drop by one each (51 → 50, 7 → 6, 1 → 0) and the conspic
rates are identical at 17 / 28 / 39 / 44%. Nothing was on the boundary — but that was luck, not design.

### 13.3 The artifact that told the wrong story

Not in the reviewed findings; found by asking what a future audit would see. X51 appends the case facts
at the end of `runAgent3`, and `locked-facts-{runId}.json` is written in **Agent 3b, which runs first**.
So the artifact would have shown the three device clock times and nothing else, and an audit reading it
— which is exactly how X38 and X51 were both diagnosed — would have concluded the weapon and alibi pins
never landed. The writer is now exported and called from both points.

### 13.4 What this says about the day

Six of seven defects were in code written hours earlier, and **four of those six were regressions on the
very defect the fix was for** — X50's predicate reopening X50, X52's matcher planting non-evidence,
X47's floor inflating the prompts it was protecting. That is the shape [REVIEW_05](REVIEW_05.md) §6
names as this codebase's most persistent failure: a fix applied to one side of a comparison, or a rule
tightened past the case it was written for.

The instrument that caught them was not review-by-reading. Every one was confirmed by **running the code
against a concrete input** — a paragraph, a role string, a clue description, a block list — and each is
now a test with that input in it.
