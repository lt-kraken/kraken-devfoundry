# Website Slices: Collaboration Registry

This file is the **source of truth** for parallel agent sessions. Each slice owns specific files and must not edit files outside its boundary without explicit session permission.

## Current Status

| Slice | Status | Owner | Last Updated |
|-------|--------|-------|--------------|
| `navigation-shell` | available | — | 2026-04-04 |
| `instruction-panel` | available | — | 2026-04-04 |
| `editor-files` | available | — | 2026-04-04 |
| `execution-console` | available | — | 2026-04-04 |
| `integration-service` | available | — | 2026-04-04 |

---

## Slice Definitions

### 1. navigation-shell
**Purpose**: Top navigation bar and course sidebar  
**Owned Files**:
- `frontend/src/components/Topbar.tsx`
- `frontend/src/components/CourseSidebar.tsx`

**Responsibilities**:
- Header navigation and branding
- Course/module/lesson selector navigation
- XP display and user profile menu
- Responsive mobile/tablet/desktop breakpoints for sidebar collapse

**Shared Dependencies** (read-only):
- `frontend/src/types/learning.ts` — types only
- `frontend/src/hooks/useLessonWorkspace.ts` — read callbacks only (do not modify)

**Blocked Files** (do not edit):
- `frontend/src/features/course/LessonWorkspace.tsx`
- `frontend/src/hooks/useLessonWorkspace.ts`
- `frontend/src/services/learningService.ts`

**Definition of Done**:
- Navigation items render and respond to click events
- Course/section/lesson hierarchy displays correctly
- XP display updates when hook emits changes
- Responsive behavior: sidebar hidden on mobile, visible on lg: breakpoint
- No TypeScript errors; Tailwind styles applied consistently

---

### 2. instruction-panel
**Purpose**: Right sidebar with lesson description, steps, hints, and rewards  
**Owned Files**:
- `frontend/src/components/InstructionPanel.tsx`

**Responsibilities**:
- Lesson title and description display
- Step list with completion checkboxes
- AI hint accordion/expandable display
- XP reward summary
- Responsive right panel layout

**Shared Dependencies** (read-only):
- `frontend/src/types/learning.ts` — types only

**Blocked Files** (do not edit):
- `frontend/src/features/course/LessonWorkspace.tsx`
- `frontend/src/hooks/useLessonWorkspace.ts`
- `frontend/src/services/learningService.ts`

**Definition of Done**:
- Steps display with proper visual hierarchy and spacing
- Hint accordion opens/closes smoothly
- Completed steps show visual feedback
- XP total displays prominently
- Mobile-responsive: instructions may collapse or stack below editor

---

### 3. editor-files
**Purpose**: File explorer and Monaco code editor  
**Owned Files**:
- `frontend/src/components/CodeEditorPanel.tsx`
- `frontend/src/components/FileExplorer.tsx`

**Responsibilities**:
- File tree navigation with active file highlighting
- Monaco editor lazy-loading with language detection
- Code change tracking and undo/redo
- Starter code reset capability
- Syntax highlighting and basic validation UI

**Shared Dependencies** (read-only):
- `frontend/src/types/learning.ts` — types only
- `frontend/src/hooks/useLessonWorkspace.ts` — read callbacks only

**Blocked Files** (do not edit):
- `frontend/src/features/course/LessonWorkspace.tsx`
- `frontend/src/hooks/useLessonWorkspace.ts`
- `frontend/src/services/learningService.ts`

**Definition of Done**:
- File explorer lists all lesson files with correct active state
- Monaco editor loads on demand and renders code
- Language switching works for js/ts/html/css/json
- Editor height and layout remain responsive
- No console errors on mount/dismount

---

### 4. execution-console
**Purpose**: Run/reset/submit buttons and output/status console  
**Owned Files**:
- `frontend/src/components/ActionBar.tsx`
- `frontend/src/components/StatusConsole.tsx`

**Responsibilities**:
- Run, Reset, and Submit button states and handlers
- Console output display (stdout, stderr, logs)
- Status badges (pending, success, error, timeout)
- Runtime metrics (execution time, memory if applicable)
- Output scrolling, filtering, and copy-to-clipboard

**Shared Dependencies** (read-only):
- `frontend/src/types/learning.ts` — types only
- `frontend/src/hooks/useLessonWorkspace.ts` — read callbacks only

**Blocked Files** (do not edit):
- `frontend/src/features/course/LessonWorkspace.tsx`
- `frontend/src/hooks/useLessonWorkspace.ts`
- `frontend/src/services/learningService.ts`

**Definition of Done**:
- Buttons display correct enabled/disabled states based on run status
- Console output renders with proper formatting
- Run status updates and clears on reset
- Mobile layout: console stacks below editor
- All action handlers trigger hook callbacks correctly

---

### 5. integration-service
**Purpose**: Backend API client, data contracts, and mock/live provider switching  
**Owned Files**:
- `frontend/src/services/learningService.ts`
- `frontend/src/data/mockLesson.ts` (mock data)

**⚠️ Caution**: This slice **touches the shared contract** defined in `frontend/src/types/learning.ts` and `frontend/src/hooks/useLessonWorkspace.ts`. Work here should usually be done in isolation or coordinated across other slices if types change.

**Responsibilities**:
- API client for GET /courses, GET /lessons/{id}, POST /code/run, POST /ai/hint, POST /progress
- Request/response serialization and error handling
- Environment-based switching between mock and live API (VITE_USE_API)
- Retry logic and transient error recovery
- Caching/memoization for read operations

**Shared Dependencies** (may modify with care):
- `frontend/src/types/learning.ts` — define new types here first if needed; coordinate with other slices
- `frontend/src/hooks/useLessonWorkspace.ts` — function signature must stay backward-compatible

**Blocked Files** (do not edit):
- `frontend/src/features/course/LessonWorkspace.tsx`
- UI component files (Topbar, CourseSidebar, InstructionPanel, CodeEditorPanel, FileExplorer, ActionBar, StatusConsole) unless coordinating shared-type changes

**Definition of Done**:
- All required endpoints callable with correct request/response types
- Mock provider can be toggled on/off without breaking UI
- API calls return data matching `learningService` function signatures
- Error handling shows user-friendly messages
- No TypeScript errors; no breaking API surface changes

---

## Shared/Protected Files

These files affect **all slices**. Edits here require coordination or an explicit contract-change session.

| File | Role | Constraint |
|------|------|-----------|
| `frontend/src/types/learning.ts` | Type definitions for all features | One slice changing types breaks all others. **Freeze until all slices commit to types, or coordinate explicitly.** |
| `frontend/src/hooks/useLessonWorkspace.ts` | Central state management | Function signatures called by all slices. **Do not remove or change parameters; only add new methods if absolutely necessary.** |
| `frontend/src/features/course/LessonWorkspace.tsx` | Panel composition orchestrator | Routes props to all child panels. **Do not add/remove props without coordinating with all slices.** |
| `frontend/src/services/learningService.ts` | API / data provider contract | Changing signatures breaks the hook. **Changes here must be backward-compatible or require a contract-change session.** |
| `frontend/src/layouts/LearningLayout.tsx` | App shell | Rarely changes; treat as read-only template. |
| `frontend/src/App.tsx` | Entry point orchestrator | Treat as read-only. |

---

## Collaboration Rules

1. **Own your files, respect others' boundaries**: Each slice owns specific files. Do not edit files outside your slice unless the session prompt explicitly grants it.

2. **Shared files require coordination**: If your slice needs to modify a shared file (types, hooks, services), stop and request a contract-change session rather than pushing through with uncoordinated changes.

3. **Do not resolve unrelated conflicts**: If you find uncommented code, unfinished PRs, or conflicts in files outside your slice, ignore them. They likely belong to another active session. Only fix conflicts in your owned files.

4. **Handoff discipline**: When your session ends, provide a short handoff summary (current state, next step, any blockers). The next agent will use this summary to resume with minimal rehydration.

5. **Persist crucial findings**: If you discover a important reusable fact (e.g., "Monaco lazy-load breaks if X happens"), record it in repo memory. Do not record speculative notes or short-lived noise.

---

## How to Use This File

**For Session Start**:
1. User specifies a slice from the list above (e.g., "Start `instruction-panel`").
2. Agent reads this file, identifies owned files and shared dependencies, and loads only those files.
3. Agent checks the blocked files list and avoids editing them.

**For Session Continuation**:
1. User provides a prior handoff summary or references a session number.
2. New agent reads this file and the summary, verifies only the relevant files, and continues.

**For Contract Changes**:
1. If a slice discovers it needs to modify shared files, the session stops.
2. A new session with explicit shared-file permission is started (e.g., "Refine type contract for integration-service").
3. Once the shared contract is updated, other slices can resume.

---

## Future Slices

Plan ahead if you anticipate new features:
- `authentication-ui` — login/signup/profile flows
- `course-authoring` — content editor interface
- `analytics-dashboard` — progress tracking and metrics
- `mobile-responsive` — mobile-specific layout and touch interactions

Each new slice gets defined here with owned files, responsibilities, dependencies, and definition of done **before** work starts.
