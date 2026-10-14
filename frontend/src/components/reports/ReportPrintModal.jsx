import React, { useState } from 'react';
import { Printer, X, RotateCcw, ShieldCheck, Activity, Edit3 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex flex-col items-center p-0 sm:p-4">
      {/* Barra de Ações Superior Oculta na Impressão */}
      <div className="sticky top-0 z-50 w-full max-w-5xl bg-[#141418] border-b sm:border border-white/10 sm:rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 print:hidden shadow-2xl mb-4">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Printer className="h-4 w-4 text-[#E5A910]" /> Pré-visualização do Laudo Oficial (Padrão A4 Fundo Branco)
          </h2>
          <p className="text-[11px] text-gray-400">
            Layout econômico de tinta preta e branca. Preencha o parecer abaixo se desejar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar Seções
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

      {/* Folha do Relatório A4 Oficial (Fundo Branco #FFFFFF para Impressão e PDF) */}
      <div 
        id="report-print-container"
        className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-300 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none space-y-6"
      >
        {/* Cabeçalho Institucional com Logo Preto e Branco */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-4">
            <img 
              src="./formclub-logo-black.png" 
              alt="FORMCLUB" 
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">FORMCLUB</h1>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5">Human Performance Center</p>
              <p className="text-[11px] text-slate-500 font-medium">Prontuário Individual de Cargas e Monitoramento Fisiológico</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <p className="font-mono text-slate-800">Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></p>
            <p className="text-[11px] text-slate-500 font-medium">Relatório Oficial de Desempenho</p>
          </div>
        </div>

        {/* Ficha Resumo do Atleta (Grid Limpo Preto e Branco) */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Nome do Atleta</span>
            <span className="text-sm font-black text-slate-950">{athlete.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Grupo / Turma</span>
            <span className="text-sm font-bold text-slate-900">{athlete.group_name || athlete.group || 'Atleta sem grupo'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Idade / Gênero</span>
            <span className="text-sm font-bold text-slate-900">{age} anos &bull; {isFemale ? 'Feminino' : 'Masculino'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Razão A:C Atual</span>
            <span className="text-sm font-black text-slate-950">
              {athlete.acwr_value || athlete.acwr_current || '0,41'} ({athlete.current_acwr_status || athlete.acwr_zone_current || 'DESTREINO'})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Carga Aguda (7d)</span>
            <span className="text-sm font-mono font-bold text-slate-900">{athlete.acute_load || 300} UA</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Carga Crônica (28d)</span>
            <span className="text-sm font-mono font-bold text-slate-900">{athlete.chronic_load || 735} UA</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Situação Passada</span>
            <span className="text-sm font-bold text-slate-800">{athlete.past_acwr_status || athlete.acwr_zone_past || 'DESTREINO'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Status CMJ</span>
            <span className="text-sm font-bold text-slate-900">{athlete.cmj_summary?.status || 'SUPERCOMPENSAÇÃO'}</span>
          </div>
        </div>

        {/* Campo de Parecer Fisiológico / Observações Gerais no Local Natural do Laudo */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-slate-600 print:hidden" /> Parecer Fisiológico / Observações Gerais do Treinador:
            </label>
            <span className="text-[10px] text-slate-400 font-medium print:hidden">
              (Digite suas observações aqui. O texto sairá impresso no laudo)
            </span>
          </div>

          <textarea
            rows={3}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Ex: Atleta apresentou excelente adesão às sessões de força e regeneração. Monitorar carga crônica nas próximas semanas para evitar picos abruptos."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 print:hidden resize-none leading-relaxed"
          />

          {/* Versão que aparece somente na folha impressa */}
          <div className="hidden print:block text-xs text-slate-800 italic leading-relaxed min-h-[30px] pt-1">
            {generalNotes || 'Atleta monitorado de acordo com o protocolo institucional do FormClub. Nenhuma intercorrência relevante registrada no período avaliado.'}
          </div>
        </div>

        {/* Gráficos em Fundo Branco (Multi-Página Organizada com page-break) */}
        <div className="space-y-6">
          {/* Seção 1: Carga Diária */}
          {!removedSections.includes('carga_diaria') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('carga_diaria')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="CARGA DIÁRIA (PLANEJADA VS REALIZADA, PSR E PSE)" 
                chartJson={charts.DrawCargaDiariaChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Seção 2: Duração Total x PSE */}
          {!removedSections.includes('duracao_pse') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('duracao_pse')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="DURAÇÃO TOTAL (MINUTOS) X PSE" 
                chartJson={charts.DrawDuracaoPseChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Força Quebra de Página entre blocos maiores para não espremer */}
          <div className="print-page-break" />

          {/* Seção 3: Carga da Semana */}
          {!removedSections.includes('carga_semana') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('carga_semana')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="CARGA DA SEMANA (MONOTONIA, STRAIN E ACWR SEMANAL)" 
                chartJson={charts.DrawCargaSemanaChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Seção 4: Bem-Estar */}
          {!removedSections.includes('bem_estar') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('bem_estar')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="QUESTIONÁRIO DE BEM-ESTAR (5 PILARES EMPILHADOS)" 
                chartJson={charts.DrawBemEstarChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Seção 5: Status Neuromuscular CMJ */}
          {!removedSections.includes('cmj') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('cmj')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="STATUS NEUROMUSCULAR (SALTO CMJ VS BASELINE)" 
                chartJson={charts.DrawCmjChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Seção 6: Sono */}
          {!removedSections.includes('sono') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('sono')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="SONO (HORAS E QUALIDADE)" 
                chartJson={charts.DrawSonoChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}

          {/* Seção 7: Dores */}
          {!removedSections.includes('dores') && (
            <div className="relative print-avoid-break">
              <button
                onClick={() => toggleSection('dores')}
                className="absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold print:hidden z-10"
              >
                [X] Remover Seção
              </button>
              <EloadChartRenderer 
                title="DORES REGISTRADAS (HISTÓRICO CLÍNICO)" 
                chartJson={charts.DrawRegistroDorChart} 
                height={210}
                isPrintMode={true}
              />
            </div>
          )}
        </div>

        {/* Rodapé com Assinatura Formal */}
        <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end text-xs text-slate-600 print-avoid-break">
          <div>
            <p className="font-bold text-slate-900 uppercase">FORMCLUB - HUMAN PERFORMANCE CENTER</p>
            <p className="text-[11px] text-slate-500">Monitoramento Fisiológico &bull; Periodização Científica de Treinamento</p>
          </div>
          <div className="text-center border-t border-slate-800 pt-1.5 w-60">
            <p className="text-slate-950 font-bold text-xs">Fisiologista / Treinador Responsável</p>
            <p className="text-[10px] text-slate-500">CREF / Registro Profissional</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPrintModal;
