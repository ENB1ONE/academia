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

  // Impressão Isolada em iframe A4 Limpo com Dimensões e Estilos Congelados
  const handlePrintExactA4 = () => {
    const sheetEl = document.getElementById('a4-report-sheet');
    if (!sheetEl) {
      window.print();
      return;
    }

    // 1. Clonar o elemento da folha branca A4
    const clone = sheetEl.cloneNode(true);

    // 2. Congelar as dimensões exatas de todos os <svg> dos gráficos
    const origSvgs = sheetEl.querySelectorAll('svg');
    const clonedSvgs = clone.querySelectorAll('svg');

    origSvgs.forEach((origSvg, i) => {
      if (clonedSvgs[i]) {
        const rect = origSvg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          clonedSvgs[i].setAttribute('width', Math.round(rect.width));
          clonedSvgs[i].setAttribute('height', Math.round(rect.height));
          clonedSvgs[i].style.width = Math.round(rect.width) + 'px';
          clonedSvgs[i].style.height = Math.round(rect.height) + 'px';
        }
      }
    });

    // 3. Substituir textarea de anotações no clone por bloco formatado com o texto digitado
    const textareaInClone = clone.querySelector('textarea');
    if (textareaInClone) {
      const noteDiv = document.createElement('div');
      noteDiv.style.fontSize = '12px';
      noteDiv.style.color = '#1e293b';
      noteDiv.style.lineHeight = '1.5';
      noteDiv.style.whiteSpace = 'pre-wrap';
      noteDiv.style.padding = '10px 12px';
      noteDiv.style.border = '1px solid #cbd5e1';
      noteDiv.style.borderRadius = '8px';
      noteDiv.style.background = '#f8fafc';
      noteDiv.textContent = generalNotes.trim() || 'Atleta monitorado de acordo com o protocolo institucional do FormClub. Nenhuma intercorrência relevante registrada no período avaliado.';
      textareaInClone.parentNode.replaceChild(noteDiv, textareaInClone);
    }

    // 4. Remover elementos marcados com .no-print-in-pdf (botões [X], textos auxiliares, etc)
    const elementsToRemove = clone.querySelectorAll('.no-print-in-pdf');
    elementsToRemove.forEach(el => el.remove());

    // 5. Criar iframe isolado e limpo para impressão
    const existingIframe = document.getElementById('print-a4-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'print-a4-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const pri = iframe.contentWindow;
    pri.document.open();

    // Copiar estilos da página atual
    let stylesHtml = '';
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
      stylesHtml += node.outerHTML;
    });

    pri.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>FORMCLUB - Human Performance Center</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: Inter, system-ui, -apple-system, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              height: auto !important;
              overflow: visible !important;
            }
            #a4-report-sheet {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: #ffffff !important;
              overflow: visible !important;
            }
            .report-section-card {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 16px !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 10px !important;
              padding: 16px !important;
              background: #ffffff !important;
            }
            .report-footer-signature {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-top: 24px !important;
            }
            .no-print-in-pdf {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div id="print-wrapper">
            ${clone.outerHTML}
          </div>
        </body>
      </html>
    `);

    pri.document.close();

    // Aguardar renderização e carregamento de imagens/fontes
    setTimeout(() => {
      try {
        pri.focus();
        pri.print();
      } catch (err) {
        console.error('Erro na impressão isolada:', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 2000);
      }
    }, 400);
  };

  const charts = athlete.charts || {};
  const age = athlete.age || (athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--');
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
            onClick={handlePrintExactA4}
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
        id="a4-report-sheet"
        className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-300 space-y-6"
      >
        {/* Cabeçalho Institucional com Dimensões Estritas e Travadas */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '16px', 
            borderBottom: '2px solid #0f172a', 
            paddingBottom: '16px', 
            marginBottom: '20px', 
            width: '100%' 
          }}
        >
          {/* Bloco Esquerdo: Logo + Títulos */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              minWidth: 0, 
              flex: '1 1 auto' 
            }}
          >
            <img 
              src="./formclub-logo-black.png" 
              alt="FORMCLUB" 
              style={{ 
                width: '120px', 
                maxWidth: '120px', 
                height: '44px', 
                maxHeight: '44px', 
                objectFit: 'contain', 
                flexShrink: 0, 
                display: 'block' 
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#020617', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                FORMCLUB HUMAN PERFORMANCE CENTER
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prontuário Individual de Cargas e Monitoramento Fisiológico
              </p>
            </div>
          </div>

          {/* Bloco Direito: Emissão e Identificação */}
          <div 
            style={{ 
              textAlign: 'right', 
              flexShrink: 0, 
              whiteSpace: 'nowrap' 
            }}
          >
            <p style={{ margin: 0, fontSize: '11px', color: '#1e293b', fontFamily: 'monospace' }}>
              Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
              Relatório Oficial de Desempenho
            </p>
          </div>
        </div>

        {/* Ficha Resumo do Atleta (Grid Limpo Preto e Branco) */}
        <div className="report-section-card bg-slate-50 border border-slate-300 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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
        <div className="report-section-card bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-slate-600 no-print-in-pdf" /> Parecer Fisiológico / Observações Gerais do Treinador:
            </label>
            <span className="text-[10px] text-slate-400 font-medium no-print-in-pdf">
              (Digite suas observações aqui. O texto sairá impresso no laudo)
            </span>
          </div>

          <textarea
            rows={3}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Ex: Atleta apresentou excelente adesão às sessões de força e regeneração. Monitorar carga crônica nas próximas semanas para evitar picos abruptos."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 resize-none leading-relaxed"
          />
        </div>

        {/* Gráficos em Fundo Branco com Classes de Proteção de Quebra de Página */}
        <div className="space-y-4">
          {/* Seção 1: Carga Diária */}
          {!removedSections.includes('carga_diaria') && (
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('carga_diaria')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('duracao_pse')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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

          {/* Seção 3: Carga da Semana */}
          {!removedSections.includes('carga_semana') && (
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('carga_semana')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('bem_estar')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('cmj')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('sono')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
            <div className="report-section-card relative">
              <button
                onClick={() => toggleSection('dores')}
                className="no-print-in-pdf absolute top-2 right-2 text-[10px] text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold z-10 transition"
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
        <div className="report-footer-signature pt-8 border-t-2 border-slate-900 flex justify-between items-end text-xs text-slate-600">
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
