# UI Remediation Plan

**Date**: February 6, 2026  
**Status**: Remediation Plan (Planned)  
**Goal**: Make the default UI effortless, non-technical, and self-sufficient

---

## Executive Summary

The current UI has three critical problems:
1. **Visibility**: Generated content (novelty audit, prose, validation details, run history) exists but isn't shown
2. **Error Handling**: Inconsistent, non-persistent, incomplete error feedback
3. **Workflow**: Non-linear navigation makes it hard to understand progress and next steps

This plan addresses all three through a phased approach that can be implemented incrementally.

**Note**: This document now focuses only on remaining remediation work. Completed phases have been removed for clarity.

---

## UI Audit + Simplification Plan (February 12, 2026) — PLANNED

**Goal**: Make the UI feel effortless and non-technical. Default experience should "just work" without manual API checks, refresh actions, or data management steps. Technical details move behind Advanced/Expert and are optional.

### Audit Findings (Current UI Friction)
**Too technical in default path**
- API health status is visible in the main Generate view.
- Manual “Refresh data” action is presented on Results.
- Validation panels expose raw error structures.
- LLM logs and raw artifact views are prominent in Advanced flows.

**Too much cognitive load**
- Multiple tabs expose workflow internals instead of a guided, friendly flow.
- Error messages often feel operational (API/run wording) instead of user-centered.

**Feedback gaps**
- Some actions acknowledge completion but lack micro-feedback (soft animations, state transitions).
- Empty states are informative but not always inviting or goal-oriented.

### Design Principles (Default Experience)
- **Invisible infrastructure**: No API health checks, no manual refreshes, no technical artifacts.
- **Guided flow**: Start → Generate → Explore results; keep navigation shallow.
- **Friendly language**: Replace system/ops text with user-focused copy.
- **Automatic recovery**: If data is missing after refresh, auto-retry in the background and surface a calm message only if it fails.
- **Progressive disclosure**: Advanced/Expert hold technical controls; default stays clean.

### Proposed UI Changes (Phase 3)
**Navigation & layout**
- Consolidate the top-level experience into three primary spaces: **Create**, **Generate**, **Results**.
- Move History, Logs, Validation, and Raw Artifacts behind an “Advanced” drawer.

**Generate view**
- Remove API health indicator from the default UI.
- Replace with a single friendly status area: “We’re building your mystery…”
- Keep a small, non-technical progress indicator with step names only.

**Results view**
- Remove “Refresh data” from primary actions.
- Auto-refresh artifacts when the run ends and show a subtle “Updated just now” label.
- Add a “What’s next?” panel with suggested actions (e.g., explore clues, read outline).

**Validation & errors**
- Default users see a plain-language “Fix suggestions” list, not raw validation output.
- Only Advanced/Expert see raw validation data, errors, and technical details.

**Feedback & delight**
- Add micro-interactions (subtle transitions on state changes, animated checkmarks on completion).
- Introduce calmer, welcoming empty states with one clear next action.
- Success toasts should be short, positive, and specific (“Clues are ready”).
- Use Font Awesome icons for status, with spinners and loader bars during active work.

### Implementation Plan (Phase 3)
1) **UI copy pass**: Replace system language with user-friendly phrasing across default views.
2) **Technical surface reduction**: Remove API health, manual refresh, and ops terminology from default views; move to Advanced drawer.
3) **Auto-refresh behavior**: Ensure artifacts auto-load after idle status with silent retries.
4) **Feedback polish**: Add micro-animations and action-confirmation cues.
5) **Empty-state redesign**: Focus on “what to do next,” not “what is missing.”
6) **Iconography & loading cues**: Standardize Font Awesome icons, spinners, and loader bars across active states.

### Low-Level Remediation Plan (Detailed)

#### 0) Baseline audit & inventory (1 day)
- Inventory all user-facing copy strings in the default path.
  - Primary views: Results, Generate, Builder wizard, Project dashboard.
  - Components: RunStatusBanner, ValidationPanel, ErrorNotification, ProseReader, RunHistory, NoveltyAudit.
- Capture screenshots of current default UI flows for before/after comparison.
- Identify all UI surfaces showing technical details by default:
  - API health badges
  - Manual “Refresh data” buttons
  - Raw validation data
  - Run history timelines

#### 1) Default navigation simplification (1–2 days)
- Reduce top-level nav to **Create / Generate / Results** for default mode.
- Move History, Validation, Logs, Raw Artifacts, CML Viewer into an **Advanced drawer**.
- Ensure Advanced/Expert toggles explicitly control visibility of technical panels.
- Add a “More details” affordance in Results that opens the Advanced drawer (Advanced mode only).

#### 2) Generate view cleanup (1 day)
- Remove API health indicator from default Generate view.
- Replace with a single friendly status area:
  - “We’re building your mystery…”
  - Show step names only (Setting → Cast → Logic → Clues → Outline → Prose → Pack)
- Add a Font Awesome spinner icon and a thin loader bar while a run is active.
- Status: Completed in current build.
- Replace technical error messages with user-facing recovery copy:
  - “We hit a snag. We’ll retry automatically.”
  - If retries fail: “Please try again in a moment.”

#### 3) Results view cleanup (1–2 days)
- Remove “Refresh data” from primary actions.
- Add auto-refresh on run completion and show “Updated just now” label.
- Replace “artifact availability” with a single “Ready” chip per section.
- Add a “What’s next?” panel with three suggested actions:
  - “Explore clues”
  - “Read outline”
  - “Open the party kit”
- Use Font Awesome check/circle icons for ready states and a small spinner during refresh.
- Status: Completed (refresh removed; “What’s next?” panel added; ready chips + updated label added; friendly fixes added).

#### 4) Validation rework (2 days)
- Default users see a **Fix Suggestions** panel (plain language).
- Advanced/Expert can expand to see the full validation detail.
- Map validation errors to user-friendly bullets (e.g., “A key clue appears after the reveal. Move it earlier.”).
- Ensure Fix Suggestions update on regeneration.
- Status: Completed (Fix Suggestions panel with fine-grained mapping; Advanced-only details expandable; regeneration-aware updates implemented).

#### 5) Error handling rewording (1 day)
- Replace system/ops words (“API”, “pipeline”, “artifact”) in default error surfaces.
- Add guidance in plain language:
  - “Try again” button instead of “Retry step.”
  - “Save draft” when generation fails mid-run.
- Keep detailed error payloads behind Advanced/Expert.
- Status: Completed (default copy updated; “Try again”/“Save draft” buttons added with retry wiring; advanced-only details now expandable).

#### 6) Feedback polish (1–2 days)
- Add subtle animations for:
  - Step completion checkmarks
  - Section readiness chips
  - Toasts (fade-in/out)
- Replace generic success toast text with specific confirmations:
  - “Clues are ready.”
  - “Outline is ready.”
  - “Your mystery is complete.”
- Standardize Font Awesome usage:
  - Running: `faSpinner` / `faCircleNotch` (spin)
  - Success: `faCircleCheck`
  - Warning: `faTriangleExclamation`
  - Error: `faCircleXmark`
  - Info: `faCircleInfo`
- Add a thin indeterminate loader bar to all long-running actions (run, regenerate, export).
- Status: Completed (export + update loaders added; readiness chips animate; success toasts already specific).

#### 7) Empty state improvements (1 day)
- Rewrite empty states to be action-oriented.
- Add a single primary action in each empty state (“Start generating”, “Add a cast”, etc.).
- Ensure empty states never mention technical backend concepts.
- Status: Completed (core + advanced empty states updated with friendly actions).

#### 8) Regression checks (1 day)
- Verify Advanced/Expert still show technical panels and raw data.
- Ensure default mode hides CML, logs, validation detail, and run history.
- Confirm automatic refresh works end-to-end without manual actions.
- Validate results always show meaningful next steps.
- Status: Completed (automated UI tests passing; manual spot-checks recommended).

### Acceptance Criteria
- A first-time user can generate and browse results without seeing API/validation/log concepts.
- No manual refresh or update actions are required in the default path.
- The UI explains next steps in friendly language at all times.
- Advanced/Expert still provide full technical visibility when explicitly enabled.
- [ ] Add error prevention:
  - Disable actions that would fail
  - Show warnings before destructive actions
  - Validate inputs before submission
  - Show required dependencies

**Acceptance Criteria**:
- Errors classified correctly
- Recovery actions available
- Prevention mechanisms in place
- User never stuck on error

---

### 4.2 Validation Error Enhancement

**Goal**: Make validation errors actionable

**Tasks**:
- [ ] Parse validation errors into structured format:
  - Field path (e.g., "CASE.cast[0].name")
  - Rule violated (e.g., "required", "minLength")
  - Current value (if safe to show)
  - Expected value/format
- [ ] Link validation errors to inputs:
  - Click error → jump to field
  - Highlight invalid fields in UI
  - Show inline error messages
- [ ] Add validation preview:
  - "Check for errors" button
  - Run validation before submission
  - Show potential issues early
- [ ] Add validation suggestions:
  - "Fix automatically" where possible
  - Example valid values
  - Documentation links

**Acceptance Criteria**:
- Validation errors detailed
- Errors linked to inputs
- Preview before submit
- Auto-fix where safe

---

### 4.3 Error Logging and Debugging

**Goal**: Support troubleshooting

**Tasks**:
- [ ] Add error log view:
  - Chronological error list
  - Filter by severity/scope
  - Export error log
  - Clear log option
- [ ] Enhance activity logging:
  - Log all errors with stack traces
  - Include relevant state at error time
  - Add error correlation IDs
- [ ] Add debug panel (Expert mode):
  - Raw API responses
  - State inspection
  - Network request log
  - Performance metrics
- [ ] Add error reporting:
  - Copy error details to clipboard
  - Generate error report
  - Include relevant context

**Acceptance Criteria**:
- Error log accessible
- Debug info available (Expert)
- Easy error reporting
- Support troubleshooting

---

## Phase 5: Progress and Status (Medium Priority - Week 4-5)

### 5.1 Real-Time Progress Updates

**Goal**: Show live pipeline progress

**Tasks**:
- [ ] Create `ProgressIndicator.vue` component:
  - Step-by-step progress visualization
  - Current step highlighted
  - Estimated time remaining
  - Elapsed time display
- [ ] Enhance SSE integration:
  - Parse event types into progress steps
  - Update progress in real-time
  - Show step status (pending/running/complete/failed)
- [ ] Add progress notifications:
  - Toast for each completed step
  - Error toast for failures
  - Success notification on completion
- [ ] Add cancel/abort option:
  - Stop running pipeline (if API supports)
  - Confirmation dialog
  - Cleanup on abort

**Acceptance Criteria**:
- Progress visible in real-time
- Step status clear
- Time estimates shown
- Can abort if needed

---

### 5.2 Artifact Status Tracking

**Goal**: Show what's ready vs. pending

**Tasks**:
- [ ] Create artifact status dashboard:
  - Grid of all artifact types
  - Visual status per artifact
  - Timestamp of last generation
  - Quick actions (view, regenerate, export)
- [ ] Add status badges throughout UI:
  - In tab labels
  - In sidebar panels
  - In dashboard cards
- [ ] Add dependency visualization:
  - Show what depends on what
  - Highlight missing dependencies
  - Explain why something can't generate
- [ ] Add refresh indicators:
  - Show when artifact is stale
  - "Regenerate recommended" warnings
  - Version tracking

**Acceptance Criteria**:
- All artifact statuses visible
- Dependencies clear
- Stale content flagged
- Easy to refresh

---

## Phase 6: Polish and UX (Low Priority - Week 5-6)

### 6.1 Visual Improvements

**Tasks**:
- [ ] Add loading skeletons for content areas
- [ ] Improve empty states with illustrations
- [ ] Add micro-animations for state transitions
- [ ] Improve typography hierarchy
- [ ] Add dark mode support
- [ ] Improve mobile responsiveness

---

### 6.2 Keyboard Shortcuts

**Tasks**:
- [ ] Add keyboard navigation:
  - Tab switching (Ctrl+1-6)
  - Quick actions (Ctrl+S = save, Ctrl+G = generate)
  - Navigate clues (J/K)
  - Navigate chapters (←/→)
- [ ] Add shortcut help panel (press ?)
- [ ] Add accessibility improvements

---

### 6.3 Performance Optimization

**Tasks**:
- [ ] Implement virtual scrolling for large lists
- [ ] Lazy load tab content
- [ ] Cache API responses
- [ ] Debounce rapid API calls
- [ ] Optimize re-renders

---

## Phase 7: Advanced Features (Future)

### 7.1 Comparison Mode

**Tasks**:
- [ ] Side-by-side artifact comparison
- [ ] Diff viewer for regenerations
- [ ] Version history
- [ ] Rollback to previous versions

---

### 7.2 Collaboration Features

**Tasks**:
- [ ] Share project by link
- [ ] Comment system
- [ ] Suggested edits
- [ ] Activity feed

---

### 7.3 Templates and Presets

**Tasks**:
- [ ] Save spec as template
- [ ] Community template gallery
- [ ] Template ratings/reviews
- [ ] Quick start templates

---

## Implementation Strategy

### Approach
- **Incremental**: Each phase deliverable independently
- **Feature flags**: Roll out behind flags for testing
- **Backward compatible**: Don't break existing functionality
- **Test coverage**: Add tests for new components
- **Documentation**: Update docs as we go

### Risk Mitigation
- Keep old navigation as fallback initially
- Test on multiple screen sizes
- Get user feedback after Phase 3
- Monitor performance impact
- Have rollback plan for each phase

### Success Metrics
- **Phase 1**: Zero ad-hoc error handling, all errors visible
- **Phase 3**: 80%+ users report improved navigation
- **Phase 4**: 50% reduction in "stuck" support requests
- **Overall**: Time to complete workflow reduced by 30%

---

## Dependencies

### Technical
- Vue 3 reactivity system (already in place)
- Tailwind CSS (already configured)
- SSE infrastructure (already working)
- API endpoints (all exist)

### Design
- Need tab component designs
- Need error notification designs
- Need progress indicator designs
- Need status badge designs

### Content
- Help text for onboarding
- Error message copy
- Tooltip content
- Documentation updates

---

## Open Questions

1. **Tab persistence**: Should active tab persist across sessions?
2. **Mobile strategy**: Stack tabs vertically on mobile?
3. **Historical runs**: Should we support viewing old run results?
4. **CML editing**: Should Expert mode allow inline CML editing?
5. **Validation timing**: Validate on blur, on submit, or on demand?
6. **Error retention**: How long should errors stay in log?
7. **Progress granularity**: How detailed should progress steps be?

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Finalize tab structure** and get design approval
3. **Create detailed tickets** for Phase 1 tasks
4. **Set up feature flags** for gradual rollout
5. **Begin Phase 1** implementation
6. **Schedule design sessions** for custom components

---

## Appendix A: Current State Inventory

### What Works Well
- ✅ Project creation flow
- ✅ Spec configuration UI
- ✅ SSE connection for status
- ✅ Artifact loading
- ✅ Mode switching (user/advanced/expert)
- ✅ Export functionality
- ✅ Sample browser

### What Needs Improvement
- ⚠️ Non-linear navigation
- ⚠️ Inconsistent error handling
- ⚠️ Missing content displays
- ⚠️ No progress indication
- ⚠️ Incomplete validation display
- ⚠️ No workflow guidance

### What's Missing
- ❌ Prose reader
- ❌ Novelty audit display
- ❌ Run event log
- ❌ Complete validation details
- ❌ Error history
- ❌ Progress tracking
- ❌ Dependency visualization
- ❌ Recovery actions

---

## Appendix B: Wireframe Sketches

### Main Layout with Tabs
```
┌────────────────────────────────────────────────────────────────┐
│  CML Whodunit Builder          Project: Golden Age Mystery     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐   [🔕] [👤]      │
│  │Proje.│ Spec │ Gen. │Review│Adv.  │Export│                   │
│  └──────┴──────┴──────┴──────┴──────┴──────┘                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Tab Content Area]                                      │   │
│  │                                                         │   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────┐  ┌────────────────────────────┐  │
│  │ Status Panel            │  │ Actions Panel              │  │
│  │ • Setting: ✅           │  │ [Generate] [Save] [Export] │  │
│  │ • Cast: ✅              │  │                            │  │
│  │ • CML: 🔵 generating    │  │ Progress: ████░░░░░  65%   │  │
│  └─────────────────────────┘  └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Error Notification
```
┌────────────────────────────────────────┐
│ ⚠️ Validation Error                    │
│ CML validation failed (3 errors)      │
│                                        │
│ • CASE.cast[0].name is required       │
│ • CASE.meta.decade must be 1930s-50s  │
│ • CASE.culpability.culprits is empty  │
│                                        │
│ [View Details] [Dismiss]         [×]  │
└────────────────────────────────────────┘
```

### Progress Indicator
```
Pipeline Progress                    [Cancel]

1. ✅ Setting       (0.5s)
2. ✅ Cast          (1.2s)  
3. 🔵 CML           generating...
4. ⚪ Validation    pending
5. ⚪ Clues         pending
6. ⚪ Outline       pending
7. ⚪ Prose         pending

Elapsed: 3.2s  •  Estimated: 8s remaining
```
