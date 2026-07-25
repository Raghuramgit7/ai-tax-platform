import type { User } from '@/types';

export const users: User[] = [
  { id: 'cpa-1', name: 'Sarah Chen, CPA', role: 'cpa' },
  { id: 'client-1', name: 'Michael Johnson', role: 'client' },
];

export const currentUser: User = users[0]; // Default to CPA for demo
