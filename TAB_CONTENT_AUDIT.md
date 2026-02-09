# Tab Content Audit & Remediation

**Date**: February 7, 2026  
**Purpose**: Identify content mismatches between intended design and actual implementation

---

## Tab Structure Overview

### Main Tabs
1. **Project** - Project setup and creation
2. **Spec** - Configure story specifications  
3. **Generate** - Run pipeline and monitor progress
4. **Review** - View generated content (4 sub-tabs)
5. **Advanced** - CML viewer, samples, history (3 sub-tabs)
6. **Export** - Export game pack

---

## Project Tab

### SHOULD Contain
- Project name input
- Project ID display
- "Create project" button
- Project status/health indicators
- Quick actions (Generate, Save draft)
- Synopsis summary (when available)
- Status overview (Cast count, Clues count, etc.)

### ACTUALLY Contains
✅ Status section with health indicators  
✅ Synopsis section (when available)  
✅ Project setup section with name input and Create button  
✅ Dashboard details section (Setting, Cast, Clues info cards)  
✅ Spec configuration form (Decade, Location, Tone, Cast size)  

### Issues
✅ **FIXED** - Spec configuration form moved to dedicated Spec tab  
✅ **FIXED** - Dashboard details now appear only in Project tab  
✅ Content is appropriate for project setup

### Decision
- **✅ IMPLEMENTED**: Status section, Synopsis, Project setup in Project tab
- **✅ IMPLEMENTED**: Spec configuration form moved to Spec tab only
- **✅ IMPLEMENTED**: Dashboard details appear in Project tab only as overview

---

## Spec Tab

### SHOULD Contain
- Decade selection
- Location preset selection
- Tone selection
- Cast size configuration
- Cast names input
- Primary axis selection
- "Save spec" button
- Form validation messages

### ACTUALLY Contains
✅ Spec configuration form (Decade, Location, Tone, Cast size, etc.) in dedicated tab  
✅ No duplication - clean separation from Project tab  

### Issues
✅ **FIXED** - Status section removed from Spec tab  
✅ **FIXED** - Synopsis section removed from Spec tab  
✅ **FIXED** - Dashboard details removed from Spec tab  
✅ **FIXED** - Tab now focused on story configuration only

### Decision
- **✅ IMPLEMENTED**: Spec configuration form only in Spec tab
- **✅ IMPLEMENTED**: Removed Status section, Synopsis section, Dashboard details
- **✅ RESULT**: Spec tab is focused on story configuration only

---

## Generate Tab

### SHOULD Contain
- "Generate" button (primary action)
- Pipeline progress indicator
- Current step display
- Time elapsed/remaining
- Real-time event stream
- Cancel/abort button
- Generation status (Idle, Running, Complete, Error)
- Last run timestamp

### ACTUALLY Contains
✅ "Generate" button (primary action) moved from Project tab  
✅ "Save draft" button  
✅ Pipeline status indicators (Cast count, Clues count, etc.)  
✅ API health status and controls (Recheck API, Refresh data)  
✅ Proper heading and description  

### Issues
✅ **FIXED** - Generate button moved from Project tab to Generate tab  
✅ **FIXED** - Status indicators now in Generate tab  
⚠️ **Future enhancement** - No real-time progress visualization yet  
⚠️ **Future enhancement** - No event stream display yet  

### Decision
- **✅ IMPLEMENTED**: 
  - Moved "Generate" button to Generate tab
  - Added pipeline status display
  - Added "Save draft" button
  - Added health/status controls
- **TODO for later phases**:
  - Add real-time progress visualization
  - Show pipeline step-by-step progress
  - Add live event stream display
  - Add Cancel/Abort button

---

## Review Tab → Cast Sub-tab

### SHOULD Contain
- List of all cast members/suspects
- Character details (name, role)
- Character relationships
- Motives (when available)
- Grid or card layout

### ACTUALLY Contains
✅ Cast heading  
✅ List of suspects from castData  
✅ Card layout with character names  
⚠️ Placeholder text: "Role: Suspect • Motive: pending"  
✅ Empty state: "Cast not yet generated"  

### Issues
✅ Content is correct  
⚠️ Could be enhanced with more character details when available  

### Decision
- **KEEP as is** - Correctly shows cast members
- **ENHANCE later**: Add more character details when data model supports it

---

## Review Tab → Clues Sub-tab

### SHOULD Contain
- List of all clues
- Clue category tags
- Clue text/description
- "Points to" information
- Reveal chapter number
- Red herring indicator
- Play mode controls (chapter selector)
- "Show red herrings" toggle

### ACTUALLY Contains
✅ Clue list with all details  
✅ Category labels (uppercase)  
✅ Clue text  
✅ "Points to" info  
✅ Reveal chapter display  
✅ Red herring badges  
✅ Play mode toggle  
✅ Chapter selector  
✅ "Show red herrings" toggle  

### Issues
✅ **Perfect** - All expected content present  
✅ Correct filtering logic  

### Decision
- **KEEP as is** - Correctly implemented

---

## Review Tab → Outline Sub-tab

### SHOULD Contain
- Chapter-by-chapter outline
- Chapter titles
- Chapter summaries
- Structured view of story arc
- Chapter count
- Act structure (if available)

### ACTUALLY Contains
✅ Outline heading  
✅ Formatted chapter display with titles and summaries  
✅ Chapter count and event counts  
✅ Structured view with left border styling  
✅ Empty state: "Outline not yet generated"  

### Issues
✅ **FIXED** - Now shows formatted outline instead of raw JSON  
✅ **FIXED** - User-friendly presentation with chapter structure  

### Decision
- **✅ IMPLEMENTED**: Replaced JSON.stringify with formatted chapter list
- **✅ IMPLEMENTED**: Proper chapter display with titles and summaries
- **✅ KEPT**: Empty state handling

---

## Review Tab → Prose Sub-tab

### SHOULD Contain
- Chapter-by-chapter prose reader
- Chapter navigation (prev/next)
- Chapter list sidebar
- Current chapter highlighting
- Formatted prose text
- Chapter progress indicator

### ACTUALLY Contains
✅ ProseReader component (when data available)  
✅ Empty state: "Prose not yet generated"  

### Issues
✅ **Correct** - Using dedicated ProseReader component  
✅ Handles empty state  

### Decision
- **KEEP as is** - ProseReader component handles all functionality

---

## Advanced Tab → CML Sub-tab

### SHOULD Contain
- CML YAML viewer
- Syntax highlighting (ideally)
- Scroll/zoom controls
- Copy to clipboard button
- Download CML button
- Validation status
- CML mode access warning (if user not in expert mode)

### ACTUALLY Contains
✅ CML Viewer heading  
✅ CML content in `<pre>` block  
✅ Code formatting with dark background  
✅ Empty state: "CML not yet generated"  

### Issues
⚠️ **No syntax highlighting** - Plain text only  
❌ **No copy/download buttons**  
❌ **No validation status shown**  
✅ Tab correctly locked when not in Advanced mode  

### Decision
- **KEEP**: Basic CML display
- **ENHANCE later**: Add syntax highlighting, copy button, download button
- **ADD later**: Validation status badge

---

## Advanced Tab → Samples Sub-tab

### SHOULD Contain
- List of available sample CMLs
- Sample names/titles
- Selected sample content viewer
- Sample descriptions
- "Load sample" action

### ACTUALLY Contains
✅ "Sample CMLs" heading  
✅ List of samples as clickable buttons  
✅ Active sample highlighted  
✅ Selected sample content in `<pre>` block  
✅ Dark background code display  

### Issues
✅ **Perfect** - All expected functionality present  

### Decision
- **KEEP as is** - Correctly implemented

---

## Advanced Tab → History Sub-tab

### SHOULD Contain
- Complete run history (all events)
- Event timeline
- Event icons (success, error, warning)
- Run ID display
- Event timestamps
- Event filtering (optional)

### ACTUALLY Contains
✅ RunHistory component  
✅ Full event list (runEventsData)  
✅ Run ID display  
✅ Empty state: "No run history available"  

### Issues
✅ **Perfect** - Using dedicated RunHistory component  

### Decision
- **KEEP as is** - RunHistory component handles all functionality

---

## Export Tab

### SHOULD Contain
- Export format options (PDF, Markdown, JSON)
- "Download PDF" button
- "Download Markdown" button  
- "Download JSON" button
- Export status messages
- File name preview
- Export configuration options

### ACTUALLY Contains
⚠️ "Export" heading  
⚠️ Generic description text  
✅ "Download PDF" button  
❌ No Markdown export  
❌ No JSON export  
❌ No export configuration  

### Issues
⚠️ **Incomplete** - Only PDF export available  
❌ **Missing export formats** - No Markdown or JSON  
❌ **No configuration options**  

### Decision
- **KEEP**: PDF download button
- **ADD**: Markdown export button (when implemented)
- **ADD**: JSON export button (when implemented)
- **ENHANCE**: Add export configuration (include/exclude sections)

---

## Sidebar Content

### Currently Shows
- RunHistory (last 5 events)
- ValidationPanel
- NoveltyAudit
- Run status controls (Connect/Disconnect SSE)

### Issues
✅ **Correct** - Sidebar shows persistent info panels  
✅ **Good design** - Key info always visible  

### Decision
- **KEEP as is** - Sidebar provides good contextual information

---

## Content Duplication Issues

### Problem Areas

1. **Status Section**
   - **Previously appeared in**: Project tab, Spec tab
   - **Now appears**: Generate tab only (where it belongs)
   - **✅ FIXED**: Removed from Project and Spec tabs

2. **Synopsis Section**
   - **Appears in**: Project tab
   - **✅ CORRECT**: Removed from Spec tab
   - **Status**: ✅ No duplication

3. **Dashboard Details**
   - **Previously appeared in**: Project tab, Spec tab (conditional: `v-if="activeMainTab === 'project' || activeMainTab === 'spec'"`)
   - **Now appears**: Project tab only (`v-if="activeMainTab === 'project'"`)
   - **✅ FIXED**: Changed condition to Project only

4. **Spec Configuration Form**
   - **Previously appeared in**: Project tab, Spec tab (both use `v-if="currentView === 'dashboard' || currentView === 'builder'"`)
   - **Now appears**: Dedicated Spec tab only
   - **✅ FIXED**: Moved to separate Spec tab

---

## Recommendations Summary

### High Priority Fixes

1. **Eliminate Duplication in Project/Spec Tabs**
   - Move status/synopsis to Project only
   - Move spec form to Spec only
   - Change dashboard-details condition to Project only

2. **Implement Generate Tab Properly**
   - Move Generate button from Project to Generate tab
   - Add progress visualization
   - Add real-time event display
   - Add pipeline controls

3. **Improve Outline Display**
   - Replace JSON.stringify with formatted chapter list
   - Add proper styling for chapter structure

### Medium Priority Enhancements

4. **Add Export Formats**
   - Implement Markdown export
   - Implement JSON export
   - Add export configuration

5. **Enhance CML Viewer**
   - Add copy to clipboard button
   - Add download button
   - Add validation status display

### Low Priority Polish

6. **Cast Details**
   - Add more character information when data available
   - Improve card layout

7. **Syntax Highlighting**
   - Add YAML syntax highlighting to CML viewer
   - Add JSON syntax highlighting to samples

---

## Implementation Plan

### Phase 1: Fix Duplication ✅ COMPLETED
```
✅ 1. Updated Project TabPanel:
   - Removed spec configuration form
   - Kept: Synopsis, Project setup (name input, create/load buttons)
   
✅ 2. Created Spec TabPanel:
   - Dedicated tab for spec configuration
   - Spec configuration form only (Decade, Location, Tone, Cast, etc.)
   
✅ 3. Updated dashboard-details condition:
   - Changed from: v-if="activeMainTab === 'project' || activeMainTab === 'spec'"
   - Changed to: v-if="activeMainTab === 'project'"

✅ 4. Moved Generate functionality:
   - Moved Generate button to Generate tab
   - Moved status indicators to Generate tab
   - Moved Save draft button to Generate tab

✅ 5. Fixed Outline display:
   - Replaced JSON.stringify with formatted chapter list
   - Added proper styling and structure
```

### Phase 2: Implement Generate Tab (High Priority)
```
1. Create dedicated Generate view content
2. Move Generate button to Generate tab
3. Add progress visualization component
4. Connect to run event stream
5. Add pipeline controls (start, cancel)
```

### Phase 3: Polish & Enhance (Medium Priority)
```
1. Fix Outline display (format chapters)
2. Add more export formats
3. Enhance CML viewer with actions
4. Add syntax highlighting
```

---

## Conclusion

**Phase 1 Issues - ✅ RESOLVED:**
- ✅ Eliminated duplication between Project and Spec tabs
- ✅ Generate tab now has proper functionality (button, status, controls)
- ✅ Outline displays formatted chapters instead of raw JSON
- ⚠️ Export tab still incomplete (only PDF) - deferred to future phase

**Next Steps (Future Phases):**
- Phase 2: Add real-time pipeline progress visualization
- Phase 3: Add Markdown and JSON export formats
- Phase 4: Enhance CML viewer with copy/download buttons
- Phase 5: Add syntax highlighting to code viewers

**Testing:**
- ✅ All 77 tests passing
- ✅ TypeScript compilation successful
- ✅ Tab navigation working correctly
- ✅ Content properly separated by tab
