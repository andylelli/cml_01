# 03 — DEPTH AND LENGTH: WP-001 APPLIED TO v2

**The ask:** longer v2 chapters, the length coming from depth — WP-001's unforced choices — not from
padding. WP-001's test for the material is the one to hold every addition to: **would it be missed if
it were removed?** (WP-001 §3). An addition that fails it is padding, and padding is what a template
ratchet is made of (§4.3).

---

## §1 What v2 already carries

v2 was built after WP-001 and already asks for four of its operations. Measured on the arm-B book
(seed 23403, `stories/story_20260924-1935`), with `scripts/analysis/page-operations.py`:

| operation | where | v2 asks | on the page | label |
|---|---|---|---|---|
| **O1** dated origin | Agent 2b, `AGENT2B_FORMATIVE_INCIDENT=true`; v2 gives one character's trait per chapter (`contract.ts:431`, `selectDepthBeat`) | one depth beat a chapter | not yet counted | built |
| **O3** grammar tics | Agent 2b, `AGENT2B_TIC_TEMPLATE_BAN=true` | — | not yet counted | built |
| **O4** long sentences | `brief.ts:177` | ≥4 over 30 words, each chapter | 38 in the book; **5 of 10 chapters** reach 4 | MEASURED |
| **O4** em-dashes | `brief.ts:178` | ≥3 each chapter | **0 on the saved page, both engines** | MEASURED — see §4 |
| **§5.3** speech openings | `brief.ts:167` | 6 paragraphs a chapter | 45 in the book; by chapter **16 12 5 4 2 3 1 1 1 0** | MEASURED |

**The speech-opening count decays across the book exactly as the word count does.** Chapters 1–2 meet
the ask twice over; chapters 7–10 open three paragraphs on speech between them. **MEASURED, one
book.** The ask reaches the model; the model spends it early. This is the second measurement pointing
at the one-call book (`02` P1.1), and it means **segmenting is the first depth lever as well as the
first length lever**: every per-chapter operation in the brief is being honoured for three chapters
and then dropped.

## §2 What v2 does not carry — the depth still to build

| op | what | the countable form | the slot it fills | label |
|---|---|---|---|---|
| **O2** | **One dramatised wound.** One first-half chapter places culprit and victim on the page together and *shows* the grievance — staged, not recalled. | one scene, in a named chapter ≤ half, both names present, the grievance acted out in dialogue | culprit's `motive` + the victim's act that caused it | **built 2026-09-25** — `wound` on the scene contract; the accused of the false solution gets the same scene so the staging names nobody |
| **O5** | **One thing that isn't doing a job.** Each chapter carries one element serving no plot, clue or continuity function — registered `high`. | one per chapter, drawn from the setting and period (a habit, an errand, a piece of news, a meal) and named in that chapter's brief line | Agent 1 setting + Agent 2e background | **already in v2's brief** ("One paragraph in each chapter is there for its own sake"); v2 has no budgeter to shed it; uncounted |
| **§5.4** | **Where the pages go.** Canon travels, corresponds and holds inquests; ours sits in one room and ends in a confession. | one chapter in the middle third set somewhere that is not the house — the inquest, the village, a journey, a letter read aloud — chosen from a list the case supports | outline (Agent 7) | **deferred** — MEASURED cause: Agent 7's Setting Lock ("All scenes must remain within this setting", `agent7-narrative.ts:346`); a deliberate rule whose rationale is not yet read, and no reader has asked |
| **O6** | **Verbalized sampling at unforced choices.** Emit *k* candidates with probabilities and select. | first at the tic field — the cheapest place, £0 to measure against the existing tic census | Agent 2b | not built |
| **§6.2** | **An instrument that points up.** | register conformance per story, or PMI / token entropy on the manuscript | measurement only | not built |

**Where the length comes from — a correction to the framing.** The ask was to raise chapter length
*by* introducing depth. The measurement says most of the missing length is not missing depth: it is
the one-call taper (§1), and segmenting recovers it with no new material. Depth adds about a scene
and a paragraph a chapter. Both are worth building — the readers asked for O2 five times — but depth
is built for its own sake, and length is mostly P1.1.

**Why these lengthen the book honestly:** each is a scene or a paragraph that has a reason to exist
and was not in the brief before. **INFERRED** word yield, stated as a prediction, not a target (a
target is a statistic, and this model ignores those):

| source | where | INFERRED words |
|---|---|---|
| segmenting (P1.1) restores the chapter ask in chapters 4–10 | every late chapter | +2,000 to +3,000 |
| O2, one staged scene | one first-half chapter | +400 to +700 |
| O5, one element a chapter | every chapter | +600 to +1,000 |
| §5.4, one chapter off the premises | one middle chapter | redistributes; little net |
| **book** | | **8,044 → about 11,000–12,500**, which is v1's length |

## §3 What the readers asked for that is depth

Every one of these is an unforced choice, which is WP-001's definition of personality:

- **86 read** (seed 18179): the motive needs one personal scene earlier — this is O2 by name.
- **85 read** (v1, seed 23403): *"Katherine is remembered through the small detail of fresh flowers in
  the lounge every Monday"* — praised; that is an O5 element in the aftermath, and the reader noticed
  it.
- **84 read** (v2, same case): *"how she sliced bread precisely"* — praised, O5 again; and the
  confession needs *"one more line naming the emotional collapse"* — O1's consequence-still-running,
  spoken.
- WP-001 §2.5 quotes three earlier reads asking for the same thing: *"give one concrete wound."*

**Four readers, five books, one request: the grievance on the page.** O2 is the highest-yield depth
item because it is the only one the readers have asked for by name. **INFERRED** from the reads;
**MEASURED** that no v2 or v1 contract asks for it.

## §4 The em-dash question — RESOLVED: the save path deleted them

**MEASURED 2026-09-25.** Pair 1's drafts carry 15–45 em-dashes each, its final checkpoint chapters
81, its saved manuscript **0**. `save-readable-story.ts` and `story-output.ts` folded `–` and `—` to a
bare `-` (`.replace(/[–—]/g, "-")`, since 2026-07-04, commit e25ab708), so *"paused — then"* reached
the reader as *"paused-then"*. **All 72 read manuscripts since July went out this way**, both
engine-pair books included. The fold is removed. The em-dash operation was working; its output was
deleted at the last step — WP-001 §4.2's shape, one layer down. Corollary: the selector's em-dash
instrument (ρ +0.222) was calibrated on folded text, and the calibration's *"read 0.000 on all 49
books"* was this fold.

The paragraph below is the state before the trace, kept as the record of a probe claim:

Both books carry **zero** em-dashes on the saved page. `brief.ts:167` records drafts on 2026-09-19
arriving at **6–8** a chapter when asked for three. So either this run's drafts ignored the ask, or
something between the draft and the saved manuscript removes them. The selector already notes that
the saved manuscript is ASCII-normalised and that counting the character alone *"read 0.000 on all 49
books"*. The counter is not the cause: it finds 3 of 3 on a known positive (`—`, `--`, spaced hyphen), and the
book's only `--` runs are the chapter separators. **Open:** count em-dashes in the v2 checkpoint chapters for arm B before building anything —
the answer decides whether this is a prompt item or a normalisation bug. Probe item, not a finding.

## §5 What not to do — WP-001 §7, applied here

| not | because, in this plan |
|---|---|
| raise the word target | a statistic; asked "about 1,000 words", v2 drafts delivered 648, 678 and 722 (`brief.ts` comment) |
| add a length gate that retries short chapters | a gate driving retries costs +2.43 register points on the retried chapter |
| paste example depth lines into the brief | phrases shown are copied (A_67, A_102 §14); give the slot and the source field, never a specimen |
| let O2's scene become the motive's exposition | WP-001: *"a formative incident that turns out to be a motive is not a formative incident."* O2 stages the grievance the case already has; O1 stays apart from it |
| let O5's element carry a clue | then it is doing a job, and the budget will shed it (WP-001 §4.2) |
