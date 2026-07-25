# Requirements Document

## Introduction

This document defines the requirements for an AI-powered tax platform frontend focused on two case study challenges: (1) Source Document Traceability — enabling CPAs to trace every number on a tax return back to its source document and transformation, and (2) Client & CPA Collaboration — providing contextual, permission-aware communication tied to specific documents and tax issues. The frontend uses hardcoded/mocked data with working UI interactions. No backend is required.

## Glossary

- **Platform**: The AI-powered tax platform frontend application
- **Tax_Client**: An individual taxpayer who uploads documents, answers questions, and communicates with their CPA
- **CPA**: A Certified Public Accountant who reviews returns, traces data lineage, and communicates with clients
- **Return_Field**: A specific field on a tax return (e.g., Line 1 - Wages) that contains a computed or extracted value
- **Source_Document**: An uploaded document (e.g., W-2, 1099, bank statement) from which data is extracted
- **Traceability_Chain**: The complete linkage from a Return_Field back through any transformations to the exact source location on a Source_Document
- **Transformation**: A calculation or mapping applied to convert raw extracted values into Return_Field values (e.g., summing multiple W-2 boxes)
- **Review_Interface**: The side-by-side view where a CPA inspects return fields and their traceability data
- **Thread**: A conversation tied to a specific document, return field, or tax issue
- **Internal_Note**: A message visible only to CPA firm members, not to the Tax_Client
- **Client_Message**: A message visible to both the CPA and the Tax_Client
- **Action_Item**: A tracked request or task with an assigned owner and status (open, completed)
- **Navigation_System**: The menus, breadcrumbs, and routing mechanisms enabling movement between views

---

## Requirements

### Challenge 1: Source Document Traceability

### Requirement 1: Return Review Interface Layout

**User Story:** As a CPA, I want a return review interface that shows the tax return alongside source documents, so that I can verify data without switching between tools.

#### Acceptance Criteria

1. THE Review_Interface SHALL display the tax return fields in a scrollable panel on the left side and the Source_Document viewer in a scrollable panel on the right side
2. THE Review_Interface SHALL allow the CPA to resize the split between the return panel and the document panel, with each panel maintaining a minimum width of 20% of the viewport and a default split of 50/50
3. THE Platform SHALL display the return organized by section (Income, Deductions, Credits, Tax Computation) with expandable line items, where all sections are collapsed by default showing only the section heading and total
4. WHEN the viewport width is below 768 pixels, THE Review_Interface SHALL stack panels vertically with the tax return panel on top and the Source_Document viewer below
5. WHEN a CPA expands a section, THE Platform SHALL display all Return_Fields within that section as individually selectable line items showing field name and value

### Requirement 2: Field-to-Source Traceability

**User Story:** As a CPA, I want to select any field on the return and immediately see where the number came from, so that I can trust or challenge the value without manual re-derivation.

#### Acceptance Criteria

1. WHEN a CPA selects a Return_Field, THE Platform SHALL highlight the field with a visually distinct border and display its complete Traceability_Chain within 1 second of selection
2. THE Traceability_Chain SHALL show: the Return_Field value, the Source_Document name, the exact page number and section on the Source_Document, and the extracted raw value
3. WHEN a Traceability_Chain includes a Transformation, THE Platform SHALL display the calculation formula and all input values used, each labeled with its Source_Document reference
4. WHEN a CPA selects a Return_Field, THE Platform SHALL scroll the Source_Document panel to the relevant page and highlight the exact extraction region with a bounding box
5. IF a Return_Field aggregates values from multiple Source_Documents, THEN THE Platform SHALL list each source with its individual contribution value, and WHEN the CPA selects a listed source, THE Platform SHALL navigate the Source_Document panel to that source's page and highlight the corresponding extraction region
6. IF a CPA selects a Return_Field that has no linked Source_Document (Manual Entry), THEN THE Platform SHALL display a notice indicating that no traceability data is available for the field

### Requirement 3: Transformation Transparency

**User Story:** As a CPA, I want to see how raw extracted values were transformed into the final return field value, so that I can verify the calculation logic.

#### Acceptance Criteria

1. THE Platform SHALL display each Transformation as a step in the Traceability_Chain showing input values, operation applied (e.g., sum, lookup, percentage), and output value
2. WHEN multiple Transformations are chained, THE Platform SHALL display them in sequential order from source extraction to final Return_Field value, connected by directional indicators showing data flow
3. THE Platform SHALL visually distinguish direct extractions (no transformation) from computed values (one or more transformations applied) using a distinct icon or badge on the Return_Field
4. WHEN a Transformation involves a sum of multiple values, THE Platform SHALL display each addend with its source reference and individual value

### Requirement 4: Source Document Viewer

**User Story:** As a CPA, I want to view source documents with highlighted extraction regions, so that I can confirm the AI correctly identified the relevant data.

#### Acceptance Criteria

1. THE Platform SHALL display Source_Documents with visual bounding-box highlights on extracted regions using semi-transparent colored overlays
2. WHEN multiple fields are extracted from the same Source_Document, THE Platform SHALL use distinct colors for each extracted region's bounding box, limited to a palette of no more than 8 distinguishable colors
3. WHEN a CPA hovers over an extraction highlight, THE Platform SHALL display a tooltip showing the field name and extracted value
4. THE Platform SHALL display a confidence indicator for each extraction showing the AI's certainty level as a percentage value (0-100%)
5. IF the AI extraction confidence is below 70%, THEN THE Platform SHALL flag the extraction with a warning indicator (icon and color change) and surface it in the traceability filter as requiring CPA review
6. THE Platform SHALL support zoom (minimum 50% to maximum 200%) and scroll navigation within the Source_Document viewer

### Requirement 5: Traceability Status and Completeness

**User Story:** As a CPA, I want to see which fields have complete traceability and which need attention, so that I can focus my review on problem areas.

#### Acceptance Criteria

1. THE Platform SHALL display a status indicator on each Return_Field showing: Traced (complete chain), Partial (incomplete source), or Manual Entry (no source document)
2. THE Review_Interface SHALL provide a filter to show only fields matching one or more of the following statuses: Partial, Manual Entry, or low-confidence extraction (below 70% as defined in Requirement 4)
3. THE Platform SHALL display a summary bar at the top of the return panel showing the percentage (rounded to the nearest integer) of Return_Fields with complete traceability chains and the count of fields in each status category (Traced, Partial, Manual Entry)
4. WHEN a CPA marks a Return_Field as "Reviewed", THE Platform SHALL display a "Reviewed" badge on that Return_Field along with the reviewer name and timestamp in a human-readable format (e.g., "Jun 15, 2025 2:30 PM")
5. WHEN a CPA marks a Return_Field as "Reviewed", THE Platform SHALL update the summary bar to reflect the current count of reviewed versus unreviewed fields

---

## Challenge 2: Client & CPA Collaboration

### Requirement 6: Contextual Conversation Threads

**User Story:** As a CPA or Tax_Client, I want conversations tied to specific documents or tax issues, so that context is never lost across fragmented communication channels.

#### Acceptance Criteria

1. THE Platform SHALL allow creating a Thread attached to a specific Source_Document, Return_Field, or a user-provided tax issue label (free-text, maximum 120 characters), and SHALL require the user to provide a thread title (maximum 100 characters) before creation
2. THE Platform SHALL display the attached context (document name, field reference, or issue title) at the top of each Thread
3. WHEN a user opens a Thread from a document or return field, THE Platform SHALL display the relevant document or field in a side panel alongside the conversation
4. THE Platform SHALL group Threads by their attached context in a thread list view, categorizing each Thread as "Document" (attached to a Source_Document), "Field" (attached to a Return_Field), or "General" (attached to a user-provided tax issue label)
5. WHEN a Thread is created from the Review_Interface and a Return_Field or Source_Document is currently selected, THE Platform SHALL automatically attach the selected item as context
6. IF a Thread is created from the Review_Interface and no Return_Field or Source_Document is currently selected, THEN THE Platform SHALL prompt the user to manually select a context attachment or provide a tax issue label before creating the Thread

### Requirement 7: Permission-Aware Messaging

**User Story:** As a CPA, I want to distinguish internal firm notes from client-visible messages, so that I can have private discussions about a client's file without exposing them.

#### Acceptance Criteria

1. THE Platform SHALL provide two message modes within a Thread: Internal_Note and Client_Message
2. THE Platform SHALL visually distinguish Internal_Notes from Client_Messages using a distinct background color, a text label indicating the mode, and a persistent mode indicator on the compose area showing the currently selected mode
3. WHEN a CPA composes a message, THE Platform SHALL default to Internal_Note mode and require explicit action to switch to Client_Message mode; WHEN a Tax_Client composes a message, THE Platform SHALL use Client_Message mode with no option to switch to Internal_Note mode
4. THE Platform SHALL display Internal_Notes only to CPA users and hide them from Tax_Client users without leaving visible gaps or indicators that hidden messages exist in the Thread
5. WHEN a CPA switches from Internal_Note to Client_Message mode, THE Platform SHALL display a confirmation prompt warning that the message will be visible to the client; IF the CPA cancels the confirmation prompt, THEN THE Platform SHALL revert the compose mode to Internal_Note and retain the draft message content

### Requirement 8: Action Items and Task Ownership

**User Story:** As a CPA or Tax_Client, I want to see outstanding requests with clear ownership, so that I always know who needs to act next.

#### Acceptance Criteria

1. THE Platform SHALL allow a CPA to create an Action_Item from any Thread with an assigned owner (CPA or Tax_Client), a description (maximum 500 characters), and an optional due date
2. THE Platform SHALL display Action_Items with status (Open, Completed), owner name, creation date, due date (if set), and a link to the associated Thread
3. THE Platform SHALL provide an Action_Item list view showing all open items grouped by owner with a count displayed next to each owner group
4. WHEN an Action_Item is completed, THE Platform SHALL move the item to a completed section with a completion timestamp and the name of the user who marked it complete
5. THE Platform SHALL display a badge count of open Action_Items assigned to the current user in the Navigation_System sidebar
6. WHEN a Tax_Client has open Action_Items, THE Platform SHALL display them prominently on the Tax_Client's landing view in a dedicated "Your Action Items" section above other content

### Requirement 9: Collaboration Thread List and Navigation

**User Story:** As a user, I want a unified view of all conversations that avoids becoming a generic inbox, so that I can find relevant discussions quickly.

#### Acceptance Criteria

1. THE Platform SHALL display Threads organized by context category (Document-related, Field-related, General) rather than by chronological order alone, with threads within each category sorted by most recent activity first
2. THE Platform SHALL indicate unread message count on each Thread as a numeric badge
3. THE Platform SHALL display the most recent message preview (truncated to 120 characters with ellipsis) and timestamp for each Thread
4. WHEN a Thread contains unresolved Action_Items, THE Platform SHALL display an indicator showing the count of open items
5. THE Platform SHALL provide filter controls to show Threads by: all, unread, with open action items, or by attached document
6. WHEN a user selects a Thread from the list, THE Platform SHALL open the Thread in a detail view displaying the full conversation and attached context

---

## Cross-Cutting Requirements

### Requirement 10: Navigation and Layout

**User Story:** As a user, I want consistent navigation across both challenges, so that the platform feels cohesive and easy to orient within.

#### Acceptance Criteria

1. THE Navigation_System SHALL provide a sidebar visible on all views without requiring user action to reveal it, with links to: Return Review, Documents, Collaboration, and Action Items
2. THE Navigation_System SHALL visually distinguish the currently active section from inactive sections using at least two visual cues (such as background highlight and a text weight or indicator change) to support accessibility
3. THE Navigation_System SHALL display breadcrumb indicators showing the current location within a hierarchy of up to three levels: primary section, sub-section, and active item (e.g., "Collaboration > Thread > Action Item")
4. WHEN the viewport width is below 768 pixels, THE Navigation_System SHALL collapse the sidebar into a hamburger menu that provides access to all the same navigation links as the sidebar
5. THE Platform SHALL enable the user to reach any primary view (Return Review, Documents, Collaboration, or Action Items) within two clicks or taps from any other primary view
6. WHEN a user activates the hamburger menu on viewports below 768 pixels, THE Navigation_System SHALL display the navigation links as an overlay and close the overlay when a link is selected or the user taps outside it

### Requirement 11: Accessibility and Visual Design

**User Story:** As a user, I want the platform to meet accessibility standards and maintain visual clarity, so that the interface is usable by all users.

#### Acceptance Criteria

1. THE Platform SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text (below 18pt regular or 14pt bold) and 3:1 for large text (18pt regular or 14pt bold and above) against their background
2. THE Platform SHALL support keyboard-only navigation for all interactive features such that every interactive element is reachable via Tab key in a logical reading order, operable via Enter or Space key, and provides no keyboard traps
3. WHEN a user focuses on an interactive element, THE Platform SHALL provide a focus indicator with a minimum contrast ratio of 3:1 against adjacent colors and a minimum thickness of 2 CSS pixels
4. THE Platform SHALL use a consistent typography hierarchy across all views with no more than 4 distinct heading levels and uniform font sizes, weights, and spacing for each level throughout the application
5. THE Platform SHALL use color combined with icons or labels for status indicators to ensure accessibility for color-blind users
6. THE Platform SHALL provide accessible names via visible labels or ARIA attributes for all interactive elements that lack visible text content

### Requirement 12: Loading States and Error Handling

**User Story:** As a user, I want clear feedback when content is loading or unavailable, so that I understand the system's state.

#### Acceptance Criteria

1. WHILE data is loading, THE Platform SHALL display skeleton placeholders that reflect the structural layout of the target content area (panels, list rows, or card shapes) within the view being loaded
2. IF data loading exceeds 10 seconds without a response, THEN THE Platform SHALL transition from the loading state to an error state with a retry action
3. WHEN a view contains no data, THE Platform SHALL display an empty state that includes a descriptive message explaining why no data is present and at least one actionable element (a button or link) directing the user toward a relevant next step
4. IF a data fetch fails, THEN THE Platform SHALL display an error message indicating the nature of the failure and provide a retry action
5. IF a retry action has been attempted 3 times without success, THEN THE Platform SHALL disable the retry action and display a message directing the user to reload the page or contact support
