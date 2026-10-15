import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Droplets, Clock, AlertTriangle, Activity, Flower2, CheckCircle2, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';
import useAuthStore from '../../store/authStore';
import UrineHydrationModal, { URINE_COLORS } from '../../components/monitoring/UrineHydrationModal';

const PILLARS = [
  { id: 'sleep_quality', title: 'Qualidade do Sono', desc: 'Como foi sua recuperação nesta noite?' },
  { id: 'fatigue_level', title: 'Nível de Disposição / Fadiga', desc: 'Quanta energia e vigor você sente agora?' },
  { id: 'muscle_soreness', title: 'Dor Muscular (DOMS)', desc: 'Sensação de rigidez ou dores musculares' },
  { id: 'stress_level', title: 'Nível de Estresse Mental', desc: 'Nível de tensão, estresse ou ansiedade' },
  { id: 'mood', title: 'Estado de Humor', desc: 'Disposição psicológica e ânimo para treinar' },
];

const SCALE_LEVELS = [
  { value: 1, label: 'Péssimo / Extrema Dor', emoji: '😫', color: '#E82E5F' },
  { value: 2, label: 'Ruim / Dolorido', emoji: '🙁', color: '#F5B025' },
  { value: 3, label: 'Normal / Neutro', emoji: '😐', color: '#718096' },
  { value: 4, label: 'Bom', emoji: '🙂', color: '#1CA1F2' },
  { value: 5, label: 'Excelente / Ótimo', emoji: '😁', color: '#25C46E' },
];

const WellnessPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createWellness, isLoading } = useMonitoringStore();
  const { user, athleteProfile } = useAuthStore();
  const isAtleta = user?.role === 'atleta';

  const [athleteId, setAthleteId] = useState('');
  const [answers, setAnswers] = useState({
    sleep_quality: 3,
    fatigue_level: 3,
    muscle_soreness: 3,
    stress_level: 3,
    mood: 3,
  });

  // Sono
  const [sleepMode, setSleepMode] = useState('total'); // 'total' ou 'time'
  const [totalSleepHours, setTotalSleepHours] = useState(8);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');

  // Hidratação (Armstrong 1 a 8)
  const [urineColor, setUrineColor] = useState(2);
  const [isUrineModalOpen, setIsUrineModalOpen] = useState(false);

  useEffect(() => {
    if (!isAtleta) {
      fetchAthletes();
    } else {
      if (athleteProfile?.id) {
        setAthleteId(athleteProfile.id.toString());
      } else {
        useAthleteStore.getState().fetchAthletes().then(() => {
          const list = useAthleteStore.getState().athletes || [];
          if (list.length > 0) setAthleteId(list[0].id.toString());
        });
      }
    }
  }, [fetchAthletes, isAtleta, athleteProfile]);

  // Cálculo de Horas de Sono se no modo 'time'
  const computedSleepHours = () => {
    if (sleepMode === 'total') return parseFloat(totalSleepHours);
    if (!sleepStart || !sleepEnd) return 8.0;
    const [h1, m1] = sleepStart.split(':').map(Number);
    const [h2, m2] = sleepEnd.split(':').map(Number);
    let diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Cruzou meia-noite
    return Math.round((diffMinutes / 60) * 10) / 10;
  };

  // Cálculo da Prontidão (0 a 100%)
  const sumScores = Object.values(answers).reduce((a, b) => a + b, 0);
  const readinessPct = Math.round((sumScores / 25) * 100);

  const getReadinessBadge = (pct) => {
    if (pct >= 85) return { label: 'Prontidão Ótima', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (pct >= 70) return { label: 'Prontidão Adequada', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (pct >= 55) return { label: 'Atenção / Fadiga', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Sobrecarga / Crítico', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const readinessBadge = getReadinessBadge(readinessPct);

  const handleSave = async () => {
    if (!athleteId) {
      toast.error('Selecione um atleta');
      return;
    }

    const payload = {
      athlete_id: parseInt(athleteId),
      date: new Date().toISOString().split('T')[0],
      ...answers,
      sleep_hours: computedSleepHours(),
      sleep_start: sleepMode === 'time' ? sleepStart : null,
      sleep_end: sleepMode === 'time' ? sleepEnd : null,
      urine_color_scale: urineColor,
      readiness_pct: readinessPct,
      notes: ''
    };

    try {
      await createWellness(payload);
      toast.success('Questionário de Bem-Estar salvo com sucesso!');
      if (answers.muscle_soreness <= 3) {
        toast('Detectamos dor muscular. Se desejar, registre a região exata no Mapa de Dor.', { icon: '📍' });
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao salvar questionário');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Questionário de Bem-Estar</h1>
          <p className="text-gray-400 mt-1">Check-in matinal de prontidão fisiológica e recuperação (Hooper Index)</p>
        </div>

        {/* Card Resumo Prontidão */}
        <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${readinessBadge.color}`}>
          <div className="text-right">
            <span className="text-xs uppercase font-bold tracking-wider block opacity-75">Índice de Prontidão</span>
            <span className="text-sm font-semibold">{readinessBadge.label}</span>
          </div>
          <div className="text-2xl font-extrabold">{readinessPct}%</div>
        </div>
      </div>

      <Card>
        {/* Seletor de Atleta para Treinador */}
        {!isAtleta && (
          <div className="mb-6 p-4 rounded-xl bg-background border border-gray-800">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
            <select 
              className="block w-full rounded-lg bg-surface border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
            >
              <option value="">Selecione o Atleta...</option>
              {(Array.isArray(athletes) ? athletes : []).map(a => <option key={a?.id} value={a?.id}>{a?.name}</option>)}
            </select>
          </div>
        )}

        {/* 5 Pilares do Bem-Estar */}
        <div className="space-y-6">
          {PILLARS.map((p) => {
            const currentVal = answers[p.id];
            return (
              <div key={p.id} className="p-4 rounded-xl bg-background/50 border border-gray-800/80">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-text text-sm sm:text-base">{p.title}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface border border-gray-700 text-gray-300">
                    Nível {currentVal} de 5
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{p.desc}</p>

                {/* 5 Níveis com Emojis */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {SCALE_LEVELS.map((lvl) => {
                    const isSelected = currentVal === lvl.value;
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [p.id]: lvl.value })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                          isSelected
                            ? 'scale-[1.03] ring-2 ring-primary border-primary shadow-lg shadow-primary/10'
                            : 'border-gray-800 hover:border-gray-700 bg-surface/50 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: isSelected ? `${lvl.color}22` : undefined }}
                      >
                        <span className="text-xl sm:text-2xl mb-1">{lvl.emoji}</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight line-clamp-1" style={{ color: isSelected ? lvl.color : '#9ca3af' }}>
                          {lvl.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Módulo de Sono */}
        <div className="mt-8 p-4 rounded-xl bg-background border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Duração do Sono</h3>
            </div>
            
            {/* Toggle Tipo de Registro */}
            <div className="flex items-center bg-surface p-1 rounded-lg border border-gray-700 text-xs">
              <button
                type="button"
                onClick={() => setSleepMode('total')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  sleepMode === 'total' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Total de Horas
              </button>
              <button
                type="button"
                onClick={() => setSleepMode('time')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  sleepMode === 'time' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Por Horários
              </button>
            </div>
          </div>

          {sleepMode === 'total' ? (
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="14"
                step="0.5"
                value={totalSleepHours}
                onChange={(e) => setTotalSleepHours(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-lg font-bold text-text w-16 text-right">
                {totalSleepHours}h
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Horário que dormiu</label>
                <input
                  type="time"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-text text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Horário que acordou</label>
                <input
                  type="time"
                  value={sleepEnd}
                  onChange={(e) => setSleepEnd(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-text text-sm"
                />
              </div>
              <div className="sm:text-right pt-2 sm:pt-4">
                <span className="text-xs text-gray-400 block">Tempo Líquido</span>
                <span className="text-lg font-bold text-primary">{computedSleepHours()}h</span>
              </div>
            </div>
          )}
        </div>

        {/* Módulo de Hidratação (Cor da Urina Armstrong) */}
        <div className="mt-4 p-4 rounded-xl bg-background border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-inner border border-gray-700 shrink-0"
              style={{
                backgroundColor: URINE_COLORS[urineColor - 1]?.hex || '#FEF08A',
                color: urineColor >= 6 ? '#ffffff' : '#1f2937'
              }}
            >
              {urineColor}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-text text-sm">Escala de Hidratação (Urina)</h4>
              </div>
              <p className="text-xs text-gray-400">
                {URINE_COLORS[urineColor - 1]?.label} — {URINE_COLORS[urineColor - 1]?.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsUrineModalOpen(true)}
            className="px-4 py-2 bg-surface hover:bg-gray-800 text-text border border-gray-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-primary" />
            Classificar Cor da Urina (1 a 8)
          </button>
        </div>

        {/* Gatilhos Rápidos Inteligentes */}
        {answers.muscle_soreness <= 3 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Dor Muscular Registrada</p>
                <p className="text-xs text-amber-200/70">Deseja apontar a região exata no Mapa Anatômico de Dor?</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/monitoring/pain')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0"
            >
              Abrir Mapa <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Seção Condicional de Ciclo Menstrual */}
        {(user?.role === 'atleta' && athleteProfile?.gender === 'Feminino') && (
          <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Flower2 className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-300">Acompanhamento do Ciclo Menstrual</p>
                <p className="text-xs text-purple-200/70">Mantenha seu treinador informado sobre sua fase hormonal</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/monitoring/menstrual')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shrink-0"
            >
              Registrar Ciclo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Botão de Envio */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            isLoading={isLoading}
            className="w-full sm:w-auto px-8"
          >
            Salvar Check-in de Bem-Estar
          </Button>
        </div>
      </Card>

      {/* Modal Armstrong de Urina */}
      <UrineHydrationModal
        isOpen={isUrineModalOpen}
        onClose={() => setIsUrineModalOpen(false)}
        selectedLevel={urineColor}
        onSelect={(lvl) => setUrineColor(lvl)}
      />
    </div>
  );
};

export default WellnessPage;
