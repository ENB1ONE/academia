import React, { useState } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Info, Printer, ChevronDown, ChevronUp } from 'lucide-react';

export function EloadChartRenderer({ 
  title, 
  chartJson, 
  height = 290, 
  onEmitReport, 
  scientificLegend,
  reportDateInput = false,
  customLegend = null
}) {
  const [showLegend, setShowLegend] = useState(false);
  const [reportDate, setReportDate] = useState('2026-10-14');

  if (!chartJson || !chartJson.data) {
    return (
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
        </div>
        <div className="h-44 flex items-center justify-center text-xs text-gray-500">
          Nenhum registro para o período selecionado.
        </div>
      </div>
    );
  }

  const { labels = [], datasets = [] } = chartJson.data;

  // Flatten nested labels if needed
  const formattedLabels = labels.map((l) => {
    if (Array.isArray(l)) {
      return l.join(' ');
    }
    return String(l || '');
  });

  // Transform labels and datasets into recharts data array
  const data = formattedLabels.map((lbl, index) => {
    const item = { label: lbl };
    datasets.forEach((ds) => {
      const val = ds.data ? ds.data[index] : null;
      item[ds.label || 'Valor'] = val !== null && val !== undefined ? Number(val) : 0;
    });
    return item;
  });

  // Color mapping matching eLoad specification
  const getColorForDataset = (dsLabel, index) => {
    const lbl = (dsLabel || '').toLowerCase();
    if (lbl.includes('planejad') && lbl.includes('carga')) return '#9BE0D6'; // Teal
    if (lbl.includes('realizad') && lbl.includes('carga')) return '#E5A910'; // Gold FormClub
    if (lbl === 'psr') return '#22C55E'; // Green
    if (lbl === 'pse') return '#E11D48'; // Red/Pink
    if (lbl.includes('pse planejado')) return '#0EA5E9'; // Cyan/Blue
    if (lbl.includes('dura')) return '#64748B'; // Slate
    if (lbl.includes('strain')) return '#F97316'; // Orange
    if (lbl.includes('monotonia')) return '#10B981'; // Emerald
    if (lbl.includes('ac semana') || lbl.includes('razão a:c')) return '#E11D48'; // Red
    if (lbl.includes('dor muscular')) return '#0F172A';
    if (lbl.includes('fadiga')) return '#9BE0D6';
    if (lbl.includes('humor')) return '#367588';
    if (lbl.includes('noite de sono')) return '#D9534F';
    if (lbl.includes('stress')) return '#B8860B';
    if (lbl.includes('qualidade')) return '#E5A910';
    if (lbl.includes('horas')) return '#3B82F6';
    if (lbl.includes('baseline')) return '#94A3B8';
    if (lbl.includes('superior')) return '#EF4444';
    if (lbl.includes('inferior')) return '#3B82F6';
    if (lbl.includes('média')) return '#E5A910';
    if (lbl.includes('panturrilha') || lbl.includes('dor')) return '#EF4444';
    if (lbl.includes('vfc') || lbl.includes('rmssd')) return '#8B5CF6';
    if (lbl.includes('massa')) return '#E5A910';
    if (lbl.includes('desidrata')) return '#06B6D4';
    if (lbl.includes('urina') || lbl.includes('tonalidade')) return '#F59E0B';

    const fallbackColors = ['#E5A910', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#F97316'];
    return fallbackColors[index % fallbackColors.length];
  };

  const isStackedWellness = title.toLowerCase().includes('bem-estar') || title.toLowerCase().includes('5 pilares');

  return (
    <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header com Título, Data opcional e Botão "Emitir Relatório" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-black text-white tracking-wide uppercase">{title}</h4>
          <span className="text-[10px] font-mono text-gray-400">{labels.length} registros no período</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {reportDateInput && (
            <input 
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="bg-[#0A0A0C] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-[#E5A910]"
            />
          )}
          {onEmitReport && (
            <button
              onClick={() => onEmitReport({ title, date: reportDate })}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-sm"
            >
              <Printer className="h-3 w-3" /> Emitir relatório
            </button>
          )}
        </div>
      </div>

      {/* Gráfico Recharts */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262E" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#6B7280" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0A0A0C', 
                borderColor: '#E5A910', 
                borderRadius: '0.75rem', 
                fontSize: '11px',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />

            {datasets.map((ds, idx) => {
              const dsLabel = ds.label || `Série ${idx + 1}`;
              const color = getColorForDataset(dsLabel, idx);
              const isBar = isStackedWellness || ds.type === 'bar' || dsLabel.toLowerCase().includes('carga') || dsLabel.toLowerCase().includes('dura') || dsLabel.toLowerCase().includes('strain');

              if (isBar) {
                return (
                  <Bar 
                    key={dsLabel} 
                    dataKey={dsLabel} 
                    stackId={isStackedWellness ? 'wellness' : undefined}
                    fill={color} 
                    radius={isStackedWellness ? [0, 0, 0, 0] : [4, 4, 0, 0]} 
                    maxBarSize={28}
                  />
                );
              }

              return (
                <Line 
                  key={dsLabel} 
                  type="monotone" 
                  dataKey={dsLabel} 
                  stroke={color} 
                  strokeWidth={2.2} 
                  dot={{ r: 2.5, fill: color }} 
                  activeDot={{ r: 5 }} 
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Rodapé com Botão "Legendas do Gráfico" */}
      {scientificLegend && (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
          >
            <Info className="h-3.5 w-3.5" /> Legendas do Gráfico
            {showLegend ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showLegend && (
            <div className="mt-2.5 p-3 bg-[#0A0A0C] border border-sky-500/20 rounded-xl text-[11px] text-gray-300 leading-relaxed space-y-1.5 animate-fadeIn">
              {scientificLegend}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EloadChartRenderer;
