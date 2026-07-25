import type { ReturnField, Thread, Message, ActionItem } from '@/types';
import type { FieldFilter, ThreadFilter } from '@/types/ui';

/**
 * Filter return fields based on filter criteria.
 */
export function filterFields(fields: ReturnField[], filter: FieldFilter): ReturnField[] {
  let result = fields;

  if (filter.statuses.length > 0) {
    result = result.filter((f) => filter.statuses.includes(f.status));
  }

  if (filter.lowConfidenceOnly) {
    result = result.filter((f) => {
      const chain = f.traceabilityChain;
      if (!chain) return false;
      return chain.sources.some((s) => s.confidence < 70);
    });
  }

  if (filter.reviewedOnly) {
    result = result.filter((f) => f.isReviewed);
  }

  return result;
}

/**
 * Filter threads based on thread filter criteria.
 */
export function filterThreads(threads: Thread[], filter: ThreadFilter): Thread[] {
  let result = threads;

  if (filter.category !== 'all') {
    result = result.filter((t) => t.category === filter.category);
  }

  if (filter.showUnreadOnly) {
    result = result.filter((t) => t.unreadCount > 0);
  }

  if (filter.showWithOpenActions) {
    result = result.filter((t) => t.openActionItemCount > 0);
  }

  if (filter.attachedDocumentId) {
    result = result.filter(
      (t) => t.category === 'document' && t.contextId === filter.attachedDocumentId
    );
  }

  return result;
}

/**
 * Filter messages by role visibility.
 * CPA sees all messages. Client sees only client_message messages.
 */
export function filterMessagesByRole(messages: Message[], role: 'cpa' | 'client'): Message[] {
  if (role === 'cpa') return messages;
  return messages.filter((m) => m.mode === 'client_message');
}

/**
 * Compute summary statistics for return fields.
 */
export function computeSummary(fields: ReturnField[]) {
  const total = fields.length;
  const traced = fields.filter((f) => f.status === 'traced').length;
  const partial = fields.filter((f) => f.status === 'partial').length;
  const manual = fields.filter((f) => f.status === 'manual_entry').length;
  const reviewed = fields.filter((f) => f.isReviewed).length;
  const tracedPercent = total > 0 ? Math.round((traced / total) * 100) : 0;

  return { total, traced, partial, manual, reviewed, tracedPercent };
}

/**
 * Group action items by owner, return groups with counts.
 */
export function groupActionItemsByOwner(items: ActionItem[]): { ownerName: string; count: number; items: ActionItem[] }[] {
  const map = new Map<string, ActionItem[]>();
  for (const item of items) {
    const existing = map.get(item.ownerName) ?? [];
    existing.push(item);
    map.set(item.ownerName, existing);
  }
  return Array.from(map.entries()).map(([ownerName, items]) => ({
    ownerName,
    count: items.length,
    items,
  }));
}

/**
 * Count open action items for a specific user.
 */
export function countOpenItemsForUser(items: ActionItem[], userId: string): number {
  return items.filter((i) => i.status === 'open' && i.ownerId === userId).length;
}
