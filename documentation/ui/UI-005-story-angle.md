# UI-005 — THE STORY ANGLE: NOT THE THEME, AND NEVER SENT

**2026-09-17.** Every claim MEASURED against source or asserted by a test that parses that source.
Companion to [UI-001](UI-001-design-system.md)–[UI-004](UI-004-case-file-and-progress.md).

Commit: `7808bccd`.

---

## 0. THE QUESTION

> *"Is theme like angle? We need to integrate angle into the workshop."*

They are not the same thing, they are not alternatives, and the second half of the question turned
out to be a bigger job than it sounds — because the angle was not reaching the pipeline at all.

---

## 1. WHAT THE DIFFERENCE IS

| | **theme** | **story angle** |
|---|---|---|
| what it is | the **crime** — "a locked-room murder in a manor" | the **world it happens inside** — "a racing stable", "a by-election" |
| what it steers | the mechanism, the concealment | the setting, the cast's occupations, the motive |
| where it comes from | typed | 107 hand-written phrases in `scripts/run-params.mjs`, or typed |
| how many per run | one | one |

They are not alternatives. A run has both.

### Why angles exist at all

Left to itself the pipeline writes the same country house every time and the corpus reads as one
household with the furniture moved. An angle is a world for the story to draw on. The generator's
own note puts it plainly: *an angle is a world*.

---

## 2. THE ANGLE TRAVELS BY TWO ROUTES, AND NEEDS BOTH

This is the part that is not obvious from either field name, and it is why the angle cannot simply
be typed into the theme box.

```
                     ┌─ storyAngle (a field) ──────► Agent 1 (setting)    agent1-setting.ts:204
   one spec field ───┤                              Agent 2 (cast)       agent2-cast.ts:561
                     └─ appended to theme ─────────► Agents 2e, 3b, 3
```

**Agents 1 and 2 are never shown the theme.** That is why `storyAngle` exists as a field at all —
`mystery-orchestrator.ts:191-197` says so in as many words. **Agents 2e, 3b and 3 never see the
field**; they read the theme. Send one without the other and half the pipeline is blind to it.

So one spec field fans out to both, in `composeThemeWithAngle` (`server.ts`).

### The framing sentence is load-bearing

```
 Story angle: <angle>. This is background colour for the setting, the cast's occupations and the
 motive; it is NOT the murder mechanism and must not displace the concealment above.
```

Not decoration. The theme is read by **substring** matchers — `MECHANISM_FAMILY_KEYWORDS` in
agent3b, and the family rules in `shared.ts` — that lock the murder device onto a family before any
model sees it. Without the disclaimer, a world offered as scenery gets taken as a method. The
generator discovered this; the sentence is reproduced from `run-params.mjs:592` **verbatim**, and
`apps/api/src/__tests__/story-angle.test.ts` parses it out of that file and fails on a one-character
difference.

---

## 3. THE FINDING: IT HAS NEVER BEEN SENT

**MEASURED: `grep -rn storyAngle apps/api/src` returned nothing.**

The pipeline has supported it the whole time — the field is declared, both prompt blocks are
written, the worker reads `ctx.inputs.storyAngle` in three places. The API simply never built it
into `inputs`. Every run ever started from this app had `ctx.inputs.storyAngle === undefined`, and
**those two prompt blocks have never once fired for a UI run.**

Only the seeded path reached them, because `canary-core.mjs` passes its whole YAML straight through:

```js
const inputs = canaryInputConfig.inputs;   // storyAngle included, untouched
```

This is the same shape as **humourLevel (A_92)**: wired end to end in the pipeline, never sent by
anything. Two instances now, both found the same way — by tracing a parameter from the prompt that
reads it back to the payload that should carry it, rather than from the UI forward.

---

## 4. WHAT WAS BUILT

| | |
|---|---|
| `spec/storyAngles.ts` | the 107 angles in 8 groups, **generated from `run-params.mjs`, not retyped** |
| `vocabulary.ts` | `storyAngle: string` on `MysterySpec`, its default and its coercion |
| `server.ts` | `composeThemeWithAngle`, exported; `storyAngle` in `inputs` |
| `SpecPanel.vue` | the control, under Theme |

### The control

A `<datalist>` input rather than a 107-row `<select>`: it filters as you type and still accepts free
text, which is what `run-params.mjs --angle "<text>"` does. Each option carries its category, so the
eight groups are visible while scrolling. **Surprise me** fills a random one; **Clear** appears only
when there is something to clear.

Under it, the mechanism-collision note: the listed 107 are self-tested against the substring matchers
by the generator, **free text is not**, so typing "a clockmaker's workshop" says it will steer the
method toward a clock or timepiece. A note, never an error — sometimes that is exactly what is
wanted. Verified in the browser as well as by test.

### Two drift guards

`storyAngles.ts` is a copy of a list in a `.mjs` script apps/web cannot import, and the framing
sentence is a copy of a string in the same file. A copy is a divergence waiting to happen (WF-002),
and here a harmful one: an angle the UI offers that the generator has never self-tested could carry
a stem that silently locks the mechanism. Both guards parse the real source:

| guard | reads | fails when |
|---|---|---|
| `spec/__tests__/storyAngles.test.ts` | `STORY_ANGLES` out of `run-params.mjs` | the lists differ by one character |
| `api/__tests__/story-angle.test.ts` | the `params.theme +=` append | the framing sentence differs |

Each opens with a probe-validity test, because a parse that silently returns nothing would make both
pass for the wrong reason.

---

## 5. STATUS

| item | state | commit |
|---|---|---|
| `storyAngle` reaches `inputs` | done | `7808bccd` |
| angle folded into the theme with the verbatim framing | done | `7808bccd` |
| 107 angles generated from the generator | done | `7808bccd` |
| angle control in the workshop, with collision note | done | `7808bccd` |
| drift guard on the list | done | `7808bccd` |
| drift guard on the framing sentence | done | `7808bccd` |
| spec round-trips the field across the API | done | `7808bccd` |
| **the same field in CreateView** | **not done** — `composeTheme.ts` already composes Board 1's fields into the theme, so this is one control plus one line; deliberately left, the ask was the workshop | — |
| **a paid run proving the two prompt blocks now fire** | **outstanding** — the evidence is source-level and test-level. Confirm with `[Agent 1]` / `[Agent 2]` in `logs/llm-prompts-full.jsonl`, per the CLAUDE.md rule that a lever is verified by its agent label | — |

24 new tests. 374 web + 36 api pass; both typechecks clean.
