import React, { useEffect, useState } from 'react';
import { 
  Activity, Users, Dumbbell, AlertTriangle, TrendingUp, Heart, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowUpRight, Flame, Clock 
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import useAthleteStore from '../../store/athleteStore';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

export default function DashboardPage() {
  const { athletes, fetchAthletes } = useAthleteStore();
  const { user, athleteProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      total_athletes: 0,
      workouts_7d: 0,
      avg_readiness_pct: 0,
      active_pain_records: 0,
    },
    gabbett_matrix: {
      destraining: 0,
      optimal: 0,
      attention: 0,
      high_risk: 0,
    },
    low_readiness_athletes: [],
    recent_activity: [],
    group_stats: [],
  });

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/reports/dashboard/metrics');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Erro ao buscar métricas executivas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    if (user?.role === 'treinador' || user?.role === 'admin') {
      fetchAthletes();
    }
  }, [user]);

  const gabbettTotal = 
    (data.gabbett_matrix?.destraining || 0) +
    (data.gabbett_matrix?.optimal || 0) +
    (data.gabbett_matrix?.attention || 0) +
    (data.gabbett_matrix?.high_risk || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" /> Painel Executivo FormClub
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Monitoramento fisiológico em tempo real &bull; Motor Foster (1998) & Gabbett (2016)
          </p>
        </div>
        <button
          onClick={loadMetrics}
          className="px-3.5 py-2 bg-surface border border-gray-700 hover:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-300 flex items-center gap-2 self-start transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar Métricas
        </button>
      </div>

      {/* 4 KPIs de Topo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total de Atletas</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-white">{data.summary?.total_athletes || 0}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Cadastrados no sistema</p>
          </div>
        </div>

        <div className="bg-surface border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Treinos (7 dias)</span>
            <Dumbbell className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-white">{data.summary?.workouts_7d || 0}</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Sessões realizadas</p>
          </div>
        </div>

        <div className="bg-surface border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Prontidão Média</span>
            <Heart className="h-5 w-5 text-purple-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-purple-400">
              {data.summary?.avg_readiness_pct ? `${data.summary.avg_readiness_pct}%` : '---'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Índice de Bem-Estar</p>
          </div>
        </div>

        <div className="bg-surface border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Dores Ativas</span>
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">
              {data.summary?.active_pain_records || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">No mapa anatômico</p>
          </div>
        </div>
      </div>

      {/* Seção 2: Matriz de Risco ACWR (Gabbett 2016) e Alertas de Prontidão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matriz Gabbett */}
        <div className="lg:col-span-7 bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" /> Matriz de Risco ACWR (Gabbett, 2016)
              </h2>
              <p className="text-xs text-gray-400">
                Distribuição dos atletas conforme a Razão Carga Aguda:Crônica (7d / 28d)
              </p>
            </div>
            <span className="text-xs font-mono text-gray-500">{gabbettTotal} avaliados</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                Destreino
              </span>
              <span className="text-[10px] text-gray-400 font-mono">&lt; 0.80</span>
              <p className="text-2xl font-black text-blue-400 mt-1">
                {data.gabbett_matrix?.destraining || 0}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Zona Ótima
              </span>
              <span className="text-[10px] text-gray-400 font-mono">0.80 - 1.30</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {data.gabbett_matrix?.optimal || 0}
              </p>
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Atenção
              </span>
              <span className="text-[10px] text-gray-400 font-mono">1.31 - 1.49</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {data.gabbett_matrix?.attention || 0}
              </p>
            </div>

            <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-danger uppercase tracking-wider block">
                Alto Risco
              </span>
              <span className="text-[10px] text-gray-400 font-mono">&gt;= 1.50</span>
              <p className="text-2xl font-black text-danger mt-1">
                {data.gabbett_matrix?.high_risk || 0}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-background/60 border border-gray-800 rounded-xl text-xs text-gray-400 leading-relaxed flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Zona Ótima (Sweet Spot):</strong> Maximiza a aptidão física e reduz a incidência de lesões por sobrecarga. Valores acima de 1.50 exigem redução imediata de volume/intensidade.
            </span>
          </div>
        </div>

        {/* Alertas de Prontidão Baixa (< 70%) */}
        <div className="lg:col-span-5 bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-danger" /> Prontidão Crítica (&lt; 70%)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-danger/20 text-danger border border-danger/30 font-bold">
                {data.low_readiness_athletes?.length || 0} atletas
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Atletas com recuperação comprometida ou sintomas de fadiga aguda hoje:
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {(!data.low_readiness_athletes || data.low_readiness_athletes.length === 0) ? (
                <div className="p-6 text-center text-xs text-gray-500 bg-background/30 rounded-2xl border border-gray-800">
                  Nenhum atleta em nível crítico hoje. Todos com prontidão &gt;= 70%.
                </div>
              ) : (
                data.low_readiness_athletes.map((ath, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-danger/10 border border-danger/30 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{ath.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Sono: {ath.sleep_quality || '-'}/5 &bull; Fadiga: {ath.fatigue || '-'}/5 &bull; Dor: {ath.muscle_soreness || '-'}/5
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-danger">{ath.readiness_pct}%</span>
                      <span className="block text-[10px] text-danger font-medium">Alerta Ativo</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-end">
            <a
              href="#/monitoring/wellness"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              Ver todos os questionários &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Seção 3: Atividade Recente do Feed */}
      <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Feed de Atividades Recentes
        </h2>

        {(!data.recent_activity || data.recent_activity.length === 0) ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Nenhuma atividade registrada nos últimos dias.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {data.recent_activity.slice(0, 8).map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between hover:bg-background/30 transition text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <span className="font-bold text-white">{act.athlete_name}</span>
                    <span className="text-gray-400 ml-2">{act.description}</span>
                  </div>
                </div>
                <span className="text-gray-500 font-mono text-[11px]">{act.time_ago || act.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
