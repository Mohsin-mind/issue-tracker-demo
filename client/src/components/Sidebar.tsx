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
      className={`h-screen bg-white border-r border-border-subtle flex flex-col shrink-0 transition-all duration-300 shadow-xs z-20 ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-border-subtle gap-3">
        <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Layers size={19} />
        </div>
        {!isSidebarCollapsed && (
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            AgileFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 flex flex-col gap-1.5 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
          }
          title="Projects"
        >
          <FolderKanban size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span>Projects</span>}
        </NavLink>

        {/* Quick Project Boards */}
        {!isSidebarCollapsed && projects && projects.length > 0 && (
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3.5 py-1">
              Active Boards
            </span>
            {projects.map((proj) => (
              <NavLink
                key={proj.id}
                to={`/projects/${proj.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all truncate ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
                title={proj.name}
              >
                <Hash size={13} className="text-indigo-500 shrink-0" />
                <span className="truncate">{proj.name}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Settings Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 opacity-60 cursor-not-allowed"
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
