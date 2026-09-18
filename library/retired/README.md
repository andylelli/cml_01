# Retired corpus entries

Nothing is deleted here. A_77 §15.4 asked for two entries to be "retired or relabelled" and
CLAUDE.md's repo convention is that a tracked item moves to recommended-against with its reason
rather than disappearing. This is where they moved, with the reason.

Retired by the A_98 consolidation, 2026-09-18.

| entry | why it is not a corpus work |
|---|---|
| `the_second_key` | **Synthetic.** Not a novel, not an encoding of one — an invented case written as a fixture. A_77 §4.2 found it was the sole attestation of the `locked_room_key` mechanism family, so a placeholder was standing in for worked precedent in the one place the corpus exists to provide it. `scripts/corpus-sync-fingerprints.mjs` already reports it as `retired:`; this is where the file went. |
| `the_leak` | **A stub, and not separately obtainable.** A Futrelle short story; A_77 §15.4 could not verify an ebook id for it and recommended locating it inside a collection or retiring the stub. The encoding on disk is a fragment with no source text behind it and no way to verify one. |

Neither is loaded by anything. They are kept because a deleted file cannot be re-examined, and
because the reason they were wrong is the useful part.

If `the_leak` is ever located inside a Futrelle collection on Project Gutenberg, the route back in is
`scripts/corpus-acquire.mjs --id <n>` followed by a real encode — not by restoring this file.
