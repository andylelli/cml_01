# ANALYSIS_99 — HOW TO GET TO 90

**Opened 2026-09-18. £0 — no run, no LLM call.** Sources: the external-read ledger
(`npm run ledger:external-read`, 64 manuscripts; every review on disk re-parsed by month and by
category), the reader's own uplift clauses in the 16 September reviews, the 24 September manuscripts
measured against the canon figures in WP-001, the prose engine as it stands in code on 2026-09-18
(sizes, blocks, gates, writers, retries, prompt volume), the June redesign (`12_system_redesign/15`)
and what of it was built, A_84 through A_98, WP-001 and WP-002, and this week's bug check (A_96 §5.7).

**This is a plan for a rebuild, and every claim in it is labelled** MEASURED, INFERRED or ASSUMED.
Nothing in it is built. It supersedes the ORDER in A_95 §5 and PLAN-TO-90 §8.5 (not their findings,
which it uses), because both were orderings of levers on a prose stage this document argues has to be
replaced to reach the bar the owner has set: **90, consistently.**

---

## §0 THE ANSWER IN ONE PAGE

**Where we are, MEASURED.** The headline has not moved for two months. August: 20 reads, mean 80.5.
September: 16 reads, mean 80.3. Across those 36 books the standard deviation is 3.6, the floor 74,
the ceiling 86 (twice) with one 87 on a second read. Zero books at 88. In that same window about
sixty flag-gated levers shipped, every one measured, most of them working as specified — and the
mean stayed where it was. Five categories have never been given a 9 in 61 reads: prose (mean 5.9,
never above 8), dialogue (6.6, never above 8), character clarity (6.9), pacing (7.3), opening hook
(7.3). Prose is capped by ONE defect class — "generated / scaffold lines", named in 15 of 15 reviews
— and the lines are ours: A_84 traced every one a reader quoted to a template this pipeline wrote,
and the clue-paste injector fired on 8 chapters of the last completed run.

**What 90 means.** The reader's band: *"Excellent, polished mystery. Strong prose, fair clues, vivid
characters, satisfying reveal, minimal issues."* Arithmetically: every category at 8 or above on every
book, and three or four at 9 — two of which must be prose and dialogue, the two that have never had
one. "Consistently" adds a floor: the worst book of five must clear 88, which today's worst clears by
nothing (76–78 in September). Best-ever-in-every-category stacks to 85, plus the reader's typical +4
to +6, projects to 89–91 — and it has never once co-occurred. **So 90 is not on the current road:
the current road's ceiling is the stack, and the stack is 89.**

**The claim.**

> **The plateau is structural, not a shortage of levers.** Five properties of the prose stage hold
> the mean at 80 and the ceiling at 87, and no flag on that stage changes any of them: it writes
> sentences into the book that the model did not write; it generates the chapter, not the book, and
> hands each chapter the previous ones verbatim to copy from; it instructs through a 31-block
> compliance document the model partly ignores and partly reproduces; its instruments and gates only
> detect defects, so nothing can be selected upward; and it takes one draft per chapter from a model
> whose alignment collapses it to the mode. Consistent 90 requires a prose engine without those five
> properties — a bounded rebuild, not another patch — and the June redesign already specified most of
> it; its foundations are built and unwired.

**The program — Prose Engine v2, seven moves, in order** (§4): delete every deterministic writer and
every abort after prose begins (the floor); make the book the unit of generation, with the full prior
text in context and no STORY-TO-DATE copy channel; replace the 31-block prompt with a generated
per-scene contract and a one-page brief; draft best-of-three and select by instruments that point up;
replace the regex gates with an anchored critic that speaks the reader's vocabulary; test a frontier
model as the drafting writer under the small prompt; and only then add the positive operations
(dialogue as a count, the tail, expertise, stakes, aftermath scope, wit by register) that turn 8s into
9s. Plus a read protocol that can certify "consistently": three reads, median.

**What it costs, INFERRED (§5).** Build: five to seven weeks across three phases, most of it deletion.
Per book: v2 on gpt-4.1 is cheaper than v1 (input volume falls about eightfold); v2 with best-of-three
on a frontier writer is about £3–3.50 a book against £1.15 today. Settlement: ~£12 of runs and ~12
reads over the program, the reads being the scarce instrument.

**What would show it is wrong (§8).** A scaffold-free, injector-free book that still draws prose ≤ 7
twice; a whole-book draft that plants clues worse than chapters do; best-of-three selection that
leaves the read variance where it is. Each has a fallback, named.

---

## §1 WHERE WE ARE — MEASURED

### §1.1 The score, by month

Every review on disk re-parsed (headline from the reader's "As written: NN/100" line; 63 reviews, 62
with a headline):

| month | reads | mean | min | max |
|---|---:|---:|---:|---:|
| 2026-05 | 6 | 62.0 | 48 | 72 |
| 2026-06 | 10 | 63.9 | 52 | 74 |
| 2026-07 | 10 | 76.1 | 69 | 81 |
| 2026-08 | 20 | 80.5 | 74 | 86 |
| 2026-09 | 16 | 80.3 | 76 | **87** (a third read of `story_20260912-1815`, invisible to the ledger until §9.1) |

August and September together: **n = 36, mean 81.2, sd 3.6; 7 of 36 at 85 or above; 0 at 88.** The
canonical ledger (`scripts/external-read-ledger.mjs`) agrees on every book it parses; it takes the
FIRST read in a file and so records the 0912-1815 book at 79, missing the 87 — a defect in the
instrument worth one line of code (§4, M8).

**The plateau is the finding.** July to August was +4.4 marks; August to September was −0.2, on 16
reads, while the levers of A_84 through A_96 shipped underneath. Every one of those levers was
measured at its own instrument and most moved it (register ban 54% → 0% discarded polish; repeat ban
28 of 38 passages stopped; wit density 9.7 → 29.6; turn density 0 → 4 of 6). The reader's mean did not
move. **Levers that move their instruments and not the mark are levers on the wrong layer.**

### §1.2 The categories

Over the 61 reads with a category table (n per row where a category is newer):

| category | mean | max | ever a 9? | cap, in the reader's words |
|---|---:|---:|---|---|
| Premise / concept | 8.05 | 9 | 13 times | — |
| Atmosphere / setting | 7.75 | 9 | 5 | — |
| Opening hook | 7.34 | **9** | **once** (§9.1) | *"solid but slightly abstract"* |
| Plot structure | 7.31 | 9 | once | *"false and real solution blur"* |
| Pacing | 7.25 | 8 | never | *"repeats … suspicion often"* |
| Character clarity | 6.89 | **9** | **once** (§9.1) | *"Nora as first-scene witness/culprit needs firmer handling"*; name collisions |
| Mystery clues / evidence logic | 6.73 | 9 | twice | *"does not yet prove opportunity/location cleanly"* |
| Ending / reveal | 6.69 | 9 | twice | *"repeats the proof after the confession"* |
| Dialogue | 6.59 | 8 | never | *"similar polished aphorisms"*; *"scaffold lines intrude"* |
| **Prose / polish** | **5.92** | 8 | never | *"obvious scaffold/template leakage"* — 15 of 15 reviews |
| Character Life / Relationship Richness (n=17) | 7.12 | 8 | never | *"function mainly as alibi holders"* |
| Humour / Wit (n=1) | 6 | 6 | — | *"uneven and sometimes mechanical"* |

Two of the five never-9 categories are capped by DEFECT CLASSES rather than by quality: the reader's
8s in prose were the books called *"clean of generated lines"*, and the 8s in dialogue were the two
books the reader found witty (A_95 §1). The other three — hook, pacing, character clarity — sit at 8
on the best books and have no single named cause; they are what "vivid characters" and "polished"
mean in the band description.

### §1.3 The reader's own road

Fourteen of the sixteen September reviews end with a sentence of the form *"with X, Y and Z fixed,
this could reach 86–91."* The X, Y, Z, counted:

| the reader's uplift item | reviews | what it is in this pipeline |
|---|---:|---|
| timing / time wording contradicts | 8 | prose compressing locked values; the reader doing the arithmetic (A_90) |
| Chapter 10 as pure aftermath; Ch. 9/10 trimmed | 8 | the reveal residue A_89 B3 and A_94 defend against and A_95 M2 says must be PLANNED |
| scaffold / generated lines removed | 6 | our injectors (A_84), copied sentences (A_94), register sentences (A_95 M1) |
| the mechanism made visual / physically believable / "a real live demonstration" | 5 | A_94 R3 asked for the test as an event; the model explained first |
| a motive dramatised earlier; a relationship deepened | 4 | A_95 M5; WP-002 K2 and K5 |
| a name collision removed ("the double-Adela problem") | 1 | Agent 2's name generator |

**The reader has said what the last ten marks are, fourteen times, and the list has not changed since
A_95 counted it on 2026-09-15.** Every row has a lever built against it; the rows persist because the
levers act on a stage that keeps producing the defect faster than a lever can remove it (§2.2).

### §1.4 The prose against the canon

WP-001 measured 720,000 words of period canon. The same instruments over the 24 September manuscripts:

| | canon (WP-001 §5) | ours, September | gap |
|---|---:|---:|---|
| paragraphs opening on speech | 59.7% | **13.1%** (range 6–28) | 4.6× |
| sentences over 30 words | 10.4% | **5.1%** | half |
| em-dashes per 1,000 words | 6.52 | **0.65** | 10× |
| semicolons per 1,000 words | 4.82 | **1.95** | 2.5× |

The books are still narrated where the canon is spoken, and their sentences still have no tail. Both
gaps are operations the current contract does not ask for (WP-001 O4, O5); neither is a lever this
project has ever flipped.

**INFERRED, and confounded:** over the 33 August–September books with a word count, headline
correlates with length at r = 0.32 (8,477–12,975 words). A longer book has more room for a character
to have a life; it also has more chapters to leak a template. Not a lever; a reason not to make the
books shorter.

### §1.5 The engine as it stands

All MEASURED from the tree on 2026-09-18.

| the prose stage | figure |
|---|---:|
| lines of code: runner + `agent9-prose/` | **33,430** (`agent9-run.ts` 8,796; `generate.ts` 5,130; `prompt-builder.ts` 2,985; `clue-validation.ts` 2,093; `obligation-block.ts` 2,054; `regen-integration.ts` 1,762; `deterministic-repair.ts` 1,211; `lint.ts` 1,137 …) |
| prompt context blocks | **31**, priorities: 13 `critical`, 14 `high`, 4 `medium`, **0 `optional`** — the budgeter's drop tier is empty by construction, so under pressure it drops `medium` and then `high`, i.e. the craft |
| prompt volume | ceiling 56,000 tokens; fixed prefix ~23,600 by chapter 10; obligation contract 2–3k volatile per chapter; STORY TO DATE = every prior chapter verbatim |
| cacheable across chapters | 7.6% (15_llm §5.1) — 80% across retries of one chapter |
| deterministic passes that write or rewrite prose | ~10 exported (`repairWordFormLockedFacts`, the pronoun sweeps, `applyLifecycleContinuityGuard`, `applyVictimReappearanceRescue`, `applyCanonicalVictimRescue`, `repairMalformedSurfacing`, `applyDeterministicProsePostProcessing`, `repairUnanchoredNsdCluesBeforeGate`, the clue paste in `deterministic-repair.ts`, AtmosphereRepair's splice) |
| deterministic writes on the last completed run (95041) | **8 chapters** received *"deterministic CLUE paste: N clue(s) injected as template prose"* (`deterministic-repair.ts:411`); 1 on 50862; 1 on 1358 |
| release-gate reasons / hard stops | 16 / 7 (`agent9-run.ts`) |
| lint issue types driving retries | 7; regen families 12; attempts per batch 3 |
| calls on the last completed project | ProseGenerator ~3 per chapter, Regen 4–7 per flagged chapter, PostPassPolish 3–4 per chapter, Validation 35 — 144 Agent 9 log rows for 10 chapters |
| token spend | prose retries were 96% of the bill when the redesign was written; polish is 26% of run spend, 54% of it discarded before A_95 M1 |
| cost and time | £1.09–1.26 true per book, ~40 minutes |
| flags | 201 read in code, 129 set in `.env.local`; this week's bug check found two pairs that interact wrongly (A_96 §5.7 #1, #6) |
| model | `gpt-4.1` drafts; `gpt-4.1-mini` regenerates; polish on Azure, Claude Opus 5 configured as an alternative and unused |

The June redesign (`documentation/12_system_redesign/15_agent_9_prose_generator.md`) diagnosed this
engine at 5,185 runner lines and wrote: *"Five thousand lines to render a proof that's already been
proven. That number is the symptom."* It is 8,796 now. The redesign's five moves — the chapter as a
contract, no deterministic mutation, a critic and rewrite loop with a best-draft backstop, whole-book
drafting in long context, clean upstream contracts — were built as isolated packages
(`@cml/prose-guard`: `mutateThenValidate`, `BestDraftTracker`, `generateWithBackstop`,
chapter-as-contract) and, per `13_system_redesign/outstanding-redesign-item.md`, **"none wired"** as of
2026-06-22. `mutateThenValidate` has since reached two call sites. The rest of the intervening ninety
days went into levers on the v1 engine.

---

## §2 WHY THE CURRENT ROAD ENDS AT 88

### §2.1 The arithmetic

| | value | source |
|---|---:|---|
| best-ever mark in each of the ten categories, summed | ~~85~~ **87** (corrected, §9.1) | ledger, n=61 |
| reader's offset (headline − sum), mean | +4 to +6 (top books +5 to +8) | this parse and A_95 §0 |
| the stack: best-ever-everywhere plus the offset | ~~89–91~~ **92–93** (corrected, §9.1) | — |
| times the best-ever marks have co-occurred | 0 | — |
| 90 without a first-ever 9 in prose or dialogue | impossible: 8+8 in those two caps the sum at 83 with every other category at its best | — |

A perfect run of the current engine, on its best day, projects to 89. **90 consistently is a different
object: it needs the floor of the distribution above the current ceiling.** A_95 §4 said this in one
line — *"88 is consistency; 90 is a mark never given"* — and then ordered levers on the v1 engine.
Two months of that ordering is what §1.1 measures.

### §2.2 Five structural causes — each MEASURED, each untouched by any flag

**(a) The engine writes sentences into the book.** A_84: all 11 "generated lines" one reader named
were Agent 9 templates; 95 time-value injections in 29 books, 95 of 95 redundant with a value already
on the page; the *"You did it … the proof on the table said the rest"* line is the last line of six
novels, in five of which a confession was already written. WP-001 §4.3 named the ratchet: *three of
six reviewer-named lines were fixes for earlier reviewer-named lines.* The clue paste fired on 8 of
10 chapters of the last completed run (§1.5). The reader's #1 complaint, 15 of 15, is this. No flag
removes it, because the writers exist to guarantee obligations the model is not trusted to meet, and
each guarantee is a template.

**(b) The unit is the chapter, and each chapter is handed the previous ones to copy.** STORY TO DATE
carries every prior chapter verbatim; A_90 §12 measured 16 of 24 copied sentences coming from the
immediately preceding chapter, and A_94 five of six "generated phrases" being the model's own lines
repeated across chapters. The contract collisions this week's bug check found — the reveal on two
chapters, clearances after the arrest, a duplicated beat relabelling the final scene — are all
artifacts of ten independently contracted chapters that never see each other except as text to imitate.
The repeat ban (A_94 R5) suppresses 28 of 38 passages and loses to any competing instruction (A_96 B4):
it is a ban on a channel the architecture keeps open.

**(c) The prompt is a compliance document.** Thirty-one blocks, 27 of them `critical` or `high`,
prohibitions throughout — and the compliance law says prohibitions are outvoted by demonstrations
(A_96 B1: *"She did not elaborate"* ten times from a prohibition that quoted it; *"Six words."* spoken
from an instruction that counted). A_67: illustrative content is reproduced (the act3/sc6 example 45
of 45; the retired schoolteacher 31 of 44). WP-001 §4.2: under budget pressure the engine sheds what
it labelled inessential, and the humour guide reached 0 of 10 chapters on two runs. The 56k ceiling
is self-imposed (`prompt-ceiling-24k-vs-1m-context`), and raising it only makes the wall taller.

**(d) Every instrument points down, and the gates drive retries.** WP-001 §4.1: a category
instrumented only negatively can be driven to zero defects and cannot be driven up. The register
instrument (ρ −0.60) finds machine sentences; nothing finds a good one. Gates that fire on most runs
are off switches (B1), and a retry costs +2.43 register points on the retried chapter (A_75 §16) — the
engine's own correction makes the prose worse, on the only predictor it has.

**(e) One draft, no choice.** WP-001 §8: post-training collapses the model to the mode; premise, the
one stage that generates five candidates and chooses, is the one category with 13 nines. Every prose
chapter is the first answer, and the first answer is the typical one. Verbalized sampling recovers
1.6–2.1× diversity at inference time (Zhang et al. 2025, cited in WP-001 §9) and has never been applied
to a sentence of prose here.

### §2.3 What the flags bought, and what they cannot buy

The levers of A_84–A_96 are not wasted: they are the reason the floor rose from 52 to 74 and the
reason the categories' causes are now named. The register instrument, the wit and turn instruments,
the humour band, the formative incident, the aftermath job, the chronology solver, the alibi plan, the
beat jobs, the repeat ban — every one is a component v2 keeps. What they cannot buy is a change in
(a)–(e), because each was built to compensate for one of them from inside. Twenty-one flags were
registered in the last week alone; the bug check found six defects, two of them pairs of flags that
disagree. **The maintenance cost of the v1 engine is now itself a consistency risk** (A_96 §5.7: the
beat-sequence repair, ON, would have un-made the aftermath chapter of 23 of 65 books).

---

## §3 WHAT 90 REQUIRES — FIVE CONDITIONS, EACH CHECKABLE

| # | condition | how it is checked | today |
|---|---|---|---|
| C1 | **Nothing in the book that the model did not write.** No template sentence, no spliced paraphrase, no frame, no floor. | count of deterministic writes per run = 0; the injector paraphrase registry empty | 8 chapters on the last run |
| C2 | **A run never aborts after prose begins, and never ships a fallback chapter.** | aborts after Agent 9 start = 0; `forced to deterministic fallback` = 0 | 95041 aborted at validation with ten chapters written |
| C3 | **Every category at 8 or above, on every book** — the floor. | the read table; no mark below 8 | September floor: clues 5, prose 5, character 5 |
| C4 | **A 9 in prose and a 9 in dialogue, on the same book, repeatably.** | the read table | never, in 61 reads |
| C5 | **Variance the reader can certify.** Three reads per book, median; five consecutive books with median ≥ 90 and none below 88. | the protocol in §4 M8 | one read per book; sd 3.6 |

C1 and C2 are the floor and are pure engineering. C3 is defect removal plus the operations already
built. C4 is the only condition that needs something no book has had, and it is where the model
question (M6) and the positive operations (M7) go. C5 is the definition of "consistently", and it
costs reads.

---

## §4 THE PROGRAM — PROSE ENGINE v2

Built alongside v1 behind one switch, `PROSE_ENGINE=v2`, so v1 remains runnable and comparable until
v2 has beaten it on reads. The foundations are `@cml/prose-guard` (mutate-then-validate, the
best-draft tracker, the backstop, chapter-as-contract), the instruments (`machine-register`,
`repetition-density`, `wit-density`, `turn-density`), the post-pass polish and the full-story
diagnostic (anchored findings, per-chapter guarded rewrite, rollback). Everything else in §1.5's
table is candidate for deletion, and most of it is deleted.

### M1 — The floor: delete the writers, and never abort after chapter one

*What changes.* Every deterministic pass that writes or rewrites a sentence is removed from the prose
path: the clue paste (`deterministic-repair.ts`), the NSD-anchor floor (`repairUnanchoredNsdCluesBeforeGate`),
the locked-fact floor and its word-form repair, the culprit-evidence sentence, the resolution backstop,
the victim recollection frames (`applyCanonicalVictimRescue`, `applyVictimReappearanceRescue`), the
lifecycle continuity guard's rewrites, the malformed-surfacing repair, the pronoun sweeps (already dead
by config), the AtmosphereRepair splice. What each guaranteed becomes an **anchored edit request** to
the model — *"clue C7 is not on the page in chapter 6; add it as something a character sees or says,
in the paragraph where the detective handles the ledger"* — validated by the same checker, with
`mutateThenValidate`, and on failure **shipped with a WARNING in the run report, never patched and
never aborted.** The validation pipeline's `major > 5 → needs_revision → failure` becomes
`needs_revision → targeted edit → ship with warnings`. The 16 release-gate reasons and 7 hard stops
are triaged: a hard stop survives only where shipping would be a fair-play breach (culprit unnamed;
a clue used that was never planted); everything else reports.

*What is kept.* The checkers. A_73's clearance vocabulary, the clue-presence matcher, the lifecycle
validator, the chronology checks — as DETECTORS whose output is a finding, never a sentence.

*Where.* `agent9-run.ts` (the post-processing and gate sections), `deterministic-repair.ts`,
`repair.ts`, `generate.ts` (the abort path), `pipeline.ts:141`.

*Prediction.* Deterministic writes per run 8 → 0; the reader's word "scaffold" absent from the prose
note; prose ≥ 7 on every book (its cap was the injectors); mean 81 → 83–84; floor 76 → 79.
*Falsifier.* A book with zero deterministic writes and register under 7% that still draws prose ≤ 6 —
then the reader's "generated" means register, not templates, and M4's selection carries the load.
*Cost.* Two weeks, almost all deletion; ~4,000 lines removed; no per-book cost. Settled by a matched
pair on seed 50862 (£0.45) and a read.

### M2 — The unit is the book

*What changes.* The draft is written against the WHOLE outline with the FULL prior text in context —
never a summary, never a NarrativeState hand-off, never a STORY-TO-DATE block to imitate. A short book
is 21,600–30,100 output tokens (15_llm §6.1); `gpt-4.1` emits up to 32,768 in one call and the current
cap is 20,000 (`generate.ts:2847`). Two shapes, chosen by measurement: **one call for the whole book**,
or **act-sized segments** (three or four chapters, 8–11k tokens each) with every earlier chapter in the
context verbatim — the redesign's own fallback (*"segment the write, keep the full prior text in
context"*). Chapter validation stays per chapter; a finding on chapter 6 produces an edit list for
chapter 6 written with the whole book in view.

*What it removes.* `NarrativeState` serialisation and its continuity-drift class; STORY TO DATE and
the copy channel (A_90 §12: 16 of 24 copies from the preceding chapter); the repeat ban list, which
becomes unnecessary; the ten independent chapter contracts and every collision between them (the
reveal on two chapters, the aftermath fighting the scene purpose, clearances after the arrest); the
`describe once` portrait suppression and its pronoun regression (A_96 §5.3), because a model that
wrote chapter 1 does not re-describe a coat in chapter 4.

*Prediction.* Repetition per 10k below the corpus median on every book without a ban; zero
whole-sentence copies; the reader's "Chapter 4 repeats" and "circles the same information" absent;
pacing 8 on every book; input tokens per book down roughly eightfold (three calls of ~50k against
10–21 of ~40k), which funds M4 and M6.
*Falsifier.* Clue placement worse than per-chapter drafting (the clue-presence ledger, chapter by
chapter); then act-sized segments, and if those fail too, the unit stays the chapter and M2 is
withdrawn. Long-output decay in the last act (register rate rising by chapter) — then segments.
*Cost.* Two weeks. Settled by two fresh runs (one whole-book, one act-segmented) read once each.

### M3 — The contract and the brief

*What changes.* Agent 7 becomes the contract author (the redesign §4.1, §4.5): for every scene it emits
`present`, `location`, `time_window` from the chronology, `must_surface` (clue ids with their
observables and, under WP-002 K1, `unlockedBy`), `must_not_reveal`, `eliminations_allowed`, the beat's
job fields (A_95 M6), and the chronology as a TABLE the model can read rather than values it must
recompute. The CML→outline scene-ref join (0 of 45 resolved, A_87) disappears because the outline no
longer points at a coordinate the case invented. The 31 prompt blocks become two things: a **cached
bible** (case, cast, profiles, world, era, chronology — run-stable, paid once) and a **one-page brief**
per book: the humour band and each character's register, the two wit shapes owned by register, the
counts WP-001 O4/O5 ask for (paragraphs opening on speech; sentences over thirty words; em-dashes; one
element that does no job per chapter), and the aftermath scope. **No prohibitions, no worked examples,
no word counts** — the compliance law and A_67 as design rules, not reminders.

*Prediction.* Prompt per call under 12k tokens plus the prior text; craft blocks never dropped (there
is no budget to drop them); the reader's "generated" note gone for the register sentences, because the
brief asks for concrete nouns and people doing things as counts; dialogue share 13% → 30%+; sentences
over 30 words 5% → 8%+.
*Falsifier.* Counts asked for and not delivered on two runs — then the counts are statistics in
disguise and are re-stated as per-chapter acts ("chapter 3 opens on speech").
*Cost.* Two weeks (Agent 7 output schema, the brief builder, deleting `obligation-block.ts` and most
of `prompt-builder.ts`). Rides M2's runs.

### M4 — Best-of-three, selected by instruments that point up

*What changes.* WP-001 O6 applied to prose: three drafts of each segment (or book), selected by a
deterministic score that goes UP with quality — register rate (down is up), repetition density,
dialogue share, tail share, wit density against the band's target, turn density, chronology coherence
— with the ordinal judge used only when the instrument gap is small AND the drafts differ by a class
(it resolves ≥10 marks, PLAN-TO-90 §9; never used for close calls). Per-story register conformance
(WP-001 §6.2a) and contextual predictability (§6.2b) are added to the score as they are built; the
166-work library (A_97) is the calibration set.

*Why it attacks CONSISTENCY specifically.* Selection cuts the lower tail of the distribution without
touching the mean; a floor is a property of the worst draft, and the worst of three is not the worst
of one.
*Prediction.* sd of the headline 3.6 → ≤ 2.5 over the next ten reads; the floor 76 → 82.
*Falsifier.* Variance unchanged across ten reads — then the instruments do not track the reader on the
range that matters and the spend moves to M6.
*Cost.* One week (the scorer, the loop, telemetry); +2 drafts of output per book — on `gpt-4.1` about
£0.35, on Opus 5 about £1.60.

### M5 — The critic replaces the gates, and speaks the reader's language

*What changes.* `lint.ts`'s seven issue types, the twelve regen families and the retry protocol are
retired. In their place, the full-story diagnostic's pattern — a read-only pass over the whole book
that returns ANCHORED findings (a verbatim quote or it is discarded), then one guarded edit per finding
with rollback — extended from its five classes to the reader's own vocabulary: timing arithmetic that
contradicts the chronology table; reveal residue after the confession; a register sentence; a motive
stated as a category; a mechanism explained before it is shown; a name shared or confusable; a
character's pronoun drifting; a clue on the page before its chapter. The reader's uplift clause,
produced before the reader is spent. An LLM cannot rank two books (`rubric-cannot-rank-two-books`) but
it can FIND an anchored defect — the blind reader runs at 8% false veto.

*Prediction.* Retries per book 20–40 → under 8, all substantive; register +2.43 per retry no longer
paid; the reader's timing and Chapter-10 rows (§1.3, 8 reviews each) go to 0–1 of 10.
*Falsifier.* The critic's findings unanchored or wrong more than 10% of the time on a replay of ten
read books — then its classes narrow to the ones that pass.
*Cost.* One and a half weeks. Deletes ~3,000 lines. Per book ~£0.05 on `gpt-4.1` (one whole-book
input pass, a short output).

### M6 — The model question, asked properly this time

*What changes.* With M2–M3 the drafting prompt is small, so the frontier-model multiplier applies to a
small base. Draft with Claude Opus 5 (configured, unused) and with Claude Sonnet 5 under v2, against
`gpt-4.1` under v2, one book each, three reads each. PLAN-TO-90 §0b tested a frontier POLISH on a
v1 draft and found it inert; a frontier DRAFT has never been tested. The 15_llm doc's API differences
(no `temperature`; schema-only JSON; the `AnthropicClient` already in `llm-client`) are the build.
Regeneration and the critic stay on the cheap model; only the writer changes.
*Prediction.* If prose or dialogue gets its first 9 anywhere in this program, it is here: the two
categories are voice, and voice is the writer. INFERRED — no read has ever compared writers.
*Falsifier.* Opus 5 and `gpt-4.1` within one mark on prose and dialogue across three reads each — then
the writer is not the lever and M7 carries C4.
*Cost.* Three days. ~£3.50 a book on Opus 5 (INFERRED from list prices at v2 volumes: three drafts of
~50k in + ~27k out, ≈ $2.80, plus edits); ~£1.00 on `gpt-4.1` v2. Settled by three books and nine reads.

### M7 — The positive operations, on an engine that can carry them

Only after the floor: the levers that turn an 8 into a 9, all countable, all already specified —
WP-001 O1–O5 (the dated origin, one dramatised wound, grammar for individuation, tail counts, one
unforced element); WP-002 K1–K3 (expertise as the clue engine, a social stake per suspect, aftermath
scope) and K5 at `subtext`; A_95 M5 (the dated motive, still not arriving) and M6 (the beat jobs, now
required fields in the contract); the scene inventory diversified (WP-001 §5.4: the canon travels,
corresponds, holds inquests — ours sits in one room), drawn divergently like the premise. On v1 these
compete with a wall of prohibitions for the model's attention and with the budget for a place in the
prompt; on v2 they ARE the brief.
*Prediction.* character life ≥ 8, clues ≥ 8 on every book (K1, M6), ending ≥ 8 (K3), and the
dialogue 9 once wit by register meets a writer that can carry it.
*Cost.* Two weeks across Agents 2, 2b, 3, 5, 7; per book negligible (WP-002 App. B).

### M8 — The read protocol: what "consistently" means, and the ledger that can say it

*What changes.* The acceptance instrument is defined before the first v2 read: **three reads per book,
median; five consecutive v2 books with median ≥ 90 and none below 88.** Reads are the only instrument
that moves the project (CLAUDE.md), the reader is stable to about ±1 on a controlled variant and ±3
across books, and a single read cannot certify a floor. The ledger tool takes every read in a file, not
the first (the 87 it currently misses); the sidecar records the engine version; the read prompt gains
the reader's ten checklist questions as sub-checks (WP-002 K7).
*Cost.* A day. Reads: three per milestone book — the scarce resource, budgeted in §5.

### M9 — Further afield: three things to keep in view, none built first

- **Dialogue-first drafting.** Write each scene as speech and stage direction, then narrate around it —
  the canon's 60% spoken paragraphs are a property of scenes conceived as exchanges. An experiment for
  one book after M2.
- **Register conformance and predictability as the up-pointing instrument** (WP-001 §6.2), calibrated
  on the 166-work library — the score M4 selects by, once it exists. Not a prompt input: canon text in
  a prompt would be reproduced (A_67).
- **A dialogue-only second writer**, or a fine-tuned small model on the canon's dialogue — only if M6
  shows the writer is the lever and the frontier writer is too expensive per book.

---

## §5 THE ORDER, WHAT EACH STEP COSTS, AND WHAT IT SETTLES

| phase | moves | build | runs | reads | settles | headline prediction |
|---|---|---:|---:|---:|---|---:|
| **1 — the floor** | M1, M8 | 2–3 weeks | 1 pair + 1 run ≈ £1.60 | 3 | zero deterministic writes, zero aborts; prose off its cap | mean 83–84, floor 79 |
| **2 — the engine** | M2, M3, M4, M5 | 4–5 weeks | 3 runs ≈ £3.50 | 6 | repetition and copying gone without bans; retries substantive; variance falls | mean 86–88, sd ≤ 2.5, floor 82 |
| **3 — the writer and the 9s** | M6, M7 | 2–3 weeks | 4 runs ≈ £8 (two on Opus 5) | 9 | which writer; the first prose and dialogue 9s | median 88–91 |
| **acceptance** | M8 | — | 5 books ≈ £12 (frontier) or £5 | 15 | five consecutive medians ≥ 90 | **90** |

Roughly £25 of runs and 33 reads over three to four months of calendar, the reads being the binding
constraint at the owner's cadence of two or three a week. The phases are serial: the floor before the
engine, because a v2 book with a template in it would be read as v1; the engine before the writer,
because a frontier model on the v1 prompt was measured inert. **Nothing in phase 3 should be bought
before phase 2 has a read**, and nothing in phase 2 before phase 1 has one.

What each phase deletes is as important as what it builds — §6 is the list — because the deletions are
what make the remaining flags a set small enough to reason about, and this week showed what a set of
201 does to a pair of them.

---

## §6 WHAT TO DELETE, WHAT TO KEEP

| delete | receipt |
|---|---|
| every deterministic prose writer named in M1 | A_84 (11 of 11 reader-named lines ours); the clue paste on 8 chapters of 95041; WP-001 §4.3 |
| `NarrativeState` hand-off, STORY TO DATE, the repeat-ban list, `AGENT9_DESCRIBE_ONCE` | A_90 §12 (copies from the preceding chapter); A_96 B4 (the ban loses to instructions), §5.3 (the pronoun regression) |
| `obligation-block.ts` and the 31-block `prompt-builder.ts` assembly, in favour of the contract + brief | §2.2(c); WP-001 §4.2; A_67 |
| `lint.ts`'s seven retry-driving types, the twelve `AGENT9_REGEN_*` families, the retry protocol | 96% of spend on retries (redesign §3.4); +2.43 register per retry (A_75) |
| the release-gate reasons that are not fair-play breaches; the `major > 5` abort | C2; run 95041's ten lost chapters |
| the scene-ref join and its arbitration (`resolveSceneRef`, `isSceneRefArbitrationEnabled`, M3's reveal-on-DT) | 0 of 45 resolved; the contract makes the coordinate unnecessary |
| the v1 flag set for the prose stage (~90 of the 129), frozen behind `PROSE_ENGINE=v1` until v2 wins, then removed | A_96 §5.7 #1 and #6: flags that disagree |

| keep | as |
|---|---|
| the checkers: clue presence, clearance vocabulary, lifecycle, chronology, geometry, fair play | detectors feeding the critic — never writers |
| the instruments: register, repetition, wit, turn; the A_91 beats telemetry | M4's selection score and the ship-check |
| the post-pass polish with its rollback; the full-story diagnostic | M5's edit mechanism |
| `@cml/prose-guard`: `mutateThenValidate`, `BestDraftTracker`, `generateWithBackstop` | the law and the backstop of the whole engine |
| the humour band, the shapes by register, the formative incident, the beat jobs, the aftermath job, the alibi plan and chronology solver | M3's brief and contract |
| the upstream agents 1–8 as they are, with WP-002 K1/K2 and A_95 M5/M6 added | unchanged in phases 1–2 |

---

## §7 WHAT NOT TO DO — WITH RECEIPTS

- **Another lever on v1.** Sixty in two months, mean 80.5 → 80.3. The instruments moved; the mark did
  not (§1.1).
- **A scrubber, a floor, a frame, a paste** — anything that writes a sentence. Every reader-named
  "generated line" was one (A_84); the last completed run wrote eight (§1.5).
- **A rate, a score target, a density, a level** in any prompt. VoiceSpec; the humour guide; A_95's
  own rule (`prompts-move-operations-not-statistics`).
- **A worked example in a brief.** 45 of 45; 31 of 44; ten of ten (A_67, WP-002 §3.1, A_82 P1).
- **A gate that fires on most runs; an abort after prose begins.** B1; 95041.
- **An LLM judge to rank close candidates.** It resolves ten marks, not five (PLAN-TO-90 §9); use it to
  FIND, never to rank.
- **Buying phase 3 before phase 2 has a read.** A frontier polish on a v1 draft was inert (PLAN-TO-90
  §0b.1); a frontier draft on a v1 prompt would be the same experiment.
- **Reading a v2 book once and calling it consistent.** ±3 across books; three reads, median (M8).
- **Building v2 in place of v1.** Alongside, behind a switch, until it has beaten v1 on the reader's
  table — the UI stream and the corpus stream (A_97, A_98) keep running on v1 meanwhile.

---

## §8 RISKS, AND THE HONEST LIMITS

| risk | what it would look like | fallback |
|---|---|---|
| whole-book drafts decay in the last act | register rate and repetition rising by chapter on the draft; the reveal thinner than the setup | act-sized segments with the full prior text; then chapter-sized with the full prior text — the unit shrinks, the context never does |
| fair play suffers without per-chapter contracts | clue-presence ledger misses rising; a clue used before it is planted | the contract stays per scene inside the whole-book prompt; the critic's "clue before its chapter" finding; a per-chapter check with edit lists |
| the instruments do not track the reader on the range that matters | M4 selection leaves sd at 3.6 | register conformance and predictability (WP-001 §6.2) before more selection; M6 sooner |
| the reader's ±3 swamps a one-mark lever | phase 2 reads inconclusive | M8: median of three, and levers bundled by chapter (CLAUDE.md) |
| the frontier writer costs more per book than the owner wants to pay | £3.50 a book | Sonnet 5 at list is ~1.7× `gpt-4.1`; or Opus for the draft and `gpt-4.1` for two of the three candidates |
| the Claude API differences bite (no `temperature`, schema JSON, caching on Foundry) | build time on M6 | the `AnthropicClient` exists and runs the polish path today |
| the rebuild stalls half-built | v1 and v2 both partly true — the two-directories shape A_98 just cleaned up | the switch: v1 untouched until v2 wins; one engine per book, recorded in the sidecar |
| the reader's band is not reachable at novella length | every v2 book at 86–89 with all categories ≥ 8 and no 9 in prose | then 90 needs a longer book or a different reader, and that is the owner's decision, made on evidence |

**The honest limit.** This document can say with evidence that the current road ends at 88–89, that
the five properties in §2.2 are what hold it there, and that a rebuild without them is where the marks
are. It cannot say that 90 is reachable — no book has had a 9 in prose or dialogue, and the only lever
this project has never pulled for those two categories is the writer (M6). Phases 1 and 2 are worth
doing for the floor alone; phase 3 is the experiment, and its falsifier is written down.

---

## §9 STATUS

| # | move | state | commit |
|---|---|---|---|
| M1 | the floor: no writer, no abort after prose | **BUILT in v2** (`gate.ts`, two fair-play stops); v1's own surgery DEFERRED — see below | `dfb33dbe` |
| M2 | the book as the unit | **BUILT, and its one-call premise REFUTED by the first paid run** — the model writes a CHAPTER per call; the continuation is now a loop and the book stays one contract, one voice, one context | `8e621d77`, `aa674393` |
| M3 | contract + brief | **BUILT** — `contract.ts`, `bible.ts`, `brief.ts`; whole prompt 7,959 tokens against v1's 23,600 prefix | `072073db`, `df94d51b` |
| M4 | best-of-three, selected by instrument | **BUILT and CALIBRATED** — composite ρ 0.571 against register alone 0.502 | `4de418df` |
| M5 | the critic replaces the gates | **BUILT** — anchored findings, edit lists, eight guards | `4046959d` |
| M6 | the writer experiment | **WIRED, not run** — `PROSE_V2_WRITER=anthropic:claude-opus-5` needs a paid run | `dfb33dbe` |
| M7 | the positive operations on v2 | the contract carries the hooks (`unlockedBy`, `standsToLose`, `aftermathScope`); the upstream agents do not emit them yet | — |
| M8 | the read protocol; ledger takes every read in a file | **the ledger is FIXED**; the acceptance definition is §5's table and stands | this commit |

### §9.1 THE LEDGER FIX CHANGED THIS DOCUMENT'S CENTRAL ARITHMETIC

W1 was a ten-line change to `scripts/external-read-ledger.mjs` and it is the most consequential thing
in this session.

`stories/story_20260912-1815/chatgpt-review.txt` holds **three reads of one book** — 79, then 82,
then **87 after repairs** — and every consumer of the ledger took the first. So the highest external
mark this project has ever received was invisible to the ledger, to §0 and §1 of this document, and
to the selector's calibration.

> **CORRECTION, 2026-09-23 (A_101 §10).** The file holds three reads of **two** books, not three reads
> of one. 79 and 82 are reads of a ballet-intermission book whose drafts live in `story_20260911-2112`
> and `story_20260912-1507`; **87 is an as-written read of the Lockwood book in this folder**
> (`canary_1789232316543` — the manuscript's mtime equals its generation time, so not "after
> repairs"). The 87 is real and belongs to this book, so the arithmetic below stands; and taking the
> FIRST read had paired the Lockwood manuscript with the ballet book's 79, so W1 corrected a
> MISPAIRING — which strengthens the rho change rather than weakening it. `story_20260724-1747` has
> the same shape. The ledger is right on both by the owner's habit of pasting the newest read last,
> not by a check (A_101 §9, recommendation 5).


| | as recorded in §1–§2 | corrected |
|---|---|---|
| best external read ever | 86 (twice) | **87** |
| best-ever mark in each category, summed | 85 | **87** |
| categories never given a 9 | five (prose, dialogue, character, pacing, hook) | **three** — prose, dialogue, pacing |
| opening hook | max 8, never a 9 | **9 once** (this book) |
| character clarity | max 8, never a 9 | **9 once** (this book) |

The 87 book's table: premise 9, hook 9, plot 8, character 9, dialogue 8, atmosphere 9, clues 8,
pacing 8, ending 8, prose 8 — sum 84, offset +3, headline 87.

**What it changes.** §2.1 said 90 needs a mark no book has ever received; that stands for prose and
dialogue, which are still capped at 8 in every read. What it corrects is the size of the gap: the
best-ever stack is 87, not 85, so best-everywhere plus the reader's usual offset projects to **92–93
rather than 89**, and reaching 90 needs three of the remaining eight categories at their best rather
than a perfect stack plus the largest offset ever recorded. **The rebuild's case is unchanged and its
target is nearer than this document recorded.**

**What it says about the instruments.** Every correlation in the selector's calibration was being
suppressed by that one misread book: register −0.454 → **−0.502**, dialogue-open +0.291 → **+0.337**,
long sentences +0.241 → **+0.293**, wit +0.187 → **+0.250**, and the composite 0.524 → **0.571**,
which clears the absolute bar §10.6 set and the first run missed. A defect in a ledger is a defect in
every number drawn through it.

### §9.2 WHAT IS BUILT, AND WHAT IS DELIBERATELY NOT

**Built:** `packages/prose-engine` — a pure package with no LLM client, 107 tests, replayed over all
53 archived projects — plus `apps/worker/src/jobs/agents/agent9-v2/` and one switch at the top of
`runAgent9`. Seven environment variables for a whole engine, against v1's ~90.

**Deferred, with the reason — W3 and W4, the surgery on v1.** Phase 1 was written to delete v1's ten
deterministic writers and its post-prose aborts *"because v2 does not exist yet and the floor is
worth having either way"*. v2 now exists and has the floor by construction: it has no writers to
delete and two fair-play stops. Cutting v1's writers today would destabilise the engine that is still
the default, for a book nobody will read, while `PROSE_ENGINE=v2` gets the same floor for free. **The
right order is now: read a v2 book first, and retire v1 whole (W20) rather than repair it.**

**Not built, and not buildable here:** every paid run and every read — W5, W13, W15, W19. The first
one is the matched pair, and it is one command:

```
RESUME_REDO=prose PROSE_ENGINE=v2 node --use-system-ca apps/worker/dist/jobs/resume-run.js <projectId>
```

**Also not built:** W16–W18 (the upstream fields WP-002's kit needs — `unlockedBy` at Agent 5,
`standsToLose` at Agent 2b, the relationship arc at Agent 2). The contract reads all three and says
nothing about them when they are absent, so they are additive whenever the upstream agents emit them.

**The one thing to watch on the first v2 run** was that the writer had never been asked for a whole
book in one call by this pipeline. §8's first row was that risk. **It happened, and not in the shape
predicted.** The run is recorded in PLAN-TO-90 §22.4: azure:gpt-4.1 wrote chapter 1, used 4% of its
cap, was not truncated, and stopped. The signal §8 named — register and repetition rising by chapter
within a draft — would never have fired, and the fallback it named (a smaller cap) would not have
helped, because the cap was never the constraint. The model writes a chapter per call.

The fix is the continuation loop (`aa674393`), which keeps this move's actual claim — ONE contract,
one voice, the whole book in context — and lets the transport take as many calls as the model wants.
**What this move bought is unchanged and what it assumed about transport was wrong.**

**And the instruments preferred the broken book** (§22.5): the 2-chapter manuscript beat the v1 arm
on every rate the selector measures. Not an error in the selector, which compares drafts of one
contract — but a standing warning that `chapters: N of M` is read BEFORE any rate in this document.

The design for every move is §10; the work breakdown with acceptance criteria per item is §10.14.

---

## §10 THE DESIGN — PROSE ENGINE v2, IN DETAIL

This section is the engineering design for §4's eight moves: the laws it is built under, the shape of
the stage, every type it introduces, the four LLM roles and their prompts (as structure, never as
example text), the selector's arithmetic, the critic's vocabulary, the editor's guards, the gate
policy, the providers, the checkpoints, the telemetry, the tests, and the work breakdown with an
acceptance criterion per item. Every interface below names the existing code it plugs into; where a
signature is quoted it was read from the tree on 2026-09-18.

### §10.0 Ten laws, each with its receipt

| # | law | receipt |
|---|---|---|
| L1 | **No deterministic pass writes or rewrites prose.** A checker may find; only an LLM role may change a sentence, and only through an edit list. | A_84: every reader-named "generated line" was ours; the clue paste on 8 of 10 chapters of run 95041 |
| L2 | **Every mutation is validated before it ships**, one edit at a time, with rollback of that edit alone. `mutateThenValidate(value, mutate, validate)` in `@cml/prose-guard/mutate.ts` is the only door. | the pronoun sweep that flipped a correct pronoun; the atmosphere splice (A_96 B3) |
| L3 | **A finding is anchored or it does not exist.** A critic's claim must quote ≥ 8 words verbatim from the chapter it names, or it is discarded and counted. `anchorFullStoryFindings` already does this. | full-story diagnostic (A_69 §5); the blind reader's 8% false veto |
| L4 | **Ship with warnings; never abort after the first draft exists.** `BestDraftTracker` holds the best draft from the first segment on. Exactly two fair-play breaches may stop a run (§10.9). | 95041: ten chapters written, nothing saved |
| L5 | **Operations, never statistics. No prohibitions, no worked examples, no word counts** in any prompt this engine builds. Every ask is a countable act a chapter can perform once. | the compliance law; A_67; A_96 B1/B2; 31 of 44 schoolteachers |
| L6 | **One owner per fact.** The contract is derived from upstream artifacts by pure functions; the prompt is derived from the contract; the checkers read the contract. Nothing in the prose path recomputes a set another module owns. | WF-002; the scene-ref join at 0 of 45; this week's beat-sequence and M3 pairs |
| L7 | **Flags read at call time, default OFF, one master switch** (`PROSE_ENGINE`), and a v2 flag set of at most twelve. | ADR-0004; 201 flag reads on v1 |
| L8 | **Instruments select; gates stop only for fair play.** A check that fires on most books is telemetry. | B1; +2.43 register per retry |
| L9 | **Every LLM call carries a role label** the cost tracker can attribute: `Agent9v2-<Role>-<segment>-<attempt>`. | A_86 items 79–88 |
| L10 | **The `prose` artifact shape is unchanged.** Downstream — story output, the rubric scorer, the UI, the ledger — reads the same `ProseGenerationResult`; v2 adds optional metadata only. | the API/UI alignment surface (13_system_redesign §5) |

### §10.1 The shape of the stage

```
upstream artifacts: cml · clues · outline · profiles · world · era · locations · locked facts · humourLevel
        │
        ▼
 [1] contract.ts     buildBookContract(ctx)  ─────────────►  BookContract { bible, brief, chronology, roles, scenes[], fairPlay }
        │                                                    (pure; tested by replay over the 66 stored projects)
        ▼
 [2] segments.ts     planSegments(contract, writer.maxOutput) ──►  SegmentPlan: whole book | acts | chapters
        │
        ▼                                     ┌──────── k drafts, in parallel ────────┐
 [3] writer.ts       draft(segment, priorText) │ Writer role ×k → parse delimiters     │ ──► Draft[]
        │             CONTINUE on truncation    └───────────────────────────────────────┘
        ▼
 [4] selector.ts     score(draft): fair-play hard gates → instrument vector → (rare) ordinal judge ──► chosen
        │             BestDraftTracker: never empty after segment 1
        ▼
 [5] findings.ts     checkers (anchored by construction) + Critic role (anchored or discarded) ──► Finding[] by chapter
        │
        ▼
 [6] edits.ts        per chapter: Editor role → EditList; apply one edit at a time under mutateThenValidate + guards
        │             ≤ 2 rounds (round 2: fair-play and defect severities only)
        ▼
 [7] gate.ts         two hard stops · everything else a WARNING line · checkpoint · ctx.prose · telemetry
```

**Where it lives.** A new pure package, `packages/prose-engine/` — `types.ts`, `contract.ts`,
`bible.ts`, `brief.ts`, `segments.ts`, `writer-format.ts`, `selector.ts`, `findings.ts`, `edits.ts`,
`gate.ts`, `telemetry.ts` — with no LLM client dependency, so every module is testable against the
archive without a call. It depends on `@cml/prose-guard` (mutate, backstop, the instruments, the
scaffold and anti-copy detectors, `deriveChapterContracts`), `@cml/cml` (`deriveCaseChronology`,
`parseClockTime`, the alibi plan) and the type and builder exports of `@cml/prompts-llm` it needs
(`resolveClueOwnership`, `humourBand`, `selectWitBeat`, `selectDepthBeat`, `beatJobFor`,
`buildOwnedShapeLines`' data, the clue matcher). The worker side is
`apps/worker/src/jobs/agents/agent9-v2/`: `run.ts` (`runProseEngineV2(ctx)`), `roles.ts` (a
`ChatCapableClient` and model per role), `checkpoint.ts`. The switch is the first statement of
`runAgent9` in `agent9-run.ts`:

```ts
if (isProseEngineV2()) return runProseEngineV2(ctx);   // PROSE_ENGINE=v2, read at call time
```

v1 is not touched by phase 2; it is deleted by §6 after v2 has won three reads.

### §10.2 The Book Contract

The contract is the one document every role reads and every checker checks. It is derived, never
authored, and it is the only place a chapter's obligations exist.

```ts
export interface BookContract {
  engine: "v2";
  book: { chapters: number; words: { min: number; max: number } };   // from story_length_policy
  bible: Bible;                 // §10.3 — run-stable, cached
  brief: Brief;                 // §10.4 — one page
  chronology: ChronologyTable;  // rows the model copies, never recomputes
  roles: ChapterRoles;          // { reveal, discriminatingTest, aftermath, falseSolution, clearances[] }
  scenes: SceneContract[];      // one per chapter, in chapter order
  fairPlay: FairPlayContract;   // { culprit, victim, mechanismSummary, decisiveClueIds, revealChapter }
}

export type ChapterRole =
  | "opening" | "investigation" | "false_solution" | "clearances"
  | "discriminating_test" | "reveal" | "aftermath";

export interface SceneContract {
  chapter: number;
  beat: GoldenAgeBeat | null;            // Agent 7's label, after repairBeatSequence
  role: ChapterRole;                     // assignChapterRoles(), §10.2.1
  title: string;                         // stripBeatPrefixFromTitle(scene.title)
  present: string[];                     // cast names; the model may add no one
  location: string; timeOfDay?: string;
  timeWindow?: { from: ClockLabel; to: ClockLabel };   // labels from the chronology table
  mustSurface: ClueSurface[];            // owned here: { id, observable, as, unlockedBy? }
  mayMention: ClueRef[];                 // owned by an earlier chapter: { id, terms, firstChapter }
  mustNotReveal: Withheld[];             // { what: "culprit"|"mechanism"|clueId, until: chapter }
  eliminationsAllowed: Elimination[];    // { name, method } — from suspect_clearance_scenes via ownership
  job: BeatJobFields | null;             // accusedInnocent+flawFound | secondIncident | suspicionShiftsTo | unrelatedLie | consequenceFor
  beats: {                               // rotation by chapter number, deterministic (A_91)
    wit?: { name: string; style: string; shapes: OwnedShape[] };
    depth?: { name: string; trait: string };          // trait clause only (A_96 F9)
    stake?: { name: string; standsToLose: string };   // WP-002 K2, phase 3
    relationship?: RelationshipBeat;                  // WP-002 K5, phase 3, band-gated
  };
  aftermath?: AftermathJob;              // jobs A–E when role === "aftermath"
  words: { preferred: number; floor: number };
}
```

**Derivation, module by module, all pure:**

- `assignChapterRoles(scenes)` (§10.2.1) replaces the v1 scene-ref arbitration and the `revelation
  / discriminating_test / clearance` coordinate joins that resolve 0 of 45 (A_87). It reads only the
  outline's beats and positions.
- `mustSurface` / `mayMention`: `resolveClueOwnership(cml, scenes)` (A_89 B1, exists) gives the first
  owning chapter; a clue required by a later scene is `mayMention` there. The reveal and the
  discriminating test are never retired (A_90 §13), so at those chapters every decisive clue is
  `mayMention` with its terms.
- `mustNotReveal`: the culprit and the mechanism until `roles.reveal`; each clue until its owner.
- `eliminationsAllowed`: `resolveClearanceOwnership` (A_76 §14, exists) by ordinal within act.
- `job`: the beat-job fields Agent 7 already emits under `AGENT7_BEAT_JOB_FIELDS`; absent fields stay
  null and the brief says nothing about them (no invented names).
- `beats`: `selectWitBeat` / `selectDepthBeat` (exist), gated by `chapterCarriesWitBeat(band, n)`;
  the stake and relationship beats arrive in phase 3.
- `chronology`: `deriveCaseChronology(cml, lockedFacts)` (exists) rendered as rows —
  `"<clock as the locked fact spells it>" — <event>` and `"<from>" to "<to>" — <interval> (<length>)` —
  the ONE spelling of every value; `timeWindow` labels reference these rows.
- `fairPlay`: from `culpability`, `hidden_model.mechanism`, the decisive-trace clue ids (`decisive-trace-not-essential`).

#### §10.2.1 Chapter roles — the rule table that replaces the arbitration

| role | rule | v1 behaviour it replaces |
|---|---|---|
| `aftermath` | the LAST scene, iff its beat is `revelation` AND an earlier scene carries `final_trap` | `isAftermathFinalScene` (A_89 B3), kept as the same rule |
| `reveal` | the FIRST `final_trap` scene; if none, the last `revelation` scene that is not the aftermath; if none, the last scene | `revealWinnerSceneNumber` with its five-way fallback (A_87 P4c, A_95 M3, A_96 F10) |
| `discriminating_test` | the `reveal` chapter, unless a scene before it carries `pattern` with a `test`-bearing job field, in which case that scene | `dtClaimStandsFor` and the keyword path |
| `false_solution` | the `false_solution` scene | the archetype by position |
| `clearances` | every `alibis` scene, plus the scene immediately before `reveal` when the outline gives it an elimination | `suspect_clearance_scenes` coordinates |
| `opening` | scene 1 | — |
| `investigation` | everything else | — |

Exactly one `reveal`, at most one `aftermath`, and `aftermath` is never `reveal` — asserted by
construction, not by a belt-and-braces check. Replayed over the 66 stored outlines and the 45
archived (cml, outline) pairs the a87 fixtures hold, the rule must agree with the v1 arbitration's
final answer on ≥ 44 of 45 (the one disagreement, if any, is written down with the outline that
produced it).

**Agent 7 in phase 2 changes nothing**: the contract derives from `sceneNumber`, `beat`,
`characters`, `setting`, `cluesRevealed`, `purpose`, `summary` and the beat-job fields it already
emits. Phase 3 adds `unlockedBy` at Agent 5 (K1) and `standsToLose` at Agent 2b (K2).

### §10.3 The Bible — the cached prefix

Run-stable, assembled once, placed FIRST in every Writer, Critic and Editor prompt so that Azure's
automatic prefix caching and Anthropic's `cache_control` both apply (v1's cross-chapter prefix is
7.6%; the bible is ≥ 90% of a v2 prompt's stable half). Contents, in order, with token budgets that
`bible.ts` enforces by truncating the LAST sections first (never the first four):

| section | source | budget |
|---|---|---:|
| the case: victim, cause of death, the mechanism as the case states it, the culprit and the dated motive, the false solution, the red herrings and their innocent explanations | `cml` | 1,800 |
| the cast: name, role, age, occupation and skill, public persona, private secret, stakes, register style and level, signature tic, formative trait clause, pronouns | `cast` + `characterProfiles` | 2,400 |
| the world: setting, era detail and the anachronism list, the locations that matter with one sensory line each | `setting`, `temporalContext`, `locationProfiles`, `worldDocument` | 1,800 |
| the chronology table and the locked facts, verbatim | `chronology`, `lockedFactRegistry` | 600 |
| the clue register: every clue's id, observable, owner chapter | `clues` + ownership | 900 |
| relationships as content (A_89 D1's form) | `cast.relationships.pairs` | 600 |
| **total** | | **≤ 8,100** |

Sanitisation rules the bible enforces: no schema, no internal field names in prose-facing text, clue
ids only in the clue register and the contract (a checker rejects any id in the prose), locked values
in the spelling the locked fact uses and no other, and nothing that is an example of prose.

### §10.4 The Brief — one page

Generated per book by `brief.ts` from the band, the profiles, the counts, and the contract's roles.
Budget ≤ 1,500 tokens. Its sections, each a list of countable acts:

1. **The register.** The humour band's directive (`HUMOUR_BANDS[level].castDirective`), and per
   character: their style, their tic (grammar, not a phrase — A_91 F3), the one thing they will not
   do. Nothing about frequency.
2. **The shapes, owned.** The flat answer to the understated character, the retort to the sharp one,
   the unmeant joke to the humourless one (A_95 M4's `buildOwnedShapeLines`, data only), placed in
   the chapter's scene of pressure.
3. **The page.** Per chapter, as acts: N paragraphs open on speech (N from the band: 6 at `classic`,
   4 at `dry`); two sentences run past thirty words; two em-dashes; one paragraph that does no job
   (WP-001 O5); every paragraph has a thing in it and a person doing something with or to it (the
   register instrument's four features, stated positively).
4. **The clock.** Every clock value on the page is a row of the chronology table, spelled as the row
   spells it; a character who reasons about time reasons from two rows.
5. **The reader's tests, stated as what the book does.** The reveal is a demonstration a witness
   watches before anyone explains (A_94 R3); after the confession, nothing is proved again; the
   aftermath's jobs A–E (A_86 item 1 + K3); the culprit's motive is one dated act (A_95 M5).
6. **Length**: the chapter's `words.preferred`, once.

Not in the brief, by L5: any prohibition beyond `mustNotReveal`, any worked example, any rate.

### §10.5 Segmentation and the Writer role

`planSegments(contract, writer.maxOutputTokens)`:

```
estimate = chapters × chapter_ideal_words × 1.45          // tokens; short: 10 × 1,000 × 1.45 ≈ 14,500
if estimate ≤ 0.8 × maxOutput      → one segment (the whole book)          // gpt-4.1: 32,768 → 26,200
else                                → segments on act boundaries, ≤ 4 chapters each, in order
```

The v1 cap of 20,000 output tokens (`generate.ts:2847`) does not apply; the Writer's cap is the
model's. Each Writer call carries, in this order: the bible (cached), the brief, the contracts for the
segment's chapters, **THE BOOK SO FAR** — every accepted chapter verbatim, never a summary — and the
ask. The ask names the chapters to write and the output format:

```
=== CHAPTER 4: <title from the contract> ===
<paragraphs separated by blank lines>
=== CHAPTER 5: ... ===
```

Plain text with delimiters, not JSON: a 25,000-token JSON string is where `jsonrepair` earns its five
call sites, and a delimiter parser cannot corrupt a paragraph. `writer-format.ts` parses, asserts the
chapter numbers and order, and returns `ProseChapter[]` (`title`, `paragraphs`; `summary` derived
later by the critic pass, never asked of the writer).

**Truncation is a CONTINUE, never a redraft.** If `finishReason === "length"` or the last chapter is
missing or ends mid-sentence, the engine issues one call with the segment's accepted chapters as prior
text and the remaining chapters as the ask. A_88's finding that an absent `finish_reason` defaults to
`stop` is why `finishReasonPresent` (built) is read here, and why the delimiter count is the primary
truncation test.

**k drafts.** `PROSE_V2_DRAFTS` (default 3) Writer calls per segment, issued in parallel; latency is
one draft's. On Azure the calls share the cached bible; on Anthropic the bible carries a
`cache_control` breakpoint (§10.10). Temperature: the model's default (Claude accepts none); v1's
temperature escalation on retry is gone with the retries.

### §10.6 The Selector

`score(draft, priorText, contract) → { hard: HardGate[]; vector: InstrumentVector; composite: number }`.

**Hard gates**, computed per chapter and summed, each a count not a boolean:

| gate | reads | checker (exists) |
|---|---|---|
| chapters present, numbered, in order | the parse | `writer-format.ts` |
| every `mustSurface` clue present in its chapter | the contract | `chapterMentionsRequiredClue` / `collectEvidence` (clue-validation) |
| nothing in `mustNotReveal` present before its chapter — the culprit as murderer, the mechanism explained, a clue early | the contract | the premature-disclosure detector; `detectCopiedProse` for a clue's spec sentence |
| no clue id, no scaffold token, no template family in the prose | — | `detectScaffoldNotProse`, `detectTemplateLeakage`, `detectEvidentiaryRegister` |
| no one present who is not in `present`, no walk-on with a name | the contract | `anonymiseNamedWalkOns`' detector half, `buildAllowedNameParts` |

A draft with hard failures is ranked below every draft without; it is never discarded (L4). If every
draft fails, the one with the fewest failures proceeds and each failure becomes a `fairplay`-severity
finding for the editor.

**The instrument vector**, per draft, aggregated over chapters (chapter values kept for telemetry):

| instrument | direction | weight | source |
|---|---|---:|---|
| machine-register rate at threshold 3 | lower | 3.0 | `machineRegisterRate` — the only validated predictor (ρ −0.60) |
| repetition per 10k, six-word spans ×3 | lower | 1.0 | `repetitionDensity` |
| copied spans against the prior text | lower | 1.0 | `anti-copy` |
| paragraphs opening on speech, share | higher, to 0.6 | 1.5 | new, trivial (§1.4) |
| sentences over thirty words, share | higher, to 0.10 | 1.0 | new, trivial |
| wit density per 10k against the band's target | closer | 1.0 | `witDensity` + `humourBand().targetPer10k` |
| turn density, chapters 3–8 | higher | 0.5 | `turnDensity` |
| clock values not on the chronology table | lower | 1.0 | `findUnanchoredClockValues` |
| pronoun and name mismatches | lower | 1.0 | `detectAttributionFlips`, `detectVictimBodyPronounMismatch` |

Each instrument is normalised to a z-score against its distribution over the 34 read manuscripts
(constants in `selector.ts`, dated, regenerated by `scripts/selector-calibrate.mjs`), signed so that
"better" is positive, and the composite is the weighted sum. **Calibration is a test, not a hope**
(§10.13): the composite must rank-correlate with the reader's headline over those 34 books at least
as strongly as the register rate alone (|ρ| ≥ 0.55), or M4 does not ship.

**The judge, rarely.** When the top two composites are within 0.25 sd AND neither has a hard failure
the other lacks, the ordinal judge (`scripts/judge-pairwise.mjs`'s prompt, both orderings, one model)
breaks the tie; otherwise it is not called. It resolves ten marks, not five (PLAN-TO-90 §9), so it is
never asked to decide a close call it cannot see. Every judge call is counted in telemetry.

All k drafts, their vectors and the choice are written to the checkpoint, so a later experiment can
read two and ask whether the selector chose what the reader would have.

### §10.7 The Critic role and the finding vocabulary

Findings come from two sources into one list, both anchored:

**Checkers** (deterministic, anchored by construction because they quote what they matched):
`clue_missing`, `clue_early`, `culprit_early`, `mechanism_early`, `clock_off_table`,
`name_collision`, `walk_on_named`, `pronoun_drift`, `victim_alive`, `scaffold_token`,
`register_sentence` (score ≥ 3, the chapter's worst eight — A_95 M1's list), `repeat_passage`,
`copied_sentence`, `clearance_after_reveal`, `reveal_residue_in_aftermath` (evidence-chain and
clearance sentences in the aftermath chapter — A_94's scorer).

**The Critic** (one read-only LLM pass over the whole book, ~30k input, ≤ 2k output, JSON by schema on
Azure structured outputs; `resolveStageModel("polish")` or `PROSE_V2_CRITIC_MODEL`), producing only:
`timing_contradiction` (two clock statements the table cannot reconcile — the reader's top item),
`mechanism_told_not_shown`, `motive_as_category`, `wound_missing` (a character with no life outside
the case in their chapters), `register_named_in_narration` ("her answer was flat"),
`humour_forced`, and the five the full-story diagnostic already owns (`pacing_drift`,
`tonal_escalation_missing`, `motif_abandoned`, `voice_inconsistency`, `flat_reveal`).

```ts
export interface Finding {
  class: FindingClass;                 // the closed enum above
  chapter: number;
  quote: string;                       // ≥ 8 words, verbatim in that chapter, or the finding is discarded
  note: string;                        // ≤ 30 words: what is wrong, in the reader's terms
  severity: "fairplay" | "defect" | "craft";
  source: "checker" | "critic";
}
```

The Critic prompt is the bible, the contract's roles and chronology table, the whole book, the
vocabulary with one-line definitions, and the rule: quote or omit. It is told what the book is FOR
(the contract), not what to dislike. Anchoring uses `anchorFullStoryFindings` (exists); discarded
findings are counted per class in telemetry, and a class whose discard rate exceeds 30% over ten
books is removed from the Critic's vocabulary.

### §10.8 The Editor role and the edit list

For each chapter with findings, one Editor call: the bible (cached), the brief, that chapter's
contract, the whole book as read-only context, the chapter's findings, and the ask — return an edit
list, nothing else:

```ts
export interface EditList {
  edits: Array<{ find: string; replace: string; addresses: number[] }>;   // find: verbatim, ≥ 8 words, unique in the chapter
  cannot: Array<{ finding: number; why: string }>;                         // what it declined to change, and why
}
```

`edits.ts` applies the list **one edit at a time**, cumulatively, each under
`mutateThenValidate(chapter, applyOne, allOf(...guards))` with these guards, every one a function
that exists or is a one-line composition of one:

| guard | rolls back the edit when |
|---|---|
| `lockedValuesIntact` | any locked-fact value (verbatim spelling) present before is absent after |
| `clockValuesIntact` | the set of `extractClockValues` dials changes (A_90's rule, `substitutionChangesClockValues`) |
| `castNamesIntact` | a cast name's count falls, or a name not in `present` appears |
| `clueCoverageNotWorse` | a `mustSurface` clue present before is absent after |
| `noNewScaffold` | `detectScaffoldNotProse` / template families fire on the new text |
| `noMalformedSplice` | `substitutionIntroducesMalformedText` (A_96 F4's patterns) |
| `registerNotWorse` | the chapter's register rate rises |
| `lengthWithin` | the chapter moves more than 15% from its length |

A `find` that does not match exactly once is skipped and counted. Two rounds at most: round 1 for
every finding; round 2 only for `fairplay` and `defect` severities that survive; then the book ships
with the survivors as warnings. There is no whole-chapter regeneration in this loop — a chapter with
a structural hole (missing, truncated) goes back to the Writer's CONTINUE path, which is the only
place prose is written after the draft.

The existing polish pass (`polishPassingChapter`, with the register ban list) is kept as an optional
third step under `PROSE_V2_POLISH`, run after the edit loop with the same guards; its 26% of spend
must earn a measured register move on v2 or the flag stays OFF.

### §10.9 The gate policy and the report

Two hard stops, both fair play, both checked against the contract:

1. the culprit is never named as the murderer in the `reveal` chapter;
2. a decisive clue (`fairPlay.decisiveClueIds`) is absent from every chapter before the reveal.

Both are unreachable when the selector's hard gates and the editor's round 2 have done their work,
and each is reported with the draft that came closest, so a stop is a diagnosis rather than a loss.
Everything else — every v1 release-gate reason, every `StoryValidationPipeline` major — is a
WARNING line in the release-gate report, grouped by class with counts. `pipeline.ts`'s
`needs_revision` no longer fails a run: its majors that are not already findings become round-2
findings; the rest are warnings. The report's first line is the assertion `deterministic writes: 0`.

### §10.10 Roles, providers and models

| role | env | default | alternatives | output | label |
|---|---|---|---|---|---|
| Writer | `PROSE_V2_WRITER` | `azure:gpt-4.1` | `anthropic:claude-opus-5`, `anthropic:claude-sonnet-5` | delimited text, up to the model's cap | `Agent9v2-Writer-S<seg>-D<k>` |
| Critic | `PROSE_V2_CRITIC` | `azure:gpt-4.1` | `azure:gpt-4.1-mini` | JSON by schema | `Agent9v2-Critic` |
| Editor | `PROSE_V2_EDITOR` | `azure:gpt-4.1` | `anthropic:claude-sonnet-5` | JSON by schema | `Agent9v2-Editor-Ch<n>-R<round>` |
| Judge | `PROSE_V2_JUDGE` | `azure:gpt-4.1-mini` | — | one token | `Agent9v2-Judge-S<seg>` |

`roles.ts` resolves `provider:model` to a `ChatCapableClient` — the `AzureOpenAIClient` the run
already holds, or the `AnthropicClient` the polish path already constructs — and to the options each
provider accepts. Claude specifics (15_llm §3): `temperature` is omitted; JSON is by `output_config`
schema or a `strict` tool, so the Critic and Editor schemas are written once in JSON Schema and
rendered for either provider; caching needs a `cache_control` breakpoint after the bible, which is one
optional field on the Anthropic adapter's message builder. On Azure, `responseSchema` (built, R3) is
used for the Critic and Editor instead of `jsonMode`.

Cost per book, INFERRED from list prices at v2 volumes (three drafts of a ~14k-token short book with a
~12k prompt plus prior text; one critic pass; ~6 editor calls):

| writer | drafts (in / out) | critic + editor | total per book |
|---|---:|---:|---:|
| `gpt-4.1` | ~$0.25 / $0.35 | ~$0.25 | **≈ £0.70** |
| Claude Sonnet 5 (list) | ~$0.40 / $0.65 | ~$0.25 | **≈ £1.05** |
| Claude Opus 5 | ~$0.75 / $2.05 | ~$0.25 | **≈ £2.40** |

against £1.09–1.26 true on v1 today. The v1 bill is the prompt (70%) and the retries (96% of tokens at
the redesign's measurement); v2 has neither.

### §10.11 Checkpoints, resume, and the matched pair

`checkpoint.ts` writes `apps/worker/logs/agent9-checkpoint-<projectId>.json` (the existing path
convention, `agent9CheckpointPath`) after every accepted segment and after the edit loop:

```ts
{ engine: "v2", contractHash, plan: SegmentPlan,
  segments: [{ index, drafts: Draft[], scores: InstrumentVector[], chosen: number, judgeCalls: number }],
  findings: Finding[], edits: { applied: number; rolledBack: Record<Guard, number>; skipped: number },
  chapters: ProseChapter[] }
```

Resume skips accepted segments. **`RESUME_REDO=prose PROSE_ENGINE=v2` on a project that ran v1 is the
v1-versus-v2 matched pair** — byte-identical upstream, one prose stage swapped — and it is the first
experiment of phase 2. The `prose` artifact keeps `ProseGenerationResult`'s shape (`chapters`,
`cast`, `status`, `cost`, `durationMs`, `prompt_fingerprints`) and adds optional
`engine: "v2"`, `writer`, `drafts`, `selection` fields; the sidecar `run-params.json` and the
ledger gain `engine` and `writer`, and `ALLOWED_INPUT_KEYS` gains nothing (the switch is env, not an
input).

### §10.12 Telemetry and the ship-check

One `[Agent 9 v2]` block per run in `ctx.warnings` and one `prose_v2_telemetry` artifact:

- `deterministic writes: 0` — asserted, and the run fails its own ship-check if not;
- the drafts table: segment × draft × every instrument, the composite, the choice, judge calls;
- findings: produced / anchored / discarded per class and source;
- edits: proposed / applied / rolled back per guard / skipped (no unique match);
- contract coverage: `mustSurface` present n/N; `mustNotReveal` breaches; roles; chronology
  anchoring;
- instruments against the band's and the canon's targets (wit, dialogue share, tail, register);
- cost per role and wall time per phase;
- the read-back line: every sidecar key with a page-level trace, found or not.

### §10.13 Tests — what must be green before each flag is promoted

| test | fixture | pass condition |
|---|---|---|
| contract replay | the 66 stored projects | `buildBookContract` never throws; one `reveal`, ≤ 1 `aftermath`; every clue owned exactly once; every `timeWindow` label resolves to a table row |
| role agreement | the 45 (cml, outline) pairs in the a87 fixtures | `assignChapterRoles` agrees with the v1 arbitration's final answer on ≥ 44; the disagreement is written into the test |
| bible budget | the 66 projects | ≤ 8,100 tokens by the tokenizer the client uses; sections truncated last-first, never the case |
| brief law | property test over bands × profiles | no prohibition, no quoted example, no rate word (`per`, `%`, `average`), ≤ 1,500 tokens |
| writer parser | delimited fixtures incl. truncation mid-sentence, a missing chapter, a re-numbered chapter | chapters recovered in order; truncation detected by count, not `finishReason` |
| selector calibration | the 34 read manuscripts with headlines | composite rank-correlates with the headline at \|ρ\| ≥ 0.55; every hard gate fires on a known-positive |
| findings recall | the 15 reviewed books, with the reader's named complaints hand-labelled | checkers + critic (replayed) recall ≥ 60% of labelled complaints, ≥ 90% of produced findings anchored |
| edit guards | the A_96 corruptions (`"You; searching"`, `"froze at three past midnight past three"`, `"Nora gaunt"`) as edits | every one rolled back by the named guard; a clean edit applies; a non-unique `find` is skipped |
| gate policy | fixtures with the culprit unnamed / a decisive clue never planted / everything else | exactly the two stop; nothing else does |
| dry run | `PROSE_V2_DRY=1` over a stored project | every prompt built without a call; token sizes within budget; snapshot diffed on change |

### §10.14 Work breakdown, with an acceptance criterion per item

**Phase 1 — the floor** (M1, M8; on v1, because v2 does not exist yet and the floor is worth having
either way)

| # | item | files | days | acceptance |
|---|---|---|---:|---|
| W1 | the ledger takes every read in a file; the acceptance definition written into `PLAN-TO-90` | `scripts/external-read-ledger.mjs`, the board | 1 | the 87 appears; the protocol is one paragraph |
| W2 | `PROSE_ENGINE` switch and `agent9-v2/run.ts` stub that delegates to v1 | `agent9-run.ts`, `agent9-v2/` | 0.5 | a run with `PROSE_ENGINE=v1` is byte-identical |
| W3 | delete the deterministic writers; each becomes an anchored edit request through the existing regen-edit-list path or a WARNING | `agent9-run.ts`, `deterministic-repair.ts`, `repair.ts` | 4 | `deterministic writes: 0` on a resumed 50862; every deleted writer's flag row moved to superseded |
| W4 | never abort after prose begins: `needs_revision → warnings`; hard stops reduced to the two | `pipeline.ts`, `agent9-run.ts` gate section | 2 | a replay of 95041's checkpoint SHIPS with warnings |
| W5 | matched pair on 50862 and one fresh run; three reads | — | — | prose ≥ 7 on both; the reader's word "scaffold" absent |

**Phase 2 — the engine** (M2–M5)

| # | item | files | days | acceptance |
|---|---|---|---:|---|
| W6 | `packages/prose-engine` scaffold, `types.ts`, `contract.ts`, `assignChapterRoles` | new package | 3 | contract replay and role agreement tests green |
| W7 | `bible.ts`, `brief.ts` | new | 2 | bible budget and brief law tests green; dry run snapshot |
| W8 | `segments.ts`, `writer-format.ts`, the Writer role, CONTINUE | new; `roles.ts` | 3 | parser tests green; one whole-book draft of a stored project parses 10/10 chapters |
| W9 | `selector.ts` + `scripts/selector-calibrate.mjs` | new | 3 | calibration test ≥ 0.55; hard gates fire on known-positives |
| W10 | `findings.ts` — checkers adapters + the Critic role + anchoring | new; reuses full-story-diagnostic | 3 | findings recall test green |
| W11 | `edits.ts` — the Editor role, edit-list application, the eight guards | new | 3 | edit-guard tests green |
| W12 | `gate.ts`, `telemetry.ts`, `checkpoint.ts`, the `prose` artifact metadata, sidecar and ledger fields | new; `story-output.ts`, `canary-core.mjs` | 2 | dry run end to end; the ship-check block prints; resume from a segment checkpoint |
| W13 | the v1-vs-v2 matched pair on 50862 (three reads), one whole-book fresh run, one act-segmented fresh run (three reads each) | — | — | v2 ≥ v1 + 2 on the median; repetition below the corpus median with no ban; sd of the three reads ≤ 2 |

**Phase 3 — the writer and the 9s** (M6, M7)

| # | item | files | days | acceptance |
|---|---|---|---:|---|
| W14 | Anthropic Writer: `cache_control` breakpoint, schema JSON for Critic/Editor on both providers | `anthropic-client.ts`, `roles.ts` | 2 | a dry run on each provider builds identical prompts; cached tokens reported > 0 on the second draft |
| W15 | the writer experiment: Opus 5, Sonnet 5, gpt-4.1 under v2, one book each, three reads each | — | — | a decision: which writer per role, written into the board |
| W16 | K1 `unlockedBy` at Agent 5 + the contract's `ClueSurface.unlockedBy`; K2 `standsToLose` at Agent 2b + the stake beat; K3 `aftermathScope` + job E | Agents 5, 2b, 7; `contract.ts`, `brief.ts` | 5 | WP-002's instruments read on the page; the archive probes re-run |
| W17 | WP-001 O4/O5 counts in the brief; the divergent scene inventory at Agent 7 (O6) | `brief.ts`, `agent7-narrative.ts` | 3 | dialogue-open share ≥ 30%, tail share ≥ 8% on the next book |
| W18 | K5 relationship arc at `subtext` (band, pair, beat) | Agent 2, `contract.ts`, `brief.ts` | 3 | its own pair and read (WP-002 App. B (c)) |
| W19 | acceptance: five consecutive v2 books, three reads each | — | — | median ≥ 90, none below 88 |
| W20 | retire v1: the §6 deletion list, the flag rows to superseded, `PROSE_ENGINE` default `v2` | everywhere in §6 | 3 | `flags:check` clean at a v1-free count; the suites green |

Roughly 45 build-days across the three phases, with the reads on the critical path from W5 onward.

### §10.15 Cut-over

v2 becomes the default when W13's medians beat v1's and W19's five books pass; until then every run
records its engine in the sidecar and the ledger, and no read is ever entered without it. v1 is
deleted in W20 as one commit series against the §6 list, each flag row moved to *superseded by v2*
rather than removed — the repo's rule, and the receipt for the next person who wonders why a lever
that once measured well is gone.

