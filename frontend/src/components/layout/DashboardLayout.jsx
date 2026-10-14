import React from 'react';
import { Outlet } from 'react-router-dom';
import CompleteSetupModal from './CompleteSetupModal';
import Sidebar from './Sidebar';
import ForcePasswordChangeModal from '../auth/ForcePasswordChangeModal';
import useAuthStore from '../../store/authStore';

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F2F4F7] overflow-hidden text-[#212529]">
      <ForcePasswordChangeModal />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header estilo eLoad */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#3B7DDD]/10 text-[#3B7DDD] font-black text-xs rounded-md border border-[#3B7DDD]/20 tracking-wider">
              FORMCLUB
            </span>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Centro de Treinamento &bull; Gestão e Monitoramento de Carga
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'Administrador'}</p>
              <p className="text-[11px] text-gray-500 capitalize">{user?.role || 'Admin'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#3B7DDD] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F2F4F7]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
