import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-bg-app text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-app">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
