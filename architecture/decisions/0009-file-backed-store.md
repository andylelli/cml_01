# 0009 — A file-backed artifact store, not a database

**Status:** Accepted · **Decided:** original design

## Context

Every stage produces an artifact that must persist: setting, cast, CML, clues, profiles, outline,
prose. Something has to store them. The default professional instinct is a database.

The actual usage pattern is: one user, one run at a time, a few hundred artifacts total, written once
and read back mostly by *forensics* — a human or an agent asking "what did run X actually produce at
stage Y?" months later.

## Decision

**Persist artifacts as JSON in a file-backed store (`data/store.json`), plus per-run prompt/response
documents on disk. No database.**

## Consequences

- **Forensics are trivial.** Any artifact can be read with a text editor, grepped, diffed between runs,
  or handed to an agent. Most of the 71 boards depended on exactly this.
- **No schema migrations.** Artifact shapes have changed repeatedly across generations of the pipeline.
  The store tolerates all of them — which is why the reader normalises `project_id`/`projectId`,
  `artifact_type`/`type`, and `payload`/`payload_json`. That tolerance is deliberate: a reader that
  understood only today's spelling would silently find nothing rather than fail.
- **It is the checkpoint substrate for free.** R5's durable resume needed no new persistence layer —
  the artifacts were already on disk under stable names. The only missing piece was a read path.
- **It does not scale, and does not need to.** Single-user, single-run-at-a-time. REVIEW §4 lists "no
  queue / no microservices" under do-not-change for the same reason: a queue would add failure modes
  and buy nothing.
- **Concurrent writes are unsafe.** One file, last-write-wins. This is why R9's parallel profile trio
  must suppress `savePartialReport` inside the parallel block and take one snapshot after — three
  concurrent writers would race on the same file.
- **The file is now 14 MB.** Read cost is real but bounded. It also means the golden eval set must
  freeze its own bundles rather than depend on the live store (R6).

## What would change our mind

- Multi-user or concurrent runs. The moment two runs can be in flight, last-write-wins is a data-loss
  bug rather than an acceptable simplification.
- Store size making a full read impractical — the natural first step would be one file per run, not a
  database.
