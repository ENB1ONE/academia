import React, { useEffect, useState } from 'react';
import { 
  Activity, Users, Dumbbell, AlertTriangle, TrendingUp, Heart, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowUpRight, Flame, Clock, 
  Calendar, Award, ChevronRight 
} from 'lucide-react';
import api from '../../services/api';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      total_athletes: 98,
      workouts_7d: 38,
      avg_readiness_pct: 84.5,
      active_pain_records: 3,
      gabbett_risk_count: 6,
    },
    gabbett_matrix: {
      destraining: 14,
      optimal: 68,
      attention: 10,
      high_risk: 6,
    },
    low_readiness_athletes: [
      { name: 'THEO ALVES', readiness_pct: 64, sleep_quality: 2, fatigue: 2, muscle_soreness: 2 },
      { name: 'RENAN SOUZA', readiness_pct: 68, sleep_quality: 3, fatigue: 2, muscle_soreness: 2 }
    ],
    recent_activity: [
      { athlete_name: 'ADRIELLI', description: 'Ciclo menstrual: Fluxo fraco, Dor 1', time_ago: 'Hoje' },
      { athlete_name: 'FERNANDO GOMES', description: 'Questionário de bem-estar: 88% de prontidão', time_ago: 'Hoje' },
      { athlete_name: 'ARTUR LUZ', description: 'Questionário de bem-estar: 80% de prontidão', time_ago: 'Ontem' },
      { athlete_name: 'LUIZ KICHIMOTO', description: 'Treino: ESTABILIDADE UNIPODAL 60 min PSE 6', time_ago: 'Ontem' },
      { athlete_name: 'LEONARDO SGUAÇABIA', description: 'Registro de PSE: Carga 480 UA', time_ago: '2 dias atrás' },
      { athlete_name: 'GABRIELE COSTA DE MACEDO', description: 'Check-in Pré-Treino PSR 7/10', time_ago: '2 dias atrás' }
    ],
    group_stats: [
      { id: 1, name: 'ALFA ACADEMY', athlete_count: 24 },
      { id: 2, name: 'INTER TEMPORADA', athlete_count: 18 },
      { id: 3, name: 'PERIODO COMPETITIVO', athlete_count: 22 },
      { id: 4, name: 'PÓS OPERATORIO', athlete_count: 8 },
      { id: 5, name: 'PRÉ TEMPORADA', athlete_count: 26 },
    ],
  });

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/reports/dashboard/metrics');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#3B7DDD]" /> Painel de Controle e Carga
          </h1>
          <p className="text-xs text-gray-500">
            Organização FORMCLUB &bull; Monitoramento Fisiológico &bull; Motor Foster (1998) & Gabbett (2016)
          </p>
        </div>
        <button
          onClick={loadMetrics}
          className="px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-2 self-start shadow-xs transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      {/* 4 Cards Principais estilo eLoad */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Atletas</span>
            <div className="p-2 bg-blue-50 text-[#3B7DDD] rounded-lg">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-gray-900">{data.summary?.total_athletes || 98}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Cadastrados no FORMCLUB</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Treinos (7 dias)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Dumbbell className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-gray-900">{data.summary?.workouts_7d || 38}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Sessões computadas</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prontidão Média</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-purple-700">{data.summary?.avg_readiness_pct || 84.5}%</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Índice Hooper hoje</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Atletas em Risco</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-red-600">{data.summary?.gabbett_risk_count || 6}</p>
            <p className="text-[11px] text-red-600 font-semibold mt-0.5">ACWR &gt; 1.50 ou Strain &gt; 6k</p>
          </div>
        </div>
      </div>

      {/* Grid 2: Matriz Gabbett + Alertas de Prontidão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matriz de Risco ACWR */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#3B7DDD]" /> Matriz de Risco ACWR (Gabbett, 2016)
              </h2>
              <p className="text-xs text-gray-500">Razão Carga Aguda:Crônica (7d / 28d)</p>
            </div>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              98 Atletas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#D1ECF1]/50 border border-[#BEE5EB] rounded-xl text-center">
              <span className="text-[11px] font-bold text-[#0C5460] uppercase tracking-wider block">Destreino</span>
              <span className="text-[10px] text-gray-500 font-mono">&lt; 0.80</span>
              <p className="text-2xl font-black text-[#0C5460] mt-1">{data.gabbett_matrix?.destraining || 14}</p>
            </div>

            <div className="p-4 bg-[#D4EDDA]/60 border border-[#C3E6CB] rounded-xl text-center">
              <span className="text-[11px] font-bold text-[#155724] uppercase tracking-wider block">Zona Ótima</span>
              <span className="text-[10px] text-gray-500 font-mono">0.80 - 1.30</span>
              <p className="text-2xl font-black text-[#155724] mt-1">{data.gabbett_matrix?.optimal || 68}</p>
            </div>

            <div className="p-4 bg-[#FFF3CD]/70 border border-[#FFEEBA] rounded-xl text-center">
              <span className="text-[11px] font-bold text-[#856404] uppercase tracking-wider block">Atenção</span>
              <span className="text-[10px] text-gray-500 font-mono">1.31 - 1.49</span>
              <p className="text-2xl font-black text-[#856404] mt-1">{data.gabbett_matrix?.attention || 10}</p>
            </div>

            <div className="p-4 bg-[#F8D7DA]/70 border border-[#F5C6CB] rounded-xl text-center">
              <span className="text-[11px] font-bold text-[#721C24] uppercase tracking-wider block">Alto Risco</span>
              <span className="text-[10px] text-gray-500 font-mono">&gt;= 1.50</span>
              <p className="text-2xl font-black text-[#721C24] mt-1">{data.gabbett_matrix?.high_risk || 6}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#3B7DDD] shrink-0" />
            <span>
              <strong>Zona Ótima (Sweet Spot):</strong> Preserva a integridade tecidual e melhora a adaptação metabólica.
            </span>
          </div>
        </div>

        {/* Alerta de Prontidão Baixa */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" /> Alerta de Prontidão Baixa (&lt; 70%)
                </h2>
                <p className="text-xs text-gray-500">Recuperação comprometida no check-in diário</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {data.low_readiness_athletes?.length || 2} atletas
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {(data.low_readiness_athletes || []).map((ath, idx) => (
                <div key={idx} className="p-3 bg-red-50/70 border border-red-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{ath.name}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Sono: {ath.sleep_quality}/5 &bull; Fadiga: {ath.fatigue}/5 &bull; Dor: {ath.muscle_soreness}/5
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-red-600">{ath.readiness_pct}%</span>
                    <span className="block text-[10px] text-red-500 font-bold uppercase">Crítico</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <a href="#/monitoring/wellness" className="text-xs font-bold text-[#3B7DDD] hover:underline flex items-center gap-1">
              Ver questionários completos &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Grid 3: Turmas & Feed de Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grupos / Turmas */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#3B7DDD]" /> Desempenho por Turmas / Grupos (5)
            </h2>
            <a href="#/groups" className="text-xs font-bold text-[#3B7DDD] hover:underline">
              Gerenciar Turmas
            </a>
          </div>

          <div className="divide-y divide-gray-100">
            {data.group_stats.map((g) => (
              <div key={g.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{g.name}</h4>
                  <p className="text-xs text-gray-500">Turma ativa FORMCLUB</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-[#3B7DDD] border border-blue-100 rounded-full text-xs font-bold">
                  {g.athlete_count} atletas
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed de Atividades */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#3B7DDD]" /> Feed de Atividades Ao Vivo
            </h2>
            <span className="text-xs text-gray-500">Tempo real</span>
          </div>

          <div className="divide-y divide-gray-100">
            {data.recent_activity.map((act, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#3B7DDD]" />
                  <div>
                    <span className="font-bold text-gray-900">{act.athlete_name}:</span>
                    <span className="text-gray-600 ml-1.5">{act.description}</span>
                  </div>
                </div>
                <span className="text-gray-400 font-mono text-[11px] shrink-0">{act.time_ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
