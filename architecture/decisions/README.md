# Architecture Decision Records

**Why this folder exists.** [REVIEW_01.md §8](../REVIEW_01.md) argues that the documentation gap in this
project is *why*, not *what*. There are 71 analysis boards — excellent forensics — but they are
organised by **incident**, not by **decision**. Nothing recorded "we chose the deterministic injector
floor over LLM regen because X, and here is what would change our mind." So settled questions get
re-litigated, by newcomers and by us in three months.

Each record is one page: **Context** (the forces), **Decision**, **Consequences** (including the ones
we dislike), and **What would change our mind** — the last section being the one that makes an ADR
different from a rationalisation. A decision with no stated reversal condition is a belief, not an
engineering choice.

**Status of this set.** Drafted from the code, the boards, and REVIEW_01.md by the agent that did the
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
| [0012](0012-own-the-llm-transport.md) | Own the HTTP call to the provider; no new vendor SDK | REVIEW_02 §2.1 — the SDK dropped `json_schema` |

---

## Ratification checklist

**What ratification is.** An agent can reconstruct *what* was decided and *what followed*. It cannot
confirm that the reconstructed reasoning is the reasoning the owner actually held. Where the two
differ, the record is wrong — and a wrong ADR is worse than none, because it will be cited.

**How to ratify, per record: read the Decision and the "What would change our mind" section only.**
The Context is reconstructable and low-stakes; those two sections are the claims that will be quoted
back at you in three months. For each, one of three answers:

- **Accept** — change `**Status:** Proposed` to `**Status:** Accepted`, add your name and the date.
- **Correct** — the decision is right, the stated reasoning or reversal condition is not. Fix in place.
- **Reject** — this was never the decision. Say what was; the record gets rewritten or deleted.

| ADR | The specific thing only you can confirm |
|---|---|
| 0001 | That CML-first is a *commitment*, not an artefact of how the pipeline grew |
| 0002 | That the fixed stage order is a property of the genre, not a chosen implementation |
| 0003 | **The reversal condition:** would an injected paragraph ever be worse than no story at all? The record says nobody has argued so |
| 0004 | That N≥4 matched pairs is the bar you actually want, given it costs £4–8 per question |
| 0005 | That the Bible freeze is worth the staleness risk it creates |
| 0006 | That "shipped" means the release gate, not the phase thresholds — this one has been re-litigated most |
| 0007 | The ladder ORDER, and that the floor stays even when it reads badly to a reviewer |
| 0008 | The spend split: Azure structural, Anthropic polish |
| 0009 | That a file-backed store is a decision, not a stopgap awaiting a database |
| 0010 | That the report — not the chain logs — is the record you want to still have in six months |
| 0011 | That this applies to DELETIONS too: nothing is removed on the grounds that it looks dead |
| 0012 | That owning the HTTP call is an acceptable maintenance burden versus taking a maintained SDK |

Six of the twelve name a trade this project has already paid for at least once. If any answer is
"that was never my reasoning", that is the most valuable output this folder can produce.
