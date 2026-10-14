import React, { useState } from 'react';
import { Printer, X, RotateCcw, ShieldCheck, Activity } from 'lucide-react';
import Logo from '../ui/Logo';
import EloadChartRenderer from '../charts/EloadChartRenderer';

export function ReportPrintModal({ 
  athlete, 
  isOpen, 
  onClose,
  initialFocus = null 
}) {
  const [generalNotes, setGeneralNotes] = useState('');
  const [removedSections, setRemovedSections] = useState([]);

  if (!isOpen || !athlete) return null;

  const toggleSection = (sectionId) => {
    if (removedSections.includes(sectionId)) {
      setRemovedSections(removedSections.filter(id => id !== sectionId));
    } else {
      setRemovedSections([...removedSections, sectionId]);
    }
  };

  const handleReset = () => {
    setRemovedSections([]);
    setGeneralNotes('');
  };

  const handlePrint = () => {
    window.print();
  };

  const charts = athlete.charts || {};
  const age = athlete.age || (athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--');
  const cid = athlete.codigoAtleta || athlete.id;
  const isFemale = athlete.gender === 'F' || athlete.descricaoGenero === 'Feminino';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col items-center">
      {/* Barra de Controle Superior Oculta na Impressão */}
      <div className="sticky top-0 z-50 w-full bg-[#141418] border-b border-white/10 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden shadow-2xl">
        <div className="flex-1 max-w-xl">
          <label className="text-[11px] font-bold text-[#E5A910] uppercase tracking-wider block mb-1">
            Parecer Fisiológico / Observações Gerais do Treinador:
          </label>
          <input
            type="text"
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Ex: Atleta apresentou ótima adaptação à carga nesta semana. Monitorar fadiga na panturrilha."
            className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5A910]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar seções
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#E5A910] hover:bg-[#E5A910]/90 text-[#0A0A0C] font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-[#E5A910]/20"
          >
            <Printer className="h-4 w-4" /> Imprimir / Salvar em PDF
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Corpo do Relatório A4 FormClub */}
      <div 
        id="report-print-container"
        className="w-full max-w-4xl my-6 bg-[#0A0A0C] text-white p-8 rounded-3xl border border-white/10 print:border-none print:m-0 print:p-0 print:max-w-none shadow-2xl space-y-6"
      >
        {/* Cabeçalho Institucional FormClub */}
        <div className="flex items-center justify-between border-b-2 border-[#E5A910]/40 pb-5">
          <div className="flex items-center gap-4">
            <Logo className="h-16" />
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">FORMCLUB</h1>
              <p className="text-xs font-medium text-[#E5A910]">Human Performance Center &bull; Prontuário de Monitoramento</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400 space-y-0.5">
            <p className="font-mono">Emissão: <strong className="text-white">{new Date().toLocaleDateString('pt-BR')}</strong></p>
            <p>Relatório de Carga e Fisiologia Individual</p>
          </div>
        </div>

        {/* Ficha Resumo do Atleta */}
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 print:bg-transparent print:border-white/20">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Nome do Atleta</span>
            <span className="text-sm font-black text-white">{athlete.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Grupo / Turma</span>
            <span className="text-sm font-bold text-[#E5A910]">{athlete.group_name || athlete.group || 'Atleta sem grupo'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Idade / Gênero</span>
            <span className="text-sm font-medium text-white">{age} anos &bull; {isFemale ? 'Fem' : 'Masc'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Razão A:C Atual</span>
            <span className="text-sm font-black text-emerald-400">
              {athlete.acwr_value || athlete.acwr_current || '0,41'} ({athlete.current_acwr_status || athlete.acwr_zone_current || 'DESTREINO'})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Carga Aguda (7d)</span>
            <span className="text-sm font-mono font-bold text-sky-400">{athlete.acute_load || 300} UA</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Carga Crônica (28d)</span>
            <span className="text-sm font-mono font-bold text-white">{athlete.chronic_load || 735} UA</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Situação Passada</span>
            <span className="text-sm font-bold text-[#E5A910]">{athlete.past_acwr_status || athlete.acwr_zone_past || 'DESTREINO'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Status CMJ</span>
            <span className="text-sm font-bold text-purple-400">{athlete.cmj_summary?.status || 'SUPERCOMPENSAÇÃO'}</span>
          </div>
        </div>

        {/* Parecer do Treinador se preenchido */}
        {generalNotes && (
          <div className="p-4 bg-[#E5A910]/10 border border-[#E5A910]/30 rounded-2xl text-xs text-amber-200 leading-relaxed print:bg-transparent print:border-[#E5A910]">
            <strong className="block text-[#E5A910] font-black uppercase text-[11px] mb-1">Parecer Clínico / Observação Técnica:</strong>
            {generalNotes}
          </div>
        )}

        {/* Gráficos Selecionáveis para o PDF com botão [X] Remover Seção */}
        <div className="space-y-6">
          {!removedSections.includes('carga_diaria') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('carga_diaria')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Carga Diária (Planejada vs Realizada, PSR e PSE)" 
                chartJson={charts.DrawCargaDiariaChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('duracao_pse') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('duracao_pse')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Duração Total (Minutos) x PSE" 
                chartJson={charts.DrawDuracaoPseChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('carga_semana') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('carga_semana')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Carga da Semana (Monotonia, Strain e ACWR Semanal)" 
                chartJson={charts.DrawCargaSemanaChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('bem_estar') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('bem_estar')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Questionário de Bem-Estar (5 Pilares Empilhados)" 
                chartJson={charts.DrawBemEstarChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('cmj') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('cmj')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Status Neuromuscular (Salto CMJ vs Baseline)" 
                chartJson={charts.DrawCmjChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('sono') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('sono')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Sono (Horas e Qualidade)" 
                chartJson={charts.DrawSonoChart} 
                height={230}
              />
            </div>
          )}

          {!removedSections.includes('dores') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('dores')}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md font-bold print:hidden z-10"
              >
                [X] Remover do Relatório
              </button>
              <EloadChartRenderer 
                title="Dores Registradas" 
                chartJson={charts.DrawRegistroDorChart} 
                height={230}
              />
            </div>
          )}
        </div>

        {/* Rodapé de Assinatura */}
        <div className="pt-8 border-t border-white/10 flex justify-between items-end text-xs text-gray-500 print:pt-4">
          <div>
            <p className="font-bold text-gray-400">FORMCLUB - HUMAN PERFORMANCE CENTER</p>
            <p>Sistema Integrado de Monitoramento de Cargas e Prontidão Fisiológica</p>
          </div>
          <div className="text-right border-t border-gray-600 pt-1 w-56 text-center">
            <p className="text-gray-300 font-bold">Assinatura do Treinador / Fisiologista</p>
            <p className="text-[10px] text-gray-500">CREF / Registro Profissional</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPrintModal;
