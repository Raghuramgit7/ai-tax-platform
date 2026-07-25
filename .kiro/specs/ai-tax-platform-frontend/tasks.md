# Implementation Plan: AI Tax Platform Frontend

## Overview

This plan converts the design into incremental coding tasks for a React 18 + TypeScript SPA built with Vite, Zustand, React Router v6, Tailwind CSS, Radix UI, and PDF.js. All data is mocked/hardcoded. Tasks are structured so each builds on previous work, ending with full integration.

## Tasks

- [ ] 1. Project scaffolding and core infrastructure
  - [ ] 1.1 Initialize Vite + React + TypeScript project with dependencies
    - Initialize project with `npm create vite@latest` using react-ts template
    - Install dependencies: zustand, react-router-dom, tailwindcss, postcss, autoprefixer, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-tooltip, @radix-ui/react-tabs, react-pdf, pdfjs-dist
    - Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, fast-check, jsdom, axe-core, jest-axe
    - Configure Tailwind CSS with `tailwind.config.ts` and base styles
    - Configure Vitest in `vite.config.ts` with jsdom environment
    - Create base `tsconfig.json` with strict mode and path aliases
    - _Requirements: Design architecture decisions_

  - [ ] 1.2 Define core TypeScript types and data models
    - Create `src/types/index.ts` with all interfaces: ReturnField, TraceabilityChain, SourceReference, BoundingBox, Transformation, TransformationInput, SourceDocument, ExtractionHighlight, Thread, Message, ActionItem, User
    - Create `src/types/ui.ts` with UI state interfaces: ReviewState, FieldFilter, CollaborationState, ThreadFilter, RetryState, LoadingPhase
    - Ensure all types match the design document exactly (FieldStatus, ThreadCategory, MessageMode, ActionItemStatus, UserRole)
    - _Requirements: All requirements (data model foundation)_

  - [ ] 1.3 Create mock data layer with async service wrappers
    - Create `src/mocks/data/returnFields.ts` with hardcoded return fields across 4 sections (Income, Deductions, Credits, Tax Computation) with varied statuses (traced, partial, manual_entry) and confidence levels
    - Create `src/mocks/data/documents.ts` with sample source documents (W-2, 1099, bank statement) including extraction highlights with bounding boxes and color indices
    - Create `src/mocks/data/threads.ts` with sample threads across all categories (document, field, general) including messages with both internal_note and client_message modes
    - Create `src/mocks/data/actionItems.ts` with sample action items in open and completed states
    - Create `src/mocks/data/users.ts` with CPA and Tax Client user records
    - Create `src/mocks/service.ts` implementing MockDataService interface with configurable delay (default 500ms) and failure simulation
    - Create `src/mocks/config.ts` with MockConfig for controlling delay, failure, and retry exhaustion
    - _Requirements: 12.1, 12.2, 12.4, 12.5_

  - [ ] 1.4 Set up Zustand stores for application state
    - Create `src/stores/reviewStore.ts` managing: selectedFieldId, expandedSections, filter (statuses, lowConfidenceOnly, reviewedOnly), splitRatio
    - Create `src/stores/collaborationStore.ts` managing: selectedThreadId, threadFilter, composeMode
    - Create `src/stores/actionItemStore.ts` managing: action items list, filtering, completion actions
    - Create `src/stores/appStore.ts` managing: current user, loading states, retry states per view
    - _Requirements: 1.2, 2.1, 5.2, 7.3, 8.3, 9.5_

  - [ ] 1.5 Set up React Router with route structure and App Shell
    - Create `src/App.tsx` with BrowserRouter and route definitions matching design routing structure
    - Create `src/components/layout/AppShell.tsx` as root layout with Sidebar, BreadcrumbBar, and Outlet
    - Implement role-based redirect from `/` (CPA → /review, Client → /action-items)
    - Define routes: /review, /review/:fieldId, /documents, /documents/:documentId, /collaboration, /collaboration/:threadId, /action-items
    - _Requirements: 10.1, 10.5_

- [ ] 2. Navigation and layout components
  - [ ] 2.1 Implement Sidebar navigation component
    - Create `src/components/layout/Sidebar.tsx` with links to: Return Review, Documents, Collaboration, Action Items
    - Implement active section highlighting using at least two visual cues (background highlight + font weight change)
    - Display badge count of open action items assigned to current user
    - Implement responsive behavior: visible sidebar above 768px, hamburger menu below 768px
    - Implement hamburger overlay that closes on link selection or outside tap
    - Use Radix UI Dialog primitive for mobile overlay to ensure accessibility
    - _Requirements: 10.1, 10.2, 10.4, 10.6, 8.5_

  - [ ] 2.2 Implement BreadcrumbBar component
    - Create `src/components/layout/BreadcrumbBar.tsx` with up to 3 hierarchy levels
    - Implement route-to-breadcrumb mapping logic: primary section → sub-section → active item
    - Use `useLocation` and route params to derive breadcrumb segments
    - Ensure breadcrumb links are keyboard navigable
    - _Requirements: 10.3_

  - [ ]* 2.3 Write property tests for navigation components
    - **Property 21: Breadcrumb Hierarchy Correctness** — for any valid route path, breadcrumb displays 1-3 segments matching navigation hierarchy
    - **Property 22: Navigation Reachability** — for any pair of primary views, at most 2 clicks via sidebar reaches destination
    - **Property 17: Open Action Item Badge Count** — sidebar badge equals count of open items assigned to current user
    - **Validates: Requirements 10.3, 10.5, 8.5**

- [ ] 3. Checkpoint - Ensure project builds and navigation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Return Review Interface - Layout and panels
  - [ ] 4.1 Implement ResizableSplitPanel component
    - Create `src/components/shared/ResizableSplitPanel.tsx` with draggable divider
    - Implement ratio clamping: minimum 20% each side, default 50/50
    - Implement responsive stacking: horizontal above 768px, vertical below 768px
    - Add keyboard support for resizing (arrow keys when divider focused)
    - Use `aria-orientation` and `aria-valuenow` for accessibility
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ]* 4.2 Write property test for split panel clamping
    - **Property 1: Split Panel Ratio Clamping** — for any drag input (0-1), output is between 0.2 and 0.8 inclusive; identity within bounds
    - **Validates: Requirements 1.2**

  - [ ] 4.3 Implement ReturnPanel with sections and field rows
    - Create `src/components/review/ReturnPanel.tsx` with collapsible sections (Income, Deductions, Credits, Tax Computation)
    - All sections collapsed by default showing section heading and total
    - Create `src/components/review/ReturnSection.tsx` using Radix Accordion for expand/collapse
    - Create `src/components/review/ReturnFieldRow.tsx` showing field name, value, status indicator, and reviewed badge
    - Implement field selection with visually distinct border highlight
    - _Requirements: 1.3, 1.5, 2.1, 5.1_

  - [ ]* 4.4 Write property test for section expansion
    - **Property 2: Section Expansion Completeness** — for any section with N fields, expanding renders exactly N field rows with matching ids
    - **Validates: Requirements 1.5**

  - [ ] 4.5 Implement SummaryBar and FilterBar
    - Create `src/components/review/SummaryBar.tsx` displaying: percentage of traced fields (rounded integer), counts per status (Traced, Partial, Manual Entry), reviewed vs unreviewed count
    - Create `src/components/review/FilterBar.tsx` with filter controls: show Partial, Manual Entry, low-confidence (below 70%)
    - Implement filter logic as pure function in `src/utils/fieldFilter.ts`
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 4.6 Write property tests for summary and filter logic
    - **Property 11: Summary Bar Computation** — traced percentage = (traced / total) × 100 rounded; status counts sum to total; reviewed count increments by 1 on mark
    - **Property 10: Field Status Filter Correctness** — filtered results contain exactly fields matching selected criteria, no others
    - **Validates: Requirements 5.2, 5.3, 5.5**

- [ ] 5. Source Document Traceability
  - [ ] 5.1 Implement TraceabilityPanel and TransformationChain components
    - Create `src/components/review/TraceabilityPanel.tsx` displaying: field value, source document names, page/section, extracted raw values
    - Create `src/components/review/TransformationChain.tsx` rendering transformations in sequential order with directional flow indicators
    - Display formula string and all input values with labels for each transformation
    - Implement clickable source references that trigger navigation to document panel
    - For multi-source fields: list each source with individual contribution value
    - For manual_entry fields: display notice that no traceability data is available
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 3.1, 3.2, 3.4_

  - [ ]* 5.2 Write property tests for traceability display logic
    - **Property 3: Traceability Chain Completeness** — rendered display contains field value, all source names, pages, sections, extracted values, formulas, and transformation inputs
    - **Property 4: Transformation Sequential Order** — transformations render in ascending order value
    - **Property 5: Direct vs Computed Badge Assignment** — zero transformations → "Direct Extraction" badge; one+ → "Computed Value" badge
    - **Property 6: Multi-Source Contribution Listing** — each source appears with contribution value; set matches chain sources
    - **Validates: Requirements 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.4**

  - [ ] 5.3 Implement StatusIndicator component with accessibility
    - Create `src/components/shared/StatusIndicator.tsx` showing Traced/Partial/Manual Entry/Low Confidence/Reviewed states
    - Each status uses color PLUS icon or text label (accessible for color-blind users)
    - Implement "Reviewed" badge showing reviewer name and formatted timestamp (e.g., "Jun 15, 2025 2:30 PM")
    - _Requirements: 5.1, 5.4, 11.5_

  - [ ]* 5.4 Write property test for status indicator accessibility
    - **Property 23: Status Indicator Accessibility** — for any status type, rendered indicator contains both color-based element AND non-color element (icon or text label)
    - **Validates: Requirements 11.5**

  - [ ] 5.5 Implement SourceDocumentViewer with PDF rendering and highlights
    - Create `src/components/review/SourceDocumentViewer.tsx` using react-pdf for PDF rendering
    - Implement `src/components/review/HighlightOverlay.tsx` rendering bounding-box overlays with semi-transparent colored backgrounds
    - Implement highlight color assignment using 8-color palette (colorIndex 0-7)
    - Implement hover tooltip showing field name and extracted value (using Radix Tooltip)
    - Display confidence indicator as percentage for each extraction
    - Flag extractions below 70% confidence with warning indicator (icon + color change)
    - Implement zoom controls: min 50%, max 200% with clamping
    - Implement scroll-to-page when field is selected
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 2.4_

  - [ ]* 5.6 Write property tests for document viewer logic
    - **Property 7: Highlight Color Distinctness** — for ≤8 highlights on a document, each gets distinct colorIndex [0-7], no duplicates
    - **Property 8: Low-Confidence Warning Threshold** — warning displayed iff confidence < 70
    - **Property 9: Zoom Level Clamping** — zoom clamped to [50, 200]; identity within bounds
    - **Validates: Requirements 4.2, 4.5, 4.6**

- [ ] 6. Checkpoint - Ensure traceability features work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Collaboration - Thread list and messaging
  - [ ] 7.1 Implement ThreadList component with grouping and filtering
    - Create `src/components/collaboration/ThreadList.tsx` displaying threads grouped by category (Document, Field, General)
    - Within each group, sort threads by lastActivityAt descending (most recent first)
    - Show unread count badge, last message preview (truncated to 120 chars + ellipsis), timestamp, and open action item indicator
    - Implement thread filter logic in `src/utils/threadFilter.ts`: all, unread, with open actions, by document
    - Create `src/components/collaboration/ThreadFilterBar.tsx` with filter controls
    - _Requirements: 6.4, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 7.2 Write property tests for thread list logic
    - **Property 13: Thread Grouping and Sort Order** — threads grouped by category; within each group sorted by lastActivityAt descending
    - **Property 18: Thread Preview Truncation** — preview is full string if ≤120 chars, else first 120 + "…"
    - **Property 19: Thread Action Item Indicator** — indicator shown iff openActionItemCount > 0; count matches
    - **Property 20: Thread Filter Correctness** — each filter returns exactly matching subset
    - **Validates: Requirements 6.4, 9.1, 9.3, 9.4, 9.5**

  - [ ] 7.3 Implement ThreadDetail with messages and context panel
    - Create `src/components/collaboration/ThreadDetail.tsx` displaying thread title, attached context, and full message list
    - Create `src/components/collaboration/MessageList.tsx` rendering messages chronologically
    - Create `src/components/collaboration/ContextSidePanel.tsx` showing attached document/field alongside conversation
    - Display context label (document name, field reference, or issue title) at top of thread
    - _Requirements: 6.2, 6.3, 9.6_

  - [ ] 7.4 Implement MessageComposer with permission-aware modes
    - Create `src/components/collaboration/MessageComposer.tsx`
    - CPA: default to Internal_Note mode, allow switch to Client_Message with confirmation prompt
    - Client: fixed Client_Message mode, no switch option
    - Visually distinguish modes: distinct background color, text label, persistent mode indicator on compose area
    - On mode switch confirmation cancel: revert to Internal_Note, retain draft content
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ]* 7.5 Write property tests for messaging logic
    - **Property 14: Message Visibility by Role** — CPA sees all messages; Client sees only client_messages with no gaps
    - **Property 15: Compose Mode Defaults by Role** — CPA defaults to internal_note with switch; Client uses client_message without switch
    - **Validates: Requirements 7.3, 7.4**

  - [ ] 7.6 Implement thread creation flow
    - Implement "New Thread" UI allowing attachment to Source_Document, Return_Field, or free-text issue label (max 120 chars)
    - Require thread title (max 100 chars) with inline validation
    - When created from Review_Interface with a selected item: auto-attach context
    - When no item selected: prompt user to select context or provide issue label
    - Implement input length validation in `src/utils/validation.ts`
    - _Requirements: 6.1, 6.5, 6.6_

  - [ ]* 7.7 Write property test for input validation
    - **Property 12: Input Length Validation** — thread titles accepted iff 1-100 chars; context labels iff 1-120 chars; action item descriptions iff 1-500 chars
    - **Validates: Requirements 6.1, 8.1**

- [ ] 8. Action Items
  - [ ] 8.1 Implement ActionItemsView with grouped list
    - Create `src/components/action-items/ActionItemsView.tsx` with open items grouped by owner and count per group
    - Create `src/components/action-items/ActionItemCard.tsx` showing: status, owner, creation date, due date, link to thread
    - Implement completed section showing completion timestamp and completer name
    - For Tax_Client landing: display "Your Action Items" section prominently above other content
    - _Requirements: 8.2, 8.3, 8.4, 8.6_

  - [ ]* 8.2 Write property test for action item grouping
    - **Property 16: Action Items Grouped by Owner with Counts** — grouped view partitions by ownerName; count per group equals items in group
    - **Validates: Requirements 8.3**

  - [ ] 8.3 Implement action item creation from threads
    - Add "Create Action Item" button within ThreadDetail
    - Form fields: assigned owner (CPA or Client), description (max 500 chars with validation), optional due date
    - Created items link back to their source thread
    - _Requirements: 8.1_

- [ ] 9. Checkpoint - Ensure collaboration features work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Loading states, error handling, and accessibility polish
  - [ ] 10.1 Implement SkeletonLoader and loading state components
    - Create `src/components/shared/SkeletonLoader.tsx` with structural skeleton placeholders matching target layout (panels, list rows, cards)
    - Add `aria-busy="true"` and descriptive `aria-label` during loading
    - Implement timeout transition: loading → error state after 10 seconds
    - _Requirements: 12.1, 12.2_

  - [ ] 10.2 Implement error states and retry logic
    - Create `src/components/shared/ErrorState.tsx` displaying error message and retry action
    - Implement retry state machine (idle → loading → success | error → retry up to 3 → exhausted)
    - After 3 failed retries: disable retry button, show "Reload page or contact support" message
    - Ensure errors in one panel don't destroy state in other panels
    - _Requirements: 12.2, 12.4, 12.5_

  - [ ]* 10.3 Write property test for retry exhaustion
    - **Property 25: Retry Exhaustion** — retry enabled if attempts < 3, disabled if ≥ 3; when disabled, reload/support message displayed
    - **Validates: Requirements 12.5**

  - [ ] 10.4 Implement empty states across all views
    - Create `src/components/shared/EmptyState.tsx` with descriptive message and actionable element (button or link)
    - Add empty states to: ReturnPanel (no fields), ThreadList (no threads), ActionItemsView (no items), DocumentViewer (no document selected)
    - Each empty state directs user toward a relevant next step
    - _Requirements: 12.3_

  - [ ]* 10.5 Write property test for empty state completeness
    - **Property 24: Empty State Completeness** — for any view with zero items, empty state contains non-empty text message AND at least one interactive element
    - **Validates: Requirements 12.3**

  - [ ] 10.6 Accessibility audit and FocusRing implementation
    - Create `src/components/shared/FocusRing.tsx` wrapper with 2px solid outline, 3:1 contrast ratio on focus-visible
    - Verify all interactive elements are keyboard navigable (Tab, Enter, Space)
    - Verify all status indicators use color + icon/label
    - Add ARIA labels to all interactive elements lacking visible text
    - Ensure 4.5:1 contrast for normal text, 3:1 for large text
    - Run axe-core checks on key components
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 11. Integration wiring and final polish
  - [ ] 11.1 Wire ReviewView end-to-end
    - Create `src/views/ReviewView.tsx` connecting: ResizableSplitPanel, ReturnPanel, SourceDocumentViewer
    - Connect field selection → traceability panel display → document scroll-to-page → highlight active extraction
    - Connect "Mark as Reviewed" action → update store → update SummaryBar
    - Integrate loading states and error handling for data fetches
    - _Requirements: 1.1, 2.1, 2.4, 5.4, 5.5_

  - [ ] 11.2 Wire CollaborationView end-to-end
    - Create `src/views/CollaborationView.tsx` connecting: ThreadList, ThreadDetail, MessageComposer, ContextSidePanel
    - Connect thread selection → detail view → context panel display
    - Connect message sending → update store → update thread list (last message, unread count)
    - Connect action item creation → update action item store → update badge counts
    - Integrate Internal_Note filtering for client role
    - _Requirements: 6.3, 7.4, 8.5, 9.6_

  - [ ] 11.3 Wire ActionItemsView and client landing page
    - Create `src/views/ActionItemsView.tsx` with role-aware rendering
    - Client view: "Your Action Items" prominently above other content
    - Connect "Complete" action → move to completed section with timestamp
    - Connect thread link navigation → open ThreadDetail
    - _Requirements: 8.4, 8.6_

  - [ ] 11.4 Wire Documents view
    - Create `src/views/DocumentsView.tsx` listing all source documents
    - Connect document selection → SourceDocumentViewer with all extraction highlights
    - Enable "Create Thread" from document context
    - _Requirements: 4.1, 6.5_

  - [ ]* 11.5 Write integration tests for cross-view interactions
    - Test: CPA selects field → traceability displays → document scrolls to page
    - Test: Thread created from review → appears in collaboration list with context
    - Test: Action item completed → badge count updates in sidebar
    - Test: Client view hides internal notes without gaps
    - _Requirements: 2.1, 2.4, 6.5, 7.4, 8.5_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (25 total)
- Unit tests validate specific examples and edge cases
- All data is mocked — no backend integration required
- TypeScript strict mode ensures type safety throughout
- Radix UI primitives provide accessibility foundations; custom FocusRing and StatusBadge components fill remaining gaps

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4"] },
    { "id": 3, "tasks": ["1.5"] },
    { "id": 4, "tasks": ["2.1", "2.2"] },
    { "id": 5, "tasks": ["2.3", "4.1"] },
    { "id": 6, "tasks": ["4.2", "4.3"] },
    { "id": 7, "tasks": ["4.4", "4.5"] },
    { "id": 8, "tasks": ["4.6", "5.1", "5.3"] },
    { "id": 9, "tasks": ["5.2", "5.4", "5.5"] },
    { "id": 10, "tasks": ["5.6", "7.1"] },
    { "id": 11, "tasks": ["7.2", "7.3", "7.4"] },
    { "id": 12, "tasks": ["7.5", "7.6", "8.1"] },
    { "id": 13, "tasks": ["7.7", "8.2", "8.3"] },
    { "id": 14, "tasks": ["10.1", "10.4"] },
    { "id": 15, "tasks": ["10.2", "10.5", "10.6"] },
    { "id": 16, "tasks": ["10.3", "11.1", "11.2", "11.3", "11.4"] },
    { "id": 17, "tasks": ["11.5"] }
  ]
}
```
