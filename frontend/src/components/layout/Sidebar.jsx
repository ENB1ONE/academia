import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Users, Dumbbell, Heart, Brain, BarChart3, LogOut, Menu, X, Flower2, Zap } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Logo from '../ui/Logo';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/dashboard', icon: Activity, label: 'Dashboard' },
    { to: '/athletes', icon: Users, label: 'Atletas' },
    { to: '/workouts/new', icon: Dumbbell, label: 'Novo Treino' },
    { to: '/monitoring/pse', icon: Brain, label: 'Registrar PSE' },
    { to: '/monitoring/wellness', icon: Heart, label: 'Bem-Estar' },
    { to: '/monitoring/pain', icon: Activity, label: 'Mapa de Dor' },
    { to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual' },
    { to: '/monitoring/physical-tests', icon: Zap, label: 'Testes Físicos' },
  ];

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-gray-400 hover:bg-surface hover:text-text'
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Logo className="h-16" />
        </div>
        <button 
          className="p-2 bg-background rounded-lg text-text border border-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#1F2937] border-r border-gray-800 
        transform transition-transform duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="py-8 flex justify-center border-b border-gray-800">
          <Logo className="h-28" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setIsOpen(false)}>
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{user?.name || 'Treinador'}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role || 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
