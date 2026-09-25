import React, { useEffect } from 'react';
import { Search, Menu } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useUIStore } from '../stores/uiStore';
import { useUsers } from '../hooks/useUsers';
import { Avatar } from './common';

export const Topbar: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const { searchQuery, setSearchQuery, toggleSidebar } = useUIStore();
  const { data: users } = useUsers();

  // Initialize active persona with the first seeded user from backend
  useEffect(() => {
    if (users && users.length > 0 && (!currentUser || !users.some((u) => u.id === currentUser.id))) {
      setCurrentUser(users[0]);
    }
  }, [users, currentUser, setCurrentUser]);

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, keys across projects..."
            className="w-full bg-slate-100/90 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 rounded-full py-1.5 pl-10 pr-4 text-xs transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-slate-50 border border-border-subtle px-3 py-1.5 rounded-full shadow-xs">
          <Avatar
            name={currentUser?.name}
            color={currentUser?.avatar_color}
            size="sm"
          />
          <span className="text-xs font-semibold text-slate-800">
            {currentUser?.name || 'Loading...'}
          </span>
          {users && users.length > 0 && (
            <select
              value={currentUser?.id}
              onChange={(e) => {
                const selected = users.find((u) => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              className="bg-transparent text-slate-500 hover:text-slate-800 border-none text-[11px] font-medium cursor-pointer outline-none pl-1"
              title="Switch demo persona"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-white text-slate-800">
                  Persona: {u.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </header>
  );
};
