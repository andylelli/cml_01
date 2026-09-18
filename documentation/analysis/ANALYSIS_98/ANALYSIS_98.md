# ANALYSIS_98 — One corpus, one home: consolidating `examples/` into `library/`

**2026-09-18. £0 — no LLM call, no run.**

A_97 grew the reference library from 14 works to 166 and the owner could still only see 14. That is
the finding this document exists for, and the fix is smaller and more embarrassing than the number
suggests: **there were two directories holding the same cases, and nothing derived either from the
other.** The API served one. The generator read the other.

**Headline.** `examples/` is gone. `library/works/` is the only home. **Nine of the fourteen files in
`examples/` were byte-identical copies** of `library/works/<slug>/case.legacy.yaml` — git recorded
every one of the migrations as `R100`, a rename with no content change, which is the cleanest possible
proof that the duplication was pure. Three works migrated in, two were not novels and moved to
`library/retired/` with reasons, and the flag that used to choose between the two directories is
retired.

---

## §0 What was actually wrong

Nothing was missing. The corpus was never 14 works. Two readers were pointed at different places:

| reader | read | saw |
|---|---|---|
| `/api/samples` → the Archive view | `examples/` | **14** |
| `loadSeedCMLFiles` → Agent 3 | `library/works/` ∪ `examples/` | 25 |
| `packages/novelty` | `seed-fingerprints.yaml` | 28 |
| anti-copy, calibration | `library/texts/` | 165 |

The Archive's count was **accurate about the directory it read and silent about the one that
mattered**. That is the failure mode worth naming: not a wrong number, a number measuring something
other than what its label said.

A_77 §10.7 had already specified the fix and nobody had done it:

> `examples/` becomes a compatibility shim over `library/works/*/case.cml2.yaml` for one release, then
> goes. One shape, one home, one derivation direction.

A_97 extended the library and left the endpoint where it was, so the gap got a hundred and fifty works
wider.

---

## §1 The duplication, measured

All fourteen files in `examples/`, classified before anything moved:

| | count | what happened to it |
|---|---|---|
| byte-identical to `library/works/<slug>/case.legacy.yaml` | **9** | deleted; the library copy was always the same bytes |
| unique, GREEN, structurally encoded | 0 | — |
| unique, AMBER (US public domain, UK protected) | **3** | migrated to `library/works/` as structure-only (§2) |
| unique, not a novel | **2** | moved to `library/retired/` with the reason (§3) |

Two schemas were in play, which is A_77 §4.1 still true a year later: nine files use the CML 2.0 shape
(`CML_VERSION` / `CASE`), five use Schema B (`schema_version` / `case_metadata`). The consolidation
does not fix that — it is a property of the legacy encodings themselves, and the fix for a legacy
encoding is a re-encode, not a rename.

---

## §2 The three AMBER works, and a gate that can now express the ruling

*Trent's Last Case* (Bentley, d. 1956) and Christie's *The Mysterious Affair at Styles* and *The
Secret Adversary* are public domain in the US and protected in the UK. A_77 §8.2 ruled on them: keep
the **structural** encoding, tag it AMBER, never let it near the calibration corpus. The reasoning is
that the corpus holds no prose for them and a plot abstraction is not the protected thing.

That ruling was only ever a sentence in a document. The gate could not express it — A_97's
`corpus-clearance-check.mjs` failed on any AMBER work unless a global environment variable was set.
So the three works sat in `examples/`, outside the gate's reach, which is how a rule survives by not
being tested.

The gate now asks **two** questions instead of one:

```
does library/texts/<slug>.txt exist?   -> the work must be GREEN. No override, ever.
                                          This is the copy that reaches the anti-copy index and
                                          every craft measure computed over the corpus.
structure only?                        -> GREEN passes. AMBER passes ONLY with an explicit
                                          `structural_only: true` and a reason, per work, in git.
                                          RED never passes.
```

**Verified against three known-positives, not by observing that it passed.** A green run proves
nothing about a gate; these were run deliberately:

| probe | result |
|---|---|
| copy a text in for `trents_last_case` | **exit 1** — "AMBER and a TEXT is on disk … there is no override for that" |
| flip its `structural_only` to false | **exit 1** — "clear in the US only … Undeclared, it is refused" |
| restore both | exit 0, "all clear" |

**WITHDRAWN: `CORPUS_JURISDICTION`.** A_77 §10.2 reserved a global env override to admit AMBER works;
A_97 implemented it; this removes it — unset, unregistered, and depended on by nothing. One
environment variable that admits **every** amber work at once is the blunt switch CLAUDE.md B1 argues
against: it cannot be reviewed, it is invisible in a diff, and it would silently admit the next amber
work anybody added. A per-work declaration carrying its own reason is auditable, is in git, and cannot
generalise beyond the file it sits in.

Current state: **169 works — green 166, amber 3; 165 hold text, 4 are structure only.**

---

## §3 Two entries that were never corpus works

Moved to `library/retired/`, not deleted, per the repo convention that a tracked item goes to
recommended-against with its reason.

- **`the_second_key` — synthetic.** Not a novel and not an encoding of one: an invented case written
  as a fixture. A_77 §4.2 found it was the *sole* attestation of the `locked_room_key` mechanism
  family, so a placeholder was standing in for worked precedent in the one place the corpus exists to
  provide it. `corpus-sync-fingerprints.mjs` already printed it as `retired:`; now the file is
  somewhere that matches.
- **`the_leak` — a stub.** A Futrelle short story A_77 §15.4 could not resolve to an ebook id. The
  encoding is a fragment with no source text behind it and no way to verify one.

This is the only behaviour change to what reaches Agent 3: the seed corpus goes 25 → 24 cases,
explained exactly — minus these two, plus *The Moonstone*'s legacy encoding, which now loads from the
library instead of from `examples/`.

---

## §4 The flag that could only choose between the corpus and nothing

`SEED_CORPUS_FROM_LIBRARY` gated whether `loadSeedCMLFiles` read `library/works/` **in addition to**
`examples/`. Delete `examples/` and its OFF position stops meaning "use the old directory" and starts
meaning "return an empty array" — a flag whose off position empties the seed corpus is a trapdoor, not
a switch.

Retired: removed from `.env.local`, marked **RETIRED — do not reintroduce** in `FLAG-AUDIT.md` rather
than deleted, `corpusSeedsEnabled` removed from the loader. `npm run flags:check` stays clean at 200
reads / 128 config / 206 registered. `SEED_CORPUS_LIBRARY_DIR` survives, because tests override the
directory with it.

The loader now reads each work at its **best available encoding** — `case.cml2.yaml` where a verified
re-encode exists, `case.legacy.yaml` otherwise. Preferring verified is not a preference: A_77 §3.2
found four legacy encodings materially wrong about their own plots, one naming a character who does
not appear in the book. But dropping the legacy files entirely would have removed four works from
every Agent 3 prompt as a side effect of a tidy-up, which is the kind of silent change this analysis
is about.

---

## §5 The bug the new test found, which reading would not have

`libraryRoot()` resolves a caller's hint to the library. Every historical call site passes
`<workspace>/examples` — a directory that no longer exists — and the resolver is what keeps those
callers working. Its first version was:

```ts
if (/[\\/]library[\\/]works[\\/]?$/.test(hint)) return hint;
```

The backslash was lost between writing and saving, leaving `[\/]`, which matches a forward slash
only. On Windows `join()` produces backslashes. So **handing the function the library directly
returned nothing**, while the legacy `examples/` hint kept working perfectly.

That is worth stating plainly because of how close it came to shipping. I had verified the change by
calling `loadSeedCMLFiles('C:/CML/library/works')` — forward slashes, typed by hand — and got 24
cases. The check passed because of the shape of the string I happened to type. The test that caught it
built its path with `join()`, the way real code does.

Fixed with `basename`/`dirname` rather than another regex, since an escaping hazard was the defect.
Three path shapes now agree — `C:/CML/examples`, `C:/CML/library/works`, `C:\CML\library\works` — all
24 cases.

`packages/prompts-llm/src/__tests__/seed-loader-a98.test.ts` pins four properties, all about
behaviour under a wrong or outdated input, because the failure mode here was never an exception — it
was a confident empty list:

1. the library is read when handed the library;
2. **a caller still passing the deleted `examples/` path gets the same corpus, not zero**;
3. a work with both encodings is read at the verified one;
4. a work with a text and no case contributes nothing.

---

## §6 Two existing tests that were pinning the old world

Neither was wrong. Both were pinned to facts that stopped being true.

- **`axis-reaches-agent3.test.ts` walked up the tree looking for `examples/`** and threw when it was
  gone. Its guard is a good one — it refuses a directory that exists but holds no seed YAML, because
  an empty array would make every assertion below it pass vacuously. Repointed at `library/works`,
  with the guard strengthened: **135 of 169 work directories hold a text and a provenance file and no
  case at all**, so "the directory exists" is now an even weaker signal than it was.
- **`documents the two axes the corpus does NOT cover`** asserted that `behavioral` and `authority`
  returned no patterns, with a note reading *"when a behavioral or authority seed is added, this test
  is the one to update."* A_97 added them. Inverted rather than deleted — the property worth pinning
  is the same either way, that what the corpus holds is what an axis filter can reach. It was the gap
  that needed watching then; it is the coverage that needs watching now.

---

## §7 What the API serves now, and why it reports two numbers

`/api/samples` reads `library/works/`, lists each work at its best encoding, and carries a `state` of
`verified` or `legacy` — because "checked span-by-span against the source text" and "hand-authored,
and wrong about its own plot in four known cases" should not look identical in a list. Titles come
from `provenance.yaml` rather than from the slug, so a reader gets *The "Canary" Murder Case* instead
of *The Canary Murder Case*. `<slug>_cml2` still resolves, so old links do not 404.

The Archive now shows **34 cases**, not 14. But the library holds **169 works**, and a card reading
"34 cases on file" would have reproduced exactly the confusion this analysis started with, one
order of magnitude smaller. So the payload carries the totals:

```json
"library": { "works": 169, "encoded": 30, "legacy": 4, "awaitingEncode": 135 }
```

and the card reads **"34 cases on file · 169 works in the library, 135 not yet encoded."** The
difference between those numbers is now a fact on screen rather than a discrepancy to discover.

---

## §8 The manifest, and the rule it exists to obey

`library/manifest.json` is A_77 §10.2/§10.7's index, finally built. It is **not** a second copy — it
is generated from the provenance files with a `--check` mode wired into `npm run corpus:check`, so CI
fails if it drifts.

That distinction is the entire subject of this document, and the project has now paid for it three
times:

| | two files, one fact, no derivation | cost |
|---|---|---|
| A_77 §4.3 | `seed-fingerprints.yaml` called itself derived, was hand-authored | disagreed with its own sources in **11 of 14** entries |
| A_97 §9.1 | `corpus-derive` and `corpus-classify` share `fingerprint.yaml` | a bare derive replaced **12 of 12** LLM families with regex guesses |
| A_98 | `examples/` and `library/works/` held the same cases | the UI showed **14** works while the corpus held **166** |

**The rule: anything that restates a fact must be generated from that fact and checkable against it.**
The manifest's header records which files are truth and which are derived, so the next person adding
an index knows which side they are on.

Verified by breaking it: editing `totals.works` to 999 makes `--check` exit 1 with "is STALE".
`generated_on` is the one field allowed to differ, because re-running on a later day is not drift.

---

## §9 State after consolidation

| | |
|---|---|
| works | **169** (166 green, 3 amber structure-only) |
| holding text | 165 · 12.3M words |
| verified encodings | 30 |
| legacy encodings | 4 (*The Moonstone*, and the three AMBER works) |
| awaiting encode | 135 |
| seed cases reaching Agent 3 | 24 (34 encodings, less the 10 the evidence gate demoted) |
| novelty ledger | 28 fingerprints |
| directories holding cases | **1** |

Axis coverage across the encoded corpus: `identity` 13, `behavioral` 7, `spatial` 6, `temporal` 3,
`authority` 1.

---

## §10 What this does not settle

- **The four legacy encodings are still legacy.** *The Moonstone* — the founding text of the genre —
  has a text on disk, a provenance file, and no verified encode: it was the longest book in A_97's
  batch, sorted last, and did not complete. It is the obvious next single encode (~£0.30). The three
  AMBER works cannot be re-encoded at all while they are amber, since a re-encode reads the text and
  the gate refuses to let us hold one.
- **135 works have a text and no case**, which is 80% of the library. They contribute to the
  anti-copy index and to calibration and nothing else.
- **Nothing here changes what a book scores.** This is plumbing. The one measurable claim is that
  the number on the Archive card now matches the corpus, and that a stale caller cannot silently get
  an empty corpus — both pinned by tests rather than asserted here.
- **Schema B still exists** in four legacy files. The fix for a legacy encoding is a re-encode.
