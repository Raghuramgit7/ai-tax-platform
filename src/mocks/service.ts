import type { ReturnField, SourceDocument, TraceabilityChain, Thread, ActionItem, User } from '@/types';
import { returnFields } from './data/returnFields';
import { sourceDocuments, getDocumentById } from './data/documents';
import { threads } from './data/threads';
import { actionItems } from './data/actionItems';
import { currentUser } from './data/users';

export interface MockConfig {
  delayMs: number;
  shouldFail: boolean;
  failAfterRetries: number;
}

const defaultConfig: MockConfig = {
  delayMs: 300,
  shouldFail: false,
  failAfterRetries: 3,
};

let config: MockConfig = { ...defaultConfig };

export function setMockConfig(newConfig: Partial<MockConfig>) {
  config = { ...config, ...newConfig };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateAsync<T>(data: T): Promise<T> {
  await delay(config.delayMs);
  if (config.shouldFail) {
    throw new Error('Simulated network error');
  }
  return data;
}

export const mockService = {
  getReturnFields: (): Promise<ReturnField[]> => simulateAsync(returnFields),

  getTraceabilityChain: (fieldId: string): Promise<TraceabilityChain | null> => {
    const field = returnFields.find((f) => f.id === fieldId);
    return simulateAsync(field?.traceabilityChain ?? null);
  },

  getDocument: (documentId: string): Promise<SourceDocument | null> => {
    return simulateAsync(getDocumentById(documentId) ?? null);
  },

  getDocuments: (): Promise<SourceDocument[]> => simulateAsync(sourceDocuments),

  getThreads: (): Promise<Thread[]> => simulateAsync(threads),

  getThread: (threadId: string): Promise<Thread | null> => {
    const thread = threads.find((t) => t.id === threadId);
    return simulateAsync(thread ?? null);
  },

  getActionItems: (userId?: string): Promise<ActionItem[]> => {
    const items = userId
      ? actionItems.filter((ai) => ai.ownerId === userId)
      : actionItems;
    return simulateAsync(items);
  },

  getCurrentUser: (): User => currentUser,
};
