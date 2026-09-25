import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, Layers, Hash } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useProjects } from '../hooks/useProjects';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed } = useUIStore();
  const { data: projects } = useProjects();

  return (
    <aside
      className={`h-screen bg-slate-950 border-r border-border-subtle flex flex-col shrink-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-border-subtle gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
          <Layers size={18} />
        </div>
        {!isSidebarCollapsed && (
          <span className="font-display text-lg font-bold tracking-tight text-white">
            AgileFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`
          }
          title="Dashboard"
        >
          <LayoutDashboard size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`
          }
          title="Projects"
        >
          <FolderKanban size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span>Projects</span>}
        </NavLink>

        {/* Quick Project Boards */}
        {!isSidebarCollapsed && projects && projects.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border-subtle/60 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-3 py-1">
              Active Boards
            </span>
            {projects.map((proj) => (
              <NavLink
                key={proj.id}
                to={`/projects/${proj.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors truncate ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
                title={proj.name}
              >
                <Hash size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{proj.name}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Settings Footer */}
        <div className="mt-auto pt-3 border-t border-border-subtle/60">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 opacity-60 cursor-not-allowed"
            title="Settings"
          >
            <Settings size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </div>
        </div>
      </nav>
    </aside>
  );
};
