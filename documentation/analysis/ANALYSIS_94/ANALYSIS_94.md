# ANALYSIS_94 — THE 80/100 READ OF RUN 31372, BY CAUSE

**Opened 2026-09-15.** Cost: £0. Sources: the read (`stories/story_20260913-1806/chatgpt-review.txt`),
the two manuscripts, the stored outline and device (`data/store.json`), the chapter-10 prompt
(`logs/llm-prompts-full.jsonl`), and 50 stored outlines.

| | brewery, seed 10845 | theatre, seed 31372 |
|---|---|---|
| axis · era · location · tone · detective | spatial · 1930s · Village · Dark · private | spatial · 1930s · Theatre · Cozy · police |
| words | 11,701 | 10,197 |
| read | not on disk (the reviewer's own baseline) | **80/100** |

The reviewer's category marks: premise 8, hook 8, plot 7, character 8, dialogue 7, atmosphere 8,
**clues 6**, pacing 7, **ending 6**, **prose 6**, character-life 7.

---

## §1 WHAT DID NOT REGRESS — MEASURED

**Machine-register rate: 0.090 vs 0.081.** Flat. It is the only validated predictor of the external
score (−0.697 over 36 reads), and it did not move. The prose engine did not get worse; two specific
things happened.

---

## §2 CAUSE 1 — the atmosphere pass was off, and every "generated" phrase is a repeat

| | brewery | theatre |
|---|---|---|
| repetition per 10k | 23.6 | **516 — 22×** (29.8× the corpus median) |
| "Relief flickered" | 0 | **8** |
| "the chain of evidence drew taut" | 0 | 4 |
| "the questions multiplied" | 0 | 4 |
| "chain of elimination" | 0 | 4 |
| "stray lock of hair" | 0 | **9** — once in nine of ten chapters |
| wit per 10k | 20.5 | 8.8 |

Of the six phrases the reader called "template/scaffold language", **five are not templates**: they
are the model's own sentences copied chapter to chapter out of STORY TO DATE (which carries every
prior chapter verbatim; A_90 §12 #7 — 16 of 24 copies from the immediately preceding chapter). The
sixth, *"The usher's testimony shifted the reasoning"*, is ours —
`injection-templates.ts:168` with the subject swapped.

`AtmosphereRepair` is the only pass that scrubs cross-chapter copies. A_90 §12 #6 turned it off on the
morning of the 13th (it had authored 5 of the last 20 reader-flagged lines). This run finished ~18:06;
A_91 §12.3 measured it at 29.8× and reversed the skip at 18:08 (`4d80dc21`) — **before the read came
in.** The reader read a book the pipeline had already flagged: the SHIP-CHECK said WORTH A LOOK.

That is prose 6 and "Ch. 3–8 circle the same mirror/panel information."

---

## §3 CAUSE 2 — Agent 7 collapsed the clearances into the reveal scene

The theatre outline's final scene, verbatim:

> **Clearances and Culprit Revealed** — *Confirm alibis of all suspects except the culprit; confront
> Adela Sallow with evidence and reveal her guilt.*

Placed **after** scene 9, the discriminating test. Agent 7's own prompt forbids exactly this
(`agent7-narrative.ts:707`: "Clearing the innocent belongs BEFORE the reveal, not after it… the single
most common structural complaint this pipeline receives"). The brewery outline obeyed it: scene 9
*Clearing the Innocent*, scene 10 *The Culprit Exposed*.

Then A_89 B3 does its job — the reveal moves to Ch.9, Ch.10 becomes aftermath — but the scene's
purpose comes along. **MEASURED in the prompt log: the one chapter-10 prompt carried both the
AFTERMATH CONTRACT and "confirms the alibis of Prudence Danvers, Barnaby Blackwood, Marguerite
Greaves, and Henrietta Tremayne."** The model obeyed both: *"starts well, then reverts to proof mode."*
Scene 7 had already done the alibis, so the reader got them twice.

**Across the 50 stored outlines: 48 end on the reveal scene, 15 pack the clearances into it, 2 have
an aftermath scene at all.** The rule is prompt-only; nothing checks it. A 30% coin-flip the brewery
won. Ending 6/10.

---

## §4 CAUSE 3 — the mechanism: case coherent, prose lectured

The CML device (`artifacts[909].devices[0].underlyingReality`): *"a shallow recess behind the mirror
lets the culprit step out of sight and re-enter the visible street beyond the mirror's edge unseen."*
Exact. The outline's scene 9: *"Rosalind stages a demonstration from the theatre's stage exit."*
Ordered.

Ch.9 states the use once, as a clause inside the evidence list — *"to lure him to the alley, to hide
in the recess, and to escape unseen"* — and reports the demonstration rather than performing it. The
reader's "did the mirror hide Adela / shift the body / distort the time?" is the shape of a reader who
was told rather than shown. Same shape as A_90 §12 #1. Clues 6/10.

---

## §5 THE FIXES — five, flag-gated, each pinned on the run's own material

| # | flag | what it does | pinned on |
|---|---|---|---|
| R1 | `AGENT7_STRIP_CLEARANCES_FROM_REVEAL` | drops the clearance clause/sentence from the final scene's purpose, summary and title; the reveal half survives; a scene that is only clearances is left alone | 31372's scene 10 text — purpose becomes "Confront Adela Sallow with evidence and reveal her guilt" |
| R2 | `AGENT9_AFTERMATH_SCENE_PURPOSE` | on a `resolution` + `aftermath_consequence` chapter the scene's purpose/summary/objective are replaced by the aftermath framing; title, setting, characters, beats untouched | the same scene — the recap sentence is gone, "Do not confirm alibis" is the one place the word survives |
| R3 | `AGENT9_TEST_AS_EVENT` | in the DT window: witness commits in dialogue → test performed on the page → only then explained, in one exchange → no sentence before the demonstration may explain the mechanism | order asserted; no worked example (A_67) |
| R4 | `AGENT9_WIT_SHAPES` | the wit beat also asks for one FLAT ANSWER (≤4 words to a question) and one SHORT RETORT (≤6 after ≥15) per chapter — the two shapes `wit-density.ts` finds 8.9× and 3.5× more in the canon | operations named, no rates in the prompt; inherits the band's gating |
| R5 | `AGENT9_REPEAT_BAN_LIST` | before each chapter, passages already repeated ≥2× across the prior chapters are listed as a ban (block `repeat_ban`, priority high); adjacent windows of one copied sentence merge into one entry; **locked values exempt by word position** | the run's own worst offender ×3 in a three-chapter fixture; a locked value neither listed nor rebuilt around |

And one rule in CLAUDE.md: **never read a book whose SHIP-CHECK says WORTH A LOOK.**

**What was NOT built.** A_91 F4 (a replacing detector) — R5 is the before-the-fact end of the same
lever; F4 waits for a run with the pass on. Trimming STORY TO DATE — A_90 §12 #7 measured that it
would not help. A retry at Agent 7 — a prompt for a clause; the clause is dropped instead.

**A defect found while building R5, recorded because it changed the code:** the first cut exempted
locked values by window *text*. With windows merged into passages, the windows either side of a locked
value could be stitched into "the clock had stopped at ten minutes past" — a ban on most of a mandated
value. Exemption is now by word *position*; the test pins the stitched form as absent.

**The Goodhart caveat on R4, stated once:** prompting the two shapes moves the instrument by
construction. Whether the result is funny is the reader's call. But the canon's wit is made of these
moves, and 8.8 against a floor of 20.6 is not a subtle gap.

---

## §6 WHAT THE NEXT RUN SETTLES

**A matched pair on 31372** — `RESUME_REDO=prose` against its byte-identical upstream (~£0.45). Arm A
is the shipped 80. Arm B carries the atmosphere pass back on, R2, R3, R4, R5 (R1 is upstream and
cannot be carried by a prose redo). Checkable before anyone reads it:

| prediction | arm A | pass | **arm B (run `resume-1789496384522`, £0.81)** | verdict |
|---|---|---|---|---|
| repetition per 10k | 516 | < 50 | **49.0** | **MET** — just |
| wit per 10k | 8.8 | ≥ 20.6 | **21.2** (flat answers 2 → 10; retorts 7 → 7) | **MET** — just |
| "Relief flickered" / "stray lock" / "drew taut" | 8 / 9 / 6 | ≤ 2 | **0 / 0 / 0** | **MET** |
| Ch.10 confirms alibis | yes | no | **no** — 0 "alibi", no "accounted for"; one forensic sentence as colour | **MET** |
| Ch.9 witness commits before the explanation | no | yes | **partial** — the test IS performed (*"she stepped into the recess, disappearing from view as the mirror reflected the side street"*), but the explanation comes three sentences BEFORE it | **NOT MET** |
| register rate | 0.090 | ± 0.02 | **0.134** | **FAILED** — see §6.1 |

Every lever reached its chapters by label in the prompt log: shapes 1–10, ban 3–10, event 9,
aftermath 10. No fallback chapter. Two batches retried (Ch.4: a device description copied verbatim;
Ch.8: repeated paragraph fingerprint). Three Ch.9 regen attempts were refused by Azure's content
filter (HTTP 400 on gpt-4.1-mini) — the chapter kept its first draft.

### §6.1 What the failed prediction means — MEASURED

**The register rate rose because the book shrank, not because it got more mechanical.** Flagged
sentences: **73 → 69.** Words: **10,198 → 8,475** (−17%). Same numerator, smaller denominator.

Where the words went: **dialogue share 17.3% → 11.9%, speeches 165 → 113, speeches of ≥15 words
34 → 17.** The R4 wording — *"let people be short with each other"* — was read as a diet on
conversation, not as two exchanges to add. The prompt got exactly what it asked for, which is the
compliance pattern working against the intent.

**The prompt's own vocabulary was narrated back.** "polite savagery" 0 → 5, "her answer was flat /
flat as ever" 0 → 6, "understatement" 1 → 4 — *"Adela's deadpan remark landed, flat as ever."* A_67's
shape in a new place: the style names given to Agent 9 as instruction come out as description. Arm A
already had "deadpan" ×3 and "dry wit" ×2 from the per-character block, so the channel predates R4;
R4 widened it.

**The clearances moved rather than vanished.** R1 is upstream and the pair could not carry it; with
the scene purpose still saying "confirm alibis", B3 + R2 pushed the walk-through out of Ch.10 — into
Ch.9 beside the reveal (Prudence, Barnaby, Henrietta each cleared in turn before the demonstration).
Better than after the reveal; still the thing Agent 7's rule forbids. R1 is the fix and needs a fresh
run.

**R4b, built on this:** the shapes are "two exchanges to ADD — the chapter keeps every conversation
it would otherwise have, at full length", and a second line bans naming any register or shape in
narration. The Ch.9 ordering (explain-after) held in the prompt and was not obeyed; recorded, not
rebuilt — one pair is one observation.

Then a fresh run at `--humour sharp` for R1, R4b, the formative-incident ban (A_93 D2) and A_92 item 12.

---

## §7 STATUS

| # | item | state | commit |
|---|---|---|---|
| — | diagnosis, three causes | **MEASURED** | this doc |
| R1 | clearances stripped at Agent 7 | **BUILT, ON** | see git log `feat(A_94)` |
| R2 | aftermath purpose replaces the scene's | **BUILT, ON** | same |
| R3 | the test as an event | **BUILT, ON** | same |
| R4 | wit shapes | **BUILT, ON** | same |
| R5 | repeat ban list | **BUILT, ON** | same |
| R6 | the WORTH A LOOK reading rule | **BUILT** | same |
| P1 | matched pair on 31372 | **RUN** — 4 of 6 predictions met, 1 partial, 1 failed for a measured reason (§6.1) | `resume-1789496384522` |
| R4b | shapes as additions; no register named in narration | **BUILT, ON** (under `AGENT9_WIT_SHAPES`) | see git log |
| P2 | fresh run, `--humour sharp` | **NOT RUN** | — |
