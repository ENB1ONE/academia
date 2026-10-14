import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, Users, Dumbbell, Heart, Brain, LogOut, Menu, X, Flower2, 
  Zap, Shield, User, Calendar, Target, Settings, Share2, ClipboardList, Monitor 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Logo from '../ui/Logo';

const Sidebar = () => {
  const { user, athleteProfile, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [name, setName] = useState(user?.name || 'Usuário');

  const isAdmin = user?.role === 'admin';
  const isTreinador = user?.role === 'treinador' || isAdmin;
  const isAtleta = user?.role === 'atleta';

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const links = [
    { to: '/dashboard', icon: Activity, label: isAtleta ? 'Meu Painel' : 'Dashboard', show: true },
    { to: '/athletes', icon: Users, label: 'Atletas', show: isTreinador },
    { to: '/groups', icon: Users, label: 'Turmas / Grupos', show: isTreinador },
    { to: '/planning', icon: Calendar, label: 'Planejamento Carga', show: isTreinador },
    { to: '/workouts/new', icon: Dumbbell, label: 'Novo Treino', show: isTreinador },
    { to: '/workouts/collective-log', icon: Dumbbell, label: 'Treino Coletivo', show: isTreinador },
    { to: '/monitoring/pre-workout', icon: Activity, label: 'Pré-Treino (PSR)', show: true },
    { to: '/monitoring/pse', icon: Brain, label: 'Registrar PSE', show: true },
    { to: '/monitoring/wellness', icon: Heart, label: 'Bem-Estar (Hooper)', show: true },
    { to: '/monitoring/neuromuscular', icon: Zap, label: 'Salto CMJ', show: isTreinador },
    { to: '/monitoring/pain', icon: Activity, label: 'Mapa de Dor', show: true },
    { to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual', show: isTreinador || (user?.role === 'atleta' && athleteProfile?.gender === 'Feminino') },
    { to: '/monitoring/physical-tests', icon: Zap, label: 'Testes Físicos', show: isTreinador },
    { to: '/assessments/record', icon: ClipboardList, label: 'Lançar Avaliação', show: isTreinador },
    { to: '/goals', icon: Target, label: 'Metas / OKRs', show: true },
    { to: '/monitoring/invite', icon: Share2, label: 'Link de Convite', show: isTreinador },
    { to: '/totem', icon: Monitor, label: 'Modo Totem Kiosk', show: isTreinador },
    { to: '/settings/workout-types', icon: Settings, label: 'Tipos de Treino', show: isTreinador },
    { to: '/profile', icon: User, label: 'Meu Perfil', show: true },
    { to: '/admin/trainers', icon: Shield, label: 'Treinadores', show: isAdmin },
  ].filter(link => link.show);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
      isActive 
        ? 'bg-[#3B7DDD] text-white shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <Logo className="h-10" />
        </div>
        <button 
          className="p-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar branca estilo eLoad */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 flex flex-col shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="py-5 px-4 flex justify-center border-b border-gray-100 shrink-0">
          <Logo className="h-20" />
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setIsOpen(false)}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-2.5 mb-2 px-1">
            <div className="h-8 w-8 rounded-full bg-[#3B7DDD]/15 text-[#3B7DDD] flex items-center justify-center font-bold text-xs border border-[#3B7DDD]/20 shrink-0">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{name}</p>
              <p className="text-[10px] text-gray-500 truncate capitalize">{user?.role || 'Visitante'}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); window.location.href = '/academia/'; }}
            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair da Conta
          </button>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
