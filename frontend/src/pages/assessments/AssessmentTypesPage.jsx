import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Tag, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const UNITS = [
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'cm', label: 'Centímetros (cm)' },
  { value: 'time', label: 'Tempo (s / min)' },
  { value: 'W', label: 'Potência / Watts (W)' },
  { value: 'm/s', label: 'Velocidade (m/s)' },
  { value: 'km', label: 'Quilômetros (km)' },
  { value: 'm', label: 'Metros (m)' },
  { value: 'deg', label: 'Graus de Mobilidade (°)' },
  { value: 'pct', label: 'Porcentagem (%)' },
  { value: 'points', label: 'Pontos / Escala' },
];

export default function AssessmentTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState('Força');
  const [description, setDescription] = useState('');

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/assessments/types');
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.types || []);
      setTypes(list);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar tipos de avaliação.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/assessments/types', {
        name: name.trim(),
        unit,
        category,
        description: description.trim() || undefined,
      });
      setName('');
      setDescription('');
      setSuccess('Tipo de avaliação cadastrado com sucesso!');
      fetchTypes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao cadastrar avaliação.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, typeName) => {
    if (!window.confirm(`Excluir tipo de avaliação "${typeName}"?`)) return;
    try {
      await api.delete(`/api/v1/assessments/types/${id}`);
      setSuccess('Avaliação removida.');
      fetchTypes();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir avaliação.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" /> Tipos de Avaliações Customizadas
          </h1>
          <p className="text-sm text-gray-400">
            Cadastre testes customizados de força, potência, flexibilidade, composição corporal ou velocidade com unidades personalizadas.
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

      {/* Formulário de Criação */}
      <form onSubmit={handleCreate} className="bg-surface border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" /> Novo Teste Físico / Avaliação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Nome do Teste *</label>
            <input
              type="text"
              required
              placeholder="Ex: Supino 1RM, Yo-Yo Test, Sit and Reach..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Unidade de Medida *</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="Força">Força / Carga Máxima</option>
              <option value="Potência">Potência / Salto</option>
              <option value="Velocidade">Velocidade / Sprint</option>
              <option value="Cardiorrespiratório">Cardiorrespiratório</option>
              <option value="Mobilidade">Mobilidade / Flexibilidade</option>
              <option value="Antropometria">Antropometria / Dobras</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-9 space-y-1">
            <label className="text-xs text-gray-400 font-medium">Protocolo / Instruções (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Realizar 3 tentativas e anotar a melhor marca após 3 min de intervalo."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> {saving ? 'Salvando...' : 'Adicionar Teste'}
            </button>
          </div>
        </div>
      </form>

      {/* Grid de Tipos */}
      <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" /> Testes Customizados Disponíveis ({types.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando testes...</div>
        ) : (!Array.isArray(types) || types.length === 0) ? (
          <div className="p-8 text-center text-gray-400">
            Nenhum teste customizado criado ainda. Crie seu primeiro protocolo acima!
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {(Array.isArray(types) ? types : []).map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-background/40 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white text-sm">{t.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono">
                      {t.unit}
                    </span>
                    <span className="text-xs text-gray-500">&bull; {t.category || 'Geral'}</span>
                  </div>
                  {t.description && <p className="text-xs text-gray-400 mt-1">{t.description}</p>}
                </div>

                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
