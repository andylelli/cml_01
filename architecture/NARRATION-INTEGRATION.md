# Narration in the workshop — manuscripts to speech

Turns a generated manuscript into narrated audio from inside the website: render, play, download.

Azure AI Speech does the synthesis. Everything else — chunking, dialogue attribution, SSML, caching,
audio assembly — runs locally.

## Why a package, not a second app

The standalone `narrator/` app proved the pipeline (live: 1h11m book for £0.78). Putting the same
capability in the workshop must not fork that logic — two copies of the SSML builder or the cast
detector would diverge, and here the copy feeds a WRITE (what audio gets produced and billed), which
is the harmful case in WF-002.

So the core moves to `packages/narrator` as plain ESM with hand-written types, and BOTH hosts import
it. The package takes credentials explicitly rather than reading a global config, so `apps/api` and
the standalone app each own their own env loading (ADR-0004: env at call time, never a module const).

`packages/narrator` has no build step and is deliberately NOT in the `build:all` ORDER list — it is
already JavaScript, so there is no dist to go stale.

## Prose payload → speakable text

The store holds `prose_<length>` artifacts shaped
`{ title, chapters: [{ title, summary, paragraphs[] }] }`.

`summary` is a synopsis, not prose, and must never be narrated — it is the same class of defect as
the run-id front matter that would otherwise have opened every audiobook.

---

## STATUS

| # | Item | State | Commit |
|---|------|-------|--------|
| 1 | `packages/narrator` — core extracted, credentials explicit, `.d.ts` | DONE | bbf5b67 |
| 2 | Standalone `narrator/` app re-pointed at the package, still working | DONE — live render after refactor | bbf5b67 |
| 3 | `proseToMarkdown` — artifact → narratable markdown, summaries excluded | DONE — 13 tests | bbf5b67 |
| 4 | API narration routes + job runner + storage | DONE | (this) |
| 5 | API audio streaming with HTTP Range (seeking in the player) | DONE — 200/206/416 verified | (this) |
| 6 | Web `api.ts` narration service functions | | |
| 7 | Web `AudioPlayer.vue` — play/pause, scrub, speed, chapter jump | | |
| 8 | Web `NarrationPanel.vue` — voice, cast, render, progress | | |
| 9 | Wired into the case view; download audio alongside download PDF | | |
| 10 | Tests | | |

Next item: 6 (web service functions).

**Temporary:** a staged fixture sits at `data/narration/projects/proj_a2bec449-.../` (audio copied from a
standalone render) so the player can be built against real bytes without paying for a render. DELETE
before finishing.
