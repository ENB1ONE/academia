import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { week: 'Sem 1', aguda: 1200, cronica: 1100 },
  { week: 'Sem 2', aguda: 1350, cronica: 1150 },
  { week: 'Sem 3', aguda: 1800, cronica: 1250 },
  { week: 'Sem 4', aguda: 1400, cronica: 1300 },
  { week: 'Sem 5', aguda: 1100, cronica: 1350 },
  { week: 'Sem 6', aguda: 1600, cronica: 1400 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const aguda = payload[0].value;
    const cronica = payload[1].value;
    const ratio = (aguda / cronica).toFixed(2);
    
    return (
      <div className="bg-surface border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="text-text font-bold mb-2">{label}</p>
        <p className="text-blue-400 text-sm">Carga Aguda: {aguda} UA</p>
        <p className="text-green-400 text-sm">Carga Crônica: {cronica} UA</p>
        <p className={`text-sm mt-2 font-bold ${ratio > 1.5 ? 'text-danger' : ratio < 0.8 ? 'text-warning' : 'text-success'}`}>
          ACWR: {ratio}
        </p>
      </div>
    );
  }
  return null;
};

const LoadChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAguda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCronica" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis dataKey="week" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="aguda" name="Carga Aguda (7d)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAguda)" />
        <Area type="monotone" dataKey="cronica" name="Carga Crônica (28d)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCronica)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LoadChart;
