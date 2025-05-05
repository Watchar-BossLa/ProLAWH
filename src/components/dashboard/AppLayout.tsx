
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { CareerTwinListener } from '@/components/career/CareerTwinListener';
import { CareerTwinRecommendationNotification } from '@/components/career/CareerTwinRecommendationNotification';

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
      
      {/* AI Career Twin tracking and notification system */}
      <CareerTwinListener />
      <CareerTwinRecommendationNotification />
    </div>
  );
}
