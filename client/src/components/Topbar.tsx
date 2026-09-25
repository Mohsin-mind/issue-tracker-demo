import React, { useEffect } from 'react';
import { Search, Menu, ChevronDown } from 'lucide-react';
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
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, keys across projects..."
            className="w-full h-10 bg-slate-100/90 text-slate-900 placeholder:text-slate-400 border border-slate-200/90 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-11 pr-4 text-xs font-medium transition-all outline-none shadow-2xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Persona Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
          <Avatar
            name={currentUser?.name}
            color={currentUser?.avatar_color}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name || 'Loading...'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Demo Persona
            </span>
          </div>

          {users && users.length > 0 && (
            <div className="relative flex items-center pl-1 border-l border-slate-200">
              <select
                value={currentUser?.id}
                onChange={(e) => {
                  const selected = users.find((u) => u.id === e.target.value);
                  if (selected) setCurrentUser(selected);
                }}
                className="appearance-none bg-transparent text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer outline-none pr-5 pl-2 py-0.5"
                title="Switch demo persona"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-white text-slate-800 py-1">
                    Switch to {u.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="text-slate-400 pointer-events-none absolute right-0" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
