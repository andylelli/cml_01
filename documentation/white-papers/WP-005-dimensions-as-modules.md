# WP-005 — DIMENSIONS AS MODULES

**How to add a reader pleasure — humour, romance, dread, wonder, any of the twenty-eight — as one
directory that can be dropped in or deleted, given an amount, tested on its own, and never mentioned
by name anywhere else in the pipeline.**
2026-10-01 · figures MEASURED on the live tree at `7f219f62` unless labelled otherwise · prior art:
`humour-level.ts` (A_92), `depth.ts` (17-hitting-90 §07), WP-001 §4.3, WP-002 §3.3/§7, WP-004 §4.4,
ADR-0004, ADR-0011, CR-03 (the replay harness) · **no code is changed by this paper**

---

## ABSTRACT

This project has added two dimensions to its books. **Humour** arrived as a parameter (`humourLevel`,
four bands), a cast directive to Agent 2b, two profile fields, a per-chapter wit beat with owned
shapes, a label ban, a narrated-move finding and a calibrated instrument. **Depth** arrived as a
per-chapter texture assignment from material the upstream agents already wrote. Both work. Both are
smeared across the tree: humour touches **28 non-test source files in 7 workspaces**; depth, the
smaller and later one, **10 files in 3**. The second dimension was not cheaper than the first, and a
third built the same way will not be cheaper than the second. Nothing in the code says what a
dimension *is*, so each one is rediscovered.

**The claim.**

> **A dimension is a set of countable moves, each owned by one chapter, with a recogniser that can
> find it on the page and a name that never reaches the prose. Everything a dimension needs can live
> in one directory under `modules/<name>/`, discovered by a registry, and the rest of the pipeline
> need contain the word `<name>` nowhere.** Its *amount* is not a percentage of the prose — which
> this model cannot be asked for and we cannot measure — but a **share of a fixed per-book budget of
> owned beats**, converted to integers by an apportionment rule and spread over the chapters by a
> placement rule, with the asked-for count and the delivered count printed side by side in the run
> report. A module at share 0, or a module directory deleted, leaves every prompt byte-identical;
> the record/replay harness is the proof, and it costs £0.

**Why this is the right design for this system, in four measured facts.** (1) The model complies with
countable operations and ignores rates — VoiceSpec asked for 22.0 words a sentence and got 15.86 in 0
of 10 chapters; the humour guide asked for "one observation per three pages" and a book carried 3–5
markers (A_91). Shares therefore have to become counts *before* they reach a prompt, which is what
an apportionment does. (2) Anything shown to the model is copied: the enum value `polite_savagery`
reached one book's prompts twelve times and the reader quoted it back; the move's *description*,
written in words "no prose would carry", was narrated fifteen times in run 98dec72a. A dimension's
vocabulary must be checkable as a leak, which means it must be declared in one place. (3) Material
visible to every chapter call recurs in every chapter — the 69's "harsh winters" from one bible
trait line (WP-001 §4.3) — so a dimension's material belongs in the one chapter contract that owns
it, never the bible. That rule is the same for every dimension and is what makes a slot possible.
(4) The v2 contract already has the slot: `SceneContract.beats.{wit, depth, stake, relationship}`,
one renderer in `agent9-v2/run.ts`, one checker in `findings.ts`, one instrument in `prose-guard`.
The seams exist; they are hand-wired per dimension. This paper names them and makes them generic.

**What it buys.** A new dimension is one directory and one row in a manifest list. Deleting a
dimension is `rm -r`. Two dimensions cannot collide on a chapter, a character or a shape without the
apportioner knowing, because both declare what they need in the same form. Each dimension ships with
the instrument that measures whether it arrived, so a read scores it by category and the reader is
spent validating the instrument, not each lever. **Falsifier:** build the registry and move humour
into `modules/humour/`; if the full-pipeline replay is not byte-identical at band `classic`, or if
`grep -rl humour packages apps` outside the module and its tests returns anything, the claim is false.

---

## 1. WHAT WE HAVE BUILT TWICE, AND WHAT IT COST

### 1.1 Humour — MEASURED footprint

`grep -rlE "humou?r(Level|Style|Band|Move)|HUMOUR_|WitBeat|wit-density"` over `packages/` and `apps/`,
excluding `dist/` and `__tests__/`, 2026-10-01:

| workspace | files | what they do |
|---|---|---|
| `apps/web` | 5 | the spec control, vocabulary, spoilers, store, workshop state |
| `apps/api` | 1 | `server.ts` reads `humourLevel` off the spec payload (A_92 found it wired and never sent) |
| `apps/worker` | 7 | run contract, context, pipeline stages, Agent 2b runner, its scoring adapter, resume, the v2 renderer |
| `prompts-llm` | 6 | the bands, the Agent 2b cast directive, the voice capsule, the Agent 6.5 humour note, the beat selector, the barrel |
| `prose-engine` | 7 | contract, bible, brief, book contract, types, the move descriptions, the barrel |
| `prose-guard` | 1 | `wit-density.ts` through the barrel |
| `story-validation` | 1 | the Agent 6.5 scorer reads the humour note |
| **total** | **28** | |

That is one parameter, one upstream directive, two profile fields, one per-chapter beat, three owned
shapes, one label ban, one narrated-move finding, one instrument, one UI control — a complete and
well-made dimension — spread so that no single file states what humour *is* in this pipeline.

### 1.2 Depth — MEASURED footprint

`DepthBeat | assignTexture | beats.depth | texture`: **10 files in 3 workspaces** (`prose-engine` 5,
`prompts-llm` 4, `worker` 1). Smaller because it has no parameter, no upstream hook and no instrument
of its own; it reads material Agents 2b, 2c, 2d and 6.5 already produce (88% of which the writer had
never been shown — 17-hitting-90 §07).

### 1.3 The common shape — INFERRED from the two

Strip the names and both dimensions do the same seven things:

| step | humour | depth |
|---|---|---|
| **parameter** | `humourLevel` ∈ {none, dry, classic, sharp} | none (always on; `AGENT9_DEPTH_BEAT`, since retired into contract content) |
| **upstream material** | Agent 2b assigns `humourStyle`, `humourLevel` per character under a band directive | reads `formativeIncident`, `internalConflict`, `sharedHistory`, location variants, period constraints |
| **selection** | `chapterCarriesWitBeat` (`chapter % beatEvery === 0`), `selectWitBeat` over the living, `assignOwnedShapes` | `selectDepthBeat` rotated one off the wit beat; `assignTexture` by scene location and hour |
| **contract slot** | `beats.wit = { name, style, shapes }` | `beats.depth = { name, trait }`, `scene.texture` |
| **render** | one line in `agent9-v2/run.ts:281` — the move described, never named | `textureLines` + one line at `run.ts:296` |
| **check** | `humour_move_narrated`, `humour_forced`, the echo finder on `HUMOUR_MOVE_PHRASES` | the echo finder on `TEMPLATE` |
| **instrument** | `wit-density.ts`: four shapes, canon median 41.4/10k against ours 11.4 | `[A_91 beats]` telemetry: trait words in the first half |

Every one of the twenty-eight pleasures in the owner's list that *can* be a module (§3 says which
cannot) decomposes into these seven. That is the module contract.

### 1.4 What the reads say the first two achieved — MEASURED

Humour: the instrument tripled between seed 50862 and seed 95041 (11.4 → 29.6 per 10k) and the
reader's Humour mark stayed at **6** — *"detectable dry wit… but uneven and sometimes mechanical"*
(WP-002 §3.3). Depth: unverified until a paid run; its predictions are in 17-hitting-90 §07. The
honest reading is that a dimension can be *delivered* (the count arrives) without being *felt* (the
mark moves), and the two must be measured separately. §6 builds that distinction into the test plan.

---

## 2. WHAT A DIMENSION IS

A definition that is precise enough to be a type and loose enough to hold wonder as well as wit.

> **A dimension is a reader pleasure that reaches the page through MOVES.** A move is an act a named
> character performs or an event that happens to one, in one chapter, that a deterministic recogniser
> can find afterwards. Each move is **owned by exactly one chapter**, is **permitted only in some
> chapter roles**, is **carried by an eligible character**, costs a declared number of **contract
> tokens**, and has a **vocabulary** — the words that would name it — which may appear in the prompt
> only as a description of the act and may never appear in narration.

Three things are deliberately *not* in the definition:

- **A level, density or rate.** "Romance 10%" is a wish; "two romance moves in a ten-chapter book,
  chapters 3 and 7, carried by the arc pair" is an instruction this model obeys. §4 converts the
  first into the second and reports both.
- **A genre.** A dimension changes what is on the page inside a fair-play Golden Age mystery; it
  does not change the gate, the clue contract or the reveal obligations. WP-002 §7.1's receipt
  stands: a blend is a second product with validators written from nothing.
- **A mood word.** "Make it eerie" is a statistic in disguise. The module that carries dread
  declares the *moves* dread is made of in this genre and lets a recogniser count them.

### 2.1 The move is the unit, and the name is forbidden

The humour record is the receipt, four times over:

| what reached the prompt | what reached the page | fix |
|---|---|---|
| the enum `polite_savagery` (bible, brief, contract) | "polite savagery" ×12 in one book, quoted by the reader as a tag | `humour-move.ts`: the style as the thing the character DOES |
| the move's description — "says the cruellest thing in the room in its most courteous form" | "the cruellest thing in the room" and 14 other narrations in run 98dec72a | `humour_move_narrated`: two distinctive words of one move in a narration sentence |
| the shape names "flat answer", "short retort", "unmeant joke" | all three on the page | the renderer describes the shape and never says the name |
| the full `formativeIncident`, cause and all | the cause narrated as a label in seven variants (run 50862) | `AGENT9_DEPTH_TRAIT_ONLY`: show only what may be copied |

Generalised: **a module declares its vocabulary once** — the dimension's name, every move's name,
every move's description — and the host's echo finder treats all of it as a leak. The module cannot
forget the ban because the ban is derived from the declaration.

### 2.2 Material is born upstream; the move is placed downstream

Humour needed Agent 2b to decide who is funny before Agent 9 could ask anyone to be. Depth needed
nothing new, because the material already existed and was unread. Every dimension sits somewhere on
that line, and the module declares where: **which upstream agents it asks for material, which fields
it adds under its own namespace** (`profile.dimensions.<name>.*`, never a top-level field the
normalisers must learn), and which existing fields it reads. The module's upstream hook is a prompt
*section* contributed to an agent's shell, the same way `humourBand(level).castDirective` is spliced
into the Agent 2b prompt today — but contributed through a list the shell iterates, not a string the
shell names.

---

## 3. WHICH OF THE TWENTY-EIGHT ARE MODULES

The owner's list, classified by **where the material is born** and **what unit a recogniser counts**.
This is the only place the paper touches specific pleasures, and only to sort them.

| class | pleasures | born at | counted as | module? |
|---|---|---|---|---|
| **A — character moves** | humour, warmth, transgression, competence, pathos, drama, relationships, character fascination, transformation, revenge/justice, wish fulfilment | Agents 2/2b (who carries it), placed by Agent 9's contract | an act by a named character in one chapter: a short reply, a kindness done, a rule broken, a skill used to find a clue | **yes — fully** |
| **B — world moves** | wonder, supernatural allusion, spectacle, beauty-of-place, adventure | Agents 1/2c/2d/6.5 (the material), placed per chapter as depth is | a sight, sound, object or constraint that happens to somebody, once in the book | **yes — fully**, on the depth pattern |
| **C — information schedule** | mystery/curiosity, anticipation, surprise, shock, catharsis, intellectual stimulation | Agents 3/5/7/7.5 — the clue contract and geometry | the order in which the reader learns things; already the core's whole job | **partly** — a module may *count* and *place a reminder*, never own; the schedule is fair play's and stays in core |
| **D — register** | voice, beauty-of-sentence, recognition, novelty-of-prose | the sentence itself | a property of prose, not an act | **no** — not an obligation; reached only through draft selection (`selector.ts`) and the instruments that feed it, and WP-001 §8 says the honest lever there is sampling diversity |
| **E — meaning** | meaning, novelty-of-premise | Agents 1/3/3b, the gene map | a cell on the `axis × mechanism_family` map (WP-004) | **no** — it is the premise, and WP-004 is its paper |

The scheme in this paper covers A and B completely and C as a counter. **Three cautions carry
receipts.** Class A moves that pull toward a second plot (romance, revenge) are bands with a ceiling
— WP-002 K5 placed the relationship arc last, capped at `attraction`, because *The Moonstone* and
*The Sign of the Four* show a courtship *inside* the investigation and `resolved` is another genre's
register. Class B's supernatural is admissible only as *allusion that the case explains*: Knox's
second rule rules the supernatural out of the genre as a matter of course, and WP-004's own best
shape — *a natural agent dressed as a supernatural one* — is exactly a supernatural module whose
every move owes a natural explanation in a chapter at or before the reveal; the manifest must
declare that debt. Class C is where "shock" and "surprise" live, and they are the clue contract's;
a module that tried to add a reveal would be the GENRE_BLEND WP-002 §7.1 forbids.

---

## 4. THE AMOUNT — HOW "ROMANCE 10%, SUPERNATURAL 20%" BECOMES SOMETHING THE MODEL DOES

### 4.1 What the share is a share of

Not words. **MEASURED** the model ignores rates (§ABSTRACT fact 1), and no recogniser we own returns
"what fraction of this chapter is romance". What we *can* fix is the number of owned module beats a
book carries. Define the **beat budget**

> B = Σ over eligible chapters c of m(c)

where m(c) is the number of module beats chapter c may carry, declared by the host per chapter role:
the opening and the crime carry fewer; the reveal carries none except an aftermath-class move; the
aftermath carries one. For a ten-chapter book with eight pre-reveal chapters at m = 2 and the
aftermath at 1, B = 17. The puzzle's own obligations — clues to surface, clearances, the test, the
proof — are not in B; they are the core's and come first.

A **share** s_i ∈ [0, 1] is module i's fraction of B. Shares are **not** required to sum to 1: the
unallocated remainder is the puzzle's slack, and a book with Σ s_i = 0.3 is a book with mostly
untouched chapters — which is today's book. Σ s_i ≤ 1 is enforced; a request that exceeds it is
scaled, and the scaling is printed.

### 4.2 Shares to counts — apportionment

The quota q_i = s_i · B is almost never an integer (10% of 17 is 1.7). Turning quotas into integer
seat counts n_i with Σ n_i ≤ B and no systematic bias is the parliamentary apportionment problem, and
its answers are known. **Largest remainder (Hamilton):** give each module ⌊q_i⌋, then hand the
remaining seats to the largest fractional parts. **Webster/Sainte-Laguë:** choose the divisor d so
that Σ round(q_i / d) = B. Hamilton is simplest and has one known defect — the Alabama paradox, where
a larger B can *lower* a module's count — which matters here only if B changes between a run and its
matched pair; Webster does not have it and is the recommended rule (ASSUMED on the choice; both
reproduce the baseline below).

Two constraints the apportioner must honour, from the record:

- **The baseline is a fixed point.** With humour the only module at band `classic`, the result must
  be "every pre-reveal chapter carries one wit beat" — today's behaviour, byte-identical. `classic`
  therefore maps to s = N_pre / B where N_pre is the number of eligible chapters; `none` to 0; `dry`
  to roughly a third of that (today `beatEvery = 3`).
- **Tokens are a second budget.** Each move declares its contract cost t_i (a wit line ≈ 60 tokens;
  a depth texture set ≈ 170–200 words ≈ 250 tokens — MEASURED on the golden contracts). The
  per-chapter contract has a ceiling C; the apportioner solves for counts under Σ_c Σ_i t_i x_ic ≤ C
  per chapter and reports what it had to drop. **70% of the prose bill is the prompt**, so a module
  that is "10%" by share may be 25% by tokens, and the report says so.

### 4.3 Counts to chapters — placement

Given n_i beats for module i over N eligible chapters, which chapters? Today humour uses
`chapter % beatEvery === 0`, which at `dry` lands chapters 3, 6, 9 for every book and cannot express
n = 4 over N = 9; depth is "rotated one off the wit beat". Both are instances of one rule:

> **Even spacing with an offset.** Module i's beat falls on eligible chapter j (1-indexed) when
> ⌊(j + φ_i) · n_i / N⌋ > ⌊(j − 1 + φ_i) · n_i / N⌋, with φ_i ∈ [0, 1) an offset chosen per module.

This is Bresenham's line, or equivalently the integer rounding of a cumulative share; it places
exactly n_i beats with gaps that differ by at most one. The offsets φ_i are chosen to **minimise
collisions** — two modules on one chapter — and when collisions are unavoidable (Σ n_i > N) to spread
them so no chapter exceeds m(c). With k modules this is a small assignment problem; for k ≤ 5 and
N ≤ 12 exhaustive search over offsets in steps of 1/N is cheaper than thinking about it. The
placement is deterministic from the seed, so a matched pair places identically.

Role permissions enter here as a mask: the module's manifest says which `ChapterRole`s may carry
each move (the wit beat today: never the victim's chapter of death; depth: nothing to the reveal or
aftermath but a sensory note), and masked chapters are removed from N before placement.

### 4.4 Chapters to characters — eligibility and load

A beat has a carrier. **MEASURED** the victim carried the "unmeant joke" in 10 of 10 chapters of two
books because the joke goes to the humourless character and the victim's profile has level 0. The
rule that fixed it — "the dead do not carry a comic beat" — is one row of a general **eligibility
matrix** E[character, move] the module declares as predicates over the cast: alive at this chapter;
on the page in this scene; not the culprit (for inner-life and wound moves, where the culprit's
version is the motive in other words); not the victim; a designated pair (relationship moves); and
the module's own field (a humour style other than `none`). Assignment is **minimum-load rotation**:
among eligible carriers, the one who has carried the fewest beats of *any* module so far, ties broken
by seed. A character's total load across modules is capped so that no one person becomes the book's
comic, its romantic lead and its tragic figure at once — the "two or three characters carry
everything" complaint in another form.

### 4.5 Shapes do not share — the collision rule

**MEASURED** (`give-a-requirement-a-shape`, A_102 §7–§9): identical facts asked for in prose landed 0
of 3, as a template 4 of 4; **same-shape requirements collide**, and **adjacent shapes converge on
the simpler one**. Two modules whose moves have the same shape — "one exchange of six words or fewer"
for wit and for a curt refusal in a drama module — will be read by the model as one requirement and
satisfied once. The host therefore keeps a **shape registry**: every move declares its shape as a
structural signature (speech ≤ n words after speech ≥ m; a question answered in ≤ k; a sight named
once; a rule run into), and two modules cannot register the same signature. A new module that needs
a taken shape must either share the move (import it) or find a different shape. This is the one
place the design says *no* to a module, and it says it at registration, for £0.

### 4.6 Bands on the outside, shares inside, counts on the page

The UI may show a slider; the module exposes **bands** — a closed set of three to five values, as
`humourLevel` and WP-002's `relationshipArc` do — because a band is calibratable and a continuous
share is not: there is no read that separates 10% from 12%. A band maps to a share; the share maps to
a count; the count maps to chapters and carriers. The run report prints every step:

```
dimensions   band      share   asked   placed   delivered   per10k   canon
humour       classic   0.47      8       8          6/8       29.6    41.4
<module B>   low       0.12      2       2          2/2        —       —
```

"Asked" is the apportioned count, "placed" what survived the token ceiling and the role mask,
"delivered" what the module's recogniser found on the page. **The delivered/placed ratio is the
compliance rate**, and it is the number that calibrates the band→share map over time: if `classic`
asks for 8 and delivers 6 on every book, `classic` means 6 and the table should say so.

### 4.7 What the amount is not — ASSUMED limits, stated

A share controls *how often* a dimension is asked for, not *how well* it lands. §1.4 showed the
instrument tripling while the mark held. The amount machinery guarantees the count and the spread;
the move's *quality* is the writer's and the selector's, and §6 keeps those two measurements apart.

---

## 5. THE MODULE, AS A DIRECTORY

### 5.1 Contents of `modules/<name>/`

| file | contents | derived from |
|---|---|---|
| `manifest.ts` | id; class (A/B/C); the **bands** and their shares; the **moves** with shape signature, role mask, eligibility predicates, token cost, description-for-the-prompt and **vocabulary**; upstream agents hooked; fields added under `dimensions.<name>`; compatibility declarations against other modules' shapes; the natural-explanation debt if class B supernatural | `HUMOUR_BANDS`, `humour-move.ts` MOVES, `assignOwnedShapes` |
| `upstream.ts` | prompt sections for the agents the manifest names, as functions of band — e.g. the cast directive | `humourBand(level).castDirective` at `agent2b-character-profiles.ts:313` |
| `select.ts` | pure: (ContractCore, ContractInput, placed chapters, carriers) → the module's `Beat` per chapter; may read upstream fields and existing material | `selectWitBeat`, `selectDepthBeat`, `assignTexture` |
| `render.ts` | Beat → contract lines, through phrases registered in `TEMPLATE` so the echo finder sees them | `run.ts:281–298` |
| `recognise.ts` | deterministic recogniser per move → counts per chapter and per 10k | `wit-density.ts` |
| `checks.ts` | findings: the move narrated, the beat missing, the beat on an unmasked role, the carrier wrong | `findings.ts` 3e, `humour_forced` |
| `calibration.yaml` | the instrument's canon figures (median, floor, our median, the sample) and the band→share→compliance table as measured | `wit-density.ts` header table |
| `README.md` | the module's own ledger: what it asked, what arrived, which reads mention it, MEASURED/INFERRED per row | — |
| `__tests__/` | the **absence test** (share 0 ⇒ replay byte-identical), the **leak test** (no vocabulary word in any rendered line except as description), the **baseline test** (the grandfathered band reproduces the pre-module prompts), the placement and eligibility unit tests | `a91-humour-budget.test.ts`, `humour-move.test.ts` |

A module may import from `@cml/*` packages. **Nothing outside `modules/<name>/` and its tests may
contain the module's id.** That sentence is a test: `tools/module-isolation.mjs` greps for every
registered id outside its directory and fails CI on a hit. It is the whole meaning of "100%
modular", and it is checkable.

### 5.2 The host's seven seams — built once, generically

These exist today for humour and depth by hand. They become one interface each.

| seam | today | generic form |
|---|---|---|
| **S1 parameter** | `humourLevel` threaded through 7 worker/api files and 5 web files; A_92 found it wired and never sent | one record `dimensions: Record<moduleId, band>` on the spec, the run contract and `ContractInput`; the web control is generated from the registry's manifests |
| **S2 upstream hook** | the 2b shell splices `castDirective` by name | each agent shell iterates `registry.upstreamSections(agent, bands)`; profile fields land under `dimensions.<id>` |
| **S3 contract slot** | `beats: { wit?, depth?, stake?, relationship? }` | `beats: Record<moduleId, Beat>`; the apportioner (§4) fills it and the module's `select` supplies the content |
| **S4 render** | hand-written blocks in `run.ts` | `for (const m of registry) lines.push(...m.render(scene.beats[m.id]))`, in registry order |
| **S5 check** | `humour_move_narrated` wired by hand; echo finder reads `HUMOUR_MOVE_PHRASES` | the echo finder reads every module's vocabulary; `findings.ts` runs every module's `checks` |
| **S6 instrument** | wit per 10k is one hand-entered row of the selector composite and one telemetry line | each module's `recognise` reports to the run report and *may* be a composite feature — weight 0 until `selector-calibrate.mjs` says otherwise |
| **S7 registry + proof** | — | `modules/index.ts` discovers manifests; CR-03's replay is the absence and baseline proof |

**Two rules about the gate.** A module can add findings; a module can never add a *stop*. `gate.ts`
has exactly two stops and they are both fair play; a dimension that could fail a book would be a
genre change by another route. And a module cannot touch `mustSurface`, `mustNotReveal` or
`eliminationsAllowed` — the clue contract is the core's (WP-002 §7.2).

### 5.3 Flags

ADR-0004 says default off; FLAG-AUDIT line 932 says v2 adds no flag per behaviour, and 72 Agent 9
flags were retired on that principle. Both are satisfied by one fact: **the share is the switch.** A
new module's default band is `none` (share 0, byte-identical). Humour's default `classic` is
grandfathered because it *is* the measured baseline. Promotion of a default from `none` to a band
follows ADR-0011 — N ≥ 4 matched pairs — and the paper adds nothing to that rule.

---

## 6. TESTING A DIMENSION — THE EXPERIMENTAL DESIGN

The owner asked for "a way of testing out different dimensions". Four instruments, in rising cost,
each with what it can and cannot settle.

### 6.1 G0 — absence and baseline, £0

`npm run replay:check` with the module at share 0 and with its directory deleted: byte-identical
prompts and outputs on the four fixtures including the full pipeline. The same replay with the
grandfathered band must reproduce the pre-module prompts. `tools/module-isolation.mjs` must be
clean. **Settles:** the module is a module. **Cannot settle:** anything about the book.

### 6.2 G1 — the prompt diff and the budget, £0

`PROSE_V2_DRY` builds every prompt and makes no call (biggest prompt on the dry fixture 7,959
tokens: bible 4,669 + brief 688). Diff the contracts at share 0 against share s: the only lines that
change are the module's rendered beats, on the apportioned chapters, carried by eligible characters,
within the token ceiling; the report's `asked / placed` columns are right. **Settles:** the
apportioner, the placement, the eligibility, the cost. **Cannot settle:** compliance or quality.

### 6.3 G2 — compliance on a matched pair, ~£0.45

`RESUME_REDO=prose` re-runs the prose stage against byte-identical upstream. For a module with **no
upstream hook** (class B, and class A modules that read existing fields) this is the whole test: the
module's recogniser gives `delivered / placed`, the leak test gives vocabulary on the page, and the
register rate must not rise (the only validated predictor, −0.697). For a module **with** an upstream
hook, a prose-only pair cannot carry it — the material does not exist upstream — and the pair must
be a full run (~£1.15) against a seed with the module at `none`; the comparison is then two books
differing in cast as well, and §6.5 says what that costs in power. **Settles:** the model does the
operation when asked, at what rate, without naming it. **Cannot settle:** whether a reader feels it.

### 6.4 G3 — the read, by category, bundled

A read costs 7 marks of noise on a bad day (CLAUDE.md) and resolves ten marks, not five
(`ordinal-judge-resolves-ten-not-five`). It is spent **validating the instrument**, not the module:
the question is whether the reader's category note (Humour / Wit; Character Life; Atmosphere) moves
*with* `delivered`, across several books. The project's own rule applies — **bundle levers that
touch different chapters so one read scores several by category**, and the apportioner's collision
avoidance (§4.3) is what makes that bundling clean: two modules on disjoint chapters are two
treatments in one book.

### 6.5 Power, and why the recogniser is the primary readout

Book-level A/B on chapter-level effects needs **250+ pairs** (CLAUDE.md), and no judge separates 86
from 81. So the book is the wrong unit for deciding a module; the **chapter** is the right one, and
each book contributes N of them. With k modules and b bands, a **fractional factorial** over seeds —
an orthogonal array where each seed carries a different combination of bands and each pair of
modules appears at each pair of levels equally often — lets one read of ten chapters score k
modules at once on their own recognisers, with the reader's category notes as the slow outer
validation. The design is Taguchi's and costs nothing to specify; the constraint is §4.5's: modules
in the same run must not share a shape, or the factors are confounded by construction.

### 6.6 The exit criteria for a module, written before it is built

| gate | pass | fail means |
|---|---|---|
| G0 | replay byte-identical at share 0 and at the grandfathered band; isolation grep clean | the module is not a module — fix before anything else |
| G1 | prompt diff is exactly the module's lines; `asked = placed` or the drop is explained by the ceiling | the apportioner or the mask is wrong |
| G2 | `delivered / placed ≥ 0.75` over ≥ 4 matched pairs; 0 vocabulary leaks; register rate unchanged | below 0.5: the move is not an operation this model does — redesign the move, not the prompt |
| G3 | the reader's category note tracks `delivered` across the pairs | the recogniser counts something the reader does not value — recalibrate the instrument, as `wit-density` was |

A module that passes G0–G2 and fails G3 is **delivered and not felt**, which is where humour stands
today (§1.4). That is a finding about the move's design, recorded in the module's README, and the
module stays at `none` until a new move passes.

---

## 7. THE KIT — WHAT TO BUILD, IN ORDER, WITH THE COUNTER FOR EACH

No code in this paper; this is the order a coding agent would take, and what proves each step.

| # | build | proof | falsifier |
|---|---|---|---|
| **K1** | `modules/index.ts` registry + `tools/module-isolation.mjs` + the seven seam interfaces, with **zero modules registered** | replay byte-identical; isolation tool runs and finds nothing | any prompt byte moves |
| **K2** | **move humour** into `modules/humour/` — bands, directive, selection, shapes, render, moves, `humour_move_narrated`, `wit-density`, the web control — and delete the 28 sites | replay byte-identical at `classic` and at `dry`; `grep -rl humour` outside the module and its tests = 0 | a residue the module cannot own without a new seam — that residue *is* the finding, and names the eighth seam |
| **K3** | **move depth** (`depth.ts`, `DepthBeat`, texture) into `modules/depth/`; the `stake` and `relationship` beat *types* follow as the empty shells WP-002 K2/K5 would fill | replay byte-identical | as K2 |
| **K4** | the **apportioner** (§4.2–4.4) replacing `beatEvery`, `% 3` and "rotated one off", with the shape registry (§4.5) | at `classic`, identical placement to today (fixed point); at `dry`, the placement *changes* — this step is **R1→R2** and ships behind the share with the old placement as the characterised baseline | `dry` was never measured on a read, so the change is unmeasured either way; record it, do not argue it |
| **K5** | the **report block** (§4.6) and `dimensions` on S1, replacing `humourLevel` on the spec with a one-field compatibility shim | the report prints asked/placed/delivered for humour; the UI control is generated from the manifest | A_92's shape repeats — the field exists and is never sent; `grep` the param in `apps/api/src` first |
| **K6** | the **first new module**, chosen by one criterion: class A or B, **material already generated upstream and unread** (depth's 88%; WP-002 §3.2's relationship sentences, 99% of which were cut at 40 characters), no upstream hook, so G2 is a £0.45 pair | G0–G2 as §6.6 | `delivered / placed < 0.5` — the move is not one this model performs |
| **K7** | the **second new module, with an upstream hook** — the one that proves S2 generically rather than for humour alone | a full-run pair; profile fields land under `dimensions.<id>` and no normaliser changed | the normaliser *had* to change — then S2 is not generic yet |

K1–K3 are **R0/R1**: pure moves, proven by replay, no behaviour change, and they remove 38 scattered
sites. K4 is the one behaviour change and is confined to bands nobody has read. K6 and K7 are the
paper's own test: if the third dimension costs one directory, the claim held.

---

## 8. WHAT NOT TO DO — WITH THE RECEIPT FOR EACH

**8.1 Do not put a percentage, a density or a level in any prompt.** VoiceSpec reached every prompt
and was ignored, settled in one run; the humour guide's "one observation per three pages" produced
3–5 markers a book (A_91); WP-002 §7.3. The share lives in the apportioner and dies before the prompt.

**8.2 Do not let the module's name or its moves' names reach the prose.** "Polite savagery" ×12;
the move narrated ×15 (run 98dec72a); the formative cause as a label in seven variants (run 50862).
The vocabulary is declared once and the echo finder owns it.

**8.3 Do not put module material in the bible.** The bible is read by every chapter call; one trait
line became "harsh winters" in every chapter (WP-001 §4.3). Each piece is owned by one chapter and
rendered in that chapter's contract only — depth's rule, made universal.

**8.4 Do not let two modules register one shape.** Same-shape requirements collide and adjacent shapes
converge on the simpler (A_102 §7–§9). The registry refuses at £0.

**8.5 Do not let a module touch the gate or the clue contract.** Two stops, both fair play
(`gate.ts`); the pair that retired `AGENT9_CLUE_OWNERSHIP_BY_PAGE` came back with *"reveal uses
evidence not planted earlier"* (A_90 §13). A dimension that could fail a book, or drop a clue, is a
blend (WP-002 §7.1).

**8.6 Do not build a flag per module.** 72 Agent 9 flags retired; v2's principle is that behaviour is
contract content. Share 0 is off, byte-identical, and that is the only switch.

**8.7 Do not decide a module on one run or one book.** Single-run canaries are confounded; ADR-0011
asks N ≥ 4; the rubric cannot rank two books within ~7 marks. The chapter is the unit (§6.5).

**8.8 Do not build the list.** Twenty-eight pleasures is a catalogue, not a backlog. K6 picks by a
criterion (unread material, no upstream hook), K7 by another (proves the seam). Everything after
that waits on a read that names the category it would serve.

**8.9 Do not mine prose paragraphs for material.** The profile paragraphs re-word the case and carry
the labels the move ban removed (17-hitting-90 §07, *withdrawn*). Modules read structured fields.

---

## 9. SOURCES, AND AN HONEST NOTE ON TRANSFER

- **Apportionment.** Balinski & Young, *Fair Representation* (1982): Hamilton's method and the
  Alabama paradox; Webster/Sainte-Laguë as the unbiased divisor method. Transfer is exact — the
  problem is identical — but the stakes are not: a seat here is a prompt line, and the recommended
  method is chosen for stability between a run and its matched pair, not for fairness.
- **Even placement.** Bresenham (1965) for the integer line; the same arithmetic is the rounding of a
  cumulative share and appears as Euclidean rhythms in music (Toussaint 2005) — n onsets over N
  steps with gaps differing by at most one, which is precisely "n beats over N chapters".
- **Experimental design.** Taguchi's orthogonal arrays and classical fractional factorials (Box,
  Hunter & Hunter) for testing k factors in far fewer runs than 2^k. Transfer is partial: the
  response here is a recogniser count per chapter, not a single yield, and the reader's read is a
  slow, noisy outer loop that the design cannot shrink.
- **Fair play.** Knox's *Ten Commandments of Detection* (1929), rule 2: supernatural agencies are ruled
  out as a matter of course. This is why a supernatural module is an allusion with a debt (§3), and
  why WP-004's "natural agent dressed as a supernatural one" is the shape it must take.
- **Internal.** `humour-level.ts`, `humour-move.ts`, `depth.ts`, `wit-density.ts`, `selector.ts`
  (composite ρ 0.571 against register alone 0.502 over 49 read manuscripts), `gate.ts`,
  FLAG-AUDIT lines 607/624/649/932, WP-001 §4.3/§8, WP-002 §3.3/§7/K5, WP-004 §4.4, 17-hitting-90
  §07, A_91, A_92, A_96 F9, A_102 §7–§9, ADR-0004, ADR-0011, CR-03/REPLAY.md.

**Transfer note.** The apportionment and placement mathematics transfer exactly; they are small
and deterministic. The *claim* that a dimension decomposes into countable moves transfers only to
systems whose model obeys operations and ignores statistics — which this one has been measured to do
four times, and which a differently trained writer might not. If a future writer model honours a
rate, §4 is over-engineered and still harmless: a count is a rate the model can also obey.

---

## 10. SUMMARY FOR SOMEONE BUILDING SOMETHING ELSE

1. A "dimension" of a generated text is a set of **countable acts**, each **owned by one unit of
   output**, each with a **recogniser** and a **forbidden vocabulary**. Define it that way or you
   will build it twice.
2. Never ask a generative model for a percentage. **Apportion** the percentage into integer counts
   with a parliamentary rule, **place** them with Bresenham, **assign** carriers by minimum load, and
   print asked / placed / delivered. The delivered-over-placed ratio is what the percentage *means*.
3. Put every dimension in **one directory** discovered by a registry, and make "nothing else names
   it" a CI test. The second dimension built by hand costs as much as the first; the third built as a
   module costs a directory.
4. Prove absence with **record/replay**, not belief: share 0 and directory-deleted must be
   byte-identical. Prove presence on the **chapter**, not the book; validate the recogniser against
   readers slowly and in bundles.
5. A dimension may add findings and never a stop. The product's contract — here, fair play — is the
   core's, and no module may trade it.

---

## 11. INCORPORATING IT WITHOUT A REGRESSION ELSEWHERE

"Scoring elsewhere" is two things in this project, and they are protected differently. The **internal
scoring** is the phase scorers, the fair-play report, the selector composite, the gate and the
release gate — every number the pipeline computes about its own run. The **external scoring** is the
reader's rubric, where the project's standing is kept and where a dimension would most plausibly rob
plot, clues or ending to pay for itself. This section says, step by step, what must not move, which
instrument pins it, and what the pipeline's own history says the failure would look like.

### 11.1 The invariants, and the instrument that pins each

| what must not change | pinned by | when it is checked |
|---|---|---|
| any prompt byte, at share 0 and at the grandfathered band | CR-03 replay: 4 fixtures incl. the full pipeline, pinned novelty ledger | every commit of K1–K5, in CI |
| every phase scorer's output on the golden bundle | SCO-12 golden scoring characterisation in the worker suite | every commit that touches a field a scorer reads (§11.3) |
| the two gate stops, the release-gate verdict | `gate.ts`'s stop list is not a seam; `applyGate` runs after modules and reads nothing from them | by construction; a module has no handle on it |
| `mustSurface`, `mustNotReveal`, `eliminationsAllowed` per chapter | the contract diff in G1 (§6.2): the only lines that may differ are the module's rendered beats | per module, £0 |
| the machine-register rate of the book — the only validated predictor (−0.697) | `bookRegisterRate` on the matched pair; FALSIFIER of every module | G2 |
| the selector composite's agreement with the reader (ρ 0.571 over 49 reads) | `scripts/selector-calibrate.mjs` over the `words ≥ 8000` ledger | before any module feature gets a non-zero weight |
| the bible's six section budgets and drop order | modules render into the chapter contract only; the bible is not a seam | by construction (§11.4) |
| the size ratchet | `npm run size:check`; `modules/` added to the baseline at K1 | every commit |

### 11.2 Move, then change — never both in one commit

K1–K3 are **moves**. The replay harness proves a move only if the move is *pure*: the same bytes from
a different file. The project has paid for the alternative — a fix that regressed its own defect six
times in seven fixes, every one caught by running the code and none by reading it
(`fix-regresses-its-own-defect`). So each module is migrated as a **strangler**: the registry is
built beside the hand-wiring (K1, zero modules, byte-identical); humour's selection is registered and
the old call site is deleted *in the same commit* only when the replay is still green; the renderer
block at `run.ts:281` is replaced by the registry loop only when the rendered lines are identical in
order and in bytes. Registry order is declared, not discovered — `for (const m of registry)` must
emit wit before texture before depth, because today's prompt does, and a reordered prompt is a
different prompt.

The one **change** in the kit, K4's placement, is held until the moves are done and ships as a
characterised R2: at `classic` it is a fixed point (every pre-reveal chapter, byte-identical); at
`dry` the chapters move from {3, 6, 9} to the Bresenham set, and the FLAG-AUDIT row records the old
placement as the baseline. No read has ever been made of a `dry` book, so there is no score to
regress; there is also none to improve, and the row must say that too.

### 11.3 The fields scorers read — the shim rule

Two internal scorers read humour's upstream fields today, and both would break if the fields moved
under `dimensions.humour`:

- `agent2b-scoring-adapter.ts:51–64` expands `humourStyle` into `humour_style` for the Agent 2b
  scorer's `length > 20` check;
- `agent65-world-builder-scorer.ts:27,120` scores `humourPlacementMap` and `humourMapComplete`.

The rule: **a module may add fields only under its namespace; a field an existing scorer reads stays
where it is until the scorer is characterised and moved in its own commit.** For humour that means
`humourStyle` and `humourLevel` keep their top-level names through K2 and the module *reads* them
there; the namespace applies to K6/K7's new fields, which no scorer knows. If a later commit moves a
scored field, the SCO-12 characterisation is re-pinned first, the scorer's read is updated, and the
golden scores must be identical — the Agent 2b scorer's `length > 20` on an expanded description is
exactly the kind of accidental dependency that would otherwise fail silently to 0 and read as
"cast scoring dropped". Also `pipeline/stages.ts:88` copies the numeric `humourLevel` into the
worker context; that read is core and stays until a shim gives it the same number from the module.

### 11.4 Blast radius — where module output is allowed to land

**MEASURED** receipts bound the design. The bible is built to six section budgets (8,100 tokens) and
its drop order is `relationships`, then `clues` — so a module that added one line to the bible could,
at the margin, drop the clue section from every chapter call and regress fair play across the book.
The v1 budgeter did precisely this to the craft blocks (X47: `humour_guide` present 10/10 chapters,
then 0/10 after one priority tier shift). Hence three rules:

1. **Modules render into the chapter contract only.** Not the bible, not the brief. The brief is
   budgeted at 1,500 tokens and read once for the whole book; a module line there is a rate in
   disguise (§8.1) and competes with the two operations the brief exists to say.
2. **The per-chapter ceiling C is enforced by the apportioner, and drops are reported** as
   `asked − placed`. A module cannot push another module's beat out silently, and cannot push the
   puzzle's lines out at all, because the puzzle's obligations are written before B is computed.
3. **Cost is a regression too.** 70% of the prose bill is the prompt; module lines sit in the
   uncached per-chapter tail. The dry run (`PROSE_V2_DRY`) prints the token delta at share s per
   module, and a module whose lines cost more than its band's share of the prompt is reported as
   such before any paid run.

### 11.5 Module findings are telemetry first — never retry drivers

The pipeline's most expensive regression mechanism is a check that drives a retry: **a gate that
drives retries costs +2.43 register points on the retried chapter** (CLAUDE.md B1), and a check that
fires on most runs is an off switch with extra steps. A module's `checks.ts` therefore starts as
**findings that are reported and not acted on** — they appear in the run report and the module's
README, and they are *not* passed to the editor. Only after G2 shows a finding fires on fewer than a
declared fraction of chapters, and the chapters it fires on are the ones the reader would also mark,
may the finding be promoted to the editor's input — through `edits.ts`'s existing path, where every
edit is applied alone under `mutateThenValidate` and its guards, each of which is a corruption this
project has shipped. Promotion is an ADR-0011 event with its own matched pair. The echo-finder
entries derived from the module's vocabulary are the exception and are live from K2, because they
are the same check the humour moves already run.

A second mechanism to name: `agent9-postprocess-after-validation` — deterministic passes that run
after validation corrupt clean output with no re-validation. Module code has no post-processing
hook, by design; if a module needs the page changed, it goes through the editor or it does not go.

### 11.6 The selector — features at weight zero until recalibrated

`wit per 10k` is one feature of the selector composite at ρ +0.250, and the composite beats register
alone by 0.069 over 49 read manuscripts; the calibration script's five weightings span 0.027, which
the file reads correctly as "the signal is in using several instruments, not in the tuning". Three
consequences for modules:

- a module's recogniser is **reported** from K2 and **weighted 0** in the composite until
  `selector-calibrate.mjs` is re-run over the `words ≥ 8000` ledger with the feature added and the
  composite's ρ does not fall;
- weights are re-fitted only on the full ledger, never on the module's own pairs — n is 49 with six
  parameters already, and a feature fitted to the four books that carry it is noise;
- the register caveat transfers: register rate does **not** carry from v1 to v2 (reads 7.4 under the
  fit, A_101 §4), so a module feature calibrated on v1 books is unvalidated for the engine that
  ships. The ledger is tagged by engine and the fit is per engine.

### 11.7 Upstream hooks are the dangerous class

A module with no upstream hook changes bytes in the prose stage only; a prose-only matched pair is a
complete test and nothing upstream can regress. A module **with** an upstream hook (K7, and humour
itself) changes Agent 2b's output, and profiles flow into Agents 5, 6, 6.5, 7 and the fair-play
report. The humour precedent shows how far it reaches: the Agent 6.5 world builder carries a
`humourPlacementMap` because Agent 2b carried styles. For that class:

- the test is a **full-run pair** on one seed with the band at `none` and at the probe band, not a
  prose redo;
- the **fair-play report** (Agent 6's verdict, clue-presence floor, discriminating-test evidence)
  is diffed between the two runs and must be identical in verdict; a profile directive that moves a
  clue is a GENRE_BLEND symptom and fails the module;
- the SCO-12 golden scores are compared phase by phase, and the cast scorer's own band — not the
  headline — is the one allowed to move;
- the module's added fields are namespaced (§11.3) so no normaliser, coercer or scorer learns a new
  top-level key; if one *has* to, S2 is not generic yet and K7 has found its defect.

### 11.8 Reading the result — the regression set and the rules against noise

Each module's G2/G3 verdict is read against a **pre-registered regression set**, written into the
module's README before the pair is run, and it is the same set for every module:

| measure | must | reads as a regression when |
|---|---|---|
| machine-register rate (book) | not rise | rises on the pair — the lines are being echoed |
| vocabulary leaks | 0 | any — the name is on the page |
| fair-play report verdict | identical | any difference |
| `asked − placed` for *other* modules | 0 | the new module displaced an existing one |
| phase scores on the golden bundle | identical (K1–K5) | any; after K6 only the module's own scorer band may move |
| reader: plot · clues · ending | not fall | the categories PLAN-TO-90 says must each reach 9 fall by ≥ 1 across the N ≥ 4 pairs, not on one book |

And the rules the project has already paid to learn, applied to that table: **do not report a
sub-threshold delta as an effect** — the rubric cannot separate two books within ~7 marks; **N ≥ 4
matched pairs** before a band is promoted (ADR-0011); **the chapter is the unit** for the module's
own instrument, the book only for the regression set; **never read a book with a fallback chapter**;
and recompute any correlation against the read ledger with `words ≥ 8000`. A module whose pairs show
its own instrument up and a regression-set category down is a module that *paid for its pleasure
with the puzzle* — WP-002 K5's falsifier, generalised — and it stays at `none`.

### 11.9 Rollback is a band, and promotion is a ladder

Because the share is the switch, rollback of a misbehaving module is `none` on the spec — byte-
identical to its absence, no deploy, no flag flip — and removal is `rm -r modules/<name>` with the
isolation grep proving nothing else knew. Promotion from `none` to a default band is the ADR-0011
ladder and nothing shorter: G0 and G1 at £0, G2 on ≥ 4 pairs, G3 as a slow outer loop bundled with
other modules on disjoint chapters, then the FLAG-AUDIT-style row naming the probe, the prediction
and the falsifier. Humour's `classic` default is the only grandfathered band, because it is the
measured baseline every read since A_92 was made against; it is not a precedent for defaulting a
new module on.

### 11.10 Hygiene that has cost runs before

- **`npm run build:all` and a restarted process before any probe** — the worker and its tests
  consume `dist`, a mid-run rebuild never reaches the run, and "green tests, stale dist" is a
  refactor's native failure mode (REVIEW_01; `probe-validity-process-start-vs-dist-build`).
- **The `dimensions` record is written into the run config at t = 0** (CR-22's RAW record), so a
  run's bands are part of its provenance and two runs are comparable without remembering. The
  `run-params-<seed>.yaml` of a run that happened is never overwritten.
- **Verify a module's lines by their agent label in `logs/llm-prompts-full.jsonl`**, not by grepping
  the module — the module existing proves nothing about the prompt the model saw.
- **Pair artifacts by `projectId`, never by name** (`fixture-drift-certifies-the-bug`); a module's
  pair that compares the wrong manuscript certifies whatever it finds.
- **Write the WF/analysis note before acting on a pair's result** — a module's README row is that
  note, and it carries the MEASURED / INFERRED / ASSUMED label on every line.

The summary of §11 is one sentence: **every step of the kit is either a move the replay proves
byte-identical, or a change confined to a band nobody has scored, and the one new thing a module can
do to the rest of the book — spend its tokens and its reader's attention — is counted before the run
and read against a regression set written before the pair.**
