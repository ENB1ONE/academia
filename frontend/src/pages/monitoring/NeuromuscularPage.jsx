import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, ShieldCheck, Activity, RefreshCw, BarChart2 } from 'lucide-react';
import api from '../../services/api';

export default function NeuromuscularPage() {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // Formulário de novo salto
  const [jumpHeight, setJumpHeight] = useState(38.5);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [flightTime, setFlightTime] = useState('');
  const [peakPower, setPeakPower] = useState('');
  const [rsiModified, setRsiModified] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const fetchAthleteCmj = async () => {
    if (!selectedAthleteId) return;
    try {
      const res = await api.get(`/api/v1/monitoring/cmj/${selectedAthleteId}`);
      setHistory(res.data?.history || []);
      setAnalysis(res.data?.analysis || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      fetchAthleteCmj();
    }
  }, [selectedAthleteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAthleteId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/monitoring/cmj', {
        athlete_id: Number(selectedAthleteId),
        test_date: testDate,
        jump_height_cm: Number(jumpHeight),
        flight_time_ms: flightTime ? Number(flightTime) : undefined,
        peak_power_w: peakPower ? Number(peakPower) : undefined,
        rsi_modified: rsiModified ? Number(rsiModified) : undefined,
      });
      setSuccess('Teste de salto CMJ registrado com sucesso!');
      fetchAthleteCmj();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar teste neuromuscular.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'supercompensation':
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Supercompensação (Apto à Alta Demanda)
          </span>
        );
      case 'stable':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full font-bold text-xs flex items-center gap-1.5">
            <Activity className="h-4 w-4" /> Estado Estável (Normal)
          </span>
        );
      case 'fatigue':
        return (
          <span className="px-3 py-1 bg-danger/20 text-danger border border-danger/40 rounded-full font-bold text-xs flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Fadiga Neuromuscular Detectada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
            Baseline em Construção
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" /> Prontidão Neuromuscular (Salto CMJ)
          </h1>
          <p className="text-sm text-gray-400">
            Controle de fadiga central e prontidão do sistema nervoso através da altura de salto (Baseline vs. Desvio Padrão e CV %).
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
            onClick={fetchAthleteCmj}
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

      {/* Cards de Métricas Fisiológicas */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
            <span className="text-xs text-gray-400">Média Histórica (Baseline)</span>
            <p className="text-2xl font-black text-white mt-1">
              {analysis.baseline_mean_cm ? `${analysis.baseline_mean_cm.toFixed(1)} cm` : '---'}
            </p>
            <span className="text-[10px] text-gray-500">Últimos testes do atleta</span>
          </div>

          <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
            <span className="text-xs text-gray-400">Desvio Padrão (SD)</span>
            <p className="text-2xl font-black text-white mt-1">
              {analysis.sd_cm ? `± ${analysis.sd_cm.toFixed(1)} cm` : '---'}
            </p>
            <span className="text-[10px] text-gray-500">Limiar de oscilação real</span>
          </div>

          <div className="p-4 bg-surface border border-gray-800 rounded-2xl">
            <span className="text-xs text-gray-400">Coef. de Variação (CV %)</span>
            <p className="text-2xl font-black text-primary mt-1">
              {analysis.cv_percent ? `${analysis.cv_percent.toFixed(1)}%` : '---'}
            </p>
            <span className="text-[10px] text-gray-500">&lt; 5% = Alta consistência</span>
          </div>

          <div className="p-4 bg-surface border border-gray-800 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-gray-400">Status Neuromuscular</span>
            <div className="mt-1">{getStatusBadge(analysis.status)}</div>
            <span className="text-[10px] text-gray-500">Avaliação do último salto</span>
          </div>
        </div>
      )}

      {/* Registro de Novo Teste */}
      <form onSubmit={handleSubmit} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Registrar Salto CMJ (Countermovement Jump)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Data do Teste *</label>
            <input
              type="date"
              required
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Altura do Salto (cm) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={jumpHeight}
              onChange={(e) => setJumpHeight(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none font-bold text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Tempo de Vôo (ms)</label>
            <input
              type="number"
              placeholder="Ex: 550"
              value={flightTime}
              onChange={(e) => setFlightTime(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Potência de Pico (W)</label>
            <input
              type="number"
              placeholder="Ex: 3400"
              value={peakPower}
              onChange={(e) => setPeakPower(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">RSI Modificado</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 0.45"
              value={rsiModified}
              onChange={(e) => setRsiModified(e.target.value)}
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
            {saving ? 'Gravando...' : 'Salvar Medição Neuromuscular'}
          </button>
        </div>
      </form>

      {/* Histórico de Saltos */}
      <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" /> Histórico de Saltos Realizados ({history.length})
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Nenhum teste CMJ registrado para este atleta.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-background text-xs uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Altura (cm)</th>
                  <th className="px-4 py-3">Tempo de Vôo</th>
                  <th className="px-4 py-3">Potência de Pico</th>
                  <th className="px-4 py-3">RSI Modificado</th>
                  <th className="px-4 py-3 text-right">Comparação Baseline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((h) => {
                  const baseline = analysis?.baseline_mean_cm;
                  const diff = baseline ? h.jump_height_cm - baseline : 0;
                  return (
                    <tr key={h.id} className="hover:bg-background/30 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{h.test_date}</td>
                      <td className="px-4 py-3 font-bold text-white">{h.jump_height_cm} cm</td>
                      <td className="px-4 py-3 text-gray-400">{h.flight_time_ms ? `${h.flight_time_ms} ms` : '---'}</td>
                      <td className="px-4 py-3 text-gray-400">{h.peak_power_w ? `${h.peak_power_w} W` : '---'}</td>
                      <td className="px-4 py-3 text-gray-400">{h.rsi_modified || '---'}</td>
                      <td className="px-4 py-3 text-right">
                        {baseline ? (
                          <span
                            className={`text-xs font-bold ${
                              diff >= 0 ? 'text-emerald-400' : 'text-danger'
                            }`}
                          >
                            {diff >= 0 ? `+${diff.toFixed(1)} cm` : `${diff.toFixed(1)} cm`}
                          </span>
                        ) : (
                          '---'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
