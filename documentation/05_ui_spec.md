# UI Spec (Vue 3 + Tailwind + Headless UI)

## Framework
- Vue 3 (Composition API)
- Tailwind CSS for styling
- Headless UI for accessible unstyled primitives

## Layout
- App shell: left nav + top bar + main content
- Right drawer: CML quick view, validation status, last run
- Responsive: single-column wizard on small screens

## Views
### ProjectDashboard
- Create/clone project
- Recent versions
- Quick actions: regenerate/export

### BuilderWizard
- Stepper with Setting, Cast, Logic, Output
- Live preview card
- Inline validation hints

### CmlViewer
- Tree view with YAML/JSON toggle
- Spoiler toggle for hidden_model + false_assumption
- Schema validation badge

### ClueBoard
- Table with filters by category
- Red herring toggle
- Points-to column gated by spoiler toggle

### OutlineViewer
- Timeline list with clue markers
- Warnings for late load-bearing clues

### SamplesGallery
- Cards for example CMLs
- Seed or clone to project

## Components
- SpecStepper
- SettingForm
- CastForm
- LogicForm
- OutputForm
- CmlTreeView
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

### CmlTreeView
**Purpose:** View CML with spoiler-safe controls.
**Layout:**
- Header: YAML/JSON toggle, Spoiler toggle, Search
- Body: collapsible tree
**Constraints:**
- Hidden sections collapsed and masked unless spoiler enabled
- Search highlights matching nodes
**Feedback:**
- Toggle changes animate smoothly

### ValidationChecklistPanel
**Purpose:** Show checklist compliance with actionable fixes.
**Layout:**
- Sections A–G with status icon
- Each item has status (pass/warn/fail)
- “Fix guidance” expandable text
**Feedback:**
- Failures highlight related fields in forms

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

### SampleCard
**Purpose:** Present sample CMLs with actions.
**Layout:**
- Title, author, axis, decade, short summary
- Buttons: View, Seed, Clone
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

## Interaction feedback
- Buttons: hover (bg + shadow), active (pressed), focus-visible (ring)
- Toggle switches: animated thumb with color change
- Loaders: spinners for actions, skeletons for data tables
- Toasts: success, warning, error with clear message and retry links

## Error and empty states
- Empty states: icon + message + primary action button
- Errors: show inline + top summary; avoid modal-only errors
- Retry: provide retry button per step

## Component-by-component framework mapping (Tailwind + Headless UI + Vue)

### SpecStepper
**Tailwind building blocks**
- `flex`, `gap-*`, `border`, `rounded-*`, `bg-*`, `shadow-sm`
- Step list: `ul` with `li` using `before:` status dots
**Headless UI**
- `Disclosure` for step details (optional on mobile)
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
- `Menu` for actions (View/Seed/Clone)
**Vue behavior**
- Emits `view`, `seed`, `clone`

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
- Primary nav: left rail with top-level views (Dashboard, Builder, CML, Clues, Outline, Samples)
- Secondary nav: context tabs within Builder (Setting/Cast/Logic/Output)
- Persistent status area: RunStatusBanner visible across all views

### Routing and deep links
- Each view has a stable route with project ID
- Deep link to artifacts (e.g., /projects/:id/cml)
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
