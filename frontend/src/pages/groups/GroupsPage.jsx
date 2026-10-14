import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Shield, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);

  // Modal para associar atletas a grupo
  const [selectedGroupForAthletes, setSelectedGroupForAthletes] = useState(null);
  const [athleteGroupMap, setAthleteGroupMap] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grpRes, athRes] = await Promise.all([
        api.get('/api/v1/groups/'),
        api.get('/api/v1/athletes/'),
      ]);
      const gList = Array.isArray(grpRes?.data) ? grpRes.data : (grpRes?.data?.groups || []);
      const aList = Array.isArray(athRes?.data) ? athRes.data : (athRes?.data?.athletes || []);
      setGroups(gList);
      setAthletes(aList);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar turmas e atletas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingGroup) {
        await api.put(`/api/v1/groups/${editingGroup.id}`, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
        setSuccess('Turma atualizada com sucesso!');
      } else {
        await api.post('/api/v1/groups/', {
          name: name.trim(),
          description: description.trim() || undefined,
        });
        setSuccess('Turma criada com sucesso!');
      }
      setName('');
      setDescription('');
      setEditingGroup(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao salvar grupo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (id, groupName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o grupo "${groupName}"?`)) return;
    try {
      await api.delete(`/api/v1/groups/${id}`);
      setSuccess(`Grupo "${groupName}" excluído.`);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir grupo.');
    }
  };

  const handleAssignAthlete = async (athleteId, groupId) => {
    try {
      await api.put(`/api/v1/athletes/${athleteId}`, {
        group_id: groupId || null,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar grupo do atleta.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" /> Gestão de Grupos / Turmas
          </h1>
          <p className="text-sm text-gray-400">
            Organize atletas em turmas (ex: Pré-Temporada, Sub-20, Personal VIP) para planejamentos e treinos coletivos.
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

      {/* Formulário de Criação/Edição */}
      <form onSubmit={handleSaveGroup} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {editingGroup ? <Edit2 className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
          {editingGroup ? 'Editar Turma' : 'Criar Nova Turma'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Nome da Turma / Grupo *</label>
            <input
              type="text"
              required
              placeholder="Ex: Sub-20 Competitivo, Pré-Temporada 2026..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-5 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Descrição / Metodologia (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Foco em potência e transições rápidas"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              {saving ? 'Salvando...' : editingGroup ? 'Salvar' : 'Criar'}
            </button>
            {editingGroup && (
              <button
                type="button"
                onClick={() => {
                  setEditingGroup(null);
                  setName('');
                  setDescription('');
                }}
                className="px-3 py-2 bg-background border border-gray-700 text-gray-300 rounded-lg text-sm hover:border-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Grid de Grupos Existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-400">Carregando grupos...</div>
        ) : groups.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-400 bg-surface border border-gray-800 rounded-2xl">
            Nenhuma turma cadastrada. Crie uma turma acima para começar a organizar seus atletas.
          </div>
        ) : (
          (Array.isArray(groups) ? groups : []).map((grp) => {
            const safeAthletes = Array.isArray(athletes) ? athletes : [];
            const groupAthletes = safeAthletes.filter((a) => a?.group_id === grp?.id);
            return (
              <div
                key={grp.id}
                className="bg-surface border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{grp.name}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingGroup(grp);
                          setName(grp.name);
                          setDescription(grp.description || '');
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-background rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(grp.id, grp.name)}
                        className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {grp.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{grp.description}</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Atletas Vinculados:</span>
                    <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {grp.athlete_count || groupAthletes.length} atletas
                    </span>
                  </div>

                  {/* Prévia dos atletas */}
                  <div className="mt-3 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {groupAthletes.length > 0 ? (
                      groupAthletes.map((ath) => (
                        <span
                          key={ath.id}
                          className="text-[11px] px-2 py-0.5 bg-background border border-gray-700 rounded-md text-gray-300"
                        >
                          {ath.name || ath.user?.name || `Atleta #${ath.id}`}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">Nenhum atleta atribuído</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => setSelectedGroupForAthletes(grp)}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Gerenciar Atletas da Turma &rarr;
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Painel de Alocação de Atletas */}
      {selectedGroupForAthletes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Atletas em: {selectedGroupForAthletes.name}
                </h3>
                <p className="text-xs text-gray-400">Selecione quais atletas pertencem a esta turma.</p>
              </div>
              <button
                onClick={() => setSelectedGroupForAthletes(null)}
                className="px-3 py-1 bg-surface border border-gray-700 text-gray-300 rounded-lg text-xs hover:border-gray-500"
              >
                Fechar
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-2 flex-1">
              {(!Array.isArray(athletes) || athletes.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-6">Nenhum atleta cadastrado na sua conta.</p>
              ) : (
                (Array.isArray(athletes) ? athletes : []).map((ath) => {
                  const isMember = ath?.group_id === selectedGroupForAthletes?.id;
                  const currentGroup = (Array.isArray(groups) ? groups : []).find((g) => g?.id === ath?.group_id);
                  return (
                    <div
                      key={ath.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition ${
                        isMember
                          ? 'bg-primary/10 border-primary/40 text-white'
                          : 'bg-surface border-gray-800 text-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{ath.name || ath.user?.name}</p>
                        <p className="text-xs text-gray-400">
                          {ath.position || ath.category || 'Atleta'} &bull;{' '}
                          {currentGroup && currentGroup.id !== selectedGroupForAthletes.id
                            ? `Atualmente em: ${currentGroup.name}`
                            : ath.group_id
                            ? 'Nesta turma'
                            : 'Sem turma'}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleAssignAthlete(ath.id, isMember ? null : selectedGroupForAthletes.id)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isMember
                            ? 'bg-danger/20 border-danger/40 text-danger hover:bg-danger/30'
                            : 'bg-primary/20 border-primary/40 text-primary hover:bg-primary/30'
                        }`}
                      >
                        {isMember ? 'Remover da Turma' : 'Adicionar à Turma'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
