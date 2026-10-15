import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Activity, Scale, HeartPulse, Clock, Dumbbell, MapPin, Heart, CheckSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const PSR_LEVELS = [
  { val: 0, label: '0 - Totalmente Exausto / Sem Condições', color: '#EF4444' },
  { val: 1, label: '1 - Recuperação Extremamente Pobre', color: '#EF4444' },
  { val: 2, label: '2 - Recuperação Muito Fraca', color: '#F97316' },
  { val: 3, label: '3 - Recuperação Fraca', color: '#F97316' },
  { val: 4, label: '4 - Abaixo do Normal', color: '#F59E0B' },
  { val: 5, label: '5 - Razoável / Aceitável', color: '#EAB308' },
  { val: 6, label: '6 - Moderadamente Recuperado', color: '#84CC16' },
  { val: 7, label: '7 - Boa Recuperação', color: '#10B981' },
  { val: 8, label: '8 - Muito Bem Recuperado', color: '#10B981' },
  { val: 9, label: '9 - Prontidão Excelente', color: '#06B6D4' },
  { val: 10, label: '10 - Recuperação Total / Força Máxima', color: '#3B82F6' },
];

const PreWorkoutPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { user, athleteProfile } = useAuthStore();
  const isAtleta = user?.role === 'atleta';

  const [athleteId, setAthleteId] = useState('');
  const [psrScore, setPsrScore] = useState(7);
  const [bodyMass, setBodyMass] = useState('');
  const [hrv, setHrv] = useState('');
  const [workoutTypeId, setWorkoutTypeId] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAtleta) {
      fetchAthletes();
    } else {
      if (athleteProfile?.id) {
        setAthleteId(athleteProfile.id.toString());
      } else {
        api.get('/api/v1/athletes/').then(res => {
          const list = Array.isArray(res?.data) ? res.data : (res?.data?.athletes || []);
          if (list.length > 0) {
            setAthleteId(list[0].id.toString());
          }
        }).catch(console.error);
      }
    }

    // Carregar tipos de treino
    api.get('/api/v1/workout-types/').then(res => {
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.workout_types || []);
      setWorkoutTypes(list);
      if (list.length > 0) {
        setWorkoutTypeId(list[0].id.toString());
      }
    }).catch(console.error);
  }, [fetchAthletes, isAtleta, athleteProfile]);

  const currentPsr = PSR_LEVELS.find(l => l.val === psrScore) || PSR_LEVELS[7];

  const handleSave = async () => {
    if (!athleteId) {
      toast.error('Selecione um atleta');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/v1/monitoring/pre-workout', {
        athlete_id: parseInt(athleteId),
        date: new Date().toISOString().split('T')[0],
        psr_score: psrScore,
        body_mass_kg: bodyMass ? parseFloat(bodyMass) : null,
        hrv_rmssd: hrv ? parseFloat(hrv) : null,
        workout_type_id: workoutTypeId ? parseInt(workoutTypeId) : null,
        estimated_duration_min: parseInt(estimatedDuration) || 60,
        notes: notes
      });
      toast.success('Registro de Pré-Treino salvo com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao salvar pré-treino');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-text">Pré-Treino (PSR & Prontidão)</h1>
        <p className="text-gray-400 mt-1">Percepção Subjetiva de Recuperação e Preparação para a Sessão</p>
      </div>

      {/* Atalhos Rápidos Integrados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigate('/monitoring/wellness')}
          className="p-3 bg-surface hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center gap-2 text-xs font-semibold text-text transition-colors"
        >
          <Heart className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Responder Bem-Estar</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/monitoring/pain')}
          className="p-3 bg-surface hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center gap-2 text-xs font-semibold text-text transition-colors"
        >
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Registrar Dor (Mapa)</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/workouts/new')}
          className="p-3 bg-surface hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center gap-2 text-xs font-semibold text-text transition-colors col-span-2 sm:col-span-1"
        >
          <Dumbbell className="w-4 h-4 text-primary shrink-0" />
          <span>Ver Ficha de Treino</span>
        </button>
      </div>

      <Card>
        {!isAtleta && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
            <select
              className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
            >
              <option value="">Selecione o Atleta...</option>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        )}

        {/* PSR Slider */}
        <div className="p-4 rounded-xl bg-background border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <label className="font-semibold text-text text-sm sm:text-base">PSR (Escala de Recuperação 0 a 10)</label>
            </div>
            <span
              className="text-lg font-extrabold px-3 py-0.5 rounded-lg border"
              style={{ color: currentPsr.color, borderColor: `${currentPsr.color}44`, backgroundColor: `${currentPsr.color}18` }}
            >
              {psrScore} / 10
            </span>
          </div>

          <p className="text-xs font-medium mb-4" style={{ color: currentPsr.color }}>
            {currentPsr.label}
          </p>

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={psrScore}
            onChange={(e) => setPsrScore(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-2 font-mono">
            <span>0 (Exausto)</span>
            <span>5 (Moderado)</span>
            <span>10 (Totalmente Pronto)</span>
          </div>
        </div>

        {/* Métricas Fisiológicas Adicionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-primary" />
              Massa Corporal Pré-Treino (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 78.5"
              value={bodyMass}
              onChange={(e) => setBodyMass(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-text text-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              VFC / HRV rMSSD (ms) - Opcional
            </label>
            <input
              type="number"
              placeholder="Ex: 65"
              value={hrv}
              onChange={(e) => setHrv(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-text text-sm focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Tipo de Treino e Duração Prevista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Tipo de Treino Previsto</label>
            <select
              value={workoutTypeId}
              onChange={(e) => setWorkoutTypeId(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-text text-sm focus:ring-primary focus:border-primary"
            >
              {(Array.isArray(workoutTypes) ? workoutTypes : []).map((t, idx) => {
                const typeName = typeof t === 'string' ? t : (t?.name || t?.title || t?.description || t?.label || `Tipo ${idx + 1}`);
                const typeId = typeof t === 'string' ? t : (t?.id || typeName);
                return (
                  <option 
                    key={typeId || idx} 
                    value={typeId}
                    style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
                  >
                    {typeName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Duração Estimada (minutos)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-text text-sm focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Observações */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-300 mb-1">Observações Técnicas (Opcional)</label>
          <textarea
            rows="2"
            placeholder="Sensações térmicas, dores leves ou foco da sessão..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-text text-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <Button
            type="button"
            onClick={handleSave}
            isLoading={isLoading}
            className="w-full sm:w-auto px-8"
          >
            Confirmar e Iniciar Sessão
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PreWorkoutPage;
