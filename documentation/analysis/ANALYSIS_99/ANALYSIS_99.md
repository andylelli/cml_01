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
| 2026-09 | 16 | 80.3 | 76 | 85 (one 87 on a second read of `story_20260912-1815`, recorded below the first) |

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
| Opening hook | 7.34 | 8 | never | *"solid but slightly abstract"* |
| Plot structure | 7.31 | 9 | once | *"false and real solution blur"* |
| Pacing | 7.25 | 8 | never | *"repeats … suspicion often"* |
| Character clarity | 6.89 | 8 | never | *"Nora as first-scene witness/culprit needs firmer handling"*; name collisions |
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
| best-ever mark in each of the ten categories, summed | 85 | ledger, n=61 |
| reader's offset (headline − sum), mean | +4 to +6 (top books +5 to +8) | this parse and A_95 §0 |
| the stack: best-ever-everywhere plus the offset | **89–91** | — |
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
| M1 | the floor: writers deleted, no abort after prose | not started | — |
| M2 | the book as the unit | not started | — |
| M3 | contract + brief | not started | — |
| M4 | best-of-three, selected by instrument | not started | — |
| M5 | the critic replaces the gates | not started | — |
| M6 | the writer experiment | not started | — |
| M7 | the positive operations on v2 | not started (K1–K3 specified in WP-002; O1–O5 in WP-001) | — |
| M8 | the read protocol; ledger takes every read in a file | not started | — |

**Next item:** M8's ledger fix and the acceptance definition (a day, £0), then M1 on a branch:
`PROSE_ENGINE=v2` switch, the deletion list, the anchored edit request in place of the clue paste,
`needs_revision → ship with warnings`. The first v2 read is the matched pair on seed 50862.
