import React from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area 
} from 'recharts';

export function EloadChartRenderer({ title, chartJson, height = 280 }) {
  if (!chartJson || !chartJson.data) {
    return (
      <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
        <div className="h-44 flex items-center justify-center text-xs text-gray-500">
          Nenhum registro para o período selecionado.
        </div>
      </div>
    );
  }

  const { labels = [], datasets = [] } = chartJson.data;

  // Transform labels and datasets into recharts data array
  const data = labels.map((label, index) => {
    const item = { label };
    datasets.forEach((ds) => {
      const val = ds.data ? ds.data[index] : null;
      item[ds.label || 'Valor'] = val !== null && val !== undefined ? Number(val) : 0;
    });
    return item;
  });

  // Assign harmonious Dark Luxury Gold colors
  const defaultColors = [
    '#E5A910', // FormClub Gold
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#10B981', // Green
    '#EF4444', // Red
    '#F97316', // Orange
    '#EC4899', // Pink
    '#06B6D4', // Cyan
  ];

  return (
    <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
        <span className="text-[11px] font-mono text-gray-400">{labels.length} registros</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262E" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#6B7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={10} 
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
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} 
            />
            {datasets.map((ds, idx) => {
              const color = defaultColors[idx % defaultColors.length];
              const dsLabel = ds.label || 'Valor';
              const isBar = ds.type === 'bar' || dsLabel.includes('Carga') || dsLabel.includes('Duração');

              if (isBar) {
                return (
                  <Bar 
                    key={dsLabel} 
                    dataKey={dsLabel} 
                    fill={color} 
                    radius={[4, 4, 0, 0]} 
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
                  strokeWidth={2.5} 
                  dot={{ r: 2, fill: color }} 
                  activeDot={{ r: 5 }} 
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EloadChartRenderer;
