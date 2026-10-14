import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function GoalsPage() {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulário de nova meta
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Desempenho');
  const [targetValue, setTargetValue] = useState(100);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('kg');
  const [deadline, setDeadline] = useState('');

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/athletes/');
      setAthletes(res.data || []);
      if (res.data?.length > 0 && !selectedAthleteId) {
        setSelectedAthleteId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar atletas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!selectedAthleteId) return;
    try {
      const res = await api.get(`/api/v1/goals/athlete/${selectedAthleteId}`);
      setGoals(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      fetchGoals();
    }
  }, [selectedAthleteId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedAthleteId || !title.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/goals/', {
        athlete_id: Number(selectedAthleteId),
        title: title.trim(),
        category,
        target_value: Number(targetValue),
        current_value: Number(currentValue),
        unit,
        deadline: deadline || undefined,
      });
      setSuccess('Meta / OKR criada com sucesso!');
      setTitle('');
      fetchGoals();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar meta.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProgress = async (goalId, newCurrent) => {
    try {
      await api.put(`/api/v1/goals/${goalId}`, {
        current_value: Number(newCurrent),
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar progresso da meta.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="h-7 w-7 text-primary" /> Metas do Atleta & OKRs
          </h1>
          <p className="text-sm text-gray-400">
            Acompanhe metas de força (1RM), composição corporal, velocidade e assiduidade com barra de progresso em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            className="px-3 py-2 bg-surface border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.user?.name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchGoals}
            className="p-2 bg-surface border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500"
          >
            <RefreshCw className="h-4 w-4" />
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

      {/* Formulário de Criação de Meta */}
      <form onSubmit={handleCreate} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" /> Nova Meta / Objetivo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Título da Meta *</label>
            <input
              type="text"
              required
              placeholder="Ex: Agachamento 1RM 140kg, Reduzir BF para 11%..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="Desempenho">Desempenho</option>
              <option value="Força">Força (1RM)</option>
              <option value="Composição Corporal">Composição Corporal</option>
              <option value="Frequência">Frequência / Assiduidade</option>
              <option value="Fisioterapia">Fisioterapia / Retorno</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Data Limite (Prazo)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Valor Inicial / Atual</label>
            <input
              type="number"
              step="any"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Valor Alvo (Meta) *</label>
            <input
              type="number"
              step="any"
              required
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none font-bold text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Unidade de Medida</label>
            <input
              type="text"
              placeholder="kg, cm, %, s, treinos..."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> {saving ? 'Salvando...' : 'Criar Meta'}
          </button>
        </div>
      </form>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-surface border border-gray-800 rounded-2xl p-8 text-center text-gray-400 text-sm">
            Nenhuma meta cadastrada para este atleta ainda.
          </div>
        ) : (
          goals.map((g) => {
            const pct = Math.min(100, Math.max(0, Math.round(((g.current_value || 0) / (g.target_value || 1)) * 100)));
            const isCompleted = pct >= 100;

            return (
              <div
                key={g.id}
                className="bg-surface border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{g.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {g.category || 'Geral'}
                      </span>
                      {isCompleted && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                          <CheckCircle className="h-3 w-3" /> Concluída!
                        </span>
                      )}
                    </div>
                    {g.deadline && (
                      <p className="text-xs text-gray-400 mt-1">Prazo: {g.deadline}</p>
                    )}
                  </div>

                  {/* Input Rápido de Atualização */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs text-gray-400">Progresso atual:</span>
                    <input
                      type="number"
                      defaultValue={g.current_value}
                      onBlur={(e) => handleUpdateProgress(g.id, e.target.value)}
                      className="w-20 px-2 py-1 bg-background border border-gray-700 rounded text-white text-xs text-center focus:border-primary focus:outline-none"
                    />
                    <span className="text-xs text-gray-400">{g.unit}</span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {g.current_value} / {g.target_value} {g.unit}
                    </span>
                    <span className="font-bold text-white">{pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-gray-700">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : 'bg-gradient-to-r from-primary to-purple-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
