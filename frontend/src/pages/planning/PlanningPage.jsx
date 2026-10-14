import React, { useState, useEffect } from 'react';
import { Calendar, Users, User, Plus, Trash2, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function PlanningPage() {
  const [tab, setTab] = useState('individual'); // 'individual' | 'collective'
  const [athletes, setAthletes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulário Individual
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState(60);
  const [plannedPse, setPlannedPse] = useState(6);
  const [notes, setNotes] = useState('');

  // Formulário Coletivo
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Histórico de planos
  const [plansHistory, setPlansHistory] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [athRes, grpRes, typesRes] = await Promise.all([
        api.get('/api/v1/athletes/'),
        api.get('/api/v1/groups/'),
        api.get('/api/v1/workout-types/'),
      ]);
      setAthletes(athRes.data || []);
      setGroups(grpRes.data || []);
      setWorkoutTypes(typesRes.data || []);

      if (athRes.data?.length > 0 && !selectedAthleteId) {
        setSelectedAthleteId(athRes.data[0].id);
      }
      if (grpRes.data?.length > 0 && !selectedGroupId) {
        setSelectedGroupId(grpRes.data[0].id);
      }
      if (typesRes.data?.length > 0 && !selectedType) {
        setSelectedType(typesRes.data[0].name);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados de planejamento.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    if (!selectedAthleteId) return;
    try {
      const res = await api.get(`/api/v1/planning/athlete/${selectedAthleteId}`);
      setPlansHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAthleteId && tab === 'individual') {
      fetchPlans();
    }
  }, [selectedAthleteId, tab]);

  const plannedLoad = (Number(duration) || 0) * (Number(plannedPse) || 0);

  const handleSaveIndividual = async (e) => {
    e.preventDefault();
    if (!selectedAthleteId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/planning/individual', {
        athlete_id: Number(selectedAthleteId),
        date: planDate,
        workout_type: selectedType,
        planned_duration: Number(duration),
        planned_pse: Number(plannedPse),
        notes: notes.trim() || undefined,
      });
      setSuccess(`Carga planejada com sucesso: ${plannedLoad} UA!`);
      setNotes('');
      fetchPlans();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao salvar planejamento individual.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCollective = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/v1/planning/collective', {
        group_id: Number(selectedGroupId),
        date: planDate,
        workout_type: selectedType,
        planned_duration: Number(duration),
        planned_pse: Number(plannedPse),
        notes: notes.trim() || undefined,
      });
      setSuccess(`Planejamento coletivo salvo para ${res.data?.created_count || 'todos os'} atletas da turma!`);
      setNotes('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao salvar planejamento coletivo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" /> Planejamento de Carga de Treino
          </h1>
          <p className="text-sm text-gray-400">
            Projete a demanda fisiológica semanal (Duração x PSE Prevista = Carga em UA) e monitore o ACWR preventivamente.
          </p>
        </div>

        {/* Alternador Individual / Coletivo */}
        <div className="flex p-1 bg-surface border border-gray-800 rounded-xl self-start">
          <button
            onClick={() => setTab('individual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'individual' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" /> Individual
          </button>
          <button
            onClick={() => setTab('collective')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'collective' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" /> Por Turma / Coletivo
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm">
          {success}
        </div>
      )}

      {/* Card Principal de Planejamento */}
      <div className="bg-surface border border-gray-800 rounded-2xl p-6">
        <form onSubmit={tab === 'individual' ? handleSaveIndividual : handleSaveCollective} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {tab === 'individual' ? (
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs text-gray-400 font-medium">Selecione o Atleta *</label>
                <select
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name || a.user?.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs text-gray-400 font-medium">Selecione a Turma / Grupo *</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.athlete_count || 0} atletas)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs text-gray-400 font-medium">Data do Treino *</label>
              <input
                type="date"
                required
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-5 space-y-1">
              <label className="text-xs text-gray-400 font-medium">Tipo de Treino / Modalidade *</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
              >
                {workoutTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs text-gray-400 font-medium">Duração Prevista (min) *</label>
              <input
                type="number"
                min="10"
                max="360"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-5 space-y-1">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="font-medium">PSE Alvo (Escala Foster 0 a 10):</span>
                <span className="font-bold text-primary text-sm">{plannedPse} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={plannedPse}
                onChange={(e) => setPlannedPse(e.target.value)}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0 Muito Leve</span>
                <span>5 Moderado</span>
                <span>8 Difícil</span>
                <span>10 Exaustivo</span>
              </div>
            </div>

            {/* Display de Carga Planejada */}
            <div className="md:col-span-4 p-3 bg-background border border-gray-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Carga Planejada (Foster)</p>
                <p className="text-2xl font-black text-white">{plannedLoad} <span className="text-xs text-primary font-bold">UA</span></p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/40" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Objetivos da Sessão / Observações Técnicas</label>
            <input
              type="text"
              placeholder="Ex: Foco em velocidade de saída e recuperação entre séries de 30s..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {saving ? 'Gravando Planejamento...' : tab === 'individual' ? 'Salvar Plano do Atleta' : 'Salvar Plano para toda a Turma'}
            </button>
          </div>
        </form>
      </div>

      {/* Histórico do Atleta Selecionado */}
      {tab === 'individual' && (
        <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Histórico de Sessões Planejadas
            </h3>
            <button onClick={fetchPlans} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Atualizar
            </button>
          </div>

          {plansHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              Nenhum planejamento registrado para este atleta ainda.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {plansHistory.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-background/30 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{p.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
                        {p.workout_type}
                      </span>
                    </div>
                    {p.notes && <p className="text-xs text-gray-400 mt-1">{p.notes}</p>}
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-white">{p.planned_load} UA</p>
                      <p className="text-xs text-gray-400">{p.planned_duration} min &bull; PSE {p.planned_pse}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
