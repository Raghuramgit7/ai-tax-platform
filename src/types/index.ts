// === Tax Return & Traceability ===

export type FieldStatus = 'traced' | 'partial' | 'manual_entry';

export interface ReturnField {
  id: string;
  section: 'income' | 'deductions' | 'credits' | 'tax_computation';
  name: string;
  value: number;
  status: FieldStatus;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  traceabilityChain?: TraceabilityChain;
}

export interface TraceabilityChain {
  fieldId: string;
  sources: SourceReference[];
  transformations: Transformation[];
}

export interface SourceReference {
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  extractedValue: number;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transformation {
  id: string;
  order: number;
  operation: 'sum' | 'lookup' | 'percentage' | 'subtract' | 'multiply';
  inputs: TransformationInput[];
  output: number;
  formula: string;
}

export interface TransformationInput {
  label: string;
  value: number;
  sourceRef?: SourceReference;
}

// === Source Documents ===

export type DocumentType = 'w2' | '1099' | 'bank_statement' | '1098' | 'other';

export interface SourceDocument {
  id: string;
  name: string;
  type: DocumentType;
  pageCount: number;
  uploadedAt: string;
  extractionHighlights: ExtractionHighlight[];
}

export interface ExtractionHighlight {
  id: string;
  fieldId: string;
  fieldName: string;
  page: number;
  boundingBox: BoundingBox;
  extractedValue: number | string;
  confidence: number;
  colorIndex: number;
}

// === Collaboration ===

export type ThreadCategory = 'document' | 'field' | 'general';
export type MessageMode = 'internal_note' | 'client_message';

export interface Thread {
  id: string;
  title: string;
  category: ThreadCategory;
  contextLabel: string;
  contextId?: string;
  createdAt: string;
  lastActivityAt: string;
  messages: Message[];
  unreadCount: number;
  openActionItemCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: 'cpa' | 'client';
  mode: MessageMode;
  content: string;
  createdAt: string;
}

// === Action Items ===

export type ActionItemStatus = 'open' | 'completed';

export interface ActionItem {
  id: string;
  threadId: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerRole: 'cpa' | 'client';
  status: ActionItemStatus;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
}

// === Users ===

export type UserRole = 'cpa' | 'client';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
