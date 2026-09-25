# ANALYSIS_77 — The real-novel corpus: where it is, what is in it, and why it has never mattered

**Date:** 2026-08-31 · **Scope:** the reference library of real crime novels — acquisition, encoding,
storage, and every consumer that reads it. · **Type:** §0–§6 audit (no code changed) + §7–§14 plan.

**Hard constraint on everything from §7 onward, set by the owner and enforced mechanically by
[§10.2](#102-clear--the-gate-that-enforces-the-constraint): public domain only.**

> **Headline.** The library is 14 catalogued titles, ~77 KB of YAML, last touched **2026-02-13**.
> Of the 14: **1 is a zip file the loader cannot open**, **5 are in a schema no loader in this repo
> can read**, **2 are not real novels**, **4 contain material factual errors about their own plots**,
> and **0 of 14 pass the project's own `validateCml`**. Only **2 of the 14 were published inside the
> Golden Age** (1920–1939) whose conventions the app is built to imitate.
>
> That is the input side. On the output side the corpus reaches Agent 3's prompt as a block in which
> **three of its five fields are structurally hard-coded to `unknown` / `0` / `0`**, and reaches the
> one consumer that reads it properly — the Agent 8 novelty audit — through a threshold arithmetic
> that makes the **FAIL verdict unreachable**. MEASURED: **32 archived novelty audits, 25 pass,
> 7 warning, 0 fail, ever.**
>
> The corpus is not underused because it is small. It is underused because every path from it to the
> generator is severed, and each severance is independently repairable.
>
> **The plan (§7–§14).** Store the canon at the altitude where invention happens — the *shape of the
> deception*, which is genre grammar and cannot be plagiarised — then **generate into a structural cell
> no book occupies**, which is novel by construction and genre-fluent by construction at once. Three
> corpora, not one: **breadth** for divergence (60+ works), **depth** for exemplars (25), and a
> **calibration** corpus of real period prose that would be the first upward-pointing prose instrument
> this project owns. A seven-stage ingestion pipeline whose clearance gate makes *public domain only* a
> property of the build rather than a promise, and whose encoder reads the book instead of recalling it.
> **§16 is a pilot run of the whole pipeline on one book** — Chesterton's *The Invisible Man*,
> acquired, cleared, encoded, span-verified (20/20, with a negative control that correctly
> rejects the invented name from our own corpus) and **PASSING `validateCml`, the first file in
> this project's history to do so.** **§16.9 adds two more on a £2 budget** — Glaspell's *A Jury of
> Her Peers* and Orczy's *The Fenchurch Street Mystery* — **both PASS first attempt, 20/20 spans
> each**, giving the library its first `behavioral` pair and its first armchair and domestic-register
> cases.** **§16.10 completes the fourth** — Freeman's *The Case of Oscar Brodski*, 16,690 words,
> the story that invented the **inverted** form: PASS first attempt, 30/30 spans. Four works,
> **4/4 validator-clean against 0/14 for the legacy library**, 90/90 spans, 4/4 negative controls
> rejected.
>
> **~£24–£58 and ~7–8 days total** (the only variable is model tier — §10.8 prices it from seven
> measured book sizes)**; Phase 0 is free and everything else depends on it.**

---

## §0 Method, and what "MEASURED" means here

Everything below marked **MEASURED** was produced by executing the **built** code (`dist/`) against
the **real** files on disk, or by reading **archived live prompts** from `documentation/prompts/actual/`.
Nothing is inferred from reading source alone — this project's own record
(`fix-regresses-its-own-defect`, 2026-08-18) is that reading finds ~0 of the defects that running finds.

Claims marked **LITERARY** are judgements about whether an encoding matches the novel it names. Those
rest on my knowledge of the texts, not on a machine check; §3 marks the two I would want a second
reader to confirm before acting on.

Reproduction commands are in [Appendix A](#appendix-a--reproduction).

---

## §1 Where the library is

There are five artifacts in this repo that describe real crime fiction. Only the first is the library;
the other four are frequently mistaken for it.

| # | Artifact | What it holds | Real novels? | Reaches a prompt? |
|---|---|---|---|---|
| 1 | **`examples/*_cml2.yaml`** (13 files + 1 `.zip`) | Structural CML encodings of 14 catalogued titles | **Yes — this is the library** | Partly (§5) |
| 2 | `packages/novelty/data/seed-fingerprints.yaml` | 14 eight-field abstract fingerprints of the same titles | Yes (derived) | Yes, via the shadow judge |
| 3 | `packages/novelty/data/cliche-ledger.yaml` | 8 genre tropes to *avoid* | No — abstractions | Yes, via the shadow judge |
| 4 | `packages/device-library/data/patterns/*.yaml` | 11 mechanism patterns with free-text `sources:` citing genre convention | No — no title-level provenance | Yes (Agent 3b) |
| 5 | `packages/period-kb/eras/*.yaml` | 5 era anchors (1925/1931/1945/1955/1965) with real `sources:` | No — historical fact, not fiction | Yes |

Three near-misses worth naming so nobody re-finds them:

- **`data/opening-corpus.json`** and **`packages/prompts-llm/src/constants/voice-corpus.ts`** are built
  from **our own 189/20 archived manuscripts** (`scripts/build-opening-corpus.mjs`,
  `build-voice-corpus.mjs`). They are *negative* corpora — "diverge from this" — not exemplars.
- **`scripts/.corpus-cache/`** holds six of **our own** archived Agent-3 responses.
- **`documentation/Golden Age Crime.txt`** (848 lines) is a generation *specification*, not a corpus.

**There is no prose anywhere.** MEASURED: a repo-wide grep for `gutenberg` returns exactly one hit —
a `license:` string inside `the_big_bow_mystery_cml2.yaml`. Not one sentence of any real novel is
stored, and no ingestion path downloads one. The library is structure-only, by design and in fact.

---

## §2 What is in it

MEASURED, by parsing every file:

| Title | Author | Published | Schema | Loadable | Real novel |
|---|---|---|---|---|---|
| The Moonstone | Wilkie Collins | 1868 | A | ✅ | ✅ |
| The Leavenworth Case | Anna Katharine Green | 1878 | A | ✅ | ✅ |
| A Study in Scarlet | Arthur Conan Doyle | 1887 | A | ✅ | ✅ |
| The Sign of the Four | Arthur Conan Doyle | 1890 | A | ✅ | ✅ |
| The Big Bow Mystery | Israel Zangwill | 1892 | A+ | ✅ | ✅ |
| **The Hound of the Baskervilles** | Arthur Conan Doyle | 1902 | B | ❌ **zipped** | ✅ |
| The Leak | Jacques Futrelle | 1907 | B | ⚠️ parses, unreadable | ✅ (short story) |
| The Mystery of the Yellow Room | Gaston Leroux | 1907 | A | ✅ | ✅ |
| Trent's Last Case | E. C. Bentley | 1913 | B | ⚠️ parses, unreadable | ✅ |
| The Valley of Fear | Arthur Conan Doyle | 1915 | A | ✅ | ✅ |
| The Clue of the Twisted Candle | Edgar Wallace | 1918 | B | ⚠️ parses, unreadable | ✅ |
| **The Mysterious Affair at Styles** | Agatha Christie | **1920** | A | ✅ | ✅ |
| **The Secret Adversary** | Agatha Christie | **1922** | B | ⚠️ parses, unreadable | ✅ |
| The Second Key | *"original"*, CC-BY | *"1940s"* | A | ✅ | ❌ **synthetic** |

### 2.1 The library contains almost no Golden Age crime novels

The Golden Age of detective fiction is conventionally **1920–1939**. **Two** of the fourteen titles
fall inside it — both early Christie, both 1920–22. The median publication year of the library is
**1902**. Eight of the fourteen predate the First World War.

This is not an accident of taste; it is the shape of the public domain. `grabber/INSTRUCTIONS.txt`
rules 1 and "Do not" are explicit: *only public-domain or open-source whodunnits*. Applied naively
that rule selects Victorian and Edwardian sensation fiction, which is what the shelf holds — and
excludes the entire canon the app is imitating. Sayers, Carr, Allingham, Marsh, Berkeley, Crofts,
Van Dine and every Christie after 1929 are absent.

Meanwhile `packages/period-kb/eras/1931.yaml` opens with the comment
*"era anchor for 1931 (Golden Age of detective fiction)"*, and the generator is pointed at that era.
**We ask the pipeline to write 1931 and show it 1902.** That gap is the single largest content defect
in this arm, and §8 argues it is fixable without touching a word of anyone's prose.

### 2.2 Four books were catalogued and never delivered

`grabber/README.txt` lists **17** seed CMLs under "Current seed CMLs in `examples/`". Four of them
have never existed:

- `the_adventures_of_jimmie_dale_cml2.yaml`
- `the_lock_and_key_library_cml2.yaml`
- `the_memoirs_of_sherlock_holmes_cml2.yaml`
- `the_old_man_in_the_corner_cml2.yaml`

MEASURED: `git log --all` over the full history returns **zero** hits for each of those four names.
They were never committed. The same README omits *The Hound of the Baskervilles*, which does exist.
The inventory that a human would consult is wrong in both directions.

### 2.3 The zip is a workflow accident, and it cost us the best file

`examples/the_hound_of_the_baskervilles_cml2.zip` is a genuine ZIP archive containing one file,
`the_hound_of_the_baskervilles_cml2.yaml`, **8,785 bytes** — larger than every other seed except
*The Big Bow Mystery*.

The cause is written down in `grabber/README.txt`:

> *"Zip all newly created YAML files together for download at the end (one archive containing all outputs)"*

MEASURED: commit `d7b9f50b` added **three** zips — `a_study_in_scarlet_cml2.zip`,
`the_valley_of_fear_cml2.zip`, `the_hound_of_the_baskervilles_cml2.zip`. Two were later unpacked. The
Hound was not, and `loadSeedCMLFiles` filters on `.endsWith(".yaml") || .endsWith(".yml")`, so it has
been silently absent from every run since 2026-02-13 — while `seed-fingerprints.yaml` continues to
list it with `source: "examples/the_hound_of_the_baskervilles_cml2.zip"`, as though it were loaded.

**This is a two-command fix and it recovers the richest exemplar in the library.**

---

## §3 Accuracy audit

**LITERARY.** Comparing each encoding against the novel it names.

### 3.1 Accurate (8)

*The Moonstone*, *The Big Bow Mystery*, *The Mysterious Affair at Styles*, *The Valley of Fear*,
*The Secret Adversary*, *The Hound of the Baskervilles*, *The Sign of the Four*, and *A Study in
Scarlet* (thin, but not wrong). The Hound in particular is excellent work: seven ID'd clues with
location and significance, suspects with motives and alibis, a named culprit with a correct
`revealed_identity` ("A Baskerville relative … posing under an alias"), and a discriminating test that
matches the novel's final moor sequence. It is also the file we cannot open.

### 3.2 Materially wrong (4)

| File | What it records | The novel |
|---|---|---|
| **the_clue_of_the_twisted_candle** | `primary_victim: "John Lexman"`, `culprit: "Ralph Hewitt"`, method *"strangulation"* | The murder victim is **Remington Kara**; **Lexman** is the killer, not the victim; **there is no character called Ralph Hewitt.** Three independent errors including an invented name. |
| **the_mystery_of_the_yellow_room** | `false_assumption: "Locks have only two states: open or closed"`; mechanism *"An intermediate lock state permits exit"* | There is no intermediate lock state. The sealed-room solution is that Mathilde was wounded **earlier** and collapsed later; the culprit is the investigating detective, Frédéric Larsan. The encoded mechanism is invented. |
| **the_leavenworth_case** | `false_assumption: "Sincere eyewitness testimony produces an accurate timeline"`; mechanism *"Spatial perspective and timing errors"* | Generic and wrong. The case turns on a contested will, a concealed marriage, and the secretary Trueman Harwell. No spatial/timing mechanism is load-bearing. |
| **trents_last_case** | `culprit: "Sigsbee Manderson"`, method *"Self-inflicted gunshot wound"* | Manderson **stages** the scene to frame Marlowe, but does not fire the fatal shot — the novel's closing revelation assigns that to another party. Recording the victim as his own killer inverts the book's central twist. |

Two of these are worth a second reader before acting: **Twisted Candle** and **Trent's Last Case**
(marked LITERARY, not MEASURED). The other two I would treat as settled.

**Note the direction of the error.** In three of the four cases the *fingerprint* in
`seed-fingerprints.yaml` is **closer to the novel than the CML file is**:

- Yellow Room fingerprint: *"The victim was wounded earlier and collapsed later"* — correct.
- Leavenworth fingerprint: *"A patriarch shot over a contested will and a concealed marriage"* — correct.
- ~~Twisted Candle fingerprint: *"A locked-room death with the victim seemingly alive, faked by a recording"* — correct.~~ **WRONG — overturned 2026-08-31 by reading the book.** There is no recording in *The Clue of the Twisted Candle*; the negative control `"gramophone"` fails against all 57,838 words. The mechanism is two candles — one propping the steel latch open until the fire softens it so the room seals itself behind the departed killer, one under a weighted paper-knife that tips the telephone off its rest 25 minutes later and rings Scotland Yard while the killer sits in that office. **Both halves of this book's record were wrong, not one.** See `library/works/the_clue_of_the_twisted_candle/provenance.yaml`.

The hand-written one-line premise got the book right and the 5 KB structural encoding got it wrong.
That says something about how the encodings were produced: the long form was generated at length
without the plot in front of it, and hallucinated. (One fingerprint runs the other way: Styles'
*"Strychnine kills hours after it is given"* — strychnine acts in minutes; the delay in that novel
comes from bromide precipitating the dose over days. The CML file is right there and the fingerprint
is wrong.)

### 3.3 Not real novels (2)

- **`the_second_key_cml2.yaml`** — `author: "original"`, `license: "CC-BY"`, `era: "1940s"`. Synthetic.
  It is nonetheless **one of only three `identity` exemplars shipped to Agent 3's prompt**, and
  MEASURED across 32 archived novelty audits it is the **third most-cited nearest neighbour (7 times)**
  — ahead of every Doyle novel in the library.
- **`the_leak_cml2.yaml`** — a real Futrelle *short story*, encoded as a stub: `false_assumption` is
  **empty**, the culprit is `"Clerk in the department (exact name Unknown)"`.

---

## §4 How it is recorded

### 4.1 Two incompatible schemas, and the canonical one is the poorer

MEASURED. The 13 loadable files split into two disjoint shapes:

**Schema A** — `CML_VERSION: 2.0` + `CASE:` — 9 files, all from the 2026-01-31 batch plus Big Bow.
This is the shape `schema/cml_2_0.schema.yaml` and `grabber/CML2_TEMPLATE.yaml` both specify.

**Schema B** — `schema_version: "2.0"` + `case_metadata:` / `crime:` / `setting:` / `detective:` /
`suspects:` / `culprit:` / `crime_mechanics:` / `clues:` / `constraints:` / `inference_path:` /
`fair_play:` / `quality_controls:` — **5 files**: the Hound, Trent's Last Case, the Secret Adversary,
the Twisted Candle, the Leak. All from the 2026-02-13 batch. **No loader, agent, validator or schema in
this repo reads this shape.**

The irony is sharp. Schema B carries **exactly the data the pipeline complains it does not have**.
`documentation/12_system_redesign/agent3-corpus-shadow-findings.md` reports that across six shipped
CMLs there were **0 machine-timed precluding alibis, 0 structured eliminations, and 2/6 with no named
culprit at all** — and concludes that fair play today is *"not merely unverified but unverifiable."*
Schema B has per-suspect `motive` **and** `alibi`, a named `culprit`, and IDed `clues` with `location`
and `significance`. Five worked examples of the structure the redesign is trying to reach, sitting on
disk, unreadable.

### 4.2 No seed file passes the project's own validator

MEASURED — `validateCml` from `packages/cml/dist/validator.js` run against all 14:

```
0 pass / 14 fail
```

Representative errors:

- **The Moonstone** (11 errors): `CASE.cast is required`, `CASE.culpability is required`,
  `CASE.quality_controls is required`, `inference_path.steps[n].required_evidence is missing or empty`,
  `culpability.culprits is empty — the case states no answer to its own mystery`.
- **The Hound** (3 errors): `CML_VERSION is required`, `CASE is required` — it fails at the first gate,
  confirming Schema B was never CML 2.0.
- **The Big Bow Mystery** (12 errors): including
  `false_assumption.type must be one of temporal, spatial, identity, behavioral, authority` (its value
  is the free text `"timing_error / witness_suggestion"`), and —

  > `CASE.culpability.culprits names "George Grodman", who is the detective`

**That last one is not a data bug. It is a design finding.** Grodman *is* the detective and *is* the
murderer; that is the novel. The validator forbids the configuration, so **the pipeline structurally
cannot represent one of the genre's landmark tricks** — the same trick the cliche ledger separately
lists as `the_detective_did_it`, to be avoided. Worth an explicit decision rather than an accident:
either the rule is right and we accept the genre restriction, or it needs a sanctioned exception.

**8 of the 9 Schema-A files ship with `culpability.culprits` empty** — the library does not record who
did it in the overwhelming majority of its readable files.

### 4.3 The fingerprint ledger disagrees with its own source in 11 of 14 cases

`seed-fingerprints.yaml` opens: *"Derived artifact — regenerated when the seeds change (§5)."*
MEASURED: **no script anywhere regenerates it.** It is hand-authored and has been committed exactly
once (`84657f28`). Comparing its `axis` against the source file's `false_assumption.type`:

| id | fingerprint | file | agree |
|---|---|---|---|
| the_moonstone | epistemic | identity | no |
| the_mysterious_affair_at_styles | temporal | temporal | **YES** |
| the_big_bow_mystery | spatial | `timing_error / witness_suggestion` | no |
| trents_last_case | epistemic | *(schema B: none)* | no |
| a_study_in_scarlet | identity | temporal | no |
| the_sign_of_the_four | spatial | identity | no |
| the_hound_of_the_baskervilles | epistemic | *(unreadable — zipped)* | no |
| the_valley_of_fear | identity | identity | **YES** |
| the_mystery_of_the_yellow_room | spatial | spatial | **YES** |
| the_leavenworth_case | authority | spatial | no |
| the_secret_adversary | identity | *(schema B: none)* | no |
| the_clue_of_the_twisted_candle | temporal | *(schema B: none)* | no |
| the_second_key | spatial | identity | no |
| the_leak | identity | *(schema B: none)* | no |

**3 / 14 agree.**

### 4.4 The fingerprint vocabulary has a sixth axis the pipeline cannot request

`schema/novelty_fingerprint.schema.yaml` enumerates
`[temporal, spatial, identity, epistemic, behavioral, authority]`.
`CML_PRIMARY_AXES` (`apps/worker/src/jobs/agents/shared.ts:125`) is
`["temporal", "spatial", "identity", "behavioral", "authority"]` — and `normalizePrimaryAxis`
**throws** on anything else.

So **three fingerprints (`the_moonstone`, `trents_last_case`, `the_hound_of_the_baskervilles`) are
tagged `epistemic`, an axis no run can ever be launched on.** This is the ninth recorded instance of
this project's one-vocabulary-two-spellings failure mode (REVIEW_05 X91).

### 4.5 Axis coverage of what actually loads

MEASURED, from the built extractor:

```
temporal 2 · spatial 2 · identity 4 · unknown 4 · "timing_error / witness_suggestion" 1
behavioral 0 · authority 0
```

`behavioral` and `authority` have **no exemplar at all** — a gap the codebase already documents and
pins with a test (`axis-reaches-agent3.test.ts`, "documents the two axes the corpus does NOT cover")
and which REVIEW_05 §X92 calls out as *"a writing task, not an engineering one."* That remains true.
It is now also true that fixing the zip and Schema B would close it partly for free — the Hound is a
strong `epistemic`/behavioral case, and *Trent's Last Case* is the genre's canonical
authority-of-the-detective's-own-conclusion story.

---

## §5 How it is consumed — four paths, and what each actually receives

### 5.1 Agent 3 seed patterns — three of five fields are dead

`buildCMLPrompt` → `loadSeedCMLFiles` → `extractStructuralPatterns` → `selectRelevantPatterns` →
`formatPatternsForPrompt`.

MEASURED — this is the **verbatim block from the live prompt of the 2026-08-31 05:53 run**
(`documentation/prompts/actual/run_20260831-0553_mystery/07_Agent3-CMLGenerator_request.md:193`):

```
Pattern from a_study_in_scarlet_cml2 (temporal axis):
- Mechanism type: unknown
- False assumption: temporal
- Constraint space size: 0 constraints
- Inference path: 0 steps
- Discriminating test: constraint_proof
```

Three of the five fields are **structurally incapable of holding a value**:

| Field | Reads | Why it is always dead |
|---|---|---|
| `mechanismType` | `CASE.hidden_model.mechanism.type` | **No seed file has `.type`** — the data is in `.description`. Always `unknown`. |
| `constraintSpaceSize` | `CASE.constraint_space.constraints.length` | The real shape is `constraint_space.time` / `.access` / `.social`. There is no `.constraints` array. Always `0`. |
| `inferencePathSteps` | `CASE.inference_path.length` | `inference_path` is an **object** with a `.steps` array. `.length` on an object is `undefined`. Always `0`. |

A fourth, `False assumption`, prints the axis — which the prompt has **already stated** two lines
earlier. It is a tautology.

So the entire informational payload of the seed library at Agent 3 is: **a filename and a single
`discriminating_test.method` word, per book.** Roughly 8 tokens of signal each. The `premise`, the
mechanism description, the false-assumption *statement*, the inference steps — all present in the
YAML, all discarded. This survived the `axis`-read fix (REVIEW_05 X91): that fix made the *selection*
work; it did not make the *content* non-empty.

And for a `behavioral` or `authority` run the block reads, in full:

```
No seed patterns available for this axis.
```

### 5.2 `buildNoveltyConstraints` — a 12-slot budget spent on two books

MEASURED, running the built `buildNoveltyConstraints` against the real corpus:

```
divergeFrom:
  1. A Study in Scarlet
  2. The Big Bow Mystery
  3. the_clue_of_the_twisted_candle_cml2.yaml     ← raw filename
  4. the_leak_cml2.yaml                           ← raw filename
  5. The Leavenworth Case
  6. The Moonstone
  7. The Mysterious Affair at Styles
  8. The Mystery of the Yellow Room
```

Two defects visible in one list:

1. **Raw filenames reach the live prompt.** MEASURED in the 2026-08-31 run, line 213:
   `"… The Garden Sundial Enigma, …, A Study in Scarlet, The Big Bow Mystery, the_clue_of_the_twisted_candle_cml2.yaml"`.
   The title read is `cml?.CASE?.meta ?? cml?.meta` — Schema B stores it under `case_metadata`, so it
   falls through to `seed.filename`.
2. **`.slice(0, 8)` on an alphabetical `readdir`** silently excludes Sign of the Four, Valley of Fear,
   the Second Key, the Secret Adversary and Trent's Last Case from divergence — permanently, and by
   sort order rather than by judgement.

The `avoidancePatterns` list is capped at 12 and is **exhausted by the first two books alone** —
Study in Scarlet contributes 6 entries, Big Bow 6, and the remaining eleven books contribute nothing.
One of those 12 slots holds a 400-character prose paragraph.

### 5.3 Agent 8 novelty audit — the only real reader, and 31% of what it reads is blank

This is the one consumer that ingests the seeds properly: `summarizeCML` builds a ~25-line block per
seed with title, axis, era, crime, cast, culprit, motive, false assumption, discriminating test and
constraint counts. For Schema-A books it is good:

```
### Seed 1
**Title**: A Study in Scarlet
**Primary Axis**: temporal
**Era & Setting**: 1880s - London and associated locales
**False Assumption**: A murder's motive must be discoverable in the victim's immediate recent life…
**Constraints**: 5 temporal, 4 access, 2 physical
**Inference Path**: 4 steps
```

For the four loadable Schema-B books it emits, verbatim, in the live prompt:

```
### Seed 3
**Title**: Untitled
**Primary Axis**: unknown
**Era & Setting**: Unknown era
**Era Details**:

**Crime**: crime
**Victim**: Unknown
**Method**: Unknown

**Cast (0)**:

**Culprit**: Unknown
```

MEASURED: the seed section of the 2026-08-30 audit is **8,873 characters (~2,200 tokens)**; the four
empty stubs account for **1,626 characters (~400 tokens, 18%)** of it, and **31% of the corpus by
count** arrives as content-free scaffolding that the model is nonetheless asked to score similarity
against.

### 5.4 The `/api/samples` endpoint

`apps/api/src/server.ts:2056` exposes the raw library to the UI. It filters on `.yaml`, so the Hound is
absent there too, and `toTitle()` derives display names from filenames rather than from `meta.title`.
Low stakes, but it is a user-visible surface reading the same broken inventory.

---

## §6 The decisive finding: the novelty audit cannot fail

`agent3-run.ts:543` gates the only corrective action the seed corpus can trigger:

```ts
if (ctx.noveltyAudit!.status === "fail" && retriesEnabled) { … regenerate with stronger constraints … }
```

The prompt that decides `status` is built at `agent8-novelty.ts:270`:

```ts
- **Pass**:    Overall similarity < ${thresholdPercent}% for ALL seeds
- **Warning**: Overall similarity ${thresholdPercent}-${Math.min(100, thresholdPercent + 10)}% …
- **Fail**:    Overall similarity > ${Math.min(100, thresholdPercent + 10)}% for any seed
```

The configured threshold is **0.9** (`scripts/canary-core-inputs.yaml:83`). So
`Math.min(100, 90 + 10) = 100`, and the FAIL band renders as **"> 100%"**. A percentage cannot exceed
100. **At the shipped threshold the fail branch is unreachable, and the regeneration it guards can
never fire.**

MEASURED, across every archived Agent-8 response in the repo:

```
25  "status": "pass"
 7  "status": "warning"
 0  "status": "fail"
```

Highest similarity ever recorded: **0.88**. The audit has run 32 times, cost money each time, and has
never once been able to change anything.

Two corrections to the standing record fall out of this:

- **ANALYSIS_72 §10 states the audit *"cannot fire"* because `NOVELTY_SIMILARITY_THRESHOLD=1.0`.** That
  is true of the **API/product path** (`server.ts:667` reads the env var directly, so a UI-launched run
  skips novelty entirely) and **false of the canary path**, where `canary-core-inputs.yaml` passes
  `similarityThreshold: 0.9` in `ctx.inputs`, which takes priority. MEASURED: Agent-8 prompts are
  present in **12 of the last 17** captured runs. The audit fires on exactly the runs we measure and
  is off for exactly the runs a user would get — a harness/product divergence worth closing on its own.
- The audit does fire; it simply cannot **fail**. Which is a different bug with a different one-line fix.

### 6.1 What the corpus is actually being compared against

MEASURED, the `mostSimilarSeed` distribution over all 32 audits:

| Seed | Times nearest |
|---|---|
| The Big Bow Mystery | 15 |
| The Mysterious Affair at Styles | 9 |
| **The Second Key** (synthetic) | 7 |
| The Valley of Fear | 1 |
| *everything else* | **0** |

**Ten of the fourteen catalogued books have never once been the nearest neighbour**, and the synthetic
placeholder outranks every Doyle novel. The effective corpus is three real books.

---

### 6.2 Scorecard — the audit in one table

| Question asked | Answer |
|---|---|
| **Where is it?** | `examples/*_cml2.yaml` (the library) + `packages/novelty/data/seed-fingerprints.yaml` (its index). ~77 KB, 14 titles. |
| **How is it recorded?** | Two incompatible YAML schemas; 9 canonical, 5 in an unreadable shape, 1 zipped. Structure only — no prose, no source URLs (`source_url: "Unknown"` in every Schema-B file). |
| **Is it accurate?** | Bibliographically yes; **structurally, 4 of 12 real novels contain material plot errors**, including an invented character name. The one-line fingerprints are *more* reliable than the long encodings. |
| **Does it validate?** | **0 / 14** against `validateCml`. 8 of 9 readable files name no culprit. |
| **Does it reach the generator?** | Barely. 3 of 5 prompt fields hard-coded dead; 2 of 5 axes get nothing; 2 raw filenames in the live prompt; 31% of the novelty corpus arrives blank. |
| **Can it change an outcome?** | **No.** The only corrective path is gated on a verdict the threshold arithmetic makes unreachable. 32 audits, 0 fails. |
| **Is it Golden Age?** | **2 of 14** (1920, 1922). Median year 1902. The era KB targets 1931. |
| **Can we obtain more?** | Yes — see §8. Both more, and much better. |

The honest summary: **this arm is a well-intentioned library that has never been connected to
anything.** Every one of the seven defects above is independent and small. None requires new research.

---

---

## §7 The idea the whole plan rests on

Everything in §5 fails for one reason, and it is not the bugs. It is that **the corpus is stored at
the wrong altitude.**

A mystery novel has three layers. Its **prose** is unique to it and legally and creatively untouchable.
Its **plot** is specific to it and useless to us — we do not want to write *The Hound of the
Baskervilles* again. Between them sits the **shape of the deception**: *a natural agent dressed as a
supernatural one, so that the reader disqualifies the material explanation before examining it.* That
shape is not the property of any book. It is genre grammar. Chesterton used it, Doyle used it, Carr
used it, and each produced something unrecognisable from the others.

**The reusable asset in detective fiction is the shape, and shapes cannot be plagiarised.** Store
shapes densely and text sparsely, and the copying problem dissolves at the design level rather than
being policed at the output.

That gives the plan its organising principle, and it also gives the sharpest available answer to
*"inspired by, not copying"*:

> **Decompose the canon into structural cells, then generate into a cell no book occupies.**

If sixty works are decomposed into `axis × mechanism_family × false_assumption_pattern ×
discriminating_test_shape × inference_shape`, the occupied cells are a map of what the genre has done
— and the *empty* cells are a map of what it has not. Handing Agent 3 *"authority axis ·
recorded_presence mechanism · behavioral_tell test · no prior work occupies this cell"* produces
something **novel by construction and genre-fluent by construction at the same time**. It is built
entirely from attested parts and resembles nothing.

Half of this machinery already exists and is idle: `apps/worker/src/jobs/cell-scheduler.ts` runs at
`NOVELTY_CELL_SCHEDULER=shadow`, choosing cells against a ledger of **our own** prior runs. It has never
had a map of the genre to choose against, because the corpus that would draw one is 14 books of which
three are usable ([§6.1](#61-what-the-corpus-is-actually-being-compared-against)).
**The corpus is the missing input to a scheduler we have already built.**

### 7.1 Three jobs, three different corpora — and we have been building one

The single biggest design error in the current arm is treating "the corpus" as one thing. It is three,
with different shapes, different sizes, and different costs:

| Job | Question it answers | What it needs | Size that matters | Status today |
|---|---|---|---|---|
| **Divergence** | *Has this been done?* | Wide, shallow, comparable | **Breadth** — 60+ works | 14 catalogued, **3 effective** |
| **Exemplar** | *What does a good one look like on this axis?* | Deep, worked, structurally complete | **Depth** — 3–5 per axis | Fields hard-coded dead (§5.1) |
| **Calibration** | *What does period detective fiction sound and feel like?* | Derived measures + bounded snippets | **Texture** — 25+ works of real prose | **Does not exist** |

The third has never existed, and ANALYSIS_75 is the argument for building it: `prose` is the
lowest-scoring of the ten categories, has never been given a 9, and **every prose signal we own points
downward** — 38 of 40 reader notes name an absence. There is nothing that says what *good* looks like,
because the only prose corpus we have is 189 of our own manuscripts, used exclusively as a
diverge-from list. A calibration corpus drawn from real public-domain Golden Age text is the first
**upward-pointing** prose instrument this project would own.

### 7.2 The rule that keeps it clean

One rule, applied everywhere, and it is stricter than copyright requires:

> **The generator is never shown a passage it could paste.**

- **Shapes and structures** — unlimited, and the bulk of the corpus. Not copyrightable, not copyable.
- **Derived measures** — unlimited. *"71% of corpus openings name a concrete period object within the
  first twelve words"* is a fact about a corpus, not a piece of one.
- **Verbatim text** — capped at **25 words**, attributed, stored for **calibration and for the
  anti-copy index**, and (behind a flag, probed before trusted) shown as a register anchor with an
  explicit non-reuse instruction.
- **A hard output gate** — [§10.6](#106-guard--the-anti-copy-gate) — fails any shipped chapter that shares a
  6-gram with any stored snippet or source text. The guard is what makes the snippet allowance safe;
  neither ships without the other.

---

## §8 What we can legitimately acquire

### 8.1 The rule, stated once

| Jurisdiction | Test | As of 2026 |
|---|---|---|
| **UK / EU** | life of the author + 70 years | Author **died 1955 or earlier** |
| **US** | 95 years from publication | **Published 1930 or earlier** |

A work is **GREEN** when it passes both, **AMBER** when it passes one, **RED** otherwise. The plan
ships GREEN only by default; AMBER is quarantined behind an explicit jurisdiction setting the owner
controls ([§10.2](#102-clear--the-gate-that-enforces-the-constraint)). **Nothing RED is acquired, encoded, or referenced.**

### 8.2 This applies to three works already in the library

Honest consequence of the owner's constraint, applied to what is already on disk:

| Work | Author (d.) | US | UK | Status |
|---|---|---|---|---|
| *The Mysterious Affair at Styles* (1920) | Christie (d. 1976) | PD | **2047** | **AMBER** |
| *The Secret Adversary* (1922) | Christie (d. 1976) | PD | **2047** | **AMBER** |
| *Trent's Last Case* (1913) | Bentley (d. 1956) | PD | **1 Jan 2027** | **AMBER — 4 months** |

The other eleven are GREEN. Three points before any decision is made:

1. **The corpus holds no prose**, and plot facts are not what copyright protects — so the *existing*
   structural encodings are on much safer ground than the word "amber" suggests.
2. The exposure is entirely in [§11](#11-the-calibration-corpus--the-part-that-makes-stories-richer), which is the only part of this plan
   that touches real text. **No AMBER work should ever enter the calibration corpus.**
3. **Bentley clears on 1 January 2027.** *Trent's Last Case* is the genre's canonical
   detective-is-wrong novel and one of the two best `authority` exemplars available. It is worth
   scheduling rather than dropping.

Recommendation: keep the three structural encodings, tag them AMBER in the manifest, exclude them from
calibration, and re-run the clearance gate on 1 Jan 2027 to promote Bentley automatically. If you would
rather apply the rule flat, the manifest makes that a one-line config change — which is the point of
having a manifest.

### 8.3 The acquisition list

The library stopped at 1922 because nobody re-checked the rule. Below is what is available now,
selected against the coverage gaps in [§9](#9-what-the-corpus-must-cover) rather than by reputation.
**Every row is re-verified by the clearance gate at ingestion — the gate is the authority, not this
table.** Author death years are given so a wrong row is visibly wrong.

#### Tier A — GREEN, and each one closes a specific gap (target: encode in full)

> **Superseded by [§15](#15-candidate-reading-list--verified-accessible), which checked every row against a real catalogue.** Four titles below turned out to be **unobtainable** and are struck through with their substitutes; §15 is the list to work from. Left in place rather than deleted so the unobtainable four are not re-proposed.

| Work | Author (d.) | Pub | Fills |
|---|---|---|---|
| **The Innocence of Father Brown** (*The Invisible Man*, *The Queer Feet*, *The Blue Cross*) | Chesterton (d. 1936) | 1911 | **`behavioral`** — the postman nobody sees because of his role. The single best behavioral case in the language, and we have none. |
| **A Jury of Her Peers** *(inside PG 20872)* | Susan Glaspell (d. 1948) | 1917 | **`behavioral`** — the case turns entirely on what men assume women do not notice. Different social register from everything we hold. |
| **The Red Thumb Mark** | R. Austin Freeman (d. 1943) | 1907 | **`authority`** — a *forged fingerprint*: the era's gold-standard proof, faked. Authority axis with a `physical_trace` test. |
| **The Singing Bone** | R. Austin Freeman (d. 1943) | 1912 | **Inverted form** — invented it. We hold no inverted case; the reader knows and watches the net close. |
| ~~**Uncle Abner**~~ **NOT OBTAINABLE** → substitute *The Sleuth of St. James's Square* (PG 2861) | Melville Davisson Post (d. 1930) | 1918 / 1920 | **`authority`** — not on Project Gutenberg under any title (§15.3). |
| **The Old Man in the Corner** | Baroness Orczy (d. 1947) | 1908 | **Armchair form** — deduction from testimony alone. *Was on the grabber list and never delivered.* |
| **Max Carrados** | Ernest Bramah (d. 1942) | 1914 | **`behavioral` / sensory** — a blind detective; every clue is non-visual. Forces the corpus off sight. |
| ~~**The Crime at Diana's Pool**~~ **NOT OBTAINABLE** → substitute *The Templeton Case* (PG 75669) | Victor L. Whitechurch (d. 1933) | 1927 / 1924 | **`temporal`** — the Detection Club railway writer is the PD substitute for Crofts, but only this novel is available (§15.3). |
| **The Canary Murder Case** | S. S. Van Dine (d. 1939) | 1927 | **`temporal` / `alibi_fabrication`** — a true Golden Age bestseller; the alibi *is* the book. |
| **The Greene Murder Case** | S. S. Van Dine (d. 1939) | 1928 | **`authority` + `secret_will_inheritance`** — family standing and testimony. |
| ~~**The House of the Arrow**~~ **NOT OBTAINABLE — no substitute** | A. E. W. Mason (d. 1948) | 1924 | No Hanaud novel is on Project Gutenberg; only *The Four Feathers*, which is not a mystery (§15.3). |
| **The Middle Temple Murder** | J. S. Fletcher (d. 1935) | 1919 | **`identity` / `impersonation`** — the 1919 bestseller that made the form popular. |
| ~~**The Tea Leaf**~~ **NOT OBTAINABLE** → substitute Freeman, *The Mystery of 31 New Inn* (PG 12187) | Jepson (d. 1938) & Eustace (d. 1943) | 1925 | Not on Project Gutenberg (§15.3). |
| **The Bellamy Trial** | Frances Noyes Hart (d. 1943) | 1927 | **Courtroom form** — the whole case as contested testimony. We hold nothing of this type. |
| **The Problem of Cell 13** | Futrelle (d. 1912) | 1905 | **`spatial`, inverted-escape** — the constraint-space case, worked to the bone. |
| **Lady Molly of Scotland Yard** | Orczy (d. 1947) | 1910 | **Cast shape** — a professional female detective, 1910. Widens who a detective can be. |
| **The Eye of Osiris** | Freeman (d. 1943) | 1911 | **`substituted_body` / `identity`** — medico-legal, a family the corpus lacks. |
| **The Wrong Shape / The Sins of Prince Saradine** (Father Brown) | Chesterton (d. 1936) | 1911 | **`staged_scene`, `impersonation`** — two more shapes per volume, near-free once the text is in. |
| **The Lock and Key Library** (ed. Hawthorne) | anthology | 1909 | **Breadth** — a whole anthology of short PD cases. *Was on the grabber list and never delivered.* |
| **The Memoirs of Sherlock Holmes** | Doyle (d. 1930) | 1894 | **Breadth** — *Silver Blaze* (the dog that did nothing), *The Musgrave Ritual*. *Was on the grabber list and never delivered.* |
| **The Adventures of Jimmie Dale** | Packard (d. 1956) | 1917 | **AMBER (UK 2027)** — the fourth never-delivered grabber title. Schedule, do not drop. |

#### Tier B — GREEN, fingerprint-only (breadth for the divergence judge)

Maurice Leblanc *Arsène Lupin* (d. 1941) · Arthur Morrison *Martin Hewitt* (d. 1945) · Robert Barr
*The Triumphs of Eugène Valmont* (d. 1912) · Grant Allen *An African Millionaire* (d. 1899) ·
E. W. Hornung *Raffles* (d. 1921) · Fergus Hume *The Mystery of a Hansom Cab* (d. 1932) ·
Marie Belloc Lowndes *The Lodger* (d. 1947) · Anna Katharine Green *The Golden Slipper* (d. 1935) ·
Arthur B. Reeve *Craig Kennedy* (d. 1936) · Carolyn Wells *Fleming Stone* (d. 1942) ·
Richard Marsh (d. 1915) · Rodrigues Ottolengui (d. 1937) · Isabel Ostrander (d. 1924) ·
Louis Tracy (d. 1928) · J. Storer Clouston (d. 1944) · Hulbert Footner (d. 1944) ·
Thomas Hanshew *Cleek* (d. 1914) · Frank Froest *The Grell Mystery* (d. 1930) ·
plus the remaining Doyle canon and the rest of the Father Brown volumes.

#### Deliberately excluded, and it is worth naming what we are giving up

The Golden Age proper is **mostly still in copyright in the UK**, and this plan does not touch it:

> Christie post-1922 · Sayers (d. 1957 → 2028) · Crofts (d. 1957 → 2028) · Knox (d. 1957 → 2028) ·
> Milne (d. 1956 → 2027) · Rinehart (d. 1958 → 2029) · Berkeley (d. 1971) · Carr (d. 1977) ·
> Allingham (d. 1966) · Marsh (d. 1982) · Bailey (d. 1961) · Phillpotts (d. 1960)

**Four of these clear within three years** (Bentley 2027, Milne 2027, Sayers/Crofts/Knox 2028,
Rinehart 2029). The clearance gate re-runs on every build, so they promote themselves the day they
qualify — which is a good reason to build the gate as data rather than as a list in someone's head.

### 8.4 WITHDRAWN: the in-copyright fingerprint tier

The first draft's §8.3 proposed a second tier of eight-field fingerprints covering in-copyright works
(*Roger Ackroyd*, *The Nine Tailors*, *The Hollow Man*) on the reasoning that structural abstractions
are not protected expression.

**Withdrawn on the owner's instruction, 2026-08-31: public domain only.** Recorded rather than deleted
so it is not re-proposed. The argument that plot structure is unprotected is not the point — the
project's rule is a sourcing rule, and it is simpler and safer to apply it to the *work* than to
adjudicate the boundary per field. The cost is real (the 1930s canon is the closest match to what we
generate) and [§8.3](#83-the-acquisition-list) is the mitigation: **the shapes are almost all present
in the pre-1931 material anyway**, because that is where the 1930s writers got them.

---

## §9 What the corpus must cover

Coverage is the whole point, so it is a target, not a hope. Three vocabularies must each be saturated.

### 9.1 Axis — the current state and the target

| Axis | Today (loadable) | Target | Where it comes from |
|---|---|---|---|
| `temporal` | 2 | **≥ 8** | Whitechurch, Van Dine *Canary*, Wallace, Doyle, Futrelle |
| `spatial` | 2 | **≥ 8** | Leroux, Zangwill, *The Tea Leaf*, *Doomdorf*, *Cell 13*, Chesterton |
| `identity` | 4 | **≥ 8** | Doyle *Valley*, Fletcher, Freeman *Osiris*, Leblanc, Hume |
| **`behavioral`** | **0** | **≥ 6** | **Chesterton *Invisible Man*, Glaspell, Bramah, Orczy** |
| **`authority`** | **0** | **≥ 6** | **Freeman *Red Thumb Mark*, Post, Mason, Van Dine *Greene*, + two we already own (§9.4)** |

### 9.2 Mechanism family — all 14, none below 3

`schema/novelty_fingerprint.schema.yaml` enumerates fourteen. Distribution across the loadable corpus
today is thin and lopsided. Target **≥ 3 attested works per family**, so that a family named in a
prompt has worked precedent behind it rather than a bare label.

Two families are currently attested by **the synthetic placeholder alone** (`locked_room_key` via
`the_second_key`) or by a single mis-encoded file. Those are the first to fill.

### 9.3 Type — the forms we hold none of

Axis and mechanism do not capture *kind of book*, and the corpus is monotonous in a way our output is
too. Missing entirely:

| Form | First acquisition |
|---|---|
| **Inverted** (reader knows, watches the net close) | Freeman, *The Singing Bone* |
| **Courtroom** | Hart, *The Bellamy Trial* |
| **Armchair** (deduction from testimony only) | Orczy, *The Old Man in the Corner* |
| **Impossible crime** (as its own tradition) | Post, *The Doomdorf Mystery*; *The Tea Leaf* |
| **Non-visual detection** | Bramah, *Max Carrados* |
| **Domestic / non-elite register** | Glaspell, *A Jury of Her Peers* |
| **Rogue / inverted-sympathy** | Hornung, *Raffles*; Leblanc, *Lupin* |
| **Female detective, professional** | Orczy, *Lady Molly* |

Every one of these is GREEN, and each widens the space the generator can be pointed into. The
monotony ANALYSIS_75 measured in our output — *"fifteen books drawn from one distribution of
sentences"* — has a mirror image on the input side, and this is it.

### 9.4 Reprocessing alone closes part of the `authority` gap for free

The corpus already contains **two of the best `authority` cases in the genre**, both mis-tagged:

- ***The Big Bow Mystery*** — the retired detective is the murderer, and the case is believed because
  of who he is. Currently tagged `"timing_error / witness_suggestion"`, which is not a valid axis
  value at all ([§4.2](#42-no-seed-file-passes-the-projects-own-validator)).
- ***The Mystery of the Yellow Room*** — the investigating detective is the criminal. Currently tagged
  `spatial`, on the strength of a mechanism that
  [§3.2](#32-materially-wrong-4) shows was invented.

Add *Trent's Last Case* on 1 Jan 2027 and `authority` goes from **0 to 3 without acquiring anything**.
This is the strongest single argument for doing [§12 Phase 2](#phase-2--reprocess-the-fourteen-we-have-20-1-day)
before Phase 3: **we do not yet know what we own.**

---

## §10 How to process — the ingestion pipeline

Seven stages. The current process is a manual ChatGPT paste with no validation, and it produced the
schema split, the zip, and four hallucinated plots. Each stage below exists to make one of those
impossible.

```
  ACQUIRE ──► CLEAR ──► ENCODE ──► VERIFY ──► DERIVE ──► EXTRACT ──► GUARD
   (text)     (PD?)    (LLM,      (LLM,     (fingerprint) (craft)   (n-gram
              gate     full text) adversarial              measures)  index)
                                  + citations)
```

### 10.1 ACQUIRE — text, with provenance, out of git

Fetch from Project Gutenberg / Standard Ebooks / Internet Archive. Record **source URL, retrieval
date, and SHA-256**. Store the raw text in a content-addressed cache **outside git**
(`.cache/corpus-text/<sha256>.txt`, gitignored) — it is large, it is reproducible from the manifest,
and it is the one thing in this plan that should never be committed.

> `source_url: "Unknown"` appears in **5 of 5** Schema-B files today. Provenance is not paperwork here;
> it is the input to the clearance gate.

### 10.2 CLEAR — the gate that enforces the constraint

A deterministic gate, run in CI, over `corpus/manifest.yaml`:

```yaml
- slug: the_red_thumb_mark
  title: "The Red Thumb Mark"
  author: "R. Austin Freeman"
  author_death_year: 1943
  first_publication_year: 1907
  source_url: "https://www.gutenberg.org/ebooks/11128"
  source_sha256: "…"
  retrieved: 2026-09-02
  clearance:                      # DERIVED — never hand-written
    uk: green                     # d.1943 + 70 = 2014 ≤ 2026
    us: green                     # pub 1907 + 95 = 2002 ≤ 2026
    verdict: green
```

Rules, in code:

- `uk = green` iff `author_death_year + 70 < current_year`
- `us = green` iff `first_publication_year + 95 < current_year`
- `verdict = green` iff both; `amber` iff one; `red` otherwise
- **A work with a missing `author_death_year` or `first_publication_year` is `red`.** Unknown is not
  permission.
- **`red` cannot be committed** — the test fails the build.
- **`amber` is excluded from the calibration corpus unconditionally**, and from the structural corpus
  unless `CORPUS_JURISDICTION` is explicitly relaxed.
- The gate recomputes on every run, so **AMBER promotes itself the day it clears** (Bentley, 1 Jan 2027).

This is the mechanism that makes "public domain only" a property of the system rather than a promise.

### 10.3 ENCODE — against the text, never against recall

The four hallucinated plots in [§3.2](#32-materially-wrong-4) have one cause, and
`grabber/INSTRUCTIONS.txt` names it: *"If you only provide a book title, the AI must rely on its own
knowledge."* For four books it relied on its knowledge and invented a character.

**The encoder reads the book — the whole book, whole, in one context.** MEASURED over seven of the
§15 titles, a Golden Age novel is **412–592 kB of plain text ≈ 85k–125k tokens** ([§10.8](#108-how-much-of-each-book-is-actually-read)),
which fits several times over into `gpt-4.1`'s context. **Do not chunk it.** An earlier draft of this
section said "chunked map-reduce", and that is wrong for this task specifically: *a clue in chapter 2
is only a clue given chapter 18*, so a map stage that sees chapter 2 alone cannot recognise the one
field we most need. Chunking would destroy exactly the relationship being extracted.

Output is canonical CML 2.0 (`CML_VERSION` + `CASE`, the shape `schema/cml_2_0.schema.yaml` and
`grabber/CML2_TEMPLATE.yaml` both already specify). `validateCml` is an **accept gate**, not a
suggestion — the target is therefore stricter than anything currently in `examples/`, where
[0 of 14 pass](#42-no-seed-file-passes-the-projects-own-validator).

Required and currently near-absent: `cast`, `culpability.culprits` (8 of 9 readable files are empty),
`inference_path.steps[].required_evidence`, and `quality_controls`.

### 10.4 VERIFY — deterministic, not a second opinion

ENCODE must emit, alongside every factual claim — victim, culprit, method, false assumption, each
inference step — a **verbatim span copied from the source**. VERIFY then checks that span with
`sourceText.includes(quote)`.

**This is a string match, not an LLM call**, and an earlier draft of this section had it as "a second
adversarial LLM pass", which is the weaker design in three ways: a model verifier can hallucinate
agreement, it doubles the token bill, and it is slower. `includes()` cannot be persuaded.

It is also sufficient. *"Ralph Hewitt"* ([§3.2](#32-materially-wrong-4)) appears nowhere in Wallace,
so no quote containing it can pass. The Yellow Room's invented intermediate lock state has no
supporting span in Leroux. Both die at zero marginal cost.

Two checks, both free:

1. **Span exists** — the quote appears literally in the source (after whitespace normalisation).
2. **Span supports the claim** — the named entity actually occurs inside the quoted span, not merely
   somewhere in the book. This is what stops a real sentence being attached to a fabricated name.

A claim that fails either is rejected: the field is re-encoded once, then written `Unknown`. Spans are
stored in `provenance.yaml` for audit and are **never** shipped to the generator — they are source
text, and [§7.2](#72-the-rule-that-keeps-it-clean) applies to them like everything else.

### 10.5 DERIVE — fingerprints, computed not written

`fingerprint.yaml` is **generated** from `case.cml2.yaml`, with a test that fails when they diverge.
This permanently kills the 11-of-14 drift in
[§4.3](#43-the-fingerprint-ledger-disagrees-with-its-own-source-in-11-of-14-cases), and
the file's own header stops being a false claim.

Resolve the sixth-axis collision first
([§4.4](#44-the-fingerprint-vocabulary-has-a-sixth-axis-the-pipeline-cannot-request)):
`epistemic` is in the fingerprint schema and not in `CML_PRIMARY_AXES`, so three fingerprints are
addressed to an axis no run can request. **Recommendation: drop `epistemic` and retag those three
against the five** — the Moonstone is `behavioral` (responsibility requires intent), the Hound is
`behavioral` (a supernatural frame suppresses the material question), Trent is `authority`. That is a
one-line schema change that also **puts two more cases into the empty behavioral bucket.**

### 10.6 GUARD — the anti-copy gate

Non-negotiable, and it ships **before** any snippet does.

- Build a **6-gram index** over every stored snippet and every cached source text.
- At the ship layer, check each generated chapter against it.
- **Any 6-gram match is a hard fail**, with the matching work and span reported.
- Baseline it first: run the index over our 189 archived manuscripts to measure the natural
  false-positive rate on period-idiomatic phrasing, and set the n accordingly. A gate whose firing
  rate is unknown is the unmeasured change this project's own boards argue against.

`packages/prose-guard` already hosts `detectTemplateLeakage`; this is the same shape of detector with a
different index, and it belongs in the same place.

### 10.7 Where it all lives

```
library/                             # NOT `corpus/` — see the warning below
  manifest.yaml                      # provenance + clearance for every work (§10.2)
  works/<slug>/
    case.cml2.yaml                   # Layer 2 — full CML 2.0, validator-clean
    fingerprint.yaml                 # Layer 1 — DERIVED from case.cml2.yaml (§10.5)
    craft.yaml                       # Layer 3 — derived measures + ≤25-word snippets (§11)
    provenance.yaml                  # source, sha256, clearance, verification citations
  index/
    coverage.json                    # DERIVED — axis × family × type saturation (§9)
    cells.json                       # DERIVED — occupied and EMPTY structural cells (§7)
.cache/corpus-text/                  # raw texts — gitignored, content-addressed
```

> **Why `library/` and not `corpus/`.** `.gitignore:52` already ignores `corpus/` — that name is taken
> by `CORPUS_SNAPSHOT_DIR`, the per-run telemetry snapshots (`corpus-snapshot.ts`). The reference
> library is **source, not output**, and putting it there would have made every acquired work silently
> untracked. Found by [§16](#16-pilot-run--one-book-end-to-end) the moment the first work was written
> to disk. Reusing the name would also have been another one-word-two-meanings collision, which is the
> failure this project has now recorded nine times.

`examples/` becomes a compatibility shim over `library/works/*/case.cml2.yaml` for one release, then
goes. One shape, one home, one derivation direction — which is the fix for
[§4.1](#41-two-incompatible-schemas-and-the-canonical-one-is-the-poorer).

### 10.8 How much of each book is actually read

The short answer: **100% of every book, by something — and 100% of the important ones, three times
over, by a frontier model.** The reason that is affordable is that input tokens are cheap and a Golden
Age novel is small.

#### The size of the problem, measured

Plain-text size of seven §15 titles, from their Project Gutenberg records:

| Book | kB | Book | kB |
|---|---|---|---|
| Max Carrados | 412 | The Middle Temple Murder | 446 |
| The Red Thumb Mark | 416 | The Innocence of Father Brown | 466 |
| Trent's Last Case | 429 | The "Canary" Murder Case | 522 |
| | | The Greene Murder Case | 592 |

Mean **469 kB**. Less ~20 kB of Project Gutenberg boilerplate, that is ~450 kB ≈ **75,000 words ≈
~100,000 tokens**, with the range running **85k–125k**.

**A whole Golden Age novel is about a tenth of `gpt-4.1`'s context window.** Nothing here needs
chunking, sampling, or summarising-then-discarding. *(Confirm your Azure deployment's configured
`max_context` — the model supports ~1M, but a deployment can be provisioned lower.)*

#### Depth by layer

| Layer | How much text | Read by | LLM tokens |
|---|---|---|---|
| **L3 craft measures** (§11.1) — openings, register, lexicon, scene inventory | **100%** | deterministic code | **0** |
| **VERIFY** (§10.4) — every quoted span checked against source | **100%** | `String.includes` | **0** |
| **L1 fingerprint** — 8 abstract fields | ~30% (opening + final act) | `gpt-4.1-mini` | ~30k |
| **L2 full CML** — cast, culpability, clues, constraint space, inference path | **100%, ×3 passes** | `gpt-4.1` / frontier | ~310k |

**Two of the four layers read the entire text and cost nothing**, because they are code rather than
inference. That is not a saving trick; it is the correct tool. Counting sentence lengths and checking
whether a quote exists are things a regex does better than a model.

#### Why L2 reads the whole book three times rather than once

Not for context reasons — for attention. 100k tokens *in* the window is not 100k tokens *attended to*
uniformly, and the fields we most need are the ones most spread out. So: three passes over the same
full text, each with one job.

| Pass | Model | Job | In | Out |
|---|---|---|---|---|
| 1 · **structure map** | `gpt-4.1-mini` | chapter list, character first-appearances, 2-sentence per-chapter summary | 100k | 5k |
| 2 · **case encode** | `gpt-4.1` | the CML skeleton — victim, culprit, mechanism, false assumption, discriminating test, each with a verbatim span | 105k | 8k |
| 3 · **clue + inference sweep** | `gpt-4.1` | the exhaustive part: every planted clue with chapter and significance, every inference step with `required_evidence` | 105k | 6k |
| 4 · **verify** | — | span-match, deterministic | — | — |

Pass 3 exists because clue extraction is the one job that genuinely needs the whole book resident at
once and *also* needs to be exhaustive, and asking one call to be both structurally correct and
exhaustive is asking for the field that gets dropped to be the one we lack
([8 of 9 readable files have no clue list at all](#42-no-seed-file-passes-the-projects-own-validator)).

#### What it costs, at the project's own prices

Using `scripts/run-cost-audit.mjs`'s table (£/M tokens: `gpt-4.1` 1.58 in / 6.32 out; `gpt-4.1-mini`
0.316 / 1.264; `claude-opus-5` 3.95 / 19.75):

| | `gpt-4.1` tier | frontier (Opus 5 for passes 2–3) |
|---|---|---|
| Pass 1 (mini) | £0.038 | £0.038 |
| Pass 2 | £0.217 | £0.573 |
| Pass 3 | £0.204 | £0.534 |
| Verify | £0 | £0 |
| Subtotal | £0.46 | £1.15 |
| **×1.4 for retries and re-encodes** | **~£0.65/book** | **~£1.60/book** |

A fingerprint-only work (L1) is **~£0.02**. L3 is **£0**.

#### The budget in §12 was wrong, and wrong in the safe direction

§12 assumed *"~£1.50 per full-text encode+verify"*. Recomputed from measured book sizes and the repo's
own price table, the real figure is **£0.65 on `gpt-4.1`** — the estimate was ~2.3× high, because it
priced a chunked map-reduce with an LLM verifier, and neither is needed.

| Phase | Works | Was | Now (`gpt-4.1`) | Now (frontier) |
|---|---|---|---|---|
| 2 · reprocess existing | 11 GREEN | £20 | **£7** | £18 |
| 3 · Tier A full encode | 25 | £35 | **£16** | £40 |
| 4 · breadth, fingerprint only | ~20 | £10 | **£0.40** | £0.40 |
| 5 · calibration | 39 | £0 | **£0** | £0 |
| **Total** | | **£65** | **~£24** | **~£58** |

So the corpus programme costs between **£24 and £58 depending only on model tier** — 22 to 54
generation runs at the measured £1.07 each. Phases 0, 1 and 5 remain free.

This is deliberately stated as a range rather than a point. `report-total-cost-is-not-a-budget-number`
records this project getting a cost figure wrong by 7× in one direction and 47% in the other, and the
correct response to that history is to **price the first three books for real before committing to the
other thirty-six** — which Phase 2 does anyway, on books we already have.

---

## §11 The calibration corpus — the part that makes stories *richer*

Structure fixes plots. It does nothing for the category the reader has never praised. ANALYSIS_75's
finding is that **every prose signal we own counts defects**, so the category has no gradient above
zero. Real period prose is the missing positive reference — and it can be used without a word of it
reaching a manuscript.

**GREEN works only. AMBER is excluded here unconditionally** ([§8.2](#82-this-applies-to-three-works-already-in-the-library)).

### 11.1 Four extracts, three of them purely numeric

**1 · Openings (numeric).** Measure the first paragraph of every corpus work exactly as
`scripts/build-opening-corpus.mjs` measures ours — but as a **positive** target rather than a
diverge-from list. The comparison is the deliverable:

> *Corpus openings name a concrete period object within the first twelve words in X% of works; ours
> in Y%.* — and every one of the seventeen `opening_hook` 8s in our external reads is an inventory of
> props followed by a compliment (ANALYSIS_72 §2.1). **If the reader rewards props, measure what the
> canon puts in the first sentence and aim at it.** No text needs to move to do this.

**2 · Register (numeric).** Sentence-length distribution, clause structure, dialogue density,
concreteness, semicolon and em-dash rates — per work, over real text. This is the direct answer to
`voice-spec-is-a-dead-lever`: the VoiceSpec asked for 22.0 words/sentence and got 15.86 in 0/10
chapters, and one reason a target is ignored is that it is **arbitrary**. A target drawn from
*Father Brown* is a target with a shape behind it. Pair it with the *operational* framing that
`prompts-move-operations-not-statistics` established: *"semicolon-linked clauses"* moved semicolons 5→13;
*"19.5 words"* moved nothing.

**3 · Period lexicon (word lists, no prose).** The objects, garments, services, institutions and
idioms actually attested in-era. Two live consumers already need this:
- `packages/period-kb`'s anachronism linter, which is currently hand-authored.
- The grounding vocabulary that REVIEW_05 **X95** found was *a closed list in six files* — the
  measured cause of `scent 71% · faint 67% · morning 66%` across 198 manuscripts. **An attested
  period lexicon is the open list X95 needs**, and it is derived, not written.

**4 · Scene inventory (structural).** What scenes a Golden Age mystery is *made of* — the inquest, the
drawing-room interrogation, the reconstruction, the alibi-check, the second death, the gathering, the
reveal — with their frequency and typical position. Agent 7 currently plans against
`GOLDEN_AGE_BEATS`, a hand-written list. This replaces belief with measurement.

### 11.2 Snippets — narrow, attributed, and guarded

Stored: **≤25 words**, with work + author + clearance verdict, tagged by function (`opening`,
`interrogation`, `reveal`, `atmosphere`). Perhaps 200 across the corpus.

Their primary job is **not** to be shown to the generator. It is:
1. to seed the anti-copy index ([§10.6](#106-guard--the-anti-copy-gate)), and
2. to let a human see what a measure means before trusting it.

A secondary, flag-gated use — `CORPUS_REGISTER_ANCHORS`, default **OFF** — shows at most two,
attributed, with an explicit *"this is a register reference, not material; reuse of any phrasing is a
failure"* instruction. **Probe before trusting**, and state the falsification before building
(ANALYSIS_75 §6): *if the register anchors do not move the measured register of the output, they are a
dead lever and get deleted, exactly as VoiceSpec was.*

---

## §12 The plan, in phases

Each phase is independently shippable and ends in a state worth being in.

### Phase 0 — Repair the paths **before** buying anything (free, no LLM, ~1 day)

**The precondition, and the plan fails without it.** Ingesting sixty novels into a prompt block that
prints `Mechanism type: unknown` buys nothing. Every item below is a defect §1–§6 measured, and none
of them needs a run, an LLM call or a decision:

1. Unzip the Hound; update its `source:`. *(2 min — recovers the richest file we own.)*
2. **Fix the three dead fields in `extractStructuralPatterns`** and emit `premise` and
   `false_assumption.statement`. **Highest-leverage change in the document.**
3. Normalise the five Schema-B files into Schema A.
4. Fix the FAIL band (`Math.min(100, …)`) so the novelty audit can fail.
5. Reconcile the API and canary novelty thresholds.
6. Read the title from `case_metadata`; drop the alphabetical `.slice(0, 8)`.
7. Correct `grabber/README.txt`'s inventory.

**Exit:** a probe run shows real mechanism text in the Agent 3 prompt, and an artificial near-clone
scores `fail` in Agent 8.

### Phase 1 — Build the harness (no content, ~2 days)

`corpus/manifest.yaml`, the clearance gate (§10.2) with its CI test, the acquire/cache step (§10.1),
the derive step (§10.5), the coverage and cell indexes (§10.7), and the anti-copy gate (§10.6)
**baselined against our 189 archived manuscripts** before anything depends on it.

**Exit:** `npm run corpus:check` is green; a deliberately `red` manifest entry fails the build.

### Phase 2 — Reprocess the fourteen we have (~£20, ~1 day)

Re-encode all 14 from real text through ENCODE + VERIFY. Fix the four wrong plots. Retag the axes
(§9.4 — `authority` goes 0 → 2 for free). Derive fingerprints. Tag the three AMBER works.

**Exit:** **14 of 14 pass `validateCml`** (from 0), every fingerprint matches its source, and
`coverage.json` shows the real gaps rather than the assumed ones.

### Phase 3 — Acquire Tier A (~£35, ~2 days)

The twenty-one works in [§8.3 Tier A](#tier-a--green-and-each-one-closes-a-specific-gap-target-encode-in-full),
ordered by gap: **behavioral first** (Chesterton, Glaspell, Bramah, Orczy), then **authority**
(Freeman, Post, Mason, Van Dine), then the missing forms.

**Exit:** every axis ≥ 6, every mechanism family ≥ 3, all eight missing forms represented.

### Phase 4 — Breadth for divergence (~£10, ~half a day)

Tier B at fingerprint depth only. Target **60+ works** in the reference corpus.

**Exit:** `cells.json` maps the occupied genre space, and the empty cells become
`NOVELTY_CELL_SCHEDULER` input for the first time.

### Phase 5 — The calibration corpus (~£0 for measures, ~1 day)

§11.1's four extracts, GREEN only. Almost entirely deterministic — no LLM for the measures.

**Exit:** the opening-props comparison and the period lexicon exist as numbers, and the three
consumers named in §11.1 can read them.

### Phase 6 — Wire and probe, one flag at a time

Each consumer behind its own flag, default OFF, with its falsification stated first:
`CORPUS_EXEMPLARS` (§5.1 block) · `CORPUS_CELL_SCHEDULER` (§7) · `CORPUS_OPENING_TARGET` (§11.1) ·
`CORPUS_PERIOD_LEXICON` (X95) · `CORPUS_REGISTER_ANCHORS` (§11.2).

`rubric-cannot-rank-two-books` applies: no internal A/B under ~7 marks is measurable on this project,
so the honest instrument for Phases 3–6 is a **matched pair read externally**, which
`matched-pair-is-now-executable` makes available.

### Budget

**Recomputed in [§10.8](#108-how-much-of-each-book-is-actually-read) from measured book sizes and the
repo's own price table.** The first draft's *"~£1.50 per full-text encode+verify"* was ~2.3× high — it
priced a chunked map-reduce and an LLM verifier, and [§10.3](#103-encode--against-the-text-never-against-recall)
and [§10.4](#104-verify--deterministic-not-a-second-opinion) now use neither.

| Phase | LLM cost (`gpt-4.1`) | LLM cost (frontier) | Effort |
|---|---|---|---|
| 0 · repair paths | **£0** | **£0** | ~1 day |
| 1 · harness | **£0** | **£0** | ~2 days |
| 2 · reprocess 11 GREEN | ~£7 | ~£18 | ~1 day |
| 3 · Tier A (25 works, full encode) | ~£16 | ~£40 | ~2 days |
| 4 · breadth (fingerprint only) | ~£0.40 | ~£0.40 | ~½ day |
| 5 · calibration (deterministic) | **£0** | **£0** | ~1 day |
| **Total** | **~£24** | **~£58** | **~7–8 days** |

The only variable is model tier. For scale, one generation run costs ~£1.07
(`report-total-cost-is-not-a-budget-number`), so **the whole programme is 22–54 runs** — and Phases 0,
1 and 5, which include the highest-leverage work in the plan, cost nothing at all.

**Price the first three books for real before committing to the other thirty-six.** Phase 2 does that
anyway, on books already on disk, so the estimate is replaced by a measurement before any acquisition
spend.

---

## §13 What would falsify this

Stated before building, per house rule.

1. **Phase 0 alone moves nothing.** If real mechanism text in the Agent 3 prompt changes neither the
   generated cases nor an external read, the exemplar path is a dead lever and Phases 3–4 should be
   cut to fingerprints only. **Cheapest test in the plan; run it first.**
2. **The cell scheduler picks empty cells and the cases are worse.** If unoccupied cells produce
   incoherent mysteries, the genre's empty cells are empty *for a reason* and the scheduler should
   prefer sparse cells over empty ones.
3. **The novelty audit, once able to fail, fails constantly.** If fixing the FAIL band triggers
   regeneration on most runs, the threshold is wrong, not the corpus — re-tune before acquiring.
4. **Register anchors do not move the register.** Same fate as VoiceSpec: delete, do not defend.
5. **The anti-copy gate fires on our existing 189 manuscripts.** Then 6-grams are too tight for
   period idiom; raise n and re-baseline before shipping any snippet.

---

## §14 Open questions for the owner

1. **The three AMBER works** ([§8.2](#82-this-applies-to-three-works-already-in-the-library)) — keep
   the structural encodings with an AMBER tag and exclude them from calibration (recommended), or
   apply the rule flat and quarantine all three until 2027/2047?
2. **Drop `epistemic`?** ([§10.5](#105-derive--fingerprints-computed-not-written)) Retagging those
   three fingerprints against the canonical five also puts two cases into the empty `behavioral`
   bucket. Recommended.
3. **Detective-as-culprit** ([§4.2](#42-no-seed-file-passes-the-projects-own-validator))
   — the validator forbids it, and it is *The Big Bow Mystery*, *The Yellow Room*, and one of the
   genre's landmark tricks. Genre restriction, or sanctioned exception? This gates two of the three
   `authority` cases we already own.
4. **Should the novelty audit bite?** Fixing the FAIL band converts a decorative check into one that
   costs a regeneration. A spend decision, not a bug fix.

---

## §15 Candidate reading list — verified accessible

**Every row below was checked against the live Project Gutenberg catalogue on 2026-08-31 and returned
a real ebook id.** Nothing is listed on recall. The four titles from
[§8.3](#83-the-acquisition-list) that failed the check are recorded in
[§15.3](#153-checked-and-not-obtainable--do-not-re-propose) rather than quietly dropped.

Canonical fetch URL for any row: `https://www.gutenberg.org/ebooks/<id>` — plain text at
`https://www.gutenberg.org/cache/epub/<id>/pg<id>.txt`.

> ### ⚠ Availability is not clearance
>
> **Project Gutenberg is a US catalogue and hosts works still in copyright in the UK.** It carries
> *The Murder of Roger Ackroyd* (69087), *Murder at the Vicarage* (78220) and sixteen other Christie
> titles; Christie is protected in the UK until **2047**. "It is on Gutenberg" is **not** a clearance
> decision, and the temptation to treat it as one is exactly what
> [§10.2](#102-clear--the-gate-that-enforces-the-constraint) exists to prevent.
>
> **§15.1 is the list to work from. §15.2 is available and must not be used yet.**

The *Fills* column is the **intended** target — the reason to acquire the book. The real axis and
mechanism assignment is made by the ENCODE stage from the text
([§10.3](#103-encode--against-the-text-never-against-recall)), which is the whole point of encoding
from the book rather than from recall.

### 15.1 GREEN — clear in both jurisdictions, acquire now

Rule: author died ≤ 1955 **and** first published ≤ 1930.

#### Priority 1 — the two empty axes (acquire first)

| # | Work | Author (d.) | Pub | PG | Fills |
|---|---|---|---|---|---|
| 1 | **The Innocence of Father Brown** | G. K. Chesterton (1936) | 1911 | **204** | **`behavioral`** — *The Invisible Man*: the postman nobody sees because of his role. The best behavioral case in the language. |
| 2 | **The Wisdom of Father Brown** | Chesterton (1936) | 1914 | **223** | `behavioral`, `staged_scene` — several shapes per volume once the text is in. |
| 3 | **The Secret of Father Brown** | Chesterton (1936) | 1927 | **70175** | `behavioral` + method-of-detection stated outright. |
| 4 | **The Best Short Stories of 1917** — contains *A Jury of Her Peers* | Susan Glaspell (1948) | 1917 | **20872** | **`behavioral`** — turns on what men assume women do not notice. Non-elite register the corpus lacks entirely. |
| 5 | **Max Carrados** | Ernest Bramah (1942) | 1914 | **34732** | **`behavioral` / non-visual** — a blind detective; every clue is off-sight. |
| 6 | **The Old Man in the Corner** | Baroness Orczy (1947) | 1908 | **10556** | **Armchair form** — deduction from testimony alone. ★ *never-delivered grabber title.* |
| 7 | **The Red Thumb Mark** | R. Austin Freeman (1943) | 1907 | **11128** | **`authority`** — a *forged fingerprint*: the era's gold-standard proof, faked. `physical_trace` test. |
| 8 | **The Greene Murder Case** | S. S. Van Dine (1939) | 1928 | **72719** | **`authority` + `secret_will_inheritance`** — family standing and whose testimony counts. |
| 9 | **The Sleuth of St. James's Square** | Melville Davisson Post (1930) | 1920 | **2861** | **`authority`** — substitute for the unobtainable *Uncle Abner* (§15.3). |

#### Priority 2 — Golden Age proper, and the forms we hold none of

| # | Work | Author (d.) | Pub | PG | Fills |
|---|---|---|---|---|---|
| 10 | **The "Canary" Murder Case** | Van Dine (1939) | 1927 | **70788** | **`temporal` / `alibi_fabrication`** — the alibi *is* the book. Golden Age proper. |
| 11 | **The Benson Murder Case** | Van Dine (1939) | 1926 | **70634** | Golden Age proper; sightline/trajectory reasoning. |
| 12 | **The Bishop Murder Case** | Van Dine (1939) | 1929 | **75157** | `staged_scene` — serial pattern as misdirection. |
| 13 | **The Scarab Murder Case** | Van Dine (1939) | 1930 | **78655** | Golden Age proper; closed circle. *US PD only since 1 Jan 2026.* |
| 14 | **The Adventures of Dr. Thorndyke** (*The Singing Bone*) | Freeman (1943) | 1912 | **59478** | **Inverted form** — invented it. We hold no inverted case. |
| 15 | **The Bellamy Trial** | Frances Noyes Hart (1943) | 1927 | **75325** | **Courtroom form** — the case as contested testimony. We hold nothing of this type. |
| 16 | **Ashes to Ashes** | Isabel Ostrander (1924) | 1919 | **73155** | **Inverted form**, second instance — confirms it is a form, not one author's trick. |
| 17 | **The Templeton Case** | Victor L. Whitechurch (1933) | 1924 | **75669** | `temporal` — the Detection Club railway writer; the PD substitute for Crofts. |
| 18 | **The Problem of Cell 13** | Jacques Futrelle (1912) | 1905 | **57669** | **`spatial`** — the constraint-space case worked to the bone. |
| 19 | **The Middle Temple Murder** | J. S. Fletcher (1935) | 1919 | **10373** | `identity` / `impersonation` — the 1919 bestseller that popularised the form. |
| 20 | **The Eye of Osiris** | Freeman (1943) | 1911 | **24201** | `substituted_body` — a mechanism family the corpus barely holds. |
| 21 | **The Mystery of 31 New Inn** | Freeman (1943) | 1912 | **12187** | `spatial` / route reconstruction — substitute for *The Tea Leaf* (§15.3). |
| 22 | **Lady Molly of Scotland Yard** | Orczy (1947) | 1910 | **72581** | **Cast shape** — a professional female detective in 1910. |
| 23 | **The Golden Slipper** | Anna Katharine Green (1935) | 1915 | **3071** | Cast shape — Violet Strange; a second female investigator, different class. |
| 24 | **That Affair Next Door** | Green (1935) | 1897 | **21617** | The spinster-detective template the whole genre later ran on. |
| 25 | **The Strange Schemes of Randolph Mason** | Post (1930) | 1896 | **51956** | `authority` inverted — the lawyer who finds the loophole. Unlike anything we hold. |

#### Priority 3 — breadth for the divergence judge (fingerprint depth only)

| # | Work | Author (d.) | Pub | PG | Fills |
|---|---|---|---|---|---|
| 26 | **The Memoirs of Sherlock Holmes** | Doyle (1930) | 1894 | **834** | *Silver Blaze* (the dog that did nothing), *The Musgrave Ritual*. ★ *never-delivered.* |
| 27 | **The Lock and Key Library: Modern English** | anthology | 1909 | **2038** | Dozens of short cases in one file. ★ *never-delivered.* |
| 28 | **The Lock and Key Library: American** | anthology | 1909 | **2043** | As above, second volume. |
| 29 | **Great Short Stories Vol. 1: Detective Stories** | ed. Patten | 1906 | **74548** | Poe, Doyle, Green, Stevenson in one file. |
| 30 | **Martin Hewitt, Investigator** | Arthur Morrison (1945) | 1894 | **11252** | The deliberately unromantic professional. |
| 31 | **The Triumphs of Eugène Valmont** | Robert Barr (1912) | 1906 | **20674** | The **fallible, comic** detective — a register we have never attempted. |
| 32 | **An African Millionaire** | Grant Allen (1899) | 1897 | **4715** | Serial con; the reader knows the culprit and not the method. |
| 33 | **The Amateur Cracksman** (Raffles) | E. W. Hornung (1921) | 1899 | **706** | Rogue / inverted sympathy. |
| 34 | **The Mystery of a Hansom Cab** | Fergus Hume (1932) | 1886 | **4223** | `identity`; the biggest-selling detective novel of its century. |
| 35 | **The Lodger** | Marie Belloc Lowndes (1947) | 1913 | **2014** | Domestic suspense — dread rather than puzzle. |
| 36 | **The Grell Mystery** | Frank Froest (1930) | 1913 | **22173** | Police procedure by a real ex-Superintendent of the Yard. |
| 37 | **The Silent Bullet** | Arthur B. Reeve (1936) | 1912 | **2454** | Scientific detection — feeds the `period-kb` forensics anchors too. |
| 38 | **The Clue** | Carolyn Wells (1942) | 1909 | **54869** | Closed-circle house party — our own default setting, done in period. |
| 39 | **The Twenty-Six Clues** | Ostrander (1924) | 1919 | **77423** | Clue density as an explicit design target. |

**Totals.** 39 works, all verified reachable. Against the
[§9 coverage targets](#9-what-the-corpus-must-cover): `behavioral` **0 → 5+** (rows 1–6), `authority`
**0 → 4+** (rows 7–9, 25) *plus the two we already own once retagged*
([§9.4](#94-reprocessing-alone-closes-part-of-the-authority-gap-for-free)), and all eight missing
forms in [§9.3](#93-type--the-forms-we-hold-none-of) represented except the impossible-crime
tradition, which loses *Uncle Abner* and *The Tea Leaf* and is carried by rows 18 and 21 alone.

### 15.2 AMBER — reachable, but **do not use**

All available on Project Gutenberg. All still in copyright in the UK. Listed so nobody re-discovers
them and assumes availability means permission.

| Work | Author (d.) | PG | UK clears |
|---|---|---|---|
| **Trent's Last Case** | E. C. Bentley (1956) | 2568 | **1 Jan 2027** — 4 months. Already in our library; the best `authority` case available. **Schedule it.** |
| **The Adventures of Jimmie Dale** | Frank L. Packard (1956) | 1218 | **1 Jan 2027** — the fourth never-delivered grabber title. |
| **The Circular Staircase** | Mary Roberts Rinehart (1958) | 434 | 1 Jan 2029 — the HIBK school, absent from the corpus. |
| **The Mysterious Affair at Styles** | Agatha Christie (1976) | 863 | 2047 — already in our library. |
| **The Secret Adversary** | Christie (1976) | 1155 | 2047 — already in our library. |
| **The Murder of Roger Ackroyd** | Christie (1976) | 69087 | 2047 — the genre's most important structural exemplar, and out of reach. |
| **Murder at the Vicarage**, **The Seven Dials Mystery**, **The Mystery of the Blue Train**, + 13 more Christie | Christie (1976) | various | 2047 |

The clearance gate recomputes on every build, so **Bentley and Packard promote themselves on
1 January 2027 without anyone remembering to do it.** That is the argument for the gate being data
rather than a list in someone's head.

### 15.3 Checked and NOT obtainable — do not re-propose

| Work | Why it was wanted | Search result | Substitute |
|---|---|---|---|
| **Uncle Abner: Master of Mysteries** (Post, 1918) | *The Doomdorf Mystery* — impossible crime + moral authority | No PG record under "uncle abner" or "abner master of mysteries" | **The Sleuth of St. James's Square** (2861), same author, same axis |
| **The House of the Arrow** / **At the Villa Rose** (A. E. W. Mason) | Hanaud; `authority`, country-house Golden Age | Only *The Four Feathers* (18883) is on PG — not a mystery | **None.** The `authority` slot is filled by rows 7–9 instead |
| **The Tea Leaf** (Jepson & Eustace, 1925) | `locked_room_timing`, the vanished weapon | "No records found" | **The Mystery of 31 New Inn** (12187) |
| **The Crime at Diana's Pool** (Whitechurch, 1927) | `temporal` / railway timetable | Only *The Templeton Case* (75669) is on PG | **The Templeton Case** — same author, same period |
| **Arsène Lupin** in English (Leblanc) | Rogue/identity breadth | Only the French *Arsène Lupin, gentleman-cambrioleur* (32854) | Rows 32–33 cover the rogue form |

### 15.4 Re-fetch ids for the fourteen we already hold

[Phase 2](#phase-2--reprocess-the-fourteen-we-have-20-1-day) re-encodes the existing library **from
the text**, which needs the text. Verified:

| Existing seed | PG | Clearance |
|---|---|---|
| The Moonstone | **155** | GREEN |
| The Leavenworth Case | **4047** | GREEN |
| A Study in Scarlet | **244** | GREEN |
| The Sign of the Four | **2097** | GREEN |
| The Big Bow Mystery | **28164** | GREEN — matches the `license:` string already in our file |
| The Hound of the Baskervilles | **2852** | GREEN |
| The Mystery of the Yellow Room | **1685** | GREEN |
| The Valley of Fear | **3289** | GREEN |
| The Clue of the Twisted Candle | **2688** | GREEN — the text that settles the *"Ralph Hewitt"* error ([§3.2](#32-materially-wrong-4)) |
| The Mysterious Affair at Styles | 863 | **AMBER** |
| The Secret Adversary | 1155 | **AMBER** |
| Trent's Last Case | 2568 | **AMBER — clears 1 Jan 2027** |
| *The Leak* (Futrelle) | not separately verified | short story; locate in a collection or retire the stub |
| *The Second Key* | n/a | synthetic — retire or relabel, it is not a novel |

**Eleven of the fourteen are re-fetchable today**, so Phase 2 can run in full on the GREEN set without
waiting on any decision in [§14](#14-open-questions-for-the-owner).

### 15.5 How this list was checked, and what it does not prove

Each row was resolved through `https://www.gutenberg.org/ebooks/search/?query=…` and returned a real
ebook id — the check is **"a catalogue record exists and is reachable"**. It does *not* verify that the
text file downloads cleanly, that the edition is unabridged, or that a multi-work volume contains the
specific story wanted. Two rows depend on contents rather than titles and were checked further:

- **PG 20872** — table of contents confirmed to include *"Jury of her peers / Susan Glaspell"*.
- **PG 74548** — table of contents confirmed (Poe, Doyle, Green, Stevenson).

Four ids were additionally opened directly to confirm the id maps to the intended book **and** that a
Plain Text UTF-8 download is offered — **11128** (*The Red Thumb Mark*, 416 kB), **70788** (*The
"Canary" Murder Case*, 522 kB), **75325** (*The Bellamy Trial*), **34732** (*Max Carrados*, 412 kB).
All four correct. The remaining rows rest on the search record alone; ACQUIRE
([§10.1](#101-acquire--text-with-provenance-out-of-git)) checksums whatever it actually downloads, so a
wrong id surfaces there rather than silently becoming an encoding of the wrong book.

The clearance verdicts are computed from the two rules in
[§8.1](#81-the-rule-stated-once) using the author death and publication years shown. **Those years are
stated here so a wrong row is visibly wrong**, and every one is re-derived by the gate at ingestion
([§10.2](#102-clear--the-gate-that-enforces-the-constraint)) — which is the authority, not this table.
---

## §16 Pilot run — one book, end to end

**Run on 2026-08-31.** [§10.8](#108-how-much-of-each-book-is-actually-read) says price the first books
for real before committing to the rest; this is that. One work taken through all seven stages, with
the project's own unmodified validator as the accept gate.

**Subject: Chesterton, *The Invisible Man*** ([§15.1](#151-green--clear-in-both-jurisdictions-acquire-now)
row 1) — chosen because it is the single best `behavioral` case in the genre and the corpus has none,
and because it is short enough that a failed pilot costs nothing.

**Output: [`library/works/the_invisible_man/`](../../../library/works/the_invisible_man/)** — `case.cml2.yaml`
(18.7 kB), `fingerprint.yaml` (derived), `provenance.yaml` (6.2 kB, including all 20 verification spans).

### 16.1 What each stage actually did

| Stage | Result |
|---|---|
| **ACQUIRE** | Container = PG 204, 459,080 chars. Story extracted at offsets **[157429, 193529]** → **36,100 chars / ~6,300 words / ~9,000 tokens**. Offsets recorded in `provenance.yaml` so the extraction is reproducible rather than described. |
| **CLEAR** | Chesterton d. 1936 → UK `green`; pub. 1911 → US `green`; verdict **GREEN**. Computed from the two rules, not asserted. |
| **ENCODE** | Full CML 2.0 from the text: 6-person cast with roles and culpability, named culprit, 6-step inference path with `required_evidence`, false solution, 2 red herrings, closed circle, constraint space, discriminating test. |
| **VERIFY** | **20 spans checked, 20 passed.** Plus a negative control. |
| **`validateCml`** | Attempt 1 **FAIL** (9 errors). Attempt 2 **PASS**. |
| **DERIVE** | Fingerprint generated from the case file, schema-valid on first attempt. |
| **Novelty** | Judged against the live 19-entry reference corpus: **`distinct`**. |

### 16.2 The negative control is the result that matters

VERIFY was run as a literal substring match against the source — and, because the encoding and the
check would otherwise share an author, the check was executed **against the live source page rather
than against any text this run had written**. Twenty spans passed. Then the control:

| Span | Expected | Result |
|---|---|---|
| `"Ralph Hewitt"` | fail | **fail** ✓ |

That is the invented character name from our existing *Twisted Candle* encoding
([§3.2](#32-materially-wrong-4)), checked against a source that cannot contain it. **A fabricated
claim cannot produce a passing span.** The defect that put a non-existent person into the corpus and
survived there for six months is caught, deterministically, at zero LLM cost.

### 16.3 The gate failed once, and on nothing important

Attempt 1 returned 9 errors — and **all nine were field names I had guessed**:
`delivery_path[].step` (not `.description`), `false_solution.supporting_points` / `the_one_flaw` (not
`supporting_clues` / `why_it_collapses`), `red_herrings[].innocent_explanation`.

**Every substantive check passed first time**, including the ones that currently fail on all 14 seeds:

- grounding of `discriminating_test.design` in reader-visible inference evidence — the check that
  fails on the Moonstone with *"add these mechanism/test terms: recreate, condition, produc, alter"*
- `culpability.culprits` non-empty — empty in **8 of our 9** readable files
- culprit is not the detective — the check *The Big Bow Mystery* trips
- `required_evidence` present and concrete on every step — missing on **every** existing seed
- no duplicate observations

So the expensive half of the job (getting the case right from the text) worked on the first attempt,
and the cheap half (schema shape) failed. **The fix is one line of the encoder prompt: paste
`schema/cml_2_0.schema.yaml` into it.** With that, the ×1.4 retry multiplier in
[§10.8](#108-how-much-of-each-book-is-actually-read) is probably generous.

### 16.4 This is the first file in the project's history to pass its own gate

[§4.2](#42-no-seed-file-passes-the-projects-own-validator) measured **0 of 14** existing seeds passing
`validateCml`. This is **1 of 1**. It is a short story rather than a novel, and one result is one
result — but it settles the question the plan could not answer by argument: **the standard is
reachable, and the reason the corpus does not meet it is that nothing ever tried.**

The novelty judge places it as `distinct` against all 19 reference fingerprints, nearest neighbour
*A Study in Scarlet*, sharing only the coarse `physical_trace` test shape. And it is **the first
`behavioral` seed the corpus has ever held** — the axis [§9.1](#91-axis--the-current-state-and-the-target)
records at zero.

### 16.5 Three findings the pilot produced that argument would not have

**1 · The mechanism vocabulary cannot express this story.** `mechanism_family` is a 14-value enum, and
DERIVE was forced to emit `impersonation`. **That is wrong.** Welkin impersonates nobody — he occupies
a *role* whose occupant is not perceived as a person at all. There is no member for functional or
occupational invisibility.

This is not a small gap. The enum is the shared vocabulary between the fingerprint schema, the device
library and the cell scheduler, so a missing family is a region of genre space the whole apparatus
cannot address — and it is a region containing one of the form's most famous tricks. **Proposed:
add `role_invisibility`.** Recorded in the work's `provenance.yaml` under `open_issues` rather than
silently mis-tagged, which is how [§4.3](#43-the-fingerprint-ledger-disagrees-with-its-own-source-in-11-of-14-cases)'s
drift started.

**2 · `corpus/` was the wrong home, and only writing a file revealed it.** The layout in
[§10.7](#107-where-it-all-lives) put the reference library in `corpus/`. `.gitignore:52` already
ignores that path — it belongs to `CORPUS_SNAPSHOT_DIR`, the per-run telemetry snapshots. Every
acquired work would have been **silently untracked**: present on the machine that fetched it, absent
from the repo, and invisible in review. Renamed to `library/`. A design that had only ever been read
would have shipped this.

**3 · VERIFY must run against the source, not against a local copy.** The first version of this run
was going to write the extracted text to disk and check spans against that file. That is circular —
the same process would have authored both the claims and the text they are checked against, and the
check would prove nothing. The stage is only meaningful if the text it matches against is **fetched
independently of the encoder**. [§10.1](#101-acquire--text-with-provenance-out-of-git)'s SHA-256 is
what makes that guarantee auditable later, and it is now doing real work rather than being hygiene.

### 16.6 Cost, measured

Source in ~9,000 tokens; encoded output ~3,500 tokens; VERIFY and DERIVE **zero LLM tokens** (browser
substring match and a Node script). On `gpt-4.1` that is **~£0.036** for this story.

Scaled to a full novel at the [§10.8](#108-how-much-of-each-book-is-actually-read) measured size of
~100k tokens, one encode pass is ~£0.21 — **which is what §10.8 predicted.** The estimate survives
contact with a real run.

### 16.7 What this does not prove

- **A short story is not a novel.** 9k tokens is not 100k, and the attention argument in §10.8 — that
  a full novel needs three passes over the same text — is untested here, because at this length one
  pass is obviously enough. *The Red Thumb Mark* (416 kB) is the right next subject precisely because
  it will test that.
- **One encoding is not an encoder.** This was produced conversationally, not by the Phase-1 harness;
  it demonstrates that the *output* clears the gate, not that an automated pass reliably produces it.
- **The gate is not the reader.** `validateCml` passing means the case is well-formed and grounded. It
  does not mean the encoding is a good exemplar, which only shows up when Agent 3 is given it.

### 16.8 What changes in the plan

Nothing structural — which is the useful outcome. Three refinements:

1. **Put the schema in the encoder prompt.** All nine attempt-1 errors were field names; this removes
   the entire failure class.
2. **Add `role_invisibility` to the mechanism family enum** before Phase 3, so the behavioral
   acquisitions are not all forced through `impersonation`.
3. **VERIFY fetches its own copy of the source** — write it into
   [§10.4](#104-verify--deterministic-not-a-second-opinion) as a requirement, not an implementation
   detail.

And [Phase 2](#phase-2--reprocess-the-fourteen-we-have-20-1-day) gains a first target: *The Clue of the
Twisted Candle* (PG 2688), where the same negative control that just passed on a fabricated name will
be run against the real one.
### 16.9 Second run — two more works, £2 budget

**Run on 2026-08-31, immediately after §16.1–16.8, on an explicit £2 budget.** Target: **variation**,
so the two works were chosen for **forms the library holds none of** rather than for reputation.

| Work | Author (d.) | Pub | PG | Form acquired | Words |
|---|---|---|---|---|---|
| **A Jury of Her Peers** | Susan Glaspell (1948) | 1917 | 20872 | **domestic / non-elite register** | 8,130 |
| **The Fenchurch Street Mystery** | Baroness Orczy (1947) | 1908 | 10556 | **armchair detection** | 6,526 |

Both GREEN in both jurisdictions. Both in `library/works/`. Results:

| | Jury of Her Peers | Fenchurch Street |
|---|---|---|
| `validateCml` | **PASS, attempt 1** | **PASS, attempt 1** |
| Spans verified | **20 / 20** | **20 / 20** |
| Negative control | `"Sergeant Cuff"` → fail ✓ | `"Inspector Lestrade"` → fail ✓ |
| Novelty verdict | `distinct` | `distinct` |
| Axis | `behavioral` | `identity` |

**§16.8's first refinement is confirmed.** Both cleared the gate on the first attempt, against
[§16.3](#163-the-gate-failed-once-and-on-nothing-important)'s single failure — because the field names
were known this time. Putting the schema in the encoder prompt removes the entire failure class.

#### The span check caught two real errors

Not the negative controls — those are designed to fail. Two *genuine* mis-quotations in the Glaspell
encoding: spans transcribed with double quotation marks where the source nests **single** quotes
inside reported speech (`'He died of a rope round his neck,' says she`). A human proof-reader would
pass both. `String.includes` did not. That is the second time in two runs that VERIFY has caught
something no reading would have.

#### A third acquisition, cached but not encoded

**Freeman, *The Case of Oscar Brodski*** (PG 59478, the story that invented the inverted form) was
acquired and its text captured — **16,690 words**, roughly the length of a short novel and 2× either
work above. It was **not encoded**, because doing so would have exceeded the £2. The text is on disk
and it is the right subject for the next run: at that length it is the first work that will actually
test [§16.7](#167-what-this-does-not-prove)'s open question — whether one pass over a long text is
enough, or whether [§10.8](#108-how-much-of-each-book-is-actually-read)'s three-pass design is needed.

#### The mechanism vocabulary failed again — 2 of 3

[§16.5](#165-three-findings-the-pilot-produced-that-argument-would-not-have) found the 14-value
`mechanism_family` enum could not express *The Invisible Man*. It could not express *A Jury of Her
Peers* either. DERIVE was forced to `hidden_accomplice`, and **the story has no accomplice and no
trick**: nothing is staged by the culprit at all. The concealment is performed first by the
investigators' own framing of what counts as evidence, and afterwards by two neighbour women.

**The mis-tag then showed up as a measurement.** The novelty judge's nearest neighbour for it is
`butler_did_it` — a genre cliche it resembles in nothing except the two fields that were forced.
A wrong `mechanism_family` does not sit quietly in a YAML file; it propagates into the divergence
judgement and makes a distinctive case look like a tired one.

Only *Fenchurch Street* fitted cleanly (`substituted_body`), which makes it the control:
**1 of 3 encodings the existing vocabulary can express.** That moves the enum from a nice-to-have
to a Phase-1 blocker, and the proposed additions are now two:

- `role_invisibility` — the culprit occupies a role whose occupant is not perceived as a person
- `investigative_blind_spot` — the concealment is done by the investigation's own framing, not by
  an act of the culprit

#### Coverage after three works

| Axis | Before | After |
|---|---|---|
| `behavioral` | **0 seeds** | **2** (Invisible Man, Jury of Her Peers) |
| `identity` | 6 | 7 (+ Fenchurch Street) |

Forms acquired that the library previously held none of: **role-invisibility**, **domestic /
non-elite register**, **armchair detection** — plus **inverted** cached and awaiting encode.

`authority` is still at 0 among works acquired in these runs, and deliberately so: none of the three
is honestly an authority case, and tagging one to fill the bucket is exactly the drift
[§4.3](#43-the-fingerprint-ledger-disagrees-with-its-own-source-in-11-of-14-cases) records. It is
filled by [§9.4](#94-reprocessing-alone-closes-part-of-the-authority-gap-for-free)'s retagging and by
Freeman's *The Red Thumb Mark*, which remains the next acquisition after Brodski.

#### Where the £2 went

Not on text. **Conversation turns are the cost driver** — each turn re-sends the whole context — so
the budget bought roughly a dozen round trips, and the discipline that mattered was batching:
`browser_batch` for acquisition, parallel writes for encoding, one script for both gates. Three works
encoded and verified in two runs, one more acquired. The per-book LLM cost predicted in §10.8 held;
what §10.8 does not model, and should, is **the orchestration overhead of the harness that calls it** —
which is an argument for Phase 1 building the harness rather than doing this conversationally.
### 16.10 The long one — *The Case of Oscar Brodski*, and the answer to §16.7

**Run on 2026-08-31, completing the work acquired but deferred in [§16.9](#169-second-run--two-more-works-2-budget).**
R. Austin Freeman, *The Case of Oscar Brodski* (1912, PG 59478), **16,690 words** — 2× either §16.9
work, and the first subject long enough to test the open question in
[§16.7](#167-what-this-does-not-prove).

| | Result |
|---|---|
| Clearance | GREEN both (Freeman d. 1943; pub. 1912) |
| `validateCml` | **PASS, attempt 1** |
| Spans verified | **30 / 30** (one corrected on the first pass — see below) |
| Negative control | `"Sherlock Holmes"` → fail ✓ |
| Novelty | `distinct` — nearest `the_second_key`, sharing axis and test shape only |
| Axis | `spatial` |
| `mechanism_family` | **`staged_scene` — fits cleanly, no forcing** |

**It is the inverted form**, which the library held none of. Part I shows the murder in full; Part II
recovers it from traces. Freeman invented the shape here.

#### §16.7's question, answered — with a caveat about what it answers

§16.7 asked whether a novella-length work needs
[§10.8](#108-how-much-of-each-book-is-actually-read)'s three passes or whether one suffices. The
measured result: **the text could not be read in a single call.** The first read returned lines 1–471
of 704 and truncated at the token cap; the reveal — the blood-direction argument, the surplus glass,
the splinter fitted into the lens — is entirely in the part that did not arrive. Encoding from that
first page alone would have produced a confident, well-formed and wrong case file.

**But be precise about what this shows.** It is a *harness* limit — one tool call's output cap — not a
demonstration that the model needs three semantic passes over resident text. §10.8's three-pass design
is argued from attention, and this run does not test that, because the constraint bit first and lower
down. What it does establish is narrower and still useful: **at novella length the encoder cannot be a
single call, so Phase 1's harness must handle multi-call acquisition and hold the whole text across
them.** Whether it then needs one semantic pass or three remains open, and now needs a full novel
(*The Red Thumb Mark*, 416 kB) rather than a novella to settle.

#### The span check caught a third real error

Third run, third catch. The encoding quoted *"it consisted of several different fibres"*; the text
reads *"Under the microscope I found it to consist of several different fibres."* The claim was
correct and the quotation was not — which is exactly the class of error that turns into a corpus
nobody can trust, and exactly what a reader never notices.

Running tally across the four works: **three genuine mis-quotations caught by `String.includes`, none
caught by reading.**

#### The enum tally is now 2 of 4

`staged_scene` fitted without forcing, as `substituted_body` did for *Fenchurch Street*. Against
`impersonation` forced onto *The Invisible Man* and `hidden_accomplice` forced onto *A Jury of Her
Peers*. So the existing 14-value vocabulary expresses **half** the cases acquired in these runs. That
is better than §16.9's 1-of-3 suggested and still short of adequate; the two proposed additions
(`role_invisibility`, `investigative_blind_spot`) stand.

Worth noting where the novelty judge put it: nearest neighbour `the_second_key` — **the synthetic
CC-BY placeholder** ([§3.3](#33-not-real-novels-2)), which remains one of the corpus's most-cited
reference points. It shares nothing with Brodski but the coarse `spatial` axis and the coarse
`physical_trace` test shape, and the judge correctly returns `distinct`. It is still an argument for
retiring that entry.

#### State of the library after four works

| | |
|---|---|
| Works encoded, verified and validator-clean | **4** |
| `validateCml` pass rate | **4 / 4** (against 0 / 14 for the legacy `examples/`) |
| Spans verified | **90 / 90** across the four |
| Negative controls | **4 / 4 correctly rejected** |
| Forms added that the library held none of | role-invisibility, domestic / non-elite register, armchair, **inverted** |
| `behavioral` | 0 seeds → **2** |

Freeman's *The Red Thumb Mark* remains the next acquisition: it is the `authority` case
([§9.1](#91-axis--the-current-state-and-the-target)'s other empty axis), it is a full novel at 416 kB,
and it is therefore the subject that settles the one-pass-versus-three question this run left open.
---

### 16.11 Phase 2 opened — nine novels acquired, one re-encoded, and a correction to §3.2

**Run 2026-08-31**, on the instruction to close out all nine GREEN legacy novels.

#### What is done

| Step | Result |
|---|---|
| **The Hound unzipped** | `examples/the_hound_of_the_baskervilles_cml2.zip` → `.yaml`. Six months invisible; two commands. |
| **All 9 scaffolded** | `library/works/<slug>/` with `provenance.yaml`, clearance **computed** by the §10.2 rule — **9 / 9 GREEN**. Legacy encodings preserved as `case.legacy.yaml`, deliberately *not* as `case.cml2.yaml`, which must only ever hold a validator-clean record. |
| **All 9 texts acquired** | **685,000 words** captured to disk from Project Gutenberg via the browser, independently of the encoder. |
| **1 of 9 re-encoded** | *The Clue of the Twisted Candle* — **`validateCml` PASS**, **22 / 22 spans**, **2 / 2 negative controls rejected**, novelty `distinct`. |

#### The correction, which is the run's real output

§3.2 listed this book among the four with materially wrong encodings and said the **legacy fingerprint
was closer to the novel than the CML file**, quoting its premise — *"a locked-room death with the
victim seemingly alive, faked by a recording"* — as correct.

**It is not.** A second negative control was run alongside `"Ralph Hewitt"`:

| Span | Expected | Result |
|---|---|---|
| `"Ralph Hewitt"` — the name our own legacy encoding invented | fail | **fail** ✓ |
| `"gramophone"` — what the legacy fingerprint claims the mechanism is | fail | **fail** ✓ |

There is no recording in Wallace's novel. The mechanism is **two candles**: a small one propping the
steel latch open until the deliberately stoked fire softens it, so the room seals itself behind the
killer who has already left; a second, cut to fit, under one end of an ivory paper-knife weighted with
two heavy books, which tips the telephone receiver off its rest twenty-five minutes later and rings
Kara's private line to Scotland Yard — while the killer sits in that very office establishing his
alibi. `mechanism_family` is `alibi_fabrication`, not `recorded_presence`.

**Both halves of this book's record were wrong, not one.** §3.2 has been marked accordingly.

It also **voids the flagship example in [ANALYSIS_78 §6](../ANALYSIS_78/ANALYSIS_78.md#6-the-device-library-re-describes-from-memory-what-the-corpus-holds-as-data)**:
the device pattern `recorded_presence`, sourced to *"Sayers/Christie-era gramophone tricks"*, was said
to be re-describing a case we already own. **We do not own a gramophone case.** A_78's argument
survives on its other three pairs, and the reason this one collapsed is itself an instance of the
disease it describes — a hand-authored fingerprint nobody had ever checked against its own book.

**On the evidence standard:** §3.2 marked those judgements **LITERARY**, explicitly not MEASURED.
Reading the book reversed one of them. The label did its job; the measurement overturned the claim.
That is the standard working, not failing.

#### A second real defect, found by the gate

Attempt 1 failed on one error: `culpability.culprits names "John Lexman", who is the detective`.

A **false positive**. `isDetectiveArchetype` (`packages/cml/src/roles.ts:47`) splits an archetype on
`[,;/]` and matches the role noun anywhere in the head, so *"detective novelist, wrongly convicted"*
reads as the detective. Lexman **writes** detective stories; T. X. Meredith is the detective and
carries `role: detective` correctly. Golden Age fiction is full of detective novelists, ex-detectives
and detective-story readers, and any of them who turns out to be the culprit will fail this gate.
Worked around by wording the archetype accurately; the substring collision remains and is logged.

#### What is NOT done, and the honest reason

**Eight of the nine remain un-encoded.** Not blocked — the texts are on disk, cleared and ready — but
the per-novel cost measured on this one is far above the estimate the work was approved on.

| | |
|---|---|
| §10.8 estimate, harness | ~£0.65 / book |
| Measured here, conversational | ~**8 large reads** for one 57,838-word novel, plus encode, gate and verify |
| Remaining eight | ~630,000 words, one of them (*The Moonstone*, 194,911 words) **3.4× the size of this one** |

The gap is not the LLM cost §10.8 priced — that estimate still holds for a harness making one clean
call per pass. It is the **orchestration overhead of doing it in a conversation**, where every novel's
text is re-sent with each turn. [§16.9](#169-second-run--two-more-works-2-budget) already recorded
this as the budget lesson; this run is its confirmation at novel length, and the conclusion is the
same one, now with a number attached: **Phase 1 builds the harness, and the harness does the other
eight.** Doing them conversationally would cost multiples of the whole programme's projected budget
to produce output a scripted pass produces for pennies.

**Nothing is wasted by stopping here.** The acquisition, clearance and scaffolding are done for all
nine; the harness's job is now purely ENCODE → VERIFY → DERIVE over texts already on disk with
provenance already written.
---

### 16.12 Could the encodings come from web summaries instead of the text? — tested, 2026-08-31

A fair question, given [§16.11](#1611-phase-2-opened--nine-novels-acquired-one-re-encoded-and-a-correction-to-32)'s
cost. Tested against the one novel now read end to end, so the right answer was known in advance.

**Two searches on *The Clue of the Twisted Candle*.** Both returned the shape and refused the substance,
in their own words:

> *"The search results indicate that the novel features a locked-room mystery, but they don't provide
> specific details about exactly how the murder was committed using the candles… the exact mechanism
> of the murder is not revealed in these search result summaries."*

> *"…the search results don't contain specific details about the artificial arm, right/left
> impersonation, how Lexman faked his alibi using a telephone, paper knife, or other specifics from
> your query. To get more detailed information… you may need to access the full text of the novel."*

What search **did** supply: Kara is the villain and the victim, Lexman is framed, the death is a
locked-room killing, two twisted candles are the key clue. That is a good fingerprint and a useless
case file.

What it **did not** supply — every field that makes a CML a case rather than a blurb:

- the mechanism (one candle propping the steel latch until the fire drops it; a second under a
  paper-knife weighted with two books, tipping the telephone off its rest 25 minutes later)
- the discriminating test — **the real Gathercole had lost his *right* arm and the impostor faked the
  left**, which is the entire fair-play hinge
- `inference_path.steps[].required_evidence`: the ivory paper-knife, the silver cigarette box, the two
  named books, the deliberately stoked fire, the card bearing the valet's Dartmoor number

It also supplied one confidently garbled detail — *"a room sealed by a gigantic metal arm across the
inside of the door"* — which is a steel latch described by someone who has not seen it. That is the
characteristic failure: not silence, but plausible near-misses that would go straight into a case file.

#### Three reasons this is settled rather than arguable

**1 · It is the process that produced the defects.** `grabber/INSTRUCTIONS.txt` says: *"If you only
provide a book title, the AI must rely on its own knowledge."* That is precisely summary-and-recall
encoding, and its measured output is [§3.2](#32-materially-wrong-4) — **four materially wrong
encodings in twelve real works, a 33% error rate**, including a character who does not exist
surviving six months in the corpus.

**2 · It is how §3.2 itself got one wrong.** Those judgements were made from knowledge of the texts —
the same epistemic footing a search gives — and labelled **LITERARY, not MEASURED**. Reading the book
reversed one of them ([§16.11](#1611-phase-2-opened--nine-novels-acquired-one-re-encoded-and-a-correction-to-32)).
The label was honest and the conclusion was still wrong.

**3 · It structurally disables VERIFY.** [§10.4](#104-verify--deterministic-not-a-second-opinion) is
`sourceText.includes(quote)`. No text, no spans, no check. That check has now caught **three genuine
encoder mis-quotations across five works, none of which any reading caught.** An encoding produced
from a summary is unverifiable by construction — which is the definition of the legacy corpus.

#### And it saves almost nothing

[§16.11's costing](#1611-phase-2-opened--nine-novels-acquired-one-re-encoded-and-a-correction-to-32)
puts the eight remaining novels at **£5.21** through the harness. The texts are already on disk, so
search would not even save acquisition — only the reading, which is the step that produces the
verifiable encoding. **Trading £5 for the reintroduction of a 33% error rate is the worst available
exchange in this programme.**

#### Where search IS legitimate

One place, already in the plan. **Layer 1 fingerprints for breadth-only works** — the eight abstract
fields, no evidence chain, no spans — are what [Phase 4](#phase-4--breadth-for-divergence-10-half-a-day)
prices at ~£0.02 each for works we will never encode in full. A search-derived fingerprint is a
divergence entry, not an exemplar, and the judge only ever compares it on five coarse fields.

**Condition: any such entry must carry `provenance.method: summary_derived`** so it can never be
mistaken for a verified encoding, and must never be promoted to `case.cml2.yaml` without the text.
Note also that the legacy fingerprints were exactly this — hand-authored from recall — and
**11 of 14 disagree with their own source files** ([§4.3](#43-the-fingerprint-ledger-disagrees-with-its-own-source-in-11-of-14-cases)),
with the *Twisted Candle* entry wrong about the mechanism outright. Cheap and tagged is acceptable
for breadth. Cheap and untagged is how the corpus got into this state.
---

## Appendix A — Reproduction

Every §0–§6 measurement, reproducible. Each probe imports the **built** `dist/` modules deliberately
— see `probe-validity-process-start-vs-dist-build`; a src-level read proves nothing about what ran.

**The seed block exactly as Agent 3 receives it** (§5.1 — the three dead fields):

```js
const M = await import("file:///C:/CML/packages/prompts-llm/dist/utils/seed-loader.js");
const patterns = M.extractStructuralPatterns(M.loadSeedCMLFiles("C:/CML/examples"));
for (const axis of ["temporal","spatial","identity","behavioral","authority"])
  console.log(axis, M.formatPatternsForPrompt(M.selectRelevantPatterns(patterns, axis, 3)));
```

**Validator verdict per seed** (§4.2 — 0 of 14 pass):

```js
const { validateCml } = await import("file:///C:/CML/packages/cml/dist/validator.js");
// yaml.load each examples/*.yaml → validateCml(doc).errors
```

**`divergeFrom` as built** (§5.2 — raw filenames, 12-slot budget spent on two books):

```js
const S = await import("file:///C:/CML/apps/worker/dist/jobs/agents/shared.js");
console.log(S.buildNoveltyConstraints(M.loadSeedCMLFiles("C:/CML/examples")));
```

**Fingerprint-vs-file axis drift** (§4.3 — 3 of 14 agree): compare each
`seed-fingerprints.yaml` entry's `axis` against its source file's `CASE.false_assumption.type`.

**Novelty verdicts across all history** (§6):

```bash
grep -h '"status"'           documentation/prompts/actual/*/*Agent8-NoveltyAuditor_response.md
grep -h '"mostSimilarSeed"'  documentation/prompts/actual/*/*Agent8-NoveltyAuditor_response.md
```

Archived evidence used unchanged, already in the repo:

- `documentation/prompts/actual/run_20260831-0553_mystery/07_Agent3-CMLGenerator_request.md:193`
  — the live seed block, and the raw filename in `divergeFrom` at line 213.
- `documentation/prompts/actual/run_20260830-1735_mystery/08_Agent8-NoveltyAuditor_request.md:74`
  — the 13 seed summaries including the four `Untitled` stubs; the 90% threshold at line 443.
- `unzip -l examples/the_hound_of_the_baskervilles_cml2.zip` — one file, 8,785 bytes (§2.3).
