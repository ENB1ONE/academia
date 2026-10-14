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
  
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(user?.name || 'Usuário');

  const isAdmin = user?.role === 'admin';
  const isTreinador = user?.role === 'treinador' || isAdmin;
  const isAtleta = user?.role === 'atleta';

  useEffect(() => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`userAvatar_${user.id}`);
      if (savedAvatar) setAvatar(savedAvatar);
      
      const savedName = localStorage.getItem(`userName_${user.id}`);
      if (savedName) setName(savedName);
      else if (user?.name) setName(user.name);
      
      const interval = setInterval(() => {
        const currentAvatar = localStorage.getItem(`userAvatar_${user.id}`);
        if (currentAvatar !== avatar) setAvatar(currentAvatar);
        
        const currentName = localStorage.getItem(`userName_${user.id}`);
        if (currentName && currentName !== name) setName(currentName);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id, user?.name, avatar, name]);

  const links = [
    { to: '/dashboard', icon: Activity, label: isAtleta ? 'Meu Painel' : 'Dashboard', show: true },
    { to: '/athletes', icon: Users, label: 'Atletas', show: isTreinador },
    { to: '/groups', icon: Users, label: 'Turmas / Grupos', show: isTreinador },
    { to: '/planning', icon: Calendar, label: 'Planejamento Carga', show: isTreinador },
    { to: '/workouts/new', icon: Dumbbell, label: 'Novo Treino', show: isTreinador },
    { to: '/workouts/collective-log', icon: Dumbbell, label: 'Treino Coletivo', show: isTreinador },
    { to: '/monitoring/pre-workout', icon: Activity, label: 'Pré-Treino (PSR)', show: true },
    { to: '/monitoring/pse', icon: Brain, label: 'Registrar PSE', show: true },
    { to: '/monitoring/wellness', icon: Heart, label: 'Bem-Estar', show: true },
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
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-gray-400 hover:bg-surface hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Logo className="h-14" />
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
        <div className="py-6 flex justify-center border-b border-gray-800 shrink-0">
          <Logo className="h-24" />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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

        <div className="p-4 border-t border-gray-800 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover border border-primary/30 shrink-0" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30 shrink-0">
                {name.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role || 'Visitante'}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); window.location.href = '/academia/'; }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-danger hover:bg-danger/10 rounded-xl transition"
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
