import type { FieldStatus, MessageMode, ThreadCategory } from './index';

export interface ReviewState {
  selectedFieldId: string | null;
  expandedSections: string[];
  filter: FieldFilter;
  splitRatio: number;
}

export interface FieldFilter {
  statuses: FieldStatus[];
  lowConfidenceOnly: boolean;
  reviewedOnly: boolean;
}

export interface CollaborationState {
  selectedThreadId: string | null;
  threadFilter: ThreadFilter;
  composeMode: MessageMode;
}

export interface ThreadFilter {
  category: ThreadCategory | 'all';
  showUnreadOnly: boolean;
  showWithOpenActions: boolean;
  attachedDocumentId?: string;
}

export interface RetryState {
  attemptCount: number;
  maxAttempts: number;
  isRetrying: boolean;
  lastError: string | null;
}

export type LoadingPhase = 'idle' | 'loading' | 'success' | 'error' | 'exhausted';
