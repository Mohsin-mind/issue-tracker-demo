import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: 'demo-user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar_color: '#6366f1',
  },
  setCurrentUser: (user: User) => set({ currentUser: user }),
}));
