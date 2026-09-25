import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  searchQuery: string;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
