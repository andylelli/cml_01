# UI-002 — REBUILD AND REFACTOR PLAN

**Started 2026-09-16.** Status table in §8 is the live record; every item names its commit when done.
Resumable from item 1 by reading §8 alone.

---

## 1. WHAT IS BEING REBUILT, AND WHY

**MEASURED, before any change:**

| | |
|---|---|
| `apps/web/src/App.vue` | **3,175 lines** — 1,745 of `<script setup>`, 1,643 of template |
| all other components | 2,404 lines across 18 files |
| tests | 174 passing across 15 files — **a green baseline that must stay green** |
| `services/api.ts` | 43 exported calls, well factored, **not a problem** |
| `stores/projectStore.ts` | 514 lines, holds artifacts and validation |

The diagnosis is narrow: the API layer and the child components are fine. **One god component holds
the entire application** — mode switching, three independent tab groups, project CRUD, spec editing,
SSE, two polling loops, artifact loading, scoring, prose reading, PDF export, error handling,
localStorage persistence and keyboard shortcuts. That is where the bugs live, and it is why a visual
rebuild and a refactor are the same job rather than two.

---

## 2. THE SPEC VOCABULARY — WHAT THE PIPELINE ACTUALLY ACCEPTS

**This is the section to read before adding any control.** Sourced from `apps/api/src/server.ts:673–697`
and the packages it hands off to. A control offering a value not on this list is a control that lies.

| spec field | accepted values | behaviour on an unrecognised value |
|---|---|---|
| `decade` | `1920s` `1930s` `1940s` `1950s` | passed through as free text to the era prompt |
| `locationPreset` | `CountryHouse` `SeasideHotel` `Village` `Liner` `Theatre` | free text; the setting agent improvises |
| `tone` | `Cozy` `Classic` `Dark` | free text — **and `Dark` alone also flips `narrativeStyle` to `atmospheric`** (`server.ts:675`) |
| `primaryAxis` | `temporal` `spatial` `identity` `behavioral` `authority` | **THROWS at pipeline init.** The only field where a bad value aborts a paid run |
| `castSize` | integer | — |
| `castNames` | string[] | — |
| `detectiveType` | `police` `private` `amateur` | defaults to `police` |
| `targetLength` | `short` `medium` `long` | defaults to `medium` |
| `narrativeStyle` | `classic` `modern` `atmospheric` | derived from tone if absent |
| `humourLevel` | `none` `dry` `classic` `sharp` | silently resolves to `classic` (`humour-level.ts:87`) |
| `proseBatchSize` | integer | — |
| `theme` | free text | defaults to *"A classic murder mystery"* |

**Three consequences for the design:**

1. **`humourLevel` has never had a control.** It is a real, wired story parameter with four bands, each
   resolving to countable operations, and the UI has never exposed it. Added at step 3 — see item 14.
2. **The boards' Tone row conflates two parameters.** Board 1 offers *Traditional · Cosy · Dark ·
   Humorous · Thrilling*. `Humorous` is not a tone, it is `humourLevel: sharp`; `Thrilling` has no
   backend meaning at all. The build renders Tone as **Classic · Cosy · Dark** and gives humour its own
   row, which is the board's visual language over the pipeline's real vocabulary.
3. **The boards' Setting row is invented.** *City* and *Train* are not presets. The build uses the five
   real ones with period labels: Country House, Seaside Hotel, Village, Ocean Liner, Theatre.

**Fields on the boards with no backend at all** — Method, Victim's profile, Twists, Specific elements.
These are *not* dropped and *not* faked: they compose into the free-text `theme` string, which the
pipeline genuinely reads, exactly as `scripts/run-params.mjs` composes the story angle into `theme`.
The composition is one pure function with its own tests (item 15) so what the user picked and what the
pipeline received can never drift.

---

## 3. INFORMATION ARCHITECTURE

The boards show a consumer product; the existing app is an operator's instrument. Both survive. Every
nav destination is backed by an API call that already exists.

| nav | view | backed by |
|---|---|---|
| **Create** | the numbered wizard — the boards, faithfully | `createProject`, `saveSpec`, `runPipeline` |
| **Inspiration** | sample mysteries to read | `fetchSamples`, `fetchSampleContent` |
| **My Cases** | project list, status, and the finished read | `fetchProjects`, `fetchProse`, `downloadStoryPdf` |
| **Workshop** | the operator console, restyled not rebuilt | everything else |

`Workshop` replaces the boards' `About`, which would have nothing behind it. It is visible only when
advanced mode is on, preserving today's `user / advanced / expert` progression.

---

## 4. TARGET STRUCTURE

```
src/
  design/
    tokens.css          every colour, type and shape token (UI-001 §2)
    brand.ts            wordmark + tagline, one object (UI-001 §7)
  components/ui/        the 11 board primitives, no app knowledge
  components/           existing feature components, restyled in place
  composables/
    useErrorLog.ts      error list + retry actions
    useUiState.ts       localStorage persistence, one schema, versioned
    useRunProgress.ts   SSE + the two polling loops + percent derivation
    useArtifacts.ts     artifact loading and readiness flags
    useShortcuts.ts     global keydown
  views/
    CreateView.vue      the wizard
    InspirationView.vue
    CasesView.vue
    ReadView.vue        the finished book
    WorkshopView.vue    operator console shell, owns the old tab groups
  spec/
    vocabulary.ts       §2's table as typed constants — ONE source
    composeTheme.ts     board extras -> theme string, pure, tested
  App.vue               shell + view switch only. Target under 150 lines.
```

**The rule that keeps this honest:** `spec/vocabulary.ts` is the only place a spec value is written
down. Controls render from it, and a unit test asserts every option a control can emit is accepted by
§2's table. A future option that the pipeline would silently downgrade fails that test.

---

## 5. BUGS

Found during reconnaissance. Each is confirmed by reading the code, not inferred from behaviour.
Items marked **fix** are scheduled below; items marked **note** are already correct and are recorded
so they are not "fixed" again.

| # | finding | status |
|---|---|---|
| B1 | Two polling intervals and the SSE subscription leaked on unmount | **note** — already fixed and commented at `App.vue:1726–1743` (A_73). Preserve this behaviour through the refactor; it is exactly what a split into composables can silently undo |
| B2 | `skipNextProjectArtifactLoad` is a boolean guarding a race between project creation and the artifact watcher (`App.vue:509, 766, 1064, 1124`) | **fix** — a one-shot flag mutated from three places is a race workaround, not a fix. Ownership moves into `useArtifacts` with an explicit request token |
| B3 | ~~Spec defaults `primaryAxis: "temporal"` and the UI has no control for it~~ | **PREMISE PARTLY FALSE.** The console has had an axis control with all five correct values since before this work (`WorkshopView.vue:2151`). What was true is narrower: no *consumer* path exposes it (correct — it is a craft decision), and nothing validated a value arriving from **storage**. That is the reachable risk and it is fixed by B8's `coerceSpec` plus the pre-flight in `useCreateFlow`, which rejects a bad axis **before the first network call** rather than letting the pipeline throw at init with a project created and a run paid for (X60: fail at the cheap end) |
| B4 | `tone: "Dark"` silently changes `narrativeStyle` as a side effect | **fix (surface, not change)** — the control says so. Changing the coupling is a pipeline decision, not a UI one |
| B5 | `humourLevel` accepted by the API, never sent by the UI | **fix** — item 14 |
| B6 | Mojibake in `App.vue` | **withdrawn — the premise was false.** Read via bare `Get-Content` under PS 5.1 (ANSI); the file is clean UTF-8 with 7 en-dashes and 19 em-dashes intact. "Fixing" it would have corrupted 26 characters. **Always read source with the Read tool or an explicit UTF-8 decode** |
| B7 | `persistState` called `localStorage.setItem` with **no try/catch**, while `hydrateState` had one (`App.vue:335`) | **FIXED** in `useUiState` (item 18). `setItem` throws on quota exhaustion and in Safari private browsing, and it ran inside a **deep watcher on the spec** — one throw took the watcher down and silently ended all persistence for the session |
| B8 | `hydrateState` restored the spec verbatim: `if (saved.spec) spec.value = saved.spec` (`App.vue:362`) | **FIXED** in `useUiState` (item 18). A spec written by an older build went straight to the API. With B3 this is the severe one: a stale `primaryAxis` in localStorage **throws at pipeline init and aborts a paid run**. Everything read now goes through `coerceSpec` |
| B9 | `addError` auto-dismissed info items with an untracked `setTimeout` (`App.vue:189`) | **FIXED** in `useErrorLog` (item 17). Same shape as the two polling intervals A_73 already had to fix here, and as the A_30 defect where a timer outlived its owner and overwrote freshly-loaded state |
| B10 | The persisted payload carried **no schema version** | **FIXED** in `useUiState` (item 18). Any future change to the stored shape would have been read as valid and half-applied. A version discards an unreadable payload deliberately instead |
| B11 | `onScopeDispose` registers nothing when called outside an effect scope, and a Vue warning is the only sign | **FIXED** while writing `useErrorLog` — `failSilently` plus an explicit, idempotent `dispose()`. Found by reading test output rather than by reading code |

| B12 | **Two owners of one localStorage key.** `WorkshopView` still wrote `persistState()` to `cml_ui_state` after the shell took that key with a versioned schema | **FIXED** (item 27 commit). The console's unversioned payload overwrote the shell's on every interaction; the shell's `hydrate()` then correctly rejected it for having no version; the visible effect was advanced mode silently reverting to user on every reload. **Found by running the app, not by reading it** — two owners of one key type-check perfectly and pass every test. The console now owns `cml_workshop_state`, which is right on the merits: the two persist different things |
| B13 | `WorkshopView` held its own `mode` and `spec` refs, independent of the shell's | **FIXED** with item 25. Both now come from `composables/useSessionState.ts` — module refs rather than a store, because two values with no actions and no async do not need one. **Verified end to end:** 1950s chosen in the Create wizard shows as 1950s in the console's Spec panel. The console also stopped *persisting* them, which was B12 one level down — the shell owns the versioned schema, and the console's key now holds only its own four values. The singleton needed `resetSessionState()` for tests, and the panel suite failed loudly until it was used — a module singleton leaking between tests is its own well-known trap |
| B14 | **`npm run build` did not type-check.** The script was `vite build`, and `@vitejs/plugin-vue` transpiles without checking | **FIXED** (item 31). `vue-tsc@2.2.12` added to `@cml/web`; `npm run typecheck` added; `build` is now `npm run typecheck && vite build`. The first run found **32 errors across 5 files**, all pre-existing and all now fixed. The gate was then verified by injecting a bad type and confirming the build rejects it — a gate nobody has seen fire is a claim about the gate |

Further bugs found during the rebuild are appended here with their item number.

---

## 6. THE OPERATOR CONSOLE

Restyled, not redesigned. It inherits UI-001's tokens and loses its slate/blue Tailwind palette, but
keeps dense tables, its three tab groups and every panel. Two rules:

- **Density is a feature.** Do not apply the wizard's padding to a table of run events.
- **Wide tables scroll inside their own container**, never the page (UI-001 §6).

---

## 7. HOW EACH ITEM IS VERIFIED

- `npm test` in `apps/web` stays green — **174 tests at baseline**, and the count only goes up.
- `npm run build` in `apps/web` produces no TypeScript error.
- A component item is done when it renders in the browser and its test asserts the *state*, not the
  class names — a test pinning `bg-[#B03A2E]` pins the design, which is the thing being changed.

---

## 8. STATUS

| # | item | status | commit |
|---|---|---|---|
| 1 | UI-001 design system documented | **DONE** | — |
| 2 | UI-002 plan + spec vocabulary documented | **DONE** | — |
| 3 | `design/tokens.css` + Tailwind theme extension | **DONE** | `2ccf7d23` |
| 4 | `design/brand.ts` | **DONE** | `2ccf7d23` |
| 5 | `spec/vocabulary.ts` + conformance test | **DONE** | `2ccf7d23` |
| 6 | `ui/AppShell` + `NavLink` + footer | **DONE** | `2ccf7d23` |
| 7 | `ui/HeroBanner` + typographic fallback state | **DONE** | `2ccf7d23` |
| 8 | `ui/StepCard` | **DONE** | `2ccf7d23` |
| 9 | `ui/OptionTile` + radio semantics + check glyph | **DONE** | `2ccf7d23` |
| 10 | `ui/FieldSelect`, `FieldNumber` | **DONE** | `2ccf7d23` |
| 11 | `ui/PrimaryButton`, `QuotePanel`, `FeatureRow`, `ScriptNote` | **DONE — FeatureRow folded into QuotePanel** | `2ccf7d23` |
| 12 | `ui/icons/` glyph set | **DONE** | `2ccf7d23` |
| 13 | `CreateView` — steps 1–2 (era, setting, tone) | **DONE** | `PENDING` |
| 14 | `CreateView` — step 3 humour band **(new parameter, B5)** | **DONE** | `PENDING` |
| 15 | `spec/composeTheme.ts` + tests (board extras → theme) | **DONE** | `2ccf7d23` |
| 16 | `CreateView` — steps 4–6 + submit wiring | **DONE — emits spec; network wiring at item 22** | `PENDING` |
| 17 | `composables/useErrorLog` | **DONE** | `PENDING` |
| 18 | `composables/useUiState` (versioned schema) | **DONE** | `PENDING` |
| 19 | `composables/useRunProgress` (SSE + polls, **preserve B1**) | **DONE — 20 tests, 5 mutations caught; deferral reason was wrong** | `PENDING` |
| 20 | `composables/useArtifacts` (**fixes B2**) | **DONE — B2 keyed to an id** | `76532cde` |
| 21 | `composables/useShortcuts` | **DONE — 17 tests; killed the duplicate tab list and the disabled-tab jump** | `PENDING` |
| 22 | `App.vue` reduced to shell + view switch | **DONE — 3,391 to 125 lines** | `76532cde` |
| 23 | `InspirationView` | **DONE** | `76532cde` |
| 24 | `CasesView` + `ReadView` | **DONE — CasesView; ReadView folded into Inspiration + PDF download** | `76532cde` |
| 25 | `WorkshopView` — console moved, tab groups preserved | **DONE — 3,226 to 638 lines; 6 panels + state composable** | `PENDING` |
| 26 | Workshop: axis control (**fixes B3**) + tone/style coupling note (**B4**) | **DONE — B3 corrected, B4 + B5 surfaced** | `76532cde` |
| 27 | Restyle existing feature components to tokens | **DONE — 1,088 uses, 0 remaining** | `76532cde` |
| 28 | Responsive pass — three widths, no horizontal scroll | **DONE — verified 1400/800/375, no page-level x-scroll** | `76532cde` |
| 29 | A11y pass — labels, `aria-current`, contrast, reduced motion | **DONE — all six panels audited; 11 more unlabelled fields found and fixed** | `PENDING` |
| 30 | Remove dead code and old Tailwind palette classes | **DONE — old palette at zero** | `76532cde` |

**Next item: 19** (see §9 first).

---

## 9. THE DEFERRALS — TWO WITHDRAWN, ONE STANDING

This section deferred items 19, 21 and 25. **Two of those deferrals were wrong and are withdrawn**;
the reasoning is kept rather than deleted, because the mistake is more useful than the conclusion.

### 19 · `useRunProgress` — **WITHDRAWN. The reason was wrong.**

> *What this section said:* "none of it can be exercised without a running API **and** Azure
> credentials — the paths that matter are 'a run completed', 'a run failed', 'the stream dropped and
> came back'. A refactor whose correct behaviour is unobservable is a refactor that ships its
> regressions."

**That confused the wire with the state machine.** Every one of those paths is entered through a
callback the composable *hands out*. A test calls `onStatus({status:"running"})` then
`onStatus({status:"idle"})` and the completion path runs exactly as it does in production. Only the
transport needs a server, and the transport is `services/sse.ts` — thirty lines, and not where the
bugs are.

Making `subscribe` an injected dependency rather than an import is the entire difference between
"unobservable" and 20 tests. **Built** (`dda0581b`), with five mutation checks, all caught.

The one part of the original reasoning that held: B1. A split like this *is* how a timer's ownership
gets lost, so both intervals belong to the composable, `dispose()` clears both, and a test asserts it.

### 21 · `useShortcuts` — **WITHDRAWN.** Built ahead of item 25, and it was right to.

> *What this section said:* "Worth doing **as part of item 25**, not before it, or the composable
> just inherits the duplication."

The duplication was the reason to do it *now*, not later: extracting the handler is what forced the
hard-coded tab list to be read from `mainTabs` instead, and that surfaced a second defect nobody had
noticed — `Ctrl+5` opened the `advanced` tab even when it was `disabled`. Waiting for item 25 would
have left both live. **Built** (`90e7298a`), 17 tests.

### 25 · Splitting `WorkshopView`'s internals — **DONE**

Both earlier reasons are now spent, and both are kept because each was wrong in a different way.

> *First reason:* moving and rewriting in one change makes a regression unattributable. True before
> the move; **expired** the moment the move was committed.
>
> *Second reason:* "how the refs reach the panels is the work, and picking badly is worse than
> leaving it." **Overstated.** Measuring answered it in one command: 130 bindings reach the template
> and **100 are used by exactly one panel**, so only 30 are genuinely shared. The mechanism was never
> in doubt once that was known.

**What was built.**

| | |
|---|---|
| `workshop/useWorkshopState.ts` | the console's ~1,500 lines of logic, as ordinary TypeScript. Its **return type is the context**, inferred rather than hand-written across 121 fields, so the contract cannot drift from what is provided |
| `workshop/panels/*.vue` | six panels — Project, Spec, Generate, Review, Advanced, Export — each injecting the state and declaring exactly the bindings and components it uses |
| `WorkshopView.vue` | **3,226 → 638 lines** |

**Two defects the split found, neither visible to the typechecker:**

1. **`<script setup>` auto-registers only the components it imports itself.** Moving those imports
   into the `.ts` silently un-registered them: the template still compiles, `vue-tsc` still passes,
   and Vue complains only at **runtime** with "Failed to resolve component". Three tests caught it.
2. **A `.vue` import at the wrong depth also passes the typechecker.** The panels sit three levels
   below `src`, not two; `vue-tsc` was clean and vitest failed on resolution.

**Item 29 finished here too**, because it was always the same job. The panels are `v-if`'d, so the
auditor had only ever reached one of six. Visiting each found **11 more unlabelled fields** in the
Spec panel — labels present, `for`/`id` absent — now bound, with 20 panel tests holding all six open.

---

## 10. WHAT THE TYPECHECK FOUND (item 31)

Adding `vue-tsc --noEmit` and gating the build on it surfaced **32 errors across 5 files**, every one
pre-existing and invisible. They are worth listing because the distribution is the argument for the
gate:

| file | n | what it was |
|---|---:|---|
| `RunHistory.test.ts` + `RunHistory.vue` | 17 | `runId?: string` while **every call site passes `null`** — the store holds `string | null`. One wrong prop type, seventeen errors |
| `WorkshopView.vue` | 9 | `outlineData.chapters` was `unknown`, so the `v-for` item typed as `never` and **every field read off a chapter was an error** |
| `CreateView.vue` | 5 | mine: `FlavourOption` has no `icon`, `Option` required one. Split into `Option` (icon optional, for selects) and `TileOption` (icon required, for tiles) |
| `ErrorNotification.test.ts` | 1 | helper typed as `Parameters<typeof mount>[1]`, which widens `stubs` to include its array form |

None of these would have failed a test. `RunHistory` renders fine with `runId = null`; the outline
template already coped with missing fields. They are the class of defect that only a type-checker
sees — which is exactly why the app had accumulated them over its whole life.

**The gate was then verified rather than assumed**: a deliberate bad value was injected into
`vocabulary.ts`, the build was confirmed to reject it with `TS2322`, and the source restored.

---

## 11. WHAT IS LEFT

**The board is finished.** All 30 items built and verified, plus items 31 (typecheck gate) and 32
(the case file). Every bug B1–B14 is fixed, noted as already-correct, or withdrawn with its premise
named.

Three things are worth doing next, and none of them is on this board:

1. **A paid run through the rebuilt UI.** The consumer path was verified against a live API with 38
   existing projects, and `useRunProgress` is pinned by 20 tests and 5 mutation checks — but no run
   has been *started* from the new wizard. That is the one path still unexercised end to end, and it
   is also the first chance to see `humourLevel` actually reach a book.
2. **The 100 panel-local bindings.** `useWorkshopState` is a staging post, not a destination:
   MEASURED, 100 of its 130 bindings are used by exactly one panel and belong in that panel. Moving
   them would shrink it from ~1,500 lines to something near the 30 that are genuinely shared. Each
   panel now has a render test and an a11y case, so this is low-risk, incremental work.
3. **The typecheck gate on `apps/api` and `apps/worker`.** `packages/*` are covered by their `tsc`
   builds; those two were never audited, and `apps/web` had quietly accumulated 32 errors in exactly
   that situation.

**And one caveat that survives everything above:** `vue-tsc` did not catch either of the two defects
the item-25 split produced — an un-registered component and a `.vue` import at the wrong depth. The
gate is worth having and is not a substitute for running the thing.
