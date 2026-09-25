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
    <header className="h-16 bg-bg-surface/85 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
            className="w-full bg-slate-900/80 text-slate-100 placeholder:text-slate-500 border border-border-subtle focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-full py-1.5 pl-10 pr-4 text-xs transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-slate-900/60 border border-border-subtle/80 px-3 py-1.5 rounded-full shadow-sm">
          <Avatar
            name={currentUser?.name}
            color={currentUser?.avatar_color}
            size="sm"
          />
          <span className="text-xs font-semibold text-white">
            {currentUser?.name || 'Loading...'}
          </span>
          {users && users.length > 0 && (
            <select
              value={currentUser?.id}
              onChange={(e) => {
                const selected = users.find((u) => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              className="bg-transparent text-slate-400 hover:text-slate-200 border-none text-[11px] font-medium cursor-pointer outline-none pl-1"
              title="Switch demo persona"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-800 text-white">
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
