import { describe, it, expect } from 'vitest';
import { useUserStore } from '../userStore';
import { useUIStore } from '../uiStore';

describe('Zustand Stores', () => {
  describe('useUserStore', () => {
    it('initializes with default demo user', () => {
      const state = useUserStore.getState();
      expect(state.currentUser).toBeDefined();
      expect(state.currentUser?.name).toBe('John Smith');
    });

    it('updates current active persona correctly', () => {
      const newUser = {
        id: 'user-2',
        name: 'Sarah Connor',
        email: 'sarah.connor@example.com',
        avatar_color: '#10b981',
      };
      useUserStore.getState().setCurrentUser(newUser);
      expect(useUserStore.getState().currentUser?.id).toBe('user-2');
      expect(useUserStore.getState().currentUser?.name).toBe('Sarah Connor');
    });
  });

  describe('useUIStore', () => {
    it('toggles sidebar collapse state', () => {
      const initial = useUIStore.getState().isSidebarCollapsed;
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarCollapsed).toBe(!initial);
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarCollapsed).toBe(initial);
    });

    it('updates search query', () => {
      useUIStore.getState().setSearchQuery('WOLF-12');
      expect(useUIStore.getState().searchQuery).toBe('WOLF-12');
    });
  });
});
