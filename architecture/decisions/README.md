# Architecture Decision Records

**Why this folder exists.** [REVIEW.md §8](../REVIEW.md) argues that the documentation gap in this
project is *why*, not *what*. There are 71 analysis boards — excellent forensics — but they are
organised by **incident**, not by **decision**. Nothing recorded "we chose the deterministic injector
floor over LLM regen because X, and here is what would change our mind." So settled questions get
re-litigated, by newcomers and by us in three months.

Each record is one page: **Context** (the forces), **Decision**, **Consequences** (including the ones
we dislike), and **What would change our mind** — the last section being the one that makes an ADR
different from a rationalisation. A decision with no stated reversal condition is a belief, not an
engineering choice.

**Status of this set.** Drafted from the code, the boards, and REVIEW.md by the agent that did the
R-series work. Every one names a decision that has actually been re-litigated at least once. They are
drafts in one specific sense: an agent can reconstruct the context and the consequences, but it
cannot *ratify* a decision. Where a record's reasoning does not match what the owner actually
intended, the record is wrong and should be corrected — that is the point of writing it down.

| ADR | Decision | Re-litigated |
|---|---|---|
| [0001](0001-cml-single-source-of-truth.md) | CML is the single source of truth; prose is a rendering | Every leakage board |
| [0002](0002-sequential-prompt-chaining.md) | Sequential prompt chaining, not an autonomous agent | "13 hardcoded stages" reads as debt |
| [0003](0003-never-abort-release-gate.md) | Never-abort release gate with a deterministic floor | Every "generated validation prose" review |
| [0004](0004-flag-gated-default-off.md) | Flag-gated, default-OFF, N≥4 matched-pair probes | Every "can we just turn it on" |
| [0005](0005-story-bible-freeze.md) | Freeze the Story Bible; dereference, never re-derive | Every drift bug |
| [0006](0006-run-outcome-from-release-gate.md) | `run_outcome` derives from the release gate, not phase thresholds | Every batch-gate tally dispute |
| [0007](0007-repair-ladder-ordering.md) | Repair ladder order, and why the floor stays | A_67, A_68, and this review |
| [0008](0008-azure-primary-anthropic-polish.md) | Azure OpenAI primary, Anthropic for polish | A_71 |
| [0009](0009-file-backed-store.md) | A file-backed store, not a database | Every "shouldn't this be Postgres" |
| [0010](0010-report-is-the-durable-record.md) | The report is the durable record; chain logs are ephemeral | Every forensic-blindness finding |
| [0011](0011-measurement-before-promotion.md) | Nothing is promoted without measurement — including deletions | S1, S7, and R6's own acceptance |
