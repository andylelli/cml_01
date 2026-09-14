# ANALYSIS_93 — WORKING DEPTH IN

**Opened 2026-09-14.** Cost: £0 — no paid run. Sources: `data/store.json` (851 character profiles,
850 relationship pairs, 260 key locations), the 11 real Golden Age novels in `library/texts/`, and 20
shipped manuscripts.

**NOTHING IN THIS DOCUMENT IS BUILT.** It is a design analysis with its evidence attached.

---

## §0 THE QUESTION, AND THE ANSWER TO THE HYPOTHESIS

> *"not depth, Perciville walked with a stoop. depth, Perciville had walked with a stoop ever since a
> carting accident age 9, that almost cost him his life. He was very bitter about the world of speed
> being taken away from him at such a young age. Office work was all he was good for thereafter."*

The hypothesis under test: **depth comes from the location profiles and the character profiles.**

**Partly right, and it misses the one source that already has a working precedent.** There are THREE
places a dated past can enter this pipeline, not two:

| # | source | agent | state | MEASURED |
|---|---|---|---|---|
| 1 | the **person** — `formativeIncident` | 2b | field exists, ran ONCE | 7 of 7 filled one frame |
| 2 | the **relationship** — `sharedHistory` | 2 | field exists, lever ON | **0% → 37% dated** |
| 3 | the **place** | 2c | **no history field exists at all** | 0 of 260 carry a year |

Source 2 is the one the hypothesis misses, and it is the most important, because **it is the only
depth lever in this pipeline that has ever been shown to work** (§3.2). Source 3 is the largest hole:
a place in this pipeline has no past whatsoever, by schema.

---

## §1 WHAT DEPTH IS — the five parts

The example decomposes into five parts, and this is already the spec at
`agent2b-character-profiles.ts:253`:

1. the **TRAIT** it explains — something visible on the page
2. its **ORIGIN** as a dated event — *"a carting accident at nine"*, not *"his years of service"*
3. what it **COST** — the thing they can no longer have or do
4. their **STANCE** toward that cost — bitterness, shame, pride
5. the **CONSEQUENCE** it set running — the life they took up instead

The load-bearing part is **2**. A trait is free; every profile field already carries traits. What no
artifact in this pipeline reliably carries is an event with a date attached to it, and without the
date the other four parts collapse back into character description.

---

## §2 MEASURED — the page has no past at all

A **PAST-ANCHOR** is a clause putting a named span of time between now and an earlier event: *ever
since*, *years ago*, *when he was*, *at the age of*, *in 1911*, *used to be*, *had once been*,
*before the war*. Structural, like the wit shapes in A_92 — not a judgement about whether the past is
interesting.

**PROBE VALIDITY.** A zero from a new probe is a claim about the probe. This one fires on real text:
every one of the 11 canon novels returns non-zero, range 0.6–9.2. The known-positive holds, so a zero
on our side is a finding.

| | canon (11 novels) | ours (20 manuscripts) |
|---|---|---|
| median length | 57,807 words | 10,356 words |
| **median anchors per book** | **11** | **0** |
| median per 10k | 2.3 | **0.0** |
| range per 10k | 0.6 – 9.2 | 0.0 – 1.9 |
| **books containing ZERO** | **0 of 11** | **13 of 20** |

**Thirteen of our twenty books contain not one past-anchor.** Our best book (1.9) sits below the
canon median and below eight of the eleven novels. This is the A_92 shape again — near-total
separation, our best barely reaching their worst.

---

## §3 THE THREE SOURCES

### §3.1 THE PERSON — built, ran once, collapsed into one frame

`AGENT2B_FORMATIVE_INCIDENT` (A_91, ON in `.env.local`) requires all five parts of the example.

**MEASURED, 21 stored values (one cast of 7, stored three times, run 2026-09-13 16:28–16:56):**

- **0 of 21** reuse the worked example's cart, stoop or thirty years. The A_67 leak risk did not fire.
- **21 of 21 open `Developed a`.** Three of seven share *"after a humiliating"*. The five parts were
  read as a **sentence pattern**, not as requirements.

The fix (`835c19e1`) names and bans those formulas. It was committed at 17:34; the run was 16:28–16:56.
**The ban has never been exercised.** INFERRED, not measured: it will work, because §3.2 is the same
shape of instruction and did work.

### §3.2 THE RELATIONSHIP — the precedent, and the reason to be optimistic

`AGENT2_SHARED_HISTORY_EVENT` (A_85 F6, ON since 2026-09-09) requires every relationship's
`sharedHistory` to name ONE specific past event.

**MEASURED over 850 stored pairs, split at the flag date, one regex applied to both sides** (so the
delta is sound even though the absolute differs from the 9% baseline in FLAG-AUDIT, which used a
different matcher):

| | pairs | naming a dated event |
|---|---|---|
| pre-flag (< 2026-09-09) | 577 | **1 — 0%** |
| post-flag (≥ 2026-09-09) | 273 | **102 — 37%** |

**A prompt operation asking for one dated event moved a depth field from 0% to 37%.** This is the
single most useful fact in this analysis: depth is reachable by the kind of instruction this model
complies with — a countable operation, not a rate.

It also shows the ceiling. 37% is not 100%, and the remaining 63% still read like the samples: *"had a
strained relationship due to debts and rebellious behavior"* — a state, not an event.

### §3.3 THE PLACE — nothing exists

The `KeyLocation` schema is `purpose`, `visualDetails`, `sensoryDetails`, `accessControl`,
`sensoryVariants`. `PrimaryLocationProfile` is `summary`, `visualDescription`, `atmosphere`. **Every
field is present tense.** There is no `formativeIncident` equivalent, no `history`, no `built`, no
`since`.

**MEASURED over 260 stored key locations:**

- **0 of 260** carry a year or a date.
- **4 of 260** carry any past-tense marker at all (*used to*, *had been*, *no longer*, *formerly*).

A_75 measured `location_profiles` at a 4.5% machine-register rate — the most CONCRETE artifact the
pipeline produces. That is exactly the problem restated: these are excellent photographs of rooms
nothing has ever happened in. A place with a history is the cheapest depth in the genre — the
Golden Age house is a character — and this pipeline has never written one.

---

## §4 THE CARRY PROBLEM — a profile is not a page

A_91 already learned this once: generating the incident is not the same as putting it on the page,
which is why `AGENT9_DEPTH_BEAT` exists. Two specific hazards for anything built here:

1. **`location_profiles` is `priority: 'medium'`** in the prompt budget, and the drop order is
   `["optional", "medium", "high"]` — it is the **second thing deleted** under pressure. This is the
   X47 shape that deleted the humour guide for three runs. Depth written into a block that late
   chapters never see is depth that does not exist.
2. **`stripLocationParagraphs` removes the `paragraphs` field** before the block ships. The richest
   prose field in the artifact is deliberately discarded, so history written *there* is written into a
   bin.

**INFERRED:** any place-history field must be short, must sit in a field that survives the strip, and
its block's priority must be settled before the field is added — not after a run shows it missing.

---

## §5 WHAT THE EVIDENCE SAYS TO DO — ranked, NONE BUILT

Ranked by evidence behind them, not by appeal.

**D1 — give a place a dated past (the biggest hole, and the precedent already exists).**
One field on `KeyLocation` — the five parts applied to a room: what is visibly odd about it, the dated
event that made it so, what it cost, who resents it, how the house works around it now. §3.2 is the
template for the instruction: *ONE specific dated event*, as a countable operation. Must clear §4
first.

**D2 — verify the formative-incident ban (free, and already committed).**
The next run of any kind exercises it, because the flag is on. Checkable prediction: **fewer than 7 of
7 sharing an opening stem**, against the 7/7 measured. Costs nothing extra.

**D3 — an instrument, before any more levers.**
A_92's lesson: humour had five layers and no measurement for a year. Depth now has three sources and
no measurement. The past-anchor probe in §2 is the candidate, and it separates already. Two
deterministic checks that need no run: are the five parts present, and do two incidents in one cast
share an opening stem. The 7/7 collapse would have been caught automatically instead of by eye.

**D4 — push the 63%.**
`sharedHistory` works 37% of the time. Whatever makes the other 63% come back as a *state* rather than
an *event* is a live, measurable, £0 question against stored data.

**RECOMMENDED AGAINST — a `--depth` parameter.** Humour got a band because humour is a legitimate
dial: some books are meant to be dry. **No book is meant to be shallow.** A parameter here would be an
off switch for the thing every read has asked for, which is CLAUDE.md's B1 in reverse. Depth should be
on, always, and measured.

---

## §6 WHAT IS NOT KNOWN

- **Whether past-anchor density predicts the external score.** It separates canon from us; that is not
  the same claim. Needs reads against books with known densities, `words >= 8000`.
- **Whether place-history reaches the page even if written.** §4 gives two reasons it might not.
- **Whether 2.3 per 10k is even the target.** Our books are 10,356 words against the canon's 57,807. A
  short book may carry less past honestly. The per-10k rate controls for this; the absolute zero does
  not excuse it.
- **Whether the five parts are right for a PLACE.** They were derived from a person.

---

## §7 STATUS

| # | item | state | commit |
|---|---|---|---|
| 1 | measure past-anchors, canon vs ours | **MEASURED** | this doc |
| 2 | audit the three sources in the store | **MEASURED** | this doc |
| 3 | `sharedHistory` pre/post flag split | **MEASURED** | this doc |
| D1 | place-history field on `KeyLocation` | **NOT BUILT** | — |
| D2 | verify the formative-incident ban on the next run | **NOT RUN** | — |
| D3 | a depth instrument | **NOT BUILT** | — |
| D4 | the 63% of `sharedHistory` that stays a state | **NOT INVESTIGATED** | — |
| — | a `--depth` parameter | **RECOMMENDED AGAINST** (§5) | — |

**NEXT ITEM: D3 or D1**, and D2 comes free with whatever run happens next — including A_92's item 12.
