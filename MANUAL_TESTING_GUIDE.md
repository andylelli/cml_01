# Manual Testing Guide - Phase 2 Features

## Prerequisites
- Services running: API (port 3001), Worker (port 4000), Web (port 3000)
- Run `.\start-app.bat` to start all services
- Open http://localhost:3000 in browser

## Test Checklist

### 1. Error Notification System
**Location**: Top-right corner of screen

**Test Steps**:
1. Try to run pipeline without creating project first
2. Try to run pipeline without filling spec
3. Create multiple errors in quick succession

**Expected Behavior**:
- [ ] Error notifications appear in top-right
- [ ] Each notification shows:
  - Severity icon (❌ error, ⚠️ warning, ℹ️ info)
  - Severity-colored background (rose for error, amber for warning, blue for info)
  - Scope label
  - Error message
  - Timestamp
  - Dismiss button (X)
- [ ] Maximum 3 notifications visible at once
- [ ] "+N more" indicator when >3 errors exist
- [ ] Newest errors appear first (descending timestamp)
- [ ] Clicking X dismisses the notification
- [ ] Notifications stack vertically with gap

### 2. Validation Panel
**Location**: Left sidebar, "Validation" section

**Test Steps**:
1. Create a project and fill out spec
2. Run pipeline (if LLM configured) or simulate validation data
3. Click on each artifact section (Setting, Cast, CML, Clues, Outline)
4. Check sections with errors, warnings, and valid status

**Expected Behavior**:
- [ ] All 5 artifacts appear:
  - Setting
  - Cast
  - CML (only visible in Advanced/Expert mode)
  - Clues
  - Outline
- [ ] Each section has:
  - Icon (✅ valid, ⚠️ warnings, ❌ errors)
  - Artifact name
  - Error/warning count badge (amber circle with white text)
- [ ] Sections are expandable/collapsible:
  - Click to expand → shows list of errors/warnings
  - Click again to collapse
  - Only expands when hasIssues() is true
- [ ] Multiple sections can be expanded simultaneously
- [ ] Error/warning messages are readable
- [ ] Valid artifacts show ✅ with no badge

### 3. Prose Reader
**Location**: Main content area when "Prose" view selected

**Test Steps**:
1. Generate prose by running pipeline with valid spec and LLM configured
2. Click on different chapters in sidebar
3. Use Prev/Next buttons
4. Check first and last chapter boundary behavior

**Expected Behavior**:
- [ ] Chapter list appears in left sidebar
- [ ] Each chapter shows:
  - Chapter number
  - Chapter title
- [ ] Current chapter is highlighted (bg-slate-900 with rounded corners)
- [ ] Main area shows:
  - Chapter title (large text)
  - Chapter summary (if present)
  - Prose paragraphs
- [ ] Navigation controls:
  - "Prev" button disabled on first chapter
  - "Next" button disabled on last chapter
  - Progress indicator: "Chapter X of Y"
- [ ] Clicking chapter in sidebar navigates to it
- [ ] Clicking Prev/Next buttons navigates correctly
- [ ] Empty state: "Prose not yet generated" if no data

### 4. Run History
**Location**: Left sidebar, "History" section

**Test Steps**:
1. Run pipeline multiple times
2. Create runs with different statuses (success, failure)
3. Check event icons and messages

**Expected Behavior**:
- [ ] Events appear in chronological order (oldest first)
- [ ] Each event shows:
  - Icon based on message content:
    - ✅ for "done", "complete", "success"
    - ❌ for "fail", "error"
    - ⚠️ for "retry", "warning"
    - • (bullet) for other messages
  - Step name
  - Message text
- [ ] Events are grouped by run
- [ ] Run ID displayed: "Run ID: {uuid}"
- [ ] Timeline is scrollable if many events
- [ ] Empty state: "No run history available" if no events
- [ ] Events update in real-time during pipeline execution (via SSE)

### 5. Novelty Audit
**Location**: Left sidebar, "Novelty Audit" section

**Test Steps**:
1. Generate CML and run novelty audit
2. Check different audit statuses (pass, fail, warn)
3. Review similarity percentages and pattern matches

**Expected Behavior**:
- [ ] Status badge shows:
  - "Pass" (emerald green) - no significant similarity
  - "Fail" (rose red) - too similar to seed
  - "Warn" (amber yellow) - borderline similarity
- [ ] Seed IDs listed: "Seeds checked: seed1, seed2, seed3"
- [ ] Pattern matches section shows:
  - Seed name
  - Similarity percentage (whole number, 0-100)
  - Similarity color coding:
    - Red text: >70% similarity
    - Amber text: 40-70% similarity
    - Green text: <40% similarity
  - List of matching patterns
- [ ] Summary text (if present)
- [ ] Empty state: "No audit results yet" if not run

### 6. Export Panel
**Location**: Right sidebar or bottom (check UI spec)

**Test Steps**:
1. Generate complete game pack
2. Click export buttons for different formats

**Expected Behavior**:
- [ ] Export buttons available for:
  - PDF
  - Markdown
  - JSON
- [ ] Clicking button downloads file
- [ ] File contains correct data
- [ ] File naming includes project name/timestamp
- [ ] Disabled state if no data to export

### 7. Console Error Check
**Location**: Browser Developer Tools (F12)

**Test Steps**:
1. Open browser console
2. Navigate through all views
3. Trigger various actions (create project, run pipeline, etc.)

**Expected Behavior**:
- [ ] No red console errors (exceptions allowed: Vite HMR messages in dev)
- [ ] No 404 errors for resources
- [ ] No TypeScript/Vue warnings
- [ ] API calls succeed (check Network tab)
- [ ] SSE connection established for real-time updates

### 8. Responsive Design
**Location**: Resize browser window or use mobile device

**Test Steps**:
1. Resize browser to narrow width (mobile size)
2. Test on tablet width
3. Test on ultra-wide desktop

**Expected Behavior**:
- [ ] Sidebar adapts to screen size:
  - Desktop: Fixed sidebar on left
  - Mobile: Collapsible/hamburger menu
- [ ] Error notifications remain visible and readable
- [ ] Content area doesn't overflow
- [ ] Navigation buttons remain accessible
- [ ] Text remains readable (no tiny font sizes)
- [ ] Touch targets are adequate size (44x44px minimum)

## Known Limitations (Phase 1)

1. **Auto-dismiss**: Error notifications do not auto-dismiss yet
2. **Preview limit**: Run history does not have "max events" preview feature
3. **Note display**: Prose reader note display needs verification
4. **CML visibility**: CML validation panel requires mode header check
5. **Project listing**: No GET /api/projects endpoint (only POST and GET /:id)

## Test Data Requirements

- **For full testing**: LLM API key configured in environment
- **For partial testing**: Can simulate data by directly setting component props in browser console
- **Seed CMLs**: Available in `examples/` folder for novelty testing

## Troubleshooting

### Services not starting
- Check if ports 3000, 3001, 4000 are available
- Look for error messages in terminal windows
- Verify database connection

### No data appearing
- Check browser console for API errors
- Verify API server is responding: `curl http://localhost:3001/api/health`
- Check that database has projects/data

### Components not rendering
- Check Vue DevTools (F12 → Vue tab)
- Verify component imports in App.vue
- Check for JavaScript errors in console

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Console errors (F12 → Console)
3. Network errors (F12 → Network)
4. Steps to reproduce
5. Expected vs actual behavior
6. Screenshots if UI issue
