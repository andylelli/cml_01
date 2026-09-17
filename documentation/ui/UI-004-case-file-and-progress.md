# UI-004 — THE CASE FILE: PROGRESS, AND THE BONUS DOSSIER

**2026-09-17.** Every figure MEASURED against a real payload
(`proj_035fdeda-92e1-4613-b170-1ffba5c017a1`, via `/api/projects/:id/character-profiles` and
`/location-profiles`) or read from source. Companion to [UI-001](UI-001-design-system.md),
[UI-002](UI-002-rebuild-plan.md) and [UI-003](UI-003-workshop-review.md).

Commits: `e7500d4a` (the dossier), `bffe95be` (the progress tests).

---

## 0. THE TWO ASKS

> *"Can you ensure that the progress updates as generation progresses? Also all the character /
> location information should be available to read too. The idea is it all acts as good backstory
> without giving away any of the story. People can read it after they have read the story too, to
> find out a little more. Like a bonus."*

Two separate things. The first turned out to be already built and unproven. The second was blocked
by a defect nobody could see.

---

## 1. PROGRESS — THE CHAIN, TRACED

A run costs ~£1.15 and ~40 minutes, so this was settled by tracing the chain and then pinning every
link with tests fed the events a run emits.

```
Generate
  └ App.onGenerate            App.vue:107   sets openCase, view = "case"
     └ CaseView.refresh()     CaseView.vue:87
        ├ fetchProjectStatus  ──────────────► status.value
        ├ store.loadRunEvents projectStore.ts:482 — refetches unconditionally, NO cache guard
        └ store.loadArtifacts projectStore.ts:258 — refetches all 20 artifacts
     └ syncPoll()             CaseView.vue:106  setInterval(refresh, 4000) while status === "running"
        └ stages / progress   CaseView.vue:57   computed over runEventsData
           └ ProgressTrack    percent, 14 reader-facing stages, aria-valuenow
```

`CasesView` polls independently at 5s while any project is running, so the list is live too, and a
running case's button reads **Follow** rather than Open.

**Two properties make this work, and both are easy to break silently:**

| property | where | what breaks if lost |
|---|---|---|
| `loadRunEvents` has no cache guard | `projectStore.ts:482` | the bar freezes at its first reading |
| `stages`/`progress` are computeds, not snapshots | `CaseView.vue:57–58` | the bar renders once and never moves |

Both are now pinned by `views/__tests__/CaseView.progress.test.ts` (8 tests).

### 1a. Mutation-tested

A green test proves nothing until it has been shown to fail. Two mutations, both applied to
`CaseView.vue` and reverted:

| mutation | test that caught it |
|---|---|
| comment out `syncPoll()` — the poll never starts | *polls while running and stops when it is not* — "expected 1 to be greater than 1" |
| freeze `stages`/`progress` at setup instead of computing | *advances when more events arrive — without remounting* |

### 1b. Reader's language, not the console's

`deriveStages` is shared, so there is one source of truth for what is running.
`run/readerStages.ts` renames the same ids: `hard_logic` → **The method**, `cml` → **The crime**,
`novelty_audit` → **Originality**, `world_builder` → **Continuity**. The test asserts no operator
label ("Hard Logic", "CML", "Novelty Audit", "World Builder", "Fair-play") reaches the reader's view.

### 1c. NOT FIXED, and why

Each poll rebuilds every artifact field from that poll alone
(`characterProfilesData.value = characterProfiles.status === "fulfilled" ? … : null`). A **404** means
"not produced yet" and correctly blanks. A dropped connection or a 500 rejects identically — so a
card the reader is part-way through would vanish for four seconds and come back.

Distinguishing them needs project-scoped retention: keeping the previous value across a *project
switch* would show the wrong case's dossier, which is worse than a flicker. **No such rejection has
been observed.** Recorded rather than built, per the evidence standard: a fix for an unmeasured
failure is an unmeasured fix.

---

## 2. THE DOSSIER — WHAT WAS ACTUALLY WRONG

### 2a. The Places card drew nothing, and could not have drawn anything

`LocationProfilesData.keyLocations` declared:

```ts
{ description: string; accessibility: { publicAccess; whoCanEnter; restrictions } }
```

The pipeline emits **none of those**. It emits:

```ts
{ id?, name, type, purpose?, visualDetails?, paragraphs, sensoryDetails?, sensoryVariants?, accessControl? }
```

Both `CaseView` and the console's `ReviewPanel` rendered `description` and walked `accessibility`.
Both drew blank, silently, for as long as they have existed — **an absent optional property is not a
type error**, and the type agreed with the template rather than with the payload. `vue-tsc` was clean
throughout.

This is the same shape as the CLAUDE.md probe rule: a component that renders nothing is a claim about
the *component*, not about the data. Correcting the type is what surfaced it.

`atmosphere` also gained `era`, `timeFlow` and `paragraphs`, all of which the payload has always
returned and no view has ever shown.

### 2b. `paragraphs` looks like colour and contains the secret

`CaseView` showed **3 of a character profile's 17 fields**. The obvious fix — show the five
paragraphs of prose about each person — is wrong, and only a measurement says so.

Charles Fenwick's second paragraph, verbatim from the payload:

> *"His affair with Annabelle Marwood was a dangerous dance, fraught with risk…"*

His `privateSecret`:

> *"His affair with Annabelle Marwood threatens to destroy his standing with Beatrice."*

Shared distinctive terms: **affair, Annabelle, Beatrice, Marwood**. The long-form profile *contains*
the secret. It is excellent bonus material and it cannot be shown before the book.

Locations are the opposite case — **20 of 21 fields scanned clean**, and the one that leaked did so
through a single noun: `purpose` reads `"Crime scene"`.

### 2c. The split

| | safe — background, before the book | bonus — after |
|---|---|---|
| **character** | name, summary, publicPersona, speechMannerisms, internalConflict, signatureTic, humourStyle | **paragraphs**, privateSecret, motiveSeed, motiveStrength, stakes, personalStakeInCase, alibiWindow, accessPlausibility |
| **location** | name, type, visualDetails, paragraphs, sensoryDetails, atmosphere | purpose, accessControl |

The bonus tier sits behind the control that already existed — one toggle, default **closed**,
remembered per case in `localStorage`. The reader who has finished the book opens it once.

### 2d. Why this is code and not a comment

`spec/spoilers.ts` holds the split as exported constants plus `leaksInto(safeText, secretText)`, a
distinctive-word overlap scan (≥5 characters, stopword-filtered) that returns *what* leaked rather
than only *that* something did. `spec/__tests__/spoilers.test.ts` (11 tests) asserts the exact set
above, so a future field promoted to the safe side that quotes a secret fails here rather than in a
reader's hands.

The fixture is the real payload, kept in the test rather than in a snapshot: it is the evidence for
the rule, and a rule whose evidence is deleted becomes a comment.

---

## 3. STATUS

| item | state | commit |
|---|---|---|
| progress advances as events arrive | pinned, mutation-tested | `bffe95be` |
| reader-facing stage language | pinned | `bffe95be` |
| poll starts while running, stops on unmount | pinned | `bffe95be` |
| `LocationProfilesData` type corrected | done | `e7500d4a` |
| Places card renders the real fields | done | `e7500d4a` |
| `ReviewPanel` locations repointed | done | `e7500d4a` |
| People card: 3 fields → full safe tier | done | `e7500d4a` |
| bonus tier behind the spoiler control | done | `e7500d4a` |
| spoiler split enforced by test | done | `e7500d4a` |
| poll blanks a loaded card on a non-404 rejection | **recorded, not built** (§1c) | — |
| a paid run through the rebuilt case file | **outstanding** — everything above is proven against events and payloads, never against a live run | — |

350 tests pass; `npm run typecheck` clean.
