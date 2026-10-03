# ANALYSIS_110 — The owner's read of the Cliffhaven book: five things a reader needs that the writer was never asked for

**2026-10-03 · £0 · no run · nothing here is built. Part I (§0–§11) is the owner's five points traced to
their causes; Part II (§12–§19) tests every proposal and changes 14 of the 26; Part III (§20–§28) applies
logic, statistics and optimisation to the implementation; Part IV (§29–§36) applies WP-006's kit.**

The owner read *The Fog-Bound Masquerade at
Cliffhaven Hotel* (`stories/story_20261002-2110`, run `run_bcc0d637`, external read 82/100) and found it
"still a bit wooden", naming five things: (1) a good scene-setting at the start, (2) better introductions
of the characters including the victim, (3) people responding to the death, (4) why the characters are
there and what they are to each other, (5) a broader lexicon. This document reads the book and the
external review against those five, then traces each one through the upstream artifacts and the 78 LLM
prompts of the run to the line of code that decided it.

Every claim is labelled **MEASURED**, **INFERRED** or **ASSUMED**. Probes are in `probes/` beside this
file and take a manuscript path, so they can be re-run after each fix.

---

## STATUS

Nothing is built. **Part II (§12–§19, same day) tested every proposal** against the code run from `dist` on
this run's artifacts, the 25 v2 drafts in the prompt log, 64 stored outlines, 233 saved manuscripts and
149 canon openings. Of the 26: **8 stand, 14 are changed, 2 are withdrawn or recommended against, 1 is merged
and 1 was only ever flagged.** The build order is §18, which replaces §9.
**Part III (§20–§28) asks where maths, logic and statistics improve the implementation**: ten methods, eight
prototyped and run. It adds a contract linter (nine invariants, run over 64 projects), a stopping rule for
compliance tests, a noise table saying what one matched pair can decide, a re-standardised selector, three
list-free instruments with floors from the canon, and keyness-ranked editor findings — and it corrects four
more claims (§27, §11).
**Part IV (§29–§36) applies WP-006** (*Decide, estimate, allocate*). Fourteen of its items change the plan.
The table below stands as amended by these:

| row | Part IV amendment |
|---|---|
| W2 | the checker exemption narrows to `abstract_subject`: `register_sentence` fires on 25.5% of canon narration and 0.8% of this book, and goes report-only in v2 (§30.1) |
| L6 | fires at four or more tails per chapter — 3% of canon books, every chapter here (§30.2) |
| **N7** | **step 0, half built** (`60a06430`): the finding now fires; the skip for clock and case phrases is not built, and 43% of its findings sit on clock phrases (§30.3) |
| R2 | cause found: a 600-token prefix budget cut every pair of the detective's; fit all, ordered by need (§30.4) |
| D5 | four lines, not two; the specimen audit is the test (§30.5) |
| M6, L5 | M6 changes 4 of 20 picks; repetition changes none at any weight; L5 becomes an ordering rule (§32.3) |
| L7 | the owner's instrument for point 5; predicts no read (§32.1) |
| P3, P2, W1, D4, M1 | construct the victim's state; `whyHere` beside K2; three-valued W1; allocate after a feasibility check; K6 as the linter (§33) |
| matched pair | three arms, A, A′ with no lever, and B (§32.2) |

| id | item, as it now stands | verdict | works by | step |
|---|---|---|---|---|
| **P3** | **scene 1 is the Gathering its own beat says it is; the body moves to scene 2** — `agent7-narrative.ts:717` contradicts `:118` and has won in 64 of 64 outlines | **CHANGED — now the root fix** | prompt change + an explicit `victimAlive` on the scene | 2 |
| W1 | one where-and-when line in the bible, nothing else | CHANGED (narrowed) | deterministic | 0 |
| W2 | establishing passage in chapter 1 — as layout, with a checker exemption and a selector exemption | CHANGED (three guards) | layout rule; fallback on record | 1 |
| W3 | first-visit description, inside the room's first paragraph | STANDS, same exemption | count of a simple thing | 1 |
| W4 | Agent 7 is told the profiled places; Agent 2c is seeded from where the clues are | CHANGED (closed list would harm) | prompt input | 2 |
| P1 | first appearance: one appositive — occupation and what they were to the dead | CHANGED (lightened) | shape the writer already uses | 1 |
| P2 | `appearance`, `whyHere` upstream; only in the first-appearance contract | STANDS | new fields | 2 |
| P4 | cast-name check | STANDS, low priority (2 of 79 casts) | deterministic | 2 |
| P5 | resolve the culprit mask in page lists AND in job-field values | STANDS, extended | deterministic | 0 |
| D1 | each person present SAYS one thing about the death before any evidence | CHANGED (speech, not body acts) | spoken-line count | 1 |
| D2 | discovery on the page; authority sent for and delayed; they arrive to make the arrest | STANDS, conditioned on detective type | 80 of 80 settings carry the material | 1 |
| D3 | ~~carry the outline's emotional fields into the contract~~ | **WITHDRAWN — would harm** | — | — |
| D4 | no wit beat at the body, the test or the reveal; carriers are people on the page | STANDS | deterministic | 0 |
| D5 | delete the specimens from the custody and aftermath lines; one chapter owns the absence | CHANGED (it is yesterday's fix regressing) | deterministic | 0 |
| D6 | the victim is not a suspect to clear | STANDS — systemic, 24 of 25 runs | deterministic | 0 |
| R1 | plain first, oblique after | MERGED into P1 | — | 1 |
| R2 | all pairs reach the bible | STANDS, low | deterministic | 0 |
| R3 | the story angle owns a scene | flagged, outside the five | — | — |
| L1 | the trait line leaves the bible | CHANGED (halved: upstream half withdrawn) | deterministic | 0 |
| L2 | ~~per-chapter clock ownership~~ | **RECOMMENDED AGAINST** | — | — |
| L3 | cap the long line of the second exchange at forty words | CHANGED (narrowed; "was asked" is one run's tic) | count | 1 |
| L4 | stop ASKING Agent 2b to describe humour in `speechMannerisms`; bible takes the first sentence | CHANGED (source found) | prompt + deterministic | 0 / 2 |
| L5 | overlap-with-the-book as telemetry first, a selector term second | CHANGED (shadow first) | selection | 3 |
| L6 | the tail: a count in the format line, and an editor finding that cuts it | CHANGED (cause half-refuted) | count + deletion edit | 3 |
| L7 | ship-check reports the book-scale numbers; verdict from OUR distribution | CHANGED (canon band would fire on most books) | deterministic | 3 |
| L8 | "chapter" in narration is a construction check; two instruction lines reworded; editor repairs the sentence | CHANGED (the echo list is derived, not extended) | deterministic | 0 |

### As first proposed (Part I) — superseded by the table above, kept for the record

| id | item | where | status |
|---|---|---|---|
| W1 | `worldSection` reads the real artifact shapes; test asserts PRESENCE on archived artifacts | `packages/prose-engine/src/bible.ts:268` | proposed |
| W2 | establishing passage owned by chapter 1: the place before anybody speaks | `contract.ts`, `depth.ts`, `brief.ts:205,218` | proposed |
| W3 | first-visit description of each room (two sentences, once) | `depth.ts` | proposed |
| W4 | Agent 7 picks scene locations from the key-location list | Agent 7 prompt | proposed |
| P1 | first-appearance introduction: who they are to the house, why they are under this roof | `contract.ts` | proposed |
| P2 | Agent 2/2b write `appearance` and `whyHere`; `ageRange` is passed | Agent 2, 2b; `bible.ts:239` | proposed |
| P3 | the victim alive in chapter 1 — the two before-death scenes move from chapter 4 to the opening | Agent 7; `contract.ts` | proposed (structural) |
| P4 | cast names: no shared first name; a shared surname needs a declared kinship | Agent 2 validation | proposed |
| P5 | the culprit mask ("the mysterious guest") resolves to a person who is on the page and introduced | `contract.ts` | proposed |
| D1 | reaction owed per person present, as an act, in the discovery chapter | `contract.ts` | proposed |
| D2 | the discovery on the page; authority sent for; isolation is why an amateur proceeds | `contract.ts`; setting | proposed |
| D3 | the outline's `emotionalRegister`, `conflict`, micro-moment reach the contract as acts | `contract.ts` | proposed |
| D4 | obey the humour map (no wit beat at the body, the test, the reveal); never assign a beat to someone off the page | `contract.ts`, `humour-move.ts` | proposed |
| D5 | the aftermath carries the VICTIM's absence, not only the culprit's | `brief.ts:256` | proposed |
| D6 | the victim is not listed among suspects to clear | `contract.ts` | proposed |
| R1 | plain statement first, oblique exchange after | `contract-phrases.ts:30` | proposed |
| R2 | every pair involving a person on the page is available to that chapter | `bible.ts` | proposed |
| R3 | the story angle owns a scene (smuggling ×2, cove ×0 on the page) | Agent 7 | flagged, outside the five |
| L1 | the "one thing about them" trait leaves the bible; one chapter owns it, pre-rendered as an act | `bible.ts:262`; Agent 2b | proposed |
| L2 | per-chapter clock ownership (27 clock rows reach every call) | `bible.ts:324` | proposed |
| L3 | the two-exchanges template is reshaped or retired ("was asked" ×25) | `brief.ts` TWO EXCHANGES | proposed |
| L4 | `speechMannerisms` labels become moves (as P4.2 did for the Humour line) | `bible.ts:252` | proposed |
| L5 | selector term: novelty of a draft against the book so far | `selector.ts` | proposed |
| L6 | the body-part tail: a count instead of "what the speaker does comes after the words" | `writer-format.ts:140`, `brief.ts:218` | proposed |
| L7 | ship-check gains the book-scale lexicon numbers and the tail rate, with canon bands | `agent9-v2/ship-check.ts` | proposed |
| L8 | instruction-echo list gains the eight lines that got through | `instruction-echo.ts` | proposed |

---

## 0. Provenance

**MEASURED** from `data/store.json` (project `proj_5eb8c115-ca42-4e66-997d-74fff1b327db`) and
`logs/llm-prompts-full.jsonl` (78 records for the run).

- **Run** `run_bcc0d637-0506-4314-908a-21c89d941c49`, a UI run, 2026-10-02 19:54–20:09 UTC (927 s).
- **Spec**: 1930s · SeasideHotel · tone Dark · theme empty · **story angle "a smuggling run on the coast"** ·
  cast size 5 · amateur detective · **axis identity** · length short · humour classic · batch size 1.
  The seed is not in the spec (UI run).
- **Cast**: Eleanor Gresham (detective, retired schoolteacher), Reginald Gresham (victim, hotel owner),
  Reginald Gresham Jr. (false suspect), Agatha Pemberton (family lawyer), Charles Fenwick (hotel manager),
  Isabel Morton (culprit, fisherwoman and smuggler).
- **Engine**: v2, chapter per call, writer `gpt-4.1` T=0.7, three drafts per chapter and a selector (42
  writer calls, 12 of them retries), one critic call, 16 editor calls.
- **Gate**: shipped, 0 hard stops, 10 warnings; internal score 95.83.
- **External read**: 82/100 (`chatgpt-review.txt`). Atmosphere 9, character clarity 8, character life 8,
  hook 8, prose 6.
- **Book**: 10 chapters, 12,607 words.

---

## 1. The finding

**The five are one fault.** The writer is briefed, completely and precisely, to *prove a case*: 23 evidence
placements, 27 clock values, a test, a confession. It is not briefed to *tell a story to somebody who has
never met these people or seen this place*. Each of the five things the owner asks for is a thing the
pipeline wrote upstream, did not send, and in four of the five cases instructed against.

| # | the owner asks for | on the page (**MEASURED**) | upstream had | the writer was sent | the instruction that worked against it |
|---|---|---|---|---|---|
| 1 | scene-setting at the start | 0 paragraphs of description in 201; year, village, country never named; 0 of 12 nouns of the hotel's description | 2,557 words of location profile: Mevagissey, whitewash, slate roof, the winding road, the iron sign | **50 words** in the whole book; no where-and-when at all | "each once and **in passing**"; "Every paragraph has … a person doing something" |
| 2 | introductions, including the victim | schoolteacher 0, fisherwoman 0, owner 0; no age or feature for anybody; the victim is first seen as "Reginald Gresham's body" | occupations and personas for all six; ages; no appearance field exists | persona, secret, stakes (not ages) | "shown **never explained**"; the victim "as the body, **as an object handled**" |
| 3 | people responding to the death | grief 0, tears 0, shock 0, "dead/death/died" **1** in 12,607 words; police never sent for; the son's first line over his father is about a ledger | outline scene 1: "Shock and grief at the brutal stabbing"; "react with shock" | none of it — the contract reads no summary, conflict or register field | a wit beat assigned to the discovery chapter, where the humour map says *forbidden* |
| 4 | why they are there, what they are to each other | "father" first appears in chapter 3; hotel ownership never stated; Eleanor's reason for being there never stated | 11 relationship pairs, each with a shared history | 8 of the 11, to the writer only | "One exchange between them carries it, and **neither names it**" |
| 5 | a broader lexicon | repeated 4-grams 610 per 10k against a canon median of 32; top-20 words 9.5% of the book against 6.1% | — | 27 clock rows, five trait labels and the humour labels in every call; the whole book so far "for voice" | "written the same way every time it appears" |

Three things follow from the table and are argued below.

1. **The model obeyed.** Where it was given 50 words of place it printed all 50, most of them more than
   once. Where it was told "in passing", "never explained", "neither names it", it did exactly that. The
   woodenness is compliance. That is good news: the levers work.
2. **The rules that produced it were written to cure label-printing** (`17-hitting-90/07`, A_96 F9, P4.2) —
   and they over-corrected. A rule that stops the writer *explaining a backstory seven times* also stops
   it saying once that the dead man owned the hotel.
3. **The external reader does not score any of this.** The same book that has no description of the hotel
   was given 9/10 for atmosphere. The five need their own instrument (§8).

---

## 2. Scene-setting — "a really good description of the location and surroundings"

### 2.1 What the page has — MEASURED

The book opens on a spoken line about a ledger: *"Well, that's a curious thing," Eleanor Gresham remarked,
her gloved fingers hovering above the open ledger book on the battered desk inside the Cliffhaven Hotel's
lobby.* The reader is never shown the hotel from outside, the road to it, the bay, the village, the season
or the year.

| on the page | count |
|---|---|
| paragraphs with no person in them (pure description) | **0 of 201** |
| chapters that open on a spoken line | 9 of 10 as saved, **10 of 10 as drafted** |
| Mevagissey · Cornwall · England · any year · any season | 0 · 0 · 0 · 0 · 0 |
| whitewash · slate · wrought-iron · mullioned · oak · wallpaper · gas lamp · gull · gorse · cove · foghorn · road | 0 each |
| "fog" · "cliff" · "bay" | 65 · 25 · 15 |

The setting is one word said 65 times. Five other recent v2 books open **49 of 50** chapters on a spoken
line, so this is the engine and not this run.

### 2.2 What the pipeline had — MEASURED

Agent 2c wrote 2,557 words about the place. The primary profile alone:

> A multi-storey stone building with peeling whitewash, narrow mullioned windows fogged by sea mist, and a
> slate roof darkened by salt spray; a narrow winding road ascends to the entrance beneath a faded
> wrought-iron sign swinging in the wind.

It names the place (**Mevagissey, England**), gives four paragraphs on the building, the lobby (dark oak
panelling, gas lamp, faded floral wallpaper), the isolation (miles from town, a slow coastal train, a
party-line telephone), and two on the weather. Agent 2d fixed the date: **15 January 1934**. Four key
locations each have a 38-word visual, three time-of-day variants and two paragraphs.

### 2.3 What the writer was sent — MEASURED

**(a) No where-and-when. In any run.** The bible has a section for it, `THE WORLD`, built by
`worldSection` (`bible.ts:268–296`). Over every v2 run in the prompt log — **27 runs, 639 writer calls** —
its entire content was:

```
## THE WORLD
Where and when: [object Object].
```

in 26 runs, and in this run, after the 2026-10-02 fix (`7501ebf9`, `CML_VERIFIED_FIXES`), the section is
absent. `probes/world-section-probe.mjs` prints the table. Six reads in that function and each misses the
real artifact:

| the code reads | the artifact has |
|---|---|
| `setting.location` / `.place` / `.setting` | `ctx.setting` is Agent 1's result `{ setting: { location: { type, description, … } } }` — the key that hits is `setting`, an object |
| `setting.era` / `temporal.era` | `setting.setting.era.decade`; `temporal.specificDate.{year, month, day}` |
| `setting.mood` / `.atmosphere` / `.tone` | `setting.setting.atmosphere.mood` |
| `world.historicalMoment.summary` / `.description` / `.moment` | `specificDate`, `eraRegister`, `currentTensions`, `physicalConstraints`, `emotionalRegister` |
| `locationRegisters[].register` / `.sensoryRegister` / `.description` | `emotionalRegister`, `eraNote`, `cameraAngle` |
| `locations.profiles[]` | `primary`, `atmosphere`, `keyLocations[]` — there is no `profiles` |

The fix replaced a garbage line with no line. Its test (`verified-fixes-brief-82094.test.ts:28–34`) asserts
that `[object Object]` is **absent**; nothing asserts that a place is **present**. The writer of every v2
book has known the setting only from the chapter's `Where:` label.

**(b) Fifty words of place, for the whole book.** The per-chapter place note
(`contract-phrases.ts:26`, "Of this place at this hour, each once and in passing") carried:

| ch | the place note | words |
|---|---|---|
| 1 | muffled footsteps on weathered stone | 5 |
| 2 | faint scent of stale tobacco smoke | 6 |
| 3 | fog-wreathed bay vistas; low murmur of conversation | 7 |
| 4 | dim yellow light from bare bulb; drip of water from ceiling | 11 |
| 5 | — | 0 |
| 6 | glossy varnished table surfaces; clink of cutlery on china | 9 |
| 7 | — | 0 |
| 8 | — | 0 |
| 9 | heavy velvet curtains drawn tight; soft scrape of chairs on wooden floor | 12 |
| 10 | — | 0 |

50 of 2,557 words: **2%**. Every one of the twelve fragments is on the page, and eight of the twelve
appear two to four times ("drip of water" ×4, "clink of cutlery on china" ×3). The count "once" was not
kept; the content was. *The writer described the place exactly as much as it was handed.*

**(c) Four chapters got no note because the outline's rooms have no profile.** Agent 2c profiled the
lobby, the dining room, the cellar and the hidden cove. Agent 7 set scenes in a ledger room, a lounge, a
study, an office and on the cliffside — five of ten scenes in rooms nobody described. The **hidden cove**,
the one profiled location that belongs to the story angle, has no scene.

### 2.4 The instructions that forbid an establishing passage — MEASURED

- `brief.ts:218` — "Every paragraph has a thing in it somebody could touch, and a person doing something
  with it or to it." Obeyed 201 times in 201.
- `brief.ts:205` — "6 paragraphs in each chapter begin with a spoken line", and the selector's calibration
  rewards dialogue-open share (`selector.ts`, ρ +0.337). Every chapter therefore opens on speech.
- `contract-phrases.ts:26` — "in passing".
- The outline's own `setting.atmosphere` ("Chilling and eerie, fog envelops the cliff edge") and scene
  summary ("Eleanor Gresham **arrives** at the fog-shrouded cliffside to find…") are not read by the
  contract. `grep` over `prose-engine/src`: `summary` and `purpose` are read only by `roles.ts:103,109`,
  to classify the scene.

### 2.5 Why the reviewer gave it 9 — INFERRED

The review praises "fog, cliffside hotel, ledger, cellar, fishing knife" as "very cohesive". It is scoring
the coherence of the setting's *nouns*, which is real. It is not scoring whether the place was ever shown.
`04_review-weaknesses.md` §2 records atmosphere at 9 in three of four reads. A mark that is already 9 will
not move when the description arrives, so the reviewer cannot settle this item.

### 2.6 Proposals

- **W1 — fix `worldSection` against the real shapes**, and write its test over archived artifacts paired
  by projectId, asserting presence: the place's name, the village, the month and year. One line is enough:
  *Where and when: Cliffhaven Hotel, on the cliffs at Mevagissey, England; January 1934, winter.*
- **W2 — an establishing passage owned by chapter 1.** Asked for as a count of a simple thing and a
  format, which is what this model keeps: *"The chapter opens on the place before anybody speaks. The
  first two paragraphs have nobody in them: the road up, the building from outside, the water below, the
  hour and the weather. The first quotation mark of the chapter is in the third paragraph or later."* The
  material is the primary profile's `visualDescription` and its first two paragraphs, given as nouns to
  use, each once in the book. Those two paragraphs are exempt from `brief.ts:205` and `:218`, and the
  selector must not count them against dialogue-open share.
- **W3 — a first-visit description.** The first chapter set in a key location gets that location's
  `visualDetails` (38 words) as two sentences before anything is done in the room. Owned by that chapter;
  later chapters there keep the one-note rule.
- **W4 — Agent 7 chooses `setting.location` from the key-location list**, a closed list, which is a format
  the model obeys. Or Agent 2c runs after the outline and profiles its rooms. The first is cheaper.

---

## 3. Introductions — "a better introduction to the characters including the victim"

### 3.1 What the page has — MEASURED

The first sentence each person gets:

| person | first mention | what the reader is told |
|---|---|---|
| Eleanor Gresham | ch 1, line 1 | gloved fingers, a ledger. Not that she is a retired schoolteacher, a guest, or no relation |
| Reginald Gresham Jr. | ch 1, line 1, as a name in a ledger | "his last gambling loss". Not that the dead man is his father — that arrives in **chapter 3**, in the possessive "his father's meal" |
| Agatha Pemberton | ch 1 | "the scent of rain and legal caution" |
| Charles Fenwick | ch 1 | "Charles Fenwick, the hotel manager" — **the one plain introduction in the book** |
| Reginald Gresham (victim) | ch 1 | "the pooling blood beneath Reginald Gresham's body" |
| Isabel Morton (culprit) | ch 2, by name in dialogue; enters with "her boots leaving wet prints on the tile" | nothing. "Fisherwoman" never appears; the label "working-class outsider" does |

Counts over the book: schoolteacher/teacher 0 · history/research 0 · owner/owned 0 · shipowner 0 ·
fisher* 0 · patriarch 0 · granddaughter 0 · any word of age or build 2 (both "thin", of lips). Nobody has
a face. Charles has a limp in chapter 8, invented there.

### 3.2 What the pipeline had, and what it lacks — MEASURED

The bible's `THE PEOPLE` gave the writer occupation, persona, secret and stakes for all six — it knew
that Reginald Gresham was "a retired shipowner and the controlling owner of the Cliffhaven Hotel" and that
Eleanor "visits the Cliffhaven Hotel under the pretense of researching local history". So the knowledge
arrived. What did not:

- **No instruction to introduce anyone.** Chapter 1's contract has ten obligations — four evidence
  placements, two wit exchanges, one choice, one shared past, one trait, one place note — and none of them
  is "say who these people are".
- **`ageRange` is in the cast and is not passed** (`bible.ts:239–240` reads role and occupation only). The
  victim is 70–80, Isabel 25–35; the page has no ages.
- **No appearance exists anywhere upstream.** The cast record has 14 fields and the profile 18; none is
  physical. The world document's "portraits" are sociology ("embodies the firm authority … of coastal
  business dynasties of the Great Depression").
- **The standing register is "show, never tell".** `bible.ts:262` "One thing about them, shown never
  explained"; `contract-phrases.ts:16` "shown as an action and never explained".

### 3.3 The victim — MEASURED

The contract line for the dead man is: *"The body: Reginald Gresham — found dead; on the page as the body,
as an object handled, and in what others remember."* Chapter 1 handles the object and remembers nothing.

He is alive once, in **chapter 4**, where the contract schedules two before-death scenes ("played and not
remembered") inside the cellar-lock chapter. The chapter therefore opens on a dead man speaking — *"Steady
as she goes." Reginald Gresham's voice carried through the dim yellow light of the cellar corridor* — with
no signal that the clock has gone back, and the writer patches it with a parenthesis: *"(Later, it would be
claimed that Reginald Gresham Sr. had not left his study during the entire window in question; but here, in
the uncertainty of memory…)"*. The machinery to show the victim alive exists and works; it is scheduled
after the reader has stopped needing it.

### 3.4 Two faults of the cast itself — MEASURED

- **Three Greshams, two Reginalds.** The detective shares the victim's surname and, per the cast artifact,
  is *not* family ("a guest researching local history"). The page says she risks "betraying the family she
  had guarded for so long", so a reader takes her for kin. The victim and the false suspect have the same
  name; the book writes "Reginald Gresham", "Reginald Gresham Jr.", "Reginald Jr.", "Reginald" and once
  "Reginald Gresham Sr.". Agent 2 has no check for either collision.
- **The culprit is never scheduled on the page.** Agent 7 is told to call the culprit "the mysterious
  guest" before the reveal, and does, in the cast list of 6 of 10 scenes. The v2 contract drops the unknown
  name, so `On the page:` lists Isabel Morton in **0 of 10** chapters. She is in the book only because wit
  beats name her, and she walks into each room unintroduced. The raw fields also reach the writer:
  "suspicionShiftsTo: the mysterious guest" (ch 4), "secondIncident: The mysterious guest is seen nervously
  avoiding Reginald Jr. at dinner" (ch 5).

### 3.5 Proposals

- **P1 — a first-appearance introduction, owned by the chapter a person first appears in** (the ownership
  rule of `depth.ts`, applied to a plain fact): *"The first time {name} is on the page, one sentence of
  narration says who they are to this house and why they are under its roof tonight, and one gives their
  age and one thing about how they look."* Charles's "the hotel manager" shows the writer does this when
  the fact is in a usable shape.
- **P2 — two new upstream fields.** Agent 2b writes `appearance` (two concrete features); Agent 2 writes
  `whyHere` (one sentence: what brought them to this place on this night). `ageRange` is passed. Without
  the fields the writer invents (the limp) or omits.
- **P3 — the victim alive in chapter 1.** Move the two before-death scenes from chapter 4 to the opening,
  in order: the place, the people as they gather, the dead man alive and hard on three of them, the body at
  the chapter's end. It answers points 1 to 4 with one structural change and uses machinery that already
  exists. The book can afford the chapter: the reviewer asks for chapter 9 to be cut by half because
  chapter 10 repeats it, and chapters 6 and 7 both compare the ledger. **ASSUMED** — that a gathering
  opening is the Golden Age convention is genre knowledge; it was not measured on `library/texts`.
- **P4 — cast validation at Agent 2** (£0.004 a call, the cheap end): no two members share a first name; a
  shared surname requires a kinship in `relationships`.
- **P5 — resolve the mask.** The writer already knows the culprit from `THE CASE`; the contract should map
  "the mysterious guest" back to the person so they are scheduled, introduced and described like the rest.

---

## 4. The death — "people need to respond to the fact someone has died"

### 4.1 What the page has — MEASURED

| in 12,607 words | count |
|---|---|
| grief, grieve, mourn | 0 |
| wept, tears, cry, sob | 0 |
| shock, horror, scream, gasp | 0 |
| dead, death, died | **1** |
| "my father", or "Father" in speech | 0 |
| police, constable, inspector | 1 — "occasional police searches", an access rule |
| doctor | 0 |
| funeral, burial | 0 |

A man lies stabbed on the step with "blood still seep[ing] into the cracks" and his son's first words are
*"What do you see?"*, about a ledger. The manager's first line is "I'm probably making too much of it."
The chapter is titled *Cliffside Body Discovery* and opens after the discovery; nobody finds him on the
page. Nobody sends for a doctor or the police. In chapter 9 Isabel "is in custody", by nobody's hand.

The book does grieve — for the murderer. "Empty chair" appears **11** times, all Isabel's; "the absence
of Isabel Morton was felt in every room"; "I miss her work." The dead man's absence is one unsent letter.

### 4.2 The outline asked for it and the contract dropped it — MEASURED

Agent 7's scene 1:

- `summary`: "Eleanor Gresham arrives at the fog-shrouded cliffside to find Reginald Gresham's body… The
  gathered suspects… **react with shock**."
- `dramaticElements.conflict`: "**Shock and grief** at the brutal stabbing"
- `emotionalRegister`: "Shock and oppressive unease settle as the body is discovered"
- `microMomentBeats`: "Eleanor pauses, haunted by the victim's torn garment"
- `purpose`: "Introduce the crime and detective"

None of the five fields is read by `contract.ts`, `depth.ts` or `brief.ts`. The world document's emotional
arc (294 words, eight turning points) is also unread, as `17-hitting-90/07` already recorded. What chapter 1
was sent instead was four evidence placements and a joke.

### 4.3 The joke — MEASURED

The world document's humour map says `body_discovery = forbidden`, `discriminating_test = forbidden`,
`revelation = forbidden`. The brief assigns two wit exchanges to "each chapter that names a wit beat (1, 2,
3, 4, 5, 6, 7, 8, 9, 10)". Chapter 1 — the body — carries one, and so does chapter 8, the reveal.

The assignment also ignores who is present. Chapter 10's beat is "carried by Isabel Morton… the reply of
six words or fewer… is Isabel Morton's", in the same contract as "Isabel Morton is in custody since chapter
8, gone from the house". The page shows the collision: *"The first exchange carried by Isabel Morton
arrived by proxy"* and *"Isabel's reply, imagined by all in the room, was six words"*. In chapter 2 the beat
names three people and none of the three is on the chapter's `On the page:` list, so they walk in.
Everybody is in every room, which is part of why no scene feels like its own.

### 4.4 The victim is on the list of suspects to clear — MEASURED

Chapter 5's contract: *"Reginald Gresham is cleared here — Alibi confirmed: N/A — shown, and carrying one
human beat."* The page: *"The evidence clears Reginald Gresham Jr., Agatha Pemberton, Charles Fenwick, and
Reginald Gresham."* The reviewer flagged the line; it is ours.

### 4.5 Proposals

- **D1 — a reaction owed by each person present, in the discovery chapter, as an act.** Built per person
  from their pair with the dead: *"{name} — {what they were to him}: one thing they do, or cannot do, on
  seeing him. No feeling is named."* One each is a count the model keeps. It comes before any evidence is
  handled.
- **D2 — the discovery and its consequences.** Who finds him is on the page. Somebody is sent for the
  police and a doctor, and the setting's `geographicIsolation` ("several miles from the nearest town…
  unreliable telephone connections… delaying external assistance" — written by Agent 1, never sent) is why
  help is hours away. That is also the missing reason a retired schoolteacher is examining a corpse.
- **D3 — carry the outline's `conflict`, `emotionalRegister` and micro-moment** into the contract, phrased
  as acts so the label is not printed (the P4.2 lesson).
- **D4 — obey the humour map and the cast list.** No wit beat where the map says forbidden; a beat is
  carried only by people on the chapter's page.
- **D5 — the aftermath owes the victim an absence.** `brief.ts:256` asks for one thing of the dead man's
  handled and one ordinary memory; the "empty chair, a task nobody now does" line is written for the
  culprit. Give the same line to the dead.
- **D6 — remove the victim from the clearances.**

---

## 5. Why they are there, and what they are to each other

### 5.1 What the page has — MEASURED

| a fact the reader needs | where the book says it |
|---|---|
| the dead man owned the hotel | never (owner/owned 0) |
| the dead man is Reginald Jr.'s father | chapter 3, in a possessive; the will, chapter 3 |
| Eleanor is a guest and a former tutor, not family | "the afternoons she'd spent tutoring him" (ch 1); the rest never |
| why Eleanor is at the hotel | never (history/research 0) |
| Agatha is the family's lawyer | "legal caution" (ch 1), "legal duties" (ch 9) |
| why Agatha is at the hotel that night | never |
| Isabel is a fisherwoman the dead man was forcing to inform | "I'm not your informant" (ch 4); fisher* 0 |
| why a fisherwoman has a chair in the hotel office | invented in chapter 9: she "tallies dock receipts" |
| the will favours a granddaughter | never (granddaughter 0) |

And the parameter the owner chose: **story angle "a smuggling run on the coast"** — "smuggl*" appears
**twice** in the book, the cove not at all. The angle shaped the case (ledgers of shipments) and did not
reach the page as a thing that happens.

### 5.2 What the writer had — MEASURED

`WHO IS WHAT TO WHOM` carried 8 of the cast's 11 pairs. The three absent are all Eleanor's (with Agatha,
Charles and Isabel); the Agatha pair came back in chapter 3's contract. **INFERRED**: the section's budget
trimmed them; the cause was not traced.

Four shared histories were assigned to chapters by `depth.ts`, each with the instruction *"One exchange
between them carries it, and neither names it"*. All four landed, and landed as instructed:

- ch 1 — "Eleanor remembered his youth, the afternoons she'd spent tutoring him"
- ch 2 — "a stormy afternoon when she'd argued with him over unloading schedules"
- ch 3 — "Last year's meeting was no easier."
- ch 4 — the will scene

These are good, and they are *second* beats. An oblique reference to a relationship works on a reader who
knows the relationship. Nothing gives the first beat. `17-hitting-90/07` designed the rule as "one exchange
that carries it and names nothing" to keep labels off the page; it assumed the plain fact was established
somewhere else, and nowhere else establishes it.

`whyHere` does not exist as a field. Eleanor's reason is in her persona by accident; the other four have
none upstream, so there is nothing for the writer to state.

### 5.3 Proposals

- **R1 — plain first, oblique after.** P1's introduction sentence states the relation once, in narration,
  at first appearance. The "neither names it" exchange keeps its form and is scheduled in a later chapter
  than the statement.
- **R2 — every pair involving a person on the chapter's page is available to that chapter.** Three of
  eleven missing is three relationships the writer cannot use.
- **P2 (`whyHere`) and P4 (kinship and names)** carry most of this point.
- **R3 — the story angle owns a scene.** Outside the five; flagged because the owner set the parameter and
  the page shows it twice.

---

## 6. Lexicon — "a broader lexicon of words and terms as there is often repetition"

### 6.1 The measurement — MEASURED

`probes/owner-read-probe.mjs`, the book against a same-length window (12,607 words) of each of the 162
texts in `library/texts`:

| | this book | canon median | canon range | canon texts below the book |
|---|---|---|---|---|
| variety inside any 500 words (MATTR-500) | **0.542** | 0.513 | 0.464–0.562 | 148 of 162 |
| distinct words in the whole book | **1,872** | 2,428 | 1,762–2,885 | 3 of 162 |
| words used exactly once, share of vocabulary | **0.435** | 0.564 | 0.487–0.622 | **0 of 162** |
| share of the book taken by its 20 commonest content words | **9.5%** | 6.1% | 4.0–8.8% | **162 of 162** |
| 4-word sequences occurring three times or more, per 10k | **610** | 32 | 2–143 | **162 of 162** |

**The vocabulary on any one page is not poor — it is above the canon's median. The book repeats itself
across chapters.** That decides the remedy. *(Part III §25.1 corrects the next sentence but one: by mass a
third of the repetition traces to our wording, not "almost every one".)* An instruction to "vary the vocabulary" is a statistic, which
this model ignores, and it is aimed at the page, which is not where the fault is. The fault is a set of
about forty phrases that return in every chapter, and almost every one traces to a line we send in every
call.

The same instrument over our own ten most recent books ranges from 59 to 1,094 per 10k, so it separates
books sharply; three of the ten came in under the canon's maximum of 143.

### 6.2 Where the repetition comes from — MEASURED per phrase, INFERRED where marked

**(a) The clock.** `bible.ts:324`: "Every one of these is written the same way every time it appears", over
27 rows, in every call; plus "The clock: between quarter to nine and quarter past nine" in chapter
contracts. On the page: "quarter to nine" 29, "quarter past nine" 22. Four chapters end on the same
sentence: *"The clock ticked quietly, marking each moment between quarter to nine and quarter past nine."*
The reviewer: "repeats 'quarter to nine / quarter past nine' too often".

**(b) Five trait labels, cycling twice.** `bible.ts:262` puts "One thing about them, shown never
explained" in `THE PEOPLE`, which every call reads, and the contract assigns each to two chapters
(1 and 6, 2 and 7, 3 and 8, 4 and 9, 5 and 10).

| the label in the prompt | on the page |
|---|---|
| "After a humiliating public gambling loss" | "gambling loss" ×9, in 8 chapters |
| "The loss of a high-profile case" | ×10, in 7 chapters |
| "Lost her youthful certainty" | ×7 |
| "A factory accident" | ×5 |
| "a storm wrecked her family's fishing boat" | ×3 |

"The loss of" appears 16 times. The instruction says *shown, never explained*; the page says "the loss of
a high-profile case years ago still echoing in her careful manner" — named, ten times. A_96 F9 cut the
trait down to its clause to stop exactly this; a clause in the bible still recurs. This is
`17-hitting-90/07`'s own rule ("never the bible, which every chapter call reads") broken by the line that
sits beside it.

**(c) The humour labels in the Speech line.** P4.2 turned the Humour line into a move. The Speech line
(`bible.ts:252`) still carries the adjectives: "self-deprecat*" ×10, "understate*" ×5, "the gap" ×6 (from
"lets the gap do the work"), "unreadable" ×13.

**(d) Our instructions, printed.** The reviewer's scaffold list, each traced:

| on the page | the line that produced it |
|---|---|
| "X was asked, …" ×25; nine of the questions run from 65 to 133 words | TWO EXCHANGES: "somebody asks the named character a question"; "somebody else's line runs to twenty-five words or more" |
| "reply was four words", "reply… was six words" ×4 | the same block |
| "recalled from chapter 6", "already referenced in chapter 6", "from chapter 1" | contract: "Already on the page from chapter 6 — refer to it, do not stage it again" |
| "The chapter ended with the group in the lounge" | `brief.ts`: "The chapter ends with everybody still in the room" |
| "The period of investigation had gotten in his way"; "the period's limitations… had gotten in their way" ×3; "the period's" ×8 | `contract-phrases.ts:28`: "The period gets in somebody's way here" |
| "apology, thanks, resentment, assumptions lingering between them" ×3, first in chapter 5 | `brief.ts:270`, chapter 9's instruction, which sits in the bible and is read by every call |
| "made her choice", "made a choice then" | contract: "makes one choice in this chapter" |
| "the working-class outsider" | the role archetype on the `THE PEOPLE` name line |

"Was asked" is in none of five sibling books. **INFERRED**: a draft coined it in chapter 3 and the next
mechanism carried it.

**(e) The book so far, "for voice".** Each call reads every earlier chapter ("THE BOOK SO FAR — every word
of it, for continuity and for voice"; the last call is 92,852 characters). A tic becomes the voice.
Per chapter, 1 to 10:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| "was asked" | 0 | 0 | 2 | 1 | 3 | 4 | 2 | 4 | 6 | 3 |
| "routine" | 0 | 3 | 0 | 0 | 1 | 2 | 1 | 3 | 8 | 15 |
| "the loss of" | 0 | 1 | 1 | 0 | 3 | 2 | 1 | 1 | 2 | 5 |
| "empty chair" | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 7 |

Chapter endings converge: "follow the evidence wherever it led" ×5, "held its secrets close" ×4, "the
clock ticked" ×6, "the axis of" ×5. Chapters 9 and 10 duplicate each other (empty chair, missing boots, the
letter, the broken key in the drawer, "Have the staff logs been updated?" asked twice) because chapter 9's
call reads chapter 10's aftermath instruction in the bible and performs it, and chapter 10's call then
reads chapter 9. The reviewer: "Chapter 9 is slightly redundant… cut by about half".

**(f) The sentence itself.** This is the sound the owner is calling wooden. *(Part IV §30.1: "the one
validated instrument" below was validated before 1 September; WP-006 §3.2 finds no slope since.)*

| | this book | canon |
|---|---|---|
| paragraphs that begin with a character's name | 133 of 201 (**66%**) | not measured |
| sentences that begin with a name, "he" or "she" | 394 of 709 (56%) | not measured |
| "hands" or "fingers" | 120 in 201 paragraphs | — |
| the body-part tail — *", her gaze fixed"*, *", his hands steady"*, *", her expression unreadable"* — per 10k words | **151** | median **1.4**, p90 4.5, **max 9.9** over 162 texts |

The tail occurs 191 times in 709 sentences: more than one sentence in four ends on a possessive, a body
part and a state. No canon text reaches a fifteenth of that rate. Our other v2 books run 83 to 135, so it
is the engine. **INFERRED** cause: `writer-format.ts:140` ("what the speaker does comes after the words,
in the same paragraph") puts an action after every spoken line, and `brief.ts:218` puts a person and a
touchable thing in every paragraph. `machine-register.ts` has no pattern for it (**MEASURED** by grep), so
the one validated instrument does not see the most countable tic in the book.

### 6.3 Proposals — remove the sources; add no banned list

- **L1 — the trait leaves the bible.** One chapter owns it. Agent 2b pre-renders it as an act with an
  object ("checks a figure twice and will not say why"), so the label never enters a prompt. A reference
  binds to whatever is in the prompt; the cure is for the label not to be there.
- **L2 — per-chapter clock ownership.** A call receives the clock values its own chapter's evidence uses.
  The window is stated where it is established and where it is proved.
- **L3 — reshape or retire the two-exchanges template.** It is now the most recognisable device in the
  book and the reviewer names it in both this read and the last. At the least: none after the reveal, none
  where the map forbids, and the instruction stops describing the exchange from outside ("the reply is four
  words"), which is the sentence the model prints.
- **L4 — the Speech line gets the P4.2 treatment**: the move, not the adjective.
- **L5 — a selector term.** Three drafts already exist for every chapter. Score each for 4-grams shared
  with the book so far and prefer the least. It adds no prompt text, no gate and no retry, and it works
  on the mechanism in (e) directly: it turns a choice into a selection (A_109's principle).
- **L6 — the tail, as a count.** Replace "what the speaker does comes after the words" with a number of a
  simple thing: *"Two spoken lines in each chapter are followed by what the speaker does. The others are
  the words and who said them."* And relax `brief.ts:218` from every paragraph to a count.
- **L7 — ship-check reports the four book-scale numbers and the tail rate against the canon's bands.** It
  is an instrument that points up: it rises when the prose improves, and it would have said WORTH A LOOK
  at 610 against a canon maximum of 143.
- **L8 — the instruction-echo list gains the lines in (d).** A post-pass, not a gate.

---

## 7. What the external review named, traced

The review's seven "fastest fixes", each against its cause. Six are lines we send.

| the review asks | cause | here |
|---|---|---|
| simplify the proof (eleven mechanisms) | 24 evidence obligations, ten of them in chapter 6 (harness); no minimal proof | A_109 M3, not built |
| one concrete motive line for Isabel | the confession contract asks what he "was about to do" and "what that would have cost"; the case's motive is "Feared victim would cut ties with smuggling ring last Friday" | P1.5 / W4 of `04_review-weaknesses.md` |
| cut chapter 9 by half | chapter 9 reads chapter 10's instruction in the bible | §6.2(e) |
| delete "chapter" references and scaffold | contract and brief lines, printed | §6.2(d), L8 |
| remove the victim from the cleared line | contract clears the victim | §4.4, D6 |
| reduce the repeated clock phrase | the clock's spelling rule, 27 rows, every call | §6.2(a), L2 |
| long question, tiny reply is overused | the two-exchanges template | §6.2(d), L3 |

One defect the review calls an "attribution oddity" is neither ours by instruction nor the model's:
chapter 5 was drafted opening *"Did you see him near the cliffside?" Eleanor Gresham asked*, the line is
still there in the editor's second-round prompt, and the saved file opens *Eleanor Gresham asked, her voice
level…* with the question gone. Something at or after the editor deleted the chapter's first spoken line.

---

## 8. The instruments disagree with the owner

| | external reader | owner |
|---|---|---|
| atmosphere / setting | 9 | "we need a good scene setting" |
| character clarity | 8 | "a better introduction to the characters" |
| character life / relationships | 8 | "a better explanation of… what their relationships are" |
| prose | 6 | "wooden"; "often repetition" |

The reader and the owner agree only on prose. On the other three the rubric is at or near its ceiling for a
book that never shows the hotel, never says who owns it and never has anyone grieve. **The reader cannot
measure the owner's five**, and marks already at 8 and 9 have nowhere to go when they are fixed. The same
is true of the release gate (shipped, 0 hard stops) and the internal score (95.83).

So the five need a countable instrument of their own, which is what `probes/owner-read-probe.mjs` is a
first draft of. It costs £0 and settles each item on a matched pair without a reader:

| owner's point | the count |
|---|---|
| 1 place | words before the first quotation mark of chapter 1; paragraphs with nobody in them; nouns of the primary profile on the page; year and place named |
| 2 people | of the living cast, how many have occupation and relation stated in the chapter they first appear; age or feature words; the victim described before the wound |
| 3 the death | reaction acts in the discovery chapter; authority sent for; "father" in the son's mouth; dead/death/died |
| 4 reasons | kinship stated by the end of chapter 1; a why-here sentence per person |
| 5 lexicon | distinct words, once-only share, top-20 share, repeated 4-grams, the tail — each against the canon band |

---

## 9. What to build, in order

> **Superseded by §18.** Part II changed the order: the defects come first (step 0), the opening second, and
> P3 is no longer "step 4" — it is the upstream root.

**The recommendation (as first written): build step 1 behind one flag and settle it with a matched pair on
this run's own upstream.**

**Step 1 — contract and brief only (`prose-engine`); one flag, default OFF, registered in
`architecture/FLAG-AUDIT.md`, env read at call time.** W1, W2, W3, P1 (from the fields that exist), P5,
D1, D2, D3, D4, D6, R1, R2, L1 (bible half), L4, L8. Chapter 1 gains about six obligations, so it must
shed some: two of its four evidence placements move to chapter 2, its wit beat goes (the map forbids it
anyway), and its length target rises. Test each lever by its agent label in `logs/llm-prompts-full.jsonl`.

**Step 2 — selection and format, no new prompt text.** L5, L6, L2, L3, L7.

**Step 3 — upstream, needs a fresh run.** P2 (`appearance`, `whyHere`), P4 (names), W4 (locations from the
closed list), R3 (the angle owns a scene), L1 (Agent 2b renders the trait as an act).

**Step 4 — structural.** P3, the gathering chapter with the victim alive. It has the most leverage and the
most risk: every v2 book so far opens after the death, and the reader's hook mark (8) was given to that.

### The matched pair for step 1, and what it should settle

Arm A is this book. Arm B is `RESUME_REDO=prose` with the flag on against byte-identical upstream (~£0.45).
No reader is needed; the probe scores it. Predictions, each checkable:

| # | prediction for arm B | arm A today |
|---|---|---|
| 1 | chapter 1's first quotation mark is in paragraph 3 or later, after 120 or more words of place | paragraph 1, 0 words |
| 2 | Mevagissey, January and 1934 are each on the page; six or more nouns of the primary profile appear, none more than twice | 0, 0, 0; 0 |
| 3 | 5 of 5 living cast have occupation and relation stated in the chapter they first appear | 1 of 5 |
| 4 | the victim has an age and one feature before the wound is described | neither |
| 5 | four or more reaction acts in the discovery chapter; police or a doctor sent for; the son says "father" in chapter 1 | 0; no; chapter 3 |
| 6 | the dead man's ownership of the hotel and his kinship to Reginald Jr. are stated by the end of chapter 1 | never; chapter 3 |
| 7 | each trait label appears at most once | 3 to 10 times |
| 8 | "was asked", "chapter N", "the period's", "apology… thanks… resentment": 0 | 25, 4, 8, 3 |
| 9 | ~~the machine-register rate does not rise~~ — **withdrawn in Part IV §30.1**: in this regime the rate carries no information | — |
| 10 | repeated 4-grams fall, and stay above the canon's maximum of 143 until step 2 | 610 |

Prediction 10 is deliberately modest: step 1 removes sources (b), (c) and (d); the clock, the book-so-far
compounding and the tail are step 2.

**What the pair cannot settle:** whether the reader's headline moves. Its marks for these categories are
already 8 and 9 (§8).

---

## 10. What this analysis could not determine

- ~~Whether SHIP-CHECK flagged this book.~~ **Resolved in Part II:** it ran and said "Normal" (§13.5). The
  first probe searched the wrong field — a negative that was a claim about the probe.
- **The seed**, and whether `RESUME_REDO=prose` can replay a UI project. If it cannot, arm B needs the run
  reproduced from the CLI first, and the pair is no longer byte-identical upstream.
- **Which stage deleted chapter 5's opening line** (§7).
- ~~Why three of Eleanor's pairs are absent.~~ **Resolved in Part IV §30.4:** a 600-token prefix budget.
- ~~Whether the canon opens on place.~~ **Measured in Part II** (§13.1): 11% open on speech; median 131 words
  of narration first. How often victims are met alive is still a proxy.
- **The canon's rate of name-first paragraphs.** The 66% in §6.2(f) has no comparison; the tail rate does.
- **The run's true cost.** The report's `total_cost` (0.0746) is not a budget number.
- **Whether fixing these makes the book read as less wooden to the owner.** Every count here is a proxy
  for that judgement; only the owner's next read measures it.

---

## 11. Premises that turned out false

- **"The writer knows where and when the book is set."** It has never been told, in any v2 run (§2.3a).
- **"The `[object Object]` fix delivered the setting."** It deleted the garbage; the test checks absence.
- **"Depth pieces are owned by one chapter and kept out of the bible."** The trait line is in the bible and
  in two chapter contracts (§6.2b).
- **"Atmosphere is a strength to protect"** (`04_review-weaknesses.md` §2). The 9 is for coherent nouns; the
  place is not described (§2.5).
- **"The lexicon is too small."** On the page it is above the canon's median; the fault is recurrence
  across chapters (§6.1).

And five of this document's own, found by Part II:

- **"P3 is a new structure with the most risk"** (§9). It is the outline's own first beat, overridden by an
  older line in the same prompt (§13.1).
- **"The clock table drives the repetition"** (L2). ρ = 0.11 over 34 books; recommended against.
- **"The trait labels recur"** as a rule (L1). In 7 of 118 traits; this book is the tail.
- **"The format line causes the body-part tail"** (L6). v1 wrote it at 42 to 61 per 10k without that line.
- **"Carry the outline's emotional fields into the contract"** (D3). It would put label text back in the
  prompt; withdrawn.

And four more, found by Part III:

- **"Almost every repeated phrase traces to a line we send"** (§6.2). A third does; two-thirds is the
  writer's own (§25.1).
- **"Three drafts would settle whether the writer opens on narration"** (§19). Three of three proves a rate
  above 37%; the plan needs 63% (§22.1).
- **"The selector weighs register most"** (its own header). Between drafts it weighs speech-opening share
  and long sentences most, and repetition not at all (§23).
- **"The contract's page list says who is in the chapter"** (assumed by P1 and D4). Somebody unlisted acts
  or speaks in 47% of chapters (§22.3).

---

# PART II — every proposal, tested

## 12. Method

Two questions were put to each of the 26 proposals: **will it work when built**, and **will the book be
better for it**. "Work" was tested four ways, all at £0:

1. **By running the code.** `probes/harness.mjs` builds the real contract and bible from `dist` on this
   run's stored artifacts, runs the real checkers on the saved manuscript and on a chapter 1 with an
   establishing passage added, and scores both with the real selector.
2. **By what the writer has already done.** `probes/compliance-probe.mjs` pairs the contract each v2 writer
   was sent with the draft it wrote, over the **25 v2 runs** in the prompt log that have both (250
   chapters). An instruction of the same kind as a proposal has a measured record.
3. **By the archive.** `probes/outlines-probe.mjs` over 64 stored outlines, 72 CMLs, 79 casts, 80 settings;
   `probes/stories-probe.mjs` over the 233 saved manuscripts of 8,000 words or more.
4. **By the canon.** `probes/canon-opening-probe.mjs` over the 149 library texts with a findable first
   chapter.

What could not be tested at £0 is whether the writer obeys a line it has never been sent. Those are
marked, each with the count that decides it and the fallback if it fails (§19).

---

## 13. Five findings that change the plan

### 13.1 The root is upstream: Agent 7 is told two opposite things about chapter 1 — MEASURED

`packages/prompts-llm/src/agent7-narrative.ts:118`, the mandatory beat arc, added 2026-06-21:

> 1. beat: "gathering" — The Gathering — **introduce era, setting, detective, victim, suspects, tensions**;
> end on an unsettling incident. 2. beat: "crime" — The Crime — the central crime occurs/is discovered…

`agent7-narrative.ts:717`, added six days earlier and never removed:

> **CRITICAL — Scene 1 (discovery) internal order**: … (1) **ONE sentence of arrival/atmosphere**, (2)
> physical discovery of the body — no later than the second paragraph… **Do NOT open Scene 1 with…
> atmospheric landscape, or suspect introductions before the body is found. The body comes first.**

The second has won every time. Over **64 stored outlines**: scene 1 is labelled `gathering` in 63 and is the
discovery in **64**; its hour is "morning after the murder" in 57. The Gathering has never been written.
The owner's points 1 and 2 are, word for word, what line 717 forbids. No analysis document discusses the
rule; its commit has no message.

The canon does the opposite. **MEASURED** over 149 texts: the first paragraph opens on speech in 16 (11%);
the median is **131 words of narration before anybody speaks**; a death word (corpse, the body, murdered,
found dead, inquest — a crude proxy) appears within the first 300 words in 10 of 149, and at the median
8.1% of the way in, which is **word 1,016 of a 12,600-word book** — the end of chapter 1. Ours: 25 of 25
v2 first chapters open on speech — six words in, at the median of the ten saved v2 books.

So P3 is not "a new structure with the most risk" (§9). It is the outline's own beat, switched off by an
older line. And the same prompt already demands the rest: its *Detective Entry (MANDATORY)* block requires
Act I to establish "why they were already present" — but no field carries the answer and v2 reads no
summary, so it dies at the contract.

### 13.2 The checkers would undo an establishing passage — MEASURED by running them

A chapter 1 with eight plain establishing sentences added drew **three findings inside the passage**:

- `register_sentence` — *"It was the middle of January, 1934, and the fog had come in off the bay at
  dusk."* (the sentence carrying the date)
- `abstract_subject` — *"The night was thick with it."* and *"The air was heavy with salt and coal smoke…"*,
  with the repair instruction "give the sentence a named person doing something"

On the canon's own opening narration the register rule fires on **28.5%** of sentences (841 of 2,953), in
143 of 149 openings. The editor would be told to rewrite the description back into a person handling an
object. **W2 and W3 do not work without an exemption.** The location profile's own sentences passed clean
(four of four scored 1.00 against a threshold of 3), so the material is safe; plain weather and date
sentences are not.

### 13.3 The selector would pick the draft that disobeys — MEASURED

The same passage costs a draft **1.40** composite (speech-opening share, long-sentence share and wit all
fall when two paragraphs of narration are added). Chapter 1's three drafts in this run scored 18.73, 18.80
and 20.06: a spread of **1.33**. An obedient draft loses to a disobedient one by more than the whole spread. *(Part III §23: that is true of this chapter; the median spread is 8.7, and the larger hazard is that the selector's strongest term is the one a narrated opening lowers.)*

### 13.4 Specimens in an instruction are printed — MEASURED

Yesterday's fix for the arrested culprit tending the fire (`run.ts:235`) reads: *"…the others feel the
absence — **an empty chair, a task nobody now does**."* One run has had that line. "Empty chair" appears
**11 times** in it and 0 or 1 times in each of the other 24 drafts. The aftermath line's specimens — *"a
door unlocked, a letter sent, a piece of work begun again"* — are on the page as "letters sent, doors
unlocked" five times. `brief.ts` forbids examples by law, and its `EXAMPLE_MARKERS` catches "such as" and
quoted strings but not a list after a dash.

### 13.5 The victim has been "cleared" in nearly every v2 book — MEASURED

**64 of 72 stored CMLs** list the victim in `suspect_clearance_scenes`; `distributeClearances`
(`contract.ts:192`) passes every entry through; the contract told the writer "{victim} is cleared here" in
**24 of 25** v2 runs. Line 320 of the same file already filters the victim and the culprit for the test's
innocent; the clearance list was never given the same filter.

Also resolved from §10: **SHIP-CHECK did run on this book and said "39.1 per 10k against a corpus median of
17.3. Normal."** It counts verbatim six-word spans; this book's repetition is in three-to-five-word phrases
and constructions, which it does not see.

---

## 14. What this writer does with each kind of instruction — MEASURED over 25 v2 drafts

| kind of instruction | record | what it means for a proposal |
|---|---|---|
| a noun phrase to put on the page ("Of this place…") | 41 of 83 fragments printed verbatim; 12 printed twice or more | given material lands about half the time word for word, and mostly once — W2, W3 have something to stand on |
| "says this once in the book, in chapter N" | exactly once 18 of 35; never 4; twice or more 13 | "once" is kept half the time; a count of one needs a checker behind it |
| a label with "shown, never explained" | the label's words printed 3 or more times for 7 of 118 traits; not at all for 84 | usually obeyed; **this book is the tail, not the rule** — L1 is smaller than Part I claimed |
| a specimen after a dash | 11 uses in the one run that had it | never give one — D5 |
| the plain occupation, with no instruction to state it | stated in the first-appearance chapter for 28 of 124 people (23%) | three readers in four are not told what a character does — P1 is needed in every book |
| a word in an instruction ("the period gets in somebody's way") | "the period" is on the page in 6 of 6 drafts that had the line, and in none of the 19 that did not | reword the line; the checker will not catch a paraphrase — L8 |
| chapter openings, no instruction either way | 244 of 250 chapters open on a quotation mark; chapter 1 in 25 of 25 | W2 is asking for something this writer has never once done |
| the passive "was asked", questions past 60 words | this run only (25, and 8); the other 24 drafts: 0 to 2, and none | one draft's coinage, compounded by the book-so-far — L3 is smaller than Part I claimed |
| the body-part tail | every v2 draft: 30 to 218 per 10k; v1's 175 books: monthly medians 42 to 61 | the model's default, doubled in v2 — the format line is not the whole cause, L6 |

---

## 15. The verdicts

### Stand as proposed

- **D6 — the victim is not cleared.** Systemic (§13.5). One filter, the one line 320 already applies. Tell
  Agent 3 as well.
- **D4 — wit beats obey the map and the page.** By execution: the beat's owners are off the chapter's page
  in **7 of 10** chapters; `selectWitBeat(living, …)` and `assignOwnedShapes(living, …)` take every living
  profile, the arrested culprit included; `chapterCarriesWitBeat` is `chapter % beatEvery`. The map's three
  "forbidden" positions are never read. Cost: wit correlates +0.25 with the headline, and two chapters lose
  a beat.
- **P5 — resolve the mask.** 22 of 64 outlines carry a non-cast name in a scene's cast list. Here the
  culprit is on the page list of **0 of 10** chapters, the reveal included (harness: chapter 8 lists Eleanor
  and Charles). Extend it to the job-field values, which print raw ("suspicionShiftsTo: the mysterious
  guest"). The mask string is in Agent 7's own prompt, so the mapping is known.
- **D2 — authority sent for.** 80 of 80 settings carry `geographicIsolation` and `era.policing`; here:
  "several miles from the nearest town… unreliable telephone… delaying external assistance" and "local
  police stations understaffed". Condition it on an amateur or civilian detective. The authority is
  unnamed. It also repairs the ending: Isabel is "in custody" at the hands of nobody; the constable who
  could not get through the fog arrives when it lifts.
- **P2 — `appearance` and `whyHere`.** Written where the case is known (Agent 2b runs after the CML), so a
  reason for being there cannot contradict an alibi. Sent only in the first-appearance contract, never the
  bible.
- **P4 — names.** A shared first name in 1 of 79 casts; the detective sharing the victim's surname in 2.
  Rare, so the check rarely fires, which is what a check should do.
- **W3, R2** — unchanged, with W2's exemption for W3.

### Changed

- **P3 — promoted, and re-specified (§13.1).** Remove line 717's order and prohibition so scene 1 is the
  Gathering and scene 2 the Crime. Three things must change with it or it fails:
  1. *The contract would turn an honoured gathering into a corpse scene.* `run.ts:237` prints "The body: …
     found dead" whenever the victim is in the scene's cast and there is no wound scene. Agent 7 must mark
     the scene (`victimAlive`), because inference cannot be trusted: all 64 archived outlines call a
     discovery scene "gathering".
  2. *Alive and dead in one chapter has already been read as a fault.* `run.ts:218`: the writer "gave him
     lines and then a corpse in one scene; the read called the transition 'two scene versions spliced
     together'." The gathering ends before the death; the body is chapter 2's.
  3. *The before-death scenes move with it.* They sit in chapter 4 in 7 of 7 runs; under a real gathering
     they are chapter 1's content, and chapter 4 stops opening on a dead man speaking.
  Not measurable: the hook. Body-first earned 8; gathering-first has never been tried in 64 outlines.
- **W2 — three guards, or it will not survive.** (a) State it as layout in the format block, where
  paragraph rules are kept, as a count: chapter 1's first two paragraphs are narration of the place and
  somebody first speaks in the third. (b) Exempt those paragraphs from `register_sentence` and
  `abstract_subject`, and list them under what the chapter owes so the editor leaves them (§13.2). (c)
  Leave them out of the selector's shares, or rank "opening present" above the composite (§13.3). And two
  rules for the material: use the primary profile's `visualDescription` and first two paragraphs, which
  scored clean; **leave out its fourth** ("a setting ripe with tension, where the past and present
  collide") and the world document's camera angles ("Observe the interplay of light and shadow as metaphors
  for concealed truths") — and **give no fixed order of elements**. Part I's "the road up, the building,
  the water, the hour" is X94 again: v1 put 420 to 470 words before the first spoken line (monthly medians, 175
  books), and the sameness of that opening across books is why `opening_hook` never reached 9 (X94/X95). The nouns come from the book's
  own profile; nothing else is fixed.
- **W1 — one line.** Repairing all six dead reads would add the setting's mood and four location registers
  to every call: *"The lobby feels claustrophobic yet charged, where every shadow and whispered word
  carries weight…"* That is the register readers quote back in 4 of 4 reads. Delete those reads; keep the
  where-and-when. Harness output: *Cliffhaven Hotel, seaside hotel at Mevagissey, England; January 1934,
  winter.*
- **W4 — not a closed list.** Agent 7's prompt names no location at all. Agent 2c is asked for four and
  here made the lobby the crime scene while the body lay on the cliffside. Across 64 outlines 42% of scenes
  (270 of 647) are set where no profile exists. A closed list would stage a cliffside clue in the lobby.
  Instead: give Agent 7 the profiled places as the sets to prefer, and seed Agent 2c's list from where the
  clues are found.
- **P1 — a clause, not two sentences.** Occupation and what the person was to the dead: both exist. Age and
  a feature wait for P2 — with no field the writer invents. "Why under this roof" waits for `whyHere` —
  an invented arrival can contradict an alibi window.
- **D1 — speech, not body.** "The next sentence is what that suspect does with their hands" is already in
  the brief, and this book has "hands" or "fingers" 120 times and the tail at 151 per 10k. A reaction asked
  for as a physical act would add to both. Ask for a spoken line each, before any evidence is mentioned;
  the culprit gets the same line as everyone, so nothing points.
- **D5 — it is a regression, not a gap.** Delete the specimens from `run.ts:235` and `brief.ts:255`; one
  chapter owns the absence; drop "X is the first of them we see" when X is in custody (`run.ts:326`
  contradicts `:235`). Do **not** add an absence line for the victim: the remembered-object line exists and
  was praised in 4 of 4 reads. Extend `EXAMPLE_MARKERS` to a noun list after a dash.
- **L1 — halved.** Removing `bible.ts:262` is free and is `depth.ts`'s own rule. The upstream half (Agent
  2b pre-rendering an act) is withdrawn: 84 of 118 traits were never printed as labels.
- **L3 — narrowed.** "Twenty-five words or more" becomes twenty-five to forty. D4 does the rest.
- **L4 — the label is something we ask for.** Agent 2b's prompt: *"speechMannerisms should describe HOW
  they speak: speech rhythm, favourite phrases, verbal tics, formality level, **and how their humour
  manifests in dialogue**."* Delete the clause (the humour style has its own field, rendered as a move).
  Until a fresh run, the bible takes the first sentence of the field: label-free for 4 of 5 here. Part I
  cited "unreadable" ×13 as a label; it is not one, and that evidence is withdrawn.
- **L5 — shadow first.** Drafts do differ — chapter 2's three scored repetition 0, 0 and 25.8 — so
  selection has something to choose. But the composite runs 13 to 36 on weights fitted to v1, and a new
  uncalibrated term changes every selection. Log overlap-with-the-book per draft for a few runs; wire it
  only if it varies.
- **L6 — the cause is half-refuted.** v1 wrote 42 to 61 tails per 10k (monthly medians) under a different prompt, over 175
  books. The format line can only explain v2's doubling. So two layers: the count in the format line, and a
  checker finding that quotes the whole sentence and asks the editor to cut the tail — a deletion, the
  safest edit there is. Expect under 60, not the canon's 1.4.
- **L7 — report, do not gate at the canon's band.** The median book of every month since May exceeds the
  canon's maximum of 143 (medians 320 to 940). A verdict at that line fires on most runs, which is an off
  switch. Take the verdict from our own distribution and generate the bands by script.
- **L8 — not a list to extend.** The echo checker derives its phrases from the instructions and did flag
  "still in the room"; the editor replaced those words and left *"The chapter ended with…"*. Three real
  gaps: the word "chapter" in narration (never legitimate in fiction; 3 of 25 drafts) as a construction
  check; two lines reworded so their own words cannot leak ("Already on the page from chapter 6" and "The
  period gets in somebody's way here"); and the editor's repair taking the sentence, not the token.

### Withdrawn or recommended against

- **D3 — would harm.** The outline's fields are labels in the abstract register: "Shock and oppressive
  unease settle as the body is discovered"; "haunted by the victim's torn garment". Sending label text is
  how "polite savagery" was printed twelve times and how the scaffold lines readers quote reached the
  page. D1 and D2 ask for the same thing as acts whose wording is ours.
- **L2 — recommended against.** Clock tables of the same size (22 to 27 rows) produce 10 to 52 clock
  mentions per 10k. Over the 34 books since 2026-09-18 clock density against repetition is ρ = 0.11 (233
  books: 0.20). The ten books in `stories/` alone give 0.84, which is what a small sample does. The table
  is not the driver, and thinning it risks the timeline contradictions 22 reviews name.
- **L1's upstream half** — above.

---

## 16. Will each one make the book better?

| the owner's point | what delivers it | evidence it helps | the risk, and what holds it |
|---|---|---|---|
| 1 place | P3, W2, W1, W3, W4 | canon: 131 words before speech at the median; ours 6 | purple or templated openings — concrete nouns from the book's own profile, no fixed order; checker exemption |
| 2 people and victim | P3, P1, P2, P5 | occupation stated at first appearance for 23% of characters; victim alive only in chapter 4 | a list of introductions — one clause each, at the moment each appears |
| 3 the death | D1, D2, D4, D6 | 0 grief, 1 "death" in 12,607 words; a joke scheduled at the body | melodrama — speech in each person's own voice, no feeling named by us |
| 4 reasons and relations | P1, P2, P3, R2 | ownership and kinship stated never and in chapter 3 | invented reasons contradicting alibis — `whyHere` written where the case is known |
| 5 lexicon | D5, L1, L4, L8, L3, then L5, L6, L7 | specimens ×11, labels ×10, echoes in 6 of 6 | none for the deletions; L6's editor pass can leave a clumsy line |

Two of the reader's praised things are touched and must be watched: **wit** (D4 removes two beats) and the
**aftermath** (D5 changes its lines; the remembered object stays).

---

## 17. New items Part II found

| id | item | where |
|---|---|---|
| N1 | `agent7-narrative.ts:717` contradicts `:118` | carried by P3 |
| N2 | `register_sentence` fires on 28.5% of canon opening narration | carried by W2; and a question for the register instrument itself |
| N3 | the selector penalises narration added to a chapter | carried by W2 |
| N4 | "X is the first of them we see" names the arrested culprit (`run.ts:326`) | carried by D5 |
| N5 | chapter 5's first spoken line deleted between the editor and the saved file | open |
| N6 | the internal shadow rubric scored this book 68 while the report says 95.83 | open; not pursued |

---

## 18. Build order — replaces §9

**Step 0 — defects. Deterministic; each is verified by re-running the harness, not by a reader.**
D6, D4, D5, P5, W1, R2, L1, L4 (bible half), L8. After the build, `harness.mjs scenes` must show: no victim
in any chapter's clearances; no wit owner off the page; the culprit on the page list of the chapters the
outline puts them in; and `harness.mjs bible` a where-and-when line. One matched pair shows the page.

**Step 1 — the opening, on today's outlines.** W2 with its three guards, W3, P1, D1, D2, L3 — keyed to
the chapter's role, so they move to the right chapter when step 2 lands. Chapter 1 sheds its wit beat
(D4), its depth trait and its inner-conflict line, which go to later chapters.

**Step 2 — upstream; a fresh run.** P3, W4, P2, L4 (prompt half), P4. One flag for the Agent 7 change,
default OFF, registered in `architecture/FLAG-AUDIT.md`.

**Step 3 — instruments and selection.** L7, L5 in shadow, L6.

Predictions for the step 0 + 1 matched pair (`RESUME_REDO=prose`, this run's upstream), each a count from
`owner-read-probe.mjs` unless marked:

| # | prediction | today | decided by |
|---|---|---|---|
| 1 | chapter 1's first quotation mark is in paragraph 3 or later | paragraph 1, in 25 of 25 | **compliance — untested. If it fails, the fallback is a separate opening call whose text the chapter continues from** |
| 2 | the establishing paragraphs survive the editor unchanged | — | the exemption; the harness shows 0 findings inside them |
| 3 | Mevagissey, January and 1934 are on the page | 0, 0, 0 | W1 + W2 |
| 4 | 4 of 4 people in chapter 1 have occupation and relation to the dead stated there | 1 of 4 | P1; base rate 23% |
| 5 | each person present speaks of the death before the first evidence; police or doctor sent for | 0; no | D1, D2 |
| 6 | "empty chair" at most 2; "letters sent, doors unlocked" 0 | 11; 5 | D5 — deterministic cause |
| 7 | the victim is in no clearance line | present | D6 — harness |
| 8 | no line of the reply is "imagined" or "by proxy" | 2 | D4 — harness |
| 9 | "the period" 0; the word "chapter" in narration 0 | 9; 3 | L8 |
| 10 | each trait label at most twice | 3 to 10 | L1 |
| 11 | the tail and repeated 4-grams: no prediction; step 3 | 149; 705 in the draft | — |
| 12 | clue coverage not worse: no new `clue_missing` in chapter 1 | 0 | hard gate |

---

## 19. What Part II could not test

- **Whether the writer will open a chapter on narration when told to.** It never has (25 of 25), and it has
  never been told. Prediction 1 decides it; three single-chapter drafts would settle it for a few pence
  and were not spent without a yes. *(Part III §22.1: three is not enough — three of three proves only a
  rate above 37%. The rule is accept at five straight, reject at three straight.)*
- **Whether the hook mark survives a gathering-first chapter.** Never tried in 64 outlines.
- **Whether chapter 1 carries the added obligations without dropping a clue.** Prediction 12.
- **Whether `RESUME_REDO` can replay a UI project**, and whether a stage earlier than prose can be re-run
  for step 2.
- **The canon's death position** is from a five-phrase proxy; it is good for "paragraph two or a chapter
  in", not for a percentage to the decimal.
- **N5 and N6.**

---

# PART III — maths, logic and statistics

## 20. What was asked, and how it was checked

Where can an exact method replace "ask the model and hope", a hand-picked threshold, or a defect found by
reading a book? Ten methods are below. **Eight were prototyped at £0 and run on real data; two are stated
as methods only and say so.** Four new probes: `contract-lint.mjs`, `stats-probe.mjs`,
`lexstats-probe.mjs`, and the opening corpus already in `data/`.

| id | method | improves | checked? |
|---|---|---|---|
| M1 | **the contract as facts, with invariants** (logic) | D4, D5, D6, P5, P3 — and every future contract defect | run over 64 projects |
| M2 | **assignment by matching**, not rotation plus a filter | D4; trait, place and history ownership | feasibility measured |
| M3 | **a sequential test** for "will the writer obey" | W2's open question; any new kind of instruction | bounds computed |
| M4 | **noise on identical upstream** → what one matched pair can decide | every prediction in §18 | measured on 18 runs |
| M5 | **the page list is a claim, the text is the fact** | P1, D4, W3 | measured on 250 chapters |
| M6 | **the selector standardised on between-draft variance** | W2's guard, L5 | measured on 20 selections |
| M7 | **instruments with no word list** and a floor taken from the canon | L7; a number for "wooden" | run on 162 canon windows, 10 books |
| M8 | **keyness and attribution**: what is over-used, and whose wording it is | L1, L4, L8, L5, L6 — the whole of point 5 | run on this book |
| M9 | evidence load as a balancing problem | P3, step 1's chapter 1 | load measured; balancer not built |
| M10 | opening chosen by coverage and distance from past openings | W2, against X94 | corpus exists; not built |

---

## 21. Logic — the contract as facts that must be consistent (M1, M2)

Every contract defect in Parts I and II was found by a person reading a finished book: the cleared victim,
the joke assigned to somebody in custody, the murderer missing from the page. Each is a contradiction
between two facts the contract already holds, and can be decided before a single call is made.

`probes/contract-lint.mjs` builds the real contract for **every stored project (64, none failed)** and
tests nine invariants. **MEASURED**, with 95% Wilson intervals:

| invariant | violated in |
|---|---|
| nobody cleared is the victim | **56 of 64 books — 88% [77–94]** |
| nobody cleared is a culprit | 0 of 64 [0–6] — yesterday's fix holds |
| the culprit is on some page before the reveal | 2 of 64 — 3% [1–11] |
| **the culprit is on the reveal chapter's page** | **35 of 64 — 55% [43–66]** |
| every name in a scene's cast is a cast member | 22 of 64 — 34% [24–47] |
| **whoever owns a wit line is on that chapter's page** | **395 of 647 chapters — 61% [57–65]** |
| no wit beat at the body, the test or the reveal | 177 of 647 — 27% [24–31] |
| the aftermath's "first of them we see" is not in custody | 7 of 64 — 11% [5–21] |
| an owned trait is in no every-call section | 15 of 64 — 23% [15–35] |

Two things follow.

*(Part IV §31 restates these by distinct case: 31 casts, victim cleared 74% [57–86], culprit off the
reveal's page 48% [32–65]. No conclusion reverses.)*

**The linter is the acceptance test for step 0.** Part II's §18 said "re-run the harness on this run". The
stronger test is the archive: each invariant at 0 of 64. It also corrects Part II: the murderer on *no*
page (this book) is rare, 2 of 64; the murderer missing from the *reveal's* page is the common form, in
more than half the books.

**D4 cannot be a filter.** If the rule is only "the carrier must be on the page", then in **65 of 647
chapters (10%)** nobody eligible is there, and only 24 of 64 books keep every beat. The cause is the
method: carriers are chosen by `(chapter − 1) mod n`, which cannot see who is present. The right form is
an **assignment**: a bipartite graph of chapters and carriers, an edge where the carrier is on the page
and the map permits a beat, each carrier used as evenly as the edges allow. At ten chapters by five
people it is solved exactly. The same form gives every owned item — trait, place note, shared history,
stock line — exactly one chapter in which its owner is present, which today's greedy "first chapter that
fits" does not guarantee.

For P3 the same logic states the victim's condition as a three-state machine — alive, dead, found — with
one state per chapter and one transition allowed between chapters. "Alive then a corpse in one chapter",
which a reader called "two scene versions spliced together", becomes a violation the linter reports
rather than a thing a reader finds.

---

## 22. Statistics — what a test can and cannot tell us (M3, M4, M5)

### 22.1 "Three drafts would settle it" was wrong — M3

Part II said three single-chapter drafts would settle whether the writer opens on narration. **Three of
three successes prove only that the rate is above 37%** (exact one-sided 95% bound: 0.05^(1/3)). What the
plan needs is "at least one of three drafts complies, 95% of the time", which requires a rate of **63%**
(99%: 79%).

| straight successes | the rate is at least |
|---|---|
| 3 | 0.37 |
| 5 | 0.55 |
| 9 | 0.72 |
| 14 | 0.81 |
| 29 | 0.90 |

The efficient design is a **sequential test** (Wald): H0 the rate is 0.37, H1 it is 0.75, 5% and 10%
error. **Stop and accept after five straight successes; stop and reject after three straight failures;**
about six to eight drafts on average. That is the rule for prediction 1, and for any instruction of a
kind this writer has not been sent before.

The record in §14, with intervals, is the prior for the next proposal:

| kind | rate [95%] |
|---|---|
| a given noun phrase printed verbatim | 49% [39–60] |
| "once in the book" kept exactly | 51% [36–67] |
| a "never explained" label printed three or more times | 6% [3–12] |
| occupation stated at first appearance, unasked | 23% [16–31] |
| a chapter opening on narration, unasked | 0 of 25 — at most 11% |
| scene 1 written as a gathering | 0 of 64 — at most 4.6% |

### 22.2 What one matched pair can decide — M4

The log holds four cases that were each written three to eight times on the same upstream (18 drafts). The
spread within a case is the noise a matched pair has to beat. **MEASURED** (an upper bound: some of those
re-runs had code changes between them):

| instrument | SD on identical upstream | one pair detects a change of |
|---|---|---|
| body-part tail per 10k | 23.6 | 65 |
| repeated 4-grams per 10k | 60.6 | 168 |
| paragraphs opening on speech, % | 8.6 | 24 points |
| compressed-size ratio | 0.006 | 0.016 |
| sentence-opener entropy, bits | 0.16 | 0.45 |
| sentence-length autocorrelation | 0.05 | 0.14 |

A change of one SD needs **16 pairs** at 80% power. So §18's predictions sort into three kinds:

| prediction | one pair decides? |
|---|---|
| 3 place and year on the page; 5 reactions and police; 6 "empty chair"; 7 victim not cleared; 8 no proxy reply; 9 "the period" and "chapter"; 12 clue coverage | **yes** — the baseline is zero or the cause is deterministic |
| 4 occupation stated for 4 of 4 | **yes** — at the 23% base rate, four of four by chance is 0.3% |
| 1 opening on narration | **no** — it is a rate; use §22.1's stopping rule |
| 10 each trait label at most twice | **no — uninformative**: 111 of 118 traits (94%) already pass. Withdrawn as a prediction |
| 11 tail, repetition | only if the fall is 65 and 168 or more; otherwise 16 pairs |

### 22.3 The page list is wrong in half the chapters — M5

Several proposals key on the contract's "On the page" list: P1 introduces a person in the first chapter
that lists them; D4 lets a carrier speak only if listed. **MEASURED** over 250 chapters, by a proxy (a
cast member's name followed by a verb of speech or movement):

- a living cast member acts or speaks who is **not on the list in 47% of chapters [41–53]**;
- **21% [19–24]** of all appearances are unlisted;
- **13% [8–20]** of people first appear in an earlier chapter than any list names them.

So an introduction keyed to the list arrives a chapter late for one person in eight. **INFERRED:** much of
this is our own doing — 61% of wit chapters name an owner who is not listed, and the writer walks them in.
The implementation follows: fix D4 first, then re-measure; and make P1 a standing rule with a **checker on
the text** — the sentence in which a name first occurs must carry the occupation's stem — rather than a
line in one chapter's contract.

---

## 23. The selector does not weigh what it says it weighs (M6)

The selector standardises each instrument against the mean and SD of **49 v1 books**, then applies
editorial weights: register −3, speech-opening share +1.5, long sentences +1, wit +1, repetition −1. But
it chooses between drafts of one chapter, and drafts differ on a different scale from books. **MEASURED**
on the 20 three-draft selections in the store:

| instrument | weight as written | SD between drafts ÷ calibration SD | effective pull |
|---|---|---|---|
| speech-opening share | 1.5 | 1.9 | **2.9** |
| long-sentence share | 1 | 2.8 | **2.8** |
| register | 3 | 0.7 | 2.2 |
| wit | 1 | 1.9 | 1.9 |
| repetition | 1 | 0.1 | **0.1** |

The term that decided chosen-against-runner-up: speech-opening 9 of 20, wit 5, register 3, long sentences
2, a hard gate 1, **repetition 0**. Register, written as the heaviest weight, is third. Repetition is
inert.

Three consequences:

1. **It corrects §13.3.** The 1.40 an establishing passage costs is decisive only where the drafts are
   close (this run's chapter 1, spread 1.33). The median spread is 8.7. The real hazard to W2 is that the
   selector's strongest term is the one a narrated opening lowers.
2. **L5 would do nothing as proposed.** A second repetition term on the same scale would inherit the same
   0.1.
3. **The fix is arithmetic.** Standardise on the SD *between drafts* — or rank the drafts on each
   instrument and sum weighted ranks — and the written weights mean what they say. No new instrument, no
   new call. *n* is 20 selections from two runs; log the vectors for a few more before changing the weights
   themselves.

---

## 24. A number for "wooden", with no word list (M7)

Part I's instruments needed lists (body parts, n-gram sizes). Three need none, and the canon supplies
their floors. **MEASURED** against 162 canon windows of this book's length:

| instrument | this book | canon median | canon range | canon worse than the book |
|---|---|---|---|---|
| compressed size ÷ raw size (lower is more redundant) | **0.300** | 0.371 | 0.344–0.393 | 0 of 162 |
| entropy of a sentence's first word, bits | **4.31** | 5.99 | 5.21–6.90 | 0 of 162 |
| share of sentences opened by the five commonest first words | **59%** | 33% | 23–49% | 0 of 162 |
| sentence length, lag-1 autocorrelation | **−0.07** | +0.17 | +0.02 to +0.32 | 0 of 162 |
| sentence length, coefficient of variation | 0.67 | 0.70 | 0.54–0.89 | 53 of 162 |

The last row is the control: the *spread* of sentence lengths is normal. What is abnormal is their
*order*. In the canon a long sentence tends to follow a long one and a short one a short one — a page of
talk, then a paragraph of narration. Here the correlation is zero or negative: **every paragraph is the
same unit**, a line of speech and a long action tail, repeated. That is the sound, and it is the direct
arithmetic consequence of two format rules: each spoken line gets its own paragraph with what the speaker
does after it, and every paragraph has a person handling a thing. W2 (paragraphs with nobody in them) and
L6 (spoken lines with nothing after them) are the two proposals that create runs, so this is the number
they should move.

Measured like for like — every text on its first 60,000 characters (`floor-probe.mjs`) — the canon's floors
are: compressed ratio **minimum 0.346**, 5th percentile 0.357; opener entropy **minimum 5.12**, 5th
percentile 5.54. The nine v2 books long enough:

| book | compressed ratio | opener entropy | repeated 4-grams |
|---|---|---|---|
| 1002-1830 | 0.360 | 5.26 | 59 |
| 0925-1214, 0925-1240, 0930-2042, 1002-1855 | 0.351–0.355 | 5.16–5.46 | 78–175 |
| 0925-1823 | 0.339 — below the canon's minimum | 5.20 | 238 |
| **this book** | **0.314** — below | **4.79** — below | 609 |
| 1002-0022 | 0.294 — below | 4.19 — below | 1,094 |
| 0925-1318 | 0.285 — below | 5.15 | 683 |

**This replaces L7's threshold problem.** The canon's maximum on repeated 4-grams would fire on most of our
books. The canon's *minimum* compressed ratio fires on **4 of 9** v2 books, the four with the most
repetition, and one pair detects a move of 0.016 where this book is 0.03 below the floor. Two cautions.
Over the whole archive the same floor fails **167 of 198** books: v1 was more redundant than v2, so the
verdict is for v2 books and should be re-derived when the engine changes. And on opener entropy **all nine**
v2 books sit below the canon's 5th percentile: even the best of them begin their sentences in fewer ways
than 95% of the canon.

---

## 25. What is repeated, and whose wording it is (M8)

### 25.1 Attribution — and a correction to Part I

Every four-word sequence used three or more times, names excluded: 676 occurrences. Each was matched
against the text every call reads (bible and brief) and against the chapter contracts. **MEASURED:**

| the wording is | occurrences | in five or more chapters | examples |
|---|---|---|---|
| in the bible or brief | 190 — **28%** | 62 | "quarter to nine and" ×10, "shift change at eight" ×7 |
| in one chapter's contract | 36 — 5% | 0 | "the drip of water" ×4, "the empty chair the" ×5 |
| **in no instruction — the writer's own** | 450 — **67%** | 73 | "the memory of his" ×9, "him through the uncertainty" ×7, "her pen moving with" ×7 |

§6.2 said "almost every one traces to a line we send in every call." By mass it is **a third**. The match
is strict (the same words, or all the content words on one prompt line), so a paraphrased leak counts as
the writer's own and the true share is somewhat higher — but the order of magnitude stands. **Removing our
sources (L1, L4, L8, D5) can take out at most about a third of the repetition.** The larger part is the
writer's own formulae, compounding because each call reads the whole book so far. So the step-3 items are
not optional for point 5; they are most of it.

### 25.2 Keyness — a ranked list with nobody writing it

Dunning's log-likelihood of each phrase's rate in the book against 4.9 million words of canon, names
excluded. The top of the list, **MEASURED:**

> the ledger ×40 · the fog ×47 · quarter to nine ×29 · the evidence ×44 · the investigation ×32 · her folio
> ×20 · quarter past nine ×22 · the cellar ×27 · **was asked ×25** · the staff ×23 · **the memory of ×22** ·
> **the timeline ×14** · knife handle ×13 · **hands steady ×13** · her fingers ×23 · shift change ×11

It finds, unprompted, what took Part I a hand-built table: the passive "was asked", the tail ("hands
steady"), the "memory of" formula. Two uses:

- **Editor findings ranked by keyness.** Drop the phrases the bible contains (the case's own nouns — the
  echo checker already has that rule), keep those present in three or more chapters, and hand the editor
  the top few with every sentence quoted. It is a list generated from the book and the canon, so it is not
  the closed-vocabulary trap, and it reaches the 67%.
- **Period check from frequency.** "The timeline" (×14) and "shift change" (×11) occur **zero times** in
  4.9 million words of canon. A phrase used three times or more that the canon never uses is an anachronism
  candidate, with no word list to maintain.

---

## 26. Two methods stated, not built (M9, M10)

**M9 — evidence load.** The median book's busiest chapter carries 4 pieces of evidence; this book's
chapter 6 carries **10**, and four chapters carry none (median Gini across 64 books: 0.41). Placement is
a scheduling problem — minimise the largest chapter load, subject to each clue appearing before it is
used and before the reveal — and at 24 clues by 10 chapters a greedy longest-first pass is within one of
optimal. It matters twice here: P3 moves four placements out of chapter 1, and step 1 adds obligations to
it. Not built; the measure is in `contract-lint.mjs`.

**M10 — choosing the opening.** If the opening is drafted more than once, choose by two numbers: how many
of the profile's concrete nouns it uses (coverage), and its smallest distance from the openings of past
books (`data/opening-corpus.json`, built from 189 manuscripts, already lists the over-used opening words:
*scent, faint, against, morning, pressed, damp, hush*). Maximising the minimum distance is the direct
guard against X94's sameness. Not built.

---

## 27. What Part III changes

| | before | after |
|---|---|---|
| step 0's acceptance test | the harness on this run | **the linter at 0 violations over 64 projects** |
| D4 | filter carriers by the page list | **assignment** — a filter loses 10% of beats |
| P5 | "the culprit is on no page" | mostly **"not on the reveal's page"** — 55% of books |
| P1 | a line in the first chapter that lists the person | a standing rule and **a checker on the text** — the list is wrong in 47% of chapters |
| W2's open question | "three drafts settle it" | **accept at five straight, reject at three straight** |
| W2's selector guard | exempt the passage | **standardise the selector between drafts**; the exemption follows |
| L5 | a second repetition term | inert until the selector is re-standardised; then real |
| L7 | our own distribution for the threshold | **the canon's floor on compressed ratio (0.346) and opener entropy (5.12), on a fixed 60,000-character window** |
| point 5 as a whole | "remove our sources" | our sources are a third; **keyness-ranked editor findings** for the rest |
| predictions | twelve, all read off one pair | eight a pair decides, one needs the stopping rule, one withdrawn, two need 16 pairs or a large fall |

New predictions for the matched pair, from §24: compressed ratio rises by 0.016 or more toward 0.346;
opener entropy rises by 0.45 or more toward 5.12. Autocorrelation is reported, not predicted — the canon's
floor is nearer than one pair can resolve.

**Revised order.** Step 0 gains M1 (the linter, first — it is the test for everything else in the step)
and M2. A new **step 0.5**: M6, then the sequential test of the opening rule. Step 3 gains M7 and M8 and
moves ahead of step 2 for point 5, because it carries two-thirds of it.

---

## 28. What Part III could not check

- **Whether the three drafts of a chapter differ in how much they repeat the book so far.** Draft texts are
  not stored, only their scores. L5 depends on it; log it in shadow.
- **The noise table is an upper bound.** Some of the 18 re-runs had code changes between them.
- **The walk-in rate is a proxy** (a name near a verb of speech or movement); it has not been checked by
  hand against a chapter.
- **Selector pulls rest on 20 selections from two runs.**
- **Attribution is strict**, so "the writer's own" at 67% is a ceiling.
- **M9 and M10 are not built**, and nothing here says a balanced load or a chosen opening reads better.

---

# PART IV — what WP-006 adds

## 29. The comparison, and the answer

WP-006 (*Decide, estimate, allocate*, written the same day in a parallel session) sorts every function
by its job — **decide** a fact about one case (logic), **estimate** a property of many books
(statistics), **allocate** a fixed amount (mathematics) — and offers a kit of sixteen (K1–K16). It
already absorbs A_110 Part III. This part goes the other way: which parts of WP-006 change A_110's plan.
Each was **run** on this book, this run's artifacts, the prompt log or the archive
(`probes/wp006-leverage.mjs`, `probes/tail-threshold.mjs`), and each probe was first shown to find a
known positive.

**Fourteen items in WP-006 change A_110**: five change what gets built (§30), one restates A_110's
figures by distinct case (§31), three change how a result is read (§32), four change the form of items
already planned (§33), and one reframes point 5 (§34). Three parts of WP-006 do not apply (§34).

| # | WP-006 | A_110 item | measured here | change |
|---|---|---|---|---|
| 1 | §3.2, K1 — register is out of its regime | W2's checker guard; Part I prediction 9 | the editor's `register_sentence` fires on **25.5%** of canon narration and **0.8%** of this book | in v2 it reports and does not send findings to the editor |
| 2 | K9 — a per-chapter threshold from the worst chapter | L6, the tail | the canon's worst chapter has at most 3 tails in 95% of books; this book has 13 to 25 in every chapter | L6 fires at **4 or more per chapter**: 3% of canon books, 10 of 10 chapters here |
| 3 | §2.4, K5 — a check needs a witness | point 5 | the "passage already used" finding **cannot fire**: its spans are 6 words, its floor is 8 | new step-0 item **N7**: revive it |
| 4 | §4.4 — `toBudget` is a prefix rule | R2, and §10's open question | 8 pairs cost 591 of 600 tokens; pair 9 overflows; **the three dropped are all the detective's** | budget to fit all eleven, ordered by the reader's need |
| 5 | K11 — specimen audit | D5 | of 93 example phrases in v2 instructions, **84 never reach the page; 9 do, from four lines** | D5 covers four lines, not two; the audit is its regression test |
| 6 | K16 — selection margin | M6, L5, W2's selector guard | re-standardising changes **4 of 20** picks; repetition changes **none** at any weight; speech-opening share decides | the speech-share exemption is the guard that matters; L5 is an ordering rule |
| 7 | K7, K8 — a rule is a classifier; a screen has a null | §24, L7 | none of seven page instruments clears the bar against the reader | L7 is the owner's instrument, never a read rule |
| 8 | §6–§7 — effective n | §14, §21, §22, §24 | 64 projects are **31** casts; 26 v2 runs are **10** cases; 233 manuscripts are **52** casts | every rate restated by case (§31) |
| 9 | §2.5, K6 — order rules are one evaluator | M1 and the acceptance tests | — | build K6 once; A_110's invariants are its first rows, run on the text too |
| 10 | §2.1 — construct, do not check | P3, P2 | the culprit's alibi is constructed and right 25 of 25 times; authored windows 8 of 25 | the victim's state is constructed from the beat arc; `whyHere` sits beside K2's `eliminated_by` |
| 11 | §2.3, K4 — unknown is an answer | W1, the linter | — | `worldSection` reports *unknown*, not nothing |
| 12 | §4.3 — allocate only after checking feasibility | D4, M9 | D4 as a filter loses 10% of beats | Webster and Bresenham over the feasible chapters keep the total |
| 13 | §4.1 — the lexicon is a growth law | point 5 as a whole | this book: Heaps β 0.602, 1,556 distinct words per 8,000; **443 concrete words upstream never reach it** | points 1–4 are the main lever on point 5 |
| 14 | §3.6, K12 — the A/A pair | §18's matched pair | — | a third arm with no lever flipped, about £0.45 |

---

## 30. The five that change what gets built

### 30.1 The register checker is anti-calibrated in v2 — MEASURED

WP-006 §3.2 shows machine-register rate lost its relation to the mark from 1 September (slope −0.07 ±
0.18). The editor still acts on it. Run on 31,414 narration sentences from 162 canon texts and on this
book's 499:

| check | canon narration | this book | book ÷ canon |
|---|---|---|---|
| `register_sentence` (score ≥ 3) | **25.5%** | **0.8%** | 0.03 |
| the same at score ≥ 4 | 0.2% | 0.2% | 1.0 |
| `abstract_subject` | 0.15% | 0.00% | — |
| `operation_narrated` | 0.00% | 0.00% | — |
| **the body-part tail** | **0.44%** | **28.7%** | **65** |

The 0.8% is four sentences: the four `register_sentence` findings the harness reported on this book, so
the probe reproduces the checker. At no threshold does `register_sentence` separate this book from the
canon. At its working threshold it fires **thirty times more often on the canon**. In a 2,500-word canon
window it finds a median of 21 sentences, and **98% of windows reach the editor's cap of eight**.

So the check does not detect the machine register in v2. It detects narration, and asks the editor to
turn it into a person handling an object. That is the mechanism Part II saw on W2 (§13.2), and it is
general: the more canon-like v2's narration becomes, the more repairs it is sent. K1's rule — *an
instrument whose interval contains zero has weight 0* — applies to the editor as it does to the selector.

**Change.** In v2, `register_sentence` is counted in the run report and not sent to the editor until K1
prints a slope that excludes zero. `abstract_subject` stays: 0.15% on the canon is a clean null. W2's
checker exemption (Part II guard b) shrinks to `abstract_subject` alone. **Withdrawn:** Part I
prediction 9 ("the register rate does not rise") — the rate carries no information in this regime.
**Corrected:** §6.2(f)'s "the one validated instrument" — validated before 1 September, not now.

### 30.2 The tail, with a threshold the canon sets — MEASURED

The tail is the cleanest discriminator in Part IV: 28.7% of this book's narration, 0.44% of the canon's.
WP-006's K9 says a per-chapter threshold must come from the distribution of a book's **worst** chapter.
Over 162 canon texts, the worst of ten chapter-length windows holds a median of 1 tail, a 95th percentile
of 3 and a maximum of 4.

| a finding at … tails per chapter | canon books it fires on |
|---|---|
| 2 or more | 52 of 162 — 32% |
| 3 or more | 19 — 12% |
| **4 or more** | **5 — 3%** |
| 5 or more | 0 |

This book's chapters hold 18, 18, 20, 17, 25, 25, 17, 20, 13 and 18. **L6 becomes: at four or more in a
chapter, the editor receives every such sentence, and the instruction is a count — cut the ending from
all but three.** It is a deletion edit, the safest kind. The per-chapter volume (13 to 25 edits) is
larger than any editor round so far; **INFERRED:** it may need its own round.

WP-006 §4.2's cross-book house phrases are the same family — *gaze fixed on the* in 12 of 12 v2 casts,
*hand resting on the* in 12 — so K11's house-phrase load is L6's cross-book counter.

### 30.3 The repetition finding cannot fire — MEASURED (WP-006 §2.4, on this book)

`findings.ts:346–356` sends the editor the book's worst repeated passages, but only if a span reaches
`MIN_QUOTE_WORDS = 8`, and `repetitionDensity` returns six-word spans. On this book the five worst are
all six words — *quarter to nine and quarter past* ×9, *to follow the evidence wherever it* ×5 — and the
finding fired **0** times. The one existing editor finding for point 5 has never reached an editor.

**New step-0 item N7.** Quote the sentence that contains the span (as `anchorFindings` already does for
short critic quotes), and skip any span whose content words are all in the bible. The clock values and
the case's own nouns must stay: WP-006 §3.3 found the book that read 87 had its own locked clock time as
its worst span. On this book N7 would send *follow the evidence wherever it led* ×5 and its kin. Its
witness is this book.

**STATUS 2026-10-03 — half built, in a parallel session (`60a06430`, merged to main in `85c24445`).** The
finding now fires: it locates the span and quotes the enclosing sentence, and that commit measured it on
229 of 230 archived books. **The skip was not built.** By that commit's own count, **922 of 2,168 findings
(43%) sit on clock-time phrases**, which the editor's prompt tells it to keep exactly. Those findings
cannot be acted on and each one costs an edit-list slot. Remaining work for N7: skip a span whose content
words all occur in the bible, then re-count on the same 230 books.

### 30.4 Why three relationships were missing — MEASURED (WP-006 §4.4)

Part I §10 left open why three of eleven pairs never reached the writer. `toBudget` (`bible.ts:104`)
stops at the first line that would overflow. The relationship lines cost 85, 78, 68, 73, 78, 69, 79 and
61 tokens: **591 of a 600-token budget**. Pair 9 (66) overflows and the loop stops. No later line would
have fitted either. The three dropped are Eleanor–Agatha, Eleanor–Charles and Eleanor–Isabel: **every
pair belonging to the detective, the reader's eyes**, because they come last in Agent 2's list.

**R2 becomes:** a relationships budget that fits every pair (about 825 tokens here; the 600 is
self-imposed, and the memory on file says the ceiling rationale is withdrawn), ordered by the reader's
need — the detective's pairs, then the victim's (5 of 11 here, which D1 needs for "what they were to
him"), then the rest. If a budget must still cut, it cuts from the end of that order.

### 30.5 The specimen audit finds every leaking example — MEASURED (WP-006 K11)

The probe extracts every list of examples from the v2 brief and chapter contracts, then counts each
example in the newest draft of each of the ten distinct v2 cases and in 2.9 million words of canon. It
first had to pass the two leaks Part II found by reading; the first version missed both and was fixed.

| example | v2 cases | uses | against the canon | from |
|---|---|---|---|---|
| empty chair | 3 of 10 | 13 | 321× | `run.ts:235` custody line |
| next question | 5 of 10 | 8 | 9× | `brief.ts:190` — "a movement, an object handled, a look away, the next question" |
| letter(s) sent | 1 | 5 | 21× | `brief.ts:255` aftermath line |
| door(s) unlocked | 1 | 5 | 18× | `brief.ts:255` |
| object handled | 2 | 2 | never in the canon | `brief.ts:190` |
| assumption admitted | 1 | 1 | never in the canon | `brief.ts:270` clearance line |

Eighty-four of 93 examples never reached a page. That is the rule's base rate, and it says D5's diagnosis
was right in kind and narrow in scope. **D5 becomes four lines**: the custody line, the aftermath line,
the exchange-shape line and the clearance line each lose their examples. Each states its operation with
a count or a slot instead. The audit replaces "extend `EXAMPLE_MARKERS`": it is generated from the
instructions, needs no list, and fails when a new example starts to leak.

---

## 31. A_110's figures restated by distinct case — MEASURED (WP-006 §6–§7)

WP-006's rule: count by distinct case, because one case written several times is one observation.
Clustering by cast, as WP-006's `unique-case-sameness.mjs` does:

| A_110 figure | as published | by distinct case |
|---|---|---|
| §21 victim among suspects to clear | 56 of 64 projects — 88% | **23 of 31 casts — 74% [57–86]** |
| §21 culprit not on the reveal's page | 35 of 64 — 55% | **15 of 31 — 48% [32–65]** |
| §21 wit owner off the page | 61% of 647 chapters | **65% [59–70] of 310** |
| §14, §22.1 compliance rates | "25 v2 runs", "250 chapters" | **10 distinct cases**; chapters within a book are not independent |
| §22.1 a chapter opening on narration, unasked | 0 of 25 — at most 11% | **0 of 10 cases — at most 26%** |
| §22.1 scene 1 written as a gathering | 0 of 64 — at most 4.6% | **0 of 31 casts — at most 9%** |
| §15 L2, clock density against repetition | ρ 0.11 (34 books) | **ρ 0.13 over 52 casts; 0.22 over the 15 since 18 September** — the recommendation against stands |
| §24 compressed ratio below the canon minimum | "4 of 9 v2 books, the right four" | **3 of 6 v2-era casts**; one cast's two arms read 0.286 and 0.340 |

No conclusion reverses. Every interval widens. The last row also shows the instrument's limit: two arms
of one case differ by 0.054, so a single book's verdict against the floor is weak evidence.

---

## 32. How a result is read

**32.1 None of the page instruments predicts the reader — MEASURED (K7, K8).** Seven instruments against
the headline and prose mark, over every full-length read with 60,000 characters (48) and one read per
cast (22), with WP-006's simulated bar for the largest of fourteen tests (0.42 and 0.59):

| instrument | r with the headline, 48 reads | r with prose, 22 casts |
|---|---|---|
| compressed ratio | 0.20 [−0.09, 0.45] | 0.16 |
| opener entropy | 0.17 [−0.12, 0.43] | 0.43 |
| length autocorrelation | −0.02 | 0.35 |
| Heaps β | −0.09 | −0.09 |
| distinct words per 8,000 | 0.00 | −0.08 |
| repeated 4-grams | −0.12 | −0.10 |
| body-part tail | −0.16 | 0.00 |

None clears the bar. As a rule, "compressed ratio below the canon minimum" flags 18 of 22 casts and
separates them by −4.6 ± 3.5 marks. This is WP-006 §3.3's SHIP-CHECK result again. **So L7 and the §24
instruments are the owner's instrument for point 5 and a guard against sameness. They are not a
predictor of the read, and must never become a rule about which books to read.** It also answers WP-006
§8's open question for Heaps β: against 48 reads, r = −0.09.

**32.2 The matched pair gets an A/A arm (K12).** Part III's noise table is an upper bound, from re-runs
with code changes between them. A third arm — `RESUME_REDO=prose` on this run with **no lever flipped**
— gives the draw noise on this exact case for every instrument prediction in §18 and §27, for about
£0.45 more (≈£0.90 for both redo arms). A prediction that B meets and A′ also meets was met by chance.

**32.3 The selector, by K16.** On the 20 logged selections (the probe recomputes 15 of the 20 logged
winners; the log omits the em-dash term):

| change | picks that change, of 20 |
|---|---|
| any one weight ±20% | register 3, speech 1, long sentences 1, wit 1, **repetition 0** |
| any one weight set to 0 | **speech 9**, long sentences 5, register 4, wit 3, **repetition 0** |
| M6, standardise between drafts | 4 |
| M6 and register at 0 (K1) | 4 — the same four |

M6 is real and modest. Register can go to zero at no cost once M6 is in. Repetition never moves a pick,
so by K16's rule it is removed or replaced by an ordering rule. That is the form L5 should take: among
drafts within a margin of the best, prefer the one that repeats the book least. Speech-opening share
decides most picks, so W2's guard that matters is excluding the establishing paragraphs from that share.

**32.4 Read a category as a deviation (K13).** WP-006 §3.1: one factor carries 57% of the variance in
the ten marks. Part I §8 argued the reader cannot see the owner's five; this is the mechanism. If a read
is spent, score atmosphere and character as their deviation from the book's own mean.

**32.5 A_110 cannot test WP-006's falsifier.** WP-006 stakes its claim on the next ten named defects
being reportable from the artifacts before the read. A_110's defects were known when WP-006 was written,
so they cannot count. The next ten after this document are the test.

---

## 33. The form of items already planned

- **K6 before A_110's linter.** WP-006 §2.5 writes A_110's invariants as formulas over a finite trace of
  chapters. Build the evaluator once, about a hundred lines with the rules as data. A_110's nine
  invariants are its first rows. Then add the acceptance checks Parts II–III asked for — introduced at
  first appearance (P1), a reaction from each person present before the evidence (D1), authority sent
  for before the arrest (D2), the victim's alive–dead–found automaton (P3) — and **run them on the
  manuscript as well as the contract**, because the contract's page list is wrong in 47% of chapters
  (§22.3).
- **P3: construct the victim's state.** WP-006 §2.1: the alibi the code constructs is right 25 times in
  25; the windows the model authors hold 8 times in 25. The ten-beat arc is fixed and mandatory, so code
  knows chapter 1 is the Gathering and chapter 2 the Crime. Derive the victim's state per chapter from the
  beats and check Agent 7's content against it, rather than asking Agent 7 to mark `victimAlive`.
- **P2 beside K2.** `whyHere` and K2's `eliminated_by` are one typed record per person. With K3's schema
  paths, an arrival time can be checked against that person's alibi window; free text cannot.
- **W1 is three-valued (K4).** The `[object Object]` fix replaced a wrong answer with no answer, which is
  K4's failure exactly. `worldSection` reports *unknown* to the run report when it cannot read the place,
  and its witness test asserts the place is present.
- **D4 and M9 as allocations (§4.3).** Webster apportionment and Bresenham spacing (WP-005, designed) over
  the chapters where a carrier is present keep the book's wit total; the plain filter loses 10% of beats.
  Evidence placement is a topological order with the largest chapter load minimised. Chapter 1 needs
  both once P3 moves four placements out of it.

---

## 34. Point 5 is mostly points 1 to 4 — INFERRED from MEASURED parts

WP-006 §4.1 shows the lexicon problem is a **growth law**. Within any 500 words our prose varies and
reaches for ornate words; over thousands, new words stop arriving. This book has Heaps β 0.602 and 1,556
distinct words in its first 8,000 tokens, against WP-006's v2 median of 1,670 and canon median of 1,806.
Part I §6.1 found the whole-book shortfall: 1,872 distinct words against a canon median of 2,428, about
556 short.

New words arrive with new subject matter, not with synonyms. **443 concrete words in this run's own
upstream artifacts appear nowhere in the book**: 201 from the place (*whitewash, mullioned, slate,
storey, peeling*), 155 from the period (*charcoal, navy, breasted, overcoats, collars*), 77 from the
setting (*fishermen, perched, transient*) and 37 from the people (*schoolteacher, shipowner, research*).
That reservoir is the same size as the shortfall.

So the levers for the owner's first four points — the place described (W1–W3), people introduced (P1,
P2), the death met by the world outside (D2) — are also the largest available lever on the fifth. The
deletions (D5, L1, L4, L8) remove repetition, but they add no new words. **MEASURED:** the reservoir.
**INFERRED:** that a fraction of it reaching the page lifts β. Add K10 (β and distinct words per 8,000) to
the matched pair's instruments as a report. §32.1 shows no lexicon instrument predicts the external read,
so this is the owner's measure, as point 5 is the owner's complaint.

**Not leveraged from WP-006**, and why: K15 (seed streams) — the matched pair replays upstream byte for
byte, so it matters only for step 2's fresh run; §3.7 (axis shrinkage) — no bearing on one case; §4.5
(Chao1) — the corpus, not the book.

---

## 35. Build order — amends §18 and §27

- **Step 0 gains four items:** **N7** (revive the repetition finding); **R2** with the budget fixed and
  ordered; **D5 at four lines**, with the specimen audit as its test; `register_sentence` report-only in
  v2. The **K6 evaluator** is built first, and the linter's nine invariants are its rows.
- **Step 0.5 (M6)** also drops the repetition weight and takes L5 as an ordering rule.
- **Step 1:** W2's checker exemption narrows to `abstract_subject`; its selector guard is the speech-share
  exclusion.
- **Step 3:** L6 fires at four or more tails per chapter, with a count for the editor.
- **The matched pair** is three arms — A, A′ (no lever), B — at about £0.90. Predictions are scored
  against A′ as well as A. Part I prediction 9 and Part II prediction 10 are withdrawn.

## 36. What Part IV could not determine

- **Whether turning `register_sentence` off lets bad abstract sentences through.** The four it found here
  were bad sentences. Whether `abstract_subject` catches the same ones was not checked sentence by
  sentence.
- **Whether an editor round can carry 13 to 25 tail deletions per chapter.** No round has been that
  large.
- **K16's flip counts are approximate:** the probe recovers 15 of 20 logged winners.
- **The reservoir is an upper bound.** The word filter is crude, and some upstream words are abstract or
  belong only in the bible.
- **Whether the owner reads a higher β as a broader lexicon.** It separates us from the canon (WP-006),
  and it does not predict the external reader (§32.1). Only the owner's next read tests it.

---

## Probes

`documentation/analysis/ANALYSIS_110/probes/`:

- `owner-read-probe.mjs <manuscript.md>` — sections A to F of the counts above and the canon comparison.
- `tail-probe.mjs <manuscript.md>` — the body-part tail against the 162 canon texts.
- `world-section-probe.mjs` — `THE WORLD` in the chapter-1 writer prompt of every v2 run in the log.
- `harness.mjs [bible|scenes|checkers|selector]` — the real contract, bible, checkers and selector from
  `dist` on this run's stored artifacts (Part II). Needs `npm run build:all`.
- `compliance-probe.mjs` — contract against draft for every v2 run in the log (§14).
- `outlines-probe.mjs` — every stored outline, CML, cast and setting (§13.1, §13.5).
- `stories-probe.mjs` — the tail, clock density and repetition over `stories/` and `stories/_archive`.
- `canon-opening-probe.mjs` — how 149 canon texts open, and what our checkers make of them (§13.1–13.2).
- `contract-lint.mjs` — nine contract invariants over every stored project (Part III §21). Needs `build:all`.
- `stats-probe.mjs` — noise on identical upstream, the page list against the text, what the selector
  selects on, and the compliance bounds (§22–§23).
- `lexstats-probe.mjs [manuscript] [runId]` — list-free instruments, keyness, attribution (§24–§25).
- `floor-probe.mjs` — canon floors and our books on identical 60,000-character windows (§24).
- `wp006-leverage.mjs [budget|witness|dedup|null|k7|k16|specimen|reservoir]` — WP-006's kit applied to this
  plan (Part IV). `null`, `k7` and `specimen` read the canon and want `--max-old-space-size=6000`.
- `tail-threshold.mjs [manuscript]` — K9's book-level threshold for the tail finding (§30.2).

The upstream figures (artifact shapes, contract lines per chapter) were read from the run's stored
artifacts in `data/store.json` and its prompts in `logs/llm-prompts-full.jsonl`, paired by projectId and
runId.
