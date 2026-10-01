import React, { useEffect } from 'react';
import { Users, Calendar, AlertTriangle, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAthleteStore from '../../store/athleteStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { athletes, fetchAthletes, isLoading } = useAthleteStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // For now, these are 0 until we integrate the other modules
  const stats = [
    { title: 'Total Atletas', value: isLoading ? '...' : athletes.length, icon: Users, color: 'text-primary' },
    { title: 'Treinos Hoje', value: '0', icon: Calendar, color: 'text-secondary' },
    { title: 'Alertas PSE', value: '0', icon: AlertTriangle, color: 'text-danger' },
    { title: 'Média Bem-Estar', value: '-', icon: Heart, color: 'text-success' },
  ];

  // Empty until we fetch real PSE/Wellness alerts
  const recentAlerts = []; 

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Olá, {user?.name?.split(' ')[0] || 'Treinador'}</h1>
          <p className="text-gray-400 mt-1">Aqui está o resumo das suas equipes hoje.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/workouts/new')} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" /> Novo Treino
          </Button>
          <Button onClick={() => navigate('/monitoring/pse')} variant="primary" className="gap-2">
            Registrar PSE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-surface border border-gray-700 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-bold text-text mb-4">Atenção Recente</h2>
        {recentAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAlerts.map(athlete => (
              <Card key={athlete.id} padding="p-4" className="flex items-center justify-between" onClick={() => navigate(`/athletes/${athlete.id}`)}>
                {/* Structure for future use */}
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="p-8" className="text-center text-gray-400 flex flex-col items-center justify-center">
            <Heart className="h-8 w-8 text-gray-600 mb-2" />
            <p>Nenhum alerta crítico no momento.</p>
            <p className="text-sm">Os atletas que reportarem PSE alto ou Bem-estar baixo aparecerão aqui.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
