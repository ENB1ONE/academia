import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, UserCheck, ShieldAlert, ArrowRight, Smartphone, 
  CheckCircle2, Clock, Droplets, Dumbbell, AlertTriangle, ChevronRight, Check,
  Lock, Sparkles, MessageCircle
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import UrineHydrationModal, { URINE_COLORS } from '../../components/monitoring/UrineHydrationModal';
import api from '../../services/api';
import defaultAvatar from '../../assets/avatar-default.png';

const PILLARS = [
  { id: 'sleep_quality', title: '1. Qualidade da noite de sono', desc: 'Como foi sua recuperação nesta noite?' },
  { id: 'fatigue_level', title: '2. Disposição hoje', desc: 'Quanta energia e vigor você sente agora?' },
  { id: 'muscle_soreness', title: '3. Dor muscular hoje', desc: 'Sensação de rigidez ou dores musculares' },
  { id: 'stress_level', title: '4. Nível de stress hoje', desc: 'Nível de tensão, estresse ou ansiedade mental' },
  { id: 'mood', title: '5. Humor hoje', desc: 'Disposição psicológica e ânimo para treinar' },
];

const SCALE_LEVELS = [
  { value: 1, label: '1 - Péssimo', emoji: '😫', color: '#E82E5F' },
  { value: 2, label: '2 - Ruim', emoji: '🙁', color: '#F5B025' },
  { value: 3, label: '3 - Normal', emoji: '😐', color: '#718096' },
  { value: 4, label: '4 - Bom', emoji: '🙂', color: '#1CA1F2' },
  { value: 5, label: '5 - Excelente', emoji: '😁', color: '#25C46E' },
];

export default function QuickCheckinPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL query params for direct athlete link: ?athlete=20337 or ?athleteId=20337
  const queryAthleteId = searchParams.get('athlete') || searchParams.get('athleteId');

  // Etapas: 'lookup' -> 'confirm' -> 'questionnaire' -> 'workout'
  const [step, setStep] = useState('lookup');
  const [birthdateRaw, setBirthdateRaw] = useState('');
  const [nameLetters, setNameLetters] = useState('');
  const [loading, setLoading] = useState(false);
  const [athleteFound, setAthleteFound] = useState(null);
  const [error, setError] = useState('');

  // Workouts reais carregados para este atleta específico
  const [athleteWorkouts, setAthleteWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Questionário de Bem-Estar
  const [answers, setAnswers] = useState({
    sleep_quality: 3,
    fatigue_level: 3,
    muscle_soreness: 3,
    stress_level: 3,
    mood: 3,
  });

  // Sono
  const [sleepMode, setSleepMode] = useState('total'); // 'total' | 'time'
  const [totalSleepHours, setTotalSleepHours] = useState(8);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');

  // Hidratação
  const [urineColor, setUrineColor] = useState(2);
  const [isUrineModalOpen, setIsUrineModalOpen] = useState(false);

  // Ciclo Menstrual (se mulher)
  const [menstrualFlow, setMenstrualFlow] = useState('Nenhum');
  const [menstrualPain, setMenstrualPain] = useState(0);

  // Treino Programado do Dia (após envio)
  const [readinessScore, setReadinessScore] = useState(85);
  const [completedExercises, setCompletedExercises] = useState({});
  const [postPse, setPostPse] = useState(6);
  const [postDuration, setPostDuration] = useState(60);
  const [workoutFinished, setWorkoutFinished] = useState(false);

  // Se tiver athlete na URL, buscar diretamente
  useEffect(() => {
    if (queryAthleteId) {
      const loadDirectAthlete = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/v1/athletes/${queryAthleteId}`);
          const ath = res.data?.data || res.data;
          if (ath && (ath.id || ath.name)) {
            setAthleteFound(ath);
            setStep('confirm');
          }
        } catch (e) {
          console.warn('Erro ao carregar atleta direto pela URL:', e);
        } finally {
          setLoading(false);
        }
      };
      loadDirectAthlete();
    }
  }, [queryAthleteId]);

  // Função para carregar os treinos estritamente deste atleta
  const loadWorkoutsForAthlete = async (athId) => {
    if (!athId) return;
    setLoadingWorkouts(true);
    try {
      const res = await api.get(`/api/v1/workouts/?athlete_id=${athId}`);
      const list = Array.isArray(res.data) ? res.data : (res.data?.workouts || []);
      // Filtrar com rigor absoluto garantindo que nenhum outro treino passe
      const safeList = list.filter(w => String(w.athlete_id) === String(athId) && w.is_active !== 0);
      setAthleteWorkouts(safeList);
    } catch (e) {
      console.warn('Erro ao buscar treinos do atleta:', e);
      setAthleteWorkouts([]);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // Máscara DD/MM/AAAA estilo eLoad
  const handleDateInput = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length >= 5) {
      v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
      v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setBirthdateRaw(v);
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (birthdateRaw.length !== 10) {
      setError('Por favor, informe a data completa no formato DD/MM/AAAA');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/v1/totem/lookup-by-birthdate', {
        token: token || 'formclub-hub',
        birthdate: birthdateRaw,
      });

      if (res.data?.athlete) {
        setAthleteFound(res.data.athlete);
        setStep('confirm');
      } else {
        setError('Nenhum atleta encontrado com esta data de nascimento.');
      }
    } catch (err) {
      console.error(err);
      setError('Data de nascimento não localizada na organização FORMCLUB.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmYes = async () => {
    // Validação de segurança LGPD: se digitou letras, conferir se bate com o início do primeiro nome
    if (nameLetters && athleteFound?.name) {
      const cleanLetters = nameLetters.trim().toLowerCase();
      const firstWord = athleteFound.name.trim().toLowerCase().split(' ')[0];
      if (!firstWord.startsWith(cleanLetters)) {
        setError(`As iniciais digitadas não correspondem ao primeiro nome (${firstWord.slice(0, 3).toUpperCase()}...). Verifique seus dados.`);
        return;
      }
    }
    setStep('questionnaire');
    // Carregar em background a ficha de treino do atleta
    loadWorkoutsForAthlete(athleteFound.id || athleteFound.codigoAtleta);
  };

  const handleConfirmNo = () => {
    setAthleteFound(null);
    setBirthdateRaw('');
    setNameLetters('');
    setError('');
    setStep('lookup');
  };

  const handleSelectAnswer = (pillarId, value) => {
    setAnswers(prev => ({ ...prev, [pillarId]: value }));
  };

  const handleToggleExercise = (workoutIdx, exIdx) => {
    const key = `${workoutIdx}-${exIdx}`;
    setCompletedExercises(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitQuestionnaire = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calcular Índice de Prontidão (0 a 100%)
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const scorePct = Math.round((sum / 25) * 100);
    setReadinessScore(scorePct);

    try {
      // Salva no backend / interceptor
      await api.post('/api/v1/monitoring/wellness', {
        athlete_id: athleteFound.id || athleteFound.codigoAtleta,
        readiness_pct: scorePct,
        answers,
        urine_color: urineColor,
        sleep_hours: totalSleepHours,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStep('workout');
      // Garantir atualização da lista de treinos
      loadWorkoutsForAthlete(athleteFound.id || athleteFound.codigoAtleta);
    }
  };

  const handleFinishWorkout = async () => {
    setLoading(true);
    try {
      await api.post('/api/v1/monitoring/pse', {
        athlete_id: athleteFound.id || athleteFound.codigoAtleta,
        session_pse: postPse,
        duration_minutes: postDuration,
        calculated_load_ua: postPse * postDuration,
      });
      setWorkoutFinished(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const firstName = athleteFound?.name?.split(' ')[0] || 'Atleta';
  const cid = athleteFound?.codigoAtleta || athleteFound?.id;
  const rawAvatar = athleteFound?.photo_url || athleteFound?.avatar;
  const athleteAvatar = (rawAvatar && !rawAvatar.includes('default') && !rawAvatar.includes('avatar-default'))
    ? rawAvatar
    : `./avatars/athlete_${cid}.jpg`;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col justify-center items-center p-4">
      {/* Container Central com Estilo FormClub Dark Luxury */}
      <div className="w-full max-w-xl bg-[#141418] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-6">
        
        {/* Topo / Logo FormClub */}
        <div className="flex flex-col items-center text-center">
          <Logo className="h-20 drop-shadow-[0_2px_10px_rgba(229,169,16,0.2)] mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E5A910] bg-[#E5A910]/15 px-3 py-1 rounded-full border border-[#E5A910]/30">
            HUMAN PERFORMANCE CENTER &bull; MONITORAMENTO
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-2xl text-xs text-center font-bold">
            {error}
          </div>
        )}

        {/* ETAPA 1: LOCALIZAÇÃO POR DATA DE NASCIMENTO (DD/MM/AAAA) */}
        {step === 'lookup' && (
          <form onSubmit={handleLookup} className="space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-black text-white">Check-in do Atleta</h1>
              <p className="text-xs text-gray-400">Informe sua data de nascimento para abrir seu questionário diário</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-bold flex items-center justify-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#E5A910]" />
                Data de Nascimento (DD/MM/AAAA):
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 06/09/2008"
                maxLength={10}
                value={birthdateRaw}
                onChange={handleDateInput}
                className="w-full px-4 py-3.5 bg-[#0A0A0C] border border-white/10 rounded-2xl text-white text-center text-lg font-black tracking-widest focus:border-[#E5A910] focus:outline-none focus:ring-1 focus:ring-[#E5A910]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || birthdateRaw.length !== 10}
              className="w-full py-3.5 bg-[#E5A910] hover:bg-[#E5A910]/90 disabled:opacity-40 text-[#0A0A0C] font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Consultando Atleta...' : 'Prosseguir'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* ETAPA 2: CONFIRMAÇÃO DO ATLETA ("Fernando? [Sim] [Não]") IDÊNTICO AO ELOAD */}
        {step === 'confirm' && (
          <div className="space-y-6 text-center pt-2">
            <img
              src={athleteAvatar}
              alt={athleteFound.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E5A910] mx-auto shadow-xl bg-black/60 p-1"
            />

            <div className="space-y-1.5">
              <p className="text-xs text-gray-400 font-medium">Você é:</p>
              <h2 className="text-2xl font-black text-white">{firstName}?</h2>
              <p className="text-xs text-gray-300 font-bold">
                {athleteFound.name} &bull; {athleteFound.group_name || athleteFound.nomeGrupo || 'FORMCLUB'}
              </p>
              <p className="text-[11px] text-[#E5A910]">
                Treinador Responsável: MARCOS VINICIUS DE FREITAS FARIA
              </p>
            </div>

            {/* Confirmação de Privacidade LGPD (3 primeiras letras) */}
            <div className="bg-[#0A0A0C] border border-white/10 p-3.5 rounded-2xl text-left space-y-2">
              <label className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#E5A910]" />
                Confirmação de Segurança (3 primeiras letras do seu nome):
              </label>
              <input
                type="text"
                placeholder={`Ex: ${firstName.slice(0, 3).toUpperCase()}`}
                maxLength={5}
                value={nameLetters}
                onChange={(e) => {
                  setNameLetters(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white text-center font-mono font-bold tracking-widest uppercase focus:border-[#E5A910] focus:outline-none"
              />
              <p className="text-[10px] text-gray-500 text-center">
                Proteção de dados e sigilo do prontuário individual
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleConfirmNo}
                className="py-3 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl text-xs font-bold transition border border-white/10"
              >
                Não sou eu
              </button>
              <button
                type="button"
                onClick={handleConfirmYes}
                disabled={nameLetters.length < 2}
                className="py-3 px-4 bg-[#E5A910] hover:bg-[#E5A910]/90 disabled:opacity-40 text-[#0A0A0C] rounded-2xl text-xs font-black transition shadow-lg"
              >
                Confirmar e Iniciar
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: QUESTIONÁRIO DIÁRIO DE BEM-ESTAR ELOAD */}
        {step === 'questionnaire' && (
          <form onSubmit={handleSubmitQuestionnaire} className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4 text-center">
              <h2 className="text-lg font-black text-white tracking-wide">
                OLÁ {athleteFound.name}, COMO VOCÊ ESTÁ HOJE?
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Responda com sinceridade para o cálculo correto da sua prontidão de treino.
              </p>
            </div>

            {/* Alternador de Sono */}
            <div className="bg-[#0A0A0C] border border-white/[0.08] p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#E5A910]" /> Quanto você dormiu? (Horas de Sono)
                </span>
                <div className="flex gap-1 bg-[#141418] p-1 rounded-xl border border-white/5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSleepMode('total')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${sleepMode === 'total' ? 'bg-[#E5A910] text-[#0A0A0C]' : 'text-gray-400'}`}
                  >
                    Total
                  </button>
                  <button
                    type="button"
                    onClick={() => setSleepMode('time')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${sleepMode === 'time' ? 'bg-[#E5A910] text-[#0A0A0C]' : 'text-gray-400'}`}
                  >
                    Horários
                  </button>
                </div>
              </div>

              {sleepMode === 'total' ? (
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="range"
                    min="3"
                    max="14"
                    step="0.5"
                    value={totalSleepHours}
                    onChange={(e) => setTotalSleepHours(Number(e.target.value))}
                    className="w-full accent-[#E5A910]"
                  />
                  <span className="font-mono text-sm font-black text-[#E5A910] min-w-16 text-right">
                    {totalSleepHours}h
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Dormiu às:</label>
                    <input
                      type="time"
                      value={sleepStart}
                      onChange={(e) => setSleepStart(e.target.value)}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Acordou às:</label>
                    <input
                      type="time"
                      value={sleepEnd}
                      onChange={(e) => setSleepEnd(e.target.value)}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Os 5 Pilares do Bem-Estar */}
            <div className="space-y-4">
              {PILLARS.map((p) => {
                const currentVal = answers[p.id];
                return (
                  <div key={p.id} className="bg-[#0A0A0C] border border-white/[0.08] p-4 rounded-2xl space-y-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] text-gray-400">{p.desc}</p>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {SCALE_LEVELS.map((lvl) => {
                        const isSelected = currentVal === lvl.value;
                        return (
                          <button
                            type="button"
                            key={lvl.value}
                            onClick={() => handleSelectAnswer(p.id, lvl.value)}
                            style={{
                              borderColor: isSelected ? lvl.color : 'rgba(255,255,255,0.08)',
                              backgroundColor: isSelected ? `${lvl.color}25` : 'rgba(20,20,24,0.6)',
                            }}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center transition ${isSelected ? 'shadow-md scale-102' : 'hover:border-white/20'}`}
                          >
                            <span className="text-xl mb-1">{lvl.emoji}</span>
                            <span className="text-[10px] font-bold text-gray-300 text-center leading-tight">
                              {lvl.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botão de Hidratação Urina */}
            <div className="flex items-center justify-between bg-[#0A0A0C] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div 
                  className="w-7 h-7 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: URINE_COLORS[urineColor - 1]?.color || '#fef08a' }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Nível de Hidratação (Urina)</h4>
                  <p className="text-[11px] text-gray-400">
                    Nível {urineColor}: {URINE_COLORS[urineColor - 1]?.label || 'Boa'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUrineModalOpen(true)}
                className="px-3 py-1.5 bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/30 rounded-xl text-xs font-bold hover:bg-[#E5A910] hover:text-[#0A0A0C] transition flex items-center gap-1.5"
              >
                <Droplets className="h-3.5 w-3.5" /> Registrar Hidratação
              </button>
            </div>

            {/* Se Mulher: Ciclo Menstrual */}
            {(athleteFound.gender === 'F' || athleteFound.descricaoGenero === 'Feminino') && (
              <div className="bg-[#0A0A0C] border border-white/[0.08] p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-pink-400" /> Registro do Ciclo Menstrual
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Fluxo:</label>
                    <select
                      value={menstrualFlow}
                      onChange={(e) => setMenstrualFlow(e.target.value)}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2 text-white"
                    >
                      <option value="Nenhum">Nenhum / Ausente</option>
                      <option value="Leve">Leve</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Intenso">Intenso</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Dor / Cólicas (0 a 10):</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={menstrualPain}
                      onChange={(e) => setMenstrualPain(Number(e.target.value))}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black rounded-2xl text-sm transition shadow-2xl flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              {loading ? 'Enviando...' : 'Enviar Respostas e Ver Meu Treino de Hoje'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {/* ETAPA 4: TREINO PROGRAMADO DO DIA DO ATLETA (LOGO APÓS ENVIAR QUESTIONÁRIO) */}
        {step === 'workout' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Questionário Enviado com Sucesso!
              </span>
              <p className="text-2xl font-black text-white">
                Índice de Prontidão: <span className="text-[#E5A910]">{readinessScore}%</span>
              </p>
              <p className="text-[11px] text-gray-300">
                {readinessScore >= 70 ? 'Ótima prontidão! Seu corpo está apto para suportar cargas elevadas.' : 'Atenção à recuperação! Comunique seu treinador se sentir desconforto.'}
              </p>
            </div>

            {/* Seção da Ficha de Treino Prescrita */}
            {athleteWorkouts && athleteWorkouts.length > 0 ? (
              athleteWorkouts.map((workout, wIdx) => {
                const orderedExercises = (workout.exercises || []).slice().sort((a, b) => 
                  (Number(a.order_index || a.order) || 0) - (Number(b.order_index || b.order) || 0)
                );

                return (
                  <div key={workout.id || wIdx} className="space-y-4">
                    {/* Cabeçalho da Ficha */}
                    <div className="bg-[#0A0A0C] border border-[#E5A910]/30 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/30 rounded-full text-xs font-bold uppercase">
                          TREINO PROGRAMADO: {workout.workout_type || 'A'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {workout.scheduled_date || 'Hoje'} &bull; {orderedExercises.length} exercícios
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white uppercase">{workout.name || workout.title || 'Treino Individual Prescrito'}</h3>
                      {workout.notes && (
                        <p className="text-xs text-[#E5A910] italic">
                          "{workout.notes}"
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Prescrito exclusivamente para <strong className="text-white">{athleteFound.name}</strong> &bull; Marque as séries conforme executar no CT:
                      </p>
                    </div>

                    {/* Lista Interativa de Exercícios (Ordenada por order_index) */}
                    <div className="space-y-3">
                      {orderedExercises.map((ex, exIdx) => {
                        const isDone = completedExercises[`${wIdx}-${exIdx}`];
                        const orderNum = ex.order_index || ex.order || (exIdx + 1);

                        return (
                          <div
                            key={ex.id || exIdx}
                            onClick={() => handleToggleExercise(wIdx, exIdx)}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                              isDone 
                                ? 'bg-emerald-500/10 border-emerald-500/30' 
                                : 'bg-[#0A0A0C] border-white/[0.08] hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-1 flex items-start gap-3">
                              <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                                {orderNum}º
                              </span>
                              <div>
                                <h4 className={`text-sm font-bold ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                                  {ex.exercise_name || ex.name}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {ex.sets ? `${ex.sets} séries` : ''} 
                                  {ex.reps ? ` • ${ex.reps} reps` : ''} 
                                  {ex.load_kg ? ` • Carga: ${ex.load_kg} kg` : ''} 
                                  {ex.rest_seconds ? ` • Pausa: ${ex.rest_seconds}s` : ''}
                                </p>
                                {ex.notes && (
                                  <p className="text-[11px] text-[#E5A910] mt-0.5 font-medium">Obs: {ex.notes}</p>
                                )}
                              </div>
                            </div>

                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center border transition shrink-0 ml-2 ${
                              isDone 
                                ? 'bg-emerald-500 border-emerald-400 text-[#0A0A0C]' 
                                : 'border-white/20 bg-white/5'
                            }`}>
                              {isDone && <Check className="h-4 w-4 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              /* AVISO SEGURO EXIGIDO NA REGRA 1.1: Sem exercícios aleatórios ou fichas de terceiros */
              <div className="bg-[#0A0A0C] border border-[#E5A910]/40 rounded-2xl p-6 text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-[#E5A910]/10 border border-[#E5A910]/30 flex items-center justify-center mx-auto text-[#E5A910]">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-white">
                  Check-in de prontidão enviado com sucesso!
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                  Seu treinador já recebeu seus indicadores de hoje. Nenhum treino individual foi liberado no aplicativo para hoje — siga a orientação presencial do seu treinador no CT.
                </p>
                <div className="pt-2 text-[11px] text-gray-500 font-mono">
                  Atleta: {athleteFound.name} &bull; Código #{cid}
                </div>
              </div>
            )}

            {/* Seção de Finalização do Treino (PSE Borg + Duração) */}
            {!workoutFinished ? (
              <div className="bg-[#0A0A0C] border border-[#E5A910]/30 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E5A910]" /> Finalizar Treino e Registrar Esforço (PSE)
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Duração Realizada (min):</label>
                    <input
                      type="number"
                      value={postDuration}
                      onChange={(e) => setPostDuration(Number(e.target.value))}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">PSE da Sessão (0 a 10):</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={postPse}
                      onChange={(e) => setPostPse(Number(e.target.value))}
                      className="w-full bg-[#141418] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-gray-400">Carga da Sessão Calculada:</span>
                  <span className="font-bold text-[#E5A910] text-sm">
                    {postPse * postDuration} UA
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleFinishWorkout}
                  disabled={loading}
                  className="w-full py-3.5 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-lg"
                >
                  {loading ? 'Salvando...' : 'Concluir Treino de Hoje'}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-white">Treino Concluído com Sucesso!</h4>
                <p className="text-xs text-gray-300">
                  Parabéns, {firstName}! Sua sessão de {postDuration} min e {postPse * postDuration} UA foi registrada no FORMCLUB.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                >
                  Novo Check-in
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal de Hidratação Armstrong */}
        <UrineHydrationModal
          isOpen={isUrineModalOpen}
          onClose={() => setIsUrineModalOpen(false)}
          selectedColor={urineColor}
          onSelect={(c) => {
            setUrineColor(c);
            setIsUrineModalOpen(false);
          }}
        />

        {/* Rodapé PWA */}
        <div className="pt-4 border-t border-white/[0.08] text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
            <Smartphone className="h-3.5 w-3.5 text-[#E5A910]" />
            Adicione à tela inicial do seu smartphone para abrir como aplicativo
          </p>
        </div>
      </div>
    </div>
  );
}
