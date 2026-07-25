import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterMessagesByRole, countOpenItemsForUser, groupActionItemsByOwner } from '../../src/utils/filters';
import type { Message, ActionItem } from '../../src/types';

// === Generators ===

const messageGen: fc.Arbitrary<Message> = fc.record({
  id: fc.uuid(),
  threadId: fc.constant('thread-1'),
  authorId: fc.constantFrom('cpa-1', 'client-1'),
  authorName: fc.constantFrom('Sarah Chen', 'Michael Johnson'),
  authorRole: fc.constantFrom('cpa' as const, 'client' as const),
  mode: fc.constantFrom('internal_note' as const, 'client_message' as const),
  content: fc.string({ minLength: 1, maxLength: 200 }),
  createdAt: fc.constant('2025-06-10T09:00:00Z'),
});

const actionItemGen: fc.Arbitrary<ActionItem> = fc.record({
  id: fc.uuid(),
  threadId: fc.constant('thread-1'),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  ownerId: fc.constantFrom('cpa-1', 'client-1'),
  ownerName: fc.constantFrom('Sarah Chen', 'Michael Johnson'),
  ownerRole: fc.constantFrom('cpa' as const, 'client' as const),
  status: fc.constantFrom('open' as const, 'completed' as const),
  createdAt: fc.constant('2025-06-10T09:00:00Z'),
  dueDate: fc.option(fc.constant('2025-06-20T00:00:00Z'), { nil: undefined }),
  completedAt: fc.option(fc.constant('2025-06-15T09:00:00Z'), { nil: undefined }),
  completedBy: fc.option(fc.constant('Sarah Chen'), { nil: undefined }),
});

// === Tests ===

describe('Property 14: Message Visibility by Role', () => {
  it('CPA sees all messages', () => {
    fc.assert(
      fc.property(fc.array(messageGen, { minLength: 0, maxLength: 20 }), (messages) => {
        const visible = filterMessagesByRole(messages, 'cpa');
        expect(visible).toHaveLength(messages.length);
      }),
      { numRuns: 100 }
    );
  });

  it('Client sees only client_message messages', () => {
    fc.assert(
      fc.property(fc.array(messageGen, { minLength: 0, maxLength: 20 }), (messages) => {
        const visible = filterMessagesByRole(messages, 'client');
        const expected = messages.filter((m) => m.mode === 'client_message');
        expect(visible).toHaveLength(expected.length);
        visible.forEach((m) => expect(m.mode).toBe('client_message'));
      }),
      { numRuns: 100 }
    );
  });

  it('Client view has no gaps (indices are contiguous)', () => {
    fc.assert(
      fc.property(fc.array(messageGen, { minLength: 0, maxLength: 20 }), (messages) => {
        const visible = filterMessagesByRole(messages, 'client');
        // Verify it's a contiguous subsequence of client_messages (no gaps)
        const clientMsgs = messages.filter((m) => m.mode === 'client_message');
        expect(visible).toEqual(clientMsgs);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 16: Action Items Grouped by Owner with Counts', () => {
  it('groups partition items correctly and counts match', () => {
    fc.assert(
      fc.property(fc.array(actionItemGen, { minLength: 0, maxLength: 15 }), (items) => {
        const groups = groupActionItemsByOwner(items);

        // Total items across all groups equals input
        const totalInGroups = groups.reduce((sum, g) => sum + g.items.length, 0);
        expect(totalInGroups).toBe(items.length);

        // Each group's count matches its items length
        groups.forEach((group) => {
          expect(group.count).toBe(group.items.length);
          // All items in group have the same ownerName
          group.items.forEach((item) => {
            expect(item.ownerName).toBe(group.ownerName);
          });
        });
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 17: Open Action Item Badge Count', () => {
  it('badge count equals open items assigned to specific user', () => {
    fc.assert(
      fc.property(
        fc.array(actionItemGen, { minLength: 0, maxLength: 15 }),
        fc.constantFrom('cpa-1', 'client-1'),
        (items, userId) => {
          const count = countOpenItemsForUser(items, userId);
          const expected = items.filter((i) => i.status === 'open' && i.ownerId === userId).length;
          expect(count).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});
