import React from 'react';
import { Outlet } from 'react-router-dom';
import CompleteSetupModal from './CompleteSetupModal';
import Sidebar from './Sidebar';
import ForcePasswordChangeModal from '../auth/ForcePasswordChangeModal';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      <ForcePasswordChangeModal />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
