import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { users } from '@/mocks/data/users';

interface AppStore {
  currentUser: User;
  setCurrentUser: (role: UserRole) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: users[0], // Default CPA

  setCurrentUser: (role) =>
    set({
      currentUser: users.find((u) => u.role === role) ?? users[0],
    }),
}));
