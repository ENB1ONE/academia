import React, { useState, useEffect } from 'react';
import { Search, Heart, CheckCircle2, RotateCcw, Activity, Users, Shield, Clock } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import api from '../../services/api';

export default function TotemPage() {
  const [athletes, setAthletes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modais rápidos de ação
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [actionType, setActionType] = useState(null); // 'pre' | 'post'

  // Estado Pós-Treino Rápido (PSE)
  const [pse, setPse] = useState(6);
  const [duration, setDuration] = useState(60);

  // Estado Pré-Treino Rápido (PSR)
  const [psr, setPsr] = useState(7);
  const [weight, setWeight] = useState('');

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [athRes, grpRes] = await Promise.all([
        api.get('/api/v1/athletes/'),
        api.get('/api/v1/groups/'),
      ]);
      setAthletes(athRes.data || []);
      setGroups(grpRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh a cada 60s no Totem
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const resetModals = () => {
    setSelectedAthlete(null);
    setActionType(null);
    setPse(6);
    setDuration(60);
    setPsr(7);
    setWeight('');
  };

  const showToastAndReset = (msg) => {
    setToastMessage(msg);
    resetModals();
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSavePostWorkout = async (e) => {
    e.preventDefault();
    if (!selectedAthlete) return;
    setSaving(true);
    try {
      await api.post('/api/v1/monitoring/pse', {
        athlete_id: selectedAthlete.id,
        workout_id: 1,
        rpe: Number(pse),
        duration_minutes: Number(duration),
        notes: 'Totem Kiosk Check-out',
      });
      showToastAndReset(`Obrigado, ${selectedAthlete.name}! Treino finalizado com sucesso.`);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar finalização de treino.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreWorkout = async (e) => {
    e.preventDefault();
    if (!selectedAthlete) return;
    setSaving(true);
    try {
      await api.post('/api/v1/monitoring/pre-workout', {
        athlete_id: selectedAthlete.id,
        psr_score: Number(psr),
        body_mass_kg: weight ? Number(weight) : undefined,
        workout_type: 'Geral',
        planned_duration_min: 60,
      });
      showToastAndReset(`Bom treino, ${selectedAthlete.name}! Pré-treino registrado.`);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar pré-treino.');
    } finally {
      setSaving(false);
    }
  };

  const filteredAthletes = athletes.filter((a) => {
    const nameMatch = (a.name || a.user?.name || '').toLowerCase().includes(search.toLowerCase());
    const groupMatch = selectedGroup === 'all' || a.group_id === Number(selectedGroup);
    return nameMatch && groupMatch;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col p-4 md:p-8 select-none">
      {/* Top Bar do Totem */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Logo className="h-16" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Modo Totem / Recepção</h1>
            <p className="text-xs text-gray-400">Terminal interativo para auto-registro de atletas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filtro de Grupos */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-gray-700 rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
          >
            <option value="all">Todas as Turmas</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Busca Rápida por Nome */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Digite seu nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-gray-700 rounded-xl text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Toast de Feedback */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 text-lg animate-bounce">
          <CheckCircle2 className="h-6 w-6" /> {toastMessage}
        </div>
      )}

      {/* Grid de Atletas para Auto-Seleção */}
      <div className="flex-1 py-6 overflow-y-auto">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Carregando atletas...</div>
        ) : filteredAthletes.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Nenhum atleta encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAthletes.map((ath) => (
              <div
                key={ath.id}
                className="bg-surface border border-gray-800 rounded-2xl p-4 flex flex-col justify-between hover:border-primary/50 transition shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white line-clamp-1">{ath.name || ath.user?.name}</h3>
                      <p className="text-xs text-gray-400">{ath.position || ath.category || 'Atleta'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setSelectedAthlete(ath);
                      setActionType('pre');
                    }}
                    className="py-2.5 px-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Activity className="h-4 w-4" /> Pré-Treino
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAthlete(ath);
                      setActionType('post');
                    }}
                    className="py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Finalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Finalização de Treino (Pós-Treino PSE) */}
      {selectedAthlete && actionType === 'post' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleSavePostWorkout}
            className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 shadow-2xl"
          >
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white">Finalizar Treino</h2>
              <p className="text-sm text-gray-400">{selectedAthlete.name}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-300">Como foi o esforço do treino? (PSE)</span>
                  <span className="text-primary text-xl font-black">{pse} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={pse}
                  onChange={(e) => setPse(e.target.value)}
                  className="w-full accent-primary h-3 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>0 Muito Leve</span>
                  <span>5 Moderado</span>
                  <span>8 Difícil</span>
                  <span>10 Exaustivo</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Duração Realizada (minutos)</label>
                <input
                  type="number"
                  min="10"
                  max="360"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white text-lg font-bold text-center focus:border-primary focus:outline-none"
                />
              </div>

              <div className="p-3 bg-background rounded-xl border border-gray-800 text-center">
                <span className="text-xs text-gray-400">Carga da Sessão Gerada</span>
                <p className="text-2xl font-black text-primary">
                  {(Number(duration) || 0) * (Number(pse) || 0)} <span className="text-xs text-gray-400">UA</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={resetModals}
                className="py-3 px-4 bg-background border border-gray-700 text-gray-300 rounded-xl font-semibold text-sm hover:border-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/25"
              >
                {saving ? 'Registrando...' : 'Confirmar Saída'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Pré-Treino Rápido (PSR) */}
      {selectedAthlete && actionType === 'pre' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleSavePreWorkout}
            className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 shadow-2xl"
          >
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white">Check-in Pré-Treino</h2>
              <p className="text-sm text-gray-400">{selectedAthlete.name}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-300">Como você se recuperou? (PSR)</span>
                  <span className="text-primary text-xl font-black">{psr} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={psr}
                  onChange={(e) => setPsr(e.target.value)}
                  className="w-full accent-primary h-3 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>0 Não Recuperado</span>
                  <span>5 Razoável</span>
                  <span>10 Totalmente Apto</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Peso Corporal Pré-Treino (kg) - Opcional</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 78.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white text-base text-center focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={resetModals}
                className="py-3 px-4 bg-background border border-gray-700 text-gray-300 rounded-xl font-semibold text-sm hover:border-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-primary/25"
              >
                {saving ? 'Registrando...' : 'Confirmar Entrada'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
