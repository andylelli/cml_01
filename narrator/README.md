# Narrator

Turns a story into a narrated audiobook. Local UI, Azure AI Speech for the two things that
genuinely need it: creating a cloned voice, and synthesizing audio.

Standalone — it sits outside the `apps/*` workspace glob, so it has no effect on `build:all`,
`flags:check`, or the CML test suite. Its own `node_modules`, its own `data/`.

```bash
cd narrator
npm install
cp .env.example .env      # paste your Azure Speech key and region
npm start                 # http://localhost:5174
```

## What it does

**1 · Voice** — upload a sample, get a cloned voice. Azure Personal Voice needs *two* recordings:
the sample to learn from, and a separate recording of a consent sentence naming the speaker. The
UI shows the exact sentence, converts both files locally to the format Azure wants, and polls
until the clone is ready. Every prebuilt neural voice in your region appears in the same picker.

**2 · Narrate** — pick a book from `../stories` (**only those an external reader scored 80+**),
upload, or paste. *Analyse* shows words,
chapters, Azure request count, estimated runtime and estimated cost **before** any spend.
*Audition* renders one short passage in the chosen voice for a few pence, so the voice is chosen
by ear rather than by name.

**3 · Library** — live progress, inline player, MP3 and M4B downloads.

## Why it sounds better than pasting text into a TTS box

- **Per-character voices.** Dialogue attribution is parsed out of the prose — "…," said Katherine,
  Katherine said, "…", and *Ferdinand Carrick's clipped voice cut through the hush* — and each
  speaker can be given its own voice. On a real 9,163-word book this found 5 characters and
  attributed 130 of 132 spoken lines.
- **Italics become stress.** `*saw*` renders as `<emphasis>`, not deleted. In fair-play detection
  the stressed word is frequently the clue.
- **Pronunciation lexicon.** `Fairweather = Fair-wether`, one per line, applied as SSML `<sub>`.
- **Narration pauses.** A beat between paragraphs, a longer one at a scene break, a full stop
  after a chapter title, a second of silence between chapters.
- **Front matter is skipped.** Generated books open with `*Run ID: … Generated …*`, which would
  otherwise be the first line of the audiobook.

## The score indicator

Every story is listed and any of them can be narrated. The external read score is shown, not
enforced — the picker groups them so the standing is obvious at a glance:

```
★ Scored 80+        7
Below 80            7
No external read    5
```

Each option is prefixed with its mark, and a badge beside the dropdown reads
`scored 85 · 80+` (green), `scored 79 · below 80` (red) or `no external read` (grey).

The score is parsed from the `chatgpt-review.txt` beside the manuscript **using the pipeline's own
parser** (`scripts/external-read-ledger.mjs`), not a second copy — that parser knows to take the
stated mark rather than the read's forecast ("could reach 89–91/100"), and to ignore a
chapter-by-chapter review's per-chapter `Mark: 6/10` rows. A naive `/100` match records the
aspiration as the score.

`MIN_STORY_SCORE` (default 80) moves the line the indicator draws. If the parser cannot be loaded,
every story is still listed — unscored, with the reason shown. Uploaded and pasted text carries no
score; it isn't a repo story and has no read to check.

Current marks: 85, 84, 84, 83, 82, 82, 82 · 79, 79, 79, 78, 78, 77, 76 · 5 unread.

## How it survives a long render

A 10k-word story is ~35 Azure requests (one request caps at 10 minutes of audio). Chunks are
split on paragraph and sentence boundaries, never mid-sentence, and **cached on disk by a hash of
their SSML**. A render that dies at chunk 30 resumes and pays for 5. Re-rendering the same text
with the same voice and settings costs nothing.

ffmpeg ships with the app (`ffmpeg-static`) — nothing to install. Chapters are stream-copied
(lossless, instant) and the M4B carries real chapter markers.

## Configuration

All optional except the key and region — see `.env.example`. Env is read at call time, so an edit
takes effect on the next request rather than needing a restart.

`MAX_CHUNK_CHARS` (2400), `SYNTH_CONCURRENCY` (3), `AZURE_PERSONAL_VOICE_BASE_MODEL`
(DragonLatestNeural), and the per-million rates used for the cost estimate.

---

## STATUS

| Area | State |
|---|---|
| Text pipeline — chapters, chunking, front matter, markdown, XML escaping | **Verified** on a real 9,163-word book |
| Dialogue attribution and cast detection | **Verified** — 5 speakers, 130/132 lines attributed |
| SSML assembly — multi-voice, emphasis, lexicon | **Verified** — 261 voice tags over 35 chunks, 0 XML errors |
| Audio assembly — concat, silence, MP3, M4B chapter markers | **Verified** with synthetic chunks |
| Job runner — cache, resume, progress, cost accounting | **Verified** end-to-end offline (cache pre-seeded) |
| UI — all three tabs | **Verified** in browser, no console errors |
| Azure voice list | **Verified live** — 785 voices in swedencentral, 21 en-GB |
| Azure synthesis | **Verified live** — 4-voice audition, then a full chapter |
| Multi-voice against live Azure | **Verified live** — 6 voices in one document, incl. HD + standard mixed |
| Personal Voice (cloning) | **Partly verified** — control-plane reachable; creation untested |

### Measured against the live service

Key: the Speech-capable key already in the repo root `.env.local`, region **swedencentral**.
That resource serves Speech as well as OpenAI — the `*.openai.azure.com` hostname does not mean
Speech is unavailable.

- **DragonHD voices ARE available here**: `en-GB-Ada:DragonHDLatestNeural`,
  `en-GB-Ollie:DragonHDLatestNeural`. They accepted `<prosody rate>` without error.
- **One chapter**: 6,105 chars, 4 requests, **18 seconds wall-clock**, **6m 24s of audio**,
  **$0.09 / £0.07**. Six voices in one SSML document, HD and standard neural mixed.
- Extrapolated whole book: ~57k chars, ~£0.68, a few minutes.

### Still unproven

**Creating a cloned voice.** `GET` on `/customvoice/personalvoices`, `/projects` and `/consents`
all return **200**, so the control plane is reachable and limited access does not appear to be
blocking reads. But creation needs a real consent recording and voice sample, which only you can
supply — and Microsoft's gate can apply at creation rather than at read. Expect that to be the
one step that may still fail.
