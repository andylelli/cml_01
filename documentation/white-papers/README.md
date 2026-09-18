# White papers

Synthesis documents. Where `documentation/analysis/` answers *what is wrong with this run* and
`documentation/workflow/` records *what a multi-agent investigation found*, a white paper answers a
**standing question about the craft** — using this project's archive as evidence, and stating results
in a form someone outside this codebase could act on.

**A white paper earns its place by being usable.** Each one must carry:

- a **claim** stated so it can be wrong, not a survey
- **measurements** with their source analysis cited per row, labelled MEASURED / INFERRED / ASSUMED
- a **kit** — operations that can be built, each with the counter that would falsify it
- **what not to do**, with the receipt for each prohibition
- **external sources** where the literature bears on the claim, and an honest note on transfer

Numbered `WP-NNN-<slug>.md`. Never delete a paper; supersede it and say which one it replaces.

| # | title | claim | date |
|---|---|---|---|
| [WP-001](WP-001-what-gives-a-book-personality.md) | What gives a book personality | Personality is the residue of unforced choice; a system optimising for correctness destroys it without committing an error. Six operations, one of which (verbalized sampling) addresses the training-level cause rather than a symptom | 2026-09-13 |
| [WP-002](WP-002-using-the-competitor-story.md) | Using the competitor story to improve our mystery generator | A reader's parameter guide to a rival's book names the right categories and mostly the wrong controls: six rates, four operations already built, three genuinely missing — expertise as the clue engine (8 of 1,167 archived clues touch the detective's skill; 31 of 44 amateur sleuths are the prompt's example schoolteacher), a social stake per suspect, and aftermath scope — plus a relationship arc as a band, never a slider. Kit of seven, each with its falsifier | 2026-09-17 |
| [WP-003](WP-003-inspiration-without-copying.md) | Inspiration without copying | The reusable asset is the shape of the deception, and the right operation is a morph: keep one of an attested cell’s two dimensions, change the other, and land where no book is — an obligation, not a prohibition, with the anti-copy gate as the guarantee. The corpus is big enough in words (12.3M) and ONE BATCH short in shapes: 25 of 80 cells, Chao1 puts the genre at ~66, and the 109 works already on disk project to 80% of it for £12. Revised same-day: the original third dimension was a relabelling of a CML field with 3 of 6 values unemittable, which had made the map look unreachable | 2026-09-18 |
| [WP-004](WP-004-two-dimension-gene-mapping.md) | Two-dimension gene mapping | Store shapes, not books: each encoded work reduces to a five-field gene, two fields address an 80-cell `axis × mechanism_family` map, and the generator is given an OBLIGATION (“go here”) rather than a prohibition — a morph from an attested cell, anchored, never one we have shipped, furthest from the corpus’s centre of mass. Correct for this system because premise (8.05, thirteen 9s) is the category the corpus already feeds, prohibitions were measured to fail, and the model obeys operations. 25 of ~65 reachable cells; the 109 works on disk reach ~52 for £12; the third dimension WP-003 first used was a relabelling and is dropped. Six-step build plan for a coding agent, step 1 a twenty-line selection fix without which Agent 3 sees the alphabetically-first three exemplars forever. Falsifier: one run, CML stage, no reader | 2026-09-18 |
