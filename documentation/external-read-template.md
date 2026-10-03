# Recording an external read

Paste the reader's answer into the story folder as `chatgpt-review.txt`, as today, with **two lines at the
top**:

```
reader: <the model name exactly as the chat shows it, e.g. the model picker's label>
date: YYYY-MM-DD
```

`scripts/external-read-ledger.mjs` reads both (A_110 N10). Without them a read is counted as
**unrecorded**.

**Why.** A judge favours text from its own model family, and a same-family upgrade has moved marks by up to
13% of the scale (WP-007 §3.1). Not one of the first 79 reads names its model. So when the marks shift, a
reader change cannot be told apart from a change in the book.

**The anchor re-read.** Before the B arm of a matched pair is read, re-read one fixed anchor book with the same
reader. The first anchor is *The Fog-Bound Masquerade at Cliffhaven Hotel* (`stories/story_20261002-2110`, 82).
If the anchor's mark moves by more than about 5, the reader has moved. Settle that before you credit any lever.
