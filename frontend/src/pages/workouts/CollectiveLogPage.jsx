import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, CheckCircle2, Clock, Brain, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function CollectiveLogPage() {
  const [groups, setGroups] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Configuração global da sessão
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutType, setWorkoutType] = useState('');
  const [defaultDuration, setDefaultDuration] = useState(60);

  // Mapa de presença e PSE por atleta: { [athleteId]: { present: true, duration: 60, pse: 6 } }
  const [logRows, setLogRows] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grpRes, athRes, typesRes] = await Promise.all([
        api.get('/api/v1/groups/'),
        api.get('/api/v1/athletes/'),
        api.get('/api/v1/workout-types/'),
      ]);
      const gList = Array.isArray(grpRes?.data) ? grpRes.data : (grpRes?.data?.groups || []);
      const aList = Array.isArray(athRes?.data) ? athRes.data : (athRes?.data?.athletes || []);
      const tList = Array.isArray(typesRes?.data) ? typesRes.data : (typesRes?.data?.workout_types || []);

      setGroups(gList);
      setAthletes(aList);
      setWorkoutTypes(tList);

      if (gList.length > 0 && !selectedGroupId) {
        setSelectedGroupId(gList[0].id);
      }
      if (tList.length > 0 && !workoutType) {
        setWorkoutType(tList[0].name);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados do coletivo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Atualiza linhas quando o grupo ou duração padrão muda
  useEffect(() => {
    if (!selectedGroupId) return;
    const safeAthletes = Array.isArray(athletes) ? athletes : [];
    const groupAthletes = safeAthletes.filter((a) => a?.group_id === Number(selectedGroupId));
    const newRows = {};
    groupAthletes.forEach((a) => {
      newRows[a.id] = {
        present: true,
        duration: defaultDuration,
        pse: 6,
      };
    });
    setLogRows(newRows);
  }, [selectedGroupId, athletes, defaultDuration]);

  const handleApplyDurationToAll = () => {
    const updated = { ...logRows };
    Object.keys(updated).forEach((id) => {
      updated[id].duration = defaultDuration;
    });
    setLogRows(updated);
  };

  const handleRowChange = (athleteId, field, value) => {
    setLogRows((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const promises = [];
    const activeAthletes = Object.keys(logRows).filter((id) => logRows[id]?.present);

    if (activeAthletes.length === 0) {
      setError('Nenhum atleta marcado como presente.');
      setSaving(false);
      return;
    }

    try {
      for (const id of activeAthletes) {
        const row = logRows[id];
        const payload = {
          athlete_id: Number(id),
          workout_id: 1, // Treino coletivo de base
          rpe: Number(row.pse),
          duration_minutes: Number(row.duration),
          notes: `Treino Coletivo: ${workoutType}`,
        };
        promises.push(api.post('/api/v1/monitoring/pse', payload));
      }

      await Promise.all(promises);
      setSuccess(`Sessão coletiva registrada com sucesso para ${activeAthletes.length} atletas!`);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar algumas sessões de treino.');
    } finally {
      setSaving(false);
    }
  };

  const currentGroupAthletes = athletes.filter((a) => a.group_id === Number(selectedGroupId));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-primary" /> Lançamento de Treino Coletivo
          </h1>
          <p className="text-sm text-gray-400">
            Lance a sessão realizada e colete o PSE de todos os atletas da turma em lote com um único clique.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-3 py-2 bg-surface border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300 flex items-center gap-2 self-start"
        >
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
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

      {/* Controles Globais da Sessão */}
      <div className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Turma / Grupo *</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Data da Sessão *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Modalidade / Tipo *</label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              {(Array.isArray(workoutTypes) ? workoutTypes : []).map((t, idx) => {
                const typeName = typeof t === 'string' ? t : (t?.name || t?.title || t?.description || t?.label || `Tipo ${idx + 1}`);
                const typeId = typeof t === 'string' ? t : (t?.id || typeName);
                return (
                  <option 
                    key={typeId || idx} 
                    value={typeName}
                    style={{ backgroundColor: '#111827', color: '#FFFFFF' }}
                  >
                    {typeName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Duração Padrão (min)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                max="360"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyDurationToAll}
                className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-semibold whitespace-nowrap hover:bg-primary/30"
              >
                Aplicar a todos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Rápida de Atletas do Grupo */}
      <form onSubmit={handleSubmit} className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Atletas da Turma ({currentGroupAthletes.length})
          </h2>
          <span className="text-xs text-gray-400">Marque a presença e ajuste a PSE e minutos individuais</span>
        </div>

        {currentGroupAthletes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Nenhum atleta vinculado a esta turma. Acesse o menu <strong>"Turmas / Grupos"</strong> para vincular atletas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-background text-xs uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">Presença</th>
                  <th className="px-4 py-3">Atleta</th>
                  <th className="px-4 py-3 w-32">Duração (min)</th>
                  <th className="px-4 py-3 w-64">PSE da Sessão (0 a 10)</th>
                  <th className="px-4 py-3 w-28 text-right">Carga (UA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(Array.isArray(currentGroupAthletes) ? currentGroupAthletes : []).map((ath) => {
                  const row = logRows[ath?.id] || { present: true, duration: defaultDuration, pse: 6 };
                  const load = (Number(row?.duration) || 0) * (Number(row?.pse) || 0);

                  return (
                    <tr
                      key={ath.id}
                      className={`transition ${row.present ? 'hover:bg-background/40' : 'opacity-40 bg-background/20'}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={row.present}
                          onChange={(e) => handleRowChange(ath.id, 'present', e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{ath.name || ath.user?.name}</p>
                        <p className="text-xs text-gray-500">{ath.position || 'Geral'}</p>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          disabled={!row.present}
                          value={row.duration}
                          onChange={(e) => handleRowChange(ath.id, 'duration', e.target.value)}
                          className="w-24 px-2.5 py-1.5 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none disabled:opacity-50"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            disabled={!row.present}
                            value={row.pse}
                            onChange={(e) => handleRowChange(ath.id, 'pse', e.target.value)}
                            className="w-full accent-primary cursor-pointer disabled:opacity-50"
                          />
                          <span className="font-bold text-white text-sm w-8 text-right">{row.pse}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="font-black text-primary text-base">{load}</span>
                        <span className="text-[10px] text-gray-500 ml-1">UA</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {currentGroupAthletes.length > 0 && (
          <div className="p-4 border-t border-gray-800 bg-background/30 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {saving ? 'Registrando Coletivo...' : 'Salvar Treino de Toda a Turma'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
