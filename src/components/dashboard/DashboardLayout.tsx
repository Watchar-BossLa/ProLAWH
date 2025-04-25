
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
