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
| 4 | API narration routes + job runner + storage | DONE | f535533 |
| 5 | API audio streaming with HTTP Range (seeking in the player) | DONE — 200/206/416 verified | f535533 |
| 6 | Web `api.ts` narration service functions | DONE | (this) |
| 7 | Web `AudioPlayer.vue` — play/pause, scrub, speed, chapter jump | DONE — plays and seeks in-browser | (this) |
| 8 | Web `NarrationPanel.vue` — voice, cast, render, progress | DONE | (this) |
| 9 | Wired into the case view; audio on the cases list | DONE | (this) |
| 10 | Tests | DONE — 15 package, 10 player, 394 web, 36 api | (this) |

All items resolved. One WITHDRAWN — see below.

The staged fixture used to build the player has been removed.

---

## Withdrawn: inferring a character's voice from the prose

Multi-voice needs a voice per character, and assigning them round-robin produced Harold read by a
voice called Natasha and Eleanor by one called William. The pipeline records no gender anywhere
(MEASURED against the cast and character-profile artifacts, both of which carry none), so the only
candidate signal was the pronouns in the prose.

Two windows were tried and both MEASURED wrong on a real manuscript:

| Window | Harold Simmons | Dorothy | Edward |
|---|---|---|---|
| all narration in the speaker's paragraphs | undecided (63 M / 81 F) | undecided | **female** (0/5) |
| first pronoun of the attribution clause | undecided (17 M / 20 F) | **male** (2/1) | undecided (1/0) |

In a drawing-room scene the narration names everyone, so a wide window measures the room; a tight
one decides nothing. Three of five wrong or undecided, either way.

WITHDRAWN rather than shipped. Characters now default to the narrator's voice and the panel asks
for a choice. A wrong voice is audible for an hour; an unassigned one is a dropdown.
