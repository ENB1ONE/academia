import React from 'react';
import { Outlet } from 'react-router-dom';
import CompleteSetupModal from './CompleteSetupModal';
import Sidebar from './Sidebar';
import ForcePasswordChangeModal from '../auth/ForcePasswordChangeModal';
import useAuthStore from '../../store/authStore';

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0A0A0C] overflow-hidden text-white">
      <ForcePasswordChangeModal />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header estilo FormClub (@form.club) */}
        <header className="h-16 bg-[#141418] border-b border-white/[0.08] px-6 flex items-center justify-between shadow-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#E5A910]/15 text-[#E5A910] font-black text-xs rounded-lg border border-[#E5A910]/30 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E5A910] animate-pulse" />
              FORMCLUB
            </span>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              Human Performance Center &bull; Monitoramento & Carga
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrador'}</p>
              <p className="text-[11px] text-[#E5A910] font-medium capitalize">{user?.role || 'Admin'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E5A910] text-[#0A0A0C] flex items-center justify-center font-black text-xs shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0A0A0C]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
