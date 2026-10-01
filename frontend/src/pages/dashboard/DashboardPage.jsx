import React, { useEffect, useState } from 'react';
import { Users, Calendar, AlertTriangle, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAthleteStore from '../../store/athleteStore';
import useWorkoutStore from '../../store/workoutStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const navigate = useNavigate();

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [wellnessAvg, setWellnessAvg] = useState(0);
  const [pseAlertsCount, setPseAlertsCount] = useState(0);

  useEffect(() => {
    fetchAthletes();
    fetchWorkouts(); // gets all workouts for trainer
  }, [fetchAthletes, fetchWorkouts]);

  useEffect(() => {
    const loadMonitoringData = async () => {
      if (athletes.length === 0) return;

      let totalWellness = 0;
      let wellnessCount = 0;
      let pseAlerts = 0;
      let alerts = [];

      try {
        const promises = athletes.map(async (athlete) => {
          const [pseRes, wellRes] = await Promise.all([
            api.get(`/api/v1/monitoring/pse/${athlete.id}`),
            api.get(`/api/v1/monitoring/wellness/${athlete.id}`)
          ]);

          const latestPse = pseRes.data.length > 0 ? pseRes.data[0] : null;
          const latestWell = wellRes.data.length > 0 ? wellRes.data[0] : null;

          if (latestWell) {
            totalWellness += latestWell.average_score;
            wellnessCount += 1;
          }

          let hasAlert = false;
          if (latestPse && latestPse.pse_value >= 8) {
            pseAlerts += 1;
            hasAlert = true;
          }
          if (latestWell && latestWell.average_score <= 2.5) {
            hasAlert = true;
          }

          if (hasAlert) {
            alerts.push({
              athlete,
              latestPse,
              latestWell
            });
          }
        });

        await Promise.all(promises);

        setWellnessAvg(wellnessCount > 0 ? (totalWellness / wellnessCount).toFixed(1) : '-');
        setPseAlertsCount(pseAlerts);
        setRecentAlerts(alerts);
      } catch (error) {
        console.error("Error loading dashboard stats", error);
      }
    };

    loadMonitoringData();
  }, [athletes]);

  // Calc workouts today
  const todayStr = new Date().toISOString().split('T')[0];
  const workoutsToday = workouts.filter(w => w.scheduled_date === todayStr).length;

  const stats = [
    { title: 'Total Atletas', value: athletes.length, icon: Users, color: 'text-primary' },
    { title: 'Treinos Hoje', value: workoutsToday, icon: Calendar, color: 'text-secondary' },
    { title: 'Alertas PSE', value: pseAlertsCount, icon: AlertTriangle, color: 'text-danger' },
    { title: 'Média Bem-Estar', value: wellnessAvg, icon: Heart, color: 'text-success' },
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
        {recentAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAlerts.map(alert => (
              <Card key={alert.athlete.id} padding="p-4" className="flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigate(`/athletes/${alert.athlete.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {alert.athlete.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-text">{alert.athlete.name}</p>
                    <div className="flex gap-2 mt-1">
                      {alert.latestPse && (
                        <Badge variant={alert.latestPse.pse_value >= 8 ? 'danger' : 'success'}>
                          PSE {alert.latestPse.pse_value}
                        </Badge>
                      )}
                      {alert.latestWell && (
                        <Badge variant={alert.latestWell.average_score <= 2.5 ? 'warning' : 'info'}>
                          Bem-Estar {alert.latestWell.average_score.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <AlertTriangle className="h-5 w-5 text-danger" />
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="p-8" className="text-center text-gray-400 flex flex-col items-center justify-center">
            <Heart className="h-8 w-8 text-gray-600 mb-2" />
            <p>Nenhum alerta crítico no momento.</p>
            <p className="text-sm mt-1">Os atletas que reportarem PSE alta ou Bem-Estar baixo aparecerão aqui.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
