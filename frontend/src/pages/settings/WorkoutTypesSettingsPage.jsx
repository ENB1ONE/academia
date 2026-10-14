import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Tag, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function WorkoutTypesSettingsPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#8b5cf6');
  const [newDesc, setNewDesc] = useState('');

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/workout-types/');
      setTypes(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar tipos de treino.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/workout-types/', {
        name: newName.trim(),
        color: newColor,
        description: newDesc.trim() || undefined,
      });
      setNewName('');
      setNewDesc('');
      setSuccess('Modalidade cadastrada com sucesso!');
      fetchTypes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao cadastrar modalidade.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Excluir modalidade: ${name}?`)) return;
    try {
      await api.delete(`/api/v1/workout-types/${id}`);
      setSuccess('Modalidade removida.');
      fetchTypes();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir modalidade.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" /> Tipos de Treino (Modalidades)
          </h1>
          <p className="text-sm text-gray-400">
            Configure as modalidades com cores de identificação para planejamento e relatórios Foster / Gabbett.
          </p>
        </div>
        <button
          onClick={fetchTypes}
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

      {/* Cadastro de Novo Tipo */}
      <form onSubmit={handleCreate} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" /> Nova Modalidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Nome da Modalidade *</label>
            <input
              type="text"
              required
              placeholder="Ex: Força Máxima, HIIT, Coletivo..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Cor *</label>
            <div className="flex items-center gap-2 bg-background border border-gray-700 rounded-lg p-1.5">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-gray-300 uppercase">{newColor}</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Descrição / Foco (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Alta exigência neuromuscular"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 flex-wrap text-xs text-gray-400">
          <span>Sugestões de cor:</span>
          {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setNewColor(c)}
              className="w-5 h-5 rounded-full border border-gray-600 transition hover:scale-110"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </form>

      {/* Lista de Modalidades Cadastradas */}
      <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" /> Modalidades Ativas ({types.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando modalidades...</div>
        ) : types.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Nenhuma modalidade personalizada cadastrada ainda.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {types.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-background/40 transition">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: t.color || '#8b5cf6' }}
                  />
                  <div>
                    <h3 className="font-medium text-white text-sm">{t.name}</h3>
                    {t.description && <p className="text-xs text-gray-400">{t.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-mono border"
                    style={{
                      borderColor: (t.color || '#8b5cf6') + '40',
                      color: t.color || '#8b5cf6',
                      backgroundColor: (t.color || '#8b5cf6') + '15',
                    }}
                  >
                    {t.color}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition"
                    title="Excluir modalidade"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
