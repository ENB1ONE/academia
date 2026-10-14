import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, Users, Dumbbell, Heart, Brain, LogOut, Menu, X, Flower2, 
  Zap, Shield, User, Calendar, Target, Settings, Share2, ClipboardList, Monitor,
  ChevronDown, Layers, FileText, CheckSquare, Award
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

  // Seções organizadas exatamente com a hierarquia do eLoad
  const menuSections = [
    {
      title: null,
      items: [
        { to: '/dashboard', icon: Activity, label: isAtleta ? 'Meu Painel' : 'Início', show: true },
      ]
    },
    {
      title: 'Cadastros',
      show: isTreinador,
      items: [
        { to: '/settings/workout-types', icon: Settings, label: 'Cadastrar Tipo de Treino', show: isTreinador },
        { to: '/groups', icon: Users, label: 'Cadastro de Grupo', show: isTreinador },
        { to: '/athletes', icon: Users, label: 'Cadastro de Atleta', show: isTreinador },
      ]
    },
    {
      title: 'Planejamento',
      show: isTreinador,
      items: [
        { to: '/planning?mode=individual', icon: Calendar, label: 'Individual', show: isTreinador },
        { to: '/planning?mode=collective', icon: Calendar, label: 'Coletivo', show: isTreinador },
      ]
    },
    {
      title: 'Treinamento',
      show: true,
      items: [
        { to: '/totem', icon: Monitor, label: 'Modo Totem', show: isTreinador },
        { to: '/monitoring/pre-workout', icon: Activity, label: 'Pré-Treino', show: true },
        { to: '/monitoring/pse', icon: Brain, label: 'Treino Individual', show: true },
        { to: '/workouts/collective-log', icon: Dumbbell, label: 'Treino Coletivo', show: isTreinador },
        { to: '/workouts/new', icon: Dumbbell, label: 'Prescrição de Fichas (A/B/C/D)', show: isTreinador },
      ]
    },
    {
      title: 'Monitoramento',
      show: true,
      items: [
        { to: '/athletes', icon: Users, label: 'Monitoramento Individual', show: isTreinador },
        { to: '/monitoring/wellness', icon: Heart, label: 'Questionário de Bem-Estar', show: true },
        { to: '/monitoring/pain', icon: Activity, label: 'Mapa Anatômico de Dor', show: true },
        { to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual', show: isTreinador || (user?.role === 'atleta' && athleteProfile?.gender === 'Feminino') },
        { to: '/monitoring/invite', icon: Share2, label: 'Convite de Monitoramento', show: isTreinador },
      ]
    },
    {
      title: 'Prontidão (CMJ)',
      show: isTreinador,
      items: [
        { to: '/monitoring/neuromuscular', icon: Zap, label: 'Status Neuromuscular', show: isTreinador },
        { to: '/monitoring/physical-tests', icon: Award, label: 'Testes Físicos', show: isTreinador },
      ]
    },
    {
      title: 'Avaliação de Desempenho',
      show: isTreinador,
      items: [
        { to: '/assessments/types', icon: ClipboardList, label: 'Cadastrar Avaliações', show: isTreinador },
        { to: '/assessments/record', icon: ClipboardList, label: 'Registrar Avaliações', show: isTreinador },
      ]
    },
    {
      title: null,
      items: [
        { to: '/goals', icon: Target, label: 'Objetivos e Metas', show: true },
        { to: '/profile', icon: User, label: 'Configurações / Perfil', show: true },
        { to: '/admin/trainers', icon: Shield, label: 'Treinadores & CREF', show: isAdmin },
      ]
    }
  ];

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
      isActive 
        ? 'bg-[#E5A910] text-[#0A0A0C] font-black shadow-[0_2px_12px_rgba(229,169,16,0.3)]' 
        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#141418] border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2">
          <Logo className="h-10" />
        </div>
        <button 
          className="p-2 bg-[#1A1A20] rounded-xl text-gray-300 border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar estilo FormClub Dark Luxury 1:1 eLoad */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#141418] border-r border-white/[0.08] 
        transform transition-transform duration-300 flex flex-col shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="py-5 px-4 flex justify-center border-b border-white/[0.08] shrink-0">
          <Logo className="h-20 drop-shadow-[0_2px_10px_rgba(229,169,16,0.2)]" />
        </div>

        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {menuSections.map((sec, sIdx) => {
            if (sec.show === false) return null;
            const validItems = sec.items.filter(i => i.show !== false);
            if (validItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                {sec.title && (
                  <p className="px-3 pt-2 pb-1 text-[10px] font-black text-[#E5A910] uppercase tracking-wider">
                    {sec.title}
                  </p>
                )}
                {validItems.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink 
                      key={link.to} 
                      to={link.to} 
                      className={navClass} 
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-3.5 border-t border-white/[0.08] shrink-0 bg-[#0E0E12]">
          <div className="flex items-center gap-2.5 mb-2.5 px-1">
            <div className="h-8 w-8 rounded-full bg-[#E5A910]/20 text-[#E5A910] flex items-center justify-center font-black text-xs border border-[#E5A910]/30 shrink-0">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{name}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role || 'Visitante'}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); window.location.href = '/academia/'; }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-danger hover:bg-danger/10 rounded-xl transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair da Conta
          </button>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
