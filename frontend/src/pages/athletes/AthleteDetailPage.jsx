import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { 
  Download, Activity, Heart, Dumbbell, AlertTriangle, 
  Target, Zap, Flame, User, Calendar, ShieldCheck 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadChart from '../../components/charts/LoadChart';
import WellnessChart from '../../components/charts/WellnessChart';
import api from '../../services/api';

export default function AthleteDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isExporting, setIsExporting] = useState(false);
  const [athlete, setAthlete] = useState(null);

  // Dados das abas
  const [loadAnalysis, setLoadAnalysis] = useState(null);
  const [pseHistory, setPseHistory] = useState([]);
  const [wellnessHistory, setWellnessHistory] = useState([]);
  const [painHistory, setPainHistory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [cmjData, setCmjData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          athRes, 
          pseRes, 
          wellRes, 
          workRes, 
          painRes, 
          loadRes, 
          cmjRes,
          assRes,
          goalRes
        ] = await Promise.all([
          api.get(`/api/v1/athletes/${id}`),
          api.get(`/api/v1/monitoring/pse/${id}`).catch(() => ({ data: [] })),
          api.get(`/api/v1/monitoring/wellness/${id}`).catch(() => ({ data: [] })),
          api.get(`/api/v1/workouts/?athlete_id=${id}`).catch(() => ({ data: [] })),
          api.get(`/api/v1/monitoring/pain/${id}`).catch(() => ({ data: [] })),
          api.get(`/api/v1/monitoring/load-analysis/${id}`).catch(() => ({ data: null })),
          api.get(`/api/v1/monitoring/cmj/${id}`).catch(() => ({ data: null })),
          api.get(`/api/v1/assessments/athlete/${id}`).catch(() => ({ data: [] })),
          api.get(`/api/v1/goals/athlete/${id}`).catch(() => ({ data: [] })),
        ]);

        setAthlete(athRes?.data?.data ?? athRes?.data);
        setPseHistory(Array.isArray(pseRes?.data) ? pseRes.data : (pseRes?.data?.records || []));
        setWellnessHistory(Array.isArray(wellRes?.data) ? wellRes.data : (wellRes?.data?.records || []));
        setWorkouts(Array.isArray(workRes?.data) ? workRes.data : (workRes?.data?.workouts || []));
        setPainHistory(Array.isArray(painRes?.data) ? painRes.data : (painRes?.data?.records || []));
        setLoadAnalysis(loadRes?.data?.data ?? loadRes?.data ?? null);
        setCmjData(cmjRes?.data?.data ?? cmjRes?.data ?? null);
        setAssessments(Array.isArray(assRes?.data) ? assRes.data : (assRes?.data?.assessments || []));
        setGoals(Array.isArray(goalRes?.data) ? goalRes.data : (goalRes?.data?.goals || []));
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar dados completos do atleta');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const tabs = [
    { id: 'monitoring', label: 'Monitoramento & Carga (Foster/Gabbett)', icon: Flame },
    { id: 'workouts', label: 'Fichas de Treino (A/B/C/D)', icon: Dumbbell },
    { id: 'pain', label: 'Histórico de Dores', icon: AlertTriangle },
    { id: 'assessments', label: 'Avaliações & Salto CMJ', icon: Zap },
    { id: 'goals', label: 'Metas & OKRs', icon: Target },
    { id: 'profile', label: 'Perfil Cadastral', icon: User },
  ];

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Gerando Relatório Executivo PDF...');
    
    try {
      const element = document.getElementById('pdf-content');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0b0f19' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${athlete?.name?.replace(/\s+/g, '_')}_FormClub_Relatorio.pdf`);
      
      toast.success('Relatório PDF exportado com sucesso!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar o PDF', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-400">Carregando perfil analítico do atleta...</div>;
  }

  if (!athlete) {
    return <div className="p-12 text-center text-danger">Atleta não localizado.</div>;
  }

  const age = athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="pdf-content">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" /> Hub Analítico do Atleta
          </h1>
          <p className="text-xs text-gray-400">Prontuário fisiológico completo e prescrição integrada</p>
        </div>
        <Button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 self-start">
          <Download className="w-4 h-4" />
          {isExporting ? 'Gerando...' : 'Exportar Relatório PDF'}
        </Button>
      </div>

      {/* Card de Identificação */}
      <div className="bg-surface border border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl border-2 border-primary/40 shrink-0">
          {athlete.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-white">{athlete.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
              {athlete.category || 'Atleta'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs">
              {age} anos
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {athlete.sport || 'Modalidade Geral'} &bull; Posição: {athlete.position || 'Não informada'} &bull; Peso: {athlete.weight ? `${athlete.weight} kg` : '--'}
          </p>
        </div>

        {/* Mini ACWR Card */}
        {loadAnalysis && (
          <div className="p-3.5 bg-background/80 border border-gray-800 rounded-2xl text-center min-w-36">
            <span className="text-[10px] text-gray-400 uppercase font-mono">ACWR Atual</span>
            <p className="text-2xl font-black text-white mt-0.5">{loadAnalysis.acwr_current || '---'}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {loadAnalysis.acwr_zone || 'Estável'}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 overflow-x-auto">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <div className="mt-6">
        {/* ABA 1: MONITORAMENTO & CARGA (FOSTER / GABBETT) */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {loadAnalysis && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400">Carga Aguda (7d)</span>
                  <p className="text-2xl font-black text-white mt-1">{loadAnalysis.acute_load_7d} <span className="text-xs text-gray-500">UA</span></p>
                  <span className="text-[10px] text-gray-500">Volume semanal recente</span>
                </div>

                <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400">Carga Crônica (28d)</span>
                  <p className="text-2xl font-black text-white mt-1">{loadAnalysis.chronic_load_28d} <span className="text-xs text-gray-500">UA</span></p>
                  <span className="text-[10px] text-gray-500">Capacidade de suporte</span>
                </div>

                <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400">Monotonia (Foster)</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">{loadAnalysis.monotony || '---'}</p>
                  <span className="text-[10px] text-gray-500">&gt; 2.0 = Risco de sobretreino</span>
                </div>

                <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400">Strain (Esforço)</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">{loadAnalysis.strain || '---'}</p>
                  <span className="text-[10px] text-gray-500">Carga Semanal x Monotonia</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface border border-gray-800 rounded-3xl p-5 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" /> Histórico de Carga de Sessão (PSE)
                </h3>
                {pseHistory.length > 0 ? (
                  <div className="h-72">
                    <LoadChart data={pseHistory} />
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-500 text-xs">Nenhum registro de PSE.</div>
                )}
              </div>

              <div className="bg-surface border border-gray-800 rounded-3xl p-5 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" /> Evolução de Bem-Estar Diário
                </h3>
                {wellnessHistory.length > 0 ? (
                  <div className="h-72 flex justify-center">
                    <WellnessChart data={wellnessHistory} />
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-500 text-xs">Nenhum registro de Bem-Estar.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: FICHAS DE TREINO (A/B/C/D) */}
        {activeTab === 'workouts' && (
          <div className="space-y-4">
            {(!Array.isArray(workouts) || workouts.length === 0) ? (
              <div className="bg-surface border border-gray-800 rounded-2xl p-12 text-center text-gray-400 text-xs">
                Nenhum treino prescrito para este atleta. Acesse "Novo Treino" para criar a ficha.
              </div>
            ) : (
              workouts.map((workout) => (
                <div key={workout.id} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                    <span className="text-xs text-primary font-mono">{workout.scheduled_date || 'Ativo'}</span>
                  </div>
                  <p className="text-xs text-gray-400">Modalidade: {workout.workout_type} &bull; {workout.exercises?.length || 0} exercícios</p>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="divide-y divide-gray-800/60 pt-2">
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="py-2 flex items-center justify-between text-xs text-gray-300">
                          <span className="font-medium text-white">{ex.name}</span>
                          <span className="text-gray-400">
                            {ex.sets} séries &bull; {ex.reps} reps &bull; {ex.load_kg ? `${ex.load_kg} kg` : 'PC'} &bull; Descanso: {ex.rest_seconds || 60}s
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA 3: MAPA DE DOR */}
        {activeTab === 'pain' && (
          <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Registros de Dor</h3>
            {painHistory.length > 0 ? (
              <div className="space-y-3">
                {painHistory.map((p) => (
                  <div key={p.id} className="p-4 bg-background border border-gray-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {p.body_part} <span className="text-xs text-gray-400">({p.pain_type})</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(p.date).toLocaleDateString('pt-BR')} {p.notes ? `&bull; ${p.notes}` : ''}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      p.intensity >= 7 ? 'bg-danger/20 text-danger border-danger/40' : p.intensity >= 4 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      Nível {p.intensity}/10
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 text-xs">Nenhum registro de dor cadastrado.</div>
            )}
          </div>
        )}

        {/* ABA 4: AVALIAÇÕES & CMJ */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            {/* Salto CMJ */}
            {cmjData?.analysis && (
              <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Teste de Salto CMJ (Prontidão Neuromuscular)
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-background rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400">Média (Baseline)</span>
                    <p className="text-xl font-black text-white mt-1">{cmjData.analysis.baseline_mean_cm?.toFixed(1) || '--'} cm</p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400">Desvio Padrão (SD)</span>
                    <p className="text-xl font-black text-white mt-1">± {cmjData.analysis.sd_cm?.toFixed(1) || '--'} cm</p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400">Coef. Variação (CV)</span>
                    <p className="text-xl font-black text-primary mt-1">{cmjData.analysis.cv_percent?.toFixed(1) || '--'}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Testes Customizados */}
            <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Histórico de Testes e Avaliações</h3>
              {(Array.isArray(assessments) && assessments.length > 0) ? (
                <div className="divide-y divide-gray-800">
                  {assessments.map((a) => (
                    <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white text-sm">{a.assessment_type?.name}</span>
                        <span className="text-gray-500 font-mono ml-2">({a.test_date})</span>
                        {a.notes && <p className="text-gray-400 mt-0.5">{a.notes}</p>}
                      </div>
                      <span className="text-base font-black text-primary">
                        {a.value} {a.assessment_type?.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500 text-xs">Nenhuma avaliação física registrada.</div>
              )}
            </div>
          </div>
        )}

        {/* ABA 5: METAS & OKRS */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            {(Array.isArray(goals) && goals.length > 0) ? (
              goals.map((g) => {
                const pct = Math.min(100, Math.max(0, Math.round(((g.current_value || 0) / (g.target_value || 1)) * 100)));
                return (
                  <div key={g.id} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white text-sm">{g.title}</span>
                      <span className="font-mono text-primary font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-gray-700">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[11px] text-gray-400">{g.current_value} / {g.target_value} {g.unit}</p>
                  </div>
                );
              })
            ) : (
              <div className="bg-surface border border-gray-800 rounded-2xl p-12 text-center text-gray-500 text-xs">
                Nenhuma meta cadastrada para este atleta.
              </div>
            )}
          </div>
        )}

        {/* ABA 6: PERFIL CADASTRAL */}
        {activeTab === 'profile' && (
          <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div>
                <p className="text-gray-400">Nome Completo</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.name}</p>
              </div>
              <div>
                <p className="text-gray-400">E-mail</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.email || athlete.user?.email || '--'}</p>
              </div>
              <div>
                <p className="text-gray-400">Modalidade Esportiva</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.sport || '--'}</p>
              </div>
              <div>
                <p className="text-gray-400">Posição / Especialidade</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.position || '--'}</p>
              </div>
              <div>
                <p className="text-gray-400">Membro Dominante</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.dominant_limb || '--'}</p>
              </div>
              <div>
                <p className="text-gray-400">Nível de Experiência</p>
                <p className="font-bold text-white text-sm mt-0.5">{athlete.experience_level || '--'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
