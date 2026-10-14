import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, Printer, AlertTriangle, ArrowRight, RefreshCw, 
  Search, ShieldCheck, ChevronRight, BarChart2, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import EloadChartRenderer from '../../components/charts/EloadChartRenderer';
import api from '../../services/api';

export default function GroupMonitoringPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodDays, setPeriodDays] = useState(30);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('all');
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroupsAndAthletes = async () => {
      try {
        setIsLoading(true);
        const [grpRes, athRes] = await Promise.all([
          api.get('/api/v1/groups/'),
          api.get('/api/v1/athletes/')
        ]);

        const grpList = Array.isArray(grpRes?.data) ? grpRes.data : (grpRes?.data?.groups || []);
        const athList = Array.isArray(athRes?.data) ? athRes.data : (athRes?.data?.athletes || []);

        setGroups(grpList);
        setAthletes(athList);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar dados de grupos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupsAndAthletes();
  }, []);

  const filteredGroups = (groups || []).filter(g => 
    (g.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group Athletes
  const groupAthletes = selectedGroup 
    ? athletes.filter(a => {
        const aGrp = (a.group_name || a.group || a.nomeGrupo || '').toLowerCase();
        return aGrp.includes(selectedGroup.name.toLowerCase());
      })
    : [];

  // Atletas com Risco (ACWR fora de 0.8-1.3 ou prontidão < 70)
  const riskAthletes = groupAthletes.filter(a => {
    const acwr = Number(a.acwr_value || a.acwr_current || 1.0);
    const zone = (a.current_acwr_status || a.acwr_zone_current || '').toUpperCase();
    return acwr < 0.8 || acwr >= 1.3 || zone === 'DESTREINO' || zone.includes('RISCO');
  });

  // Mock de Gráficos Coletivos
  const sampleGroupCharts = {
    groupDailyLoad: {
      type: 'bar',
      data: {
        labels: ['15/09', '18/09', '21/09', '23/09', '25/09', '28/09', '30/09', '02/10', '05/10', '07/10', '09/10', '12/10'],
        datasets: [
          { label: 'Carga Planejada Média', data: [450, 420, 400, 480, 360, 420, 460, 440, 480, 420, 380, 400] },
          { label: 'Carga Realizada Média', data: [420, 380, 390, 460, 350, 390, 440, 410, 450, 380, 360, 390] },
          { label: 'PSR Médio', type: 'line', data: [7.2, 7.0, 6.8, 7.1, 7.4, 6.9, 7.5, 7.0, 7.3, 6.8, 7.1, 7.2] },
          { label: 'PSE Médio', type: 'line', data: [6.8, 6.5, 6.2, 7.4, 6.0, 6.7, 7.2, 6.6, 7.0, 6.5, 6.3, 6.7] }
        ]
      }
    },
    groupDurationPse: {
      type: 'bar',
      data: {
        labels: ['15/09', '18/09', '21/09', '23/09', '25/09', '28/09', '30/09', '02/10', '05/10', '07/10', '09/10', '12/10'],
        datasets: [
          { label: 'Duração Média (min)', data: [60, 60, 55, 65, 60, 58, 62, 60, 65, 60, 55, 60] },
          { label: 'PSE Médio', type: 'line', data: [6.8, 6.5, 6.2, 7.4, 6.0, 6.7, 7.2, 6.6, 7.0, 6.5, 6.3, 6.7] }
        ]
      }
    },
    groupWeeklyLoad: {
      type: 'bar',
      data: {
        labels: ['13/09 - 19/09', '20/09 - 26/09', '27/09 - 03/10', '04/10 - 10/10', '11/10 - 17/10'],
        datasets: [
          { label: 'Carga Semanal Turma', data: [1420, 1580, 1390, 1620, 1480] },
          { label: 'Strain Médio', data: [1700, 1980, 1520, 2100, 1780] },
          { label: 'Monotonia Média', type: 'line', data: [1.2, 1.3, 1.1, 1.4, 1.2] },
          { label: 'AC Semana Médio', type: 'line', data: [1.02, 1.14, 0.98, 1.18, 1.05] }
        ]
      }
    },
    groupWellness: {
      type: 'bar',
      data: {
        labels: ['15/09', '18/09', '21/09', '23/09', '25/09', '28/09', '30/09', '02/10', '05/10', '07/10', '09/10', '12/10'],
        datasets: [
          { label: 'Dor Muscular', data: [4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 4] },
          { label: 'Fadiga', data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
          { label: 'Humor', data: [4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4] },
          { label: 'Noite de Sono', data: [4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4] },
          { label: 'Stress', data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] }
        ]
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-[#E5A910]" /> Monitoramento de Grupo (Coletivo)
          </h1>
          <p className="text-xs text-gray-400">
            FormClub &bull; Human Performance Center &bull; Gestão Fisiológica por Turmas
          </p>
        </div>

        {selectedGroup && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setSelectedGroup(null)}
              className="px-3.5 py-2 bg-[#141418] border border-white/10 hover:border-[#E5A910]/60 rounded-xl text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#E5A910]" /> Trocar grupo
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#141418] border border-white/10 hover:border-[#E5A910]/60 rounded-xl text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Printer className="h-3.5 w-3.5 text-[#E5A910]" /> Imprimir relatórios
            </button>
            <button
              onClick={() => setIsRiskModalOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-[#0A0A0C] font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Relatório de Risco ({riskAthletes.length})
            </button>
          </div>
        )}
      </div>

      {/* PASSO 1: Seleção de Turma se nenhum grupo selecionado */}
      {!selectedGroup ? (
        <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Selecione uma Turma / Grupo</h2>
              <p className="text-xs text-gray-400">Escolha um dos 5 grupos para abrir o painel fisiológico coletivo</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar grupo..."
                className="w-full pl-10 pr-4 py-2 bg-[#0A0A0C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E5A910]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((grp) => {
              const count = athletes.filter(a => (a.group_name || a.group || '').toLowerCase().includes(grp.name.toLowerCase())).length;
              return (
                <div 
                  key={grp.id} 
                  className="p-5 bg-[#0A0A0C] border border-white/10 hover:border-[#E5A910]/60 rounded-2xl transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-black text-white">{grp.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{grp.description || 'Turma de Rendimento e Preparação Física'}</p>
                    <span className="inline-block mt-3 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-[#E5A910] font-mono">
                      {count > 0 ? count : (grp.athlete_count || 12)} atletas
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedGroup(grp)}
                    className="w-full mt-4 py-2 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    Prosseguir <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PASSO 2: Painel Coletivo do Grupo Selecionado */
        <div className="space-y-6">
          {/* Card Resumo do Grupo */}
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#E5A910] tracking-wider block">Turma Selecionada</span>
              <h2 className="text-2xl font-black text-white">{selectedGroup.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {groupAthletes.length} atletas vinculados &bull; {selectedGroup.description || 'Preparação de Alto Rendimento'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0A0A0C] border border-white/10 rounded-2xl text-center min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Média A:C</span>
                <span className="text-xl font-black text-emerald-400">1,08</span>
              </div>
              <div className="p-3 bg-[#0A0A0C] border border-white/10 rounded-2xl text-center min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Carga Aguda Média</span>
                <span className="text-xl font-black text-sky-400">1.480 UA</span>
              </div>
            </div>
          </div>

          {/* Filtros Funcionais */}
          <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <label className="text-gray-400 font-medium mr-2">Tipo de Treino:</label>
                <select
                  value={selectedWorkoutType}
                  onChange={(e) => setSelectedWorkoutType(e.target.value)}
                  className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                >
                  <option value="all">Todos os tipos de treino</option>
                  <option value="forca">FORÇA MMII / MMSS</option>
                  <option value="tecnico">TÉCNICO / TÁTICO</option>
                  <option value="competicao">JOGO / COMPETIÇÃO</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 font-medium mr-2">Período:</label>
                <select
                  value={periodDays}
                  onChange={(e) => setPeriodDays(Number(e.target.value))}
                  className="bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-[#E5A910] focus:outline-none"
                >
                  <option value={7}>Últimos 7 dias</option>
                  <option value={14}>Últimos 14 dias</option>
                  <option value={30}>Últimos 30 dias</option>
                  <option value={60}>Últimos 60 dias</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => toast.success(`Filtros coletivos aplicados (${periodDays} dias)!`)}
              className="px-4 py-2 bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/40 rounded-xl font-bold text-xs hover:bg-[#E5A910] hover:text-[#0A0A0C] transition"
            >
              Aplicar filtros
            </button>
          </div>

          {/* Os 4 Gráficos Coletivos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EloadChartRenderer
              title="Carga Diária Média da Turma"
              chartJson={sampleGroupCharts.groupDailyLoad}
              height={280}
              onEmitReport={handlePrint}
            />

            <EloadChartRenderer
              title="Duração Média (min) x PSE Médio"
              chartJson={sampleGroupCharts.groupDurationPse}
              height={280}
              onEmitReport={handlePrint}
            />

            <EloadChartRenderer
              title="Carga da Semana da Turma (Média e Strain)"
              chartJson={sampleGroupCharts.groupWeeklyLoad}
              height={280}
              onEmitReport={handlePrint}
            />

            <EloadChartRenderer
              title="Bem-Estar Diário da Turma (5 Pilares)"
              chartJson={sampleGroupCharts.groupWellness}
              height={280}
              onEmitReport={handlePrint}
            />
          </div>

          {/* Tabela de Atletas com Treinos Realizados */}
          <div className="bg-[#141418] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white">Detalhes - Atletas da Turma com Treinos Realizados</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0A0A0C] uppercase text-gray-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-3">Atleta</th>
                    <th className="px-4 py-3">Situação Passada</th>
                    <th className="px-4 py-3">Situação Atual</th>
                    <th className="px-4 py-3">Razão A:C</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {groupAthletes.slice(0, 15).map((ath) => {
                    const cid = ath.codigoAtleta || ath.id;
                    const avatar = ath.photo_url || ath.avatar || `./avatars/athlete_${cid}.jpg`;
                    return (
                      <tr key={ath.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatar}
                              alt={ath.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://blobprdeastus201.blob.core.windows.net/foto-atleta/avatar-default.svg';
                              }}
                              className="h-8 w-8 rounded-full object-cover border border-[#E5A910]/30 shrink-0 bg-black"
                            />
                            <span className="font-bold text-white">{ath.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{ath.past_acwr_status || 'DESTREINO'}</td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">{ath.current_acwr_status || 'ÓTIMO'}</td>
                        <td className="px-4 py-3 font-mono font-bold text-white">{ath.acwr_value || ath.acwr_current || '1,08'}</td>
                        <td className="px-4 py-3 text-right">
                          <a 
                            href={`#/athletes/${cid}`}
                            className="px-2.5 py-1 bg-white/5 hover:bg-[#E5A910]/20 hover:text-[#E5A910] rounded-lg text-gray-300 font-bold text-[11px] transition"
                          >
                            Ver Prontuário
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Relatório de Risco */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141418] border border-amber-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Relatório de Risco Fisiológico da Turma
                </h3>
                <p className="text-xs text-gray-400">Atletas com Razão A:C fora da zona ótima (&lt; 0.8 ou &gt;= 1.3)</p>
              </div>
              <button 
                onClick={() => setIsRiskModalOpen(false)}
                className="p-1.5 bg-white/5 rounded-xl text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {riskAthletes.length > 0 ? (
                riskAthletes.map((ath) => (
                  <div key={ath.id} className="p-3 bg-[#0A0A0C] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{ath.name}</span>
                      <p className="text-amber-400 text-[10px] uppercase font-bold">{ath.current_acwr_status || 'DESTREINO'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold font-mono">A:C {ath.acwr_value || ath.acwr_current || '0,41'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs">
                  Nenhum atleta em risco agudo detectado nesta turma.
                </div>
              )}
            </div>

            <button
              onClick={() => setIsRiskModalOpen(false)}
              className="w-full py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl"
            >
              Fechar Relatório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
