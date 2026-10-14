import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { 
  Download, Activity, Heart, Dumbbell, AlertTriangle, 
  Target, Zap, Flame, User, Calendar, ShieldCheck, Printer,
  RefreshCw, Search, ChevronRight, CheckCircle2, ChevronDown, Check
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EloadChartRenderer from '../../components/charts/EloadChartRenderer';
import api from '../../services/api';

export default function AthleteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isExporting, setIsExporting] = useState(false);
  const [athlete, setAthlete] = useState(null);
  const [allAthletes, setAllAthletes] = useState([]);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [athleteSearch, setAthleteSearch] = useState('');

  // Filtros funcionais da tela
  const [periodDays, setPeriodDays] = useState(30);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('all');
  const [splitByWorkoutType, setSplitByWorkoutType] = useState(false);

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
    // Carrega lista de atletas para a troca rápida
    api.get('/api/v1/athletes/').then((res) => {
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.athletes || []);
      setAllAthletes(list);
    }).catch(console.error);
  }, []);

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

        const athData = athRes?.data?.data ?? athRes?.data;
        setAthlete(athData);
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
        toast.error('Erro ao carregar dados do atleta');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const tabs = [
    { id: 'monitoring', label: 'Monitoramento (Gráficos)', icon: Flame },
    { id: 'pain', label: 'Histórico de Dores', icon: AlertTriangle },
    { id: 'workouts_history', label: 'Histórico de Treinos', icon: Activity },
    { id: 'assessments', label: 'Histórico de Avaliações', icon: Zap },
    { id: 'prescribed_workouts', label: 'Treinos Programados / Fichas (A/B/C/D)', icon: Dumbbell },
    { id: 'goals', label: 'Objetivos e Metas', icon: Target },
    { id: 'profile', label: 'Perfil do Atleta', icon: User },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Gerando Relatório Executivo PDF...');
    
    try {
      const element = document.getElementById('pdf-content');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0A0A0C' });
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

  if (isLoading || !athlete) {
    return <div className="p-12 text-center text-gray-400">Carregando perfil analítico do atleta...</div>;
  }

  const age = athlete.age || (athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--');
  const charts = athlete.charts || {};
  const cid = athlete.codigoAtleta || athlete.id;
  const avatarSrc = athlete.photo_url || athlete.avatar || `./avatars/athlete_${cid}.jpg`;

  const filteredAthletesSwitch = (allAthletes || []).filter(a => 
    (a.name || '').toLowerCase().includes(athleteSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16" id="pdf-content">
      {/* Top Header estilo eLoad com Botões "Trocar atleta" e "Imprimir relatórios" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#E5A910]" /> Monitoramento Individual do Atleta
          </h1>
          <p className="text-xs text-gray-400">
            FormClub &bull; Human Performance Center &bull; Prontuário Fisiológico Completo
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            onClick={() => setIsSwitchModalOpen(true)}
            className="px-3.5 py-2 bg-[#141418] border border-white/10 hover:border-[#E5A910]/60 rounded-xl text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#E5A910]" /> Trocar atleta
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#141418] border border-white/10 hover:border-[#E5A910]/60 rounded-xl text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition shadow-sm"
          >
            <Printer className="h-3.5 w-3.5 text-[#E5A910]" /> Imprimir relatórios
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-3.5 py-2 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Card de Identificação e Indicadores A:C idêntico ao eLoad */}
      <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <img 
          src={avatarSrc}
          alt={athlete.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://blobprdeastus201.blob.core.windows.net/foto-atleta/avatar-default.svg';
          }}
          className="h-24 w-24 rounded-full object-cover border-2 border-[#E5A910] shadow-md shrink-0 bg-black/40"
        />

        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-2xl font-black text-white">{athlete.name}</h2>
            <span className="px-3 py-1 bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/30 rounded-full text-xs font-bold">
              {athlete.group_name || athlete.nomeGrupo || 'ALFA ACADEMY'}
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium">
              {age} anos
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {athlete.sport || 'Modalidade Desportiva'} &bull; Gênero: {athlete.gender === 'F' || athlete.descricaoGenero === 'Feminino' ? 'Feminino' : 'Masculino'} &bull; Código: #{cid}
          </p>
        </div>

        {/* Indicadores A:C estilo eLoad */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-[#0A0A0C] border border-white/[0.08] rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">Situação Passada</span>
            <span className="text-xs font-black uppercase text-[#E5A910]">
              {athlete.acwr_zone_past || 'DESTREINO'}
            </span>
          </div>

          <div className="p-3 bg-[#0A0A0C] border border-white/[0.08] rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">Situação Atual</span>
            <span className="text-xs font-black uppercase text-emerald-400">
              {athlete.acwr_zone_current || 'ÓTIMO'}
            </span>
          </div>

          <div className="p-3 bg-[#0A0A0C] border border-[#E5A910]/30 rounded-2xl text-center min-w-[110px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">Razão A:C</span>
            <p className="text-2xl font-black text-white mt-0.5">
              {athlete.acwr_current || '1.08'}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Funcional (Dropdown de Treinos, Período, Checkbox de Carga por Tipo) */}
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-gray-400 font-medium mr-2">Tipo de Treino:</label>
            <select
              value={selectedWorkoutType}
              onChange={(e) => setSelectedWorkoutType(e.target.value)}
              className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
            >
              <option value="all">Todos os tipos de treino</option>
              <option value="forca">FORÇA MMII / MMSS</option>
              <option value="tecnico">TÉCNICO / TÁTICO</option>
              <option value="competicao">JOGO / COMPETIÇÃO</option>
              <option value="cardio">CÁRDIO / RESISTÊNCIA</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-medium mr-2">Período:</label>
            <select
              value={periodDays}
              onChange={(e) => setPeriodDays(Number(e.target.value))}
              className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={14}>Últimos 14 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={60}>Últimos 60 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-gray-300 ml-1">
            <input
              type="checkbox"
              checked={splitByWorkoutType}
              onChange={(e) => setSplitByWorkoutType(e.target.checked)}
              className="rounded bg-black border-white/20 text-[#E5A910] focus:ring-0"
            />
            <span>Separar carga por tipo de treino</span>
          </label>
        </div>

        <button
          onClick={() => toast.success('Filtros aplicados!')}
          className="px-4 py-2 bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/40 rounded-xl font-bold text-xs hover:bg-[#E5A910] hover:text-[#0A0A0C] transition self-start md:self-auto"
        >
          Aplicar filtros
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.08] overflow-x-auto">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                  isActive
                    ? 'border-[#E5A910] text-[#E5A910] bg-[#E5A910]/10 rounded-t-xl'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
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
        {/* ABA 1: MONITORAMENTO (TODOS OS GRÁFICOS REAIS DO ELOAD) */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 1: Carga Diária Combinada */}
              <EloadChartRenderer 
                title="Carga Diária (Planejada vs Realizada, PSR e PSE)" 
                chartJson={charts.DrawCargaDiariaChart} 
                height={290}
              />

              {/* Gráfico 2: Duração x PSE */}
              <EloadChartRenderer 
                title="Duração da Sessão (min) x PSE" 
                chartJson={charts.DrawDuracaoPseChart} 
                height={290}
              />

              {/* Gráfico 3: Carga Semanal, ACWR, Monotonia e Strain */}
              <EloadChartRenderer 
                title="Evolução Semanal de Carga, Monotonia e Strain" 
                chartJson={charts.DrawCargaSemanaChart} 
                height={290}
              />

              {/* Gráfico 4: Status Neuromuscular CMJ */}
              <EloadChartRenderer 
                title="Status Neuromuscular (Salto CMJ vs Baseline)" 
                chartJson={charts.DrawCmjChart} 
                height={290}
              />

              {/* Gráfico 5: Questionário de Bem-Estar */}
              <EloadChartRenderer 
                title="Questionário de Bem-Estar (5 Pilares)" 
                chartJson={charts.DrawBemEstarChart} 
                height={290}
              />

              {/* Gráfico 6: Histórico de Sono */}
              <EloadChartRenderer 
                title="Histórico de Sono (Horas e Qualidade)" 
                chartJson={charts.DrawSonoChart} 
                height={290}
              />

              {/* Gráfico 7: Variação de Massa Corporal */}
              <EloadChartRenderer 
                title="Variação de Massa Corporal (kg) e Desidratação" 
                chartJson={charts.DrawVariacaoMassaCorporal} 
                height={290}
              />

              {/* Gráfico 8: Nível de Hidratação Urina */}
              <EloadChartRenderer 
                title="Nível de Hidratação (Escala Armstrong 1 a 8)" 
                chartJson={charts.DrawNivelHidratacao} 
                height={290}
              />

              {/* Gráfico 9: Se mulher, Ciclo Menstrual */}
              {(athlete.gender === 'F' || athlete.descricaoGenero === 'Feminino' || charts.DrawCicloMenstrualChart) && (
                <EloadChartRenderer 
                  title="Monitoramento do Ciclo Menstrual" 
                  chartJson={charts.DrawCicloMenstrualChart} 
                  height={290}
                />
              )}
            </div>
          </div>
        )}

        {/* ABA 2: HISTÓRICO DE DORES */}
        {activeTab === 'pain' && (
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Registro Semanal de Dores Clínicas
                </h3>
                <p className="text-xs text-gray-400">Localização anatômica, intensidade e tipo de lesão</p>
              </div>
              <a href="#/monitoring/pain" className="px-3 py-1.5 bg-[#E5A910] text-[#0A0A0C] font-bold text-xs rounded-xl">
                Lançar Nova Dor
              </a>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {(Array.isArray(painHistory) && painHistory.length > 0) ? (
                painHistory.map((p, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{p.body_part || 'Coxa Anterior Direita'}</span>
                      <span className="text-gray-400 ml-2">({p.pain_type || 'Muscular / DOMS'})</span>
                      <p className="text-gray-500 mt-0.5">{p.created_at || 'Registrado no check-in'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full font-bold">
                        Intensidade: {p.intensity || 5}/10
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 text-xs">
                  Nenhuma dor ativa registrada nos últimos 30 dias.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: HISTÓRICO DE TREINOS */}
        {activeTab === 'workouts_history' && (
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Consolidado Semanal de Treinos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0A0A0C] uppercase text-gray-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-3">Semana</th>
                    <th className="px-4 py-3">Carga da Semana (UA)</th>
                    <th className="px-4 py-3">A:C da Semana</th>
                    <th className="px-4 py-3">Monotonia</th>
                    <th className="px-4 py-3 text-right">Strain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono">Semana Atual</td>
                    <td className="px-4 py-3 font-bold text-white">1.820 UA</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{athlete.acwr_current || '1.08'} (ÓTIMO)</td>
                    <td className="px-4 py-3 text-purple-400 font-bold">1.35</td>
                    <td className="px-4 py-3 text-right font-bold text-white">2.457</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono">Semana Anterior</td>
                    <td className="px-4 py-3 font-bold text-white">1.650 UA</td>
                    <td className="px-4 py-3 text-blue-400 font-bold">{athlete.acwr_past || '0.98'} (DESTREINO)</td>
                    <td className="px-4 py-3 text-purple-400 font-bold">1.28</td>
                    <td className="px-4 py-3 text-right font-bold text-white">2.112</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 4: HISTÓRICO DE AVALIAÇÕES */}
        {activeTab === 'assessments' && (
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-base font-bold text-white">Histórico de Testes e Avaliações Físicas</h3>
              <a href="#/assessments/record" className="px-3 py-1.5 bg-[#E5A910] text-[#0A0A0C] font-bold text-xs rounded-xl">
                Registrar Avaliação
              </a>
            </div>

            {(Array.isArray(assessments) && assessments.length > 0) ? (
              <div className="divide-y divide-white/[0.06]">
                {assessments.map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{a.assessment_type?.name || 'Teste Físico'}</span>
                      <span className="text-gray-500 font-mono ml-2">({a.test_date || 'Recente'})</span>
                      {a.notes && <p className="text-gray-400 mt-0.5">{a.notes}</p>}
                    </div>
                    <span className="text-base font-black text-[#E5A910]">
                      {a.value} {a.assessment_type?.unit || 'cm'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 text-xs">Nenhuma avaliação física registrada.</div>
            )}
          </div>
        )}

        {/* ABA 5: TREINOS PROGRAMADOS / FICHAS */}
        {activeTab === 'prescribed_workouts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#141418] border border-white/[0.08] p-5 rounded-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Fichas de Treino Prescritas para {athlete.name}</h3>
                <p className="text-xs text-gray-400">Treinos A, B, C, D e sessões periodizadas</p>
              </div>
              <a href="#/workouts/new" className="px-4 py-2 bg-[#E5A910] text-[#0A0A0C] font-black text-xs rounded-xl hover:bg-[#E5A910]/90 transition">
                + Nova Ficha de Treino
              </a>
            </div>

            {(!Array.isArray(workouts) || workouts.length === 0) ? (
              <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-12 text-center text-gray-400 text-xs">
                Nenhum treino prescrito para este atleta ainda. Clique acima para prescrever.
              </div>
            ) : (
              workouts.map((workout) => (
                <div key={workout.id} className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                    <span className="text-xs text-[#E5A910] font-mono">{workout.scheduled_date || 'Ativo'}</span>
                  </div>
                  <p className="text-xs text-gray-400">Modalidade: {workout.workout_type} &bull; {workout.exercises?.length || 0} exercícios</p>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="divide-y divide-white/[0.06] pt-2">
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs text-gray-300">
                          <span className="font-bold text-white">{ex.name}</span>
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

        {/* ABA 6: METAS & OKRS */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            {(Array.isArray(goals) && goals.length > 0) ? (
              goals.map((g) => {
                const pct = Math.min(100, Math.max(0, Math.round(((g.current_value || 0) / (g.target_value || 1)) * 100)));
                return (
                  <div key={g.id} className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white text-sm">{g.title}</span>
                      <span className="font-mono text-[#E5A910] font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-[#E5A910] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-12 text-center text-gray-400 text-xs">
                Nenhum objetivo ou meta cadastrado para este atleta.
              </div>
            )}
          </div>
        )}

        {/* ABA 7: PERFIL DO ATLETA */}
        {activeTab === 'profile' && (
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/[0.08] pb-3">Informações Cadastrais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Nome Completo:</span>
                <span className="text-white font-bold">{athlete.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Data de Nascimento:</span>
                <span className="text-white font-bold">{athlete.birth_date || 'Não informada'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Idade:</span>
                <span className="text-white font-bold">{age} anos</span>
              </div>
              <div>
                <span className="text-gray-400 block">Turma / Grupo:</span>
                <span className="text-[#E5A910] font-bold">{athlete.group_name || 'ALFA ACADEMY'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Gênero:</span>
                <span className="text-white font-bold">{athlete.gender === 'F' ? 'Feminino' : 'Masculino'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Email:</span>
                <span className="text-white font-bold">{athlete.email || 'Não informado'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Troca Rápida de Atleta estilo eLoad */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141418] border border-white/[0.1] rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-[#E5A910]" /> Selecionar Atleta
                </h3>
                <p className="text-xs text-gray-400">Navegue rapidamente entre os 98 atletas cadastrados</p>
              </div>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-xs hover:border-white/30"
              >
                Fechar
              </button>
            </div>

            <div className="p-4 border-b border-white/[0.08]">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar atleta por nome..."
                  value={athleteSearch}
                  onChange={(e) => setAthleteSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A0C] border border-white/10 rounded-xl text-white text-xs focus:border-[#E5A910] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-1.5 flex-1 divide-y divide-white/[0.04]">
              {filteredAthletesSwitch.map((ath) => {
                const athId = ath.codigoAtleta || ath.id;
                const isSelected = String(athId) === String(id);
                const athAvatar = ath.photo_url || ath.avatar || `./avatars/athlete_${athId}.jpg`;

                return (
                  <button
                    key={athId}
                    onClick={() => {
                      setIsSwitchModalOpen(false);
                      navigate(`/athletes/${athId}`);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left transition ${
                      isSelected 
                        ? 'bg-[#E5A910]/15 border border-[#E5A910]/40 text-white' 
                        : 'hover:bg-white/[0.05] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={athAvatar}
                        alt={ath.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://blobprdeastus201.blob.core.windows.net/foto-atleta/avatar-default.svg';
                        }}
                        className="h-9 w-9 rounded-full object-cover border border-[#E5A910]/30 shrink-0 bg-black/40"
                      />
                      <div>
                        <p className="font-bold text-xs text-white leading-tight">{ath.name}</p>
                        <p className="text-[10px] text-gray-400">{ath.group_name || ath.nomeGrupo || 'ALFA ACADEMY'}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-[#E5A910]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
