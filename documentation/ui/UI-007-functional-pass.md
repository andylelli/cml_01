# UI-007 — DOES EVERY FEATURE WORK? A SITE-WIDE PASS

**2026-09-17.** Every result MEASURED: in the running app at 1400×950 against the live API on
`:3005` with a real project (`proj_035fdeda`), or from a test run. Nothing here is inferred from
reading code alone.

Commit: `a428ac8f` (the two fixes).

**No paid run was started.** Generate and the six Regenerate buttons were never clicked; a run is
~£1.15 and ~40 minutes. Everything below is verified against artifacts that already existed.

---

## 1. WHAT WAS CHECKED

| layer | instrument | result |
|---|---|---|
| all workspaces | `npm test` (57 files) | **556 pass**, exit 0 |
| web | `vitest` + `vue-tsc` | **384 pass**, typecheck clean |
| api | `vitest` + `tsc` | **36 pass**, typecheck clean |
| flags | `npm run flags:check` | clean — 201 read, 129 set, 206 registered |
| API surface | every read route, sequentially, with `x-cml-mode` | **34/34 behave correctly** |
| consumer views | browser walk | Create, Inspiration, My Cases, Case file |
| console | Review ×8, Advanced ×6, Export | all 14 render real content |

---

## 2. TWO DEFECTS FOUND AND FIXED

### 2a. Four fields dropped from every character profile

`normalizeCharacterProfiles` rebuilt each profile from a **hand-listed set of 13 keys**. The pipeline
sends 17. MEASURED, 7 of 7 characters:

| dropped | tier | rendered as |
|---|---|---|
| `internalConflict` | **safe** | "Torn between —" |
| `signatureTic` | **safe** | the italic quote line |
| `personalStakeInCase` | bonus | "At stake in this case" |
| `motiveStrength` | bonus | — |

Two fields the case file renders in the *safe* tier drew nothing. This is the location
`description` defect ([UI-004 §2a](UI-004-case-file-and-progress.md)) one layer further up: the
whitelist had fallen behind the payload, and an absent optional property is not a type error.

**Why every existing test missed it.** `CaseView.dossier.test.ts` — written the same day, explicitly
to catch fields that fail to reach the screen — assigns `store.characterProfilesData` **directly**.
That is the value *after* normalisation. The normaliser was never in the path.

> A fixture that starts downstream of the bug cannot see the bug.

Fixed by carrying everything and repairing only what needs repairing, so a field added upstream
arrives instead of being dropped. Guarded by `stores/__tests__/normalizeProfiles.test.ts`, which
drives `loadArtifacts` and takes its field list from `spec/spoilers.ts` — the file that decides what
the UI shows — so the guard cannot go stale. Mutation-tested: restoring the whitelist fails it and
names all four.

### 2b. The case file's lede named the murder weapon

`synopsisData.summary` is built by the API as `` `A ${crime_class.subtype} case unfolds.` ``. On a
real project that renders, in the header, ungated:

> **"A stabbed with ceremonial dagger case unfolds."**

The weapon, above the fold, on the page whose whole design is holding spoilers back — and an enum in
a sentence template, so it does not read as English either.

Now uses `backdropSummary`, which Agent 2e writes for exactly this job and which contains no crime:
*"Amidst strict class divisions and economic strain, the Marwood family, their staff, and visitors
are confined to a remote English manor…"* The stub is suppressed rather than displayed; a real
synopsis still wins if one is ever written.

---

## 3. THE SPOILER RULE, VERIFIED AGAINST REAL DATA

[UI-004](UI-004-case-file-and-progress.md) proved the two-tier dossier against fixtures. This proves
it against the live payload — 7 profiles × 17 fields:

| | closed | after revealing |
|---|---|---|
| safe fields rendered | **35 / 35** | 35 / 35 |
| spoiler fields visible | **0** | all |
| profile paragraphs visible | **0** | all |
| unreachable | — | **0** |
| page size | 24,848 chars | 43,206 chars |

**With a known-positive control**, without which the zero would mean nothing: the same matcher found
**21 safe field values** on the page. It can detect profile text; the spoilers are genuinely absent.

---

## 4. ONE FEATURE THAT CANNOT WORK — RECORDED, NOT FIXED

### The Game Pack has no producer.

MEASURED: `createArtifact(projectId, "game_pack", …)` **appears nowhere in the repo.**
`gamePackJob` is in `jobRegistry` (`apps/worker/src/jobs/index.ts:103`) and is **never invoked** —
its only other mention is a test asserting the registry's key list.

Consumers that exist anyway:

| surface | behaviour today |
|---|---|
| `GET /game-pack/latest` | 404, always |
| `GET /game-pack/pdf` | 404, always |
| `buildGamePackPdf()` (`server.ts:301`) | dead code |
| Export ▸ **Download game pack PDF** | permanently disabled |
| Export ▸ artifact checkbox "Game pack" | permanently disabled |
| Advanced ▸ Artifacts | "Not available" |

It degrades without crashing, but the Export panel says **"Generate content first to enable
export"**, which can never become true — the UI tells the user to do something that will not help.
The Create page also promises it: *"Read it as a novel, or play it as a case with suspects and
alibis."*

Not fixed because the choice is the user's: **build the producer**, or **remove the surface and the
promise**. Patching the copy would hide the question.

---

## 5. NOT DEFECTS — CHECKED AND CLEARED

| looked wrong | what it actually is |
|---|---|
| `/api/projects/:id/events` "timed out" | **Server-Sent Events.** It is meant to stay open; the probe treated it as request/response |
| `cml/validation`, `novelty-audit`, `game-pack` 404 | artifacts not produced for that project. Only the game pack is never produced for *any* project (§4) |
| 18 × 404 in the browser console | the same unproduced artifacts, polled. `Promise.allSettled` handles them; noise, not failure |
| Download offered on cases with no story | the handler catches and shows a readable error. Ungraceful, not broken |
| "Cast 6" in the rail vs 7 profiles | `castSize` is suspects; the detective is the documented +1 |
| Review ▸ Cast renders only 813 chars | collapsed state; expands to ~17,800 |
| 38 projects in My Cases, most named "Test Project" | leftovers from **19/08/2026**, when the API tests wrote to the real store. They use a temp store now |
| mojibake in the synopsis title | my `curl | python` pipeline. The browser renders the apostrophe correctly |

---

## 6. SIX PROBE ERRORS, ALL MINE, ALL CAUGHT BEFORE THEY BECAME FINDINGS

The standing rule is that a negative result from a probe you just wrote is a claim about the
**probe**. Six times in one pass:

1. `/api/projects` returns `{projects: […]}`, not an array → reported **"NO PROJECTS"** against a
   server holding 38.
2. `| tail -50` buffers until EOF → a probe that had finished looked **hung for fifteen minutes**.
3. Sampled the page immediately after a click, three separate times → Inspiration looked **empty**,
   then looked like **clicking did nothing**. Both were fetches that had not landed.
4. Reloaded the app before re-probing → landed on Create and reported **every field missing**.
5. Matched sub-tab labels exactly, but they read `"Cast✅"` → reported **all 8 Review tabs missing**.
6. `read_page filter:interactive` truncated silently → the Create page looked like it **stopped
   rendering at step 2**.

Every one would have been a false finding. None survived a second look.

---

## 7. STATUS

| | |
|---|---|
| character normaliser drops fields | **fixed**, mutation-tested — `a428ac8f` |
| case-file lede names the weapon | **fixed** — `a428ac8f` |
| game pack has no producer | **recorded, needs a decision** (§4) |
| API test leftovers in the dev store | cosmetic; clearable via Advanced ▸ Operator |
| a paid run end to end | **still outstanding** — nothing here exercised a live generation |
