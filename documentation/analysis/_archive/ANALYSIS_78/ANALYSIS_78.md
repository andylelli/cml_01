# ANALYSIS_78 — How the classic-novel corpus supplies ideas to a new story

**Date:** 2026-08-31 · **Scope:** the *generation* side only — every path by which the library of real
crime novels reaches the invention of a new mystery. · **Type:** audit, no code changed.

> **Headline, measured on the live prompts of the 2026-08-31 05:53 run.**
>
> **Agent 3b is the idea engine** — ANALYSIS_72 §2.1 identified it as the one component that reliably
> earns the external reader's 9s. Its prompt is **18,982 characters**. The share of that traceable to
> a real novel is **81 characters — 0.43% — and all of it is three titles in a list of things not to
> resemble.**
>
> The positive material in that prompt, the 2,768 characters the model actually builds from, is a
> **separate hand-authored corpus of 11 device patterns** whose provenance is free-text phrases like
> *"Sayers/Christie-era gramophone tricks"*. We own *The Clue of the Twisted Candle*, which **is** that
> trick, encoded as structured data — and the device that gestures at it from memory cannot see it.
>
> **Not one character of worked material from a real novel reaches either idea prompt.** The corpus is
> connected to the generator exclusively as a prohibition, and the three components that could use it
> positively each read something else: Agent 3b reads the device library, the cell scheduler reads our
> own run ledger, and the only consumer that reads the novels richly is the audit that
> [cannot fail](../ANALYSIS_77/ANALYSIS_77.md#6-the-decisive-finding-the-novelty-audit-cannot-fail).

---

## §0 The question, and why it is not ANALYSIS_77 §5

[ANALYSIS_77 §5](../ANALYSIS_77/ANALYSIS_77.md#5-how-it-is-consumed--four-paths-and-what-each-actually-receives)
asked *is the corpus wired up* and found four consumers, three of them broken. This asks a different
and narrower question: **when the pipeline invents a mystery, what does the canon contribute to the
invention?**

They come apart because a corpus can be perfectly wired and still contribute nothing to an idea. A
prohibition is a connection; it is not an ingredient. The distinction is the whole subject here.

All measurements are taken from `documentation/prompts/actual/run_20260831-0553_mystery/` — the most
recent captured run — and by executing the built `dist/` modules against real data. Reproduction in
[§10](#10-reproduction).

---

## §1 The four paths, measured

| Path | Reads | Direction | Real-novel share of the prompt |
|---|---|---|---|
| **Agent 3b** — device/premise generator | the **device library** (11 hand-authored patterns) | positive | **81 / 18,982 chars = 0.43%**, negative only |
| **Agent 3** — CML generator | seed pattern block + novelty constraints | negative + near-empty | **2,134 / 56,259 chars = 3.8%** |
| **Cell scheduler** — assigns the structural cell | our **own** 102-run ledger | neither | **0** — the corpus is not an input |
| **Agent 8** — novelty audit | the seed CMLs, in depth | negative | high, and **cannot change anything** |

Two of the four are the components that decide what the story *is*. Between them the canon
contributes three book titles, one of which is a raw filename.

---

## §2 The idea engine does not read the corpus

Agent 3b generates the hard-logic device — the mechanism the whole mystery is built on. It is the
component ANALYSIS_72 measured as the source of the `premise` category's nines, and its working
ingredient is the divergence instruction plus a body of raw material.

MEASURED — the raw material in the live prompt is this block, 2,768 characters:

```
CURATED MECHANISM CORPUS (retrieved for this run's era and axis — raw material, NOT a menu):
- The Reset Clock [timing] — A mechanical clock can be silently wound back or forward…
- The Slow Dose [timing] — A slow-onset poison separates the moment of administration from…
- The Backdated Hand [authority] — A forged or backdated document fixes a fact or timeline…
- The Heat-Sprung Latch [timing] — Predictable thermal expansion can move a metal mechanism…
```

Four patterns, drawn from `packages/device-library/data/patterns/` — **eleven hand-authored YAML
files that contain no reference to any specific novel.** The flag is on (`AGENT3B_DEVICE_LIBRARY=true`).

And the canon's entire contribution to the same prompt, MEASURED at 81 characters inside a 434-character line:

```
- Diverge from: The Lantern's False Hour…, The Hourglass Deception…, The Canary's Slippers…,
  The Elevator Cage Enigma, The Fete's Frozen Hour, The Sundial's Frozen Shadow,
  The Bell Tower's Last Chime, The Garden Sundial Enigma, The Thermally Sealed Study…,
  A Study in Scarlet, The Big Bow Mystery, the_clue_of_the_twisted_candle_cml2.yaml
```

Nine of our own prior manuscripts, two novel titles, and one filename. **A title is not an idea.**
"Diverge from *A Study in Scarlet*" tells a model to avoid a string it has strong priors about and no
detail on; the mechanism, the false assumption, the inference shape and the discriminating test — all
present in the encoded case — are not there.

---

## §3 What Agent 3 gets, and why the larger number is not better

Agent 3's prompt is three times the size and the corpus's share of it is larger, but every part of
that share is either a prohibition or content-free.

| Block | Chars | Character |
|---|---|---|
| Seed pattern block | 457 | Positive in intent. **Three of its five fields are hard-coded dead** — see [A_77 §5.1](../ANALYSIS_77/ANALYSIS_77.md#51-agent-3-seed-patterns--three-of-five-fields-are-dead). |
| `avoidancePatterns` | 1,596 (20 items) | Negative. Derived from the seed CMLs — but capped, and exhausted by **two** books. |
| `divergeFrom` titles | 81 | Negative. |

So the one block written as a positive exemplar prints:

```
Pattern from a_study_in_scarlet_cml2 (temporal axis):
- Mechanism type: unknown
- Constraint space size: 0 constraints
- Inference path: 0 steps
```

**The single positive channel from the canon into the generator conveys a filename and one word.**

---

## §4 The cell scheduler walks our history, not the genre

`cell-scheduler.ts` is the most sophisticated idea mechanism in the codebase, and its reasoning is
right: *"'Avoid X' has an INFINITE satisfying set, and a model asked to satisfy it moves the minimum
distance required… The repair is not a better prohibition. It is to replace the prohibition with an
OBLIGATION."* It assigns `axis × mechanism_family × discriminating_test_shape` — 504 addressable cells
— by a least-recently-used walk.

Its input is `scheduleCell(priorRuns)`. **`priorRuns` is our own novelty ledger. The seed corpus is
never passed in and there is no parameter for it.**

MEASURED against `data/novelty-ledger.json`:

| | |
|---|---|
| Shipped records | **102** |
| Records carrying a `mechanismFamily` field | **5** — 97 are absent and fall back to a regex classifier |
| Distinct `axis × family` cells occupied (post-classification) | **21 of 504** |
| Axis spread | temporal 51, behavioral 21, authority 15, spatial 9, identity 6 |
| Mode | `shadow` — computes and logs, changes nothing |

Two observations follow.

**The map is of us, not of the genre.** A cell is "unoccupied" if *this pipeline* has not shipped it,
which says nothing about whether detective fiction has been there. ANALYSIS_77 §7 proposed exactly
this scheduler as the mechanism for generating into an unoccupied *genre* cell; the component exists,
and the corpus that would make the map is not connected to it.

**Its own input is thin.** 95% of ledger records lack the field it needs, so occupancy is inferred by
keyword rules over free text. That classifier reports 49 of 102 runs as `locked_room_timing`, which is
plausible given the project's clock monoculture but is an inference, not a record.

---

## §5 There are three mechanism vocabularies, and the corpus is tagged in the one the idea engine cannot read

| Vocabulary | Size | Values | Used by |
|---|---|---|---|
| `schema/novelty_fingerprint.schema.yaml` | **14** | `locked_room_key`, `poison_delayed`, `substituted_body`, … | the seed corpus, the novelty judge |
| `packages/device-library` | **4** | `timing`, `spatial_routing`, `authority`, `identity` | **Agent 3b — the idea engine** |
| `cell-scheduler.ts` | **12** | the 14 minus `substituted_body`, `unconscious_act` | the scheduler |

`FAMILY_MAP` in `device-library-block.ts` bridges 14 → 4, and **five of the fourteen map to `null`**:
`poison_substitution`, `staged_scene`, `hidden_accomplice`, `disguised_natural_agent`,
`unconscious_act`. When the scheduler assigns one of those, the device block is suppressed entirely
and the engine gets **no raw material at all** — deliberately, and for a good reason stated in the
code (*"a wrong retrieval is worse than none"*), but the effect is a hole.

MEASURED: the seed corpus spans **13 mechanism families**. The device library covers **4**. This is
the tenth recorded instance of this project's one-vocabulary-many-spellings failure, and the first
where it separates the corpus from the engine rather than merely from a validator.

---

## §6 The device library re-describes from memory what the corpus holds as data

This is the finding that makes the rest actionable. The 11 device patterns cite their provenance in
free text. Set those citations beside the encoded cases we already own:

| Device pattern | Its stated source | What the corpus already holds, encoded |
|---|---|---|
| ~~`recorded_presence`~~ **VOID** | *"Inter-war recorded-sound alibi convention (Sayers/Christie-era gramophone tricks)"* | ~~*The Clue of the Twisted Candle*~~ **— we do NOT own a gramophone case.** Reading the novel on 2026-08-31 showed the legacy fingerprint was wrong: the mechanism is two candles, not a recording (A_77 §3.2, corrected). This row was the sharpest instance of the argument and it rested on the bad fingerprint. |
| `delayed_poison` | *"Classic poisoning convention; period toxicology limits"* | **`the_mysterious_affair_at_styles`** — `poison_delayed`, with the bromide-precipitation mechanism written out |
| `substituted_identity` | *"Impersonation / substitution convention (twin, disguise, assumed identity)"* | **`the_valley_of_fear`** (`substituted_body`) and **`the_fenchurch_street_mystery`** |
| `trusted_authority_lie` | *"Golden-Age 'the expert lies' convention (deference to rank/profession)"* | **`the_big_bow_mystery`**, **`the_mystery_of_the_yellow_room`** — in both, the detective is the killer |

**Three** of eleven patterns paraphrase, from the model's own knowledge of the genre, a case the
library holds as a validated structure with a false assumption, an inference path and a discriminating
test. (It was four until the `recorded_presence` row was voided — see above. The correction weakens
the example and not the argument: the remaining three pairs are unaffected, and the reason the fourth
collapsed is itself an instance of the disease, a hand-authored fingerprint nobody had checked against
its own book.)

**The corpus was digested into a wiki and the wiki is what the generator reads.** That is not
worthless — the patterns are well written and period-checked — but it is a lossy summary of material
we have in full, and it explains why acquiring more novels has not previously changed anything: the
acquisition path and the generation path are not joined.

---

## §7 The asymmetry, stated plainly

Every connection from the canon to the generator is **negative**:

- `divergeFrom` — do not resemble these titles
- `avoidancePatterns` — do not reuse these era/location/test combinations
- Agent 8 — you are too similar to a seed (a verdict which, at the shipped threshold,
  [cannot be reached](../ANALYSIS_77/ANALYSIS_77.md#6-the-decisive-finding-the-novelty-audit-cannot-fail))

The one channel built to be **positive** — Agent 3b's `selectRelevantPatterns` exemplar block — emits
`unknown / 0 / 0` for every book.

The consequence is exactly what `cell-scheduler.ts`'s own header predicts. A model told only what not
to do moves the minimum distance: told to diverge from seven sundials it writes a bell tower. The
corpus is currently supplying prohibitions to a system whose own design documents argue that
prohibitions do not work — while holding, unread, the obligations that would.

A small confirmation of how thin the positive link is: MEASURED, the **only** real novel title
hard-coded anywhere in `packages/prompts-llm/src` is *"The Moonstone"* — and it appears in
`agent8-novelty.ts` as a **placeholder value in the example JSON** showing the auditor what a response
should look like. The one place a classic is written into a prompt template, it is filler in a schema
sample.

---

## §8 What a positive path would look like

Not a plan — ANALYSIS_77 §12 is the plan — but the three joins this audit says are missing, in
increasing order of cost.

**1 · Make the exemplar block carry the case (free).** A_77 §9 item 2 already calls for fixing the
three dead fields. This audit adds *why it is the highest-leverage free change in either document*:
it is the **only** positive channel that exists, and repairing it converts a filename into a worked
false assumption, mechanism and discriminating test. Everything else here is downstream of that.

**2 · Derive the device library from the corpus instead of beside it.** Each encoded case already
contains what a device pattern needs — `hidden_model.mechanism.description` is the principle,
`surface_model` is the surface illusion, `inference_path.steps[].required_evidence` is the clue
archetypes, and the era block is the feasibility window. A generated pattern would also carry a real
citation instead of *"convention"*, and the 9-family coverage gap (§5) would close as a by-product of
acquisition rather than as separate authoring. **Requires the vocabulary reconciliation in §5 first.**

**3 · Give the cell scheduler the genre map it was designed for.** It takes `PriorRunRecord[]`. The
seed fingerprints are the same five fields. A cell unoccupied by *both* the ledger and the canon is a
genuinely unwritten mystery; a cell occupied by the canon but not by us is a form the genre uses and
we have never attempted — which is the more useful of the two lists and cannot currently be computed.

Two cautions carried from the source material rather than invented here. `cell-scheduler.ts` states
its own negative control — *"if a scheduled `epistemic` × `poison_delayed` case scores the same as
the clock cases, that is the most useful result available"* — and it should be honoured before the
scheduler is promoted past `shadow`. And `device-library-block.ts` is right that a wrong retrieval is
worse than none; deriving patterns from the corpus must not be allowed to fill the `null` families
with poor matches merely to remove the hole.

---

## §9 Can the encoded novels be turned into the wiki? — a working prototype

**Run 2026-08-31, answering the question [§8.2](#8-what-a-positive-path-would-look-like) raised.** Not
argued — built. A derivation was written from `library/works/*/case.cml2.yaml` to the device-pattern
contract in `schema/device_library.schema.yaml`, run over all four encoded works, validated with the
real ajv schema and tested against the real retrieval function. Drafts are at
`library/works/*/device.draft.yaml`.

**Verdict: yes, and most of it is deterministic — but four things do not derive, and three traps only
appear when you run it.**

### 9.1 What derives

Ten of the eleven required fields come straight out of an encoded case:

| Device field | Derived from | Kind |
|---|---|---|
| `pattern_id` | the work slug | deterministic |
| `family` | fingerprint `mechanism_family`, mapped 14 → 5 | deterministic |
| `axes` | `false_assumption.type` | deterministic |
| `principle` | `false_assumption.what_it_hides` | deterministic + de-specification |
| `surface_illusion_template` | `surface_model.inferred_conclusions` | deterministic + de-specification |
| `underlying_reality_template` | `hidden_model.mechanism.description` | deterministic + de-specification |
| `clue_archetypes` | `inference_path.steps[].required_evidence`, tokenised | deterministic |
| `feasibility.eras` | `meta.era.decade` | **derives wrongly — see 11.3** |
| `sources` | `meta.author` + `meta.title` + the corpus path | deterministic |
| `title`, `principleType` | — | **do not derive** |

MEASURED: with the three non-derivable fields supplied by hand, **all four patterns validate against
the real schema.** The one hard schema failure before that is `principleType`, a four-value judgement
enum (`physical_law | math | cognitive_bias | social_logic`) that no CML field carries.

**And `sources` stops being a gesture.** The stock library says *"Impersonation / substitution
convention (twin, disguise, assumed identity)."* A derived pattern says:

```
Baroness Orczy, The Fenchurch Street Mystery — library/works/the_fenchurch_street_mystery/case.cml2.yaml
```

A citation that resolves to a validator-clean case with a false assumption, an inference path and a
discriminating test — which is the whole of [§6](#6-the-device-library-re-describes-from-memory-what-the-corpus-holds-as-data)'s complaint, answered.

### 9.2 It integrates — measurably

Retrieval for a 1931 story, stock library versus stock + the four derived patterns:

| Axis | stock | + derived |
|---|---|---|
| temporal | 6 | 6 |
| spatial | 5 | **6** (+ `the_case_of_oscar_brodski`) |
| identity | **1** | **2** (+ `the_fenchurch_street_mystery`) |
| behavioral | 4 | **6** (+ `a_jury_of_her_peers`, `the_invisible_man`) |
| authority | 2 | 2 |

Four novels double the thinnest axis and add 50% to the next thinnest. The feasibility gate also works
on them: three of the four are correctly **infeasible in 2020** and feasible in 1931.

### 9.3 Three traps that only appeared on running it

**1 · `eras` derived from the publication decade retrieves nothing.** The naive mapping — a novel
published in the 1910s gets `eras: [1910]` — produced four schema-valid patterns that returned
**0 retrievals on every axis** for a 1931 story, because `retrievePatterns` matches
`feasibility.eras.includes(decade)`. `eras` is a **feasibility range**, not a provenance date; the
stock patterns declare 1850–1960. A derivation that reads the era block literally builds a library
that is invisible.

**2 · Empty `requires`/`forbids` is not neutral — it is "feasible forever".** `checkFeasibility`
computes `missingRequires.length === 0 && defeatedByEra.length === 0`, so empty arrays pass in every
era including 2020. A derived pattern with unfilled capability annotations does not fail safe; it
**silently disables the anachronism floor** for itself.

**3 · An unknown capability token fails safe in `requires` and fails OPEN in `forbids`.** The oracle
resolves unknown capabilities to *not available*. In `requires` that makes the pattern permanently
infeasible — loud, and harmless. In `forbids` it means the capability is never present, so the trick
is never defeated. MEASURED: `a_jury_of_her_peers` was given `forbids: [forensic_scene_protocol]`, a
token that does not exist in `CAPABILITY_AVAILABLE_FROM`, and reports **feasible in 2020**. Its three
siblings, using real tokens, correctly do not.

**And the upstream mis-tag propagates.** Two of the four needed a `family` override because the
deterministic map inherits a `mechanism_family` that [ANALYSIS_77 §16.5/§16.9](../ANALYSIS_77/ANALYSIS_77.md#165-three-findings-the-pilot-produced-that-argument-would-not-have)
already recorded as forced — `impersonation` on *The Invisible Man*, `hidden_accomplice` on *A Jury of
Her Peers*. A bad family tag does not stay in the fingerprint file; it becomes a wrong retrieval key.

### 9.4 De-specification is real work, and a regex is the wrong tool

A device pattern must be abstract. A CML case is concrete. The first derivation leaked proper nouns
into all four supposedly-abstract templates — `Kershaw`, `Smethurst`, `Brodski`, `Hickler`, `Wright`,
`Laura`, `Smythe`. A pattern carrying a real character's name would put a novel's specifics into the
generator's raw material, which is the copying risk the whole design guards against.

*(The first fix attempt failed for a reason worth recording: the probe was written as a shell heredoc,
which collapsed `\\b` to `\b` — a backspace escape inside a template literal, not a word boundary — so
the strip matched nothing and the negative result was a claim about the probe. This is the exact trap
CLAUDE.md's evidence standard names. Rewritten as a file, it worked.)*

Name-stripping now produces clean output, and the clean output shows the deeper problem:

```
The dead man is the actor; The man in the dock is the actor;
Since the actor was alive on the 16th, no murder was committed at all
```

Three different people have collapsed into one placeholder, and with them the distinction that **is**
the mystery. Deterministic stripping is safe and lossy. What the field needs is **role-aware
rewriting** — *the dead man is the presumed victim; the man in the dock is the presumed survivor* —
and the CML already carries the map (`cast[].role`). That makes it a cheap LLM pass with the role
table supplied, not a regex.

### 9.5 The one genuinely external gap: the capability vocabulary

`era-capabilities.ts` says so itself: *"Agent 1 / @cml/period-kb is the intended real source, but its
vocabulary doesn't yet cover device-mechanism capabilities… this provides a small, decade-keyed
capability model."* It is 19 hand-dated tokens, and the derivation immediately needed one it does not
have.

Researched dates, for the tokens our four devices actually turn on:

| Capability | Evidence | Proposed date |
|---|---|---|
| **`forensic_scene_protocol`** *(new)* | Hans Gross's *Criminal Investigation*, the first formal CSI manual, **1893** (English translation **1906**); [Locard's laboratory-based method, **1910**](https://www.police1.com/investigations/5-things-to-know-about-locards-principle). Victorian scenes were [not preserved at all](https://drangelabuckley.substack.com/p/victorian-csi) — trampled, with evidence taken home. | **1910** exists; **1930** for routine practice |
| **`fingerprint_classification`** *(new — manual)* | Galton-Henry published June 1900, [adopted at Scotland Yard **1901**](https://www.britannica.com/science/Henry-system); first British murder conviction on fingerprint evidence **1903**; the 1901 file capped at 100,000 sets. | **1900** |
| `automated_fingerprint_search` | The Henry system remained [the basis of AFIS classification until the **1990s**](https://en.wikipedia.org/wiki/Henry_Classification_System). Existing value 1990. | **1990** — confirmed |
| `cctv` | First system **1942** (Siemens, Walter Bruch, V-2 launches); first commercial **1949** (Vericon); [Met Police temporary cameras in Trafalgar Square **1960**](https://en.wikipedia.org/wiki/Closed-circuit_television); first station install 1961; Liverpool Police 1964; common 1970s–80s. Existing value 1960. | **1960** for policing — confirmed; note 1942 origin |
| **`bloodstain_grouping`** *(new)* | [Lattes' method for grouping dried bloodstains, **1915**](https://forensicfield.blog/leone-lattes/); case studies published 1916; standard text 1923. `period-kb/eras/1931.yaml` already records ABO typing as exclusion-only. | **1920** |

Three of the five are **new tokens**. The other two confirm existing hand-set dates, which is worth
knowing: the stub was better than "stub" implies.

Note the overlap with `packages/period-kb/eras/*.yaml`, which already carries sourced forensic history
(Locard/Goddard, Landsteiner, the comparison microscope c.1925). **The two vocabularies should be one**,
which is what `era-capabilities.ts`'s own header anticipates.

### 9.6 The gap that is not information at all

For *The Case of Oscar Brodski*, what defeats the trick? Not a technology. The story itself shows it
beaten **in 1912**, by a doctor with a pocket microscope who notices that a decapitated head does not
bleed. No date makes that device infeasible; a sufficiently good investigator does.

So `feasibility.forbids` conflates two different things — *the era makes this impossible* and *a
competent detective beats this* — and only the first is a date. The second is a difficulty parameter,
and the schema has no field for it. **This is a modelling gap, not a research gap, and no amount of
looking things up will close it.** Stated here so it is not mistaken for a missing token.

### 9.7 What it would take

| Step | Cost | Blocker |
|---|---|---|
| Fix `eras` to a feasibility range, not a publication decade | trivial | — |
| Fill `requires`/`forbids`, and make empty arrays a **validation error** rather than "feasible forever" | small | the vocabulary below |
| Add `forensic_scene_protocol`, `fingerprint_classification`, `bloodstain_grouping`; merge with `period-kb` | small | — |
| `principleType` + `title` per work | one LLM call per work | — |
| Role-aware de-specification | one LLM call per work, role map supplied from `cast[].role` | — |
| Reconcile the three family vocabularies | design decision | [§5](#5-there-are-three-mechanism-vocabularies-and-the-corpus-is-tagged-in-the-one-the-idea-engine-cannot-read) — **still the real blocker** |

Everything except the last is mechanical. The family vocabularies remain the thing that has to be
decided by a person, and it now blocks two separate paths rather than one.
---

## §10 Reproduction

Source attribution over the live prompts:

```bash
node scripts/../<scratch>/attrib.mjs        # per-agent char counts by source
node scripts/../<scratch>/ledger.mjs        # ledger family classification + next scheduled cell
node scripts/../<scratch>/derive-device.mjs # §9 prototype: case.cml2.yaml -> device pattern
node scripts/../<scratch>/strip2.mjs        # §9.4 de-specification + proper-noun leak check
node scripts/../<scratch>/cmp.mjs           # §9.2 retrieval, stock vs stock+derived
```

Direct checks, no script needed:

```bash
grep -c "" documentation/prompts/actual/run_20260831-0553_mystery/05_Agent3b-HardLogicDeviceGenerator_request.md
grep -n "CURATED MECHANISM CORPUS" -A 18 documentation/prompts/actual/run_20260831-0553_mystery/05_Agent3b-HardLogicDeviceGenerator_request.md
grep -n "Diverge from" documentation/prompts/actual/run_20260831-0553_mystery/05_Agent3b-HardLogicDeviceGenerator_request.md
grep -rn "Moonstone" packages/prompts-llm/src --include="*.ts" | grep -v __tests__
```

Key source locations:

- `apps/worker/src/jobs/device-library-block.ts` — `FAMILY_MAP` (14 → 4, five `null`), the render block
- `apps/worker/src/jobs/cell-scheduler.ts:157` — `scheduleCell(records: PriorRunRecord[])`, no corpus parameter
- `apps/worker/src/jobs/mystery-orchestrator.ts:1081` — `scheduleCell(priorRuns)`, the only call site
- `packages/prompts-llm/src/utils/seed-loader.ts` — the exemplar block with the three dead fields
- `packages/device-library/data/patterns/*.yaml` — the 11 patterns and their `sources:` lines

Evidence used unchanged:

- `documentation/prompts/actual/run_20260831-0553_mystery/05_Agent3b-HardLogicDeviceGenerator_request.md:54`
  — the curated mechanism corpus as delivered; `:44` — the diverge-from line.
- `data/novelty-ledger.json` — 102 shipped records, `shipped[]`.

---

## §11 Open questions

1. **Should the device library be generated, or curated with citations?** §8.2 argues generated. The
   counter-argument is that the 11 hand-authored patterns are period-checked in a way an extraction
   would not be, and that a curated library with real citations back to `library/works/` may be the
   better artifact. This is a genuine fork and it should be decided before Phase 3 acquires 20 more
   books, because it determines what the encoder needs to emit.
2. **Which family vocabulary wins?** Three exist (§5). The 14-value one is the corpus's, the 4-value
   one is the engine's, and the 12-value one is the scheduler's. A_77 §16 separately proposes adding
   two members to the 14. Reconciling them is a precondition for §8.2 and §8.3 and is not
   currently on either board.
3. **Is the ledger's missing `mechanismFamily` worth fixing at source?** 97 of 102 records lack it
   (§4). The regex fallback works, but the scheduler's occupancy map — the thing the whole mechanism
   turns on — is currently inferred rather than recorded.
