# HOW HUMOUR WORKS

**Reference, not analysis.** What generates humour in this pipeline, where each piece lives, what it
is measured to do, and what is not known. Current as of 2026-09-14.

Every number here is measured from `data/store.json`, `logs/llm-prompts-full.jsonl` or the shipped
manuscripts. Where something is inferred or unknown it says so.

---

## 1. THE SHORT VERSION

Humour is generated in **five layers**, three agents apart, and they were built at different times by
different analyses. Nothing in the pipeline *checks* whether a book is funny, because no instrument
for that exists here.

| # | layer | agent | what it produces | reaches the prompt |
|---|---|---|---|---|
| 1 | style + level + tic, per character | 2b | `humourStyle`, `humourLevel`, `signatureTic` | **16 of 17** characters carry a style and a level > 0 |
| 2 | permission by scene position | 6.5 | `humourPlacementMap`, 12 positions | **10 of 10** chapters |
| 3 | the guide | 9 (run-stable) | 5 named styles, worked examples, rhythm, forbidden zones | 10 of 10 — **but was 0 of 10 on resumes until 2026-09-13** |
| 4 | the per-character block | 9 (per chapter) | "Humour: dry wit (level 0.5 — occasionally witty)" + the style's definition | 7–10 of 10 |
| 5 | the wit beat | 9 (per chapter) | ONE named character, ONE remark, in their style | **10 of 10** |

Layers 1–4 predate this month. Layer 5 is new (A_91) and has run once.

---

## 2. LAYER 1 — THE CHARACTER (Agent 2b)

Each profile carries three fields.

**`humourStyle`** — one of nine, and the enum is closed:

| style | what it means |
|---|---|
| `understatement` | Increases seriousness by pretending not to. Deadpan delivery of extraordinary facts. |
| `dry_wit` | Sharp observations about human behaviour. Concise, often one-liners. |
| `polite_savagery` | Maintains perfect civility while delivering devastating verbal incisions. |
| `self_deprecating` | Turns wit inward. Disarming, often hides intelligence or pain. |
| `observational` | Notices absurdity in situations and people. Comments wryly on what others miss. |
| `deadpan` | Delivers the remarkable as though it were mundane. Flat affect, maximum impact. |
| `sardonic` | Darker edge. Mocking tone that reveals cynicism or world-weariness. |
| `blunt` | Says what others are thinking. Lacks social filter. Comic through honesty. |
| `none` | Not humorous. Earnest, tense, or grief-stricken. |

These definitions live in `HUMOUR_STYLES` in `agent9-prose/prompt-blocks.ts`. Until 2026-09-13 they
were a local constant inside one function; they are exported now so the per-character block and the
wit beat quote the same words.

**`humourLevel`** — 0.0 to 1.0. The prompt gives the model a scale (0.1–0.3 rarely witty, 0.4–0.6
occasional, 0.7–0.8 frequently, 0.9–1.0 pervasive, max one character) and asks it to assign styles
that fit personality while surprising occasionally — *"a colonel with self_deprecating humour or a
maid with polite_savagery creates depth"*. It also insists **not every character should be funny**,
because the contrast is what makes the witty ones land.

**`signatureTic`** — one short quotable line that is that character's alone.

### What this layer is measured to do

It works. Across the last three books **16 of 17 characters** carry a style and a level above zero,
and the levels vary sensibly (0.1 to 0.7 in one cast).

**The tic, however, was drawn from almost nothing.** Measured over the **377 tics** in the archive:

| opening | count | share |
|---|---|---|
| "One must…" / "One mustn't…" / "One might…" | **85** | **23%** |
| "Let us…" / "Let's not…" | 42 | 11% |
| "Well, isn't…" | 16 | 4% |
| "Darling, …" | 16 | 4% |
| **distinct tics** | **298 of 377** | 79 are literal duplicates ACROSS books |

A third of every cast's individuating catchphrase came from two constructions. `AGENT2B_TIC_TEMPLATE_BAN`
now names those forms, forbids the tag-question ending, and offers grammar the corpus does not hold
(a repeated word used oddly, a profession's jargon in ordinary life, answering with a number, a
refusal, a mis-remembered proverb). **First cast under the ban: 0 of 7 banned openings**, and the tics
came back as *"Business first."*, *"Numbers don't lie."*, *"The stage is never silent."*

---

## 3. LAYER 2 — PERMISSION BY SCENE POSITION (Agent 6.5)

The world document carries a `humourPlacementMap`: **all twelve** scene positions, each with a
permission, optionally a condition, and the characters permitted to be funny there.

```
opening_scene · first_investigation · body_discovery · first_interview · domestic_scene
mid_investigation · second_interview · tension_scene · pre_climax · discriminating_test
revelation · resolution
```

`body_discovery` is `forbidden` by contract. The world-doc prompt also requires the map to agree with
the profiles: *"A character with humourStyle: 'none' must not produce wit."*

### A structural gap worth knowing

Agent 9 looks the map up by translating the chapter's **arc position** into a scene position through
`ARC_POS_TO_SCENE_TYPE`. That table has **eight** entries for **twelve** positions, so four are
generated by Agent 6.5 and can never be looked up:

> `body_discovery` · `first_interview` · `domestic_scene` · `revelation`

Three of those four are places humour most needs governing. This is **not** a defect that shows on the
page — `body_discovery` is forbidden anyway and the guide separately forbids humour at a corpse — but
a third of the map is generated, validated, and unreachable. Not yet fixed; recorded here.

---

## 4. LAYER 3 — THE GUIDE (Agent 9, run-stable)

`notes/DEFINITIVE_GUIDE_TO_HUMOUR.md` (6,930 bytes) is read at Agent 9 and distilled into a prompt
block of roughly 650 tokens, with the full guide appended after it. It carries:

- **the principle** — humour is STRUCTURAL, not decorative; every humorous moment must hide
  information, reveal character, control pacing, provide tonal contrast, or expose social truth;
- **five approved styles** with worked examples, e.g. *"The evening deteriorated somewhat after the
  stabbing"* for understatement;
- **puzzle camouflage** — readers lower their analytical guard when amused, so hide habits in jokes
  and plant timeline clues in sarcasm;
- **the detective's voice** — rarely laughs, occasionally observes, almost never banters, and delivers
  one devastatingly mild remark per major scene;
- **rhythm** — tension → dry remark → silence → investigation resumes; never stack jokes;
- **forbidden zones** — the corpse's discovery, physical description of the dead, genuine grief, and
  the core logical explanation;
- **the guiding principle** — *"Do not try to be funny. Try to be exact."*

### Two things this layer has taught us

**It was the first block deleted whenever the prompt was over budget.** `humour_guide` was the ONLY
block carrying `priority: 'optional'`, and the budgeter's drop order is literally
`["optional", "medium", "high"]`. Measured: present in 10 of 10 chapters on one run and **0 of 10 on
each of the two resumes that followed**. The root cause was not the priority — the worker's own env
parser did not strip inline comments, so `AGENT9_PROMPT_TOKEN_CEILING=56000  # …` read as NaN and the
ceiling fell back to 24,000 on the resume path. Both are fixed; the priority is now `high`.

**Its ask is a RATE, and rates do not work here.** *"For every 3 pages of investigation, insert 1
understated observation."* This model complies with countable OPERATIONS and ignores statistics —
VoiceSpec asked for 22.0-word sentences and got 15.86, in 0 of 10 chapters. That finding is what
produced layer 5.

---

## 5. LAYER 4 — THE PER-CHARACTER BLOCK (Agent 9, per chapter)

`buildCharacterPersonalityBlock` prints, for each character in the chapter:

```
  Humour: dry wit (level 0.5 - occasionally witty). Sharp observations about human
  behaviour. Concise, often one-liners.
```

and for a character with `none`, the contrast line: *"this character plays it straight. Their
seriousness provides contrast for wittier characters."*

`buildCharacterContractsBlock` handles the **tic**, and it is deliberately rationed. An earlier
analysis measured one tic reaching **25 prompts and appearing in 4 chapters of one book**, so the tic
is now offered in exactly ONE chapter — `characterIndex % totalChapters` — and omitted from every
other chapter's prompt entirely. A phrase the model is never given cannot be overused.

Voice fragments in the `humorous` register are re-ranked by the placement map: elevated where humour
is permitted at that scene position, suppressed where it is forbidden.

---

## 6. LAYER 5 — THE WIT BEAT (Agent 9, per chapter, A_91)

The newest layer, and the answer to the rate problem. Each chapter's obligation block names **one**
character and asks for **one** remark:

> ⚠ ONE WIT BEAT, and it belongs to **Percival Thorne**: exactly one remark in this chapter, in their
> register — dry wit, which is: Sharp observations about human behaviour. Concise, often one-liners.
> It must arise from what is in front of them — an object, a delay, another character's answer —
> never from a reflection on truth, appearances or human nature. One remark, not a run of them, and
> no other character is funny in this chapter.
>
> If the scene is a discovery of a body, a moment of genuine grief, or the explanation of the
> mechanism, SKIP the beat entirely rather than force it. A missing beat costs nothing; a joke in
> those three places costs the chapter.

Only characters with a style other than `none` and a level above zero are eligible. Assignment rotates
on character index and chapter number, so it is deterministic — a retried batch or a resumed run draws
the same character for the same chapter.

### What one run showed

The beat reached **10 of 10** chapters, naming a different character each time, and the model did
write remarks near the named character. Two examples from the same book:

- *"You're searching for ghosts in stone, Miss Loxley,"* — this is the thing working.
- *"Appearances have always been the theatre's currency,"* — an aphorism about appearances, which the
  beat explicitly forbids.

**One hypothesis tested and REFUTED:** that naming "truth / appearances / human nature" in the
prohibition seeded them. Measured across five books, "appearances" is mid-range in this one (6.9 per
10k against 0.0, 2.1, 3.4, 16.3) and "truth" is the **lowest** of the five. The prompt did not cause it.

---

## 7. WHAT IS NOT KNOWN

**There is now an instrument, built 2026-09-14: `packages/prose-guard/src/wit-density.ts`.** It does
not detect whether a line is funny. It counts four SHAPES wit takes in this genre — the short retort,
the flat answer, understatement by its mechanism, and polite savagery — each a structural fact about
the text rather than a judgement about it.

It earns the name because it SEPARATES. Measured over the 11 canon novels above a 6,000-word floor
against 20 of our shipped manuscripts:

| shape | canon median | ours median | ratio |
|---|---|---|---|
| short retort | 30.6 | 8.8 | 3.5× |
| flat answer | 13.3 | 1.5 | **8.9×** |
| understatement | 1.2 | 0.0 | — |
| polite savagery | 0.2 | 0.0 | — |
| **all four** | **41.4** | **11.4** | **3.6×** |

Canon ranges 20.6 to 69.1 and ours 1.1 to 44.6, and **18 of our 20 books fall below the
lowest-scoring real novel.** The two strongest discriminators are the two that cost nothing to write:
a character answering briefly, and a character answering a question without expanding. **Our books
explain; the canon lets people be short with each other.**

It runs in the Agent 9 SHIP-CHECK beside repetition and machine register, as telemetry and never a
gate — it would fire on 18 of 20, which is B1 territory. Re-run
`node scripts/wit-calibration.mjs` after any change to the detectors; the vocabulary and the
constants must move together.

**What it still cannot tell you** is whether a book is funny. A book can score well and be flat. But
a book cannot be funny in the Golden Age manner while scoring near zero, because these are the moves
that manner is made of — so a low score is evidence and a high score is only permission. **The
question of whether the humour LANDS is still a person reading the book.**

**Also unknown:**

- whether the guide (layer 3) changes anything at all. It reaches every chapter and has never been
  A/B'd. If a read still names no wit with the guide present, it is a dead lever carrying 22 KB.
- whether the per-chapter beat (layer 5) is better than the guide's rate, for the same reason.
- what the four unreachable scene positions in the placement map would do if reachable.

---

## 8. THE FLAGS

| flag | state | layer |
|---|---|---|
| `AGENT2B_TIC_TEMPLATE_BAN` | ON | 1 — bans the exhausted tic openings |
| `AGENT9_WIT_BEAT` | ON | 5 — one named remark per chapter |
| `AGENT9_SKIP_ATMOSPHERE_REPAIR` | **OFF (reversed)** | not humour, but it deletes repeated phrases and its absence cost one book 29.8× the median repetition |
| `AGENT9_PROMPT_BUDGET_CRAFT_FLOOR` | ON | protects craft blocks from the budgeter; `humour_guide` is deliberately NOT in the protected set |

`humour_guide`'s priority (`high`, formerly `optional`) is code, not a flag.

---

## 9. THE ONE-PARAGRAPH ANSWER

A character is given a humour style, a level and a private catchphrase at Agent 2b. The world document
then says, position by position through the story, who may be funny and where humour is forbidden. At
prose time the model receives a guide explaining what Golden Age wit is and how it is shaped, a line
per character restating that character's own style, the catchphrase in exactly one chapter of the
book, and — for one named character per chapter — an instruction to make exactly one remark in their
register, arising from something physically present, with permission to skip it entirely at a corpse,
at grief, or during the explanation. Every one of those layers is measured to reach the page. Whether
what arrives is actually funny is the one thing this pipeline cannot tell you.
