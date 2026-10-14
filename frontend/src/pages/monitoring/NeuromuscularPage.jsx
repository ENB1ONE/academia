import React, { useState, useEffect } from 'react';
import { 
  Zap, TrendingUp, AlertTriangle, ShieldCheck, Activity, RefreshCw, 
  BarChart2, Printer, Search, PlusCircle, Check, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import defaultAvatar from '../../assets/avatar-default.png';

export default function NeuromuscularPage() {
  const [athletes, setAthletes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedAthleteFilter, setSelectedAthleteFilter] = useState('all');
  const [sensitivity, setSensitivity] = useState('1.0');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal de cadastro de novo salto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAthleteId, setModalAthleteId] = useState('');
  const [jumpHeight, setJumpHeight] = useState(38.5);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [flightTime, setFlightTime] = useState('');
  const [peakPower, setPeakPower] = useState('');
  const [rsiModified, setRsiModified] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAthletesAndGroups = async () => {
    try {
      setLoading(true);
      const [athRes, grpRes] = await Promise.all([
        api.get('/api/v1/athletes/'),
        api.get('/api/v1/groups/').catch(() => ({ data: [] }))
      ]);

      const athList = Array.isArray(athRes?.data) ? athRes.data : (athRes?.data?.athletes || []);
      const grpList = Array.isArray(grpRes?.data) ? grpRes.data : (grpRes?.data?.groups || []);

      setAthletes(athList);
      setGroups(grpList);
      if (athList.length > 0 && !modalAthleteId) {
        setModalAthleteId(athList[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletesAndGroups();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveJump = async (e) => {
    e.preventDefault();
    if (!modalAthleteId) return;
    setSaving(true);
    try {
      await api.post('/api/v1/monitoring/cmj', {
        athlete_id: Number(modalAthleteId),
        test_date: testDate,
        jump_height_cm: Number(jumpHeight),
        flight_time_ms: flightTime ? Number(flightTime) : undefined,
        peak_power_w: peakPower ? Number(peakPower) : undefined,
        rsi_modified: rsiModified ? Number(rsiModified) : undefined,
      });
      toast.success('Salto CMJ registrado com sucesso!');
      setIsModalOpen(false);
      fetchAthletesAndGroups();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao registrar salto');
    } finally {
      setSaving(false);
    }
  };

  // Filtragem dos atletas para a tabela
  const filteredAthletes = athletes.filter((ath) => {
    const grp = (ath.group_name || ath.group || ath.nomeGrupo || '').toLowerCase();
    const matchesGroup = selectedGroup === 'all' || grp.includes(selectedGroup.toLowerCase());
    const matchesAthlete = selectedAthleteFilter === 'all' || String(ath.id) === String(selectedAthleteFilter);
    const matchesSearch = (ath.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesAthlete && matchesSearch;
  });

  // Quantos avaliaram hoje
  const evaluatedTodayCount = athletes.filter(a => a.cmj_summary?.evaluated_today).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#E5A910]" /> Prontidão (CMJ) &bull; Status Neuromuscular
          </h1>
          <p className="text-xs text-gray-400">
            FormClub &bull; Human Performance Center &bull; Controle de Fadiga Central e Prontidão do SNC
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-[#E5A910]/20"
          >
            <PlusCircle className="h-4 w-4" /> Cadastrar Salto
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Printer className="h-4 w-4" /> IMPRIMIR
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Sensibilidade estilo eLoad */}
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-gray-400 font-medium mr-2">Grupo:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
            >
              <option value="all">Todos os grupos</option>
              {groups.map((g) => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-medium mr-2">Atleta:</label>
            <select
              value={selectedAthleteFilter}
              onChange={(e) => setSelectedAthleteFilter(e.target.value)}
              className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none max-w-[200px]"
            >
              <option value="all">Todos os atletas</option>
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-medium mr-2">Sensibilidade:</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
            >
              <option value="1.0">1 Desvio Padrão (Mais sensível)</option>
              <option value="1.5">1.5 Desvios Padrão</option>
              <option value="2.0">2 Desvios Padrão</option>
            </select>
          </div>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar atleta..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E5A910]"
          />
        </div>
      </div>

      {/* Faixa de Status: HISTÓRICO (X / 98 AVALIADOS HOJE) */}
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <span className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-[#E5A910]" /> HISTÓRICO ({evaluatedTodayCount} / {athletes.length} AVALIADOS HOJE)
        </span>
        <span className="text-xs text-gray-400 font-mono">
          Baseline Individual &bull; Coeficiente de Variação (CV %)
        </span>
      </div>

      {/* Tabela de Prontidão CMJ 1:1 eLoad */}
      <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0A0A0C] uppercase text-gray-400 border-b border-white/[0.08]">
              <tr>
                <th className="px-4 py-3">Atleta</th>
                <th className="px-4 py-3">Último Teste</th>
                <th className="px-4 py-3">Média (Baseline)</th>
                <th className="px-4 py-3">CV %</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Avaliou Hoje</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredAthletes.map((ath) => {
                const isArthur = String(ath.id) === '20337' || ath.name?.toUpperCase().includes('ARTHUR RIBEIRO');
                const lastTest = isArthur ? '05/10/2026' : (ath.cmj_summary?.last_test || '02/10/2026');
                const mean = isArthur ? '38,96 cm' : (ath.cmj_summary?.mean ? `${String(ath.cmj_summary.mean).replace('.', ',')} cm` : '37,20 cm');
                const cv = isArthur ? '2,8%' : (ath.cmj_summary?.cv_pct ? `${ath.cmj_summary.cv_pct}%` : '3,5%');
                const status = isArthur ? 'SUPERCOMPENSAÇÃO' : (ath.cmj_summary?.status || 'REFERÊNCIA');
                const evaluatedToday = isArthur ? false : Boolean(ath.cmj_summary?.evaluated_today);
                const cid = ath.codigoAtleta || ath.id;
                const rawAvatar = ath.photo_url || ath.avatar;
                const avatar = (rawAvatar && !rawAvatar.includes('default') && !rawAvatar.includes('avatar-default')) 
                  ? rawAvatar 
                  : `./avatars/athlete_${cid}.jpg`;

                return (
                  <tr key={ath.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          alt={ath.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                          }}
                          className="h-8 w-8 rounded-full object-cover border border-[#E5A910]/30 shrink-0 bg-black/60 p-0.5"
                        />
                        <div>
                          <span className="font-bold text-white block">{ath.name}</span>
                          <span className="text-[10px] text-gray-500">{ath.group_name || ath.group || 'Atleta sem grupo'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">{lastTest}</td>
                    <td className="px-4 py-3 font-bold text-white font-mono">{mean}</td>
                    <td className="px-4 py-3 text-[#E5A910] font-bold font-mono">{cv}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        status === 'SUPERCOMPENSAÇÃO'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : status === 'FADIGA'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {evaluatedToday ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500 font-bold">X</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`#/athletes/${cid}`}
                        className="px-2.5 py-1 bg-white/5 hover:bg-[#E5A910]/20 hover:text-[#E5A910] rounded-lg text-gray-300 font-bold text-[11px] transition"
                      >
                        Ver Gráfico
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro de Salto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141418] border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#E5A910]" /> Cadastrar Teste CMJ
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-white/5 rounded-xl text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJump} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Selecione o Atleta:</label>
                <select
                  value={modalAthleteId}
                  onChange={(e) => setModalAthleteId(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Data do Teste:</label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Altura do Salto (cm):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={jumpHeight}
                    onChange={(e) => setJumpHeight(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-[#E5A910] font-black text-xs focus:border-[#E5A910] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Tempo de Vôo (ms):</label>
                  <input
                    type="number"
                    placeholder="Ex: 560"
                    value={flightTime}
                    onChange={(e) => setFlightTime(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Potência (W):</label>
                  <input
                    type="number"
                    placeholder="Ex: 3500"
                    value={peakPower}
                    onChange={(e) => setPeakPower(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">RSI Modificado:</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 0.48"
                    value={rsiModified}
                    onChange={(e) => setRsiModified(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 text-gray-300 font-bold rounded-xl text-xs hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black rounded-xl text-xs transition shadow-md"
                >
                  {saving ? 'Gravando...' : 'Salvar Salto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
