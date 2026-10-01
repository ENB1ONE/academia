import React from 'react';
import { Users, Calendar, AlertTriangle, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const mockRecentAthletes = [
  { id: 1, name: 'Lucas Silva', pse: 8, wellness: 3.2, alert: true },
  { id: 2, name: 'Pedro Santos', pse: 5, wellness: 4.5, alert: false },
  { id: 3, name: 'Marcos Oliveira', pse: 9, wellness: 2.1, alert: true },
  { id: 4, name: 'Rafael Costa', pse: 4, wellness: 4.8, alert: false },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Atletas', value: '24', icon: Users, color: 'text-primary' },
    { title: 'Treinos Hoje', value: '12', icon: Calendar, color: 'text-secondary' },
    { title: 'Alertas PSE', value: '3', icon: AlertTriangle, color: 'text-danger' },
    { title: 'Média Bem-Estar', value: '4.2', icon: Heart, color: 'text-success' },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRecentAthletes.map(athlete => (
            <Card key={athlete.id} padding="p-4" className="flex items-center justify-between" onClick={() => navigate(`/athletes/${athlete.id}`)}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-text font-bold">
                  {athlete.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text">{athlete.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={athlete.pse > 7 ? 'danger' : 'success'}>PSE {athlete.pse}</Badge>
                    <Badge variant={athlete.wellness < 3 ? 'warning' : 'info'}>Bem-Estar {athlete.wellness}</Badge>
                  </div>
                </div>
              </div>
              {athlete.alert && <AlertTriangle className="h-5 w-5 text-danger" />}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
