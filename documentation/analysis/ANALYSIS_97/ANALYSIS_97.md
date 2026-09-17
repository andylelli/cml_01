# ANALYSIS_97 — Expanding the corpus: a catalogue sweep, and the three filters that were wrong

**2026-09-17. £0 for the survey, £0 for acquisition, £5 budgeted for encoding.**

A_77 §15 is a hand-checked list of 39 public-domain works, every row resolved by opening a Project
Gutenberg search page one title at a time. §15.5 is honest about the limit: the check is *"a catalogue
record exists and is reachable"*, and nothing more. This analysis does the same job from the other
end — enumerate the catalogue, apply the clearance rule as a filter, and let the output be bounded by
what exists rather than by what anyone remembered to look up.

**Headline.** The reachable pool is not 39 works. It is **517 catalogue rows** that the Library of
Congress calls detective fiction and whose author died in 1955 or earlier; **391 of them are GREEN**
in both jurisdictions and not yet held. The library went from 14 works to **142**, from 719k words to
**10.4M**. Everything below the headline is about the filters, because two of the three I wrote were
wrong in ways that a summary would have hidden.

---

## §0 Method, and what MEASURED means here

Every number carries its instrument. **MEASURED** means a script produced it on the date given and
the script is in the repo. There is no INFERRED or ASSUMED claim in this document except where
labelled: the whole exercise is deterministic apart from two external catalogues, both cached.

| Stage | Script | Cost |
|---|---|---|
| SURVEY | `scripts/corpus-survey.mjs` | £0 |
| ACQUIRE | `scripts/corpus-acquire.mjs` | £0 |
| CLEAR | `scripts/corpus-clearance-check.mjs` | £0 |
| COVERAGE | `scripts/corpus-coverage.mjs` | £0 |
| ENCODE | `scripts/corpus-encode.mjs` (existing) | ~£0.12–0.25 per work |

---

## §1 The catalogue is a file, not an API

The first version of the survey paginated `gutendex.com`, one topic at a time. **MEASURED: it had not
finished five topic sweeps in 25 minutes, and a single cold request exceeded 120 seconds.**

Project Gutenberg publishes its entire catalogue as one CSV — `feeds/pg_catalog.csv`, 21 MB, 90,681
rows, of which **79,381 are English text records**. One download, complete rather than sampled,
re-runnable offline, and it carries the field the clearance gate cannot proceed without: the author's
death year, inline in the author string (`"Doyle, Arthur Conan, 1859-1930"`).

It does **not** carry a publication year in any usable form. Gutenberg's only date is its own release
date, and for *The Moonstone* that is 1996. Open Library supplies `first_publish_year`, and §4 is
about how much trouble that one field caused.

---

## §2 The clearance rule, applied as a filter

A_77 §8.1, recomputed in code rather than copied from any table:

```
uk green  iff  author_death_year   + 70 < 2026    ->  died 1955 or earlier
us green  iff  first_publication_y + 95 < 2026    ->  published 1930 or earlier
verdict   green iff both · amber iff one · red otherwise
```

**Being on Project Gutenberg is not clearance.** PG is a US catalogue and carries eighteen Christie
titles protected in the UK until 2047. The sweep's AMBER bucket is where they land, and the point of
having the rule as code is that nobody has to remember that.

### 2.1 The funnel, measured

| Stage | Rows |
|---|---|
| English text records in the catalogue | 79,381 |
| — not called detective fiction by LoC or by a Gutenberg shelf | −60,622 |
| — already held | −153 |
| — author died after 1955 | −170 |
| — no death year recorded (anonymous, pseudonymous, undated) | −130 |
| — no single credited author (editor-led anthologies) | −83 |
| **Shortlist** | **517** |
| GREEN | **391** |
| AMBER — clear in one jurisdiction only | 88 |
| TRANSLATED — author clear, translator unverified | 38 |
| JUVENILE — bucketed, see §5 | 24 |
| RED | 0 |

### 2.2 The upper bound, and why it is not a guess

**MEASURED on the first 20 rows:** Open Library resolves a NOVEL's first publication year reliably
and a single SHORT STORY's almost never. *The Adventure of the Dying Detective* has no book record
before 1991, because in 1913 it was a magazine story. A flat null-is-red rule would drop most of the
short fiction — and short fiction is disproportionately what this corpus wants, since one story is one
clean case. Four of the fourteen works already on disk are stories, not novels.

So where the year is unresolved the gate substitutes an **upper bound**: `author_death_year + 5`. The
US test is *published no later than 1930*, and substituting a value that is at least the true one can
only make the test stricter. That is sound for `<=` and unsound for anything else, so
`first_publication_year` stays **null** rather than being filled with a bound, and `us_basis` records
which was used.

---

## §3 The filter that counted an illustrator as an author

The single-author rule required the Gutenberg author field to name exactly one person. Gutenberg
lists the illustrator beside the novelist.

**MEASURED: that silently dropped five works A_77 §15.1 had named by hand** — *The Greene Murder
Case*, *The Benson Murder Case*, *The Scarab Murder Case*, *Lady Molly of Scotland Yard* and *The
Clue*. Four are Van Dine, which is to say most of the Golden Age proper that is legally reachable at
all. Fixing it took `no_single_author` from 242 rows to 83.

**The way this was found matters more than the bug.** An earlier check reported *"38 of 39 curated ids
recovered"* and read like a validation. It was not: that check scored the genre heading and never ran
the author function. It was **a claim about the probe**, exactly the shape CLAUDE.md's evidence
standard names — and it passed while the filter was throwing away the four most valuable novels in the
list. What caught it was reading the acquisition output against the curated list, item by item.

The illustrator's own copyright is real and is not waived by ignoring them: the acquired artifact is
`text/plain` and contains no illustrations. An **editor**-led volume is a different case and still
yields null, because an anthology's clearance is per-story and this project has no mechanism for a
per-story verdict.

---

## §4 The publication-year resolver, in three wrong versions

This one field needed three attempts, and each failure was a different shape.

### 4.1 Relevance ordering hid the real record

**MEASURED:** *The Memoirs of Sherlock Holmes* resolved to NULL. Open Library's top five
relevance-ranked hits are modern omnibus editions — 1970, 1984, 1993, 2003, 2018 — every one of them
discarded by the death-year ceiling, with the real 1894 record below the cut. `sort=old` returns 1894
three times over. **Fix: one query parameter.**

### 4.2 The pseudonym, and a filter that fired on the wrong row

All four Philo Vance novels resolved to NULL and went AMBER. Gutenberg files them under *Van Dine,
S. S.*; Open Library files them under *Willard Huntington Wright*. A client-side surname test rejected
records the server had already matched.

The first fix kept the surname test and fell back to the server's rows only when it matched
**nothing**. That still lost *The Greene Murder Case* — because a 2025 reprint **is** filed under
"S. S. Van Dine", so the surname matched one useless row, the fallback never fired, and the real 1928
record under Wright never entered the pool.

> **A filter that fires on the wrong row is worse than one that fires on none.** The second is visible;
> the first returns a confident null.

`author=` already does the matching server side and Open Library resolves pseudonyms, so there is now
**no client-side author test at all**. Precision comes from the title anchor and the lifetime window.

### 4.3 `Math.min` over a catalogue with bad rows

**MEASURED:** Open Library carries a record for *The Moonstone* dated **1800** — thirty-eight years
before it was written and twenty-four before Wilkie Collins was born — and one for *The Bishop Murder
Case* dated **1900**, twenty-nine years early. Both sit inside any fixed sanity window, and a bare
`Math.min` takes them.

The window is therefore the author's own lifetime: `birth + 15 .. death + 5`. Against a lifetime those
rows are impossible, and impossible is a thing a script can check. The birth year comes from the same
Gutenberg author string that supplies the death year, so it costs nothing.

### 4.4 Validated, not assumed

11 known answers, 11 correct, including one **honest null**: *The Bishop Murder Case*, whose only
exact-title Open Library record is the 1900 one. It stays AMBER and can be admitted by hand with
`--id ... --pub 1929`, which is what the escape hatch is for.

| Work | Expected | Got |
|---|---|---|
| The Memoirs of Sherlock Holmes | 1894 | 1894 |
| The Greene Murder Case | 1928 | 1928 |
| The Benson Murder Case | 1926 | 1926 |
| The Scarab Murder Case | 1930 | 1930 |
| The Bishop Murder Case | *unresolvable* | null |
| The Red Thumb Mark | 1907 | 1907 |
| The "Canary" Murder Case | 1927 | 1927 |
| The Bellamy Trial | 1927 | 1927 |
| The Moonstone | 1868 | 1868 |
| Max Carrados | 1914 | 1914 |
| The Middle Temple Murder | 1919 | 1919 |

---

## §5 Two buckets that are not the same as REJECTED

### 5.1 Translations — 38 rows, and one already in the library

A translation is a separate copyright and this survey clears the **author** only. 38 otherwise-clear
rows carry a Library of Congress class outside PR/PS/PZ — nineteen PQ and two PT in the first pass,
more once the author fix widened the shortlist. They are Gaboriau, Leblanc, Leroux, Du Boisgobey: the
French *roman policier*, genuinely part of this genre's ancestry and genuinely not clearable by §8.1.
Gaboriau died in 1873; his 1880s English translator did not, and nobody has looked up who it was.

> **The library already holds one.** `the_mystery_of_the_yellow_room` is Leroux in translation. Its
> provenance clears Leroux (d. 1927) and is **silent about the translator**. This was not introduced
> by A_97 and is not fixed by it; it is recorded here because the survey is what surfaced it.

### 5.2 Juvenile fiction — 24 rows, 8 of which got in

PZ with no PR or PS beside it is juvenile fiction, and the catalogue gives it **the same subject
heading as the genre proper**. The Rover Boys, Poppy Ott, Jerry Todd, Horatio Alger, the *Old Sleuth*
dime novels. Eight were acquired before the bucket existed — the Radio Detectives, the Mercer Boys,
Scott Burton — and were removed again.

Neither bucket is dropped. Both are written to `library/candidates.json`, because "juvenile" and
"translated" are catalogue judgements and somebody may want them for something.

---

## §6 What acquisition cost, in bytes

| | before | after |
|---|---|---|
| works | 14 | **142** |
| texts on disk | 13 | **141** |
| words | 719,552 | **10,365,761** |
| `library/texts` | 3.9 MB | **56.4 MB** |

136 downloaded, **0 failed, 0 refused, 0 boilerplate-strip failures**. 8 removed as juvenile. Mean
work: 73,516 words.

**An estimate I got wrong, stated:** I told the owner ~41 MB, extrapolating from the 13 texts already
on disk. Those are disproportionately short stories. The real mean is ~430 kB and the commit is 57 MB.

---

## §7 The anti-copy index would not have survived this

`packages/prose-guard/src/anti-copy.ts` holds one n-gram set in memory and scales with the library.
That was affordable for twelve novels, and it is the reason the corpus could not grow.

**MEASURED 2026-09-17, 13 works / 789,789 10-grams, the same index both ways:**

| representation | heap after GC | build | per n-gram |
|---|---|---|---|
| `Set<string>` | 134.5 MB | 1794 ms | ~170 bytes |
| sorted `Float64Array` | 4.8 MB | 880 ms | 8 bytes |

At the corpus this analysis acquired (~10.4M n-grams) the old representation is **1.8 GB**; across the
whole 391-row GREEN pool it is ~6 GB. A_79 §6 requires this gate **ON** before any source prose reaches
a prompt, so "it is off by default" was never an answer.

Two 32-bit rolling hashes are packed into one integer below 2^53, which a float64 holds exactly — no
BigInt on the hot path — then sorted in place and queried by binary search.

**What it costs, stated.** A fingerprint admits collisions the exact Set could not. The rate is
computable: `m / 2^53`, which at 40M indexed n-grams is **4.4e-12 per queried n-gram**, about one
spurious hit per 200 million chapters. The gate's measured false-positive rate is dominated by
period-idiomatic phrasing by twelve orders of magnitude, so `DEFAULT_N` remains the instrument that
decides `n`. Behaviour is unchanged: 136 prose-guard tests pass, the 45-word synthetic lift from *The
Moonstone* is still caught as one 45-word span, and the known negative still reports zero.

### 7.1 A near-miss worth recording

While reading that file I was about to "fix" the n-gram separator, whose comment promises *"a character
that cannot occur after normalisation"* while the source appears to read `join("")`. It reads
`join("\x01")`. The terminal was eating the control character. **No change was made, and the premise
was false** — which is the same failure mode as §3, in the opposite direction: reading the rendering
instead of the bytes.

---

## §8 Three dead paths, found by running the code

None of these were visible by reading.

1. **`corpus-encode.mjs` defaulted its text path to a closed session's scratchpad directory.** Every
   invocation without an explicit `--text=` had failed since that temp directory was cleared. It now
   defaults to `library/texts/<slug>.txt`, which is also the directory the anti-copy index reads.

2. **`corpus-encode-all.mjs` did the same, and carried a hardcoded list of the eight August slugs.**
   The batch runner could only ever encode the books of August 2026. Its queue is now derived from
   disk: any work with a text and no case. **Acquisition extends the encode queue by itself**, which
   is the property the corpus needed in order to grow at all.

3. **A_77 §10.2's CI clearance gate was specified and never built.** §10.2 ends: *"This is the
   mechanism that makes 'public domain only' a property of the system rather than a promise."* What
   shipped was a `clearance:` block written into each `provenance.yaml` at acquisition, with a comment
   claiming it was derived. A stored verdict is a claim about the past: it cannot promote itself when
   a work clears, and a hand-edited year is checked by nothing. `corpus-clearance-check.mjs`
   recomputes every verdict from the two years and fails on any disagreement, so the stored block is a
   cache rather than the authority — and §15.2's promise that AMBER *"promotes itself on 1 Jan 2027"*
   becomes true. **Over 142 works: green 142, no disagreements.**

---

## §9 Coverage — what the corpus actually holds

`scripts/corpus-coverage.mjs` computes the A_77 §9 targets, which nothing did. **§9.1's hand-counted
table has been wrong since the first re-encode landed**: it records `behavioral` as 0, and it is 4.

State before this analysis's encode batch, over the 12 encoded works:

| axis | have | target | gap |
|---|---|---|---|
| temporal | 1 | 8 | 7 |
| spatial | 5 | 8 | 3 |
| identity | 2 | 8 | 6 |
| behavioral | 4 | 6 | 2 |
| **authority** | **0** | 6 | 6 |

Ten of the sixteen mechanism families are empty, **36 family slots short** of the §9.2 target of three
attested works each. The schema carries sixteen families, not the fourteen §9.2 names —
`role_invisibility` and `investigative_blind_spot` were added later and no analysis has counted them.

**What coverage cannot do, deliberately:** it cannot say which *unacquired* work fills a gap. Axis and
mechanism family are assigned by the ENCODE stage from the text (§10.3) precisely because assigning
them from a title is how four hallucinated plots entered the library in the first place. So it reports
the hole; choosing what to throw at it stays a judgement made from the curated column, re-measured
after each batch rather than predicted before it.

---

## §10 What this does not settle

- **Nothing here has been read by a generator.** Acquisition and clearance are input-side work. The
  novelty judge and the device library gain nothing from a text until an encode runs against it.
- **The anti-copy baseline has not been re-run at the new corpus size.** `DEFAULT_N = 10` was
  calibrated against 719,552 words and the index is now 14× that. The false-positive rate can only
  have gone up, and the number is not yet known. **This is the first thing to run next**, and until it
  is run `PROSE_ANTI_COPY_GATE` should stay off.
- **The calibration corpus is still computed over 12 works.** `library/calibration/*.json` records
  `canon_works: 12, canon_words: 720329`. Recomputing it over 141 works is free and would sharpen
  exactly the p90 tail that A_93 identified as the register gap — but it has not been done here.
- **391 GREEN rows remain unacquired**, and the survey that found them is a committed artifact
  (`library/candidates.json`), so the next batch is a script invocation rather than another sweep.
