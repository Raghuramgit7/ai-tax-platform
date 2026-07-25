import type { ActionItem } from '@/types';

export const actionItems: ActionItem[] = [
  {
    id: 'ai-1',
    threadId: 'thread-1',
    description: 'Confirm W-2 wages from Acme Corp match your records',
    ownerId: 'client-1',
    ownerName: 'Michael Johnson',
    ownerRole: 'client',
    status: 'completed',
    createdAt: '2025-06-10T10:05:00Z',
    completedAt: '2025-06-11T08:30:00Z',
    completedBy: 'Michael Johnson',
  },
  {
    id: 'ai-2',
    threadId: 'thread-2',
    description: 'Upload complete 1099-B from TD Ameritrade with all transaction details',
    ownerId: 'client-1',
    ownerName: 'Michael Johnson',
    ownerRole: 'client',
    status: 'open',
    createdAt: '2025-06-12T11:05:00Z',
    dueDate: '2025-06-20T00:00:00Z',
  },
  {
    id: 'ai-3',
    threadId: 'thread-2',
    description: 'Review capital gains calculation once full 1099-B is uploaded',
    ownerId: 'cpa-1',
    ownerName: 'Sarah Chen, CPA',
    ownerRole: 'cpa',
    status: 'open',
    createdAt: '2025-06-12T11:10:00Z',
  },
];
