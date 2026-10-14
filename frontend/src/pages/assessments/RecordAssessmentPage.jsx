import React, { useState, useEffect } from 'react';
import { Activity, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function RecordAssessmentPage() {
  const [athletes, setAthletes] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [athRes, typesRes] = await Promise.all([
        api.get('/api/v1/athletes/'),
        api.get('/api/v1/assessments/types'),
      ]);
      setAthletes(athRes.data || []);
      setTypes(typesRes.data || []);

      if (athRes.data?.length > 0 && !selectedAthleteId) {
        setSelectedAthleteId(athRes.data[0].id);
      }
      if (typesRes.data?.length > 0 && !selectedTypeId) {
        setSelectedTypeId(typesRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados de avaliação.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!selectedAthleteId) return;
    try {
      const res = await api.get(`/api/v1/assessments/athlete/${selectedAthleteId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      fetchHistory();
    }
  }, [selectedAthleteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAthleteId || !selectedTypeId || !value) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/assessments/results', {
        athlete_id: Number(selectedAthleteId),
        assessment_type_id: Number(selectedTypeId),
        test_date: testDate,
        value: Number(value),
        notes: notes.trim() || undefined,
      });
      setSuccess('Avaliação registrada com sucesso!');
      setValue('');
      setNotes('');
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao salvar avaliação.');
    } finally {
      setSaving(false);
    }
  };

  const currentType = types.find((t) => t.id === Number(selectedTypeId));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" /> Lançar Avaliação Física Customizada
          </h1>
          <p className="text-sm text-gray-400">
            Lance os resultados obtidos em testes específicos para evolução longitudinal do atleta.
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
            onClick={fetchHistory}
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

      {/* Formulário de Lançamento */}
      <form onSubmit={handleSubmit} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" /> Registrar Resultado
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Tipo de Avaliação *</label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Data da Coleta *</label>
            <input
              type="date"
              required
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">
              Valor Medido ({currentType?.unit || 'Valor'}) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="Ex: 85"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none font-bold text-primary"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" /> {saving ? 'Salvando...' : 'Gravar'}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Observações Clínicas / Detalhes</label>
          <input
            type="text"
            placeholder="Ex: Boa recuperação na fase concêntrica, calçado padrão..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </form>

      {/* Histórico de Resultados */}
      <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm">
            Histórico de Avaliações Registradas ({history.length})
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Nenhuma avaliação registrada para este atleta.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {history.map((h) => (
              <div key={h.id} className="p-4 flex items-center justify-between hover:bg-background/40 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{h.test_date}</span>
                    <h3 className="font-semibold text-white text-sm">
                      {h.assessment_type?.name || `Teste #${h.assessment_type_id}`}
                    </h3>
                  </div>
                  {h.notes && <p className="text-xs text-gray-400 mt-1">{h.notes}</p>}
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-primary">
                    {h.value} <span className="text-xs text-gray-400 font-normal">{h.assessment_type?.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
