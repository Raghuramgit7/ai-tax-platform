# AI Tax Platform – Frontend Case Study

An AI-powered tax platform frontend demonstrating good UX for **tax clients** and **CPAs** navigating a system that surfaces AI-generated insights for tax return preparation. Built as a frontend-only prototype with mocked data.

---

## Demo

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## Case Study Challenges

### Challenge 1: Source Document Traceability

**Problem**: CPAs need to verify every number on a tax return. Today they manually cross-reference PDFs, spreadsheets, and source documents — a tedious, error-prone process.

**Solution**: A split-panel review interface where selecting any return field instantly shows:
- The source document(s) it came from, with the exact extraction region highlighted
- The transformation chain (e.g., "W-2 Box 1 + W-2 Box 1 = Line 1 Wages")
- Confidence scores from the AI extraction engine
- A status system (Traced / Partial / Manual Entry) so CPAs focus on problem areas first

**Design decisions**:
- Resizable split panel lets CPAs control how much screen real estate goes to the return vs. the document
- Sections start collapsed — CPAs typically review one section at a time, not the whole return
- Low-confidence extractions (< 70%) surface warnings automatically, preventing missed issues
- "Mark as Reviewed" creates an audit trail without blocking workflow

### Challenge 2: Client & CPA Collaboration

**Problem**: Communication about tax documents fragments across email, phone, and file sharing. Context is lost — "which W-2 were we discussing?" — and CPAs need a way to have private discussions about a client's file.

**Solution**: Contextual threads tied directly to documents or return fields, with permission-aware messaging:
- **Internal notes** (yellow, lock icon) — visible only to CPA firm members
- **Client messages** (white, globe icon) — visible to both CPA and client
- Default to internal mode with explicit confirmation to switch (prevents accidental disclosure)
- Action items with clear ownership so both parties know who acts next

**Design decisions**:
- Threads grouped by context type (Document / Field / General) rather than chronological inbox — avoids "email syndrome"
- Client view hides internal notes with no visible gaps (no "3 hidden messages" indicators that would raise suspicion)
- Action items shown prominently on client landing page — the thing they need to act on is immediately visible
- Role toggle lets reviewers verify both perspectives without logging out

---

## Architecture

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 + TypeScript | Type safety for complex UI state; standard SPA tooling |
| Build | Vite | Fast HMR, zero-config TS, optimal for greenfield |
| State | Zustand | Lightweight, avoids Redux ceremony for a mocked-data app |
| Routing | React Router v6 | Nested routes map to breadcrumb hierarchy |
| Styling | Tailwind CSS | Utility-first for rapid iteration; consistent spacing/color |
| Accessibility | Radix UI primitives + manual ARIA | Keyboard nav, focus management, screen reader support |
| Icons | Lucide React | Consistent, accessible SVG icon set |

**No backend. No SSR.** This is intentionally a pure SPA — the evaluation is frontend UX, not infrastructure.

---

## Project Structure

```
src/
├── components/
│   ├── layout/         AppShell, Sidebar, role toggle
│   ├── review/         ReturnPanel, TraceabilityPanel, SourceDocumentViewer
│   ├── collaboration/  ThreadList, ThreadDetail, MessageComposer
│   └── shared/         ResizableSplitPanel, StatusIndicator
├── views/              ReviewView, CollaborationView, ActionItemsView
├── stores/             Zustand stores (reviewStore, appStore)
├── mocks/              Hardcoded data + async service wrappers
└── types/              TypeScript interfaces for all domain models
```

---

## Key UX Patterns

1. **Progressive disclosure** — Sections collapsed by default; detail panels appear on selection
2. **Context preservation** — Document viewer reacts to field selection; threads show attached context
3. **Safety by default** — CPA messages default to internal; switching to client-visible requires confirmation
4. **Status at a glance** — Summary bar, color + icon badges, badge counts on navigation
5. **Two-click navigation** — Any primary view reachable in ≤2 clicks from anywhere

---

## Running

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit

# Run property-based tests (26 tests covering 10 correctness properties)
npm run test
```

---

## Quality & Testing

### Property-Based Tests (fast-check)

26 tests covering 10 correctness properties that hold for any valid input:

| Property | What it validates |
|----------|------------------|
| P1: Split Panel Clamping | Ratio always in [0.2, 0.8]; identity within bounds |
| P9: Zoom Clamping | Zoom always in [50, 200]; identity within bounds |
| P11: Summary Bar | Status counts sum to total; percentage correct; reviewed count matches |
| P12: Input Length | Thread titles (1-100), context labels (1-120), descriptions (1-500) |
| P14: Message Visibility | CPA sees all; client sees only client_messages; no gaps |
| P16: Action Item Grouping | Groups partition correctly; counts match group sizes |
| P17: Badge Count | Equals open items where ownerId matches current user |
| P18: Preview Truncation | Full if ≤120 chars; first 120 + "…" otherwise |

Run with: `npm run test`

### Accessibility

- All interactive elements keyboard-navigable (Tab / Enter / Space)
- Focus indicators: 2px outline with 3:1 contrast ratio
- Status indicators always use color + icon/text (color-blind safe)
- ARIA labels on icon-only buttons
- Responsive: hamburger menu below 768px with overlay behavior

### Loading & Error States

- `SkeletonLoader` component with `aria-busy="true"` for loading states
- `ErrorState` with retry logic (up to 3 attempts, then "reload page" message)
- `EmptyState` with actionable guidance for every empty view

---

## Demo Script

### Challenge 1 (Source Document Traceability)
1. Open the app → land on Return Review page
2. Expand "Income" → see fields with status badges
3. Click "Line 1 – Wages" → traceability panel shows two W-2 sources + sum formula
4. Document viewer highlights the extraction region with a colored bounding box
5. Note the SummaryBar: "69% traced" with field counts

### Challenge 2 (Client & CPA Collaboration)
1. Navigate to "Collaboration" → see threads grouped by context
2. Open "W-2 Box 1 discrepancy" → see internal notes (yellow) and client messages (white)
3. Compose area defaults to "Internal Note" mode; click "Switch to Client" → confirmation dialog appears
4. Click the role toggle (bottom of sidebar) to switch to Tax Client
5. Same thread now hides internal notes with no visible gaps
6. Navigate to "Action Items" → see "Your Action Items" section at top with open tasks

### Milestone 3 (Polish & Robustness)
1. Navigate between all four views — sidebar highlights active section, breadcrumbs update
2. Resize browser below 768px — sidebar becomes hamburger menu; tap to open, links close overlay
3. Tab through interface with keyboard only — every button/link gets a visible focus ring
4. Run `npm run test` — 26 property-based tests pass confirming correctness
5. Note status indicators use both color AND icons (accessible for color-blind users)
