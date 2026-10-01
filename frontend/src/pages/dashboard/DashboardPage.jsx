import React, { useEffect, useState } from 'react';
import { Activity, Users, Dumbbell, AlertTriangle, TrendingUp, Heart } from 'lucide-react';
import useAthleteStore from '../../store/athleteStore';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import Card from '../../components/ui/Card';

const DashboardPage = () => {
  const { athletes, fetchAthletes } = useAthleteStore();
  const { user, athleteProfile } = useAuthStore();
  const [metrics, setMetrics] = useState({
    workoutsToday: 0,
    wellnessAvg: 0,
    alerts: []
  });

  useEffect(() => {
    if (user?.role === 'treinador' || user?.role === 'admin') {
      fetchAthletes();
    }
  }, [fetchAthletes, user]);

  useEffect(() => {
    const loadMetrics = async () => {
      if (user?.role === 'atleta') {
        // Lógica simples do atleta para o dashboard
        if (athleteProfile?.id) {
          try {
            const [pseRes, wellRes] = await Promise.all([
              api.get(`/api/v1/monitoring/pse/${athleteProfile.id}`),
              api.get(`/api/v1/monitoring/wellness/${athleteProfile.id}`)
            ]);
            const pses = pseRes.data;
            const wells = wellRes.data;
            const today = new Date().toISOString().split('T')[0];
            
            let wAvg = 0;
            if (wells.length > 0) {
              const recent = wells.slice(0, 5);
              wAvg = (recent.reduce((acc, curr) => acc + curr.average_score, 0) / recent.length).toFixed(1);
            }

            const alerts = [];
            const latestPse = pses[0];
            if (latestPse && latestPse.pse_value >= 8) {
              alerts.push({
                athlete: user.name,
                type: 'PSE Alto',
                value: latestPse.pse_value,
                date: latestPse.date
              });
            }

            setMetrics({
              workoutsToday: pses.filter(p => p.date === today).length,
              wellnessAvg: wAvg,
              alerts
            });
          } catch (e) {
            console.error(e);
          }
        }
        return;
      }

      // Lógica do Treinador
      if (athletes.length === 0) return;
      try {
        const today = new Date().toISOString().split('T')[0];
        let totalWorkouts = 0;
        let totalWellness = 0;
        let wellnessCount = 0;
        const allAlerts = [];

        await Promise.all(athletes.map(async (athlete) => {
          const [pseRes, wellRes] = await Promise.all([
            api.get(`/api/v1/monitoring/pse/${athlete.id}`).catch(() => ({ data: [] })),
            api.get(`/api/v1/monitoring/wellness/${athlete.id}`).catch(() => ({ data: [] }))
          ]);

          const pses = pseRes.data;
          const wells = wellRes.data;

          totalWorkouts += pses.filter(p => p.date === today).length;

          if (wells.length > 0) {
            totalWellness += wells[0].average_score;
            wellnessCount++;
            if (wells[0].average_score < 3) {
              allAlerts.push({
                athlete: athlete.name,
                type: 'Baixo Bem-estar',
                value: wells[0].average_score.toFixed(1),
                date: wells[0].date
              });
            }
          }

          if (pses.length > 0) {
            if (pses[0].pse_value >= 8) {
              allAlerts.push({
                athlete: athlete.name,
                type: 'PSE Alto',
                value: pses[0].pse_value,
                date: pses[0].date
              });
            }
          }
        }));

        setMetrics({
          workoutsToday: totalWorkouts,
          wellnessAvg: wellnessCount > 0 ? (totalWellness / wellnessCount).toFixed(1) : 0,
          alerts: allAlerts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
        });

      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      }
    };

    loadMetrics();
  }, [athletes, user, athleteProfile]);

  if (user?.role === 'atleta') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Meu Painel</h1>
          <p className="text-gray-400 mt-1">Bem-vindo, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Meu Bem-Estar (Média Recente)</p>
                <p className="text-3xl font-bold text-text mt-2">{metrics.wellnessAvg}/5</p>
              </div>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Treinos Registrados Hoje</p>
                <p className="text-3xl font-bold text-text mt-2">{metrics.workoutsToday}</p>
              </div>
              <div className="h-12 w-12 bg-success/20 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {metrics.alerts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-text mb-4">Meus Alertas</h2>
            <div className="grid gap-4">
              {metrics.alerts.map((alert, i) => (
                <Card key={i} className="border-l-4 border-l-warning">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-warning/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{alert.type}</h4>
                      <p className="text-sm text-gray-400">
                        Valor registrado: {alert.value} em {alert.date.split('-').reverse().join('/')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral do desempenho da equipe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total de Atletas</p>
              <p className="text-3xl font-bold text-text mt-2">{athletes.length}</p>
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Treinos Hoje</p>
              <p className="text-3xl font-bold text-text mt-2">{metrics.workoutsToday}</p>
            </div>
            <div className="h-12 w-12 bg-success/20 rounded-full flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Alertas de PSE</p>
              <p className="text-3xl font-bold text-text mt-2">
                {metrics.alerts.filter(a => a.type === 'PSE Alto').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-warning/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Média Bem-Estar</p>
              <p className="text-3xl font-bold text-text mt-2">{metrics.wellnessAvg}/5</p>
            </div>
            <div className="h-12 w-12 bg-info/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text">Alertas Recentes</h3>
            <button className="text-sm text-primary hover:text-primary/80">Ver todos</button>
          </div>
          <div className="space-y-4">
            {metrics.alerts.length > 0 ? metrics.alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${alert.type === 'PSE Alto' ? 'bg-warning' : 'bg-danger'}`} />
                  <div>
                    <p className="text-sm font-medium text-text">{alert.athlete}</p>
                    <p className="text-xs text-gray-400">{alert.type} ({alert.value})</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{alert.date.split('-').reverse().join('/')}</span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">Nenhum alerta recente.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text">Visão Geral da Equipe</h3>
            <button className="text-sm text-primary hover:text-primary/80">Ver detalhes</button>
          </div>
          <div className="h-48 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">Gráfico de Carga em desenvolvimento</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
