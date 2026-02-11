# UI Spec (Vue 3 + Tailwind + Headless UI)

## Framework
- Vue 3 (Composition API)
- Tailwind CSS for styling
- Headless UI for accessible unstyled primitives
- Pinia for centralized reactive state (artifacts, run history, validation)

## UX quality bar (non-negotiable)
- Default experience is friendly and task-focused; CML is hidden unless Advanced/Expert is enabled.
- First-time users can complete a full generation without seeing raw CML.
- Primary actions are prominent, consistent, and never buried behind menus.
- Information density scales with screen size; no horizontal scrolling on core views.
- The UI stays legible and calm during long-running jobs with clear progress cues.
- UI actions emit debug logs for full activity tracing.
- Project/spec/session state persists across refresh to avoid losing progress.
- If artifacts cannot be found after refresh (e.g., API restarted or invalid project ID), the UI shows a clear error with guidance to reload the project or rerun the pipeline.

## Layout
- App shell: left nav + top bar + main content
- Right drawer: validation status, last run (CML hidden by default)
- Responsive: single-column wizard on small screens
 - Sidebar navigation switches main content views (Dashboard, Builder, Cast, Clues, Outline, Samples, CML Viewer).
- Active view header reflects the current selection.

## Design tokens (Tailwind)
- Typography: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-2xl`
- Spacing rhythm: 4/8/12/16/24/32
- Surfaces: `bg-white`, `bg-slate-50`, `bg-slate-100`
- Borders: `border-slate-200`, `rounded-lg`
- Focus: `focus-visible:ring`, `ring-offset-2`
- States: `disabled:opacity-50`, `hover:shadow`, `transition`

## Views
### Results (default)
- Setting overview
- Cast cards + relationship map
- Mystery “bones” overview
- Clue board
- Outline/timeline
- Fair-play summary
- Game pack preview (materials + suspect cards summary)
- Game pack PDF download action
- Setting/cast/outline cards render generated content when available.
- Synopsis card shows a readable summary after CML generation.
- Synopsis card includes quick links to detailed views (Clues, Outline, CML) and a jump to the dashboard detail panels.
- Status panel includes a “Refresh data” action and a compact artifact availability summary.

### ProjectDashboard
- Create/import project
- Recent versions
- Quick actions: regenerate/export
 - Creating a project auto-starts the pipeline so artifacts appear without extra steps.
- Project setup includes a field to load an existing project by ID.
- Project setup includes a dropdown list of existing projects fetched from the API for quick reload.
- If a saved project ID is no longer available, the UI clears it and prompts the user to pick an existing project or create a new one.
- Project setup includes a "Clear persistence" control that wipes the JSON/Postgres store and resets UI state.

### BuilderWizard
- Stepper with Setting, Cast, Logic, Output
- Live preview card
- Inline validation hints

### Generate
- Dedicated main tab for running the pipeline and monitoring progress.
- Shows API health, artifact readiness summary, and regenerate controls.
- Does not replace or duplicate Project setup; it is its own view.

### CmlViewer (Advanced/Expert only)
- Tree view with YAML/JSON toggle
- Spoiler toggle for hidden_model + false_assumption
- Read-only in Advanced mode
- Edit controls only in Expert mode (with warning modal and validation panel)
- Schema validation badge
 - Phase 2 placeholder: read-only CML preview panel in Advanced mode

### ClueBoard
- Table with filters by category
- Red herring toggle
- Points-to column gated by spoiler toggle

### OutlineViewer
- Timeline list with clue markers
- Warnings for late load-bearing clues

### SamplesGallery
- Cards for example CMLs
- Seed structure patterns (no content copying)
- Current build lists example templates and shows raw YAML preview

### Advanced/Expert toggles
- Advanced mode enables read-only CML viewing and export.
- Expert mode enables CML editing with warnings and full validation output.
- Current build uses native checkbox toggles for reliability.

## Components
- SpecStepper
- SettingForm
- CastForm
- LogicForm
- OutputForm
- CmlTreeView (Advanced/Expert only)
- ValidationChecklistPanel
- ClueTable
- OutlineTimeline
- ArtifactVersionTimeline
- SampleCard
- SpoilerToggle
- RunStatusBanner

## Detailed component design plan

### Design principles
- Clarity over density: prioritize readable, scannable panels
- Progressive disclosure: hide spoilers and advanced controls by default
- Visible system status: always show current run and validation state
- Actionable feedback: every action produces immediate visual response
- Consistent layout: same header/actions placement across views
- Predictable flows: no modal-only workflows for primary actions

### Global UI constraints
- All primary actions must be reachable within 1–2 clicks from the view
- Buttons must have hover, active, focus-visible, and disabled states
- Loading indicators for any action > 300 ms
- All long-running actions must show a spinner and status text
- Forms must show validation inline, with summary at top of step
- Empty states must explain next action

### SpecStepper
**Purpose:** Provide step-by-step spec creation with validation summaries.
**Layout:**
- Left: step list with completion icons
- Right: active step form panel
- Bottom: Back/Next, Save Draft, Run Pipeline
**States:**
- Step status: not started / in progress / complete / blocked
- Inline warnings per field
**Actions:**
- Save Draft: persists spec to backend
- Run Pipeline: disabled if schema errors
**Feedback:**
- Hover and active state on buttons
- Save shows a subtle toast with timestamp

### SettingForm / CastForm / LogicForm / OutputForm
**Purpose:** Capture MysterySpec inputs with clear validation.
**Common patterns:**
- Label + helper text + control
- Inline validation message below control
- “Reset section” link
**Constraints:**
- Required fields show a required marker
- Ranges (sliders) display current value with min/max labels
- Multi-select chips show count
**Feedback:**
- On change: show “unsaved changes” badge until saved

Spec draft inputs include a comma-separated cast names field that overrides the placeholder cast list.
If cast names are left empty, the system generates a default list of readable names.

### CmlTreeView
**Purpose:** View CML with spoiler-safe controls.
**Layout:**
- Header: YAML/JSON toggle, Spoiler toggle, Search
- Body: collapsible tree
**Constraints:**
- Hidden sections collapsed and masked unless spoiler enabled
- Search highlights matching nodes
 - Read-only in Advanced mode; editing only in Expert mode with explicit warning
**Feedback:**
- Toggle changes animate smoothly

### LLM Logs (Advanced)
**Purpose:** Inspect LLM operational logs (model, tokens, cost, latency).
**Layout:**
- List of entries with timestamp, agent, model, token usage, and cost
- Empty state when no logs are available

### Raw Artifacts (Advanced)
**Purpose:** Provide full JSON payloads as stored in persistence for all artifacts.
**Layout:**
- Collapsible JSON blocks per artifact (setting, cast, clues, outline, prose, game pack)

### ValidationChecklistPanel
**Purpose:** Show checklist compliance with actionable fixes.
**Layout:**
- Sections A–G with status icon
- Each item has status (pass/warn/fail)
- “Fix guidance” expandable text
**Feedback:**
- Failures highlight related fields in forms
 - Phase 2 placeholder: show validation error list from CML validation artifact
- Phase 3 placeholder: show step validation status for setting/cast/clues/outline
- Fair-play report renders checklist items with pass/warn indicators.

### ClueTable
**Purpose:** Manage clues and red herrings.
**Layout:**
- Filter bar (category chips, search, red herring toggle)
- Table rows with category, description, points-to
**Constraints:**
- Points-to column hidden unless spoiler enabled
- Red herrings must be labeled and toggleable
**Feedback:**
- Row hover highlights
- Table loading skeleton while fetching
- Current build renders a clue list with red herring tags and a show/hide toggle.
- Play mode toggle allows revealing clues by chapter (uses reveal metadata from clues).
- Chapter selector defaults to 1–3 but uses outline chapter count when available.
- Play mode provides Prev/Next controls with current chapter progress.

### OutlineTimeline
**Purpose:** Validate clue placement and reveal timing.
**Layout:**
- Chapters/acts list with clue markers
- Warning banners for late clues
**Feedback:**
- Clicking a clue marker highlights corresponding clue in ClueTable

### ArtifactVersionTimeline
**Purpose:** Show history and allow rollback.
**Layout:**
- Vertical timeline with version tags and timestamps
- Actions: compare, rollback, export
**Constraints:**
- Rollback requires confirmation modal
**Feedback:**
- Success toast and refreshed view


### ExportPanel
**Purpose:** Select artifacts for export packaging and trigger download.
**Layout:**
- Checkbox list for setting/cast/clues/outline/fair-play/prose/game pack/CML
- Export button (disabled until selections available)
**Feedback:**
- Calls the export API endpoint with selected artifact types and downloads a JSON file containing the latest versions.
- Shows error if export fails.

### SampleCard
**Purpose:** Present sample CMLs with actions.
**Layout:**
- Title, author, axis, decade, short summary
- Buttons: View, Seed (structure-only)
**Feedback:**
- Hover elevation, active press state

### SpoilerToggle
**Purpose:** Safe gating for hidden content.
**Constraints:**
- Requires confirmation on first reveal per session
- Visual indicator when spoilers enabled

### RunStatusBanner
**Purpose:** Persistent pipeline status and control.
**Layout:**
- Status text, step indicator, progress bar
- Actions: cancel run, retry failed step
**Feedback:**
- Spinner for active run
 - When run status returns to idle, the UI auto-refreshes artifacts.
 - Auto-refresh uses a short polling window to wait for freshly generated artifacts to appear.
- After a run starts, the UI polls for artifacts until they are available.

### Regenerate controls (V1)
**Purpose:** Allow granular regeneration of individual artifacts.
**Layout:**
- Sidebar buttons for setting, cast, clues, outline, prose.
**Feedback:**
- Success message on completion; error message on failure.
- Regenerate actions refresh the current artifact previews.

## Interaction feedback
- Buttons: hover (bg + shadow), active (pressed), focus-visible (ring)
- Toggle switches: animated thumb with color change
- Loaders: spinners for actions, skeletons for data tables
- Toasts: success, warning, error with clear message and retry links
- Inline save indicators for draft vs accepted artifacts
- Sticky action bar for “Generate / Regenerate / Export” on long pages

## Error and empty states
- Empty states: icon + message + primary action button
- Errors: show inline + top summary; avoid modal-only errors
- Retry: provide retry button per step
- Long-running tasks: show estimated step name and last completed step

## Component-by-component framework mapping (Tailwind + Headless UI + Vue)

### SpecStepper
**Tailwind building blocks**
- `flex`, `gap-*`, `border`, `rounded-*`, `bg-*`, `shadow-sm`
- Step list: `ul` with `li` using `before:` status dots
**Headless UI**
- `Disclosure` for step details (optional on mobile)
- `TabGroup` for step content in compact layouts
**Vue behavior**
- Props: `steps`, `currentStep`, `errorsByStep`, `dirty`
- Emits: `next`, `back`, `save`, `run`
- Disable `run` when schema errors exist
- Keyboard: arrow keys to navigate steps

### SettingForm
**Tailwind**
- `grid`, `col-span-*`, `space-y-*`, `text-sm`, `text-gray-*`
**Headless UI**
- `Listbox` for select inputs
- `Switch` for toggles
**Vue behavior**
- v-model for each field
- Inline validation computed props
- Watchers to set `dirty` state

### CastForm
**Tailwind**
- `grid`, `gap-*`, `border-l-2` for grouped sections
**Headless UI**
- `Listbox` (detective type, victim archetype)
- `Combobox` (suspect roles multi-select)
- `Switch` (optional toggles)
**Vue behavior**
- Multi-select model as array of strings
- Enforce min/max cast size with slider

### LogicForm
**Tailwind**
- `flex`, `gap-*`, `rounded`, `bg-*` for grouped cards
**Headless UI**
- `RadioGroup` for primaryAxis
- `Listbox` or `Combobox` for mechanismFamilies
- `Switch` for fairPlay toggles
**Vue behavior**
- Enforce exactly one primary axis
- Derived validation for redHerringBudget vs clueDensity

### OutputForm
**Tailwind**
- `grid`, `col-span-*`, `mt-*`, `text-xs` for helper text
**Headless UI**
- `RadioGroup` for style mode
- `Listbox` for POV/tone/length
**Vue behavior**
- Conditionally show `chapters` when outline/prose selected
- Style text required if prose selected

### CmlTreeView
**Tailwind**
- Tree indentation with `pl-*`, `border-l`, `text-xs`
- Search bar with `ring`, `focus:ring`
**Headless UI**
- `Disclosure` for expandable nodes
- `Dialog` for Expert-mode warnings
**Vue behavior**
- Search highlighting via computed match list
- Spoiler toggle hides hidden_model + false_assumption nodes

### ValidationChecklistPanel
**Tailwind**
- `divide-y`, `bg-amber-*`, `bg-emerald-*` status pills
**Headless UI**
- `Disclosure` for expandable fix guidance
**Vue behavior**
- Map checklist to status
- Emits `focusField(fieldPath)` to highlight inputs

### ClueTable
**Tailwind**
- Table styling with `min-w-full`, `divide-y`, `hover:bg-*`
- Filter chips `inline-flex`, `rounded-full`
**Headless UI**
- `Combobox` for search
- `Switch` for red herring toggle
**Vue behavior**
- Points-to column hidden unless spoilers enabled
- Skeleton rows during loading

### OutlineTimeline
**Tailwind**
- Timeline using `border-l`, `pl-*`, `space-y-*`
**Headless UI**
- `Disclosure` for chapter details
**Vue behavior**
- Click clue marker to emit `selectClue(id)`
- Warning banners if clues appear after reveal

### ArtifactVersionTimeline
**Tailwind**
- Vertical timeline with `relative`, `before:` line
- Action buttons in `flex` row
**Headless UI**
- `Dialog` for rollback confirmation
**Vue behavior**
- Compare opens diff modal
- Rollback triggers API call then refreshes artifacts

### SampleCard
**Tailwind**
- Card layout `rounded-lg`, `shadow-sm`, `hover:shadow-md`, `transition`
**Headless UI**
- `Menu` for actions (View/Seed)
**Vue behavior**
- Emits `view`, `seed`

### SpoilerToggle
**Tailwind**
- `inline-flex`, `items-center`, `gap-*`
**Headless UI**
- `Switch`
**Vue behavior**
- First toggle opens confirm `Dialog`
- Persists state in local storage

### RunStatusBanner
**Tailwind**
- `sticky`, `top-0`, `bg-*`, `backdrop-blur`
- Progress bar `h-1`, `bg-*`
**Headless UI**
- `Menu` for retry/cancel actions
**Vue behavior**
- Subscribes to SSE for run updates
- Spinner while active

## Form fields
### SettingForm
- decade (select)
- locationPreset (select)
- weather (select)
- socialStructure (select)
- institution (select)

### CastForm
- cast size (slider)
- detective type (select)
- victim archetype (select)
- suspect roles (multi-select)
- relationshipPreset (select)
- secretIntensity (select)

### LogicForm
- primaryAxis (radio)
- mechanismFamilies (multi-select)
- fairPlay toggles (checkboxes)
- clueDensity (select)
- redHerringBudget (slider)

### OutputForm
- output format (multi-select)
- POV (select)
- tone (select)
- length (select)
- chapters (number input when applicable)
- writing style mode (radio)
- writing style text (textarea)
- guardrails (chips)

## UX behaviors
- Non-blocking validation; hard blocks only on schema violations
- Granular regenerate per artifact
- SSE progress updates
- Version timeline with rollback

## Navigation and UX considerations

### Navigation model
- Primary nav: left rail with top-level views (Dashboard, Builder, Clues, Outline, Samples)
- CML appears only when Advanced/Expert mode is enabled
- Secondary nav: context tabs within Builder (Setting/Cast/Logic/Output)
- Persistent status area: RunStatusBanner visible across all views

### Routing and deep links
- Each view has a stable route with project ID
- Deep link to artifacts (e.g., /projects/:id/cml) available only in Advanced/Expert mode
- Preserve wizard step in URL query (e.g., ?step=cast)

### UX flow guidance
- First-time users: guided tooltip tour on Builder view
- Progressive disclosure: hide advanced options until base inputs are completed
- Confirmation modals for destructive actions (rollback, overwrite, regenerate all)
- Accept/Reject workflow for AI outputs: users can approve, reject, or edit each generated item before it becomes active

### State continuity
- Preserve unsaved form state when navigating between views
- Warn on navigation if unsaved changes exist
- Autosave drafts on idle (e.g., 2–3 seconds after last change)
- Draft vs accepted states: AI outputs are “draft” until user accepts; rejected items are archived but not active

### Feedback and affordances
- Highlight active nav item
- Provide breadcrumb for project context
- Use consistent iconography for artifacts and status
- Inline helper text for unfamiliar terms (e.g., false_assumption)

## Accessibility
- Keyboard navigation
- Contrast-compliant themes
- Spoiler-safe defaults
- Advanced/Expert mode warnings for CML exposure and edits
